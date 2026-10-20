#!/usr/bin/env python3
"""Static file server + same-origin preview proxy for Static Pages editor.

The property page is served at its real path (/properties/...) so Next.js
routing and /_next asset requests work. Those paths are proxied to Vercel.
"""

from __future__ import annotations

import re
import subprocess
import sys
import tempfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
CACHE_DIR = ROOT / ".preview-cache"
REMOTE_ORIGIN = "https://spring-brook.vercel.app"
PREVIEW_PREFIX = "/__preview__"
def _parse_port() -> int:
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        return int(sys.argv[1])
    return 8765


PORT = _parse_port()
BROWSER_UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/131.0.0.0 Safari/537.36"
)


def cache_path_for(url_path: str) -> Path:
    safe = (url_path or "/").strip("/").replace("/", "_") or "index"
    return CACHE_DIR / f"{safe}.html"


def is_blocked_response(status: int, body: bytes) -> bool:
    if status in (401, 403, 429):
        return True
    head = body[:1600].decode("utf-8", errors="ignore")
    return "Vercel Security Checkpoint" in head


def read_html_cache(url_path: str) -> bytes | None:
    path = cache_path_for(url_path)
    if path.is_file() and path.stat().st_size > 2000:
        return path.read_bytes()
    return None


def write_html_cache(url_path: str, body: bytes) -> None:
    if is_blocked_response(200, body) or len(body) < 2000:
        return
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path_for(url_path).write_bytes(body)


def curl_fetch(
    url: str,
    *,
    method: str = "GET",
    headers: dict[str, str] | None = None,
    body: bytes | None = None,
) -> tuple[int, str, bytes]:
    """Fetch via curl — urllib is blocked by Vercel’s bot checkpoint."""
    hdrs = {"User-Agent": BROWSER_UA, "Accept": "*/*"}
    if headers:
        hdrs.update(headers)
    with tempfile.NamedTemporaryFile(prefix="sp-hdr-", delete=False) as handle:
        hdr_path = handle.name
    try:
        cmd = [
            "curl",
            "-sS",
            "-L",
            "--max-time",
            "30",
            "-X",
            method,
            "-D",
            hdr_path,
            "-o",
            "-",
        ]
        for key, value in hdrs.items():
            cmd.extend(["-H", f"{key}: {value}"])
        cmd.append(url)
        result = subprocess.run(
            cmd,
            input=body,
            capture_output=True,
            timeout=35,
            check=False,
        )
        if result.returncode != 0:
            err = (result.stderr or b"").decode("utf-8", errors="replace").strip()
            raise URLError(err or f"curl exit {result.returncode}")
        raw_headers = Path(hdr_path).read_bytes().decode("iso-8859-1", errors="replace")
        # Last response block after redirects
        blocks = [b for b in re.split(r"\r?\n\r?\n", raw_headers.strip()) if b.strip()]
        last = blocks[-1] if blocks else ""
        status = 200
        content_type = "application/octet-stream"
        for line in last.splitlines():
            if line.upper().startswith("HTTP/"):
                parts = line.split()
                if len(parts) >= 2 and parts[1].isdigit():
                    status = int(parts[1])
            elif line.lower().startswith("content-type:"):
                content_type = line.split(":", 1)[1].strip() or content_type
        return status, content_type, result.stdout
    finally:
        Path(hdr_path).unlink(missing_ok=True)

THEME_BRIDGE_PATH = ROOT / "preview" / "sp-theme-bridge.html"


def load_theme_snippet() -> str:
    """Read bridge HTML from disk on every inject so proxy restarts aren't required."""
    try:
        text = THEME_BRIDGE_PATH.read_text(encoding="utf-8")
    except OSError as exc:
        raise SystemExit(f"Missing theme bridge at {THEME_BRIDGE_PATH}: {exc}") from exc
    if "sp-preview-bridge" not in text or "markCtaButtons" not in text:
        raise SystemExit(
            f"Theme bridge at {THEME_BRIDGE_PATH} is incomplete (missing CTA bridge)."
        )
    return text




class StaticPagesHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

    def _path_only(self) -> str:
        return urlparse(self.path).path

    def _is_rsc_request(self) -> bool:
        accept = self.headers.get("Accept", "")
        return bool(self.headers.get("RSC")) or "text/x-component" in accept

    def do_GET(self) -> None:
        path = self._path_only()

        if path.startswith(PREVIEW_PREFIX):
            rel = path[len(PREVIEW_PREFIX) :] or "/"
            self.serve_preview_html(rel)
            return

        # Next.js runtime + image CDN paths (must stay same path as live site)
        if path.startswith("/_next/") or path.startswith("/images/"):
            self.proxy_to_remote(self.path)
            return

        # Property routes: HTML document or RSC flight
        if path.startswith("/properties/"):
            if self._is_rsc_request():
                self.proxy_to_remote(self.path)
            else:
                self.serve_preview_html(path)
            return

        # Prefetch/RSC for other app routes (nav links) — avoid local 404 noise
        if self._is_rsc_request() and not path.startswith("/assets/"):
            self.proxy_to_remote(self.path)
            return

        super().do_GET()

    def do_POST(self) -> None:
        path = self._path_only()
        if (
            path.startswith("/_next/")
            or path.startswith("/images/")
            or path.startswith("/properties/")
            or path.startswith(PREVIEW_PREFIX)
        ):
            self.proxy_to_remote(self.path)
            return
        self.send_error(405, "Method Not Allowed")

    def proxy_to_remote(self, request_path: str) -> None:
        """Proxy request_path (including query) to Vercel."""
        # Support legacy /__remote__/… alias
        if request_path.startswith("/__remote__/"):
            request_path = request_path[len("/__remote__") :]
        elif request_path.startswith(PREVIEW_PREFIX):
            request_path = request_path[len(PREVIEW_PREFIX) :] or "/"

        if not request_path.startswith("/"):
            request_path = "/" + request_path

        remote_url = REMOTE_ORIGIN + request_path
        length = int(self.headers.get("Content-Length", "0") or "0")
        body = self.rfile.read(length) if length > 0 else None

        headers = {
            "User-Agent": BROWSER_UA,
            "Accept": self.headers.get("Accept", "*/*"),
        }
        for key in (
            "Accept-Language",
            "Content-Type",
            "RSC",
            "Next-Router-State-Tree",
            "Next-Router-Prefetch",
            "Next-Url",
            "Next-Action",
            "x-deployment-id",
        ):
            value = self.headers.get(key)
            if value:
                headers[key] = value

        try:
            status, content_type, payload = curl_fetch(
                remote_url,
                method=self.command,
                headers=headers,
                body=body,
            )
            # Bot challenges block curl — send the browser straight to Vercel.
            if is_blocked_response(status, payload):
                self.send_response(302)
                self.send_header("Location", remote_url)
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                return
        except (URLError, TimeoutError, OSError) as exc:
            # Prefer remote redirect over a hard failure for static assets.
            if request_path.startswith("/_next/") or request_path.startswith("/images/"):
                self.send_response(302)
                self.send_header("Location", remote_url)
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                return
            message = f"Remote proxy failed for {remote_url}: {exc}".encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(message)))
            self.end_headers()
            self.wfile.write(message)
            return

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def serve_preview_html(self, rel_path: str) -> None:
        if not rel_path.startswith("/"):
            rel_path = "/" + rel_path
        # Drop query from rel for fetch URL path; keep as path only
        path_only = urlparse(rel_path).path or "/"
        remote_url = REMOTE_ORIGIN + path_only
        content_type = "text/html; charset=utf-8"
        body: bytes | None = None
        from_cache = False

        try:
            status, content_type, fetched = curl_fetch(
                remote_url,
                headers={
                    "User-Agent": BROWSER_UA,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "none",
                    "Upgrade-Insecure-Requests": "1",
                },
            )
            if status >= 400 or is_blocked_response(status, fetched):
                raise URLError(f"HTTP Error {status}")
            body = fetched
            write_html_cache(path_only, body)
        except (URLError, TimeoutError, OSError) as exc:
            cached = read_html_cache(path_only)
            if cached:
                body = cached
                content_type = "text/html; charset=utf-8"
                from_cache = True
                sys.stderr.write(
                    f"Preview cache hit for {path_only} (remote unavailable: {exc})\n"
                )
            else:
                message = f"Preview proxy failed for {remote_url}: {exc}".encode("utf-8")
                self.send_response(502)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(message)))
                self.end_headers()
                self.wfile.write(message)
                return

        assert body is not None

        if "text/html" not in content_type and not body.lstrip().startswith(
            (b"<!DOCTYPE", b"<html", b"<HTML")
        ):
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        html = build_static_preview_html(
            body.decode("utf-8", errors="replace"), for_static_host=False
        )
        payload = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)


def build_static_preview_html(raw_html: str, *, for_static_host: bool) -> str:
    """Inject theme bridge and rewrite asset URLs for local proxy or static host."""
    html = re.sub(r"<base\b[^>]*>", "", raw_html, flags=re.I)
    snippet = load_theme_snippet()
    if for_static_host:
        # Pages cannot proxy /_next — point assets + fetch at Vercel.
        # Normalize any already-absolute URLs, then rewrite every root-relative
        # /_next and /images occurrence (including srcset tails without a quote).
        html = html.replace(f"{REMOTE_ORIGIN}/_next/", "/_next/")
        html = html.replace(f"{REMOTE_ORIGIN}/images/", "/images/")
        html = html.replace("/_next/", f"{REMOTE_ORIGIN}/_next/")
        html = html.replace("/images/", f"{REMOTE_ORIGIN}/images/")
        # Drop Next.js client bundles so SSR markup stays visible when the file
        # is not served at the real /properties/... route (GitHub Pages / plain
        # static servers). Keep stylesheets + inject our theme bridge below.
        html = re.sub(
            r"<script\b[^>]*\bsrc=[\"'][^\"']*_next/[^\"']*[\"'][^>]*>\s*</script>",
            "",
            html,
            flags=re.I,
        )
        html = re.sub(
            r"<script\b[^>]*>[\s\S]*?</script>",
            "",
            html,
            flags=re.I,
        )
        snippet = snippet.replace(
            """  // Absolute Vercel URLs must stay same-origin so the local proxy handles them.
  function toLocal(url) {
    if (typeof url !== "string") return url;
    if (url.indexOf(remoteOrigin) === 0) {
      return url.slice(remoteOrigin.length) || "/";
    }
    return url;
  }

  var rawFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      if (typeof input === "string") {
        input = toLocal(input);
      } else if (input && typeof Request !== "undefined" && input instanceof Request) {
        var mapped = toLocal(input.url);
        if (mapped !== input.url) input = new Request(mapped, input);
      }
    } catch (err) {}
    return rawFetch(input, init);
  };""",
            """  // Static hosts (GitHub Pages): root-relative assets must hit Vercel.
  function toRemote(url) {
    if (typeof url !== "string") return url;
    if (url.indexOf("/") === 0 && url.indexOf("//") !== 0) {
      return remoteOrigin + url;
    }
    return url;
  }

  var rawFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      if (typeof input === "string") {
        input = toRemote(input);
      } else if (input && typeof Request !== "undefined" && input instanceof Request) {
        var mapped = toRemote(input.url);
        if (mapped !== input.url) input = new Request(mapped, input);
      }
    } catch (err) {}
    return rawFetch(input, init);
  };""",
        )
    else:
        html = html.replace(f'"{REMOTE_ORIGIN}/', '"/')
        html = html.replace(f"'{REMOTE_ORIGIN}/", "'/")

    if re.search(r"<head[^>]*>", html, flags=re.I):
        html = re.sub(
            r"(<head[^>]*>)",
            lambda m: m.group(1) + "\n" + snippet,
            html,
            count=1,
            flags=re.I,
        )
    else:
        html = snippet + html
    return html


def export_static_previews() -> None:
    """Write same-origin preview HTML under preview/ for GitHub Pages theming."""
    out_dir = ROOT / "preview"
    out_dir.mkdir(parents=True, exist_ok=True)
    mapping = {
        "/properties/meadow-view-lodge": out_dir / "meadow-view-lodge.html",
    }
    for url_path, dest in mapping.items():
        cached = read_html_cache(url_path)
        if not cached:
            raise SystemExit(
                f"No cache for {url_path}. Run the server once to populate .preview-cache/"
            )
        html = build_static_preview_html(
            cached.decode("utf-8", errors="replace"), for_static_host=True
        )
        dest.write_text(html, encoding="utf-8")
        print(f"Exported {dest.relative_to(ROOT)} ({dest.stat().st_size} bytes)")


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] in ("--export-static", "export-static"):
        export_static_previews()
        return

    server = ThreadingHTTPServer(("127.0.0.1", PORT), StaticPagesHandler)
    print(f"Static Pages server at http://127.0.0.1:{PORT}/static-pages.html")
    print(f"Property preview at http://127.0.0.1:{PORT}/properties/meadow-view-lodge")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()

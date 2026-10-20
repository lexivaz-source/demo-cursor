const live = document.querySelector("#live");
const pagePicker = document.querySelector("#page-picker");
const pageMenu = document.querySelector("#page-menu");
const pageName = document.querySelector("#page-name");
const iframe = document.querySelector("#live-page");
const viewport = document.querySelector("#viewport-frame");
const fallback = document.querySelector("#iframe-fallback");
const sectionsTrigger = document.querySelector("#sections-trigger");
const sectionsPanel = document.querySelector("#sections-panel");
const sectionsClose = document.querySelector("#sections-close");
const sectionsValue = document.querySelector("#sections-value");
const publishedStatus = document.querySelector("#published-status");
const tooltip = document.querySelector("#sp-tooltip");
const radiusBtn = document.querySelector("#btn-radius");
const locationBtn = document.querySelector("#btn-location");
const animationsBtn = document.querySelector("#btn-animations");
const radiusPanel = document.querySelector("#radius-panel");
const locationPanel = document.querySelector("#location-panel");
const animationsPanel = document.querySelector("#animations-panel");
const optionsTrigger = document.querySelector("#options-trigger");
const optionsPanel = document.querySelector("#options-panel");
const optionsClose = document.querySelector("#options-close");
const optionsDragHandle = document.querySelector("#options-drag-handle");
const OPTIONS_PANEL_WIDTH = 320;
const OPTIONS_PANEL_HEIGHT = 500;
const pageAnimationValue = document.querySelector("#page-animation-value");
const radiusAll = document.querySelector("#radius-all");
const radiusIndividualBtn = document.querySelector("#radius-individual");
const radiusIndividualPanel = document.querySelector("#radius-individual-panel");
const radiusCornerInputs = {
  tl: document.querySelector("#radius-tl"),
  tr: document.querySelector("#radius-tr"),
  bl: document.querySelector("#radius-bl"),
  br: document.querySelector("#radius-br"),
};
const toolButtons = [radiusBtn, locationBtn, animationsBtn];
const toolPanels = [radiusPanel, locationPanel, animationsPanel];

const LIVE_PATH = "/properties/meadow-view-lodge";
const LIVE_ORIGIN = "https://spring-brook.vercel.app";
const LIVE_REMOTE = `${LIVE_ORIGIN}/properties/meadow-view-lodge`;
const TOOLTIP_SELECTOR = ".sp-tool-btn[data-tooltip]";

/** Local static-pages-server.py proxies /properties/* same-origin; GitHub Pages cannot. */
function usesLocalPreviewProxy() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

const pageColors = {
  background: { name: "Cream", hex: "#f5f6f1" },
  accent1: { name: "Lake", hex: "#005a9c" },
  accent2: { name: "Sand", hex: "#f0f1e9" },
};

const pageFx = {
  radius: { tl: 20, tr: 20, bl: 20, br: 20 },
  radiusLinked: true,
  mapStyle: "map",
  animation: "fade",
  speed: "normal",
};

const SECTION_KEYS = [
  "header",
  "gallery",
  "highlights",
  "about",
  "bedrooms",
  "amenities",
  "availability",
  "reviews",
  "location",
  "policies",
  "faq",
];

const sectionVisibility = Object.fromEntries(SECTION_KEYS.map((key) => [key, true]));
const CHECKBOX_ON = "assets/static-pages/icon-checkbox-checked.svg";
const CHECKBOX_OFF = "assets/static-pages/icon-checkbox.svg";

function announce(message) {
  if (live) live.textContent = message;
}

function previewSrc(path, absoluteUrl) {
  const clean = path?.startsWith("/") ? path : `/${path || LIVE_PATH}`;
  // Local proxy: real path so Next.js /_next assets resolve on the same origin.
  if (usesLocalPreviewProxy()) return clean;
  // GitHub Pages / static hosts: absolute remote (root-relative paths 404 on *.github.io).
  if (absoluteUrl) return absoluteUrl;
  try {
    return new URL(clean, LIVE_ORIGIN).href;
  } catch {
    return LIVE_REMOTE;
  }
}

function isGithubPagesNotFoundDoc(doc) {
  if (!doc) return false;
  const title = doc.title || "";
  const text = doc.body?.innerText || "";
  return (
    /GitHub Pages/i.test(title) &&
    (/There isn't a GitHub Pages site here/i.test(text) || /\b404\b/.test(text))
  );
}

function showPreviewFallback(message) {
  if (!fallback) return;
  fallback.hidden = false;
  fallback.setAttribute("aria-hidden", "false");
  const copy = fallback.querySelector("p");
  if (copy && message) copy.textContent = message;
}

function hidePreviewFallback() {
  if (!fallback) return;
  fallback.hidden = true;
  fallback.setAttribute("aria-hidden", "true");
}

function luminance(hex) {
  const raw = String(hex || "").replace("#", "").trim();
  if (raw.length !== 3 && raw.length !== 6) return 1;
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const toLin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function closeFieldMenus(exceptMenu) {
  document.querySelectorAll(".sp-tool-panel .field-menu").forEach((menu) => {
    if (menu === exceptMenu) return;
    menu.hidden = true;
  });
  document.querySelectorAll(".sp-tool-panel .field-trigger").forEach((trigger) => {
    const menuId = trigger.getAttribute("aria-controls") || trigger.id.replace("-trigger", "-menu");
    const menu = document.querySelector(`#${menuId}`);
    if (menu && menu === exceptMenu) return;
    trigger.setAttribute("aria-expanded", "false");
  });
}

function closeColorMenus() {
  document.querySelectorAll(".sp-color-menu").forEach((menu) => {
    menu.hidden = true;
  });
  document.querySelectorAll(".sp-color-chip.color-trigger").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
  document.querySelectorAll(".sp-color-field").forEach((field) => {
    field.classList.remove("is-active");
  });
}

function closeOptionsPanel() {
  if (!optionsPanel) return;
  optionsPanel.hidden = true;
  optionsPanel.classList.remove("is-dragging");
  optionsTrigger?.setAttribute("aria-expanded", "false");
}

function clampOptionsPosition(left, top) {
  const maxLeft = Math.max(8, window.innerWidth - OPTIONS_PANEL_WIDTH - 8);
  const maxTop = Math.max(8, window.innerHeight - OPTIONS_PANEL_HEIGHT - 8);
  return {
    left: Math.min(Math.max(8, left), maxLeft),
    top: Math.min(Math.max(8, top), maxTop),
  };
}

function setOptionsPosition(left, top) {
  const next = clampOptionsPosition(left, top);
  optionsPanel.style.left = `${next.left}px`;
  optionsPanel.style.top = `${next.top}px`;
}

function positionOptionsBesideViewport() {
  const canvas = document.querySelector("#page-viewport");
  const frame = (viewport || canvas)?.getBoundingClientRect?.();
  if (!frame) {
    setOptionsPosition(window.innerWidth - OPTIONS_PANEL_WIDTH - 24, 120);
    return;
  }
  // Prefer just to the right of the page viewport; fall inside if needed.
  let left = frame.right + 12;
  if (left + OPTIONS_PANEL_WIDTH > window.innerWidth - 8) {
    left = frame.right - OPTIONS_PANEL_WIDTH - 16;
  }
  const top = frame.top + 8;
  setOptionsPosition(left, top);
}

function openOptionsPanel() {
  if (!optionsPanel) return;
  optionsPanel.hidden = false;
  optionsTrigger?.setAttribute("aria-expanded", "true");
  if (!optionsPanel.dataset.placed) {
    positionOptionsBesideViewport();
    optionsPanel.dataset.placed = "true";
  }
}

function closeSectionsPanel() {
  if (!sectionsPanel) return;
  sectionsPanel.hidden = true;
  sectionsTrigger?.setAttribute("aria-expanded", "false");
}

function closeToolPanels(exceptPanel) {
  toolPanels.forEach((panel) => {
    if (!panel || panel === exceptPanel) return;
    panel.hidden = true;
  });
  toolButtons.forEach((btn) => {
    if (!btn) return;
    const controls = btn.getAttribute("aria-controls");
    const open = exceptPanel && controls === exceptPanel.id && !exceptPanel.hidden;
    btn.setAttribute("aria-expanded", String(Boolean(open)));
  });
  closeFieldMenus();
}

function closeMenus() {
  pageMenu.hidden = true;
  pagePicker.setAttribute("aria-expanded", "false");
  closeColorMenus();
  closeToolPanels();
  closeSectionsPanel();
  hideTooltip();
}

function themePayload() {
  const dark = luminance(pageColors.background.hex) < 0.45;
  const { tl, tr, bl, br } = pageFx.radius;
  return {
    type: "sp-page-theme",
    background: pageColors.background.hex,
    accent1: pageColors.accent1.hex,
    accent2: pageColors.accent2.hex,
    text: dark ? "#ffffff" : "#171d3a",
    radius: { tl, tr, bl, br },
    sections: { ...sectionVisibility },
  };
}

function sectionOptionButtons() {
  return [...sectionsPanel.querySelectorAll(".sp-sections-option[data-section]")];
}

function selectAllButton() {
  return sectionsPanel.querySelector(".sp-sections-option[data-section-all]");
}

function syncSectionOption(button, on) {
  button.setAttribute("aria-selected", String(on));
  const icon = button.querySelector(".sp-sections-check");
  if (icon) icon.src = on ? CHECKBOX_ON : CHECKBOX_OFF;
}

function updateSectionsTriggerLabel() {
  const total = SECTION_KEYS.length;
  const visible = SECTION_KEYS.filter((key) => sectionVisibility[key]).length;
  if (visible === total) sectionsValue.textContent = " Show All";
  else if (visible === 0) sectionsValue.textContent = " None";
  else sectionsValue.textContent = ` ${visible} selected`;
}

function syncSectionsUi() {
  const allOn = SECTION_KEYS.every((key) => sectionVisibility[key]);
  const allBtn = selectAllButton();
  if (allBtn) syncSectionOption(allBtn, allOn);
  sectionOptionButtons().forEach((button) => {
    const key = button.dataset.section;
    syncSectionOption(button, Boolean(sectionVisibility[key]));
  });
  updateSectionsTriggerLabel();
}

function setSectionVisible(key, on) {
  if (!(key in sectionVisibility)) return;
  sectionVisibility[key] = Boolean(on);
  syncSectionsUi();
  pushThemeToPreview();
}

function setAllSectionsVisible(on) {
  SECTION_KEYS.forEach((key) => {
    sectionVisibility[key] = Boolean(on);
  });
  syncSectionsUi();
  pushThemeToPreview();
}

function pushThemeToPreview() {
  const payload = themePayload();
  try {
    iframe.contentWindow?.postMessage(payload, "*");
  } catch {
    /* cross-origin direct page — theme only on wrapper */
  }
}

function applyPageColors() {
  const dark = luminance(pageColors.background.hex) < 0.45;
  viewport.style.setProperty("--page-bg", pageColors.background.hex);
  viewport.style.setProperty("--page-accent-1", pageColors.accent1.hex);
  viewport.style.setProperty("--page-accent-2", pageColors.accent2.hex);
  viewport.style.setProperty("--page-text", dark ? "#ffffff" : "#171d3a");
  viewport.classList.toggle("is-dark-page", dark);
  iframe.style.backgroundColor = pageColors.background.hex;

  const accent2Field = document.querySelector('.sp-color-field[data-slot="accent2"]');
  if (accent2Field) {
    accent2Field.style.setProperty("--page-accent-2", pageColors.accent2.hex);
  }

  pushThemeToPreview();
}

function setSlotColor(slot, name, hex) {
  pageColors[slot] = { name, hex };
  const swatch = document.querySelector(`#swatch-${slot}`);
  if (swatch) swatch.style.background = hex;

  const menu = document.querySelector(`#color-menu-${slot}`);
  if (menu) {
    menu.querySelectorAll("button[data-hex]").forEach((option) => {
      option.setAttribute(
        "aria-selected",
        String(option.dataset.hex.toLowerCase() === hex.toLowerCase())
      );
    });
  }

  applyPageColors();
}

function clampRadius(value) {
  const n = Number.parseInt(String(value).replace(/[^\d]/g, ""), 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(99, n));
}

function applyRadiusFx() {
  const { tl, tr, bl, br } = pageFx.radius;
  viewport.style.setProperty("--page-radius-tl", `${tl}px`);
  viewport.style.setProperty("--page-radius-tr", `${tr}px`);
  viewport.style.setProperty("--page-radius-bl", `${bl}px`);
  viewport.style.setProperty("--page-radius-br", `${br}px`);
  pushThemeToPreview();
}

function setAllRadii(value) {
  const n = clampRadius(value);
  pageFx.radius = { tl: n, tr: n, bl: n, br: n };
  if (radiusAll) radiusAll.value = String(n);
  Object.values(radiusCornerInputs).forEach((input) => {
    if (input) input.value = String(n);
  });
  applyRadiusFx();
}

function replayAnimation() {
  if (!pageFx.animation || pageFx.animation === "none") {
    viewport.classList.remove("is-animating");
    viewport.removeAttribute("data-animation");
    return;
  }
  viewport.dataset.animation = pageFx.animation;
  viewport.style.setProperty("--page-anim-ms", pageFx.speed === "fast" ? "320ms" : "600ms");
  viewport.classList.remove("is-animating");
  // reflow to restart
  void viewport.offsetWidth;
  viewport.classList.add("is-animating");
  window.setTimeout(() => viewport.classList.remove("is-animating"), pageFx.speed === "fast" ? 360 : 700);
}

function bindFieldMenu(triggerId, menuId, onSelect) {
  const trigger = document.querySelector(`#${triggerId}`);
  const menu = document.querySelector(`#${menuId}`);
  if (!trigger || !menu) return;

  trigger.setAttribute("aria-controls", menuId);

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeFieldMenus(willOpen ? menu : null);
    menu.hidden = !willOpen;
    trigger.setAttribute("aria-expanded", String(willOpen));
  });

  menu.addEventListener("click", (event) => event.stopPropagation());

  menu.querySelectorAll("button[role='option']").forEach((option) => {
    option.addEventListener("click", () => {
      menu.querySelectorAll("button[role='option']").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      onSelect(option);
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    });
  });
}

function openToolPanel(btn, panel) {
  const willOpen = panel.hidden;
  closeMenus();
  hideTooltip();
  if (!willOpen) return;
  panel.hidden = false;
  btn.setAttribute("aria-expanded", "true");
}

pagePicker.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = pageMenu.hidden;
  closeMenus();
  pageMenu.hidden = !open;
  pagePicker.setAttribute("aria-expanded", String(open));
});

sectionsTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const willOpen = sectionsPanel.hidden;
  closeMenus();
  if (!willOpen) return;
  sectionsPanel.hidden = false;
  sectionsTrigger.setAttribute("aria-expanded", "true");
});

sectionsClose.addEventListener("click", (event) => {
  event.stopPropagation();
  closeSectionsPanel();
});

radiusBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  openToolPanel(radiusBtn, radiusPanel);
});

locationBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  openToolPanel(locationBtn, locationPanel);
});

animationsBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  openToolPanel(animationsBtn, animationsPanel);
});

optionsTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const willOpen = optionsPanel.hidden;
  closeMenus();
  if (!willOpen) {
    closeOptionsPanel();
    return;
  }
  openOptionsPanel();
});

optionsClose.addEventListener("click", (event) => {
  event.stopPropagation();
  closeOptionsPanel();
});

radiusPanel.addEventListener("click", (event) => event.stopPropagation());
locationPanel.addEventListener("click", (event) => event.stopPropagation());
animationsPanel.addEventListener("click", (event) => event.stopPropagation());
sectionsPanel.addEventListener("click", (event) => event.stopPropagation());
optionsPanel.addEventListener("click", (event) => event.stopPropagation());

document.addEventListener("click", (event) => {
  if (event.target.closest("#options-panel") || event.target.closest("#options-trigger")) {
    return;
  }
  closeMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenus();
  closeOptionsPanel();
});

let optionsDrag = null;

optionsDragHandle?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  if (event.target.closest(".sp-options-close")) return;
  event.preventDefault();
  const rect = optionsPanel.getBoundingClientRect();
  optionsDrag = {
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  };
  optionsPanel.classList.add("is-dragging");
  optionsDragHandle.setPointerCapture(event.pointerId);
});

optionsDragHandle?.addEventListener("pointermove", (event) => {
  if (!optionsDrag || optionsDrag.pointerId !== event.pointerId) return;
  setOptionsPosition(event.clientX - optionsDrag.offsetX, event.clientY - optionsDrag.offsetY);
});

function endOptionsDrag(event) {
  if (!optionsDrag || optionsDrag.pointerId !== event.pointerId) return;
  optionsDrag = null;
  optionsPanel.classList.remove("is-dragging");
  try {
    optionsDragHandle.releasePointerCapture(event.pointerId);
  } catch {
    /* already released */
  }
}

optionsDragHandle?.addEventListener("pointerup", endOptionsDrag);
optionsDragHandle?.addEventListener("pointercancel", endOptionsDrag);

window.addEventListener("resize", () => {
  if (optionsPanel?.hidden) return;
  const left = Number.parseFloat(optionsPanel.style.left) || 0;
  const top = Number.parseFloat(optionsPanel.style.top) || 0;
  setOptionsPosition(left, top);
});

pageMenu.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    pageMenu.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-selected", String(item === button));
    });
    pageName.textContent = button.dataset.page;
    const absoluteUrl = button.dataset.url || LIVE_REMOTE;
    let remotePath = LIVE_PATH;
    try {
      remotePath = button.dataset.url ? new URL(button.dataset.url).pathname || "/" : LIVE_PATH;
    } catch {
      remotePath = LIVE_PATH;
    }
    iframe.dataset.remotePath = remotePath;
    iframe.dataset.remoteUrl = absoluteUrl;
    hidePreviewFallback();
    iframe.src = previewSrc(remotePath, absoluteUrl);
    iframe.title = `${button.dataset.page} — live page`;
    if (fallbackLink) fallbackLink.href = absoluteUrl;
    announce(`Loaded ${button.dataset.page}`);
    closeMenus();
  });
});

sectionsPanel.addEventListener("click", (event) => {
  const button = event.target.closest(".sp-sections-option");
  if (!button) return;

  if (button.dataset.sectionAll) {
    const turnOn = button.getAttribute("aria-selected") !== "true";
    setAllSectionsVisible(turnOn);
    announce(turnOn ? "Showing all sections" : "Hiding all sections");
    return;
  }

  const key = button.dataset.section;
  if (!key) return;
  const next = button.getAttribute("aria-selected") !== "true";
  setSectionVisible(key, next);
  announce(`${next ? "Showing" : "Hiding"} ${button.textContent.trim()}`);
});

document.querySelectorAll(".sp-device-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sp-device-btn").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    viewport.dataset.device = button.dataset.device;
    announce(`${button.dataset.device} preview`);
  });
});

document.querySelectorAll(".sp-rail-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".sp-rail-btn").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    announce(`${button.getAttribute("aria-label")} selected`);
  });
});

document.querySelectorAll(".sp-color-field").forEach((field) => {
  const slot = field.dataset.slot;
  const trigger = field.querySelector(".color-trigger");
  const menu = field.querySelector(".color-menu");

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeMenus();
    if (willOpen) {
      field.classList.add("is-active");
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu.addEventListener("click", (event) => event.stopPropagation());

  menu.querySelectorAll("button[data-hex]").forEach((option) => {
    option.addEventListener("click", () => {
      setSlotColor(slot, option.dataset.color, option.dataset.hex);
      announce(
        `${field.querySelector(".sp-color-chip-label").textContent}: ${option.dataset.color}`
      );
      closeColorMenus();
    });
  });

  menu.querySelectorAll(".color-site-styles").forEach((button) => {
    button.addEventListener("click", () => {
      announce("Edit Site Styles would open site theme settings");
      closeColorMenus();
    });
  });
});

bindFieldMenu("page-animation-trigger", "page-animation-menu", (option) => {
  pageFx.animation = option.dataset.animation || "none";
  pageAnimationValue.textContent = option.textContent.trim();
  replayAnimation();
  announce(`Animation: ${pageAnimationValue.textContent}`);
});

if (radiusAll) {
  radiusAll.addEventListener("input", () => {
    pageFx.radiusLinked = true;
    setAllRadii(radiusAll.value);
  });
  radiusAll.addEventListener("change", () => {
    setAllRadii(radiusAll.value);
    announce(`Corner radius: ${pageFx.radius.tl}`);
  });
}

if (radiusIndividualBtn && radiusIndividualPanel) {
  radiusIndividualBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = radiusIndividualPanel.hidden;
    radiusIndividualPanel.hidden = !open;
    radiusIndividualBtn.setAttribute("aria-pressed", String(open));
    radiusIndividualBtn.setAttribute("aria-expanded", String(open));
    if (open) pageFx.radiusLinked = false;
  });
}

Object.entries(radiusCornerInputs).forEach(([key, input]) => {
  if (!input) return;
  input.addEventListener("input", () => {
    pageFx.radiusLinked = false;
    pageFx.radius[key] = clampRadius(input.value);
    applyRadiusFx();
  });
  input.addEventListener("change", () => {
    pageFx.radius[key] = clampRadius(input.value);
    input.value = String(pageFx.radius[key]);
    applyRadiusFx();
    announce(`Corner ${key.toUpperCase()}: ${pageFx.radius[key]}`);
  });
});

document.querySelectorAll("#location-panel button[data-map-style]").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll("#location-panel button[data-map-style]").forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });
    pageFx.mapStyle = option.dataset.mapStyle || "map";
    announce(`Location map style: ${option.querySelector("span")?.textContent.trim()}`);
  });
});

document.querySelectorAll("#page-speed button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#page-speed button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    pageFx.speed = button.dataset.speed || "normal";
    replayAnimation();
    announce(`Animation speed: ${pageFx.speed}`);
  });
});

document.querySelector("#btn-save").addEventListener("click", () => {
  announce("Draft saved");
  publishedStatus.innerHTML = "<strong>Draft saved</strong> just now";
});

document.querySelector("#btn-publish").addEventListener("click", () => {
  announce("Page published");
  publishedStatus.innerHTML = "<strong>Page Published:</strong> just now";
});

function hideTooltip() {
  if (!tooltip) return;
  tooltip.hidden = true;
  tooltip.textContent = "";
  document.querySelectorAll(`${TOOLTIP_SELECTOR}.is-tooltip-open`).forEach((btn) => {
    btn.classList.remove("is-tooltip-open");
  });
}

function showTooltip(anchor) {
  if (!tooltip || !anchor?.dataset.tooltip) return;
  if (anchor.getAttribute("aria-expanded") === "true") return;
  const text = anchor.dataset.tooltip;
  tooltip.textContent = text;
  tooltip.hidden = false;
  document.querySelectorAll(TOOLTIP_SELECTOR).forEach((btn) => {
    btn.classList.toggle("is-tooltip-open", btn === anchor);
  });

  const rect = anchor.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  left = Math.max(8, Math.min(left, window.innerWidth - tipRect.width - 8));
  let top = rect.bottom + 8;
  if (top + tipRect.height > window.innerHeight - 8) {
    top = rect.top - tipRect.height - 8;
  }
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

document.querySelectorAll(TOOLTIP_SELECTOR).forEach((button) => {
  button.addEventListener("mouseenter", () => showTooltip(button));
  button.addEventListener("focus", () => showTooltip(button));
  button.addEventListener("mouseleave", hideTooltip);
  button.addEventListener("blur", hideTooltip);
});

window.addEventListener("scroll", hideTooltip, true);
window.addEventListener("resize", hideTooltip);

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data?.type === "sp-preview-ready") {
    pushThemeToPreview();
  }
});

iframe.addEventListener("load", () => {
  try {
    const doc = iframe.contentDocument;
    if (isGithubPagesNotFoundDoc(doc)) {
      showPreviewFallback(
        "This preview path isn’t available on GitHub Pages. Open the live site, or run static-pages-server.py locally for an embedded preview."
      );
      return;
    }
  } catch {
    /* cross-origin remote preview — treat as loaded */
  }
  hidePreviewFallback();
  pushThemeToPreview();
  replayAnimation();
});

iframe.addEventListener("error", () => {
  showPreviewFallback(
    "The live page couldn’t load inside this frame (likely blocked by embed headers)."
  );
});

// Fallback link still points at the live remote site
const fallbackLink = fallback?.querySelector("a");
if (fallbackLink) fallbackLink.href = iframe.dataset.remoteUrl || LIVE_REMOTE;

// Resolve src for the current host (fixes GitHub Pages root-relative 404 in the canvas).
iframe.src = previewSrc(
  iframe.dataset.remotePath || LIVE_PATH,
  iframe.dataset.remoteUrl || LIVE_REMOTE
);

applyPageColors();
setAllRadii(pageFx.radius.tl);
syncSectionsUi();

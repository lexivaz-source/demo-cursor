const gridBlock = document.getElementById("grid-block");
const parentShell = document.getElementById("parent-shell");
const cellShell = document.getElementById("cell-shell");
const crumb = document.getElementById("crumb");
let mode = "content";
let selectedCell = 0;

const layout = { dir: "col", h: "start", v: "center" };

function closeMenus() {
  document.querySelectorAll(".field-menu, .color-menu").forEach((menu) => {
    menu.hidden = true;
  });
  document.querySelectorAll("[aria-expanded='true']").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
}

function bindMenu(triggerId, menuId, onPick) {
  const trigger = document.getElementById(triggerId);
  const menu = document.getElementById(menuId);
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeMenus();
    menu.hidden = !willOpen;
    trigger.setAttribute("aria-expanded", String(willOpen));
  });
  menu.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    menu.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });
    onPick(button);
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  });
}

function setSwitch(id, on) {
  const sw = document.getElementById(id);
  if (!sw) return;
  sw.classList.toggle("on", on);
  sw.setAttribute("aria-checked", String(on));
}

function show(id, on) {
  const el = document.getElementById(id);
  if (el) el.hidden = !on;
}

function applyLayout(rootId, next) {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.querySelectorAll("button").forEach((button) => {
    const key = button.dataset.dir ? "dir" : button.dataset.h ? "h" : button.dataset.v ? "v" : "";
    if (!key) return;
    button.classList.toggle("active", button.dataset[key] === next[key]);
  });
}

function applyCanvas() {
  const cols = Math.min(12, Math.max(1, Number(document.getElementById("cols").value) || 2));
  const gap = document.getElementById("gap").value || 15;
  const radius = document.getElementById("radius").value || 0;
  const pad = document.getElementById("cell-pad").value || 0;
  const borderOn = document.getElementById("sw-border").classList.contains("on");
  const shadowOn = document.getElementById("sw-shadow").classList.contains("on");
  const color = document.getElementById("text-swatch").style.background || "#1e2743";
  document.getElementById("amenity-grid").style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  document.getElementById("amenity-grid").style.gap = `${gap}px`;
  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.style.borderRadius = `${radius}px`;
    cell.style.background = document.getElementById("bg-value").dataset.bg || "#ffffff";
    cell.style.border = borderOn ? "1px solid #d1d3e2" : "none";
    cell.style.boxShadow = shadowOn ? "0 8px 20px rgba(30, 39, 67, 0.12)" : "none";
    cell.classList.toggle("selected", (mode === "cell" || mode === "cellDesign") && index === selectedCell);
    cell.style.setProperty("--cell-text", color);
  });
  document.querySelectorAll("[data-content]").forEach((el) => {
    el.style.padding = `${pad}px`;
    el.classList.toggle("dir-col", layout.dir === "col");
    el.classList.toggle("dir-row", layout.dir === "row");
    ["start", "center", "end"].forEach((value) => {
      el.classList.toggle(`h-${value}`, layout.h === value);
      el.classList.toggle(`v-${value}`, layout.v === value);
    });
  });
  const filtersOn = document.getElementById("sw-filters").classList.contains("on");
  const loadOn = document.getElementById("sw-load").classList.contains("on");
  const overlayOn = document.getElementById("sw-overlay").classList.contains("on");
  show("filters-bar", filtersOn);
  show("filter-fields", filtersOn);
  show("load-more", loadOn);
  show("load-fields", loadOn);
  show("overlay-fields", overlayOn);
  show("link-fields", document.getElementById("sw-link").classList.contains("on"));
  document.getElementById("load-more").textContent = document.getElementById("load-text").value || "Show more";
  document.querySelectorAll(".overlay").forEach((overlay) => {
    overlay.textContent = document.getElementById("overlay-text").value || "Learn more";
  });
  gridBlock.classList.toggle("show-overlay", overlayOn);
  const blockPad = document.getElementById("custom-padding-field").hidden
    ? document.querySelector("#padding-source .active")?.dataset.pad || 16
    : document.getElementById("custom-padding").value || 0;
  gridBlock.style.padding = `${blockPad}px`;
}

function setMode(next) {
  mode = next;
  document.querySelectorAll(".review-bar .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.mode === next);
  });
  const isCell = next === "cell" || next === "cellDesign";
  parentShell.hidden = isCell;
  cellShell.hidden = !isCell;
  show("qa-parent", !isCell);
  show("qa-cell", isCell);
  gridBlock.classList.toggle("cell-mode", isCell);
  if (!isCell) {
    const tab = next === "design" ? "design" : next === "block" ? "block" : "content";
    ["content", "design", "block"].forEach((name) => {
      const selected = name === tab;
      document.getElementById(`tab-${name}`).classList.toggle("active", selected);
      document.getElementById(`tab-${name}`).setAttribute("aria-selected", String(selected));
      document.getElementById(`panel-${name}`).hidden = !selected;
    });
    crumb.textContent = "Grid is selected. Open a cell from the list or the canvas.";
  } else {
    const design = next === "cellDesign";
    document.getElementById("tab-cell-content").classList.toggle("active", !design);
    document.getElementById("tab-cell-design").classList.toggle("active", design);
    document.getElementById("panel-cell-content").hidden = design;
    document.getElementById("panel-cell-design").hidden = !design;
    crumb.textContent = `Grid > Cell ${selectedCell + 1}`;
    document.querySelectorAll("[data-pick-cell]").forEach((row) => {
      row.classList.toggle("active", Number(row.dataset.pickCell) === selectedCell);
    });
  }
  applyLayout("dir-seg", layout);
  applyLayout("h-seg", layout);
  applyLayout("v-seg", layout);
  applyLayout("c-dir-seg", layout);
  applyLayout("c-h-seg", layout);
  applyLayout("c-v-seg", layout);
  applyCanvas();
}

function selectCell(index) {
  selectedCell = index;
  setMode(mode === "cellDesign" ? "cellDesign" : "cell");
}

document.querySelector(".review-bar").addEventListener("click", (event) => {
  const chip = event.target.closest("[data-mode]");
  if (chip) setMode(chip.dataset.mode);
});

document.getElementById("qa-edit").addEventListener("click", () => setMode("content"));
document.getElementById("cell-back").addEventListener("click", () => setMode("content"));

document.getElementById("amenity-grid").addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (cell) selectCell(Number(cell.dataset.cell));
});

document.getElementById("cell-list").addEventListener("click", (event) => {
  const row = event.target.closest("[data-pick-cell]");
  if (row) selectCell(Number(row.dataset.pickCell));
});

["content", "design", "block"].forEach((name) => {
  document.getElementById(`tab-${name}`).addEventListener("click", () => setMode(name));
});
document.getElementById("tab-cell-content").addEventListener("click", () => setMode("cell"));
document.getElementById("tab-cell-design").addEventListener("click", () => setMode("cellDesign"));

document.querySelectorAll(".switch").forEach((sw) => {
  sw.addEventListener("click", () => {
    const on = !sw.classList.contains("on");
    sw.classList.toggle("on", on);
    sw.setAttribute("aria-checked", String(on));
    applyCanvas();
  });
});

document.querySelectorAll(".segmented").forEach((group) => {
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.classList.contains("tune")) return;
    const key = button.dataset.dir ? "dir" : button.dataset.h ? "h" : button.dataset.v ? "v" : button.dataset.pad != null ? "pad" : "";
    if (key === "pad") {
      group.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      document.getElementById("custom-padding-field").hidden = true;
      document.getElementById("padding-tune").classList.remove("active");
      applyCanvas();
      return;
    }
    if (!key) return;
    layout[key] = button.dataset[key];
    applyLayout("dir-seg", layout);
    applyLayout("h-seg", layout);
    applyLayout("v-seg", layout);
    applyLayout("c-dir-seg", layout);
    applyLayout("c-h-seg", layout);
    applyLayout("c-v-seg", layout);
    applyCanvas();
  });
});

document.getElementById("padding-tune").addEventListener("click", () => {
  const field = document.getElementById("custom-padding-field");
  field.hidden = !field.hidden;
  document.getElementById("padding-tune").classList.toggle("active", !field.hidden);
  applyCanvas();
});

["cols", "gap", "radius", "cell-pad", "load-text", "overlay-text", "custom-padding"].forEach((id) => {
  document.getElementById(id).addEventListener("input", applyCanvas);
});

bindMenu("text-color-trigger", "text-color-menu", (button) => {
  document.getElementById("text-color-value").textContent = button.dataset.label;
  document.getElementById("text-swatch").style.background = button.dataset.color;
  applyCanvas();
});

bindMenu("bg-trigger", "bg-menu", (button) => {
  const value = document.getElementById("bg-value");
  value.textContent = button.textContent.trim();
  value.dataset.bg = button.dataset.bg;
  applyCanvas();
});

bindMenu("module-trigger", "module-menu", (button) => {
  document.getElementById("module-value").textContent = button.textContent.trim();
});

bindMenu("animation-trigger", "animation-menu", (button) => {
  document.getElementById("animation-value").textContent = button.textContent.trim();
  if (button.dataset.animation) gridBlock.dataset.animation = button.dataset.animation;
  else delete gridBlock.dataset.animation;
});

bindMenu("linkto-trigger", "linkto-menu", (button) => {
  document.getElementById("linkto-value").textContent = button.textContent.trim();
});

document.addEventListener("click", closeMenus);

document.getElementById("bg-value").dataset.bg = "#ffffff";
setMode("content");

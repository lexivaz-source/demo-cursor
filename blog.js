const listBlock = document.querySelector("#list-block");
const postBlock = document.querySelector("#post-block");
const panelTitle = document.querySelector("#panel-title");
const canvasKicker = document.querySelector("#canvas-kicker");
const canvasHint = document.querySelector("#canvas-hint");
const filtersBar = document.querySelector("#filters-bar");
const viewAllFields = document.querySelector("#view-all-fields");
const backFields = document.querySelector("#back-fields");
const customPaddingField = document.querySelector("#custom-padding-field");
const customPadding = document.querySelector("#custom-padding");
const animationValue = document.querySelector("#animation-value");

const state = {
  block: "list",
  tab: "content",
  filters: true,
  viewAll: false,
  backLink: false,
  padding: 16,
  gap: 24,
  animation: "",
};

function closeMenus() {
  document.querySelectorAll(".field-menu, .color-menu").forEach((menu) => {
    menu.hidden = true;
  });
  document.querySelectorAll(".field-trigger, .color-trigger").forEach((trigger) => {
    trigger.setAttribute("aria-expanded", "false");
  });
}

function openMenu(trigger, menu) {
  const wasOpen = !menu.hidden;
  closeMenus();
  if (wasOpen) return;
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
}

function bindMenu(triggerId, menuId, onPick) {
  const trigger = document.querySelector(`#${triggerId}`);
  const menu = document.querySelector(`#${menuId}`);
  if (!trigger || !menu) return;

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    openMenu(trigger, menu);
  });

  menu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      const valueEl = trigger.querySelector("span:first-child");
      if (valueEl && !valueEl.classList.contains("swatch")) {
        valueEl.textContent = option.dataset.label || option.textContent.trim();
      }
      const swatch = trigger.querySelector(".swatch");
      const name = trigger.querySelector(".color-name");
      if (swatch && option.dataset.color) swatch.style.background = option.dataset.color;
      if (name && option.dataset.label) name.textContent = option.dataset.label;
      closeMenus();
      if (onPick) onPick(option);
    });
  });
}

function bindSwitch(el, onToggle) {
  if (!el) return;
  el.addEventListener("click", () => {
    const next = el.getAttribute("aria-checked") !== "true";
    el.classList.toggle("on", next);
    el.setAttribute("aria-checked", String(next));
    if (onToggle) onToggle(next);
  });
}

function panelIdFor(tab) {
  if (tab === "block") return "panel-block";
  if (state.block === "post") {
    return tab === "design" ? "panel-post-design" : "panel-post-content";
  }
  return tab === "design" ? "panel-list-design" : "panel-list-content";
}

function setTab(tab) {
  closeMenus();
  state.tab = tab;
  document.querySelectorAll(".tab[role='tab']").forEach((button) => {
    const selected = button.id === `tab-${tab}`;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  const activeId = panelIdFor(tab);
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== activeId;
  });
  const panels = document.querySelector(".tab-panels");
  if (panels) panels.scrollTop = 0;
}

function setMode(mode) {
  closeMenus();
  document.querySelectorAll(".chip[data-mode]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.mode === mode);
  });

  const isPost = mode.startsWith("post");
  state.block = isPost ? "post" : "list";

  listBlock.hidden = isPost;
  postBlock.hidden = !isPost;
  panelTitle.textContent = isPost ? "Blog Post" : "Blog List";
  canvasKicker.textContent = isPost ? "Section canvas · Blog Post" : "Section canvas · Blog List";
  canvasHint.textContent = isPost
    ? "Post is a template on a slug screen. Pick a preview post on the canvas — copy is not edited here."
    : "List cards are live Blog documents, not child blocks. Posts are written in Dashboard Blog content — these inspectors only display and style them.";

  if (mode === "block") {
    setTab("block");
    return;
  }
  if (mode.endsWith("design")) {
    setTab("design");
    return;
  }
  setTab("content");
}

function applyPadding(value) {
  state.padding = Number(value);
  listBlock.style.padding = `${state.padding}px`;
  postBlock.style.padding = `${state.padding}px`;
}

function applyAnimation(name) {
  state.animation = name || "";
  [listBlock, postBlock].forEach((block) => {
    block.dataset.animation = state.animation;
    if (!state.animation) return;
    block.style.animation = "none";
    void block.offsetWidth;
    block.style.animation = "";
  });
}

bindMenu("layout-trigger", "layout-menu");
bindMenu("filter-display-trigger", "filter-display-menu");

function applyGridLayout() {
  const cols = Math.min(12, Math.max(1, Number(document.getElementById("cols").value) || 2));
  const gap = state.gap;
  const grid = document.querySelector("#blog-grid");
  grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  grid.style.gap = `${gap}px`;
}

document.getElementById("cols").addEventListener("input", applyGridLayout);

document.querySelector(".cols-stepper").addEventListener("click", (event) => {
  const input = document.getElementById("cols");
  const rect = event.currentTarget.getBoundingClientRect();
  const mid = rect.top + rect.height / 2;
  const next = Number(input.value) + (event.clientY < mid ? 1 : -1);
  input.value = Math.min(12, Math.max(1, next));
  applyGridLayout();
});

const customGapField = document.querySelector("#custom-gap-field");
const customGap = document.querySelector("#custom-gap");

document.querySelector("#gap-source").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const group = document.querySelector("#gap-source");
  group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  if (button.classList.contains("tune")) {
    customGapField.hidden = false;
    state.gap = Number(customGap.value) || 0;
  } else {
    customGapField.hidden = true;
    state.gap = Number(button.dataset.gap) || 15;
  }
  applyGridLayout();
});

customGap.addEventListener("input", () => {
  state.gap = Number(customGap.value) || 0;
  applyGridLayout();
});

applyGridLayout();
bindMenu("post-screen-trigger", "post-screen-menu");
bindMenu("template-trigger", "template-menu");
bindMenu("details-trigger", "details-menu");
bindMenu("list-title-style-trigger", "list-title-style-menu");
bindMenu("list-date-style-trigger", "list-date-style-menu");
bindMenu("btn-styles-trigger", "btn-styles-menu");
bindMenu("list-bg-trigger", "list-bg-menu");
bindMenu("post-title-style-trigger", "post-title-style-menu");
bindMenu("align-trigger", "align-menu");
bindMenu("list-title-color-trigger", "list-title-color-menu");
bindMenu("list-date-color-trigger", "list-date-color-menu");
bindMenu("filter-color-trigger", "filter-color-menu");
bindMenu("overlay-color-trigger", "overlay-color-menu");
bindMenu("post-title-color-trigger", "post-title-color-menu");
bindMenu("body-color-trigger", "body-color-menu");
bindMenu("animation-trigger", "animation-menu", (option) => {
  animationValue.textContent = option.textContent.trim();
  applyAnimation(option.dataset.animation || "");
});

bindSwitch(document.querySelector("#sw-filters"), (on) => {
  state.filters = on;
  filtersBar.hidden = !on;
});
bindSwitch(document.querySelector("#sw-filter-url"));
bindSwitch(document.querySelector("#sw-load-more"));
bindSwitch(document.querySelector("#sw-view-all"), (on) => {
  state.viewAll = on;
  viewAllFields.hidden = !on;
});
bindSwitch(document.querySelector("#sw-hero"));
bindSwitch(document.querySelector("#sw-back"), (on) => {
  state.backLink = on;
  backFields.hidden = !on;
});

document.querySelectorAll(".switch[role='switch']").forEach((el) => {
  if (el.dataset.bound) return;
  if (el.id && ["sw-filters", "sw-filter-url", "sw-load-more", "sw-view-all", "sw-hero", "sw-back"].includes(el.id)) {
    return;
  }
  bindSwitch(el);
});

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.id.replace("tab-", "");
    setTab(name);
    document.querySelectorAll(".chip[data-mode]").forEach((chip) => {
      const mode =
        name === "block"
          ? "block"
          : `${state.block}-${name === "design" ? "design" : "content"}`;
      chip.classList.toggle("active", chip.dataset.mode === mode);
    });
  });
});

document.querySelectorAll(".chip[data-mode]").forEach((chip) => {
  chip.addEventListener("click", () => setMode(chip.dataset.mode));
});

document.querySelector("#padding-source").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const group = document.querySelector("#padding-source");
  group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  if (button.classList.contains("tune")) {
    customPaddingField.hidden = false;
    applyPadding(customPadding.value);
    return;
  }
  customPaddingField.hidden = true;
  applyPadding(button.dataset.pad);
});

customPadding.addEventListener("input", () => applyPadding(customPadding.value));

document.addEventListener("click", () => closeMenus());
document.querySelectorAll(".field-menu, .color-menu").forEach((menu) => {
  menu.addEventListener("click", (event) => event.stopPropagation());
});

["#qa-edit", "#qa-edit-post"].forEach((sel) => {
  const btn = document.querySelector(sel);
  if (btn) btn.addEventListener("click", () => setTab(state.tab === "block" ? "content" : state.tab));
});

applyPadding(16);
setMode("list-content");

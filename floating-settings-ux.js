const live = document.querySelector("#live");

function announce(message) {
  if (live) live.textContent = message;
}

const previewChips = document.querySelectorAll("[data-preview]");
const contentScroll = document.querySelector("#content-scroll");
const blockList = document.querySelector("#block-list");
const contentMain = document.querySelector("#content-main");
const nestedLayer = document.querySelector("#nested-layer");
const openNested = document.querySelector("#open-nested-layer");
const nestedBack = document.querySelector("#nested-back");
const blockEditLayer = document.querySelector("#block-edit-layer");
const blockEditBack = document.querySelector("#block-edit-back");
const blockEditTitle = document.querySelector("#block-edit-title");
const blockMoreMenu = document.querySelector("#block-more-menu");

let blocks = [];
let editingIndex = null;
let moreMenuIndex = null;
let moreTriggerEl = null;

function setPreview(name) {
  document.body.dataset.preview = name === "default" ? "" : name;
  if (name === "default") delete document.body.dataset.preview;
  previewChips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.preview === name);
  });

  const labels = {
    default: "Default tab states",
    "tab-hover": "Design tab hover preview",
    "device-hover": "Device icon hover preview",
    "device-focus": "Device icon focus preview",
  };
  announce(labels[name] || "Preview updated");
}

previewChips.forEach((chip) => {
  chip.addEventListener("click", () => setPreview(chip.dataset.preview));
});

const tooltip = document.querySelector("#ux-tooltip");
const TOOLTIP_SELECTOR = "[data-tooltip]";

function hideTooltip() {
  if (!tooltip) return;
  tooltip.hidden = true;
  tooltip.textContent = "";
  document.querySelectorAll(`${TOOLTIP_SELECTOR}.is-tooltip-open`).forEach((el) => {
    el.classList.remove("is-tooltip-open");
  });
}

function showTooltip(anchor) {
  if (!tooltip || !anchor?.dataset.tooltip) return;

  tooltip.textContent = anchor.dataset.tooltip;
  tooltip.hidden = false;
  document.querySelectorAll(TOOLTIP_SELECTOR).forEach((el) => {
    el.classList.toggle("is-tooltip-open", el === anchor);
  });

  const anchorRect = anchor.getBoundingClientRect();
  const tipRect = tooltip.getBoundingClientRect();
  const gap = 6;
  let left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
  left = Math.min(window.innerWidth - tipRect.width - 8, Math.max(8, left));

  let top = anchorRect.bottom + gap;
  if (top + tipRect.height > window.innerHeight - 8) {
    top = Math.max(8, anchorRect.top - tipRect.height - gap);
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

document.querySelectorAll(TOOLTIP_SELECTOR).forEach((el) => {
  el.addEventListener("mouseenter", () => showTooltip(el));
  el.addEventListener("focus", () => showTooltip(el));
  el.addEventListener("mouseleave", hideTooltip);
  el.addEventListener("blur", hideTooltip);
});

function showPanelTab(panelRoot, tabName) {
  const tabs = panelRoot.querySelectorAll(".tab[role='tab']");
  const panels = panelRoot.querySelectorAll(".tab-panel");

  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === tabName;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });

  panels.forEach((panel) => {
    const match = panel.id.endsWith(`-panel-${tabName}`);
    panel.hidden = !match;
  });

  announce(`${tabName.charAt(0).toUpperCase()}${tabName.slice(1)} tab`);
}

document.querySelectorAll("[data-panel]").forEach((panelRoot) => {
  panelRoot.querySelectorAll(".tab[role='tab']").forEach((tab) => {
    tab.addEventListener("click", () => {
      showPanelTab(panelRoot, tab.dataset.tab);
    });
  });
});

function openNestedLayer() {
  if (!contentMain || !nestedLayer) return;
  closeBlockMoreMenu();
  closeBlockEditLayer({ restoreFocus: false });
  contentMain.hidden = true;
  nestedLayer.hidden = false;
  nestedBack?.focus();
  announce("Opened Nested Layer");
}

function closeNestedLayer() {
  if (!contentMain || !nestedLayer) return;
  nestedLayer.hidden = true;
  contentMain.hidden = false;
  openNested?.focus();
  announce("Returned to Block Label");
}

openNested?.addEventListener("click", openNestedLayer);
nestedBack?.addEventListener("click", closeNestedLayer);

function showEditTab(tabName) {
  if (!blockEditLayer) return;
  blockEditLayer.querySelectorAll(".tab[role='tab']").forEach((tab) => {
    const selected = tab.dataset.editTab === tabName;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  blockEditLayer.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = !panel.id.endsWith(`-panel-${tabName}`);
  });
}

blockEditLayer?.querySelectorAll(".tab[data-edit-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    showEditTab(tab.dataset.editTab);
    announce(`${tab.dataset.editTab.charAt(0).toUpperCase()}${tab.dataset.editTab.slice(1)} tab`);
  });
});

function closeBlockMoreMenu() {
  if (!blockMoreMenu) return;
  blockMoreMenu.hidden = true;
  moreTriggerEl?.setAttribute("aria-expanded", "false");
  moreMenuIndex = null;
  moreTriggerEl = null;
}

function openBlockMoreMenu(index, trigger) {
  if (!blockMoreMenu) return;
  const wasSame = moreMenuIndex === index && !blockMoreMenu.hidden;
  closeBlockMoreMenu();
  if (wasSame) return;

  moreMenuIndex = index;
  moreTriggerEl = trigger;
  const block = blocks[index];
  const hideItem = blockMoreMenu.querySelector('[data-action="hide"]');
  if (hideItem) hideItem.textContent = block?.hidden ? "Show" : "Hide";

  trigger.setAttribute("aria-expanded", "true");
  blockMoreMenu.hidden = false;

  const rect = trigger.getBoundingClientRect();
  const menuWidth = blockMoreMenu.offsetWidth || 126;
  const left = Math.min(window.innerWidth - menuWidth - 8, Math.max(8, rect.right - menuWidth));
  let top = rect.bottom + 4;
  const menuHeight = blockMoreMenu.offsetHeight || 100;
  if (top + menuHeight > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menuHeight - 4);
  }
  blockMoreMenu.style.left = `${left}px`;
  blockMoreMenu.style.top = `${top}px`;
}

function openBlockEditLayer(index) {
  const block = blocks[index];
  if (!block || !contentMain || !blockEditLayer) return;

  if (nestedLayer && !nestedLayer.hidden) {
    nestedLayer.hidden = true;
  }

  editingIndex = index;
  closeBlockMoreMenu();
  contentMain.hidden = true;
  blockEditLayer.hidden = false;
  if (blockEditTitle) blockEditTitle.textContent = block.name;
  showEditTab("format");
  blockEditBack?.focus();
  announce(`Editing ${block.name} in nested layer`);
}

function closeBlockEditLayer({ restoreFocus = true } = {}) {
  if (!contentMain || !blockEditLayer) return;
  const returnIndex = editingIndex;
  blockEditLayer.hidden = true;
  contentMain.hidden = false;
  editingIndex = null;

  if (restoreFocus && returnIndex != null) {
    const trigger = blockList?.querySelector(`.block-row[data-index="${returnIndex}"] .more-trigger`);
    trigger?.focus();
  }
  announce("Returned to Block Label");
}

blockEditBack?.addEventListener("click", () => closeBlockEditLayer());

function deleteBlock(index) {
  blocks.splice(index, 1);
  renderBlocks();
  announce("Block deleted");
}

function toggleBlockHidden(index) {
  const block = blocks[index];
  if (!block) return;
  block.hidden = !block.hidden;
  renderBlocks();
  announce(block.hidden ? `${block.name} hidden` : `${block.name} shown`);
}

function renderBlockRow(block, index) {
  const row = document.createElement("div");
  row.className = "block-row";
  row.setAttribute("role", "listitem");
  row.dataset.index = String(index);

  const drag = document.createElement("span");
  drag.className = "icon-28";
  drag.setAttribute("aria-hidden", "true");
  drag.innerHTML =
    '<img src="assets/floating-settings-ux/icon-drag.svg" alt="" width="28" height="28" />';

  const label = document.createElement("span");
  label.className = "block-row-label";
  label.textContent = block.name;

  if (block.hidden) {
    const eye = document.createElement("span");
    eye.className = "block-row-hidden";
    eye.setAttribute("aria-hidden", "true");
    eye.innerHTML =
      '<img src="assets/floating-settings-ux/icon-visibility-off.svg" alt="" width="16" height="16" />';
    label.appendChild(eye);
    row.setAttribute("aria-label", `${block.name}, hidden`);
  }

  const more = document.createElement("button");
  more.type = "button";
  more.className = "icon-button more-trigger";
  more.setAttribute("aria-label", `${block.name} options`);
  more.setAttribute("aria-haspopup", "menu");
  more.setAttribute("aria-expanded", "false");
  more.setAttribute("aria-controls", "block-more-menu");
  more.innerHTML =
    '<span class="icon-24" aria-hidden="true"><img src="assets/floating-settings-ux/icon-more.svg" alt="" width="24" height="24" /></span>';
  more.addEventListener("click", (event) => {
    event.stopPropagation();
    openBlockMoreMenu(index, more);
  });

  row.append(drag, label, more);
  return row;
}

function renderBlocks() {
  if (!blockList) return;
  blockList.replaceChildren(...blocks.map((block, index) => renderBlockRow(block, index)));
}

function addBlockToList(name) {
  if (nestedLayer && !nestedLayer.hidden) closeNestedLayer();
  if (blockEditLayer && !blockEditLayer.hidden) closeBlockEditLayer({ restoreFocus: false });

  blocks.push({ name, hidden: false });
  renderBlocks();
  showPanelTab(document.querySelector("#panel-content"), "content");

  requestAnimationFrame(() => {
    if (!contentScroll) return;
    const target = blockList?.lastElementChild || addBlock;
    target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });

  announce(`${name} block added`);
}

blockMoreMenu?.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const index = moreMenuIndex;
    const action = button.dataset.action;
    closeBlockMoreMenu();
    if (index == null) return;
    if (action === "edit") openBlockEditLayer(index);
    if (action === "hide") toggleBlockHidden(index);
    if (action === "delete") deleteBlock(index);
  });
});

const addBlock = document.querySelector("#add-block");
const addBlockLightbox = document.querySelector("#add-block-lightbox");
const addBlockClose = document.querySelector("#add-block-close");
const addBlockSearch = document.querySelector("#add-block-search");
const addBlockGrid = document.querySelector("#add-block-grid");
const addBlockEmpty = document.querySelector("#add-block-empty");
const addBlockOptions = [...document.querySelectorAll(".add-block-option")];
const contentStage = document.querySelector("#content-stage");

function setAddBlockOpen(open) {
  if (!addBlockLightbox || !addBlock) return;

  addBlockLightbox.hidden = !open;
  addBlock.setAttribute("aria-expanded", String(open));
  contentStage?.classList.toggle("is-lightbox-open", open);

  if (open) {
    closeBlockMoreMenu();
    if (addBlockSearch) {
      addBlockSearch.value = "";
      filterBlocks("");
      addBlockSearch.focus();
    }
    announce("Add Block lightbox opened");
  } else {
    addBlock.focus();
    announce("Add Block lightbox closed");
  }
}

function filterBlocks(query) {
  const needle = query.trim().toLowerCase();
  let visible = 0;

  addBlockOptions.forEach((option) => {
    const label = option.dataset.block || "";
    const match = !needle || label.toLowerCase().includes(needle);
    option.hidden = !match;
    if (match) visible += 1;
  });

  if (addBlockEmpty) addBlockEmpty.hidden = visible > 0;
  if (addBlockGrid) addBlockGrid.hidden = visible === 0;
}

addBlock?.addEventListener("click", () => {
  const isOpen = addBlock.getAttribute("aria-expanded") === "true";
  setAddBlockOpen(!isOpen);
});

addBlockClose?.addEventListener("click", () => setAddBlockOpen(false));

addBlockSearch?.addEventListener("input", () => {
  filterBlocks(addBlockSearch.value);
});

addBlockOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const name = option.dataset.block;
    setAddBlockOpen(false);
    addBlockToList(name);
  });
});

const textStyleTrigger = document.querySelector("#text-style-trigger");
const textStyleMenu = document.querySelector("#text-style-menu");
const textStyleValue = document.querySelector("#text-style-value");

function setTextStyleMenuOpen(open) {
  if (!textStyleMenu || !textStyleTrigger) return;
  textStyleMenu.hidden = !open;
  textStyleTrigger.setAttribute("aria-expanded", String(open));
}

textStyleTrigger?.addEventListener("click", () => {
  const open = textStyleTrigger.getAttribute("aria-expanded") !== "true";
  setTextStyleMenuOpen(open);
});

textStyleMenu?.querySelectorAll("button[data-style]").forEach((button) => {
  button.addEventListener("click", () => {
    textStyleMenu.querySelectorAll("button[data-style]").forEach((item) => {
      item.setAttribute("aria-selected", String(item === button));
    });
    if (textStyleValue) textStyleValue.textContent = button.dataset.style || "H1";
    setTextStyleMenuOpen(false);
    announce(`Text style ${button.dataset.style}`);
  });
});

function bindIconBar(root, dataKey, label) {
  if (!root) return;
  root.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      root.querySelectorAll("button").forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      announce(`${label} ${button.dataset[dataKey]}`);
    });
  });
}

bindIconBar(document.querySelector("#text-align"), "align", "Text alignment");
bindIconBar(document.querySelector("#text-orient"), "orient", "Text orientation");

document.addEventListener("pointerdown", (event) => {
  if (!blockMoreMenu || blockMoreMenu.hidden) return;
  if (blockMoreMenu.contains(event.target) || moreTriggerEl?.contains(event.target)) return;
  closeBlockMoreMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (blockMoreMenu && !blockMoreMenu.hidden) {
    event.preventDefault();
    const trigger = moreTriggerEl;
    closeBlockMoreMenu();
    trigger?.focus();
    return;
  }
  if (textStyleMenu && !textStyleMenu.hidden) {
    event.preventDefault();
    setTextStyleMenuOpen(false);
    textStyleTrigger?.focus();
    return;
  }
  if (blockEditLayer && !blockEditLayer.hidden) {
    event.preventDefault();
    closeBlockEditLayer();
    return;
  }
  if (addBlockLightbox && !addBlockLightbox.hidden) {
    event.preventDefault();
    setAddBlockOpen(false);
  }
});

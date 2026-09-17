const live = document.querySelector("#live");
const pageCard = document.querySelector("#page-card");
const blockWrap = document.querySelector("#block-wrap");
const openBtn = document.querySelector("#open-btn");
const openLabel = document.querySelector("#open-label");
const openName = document.querySelector("#open-name");
const ctaBtn = document.querySelector("#cta-btn");
const ctaLabel = document.querySelector("#cta-label");
const ctaName = document.querySelector("#cta-name");
const destHint = document.querySelector("#dest-hint");
const destValue = document.querySelector("#dest-value");
const destMenu = document.querySelector("#dest-menu");
const destTrigger = document.querySelector("#dest-trigger");
const sortValue = document.querySelector("#sort-value");
const sortMenu = document.querySelector("#sort-menu");
const sortTrigger = document.querySelector("#sort-trigger");
const customSort = document.querySelector("#custom-sort");
const propertyList = document.querySelector("#property-list");
const openPresetField = document.querySelector("#open-preset-field");
const ctaPresetField = document.querySelector("#cta-preset-field");
const animationTrigger = document.querySelector("#animation-trigger");
const animationMenu = document.querySelector("#animation-menu");
const animationValue = document.querySelector("#animation-value");
const parallaxSwitch = document.querySelector("#sw-parallax");
const positioningTrigger = document.querySelector("#positioning-trigger");
const positioningMenu = document.querySelector("#positioning-menu");
const positioningValue = document.querySelector("#positioning-value");
const pageBody = document.querySelector(".page-body-center");
const layerPos = document.querySelector("#layer-pos");
const modal = document.querySelector("#modal");
const modalClose = document.querySelector("#modal-close");
const dropdownToggle = document.querySelector("#dropdown-toggle");
const dropdownList = document.querySelector("#dropdown-list");
const selectedLabel = document.querySelector("#selected-label");
const deviceBtn = document.querySelector("#device-btn");

const destMeta = {
  propertyLink: {
    hint: "Links each item to its corresponding property page.",
    label: "Property Link",
    open: "Select a Residence",
    cta: "Go to the community",
  },
  residentLink: {
    hint: "Opens each property’s Resident Link in a new tab. Empty links do nothing today.",
    label: "Resident Link",
    open: "Resident Portal Finder",
    cta: "Open Resident Portal",
  },
  applyNowLink: {
    hint: "Opens each property’s Apply Now Link in a new tab. Empty links do nothing today.",
    label: "Apply Now",
    open: "Apply Now",
    cta: "Start application",
  },
};

const state = {
  dest: "propertyLink",
  sort: "asc",
  openPreset: "primary",
  ctaPreset: "primary",
};

const BUTTON_PRESETS = [
  { id: "primary", label: "Primary", chip: "primary" },
  { id: "secondary", label: "Secondary", chip: "secondary" },
  { id: "tertiary", label: "Tertiary", chip: "tertiary" },
  { id: "text-link", label: "Text Link", chip: "text-link" },
  { id: "icon", label: "Icon", chip: "icon" },
  { id: "custom", label: "Custom", chip: "custom" },
];

function presetChipMarkup(chip) {
  if (chip === "icon") {
    return `<span class="preset-chip preset-chip-icon"><img src="assets/icon-preset-plus.svg" alt="" width="30" height="30" /></span>`;
  }
  return `<span class="preset-chip preset-chip-${chip}"><span class="preset-chip-label">Button</span></span>`;
}

function mountButtonPreset(el, { prefix, selected, onChange }) {
  const labelId = `${prefix}-preset-label`;
  const triggerId = `${prefix}-preset-trigger`;
  const valueId = `${prefix}-preset-value`;
  const menuId = `${prefix}-preset-menu`;
  const options = BUTTON_PRESETS.map((preset) => {
    const active = preset.id === selected;
    return `<li>
      <button type="button" role="option" data-preset="${preset.id}" aria-selected="${active}">
        <span class="preset-preview">${presetChipMarkup(preset.chip)}</span>
        <span class="preset-name">${preset.label}</span>
      </button>
    </li>`;
  }).join("");
  const current = BUTTON_PRESETS.find((preset) => preset.id === selected) || BUTTON_PRESETS[0];

  el.innerHTML = `
    <p class="preset-label" id="${labelId}">Selected Button Style</p>
    <button
      type="button"
      class="preset-trigger"
      id="${triggerId}"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-labelledby="${labelId} ${valueId}"
    >
      <span class="preset-choice">
        <span class="preset-preview">${presetChipMarkup(current.chip)}</span>
        <span class="preset-name" id="${valueId}">${current.label}</span>
      </span>
      <span class="icon-button" aria-hidden="true">
        <span class="icon-24">
          <img src="assets/icon-chevron.svg" alt="" width="24" height="24" />
        </span>
      </span>
    </button>
    <ul class="preset-menu" id="${menuId}" hidden role="listbox" aria-labelledby="${labelId}">
      ${options}
      <li class="preset-menu-footer">
        <button type="button" class="preset-site-styles">Edit Site Styles</button>
      </li>
    </ul>
  `;

  const trigger = el.querySelector(".preset-trigger");
  const menu = el.querySelector(".preset-menu");
  const name = el.querySelector(`#${valueId}`);
  const preview = el.querySelector(".preset-trigger .preset-preview");

  fieldMenus.push({ trigger, menu });

  trigger.addEventListener("click", () => {
    const open = menu.hidden;
    closeMenus();
    if (open) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll("[data-preset]").forEach((option) => {
    option.addEventListener("click", () => {
      menu.querySelectorAll("[data-preset]").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      const preset = BUTTON_PRESETS.find((item) => item.id === option.dataset.preset);
      name.textContent = preset.label;
      preview.innerHTML = presetChipMarkup(preset.chip);
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      onChange(preset.id);
    });
  });

  const siteStyles = menu.querySelector(".preset-site-styles");
  if (siteStyles) {
    siteStyles.addEventListener("click", () => {
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      announce("Edit Site Styles is a site-level action in this file.");
    });
  }

  return { trigger, menu };
}

const fieldMenus = [
  { trigger: destTrigger, menu: destMenu },
  { trigger: sortTrigger, menu: sortMenu },
  { trigger: animationTrigger, menu: animationMenu },
  { trigger: positioningTrigger, menu: positioningMenu },
];

function announce(message) {
  if (live) live.textContent = message;
}

function closeMenus() {
  fieldMenus.forEach(({ trigger, menu }) => {
    if (!menu || !trigger) return;
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  });
}

function bindMenu(trigger, menu, onPick) {
  if (!trigger || !menu) return;

  trigger.addEventListener("click", () => {
    const open = menu.hidden;
    closeMenus();
    if (open) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", () => {
      menu.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
      onPick(option);
    });
  });
}

function applyLabels(open, cta) {
  openName.value = open;
  ctaName.value = cta;
  openLabel.textContent = open;
  ctaLabel.textContent = cta;
}

function applyButtonStyle(button, preset) {
  button.classList.remove(
    "is-link",
    "is-icon",
    "is-combo",
    "preset-primary",
    "preset-secondary",
    "preset-tertiary",
    "preset-text-link",
    "preset-icon",
    "preset-custom"
  );
  button.classList.add(`preset-${preset}`);
}

function refreshButtonStyles() {
  applyButtonStyle(openBtn, state.openPreset);
  applyButtonStyle(ctaBtn, state.ctaPreset);
}

function setTab(tab) {
  closeMenus();
  document.querySelectorAll(".tab[role='tab']").forEach((button) => {
    const selected = button.id === `tab-${tab}`;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${tab}`;
  });
}

function setDest(dest, applyPreset = true) {
  const meta = destMeta[dest];
  state.dest = dest;
  destValue.textContent = meta.label;
  destHint.textContent = meta.hint;
  destMenu.querySelectorAll("button").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.dest === dest));
  });
  if (applyPreset) applyLabels(meta.open, meta.cta);
}

function setSort(sort) {
  const labels = { asc: "Ascending", desc: "Descending", custom: "Custom" };
  state.sort = sort;
  sortValue.textContent = labels[sort];
  sortMenu.querySelectorAll("button").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.sort === sort));
  });
  customSort.hidden = sort !== "custom";
}

function setModal(open) {
  modal.hidden = !open;
  if (!open) {
    dropdownList.hidden = true;
    dropdownToggle.setAttribute("aria-expanded", "false");
    ctaBtn.disabled = true;
    selectedLabel.textContent = "Select a property";
    dropdownList.querySelectorAll("button").forEach((option) => {
      option.setAttribute("aria-selected", "false");
    });
  }
}

function setReviewChip(stateName) {
  document.querySelectorAll(".chip[data-state], .chip[data-tab-only]").forEach((chip) => {
    const isState = chip.dataset.state === stateName;
    const isTab = chip.dataset.tabOnly && stateName === chip.dataset.tabOnly;
    chip.classList.toggle("active", Boolean(isState || isTab));
  });
}

function setState(next) {
  setModal(false);
  if (next === "property") {
    setDest("propertyLink");
    setSort("asc");
    setTab("content");
  }
  if (next === "resident") {
    setDest("residentLink");
    setSort("asc");
    setTab("content");
  }
  if (next === "apply") {
    setDest("applyNowLink");
    setSort("asc");
    setTab("content");
  }
  if (next === "custom") {
    setDest("propertyLink", false);
    setSort("custom");
    applyLabels("Communities", "Take me there");
    setTab("content");
  }
  if (next === "modal") {
    setTab("content");
    setModal(true);
  }
  setReviewChip(next);
}

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => setTab(tab.id.replace("tab-", "")));
});

document.querySelectorAll(".chip[data-state]").forEach((chip) => {
  chip.addEventListener("click", () => setState(chip.dataset.state));
});

document.querySelectorAll(".chip[data-tab-only]").forEach((chip) => {
  chip.addEventListener("click", () => {
    setModal(false);
    setTab(chip.dataset.tabOnly);
    setReviewChip(chip.dataset.tabOnly);
  });
});

bindMenu(destTrigger, destMenu, (option) => setDest(option.dataset.dest));
bindMenu(sortTrigger, sortMenu, (option) => setSort(option.dataset.sort));
bindMenu(animationTrigger, animationMenu, (option) => {
  animationValue.textContent = option.textContent;
});
bindMenu(positioningTrigger, positioningMenu, (option) => {
  positioningValue.textContent = option.textContent;
  pageBody.dataset.position = option.dataset.position;
});
mountButtonPreset(openPresetField, {
  prefix: "open",
  selected: state.openPreset,
  onChange: (preset) => {
    state.openPreset = preset;
    refreshButtonStyles();
  },
});
mountButtonPreset(ctaPresetField, {
  prefix: "cta",
  selected: state.ctaPreset,
  onChange: (preset) => {
    state.ctaPreset = preset;
    refreshButtonStyles();
  },
});
openName.addEventListener("input", () => {
  openLabel.textContent = openName.value || "Open modal";
});

ctaName.addEventListener("input", () => {
  ctaLabel.textContent = ctaName.value || "Go to the community";
});

openBtn.addEventListener("click", () => {
  setModal(true);
  setReviewChip("modal");
});

modalClose.addEventListener("click", () => {
  setModal(false);
  setReviewChip(state.sort === "custom" ? "custom" : state.dest === "residentLink" ? "resident" : state.dest === "applyNowLink" ? "apply" : "property");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modalClose.click();
});

dropdownToggle.addEventListener("click", () => {
  const open = dropdownList.hidden;
  dropdownList.hidden = !open;
  dropdownToggle.setAttribute("aria-expanded", String(open));
});

dropdownList.querySelectorAll("button").forEach((option) => {
  option.addEventListener("click", () => {
    dropdownList.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });
    selectedLabel.textContent = option.textContent;
    dropdownList.hidden = true;
    dropdownToggle.setAttribute("aria-expanded", "false");
    ctaBtn.disabled = false;
  });
});

ctaBtn.addEventListener("click", () => {
  if (ctaBtn.disabled) return;
  announce(`${ctaLabel.textContent} for ${selectedLabel.textContent}`);
});

document.querySelector("#qa-edit").addEventListener("click", () => {
  setTab("content");
  announce("Edit opens the Content tab.");
});

document.querySelector("#qa-copy").addEventListener("click", () => {
  announce("Duplicate is a canvas action in this mock.");
});

document.querySelector("#qa-delete").addEventListener("click", () => {
  announce("Delete is a canvas action in this mock.");
});

deviceBtn.addEventListener("click", () => {
  const on = deviceBtn.getAttribute("aria-pressed") !== "true";
  deviceBtn.setAttribute("aria-pressed", String(on));
  announce(on ? "Device overrides on" : "Device overrides off");
});

document.querySelectorAll("#padding-source button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#padding-source button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.pad == null) return;
    blockWrap.style.padding = `${button.dataset.pad}px`;
  });
});

document.querySelectorAll("#width-source button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#width-source button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.width == null) return;
    blockWrap.style.width = `${button.dataset.width}%`;
  });
});

parallaxSwitch.addEventListener("click", () => {
  const on = parallaxSwitch.getAttribute("aria-checked") !== "true";
  parallaxSwitch.classList.toggle("on", on);
  parallaxSwitch.setAttribute("aria-checked", String(on));
  blockWrap.classList.toggle("has-parallax", on);
});

layerPos.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  blockWrap.style.zIndex = Number.isFinite(value) ? String(value) : "1";
});

let dragRow = null;
propertyList.querySelectorAll(".item-row").forEach((row) => {
  row.addEventListener("dragstart", () => {
    dragRow = row;
    row.classList.add("dragging");
  });
  row.addEventListener("dragend", () => {
    row.classList.remove("dragging");
    dragRow = null;
  });
  row.addEventListener("dragover", (event) => {
    event.preventDefault();
    const over = event.currentTarget;
    if (!dragRow || dragRow === over) return;
    const rect = over.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    propertyList.insertBefore(dragRow, before ? over : over.nextSibling);
  });
});

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".field") &&
    !event.target.closest(".preset-field") &&
    !event.target.closest(".modal-panel")
  ) {
    closeMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenus();
  if (!modal.hidden) modalClose.click();
});

setDest("propertyLink");
setSort("asc");
setTab("content");
refreshButtonStyles();

const live = document.querySelector("#live");
const mapBlock = document.querySelector("#map-block");
const blockWrap = document.querySelector("#block-wrap");
const navToast = document.querySelector("#nav-toast");
const hoverName = document.querySelector("#hover-name");
const hoverCount = document.querySelector("#hover-count");
const countBubble = document.querySelector("#count-bubble");
const cornerLabel = document.querySelector("#corner-label");
const sourceHint = document.querySelector("#source-hint");
const linkWarn = document.querySelector("#link-warn");
const linkField = document.querySelector("#link-field");
const linkValue = document.querySelector("#link-value");
const linkMenu = document.querySelector("#link-menu");
const destinationSection = document.querySelector("#destination-section");
const hoverValue = document.querySelector("#hover-value");
const hoverMenu = document.querySelector("#hover-menu");
const smallToggle = document.querySelector("#small-toggle");
const titleFontValue = document.querySelector("#title-font-value");
const titleFontMenu = document.querySelector("#title-font-menu");
const subtitleFontValue = document.querySelector("#subtitle-font-value");
const subtitleFontMenu = document.querySelector("#subtitle-font-menu");
const customTitleFields = document.querySelector("#custom-title-fields");
const customSubtitleFields = document.querySelector("#custom-subtitle-fields");
const titleFamilyValue = document.querySelector("#title-family-value");
const titleFamilyMenu = document.querySelector("#title-family-menu");
const titleWeightValue = document.querySelector("#title-weight-value");
const titleWeightMenu = document.querySelector("#title-weight-menu");
const subtitleFamilyValue = document.querySelector("#subtitle-family-value");
const subtitleFamilyMenu = document.querySelector("#subtitle-family-menu");
const subtitleWeightValue = document.querySelector("#subtitle-weight-value");
const subtitleWeightMenu = document.querySelector("#subtitle-weight-menu");
const titleSize = document.querySelector("#title-size");
const titleLine = document.querySelector("#title-line");
const subtitleSize = document.querySelector("#subtitle-size");
const subtitleLine = document.querySelector("#subtitle-line");
const buttonStylePanel = document.querySelector("#button-style-panel");
const buttonPresetField = document.querySelector("#button-preset-field");
const animationValue = document.querySelector("#animation-value");
const animationMenu = document.querySelector("#animation-menu");
const positioningValue = document.querySelector("#positioning-value");
const positioningMenu = document.querySelector("#positioning-menu");
const parallaxToggle = document.querySelector("#parallax-toggle");
const customBlockWidthField = document.querySelector("#custom-block-width-field");
const customBlockWidth = document.querySelector("#custom-block-width");
const customPaddingField = document.querySelector("#custom-padding-field");
const customPadding = document.querySelector("#custom-padding");
const layerPos = document.querySelector("#layer-pos");
const deviceBtn = document.querySelector("#device-btn");
const mobileToggle = document.querySelector("#mobile-toggle");
const mobileList = document.querySelector("#mobile-list");

const MAP_COLORS = [
  { name: "Primary", hex: "#ff005a" },
  { name: "Secondary", hex: "#1e2743" },
  { name: "Blue", hex: "#015eea" },
  { name: "Green", hex: "#007F56" },
];

const BUTTON_PRESETS = [
  { id: "primary", label: "Primary", chip: "primary" },
  { id: "secondary", label: "Secondary", chip: "secondary" },
  { id: "tertiary", label: "Tertiary", chip: "tertiary" },
  { id: "text-link", label: "Text Link", chip: "text-link" },
];

const FONTS = {
  h1: { label: "Heading 1", size: 32, weight: "700", line: 1.1 },
  h2: { label: "Heading 2", size: 28, weight: "700", line: 1.15 },
  h3: { label: "Heading 3", size: 24, weight: "700", line: 1.2 },
  h4: { label: "Heading 4", size: 20, weight: "700", line: 1.25 },
  h5: { label: "Heading 5", size: 18, weight: "700", line: 1.3 },
  h6: { label: "Heading 6", size: 16, weight: "700", line: 1.3 },
  paragraph: { label: "Paragraph", size: 15, weight: "400", line: 1.45 },
};

const FAMILIES = {
  Lato: "Lato, Helvetica, sans-serif",
  Roboto: "Roboto, Helvetica, sans-serif",
  Georgia: "Georgia, serif",
};

const SOURCE_HINTS = {
  content:
    'Pull properties from your content library. <a class="text-link" href="#">Manage Properties</a>.',
  portfolio:
    'Pull properties from your Corporate Listing Site. <a class="text-link" href="#">Manage Properties</a>.',
};

const LINK_LABELS = {
  "": "Select a page",
  properties: "properties",
  communities: "communities",
  "property-search": "property-search",
  map: "map",
};

const ANIMATIONS = {
  "": "None",
  "slide-y": "Slide From Bottom",
  "zoom-in": "Grow",
  "zoom-out-in": "Shrink",
  "zoom-in-more": "Zoom In",
  "zoom-out": "Zoom Out",
};

const SLUGS = {
  TX: "texas",
  FL: "florida",
  CA: "california",
  NY: "new-york",
  WA: "washington",
  OR: "oregon",
  IL: "illinois",
  NC: "north-carolina",
  GA: "georgia",
  AK: "alaska",
  MA: "massachusetts",
  CT: "connecticut",
  NJ: "new-jersey",
  MD: "maryland",
};

const state = {
  source: "content",
  link: "properties",
  hover: "label",
  small: true,
  mobile: false,
  empty: false,
  activeColor: { name: "Primary", hex: "#ff005a" },
  hoverColor: { name: "Secondary", hex: "#1e2743" },
  titleFont: "h2",
  customTitle: false,
  titleCustom: { family: "Lato", weight: "700", size: 28, line: 1.2 },
  subtitleFont: "h4",
  customSubtitle: false,
  subtitleCustom: { family: "Lato", weight: "700", size: 20, line: 1.2 },
  buttonPreset: "primary",
  animation: "slide-y",
  speed: "normal",
  parallax: false,
  blockWidth: 100,
  blockWidthCustom: false,
  position: "default",
  padding: "0",
  paddingCustom: false,
  layer: 1,
};

const fieldMenus = [];
let toastTimer = 0;

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
  fieldMenus.push({ trigger, menu });

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.hidden;
    closeMenus();
    if (open) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      closeMenus();
      onPick(option);
    });
  });
}

function setMenuValue(menu, valueEl, attr, value) {
  if (!menu || !valueEl) return;
  menu.querySelectorAll("button").forEach((option) => {
    const selected = (option.dataset[attr] ?? "") === String(value);
    option.setAttribute("aria-selected", String(selected));
    if (selected) valueEl.textContent = option.textContent.trim();
  });
}

function setSwitch(el, on) {
  el.classList.toggle("on", on);
  el.setAttribute("aria-checked", String(on));
}

function setChoice(selector, attr, value) {
  document.querySelectorAll(`${selector} button`).forEach((button) => {
    if (button.classList.contains("tune")) return;
    button.classList.toggle("active", button.dataset[attr] === String(value));
  });
}

function mountColorCard(el, { selected, label, colors, onChange }) {
  el.innerHTML = `
    <button class="color-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="${label}">
      <span class="swatch" style="background:${selected.hex}"></span>
      <span class="color-name">${selected.name}</span>
      <span class="icon-button" aria-hidden="true">
        <span class="icon-24">
          <img src="assets/icon-chevron.svg" alt="" width="24" height="24" />
        </span>
      </span>
    </button>
    <ul class="color-menu" hidden role="listbox" aria-label="${label}">
      ${colors
        .map(
          (color) => `<li>
        <button type="button" data-color="${color.name}" data-hex="${color.hex}" aria-selected="${color.name === selected.name}">
          <span class="swatch" style="background:${color.hex}"></span>
          ${color.name}
        </button>
      </li>`
        )
        .join("")}
      <li class="color-menu-footer">
        <button type="button" class="color-site-styles">Edit Site Styles</button>
      </li>
    </ul>
  `;

  const trigger = el.querySelector(".color-trigger");
  const menu = el.querySelector(".color-menu");
  const swatch = el.querySelector(".color-trigger .swatch");
  const name = el.querySelector(".color-name");
  fieldMenus.push({ trigger, menu });

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = menu.hidden;
    closeMenus();
    if (open) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll("[data-color]").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      closeMenus();
      onChange({ name: option.dataset.color, hex: option.dataset.hex });
    });
  });

  menu.querySelector(".color-site-styles")?.addEventListener("click", (event) => {
    event.stopPropagation();
    closeMenus();
    announce("Edit Site Styles is a site-level action in this file.");
  });

  return {
    set(next) {
      name.textContent = next.name;
      swatch.style.background = next.hex;
      menu.querySelectorAll("[data-color]").forEach((option) => {
        option.setAttribute("aria-selected", String(option.dataset.color === next.name));
      });
    },
  };
}

const activeColorCard = mountColorCard(document.querySelector("#active-color-field"), {
  selected: state.activeColor,
  label: "Active color",
  colors: MAP_COLORS,
  onChange: (next) => {
    state.activeColor = next;
    clearScenario();
    render();
  },
});

const hoverColorCard = mountColorCard(document.querySelector("#map-hover-color-field"), {
  selected: state.hoverColor,
  label: "Hover color",
  colors: MAP_COLORS,
  onChange: (next) => {
    state.hoverColor = next;
    clearScenario();
    render();
  },
});

function presetChipMarkup(chip) {
  return `<span class="preset-chip preset-chip-${chip}"><span class="preset-chip-label">Button</span></span>`;
}

function mountButtonPreset(el, { selected, onChange }) {
  const current = BUTTON_PRESETS.find((preset) => preset.id === selected) || BUTTON_PRESETS[0];
  const options = BUTTON_PRESETS.map((preset) => {
    const active = preset.id === selected;
    return `<li>
      <button type="button" role="option" data-preset="${preset.id}" aria-selected="${active}">
        <span class="preset-preview">${presetChipMarkup(preset.chip)}</span>
        <span class="preset-name">${preset.label}</span>
      </button>
    </li>`;
  }).join("");

  el.innerHTML = `
    <p class="preset-label" id="button-preset-label">Small State Button Style</p>
    <button
      type="button"
      class="preset-trigger"
      id="button-preset-trigger"
      aria-haspopup="listbox"
      aria-expanded="false"
      aria-labelledby="button-preset-label button-preset-value"
    >
      <span class="preset-choice">
        <span class="preset-preview">${presetChipMarkup(current.chip)}</span>
        <span class="preset-name" id="button-preset-value">${current.label}</span>
      </span>
      <span class="icon-button" aria-hidden="true">
        <span class="icon-24">
          <img src="assets/icon-chevron.svg" alt="" width="24" height="24" />
        </span>
      </span>
    </button>
    <ul class="preset-menu" id="button-preset-menu" hidden role="listbox" aria-labelledby="button-preset-label">
      ${options}
      <li class="preset-menu-footer">
        <button type="button" class="preset-site-styles">Edit Site Styles</button>
      </li>
    </ul>
  `;

  const trigger = el.querySelector(".preset-trigger");
  const menu = el.querySelector(".preset-menu");
  const name = el.querySelector("#button-preset-value");
  const preview = el.querySelector(".preset-trigger .preset-preview");
  fieldMenus.push({ trigger, menu });

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeMenus();
    if (willOpen) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });

  menu.querySelectorAll("[data-preset]").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.querySelectorAll("[data-preset]").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      const preset = BUTTON_PRESETS.find((item) => item.id === option.dataset.preset);
      name.textContent = preset.label;
      preview.innerHTML = presetChipMarkup(preset.chip);
      closeMenus();
      onChange(preset.id);
    });
  });

  menu.querySelector(".preset-site-styles").addEventListener("click", (event) => {
    event.stopPropagation();
    closeMenus();
    announce("Edit Site Styles is a site-level action in this file.");
  });

  return {
    set(id) {
      const preset = BUTTON_PRESETS.find((item) => item.id === id) || BUTTON_PRESETS[0];
      name.textContent = preset.label;
      preview.innerHTML = presetChipMarkup(preset.chip);
      menu.querySelectorAll("[data-preset]").forEach((option) => {
        option.setAttribute("aria-selected", String(option.dataset.preset === preset.id));
      });
    },
  };
}

const buttonPresetControl = mountButtonPreset(buttonPresetField, {
  selected: state.buttonPreset,
  onChange: (preset) => {
    state.buttonPreset = preset;
    clearScenario();
    render();
  },
});

function showTab(name) {
  closeMenus();
  document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
    const selected = tab.id === `tab-${name}`;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${name}`;
  });
}

function clearScenario() {
  document.querySelectorAll(".review-bar [data-state], .review-bar [data-tab-only]").forEach((chip) => {
    chip.classList.remove("active");
  });
}

function applyType(el, custom, presetKey, customValue) {
  const preset = FONTS[presetKey];
  const family = custom ? FAMILIES[customValue.family] || FAMILIES.Lato : FAMILIES.Lato;
  const weight = custom ? customValue.weight : preset.weight;
  const size = custom ? customValue.size : preset.size;
  const line = custom ? customValue.line : preset.line;
  el.style.fontFamily = family;
  el.style.fontWeight = weight;
  el.style.fontSize = `${size}px`;
  el.style.lineHeight = String(line);
}

function syncNumber(input, value) {
  if (document.activeElement !== input) input.value = String(value);
}

function render() {
  const linkEmpty = state.source === "content" && !state.link;
  mapBlock.dataset.source = state.source;
  mapBlock.dataset.hover = state.hover;
  mapBlock.dataset.small = state.small ? "on" : "off";
  mapBlock.dataset.device = state.mobile ? "mobile" : "desktop";
  mapBlock.dataset.empty = state.empty ? "on" : "off";
  mapBlock.dataset.linkEmpty = linkEmpty ? "on" : "off";
  mapBlock.dataset.btn = state.buttonPreset;
  mapBlock.style.setProperty("--map-active", state.activeColor.hex);
  mapBlock.style.setProperty("--map-hover", state.hoverColor.hex);
  mapBlock.style.setProperty("--block-pad", `${state.padding}px`);
  mapBlock.style.setProperty("--anim-ms", state.speed === "fast" ? "0.28s" : "0.55s");
  blockWrap.dataset.animation = state.animation;
  blockWrap.classList.toggle("has-parallax", state.parallax);
  blockWrap.style.zIndex = String(state.layer);
  const positions = { default: "", absolute: "absolute", fixed: "fixed", relative: "relative" };
  blockWrap.style.position = positions[state.position] || "";
  if (state.blockWidth === 100 && !state.blockWidthCustom) {
    blockWrap.style.width = "";
    blockWrap.style.maxWidth = "";
  } else {
    blockWrap.style.width = `${state.blockWidth}%`;
    blockWrap.style.maxWidth = "none";
  }

  sourceHint.innerHTML = SOURCE_HINTS[state.source];
  linkWarn.hidden = !linkEmpty;
  destinationSection.hidden = state.source !== "content";
  linkField.classList.toggle("is-warn", linkEmpty);
  setChoice("#source-source", "source", state.source);
  setMenuValue(linkMenu, linkValue, "link", state.link);
  setMenuValue(hoverMenu, hoverValue, "hover", state.hover);
  setSwitch(smallToggle, state.small);

  setMenuValue(titleFontMenu, titleFontValue, "font", state.titleFont);
  setMenuValue(subtitleFontMenu, subtitleFontValue, "font", state.subtitleFont);
  customTitleFields.hidden = state.titleFont !== "custom";
  customSubtitleFields.hidden = state.subtitleFont !== "custom";
  setMenuValue(titleFamilyMenu, titleFamilyValue, "family", state.titleCustom.family);
  setMenuValue(subtitleFamilyMenu, subtitleFamilyValue, "family", state.subtitleCustom.family);
  setMenuValue(titleWeightMenu, titleWeightValue, "weight", state.titleCustom.weight);
  setMenuValue(subtitleWeightMenu, subtitleWeightValue, "weight", state.subtitleCustom.weight);
  syncNumber(titleSize, state.titleCustom.size);
  syncNumber(titleLine, state.titleCustom.line);
  syncNumber(subtitleSize, state.subtitleCustom.size);
  syncNumber(subtitleLine, state.subtitleCustom.line);
  applyType(hoverName, state.titleFont === "custom", state.titleFont, state.titleCustom);
  applyType(hoverCount, state.subtitleFont === "custom", state.subtitleFont, state.subtitleCustom);

  buttonStylePanel.hidden = !state.small;
  buttonPresetControl.set(state.buttonPreset);
  activeColorCard.set(state.activeColor);
  hoverColorCard.set(state.hoverColor);

  setMenuValue(animationMenu, animationValue, "animation", state.animation);
  setChoice("#speed-source", "speed", state.speed);
  setSwitch(parallaxToggle, state.parallax);
  document.querySelectorAll("#block-width-source button").forEach((button) => {
    if (button.classList.contains("tune")) {
      button.classList.toggle("active", state.blockWidthCustom);
    } else {
      button.classList.toggle(
        "active",
        !state.blockWidthCustom && button.dataset.blockWidth === String(state.blockWidth)
      );
    }
  });
  customBlockWidthField.hidden = !state.blockWidthCustom;
  customBlockWidth.value = String(state.blockWidth);
  setMenuValue(positioningMenu, positioningValue, "position", state.position);
  document.querySelectorAll("#padding-source button").forEach((button) => {
    if (button.classList.contains("tune")) {
      button.classList.toggle("active", state.paddingCustom);
    } else {
      button.classList.toggle("active", !state.paddingCustom && button.dataset.pad === String(state.padding));
    }
  });
  customPaddingField.hidden = !state.paddingCustom;
  customPadding.value = String(state.padding);
  layerPos.value = String(state.layer);
  deviceBtn.setAttribute("aria-pressed", String(state.mobile));
  deviceBtn.classList.toggle("device-on", state.mobile);
  if (!state.mobile) {
    mobileList.hidden = true;
    mobileToggle.setAttribute("aria-expanded", "false");
  }
}

function showToast(message, warn) {
  navToast.textContent = message;
  navToast.classList.toggle("is-warn", warn);
  navToast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    navToast.hidden = true;
  }, 2200);
}

function navigate(abbr) {
  if (state.empty) return;
  if (state.source === "portfolio") {
    showToast(`Would open /${SLUGS[abbr] || abbr.toLowerCase()}`, false);
    return;
  }
  if (!state.link) {
    showToast("No Link to — click does nothing", true);
    return;
  }
  showToast(`Would open /${state.link}?state=${abbr}`, false);
}

function showHover(name, count, abbr, event) {
  if (state.mobile || state.empty) return;
  hoverName.textContent = name;
  const noun = Number(count) === 1 ? "Property" : "Properties";
  hoverCount.textContent = `${count} ${noun}`;
  countBubble.textContent = count;
  cornerLabel.classList.add("is-on");
  countBubble.classList.add("is-on");
  const parent = countBubble.parentElement.getBoundingClientRect();
  if (event && event.clientX) {
    countBubble.style.left = `${event.clientX - parent.left - 14}px`;
    countBubble.style.top = `${event.clientY - parent.top - 36}px`;
  }
  document.querySelectorAll(".us-map .active").forEach((path) => {
    path.classList.toggle("is-hover", path.dataset.abbr === abbr);
  });
}

function hideHover() {
  cornerLabel.classList.remove("is-on");
  countBubble.classList.remove("is-on");
  document.querySelectorAll(".us-map .active").forEach((path) => path.classList.remove("is-hover"));
}

function bindStateTarget(el) {
  el.addEventListener("mouseenter", (event) => {
    showHover(el.dataset.name, el.dataset.count, el.dataset.abbr, event);
  });
  el.addEventListener("mousemove", (event) => {
    showHover(el.dataset.name, el.dataset.count, el.dataset.abbr, event);
  });
  el.addEventListener("mouseleave", hideHover);
  el.addEventListener("click", () => navigate(el.dataset.abbr));
}

function setScenario(name) {
  state.source = "content";
  state.link = "properties";
  state.hover = "label";
  state.small = true;
  state.mobile = false;
  state.empty = false;
  document.querySelectorAll(".review-bar button").forEach((chip) => chip.classList.remove("active"));
  document.querySelector(`.review-bar [data-state="${name}"]`)?.classList.add("active");
  showTab("content");

  if (name === "empty-link") state.link = "";
  if (name === "portfolio") state.source = "portfolio";
  if (name === "hover-details") state.hover = "details";
  if (name === "hover-number") state.hover = "number";
  if (name === "small-off") state.small = false;
  if (name === "mobile") state.mobile = true;
  if (name === "empty-props") state.empty = true;
  render();
}

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.id.replace("tab-", "")));
});

document.querySelectorAll(".review-bar [data-state]").forEach((chip) => {
  chip.addEventListener("click", () => setScenario(chip.dataset.state));
});

document.querySelectorAll(".review-bar [data-tab-only]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".review-bar button").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    showTab(chip.dataset.tabOnly);
  });
});

document.querySelectorAll("#source-source button").forEach((button) => {
  button.addEventListener("click", () => {
    state.source = button.dataset.source;
    clearScenario();
    render();
  });
});

bindMenu(document.querySelector("#link-trigger"), linkMenu, (option) => {
  state.link = option.dataset.link;
  clearScenario();
  render();
});

bindMenu(document.querySelector("#hover-trigger"), hoverMenu, (option) => {
  state.hover = option.dataset.hover;
  clearScenario();
  render();
});

smallToggle.addEventListener("click", () => {
  state.small = !state.small;
  clearScenario();
  render();
});

bindMenu(document.querySelector("#title-font-trigger"), titleFontMenu, (option) => {
  const next = option.dataset.font;
  if (next === "custom" && state.titleFont !== "custom") {
    const preset = FONTS[state.titleFont] || FONTS.h2;
    state.titleCustom = { family: "Lato", weight: preset.weight, size: preset.size, line: preset.line };
  }
  state.titleFont = next;
  state.customTitle = next === "custom";
  clearScenario();
  render();
});

bindMenu(document.querySelector("#subtitle-font-trigger"), subtitleFontMenu, (option) => {
  const next = option.dataset.font;
  if (next === "custom" && state.subtitleFont !== "custom") {
    const preset = FONTS[state.subtitleFont] || FONTS.h4;
    state.subtitleCustom = { family: "Lato", weight: preset.weight, size: preset.size, line: preset.line };
  }
  state.subtitleFont = next;
  state.customSubtitle = next === "custom";
  clearScenario();
  render();
});

bindMenu(document.querySelector("#title-family-trigger"), titleFamilyMenu, (option) => {
  state.titleCustom.family = option.dataset.family;
  render();
});

bindMenu(document.querySelector("#subtitle-family-trigger"), subtitleFamilyMenu, (option) => {
  state.subtitleCustom.family = option.dataset.family;
  render();
});

bindMenu(document.querySelector("#title-weight-trigger"), titleWeightMenu, (option) => {
  state.titleCustom.weight = option.dataset.weight;
  render();
});

bindMenu(document.querySelector("#subtitle-weight-trigger"), subtitleWeightMenu, (option) => {
  state.subtitleCustom.weight = option.dataset.weight;
  render();
});

titleSize.addEventListener("input", () => {
  state.titleCustom.size = Number(titleSize.value) || state.titleCustom.size;
  render();
});

titleLine.addEventListener("input", () => {
  state.titleCustom.line = Number(titleLine.value) || state.titleCustom.line;
  render();
});

subtitleSize.addEventListener("input", () => {
  state.subtitleCustom.size = Number(subtitleSize.value) || state.subtitleCustom.size;
  render();
});

subtitleLine.addEventListener("input", () => {
  state.subtitleCustom.line = Number(subtitleLine.value) || state.subtitleCustom.line;
  render();
});

bindMenu(document.querySelector("#animation-trigger"), animationMenu, (option) => {
  state.animation = option.dataset.animation;
  blockWrap.dataset.animation = "";
  void blockWrap.offsetWidth;
  render();
  announce(`${ANIMATIONS[state.animation] || "None"} animation`);
});

document.querySelectorAll("#speed-source button").forEach((button) => {
  button.addEventListener("click", () => {
    state.speed = button.dataset.speed;
    blockWrap.dataset.animation = "";
    void blockWrap.offsetWidth;
    render();
  });
});

parallaxToggle.addEventListener("click", () => {
  state.parallax = !state.parallax;
  render();
});

document.querySelectorAll("#block-width-source button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("tune")) {
      state.blockWidthCustom = true;
      state.blockWidth = Number.parseFloat(customBlockWidth.value) || 100;
    } else {
      state.blockWidthCustom = false;
      state.blockWidth = Number.parseFloat(button.dataset.blockWidth);
    }
    render();
  });
});

customBlockWidth.addEventListener("input", () => {
  const value = Number.parseFloat(customBlockWidth.value);
  if (!Number.isFinite(value)) return;
  state.blockWidth = value;
  render();
});

bindMenu(document.querySelector("#positioning-trigger"), positioningMenu, (option) => {
  state.position = option.dataset.position;
  render();
});

document.querySelectorAll("#padding-source button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("tune")) {
      state.paddingCustom = true;
      state.padding = Number.parseFloat(customPadding.value) || 0;
    } else {
      state.paddingCustom = false;
      state.padding = button.dataset.pad;
    }
    render();
  });
});

customPadding.addEventListener("input", () => {
  const value = Number.parseFloat(customPadding.value);
  if (!Number.isFinite(value)) return;
  state.padding = value;
  render();
});

layerPos.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  if (!Number.isFinite(value)) return;
  state.layer = value;
  render();
});

deviceBtn.addEventListener("click", () => {
  state.mobile = !state.mobile;
  clearScenario();
  render();
  announce(state.mobile ? "Mobile canvas. State hover is hidden." : "Desktop canvas.");
});

mobileToggle.addEventListener("click", () => {
  const open = mobileList.hidden;
  mobileList.hidden = !open;
  mobileToggle.setAttribute("aria-expanded", String(open));
});

document.querySelector("#qa-edit").addEventListener("click", () => showTab("content"));
document.querySelector("#qa-copy").addEventListener("click", () => announce("Duplicate is a block action in this mock."));
document.querySelector("#qa-delete").addEventListener("click", () => announce("Delete is a block action in this mock."));

document.querySelectorAll(".us-map .active, .small-btn").forEach(bindStateTarget);

mobileList.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    navigate(button.dataset.abbr);
    mobileList.hidden = true;
    mobileToggle.setAttribute("aria-expanded", "false");
  });
});

sourceHint.addEventListener("click", (event) => {
  const link = event.target.closest(".text-link");
  if (!link) return;
  event.preventDefault();
  announce("Manage Properties is a dashboard action in this mock.");
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".field, .color-card, .preset-field, .mobile-select")) return;
  closeMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenus();
});

render();
showTab("content");

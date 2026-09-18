const live = document.querySelector("#live");
const pageCard = document.querySelector("#page-card");
const pageBody = document.querySelector("#page-body");
const blockWrap = document.querySelector("#block-wrap");
const specialBlock = document.querySelector("#special-block");
const specialInner = document.querySelector("#special-inner");
const specialCopy = document.querySelector("#special-copy");
const specialTitle = document.querySelector("#special-title");
const specialDesc = document.querySelector("#special-desc");
const specialDisclaimer = document.querySelector("#special-disclaimer");
const ctaRow = document.querySelector("#cta-row");
const specialCta = document.querySelector("#special-cta");
const fallbackPreview = document.querySelector("#fallback-preview");
const hiddenCanvas = document.querySelector("#hidden-canvas");
const lightbox = document.querySelector("#lightbox");
const lightboxList = document.querySelector("#lightbox-list");
const sourceTrigger = document.querySelector("#source-trigger");
const sourceMenu = document.querySelector("#source-menu");
const sourceValue = document.querySelector("#source-value");
const sourceStatus = document.querySelector("#source-status");
const fallbackToggle = document.querySelector("#fallback-toggle");
const fallbackTextField = document.querySelector("#fallback-text-field");
const fallbackText = document.querySelector("#fallback-text");
const bgTrigger = document.querySelector("#bg-trigger");
const bgMenu = document.querySelector("#bg-menu");
const bgValue = document.querySelector("#bg-value");
const solidColorField = document.querySelector("#solid-color-field");
const imageField = document.querySelector("#image-field");
const tintColorField = document.querySelector("#tint-color-field");
const widthTrigger = document.querySelector("#width-trigger");
const widthMenu = document.querySelector("#width-menu");
const widthValue = document.querySelector("#width-value");
const customWidthField = document.querySelector("#custom-width-field");
const customWidth = document.querySelector("#custom-width");
const titleStyleTrigger = document.querySelector("#title-style-trigger");
const titleStyleMenu = document.querySelector("#title-style-menu");
const titleStyleValue = document.querySelector("#title-style-value");
const descStyleTrigger = document.querySelector("#desc-style-trigger");
const descStyleMenu = document.querySelector("#desc-style-menu");
const descStyleValue = document.querySelector("#desc-style-value");
const discStyleTrigger = document.querySelector("#disc-style-trigger");
const discStyleMenu = document.querySelector("#disc-style-menu");
const discStyleValue = document.querySelector("#disc-style-value");
const animationTrigger = document.querySelector("#animation-trigger");
const animationMenu = document.querySelector("#animation-menu");
const animationValue = document.querySelector("#animation-value");
const positioningTrigger = document.querySelector("#positioning-trigger");
const positioningMenu = document.querySelector("#positioning-menu");
const positioningValue = document.querySelector("#positioning-value");
const customBlockWidthField = document.querySelector("#custom-block-width-field");
const customBlockWidth = document.querySelector("#custom-block-width");
const customPaddingField = document.querySelector("#custom-padding-field");
const customPadding = document.querySelector("#custom-padding");
const layerPos = document.querySelector("#layer-pos");
const parallaxToggle = document.querySelector("#parallax-toggle");
const buttonPresetField = document.querySelector("#button-preset-field");
const deviceBtn = document.querySelector("#device-btn");

const SPECIALS = [
  {
    id: "month-free",
    title: "1 Month Free",
    description: "Sign a 13-month lease and get your first month complimentary.",
    disclaimer: "*On select floor plans. Offer ends Sep 30, 2026.",
    cta: "See apartments",
    status: "active",
    dates: "Sep 1–Sep 30, 2026",
    sort: 1,
  },
  {
    id: "gift-card",
    title: "$500 Gift Card",
    description: "Move in by October 15 and receive a $500 gift card.",
    disclaimer: "*New residents only. While supplies last.",
    cta: "Claim offer",
    status: "active",
    dates: "Oct 1–Oct 15, 2026",
    sort: 2,
  },
  {
    id: "waived-fees",
    title: "Application Fees Waived",
    description: "We’re covering application fees on all 2-bedroom homes.",
    disclaimer: "*Offer ended Aug 1, 2026.",
    cta: "Apply now",
    status: "expired",
    dates: "Jul 1–Aug 1, 2026",
    sort: 3,
  },
];

const THEME_COLORS = [
  { name: "Primary", hex: "#94abf9" },
  { name: "Secondary", hex: "#f598ff" },
  { name: "Tertiary", hex: "#e5e9fd" },
  { name: "White", hex: "#ffffff" },
  { name: "Dark", hex: "#171d3a" },
  { name: "Custom", hex: "#d2d2d2" },
];

const BUTTON_PRESETS = [
  { id: "primary", label: "Primary", chip: "primary" },
  { id: "secondary", label: "Secondary", chip: "secondary" },
  { id: "tertiary", label: "Tertiary", chip: "tertiary" },
  { id: "text-link", label: "Text Link", chip: "text-link" },
];

const WIDTHS = {
  full: "100%",
  wide: "92%",
  standard: "78%",
  narrow: "56%",
};

const state = {
  specialId: "month-free",
  forceEmpty: false,
  fallbackOn: true,
  fallbackText: "Check back soon for current specials.",
  layout: "module",
  align: "left",
  background: "solid",
  solidColor: { name: "Tertiary", hex: "#e5e9fd" },
  overlayTint: { name: "Dark", hex: "#171d3a" },
  maxWidth: "full",
  customWidth: 70,
  containerAlign: "center",
  titleStyle: "h2",
  descStyle: "body",
  discStyle: "caption",
  textColor: { name: "Dark", hex: "#171d3a" },
  buttonPreset: "primary",
  buttonAlign: "left",
  hoverColor: { name: "Primary", hex: "#94abf9" },
  padding: 1,
  paddingCustom: false,
  animation: "",
  speed: "normal",
  blockWidth: 100,
  blockWidthCustom: false,
  position: "default",
  layer: 1,
  parallax: false,
  review: "active",
};

const fieldMenus = [
  { trigger: sourceTrigger, menu: sourceMenu },
  { trigger: bgTrigger, menu: bgMenu },
  { trigger: widthTrigger, menu: widthMenu },
  { trigger: titleStyleTrigger, menu: titleStyleMenu },
  { trigger: descStyleTrigger, menu: descStyleMenu },
  { trigger: discStyleTrigger, menu: discStyleMenu },
  { trigger: animationTrigger, menu: animationMenu },
  { trigger: positioningTrigger, menu: positioningMenu },
];

function announce(message) {
  if (live) live.textContent = message;
}

function placeOverlay(trigger, menu) {
  const rect = trigger.getBoundingClientRect();
  menu.style.position = "fixed";
  menu.style.top = `${Math.round(rect.bottom + 8)}px`;
  menu.style.left = `${Math.round(rect.left)}px`;
  menu.style.width = `${Math.round(rect.width)}px`;
  menu.style.zIndex = "40";
  menu.style.margin = "0";
}

function clearOverlay(menu) {
  menu.style.position = "";
  menu.style.top = "";
  menu.style.left = "";
  menu.style.width = "";
  menu.style.zIndex = "";
  menu.style.margin = "";
}

function closeMenus() {
  fieldMenus.forEach(({ trigger, menu }) => {
    if (!menu || !trigger) return;
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    clearOverlay(menu);
  });
}

function openMenu(trigger, menu) {
  const open = menu.hidden;
  closeMenus();
  if (!open) return;
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  placeOverlay(trigger, menu);
}

function bindMenu(trigger, menu, onPick) {
  if (!trigger || !menu) return;

  trigger.addEventListener("click", () => {
    openMenu(trigger, menu);
  });

  menu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", () => {
      menu.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      closeMenus();
      onPick(option);
    });
  });
}

function bindChoiceGroup(selector, onSelect) {
  const group = document.querySelector(selector);
  if (!group) return;
  group.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      onSelect(button);
    });
  });
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const n = Number.parseInt(value, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function selectedSpecial() {
  return SPECIALS.find((item) => item.id === state.specialId) || null;
}

function liveSpecial() {
  return SPECIALS.filter((item) => item.status === "active").sort((a, b) => a.sort - b.sort)[0] || null;
}

function isLiveSpecial(special) {
  const live = liveSpecial();
  return Boolean(special && live && special.id === live.id);
}

function resolvedSpecial() {
  if (state.forceEmpty) return null;
  const special = selectedSpecial();
  if (!special || special.status === "expired") return null;
  return special;
}

function setTab(tab) {
  closeMenus();
  setDesignLayer(null);
  document.querySelectorAll(".tab[role='tab']").forEach((button) => {
    const selected = button.id === `tab-${tab}`;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${tab}`;
  });
  const panels = document.querySelector(".tab-panels");
  if (panels) panels.scrollTop = 0;
}

function setDesignLayer(name) {
  closeMenus();
  const root = document.querySelector("#design-root");
  const main = document.querySelector("#panel-main");
  const panel = document.querySelector("#floater");
  document.querySelectorAll("[data-design-layer]").forEach((pane) => {
    pane.hidden = pane.dataset.designLayer !== name;
  });
  if (root) root.hidden = Boolean(name);
  if (main) {
    main.hidden = Boolean(name);
    main.setAttribute("aria-hidden", String(Boolean(name)));
  }
  if (panel) {
    panel.setAttribute("aria-label", name ? "Text Styles" : "Block settings");
  }
  if (name) {
    document.querySelector(`[data-design-layer="${name}"] [data-layer-back]`)?.focus();
  }
}

function setReviewChip(name) {
  document.querySelectorAll(".chip[data-state], .chip[data-tab-only]").forEach((chip) => {
    const isState = chip.dataset.state === name;
    const isTab = chip.dataset.tabOnly && name === chip.dataset.tabOnly;
    chip.classList.toggle("active", Boolean(isState || isTab));
  });
}

function setMenuValue(menu, triggerValue, attr, value, label) {
  triggerValue.textContent = label;
  menu.querySelectorAll("button").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset[attr] === value));
  });
}

function setChoice(selector, attr, value) {
  const group = document.querySelector(selector);
  group.querySelectorAll("button").forEach((button) => {
    const selected = button.dataset[attr] === value || (attr === "pad" && button.classList.contains("tune") && state.paddingCustom);
    button.classList.toggle("active", Boolean(selected));
  });
}

function presetChipMarkup(chip) {
  return `<span class="preset-chip preset-chip-${chip}"><span class="preset-chip-label">Button</span></span>`;
}

function mountButtonPreset(el, { prefix, selected, onChange }) {
  const labelId = `${prefix}-preset-label`;
  const triggerId = `${prefix}-preset-trigger`;
  const valueId = `${prefix}-preset-value`;
  const menuId = `${prefix}-preset-menu`;
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
    <p class="preset-label" id="${labelId}">Button Style</p>
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
    openMenu(trigger, menu);
  });

  menu.querySelectorAll("[data-preset]").forEach((option) => {
    option.addEventListener("click", () => {
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

  const siteStyles = menu.querySelector(".preset-site-styles");
  if (siteStyles) {
    siteStyles.addEventListener("click", () => {
      closeMenus();
      announce("Edit Site Styles is a site-level action in this file.");
    });
  }
}

function mountColorCard(el, { selected, onChange }) {
  const options = THEME_COLORS.map((color) => {
    const current = color.name === selected.name ? selected : color;
    const active = color.name === selected.name;
    return `<li>
      <button type="button" data-color="${color.name}" data-hex="${current.hex}" aria-selected="${active}">
        <span class="swatch" style="background:${current.hex}"></span>
        ${color.name}
      </button>
    </li>`;
  }).join("");

  el.innerHTML = `
    <button class="color-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Color">
      <span class="swatch" style="background:${selected.hex}"></span>
      <span class="color-name">${selected.name}</span>
      <span class="icon-button" aria-hidden="true">
        <span class="icon-24">
          <img src="assets/icon-chevron.svg" alt="" width="24" height="24" />
        </span>
      </span>
    </button>
    <ul class="color-menu" hidden role="listbox" aria-label="Colors">
      ${options}
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

  trigger.addEventListener("click", () => {
    openMenu(trigger, menu);
  });

  menu.querySelectorAll("[data-color]").forEach((option) => {
    option.addEventListener("click", () => {
      const next = { name: option.dataset.color, hex: option.dataset.hex };
      name.textContent = next.name;
      swatch.style.background = next.hex;
      menu.querySelectorAll("[data-color]").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      closeMenus();
      onChange(next);
    });
  });

  const siteStyles = menu.querySelector(".color-site-styles");
  if (siteStyles) {
    siteStyles.addEventListener("click", () => {
      closeMenus();
      announce("Edit Site Styles is a site-level action in this file.");
    });
  }
}

function fillSpecialMenu() {
  sourceMenu.innerHTML = SPECIALS.map((special) => {
    const selected = special.id === state.specialId;
    const tag = isLiveSpecial(special)
      ? `<span class="lightbox-status is-active">Active</span>`
      : "";
    return `<li>
      <button type="button" role="option" data-special="${special.id}" aria-selected="${selected}">
        <span class="special-option-title">${special.title}</span>
        ${tag}
      </button>
    </li>`;
  }).join("");

  sourceMenu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", () => {
      closeMenus();
      state.specialId = option.dataset.special;
      state.forceEmpty = false;
      render();
    });
  });
}

function fillLightbox() {
  lightboxList.innerHTML = SPECIALS.map((special) => {
    const selected = special.id === state.specialId;
    return `<li>
      <button type="button" class="lightbox-item" data-special="${special.id}" aria-selected="${selected}">
        <span class="lightbox-item-copy">
          <span class="lightbox-item-title">${special.title}</span>
          <span class="lightbox-item-meta">${special.dates}</span>
        </span>
        <span class="lightbox-status is-${special.status}">${special.status}</span>
      </button>
    </li>`;
  }).join("");

  lightboxList.querySelectorAll(".lightbox-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.specialId = button.dataset.special;
      state.forceEmpty = false;
      state.review = "manual";
      setLightbox(false);
      render();
      setTab("content");
      setReviewChip("manual");
      announce("Selected special applied.");
    });
  });
}

function setLightbox(open) {
  lightbox.hidden = !open;
}

function setLayoutDefaults(layout) {
  state.layout = layout;
  if (layout === "banner") {
    state.background = "image";
    state.textColor = { name: "White", hex: "#ffffff" };
  } else {
    state.background = "solid";
    state.textColor = { name: "Dark", hex: "#171d3a" };
  }
  updateColorCard(document.querySelector("#text-color-field"), state.textColor);
}

function updateColorCard(el, color) {
  if (!el) return;
  const swatch = el.querySelector(".color-trigger .swatch");
  const name = el.querySelector(".color-name");
  if (swatch) swatch.style.background = color.hex;
  if (name) name.textContent = color.name;
  el.querySelectorAll("[data-color]").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.color === color.name));
    if (option.dataset.color === color.name) {
      option.dataset.hex = color.hex;
      const optionSwatch = option.querySelector(".swatch");
      if (optionSwatch) optionSwatch.style.background = color.hex;
    }
  });
}

function mountAllColors() {
  mountColorCard(solidColorField, {
    selected: state.solidColor,
    onChange: (color) => {
      state.solidColor = color;
      render();
    },
  });
  mountColorCard(tintColorField, {
    selected: state.overlayTint,
    onChange: (color) => {
      state.overlayTint = color;
      render();
    },
  });
  mountColorCard(document.querySelector("#text-color-field"), {
    selected: state.textColor,
    onChange: (color) => {
      state.textColor = color;
      render();
    },
  });
  mountColorCard(document.querySelector("#hover-color-field"), {
    selected: state.hoverColor,
    onChange: (color) => {
      state.hoverColor = color;
      render();
    },
  });
}

function render() {
  const special = resolvedSpecial();
  const showFallback = !special && state.fallbackOn;
  const hideBlock = !special && !state.fallbackOn;

  const picked = selectedSpecial();
  const liveSelected = isLiveSpecial(picked);
  sourceValue.textContent = picked ? picked.title : "Select a special";
  sourceStatus.hidden = !liveSelected;
  sourceTrigger.setAttribute(
    "aria-labelledby",
    liveSelected ? "source-label source-value source-status" : "source-label source-value"
  );
  sourceMenu.querySelectorAll("button").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.special === state.specialId));
  });

  fallbackToggle.classList.toggle("on", state.fallbackOn);
  fallbackToggle.setAttribute("aria-checked", String(state.fallbackOn));
  fallbackTextField.hidden = !state.fallbackOn;
  fallbackText.value = state.fallbackText;

  setChoice("#layout-source", "layout", state.layout);
  setChoice("#text-align-source", "align", state.align);
  setChoice("#container-align-source", "container", state.containerAlign);
  setMenuValue(
    bgMenu,
    bgValue,
    "bg",
    state.background,
    state.background === "solid" ? "Solid color" : "Image with overlay tint"
  );
  solidColorField.hidden = state.background !== "solid";
  imageField.hidden = state.background !== "image";
  tintColorField.hidden = state.background !== "image";

  const widthLabels = {
    full: "Full width",
    wide: "Wide",
    standard: "Standard",
    narrow: "Narrow",
    custom: "Custom",
  };
  setMenuValue(widthMenu, widthValue, "width", state.maxWidth, widthLabels[state.maxWidth]);
  customWidthField.hidden = state.maxWidth !== "custom";
  customWidth.value = String(state.customWidth);

  setMenuValue(
    titleStyleMenu,
    titleStyleValue,
    "titleStyle",
    state.titleStyle,
    `Heading ${state.titleStyle.replace("h", "")}`
  );
  const descLabels = { large: "Large", body: "Body", small: "Small" };
  setMenuValue(descStyleMenu, descStyleValue, "descStyle", state.descStyle, descLabels[state.descStyle]);
  const discLabels = { body: "Body", caption: "Caption", small: "Small" };
  setMenuValue(discStyleMenu, discStyleValue, "discStyle", state.discStyle, discLabels[state.discStyle]);
  setChoice("#btn-align-source", "btnAlign", state.buttonAlign);
  setChoice("#speed-source", "speed", state.speed);
  const animationLabels = {
    "": "None",
    "slide-y": "Slide From Bottom",
    "zoom-in": "Grow",
    "zoom-out-in": "Shrink",
    "zoom-in-more": "Zoom In",
    "zoom-out": "Zoom Out",
  };
  setMenuValue(animationMenu, animationValue, "animation", state.animation, animationLabels[state.animation]);

  const positionLabels = {
    default: "Default",
    absolute: "Absolute",
    fixed: "Fixed",
    relative: "Relative",
  };
  setMenuValue(positioningMenu, positioningValue, "position", state.position, positionLabels[state.position]);

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
  layerPos.value = String(state.layer);
  parallaxToggle.classList.toggle("on", state.parallax);
  parallaxToggle.setAttribute("aria-checked", String(state.parallax));

  document.querySelectorAll("#padding-source button").forEach((button) => {
    if (button.classList.contains("tune")) {
      button.classList.toggle("active", state.paddingCustom);
    } else {
      button.classList.toggle("active", !state.paddingCustom && button.dataset.pad === String(state.padding));
    }
  });
  customPaddingField.hidden = !state.paddingCustom;
  customPadding.value = String(state.padding);

  pageCard.classList.toggle("is-banner", state.layout === "banner");
  specialBlock.classList.toggle("is-banner", state.layout === "banner");
  specialBlock.classList.toggle("is-image", state.background === "image");
  specialBlock.style.backgroundColor = state.background === "solid" ? state.solidColor.hex : "";
  specialBlock.style.setProperty("--overlay", hexToRgba(state.overlayTint.hex, 0.55));
  specialBlock.style.padding = `${state.padding}em`;
  pageBody.removeAttribute("data-position");
  const positions = { default: "static", absolute: "absolute", fixed: "fixed", relative: "relative" };
  blockWrap.style.position = positions[state.position] || "static";
  blockWrap.style.width = `${state.blockWidth}%`;
  blockWrap.style.maxWidth = state.layout === "banner" || state.blockWidth < 100 ? "none" : "560px";
  blockWrap.style.zIndex = String(state.layer);
  blockWrap.classList.toggle("has-parallax", state.parallax);
  const animKey = `${state.animation}|${state.speed}`;
  specialBlock.style.setProperty("--anim-ms", state.speed === "fast" ? "0.35s" : "0.8s");
  if (specialBlock.dataset.animKey !== animKey) {
    specialBlock.dataset.animation = state.animation;
    specialBlock.dataset.animKey = animKey;
    if (state.animation) {
      specialBlock.style.animation = "none";
      void specialBlock.offsetWidth;
      specialBlock.style.animation = "";
    } else {
      specialBlock.style.animation = "none";
    }
  }

  const contentMax = state.maxWidth === "custom" ? `${state.customWidth}%` : WIDTHS[state.maxWidth];
  const aligned = state.layout === "banner" ? specialInner : specialBlock;
  const other = state.layout === "banner" ? specialBlock : specialInner;
  aligned.style.maxWidth = contentMax;
  aligned.style.marginLeft = state.containerAlign === "right" ? "auto" : state.containerAlign === "center" ? "auto" : "0";
  aligned.style.marginRight = state.containerAlign === "left" ? "auto" : state.containerAlign === "center" ? "auto" : "0";
  other.style.maxWidth = state.layout === "banner" ? "none" : "100%";
  if (state.layout === "banner") {
    specialBlock.style.marginLeft = "0";
    specialBlock.style.marginRight = "0";
  } else {
    specialInner.style.marginLeft = "0";
    specialInner.style.marginRight = "0";
  }

  specialInner.classList.remove("is-left", "is-center", "is-right");
  specialInner.classList.add(`is-${state.align}`);

  specialTitle.className = `special-title is-${state.titleStyle}`;
  specialTitle.style.color = state.textColor.hex;
  specialDesc.className = `special-desc is-${state.descStyle}`;
  specialDesc.style.color = state.textColor.hex;
  specialDisclaimer.className = `special-disclaimer is-${state.discStyle}`;
  specialDisclaimer.style.color = state.textColor.hex;
  fallbackPreview.style.color = state.textColor.hex;
  fallbackPreview.textContent = state.fallbackText;

  ctaRow.className = `special-cta-row is-${state.buttonAlign}`;
  specialCta.className = `special-cta preset-${state.buttonPreset}`;
  specialCta.style.setProperty("--cta-hover", state.hoverColor.hex);

  if (special) {
    specialTitle.textContent = special.title;
    specialDesc.textContent = special.description;
    specialDisclaimer.textContent = special.disclaimer;
    specialCta.textContent = special.cta;
  }

  specialBlock.hidden = hideBlock;
  hiddenCanvas.hidden = !hideBlock;
  specialCopy.hidden = !special;
  fallbackPreview.hidden = !showFallback;

  fillLightbox();
}

function setReviewState(name) {
  state.review = name;
  setLightbox(false);

  if (name === "active") {
    state.specialId = "month-free";
    state.forceEmpty = false;
    state.fallbackOn = true;
    setLayoutDefaults("module");
    state.align = "left";
    state.buttonAlign = "left";
    setTab("content");
  }
  if (name === "manual") {
    state.specialId = "gift-card";
    state.forceEmpty = false;
    setTab("content");
  }
  if (name === "fallback") {
    state.forceEmpty = true;
    state.fallbackOn = true;
    setTab("content");
  }
  if (name === "hidden") {
    state.forceEmpty = true;
    state.fallbackOn = false;
    setTab("content");
  }
  if (name === "banner") {
    state.specialId = "month-free";
    state.forceEmpty = false;
    setLayoutDefaults("banner");
    state.align = "center";
    state.buttonAlign = "center";
    setTab("design");
  }
  if (name === "lightbox") {
    setTab("content");
    setLightbox(true);
  }

  render();
  setReviewChip(name);
}

sourceTrigger.addEventListener("click", () => {
  openMenu(sourceTrigger, sourceMenu);
});

bindMenu(bgTrigger, bgMenu, (option) => {
  state.background = option.dataset.bg;
  render();
});
bindMenu(widthTrigger, widthMenu, (option) => {
  state.maxWidth = option.dataset.width;
  render();
});
bindMenu(titleStyleTrigger, titleStyleMenu, (option) => {
  state.titleStyle = option.dataset.titleStyle;
  render();
});
bindMenu(descStyleTrigger, descStyleMenu, (option) => {
  state.descStyle = option.dataset.descStyle;
  render();
});
bindMenu(discStyleTrigger, discStyleMenu, (option) => {
  state.discStyle = option.dataset.discStyle;
  render();
});
bindMenu(animationTrigger, animationMenu, (option) => {
  state.animation = option.dataset.animation;
  animationValue.textContent = option.textContent;
  render();
});
bindMenu(positioningTrigger, positioningMenu, (option) => {
  state.position = option.dataset.position;
  render();
});

bindChoiceGroup("#layout-source", (button) => {
  setLayoutDefaults(button.dataset.layout);
  render();
});
bindChoiceGroup("#text-align-source", (button) => {
  state.align = button.dataset.align;
  render();
});
bindChoiceGroup("#container-align-source", (button) => {
  state.containerAlign = button.dataset.container;
  render();
});
bindChoiceGroup("#btn-align-source", (button) => {
  state.buttonAlign = button.dataset.btnAlign;
  render();
});
bindChoiceGroup("#speed-source", (button) => {
  state.speed = button.dataset.speed;
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

parallaxToggle.addEventListener("click", () => {
  state.parallax = !state.parallax;
  render();
});

layerPos.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  if (!Number.isFinite(value)) return;
  state.layer = value;
  render();
});

document.querySelectorAll("#padding-source button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("tune")) {
      state.paddingCustom = true;
      state.padding = Number.parseFloat(customPadding.value) || 1;
    } else {
      state.paddingCustom = false;
      state.padding = Number.parseFloat(button.dataset.pad);
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

customWidth.addEventListener("input", () => {
  const value = Number.parseInt(customWidth.value, 10);
  if (!Number.isFinite(value)) return;
  state.customWidth = value;
  render();
});

fallbackToggle.addEventListener("click", () => {
  state.fallbackOn = !state.fallbackOn;
  render();
});

fallbackText.addEventListener("input", () => {
  state.fallbackText = fallbackText.value;
  render();
});

document.querySelector("#manage-specials").addEventListener("click", () => {
  setLightbox(true);
  setReviewChip("lightbox");
  announce("Opened the Specials lightbox.");
});

document.querySelector("#lightbox-close").addEventListener("click", () => {
  setLightbox(false);
  setReviewChip(state.review === "lightbox" ? "active" : state.review);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) document.querySelector("#lightbox-close").click();
});

imageField.addEventListener("click", () => {
  announce("Replace image is a media library action in this mock.");
});

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.id.replace("tab-", "");
    setTab(name);
    if (name === "content") setReviewChip(state.review);
    else setReviewChip(name);
  });
});

document.querySelectorAll("[data-open-layer]").forEach((button) => {
  button.addEventListener("click", () => {
    setDesignLayer(button.dataset.openLayer);
  });
});

document.querySelectorAll("[data-layer-back]").forEach((button) => {
  button.addEventListener("click", () => {
    setDesignLayer(null);
  });
});

document.querySelectorAll(".chip[data-state]").forEach((chip) => {
  chip.addEventListener("click", () => setReviewState(chip.dataset.state));
});

document.querySelectorAll(".chip[data-tab-only]").forEach((chip) => {
  chip.addEventListener("click", () => {
    setLightbox(false);
    setTab(chip.dataset.tabOnly);
    setReviewChip(chip.dataset.tabOnly);
  });
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

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".field") &&
    !event.target.closest(".color-card") &&
    !event.target.closest(".preset-field") &&
    !event.target.closest(".lightbox-panel")
  ) {
    closeMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenus();
  if (!lightbox.hidden) document.querySelector("#lightbox-close").click();
});

document.querySelector(".tab-panels").addEventListener("scroll", () => closeMenus());
window.addEventListener("resize", () => closeMenus());

fillSpecialMenu();
mountButtonPreset(buttonPresetField, {
  prefix: "cta",
  selected: state.buttonPreset,
  onChange: (preset) => {
    state.buttonPreset = preset;
    render();
  },
});
mountAllColors();
render();
setTab("content");

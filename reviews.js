const live = document.querySelector("#live");
const reviewsBlock = document.querySelector("#reviews-block");
const textBlockAbove = document.querySelector("#text-block-above");
const carouselGrid = document.querySelector("#carousel-grid");
const reviewsList = document.querySelector("#reviews-list");
const widgetCard = document.querySelector("#widget-card");
const widgetStars = document.querySelector("#widget-stars");
const widgetCount = document.querySelector("#widget-count");
const widgetYelp = document.querySelector("#widget-yelp");
const widgetLink = document.querySelector("#widget-link");
const loadMore = document.querySelector("#load-more");
const navArrows = document.querySelector("#nav-arrows");
const layoutTrigger = document.querySelector("#layout-trigger");
const layoutMenu = document.querySelector("#layout-menu");
const layoutValue = document.querySelector("#layout-value");
const colsTrigger = document.querySelector("#cols-trigger");
const colsMenu = document.querySelector("#cols-menu");
const colsValue = document.querySelector("#cols-value");
const maxTrigger = document.querySelector("#max-trigger");
const maxMenu = document.querySelector("#max-menu");
const maxValue = document.querySelector("#max-value");
const actionTrigger = document.querySelector("#action-trigger");
const actionMenu = document.querySelector("#action-menu");
const actionValue = document.querySelector("#action-value");
const slugTrigger = document.querySelector("#slug-trigger");
const slugMenu = document.querySelector("#slug-menu");
const slugValue = document.querySelector("#slug-value");
const starStyleTrigger = document.querySelector("#star-style-trigger");
const starStyleMenu = document.querySelector("#star-style-menu");
const starStyleValue = document.querySelector("#star-style-value");
const navStyleTrigger = document.querySelector("#nav-style-trigger");
const navStyleMenu = document.querySelector("#nav-style-menu");
const navStyleValue = document.querySelector("#nav-style-value");
const navStylePreview = document.querySelector("#nav-style-preview");
const bgTrigger = document.querySelector("#bg-trigger");
const bgMenu = document.querySelector("#bg-menu");
const bgValue = document.querySelector("#bg-value");
const animationTrigger = document.querySelector("#animation-trigger");
const animationMenu = document.querySelector("#animation-menu");
const animationValue = document.querySelector("#animation-value");
const positioningTrigger = document.querySelector("#positioning-trigger");
const positioningMenu = document.querySelector("#positioning-menu");
const positioningValue = document.querySelector("#positioning-value");
const customBlockWidthField = document.querySelector("#custom-block-width-field");
const customBlockWidth = document.querySelector("#custom-block-width");
const layerPos = document.querySelector("#layer-pos");
const blockWrap = document.querySelector("#block-wrap");
const shadowOpacity = document.querySelector("#shadow-opacity");
const shadowOpacityRange = document.querySelector("#shadow-opacity-range");
const shadowX = document.querySelector("#shadow-x");
const shadowY = document.querySelector("#shadow-y");
const shadowBlur = document.querySelector("#shadow-blur");
const shadowSpread = document.querySelector("#shadow-spread");
const dropShadowFields = document.querySelector("#drop-shadow-fields");
const radiusInput = document.querySelector("#radius");
const radiusIndividualBtn = document.querySelector("#radius-individual");
const radiusIndividualPanel = document.querySelector("#radius-individual-panel");
const radiusCornerInputs = {
  tl: document.querySelector("#radius-tl"),
  tr: document.querySelector("#radius-tr"),
  bl: document.querySelector("#radius-bl"),
  br: document.querySelector("#radius-br"),
};
const extUrl = document.querySelector("#ext-url");
const customPaddingField = document.querySelector("#custom-padding-field");
const customPadding = document.querySelector("#custom-padding");
const deviceBtn = document.querySelector("#device-btn");
const loadMorePresetField = document.querySelector("#load-more-preset-field");

const REVIEWS = [
  {
    initials: "JM",
    name: "J. M.",
    source: "Google",
    rating: 5,
    text: "Great community and responsive staff. Would recommend to friends looking in the area.",
  },
  {
    initials: "AK",
    name: "A. K.",
    source: "Manual",
    rating: 4,
    text: "Love the amenities and location. Move-in was smooth.",
  },
  {
    initials: "RL",
    name: "R. L.",
    source: "Google",
    rating: 5,
    text: "Quiet building and well-maintained grounds.",
  },
  {
    initials: "PT",
    name: "P. T.",
    source: "Yelp",
    rating: 4,
    text: "Pet-friendly policies made our move easy.",
  },
];

const THEME_COLORS = [
  { name: "Primary", hex: "#94abf9" },
  { name: "Secondary", hex: "#f598ff" },
  { name: "Tertiary", hex: "#e5e9fd" },
  { name: "White", hex: "#ffffff" },
  { name: "Dark", hex: "#171d3a" },
  { name: "Gold", hex: "#eba703" },
  { name: "Custom", hex: "#d2d2d2" },
];

const BUTTON_PRESETS = [
  { id: "primary", label: "Primary", chip: "primary" },
  { id: "secondary", label: "Secondary", chip: "secondary" },
  { id: "tertiary", label: "Tertiary", chip: "tertiary" },
  { id: "text-link", label: "Text Link", chip: "text-link" },
];

const LAYOUT_LABELS = {
  carousel: "Carousel",
  widgets: "Widgets",
  listView: "List View",
};

const ACTION_LABELS = {
  none: "None",
  existing_screen: "Existing Screen",
  external_url: "External URL",
  open_lightbox: "Open Screen in Lightbox",
};

const STAR_LABELS = {
  solid: "Solid",
  outline: "Solid and Outlines",
  square: "Square",
  circle: "Circle",
};

const NAV_STYLE_LABELS = {
  chevron: "Chevron",
  arrows: "Arrows",
  text: "Text",
  custom: "Custom",
};

const BG_LABELS = {
  solid: "Solid Color",
  gradient: "Gradient",
  image: "Image",
  gallery: "Gallery",
};

const ANIMATION_LABELS = {
  "": "None",
  "slide-y": "Slide From Bottom",
  "zoom-in": "Grow",
  "zoom-out-in": "Shrink",
  "zoom-in-more": "Zoom In",
  "zoom-out": "Zoom Out",
};

const POSITION_LABELS = {
  default: "Default",
  absolute: "Absolute",
  fixed: "Fixed",
  relative: "Relative",
};

const LINK_HINTS = {
  none: "Not linked",
  existing_screen: "Whole block is clickable → Reviews screen",
  external_url: "Whole block is clickable → External URL",
  open_lightbox: "Whole block is clickable → Lightbox",
};

const state = {
  layout: "carousel",
  align: "left",
  showName: true,
  readMore: true,
  profileImage: true,
  showSource: true,
  reviewCount: true,
  yelp: true,
  cols: 2,
  maxReviews: 3,
  action: "none",
  slug: "/reviews",
  extUrl: "",
  newTab: true,
  cardColor: { name: "White", hex: "#ffffff" },
  radius: 8,
  radiusIndividual: false,
  radii: { tl: 8, tr: 8, br: 8, bl: 8 },
  dropShadow: true,
  shadowColor: { name: "Dark", hex: "#171d3a" },
  shadowOpacity: 15,
  shadowX: 0,
  shadowY: 17,
  shadowBlur: 25,
  shadowSpread: 0,
  starStyle: "solid",
  starColor: { name: "Gold", hex: "#eba703" },
  navStyle: "chevron",
  navAlign: "bottom-center",
  navColor: { name: "Secondary", hex: "#f598ff" },
  loadMorePreset: "primary",
  background: "solid",
  bgColor: { name: "White", hex: "#ffffff" },
  padding: 16,
  paddingCustom: false,
  animation: "",
  speed: "normal",
  parallax: false,
  blockWidth: 100,
  blockWidthCustom: false,
  position: "default",
  layer: 1,
};

const fieldMenus = [
  { trigger: layoutTrigger, menu: layoutMenu },
  { trigger: colsTrigger, menu: colsMenu },
  { trigger: maxTrigger, menu: maxMenu },
  { trigger: actionTrigger, menu: actionMenu },
  { trigger: slugTrigger, menu: slugMenu },
  { trigger: starStyleTrigger, menu: starStyleMenu },
  { trigger: navStyleTrigger, menu: navStyleMenu },
  { trigger: bgTrigger, menu: bgMenu },
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
  trigger.addEventListener("click", () => openMenu(trigger, menu));
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

function bindSwitch(el, key) {
  el.addEventListener("click", () => {
    state[key] = !state[key];
    render();
  });
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
  const panels = document.querySelector(".tab-panels");
  if (panels) panels.scrollTop = 0;
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
    option.setAttribute("aria-selected", String(option.dataset[attr] === String(value)));
  });
}

function setChoice(selector, attr, value) {
  const group = document.querySelector(selector);
  if (!group) return;
  group.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset[attr] === String(value));
  });
}

function navStyleIcons(style) {
  if (style === "arrows") {
    return `
      <img src="assets/icon-nav-arrow-left.svg" alt="" width="16" height="24" />
      <img src="assets/icon-nav-arrow-right.svg" alt="" width="16" height="24" />
    `;
  }
  if (style === "text") {
    return `<img src="assets/icon-nav-text.svg" alt="" width="16.3768" height="24" />`;
  }
  if (style === "custom") {
    return `<img src="assets/icon-nav-custom.svg" alt="" width="24" height="24" />`;
  }
  return `
    <img src="assets/icon-nav-chevron-left.svg" alt="" width="16" height="24" />
    <img src="assets/icon-nav-chevron-right.svg" alt="" width="16" height="24" />
  `;
}

function navIconMark(src, width, height) {
  return `<span class="nav-icon" style="width:${width}px;height:${height}px;-webkit-mask-image:url('${src}');mask-image:url('${src}');"></span>`;
}

function navButtonContent(dir) {
  if (state.navStyle === "text") return dir === "prev" ? "Prev" : "Next";
  if (state.navStyle === "custom") {
    return navIconMark("assets/icon-nav-custom.svg", 24, 24);
  }
  if (state.navStyle === "arrows") {
    const file = dir === "prev" ? "icon-nav-arrow-left.svg" : "icon-nav-arrow-right.svg";
    return navIconMark(`assets/${file}`, 16, 24);
  }
  const file = dir === "prev" ? "icon-nav-chevron-left.svg" : "icon-nav-chevron-right.svg";
  return navIconMark(`assets/${file}`, 16, 24);
}

function starMarks(rating, style) {
  return [1, 2, 3, 4, 5]
    .map((index) => {
      const empty = style === "outline" && index > rating;
      return `<span class="star${empty ? " is-empty" : ""}" aria-hidden="true"></span>`;
    })
    .join("");
}

function starMarkup(rating, style) {
  return `<div class="stars" data-style="${style}" aria-label="${rating} out of 5">${starMarks(rating, style)}</div>`;
}

function reviewCard(review) {
  const avatar = state.profileImage ? `<div class="avatar">${review.initials}</div>` : "";
  const more = state.readMore ? `<span class="read-more">Read more</span>` : "";
  const name = state.showName ? review.name : "";
  const source = state.showSource ? review.source : "";
  const metaBits = [source, name].filter(Boolean).join(" · ");
  const meta = metaBits ? `<div class="review-meta">${metaBits}</div>` : "";
  return `<article class="review-card${state.readMore ? " is-clamp" : ""}">
    ${avatar}
    ${starMarkup(review.rating, state.starStyle)}
    <p>${review.text}</p>
    ${more}
    ${meta}
  </article>`;
}

function visibleReviews() {
  const limit = state.layout === "carousel" ? Math.min(state.maxReviews, state.cols) : 2;
  return REVIEWS.slice(0, Math.max(1, limit));
}

function presetChipMarkup(chip) {
  return `<span class="preset-chip preset-chip-${chip}"><span class="preset-chip-label">Button</span></span>`;
}

function mountButtonPreset(el, { prefix, selected, onChange }) {
  const labelId = `${prefix}-preset-label`;
  const valueId = `${prefix}-preset-value`;
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
    <p class="preset-label" id="${labelId}">Load more style</p>
    <button
      type="button"
      class="preset-trigger"
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
    <ul class="preset-menu" hidden role="listbox" aria-labelledby="${labelId}">
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

  trigger.addEventListener("click", () => openMenu(trigger, menu));
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

  menu.querySelector(".preset-site-styles")?.addEventListener("click", () => {
    closeMenus();
    announce("Edit Site Styles is a site-level action in this file.");
  });
}

function mountColorCard(el, { selected, label, onChange, colors = THEME_COLORS }) {
  const options = colors.map((color) => {
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

  trigger.addEventListener("click", () => openMenu(trigger, menu));
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

  menu.querySelector(".color-site-styles")?.addEventListener("click", () => {
    closeMenus();
    announce("Edit Site Styles is a site-level action in this file.");
  });
}

function setSwitch(el, on) {
  el.classList.toggle("on", on);
  el.setAttribute("aria-checked", String(on));
}

function hexToRgb(hex) {
  const raw = hex.replace("#", "");
  const value = raw.length === 3 ? raw.split("").map((part) => part + part).join("") : raw;
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastTextColor(backgroundHex) {
  return relativeLuminance(backgroundHex) > 0.179 ? "#000000" : "#ffffff";
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clampInt(value, min, max, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function syncNumber(input, value) {
  if (document.activeElement !== input) input.value = String(value);
}

function cardShadow() {
  if (state.layout !== "carousel" || !state.dropShadow) return "none";
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${hexToRgba(
    state.shadowColor.hex,
    state.shadowOpacity / 100
  )}`;
}

function render() {
  document.querySelectorAll("[data-show]").forEach((section) => {
    const show = (section.dataset.show || "").split(",");
    section.hidden = !show.includes(state.layout);
  });

  setMenuValue(layoutMenu, layoutValue, "layout", state.layout, LAYOUT_LABELS[state.layout]);
  setMenuValue(colsMenu, colsValue, "cols", String(state.cols), String(state.cols));
  setMenuValue(maxMenu, maxValue, "max", String(state.maxReviews), String(state.maxReviews));
  setMenuValue(actionMenu, actionValue, "action", state.action, ACTION_LABELS[state.action]);
  setMenuValue(slugMenu, slugValue, "slug", state.slug, state.slug);
  setMenuValue(starStyleMenu, starStyleValue, "starStyle", state.starStyle, STAR_LABELS[state.starStyle]);
  setMenuValue(navStyleMenu, navStyleValue, "navStyle", state.navStyle, NAV_STYLE_LABELS[state.navStyle]);
  setMenuValue(bgMenu, bgValue, "bg", state.background, BG_LABELS[state.background]);
  setMenuValue(animationMenu, animationValue, "animation", state.animation, ANIMATION_LABELS[state.animation]);
  setMenuValue(positioningMenu, positioningValue, "position", state.position, POSITION_LABELS[state.position]);
  setChoice("#speed-source", "speed", state.speed);
  setSwitch(document.querySelector("#parallax-toggle"), state.parallax);

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
  if (document.activeElement !== customBlockWidth) {
    customBlockWidth.value = String(state.blockWidth);
  }
  if (document.activeElement !== layerPos) {
    layerPos.value = String(state.layer);
  }

  setChoice("#align-source", "align", state.align);
  setChoice("#nav-align-source", "navAlign", state.navAlign);
  if (navStylePreview) navStylePreview.innerHTML = navStyleIcons(state.navStyle);

  setSwitch(document.querySelector("#name-toggle"), state.showName);
  setSwitch(document.querySelector("#read-more-toggle"), state.readMore);
  setSwitch(document.querySelector("#profile-toggle"), state.profileImage);
  setSwitch(document.querySelector("#source-toggle"), state.showSource);
  setSwitch(document.querySelector("#count-toggle"), state.reviewCount);
  setSwitch(document.querySelector("#yelp-toggle"), state.yelp);
  setSwitch(document.querySelector("#new-tab-toggle"), state.newTab);
  setSwitch(document.querySelector("#shadow-toggle"), state.dropShadow);
  dropShadowFields.hidden = !state.dropShadow;
  syncNumber(shadowOpacity, state.shadowOpacity);
  if (document.activeElement !== shadowOpacityRange) {
    shadowOpacityRange.value = String(state.shadowOpacity);
  }
  syncNumber(shadowX, state.shadowX);
  syncNumber(shadowY, state.shadowY);
  syncNumber(shadowBlur, state.shadowBlur);
  syncNumber(shadowSpread, state.shadowSpread);

  document.querySelector("#link-screen").hidden = state.action !== "existing_screen";
  document.querySelector("#link-url").hidden = state.action !== "external_url";
  document.querySelector("#link-new-tab").hidden = state.action !== "external_url";
  document.querySelector("#bg-color-field").hidden = state.background === "image" || state.background === "gallery";
  document.querySelector("#bg-color-label").hidden = state.background === "image" || state.background === "gallery";
  document.querySelector("#bg-image-field").hidden = state.background !== "image" && state.background !== "gallery";

  if (document.activeElement !== radiusInput) {
    radiusInput.value = radiiUniform() ? String(state.radii.tl) : "Mixed";
  }
  radiusIndividualBtn.setAttribute("aria-pressed", String(state.radiusIndividual));
  radiusIndividualBtn.setAttribute("aria-expanded", String(state.radiusIndividual));
  radiusIndividualPanel.hidden = !state.radiusIndividual;
  Object.entries(radiusCornerInputs).forEach(([key, input]) => {
    if (document.activeElement !== input) input.value = String(state.radii[key]);
  });
  extUrl.value = state.extUrl;

  document.querySelectorAll("#padding-source button").forEach((button) => {
    if (button.classList.contains("tune")) {
      button.classList.toggle("active", state.paddingCustom);
    } else {
      button.classList.toggle("active", !state.paddingCustom && button.dataset.pad === String(state.padding));
    }
  });
  customPaddingField.hidden = !state.paddingCustom;
  customPadding.value = String(state.padding);

  textBlockAbove.hidden = state.layout === "widgets";
  document.querySelector("#preview-carousel").hidden = state.layout !== "carousel";
  document.querySelector("#preview-widgets").hidden = state.layout !== "widgets";
  document.querySelector("#preview-listView").hidden = state.layout !== "listView";

  const cards = visibleReviews().map(reviewCard).join("");
  carouselGrid.innerHTML = cards;
  reviewsList.innerHTML = REVIEWS.slice(0, 2).map(reviewCard).join("");
  carouselGrid.style.setProperty("--cols", String(state.cols));

  widgetStars.innerHTML = starMarks(5, state.starStyle);
  widgetStars.dataset.style = state.starStyle;
  widgetStars.setAttribute("aria-label", "5 out of 5");
  widgetCount.hidden = !state.reviewCount;
  widgetYelp.hidden = !state.yelp;
  widgetLink.textContent = LINK_HINTS[state.action];
  widgetCard.classList.toggle("is-linked", state.action !== "none");
  widgetCard.classList.toggle("unlinked", state.action === "none");

  navArrows.dataset.style = state.navStyle;
  navArrows.dataset.align = state.navAlign;
  navArrows.style.setProperty("--nav-color", state.navColor.hex);
  navArrows.querySelector('[data-nav="prev"]').innerHTML = navButtonContent("prev");
  navArrows.querySelector('[data-nav="next"]').innerHTML = navButtonContent("next");

  loadMore.className = `load-more preset-${state.loadMorePreset}`;

  reviewsBlock.style.setProperty("--card-bg", state.cardColor.hex);
  reviewsBlock.style.setProperty("--copy-color", contrastTextColor(state.cardColor.hex));
  applyRadiusVars();
  reviewsBlock.style.setProperty("--star", state.starColor.hex);
  reviewsBlock.style.setProperty("--card-shadow", cardShadow());
  reviewsBlock.classList.toggle("is-center", state.align === "center");
  reviewsBlock.classList.toggle("is-left", state.align === "left");
  reviewsBlock.style.padding = `${state.padding}px`;
  reviewsBlock.style.setProperty("--anim-ms", state.speed === "fast" ? "0.35s" : "0.8s");

  const positions = { default: "static", absolute: "absolute", fixed: "fixed", relative: "relative" };
  blockWrap.style.position = positions[state.position] || "static";
  blockWrap.style.width = `${state.blockWidth}%`;
  blockWrap.style.maxWidth = state.blockWidth < 100 ? "none" : "640px";
  blockWrap.style.zIndex = String(state.layer);
  blockWrap.classList.toggle("has-parallax", state.parallax);

  if (state.background === "solid") {
    reviewsBlock.style.background = state.bgColor.hex === "#ffffff" ? "transparent" : state.bgColor.hex;
  } else if (state.background === "gradient") {
    reviewsBlock.style.background = `linear-gradient(165deg, ${state.bgColor.hex}, #e8ecf1)`;
  } else {
    reviewsBlock.style.background =
      "linear-gradient(rgba(255,255,255,0.72), rgba(255,255,255,0.72)), linear-gradient(160deg, #9aadc8 0%, #5d6d88 42%, #2c3348 100%)";
  }

  const animKey = `${state.animation}|${state.speed}`;
  if (reviewsBlock.dataset.animKey !== animKey) {
    reviewsBlock.dataset.animation = state.animation;
    reviewsBlock.dataset.animKey = animKey;
    if (state.animation) {
      reviewsBlock.style.animation = "none";
      void reviewsBlock.offsetWidth;
      reviewsBlock.style.animation = "";
    } else {
      reviewsBlock.style.animation = "none";
    }
  }
}

function setLayout(layout) {
  state.layout = layout;
  render();
  setReviewChip(layout);
  announce(`${LAYOUT_LABELS[layout]} layout`);
}

bindMenu(layoutTrigger, layoutMenu, (option) => setLayout(option.dataset.layout));
bindMenu(colsTrigger, colsMenu, (option) => {
  state.cols = Number.parseInt(option.dataset.cols, 10);
  render();
});
bindMenu(maxTrigger, maxMenu, (option) => {
  state.maxReviews = Number.parseInt(option.dataset.max, 10);
  render();
});
bindMenu(actionTrigger, actionMenu, (option) => {
  state.action = option.dataset.action;
  render();
});
bindMenu(slugTrigger, slugMenu, (option) => {
  state.slug = option.dataset.slug;
  render();
});
bindMenu(starStyleTrigger, starStyleMenu, (option) => {
  state.starStyle = option.dataset.starStyle;
  render();
});
bindMenu(navStyleTrigger, navStyleMenu, (option) => {
  state.navStyle = option.dataset.navStyle;
  render();
});
bindMenu(bgTrigger, bgMenu, (option) => {
  state.background = option.dataset.bg;
  render();
});
bindMenu(animationTrigger, animationMenu, (option) => {
  state.animation = option.dataset.animation;
  render();
});
bindMenu(positioningTrigger, positioningMenu, (option) => {
  state.position = option.dataset.position;
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
  state.blockWidth = Math.min(100, Math.max(10, value));
  render();
});

layerPos.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  if (!Number.isFinite(value)) return;
  state.layer = Math.max(0, value);
  render();
});

bindChoiceGroup("#align-source", (button) => {
  state.align = button.dataset.align;
  render();
});
bindChoiceGroup("#nav-align-source", (button) => {
  state.navAlign = button.dataset.navAlign;
  render();
});

bindSwitch(document.querySelector("#name-toggle"), "showName");
bindSwitch(document.querySelector("#read-more-toggle"), "readMore");
bindSwitch(document.querySelector("#profile-toggle"), "profileImage");
bindSwitch(document.querySelector("#source-toggle"), "showSource");
bindSwitch(document.querySelector("#count-toggle"), "reviewCount");
bindSwitch(document.querySelector("#yelp-toggle"), "yelp");
bindSwitch(document.querySelector("#new-tab-toggle"), "newTab");
bindSwitch(document.querySelector("#shadow-toggle"), "dropShadow");
bindSwitch(document.querySelector("#parallax-toggle"), "parallax");

function bindShadowNumber(input, key, min, max) {
  const apply = () => {
    state[key] = clampInt(input.value, min, max, state[key]);
    render();
  };
  input.addEventListener("input", apply);
  input.addEventListener("change", apply);
}

bindShadowNumber(shadowOpacity, "shadowOpacity", 0, 100);
bindShadowNumber(shadowX, "shadowX", -200, 200);
bindShadowNumber(shadowY, "shadowY", -200, 200);
bindShadowNumber(shadowBlur, "shadowBlur", 0, 200);
bindShadowNumber(shadowSpread, "shadowSpread", -100, 100);

shadowOpacityRange.addEventListener("input", () => {
  state.shadowOpacity = clampInt(shadowOpacityRange.value, 0, 100, state.shadowOpacity);
  render();
});

function clampRadius(value) {
  return Math.min(30, Math.max(0, Number.parseInt(value, 10) || 0));
}

function radiiUniform() {
  const { tl, tr, br, bl } = state.radii;
  return tl === tr && tr === br && br === bl;
}

function setAllRadii(value) {
  state.radius = value;
  state.radii = { tl: value, tr: value, br: value, bl: value };
}

function applyRadiusVars() {
  reviewsBlock.style.setProperty("--radius", `${state.radii.tl}px`);
  reviewsBlock.style.setProperty("--radius-tl", `${state.radii.tl}px`);
  reviewsBlock.style.setProperty("--radius-tr", `${state.radii.tr}px`);
  reviewsBlock.style.setProperty("--radius-br", `${state.radii.br}px`);
  reviewsBlock.style.setProperty("--radius-bl", `${state.radii.bl}px`);
}

radiusInput.addEventListener("input", () => {
  if (radiusInput.value.toLowerCase() === "mixed") return;
  setAllRadii(clampRadius(radiusInput.value));
  render();
});

radiusIndividualBtn.addEventListener("click", () => {
  state.radiusIndividual = !state.radiusIndividual;
  render();
});

Object.entries(radiusCornerInputs).forEach(([key, input]) => {
  input.addEventListener("input", () => {
    const value = clampRadius(input.value);
    state.radii[key] = value;
    if (radiiUniform()) state.radius = value;
    render();
  });
});

extUrl.addEventListener("input", () => {
  state.extUrl = extUrl.value;
});

document.querySelectorAll("#padding-source button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("tune")) {
      state.paddingCustom = true;
      state.padding = Number.parseFloat(customPadding.value) || 16;
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

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.id.replace("tab-", "");
    setTab(name);
    if (name === "content") setReviewChip(state.layout);
    else setReviewChip(name);
  });
});

document.querySelectorAll(".chip[data-state]").forEach((chip) => {
  chip.addEventListener("click", () => {
    setTab("content");
    setLayout(chip.dataset.state);
  });
});

document.querySelectorAll(".chip[data-tab-only]").forEach((chip) => {
  chip.addEventListener("click", () => {
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
  announce(on ? "Device overrides on. Block padding can save per breakpoint." : "Device overrides off");
});

document.querySelector("#bg-image-field").addEventListener("click", () => {
  announce("Replace image is a media library action in this mock.");
});

document.querySelector("#load-more").addEventListener("click", () => {
  announce("Load more is a live-site action in this mock.");
});

widgetCard.addEventListener("click", () => {
  if (state.action === "none") return;
  announce(LINK_HINTS[state.action]);
});

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".field") &&
    !event.target.closest(".color-card") &&
    !event.target.closest(".preset-field")
  ) {
    closeMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenus();
});

document.querySelector(".tab-panels").addEventListener("scroll", () => closeMenus());
window.addEventListener("resize", () => closeMenus());

mountColorCard(document.querySelector("#card-color-field"), {
  selected: state.cardColor,
  label: "Review Color",
  onChange: (color) => {
    state.cardColor = color;
    render();
  },
});
mountColorCard(document.querySelector("#star-color-field"), {
  selected: state.starColor,
  label: "Star rating color",
  onChange: (color) => {
    state.starColor = color;
    render();
  },
});
mountColorCard(document.querySelector("#bg-color-field"), {
  selected: state.bgColor,
  label: "Background color",
  onChange: (color) => {
    state.bgColor = color;
    render();
  },
});
mountColorCard(document.querySelector("#nav-color-field"), {
  selected: state.navColor,
  label: "Nav Color",
  onChange: (color) => {
    state.navColor = color;
    render();
  },
});
mountColorCard(document.querySelector("#shadow-color-field"), {
  selected: state.shadowColor,
  label: "Drop shadow color",
  onChange: (color) => {
    state.shadowColor = color;
    render();
  },
});
mountButtonPreset(loadMorePresetField, {
  prefix: "load-more",
  selected: state.loadMorePreset,
  onChange: (preset) => {
    state.loadMorePreset = preset;
    render();
  },
});

render();
setTab("content");

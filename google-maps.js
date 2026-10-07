const pageCard = document.querySelector("#page-card");
const blockWrap = document.querySelector("#block-wrap");
const mapArt = document.querySelector("#map-art");
const mainPin = document.querySelector("#main-pin");
const coordsWarn = document.querySelector("#coords-warn");
const locProperty = document.querySelector("#loc-property");
const locCoordinates = document.querySelector("#loc-coordinates");
const offsetFields = document.querySelector("#offset-fields");
const customPinField = document.querySelector("#custom-pin-field");
const customStyle = document.querySelector("#custom-style");
const customPaddingField = document.querySelector("#custom-padding-field");
const customPadding = document.querySelector("#custom-padding");
const animationValue = document.querySelector("#animation-value");
const extraLocations = document.querySelector("#extra-locations");
const addLocationBtn = document.querySelector("#add-location");
const parentShell = document.querySelector("#parent-shell");
const locationShell = document.querySelector("#location-shell");
const locationBack = document.querySelector("#location-back");
const locationLayerTitle = document.querySelector("#location-layer-title");
const locEditName = document.querySelector("#loc-edit-name");
const locEditAddr = document.querySelector("#loc-edit-addr");
const locEditInfo = document.querySelector("#loc-edit-info");
const locEditLink = document.querySelector("#loc-edit-link");
const locEditPageFields = document.querySelector("#loc-edit-page-fields");
const locEditTitle = document.querySelector("#loc-edit-title");
const locEditSub = document.querySelector("#loc-edit-sub");
const locEditPageValue = document.querySelector("#loc-edit-page-value");
const floater = document.querySelector("#floater");
const deviceBtn = document.querySelector("#device-btn");
let extraCount = 0;
let editingExtraId = null;
const locations = new Map();
const locValue = document.querySelector("#loc-value");
const addressSearch = document.querySelector("#address-search");
const addressSearchMenu = document.querySelector("#address-search-menu");
const addressSearchBtn = document.querySelector("#address-search-btn");
const latInput = document.querySelector("#lat");
const lngInput = document.querySelector("#lng");
const zoomInput = document.querySelector("#zoom");
const zoomSlider = document.querySelector("#zoom-slider");
const pinWInput = document.querySelector("#pin-w");
const pinWSlider = document.querySelector("#pin-w-slider");

const locLabels = {
  property: "Use Property Location",
  coordinates: "Set Custom Location",
};

const geocodeFallback = {
  lat: "25.7617",
  lng: "-80.1918",
};

const customBlockWidthField = document.querySelector("#custom-block-width-field");
const customBlockWidth = document.querySelector("#custom-block-width");
const layerPos = document.querySelector("#layer-pos");
const positioningValue = document.querySelector("#positioning-value");

const state = {
  tab: "content",
  loc: "property",
  padding: 16,
  animation: "fade",
  speed: "normal",
  blockWidth: 100,
  blockWidthCustom: false,
  position: "default",
  layer: 1,
  zoom: 10,
  hideExtras: true,
  showInfo: false,
  missing: false,
  dropShadow: false,
  shadowColor: { name: "Dark", hex: "#171d3a" },
  shadowOpacity: 15,
  shadowX: 0,
  shadowY: 17,
  shadowBlur: 25,
  shadowSpread: 0,
  customPinUrl: "",
};

function closeMenus() {
  document.querySelectorAll(".field-menu, .more-menu, .icon-card-menu, .color-menu").forEach((menu) => {
    menu.hidden = true;
  });
  document
    .querySelectorAll(".field-trigger, .more-trigger, .icon-card-trigger, .combo-unit, .color-trigger")
    .forEach((trigger) => {
      trigger.setAttribute("aria-expanded", "false");
    });
  if (addressSearch) addressSearch.setAttribute("aria-expanded", "false");
}

function fillCoordinates(lat, lng) {
  if (latInput) latInput.value = lat;
  if (lngInput) lngInput.value = lng;
  state.missing = false;
  applyCanvasFlags();
}

function pickAddressSuggestion(option) {
  if (!option || !addressSearch) return;
  addressSearch.value = option.textContent.trim();
  fillCoordinates(option.dataset.lat || geocodeFallback.lat, option.dataset.lng || geocodeFallback.lng);
  addressSearchMenu.querySelectorAll("button").forEach((item) => {
    item.setAttribute("aria-selected", String(item === option));
  });
  closeMenus();
}

function filterAddressSuggestions(query) {
  if (!addressSearchMenu) return;
  const q = query.trim().toLowerCase();
  let visible = 0;
  addressSearchMenu.querySelectorAll("li").forEach((item) => {
    const option = item.querySelector("button");
    const match = !q || option.textContent.trim().toLowerCase().includes(q);
    item.hidden = !match;
    if (match) visible += 1;
  });
  if (visible > 0 && document.activeElement === addressSearch) {
    addressSearchMenu.hidden = false;
    addressSearch.setAttribute("aria-expanded", "true");
  } else {
    addressSearchMenu.hidden = true;
    addressSearch.setAttribute("aria-expanded", "false");
  }
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
      if (valueEl) valueEl.textContent = option.textContent.trim();
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

function setTab(tab) {
  closeMenus();
  if (locationShell && !locationShell.hidden) {
    closeLocationLayer();
  }
  state.tab = tab;
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

function setLoc(mode) {
  state.loc = mode;
  locProperty.hidden = mode !== "property";
  locCoordinates.hidden = mode !== "coordinates";
  if (locValue) locValue.textContent = locLabels[mode] || locLabels.property;
  document.querySelectorAll("#loc-menu button").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.loc === mode));
  });
}

function applyCanvasFlags() {
  pageCard.classList.toggle("hide-extras", state.hideExtras);
  pageCard.classList.toggle("show-info", state.showInfo && !state.hideExtras);
  pageCard.classList.toggle("missing", state.missing);
  coordsWarn.hidden = !state.missing;
}

function setState(name) {
  closeMenus();
  document.querySelectorAll(".chip[data-state]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.state === name);
  });
  document.querySelectorAll(".chip[data-tab-only]").forEach((chip) => {
    chip.classList.remove("active");
  });

  state.missing = false;
  state.hideExtras = true;
  state.showInfo = false;

  if (name === "property") {
    setLoc("property");
    setTab("content");
  }
  if (name === "coordinates") {
    setLoc("coordinates");
    setTab("content");
  }
  if (name === "missing") {
    setLoc("coordinates");
    state.missing = true;
    setTab("content");
  }
  if (name === "extras") {
    closeLocationLayer();
    ensureDemoExtraLocation();
    state.hideExtras = false;
    const first = locations.values().next().value;
    state.showInfo = first ? first.info : true;
    setTab("content");
  }
  applyCanvasFlags();
}

function setLocationLayer(open) {
  closeMenus();
  if (parentShell) {
    parentShell.hidden = open;
    parentShell.setAttribute("aria-hidden", String(open));
  }
  if (locationShell) {
    locationShell.hidden = !open;
    locationShell.setAttribute("aria-hidden", String(!open));
  }
  if (floater) {
    floater.setAttribute("aria-label", open ? "Add Location" : "Block settings");
  }
  if (open) {
    locationBack?.focus();
  }
}

function locationDisplayName(data = {}) {
  return data.name?.trim() || data.title?.trim() || "Untitled location";
}

function setLinkToPage(on) {
  if (locEditLink) {
    locEditLink.classList.toggle("on", on);
    locEditLink.setAttribute("aria-checked", String(on));
  }
  if (locEditPageFields) locEditPageFields.hidden = !on;
}

function readLocationForm() {
  const pageMenu = document.querySelector("#loc-edit-page-menu");
  const selected = pageMenu?.querySelector('button[aria-selected="true"]');
  const linkToPage = locEditLink?.classList.contains("on") ?? false;
  return {
    name: locEditName?.value.trim() || "",
    title: locEditTitle?.value.trim() || "",
    address: locEditAddr?.value.trim() || "",
    subtitle: locEditSub?.value.trim() || "",
    linkToPage,
    page: selected?.textContent.trim() || locEditPageValue?.textContent.trim() || "Contact",
    info: locEditInfo?.classList.contains("on") ?? true,
  };
}

function writeLocationForm(data = {}) {
  if (locEditName) locEditName.value = data.name || "";
  if (locEditAddr) locEditAddr.value = data.address || "";
  if (locEditTitle) locEditTitle.value = data.title || "";
  if (locEditSub) locEditSub.value = data.subtitle || "";
  const page = data.page || data.screen || "Contact";
  if (locEditPageValue) locEditPageValue.textContent = page;
  const pageMenu = document.querySelector("#loc-edit-page-menu");
  pageMenu?.querySelectorAll("button").forEach((option) => {
    option.setAttribute("aria-selected", String(option.textContent.trim() === page));
  });
  if (locEditInfo) {
    const on = data.info !== false;
    locEditInfo.classList.toggle("on", on);
    locEditInfo.setAttribute("aria-checked", String(on));
  }
  const linkOn =
    data.linkToPage === true ||
    (data.linkToPage == null && Boolean(data.page || (data.screen && data.screen !== "None")));
  setLinkToPage(Boolean(linkOn));
}

function removeLocation(id) {
  locations.delete(id);
  const row = extraLocations?.querySelector(`[data-extra-id="${id}"]`);
  row?.remove();
  if (editingExtraId === id) {
    editingExtraId = null;
    setLocationLayer(false);
  }
  state.hideExtras = locations.size === 0;
  const first = locations.values().next().value;
  state.showInfo = first ? first.info : false;
  applyCanvasFlags();
}

function upsertLocationRow(id, title) {
  if (!extraLocations) return;
  let row = extraLocations.querySelector(`[data-extra-id="${id}"]`);
  if (!row) {
    row = document.createElement("div");
    row.className = "layer-row";
    row.dataset.extraId = String(id);
    row.innerHTML = `
      <span class="layer-row-label" data-ex-label></span>
      <div class="more-wrap">
        <button type="button" class="icon-button more-trigger" aria-label="More actions" aria-haspopup="menu" aria-expanded="false">
          <span class="icon-24" aria-hidden="true">
            <img src="assets/icon-more.svg" alt="" width="24" height="24" />
          </span>
        </button>
        <ul class="more-menu" hidden role="menu">
          <li><button type="button" role="menuitem" data-action="edit">Edit</button></li>
          <li><button type="button" role="menuitem" data-action="remove" class="is-danger">Remove</button></li>
        </ul>
      </div>
    `;
    const moreTrigger = row.querySelector(".more-trigger");
    const moreMenu = row.querySelector(".more-menu");
    moreTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const wasOpen = !moreMenu.hidden;
      closeMenus();
      if (wasOpen) return;
      moreMenu.hidden = false;
      moreTrigger.setAttribute("aria-expanded", "true");
    });
    moreMenu.addEventListener("click", (event) => event.stopPropagation());
    moreMenu.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeMenus();
        if (button.dataset.action === "edit") openLocationLayer(id);
        if (button.dataset.action === "remove") removeLocation(id);
      });
    });
    extraLocations.appendChild(row);
  }
  const label = row.querySelector("[data-ex-label]");
  if (label) label.textContent = title;
}

const locationSave = document.querySelector("#location-save");

function openLocationLayer(id = null) {
  editingExtraId = id;
  const existing = id != null ? locations.get(id) : null;
  if (existing) {
    if (locationLayerTitle) locationLayerTitle.textContent = locationDisplayName(existing);
    if (locationSave) locationSave.textContent = "Add Location";
    writeLocationForm(existing);
  } else {
    if (locationLayerTitle) locationLayerTitle.textContent = "Add Location";
    if (locationSave) locationSave.textContent = "Add Location";
    writeLocationForm({
      name: "",
      title: "",
      address: "",
      subtitle: "",
      linkToPage: false,
      page: "Contact",
      info: true,
    });
  }
  state.hideExtras = false;
  state.showInfo = existing ? existing.info : true;
  applyCanvasFlags();
  setLocationLayer(true);
}

function dismissLocationLayer() {
  if (!locationShell || locationShell.hidden) {
    editingExtraId = null;
    return;
  }
  state.hideExtras = locations.size === 0;
  const first = locations.values().next().value;
  state.showInfo = first ? first.info : false;
  applyCanvasFlags();
  editingExtraId = null;
  setLocationLayer(false);
}

function closeLocationLayer() {
  if (!locationShell || locationShell.hidden) {
    editingExtraId = null;
    return;
  }
  const data = readLocationForm();
  let id = editingExtraId;
  if (id == null) {
    extraCount += 1;
    id = extraCount;
  }
  locations.set(id, data);
  upsertLocationRow(id, locationDisplayName(data));
  state.hideExtras = locations.size === 0;
  state.showInfo = data.info;
  applyCanvasFlags();
  editingExtraId = null;
  setLocationLayer(false);
}

function ensureDemoExtraLocation() {
  if (locations.size > 0) return;
  extraCount += 1;
  const id = extraCount;
  locations.set(id, {
    name: "Leasing office",
    title: "Leasing office",
    address: "1200 Market St",
    subtitle: "Mon–Fri 9–5",
    linkToPage: true,
    page: "Contact",
    info: true,
  });
  upsertLocationRow(id, "Leasing office");
}

function applyPadding(value) {
  state.padding = Number(value) || 0;
  blockWrap.style.padding = `${state.padding}px`;
}

function applyBlockWidth() {
  if (!blockWrap) return;
  blockWrap.style.width = `${state.blockWidth}%`;
  blockWrap.style.maxWidth = "100%";
}

function applyPosition() {
  if (!blockWrap) return;
  blockWrap.style.position = state.position === "default" ? "" : state.position;
}

function applyLayer() {
  if (!blockWrap) return;
  blockWrap.style.zIndex = String(state.layer);
}

function applyAnimation(name) {
  state.animation = name || "";
  blockWrap.style.setProperty("--anim-ms", state.speed === "fast" ? "0.35s" : "0.8s");
  blockWrap.dataset.animation = state.animation;
  if (!state.animation) {
    blockWrap.style.animation = "none";
    return;
  }
  blockWrap.style.animation = "none";
  void blockWrap.offsetWidth;
  blockWrap.style.animation = "";
}

function setSpeed(speed) {
  state.speed = speed || "normal";
  document.querySelectorAll("#speed-source button").forEach((button) => {
    button.classList.toggle("active", button.dataset.speed === state.speed);
  });
  applyAnimation(state.animation);
}

function clampZoom(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return 10;
  return Math.min(21, Math.max(1, n));
}

function setZoom(value) {
  const zoom = clampZoom(value);
  state.zoom = zoom;
  if (zoomInput) zoomInput.value = String(zoom);
  if (zoomSlider) {
    zoomSlider.value = String(zoom);
    zoomSlider.setAttribute("aria-valuenow", String(zoom));
    const pct = ((zoom - 1) / (21 - 1)) * 100;
    zoomSlider.style.setProperty("--zoom-pct", `${pct}%`);
  }
  if (mapArt) {
    const scale = 0.85 + ((zoom - 1) / 20) * 0.35;
    mapArt.style.transform = `scale(${scale.toFixed(3)})`;
    mapArt.style.transformOrigin = "center center";
  }
}

function runAddressSearch() {
  if (!addressSearch) return;
  const first = addressSearchMenu
    ? [...addressSearchMenu.querySelectorAll("li:not([hidden]) button")][0]
    : null;
  if (first) {
    pickAddressSuggestion(first);
    return;
  }
  if (addressSearch.value.trim()) {
    fillCoordinates(geocodeFallback.lat, geocodeFallback.lng);
    closeMenus();
    return;
  }
  filterAddressSuggestions(addressSearch.value);
}

function bindSegmented(groupId, datasetKey, onChange) {
  const group = document.querySelector(`#${groupId}`);
  if (!group) return;
  group.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || !button.dataset[datasetKey]) return;
    group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (onChange) onChange(button.dataset[datasetKey], button);
  });
}

bindMenu("loc-trigger", "loc-menu", (option) => {
  setLoc(option.dataset.loc || "property");
});
bindMenu("lib-trigger", "lib-menu");
bindMenu("animation-trigger", "animation-menu", (option) => {
  animationValue.textContent = option.textContent.trim();
  applyAnimation(option.dataset.animation || "");
});

bindMenu("positioning-trigger", "positioning-menu", (option) => {
  state.position = option.dataset.position || "default";
  if (positioningValue) positioningValue.textContent = option.textContent.trim();
  applyPosition();
});

document.querySelectorAll("#speed-source button").forEach((button) => {
  button.addEventListener("click", () => setSpeed(button.dataset.speed));
});

document.querySelector("#block-width-source")?.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const group = document.querySelector("#block-width-source");
  group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  if (button.classList.contains("tune")) {
    state.blockWidthCustom = true;
    if (customBlockWidthField) customBlockWidthField.hidden = false;
    state.blockWidth = Number.parseFloat(customBlockWidth?.value) || 100;
  } else {
    state.blockWidthCustom = false;
    if (customBlockWidthField) customBlockWidthField.hidden = true;
    state.blockWidth = Number.parseFloat(button.dataset.blockWidth) || 100;
  }
  applyBlockWidth();
});

customBlockWidth?.addEventListener("input", () => {
  const value = Number.parseFloat(customBlockWidth.value);
  if (!Number.isFinite(value)) return;
  state.blockWidth = value;
  applyBlockWidth();
});

layerPos?.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  if (!Number.isFinite(value)) return;
  state.layer = value;
  applyLayer();
});

if (addressSearch && addressSearchMenu) {
  addressSearch.addEventListener("focus", (event) => {
    event.stopPropagation();
    filterAddressSuggestions(addressSearch.value);
  });

  addressSearch.addEventListener("click", (event) => {
    event.stopPropagation();
    filterAddressSuggestions(addressSearch.value);
  });

  addressSearch.addEventListener("input", () => {
    filterAddressSuggestions(addressSearch.value);
  });

  addressSearch.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenus();
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    runAddressSearch();
  });

  addressSearchMenu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      pickAddressSuggestion(option);
    });
  });

  if (addressSearchBtn) {
    addressSearchBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      runAddressSearch();
    });
  }
}

if (zoomSlider) {
  zoomSlider.addEventListener("input", () => setZoom(zoomSlider.value));
}

if (zoomInput) {
  zoomInput.addEventListener("input", () => setZoom(zoomInput.value));
  zoomInput.addEventListener("change", () => setZoom(zoomInput.value));
}

function setPinStyle(pin) {
  const preview = document.querySelector("#pin-preview");
  const value = document.querySelector("#pin-value");
  const labels = {
    solid: "Solid",
    circle: "Pin with circle",
    custom: "Custom",
  };
  const next = pin || "circle";
  if (preview) {
    preview.classList.remove("solid", "circle", "custom");
    preview.classList.add(next);
  }
  if (value) value.textContent = labels[next] || labels.circle;
  document.querySelectorAll("#pin-menu button").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.pin === next));
  });
  if (customPinField) customPinField.hidden = next !== "custom";
  if (mainPin) {
    mainPin.classList.toggle("circle", next === "circle");
    if (next === "custom" && state.customPinUrl) {
      mainPin.classList.add("custom-image");
      mainPin.style.backgroundImage = `url("${state.customPinUrl}")`;
    } else if (next !== "custom") {
      mainPin.classList.remove("custom-image");
      mainPin.style.backgroundImage = "";
    }
  }
}

function clampPinWidth(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return 60;
  return Math.min(200, Math.max(16, n));
}

function setPinWidth(value) {
  const width = clampPinWidth(value);
  if (pinWInput) pinWInput.value = String(width);
  if (pinWSlider) {
    pinWSlider.value = String(width);
    pinWSlider.setAttribute("aria-valuenow", String(width));
    const pct = ((width - 16) / (200 - 16)) * 100;
    pinWSlider.style.setProperty("--zoom-pct", `${pct}%`);
  }
  if (mainPin) {
    const px = Math.max(12, Math.round((width / 60) * 22));
    mainPin.style.width = `${px}px`;
    mainPin.style.height = `${px}px`;
    mainPin.style.marginLeft = `${-px / 2}px`;
    mainPin.style.marginTop = `${-px}px`;
  }
}

const pinTrigger = document.querySelector("#pin-trigger");
const pinMenu = document.querySelector("#pin-menu");
if (pinTrigger && pinMenu) {
  pinTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    openMenu(pinTrigger, pinMenu);
  });
  pinMenu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      setPinStyle(option.dataset.pin || "circle");
      closeMenus();
    });
  });
  pinMenu.addEventListener("click", (event) => event.stopPropagation());
}

if (pinWSlider) {
  pinWSlider.addEventListener("input", () => setPinWidth(pinWSlider.value));
}

if (pinWInput) {
  pinWInput.addEventListener("input", () => setPinWidth(pinWInput.value));
  pinWInput.addEventListener("change", () => setPinWidth(pinWInput.value));
}

bindSegmented("style-source", "style", (style) => {
  customStyle.hidden = style !== "custom";
  mapArt.classList.toggle("silver", style === "silver");
});

bindSwitch(document.querySelector("#nudge-toggle"), (on) => {
  offsetFields.hidden = !on;
});

const dropShadowFields = document.querySelector("#drop-shadow-fields");
const shadowOpacity = document.querySelector("#shadow-opacity");
const shadowOpacityRange = document.querySelector("#shadow-opacity-range");
const shadowX = document.querySelector("#shadow-x");
const shadowY = document.querySelector("#shadow-y");
const shadowBlur = document.querySelector("#shadow-blur");
const shadowSpread = document.querySelector("#shadow-spread");
const shadowColorTrigger = document.querySelector("#shadow-color-trigger");
const shadowColorMenu = document.querySelector("#shadow-color-menu");
const shadowColorName = document.querySelector("#shadow-color-name");
const customPinDropzone = document.querySelector("#custom-pin-dropzone");
const customPinInput = document.querySelector("#custom-pin-input");
const customPinPreview = document.querySelector("#custom-pin-preview");
const customPinEmpty = document.querySelector("#custom-pin-empty");
const customPinReplace = document.querySelector("#custom-pin-replace");
const customPinRemove = document.querySelector("#custom-pin-remove");

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
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

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mapShadow() {
  if (!state.dropShadow) return "none";
  return `${state.shadowX}px ${state.shadowY}px ${state.shadowBlur}px ${state.shadowSpread}px ${hexToRgba(
    state.shadowColor.hex,
    state.shadowOpacity / 100
  )}`;
}

function applyMapShadow() {
  document.documentElement.style.setProperty("--map-shadow", mapShadow());
  if (dropShadowFields) dropShadowFields.hidden = !state.dropShadow;
}

function syncShadowInputs() {
  if (shadowOpacity && document.activeElement !== shadowOpacity) {
    shadowOpacity.value = String(state.shadowOpacity);
  }
  if (shadowOpacityRange && document.activeElement !== shadowOpacityRange) {
    shadowOpacityRange.value = String(state.shadowOpacity);
  }
  if (shadowX && document.activeElement !== shadowX) shadowX.value = String(state.shadowX);
  if (shadowY && document.activeElement !== shadowY) shadowY.value = String(state.shadowY);
  if (shadowBlur && document.activeElement !== shadowBlur) shadowBlur.value = String(state.shadowBlur);
  if (shadowSpread && document.activeElement !== shadowSpread) {
    shadowSpread.value = String(state.shadowSpread);
  }
}

function bindShadowNumber(input, key, min, max) {
  if (!input) return;
  const apply = () => {
    state[key] = clampInt(input.value, min, max, state[key]);
    syncShadowInputs();
    applyMapShadow();
  };
  input.addEventListener("input", apply);
  input.addEventListener("change", apply);
}

bindSwitch(document.querySelector("#shadow-toggle"), (on) => {
  state.dropShadow = on;
  applyMapShadow();
});

bindShadowNumber(shadowOpacity, "shadowOpacity", 0, 100);
bindShadowNumber(shadowX, "shadowX", -200, 200);
bindShadowNumber(shadowY, "shadowY", -200, 200);
bindShadowNumber(shadowBlur, "shadowBlur", 0, 200);
bindShadowNumber(shadowSpread, "shadowSpread", -100, 100);

if (shadowOpacityRange) {
  shadowOpacityRange.addEventListener("input", () => {
    state.shadowOpacity = clampInt(shadowOpacityRange.value, 0, 100, state.shadowOpacity);
    syncShadowInputs();
    applyMapShadow();
  });
}

if (shadowColorTrigger && shadowColorMenu) {
  shadowColorTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    openMenu(shadowColorTrigger, shadowColorMenu);
  });
  shadowColorMenu.addEventListener("click", (event) => event.stopPropagation());
  shadowColorMenu.querySelectorAll("button[data-color]").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      state.shadowColor = { name: option.dataset.label || "Dark", hex: option.dataset.color };
      if (shadowColorName) shadowColorName.textContent = state.shadowColor.name;
      const swatch = shadowColorTrigger.querySelector(".swatch");
      if (swatch) swatch.style.background = state.shadowColor.hex;
      shadowColorMenu.querySelectorAll("button[data-color]").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      closeMenus();
      applyMapShadow();
    });
  });
}

function setCustomPinUrl(url) {
  state.customPinUrl = url || "";
  const hasPin = Boolean(state.customPinUrl);
  if (customPinPreview) {
    customPinPreview.hidden = !hasPin;
    customPinPreview.style.backgroundImage = hasPin ? `url("${state.customPinUrl}")` : "";
  }
  if (customPinEmpty) customPinEmpty.hidden = hasPin;
  if (mainPin) {
    if (hasPin) {
      mainPin.classList.add("custom-image");
      mainPin.style.backgroundImage = `url("${state.customPinUrl}")`;
    } else {
      mainPin.classList.remove("custom-image");
      mainPin.style.backgroundImage = "";
    }
  }
}

function openCustomPinPicker() {
  if (customPinInput) customPinInput.click();
}

if (customPinDropzone) {
  customPinDropzone.addEventListener("click", () => openCustomPinPicker());
}

if (customPinReplace) {
  customPinReplace.addEventListener("click", () => openCustomPinPicker());
}

if (customPinRemove) {
  customPinRemove.addEventListener("click", () => {
    if (customPinInput) customPinInput.value = "";
    setCustomPinUrl("");
  });
}

if (customPinInput) {
  customPinInput.addEventListener("change", () => {
    const file = customPinInput.files && customPinInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (state.customPinUrl && state.customPinUrl.startsWith("blob:")) {
      URL.revokeObjectURL(state.customPinUrl);
    }
    setCustomPinUrl(url);
  });
}

applyMapShadow();

if (addLocationBtn) {
  addLocationBtn.addEventListener("click", () => openLocationLayer(null));
}

if (locationBack) {
  locationBack.addEventListener("click", () => dismissLocationLayer());
}

if (locationSave) {
  locationSave.addEventListener("click", () => closeLocationLayer());
}

bindSwitch(locEditInfo, (on) => {
  state.hideExtras = false;
  state.showInfo = on;
  applyCanvasFlags();
});

bindSwitch(locEditLink, (on) => {
  setLinkToPage(on);
});

bindMenu("loc-edit-page-trigger", "loc-edit-page-menu");

if (locEditName) {
  locEditName.addEventListener("input", () => {
    if (!locationLayerTitle) return;
    const name = locEditName.value.trim();
    if (editingExtraId == null && !name) {
      locationLayerTitle.textContent = "Add Location";
      return;
    }
    locationLayerTitle.textContent = name || "Location";
  });
}

deviceBtn.addEventListener("click", () => {
  const pressed = deviceBtn.getAttribute("aria-pressed") !== "true";
  deviceBtn.setAttribute("aria-pressed", String(pressed));
  deviceBtn.classList.toggle("active", pressed);
});

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.id.replace("tab-", "");
    setTab(name);
    document.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
    if (name === "content") {
      document.querySelector(`.chip[data-state="${state.loc}"]`)?.classList.add("active");
    } else {
      document.querySelector(`.chip[data-tab-only="${name}"]`)?.classList.add("active");
    }
  });
});

document.querySelectorAll(".chip[data-state]").forEach((chip) => {
  chip.addEventListener("click", () => setState(chip.dataset.state));
});

document.querySelectorAll(".chip[data-tab-only]").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    setTab(chip.dataset.tabOnly);
  });
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

document.querySelector("#qa-edit").addEventListener("click", () => {
  setTab(state.tab === "block" ? "content" : state.tab);
});

const mapHeightInput = document.querySelector("#map-height");
const mapHeightUnitValue = document.querySelector("#map-height-unit-value");
const mapHeightUnitTrigger = document.querySelector("#map-height-unit-trigger");
const mapHeightUnitMenu = document.querySelector("#map-height-unit-menu");

function setMapHeight() {
  if (!mapArt || !mapHeightInput) return;
  const raw = mapHeightInput.value.trim();
  const unit = mapHeightUnitValue?.textContent.trim() || "px";
  const value = raw || (unit === "px" ? "500" : "100");
  mapArt.style.height = `${value}${unit}`;
}

if (mapHeightInput) {
  mapHeightInput.addEventListener("input", setMapHeight);
  mapHeightInput.addEventListener("change", setMapHeight);
}

if (mapHeightUnitTrigger && mapHeightUnitMenu) {
  mapHeightUnitTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    openMenu(mapHeightUnitTrigger, mapHeightUnitMenu);
  });
  mapHeightUnitMenu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      mapHeightUnitMenu.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      if (mapHeightUnitValue) mapHeightUnitValue.textContent = option.dataset.unit || "px";
      closeMenus();
      setMapHeight();
    });
  });
}

document.addEventListener("click", () => closeMenus());
document.querySelectorAll(".field-menu, .icon-card-menu, .color-menu").forEach((menu) => {
  menu.addEventListener("click", (event) => event.stopPropagation());
});

applyPadding(16);
applyAnimation("fade");
setSpeed("normal");
applyBlockWidth();
applyPosition();
applyLayer();
setZoom(10);
setPinStyle("circle");
setPinWidth(60);
setMapHeight();
setState("property");

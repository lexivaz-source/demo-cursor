const blockWrap = document.querySelector("#block-wrap");
const inlineInput = document.querySelector("#inline-input");
const staticNumber = document.querySelector("#static-number");
const inlineHint = document.querySelector("#inline-hint");
const endVal = document.querySelector("#end-val");
const displayPrefix = document.querySelector("#display-prefix");
const displaySuffix = document.querySelector("#display-suffix");
const suffixToggle = document.querySelector("#suffix-toggle");
const suffixOptions = document.querySelector("#suffix-options");
const prefixToggle = document.querySelector("#prefix-toggle");
const prefixOptions = document.querySelector("#prefix-options");
const suffixCustomField = document.querySelector("#suffix-custom-field");
const prefixCustomField = document.querySelector("#prefix-custom-field");
const suffixCustomInput = document.querySelector("#suffix-custom-input");
const prefixCustomInput = document.querySelector("#prefix-custom-input");
const colorSwatch = document.querySelector("#color-swatch");
const colorName = document.querySelector("#color-name");
const colorTrigger = document.querySelector("#color-trigger");
const colorMenu = document.querySelector("#color-menu");
const fontSize = document.querySelector("#font-size");
const unitTrigger = document.querySelector("#unit-trigger");
const unitMenu = document.querySelector("#unit-menu");
const unitValue = document.querySelector("#unit-value");
const customPaddingField = document.querySelector("#custom-padding-field");
const customPadding = document.querySelector("#custom-padding");
const customBlockWidthField = document.querySelector("#custom-block-width-field");
const customBlockWidth = document.querySelector("#custom-block-width");
const animationValue = document.querySelector("#animation-value");
const positioningValue = document.querySelector("#positioning-value");
const parallaxToggle = document.querySelector("#parallax-toggle");
const layerPos = document.querySelector("#layer-pos");
const advancedToggle = document.querySelector("#advanced-toggle");
const advancedBody = document.querySelector("#advanced-body");

const state = {
  tab: "content",
  suffixOn: true,
  suffix: "+",
  lastSuffix: "+",
  prefixOn: false,
  prefix: "",
  lastPrefix: "$",
  align: "center",
  inline: true,
  unit: "px",
  color: "#ffffff",
  animation: "",
  speed: "normal",
  parallax: false,
  blockWidth: 100,
  blockWidthCustom: false,
  position: "default",
  padding: 8,
  paddingCustom: false,
  layer: 1,
};

function closeMenus() {
  document.querySelectorAll(".field-menu, .color-menu").forEach((menu) => {
    menu.hidden = true;
  });
  document.querySelectorAll(".field-trigger, .color-trigger, .combo-unit").forEach((trigger) => {
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

  menu.querySelectorAll("button[role='option'], button[data-unit], button[data-color], button[data-animation], button[data-position], button[data-heading]").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      if (option.classList.contains("color-site-styles")) return;
      menu.querySelectorAll("button").forEach((item) => {
        if (
          item.dataset.color ||
          item.dataset.unit ||
          item.dataset.animation !== undefined ||
          item.dataset.position ||
          item.dataset.heading !== undefined ||
          item.getAttribute("role") === "option"
        ) {
          item.setAttribute("aria-selected", String(item === option));
        }
      });
      const valueEl = trigger.querySelector("span:first-child");
      if (valueEl && !valueEl.classList.contains("swatch") && !valueEl.classList.contains("icon-24")) {
        valueEl.textContent = option.dataset.label || option.textContent.trim();
      }
      closeMenus();
      if (onPick) onPick(option);
    });
  });
}

function syncBlockControls() {
  document.querySelectorAll("#speed-source button").forEach((button) => {
    button.classList.toggle("active", button.dataset.speed === state.speed);
  });

  parallaxToggle.classList.toggle("on", state.parallax);
  parallaxToggle.setAttribute("aria-checked", String(state.parallax));

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

  document.querySelectorAll("#padding-source button").forEach((button) => {
    if (button.classList.contains("tune")) {
      button.classList.toggle("active", state.paddingCustom);
    } else {
      button.classList.toggle(
        "active",
        !state.paddingCustom && button.dataset.pad === String(state.padding)
      );
    }
  });
  customPaddingField.hidden = !state.paddingCustom;
  if (document.activeElement !== customPadding) {
    customPadding.value = String(state.padding);
  }

  if (document.activeElement !== layerPos) {
    layerPos.value = String(state.layer);
  }

  blockWrap.style.width = `${state.blockWidth}%`;
  blockWrap.style.maxWidth = state.blockWidth < 100 ? "none" : "100%";
  blockWrap.style.padding = `${state.padding}px`;
  blockWrap.style.zIndex = String(state.layer);
  blockWrap.classList.toggle("has-parallax", state.parallax);
  blockWrap.dataset.animation = state.animation || "";
  blockWrap.dataset.position = state.position;
  blockWrap.style.setProperty("--anim-ms", state.speed === "fast" ? "0.35s" : "0.8s");
}

function activateTab(name) {
  state.tab = name;
  document.querySelectorAll(".tabs .tab").forEach((tab) => {
    const active = tab.id === `tab-${name}`;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== `panel-${name}`;
  });
  closeMenus();
}

function setInline(on) {
  state.inline = on;
  inlineInput.hidden = !on;
  staticNumber.hidden = on;
  inlineHint.hidden = !on;
}

function syncEndVal(value) {
  inlineInput.value = value;
  endVal.value = value;
  staticNumber.textContent = value;
}

function setSuffixEnabled(on) {
  state.suffixOn = on;
  suffixToggle.classList.toggle("on", on);
  suffixToggle.setAttribute("aria-checked", String(on));
  suffixOptions.hidden = !on;

  if (on) {
    const isCustom = state.lastSuffix === "custom";
    syncSuffix(isCustom ? "custom" : state.lastSuffix || "+", isCustom);
  } else {
    displaySuffix.textContent = "";
    state.suffix = "";
    suffixCustomField.hidden = true;
  }
}

function syncSuffix(val, isCustom) {
  if (!state.suffixOn) setSuffixEnabled(true);

  state.suffix = isCustom ? suffixCustomInput.value : val;
  state.lastSuffix = isCustom ? "custom" : val;
  displaySuffix.textContent = state.suffix;

  document.querySelectorAll("#suffix-grid button").forEach((btn) => {
    const active = isCustom ? btn.dataset.val === "custom" : btn.dataset.val === val;
    btn.classList.toggle("active", active);
  });

  suffixCustomField.hidden = !isCustom;
}

function syncPrefix(val, isCustom) {
  if (!state.prefixOn) setPrefixEnabled(true);

  state.prefix = isCustom ? prefixCustomInput.value : val;
  state.lastPrefix = isCustom ? "custom" : val;
  displayPrefix.textContent = state.prefix;

  document.querySelectorAll("#prefix-grid button").forEach((btn) => {
    const active = isCustom ? btn.dataset.val === "custom" : btn.dataset.val === val;
    btn.classList.toggle("active", active);
  });

  prefixCustomField.hidden = !isCustom;
}

function setPrefixEnabled(on) {
  state.prefixOn = on;
  prefixToggle.classList.toggle("on", on);
  prefixToggle.setAttribute("aria-checked", String(on));
  prefixOptions.hidden = !on;

  if (on) {
    const isCustom = state.lastPrefix === "custom";
    syncPrefix(isCustom ? "custom" : state.lastPrefix || "$", isCustom);
  } else {
    displayPrefix.textContent = "";
    state.prefix = "";
    prefixCustomField.hidden = true;
  }
}

function setAlign(align) {
  state.align = align;
  blockWrap.dataset.align = align;

  document.querySelectorAll("#align-source button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.align === align);
  });
}

function applyFontSize() {
  const size = fontSize.value || "90";
  document.documentElement.style.setProperty("--counter-size", `${size}${state.unit}`);
}

function applyColor(hex, name) {
  state.color = hex;
  colorSwatch.style.background = hex;
  colorName.textContent = name;
  document.documentElement.style.setProperty("--counter-color", hex);
}

function wireGrid(gridId, onSelect) {
  const grid = document.querySelector(gridId);
  grid.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      onSelect(btn.dataset.val, btn.dataset.val === "custom");
    });
  });
}

document.querySelectorAll(".tabs .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activateTab(tab.id.replace("tab-", ""));
    document.querySelectorAll(".review-bar .chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.mode === tab.id.replace("tab-", "") || (tab.id === "tab-content" && chip.dataset.mode === "inline"));
    });
  });
});

wireGrid("#suffix-grid", syncSuffix);
wireGrid("#prefix-grid", syncPrefix);

suffixToggle.addEventListener("click", () => {
  setSuffixEnabled(suffixToggle.getAttribute("aria-checked") !== "true");
});

prefixToggle.addEventListener("click", () => {
  setPrefixEnabled(prefixToggle.getAttribute("aria-checked") !== "true");
});

document.querySelectorAll("#align-source button").forEach((btn) => {
  btn.addEventListener("click", () => setAlign(btn.dataset.align));
});

inlineInput.addEventListener("input", () => syncEndVal(inlineInput.value));
endVal.addEventListener("input", () => syncEndVal(endVal.value));

suffixCustomInput.addEventListener("input", () => {
  if (!suffixCustomField.hidden) {
    displaySuffix.textContent = suffixCustomInput.value;
    state.suffix = suffixCustomInput.value;
  }
});

prefixCustomInput.addEventListener("input", () => {
  if (!prefixCustomField.hidden) {
    displayPrefix.textContent = prefixCustomInput.value;
    state.prefix = prefixCustomInput.value;
  }
});

advancedToggle.addEventListener("click", () => {
  const open = advancedToggle.getAttribute("aria-expanded") !== "true";
  advancedToggle.setAttribute("aria-expanded", String(open));
  advancedBody.hidden = !open;
});

const customFontSize = document.querySelector("#custom-font-size");

function setFontStyle(heading) {
  const isCustom = heading === "custom";
  customFontSize.hidden = !isCustom;
  if (isCustom) applyFontSize();
}

bindMenu("heading-trigger", "heading-menu", (option) => {
  setFontStyle(option.dataset.heading);
});
bindMenu("animation-trigger", "animation-menu", (option) => {
  state.animation = option.dataset.animation ?? "";
  animationValue.textContent = option.textContent.trim();
  syncBlockControls();
});
bindMenu("positioning-trigger", "positioning-menu", (option) => {
  state.position = option.dataset.position || "default";
  positioningValue.textContent = option.textContent.trim();
  syncBlockControls();
});

colorTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  openMenu(colorTrigger, colorMenu);
});

colorMenu.querySelectorAll("button[data-color]").forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    colorMenu.querySelectorAll("button[data-color]").forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });
    applyColor(option.dataset.hex, option.dataset.color);
    closeMenus();
  });
});

unitTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  openMenu(unitTrigger, unitMenu);
});

unitMenu.querySelectorAll("button").forEach((option) => {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    unitMenu.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });
    state.unit = option.dataset.unit;
    unitValue.textContent = option.dataset.unit;
    closeMenus();
    applyFontSize();
  });
});

fontSize.addEventListener("input", applyFontSize);

document.querySelectorAll("#speed-source button").forEach((button) => {
  button.addEventListener("click", () => {
    state.speed = button.dataset.speed;
    syncBlockControls();
  });
});

parallaxToggle.addEventListener("click", () => {
  state.parallax = !state.parallax;
  syncBlockControls();
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
    syncBlockControls();
  });
});

customBlockWidth.addEventListener("input", () => {
  const value = Number.parseFloat(customBlockWidth.value);
  if (!Number.isFinite(value)) return;
  state.blockWidth = value;
  syncBlockControls();
});

document.querySelectorAll("#padding-source button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("tune")) {
      state.paddingCustom = true;
      state.padding = Number.parseFloat(customPadding.value) || 8;
    } else {
      state.paddingCustom = false;
      state.padding = Number.parseFloat(button.dataset.pad);
    }
    syncBlockControls();
  });
});

customPadding.addEventListener("input", () => {
  const value = Number.parseFloat(customPadding.value);
  if (!Number.isFinite(value)) return;
  state.padding = value;
  syncBlockControls();
});

layerPos.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  if (!Number.isFinite(value)) return;
  state.layer = value;
  syncBlockControls();
});

document.querySelectorAll(".review-bar .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".review-bar .chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const mode = chip.dataset.mode;

    if (mode === "inline") {
      setInline(true);
      activateTab("content");
      setSuffixEnabled(true);
      syncSuffix("+", false);
      syncEndVal("620");
    } else if (mode === "quick") {
      setInline(false);
      activateTab("content");
      setSuffixEnabled(true);
      syncEndVal("620");
    } else if (mode === "custom") {
      setInline(false);
      activateTab("content");
      setSuffixEnabled(true);
      syncEndVal("1.2");
      syncSuffix("custom", true);
      suffixCustomInput.value = "B";
      displaySuffix.textContent = "B";
    } else if (mode === "design") {
      setInline(false);
      activateTab("design");
    } else if (mode === "block") {
      setInline(false);
      activateTab("block");
    }
  });
});

document.addEventListener("click", closeMenus);

document.querySelector("#qa-edit")?.addEventListener("click", () => activateTab("content"));

applyFontSize();
applyColor("#ffffff", "White");
setAlign("center");
setInline(true);
syncBlockControls();

const live = document.querySelector("#live");
const poweredBy = document.querySelector("#powered-by");
const gaToggle = document.querySelector("#ga-toggle");
const analyticsWarn = document.querySelector("#analytics-warn");
const footerStrip = document.querySelector("#footer-strip");
const qaDelete = document.querySelector("#qa-delete");
const colorSwatch = document.querySelector("#color-swatch");
const colorName = document.querySelector("#color-name");
const colorMenu = document.querySelector("#color-menu");
const colorTrigger = document.querySelector(".color-trigger");
const animationTrigger = document.querySelector("#animation-trigger");
const animationMenu = document.querySelector("#animation-menu");
const animationValue = document.querySelector("#animation-value");
const fontSize = document.querySelector("#font-size");
const unitTrigger = document.querySelector("#unit-trigger");
const unitMenu = document.querySelector("#unit-menu");
const unitValue = document.querySelector("#unit-value");
const rolePill = document.querySelector("#role-pill");

const BLOCK_DEFAULT_LABEL = "Happily made in Razz";
const EVENT_CATEGORY = "Outbound Links";
const EVENT_ACTION = "Happily made in Razz";

const state = {
  gaOn: true,
  analyticsReady: true,
  color: { name: "White", hex: "#ffffff" },
  isSuper: false,
};

function announce(message) {
  if (live) live.textContent = message;
}

function applyTracking() {
  const label = BLOCK_DEFAULT_LABEL;

  if (state.gaOn) {
    poweredBy.dataset.tracking = "on";
    poweredBy.setAttribute("data-track-label", label);
    poweredBy.setAttribute("data-track-category", EVENT_CATEGORY);
    poweredBy.setAttribute("data-track-action", EVENT_ACTION);
  } else {
    poweredBy.dataset.tracking = "off";
    poweredBy.removeAttribute("data-track-label");
    poweredBy.removeAttribute("data-track-category");
    poweredBy.removeAttribute("data-track-action");
  }
}

function setGa(on) {
  state.gaOn = on;
  gaToggle.classList.toggle("on", on);
  gaToggle.setAttribute("aria-checked", String(on));
  document.querySelectorAll("[data-ga]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.ga === (on ? "on" : "off"));
  });
  updateAnalyticsWarn();
  applyTracking();
  announce(on ? "Google Analytics click tracking on" : "Google Analytics click tracking off");
}

function setAnalytics(ready) {
  state.analyticsReady = ready;
  document.querySelectorAll("[data-analytics]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.analytics === (ready ? "configured" : "missing"));
  });
  updateAnalyticsWarn();
}

function updateAnalyticsWarn() {
  analyticsWarn.hidden = state.analyticsReady || !state.gaOn;
  gaToggle.disabled = !state.analyticsReady && !state.gaOn;
}

function setRole(superAdmin) {
  state.isSuper = superAdmin;
  rolePill.textContent = superAdmin ? "Super admin" : "App editor";
  qaDelete.disabled = !superAdmin;
  qaDelete.setAttribute(
    "aria-label",
    superAdmin ? "Delete block" : "Delete is available to super admins only"
  );
  document.querySelectorAll("[data-role]").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.role === (superAdmin ? "super" : "editor"));
  });
}

function setColor(name, hex) {
  state.color = { name, hex };
  poweredBy.style.color = hex;
  colorSwatch.style.background = hex;
  colorName.textContent = name;
  colorMenu.querySelectorAll("[data-color]").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.color === name));
  });
}

function closeMenus() {
  if (colorMenu) {
    colorMenu.hidden = true;
    colorTrigger.setAttribute("aria-expanded", "false");
  }
  if (animationMenu) {
    animationMenu.hidden = true;
    animationTrigger.setAttribute("aria-expanded", "false");
  }
  if (unitMenu) {
    unitMenu.hidden = true;
    unitTrigger.setAttribute("aria-expanded", "false");
  }
}

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

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => showTab(tab.id.replace("tab-", "")));
});

document.querySelectorAll("[data-role]").forEach((chip) => {
  chip.addEventListener("click", () => setRole(chip.dataset.role === "super"));
});

document.querySelectorAll("[data-ga]").forEach((chip) => {
  chip.addEventListener("click", () => setGa(chip.dataset.ga === "on"));
});

document.querySelectorAll("[data-analytics]").forEach((chip) => {
  chip.addEventListener("click", () => setAnalytics(chip.dataset.analytics === "configured"));
});

gaToggle.addEventListener("click", () => {
  if (gaToggle.disabled) return;
  setGa(!state.gaOn);
});

colorTrigger.addEventListener("click", () => {
  const open = colorMenu.hidden;
  colorMenu.hidden = !open;
  colorTrigger.setAttribute("aria-expanded", String(open));
});

colorMenu.querySelectorAll("[data-color]").forEach((option) => {
  option.addEventListener("click", () => {
    setColor(option.dataset.color, option.dataset.hex);
    colorMenu.hidden = true;
    colorTrigger.setAttribute("aria-expanded", "false");
  });
});

const siteStyles = colorMenu.querySelector(".color-site-styles");
if (siteStyles) {
  siteStyles.addEventListener("click", () => {
    colorMenu.hidden = true;
    colorTrigger.setAttribute("aria-expanded", "false");
    announce("Edit Site Styles is a site-level action in this file.");
  });
}

document.querySelector("#qa-add").addEventListener("click", () => {
  announce("Add is a canvas action in this file.");
});

document.querySelector("#qa-edit").addEventListener("click", () => {
  showTab("content");
});

document.querySelector("#qa-image").addEventListener("click", () => {
  announce("Insert image is a canvas action in this file.");
});

document.querySelector("#qa-copy").addEventListener("click", () => {
  announce("Copy is a canvas action in this file.");
});

function setAnimation(label) {
  animationValue.textContent = label;
  animationMenu.querySelectorAll("button").forEach((option) => {
    option.setAttribute("aria-selected", String(option.textContent === label));
  });
}

animationTrigger.addEventListener("click", () => {
  const open = animationMenu.hidden;
  closeMenus();
  if (open) {
    animationMenu.hidden = false;
    animationTrigger.setAttribute("aria-expanded", "true");
  }
});

animationMenu.querySelectorAll("button").forEach((option) => {
  option.addEventListener("click", () => {
    setAnimation(option.textContent);
    animationMenu.hidden = true;
    animationTrigger.setAttribute("aria-expanded", "false");
  });
});

const ALIGN_TEXT = {
  "flex-start": "left",
  center: "center",
  "flex-end": "right",
  stretch: "justify",
};

function applyFontSize() {
  const size = Number.parseFloat(fontSize.value);
  const unit = unitValue.textContent.trim();
  if (size > 0) poweredBy.style.fontSize = `${size}${unit}`;
}

fontSize.addEventListener("input", applyFontSize);

unitTrigger.addEventListener("click", () => {
  const open = unitMenu.hidden;
  closeMenus();
  if (open) {
    unitMenu.hidden = false;
    unitTrigger.setAttribute("aria-expanded", "true");
  }
});

unitMenu.querySelectorAll("button").forEach((option) => {
  option.addEventListener("click", () => {
    unitValue.textContent = option.dataset.unit;
    unitMenu.querySelectorAll("button").forEach((item) => {
      item.setAttribute("aria-selected", String(item === option));
    });
    unitMenu.hidden = true;
    unitTrigger.setAttribute("aria-expanded", "false");
    applyFontSize();
  });
});

document.querySelector("#align-source").querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#align-source button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    footerStrip.style.justifyContent = button.dataset.align;
    poweredBy.style.textAlign = ALIGN_TEXT[button.dataset.align] || "left";
  });
});

function bindChoiceGroup(selector, onSelect) {
  const group = document.querySelector(selector);
  if (!group) return;

  group.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      if (onSelect) onSelect(button);
    });
  });
}

bindChoiceGroup("#padding-source", (button) => {
  if (button.dataset.pad == null) return;
  footerStrip.style.padding = `${button.dataset.pad}px 20px`;
});

poweredBy.addEventListener("click", (event) => {
  event.preventDefault();
  showTab("content");
});

qaDelete.addEventListener("click", () => {
  if (qaDelete.disabled) return;
  announce("Delete is a super-admin action in this mock.");
});

setColor("White", "#ffffff");
setRole(false);
setGa(true);
setAnalytics(true);
showTab("content");
applyTracking();

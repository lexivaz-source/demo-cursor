const live = document.querySelector("#live");
const blockWrap = document.querySelector("#block-wrap");
const applyFrame = document.querySelector("#apply-frame");
const missingCanvas = document.querySelector("#missing-canvas");
const missingWarn = document.querySelector("#missing-warn");
const missingHelp = document.querySelector("#missing-help");
const fieldSubdomain = document.querySelector("#field-subdomain");
const fieldAccount = document.querySelector("#field-account");
const fieldProperty = document.querySelector("#field-property");
const fieldIntegration = document.querySelector("#field-integration");
const fieldUrl = document.querySelector("#field-url");
const fieldOrg = document.querySelector("#field-org");
const contentDivider = document.querySelector("#content-divider");
const subdomain = document.querySelector("#subdomain");
const accountId = document.querySelector("#account-id");
const propertyId = document.querySelector("#property-id");
const applyUrl = document.querySelector("#apply-url");
const animationTrigger = document.querySelector("#animation-trigger");
const animationMenu = document.querySelector("#animation-menu");
const animationValue = document.querySelector("#animation-value");
const parallaxSwitch = document.querySelector("#sw-parallax");
const positioningTrigger = document.querySelector("#positioning-trigger");
const positioningMenu = document.querySelector("#positioning-menu");
const positioningValue = document.querySelector("#positioning-value");
const pageBody = document.querySelector("#page-body");
const layerPos = document.querySelector("#layer-pos");
const deviceBtn = document.querySelector("#device-btn");

const fieldMenus = [
  { trigger: animationTrigger, menu: animationMenu },
  { trigger: positioningTrigger, menu: positioningMenu },
];

const APPLY_URL =
  "https://demo.myresman.com/Portal/Applicants/ApplyFromMarketing?accountID=500&propertyID=4fb18691-c894-4b84-805b-c62da481ca63";

const state = {
  variant: "configured",
};

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
      closeMenus();
      onPick(option);
    });
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
}

function setReviewChip(name) {
  document.querySelectorAll(".chip[data-state], .chip[data-tab-only]").forEach((chip) => {
    const isState = chip.dataset.state === name;
    const isTab = chip.dataset.tabOnly && name === chip.dataset.tabOnly;
    chip.classList.toggle("active", Boolean(isState || isTab));
  });
}

function setEmpty(input, empty) {
  input.classList.toggle("is-empty", empty);
}

function setVariant(variant) {
  state.variant = variant;
  const missing = variant === "missing";
  const compact = variant === "compact";

  missingWarn.hidden = !missing;
  missingHelp.hidden = !missing;
  missingCanvas.hidden = !missing;
  applyFrame.hidden = missing;

  fieldSubdomain.hidden = compact;
  fieldAccount.hidden = compact;
  fieldProperty.hidden = compact;
  fieldIntegration.hidden = !compact;
  fieldUrl.hidden = compact || missing;
  fieldOrg.hidden = !compact;
  contentDivider.hidden = missing;

  if (missing) {
    subdomain.value = "—";
    accountId.value = "—";
    propertyId.value = "—";
  } else {
    subdomain.value = "demo";
    accountId.value = "500";
    propertyId.value = "4fb18691-c894-4b84-805b-c62da481ca63";
    applyUrl.value = APPLY_URL;
  }

  setEmpty(subdomain, missing);
  setEmpty(accountId, missing);
  setEmpty(propertyId, missing);

  setTab("content");
  setReviewChip(variant);
}

document.querySelectorAll(".tab[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => {
    const name = tab.id.replace("tab-", "");
    setTab(name);
    if (name === "block") {
      setReviewChip("block");
    } else {
      setReviewChip(state.variant);
    }
  });
});

document.querySelectorAll(".chip[data-state]").forEach((chip) => {
  chip.addEventListener("click", () => setVariant(chip.dataset.state));
});

document.querySelectorAll(".chip[data-tab-only]").forEach((chip) => {
  chip.addEventListener("click", () => {
    setTab(chip.dataset.tabOnly);
    setReviewChip(chip.dataset.tabOnly);
  });
});

bindMenu(animationTrigger, animationMenu, (option) => {
  animationValue.textContent = option.textContent;
});

bindMenu(positioningTrigger, positioningMenu, (option) => {
  positioningValue.textContent = option.textContent;
  pageBody.dataset.position = option.dataset.position;
});

parallaxSwitch.addEventListener("click", () => {
  const on = parallaxSwitch.getAttribute("aria-checked") !== "true";
  parallaxSwitch.classList.toggle("on", on);
  parallaxSwitch.setAttribute("aria-checked", String(on));
  blockWrap.classList.toggle("has-parallax", on);
});

document.querySelectorAll("#width-source button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#width-source button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.width == null) return;
    blockWrap.style.width = `${button.dataset.width}%`;
  });
});

document.querySelectorAll("#padding-source button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#padding-source button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    if (button.dataset.pad == null) return;
    blockWrap.style.padding = `${button.dataset.pad}px`;
  });
});

layerPos.addEventListener("input", () => {
  const value = Number.parseInt(layerPos.value, 10);
  blockWrap.style.zIndex = Number.isFinite(value) ? String(value) : "1";
});

document.querySelector("#qa-edit").addEventListener("click", () => {
  setTab("content");
  setReviewChip(state.variant);
  announce("Edit opens the Content tab.");
});

document.querySelector("#qa-copy").addEventListener("click", () => {
  announce("Duplicate is a canvas action in this mock.");
});

document.querySelector("#qa-delete").addEventListener("click", () => {
  announce("Delete is a canvas action in this mock.");
});

const appIntegrationsLink = document.querySelector("#app-integrations-link");
if (appIntegrationsLink) {
  appIntegrationsLink.addEventListener("click", (event) => {
    event.preventDefault();
    announce("App Integrations is a dashboard action in this mock.");
  });
}

deviceBtn.addEventListener("click", () => {
  const on = deviceBtn.getAttribute("aria-pressed") !== "true";
  deviceBtn.setAttribute("aria-pressed", String(on));
  announce(on ? "Device overrides on" : "Device overrides off");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".field")) closeMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenus();
});

setVariant("configured");

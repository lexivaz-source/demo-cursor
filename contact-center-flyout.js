const plans = [
  { id: "s1", name: "Studio S1", detail: "Studio | 1 Bath | 565 Sq Ft" },
  { id: "s2", name: "Studio S2", detail: "Studio | 1 Bath | 565 Sq Ft" },
  { id: "s3", name: "Studio S3", detail: "Studio | 1 Bath | 580 Sq Ft" },
];

const studioUnits = [
  { id: "1915", plan: "S2", bed: "0", bath: "1", sqft: "565", price: "$2549 - $2575", quotable: true },
  { id: "1813", plan: "S2", bed: "0", bath: "1", sqft: "565", price: "$2549 - $2575", quotable: true },
  { id: "2099", plan: "S2", bed: "0", bath: "1", sqft: "565", price: "--", quotable: false },
];

const oneBedUnits = [
  { id: "1204", plan: "A1", bed: "1", bath: "1", sqft: "720", price: "$2725 - $2795", quotable: false },
  { id: "1210", plan: "A1", bed: "1", bath: "1", sqft: "720", price: "$2725 - $2795", quotable: false },
];

const allUnits = [...studioUnits, ...oneBedUnits];

const terms = ["10 month", "12 month", "14 month"];
/** Main page unit table (frame 81:44857) and flyout matrix use identical date columns. */
const pageDates = ["09/01/2026", "09/01/2026", "09/01/2026"];
const flyoutDates = pageDates;

/** Seed prices for the main Optimized Pricing table lease matrix. */
const pagePriceMatrix = {
  "10 month": [2615, 2615, 2615],
  "12 month": [2615, 2615, 2615],
  "14 month": [2615, 2615, 2615],
};

const flyoutPriceMatrix = pagePriceMatrix;

const addons = [
  { id: "pet", name: "Pet Rent", price: 70 },
  { id: "bike", name: "Bicycle Storage", price: 25 },
  { id: "charges", name: "Charges", price: 70 },
  { id: "due", name: "DueAtMonthly(PM)optional30", price: 70 },
  { id: "expenses", name: "Expenses / Charges", price: 70 },
  { id: "moto", name: "Motorcycle Parking", price: 70 },
];

/** Seed values from Figma node 59:26669 */
const FLYOUT_FEES_TOTAL = 1758;
const FLYOUT_FEES_BASE = 1629;
const FLYOUT_SEED_TOTAL = 2900;
const FLYOUT_SEED_ADDONS = 140;

const state = {
  property: "Riverside Commons",
  moveIn: "09/01/2026",
  unitOfInterest: "1813",
  desiredTerm: "10 month",
  propertyOpen: false,
  unitPickerOpen: false,
  flyoutOpen: false,
  openGroups: new Set(["studio"]),
  activePlan: "s2",
  optionsOpen: true,
  openUnit: "1915",
  selected: { unit: "1915", term: "10 month", dateIndex: 0 },
  flyoutUnit: "1813",
  flyoutSelected: { unit: "1813", term: "10 month", dateIndex: 0 },
  addons: { pet: 1, bike: 0, charges: 1, due: 0, expenses: 0, moto: 0 },
  feesOpen: false,
  savedAddons: null,
};

state.savedAddons = { ...state.addons };

const groupsEl = document.querySelector("#pricing-groups");
const moveInEl = document.querySelector("#move-in");
const interestEl = document.querySelector("#unit-interest");
const termEl = document.querySelector("#desired-term");
const clearInterest = document.querySelector("#clear-interest");
const clearTerm = document.querySelector("#clear-term");
const propertyButton = document.querySelector("#property-button");
const propertyMenu = document.querySelector("#property-menu");
const propertyValue = document.querySelector("#property-value");
const addonList = document.querySelector("#addon-list");
const calcTotal = document.querySelector("#calc-total");
const feesTotalLabel = document.querySelector("#fees-total-label");
const feeBase = document.querySelector("#fee-base");
const feesToggle = document.querySelector("#fees-toggle");
const feesBody = document.querySelector("#fees-body");
const flyoutRoot = document.querySelector("#flyout-root");
const flyout = document.querySelector("#flyout");
const flyoutBackdrop = document.querySelector("#flyout-backdrop");
const flyoutClose = document.querySelector("#flyout-close");
const flyoutProperty = document.querySelector("#flyout-property");
const flyoutTerms = document.querySelector("#flyout-terms");
const unitPickerButton = document.querySelector("#unit-picker-button");
const unitPickerMenu = document.querySelector("#unit-picker-menu");
const unitPickerValue = document.querySelector("#unit-picker-value");
const quoteUnit = document.querySelector("#quote-unit");
const quoteMoveIn = document.querySelector("#quote-move-in");
const quoteTerm = document.querySelector("#quote-term");
const quoteBase = document.querySelector("#quote-base");
const quoteEditUnit = document.querySelector("#quote-edit-unit");
const toast = document.querySelector("#toast");
let toastTimer = 0;
let lastFocus = null;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function icon(name) {
  const file = {
    home: "icon-home.svg",
    less: "icon-expand-less.svg",
    more: "icon-expand-more.svg",
    image: "icon-hide-image.svg",
    calc: "icon-calculator.svg",
  }[name];
  return `<img src="assets/contact-center/${file}" alt="" width="20" height="20" />`;
}

function money(amount, fractionDigits = 0) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function findUnit(id) {
  return allUnits.find((unit) => unit.id === id);
}

function unitLabel(id) {
  const unit = findUnit(id);
  return unit ? `${unit.id} (${unit.plan})` : id || "—";
}

function selectedRent(selection = state.flyoutSelected) {
  if (!selection) return 2615;
  const row = flyoutPriceMatrix[selection.term];
  return row ? row[selection.dateIndex] : 2615;
}

function addonTotal(counts) {
  return addons.reduce((sum, addon) => sum + addon.price * (counts[addon.id] || 0), 0);
}

function termDisplay(term) {
  return term.replace("month", "Months");
}

function flyoutLeasingTotal() {
  return FLYOUT_SEED_TOTAL - FLYOUT_SEED_ADDONS + addonTotal(state.addons);
}

function applySelectionToContact(unit, term, dateIndex, { fromFlyout = false } = {}) {
  state.unitOfInterest = unit;
  state.desiredTerm = term;
  state.moveIn = (fromFlyout ? flyoutDates : pageDates)[dateIndex] ?? state.moveIn;
}

function openFlyout(unitId) {
  const unit = findUnit(unitId) || findUnit(state.unitOfInterest) || studioUnits[1];
  state.flyoutUnit = unit.id;
  state.flyoutSelected = {
    unit: unit.id,
    term: state.selected?.term || state.desiredTerm || "10 month",
    dateIndex: state.selected?.dateIndex ?? 0,
  };
  state.unitPickerOpen = false;
  state.flyoutOpen = true;
  lastFocus = document.activeElement;
  syncFlyout();
  document.body.classList.add("is-flyout-open");
  flyoutRoot.hidden = false;
  flyout.focus();
}

function closeFlyout() {
  state.flyoutOpen = false;
  state.unitPickerOpen = false;
  flyoutRoot.hidden = true;
  document.body.classList.remove("is-flyout-open");
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
}

function syncContact() {
  moveInEl.textContent = state.moveIn || "—";
  interestEl.textContent = state.unitOfInterest || "—";
  termEl.textContent = state.desiredTerm || "—";
  clearInterest.hidden = !state.unitOfInterest;
  clearTerm.hidden = !state.desiredTerm;
  propertyValue.textContent = state.property;
  propertyButton.setAttribute("aria-expanded", String(state.propertyOpen));
  propertyMenu.hidden = !state.propertyOpen;
}

function syncFees() {
  feesBody.hidden = !state.feesOpen;
  feesToggle.setAttribute("aria-expanded", String(state.feesOpen));
  feesToggle.querySelector(".fees-chevron").src = state.feesOpen
    ? "assets/contact-center/icon-expand-less.svg"
    : "assets/contact-center/icon-expand-more.svg";
}

function renderAddons() {
  addonList.innerHTML = addons
    .map((addon) => {
      const count = state.addons[addon.id] || 0;
      return `<div class="addon-row">
        <span class="addon-name">${addon.name}</span>
        <span class="stepper">
          <button type="button" data-step="${addon.id}" data-dir="-1" aria-label="Decrease ${addon.name}">
            <img src="assets/contact-center/icon-minus.svg" alt="" width="24" height="24" />
          </button>
          <span class="${count === 0 ? "is-zero" : ""}">${count}</span>
          <button type="button" data-step="${addon.id}" data-dir="1" aria-label="Increase ${addon.name}">
            <img src="assets/contact-center/icon-plus.svg" alt="" width="24" height="24" />
          </button>
        </span>
        <span class="addon-price">${money(addon.price)}</span>
      </div>`;
    })
    .join("");
}

function syncFlyout() {
  const label = unitLabel(state.flyoutUnit);
  const total = flyoutLeasingTotal();

  flyoutProperty.textContent = state.property;
  unitPickerValue.textContent = label;
  unitPickerButton.setAttribute("aria-expanded", String(state.unitPickerOpen));
  unitPickerMenu.hidden = !state.unitPickerOpen;
  unitPickerMenu.innerHTML = studioUnits
    .filter((unit) => unit.quotable)
    .map((unit) => {
      const selected = unit.id === state.flyoutUnit;
      return `<li><button type="button" role="option" data-flyout-unit="${unit.id}" aria-selected="${selected}">${unitLabel(unit.id)}</button></li>`;
    })
    .join("");

  flyoutTerms.innerHTML = flyoutTermsTable();
  quoteUnit.textContent = label;
  quoteMoveIn.textContent = flyoutDates[state.flyoutSelected.dateIndex] || state.moveIn;
  quoteTerm.textContent = termDisplay(state.flyoutSelected.term);
  /* Matches Figma frame 59:26669 Quote Details → Base Rent */
  quoteBase.textContent = termDisplay(state.flyoutSelected.term);
  feeBase.textContent = money(FLYOUT_FEES_BASE);
  feesTotalLabel.textContent = `${money(FLYOUT_FEES_TOTAL, 2)} Total Monthly Price*`;
  calcTotal.innerHTML = `<span class="total-unit">Unit ${label} - </span><span class="total-amount">${money(total)}/mon</span>`;
  syncFees();
  renderAddons();
}

function priceCell(unit, term, dateIndex, { flyoutMode = false } = {}) {
  const amount = (flyoutMode ? flyoutPriceMatrix : pagePriceMatrix)[term][dateIndex];
  const selection = flyoutMode ? state.flyoutSelected : state.selected;
  const selected =
    selection &&
    selection.unit === unit.id &&
    selection.term === term &&
    selection.dateIndex === dateIndex;

  if (!unit.quotable) {
    return `<span class="terms-cell">--</span>`;
  }

  const attrs = flyoutMode
    ? `data-flyout-price data-unit="${unit.id}" data-term="${term}" data-date="${dateIndex}"`
    : `data-select-price data-unit="${unit.id}" data-term="${term}" data-date="${dateIndex}"`;

  if (!flyoutMode && selected) {
    return `<div class="terms-cell is-selected has-calc">
      <button type="button" class="terms-price" ${attrs}>${money(amount)}</button>
      <button type="button" class="terms-calc" data-open-flyout="${unit.id}" aria-label="Calculate price for unit ${unit.id}">
        <img src="assets/contact-center/icon-calc-cell.svg" alt="" width="20" height="20" />
      </button>
    </div>`;
  }

  return `<button type="button" class="terms-cell${selected ? " is-selected" : ""}" ${attrs}><span class="terms-price">${money(amount)}</span></button>`;
}

function termsTable(unit, { flyoutMode = false } = {}) {
  const dateHeaders = flyoutMode ? flyoutDates : pageDates;
  const termCol = `<div class="terms-col terms-col--label">
    <div class="terms-head">Lease Term</div>
    ${terms
      .map(
        (term, index) =>
          `${index ? '<hr class="terms-divider" />' : ""}<div class="terms-cell terms-cell--label">${term}</div>`
      )
      .join("")}
  </div>`;

  const dateCols = dateHeaders
    .map((date, dateIndex) => {
      const cells = terms
        .map(
          (term, index) =>
            `${index ? '<hr class="terms-divider" />' : ""}${priceCell(unit, term, dateIndex, { flyoutMode })}`
        )
        .join("");
      return `<div class="terms-col"><div class="terms-head">${date}</div>${cells}</div>`;
    })
    .join("");

  return `<div class="terms-wrap"><div class="terms-grid">${termCol}${dateCols}</div></div>`;
}

function flyoutTermsTable() {
  const unit = findUnit(state.flyoutUnit) || studioUnits[1];
  return termsTable(unit, { flyoutMode: true });
}

function unitCard(unit) {
  const open = state.openUnit === unit.id;
  return `<article class="unit-card${open ? " is-open" : ""}">
    <div class="unit-main">
      <div class="unit-fields">
        <span class="unit-field unit-field--id"><b>Unit</b><span>${unit.id}</span></span>
        <span class="unit-field"><b>Bed</b><span>${unit.bed}</span></span>
        <span class="unit-field"><b>Bath</b><span>${unit.bath}</span></span>
        <span class="unit-field"><b>Sq Ft</b><span>${unit.sqft}</span></span>
        <span class="unit-field unit-field--status"><b>Available</b><span class="badge-available">Available</span></span>
        <span class="unit-field unit-field--price"><b>Price</b><span>${unit.price}</span></span>
        <span class="unit-field unit-field--action">
          <b>Full Pricing</b>
          <button type="button" class="btn btn-secondary btn-select-unit" data-toggle-unit="${unit.id}">Select</button>
        </span>
      </div>
      <button type="button" class="chevron-button" data-toggle-unit="${unit.id}" aria-expanded="${open}" aria-label="${open ? "Collapse" : "Expand"} unit ${unit.id}">
        ${icon(open ? "less" : "more")}
      </button>
    </div>
    ${open ? termsTable(unit) : ""}
  </article>`;
}

function planCard(plan) {
  const selected = state.optionsOpen && state.activePlan === plan.id;
  return `<article class="plan-card${selected ? " is-selected" : ""}">
    <div class="plan-copy">
      <h4>${plan.name}</h4>
      <p>${plan.detail}</p>
    </div>
    <div class="plan-slot">
      ${icon("image")}
      <span>Image not available</span>
    </div>
    <button type="button" class="btn ${selected ? "btn-navy" : "btn-green"}" data-toggle-plan="${plan.id}">
      ${selected ? "Hide Options" : "Show Options"}
    </button>
  </article>`;
}

function groupCard(group) {
  const open = state.openGroups.has(group.id);
  const actions = `<div class="quote-actions">
      <button type="button" class="btn btn-calculate" data-open-flyout="${group.defaultUnit || ""}">
        ${icon("calc")}
        Calculate Price
      </button>
      <button type="button" class="btn btn-green" data-select-group="${group.id}">Select</button>
      <button type="button" class="chevron-button" data-toggle-group="${group.id}" aria-expanded="${open}" aria-label="${open ? "Collapse" : "Expand"} ${group.title}">
        ${icon(open ? "less" : "more")}
      </button>
    </div>`;
  const identity = `<div class="quote-identity">
      <span class="icon-chip">${icon("home")}</span>
      <div>
        <h3>${group.title}</h3>
        <p>${group.subtitle}</p>
      </div>
    </div>`;

  if (!open) {
    return `<section class="quote-card is-collapsed">${identity}${actions}</section>`;
  }

  const plansMarkup = group.plans
    ? `<p class="plan-banner">${group.banner}</p><div class="plan-row">${group.plans.map(planCard).join("")}</div>`
    : "";
  const tableHead = `<div class="unit-table-head" role="row">
      <span>Unit</span><span>Bed</span><span>Bath</span><span>Sq Ft</span><span>Available</span><span>Price</span><span>Full Pricing</span>
    </div>`;
  const table =
    group.id === "studio" && state.optionsOpen
      ? `${tableHead}<div class="unit-list">${studioUnits.map(unitCard).join("")}</div>`
      : group.id === "one-bed"
        ? `${tableHead}<div class="unit-list">${oneBedUnits.map(unitCard).join("")}</div>`
        : "";

  return `<section class="quote-card is-open">
    <div class="quote-top">${identity}${actions}</div>
    <div class="card-rule"></div>
    ${plansMarkup}
    ${table}
  </section>`;
}

function render() {
  const studioBanner = state.activePlan
    ? `${plans.find((plan) => plan.id === state.activePlan).name} floor plan: 565 – 580 sq ft`
    : "Studio floor plan: 565 – 580 sq ft";

  groupsEl.innerHTML = [
    groupCard({
      id: "studio",
      title: "Studio - From $2,525 / mo",
      subtitle: "3 Units - 1915, 1813, and 2099",
      banner: studioBanner,
      plans,
      defaultUnit: state.unitOfInterest || "1813",
    }),
    groupCard({
      id: "one-bed",
      title: "1 Bed - From $2,725 / mo",
      subtitle: "2 Units - 1204 and 1210",
      defaultUnit: "1204",
    }),
  ].join("");

  syncContact();
  if (state.flyoutOpen) syncFlyout();
}

groupsEl.addEventListener("click", (event) => {
  const openFlyoutBtn = event.target.closest("[data-open-flyout]");
  const group = event.target.closest("[data-toggle-group]");
  const plan = event.target.closest("[data-toggle-plan]");
  const unitToggle = event.target.closest("[data-toggle-unit]");
  const selectPrice = event.target.closest("[data-select-price]");
  const selectGroup = event.target.closest("[data-select-group]");

  if (openFlyoutBtn) {
    event.preventDefault();
    event.stopPropagation();
    openFlyout(openFlyoutBtn.getAttribute("data-open-flyout") || state.unitOfInterest || "1813");
    return;
  }

  if (selectPrice) {
    state.selected = {
      unit: selectPrice.getAttribute("data-unit"),
      term: selectPrice.getAttribute("data-term"),
      dateIndex: Number(selectPrice.getAttribute("data-date")),
    };
    applySelectionToContact(state.selected.unit, state.selected.term, state.selected.dateIndex);
    state.openUnit = state.selected.unit;
    render();
    return;
  }

  if (plan) {
    const id = plan.getAttribute("data-toggle-plan");
    if (state.optionsOpen && state.activePlan === id) {
      state.optionsOpen = false;
    } else {
      state.optionsOpen = true;
      state.activePlan = id;
      state.openGroups.add("studio");
    }
    render();
    return;
  }

  if (group) {
    const id = group.getAttribute("data-toggle-group");
    if (state.openGroups.has(id)) state.openGroups.delete(id);
    else state.openGroups.add(id);
    render();
    return;
  }

  if (unitToggle) {
    const id = unitToggle.getAttribute("data-toggle-unit");
    state.openUnit = state.openUnit === id ? "" : id;
    render();
    return;
  }

  if (selectGroup) {
    state.openGroups.add(selectGroup.getAttribute("data-select-group"));
    render();
  }
});

addonList.addEventListener("click", (event) => {
  const step = event.target.closest("[data-step]");
  if (!step) return;
  const id = step.getAttribute("data-step");
  const next = (state.addons[id] || 0) + Number(step.getAttribute("data-dir"));
  state.addons[id] = Math.min(9, Math.max(0, next));
  syncFlyout();
  const direction = step.getAttribute("data-dir");
  addonList.querySelector(`[data-step="${id}"][data-dir="${direction}"]`)?.focus();
});

flyoutTerms.addEventListener("click", (event) => {
  const price = event.target.closest("[data-flyout-price]");
  if (!price) return;
  state.flyoutSelected = {
    unit: price.getAttribute("data-unit"),
    term: price.getAttribute("data-term"),
    dateIndex: Number(price.getAttribute("data-date")),
  };
  state.flyoutUnit = state.flyoutSelected.unit;
  applySelectionToContact(state.flyoutSelected.unit, state.flyoutSelected.term, state.flyoutSelected.dateIndex, {
    fromFlyout: true,
  });
  syncContact();
  syncFlyout();
});

feesToggle.addEventListener("click", () => {
  state.feesOpen = !state.feesOpen;
  syncFees();
});

clearInterest.addEventListener("click", () => {
  state.unitOfInterest = "";
  syncContact();
});

clearTerm.addEventListener("click", () => {
  state.desiredTerm = "";
  syncContact();
});

propertyButton.addEventListener("click", () => {
  state.propertyOpen = !state.propertyOpen;
  syncContact();
});

propertyMenu.addEventListener("click", (event) => {
  const option = event.target.closest("button");
  if (!option) return;
  state.property = option.dataset.property;
  state.propertyOpen = false;
  showToast(state.property);
  render();
});

unitPickerButton.addEventListener("click", () => {
  state.unitPickerOpen = !state.unitPickerOpen;
  syncFlyout();
});

unitPickerMenu.addEventListener("click", (event) => {
  const option = event.target.closest("[data-flyout-unit]");
  if (!option) return;
  const id = option.getAttribute("data-flyout-unit");
  state.flyoutUnit = id;
  state.flyoutSelected = { ...state.flyoutSelected, unit: id };
  state.unitPickerOpen = false;
  applySelectionToContact(id, state.flyoutSelected.term, state.flyoutSelected.dateIndex, { fromFlyout: true });
  syncContact();
  syncFlyout();
});

quoteEditUnit.addEventListener("click", () => {
  state.unitPickerOpen = true;
  syncFlyout();
  unitPickerButton.focus();
});

flyoutClose.addEventListener("click", closeFlyout);
flyoutBackdrop.addEventListener("click", closeFlyout);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.flyoutOpen) {
    closeFlyout();
  }
});

document.addEventListener("click", (event) => {
  if (state.propertyOpen && !event.target.closest(".property")) {
    state.propertyOpen = false;
    syncContact();
  }
  if (state.unitPickerOpen && !event.target.closest(".unit-picker") && !event.target.closest("#quote-edit-unit")) {
    state.unitPickerOpen = false;
    if (state.flyoutOpen) syncFlyout();
  }
});

document.querySelector("#calc-save").addEventListener("click", () => {
  state.savedAddons = { ...state.addons };
  state.selected = { ...state.flyoutSelected };
  applySelectionToContact(state.flyoutSelected.unit, state.flyoutSelected.term, state.flyoutSelected.dateIndex, {
    fromFlyout: true,
  });
  showToast("Pricing saved");
  closeFlyout();
  render();
});

document.querySelector("#calc-cancel").addEventListener("click", () => {
  state.addons = { ...state.savedAddons };
  showToast("Changes discarded");
  closeFlyout();
});

document.querySelector("#refresh").addEventListener("click", () => {
  state.addons = { pet: 1, bike: 0, charges: 1, due: 0, expenses: 0, moto: 0 };
  state.savedAddons = { ...state.addons };
  state.openGroups = new Set(["studio"]);
  state.activePlan = "s2";
  state.optionsOpen = true;
  state.openUnit = "1915";
  state.feesOpen = false;
  state.selected = { unit: "1915", term: "10 month", dateIndex: 0 };
  state.flyoutUnit = "1813";
  state.flyoutSelected = { unit: "1813", term: "10 month", dateIndex: 0 };
  applySelectionToContact("1813", "10 month", 0);
  showToast("Pricing refreshed");
  render();
});

render();

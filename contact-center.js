const plans = [
  { id: "s1", name: "Studio S1" },
  { id: "s2", name: "Studio S2" },
  { id: "s3", name: "Studio S3" },
];

const studioUnits = [
  { id: "1915", bed: "0", bath: "1", sqft: "565", price: "$2549 - $2575", quotable: true },
  { id: "1813", bed: "0", bath: "1", sqft: "565", price: "$2549 - $2575", quotable: true },
  { id: "2099", bed: "0", bath: "1", sqft: "565", price: "--", quotable: false },
];

const oneBedUnits = [
  { id: "1204", bed: "1", bath: "1", sqft: "720", price: "$2725 - $2795", quotable: false },
  { id: "1210", bed: "1", bath: "1", sqft: "720", price: "$2725 - $2795", quotable: false },
];

const terms = ["10 month", "12 month", "14 month"];
const dates = ["09.01.2026", "09.15.2026", "10.01.2026"];
const datesDisplay = ["09/01/2026", "09/15/2026", "10/01/2026"];

const priceMatrix = {
  "10 month": [2615, 2595, 2575],
  "12 month": [2589, 2569, 2549],
  "14 month": [2565, 2545, 2525],
};

const addons = [
  { id: "pet", name: "Pet Rent", price: 35 },
  { id: "bike", name: "Bicycle Storage", price: 25 },
  { id: "charges", name: "Charges", price: 70 },
  { id: "due", name: "DueAtMonthly(PM)optional30", price: 30 },
  { id: "moto", name: "Motorcycle Parking", price: 70 },
  { id: "parking", name: "Parking", price: 70 },
  { id: "stepped", name: "Parking Stepped", price: 85 },
  { id: "tandem", name: "Parking - Tandem", price: 95 },
];

const RECURRING_FEES = 170;
/** Fees bundled into the leasing total beyond selected rent (matches Figma $2,900 seed). */
const BUNDLED_QUOTE_FEES = 250;

const state = {
  property: "Riverside Commons",
  moveIn: "09/01/2026",
  unitOfInterest: "1915",
  desiredTerm: "10 month",
  propertyOpen: false,
  openGroups: new Set(["studio"]),
  activePlan: "s2",
  optionsOpen: true,
  openUnit: "1915",
  selected: { unit: "1915", term: "10 month", dateIndex: 0 },
  addons: { pet: 1, bike: 0, charges: 0, due: 0, moto: 0, parking: 0, stepped: 0, tandem: 0 },
  feesOpen: true,
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
const feesSubtitle = document.querySelector("#fees-subtitle");
const feeBase = document.querySelector("#fee-base");
const feesToggle = document.querySelector("#fees-toggle");
const feesBody = document.querySelector("#fees-body");
const toast = document.querySelector("#toast");
let toastTimer = 0;

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
    minus: "icon-minus.svg",
    plus: "icon-plus.svg",
  }[name];
  return `<img src="assets/contact-center/${file}" alt="" width="20" height="20" />`;
}

function money(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function selectedRent() {
  if (!state.selected) return 2615;
  const row = priceMatrix[state.selected.term];
  return row ? row[state.selected.dateIndex] : 2615;
}

function addonTotal(counts) {
  return addons.reduce((sum, addon) => sum + addon.price * (counts[addon.id] || 0), 0);
}

function applySelectionToContact(unit, term, dateIndex) {
  state.unitOfInterest = unit;
  state.desiredTerm = term;
  state.moveIn = datesDisplay[dateIndex] ?? state.moveIn;
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

  const rent = selectedRent();
  const baseOnly = Math.max(0, rent - RECURRING_FEES);
  feeBase.textContent = money(baseOnly);
  feesSubtitle.textContent = `Total Monthly Price ${money(rent)}`;
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
      const monthly = addon.price * count;
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
        <span class="addon-price">${money(monthly)} / mo</span>
      </div>`;
    })
    .join("");

  const total = selectedRent() + BUNDLED_QUOTE_FEES + addonTotal(state.addons);
  calcTotal.textContent = `${money(total)}/mon`;
}

function priceCell(unit, term, dateIndex) {
  const amount = priceMatrix[term][dateIndex];
  const selected =
    state.selected &&
    state.selected.unit === unit.id &&
    state.selected.term === term &&
    state.selected.dateIndex === dateIndex;

  if (!unit.quotable) {
    return `<span class="terms-cell">--</span>`;
  }

  return `<button type="button" class="terms-cell${selected ? " is-selected" : ""}" data-select-price data-unit="${unit.id}" data-term="${term}" data-date="${dateIndex}">${money(amount)}</button>`;
}

function termsTable(unit) {
  const termCol = `<div class="terms-col">
    <div class="terms-head">Lease Terms</div>
    ${terms
      .map(
        (term, index) =>
          `${index ? '<hr class="terms-divider" />' : ""}<div class="terms-cell">${term}</div>`
      )
      .join("")}
  </div>`;

  const dateCols = dates
    .map((date, dateIndex) => {
      const cells = terms
        .map(
          (term, index) =>
            `${index ? '<hr class="terms-divider" />' : ""}${priceCell(unit, term, dateIndex)}`
        )
        .join("");
      return `<div class="terms-col"><div class="terms-head">${date}</div>${cells}</div>`;
    })
    .join("");

  return `<div class="terms-wrap"><div class="terms-grid">${termCol}${dateCols}</div></div>`;
}

function unitCard(unit) {
  const open = state.openUnit === unit.id;
  return `<article class="unit-card${open ? " is-open" : ""}">
    <div class="unit-main">
      <button type="button" class="unit-fields" data-toggle-unit="${unit.id}" aria-expanded="${open}">
        <span class="unit-field"><b>Unit</b><span>${unit.id}</span></span>
        <span class="unit-field"><b>Bedrooms</b><span>${unit.bed}</span></span>
        <span class="unit-field"><b>Bathrooms</b><span>${unit.bath}</span></span>
        <span class="unit-field"><b>Sq Ft</b><span>${unit.sqft}</span></span>
        <span class="unit-field"><b>Price</b><span>${unit.price}</span></span>
        <span class="unit-status"><span class="badge-available">Available</span></span>
      </button>
      <button type="button" class="chevron-button" data-toggle-unit="${unit.id}" aria-label="${open ? "Collapse" : "Expand"} unit ${unit.id}">
        ${icon(open ? "less" : "more")}
      </button>
    </div>
    ${open ? termsTable(unit) : ""}
  </article>`;
}

function planCard(plan) {
  const selected = state.optionsOpen && state.activePlan === plan.id;
  return `<article class="plan-card${selected ? " is-selected" : ""}">
    <h4>${plan.name}</h4>
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
  const table =
    group.id === "studio" && state.optionsOpen
      ? `<div class="unit-list">${studioUnits.map(unitCard).join("")}</div>`
      : group.id === "one-bed"
        ? `<div class="unit-list">${oneBedUnits.map(unitCard).join("")}</div>`
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
      id: "one-bed",
      title: "1 Bed - From $2,725 / mo",
      subtitle: "2 Units - 1204 and 1210",
    }),
    groupCard({
      id: "studio",
      title: "Studio - From $2,525 / mo",
      subtitle: "3 Units - 1915, 1813, and 2099",
      banner: studioBanner,
      plans,
    }),
  ].join("");

  syncContact();
  syncFees();
  renderAddons();
}

groupsEl.addEventListener("click", (event) => {
  const group = event.target.closest("[data-toggle-group]");
  const plan = event.target.closest("[data-toggle-plan]");
  const unitToggle = event.target.closest("[data-toggle-unit]");
  const selectPrice = event.target.closest("[data-select-price]");
  const selectGroup = event.target.closest("[data-select-group]");

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
    showToast(`${selectGroup.getAttribute("data-select-group") === "studio" ? "Studio" : "1 Bed"} selected`);
  }
});

addonList.addEventListener("click", (event) => {
  const step = event.target.closest("[data-step]");
  if (!step) return;
  const id = step.getAttribute("data-step");
  const next = (state.addons[id] || 0) + Number(step.getAttribute("data-dir"));
  state.addons[id] = Math.min(9, Math.max(0, next));
  renderAddons();
  const direction = step.getAttribute("data-dir");
  addonList.querySelector(`[data-step="${id}"][data-dir="${direction}"]`)?.focus();
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

document.addEventListener("click", (event) => {
  if (!state.propertyOpen) return;
  if (event.target.closest(".property")) return;
  state.propertyOpen = false;
  syncContact();
});

document.querySelector("#calc-save").addEventListener("click", () => {
  state.savedAddons = { ...state.addons };
  showToast("Pricing saved");
});

document.querySelector("#calc-cancel").addEventListener("click", () => {
  state.addons = { ...state.savedAddons };
  renderAddons();
  showToast("Changes discarded");
});

document.querySelector("#refresh").addEventListener("click", () => {
  state.addons = { pet: 1, bike: 0, charges: 0, due: 0, moto: 0, parking: 0, stepped: 0, tandem: 0 };
  state.savedAddons = { ...state.addons };
  state.openGroups = new Set(["studio"]);
  state.activePlan = "s2";
  state.optionsOpen = true;
  state.openUnit = "1915";
  state.feesOpen = true;
  state.selected = { unit: "1915", term: "10 month", dateIndex: 0 };
  applySelectionToContact("1915", "10 month", 0);
  showToast("Pricing refreshed");
  render();
});

render();

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
  { id: "1204", bed: "1", bath: "—", sqft: "—", price: "—", quotable: false },
  { id: "1210", bed: "1", bath: "—", sqft: "—", price: "—", quotable: false },
];

const terms = ["10 month", "12 month", "14 month"];
const dates = ["09/01/2026", "09/01/2026", "09/01/2026"];
const quotePrice = "$2,615";
const baseRent = 2615;
const addons = [
  { id: "pet", name: "Pet Rent", price: 70 },
  { id: "bike", name: "Bicycle Storage", price: 25 },
  { id: "charges", name: "Charges", price: 70 },
  { id: "due", name: "DueAtMonthly(PM)optional30", price: 70 },
  { id: "expenses", name: "Expenses / Charges", price: 70 },
  { id: "parking", name: "Motorcycle Parking", price: 70 },
];

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
  addons: { pet: 1, bike: 0, charges: 1, due: 0, expenses: 0, parking: 0 },
};

let draft = null;
let contactSnapshot = null;

const groupsEl = document.querySelector("#pricing-groups");
const moveInEl = document.querySelector("#move-in");
const interestEl = document.querySelector("#unit-interest");
const termEl = document.querySelector("#desired-term");
const clearInterest = document.querySelector("#clear-interest");
const clearTerm = document.querySelector("#clear-term");
const propertyButton = document.querySelector("#property-button");
const propertyMenu = document.querySelector("#property-menu");
const propertyValue = document.querySelector("#property-value");
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
    table: "icon-table.svg",
    less: "icon-expand-less.svg",
    more: "icon-expand-more.svg",
    image: "icon-hide-image.svg",
  }[name];
  return `<img src="assets/contact-center/${file}" alt="" />`;
}

function applySelectionToContact(unit, term, dateIndex) {
  state.unitOfInterest = unit;
  state.desiredTerm = term;
  state.moveIn = dates[dateIndex] ?? state.moveIn;
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

function priceCell(unit, term, dateIndex) {
  const selected =
    state.selected &&
    state.selected.unit === unit.id &&
    state.selected.term === term &&
    state.selected.dateIndex === dateIndex;
  if (!unit.quotable) {
    return `<span class="price-cell">--</span>`;
  }
  if (!selected) {
    return `<button type="button" class="price-cell" data-select-price data-unit="${unit.id}" data-term="${term}" data-date="${dateIndex}">${quotePrice}</button>`;
  }
  return `<div class="price-cell is-selected">
    <span>${quotePrice}</span>
    <button type="button" class="price-copy" data-open-calculator data-unit="${unit.id}" data-term="${term}" data-date="${dateIndex}" aria-label="Open pricing calculator">${icon("table")}</button>
  </div>`;
}

function termsTable(unit) {
  const header = dates.map((date) => `<b>${date}</b>`).join("");
  const body = terms
    .map((term) => {
      const cells = dates.map((_, index) => priceCell(unit, term, index)).join("");
      return `<div class="terms-row"><span class="term-label">${term}</span>${cells}</div>`;
    })
    .join("");
  return `<div class="terms"><div class="terms-grid"><div class="terms-row terms-head"><b>Lease Term</b>${header}</div>${body}</div></div>`;
}

function unitCard(unit) {
  const open = state.openUnit === unit.id;
  return `<article class="unit-card${open ? " is-open" : ""}">
    <div class="unit-main">
      <button type="button" class="unit-fields" data-toggle-unit="${unit.id}" aria-expanded="${open}" aria-label="${open ? "Collapse" : "Expand"} unit ${unit.id}">
        <strong>${unit.id}</strong>
        <span>${unit.bed}</span>
        <span>${unit.bath}</span>
        <span>${unit.sqft}</span>
        <span><span class="badge-available">Available</span></span>
        <span class="price-range">${unit.price}</span>
      </button>
      <button type="button" class="btn btn-secondary unit-select" data-select-unit="${unit.id}">Select</button>
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
      <button type="button" class="btn btn-secondary" data-calculate="${group.id}">${icon("table")}<span>Calculate Price</span></button>
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
      ? `<div class="unit-table">
          <div class="unit-columns"><span>Unit</span><span>Bed</span><span>Bath</span><span>Sq Ft</span><span>Available</span><span>Price</span><span>Full Pricing</span></div>
          ${studioUnits.map(unitCard).join("")}
        </div>`
      : group.id === "one-bed"
        ? `<div class="unit-table">${oneBedUnits.map(unitCard).join("")}</div>`
        : "";

  return `<section class="quote-card">
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
    }),
    groupCard({
      id: "one-bed",
      title: "1 Bed - From $2,725 / mo",
      subtitle: "2 Units - 1204 and 1210",
    }),
  ].join("");
  syncContact();
}

groupsEl.addEventListener("click", (event) => {
  const group = event.target.closest("[data-toggle-group]");
  const plan = event.target.closest("[data-toggle-plan]");
  const unitToggle = event.target.closest("[data-toggle-unit]");
  const selectUnit = event.target.closest("[data-select-unit]");
  const selectPrice = event.target.closest("[data-select-price]");
  const calculator = event.target.closest("[data-open-calculator]");
  const calculate = event.target.closest("[data-calculate]");
  const selectGroup = event.target.closest("[data-select-group]");

  if (calculator) {
    event.preventDefault();
    event.stopPropagation();
    openCalculator(
      calculator.getAttribute("data-unit"),
      calculator.getAttribute("data-term"),
      Number(calculator.getAttribute("data-date"))
    );
    return;
  }

  if (selectUnit) {
    event.preventDefault();
    event.stopPropagation();
    state.unitOfInterest = selectUnit.getAttribute("data-select-unit");
    showToast(`Unit ${state.unitOfInterest} selected`);
    render();
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

  if (unitToggle && !event.target.closest("[data-select-unit]")) {
    const id = unitToggle.getAttribute("data-toggle-unit");
    state.openUnit = state.openUnit === id ? "" : id;
    render();
    return;
  }

  if (calculate) {
    event.preventDefault();
    event.stopPropagation();
    const selected = state.selected;
    openCalculator(selected?.unit || "1915", selected?.term || terms[0], selected?.dateIndex ?? 0);
    return;
  }

  if (selectGroup) {
    showToast(`${selectGroup.getAttribute("data-select-group") === "studio" ? "Studio" : "1 Bed"} selected`);
  }
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

const flyoutRoot = document.querySelector("#flyout-root");
const flyoutUnit = document.querySelector("#flyout-unit");
const flyoutMatrix = document.querySelector("#flyout-matrix");
const flyoutAddons = document.querySelector("#flyout-addons");

function planCode() {
  return (state.activePlan || "s2").toUpperCase();
}

function money(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function termLabel(term) {
  return term.replace("month", "Months");
}

function addonTotal(counts) {
  return addons.reduce((sum, addon) => sum + addon.price * counts[addon.id], 0);
}

function closeCalculator({ discard = false } = {}) {
  if (discard && contactSnapshot) {
    state.unitOfInterest = contactSnapshot.unitOfInterest;
    state.desiredTerm = contactSnapshot.desiredTerm;
    state.moveIn = contactSnapshot.moveIn;
  }
  contactSnapshot = null;
  draft = null;
  flyoutRoot.hidden = true;
  syncContact();
}

function renderFlyout() {
  if (!draft) return;
  const code = planCode();
  const label = `${draft.unit} (${code})`;
  document.querySelector("#flyout-property").textContent = state.property;
  flyoutUnit.innerHTML = studioUnits
    .filter((unit) => unit.quotable)
    .map((unit) => `<option value="${unit.id}"${unit.id === draft.unit ? " selected" : ""}>${unit.id} (${code})</option>`)
    .join("");
  const header = dates.map((date) => `<b>${date}</b>`).join("");
  const rows = terms
    .map((term) => {
      const cells = dates
        .map((_, index) => {
          const selected = draft.term === term && draft.dateIndex === index;
          return `<button type="button" class="${selected ? "is-selected" : ""}" data-flyout-price data-term="${term}" data-date="${index}">${quotePrice}</button>`;
        })
        .join("");
      return `<div class="terms-row"><span>${term}</span>${cells}</div>`;
    })
    .join("");
  flyoutMatrix.innerHTML = `<div class="terms-row terms-head"><b>Lease Term</b>${header}</div>${rows}`;
  document.querySelector("#flyout-quote-unit").textContent = label;
  document.querySelector("#flyout-move-in").textContent = dates[draft.dateIndex] ?? state.moveIn;
  document.querySelector("#flyout-term").textContent = termLabel(draft.term);
  document.querySelector("#flyout-base").textContent = money(baseRent);
  flyoutAddons.innerHTML = `<div class="addon-head"><span>Personalized Add-Ons</span><span>Count</span><span>Monthly</span></div>${addons
    .map(
      (addon) => `<div class="addon-row">
        <span>${addon.name}</span>
        <span class="stepper">
          <button type="button" data-step="${addon.id}" data-dir="-1" aria-label="Decrease ${addon.name}">−</button>
          <span>${draft.addons[addon.id]}</span>
          <button type="button" data-step="${addon.id}" data-dir="1" aria-label="Increase ${addon.name}">+</button>
        </span>
        <span>${money(addon.price)}</span>
      </div>`
    )
    .join("")}`;
  const total = baseRent + addonTotal(draft.addons);
  document.querySelector("#flyout-total").innerHTML = `Unit ${label} - <strong>${money(total)}/mon</strong>`;
}

function openCalculator(unit, term, dateIndex) {
  contactSnapshot = {
    unitOfInterest: state.unitOfInterest,
    desiredTerm: state.desiredTerm,
    moveIn: state.moveIn,
  };
  draft = {
    unit,
    term,
    dateIndex,
    addons: { ...state.addons },
  };
  applySelectionToContact(unit, term, dateIndex);
  renderFlyout();
  syncContact();
  flyoutRoot.hidden = false;
  document.querySelector("#flyout-close").focus();
}

flyoutRoot.addEventListener("click", (event) => {
  const price = event.target.closest("[data-flyout-price]");
  const step = event.target.closest("[data-step]");
  if (price) {
    draft.term = price.getAttribute("data-term");
    draft.dateIndex = Number(price.getAttribute("data-date"));
    applySelectionToContact(draft.unit, draft.term, draft.dateIndex);
    renderFlyout();
    syncContact();
    return;
  }
  if (step) {
    const id = step.getAttribute("data-step");
    const next = draft.addons[id] + Number(step.getAttribute("data-dir"));
    draft.addons[id] = Math.min(9, Math.max(0, next));
    const direction = step.getAttribute("data-dir");
    renderFlyout();
    flyoutRoot.querySelector(`[data-step="${id}"][data-dir="${direction}"]`)?.focus();
  }
});

flyoutUnit.addEventListener("change", () => {
  if (!draft) return;
  draft.unit = flyoutUnit.value;
  applySelectionToContact(draft.unit, draft.term, draft.dateIndex);
  renderFlyout();
  syncContact();
});

document.querySelector("#flyout-edit-unit").addEventListener("click", () => {
  flyoutUnit.focus();
});

function saveCalculator() {
  state.addons = { ...draft.addons };
  state.selected = { unit: draft.unit, term: draft.term, dateIndex: draft.dateIndex };
  applySelectionToContact(draft.unit, draft.term, draft.dateIndex);
  state.openUnit = draft.unit;
  contactSnapshot = null;
  closeCalculator();
  showToast("Pricing saved");
  render();
}

document.querySelector("#flyout-save").addEventListener("click", saveCalculator);
document.querySelector("#flyout-cancel").addEventListener("click", () => closeCalculator({ discard: true }));
document.querySelector("#flyout-close").addEventListener("click", () => closeCalculator({ discard: true }));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && draft) closeCalculator({ discard: true });
});

document.querySelector("#refresh").addEventListener("click", () => {
  closeCalculator({ discard: true });
  state.addons = { pet: 1, bike: 0, charges: 1, due: 0, expenses: 0, parking: 0 };
  state.openGroups = new Set(["studio"]);
  state.activePlan = "s2";
  state.optionsOpen = true;
  state.openUnit = "1915";
  state.selected = { unit: "1915", term: "10 month", dateIndex: 0 };
  applySelectionToContact("1915", "10 month", 0);
  showToast("Pricing refreshed");
  render();
});

render();

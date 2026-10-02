/* Data + filter behavior aligned with Value Mapping Triage reference
 * (/Users/alexisvazquez/Downloads/index (1).html). Visual chrome stays Fee Mapping. */

const LEVEL_LABEL = { property: "Property", floorplan: "Floorplan", unit: "Unit" };

const MAPPING_SETS = [
  {
    id: "fee_type",
    metric: "type",
    label: "Type",
    levelScoped: true,
    canonical: [
      { name: "Administrative Fee", level: "property" },
      { name: "Application Fee", level: "property" },
      { name: "Amenity Fee", level: "property" },
      { name: "Valet Trash", level: "property" },
      { name: "Renters Insurance", level: "property" },
      { name: "Amenity Premium", level: "floorplan" },
      { name: "View Premium", level: "floorplan" },
      { name: "Floorplan Storage", level: "floorplan" },
      { name: "Pet Rent", level: "unit" },
      { name: "Parking", level: "unit" },
      { name: "Storage Fee", level: "unit" },
      { name: "Washer/Dryer Rental", level: "unit" },
      { name: "Utility - Cable", level: "unit" },
    ],
  },
  {
    id: "fee_category",
    metric: "category",
    label: "Category",
    levelScoped: true,
    canonical: [
      { name: "Recurring", level: "property" },
      { name: "Non-Recurring", level: "property" },
      { name: "Deposit", level: "property" },
      { name: "Refundable", level: "property" },
      { name: "Recurring", level: "floorplan" },
      { name: "Recurring", level: "unit" },
      { name: "Non-Recurring", level: "unit" },
      { name: "Deposit", level: "unit" },
    ],
  },
  {
    id: "fee_group_name",
    metric: "group",
    label: "Group",
    levelScoped: true,
    canonical: [
      { name: "Administrative", level: "property" },
      { name: "Utility", level: "property" },
      { name: "Parking", level: "property" },
      { name: "Amenity", level: "floorplan" },
      { name: "Pet", level: "unit" },
      { name: "Storage", level: "unit" },
      { name: "Parking", level: "unit" },
    ],
  },
  {
    id: "fee_frequency",
    metric: "frequency",
    label: "Frequency",
    levelScoped: false,
    canonical: [
      { name: "Monthly" },
      { name: "One Time" },
      { name: "Annual" },
      { name: "Weekly" },
      { name: "Per Use" },
    ],
  },
  {
    id: "fee_due_at_timing",
    metric: "due-date",
    label: "Due Date",
    levelScoped: false,
    canonical: [
      { name: "At Application" },
      { name: "At Lease Signing" },
      { name: "At Move-In" },
      { name: "Monthly with Rent" },
    ],
  },
];

const KAIROI = ["The Muse", "Alexan Riverdale", "Cortland Park"];
const VENTERRA = ["Townestone at 359", "Vistas at Hackberry", "Retreat at Barton Creek"];
const SEQUOIA = ["Avana Sunnyvale", "Mariners Village"];
const PATHLIGHT = ["Bell Harbor", "Onyx Glendale"];

/* Account order + labels from Figma Account dropdown */
const FIGMA_ACCOUNTS = [
  "Kairoi Residential",
  "Pathlight",
  "Sequoia Equities",
  "Venterra Living",
];

/* Property options from Figma Property dropdown (plus data-backed names for filtering) */
const FIGMA_PROPERTIES = [
  "Cedar Creek Apartments",
  "Cortland Park",
  "Serenity Heights Apartments",
  "Shoreline Apartments",
  "The Muse",
  "Vista Apartments",
];

const ACCOUNT_PROPERTIES = {
  "Kairoi Residential": KAIROI,
  "Venterra Living": VENTERRA,
  "Sequoia Equities": SEQUOIA,
  Pathlight: PATHLIGHT,
};

const ALL_PROPERTIES = Object.keys(ACCOUNT_PROPERTIES).reduce(
  (acc, key) => acc.concat(ACCOUNT_PROPERTIES[key]),
  []
);

function accountOf(property) {
  return (
    Object.keys(ACCOUNT_PROPERTIES).find((account) =>
      ACCOUNT_PROPERTIES[account].includes(property)
    ) || null
  );
}

const ROWS = [
  // fee_type - property
  {
    id: "ft-01",
    set: "fee_type",
    raw: "amenity fee",
    level: "property",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: ["Avana Sunnyvale"],
    occurrences: 194,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Amenity Fee",
    confidence: 0.98,
  },
  {
    id: "ft-02",
    set: "fee_type",
    raw: "Trash Valet",
    level: "property",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: SEQUOIA,
    occurrences: 156,
    lastSeen: "2026-09-01",
    mappedTo: null,
    suggestion: "Valet Trash",
    confidence: 0.81,
  },
  {
    id: "ft-03",
    set: "fee_type",
    raw: "Admin Fee-NonRefundable",
    level: "property",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: ["The Muse"],
    occurrences: 97,
    lastSeen: "2026-08-30",
    mappedTo: null,
    suggestion: "Administrative Fee",
    confidence: 0.74,
  },
  {
    id: "ft-04",
    set: "fee_type",
    raw: "Application Fee",
    level: "property",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: VENTERRA,
    occurrences: 501,
    lastSeen: "2026-09-02",
    mappedTo: "Application Fee",
    suggestion: null,
    confidence: null,
  },
  {
    id: "ft-05",
    set: "fee_type",
    raw: "Renters Insurance",
    level: "property",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: SEQUOIA,
    occurrences: 233,
    lastSeen: "2026-09-01",
    mappedTo: "Renters Insurance",
    suggestion: null,
    confidence: null,
  },

  // fee_type - unit
  {
    id: "ft-06",
    set: "fee_type",
    raw: "PET RENT",
    level: "unit",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: KAIROI,
    occurrences: 412,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Pet Rent",
    confidence: 0.95,
  },
  {
    id: "ft-07",
    set: "fee_type",
    raw: "Pet Rent - Monthly",
    level: "unit",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: ["Townestone at 359", "Vistas at Hackberry"],
    occurrences: 288,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Pet Rent",
    confidence: 0.92,
  },
  {
    id: "ft-08",
    set: "fee_type",
    raw: "W/D Rental",
    level: "unit",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: ["Townestone at 359"],
    occurrences: 63,
    lastSeen: "2026-08-29",
    mappedTo: null,
    suggestion: "Washer/Dryer Rental",
    confidence: 0.68,
  },
  {
    id: "ft-09",
    set: "fee_type",
    raw: "Cable/Internet Bundle",
    level: "unit",
    vendor: "AIM",
    account: "Pathlight",
    properties: ["Bell Harbor"],
    occurrences: 41,
    lastSeen: "2026-08-28",
    mappedTo: null,
    suggestion: "Utility - Cable",
    confidence: 0.55,
  },
  {
    id: "ft-10",
    set: "fee_type",
    raw: "Storage Fee",
    level: "unit",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: ["Cortland Park"],
    occurrences: 88,
    lastSeen: "2026-08-28",
    mappedTo: "Storage Fee",
    suggestion: null,
    confidence: null,
  },
  {
    id: "ft-11",
    set: "fee_type",
    raw: "Covered Parking - Reserved",
    level: "unit",
    vendor: "ResMan",
    account: "Pathlight",
    properties: ["Onyx Glendale"],
    occurrences: 74,
    lastSeen: "2026-08-27",
    mappedTo: "Parking",
    suggestion: null,
    confidence: null,
  },

  // fee_type - floorplan
  {
    id: "ft-12",
    set: "fee_type",
    raw: "Premium View",
    level: "floorplan",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: ["Avana Sunnyvale", "Mariners Village"],
    occurrences: 118,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "View Premium",
    confidence: 0.83,
  },
  {
    id: "ft-13",
    set: "fee_type",
    raw: "FP Amenity Upcharge",
    level: "floorplan",
    vendor: "Engrain",
    account: "Pathlight",
    properties: PATHLIGHT,
    occurrences: 76,
    lastSeen: "2026-09-01",
    mappedTo: null,
    suggestion: "Amenity Premium",
    confidence: 0.6,
  },
  {
    id: "ft-14",
    set: "fee_type",
    raw: "Storage - Floorplan",
    level: "floorplan",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: ["Retreat at Barton Creek"],
    occurrences: 34,
    lastSeen: "2026-08-30",
    mappedTo: null,
    suggestion: "Floorplan Storage",
    confidence: 0.89,
  },

  // fee_category
  {
    id: "fc-01",
    set: "fee_category",
    raw: "RECURRING CHARGE",
    level: "property",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: KAIROI,
    occurrences: 377,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Recurring",
    confidence: 0.84,
  },
  {
    id: "fc-02",
    set: "fee_category",
    raw: "Deposit - Refundable",
    level: "unit",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: ["Retreat at Barton Creek"],
    occurrences: 141,
    lastSeen: "2026-08-31",
    mappedTo: null,
    suggestion: "Deposit",
    confidence: 0.66,
  },
  {
    id: "fc-03",
    set: "fee_category",
    raw: "Recurring",
    level: "property",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: SEQUOIA,
    occurrences: 289,
    lastSeen: "2026-09-02",
    mappedTo: "Recurring",
    suggestion: null,
    confidence: null,
  },
  {
    id: "fc-04",
    set: "fee_category",
    raw: "FP Recurring",
    level: "floorplan",
    vendor: "Engrain",
    account: "Pathlight",
    properties: PATHLIGHT,
    occurrences: 61,
    lastSeen: "2026-09-01",
    mappedTo: null,
    suggestion: "Recurring",
    confidence: 0.72,
  },

  // fee_group_name
  {
    id: "fg-01",
    set: "fee_group_name",
    raw: "Pets",
    level: "unit",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: KAIROI,
    occurrences: 245,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Pet",
    confidence: 0.88,
  },
  {
    id: "fg-02",
    set: "fee_group_name",
    raw: "Utilities",
    level: "property",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: VENTERRA,
    occurrences: 198,
    lastSeen: "2026-09-01",
    mappedTo: null,
    suggestion: "Utility",
    confidence: 0.86,
  },
  {
    id: "fg-03",
    set: "fee_group_name",
    raw: "Parking",
    level: "property",
    vendor: "Engrain",
    account: "Pathlight",
    properties: PATHLIGHT,
    occurrences: 121,
    lastSeen: "2026-08-31",
    mappedTo: "Parking",
    suggestion: null,
    confidence: null,
  },
  {
    id: "fg-04",
    set: "fee_group_name",
    raw: "Amenities",
    level: "floorplan",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: ["Avana Sunnyvale"],
    occurrences: 47,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Amenity",
    confidence: 0.81,
  },

  // fee_frequency
  {
    id: "fq-01",
    set: "fee_frequency",
    raw: "Mo",
    level: "unit",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: KAIROI,
    occurrences: 620,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Monthly",
    confidence: 0.71,
  },
  {
    id: "fq-02",
    set: "fee_frequency",
    raw: "MONTHLY",
    level: "property",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: VENTERRA,
    occurrences: 544,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "Monthly",
    confidence: 0.99,
  },
  {
    id: "fq-03",
    set: "fee_frequency",
    raw: "1x",
    level: "property",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: SEQUOIA,
    occurrences: 310,
    lastSeen: "2026-09-01",
    mappedTo: null,
    suggestion: "One Time",
    confidence: 0.62,
  },
  {
    id: "fq-04",
    set: "fee_frequency",
    raw: "Per FP Month",
    level: "floorplan",
    vendor: "Engrain",
    account: "Pathlight",
    properties: PATHLIGHT,
    occurrences: 52,
    lastSeen: "2026-09-01",
    mappedTo: null,
    suggestion: "Monthly",
    confidence: 0.57,
  },
  {
    id: "fq-05",
    set: "fee_frequency",
    raw: "Per Month",
    level: "unit",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: VENTERRA,
    occurrences: 402,
    lastSeen: "2026-09-02",
    mappedTo: "Monthly",
    suggestion: null,
    confidence: null,
  },

  // fee_due_at_timing
  {
    id: "fd-01",
    set: "fee_due_at_timing",
    raw: "At Application",
    level: "property",
    vendor: "AIM",
    account: "Kairoi Residential",
    properties: KAIROI,
    occurrences: 203,
    lastSeen: "2026-09-01",
    mappedTo: "At Application",
    suggestion: null,
    confidence: null,
  },
  {
    id: "fd-02",
    set: "fee_due_at_timing",
    raw: "Move In",
    level: "unit",
    vendor: "ResMan",
    account: "Venterra Living",
    properties: VENTERRA,
    occurrences: 167,
    lastSeen: "2026-09-02",
    mappedTo: null,
    suggestion: "At Move-In",
    confidence: 0.79,
  },
  {
    id: "fd-03",
    set: "fee_due_at_timing",
    raw: "w/ Rent",
    level: "unit",
    vendor: "Engrain",
    account: "Sequoia Equities",
    properties: ["Mariners Village"],
    occurrences: 92,
    lastSeen: "2026-08-30",
    mappedTo: null,
    suggestion: "Monthly with Rent",
    confidence: 0.51,
  },
];

const state = {
  activeSet: "fee_type",
  accountFilters: new Set(), // empty = all
  propertyFilters: new Set(), // empty = all
  levelFilters: new Set(["unit"]), // Figma default: Level Unit
  statusFilter: "all", // Figma default: Status All
  filterQuery: "",
  search: "",
  selected: new Set(),
  overrides: {},
  appliesOverrides: {},
  saved: {},
  bulkValue: "Choose Value",
  openFilter: null,
  openCombo: null, // { kind: "map" | "applies", rowId }
  suggestedActive: new Set(),
};

const tbody = document.getElementById("fee-rows");
const selectAll = document.getElementById("select-all");
const bulkBar = document.getElementById("bulk-bar");
const selectedCount = document.getElementById("selected-count");
const bulkMap = document.getElementById("bulk-map");
const bulkMenu = document.getElementById("bulk-menu");
const bulkSave = document.getElementById("bulk-save");
const bulkClose = document.getElementById("bulk-close");
const unsavedNotice = document.getElementById("unsaved-notice");
const unsavedCount = document.getElementById("unsaved-count");
const tableSearch = document.getElementById("table-search");
const filterMenu = document.getElementById("filter-menu");
const comboMenu = document.getElementById("combo-menu");
const propertyTooltip = document.getElementById("property-tooltip");
const suggestedTooltip = document.getElementById("suggested-tooltip");
const pageTotal = document.querySelector(".page-total");
const tableWrap = document.querySelector(".table-wrap");
const TOOLTIP_SELECTOR = ".property-cell[data-tooltip], .suggested-card[data-tooltip]";

function syncTableScrollEdge() {
  if (!tableWrap) return;
  tableWrap.classList.toggle("is-scrolled", tableWrap.scrollLeft > 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function currentSet() {
  return MAPPING_SETS.find((set) => set.id === state.activeSet) || MAPPING_SETS[0];
}

function rowById(id) {
  return ROWS.find((row) => row.id === id) || null;
}

function savedMappingOf(row) {
  return Object.prototype.hasOwnProperty.call(state.saved, row.id)
    ? state.saved[row.id]
    : row.mappedTo;
}

function mappingOf(row) {
  if (Object.prototype.hasOwnProperty.call(state.overrides, row.id)) {
    return state.overrides[row.id] || null;
  }
  return savedMappingOf(row);
}

function defaultApplies(row) {
  if (row.properties.length === 1 && FIGMA_PROPERTIES.includes(row.properties[0])) {
    return { allAccounts: false, accounts: [], properties: [row.properties[0]] };
  }
  return { allAccounts: true, accounts: [], properties: [] };
}

function appliesOf(row) {
  if (Object.prototype.hasOwnProperty.call(state.appliesOverrides, row.id)) {
    const value = state.appliesOverrides[row.id];
    return {
      allAccounts: Boolean(value.allAccounts),
      accounts: [...(value.accounts || [])],
      properties: [...(value.properties || [])],
    };
  }
  return defaultApplies(row);
}

function appliesLabel(selection) {
  if (selection.allAccounts) return "All Accounts";
  if (selection.properties.length === 1 && selection.accounts.length === 0) {
    return selection.properties[0];
  }
  if (selection.accounts.length === 1 && selection.properties.length === 0) {
    return selection.accounts[0];
  }
  const count = selection.accounts.length + selection.properties.length;
  if (count === 0) return "All Accounts";
  if (count === 1) {
    return selection.accounts[0] || selection.properties[0];
  }
  return `${count} selected`;
}

function isPending(row) {
  return Object.prototype.hasOwnProperty.call(state.overrides, row.id);
}

function setRowsForSet(setId = state.activeSet) {
  return ROWS.filter((row) => row.set === setId);
}

function scopedRows(setId = state.activeSet) {
  return setRowsForSet(setId).filter((row) => {
    const accountActive =
      state.accountFilters.size > 0 && state.accountFilters.size < FIGMA_ACCOUNTS.length;
    if (accountActive && !state.accountFilters.has(row.account)) return false;

    const propertyOptions = propertyFilterOptions().map((item) => item.value);
    const propertyActive =
      state.propertyFilters.size > 0 && state.propertyFilters.size < propertyOptions.length;
    if (
      propertyActive &&
      !row.properties.some((property) => state.propertyFilters.has(property))
    ) {
      return false;
    }
    return true;
  });
}

function levelRows(setId = state.activeSet) {
  const levelActive = state.levelFilters.size > 0 && state.levelFilters.size < 3;
  return scopedRows(setId).filter((row) => !levelActive || state.levelFilters.has(row.level));
}

function visibleRows() {
  const query = state.search.trim().toLowerCase();
  return levelRows().filter((row) => {
    if (query && !row.raw.toLowerCase().includes(query)) return false;
    // Status membership uses SAVED mapping only (pending edits do not reshuffle).
    const savedMapped = Boolean(savedMappingOf(row));
    if (state.statusFilter === "unmapped" && savedMapped) return false;
    if (state.statusFilter === "mapped" && !savedMapped) return false;
    return true;
  });
}

function canonicalFor(level) {
  const set = currentSet();
  if (!set.levelScoped) return set.canonical;
  return set.canonical.filter((item) => item.level === level);
}

function uniqueCanonicalNames(list) {
  const seen = new Set();
  return list.filter((item) => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

function statusLabel(row) {
  return savedMappingOf(row) ? "Mapped" : "Unmapped";
}

function statusClass(status) {
  return status === "Mapped" ? "status-badge--mapped" : "status-badge--unmapped";
}

function propertyDisplay(row) {
  if (row.properties.length === 1) {
    return { name: row.properties[0], extra: "" };
  }
  return {
    name: row.properties[0],
    extra: `+${row.properties.length - 1}`,
  };
}

function renderSuggested(row) {
  if (!row.suggestion || row.confidence == null) {
    return `<button type="button" class="suggested-card is-empty" disabled aria-label="No suggestion">-</button>`;
  }

  const active =
    state.suggestedActive.has(row.id) || mappingOf(row) === row.suggestion ? " is-active" : "";
  const pct = `${Math.round(row.confidence * 100)}%`;
  return `
    <button type="button" class="suggested-card${active}" data-action="suggest" data-id="${row.id}" data-tooltip="Use this suggested mapping" aria-pressed="${Boolean(active)}" aria-describedby="suggested-tooltip">
      <span class="suggested-title">${escapeHtml(row.suggestion)}</span>
      <span class="suggested-pct">${escapeHtml(pct)}</span>
    </button>
  `;
}

function renderMapSelect(row) {
  const current = mappingOf(row);
  const empty = !current;
  const label = empty ? "None" : current;
  const open =
    state.openCombo && state.openCombo.kind === "map" && state.openCombo.rowId === row.id;
  return `
    <button type="button" class="map-select${empty ? " is-empty" : ""}${open ? " is-open" : ""}" data-action="map" data-id="${row.id}" aria-haspopup="listbox" aria-expanded="${open}">
      <span>${escapeHtml(label)}</span>
      <img src="assets/fee-mapping/icon-dropdown.svg" alt="" width="24" height="24" />
    </button>
  `;
}

function renderAppliesSelect(row) {
  const selection = appliesOf(row);
  const label = appliesLabel(selection);
  const open =
    state.openCombo && state.openCombo.kind === "applies" && state.openCombo.rowId === row.id;
  return `
    <button type="button" class="applies-select${open ? " is-open" : ""}" data-action="applies" data-id="${row.id}" aria-haspopup="listbox" aria-expanded="${open}">
      <span>${escapeHtml(label)}</span>
      <img src="assets/fee-mapping/icon-dropdown.svg" alt="" width="24" height="24" />
    </button>
  `;
}

function renderActions(row) {
  return `
    <div class="row-actions">
      <button type="button" class="action-btn action-btn--accept" data-action="accept" data-id="${row.id}" aria-label="Accept mapping for ${escapeHtml(row.raw)}">
        <img src="assets/fee-mapping/icon-check.svg" alt="" width="20" height="20" />
      </button>
      <button type="button" class="action-btn action-btn--reject" data-action="reject" data-id="${row.id}" aria-label="Clear mapping for ${escapeHtml(row.raw)}">
        <img src="assets/fee-mapping/icon-close-action.svg" alt="" width="20" height="20" />
      </button>
    </div>
  `;
}

function renderRow(row) {
  const checked = state.selected.has(row.id);
  const selectedClass = checked ? " is-selected" : "";
  const pending = isPending(row);
  const savedChanged =
    Object.prototype.hasOwnProperty.call(state.saved, row.id) &&
    state.saved[row.id] !== row.mappedTo;
  const editMark = pending
    ? `<span class="edit-dot" aria-label="Unsaved edit"></span>`
    : savedChanged
      ? `<span class="edited-badge">Edited</span>`
      : "";
  const property = propertyDisplay(row);
  const propertyExtra = property.extra
    ? `<span class="property-extra">${escapeHtml(property.extra)}</span>`
    : "";
  const status = statusLabel(row);

  return `
    <tr data-id="${row.id}" class="${selectedClass.trim()}">
      <td class="col-check">
        <input type="checkbox" data-action="select" data-id="${row.id}" aria-label="Select ${escapeHtml(row.raw)}" ${checked ? "checked" : ""} />
      </td>
      <td class="col-fee">
        <div class="fee-name">
          <div class="fee-name-row">
            <span class="fee-name-text">${escapeHtml(row.raw)}</span>
            ${editMark}
          </div>
          <span class="fee-source">${escapeHtml(row.vendor)}</span>
        </div>
      </td>
      <td class="col-level"><span class="level-chip">${escapeHtml(LEVEL_LABEL[row.level])}</span></td>
      <td class="col-account">${escapeHtml(row.account)}</td>
      <td class="col-property">
        <div class="property-cell" data-tooltip="${escapeHtml(row.properties.join(", "))}" tabindex="0" aria-describedby="property-tooltip">
          <span>${escapeHtml(property.name)}</span>
          ${propertyExtra}
        </div>
      </td>
      <td class="col-status"><span class="status-badge ${statusClass(status)}">${escapeHtml(status)}</span></td>
      <td class="col-suggested">${renderSuggested(row)}</td>
      <td class="col-map">${renderMapSelect(row)}</td>
      <td class="col-applies">${renderAppliesSelect(row)}</td>
      <td class="col-actions">${renderActions(row)}</td>
    </tr>
  `;
}

function updateMetrics() {
  MAPPING_SETS.forEach((set) => {
    const card = document.querySelector(`.metric-card[data-metric="${set.metric}"]`);
    if (!card) return;
    const scoped = scopedRows(set.id);
    const unmapped = scoped.filter((row) => !mappingOf(row)).length;
    card.querySelector(".metric-value").textContent = String(scoped.length);
    card.querySelector(".metric-meta span").textContent = `${unmapped} Unmapped`;
    const selected = set.id === state.activeSet;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
}

function chipSummary(selected, allLabels, emptyLabel = "All") {
  if (!selected.size || selected.size === allLabels.length) return emptyLabel;
  if (selected.size === 1) {
    const only = [...selected][0];
    return only;
  }
  return `${selected.size} selected`;
}

function updateFilterChips() {
  const levelLabels = {
    property: "Property",
    floorplan: "Floorplan",
    unit: "Unit",
  };
  const levelValues = [...state.levelFilters].map((value) => levelLabels[value] || value);
  const accountLabel = chipSummary(state.accountFilters, FIGMA_ACCOUNTS);
  const propertyOptions = propertyFilterOptions();
  const propertyLabel = chipSummary(
    state.propertyFilters,
    propertyOptions.map((item) => item.value)
  );
  const levelLabel =
    !state.levelFilters.size || state.levelFilters.size === 3
      ? "All"
      : levelValues.length === 1
        ? levelValues[0]
        : `${levelValues.length} selected`;
  const statusLabels = { unmapped: "Unmapped", mapped: "Mapped", all: "All" };
  const statusLabelText = statusLabels[state.statusFilter] || "All";
  const lvl = levelRows();
  const unmappedCount = lvl.filter((row) => !mappingOf(row)).length;

  const chips = {
    accounts: accountLabel,
    properties: propertyLabel,
    level: levelLabel,
    status: statusLabelText,
  };

  Object.entries(chips).forEach(([key, label]) => {
    const chip = document.querySelector(`.filter-chip[data-filter="${key}"]`);
    if (!chip) return;
    const strong = chip.querySelector("strong");
    if (strong) strong.textContent = label;
  });

  const statusCount = document.querySelector(".status-count");
  if (statusCount) {
    const icon = statusCount.querySelector("img");
    statusCount.replaceChildren(icon, document.createTextNode(` ${unmappedCount}`));
    statusCount.hidden = unmappedCount === 0;
  }

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const open = state.openFilter === chip.dataset.filter;
    chip.setAttribute("aria-expanded", String(open));
    chip.classList.toggle("is-open", open);
  });
}

function propertyFilterOptions() {
  // Exact option list from Figma Property dropdown
  return FIGMA_PROPERTIES.map((property) => ({ value: property, label: property }));
}

function filterOptions(kind) {
  if (kind === "accounts") {
    return FIGMA_ACCOUNTS.map((account) => ({ value: account, label: account }));
  }

  if (kind === "properties") {
    return propertyFilterOptions();
  }

  if (kind === "level") {
    return [
      { value: "floorplan", label: "Floorplan" },
      { value: "property", label: "Property" },
      { value: "unit", label: "Unit" },
    ];
  }

  if (kind === "status") {
    return [
      { value: "all", label: "Select All" },
      { value: "unmapped", label: "Unmapped" },
      { value: "mapped", label: "Mapped" },
    ];
  }

  return [];
}

function selectedSetFor(kind) {
  if (kind === "accounts") return state.accountFilters;
  if (kind === "properties") return state.propertyFilters;
  if (kind === "level") return state.levelFilters;
  return null;
}

function closeFilterMenu() {
  state.openFilter = null;
  state.filterQuery = "";
  filterMenu.hidden = true;
  updateFilterChips();
}

function checkboxIcon(checked) {
  return checked
    ? "assets/fee-mapping/icon-checkbox-checked.svg"
    : "assets/fee-mapping/icon-checkbox.svg";
}

function renderFilterMenu(kind) {
  const options = filterOptions(kind);
  const query = state.filterQuery.trim().toLowerCase();
  const filtered = query
    ? options.filter((option) => option.label.toLowerCase().includes(query))
    : options;
  const searchable = kind === "accounts" || kind === "properties";
  const multi = kind === "accounts" || kind === "properties" || kind === "level";
  const selected = selectedSetFor(kind);
  const allSelected = multi && selected && selected.size === options.length && options.length > 0;
  const selectAllChecked = Boolean(allSelected);

  let html = "";

  if (searchable) {
    const placeholder = kind === "accounts" ? "Search accounts" : "Search properties";
    html += `
      <div class="filter-menu-search">
        <img src="assets/fee-mapping/icon-search.svg" alt="" width="24" height="24" />
        <input type="search" id="filter-menu-search" placeholder="${placeholder}" value="${escapeHtml(state.filterQuery)}" aria-label="${placeholder}" />
      </div>
      <div class="filter-menu-divider"></div>
    `;
  }

  html += `<ul class="filter-menu-list" role="listbox">`;

  if (multi) {
    const selectAllLabel =
      kind === "accounts"
        ? `Select All (${options.length})`
        : kind === "properties"
          ? `Select All (${options.length})`
          : "Select All";
    html += `
      <li>
        <button type="button" class="filter-menu-option" data-filter-action="select-all" data-filter-kind="${kind}" aria-selected="${selectAllChecked}">
          <img src="${checkboxIcon(selectAllChecked)}" alt="" width="20" height="20" />
          <span>${escapeHtml(selectAllLabel)}</span>
        </button>
      </li>`;
  }

  if (kind === "status") {
    filtered.forEach((option) => {
      html += `
        <li>
          <button type="button" class="filter-menu-option is-plain" role="option" data-filter-kind="status" data-value="${escapeHtml(option.value)}" aria-selected="${state.statusFilter === option.value}">
            <span>${escapeHtml(option.label)}</span>
          </button>
        </li>`;
    });
  } else {
    filtered.forEach((option) => {
      const checked = selected.has(option.value);
      html += `
        <li>
          <button type="button" class="filter-menu-option" role="option" data-filter-kind="${kind}" data-value="${escapeHtml(option.value)}" aria-selected="${checked}">
            <img src="${checkboxIcon(checked)}" alt="" width="20" height="20" />
            <span>${escapeHtml(option.label)}</span>
          </button>
        </li>`;
    });
  }

  html += `</ul>`;
  filterMenu.innerHTML = html;

  const searchInput = filterMenu.querySelector("#filter-menu-search");
  if (searchInput) {
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
  }
}

function openFilterMenu(kind, anchor) {
  state.openFilter = kind;
  state.filterQuery = "";
  filterMenu.hidden = false;
  renderFilterMenu(kind);
  updateFilterChips();

  const rect = anchor.getBoundingClientRect();
  const menuWidth = 287;
  filterMenu.style.width = `${menuWidth}px`;
  filterMenu.style.left = `${Math.min(rect.left, window.innerWidth - menuWidth - 12)}px`;
  filterMenu.style.top = `${rect.bottom + 6}px`;
}

function toggleMultiFilter(kind, value) {
  const selected = selectedSetFor(kind);

  if (selected.has(value)) {
    selected.delete(value);
  } else {
    selected.add(value);
  }

  if (kind === "accounts" && state.accountFilters.size) {
    const allowed = new Set(
      [...state.accountFilters].flatMap((account) => ACCOUNT_PROPERTIES[account] || [])
    );
    [...state.propertyFilters].forEach((property) => {
      if (!allowed.has(property)) state.propertyFilters.delete(property);
    });
  }
}

function selectAllMulti(kind) {
  const selected = selectedSetFor(kind);
  const options = filterOptions(kind).map((item) => item.value);
  if (selected.size === options.length) {
    selected.clear();
  } else {
    selected.clear();
    options.forEach((option) => selected.add(option));
  }
}

function applyStatusFilter(value) {
  state.statusFilter = value === "all" ? "all" : value;
  state.selected.clear();
  closeFilterMenu();
  render();
}

function applyMultiFilterChange() {
  state.selected.clear();
  renderFilterMenu(state.openFilter);
  render();
}

function updateUnsaved() {
  const dirty = Object.keys(state.overrides).length;
  unsavedCount.textContent = String(dirty);
  unsavedNotice.hidden = dirty === 0;
}

function updateBulkMenuOptions() {
  const visible = visibleRows().filter((row) => state.selected.has(row.id));
  const levels = new Set(visible.map((row) => row.level));
  const set = currentSet();
  const blocked = set.levelScoped && levels.size !== 1 && visible.length > 0;

  let options = [];
  if (!blocked) {
    const level = levels.size === 1 ? [...levels][0] : "property";
    options = uniqueCanonicalNames(canonicalFor(level));
  }

  bulkMenu.innerHTML = blocked
    ? `<li><button type="button" disabled>Select one level to bulk map</button></li>`
    : [
        ...options.map(
          (item) =>
            `<li><button type="button" role="option" data-value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</button></li>`
        ),
        `<li><button type="button" role="option" data-value="">None</button></li>`,
      ].join("");
}

function updateBulkBar() {
  const count = state.selected.size;
  selectedCount.textContent = String(count);
  bulkBar.hidden = count === 0;
  if (count === 0) {
    bulkMenu.hidden = true;
    bulkMap.setAttribute("aria-expanded", "false");
    state.bulkValue = "Choose Value";
    bulkMap.querySelector("strong").textContent = state.bulkValue;
  } else {
    updateBulkMenuOptions();
  }

  const visible = visibleRows();
  selectAll.checked = visible.length > 0 && visible.every((row) => state.selected.has(row.id));
  selectAll.indeterminate =
    !selectAll.checked && visible.some((row) => state.selected.has(row.id));
}

function updatePagination() {
  const total = visibleRows().length;
  if (pageTotal) pageTotal.textContent = `/ ${Math.max(1, Math.ceil(total / 50) || 1)}`;
}

function render() {
  const rows = visibleRows();
  tbody.innerHTML =
    rows.length === 0
      ? `<tr><td colspan="10" class="empty-row">No values match this filter.</td></tr>`
      : rows.map(renderRow).join("");
  updateMetrics();
  updateFilterChips();
  updateBulkBar();
  updateUnsaved();
  updatePagination();
  syncTableScrollEdge();
  if (state.openCombo) {
    const { kind, rowId } = state.openCombo;
    const row = rowById(rowId);
    const trigger = tbody.querySelector(`button[data-action="${kind}"][data-id="${rowId}"]`);
    if (!row || !trigger) {
      closeComboMenu();
    } else {
      if (kind === "map") renderMapComboMenu(row);
      else renderAppliesComboMenu(row);
      comboMenu.hidden = false;
      trigger.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      positionComboMenu(trigger);
    }
  }
}

function syncSuggestedActive(rowId, value) {
  const row = rowById(rowId);
  if (!row) return;
  if (value && row.suggestion === value) state.suggestedActive.add(rowId);
  else state.suggestedActive.delete(rowId);
}

function setMapTo(rowId, value) {
  const row = rowById(rowId);
  if (!row) return;
  state.overrides[rowId] = value || null;
  syncSuggestedActive(rowId, value || null);
  render();
}

function applySuggestion(rowId) {
  const row = rowById(rowId);
  if (!row || !row.suggestion) return;
  state.suggestedActive.add(rowId);
  state.overrides[rowId] = row.suggestion;
  render();
}

function closeComboMenu() {
  state.openCombo = null;
  if (!comboMenu) return;
  comboMenu.hidden = true;
  comboMenu.innerHTML = "";
  comboMenu.classList.remove("combo-menu--applies");
  comboMenu.removeAttribute("data-kind");
  comboMenu.removeAttribute("data-row-id");
  tbody.querySelectorAll(".map-select.is-open, .applies-select.is-open").forEach((btn) => {
    btn.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  });
}

function positionComboMenu(trigger) {
  if (!comboMenu || !trigger) return;
  const rect = trigger.getBoundingClientRect();
  const menuWidth = 287;
  let left = rect.left;
  let top = rect.bottom + 4;
  left = Math.max(12, Math.min(left, window.innerWidth - menuWidth - 12));
  const maxHeight = Math.min(
    comboMenu.classList.contains("combo-menu--applies") ? 560 : 420,
    window.innerHeight * 0.8
  );
  if (top + Math.min(comboMenu.scrollHeight || 200, maxHeight) > window.innerHeight - 12) {
    top = Math.max(12, rect.top - Math.min(comboMenu.scrollHeight || 200, maxHeight) - 4);
  }
  comboMenu.style.width = `${menuWidth}px`;
  comboMenu.style.left = `${left}px`;
  comboMenu.style.top = `${top}px`;
}

function renderMapComboMenu(row) {
  const current = mappingOf(row) || "";
  const options = ["", ...uniqueCanonicalNames(canonicalFor(row.level)).map((item) => item.name)];
  comboMenu.classList.remove("combo-menu--applies");
  comboMenu.setAttribute("role", "listbox");
  comboMenu.innerHTML = options
    .map((value) => {
      const label = value || "None";
      const selected = current === value;
      return `<button type="button" class="combo-option" role="option" data-combo-action="map-select" data-value="${escapeHtml(value)}" aria-selected="${selected}">${escapeHtml(label)}</button>`;
    })
    .join("");
}

function checkboxIcon(checked, size) {
  if (checked) {
    return size === "sm"
      ? "assets/fee-mapping/icon-checkbox-checked.svg"
      : "assets/fee-mapping/icon-check-green.svg";
  }
  return size === "sm"
    ? "assets/fee-mapping/icon-check-blank-sm.svg"
    : "assets/fee-mapping/icon-check-blank.svg";
}

function renderAppliesComboMenu(row) {
  const selection = appliesOf(row);
  const accountChecked = (name) => selection.accounts.includes(name);
  const propertyChecked = (name) => selection.properties.includes(name);

  comboMenu.classList.add("combo-menu--applies");
  comboMenu.setAttribute("role", "listbox");
  comboMenu.innerHTML = `
    <div class="combo-section">
      <p class="combo-section-title">Accounts</p>
      <p class="combo-section-hint">Applies to all properties in the account</p>
    </div>
    <button type="button" class="combo-check-option" role="option" data-combo-action="applies-toggle" data-scope="all" aria-selected="${selection.allAccounts}">
      <img src="${checkboxIcon(selection.allAccounts, "lg")}" alt="" width="24" height="24" />
      <span>All accounts</span>
    </button>
    ${FIGMA_ACCOUNTS.map(
      (account) => `
      <button type="button" class="combo-check-option" role="option" data-combo-action="applies-toggle" data-scope="account" data-value="${escapeHtml(account)}" aria-selected="${accountChecked(account)}">
        <img src="${checkboxIcon(accountChecked(account), "lg")}" alt="" width="24" height="24" />
        <span>${escapeHtml(account)}</span>
      </button>`
    ).join("")}
    <hr class="combo-divider" />
    <div class="combo-section">
      <p class="combo-section-title">Properties</p>
    </div>
    ${FIGMA_PROPERTIES.map(
      (property) => `
      <button type="button" class="combo-check-option combo-check-option--property" role="option" data-combo-action="applies-toggle" data-scope="property" data-value="${escapeHtml(property)}" aria-selected="${propertyChecked(property)}">
        <img src="${checkboxIcon(propertyChecked(property), "sm")}" alt="" width="20" height="20" />
        <span>${escapeHtml(property)}</span>
      </button>`
    ).join("")}
  `;
}

function openComboMenu(kind, rowId, trigger) {
  const row = rowById(rowId);
  if (!row || !comboMenu) return;

  if (state.openCombo && state.openCombo.kind === kind && state.openCombo.rowId === rowId) {
    closeComboMenu();
    return;
  }

  closeFilterMenu();
  bulkMenu.hidden = true;
  bulkMap.setAttribute("aria-expanded", "false");

  state.openCombo = { kind, rowId };
  comboMenu.dataset.kind = kind;
  comboMenu.dataset.rowId = rowId;
  comboMenu.hidden = false;

  if (kind === "map") renderMapComboMenu(row);
  else renderAppliesComboMenu(row);

  tbody.querySelectorAll(".map-select, .applies-select").forEach((btn) => {
    const open = btn === trigger;
    btn.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });

  positionComboMenu(trigger);
}

function setAppliesSelection(rowId, next) {
  state.appliesOverrides[rowId] = {
    allAccounts: Boolean(next.allAccounts),
    accounts: [...(next.accounts || [])],
    properties: [...(next.properties || [])],
  };
}

function toggleAppliesOption(rowId, scope, value) {
  const row = rowById(rowId);
  if (!row) return;
  const current = appliesOf(row);
  let next = {
    allAccounts: current.allAccounts,
    accounts: [...current.accounts],
    properties: [...current.properties],
  };

  if (scope === "all") {
    next = { allAccounts: true, accounts: [], properties: [] };
  } else if (scope === "account") {
    next.allAccounts = false;
    if (next.accounts.includes(value)) {
      next.accounts = next.accounts.filter((item) => item !== value);
    } else {
      next.accounts.push(value);
    }
    if (next.accounts.length === 0 && next.properties.length === 0) {
      next.allAccounts = true;
    }
  } else if (scope === "property") {
    next.allAccounts = false;
    if (next.properties.includes(value)) {
      next.properties = next.properties.filter((item) => item !== value);
    } else {
      next.properties.push(value);
    }
    if (next.accounts.length === 0 && next.properties.length === 0) {
      next.allAccounts = true;
    }
  }

  setAppliesSelection(rowId, next);
  render();
}

function tooltipElementFor(anchor) {
  if (anchor.classList.contains("property-cell")) return propertyTooltip;
  return suggestedTooltip;
}

function hideAllTooltips() {
  [propertyTooltip, suggestedTooltip].forEach((tip) => {
    if (!tip) return;
    tip.hidden = true;
    tip.textContent = "";
  });
}

function showCellTooltip(anchor) {
  const tip = tooltipElementFor(anchor);
  const text = anchor.dataset.tooltip;
  if (!tip || !text || anchor.disabled) {
    hideAllTooltips();
    return;
  }

  hideAllTooltips();
  tip.textContent = text;
  tip.hidden = false;

  const rect = anchor.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tipRect.width / 2;
  let top = rect.top - tipRect.height - 8;

  if (top < 8) top = rect.bottom + 8;
  left = Math.max(12, Math.min(left, window.innerWidth - tipRect.width - 12));

  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

tbody.addEventListener("pointerover", (event) => {
  const anchor = event.target.closest(TOOLTIP_SELECTOR);
  if (!anchor || anchor.disabled) return;
  showCellTooltip(anchor);
});

tbody.addEventListener("pointerout", (event) => {
  const anchor = event.target.closest(TOOLTIP_SELECTOR);
  if (!anchor) return;
  const next = event.relatedTarget;
  if (next && anchor.contains(next)) return;
  hideAllTooltips();
});

tbody.addEventListener("focusin", (event) => {
  const anchor = event.target.closest(TOOLTIP_SELECTOR);
  if (!anchor || anchor.disabled) return;
  showCellTooltip(anchor);
});

tbody.addEventListener("focusout", (event) => {
  const anchor = event.target.closest(TOOLTIP_SELECTOR);
  if (!anchor) return;
  hideAllTooltips();
});

window.addEventListener("scroll", hideAllTooltips, true);

tbody.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.dataset.action !== "select") return;
  if (target.checked) state.selected.add(target.dataset.id);
  else state.selected.delete(target.dataset.id);
  updateBulkBar();
  const row = tbody.querySelector(`tr[data-id="${target.dataset.id}"]`);
  if (row) row.classList.toggle("is-selected", target.checked);
});

tbody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;

  if (action === "suggest") {
    applySuggestion(id);
    return;
  }

  if (action === "map") {
    event.stopPropagation();
    openComboMenu("map", id, button);
    return;
  }

  if (action === "applies") {
    event.stopPropagation();
    openComboMenu("applies", id, button);
    return;
  }

  if (action === "accept") {
    acceptRow(id);
    return;
  }

  if (action === "reject") {
    rejectRow(id);
  }
});

comboMenu.addEventListener("click", (event) => {
  event.stopPropagation();
  const option = event.target.closest("[data-combo-action]");
  if (!option || !state.openCombo) return;

  const { kind, rowId } = state.openCombo;
  const action = option.dataset.comboAction;

  if (kind === "map" && action === "map-select") {
    const value = option.dataset.value || null;
    closeComboMenu();
    setMapTo(rowId, value);
    return;
  }

  if (kind === "applies" && action === "applies-toggle") {
    toggleAppliesOption(rowId, option.dataset.scope, option.dataset.value || "");
  }
});

function acceptRow(rowId) {
  const row = rowById(rowId);
  if (!row) return;
  let value = mappingOf(row);
  if (!value && row.suggestion) {
    value = row.suggestion;
  }
  state.saved[rowId] = value || null;
  delete state.overrides[rowId];
  syncSuggestedActive(rowId, value || null);
  render();
}

function rejectRow(rowId) {
  const row = rowById(rowId);
  if (!row) return;
  state.overrides[rowId] = null;
  state.suggestedActive.delete(rowId);
  render();
}

selectAll.addEventListener("change", () => {
  const visible = visibleRows();
  if (selectAll.checked) visible.forEach((row) => state.selected.add(row.id));
  else visible.forEach((row) => state.selected.delete(row.id));
  render();
});

bulkClose.addEventListener("click", () => {
  state.selected.clear();
  render();
});

bulkMap.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = bulkMenu.hidden;
  bulkMenu.hidden = !open;
  bulkMap.setAttribute("aria-expanded", String(open));
});

bulkMenu.addEventListener("click", (event) => {
  const option = event.target.closest("button[data-value]");
  if (!option || option.disabled) return;
  state.bulkValue = option.dataset.value === "" ? "None" : option.dataset.value;
  bulkMap.querySelector("strong").textContent =
    state.bulkValue === "" ? "None" : state.bulkValue;
  bulkMenu.hidden = true;
  bulkMap.setAttribute("aria-expanded", "false");
});

bulkSave.addEventListener("click", () => {
  if (state.bulkValue === "Choose Value") return;
  const value = state.bulkValue === "None" ? null : state.bulkValue;
  state.selected.forEach((id) => {
    state.overrides[id] = value;
    syncSuggestedActive(id, value);
  });
  state.selected.clear();
  render();
});

tableSearch.addEventListener("input", () => {
  state.search = tableSearch.value;
  render();
});

document.querySelectorAll(".metric-card").forEach((card) => {
  card.addEventListener("click", () => {
    const set = MAPPING_SETS.find((item) => item.metric === card.dataset.metric);
    if (!set) return;
    state.activeSet = set.id;
    state.selected.clear();
    closeFilterMenu();
    render();
  });
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", (event) => {
    event.stopPropagation();
    const kind = chip.dataset.filter;
    if (state.openFilter === kind) {
      closeFilterMenu();
      return;
    }
    openFilterMenu(kind, chip);
  });
});

filterMenu.addEventListener("click", (event) => {
  const selectAll = event.target.closest("[data-filter-action='select-all']");
  if (selectAll) {
    event.preventDefault();
    selectAllMulti(selectAll.dataset.filterKind);
    applyMultiFilterChange();
    return;
  }

  const option = event.target.closest("button[data-filter-kind]");
  if (!option) return;

  const kind = option.dataset.filterKind;
  const value = option.dataset.value;
  if (kind === "status") {
    applyStatusFilter(value);
    return;
  }

  toggleMultiFilter(kind, value);
  applyMultiFilterChange();
});

filterMenu.addEventListener("input", (event) => {
  if (event.target.id !== "filter-menu-search") return;
  state.filterQuery = event.target.value;
  renderFilterMenu(state.openFilter);
});

document.addEventListener("click", (event) => {
  if (!bulkBar.contains(event.target)) {
    bulkMenu.hidden = true;
    bulkMap.setAttribute("aria-expanded", "false");
  }
  if (
    !filterMenu.contains(event.target) &&
    !event.target.closest(".filter-chip")
  ) {
    closeFilterMenu();
  }
  if (
    state.openCombo &&
    !comboMenu.contains(event.target) &&
    !event.target.closest(".map-select, .applies-select")
  ) {
    closeComboMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (state.openCombo) {
    closeComboMenu();
    return;
  }
  if (state.openFilter) closeFilterMenu();
});

window.addEventListener("resize", () => {
  if (state.openFilter) closeFilterMenu();
  if (state.openCombo) closeComboMenu();
  syncTableScrollEdge();
});

window.addEventListener(
  "scroll",
  (event) => {
    if (!state.openCombo) return;
    if (comboMenu.contains(event.target)) return;
    closeComboMenu();
  },
  true
);

if (tableWrap) {
  tableWrap.addEventListener("scroll", syncTableScrollEdge, { passive: true });
  syncTableScrollEdge();
}

render();

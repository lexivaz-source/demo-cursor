const parentShell = document.querySelector("#parent-shell");
const submenuShell = document.querySelector("#submenu-shell");
const elementsShell = document.querySelector("#elements-shell");
const layoutShell = document.querySelector("#layout-shell");
const navList = document.querySelector("#nav-list");
const actionList = document.querySelector("#action-list");
const categoryStack = document.querySelector("#category-stack");
const siteNav = document.querySelector("#site-nav");
const siteHeader = document.querySelector("#site-header .site-header") || document.querySelector(".site-header");
const megaMenu = document.querySelector("#mega-menu");
const pageOverlay = document.querySelector("#editor-page-overlay");
const phoneField = document.querySelector("#phone-field");
const phoneValue = document.querySelector("#phone-value");
const canvasPhone = document.querySelector("#canvas-phone");
const canvasPhoneText = document.querySelector("#canvas-phone-text");
const canvasActions = document.querySelector("#canvas-actions");
const canvasSearch = document.querySelector("#canvas-search");
const navItemMenu = document.querySelector("#nav-item-menu");
const actionItemMenu = document.querySelector("#action-item-menu");
const categoryMenu = document.querySelector("#category-menu");
const linkItemMenu = document.querySelector("#link-item-menu");
const submenuItemMenu = document.querySelector("#submenu-item-menu");

const ORIENTATION_JUSTIFY = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};

const state = {
  navItems: [
    { id: "wdr", label: "Wisconsin Dells Rentals", hasSubmenu: true },
    { id: "golf", label: "Golf Course", hasSubmenu: false },
    { id: "pools", label: "Pools & Recreation", hasSubmenu: false },
    { id: "bar", label: "Sports Bar & Grill", hasSubmenu: false },
    { id: "weddings", label: "Wedding & Events", hasSubmenu: false },
    { id: "about", label: "About Us", hasSubmenu: false },
  ],
  actionItems: [{ id: "contact", label: "Contact Us", canvasKey: "contact" }],
  elements: {
    phone: true,
    search: true,
    recent: true,
    favorites: true,
    cart: true,
  },
  phone: "(800) 228-4349",
  menuType: "horizontal-1",
  linkColor: "#ffffff",
  linkWeight: "500",
  orientation: "center",
  linkSpacing: 10,
  verticalPadding: 20,
  ctaPadding: 10,
  submenuColor: "#ffffff",
  containSubmenu: true,
  openOnHover: true,
  categories: [
    {
      id: "vacation",
      title: "Vacation Homes",
      titleHidden: false,
      collapsed: false,
      links: [
        { id: "all-homes", label: "All Vacation Homes" },
        { id: "up-to-3", label: "Up to 3 bedrooms" },
      ],
    },
    {
      id: "condos",
      title: "Condos & Hotel Rooms",
      titleHidden: false,
      collapsed: true,
      links: [
        { id: "all-condos", label: "All Condos" },
        { id: "three-bed", label: "3 bedroom condos" },
      ],
    },
  ],
  activeMenu: null,
  menuTarget: null,
  megaOpen: false,
};

const fieldMenus = [];

function closeMenus() {
  fieldMenus.forEach(({ trigger, menu }) => {
    if (!menu || !trigger) return;
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  });
  closeContextMenus();
}

function closeContextMenus() {
  [navItemMenu, actionItemMenu, categoryMenu, linkItemMenu, submenuItemMenu].forEach((menu) => {
    if (menu) menu.hidden = true;
  });
  document.querySelectorAll("[aria-expanded='true']").forEach((el) => {
    if (el.classList.contains("icon-button") || el.id === "submenu-item-more") {
      el.setAttribute("aria-expanded", "false");
    }
  });
  state.activeMenu = null;
  state.menuTarget = null;
}

function bindMenu(trigger, menu, onPick) {
  if (!trigger || !menu) return;
  fieldMenus.push({ trigger, menu });
  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    closeMenus();
    if (willOpen) {
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }
  });
  menu.querySelectorAll("button").forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      menu.querySelectorAll("button").forEach((item) => {
        item.setAttribute("aria-selected", String(item === option));
      });
      onPick?.(option);
      closeMenus();
    });
  });
}

function setSwitch(button, on) {
  button.classList.toggle("on", on);
  button.setAttribute("aria-checked", String(on));
}

function bindSwitch(id, key) {
  const button = document.querySelector(`#${id}`);
  if (!button) return;
  button.addEventListener("click", () => {
    state.elements[key] = !state.elements[key];
    setSwitch(button, state.elements[key]);
    renderCanvas();
  });
}

function setParentTab(name) {
  closeMenus();
  ["content", "design", "submenu"].forEach((tab) => {
    const selected = tab === name;
    const button = document.querySelector(`#tab-${tab}`);
    const panel = document.querySelector(`#panel-${tab}`);
    if (button) {
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    }
    if (panel) panel.hidden = !selected;
  });
  document.querySelectorAll(".review-bar .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.view === name);
  });
}

function hideAllShells() {
  parentShell.hidden = true;
  submenuShell.hidden = true;
  elementsShell.hidden = true;
  if (layoutShell) layoutShell.hidden = true;
}

function showParent(tab = "content") {
  hideAllShells();
  parentShell.hidden = false;
  setParentTab(tab);
}

function showSubmenu() {
  closeMenus();
  hideAllShells();
  submenuShell.hidden = false;
  renderCategories();
  document.querySelectorAll(".review-bar .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.view === "submenu");
  });
}

function showElements() {
  closeMenus();
  hideAllShells();
  elementsShell.hidden = false;
  document.querySelectorAll(".review-bar .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.view === "content");
  });
}

function showLayout() {
  closeMenus();
  hideAllShells();
  if (layoutShell) layoutShell.hidden = false;
  document.querySelectorAll(".review-bar .chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.view === "design");
  });
}

function formatPx(value) {
  return `${value} px`;
}

function parsePx(raw) {
  const match = String(raw).match(/-?\d+/);
  if (!match) return null;
  return Number(match[0]);
}

function setSliderPct(slider) {
  if (!slider) return;
  const min = Number(slider.min) || 0;
  const max = Number(slider.max) || 100;
  const value = Number(slider.value) || 0;
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  slider.style.setProperty("--layout-pct", `${pct}%`);
  slider.setAttribute("aria-valuenow", String(value));
}

function bindLayoutSlider(sliderId, inputId, key) {
  const slider = document.querySelector(`#${sliderId}`);
  const input = document.querySelector(`#${inputId}`);
  if (!slider || !input) return;

  const syncFromSlider = () => {
    state[key] = Number(slider.value);
    input.value = formatPx(state[key]);
    setSliderPct(slider);
    renderCanvas();
  };

  const syncFromInput = () => {
    const parsed = parsePx(input.value);
    if (parsed === null) {
      input.value = formatPx(state[key]);
      return;
    }
    const min = Number(slider.min) || 0;
    const max = Number(slider.max) || 100;
    const clamped = Math.min(max, Math.max(min, parsed));
    state[key] = clamped;
    slider.value = String(clamped);
    input.value = formatPx(clamped);
    setSliderPct(slider);
    renderCanvas();
  };

  slider.value = String(state[key]);
  input.value = formatPx(state[key]);
  setSliderPct(slider);
  slider.addEventListener("input", syncFromSlider);
  input.addEventListener("change", syncFromInput);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      syncFromInput();
      input.blur();
    }
  });
}

function placeMenu(menu, anchor) {
  const rect = anchor.getBoundingClientRect();
  menu.hidden = false;
  const width = menu.offsetWidth || 187;
  let left = rect.right - width;
  let top = rect.bottom + 4;
  if (left < 8) left = 8;
  if (top + menu.offsetHeight > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menu.offsetHeight - 4);
  }
  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(top)}px`;
}

function openNavMenu(button, itemId) {
  closeMenus();
  state.activeMenu = "nav";
  state.menuTarget = itemId;
  button.setAttribute("aria-expanded", "true");
  placeMenu(navItemMenu, button);
}

function openActionMenu(button, itemId) {
  closeMenus();
  state.activeMenu = "action";
  state.menuTarget = itemId;
  button.setAttribute("aria-expanded", "true");
  placeMenu(actionItemMenu, button);
}

function openCategoryMenu(button, categoryId) {
  closeMenus();
  state.activeMenu = "category";
  state.menuTarget = categoryId;
  const category = state.categories.find((entry) => entry.id === categoryId);
  const toggleBtn = categoryMenu.querySelector('[data-action="toggle-title"]');
  if (toggleBtn && category) {
    toggleBtn.textContent = category.titleHidden ? "Show Category title" : "Hide Category title";
  }
  button.setAttribute("aria-expanded", "true");
  placeMenu(categoryMenu, button);
}

function openLinkMenu(button, categoryId, linkId) {
  closeMenus();
  state.activeMenu = "link";
  state.menuTarget = { categoryId, linkId };
  button.setAttribute("aria-expanded", "true");
  placeMenu(linkItemMenu, button);
}

function findLinkTarget() {
  const target = state.menuTarget;
  if (!target?.categoryId || !target?.linkId) return null;
  const category = state.categories.find((entry) => entry.id === target.categoryId);
  if (!category) return null;
  const link = category.links.find((entry) => entry.id === target.linkId);
  if (!link) return null;
  return { category, link };
}

function renderNavList() {
  navList.innerHTML = state.navItems
    .map(
      (item) => `
      <li class="nav-row" data-id="${item.id}">
        <span class="drag-handle" aria-hidden="true" title="Drag">
          <img src="assets/menu-settings/icon-drag.svg" alt="" width="28" height="28" />
        </span>
        <span class="nav-label" data-id="${item.id}">${item.label}</span>
        <button type="button" class="icon-button nav-more" data-id="${item.id}" aria-label="${item.label} options" aria-haspopup="menu" aria-expanded="false">
          <span class="icon-24">
            <img src="assets/menu-settings/icon-more.svg" alt="" width="24" height="24" />
          </span>
        </button>
      </li>`
    )
    .join("");

  navList.querySelectorAll(".nav-more").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openNavMenu(button, button.dataset.id);
    });
  });

  navList.querySelectorAll(".nav-label").forEach((label) => {
    label.addEventListener("dblclick", () => startInlineEdit(label, (value) => {
      const item = state.navItems.find((entry) => entry.id === label.dataset.id);
      if (!item) return;
      item.label = value;
      renderNavList();
      renderCanvas();
    }));
  });
}

function renderActionList() {
  actionList.innerHTML = state.actionItems
    .map(
      (item) => `
      <li class="nav-row" data-id="${item.id}">
        <span class="drag-handle" aria-hidden="true" title="Drag">
          <img src="assets/menu-settings/icon-drag.svg" alt="" width="28" height="28" />
        </span>
        <span class="nav-label action-label" data-id="${item.id}">${item.label}</span>
        <button type="button" class="icon-button action-more" data-id="${item.id}" aria-label="${item.label} options" aria-haspopup="menu" aria-expanded="false">
          <span class="icon-24">
            <img src="assets/menu-settings/icon-more.svg" alt="" width="24" height="24" />
          </span>
        </button>
      </li>`
    )
    .join("");

  actionList.querySelectorAll(".action-more").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openActionMenu(button, button.dataset.id);
    });
  });

  actionList.querySelectorAll(".action-label").forEach((label) => {
    label.addEventListener("dblclick", () =>
      startInlineEdit(label, (value) => {
        const item = state.actionItems.find((entry) => entry.id === label.dataset.id);
        if (!item) return;
        item.label = value;
        renderActionList();
        renderCanvas();
      })
    );
  });
}

function renderCategories() {
  categoryStack.innerHTML = state.categories
    .map((category) => {
      const links = category.collapsed
        ? ""
        : `
        <div class="category-links">
          ${category.links
            .map(
              (link) => `
            <div class="category-link" data-link="${link.id}">
              <span></span>
              <span class="drag-handle" aria-hidden="true">
                <img src="assets/menu-settings/icon-drag.svg" alt="" width="28" height="28" />
              </span>
              <span class="link-title" data-link="${link.id}" data-cat="${category.id}">${link.label}</span>
              <button type="button" class="icon-button link-more" data-link="${link.id}" data-cat="${category.id}" aria-label="${link.label} options" aria-haspopup="menu" aria-expanded="false">
                <span class="icon-24">
                  <img src="assets/menu-settings/icon-more.svg" alt="" width="24" height="24" />
                </span>
              </button>
            </div>`
            )
            .join("")}
        </div>
        <button type="button" class="medium-button medium-button--leading add-link" data-cat="${category.id}">
          <span class="icon-28" aria-hidden="true">
            <img src="assets/menu-settings/icon-add.svg" alt="" width="28" height="28" />
          </span>
          Add Item
        </button>`;

      return `
        <article class="category-card" data-cat="${category.id}">
          <div class="category-head">
            <span class="drag-handle" aria-hidden="true">
              <img src="assets/menu-settings/icon-drag.svg" alt="" width="28" height="28" />
            </span>
            <div class="cat-title-row${category.titleHidden ? " is-hidden" : ""}">
              <span class="cat-title" data-cat="${category.id}">${category.title}</span>
              ${
                category.titleHidden
                  ? `<span class="cat-hidden-icon" title="Category title hidden" aria-label="Category title hidden">
                <img src="assets/menu-settings/icon-eye-off.svg" alt="" width="16" height="16" />
              </span>`
                  : ""
              }
            </div>
            <div class="category-actions">
              <button type="button" class="icon-button cat-more" data-cat="${category.id}" aria-label="${category.title} options" aria-haspopup="menu" aria-expanded="false">
                <span class="icon-24">
                  <img src="assets/menu-settings/icon-more.svg" alt="" width="24" height="24" />
                </span>
              </button>
              <button type="button" class="icon-button cat-toggle" data-cat="${category.id}" aria-label="${category.collapsed ? "Expand" : "Collapse"} ${category.title}" aria-expanded="${String(!category.collapsed)}">
                <span class="icon-28">
                  <img src="assets/menu-settings/icon-chevron-up.svg" alt="" width="28" height="28" style="transform: rotate(${category.collapsed ? 180 : 0}deg)" />
                </span>
              </button>
            </div>
          </div>
          ${links}
        </article>`;
    })
    .join("");

  categoryStack.querySelectorAll(".cat-more").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openCategoryMenu(button, button.dataset.cat);
    });
  });

  categoryStack.querySelectorAll(".link-more").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openLinkMenu(button, button.dataset.cat, button.dataset.link);
    });
  });

  categoryStack.querySelectorAll(".cat-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const category = state.categories.find((entry) => entry.id === button.dataset.cat);
      if (!category) return;
      category.collapsed = !category.collapsed;
      renderCategories();
    });
  });

  categoryStack.querySelectorAll(".add-link").forEach((button) => {
    button.addEventListener("click", () => {
      const category = state.categories.find((entry) => entry.id === button.dataset.cat);
      if (!category) return;
      const index = category.links.length + 1;
      category.links.push({ id: `link-${Date.now()}`, label: `Link ${index}` });
      renderCategories();
      renderCanvas();
    });
  });

  categoryStack.querySelectorAll(".cat-title").forEach((title) => {
    title.addEventListener("dblclick", () => {
      const category = state.categories.find((entry) => entry.id === title.dataset.cat);
      if (!category) return;
      startInlineEdit(title, (value) => {
        category.title = value;
        renderCategories();
        renderCanvas();
      });
    });
  });

  categoryStack.querySelectorAll(".link-title").forEach((title) => {
    title.addEventListener("dblclick", () => {
      const category = state.categories.find((entry) => entry.id === title.dataset.cat);
      const link = category?.links.find((entry) => entry.id === title.dataset.link);
      if (!link) return;
      startInlineEdit(title, (value) => {
        link.label = value;
        renderCategories();
        renderCanvas();
      });
    });
  });
}

function startInlineEdit(el, onCommit) {
  if (el.isContentEditable) return;
  const previous = el.textContent.trim();
  el.contentEditable = "true";
  el.classList.add("is-editing");
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  const finish = (commit) => {
    el.contentEditable = "false";
    el.classList.remove("is-editing");
    const next = el.textContent.trim() || previous;
    el.textContent = next;
    if (commit && next !== previous) onCommit(next);
    el.removeEventListener("blur", onBlur);
    el.removeEventListener("keydown", onKey);
  };

  const onBlur = () => finish(true);
  const onKey = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      finish(true);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      el.textContent = previous;
      finish(false);
    }
  };

  el.addEventListener("blur", onBlur);
  el.addEventListener("keydown", onKey);
}

function bindCanvasNavEvents() {
  siteNav.querySelectorAll(".nav-link.has-submenu").forEach((link) => {
    link.addEventListener("click", () => {
      state.megaOpen = !state.megaOpen;
      renderCanvas();
    });
    link.addEventListener("mouseenter", () => {
      if (!state.openOnHover) return;
      state.megaOpen = true;
      renderCanvas();
    });
  });
}

function renderCanvas() {
  canvasPhone.hidden = !state.elements.phone;
  if (canvasPhoneText) canvasPhoneText.textContent = state.phone;
  else canvasPhone.textContent = state.phone;
  canvasPhone.href = `tel:${state.phone.replace(/\D/g, "")}`;
  canvasSearch.hidden = !state.elements.search;
  if (phoneField) phoneField.hidden = !state.elements.phone;

  if (canvasActions) {
    canvasActions.innerHTML = state.actionItems
      .map((item) => `<a class="util-link" href="#" data-action-id="${item.id}">${item.label}</a>`)
      .join("");
  }

  document.querySelectorAll("#canvas-tools .tool-icon").forEach((icon) => {
    const key = icon.dataset.tool;
    icon.hidden = !state.elements[key];
  });

  siteNav.style.setProperty("--nav-link", state.linkColor);
  siteNav.style.setProperty("--nav-weight", state.linkWeight);
  siteNav.style.setProperty("--nav-link-gap", `${state.linkSpacing}px`);
  siteNav.style.setProperty("--nav-v-pad", `${Math.max(4, Math.round(state.verticalPadding / 2))}px`);
  siteNav.style.setProperty("--nav-justify", ORIENTATION_JUSTIFY[state.orientation] || "center");
  if (siteHeader) {
    siteHeader.style.setProperty("--header-v-pad", `${Math.max(6, Math.round(state.verticalPadding / 2))}px`);
    siteHeader.style.setProperty("--cta-pad", `${Math.max(8, state.ctaPadding + 12)}px`);
  }
  siteNav.dataset.menuType = state.menuType;

  siteNav.innerHTML = state.navItems
    .map((item) => {
      if (item.hasSubmenu) {
        return `<button type="button" class="nav-link has-submenu${state.megaOpen ? " is-open" : ""}" data-nav="${item.id}">${item.label}<span class="nav-caret" aria-hidden="true"></span></button>`;
      }
      return `<button type="button" class="nav-link" data-nav="${item.id}">${item.label}</button>`;
    })
    .join("");
  bindCanvasNavEvents();

  megaMenu.innerHTML = state.categories
    .map(
      (category) => `
      <div class="mega-col" data-cat="${category.id}">
        <p class="mega-title"${category.titleHidden ? " hidden" : ""}>${category.title}</p>
        ${category.links.map((link) => `<a href="#">${link.label}</a>`).join("")}
      </div>`
    )
    .join("");

  megaMenu.style.background = state.submenuColor;
  megaMenu.classList.toggle("is-contained", state.containSubmenu);
  megaMenu.hidden = !state.megaOpen;
}

function addNavItem() {
  const id = `nav-${Date.now()}`;
  state.navItems.push({ id, label: "New Item", hasSubmenu: false });
  renderNavList();
  renderCanvas();
}

function addActionItem() {
  const id = `action-${Date.now()}`;
  state.actionItems.push({ id, label: "New Action" });
  renderActionList();
  renderCanvas();
}

function addCategory() {
  const id = `cat-${Date.now()}`;
  state.categories.push({
    id,
    title: "New Category",
    titleHidden: false,
    collapsed: false,
    links: [{ id: `link-${Date.now()}`, label: "Link 1" }],
  });
  renderCategories();
  renderCanvas();
}

/* Tabs */
document.querySelector("#tab-content").addEventListener("click", () => {
  if (parentShell.hidden) showParent("content");
  else setParentTab("content");
});
document.querySelector("#tab-design").addEventListener("click", () => {
  if (parentShell.hidden) showParent("design");
  else setParentTab("design");
});
document.querySelector("#tab-submenu").addEventListener("click", () => {
  if (parentShell.hidden) showParent("submenu");
  else setParentTab("submenu");
});

document.querySelector("#device-btn").addEventListener("click", () => {
  const pressed = document.querySelector("#device-btn").getAttribute("aria-pressed") === "true";
  document.querySelector("#device-btn").setAttribute("aria-pressed", String(!pressed));
  document.querySelector("#device-btn").classList.toggle("active", !pressed);
});

document.querySelector("#submenu-back").addEventListener("click", () => showParent("submenu"));
document.querySelector("#elements-back").addEventListener("click", () => showParent("content"));
document.querySelector("#layout-back")?.addEventListener("click", () => showParent("design"));
document.querySelector("#open-elements").addEventListener("click", showElements);
document.querySelector("#open-layout")?.addEventListener("click", showLayout);
document.querySelector("#add-nav-item").addEventListener("click", addNavItem);
document.querySelector("#add-action-item").addEventListener("click", addActionItem);
document.querySelector("#add-category").addEventListener("click", addCategory);

document.querySelector("#submenu-item-more").addEventListener("click", (event) => {
  event.stopPropagation();
  const open = submenuItemMenu.hidden;
  closeMenus();
  if (open) {
    submenuItemMenu.hidden = false;
    document.querySelector("#submenu-item-more").setAttribute("aria-expanded", "true");
  }
});

submenuItemMenu.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "edit-title") {
      const title = document.querySelector("#submenu-item-name");
      startInlineEdit(title, (value) => {
        document.querySelector("#submenu-title").textContent = value;
        const item = state.navItems.find((entry) => entry.id === "wdr");
        if (item) item.label = value;
        renderNavList();
        renderCanvas();
      });
    }
    if (action === "add-category") addCategory();
    if (action === "delete-submenu") {
      state.categories = [];
      renderCategories();
      renderCanvas();
    }
    closeMenus();
  });
});

navItemMenu.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = state.navItems.find((entry) => entry.id === state.menuTarget);
    if (!item) return;
    if (button.dataset.action === "edit-submenu") {
      if (item.id === "wdr") showSubmenu();
      else {
        item.hasSubmenu = true;
        showSubmenu();
      }
    }
    if (button.dataset.action === "rename") {
      const label = navList.querySelector(`.nav-label[data-id="${item.id}"]`);
      if (label) {
        startInlineEdit(label, (value) => {
          item.label = value;
          renderNavList();
          renderCanvas();
        });
      }
    }
    if (button.dataset.action === "delete") {
      state.navItems = state.navItems.filter((entry) => entry.id !== item.id);
      renderNavList();
      renderCanvas();
    }
    closeMenus();
  });
});

actionItemMenu.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = state.actionItems.find((entry) => entry.id === state.menuTarget);
    if (!item) return;
    if (button.dataset.action === "rename") {
      const label = actionList.querySelector(`.action-label[data-id="${item.id}"]`);
      if (label) {
        startInlineEdit(label, (value) => {
          item.label = value;
          renderActionList();
          renderCanvas();
        });
      }
    }
    if (button.dataset.action === "delete") {
      state.actionItems = state.actionItems.filter((entry) => entry.id !== item.id);
      renderActionList();
      renderCanvas();
    }
    closeMenus();
  });
});

categoryMenu.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const category = state.categories.find((entry) => entry.id === state.menuTarget);
    if (!category) return;
    if (button.dataset.action === "edit-category") {
      const title = categoryStack.querySelector(`.cat-title[data-cat="${category.id}"]`);
      if (title) {
        startInlineEdit(title, (value) => {
          category.title = value;
          renderCategories();
          renderCanvas();
        });
      }
    }
    if (button.dataset.action === "toggle-title") {
      category.titleHidden = !category.titleHidden;
      renderCategories();
      renderCanvas();
    }
    closeMenus();
  });
});

linkItemMenu.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    const target = findLinkTarget();
    if (!target) {
      closeMenus();
      return;
    }
    const { category, link } = target;
    if (button.dataset.action === "edit") {
      const title = categoryStack.querySelector(`.link-title[data-link="${link.id}"]`);
      closeMenus();
      if (title) {
        startInlineEdit(title, (value) => {
          link.label = value;
          renderCategories();
          renderCanvas();
        });
      }
      return;
    }
    if (button.dataset.action === "move-main") {
      category.links = category.links.filter((entry) => entry.id !== link.id);
      state.navItems.push({ id: `nav-${Date.now()}`, label: link.label, hasSubmenu: false });
      renderCategories();
      renderNavList();
      renderCanvas();
    }
    if (button.dataset.action === "delete") {
      category.links = category.links.filter((entry) => entry.id !== link.id);
      renderCategories();
      renderCanvas();
    }
    closeMenus();
  });
});

bindSwitch("toggle-phone", "phone");
bindSwitch("toggle-search", "search");
bindSwitch("toggle-recent", "recent");
bindSwitch("toggle-favorites", "favorites");
bindSwitch("toggle-cart", "cart");

function bindConstraintSwitch(id, key) {
  const button = document.querySelector(`#${id}`);
  if (!button) return;
  setSwitch(button, state[key]);
  button.addEventListener("click", () => {
    state[key] = button.getAttribute("aria-checked") !== "true";
    setSwitch(button, state[key]);
    renderCanvas();
  });
}

bindConstraintSwitch("toggle-contain", "containSubmenu");
bindConstraintSwitch("toggle-hover", "openOnHover");

bindMenu(document.querySelector("#phone-trigger"), document.querySelector("#phone-menu"), (option) => {
  state.phone = option.dataset.phone;
  phoneValue.textContent = state.phone;
  renderCanvas();
});

bindMenu(document.querySelector("#menu-type-trigger"), document.querySelector("#menu-type-menu"), (option) => {
  state.menuType = option.dataset.menuType;
  const label = document.querySelector("#menu-type-value");
  if (label) label.textContent = option.textContent.trim();
  renderCanvas();
});

bindMenu(document.querySelector("#submenu-color-trigger"), document.querySelector("#submenu-color-menu"), (option) => {
  state.submenuColor = option.dataset.color;
  document.querySelector("#submenu-swatch").style.background = state.submenuColor;
  document.querySelector("#submenu-color-name").textContent = option.dataset.name;
  renderCanvas();
});

document.querySelectorAll("#layout-orientation button").forEach((button) => {
  button.addEventListener("click", () => {
    state.orientation = button.dataset.orientation;
    document.querySelectorAll("#layout-orientation button").forEach((entry) => {
      const selected = entry === button;
      entry.classList.toggle("active", selected);
      entry.setAttribute("aria-pressed", String(selected));
    });
    renderCanvas();
  });
});

bindLayoutSlider("link-spacing-slider", "link-spacing-value", "linkSpacing");
bindLayoutSlider("vertical-padding-slider", "vertical-padding-value", "verticalPadding");
bindLayoutSlider("cta-padding-slider", "cta-padding-value", "ctaPadding");

document.querySelectorAll(".review-bar .chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const view = chip.dataset.view;
    if (view === "mega") {
      state.megaOpen = true;
      showParent("content");
      renderCanvas();
      document.querySelectorAll(".review-bar .chip").forEach((entry) => {
        entry.classList.toggle("active", entry === chip);
      });
      return;
    }
    state.megaOpen = false;
    if (view === "submenu") {
      showSubmenu();
      return;
    }
    showParent(view);
    renderCanvas();
  });
});

document.addEventListener("click", closeMenus);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenus();
    if (state.megaOpen) {
      state.megaOpen = false;
      renderCanvas();
    }
  }
});

if (pageOverlay) {
  pageOverlay.addEventListener("click", (event) => {
    event.stopPropagation();
    closeMenus();
    if (state.megaOpen) {
      state.megaOpen = false;
      renderCanvas();
    }
  });
}

renderNavList();
renderActionList();
renderCategories();
renderCanvas();

(() => {
  "use strict";

  const input = document.querySelector("[data-library-search]");
  const filters = document.querySelector("[data-library-categories]");
  const filterContainer = document.querySelector("[data-category-container]");
  const body = document.querySelector("[data-library-items]");
  const empty = document.querySelector("[data-library-empty]");
  const resultCount = document.querySelector("[data-results-count]");
  if (!input || !filters || !filterContainer || !body || !empty || !resultCount) return;

  const params = new URLSearchParams(location.search);
  const state = {
    query: params.get("q") || "",
    category: (params.get("category") || "all").toLowerCase(),
  };

  function make(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = String(content);
    return element;
  }

  function rows() { return [...body.querySelectorAll("[data-library-item]")]; }

  function syncUrl() {
    if (location.protocol === "file:") return;
    const target = new URL(location.href);
    if (state.query) target.searchParams.set("q", state.query);
    else target.searchParams.delete("q");
    if (state.category !== "all") target.searchParams.set("category", state.category);
    else target.searchParams.delete("category");
    history.replaceState(null, "", target.pathname + target.search + target.hash);
  }

  function updateFilterButtons() {
    filters.querySelectorAll("[data-category]").forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
    });
  }

  function render() {
    const needle = state.query.toLowerCase().trim();
    let count = 0;
    for (const row of rows()) {
      const matches = (state.category === "all" || row.dataset.categoryName.toLowerCase() === state.category)
        && (!needle || row.dataset.searchKey.includes(needle));
      row.hidden = !matches;
      if (matches) count++;
    }
    resultCount.textContent = count + " " + (count === 1 ? "skill" : "skills");
    empty.hidden = count !== 0;
    updateFilterButtons();
  }

  function reset() {
    state.query = "";
    state.category = "all";
    input.value = "";
    syncUrl();
    render();
    input.focus();
  }

  function renderCategories(skills) {
    const available = [...new Set(skills.map(skill => String(skill.category).trim()).filter(Boolean))].sort();
    filters.replaceChildren();
    filterContainer.hidden = available.length < 2;
    if (available.length < 2) {
      state.category = "all";
      syncUrl();
      return;
    }
    if (state.category !== "all" && !available.some(cat => cat.toLowerCase() === state.category)) {
      state.category = "all";
    }
    for (const category of ["All", ...available]) {
      const button = make("button", "directory-category-pill", category);
      button.type = "button";
      button.dataset.category = category === "All" ? "all" : category.toLowerCase();
      button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
      filters.append(button);
    }
    syncUrl();
  }

  let toastTimer;
  function notify(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.visible = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.dataset.visible = "false"; }, 2100);
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      notify("Install command copied");
    } catch {
      const textarea = make("textarea");
      textarea.value = text;
      textarea.readOnly = true;
      textarea.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.append(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      textarea.remove();
      notify(success ? "Install command copied" : "Open skill details to copy its command");
    }
  }

  function createRow(skill) {
    if (!/^[a-z0-9-]+$/.test(skill.slug)) return;
    const tr = make("tr");
    tr.dataset.libraryItem = "";
    tr.dataset.categoryName = skill.category;
    tr.dataset.searchKey = [skill.name, skill.description, skill.category, ...(skill.tags || [])].join(" ").toLowerCase();
    const href = "../skills/" + skill.slug + "/";

    const name = make("td");
    name.dataset.label = "SKILL";
    const link = make("a", "directory-name");
    link.href = href;
    const icon = make("img");
    icon.src = "../assets/icon-256.png";
    icon.alt = "";
    icon.width = 28;
    icon.height = 28;
    link.append(icon, make("strong", "", skill.name));
    name.append(link);

    const description = make("td", "directory-description", skill.description);
    description.dataset.label = "DESCRIPTION";
    const category = make("td");
    category.dataset.label = "CATEGORY";
    category.append(make("span", "directory-tag", skill.category));
    const version = make("td");
    version.dataset.label = "VERSION";
    version.append(make("span", "directory-version", "v" + skill.version));

    const actions = make("td");
    actions.dataset.label = "ACTIONS";
    const group = make("div", "directory-row-actions");
    const view = make("a", "", "View ↗");
    view.href = href;
    view.setAttribute("aria-label", "View " + skill.name + " details");
    const button = make("button", "directory-copy");
    button.type = "button";
    button.dataset.libraryCopy = String(skill.install || "");
    button.setAttribute("aria-label", "Copy install command for " + skill.name);
    button.title = "Copy install command";
    button.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';
    group.append(view, button);
    actions.append(group);
    tr.append(name, description, category, version, actions);
    body.append(tr);
  }

  input.value = state.query;
  input.addEventListener("input", () => {
    state.query = input.value;
    syncUrl();
    render();
  });
  filters.addEventListener("click", event => {
    const target = event.target.closest("[data-category]");
    if (!target) return;
    state.category = target.dataset.category;
    syncUrl();
    render();
  });
  document.querySelector("[data-library-reset]").addEventListener("click", reset);
  body.addEventListener("click", event => {
    const button = event.target.closest("[data-library-copy]");
    if (!button) return;
    event.preventDefault();
    copy(button.dataset.libraryCopy);
  });
  document.addEventListener("keydown", event => {
    const typing = event.target.closest("input,textarea,select,[contenteditable]");
    if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      input.focus();
    }
    if (event.key === "Escape" && document.activeElement === input) {
      if (input.value) reset();
      else input.blur();
    }
  });

  render();
  if (location.protocol === "http:" || location.protocol === "https:") {
    fetch("../catalog.json", { cache: "no-cache" })
      .then(response => {
        if (!response.ok) throw Error("Catalog unavailable");
        return response.json();
      })
      .then(data => {
        const skills = Array.isArray(data.skills) ?
          data.skills.filter(skill => skill.slug && skill.name && skill.description && skill.category && skill.version) : [];
        if (!skills.length) return;
        body.replaceChildren();
        skills.forEach(createRow);
        renderCategories(skills);
        render();
      })
      .catch(() => { /* The server-rendered first skill remains usable. */ });
  }
})();
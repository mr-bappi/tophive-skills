(() => {
  "use strict";
  const input = document.querySelector("[data-library-search]");
  const select = document.querySelector("[data-library-category]");
  const body = document.querySelector("[data-library-items]");
  const empty = document.querySelector("[data-library-empty]");
  if (!input || !select || !body || !empty) return;
  const query = new URLSearchParams(location.search);
  const state = { q: query.get("q") || "", category: (query.get("category") || "all").toLowerCase() };
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = String(text);
    return el;
  };
  const rows = () => [...body.querySelectorAll("[data-library-item]")];
  const setUrl = () => {
    if (location.protocol === "file:") return;
    const url = new URL(location.href);
    state.q ? url.searchParams.set("q", state.q) : url.searchParams.delete("q");
    state.category !== "all" ? url.searchParams.set("category", state.category) : url.searchParams.delete("category");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  };
  const filter = () => {
    const q = state.q.trim().toLowerCase();
    let matched = 0;
    rows().forEach(row => {
      const show = (state.category === "all" || row.dataset.categoryName.toLowerCase() === state.category)
        && (!q || row.dataset.searchKey.includes(q));
      row.hidden = !show;
      if (show) matched++;
    });
    const total = rows().length;
    document.querySelector("[data-count-total]").textContent = String(total).padStart(2, "0");
    document.querySelector("[data-results-count]").textContent = matched + " " + (matched === 1 ? "skill" : "skills");
    document.querySelector("[data-library-showing]").textContent = "Showing " + matched + " of " + total + " skills";
    empty.hidden = matched > 0;
  };
  const reset = () => {
    state.q = ""; state.category = "all";
    input.value = ""; select.value = "all";
    setUrl(); filter(); input.focus();
  };
  let toastTimer;
  const feedback = text => {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = text;
    toast.dataset.visible = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.dataset.visible = "false"; }, 1900);
  };
  const copy = async text => {
    try { await navigator.clipboard.writeText(text); feedback("Install command copied"); }
    catch {
      const el = make("textarea"); el.value = text; el.readOnly = true;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.append(el); el.select();
      const success = document.execCommand("copy"); el.remove();
      feedback(success ? "Install command copied" : "Copy from the skill details page");
    }
  };
  const build = skill => {
    if (!/^[a-z0-9-]+$/.test(skill.slug)) return;
    const tr = make("tr");
    tr.dataset.libraryItem = "";
    tr.dataset.categoryName = skill.category;
    tr.dataset.searchKey = [skill.name, skill.description, skill.category, ...(skill.tags || [])].join(" ").toLowerCase();
    const url = "../skills/" + skill.slug + "/";
    const name = make("td"); name.dataset.label = "SKILL";
    const link = make("a", "directory-name"); link.href = url;
    const icon = make("img"); icon.src = "../assets/icon-256.png"; icon.width = 28; icon.height = 28; icon.alt = "";
    link.append(icon, make("strong", "", skill.name)); name.append(link);
    const desc = make("td", "directory-description", skill.description); desc.dataset.label = "DESCRIPTION";
    const category = make("td"); category.dataset.label = "CATEGORY"; category.append(make("span", "directory-tag", skill.category));
    const version = make("td"); version.dataset.label = "VERSION"; version.append(make("span", "directory-version", "v" + skill.version));
    const actions = make("td"); actions.dataset.label = "ACTIONS";
    const group = make("div", "directory-row-actions");
    const view = make("a", "", "View ↗"); view.href = url; view.setAttribute("aria-label", "View " + skill.name + " details");
    const button = make("button", "", "Copy ⧉"); button.type = "button";
    button.dataset.libraryCopy = String(skill.install || "");
    button.setAttribute("aria-label", "Copy install command for " + skill.name);
    group.append(view, button); actions.append(group);
    tr.append(name, desc, category, version, actions); body.append(tr);
  };
  const updateCategories = skills => {
    const available = [...new Set(skills.map(s => String(s.category)))].sort();
    select.replaceChildren();
    select.append(new Option("All categories", "all"));
    available.forEach(category => select.append(new Option(category, category.toLowerCase())));
    if (state.category !== "all" && !available.some(cat => cat.toLowerCase() === state.category)) state.category = "all";
    select.value = state.category;
  };
  input.value = state.q;
  input.addEventListener("input", () => { state.q = input.value; setUrl(); filter(); });
  select.addEventListener("change", () => { state.category = select.value; setUrl(); filter(); });
  document.querySelector("[data-library-reset]").addEventListener("click", reset);
  body.addEventListener("click", event => {
    const btn = event.target.closest("[data-library-copy]");
    if (btn) { event.preventDefault(); copy(btn.dataset.libraryCopy); }
  });
  document.addEventListener("keydown", event => {
    const typing = event.target.closest("input,textarea,select,[contenteditable]");
    if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault(); input.focus();
    }
    if (event.key === "Escape" && document.activeElement === input) {
      if (input.value) reset(); else input.blur();
    }
  });
  filter();
  if (location.protocol === "http:" || location.protocol === "https:") {
    fetch("../catalog.json", { cache: "no-cache" })
      .then(response => { if (!response.ok) throw Error("Catalog unavailable"); return response.json(); })
      .then(data => {
        const published = Array.isArray(data.skills) ? data.skills.filter(s => s.slug && s.name && s.description && s.category && s.version) : [];
        if (!published.length) return;
        body.replaceChildren();
        published.forEach(build);
        updateCategories(published);
        filter();
      })
      .catch(() => { /* Static HTML fallback remains usable */ });
  }
})();
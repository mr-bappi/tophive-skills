/* TOPHIVE Skills Examples — progressive enhancement, no remote data fetch. */
(() => {
  "use strict";

  const gallery = document.querySelector("[data-ex-list]");
  const cards = gallery ? [...gallery.querySelectorAll("[data-ex-item]")] : [];
  const filters = [...document.querySelectorAll("[data-ex-filter]")];
  const search = document.querySelector("[data-ex-search]");
  const sort = document.querySelector("[data-ex-sort]");
  const sortGroup = document.querySelector("[data-ex-sort-group]");
  const results = document.querySelector("[data-ex-results]");
  const empty = document.querySelector("[data-ex-empty]");
  const clear = document.querySelector("[data-ex-clear]");
  const loadWrap = document.querySelector("[data-ex-load-wrap]");
  const loadButton = document.querySelector("[data-ex-load-more]");
  const progress = document.querySelector("[data-ex-progress]");
  const progressFill = document.querySelector("[data-ex-progress-fill]");
  const size = gallery ? Math.max(1,Number.parseInt(gallery.dataset.exPageSize,10) || 9) : 9;
  let category = "all";
  let limit = size;

  const norm = (value) => String(value || "").normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase().trim();

  function matchingCards() {
    const tokens = norm(search?.value).split(/\s+/).filter(Boolean);
    const matches = cards.filter(card => {
      if (category !== "all" && card.dataset.category !== category) return false;
      const terms = norm(card.dataset.exTerms);
      return tokens.every(token => terms.includes(token));
    });
    const method = sort?.value || "featured";
    matches.sort((a,b) => {
      if (method === "az") return a.dataset.exName.localeCompare(b.dataset.exName);
      if (method === "za") return b.dataset.exName.localeCompare(a.dataset.exName);
      return (Number(a.dataset.exRank) - Number(b.dataset.exRank)) ||
        a.dataset.exName.localeCompare(b.dataset.exName);
    });
    return matches;
  }

  function update() {
    if (!gallery) return;
    const matches = matchingCards();
    const visible = Math.min(limit,matches.length);
    const order = new Set(matches);
    gallery.append(...matches,...cards.filter(card => !order.has(card)));
    const visibleSet = new Set(matches.slice(0,visible));
    cards.forEach(card => { card.hidden = !visibleSet.has(card); });

    gallery.dataset.exLayout = visible >= 7 ? "dense" : "standard";
    if (results) results.textContent = matches.length > visible ?
      `Showing ${visible} of ${matches.length} examples` :
      `Showing ${matches.length} example${matches.length===1?"":"s"}`;
    if (empty) empty.hidden = matches.length !== 0;

    const isFiltered = category !== "all" || Boolean(norm(search?.value)) || (sort && sort.value !== "featured");
    if (clear) clear.hidden = !isFiltered;

    const hasMore = matches.length > visible;
    if (loadWrap) loadWrap.hidden = !hasMore;
    if (progress) progress.textContent = `Showing ${visible} of ${matches.length} examples`;
    if (progressFill) progressFill.style.width = matches.length ?
      `${(visible / matches.length * 100).toFixed(2)}%` : "0%";
    if (loadButton) {
      const next = Math.min(size,matches.length-visible);
      loadButton.innerHTML = `Load ${next} more example${next===1?"":"s"} <span aria-hidden="true">↓</span>`;
    }
  }

  function reset() {
    category = "all";
    limit = size;
    if (search) search.value = "";
    if (sort) sort.value = "featured";
    filters.forEach(button => button.setAttribute("aria-pressed",String(button.dataset.exFilter==="all")));
    update();
  }

  if (gallery) {
    if (sortGroup) sortGroup.hidden = cards.length < 7;
    filters.forEach(button => button.addEventListener("click",() => {
      category = button.dataset.exFilter;
      limit = size;
      filters.forEach(other => other.setAttribute("aria-pressed",String(other===button)));
      update();
    }));
    search?.addEventListener("input",() => { limit=size; update(); });
    sort?.addEventListener("change",() => { limit=size; update(); });
    clear?.addEventListener("click",() => { reset(); search?.focus(); });
    document.querySelector("[data-ex-reset]")?.addEventListener("click",() => { reset(); search?.focus(); });
    loadButton?.addEventListener("click",() => {
      const previouslyVisible = Math.min(limit,matchingCards().length);
      limit += size;
      update();
      const firstNew = gallery.querySelectorAll("[data-ex-item]:not([hidden])")[previouslyVisible];
      firstNew?.querySelector("a")?.focus();
    });
    update();

  }

  /* Hover inspection is progressively enhanced. The light cover loads by default;
     expensive full-page screenshots are requested only from a hover-capable device. */
  const canPan = typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;

  function fitFullPage(image) {
    const card = image.closest(".ex-card");
    const viewport = image.closest(".ex-card-screen");
    if (!card || !viewport || !image.naturalWidth || !image.naturalHeight) return;
    const renderedHeight = viewport.clientWidth * image.naturalHeight / image.naturalWidth;
    const travel = Math.max(0, renderedHeight - viewport.clientHeight);
    card.style.setProperty("--ex-pan-travel", travel.toFixed(1) + "px");
    card.style.setProperty("--ex-pan-duration", Math.max(5, Math.min(30, travel / 75)).toFixed(1) + "s");
    card.dataset.exScrollReady = String(travel > 5);
  }

  if (gallery && canPan) {
    gallery.querySelectorAll(".ex-card-art").forEach(art => {
      const image = art.querySelector(".ex-card-full");
      if (!image) return;
      art.addEventListener("pointerenter", async () => {
        if (image.dataset.exStatus === "ready") return;
        if (image.dataset.exStatus === "loading" || image.dataset.exStatus === "failed") return;
        image.dataset.exStatus = "loading";
        try {
          image.src = image.dataset.exFullSrc;
          await image.decode();
          image.dataset.exStatus = "ready";
          fitFullPage(image);
        } catch {
          image.dataset.exStatus = "failed";
        }
      });
    });
    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        gallery.querySelectorAll('.ex-card-full[data-ex-status="ready"]').forEach(fitFullPage);
      });
    }, {passive:true});
  }

  // Existing case-study interactions remain independent of gallery controls.
  const preview = document.querySelector("[data-ex-preview]");
  const viewControls = [...document.querySelectorAll("[data-ex-size]")];
  viewControls.forEach(button => button.addEventListener("click",() => {
    if (!preview) return;
    preview.dataset.previewSize = button.dataset.exSize;
    viewControls.forEach(other => other.setAttribute("aria-pressed",String(other===button)));
  }));

  const toast = document.querySelector("[data-ex-toast]");
  let timeout;
  document.querySelector("[data-ex-copy]")?.addEventListener("click",async () => {
    const prompt = document.querySelector("[data-ex-prompt]");
    if (!prompt) return;
    let text;
    try {
      await navigator.clipboard.writeText(prompt.value);
      text="Recreation prompt copied";
    }catch{
      prompt.focus();prompt.select();
      text="Prompt selected — press ⌘C or Ctrl+C";
    }
    if (toast) {
      toast.textContent=text;toast.hidden=false;
      clearTimeout(timeout);
      timeout=setTimeout(() => {toast.hidden=true;},3000);
    }
  });
})();

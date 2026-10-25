/* TOPHIVE Skills — one keyboard interaction for the canonical Search component.
 * "/" focuses the search on this page; Escape clears the query, then blurs.
 * Page-specific filtering is owned by each directory/gallery, not this primitive. */
(() => {
  "use strict";
  const search = document.querySelector("[data-site-search]");
  if (!search) return;
  const editable = target => target instanceof Element &&
    (Boolean(target.closest("input,textarea,select,[contenteditable]")) ||
      (target instanceof HTMLElement && target.isContentEditable));

  document.addEventListener("keydown", event => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    if (event.key === "/" && !editable(event.target)) {
      event.preventDefault();
      search.focus();
      return;
    }
    if (event.key === "Escape" && document.activeElement === search) {
      event.preventDefault();
      if (search.value) {
        search.value = "";
        search.dispatchEvent(new Event("input", {bubbles:true}));
      } else {
        search.blur();
      }
    }
  });
})();

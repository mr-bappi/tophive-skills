/* Choose gutter behavior before body paint based on the native scrollbar mode.
   Overlay scrollbars consume no layout width, so forcing stable adds a blank right rail.
   Classical scrollbars consume width, so retain stable to prevent layout jumps. */
(() => {
  const probe=document.createElement("div");
  probe.setAttribute("aria-hidden","true");
  probe.style.cssText="position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow:scroll;visibility:hidden;pointer-events:none;scrollbar-width:auto";
  const content=document.createElement("div");
  content.style.height="200px";
  probe.append(content);
  document.documentElement.append(probe);
  const nativeWidth=probe.offsetWidth-probe.clientWidth;
  probe.remove();
  if(nativeWidth>0) document.documentElement.dataset.classicScrollbar="true";
})();

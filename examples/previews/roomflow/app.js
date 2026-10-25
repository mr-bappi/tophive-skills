(() => {
  "use strict";
  const initial = [
    { id: "RF-014", title: "Equipment check", room: "Consultation 1", day: "2026-10-24", time: "09:00", status: "Scheduled" },
    { id: "RF-015", title: "Team coordination", room: "Meeting Room", day: "2026-10-24", time: "10:00", status: "Scheduled" },
    { id: "RF-016", title: "Weekly safety briefing", room: "Training Room", day: "2026-10-25", time: "11:00", status: "Scheduled" },
    { id: "RF-017", title: "Room preparation", room: "Consultation 1", day: "2026-10-26", time: "14:00", status: "Scheduled" }
  ];
  let bookings = initial.map(x => ({ ...x }));
  let nextId = 18, activeBooking = null;
  const $ = s => document.querySelector(s);
  const tbody = $("#booking-body"), notice = $("#notice"), search = $("#search"), filter = $("#room-filter");
  const role = $("#role-select"), bookingDialog = $("#booking-dialog"), detailDialog = $("#detail-dialog");
  const confirmDialog = $("#confirm-dialog"), form = $("#booking-form"), error = $("#booking-error");
  const escapeHTML = x => String(x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function notify(text) { notice.textContent = text; }
  function matching() {
    const q = search.value.trim().toLowerCase();
    return bookings.filter(b => (filter.value === "all" || b.room === filter.value)
      && (!q || [b.title, b.room, b.id].some(x => x.toLowerCase().includes(q))));
  }
  function render() {
    const list = matching();
    tbody.innerHTML = list.map(b => `<tr><td>${escapeHTML(b.title)}<span class="booking-ref">${escapeHTML(b.id)}</span></td><td>${escapeHTML(b.room)}</td><td>${escapeHTML(b.day)} / ${escapeHTML(b.time)}</td><td><span class="status-pill">${escapeHTML(b.status)}</span></td><td><button type="button" data-view="${escapeHTML(b.id)}">View</button></td></tr>`).join("");
    $("#empty-state").hidden = list.length !== 0;
    $("#booking-count").textContent = bookings.length;
    $("#visible-count").textContent = `SHOWING ${list.length} OF ${bookings.length}`;
  }
  function reset() { search.value = ""; filter.value = "all"; render(); }
  $("#reset-filters").addEventListener("click", reset);
  $("#clear-empty").addEventListener("click", reset);
  search.addEventListener("input", render);
  filter.addEventListener("change", render);
  document.querySelectorAll("[data-room]").forEach(btn => btn.addEventListener("click", () => {
    filter.value = btn.dataset.room; search.value = ""; render(); $("#bookings").scrollIntoView({ block: "start" });
  }));
  role.addEventListener("change", () => {
    notify(`${role.value === "manager" ? "Manager" : "Front desk"} role selected — illustrative permissions only.`);
    const remove = $("#delete-booking");
    remove.hidden = role.value !== "manager";
  });
  const sidebar = $("#sidebar"), navToggle = $("#sidebar-toggle");
  function menu(open) { sidebar.classList.toggle("is-open", open); navToggle.setAttribute("aria-expanded", String(open)); navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation"); }
  navToggle.addEventListener("click", () => menu(navToggle.getAttribute("aria-expanded") !== "true"));
  sidebar.querySelectorAll(".side-links a").forEach(a => a.addEventListener("click", () => menu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") menu(false); });
  function openCreate() { form.reset(); error.hidden = true; bookingDialog.showModal(); $("#booking-title").focus(); }
  $("#create-booking").addEventListener("click", openCreate);
  $("#close-dialog").addEventListener("click", () => bookingDialog.close());
  $("#cancel-booking").addEventListener("click", () => bookingDialog.close());
  form.addEventListener("submit", event => {
    event.preventDefault();
    const title = $("#booking-title").value.trim(), room = $("#booking-room").value, day = $("#booking-day").value, time = $("#booking-time").value;
    if (!title) { error.hidden = false; error.textContent = "Enter a booking title."; $("#booking-title").focus(); return; }
    if (bookings.some(b => b.room === room && b.day === day && b.time === time)) {
      error.hidden = false; error.textContent = "This room already has a sample booking at the selected time."; $("#booking-time").focus(); return;
    }
    const id = `RF-${String(nextId++).padStart(3, "0")}`;
    bookings = [...bookings, { id, title, room, day, time, status: "Scheduled" }];
    reset(); bookingDialog.close(); notify(`Sample booking ${id} created in this session only.`);
  });
  tbody.addEventListener("click", event => {
    const button = event.target.closest("button[data-view]");
    if (!button) return;
    const b = bookings.find(row => row.id === button.dataset.view);
    if (!b) return;
    activeBooking = b.id;
    $("#detail-content").innerHTML = [
      ["Request",b.title],["Reference",b.id],["Room",b.room],
      ["Day",b.day],["Start time",b.time],["Status",b.status]
    ].map(([label,value]) => `<p><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></p>`).join("");
    $("#delete-booking").hidden = role.value !== "manager";
    detailDialog.showModal();
  });
  $("#close-detail").addEventListener("click", () => detailDialog.close());
  $("#done-detail").addEventListener("click", () => detailDialog.close());
  $("#delete-booking").addEventListener("click", () => {
    if (role.value !== "manager" || !activeBooking) return;
    detailDialog.close();
    confirmDialog.showModal();
  });
  $("#cancel-delete").addEventListener("click", () => confirmDialog.close());
  $("#confirm-delete").addEventListener("click", () => {
    if (role.value !== "manager" || !activeBooking) return;
    bookings = bookings.filter(b => b.id !== activeBooking);
    notify(`Sample booking ${activeBooking} removed from this session.`);
    activeBooking = null; confirmDialog.close(); render();
  });
  render();
})();

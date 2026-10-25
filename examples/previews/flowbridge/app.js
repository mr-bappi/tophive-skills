(function () {
  "use strict";
  const states = {
    submit: { label: "01 / SUBMITTED", title: "A request enters the workspace.", text: "Give the team context before asking for a decision." },
    review: { label: "02 / IN REVIEW", title: "A reviewer considers the request.", text: "Keep review connected to the original context." },
    approve: { label: "03 / APPROVED", title: "The team gets a clear decision.", text: "Close the loop with an explicit outcome." }
  };
  const steps = [...document.querySelectorAll("[data-stage]")];
  const stateLabel = document.querySelector("[data-state-label]");
  const stageTitle = document.querySelector("[data-stage-title]");
  const stageDescription = document.querySelector("[data-stage-description]");
  function selectStage(key, moveFocus = false) {
    const state = states[key];
    if (!state) return;
    steps.forEach((button) => {
      const active = button.dataset.stage === key;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      if (active && moveFocus) button.focus();
    });
    stateLabel.textContent = state.label;
    stageTitle.textContent = state.title;
    stageDescription.textContent = state.text;
  }
  steps.forEach((button, index) => {
    button.addEventListener("click", () => selectStage(button.dataset.stage));
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const next = (index + (event.key === "ArrowRight" ? 1 : -1) + steps.length) % steps.length;
      selectStage(steps[next].dataset.stage, true);
    });
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  }
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 601px)").addEventListener("change", ({ matches }) => { if (matches) setMenu(false); });

  const form = document.querySelector(".trial-form");
  const feedback = document.querySelector(".form-feedback");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.elements.email;
    if (!email.value.trim() || !email.validity.valid) {
      feedback.textContent = "Enter a valid work email to preview this interaction.";
      feedback.style.color = "#a53c32";
      email.focus();
      return;
    }
    feedback.textContent = "Preview complete — no email was sent, stored, or submitted.";
    feedback.style.color = "#335e40";
  });
})();

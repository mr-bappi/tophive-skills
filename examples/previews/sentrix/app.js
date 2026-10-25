/** SENTRIX — isolated frontend scenario simulator. No network calls or security operations. */
(() => {
  'use strict';
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const scenarios = {
    identity: {
      heading: 'Unexpected privileged sign-in',
      summary: 'A privileged identity signed in from an unfamiliar device. Review the sequence before choosing a response.',
      priority: 'HIGH PRIORITY', tone: 'high',
      events: [
        { time: '09:14:08', title: 'Sign-in from an unfamiliar device', detail: 'Identity signal · New device fingerprint' },
        { time: '09:16:22', title: 'Privileged resource accessed', detail: 'Access context · Elevated permissions' },
        { time: '09:18:41', title: 'Related session activity identified', detail: 'Correlation · Same account, new session' }
      ],
      assessment: 'Validate the session before escalating',
      explanation: 'An unfamiliar device and elevated permissions appear together. Confirm whether the sign-in was expected.',
      next: 'Review sign-in details with the identity owner'
    },
    deploy: {
      heading: 'Unrecognized production deployment',
      summary: 'A production change appeared outside the expected release window. Trace the deployment and its origin.',
      priority: 'HIGH PRIORITY', tone: 'high',
      events: [
        { time: '11:42:03', title: 'Deployment initiated', detail: 'Release signal · Production environment' },
        { time: '11:43:17', title: 'Change origin differs from expected path', detail: 'Pipeline context · Unfamiliar source' },
        { time: '11:45:05', title: 'Change window mismatch detected', detail: 'Correlation · Outside scheduled window' }
      ],
      assessment: 'Verify the change origin and approval',
      explanation: 'The deployment timing and source warrant review. Confirm authorization and compare the release artifact.',
      next: 'Check the release record with the deployment owner'
    },
    access: {
      heading: 'Sensitive permission change',
      summary: 'A service identity received access beyond its usual scope. Follow the change and confirm its intent.',
      priority: 'REVIEW NEEDED', tone: 'medium',
      events: [
        { time: '14:07:11', title: 'Service account permissions updated', detail: 'Access signal · Scope changed' },
        { time: '14:09:31', title: 'New resource group visible', detail: 'Permission context · Expanded access' },
        { time: '14:12:18', title: 'No matching change note found', detail: 'Correlation · Review recommended' }
      ],
      assessment: 'Establish whether access is intentional',
      explanation: 'The additional scope lacks a matching review note in this simulated case. Validate the operational need.',
      next: 'Review the permission diff with the service owner'
    }
  };
  let activeScenario = 'identity';
  let briefEntry = null;
  const menuButton = $('.mobile-toggle');
  const mobileNav = $('#mobile-nav');

  function setMenu(isOpen) {
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !isOpen;
    menuButton.querySelector('use').setAttribute('href', isOpen ? '#i-close' : '#i-menu');
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener('click', e => {
    if (!mobileNav.hidden && !e.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  function renderScenario(key, focusTab = false) {
    const data = scenarios[key];
    if (!data) return;
    activeScenario = key;
    briefEntry = null;
    $('#scenario-title').textContent = data.heading;
    $('#scenario-summary').textContent = data.summary;
    $('#severity-label').className = `severity-label ${data.tone}`;
    $('#severity-label').innerHTML = '<span class="severity-square"></span>' + data.priority;
    $('#event-count').textContent = `${String(data.events.length).padStart(2, '0')} CONNECTED EVENTS`;
    $('#assessment-title').textContent = data.assessment;
    $('#assessment-text').textContent = data.explanation;
    $('#next-step').lastElementChild.textContent = data.next;
    $('#event-list').replaceChildren(...data.events.map(event => {
      const row = document.createElement('div'); row.className = 'event';
      const dot = document.createElement('span'); dot.className = 'event-dot'; dot.setAttribute('aria-hidden', 'true');
      const body = document.createElement('div'); body.className = 'event-body';
      const time = document.createElement('span'); time.className = 'event-time'; time.textContent = event.time + ' / DEMO';
      const title = document.createElement('strong'); title.textContent = event.title;
      const detail = document.createElement('p'); detail.textContent = event.detail;
      body.append(time, title, detail); row.append(dot, body); return row;
    }));
    $$('.scenario-switch [role="tab"]').forEach(tab => {
      const selected = tab.dataset.scenario === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) { $('#scenario-panel').setAttribute('aria-labelledby', tab.id); if (focusTab) tab.focus(); }
    });
    const action = $('#add-note');
    action.disabled = false;
    action.firstChild.textContent = 'Add to response brief ';
    $('#note-feedback').textContent = '';
    $('#brief-status').textContent = 'REVIEW IN PROGRESS';
  }
  const tabButtons = $$('.scenario-switch [role="tab"]');
  tabButtons.forEach((tab, index) => {
    tab.addEventListener('click', () => renderScenario(tab.dataset.scenario));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
      else if (e.key === 'ArrowLeft') next = (index - 1 + tabButtons.length) % tabButtons.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabButtons.length - 1;
      else return;
      e.preventDefault(); renderScenario(tabButtons[next].dataset.scenario, true);
    });
  });
  $('#add-note').addEventListener('click', () => {
    const data = scenarios[activeScenario];
    briefEntry = { title: data.heading, finding: data.assessment, next: data.next };
    const button = $('#add-note');
    button.disabled = true;
    button.firstChild.textContent = 'Added to response brief ';
    $('#note-feedback').textContent = 'Saved locally for this session. Download the concept brief to include this scenario.';
    $('#brief-status').textContent = 'NOTE ADDED TO LOCAL BRIEF';
  });
  $('#reset-scenario').addEventListener('click', () => renderScenario(activeScenario));
  renderScenario('identity');

  $('#download-brief').addEventListener('click', () => {
    let content = `SENTRIX — PRODUCT CONCEPT BRIEF\n\nFictional cybersecurity SaaS concept / illustrative only\n\nPOSITIONING\nAn operations workspace for engineering-led security teams to monitor threats, investigate incident context, and coordinate a response.\n\nPROPOSED WORKFLOW\n1. Observe relevant security signals.\n2. Investigate the event sequence and connected context.\n3. Review the evidence, choose an action, and document the decision.\n\nIMPORTANT LIMITATIONS\nThis is a frontend demonstration. It has no security integrations, authentication, real-time telemetry, persistent storage or response execution.\n`;
    if (briefEntry) content += `\nLOCAL DEMO NOTE\nScenario: ${briefEntry.title}\nAssessment: ${briefEntry.finding}\nSuggested next step: ${briefEntry.next}\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sentrix-concept-brief.txt';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('#download-status').textContent = 'Concept brief prepared as a local text download. No information was sent.';
  });
  $('#year').textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const targets = $$('.statement-content, .section-heading, .workflow-intro, .workflow-stage, .decision-copy, .principles-lead, .principles-list, .faq-grid, .closing-content');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -25px 0px' });
    targets.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }
})();

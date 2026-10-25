'use strict';

// OrbitDesk is a self-contained concept prototype. Tasks are illustrative and
// deliberately remain in memory: no server, account, analytics, or persistence.
const stages = [
  { id: 'todo', label: 'UP NEXT', hint: 'To do' },
  { id: 'progress', label: 'IN MOTION', hint: 'In motion' },
  { id: 'review', label: 'READY TO SHARE', hint: 'Ready to share' },
];
let tasks = [
  { id: 1, title: 'Collect inspiration for the new direction', type: 'Design', stage: 'todo' },
  { id: 2, title: 'Outline the project story', type: 'Writing', stage: 'todo' },
  { id: 3, title: 'Explore visual directions', type: 'Design', stage: 'progress' },
  { id: 4, title: 'Sketch the page transitions', type: 'Motion', stage: 'progress' },
  { id: 5, title: 'Share the first moodboard', type: 'Design', stage: 'review' },
];
let view = 'board';
const board = document.querySelector('#board-view');
const list = document.querySelector('#list-view');
const summary = document.querySelector('#task-summary');
const feedback = document.querySelector('#demo-feedback');
const dialog = document.querySelector('#note-dialog');
const form = document.querySelector('#note-form');
const input = document.querySelector('#note-title');
const typeInput = document.querySelector('#note-type');
const error = document.querySelector('#title-error');
const addButton = document.querySelector('#add-note');

const escapeHTML = (text) => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
function selectMarkup(task) {
  return `<label class="sr-only" for="stage-${task.id}-${view}">Stage for ${escapeHTML(task.title)}</label><select class="stage-select" id="stage-${task.id}-${view}" data-task-id="${task.id}" aria-label="Stage for ${escapeHTML(task.title)}">${stages.map(stage => `<option value="${stage.id}"${stage.id === task.stage ? ' selected' : ''}>${stage.hint}</option>`).join('')}</select>`;
}
function render() {
  summary.textContent = `${tasks.length} sample notes · ${tasks.filter(task => task.stage === 'review').length} ready to share`;
  board.innerHTML = stages.map(stage => {
    const group = tasks.filter(task => task.stage === stage.id);
    return `<section class="board-column" aria-label="${stage.hint} notes"><div class="board-column-head"><span class="stage-indicator stage-${stage.id}"></span>${stage.label}<span class="stage-count">${group.length}</span></div>${group.length ? group.map(task => `<article class="task-card"><div class="task-top"><span class="task-type">${escapeHTML(task.type)}</span><span class="task-ding" aria-hidden="true">✳</span></div><h4 class="task-title">${escapeHTML(task.title)}</h4><div class="task-foot"><span class="task-foot-label">Move to</span>${selectMarkup(task)}</div></article>`).join('') : `<div class="empty-stage">No notes here yet</div>`}</section>`;
  }).join('');
  list.innerHTML = `<div class="list-head"><span>NOTE</span><span>STAGE</span></div><div id="list-content">${tasks.map(task => `<div class="list-row"><div><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.type)}</small></div>${selectMarkup(task)}</div>`).join('')}</div>`;
  board.hidden = view !== 'board';
  list.hidden = view !== 'list';
  document.querySelectorAll('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
// Delegation keeps status controls functional across rerenders and view switches.
document.querySelector('.app-demo').addEventListener('change', event => {
  const control = event.target.closest('[data-task-id]');
  if (!control) return;
  const task = tasks.find(item => item.id === Number(control.dataset.taskId));
  if (!task || !stages.some(stage => stage.id === control.value)) return;
  task.stage = control.value;
  feedback.textContent = `“${task.title}” moved to ${stages.find(stage => stage.id === task.stage).hint}.`;
  render();
  // Keep the task control reachable after moving between columns.
  document.getElementById(`stage-${task.id}-${view}`)?.focus();
});
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  view = button.dataset.view;
  render();
  feedback.textContent = `Showing ${view === 'board' ? 'board' : 'list'} view.`;
}));
function openDialog() {
  form.reset();
  input.removeAttribute('aria-invalid');
  error.textContent = '';
  dialog.showModal();
  input.focus();
}
function closeDialog() { dialog.close(); addButton.focus(); }
addButton.addEventListener('click', openDialog);
document.querySelector('#close-dialog').addEventListener('click', closeDialog);
document.querySelector('#cancel-dialog').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener('close', () => addButton.focus());
input.addEventListener('input', () => { if (input.value.trim()) { input.removeAttribute('aria-invalid'); error.textContent = ''; } });
form.addEventListener('submit', event => {
  event.preventDefault();
  const title = input.value.trim();
  if (!title) { input.setAttribute('aria-invalid', 'true'); error.textContent = 'Please give the note a short title.'; input.focus(); return; }
  tasks.push({ id: Math.max(0, ...tasks.map(task => task.id)) + 1, title, type: typeInput.value, stage: 'todo' });
  view = 'board';
  render();
  feedback.textContent = `“${title}” added to Up next. Only visible in this tab.`;
  closeDialog();
});
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function setMenu(open) {
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
menuButton.addEventListener('click', () => setMenu(mobileNav.hidden));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); } });
window.matchMedia('(min-width: 951px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
document.querySelector('#year').textContent = String(new Date().getFullYear());
render();

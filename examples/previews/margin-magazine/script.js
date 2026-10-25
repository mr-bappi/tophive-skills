'use strict';

const pieces = {
  city: {
    genre: 'FICTION / NO. 01', title: 'When the city forgets your name', author: 'MIRA VALE',
    paragraphs: [
      'The first thing the city forgot was the way her footsteps sounded on the stairs. The second was the name she had once written in the wet cement outside the corner shop.',
      'Every evening, the windows lit up in a different order. She had believed, when she was younger, that the pattern was a kind of language. Now she understood that a city tells its stories mostly by accident.',
      'She walked home by the long road, carrying two oranges and a letter she had not yet opened. In the square, someone had planted a tree in a place where a bench used to be. She stopped there and, for a moment, let herself be a person no one expected to arrive.'
    ]
  },
  room: {
    genre: 'POETRY / NO. 02', title: 'Inventory of a quiet room', author: 'ELI ROWAN',
    paragraphs: [
      'One blue cup / and the shadow it keeps.\nA window practicing / the shape of afternoon.\nThree books with folded corners.\nA flower that remembers rain.',
      'On the table, a key / to a door I no longer own.\nUnder the chair, a little dust / made of all our ordinary days.',
      'Nothing is missing, I tell myself.\nThen the light moves / and everything changes places.'
    ]
  },
  atlas: {
    genre: 'ESSAY / NO. 03', title: 'An atlas of almosts', author: 'NINA SOLIS',
    paragraphs: [
      'There are maps of the places we have been, and then there are the more difficult maps: of almosts. The apartment whose keys we never collected. The train we watched leave. The person we meant to become.',
      'I used to think those unwritten routes were failures of direction. But a life is not a straight line from intention to destination. It is made from detours, weather, and the quiet courage of choosing again.',
      'Perhaps every atlas needs a page of blank paper. Not because nothing happened there, but because some of the most important journeys happen without our ever moving.'
    ]
  },
  weather: {
    genre: 'FICTION / NO. 04', title: 'A small weather', author: 'THEO ASH',
    paragraphs: [
      'On Thursdays they talked about the weather, because the weather did not ask them to explain themselves. Rain was rain. A cold front was a cold front. Neither was anybody’s fault.',
      '“Clear by afternoon,” she said, though clouds filled the whole window. He nodded as if the words were meant for him.',
      'Later, when the streetlights came on early and the kettle had boiled twice, he put the umbrella by her door. It was a small gesture, almost nothing. Yet she remembered it long after the rain was gone.'
    ]
  }
};

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}
menuToggle.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 760) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

const filterButtons = [...document.querySelectorAll('.filter-btn')];
const storyCards = [...document.querySelectorAll('.story-card')];
const filterCount = document.getElementById('filter-count');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  let visible = 0;
  filterButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('is-active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  storyCards.forEach(card => {
    const shown = filter === 'all' || card.dataset.genre === filter;
    card.hidden = !shown;
    if (shown) visible++;
  });
  const noun = visible === 1 ? 'piece' : 'pieces';
  filterCount.textContent = filter === 'all' ? 'Showing all four sample pieces' : `Showing ${visible} ${filter} ${noun}`;
}));

const reader = document.getElementById('reading-dialog');
const readerTitle = document.getElementById('reader-title');
const readerGenre = document.getElementById('reader-genre');
const readerAuthor = document.getElementById('reader-author');
const readerBody = document.getElementById('reader-body');
let lastReaderTrigger = null;
function openReading(slug, trigger) {
  const piece = pieces[slug];
  if (!piece) return;
  lastReaderTrigger = trigger;
  readerTitle.textContent = piece.title;
  readerGenre.textContent = piece.genre;
  readerAuthor.textContent = `WORDS BY ${piece.author}`;
  readerBody.replaceChildren();
  piece.paragraphs.forEach(text => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    readerBody.append(paragraph);
  });
  reader.showModal();
}
document.querySelectorAll('[data-story]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  openReading(link.dataset.story, link);
}));
document.getElementById('reader-close').addEventListener('click', () => reader.close());
reader.addEventListener('close', () => lastReaderTrigger?.focus());

const submissions = document.getElementById('submissions-dialog');
document.getElementById('submission-info').addEventListener('click', () => submissions.showModal());
document.getElementById('submissions-close').addEventListener('click', () => submissions.close());
document.getElementById('submissions-done').addEventListener('click', () => submissions.close());
[reader, submissions].forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
}));

const newsletter = document.getElementById('newsletter-form');
const email = document.getElementById('email');
const feedback = document.getElementById('newsletter-feedback');
newsletter.addEventListener('submit', event => {
  event.preventDefault();
  if (!email.validity.valid) {
    feedback.textContent = 'Please enter a valid email address to try the preview.';
    feedback.dataset.state = 'error';
    email.setAttribute('aria-invalid', 'true');
    email.focus();
    return;
  }
  email.removeAttribute('aria-invalid');
  feedback.textContent = 'Preview only: the form works, but no email was sent or stored.';
  feedback.dataset.state = 'success';
});
email.addEventListener('input', () => { feedback.textContent = ''; feedback.removeAttribute('data-state'); email.removeAttribute('aria-invalid'); });

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('has-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } });
  }, {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('in-view'));
}

/**
 * All client-side behaviour. Bundled by Astro into an external file (CSP: script-src 'self' + hash).
 * Never uses innerHTML with dynamic data — only textContent / createElement.
 */
import { initShell } from './shell';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

/* ───── theme + crt ───── */
export const THEMES = ['green', 'amber', 'cyan', 'dracula'] as const;
export type Theme = (typeof THEMES)[number];

export function setTheme(t: Theme) {
  const apply = () => {
    root.dataset.theme = t;
    const label = $('#theme-name');
    if (label) label.textContent = t;
    try {
      localStorage.setItem('theme', t);
    } catch {}
  };
  // Smooth cross-fade where the View Transitions API exists.
  if (!reduced && 'startViewTransition' in document) document.startViewTransition(apply);
  else apply();
}
function currentTheme(): Theme {
  const t = root.dataset.theme as Theme;
  return THEMES.includes(t) ? t : 'green';
}
$('#theme-name')!.textContent = currentTheme();
$('#theme-btn')?.addEventListener('click', () => {
  setTheme(THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length]);
});

const crtBtn = $('#crt-btn');
const syncCrt = () => crtBtn?.setAttribute('aria-pressed', String(root.classList.contains('crt')));
syncCrt();
crtBtn?.addEventListener('click', () => {
  const on = root.classList.toggle('crt');
  try {
    localStorage.setItem('crt', on ? '1' : '0');
  } catch {}
  syncCrt();
});

/* ───── clock ───── */
const clock = $('#clock');
if (clock) {
  const tick = () => (clock.textContent = new Date().toLocaleTimeString('en-GB'));
  tick();
  setInterval(tick, 1000);
}

/* ───── typewriter ───── */
const typed = $('#typed');
const list = (typed?.dataset.words ?? '').split('|').filter(Boolean);
if (typed && list.length > 1 && !reduced) {
  let w = 0;
  let i = list[0]?.length ?? 0;
  let deleting = true;
  const step = () => {
    const word = list[w];
    i += deleting ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 35 : 70;
    if (!deleting && i === word.length) {
      deleting = true;
      delay = 2200;
    } else if (deleting && i === 0) {
      deleting = false;
      w = (w + 1) % list.length;
      delay = 350;
    }
    setTimeout(step, delay);
  };
  setTimeout(step, 3200);
}

/* ───── scroll reveal + counters ───── */
const countUp = (el: HTMLElement) => {
  const target = Number(el.dataset.count);
  if (!target || reduced) return;
  const start = performance.now();
  const dur = 1400;
  const frame = (now: number) => {
    const p = Math.min(1, (now - start) / dur);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      e.target.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    }
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
);
$$('.reveal').forEach((el) => io.observe(el));

/* ───── active nav link ───── */
const navLinks = $$<HTMLAnchorElement>('[data-nav]');
const spy = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id;
      navLinks.forEach((a) => a.setAttribute('aria-current', String(a.dataset.nav === id || (id === 'top' && a.dataset.nav === 'top'))));
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
$$('main > section, #top').forEach((s) => spy.observe(s));

/* ───── card spotlight (CSSOM writes are allowed by CSP, unlike style="" attributes) ───── */
if (matchMedia('(hover: hover)').matches) {
  document.addEventListener(
    'pointermove',
    (ev) => {
      const card = (ev.target as Element).closest<HTMLElement>('.spot');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      card.style.setProperty('--my', `${ev.clientY - r.top}px`);
    },
    { passive: true },
  );
}

/* ───── email (de-obfuscate + copy) ───── */
const rev = (s = '') => [...s].reverse().join('');
const mailEl = $<HTMLAnchorElement>('.email');
const email = mailEl ? `${rev(mailEl.dataset.u)}@${rev(mailEl.dataset.d)}` : '';
if (mailEl && email.length > 1) {
  mailEl.textContent = email;
  mailEl.href = `mailto:${email}`;
  $$<HTMLAnchorElement>('.email-cta').forEach((a) => (a.href = `mailto:${email}`));
}
$$<HTMLButtonElement>('.copy-email').forEach((btn) =>
  btn.addEventListener('click', async () => {
    const label = btn.querySelector('span');
    try {
      await navigator.clipboard.writeText(email);
      if (label) label.textContent = 'copied!';
    } catch {
      if (label) label.textContent = 'error';
    }
    setTimeout(() => label && (label.textContent = 'copy'), 1800);
  }),
);

/* ───── matrix rain in hero ───── */
const canvas = $<HTMLCanvasElement>('#rain');
if (canvas && !reduced) {
  const ctx = canvas.getContext('2d')!;
  const chars = '01アイウエオカキクケコサシスセソ<>/{}[];=+*#$'.split('');
  const size = 16;
  let cols: number[] = [];
  let running = true;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Array.from({ length: Math.ceil(canvas.clientWidth / size) }, () => Math.random() * -50);
  };
  resize();
  addEventListener('resize', resize, { passive: true });
  new IntersectionObserver(([e]) => (running = e.isIntersecting)).observe(canvas);
  let last = 0;
  const draw = (t: number) => {
    requestAnimationFrame(draw);
    if (!running || document.hidden || t - last < 55) return;
    last = t;
    const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    ctx.globalAlpha = 1;
    ctx.fillStyle = accent;
    ctx.font = `${size - 2}px "JetBrains Mono Variable", monospace`;
    cols.forEach((y, i) => {
      ctx.fillText(chars[(Math.random() * chars.length) | 0], i * size, y * size);
      cols[i] = y * size > canvas.clientHeight && Math.random() > 0.975 ? 0 : y + 1;
    });
  };
  requestAnimationFrame(draw);
}

/* ───── interactive shell ───── */
initShell({ setTheme, themes: THEMES, email });

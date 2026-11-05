/**
 * Tiny fake shell. Output is built with createElement/textContent only — user input is never parsed as HTML.
 */
type Data = {
  profile: { name: string; role: string; location: string; tagline: string; handle: string };
  skills: { group: string; items: string[] }[];
  projects: { name: string; desc: string; url: string }[];
  socials: { label: string; href: string }[];
};
type Opts<T extends string> = { setTheme: (t: T) => void; themes: readonly T[]; email: string };
type Part = string | { text: string; cls?: string; href?: string };

export function initShell<T extends string>({ setTheme, themes, email }: Opts<T>) {
  const term = document.getElementById('term');
  const out = document.getElementById('term-out');
  const form = document.getElementById('term-form') as HTMLFormElement | null;
  const input = document.getElementById('term-in') as HTMLInputElement | null;
  const raw = document.getElementById('shell-data')?.textContent;
  if (!term || !out || !form || !input || !raw) return;
  const data = JSON.parse(raw) as Data;
  const history: string[] = [];
  let hIdx = 0;

  const line = (...parts: Part[]) => {
    const p = document.createElement('p');
    p.className = 'whitespace-pre-wrap break-words';
    for (const part of parts) {
      if (typeof part === 'string') {
        p.append(part);
        continue;
      }
      const el = part.href ? document.createElement('a') : document.createElement('span');
      el.textContent = part.text;
      if (part.cls) el.className = part.cls;
      if (el instanceof HTMLAnchorElement && part.href) {
        el.href = part.href;
        if (/^https?:/.test(part.href)) {
          el.target = '_blank';
          el.rel = 'noopener noreferrer';
        }
        el.className = (part.cls ?? '') + ' underline decoration-dotted hover:text-accent';
      }
      p.append(el);
    }
    out.append(p);
  };
  const A = (text: string) => ({ text, cls: 'text-accent' });
  const B = (text: string) => ({ text, cls: 'text-accent-2' });
  const M = (text: string) => ({ text, cls: 'text-muted' });
  const E = (text: string) => ({ text, cls: 'text-err' });

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const commands: Record<string, { desc: string; run: (args: string[]) => void }> = {
    help: {
      desc: 'list available commands',
      run: () => {
        line(M('available commands:'));
        for (const [name, c] of Object.entries(commands)) line('  ', A(name.padEnd(10)), M(c.desc));
      },
    },
    whoami: {
      desc: 'who is this person?',
      run: () => {
        line(A(data.profile.name), ' — ', data.profile.role, ' · ', M(data.profile.location));
        line(data.profile.tagline);
      },
    },
    about: { desc: 'jump to the about section', run: () => (line(M('→ opening about.md…')), scrollTo('about')) },
    skills: {
      desc: 'print my tech stack',
      run: () => data.skills.forEach((g) => line(B(`${g.group}/`.padEnd(12)), g.items.join('  '))),
    },
    projects: {
      desc: 'list projects',
      run: () =>
        data.projects.forEach((p) =>
          line(A('▸ '), p.url ? { text: p.name, cls: 'text-fg font-bold', href: p.url } : { text: p.name, cls: 'font-bold' }, M(` — ${p.desc}`)),
        ),
    },
    contact: {
      desc: 'how to reach me',
      run: () => {
        if (email) line(B('email'.padEnd(10)), { text: email, href: `mailto:${email}` });
        data.socials.forEach((s) => line(B(s.label.padEnd(10)), { text: s.href.replace(/^https?:\/\//, ''), href: s.href }));
      },
    },
    theme: {
      desc: `switch colors: ${themes.join(' | ')}`,
      run: ([t]) => {
        if (t && (themes as readonly string[]).includes(t)) {
          setTheme(t as T);
          line(M('theme set to '), A(t));
        } else line('usage: theme ', A(themes.join(' | ')));
      },
    },
    neofetch: {
      desc: 'system info, but it is me',
      run: () => {
        const p = data.profile;
        line(A(`${p.handle}@portfolio`));
        line(M('-----------------'));
        line(B('role     '), p.role);
        line(B('location '), p.location);
        line(B('stack    '), data.skills.flatMap((g) => g.items).slice(0, 6).join(', '));
        line(B('projects '), String(data.projects.length));
      },
    },
    ls: { desc: 'list files', run: () => line(B('about.md  '), B('skills/  '), B('projects/  '), A('contact.sh  '), M('.secrets')) },
    cat: {
      desc: 'read a file',
      run: ([f]) => {
        if (f === '.secrets') line(E('permission denied: nice try 😄'));
        else if (f === 'about.md') commands.whoami.run([]);
        else line(E(`cat: ${f ?? ''}: no such file`));
      },
    },
    echo: { desc: 'print text', run: (args) => line(args.join(' ')) },
    date: { desc: 'current date', run: () => line(new Date().toString()) },
    history: { desc: 'command history', run: () => history.forEach((h, i) => line(M(String(i + 1).padStart(3) + '  '), h)) },
    sudo: { desc: 'try it', run: () => line(E(`${data.profile.handle} is not in the sudoers file. This incident will be reported.`)) },
    clear: { desc: 'clear the screen', run: () => out.replaceChildren() },
    exit: { desc: 'leave the shell', run: () => (line(M('logout · see you around!')), input.blur()) },
  };

  const run = (rawCmd: string) => {
    const cmd = rawCmd.trim().slice(0, 120);
    line(A(`${data.profile.handle}@portfolio`), M(':'), B('~'), M('$ '), cmd);
    if (!cmd) return;
    history.push(cmd);
    hIdx = history.length;
    const [name, ...args] = cmd.split(/\s+/);
    const c = commands[name.toLowerCase()];
    if (c) c.run(args);
    else line(E(`command not found: ${name}`), M(' — try '), A('help'));
    term.scrollTop = term.scrollHeight;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] ?? '';
    } else if (e.key === 'Tab') {
      const match = Object.keys(commands).find((k) => k.startsWith(input.value) && input.value);
      if (match) {
        e.preventDefault();
        input.value = match + ' ';
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.replaceChildren();
    }
  });
  term.addEventListener('click', () => {
    if (!getSelection()?.toString()) input.focus({ preventScroll: true });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-cmd]').forEach((b) =>
    b.addEventListener('click', () => {
      run(b.dataset.cmd ?? '');
      input.focus({ preventScroll: true });
    }),
  );
}

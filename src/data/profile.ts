/**
 * ─────────────────────────────────────────────────────────────
 *  ALL SITE CONTENT LIVES HERE.
 *  Skill levels (1..5) are estimates — adjust them to how you feel about each one.
 * ─────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Lfps',
  fullName: 'Luiz Felipe', // shown in the footer / meta author
  handle: 'lfps',
  githubUser: 'LuizFps120hz',
  role: 'Software Development Student',
  location: 'Brazil',
  tagline: 'I build practical software, explore Linux and learn by shipping hands-on projects.',
  typedRoles: ['software development student', 'python hobbyist', 'linux enthusiast', 'self-hosting tinkerer'],
  status: 'Open to remote internships & entry-level roles',
  education: 'Systems Analysis & Development @ Facimp Wyden',
  about: [
    "Hey, I'm Luiz — a Systems Analysis and Development student at Facimp Wyden who learns best by building. I like taking things apart to understand how software and computer systems really work, then putting them back together a little better.",
    'So far that has meant simple websites, Python Discord bots and running Minecraft servers, including modded multiplayer setups. Debian is my daily driver, and I keep a small home lab where I self-host services with Docker, Nginx and Tailscale.',
    "Right now I'm leveling up in backend development, databases, automation and cloud. I'm looking for remote internships and entry-level roles where I can keep learning on real projects — and contribute from day one.",
  ],
  interests: ['Linux & Cybersecurity', 'Backend & Web', 'Automation & AI tools', 'Self-hosting & Networking', 'Databases'],
  motto: 'Hands-on experience is the fastest way to become a better developer.',
};

export type Contact = { label: string; value: string; href: string; icon: 'mail' | 'github' | 'linkedin' | 'discord' | 'x' };

export const contacts: Contact[] = [
  { label: 'github', value: '@LuizFps120hz', href: 'https://github.com/LuizFps120hz', icon: 'github' },
  // Add more when ready, e.g.:
  // { label: 'email', value: 'you@example.com', href: 'mailto:you@example.com', icon: 'mail' },
  // { label: 'linkedin', value: 'in/your-profile', href: 'https://www.linkedin.com/in/your-profile', icon: 'linkedin' },
];

export const skills: { group: string; cmd: string; items: { name: string; level: number }[] }[] = [
  {
    group: 'languages',
    cmd: 'ls ~/skills/languages',
    items: [
      { name: 'Python', level: 3 },
      { name: 'JavaScript', level: 3 },
      { name: 'PHP', level: 2 },
    ],
  },
  {
    group: 'frontend',
    cmd: 'ls ~/skills/frontend',
    items: [
      { name: 'HTML / CSS', level: 3 },
      { name: 'Tailwind CSS', level: 3 },
      { name: 'React', level: 2 },
    ],
  },
  {
    group: 'backend',
    cmd: 'ls ~/skills/backend',
    items: [
      { name: 'Node.js', level: 2 },
      { name: 'Express.js', level: 2 },
      { name: 'Flask', level: 2 },
      { name: 'FastAPI', level: 2 },
      { name: 'Django', level: 1 },
      { name: 'PostgreSQL', level: 2 },
      { name: 'MongoDB', level: 2 },
    ],
  },
  {
    group: 'infra',
    cmd: 'ls ~/skills/infra',
    items: [
      { name: 'Linux / Debian', level: 4 },
      { name: 'Git', level: 3 },
      { name: 'Docker', level: 3 },
      { name: 'Tailscale', level: 3 },
      { name: 'Pterodactyl', level: 3 },
      { name: 'Nginx', level: 2 },
    ],
  },
];

/** Extra words that scroll in the tech ticker. */
export const ticker = [
  'Python', 'JavaScript', 'PHP', 'React', 'Tailwind', 'Node.js', 'Express', 'Flask', 'FastAPI', 'Django',
  'PostgreSQL', 'MongoDB', 'Debian', 'Docker', 'Nginx', 'Tailscale', 'Pterodactyl', 'Git', 'Obsidian', 'Self-hosting',
];

export type Job = { hash: string; date: string; title: string; org: string; desc: string; tags: string[] };

export const experience: Job[] = [
  {
    hash: 'a1f3c9e',
    date: 'in progress',
    title: 'Systems Analysis & Development',
    org: 'Facimp Wyden',
    desc: 'Undergraduate degree covering programming, software engineering, databases and the fundamentals of computing — the theory behind everything I build on the side.',
    tags: ['university', 'software-dev', 'databases'],
  },
  {
    hash: '7b2e0d4',
    date: 'ongoing',
    title: 'Independent Software Projects',
    org: 'Personal',
    desc: 'Python Discord bots, simple websites and full-stack app concepts like a personal finance manager. Each project is an excuse to learn a new tool and solve a real problem.',
    tags: ['python', 'web', 'side-projects'],
  },
  {
    hash: 'c45d8a1',
    date: 'ongoing',
    title: 'Home Lab & Self-hosting',
    org: 'Personal infrastructure',
    desc: 'Running web services and apps across multiple machines at home with Docker, Nginx as a reverse proxy and Tailscale for private access.',
    tags: ['docker', 'nginx', 'networking'],
  },
  {
    hash: '0e9f6b2',
    date: 'side quest',
    title: 'Game Server Administration',
    org: 'Minecraft communities',
    desc: 'Configured and managed Minecraft servers, including modded multiplayer environments — my first taste of hosting, performance tuning and keeping things online.',
    tags: ['servers', 'pterodactyl', 'linux'],
  },
];

export type Project = {
  name: string;
  desc: string;
  tags: string[];
  repo?: string;
  demo?: string;
  stars?: number;
  language?: string;
  featured?: boolean;
  status?: 'in progress' | 'planned' | 'concept' | 'ongoing';
};

/**
 * Hand-picked projects. Public GitHub repos are merged in automatically at build time
 * (see src/lib/github.ts); entries here win when names match.
 */
export const projects: Project[] = [
  {
    name: 'caixa-web',
    desc: 'Personal finance hub that brings your balance, upcoming payments, a bill calendar and financial projections into one place — React frontend talking to a separate Express API.',
    tags: ['React', 'Express.js', 'PostgreSQL'],
    featured: true,
  },
  {
    name: 'debian-maintenance-tool',
    desc: 'Keeps a Debian machine healthy: system health checks, application management and disk management in a single tool. Next up: a real-time web dashboard for the background service.',
    tags: ['Debian', 'Linux', 'SysAdmin'],
    featured: true,
  },
  {
    name: 'home-lab',
    desc: 'Self-hosting web services across multiple machines — containers with Docker, Nginx as reverse proxy and private access over Tailscale.',
    tags: ['Docker', 'Nginx', 'Tailscale'],
    status: 'ongoing',
  },
  {
    name: 'discord-bots',
    desc: 'Discord bots written in Python — commands and automations built while learning the language hands-on.',
    tags: ['Python', 'Discord', 'Automation'],
  },
  {
    name: 'salon-scheduler',
    desc: 'Appointment app for a beauty salon, replacing a WhatsApp-and-notebook workflow with organized customer records and a clean schedule.',
    tags: ['Web App', 'Scheduling', 'Small Business'],
    status: 'planned',
  },
  {
    name: 'second-brain-for-agents',
    desc: 'An Obsidian vault structured as a knowledge base, so an AI agent can use well-organized Markdown notes as reliable context.',
    tags: ['Obsidian', 'Markdown', 'AI Agents'],
    status: 'concept',
  },
  {
    name: 'wynnbuilder',
    desc: 'Gear optimizer for Wynncraft builds.',
    tags: ['JavaScript', 'Game tooling'],
    repo: 'https://github.com/LuizFps120hz/wynnbuilder',
  },
  {
    name: 'portfolio',
    desc: 'This site. Astro + Tailwind, terminal aesthetic, strict CSP and zero trackers — deployed with GitHub Actions.',
    tags: ['Astro', 'Tailwind', 'TypeScript'],
    repo: 'https://github.com/LuizFps120hz/LuizFps120hz.github.io',
    demo: 'https://luizfps120hz.github.io',
  },
];

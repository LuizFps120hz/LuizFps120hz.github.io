import { profile, projects as manual, type Project } from '../data/profile';

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
};

/**
 * Runs at BUILD time only (the site is static), so no token or API call ever reaches the browser.
 * In GitHub Actions the workflow passes GITHUB_TOKEN to avoid rate limits; locally it works unauthenticated.
 * If the API is unreachable the hand-picked list is used as-is.
 */
export async function getProjects(): Promise<Project[]> {
  let repos: Repo[] = [];
  try {
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portfolio-build' };
    const token = process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=updated`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) repos = (await res.json()) as Repo[];
    else console.warn(`[github] API responded ${res.status}, using manual projects only`);
  } catch (err) {
    console.warn('[github] fetch failed, using manual projects only:', (err as Error).message);
  }

  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  const merged: Project[] = manual.map((p) => {
    const r = byName.get(p.name.toLowerCase());
    if (!r) return p;
    byName.delete(p.name.toLowerCase());
    return { ...p, stars: r.stargazers_count, language: r.language ?? p.language, repo: p.repo ?? r.html_url };
  });

  const ignored = new Set([profile.githubUser.toLowerCase(), `${profile.githubUser.toLowerCase()}.github.io`]);
  for (const r of byName.values()) {
    if (r.fork || r.archived || ignored.has(r.name.toLowerCase())) continue;
    merged.push({
      name: r.name,
      desc: r.description ?? 'No description yet.',
      tags: [r.language, ...(r.topics ?? [])].filter((t): t is string => Boolean(t)).slice(0, 3),
      repo: r.html_url,
      demo: r.homepage || undefined,
      stars: r.stargazers_count,
      language: r.language ?? undefined,
    });
  }

  return merged.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

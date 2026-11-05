// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// User site: https://<login>.github.io  ->  repo must be named "<login>.github.io"
export default defineConfig({
  site: 'https://luizfps120hz.github.io',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()], build: { assetsInlineLimit: 0 } },
  build: { inlineStylesheets: 'never' },
  markdown: { syntaxHighlight: false },
  security: {
    // Astro hashes every script/style it emits and writes a CSP <meta> tag.
    // GitHub Pages can't send HTTP headers, so this is the strongest option available.
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        "manifest-src 'self'",
        'upgrade-insecure-requests',
      ],
    },
  },
});

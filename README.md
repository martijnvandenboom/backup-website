# backup-website

## Production URL

The canonical public URL is `https://vandenboom.icu`.

Cloudflare Pages middleware redirects `backup-website.pages.dev`, all hashed
Pages deployment hostnames, and `www.vandenboom.icu` to the canonical domain
with a permanent redirect while preserving the path and query string.

Amazon affiliate short URLs are listed in `functions/affiliates.ts` and issued
as 302 redirects (for example `/swiffer` → `https://amzn.to/4j3OP8D`). Add a
new path there, and also in `static/_redirects`, when you publish another
product link.

In Cloudflare Pages, keep the production build command free of a `-b` or
`--baseURL $CF_PAGES_URL` override so Hugo uses the `baseurl` in `config.toml`.

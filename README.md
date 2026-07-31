# backup-website

## Production URL

The canonical public URL is `https://vandenboom.icu`.

Cloudflare Pages middleware redirects `backup-website.pages.dev`, all hashed
Pages deployment hostnames, and `www.vandenboom.icu` to the canonical domain
with a permanent redirect while preserving the path and query string.

In Cloudflare Pages, keep the production build command free of a `-b` or
`--baseURL $CF_PAGES_URL` override so Hugo uses the `baseurl` in `config.toml`.

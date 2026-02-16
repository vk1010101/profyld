# Post-Launch To-Do

## Priority: Medium
- [ ] **Cloudflare Turnstile CAPTCHA** — Adds invisible bot protection to login/signup
  - Go to [dash.cloudflare.com/turnstile](https://dash.cloudflare.com/turnstile)
  - Create site, get Site Key + Secret Key
  - Add to Vercel env vars: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
  - No code changes needed — already wired into login + signup pages

## Priority: Low (When Scaling Past ~50K Users)
- [ ] **Redis-based rate limiting** — Replace in-memory rate limiter with Upstash Redis
  - Current in-memory limiter works fine for 10-20K users
  - Upstash has a free tier: [upstash.com](https://upstash.com)
- [ ] **Custom domain setup** — Configure Vercel for `profyld.com` wildcard subdomains
- [ ] **CDN / Edge caching** — Cache public portfolio pages at the edge for faster load times

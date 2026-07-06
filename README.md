# metronome-bpm.app

Landing page for **Metronome Pro - Tempo BPM** (iOS).

## Deploy

Hosted on [GitHub Pages](https://pages.github.com/) with custom domain `metronome-bpm.app`.

```bash
git push origin main
```

## GitHub Pages setup

1. Create repo `metronome-bpm` on GitHub (public)
2. Push this folder
3. **Settings → Pages →** deploy from `main` branch, root `/`
4. Set custom domain: `metronome-bpm.app`
5. Enable **Enforce HTTPS**

## Cloudflare DNS

For apex domain `metronome-bpm.app`:

| Type | Name | Value |
|------|------|-------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `moonmoonnotsun.github.io` |

Set proxy to **DNS only** (grey cloud) for GitHub Pages. SSL mode **Full**.

## Links

- App Store: https://apps.apple.com/us/app/metronome-pro-tempo-bpm/id6755417459
- Privacy: https://mpc-app-c2e7a.web.app/metronome-privacy.html
- Terms: https://mpc-app-c2e7a.web.app/metronome-terms.html

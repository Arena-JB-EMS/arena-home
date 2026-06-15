# thearenahub.co.uk — Marketing Site
**arena-home** · June 2026

Main marketing and legal documentation site for The Arena Hub Ltd. Static HTML/CSS/JS, no build pipeline.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — product overview, mission, pilot CTA |
| `platform.html` | Platform feature breakdown |
| `pricing.html` | Pricing tiers (Sovereign Network, Pilot, Licence) |
| `compliance.html` | GDPR / ICO compliance statement |
| `company.html` | Company overview, leadership, mission |
| `dpa.html` | Data Processing Agreement (UK GDPR Art. 28) |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms & Conditions |

## Tech Stack

```
HTML / CSS / vanilla JS
No frameworks, no build step, no bundler
Hosted on GitHub Pages (arena-home repo)
Config: GAS Web App → ARENA_SITE_CONFIG Google Sheet
```

## Dynamic Config

Contact details, pricing, legal identifiers, and email addresses are **not hardcoded**. They are served by a Google Apps Script Web App backed by the **ARENA_SITE_CONFIG** sheet in the Shared Drive.

**GAS endpoint:**
```
https://script.google.com/macros/s/AKfycbxphfIOhEweH4m3WeF8lAVffSPbAB9uUXH-1t0qfYnWPV_G9NHxdbCrcMZHLm6gXROabA/exec
```

**Sheet ID:** `1Fp1pLRiqovICnZCqEUQxMtBJkZIsAc3RbDHAPQVcbZ8`

**Script:** `ARENA_SITE_CONFIG.gs` (lives in the Sheet's Apps Script project)

**Client injection:** `arena-config.js` fetches the endpoint on page load and injects values using HTML attributes:

| Attribute | Effect |
|---|---|
| `data-config="key"` | Sets element `textContent` |
| `data-config-href-key="key"` + `data-config-href-prefix="tel:"` | Sets `href` |
| `data-config-href-email-key="key"` | Swaps only the email in `mailto:email?subject=...` |

If the endpoint is unreachable, all `data-config` elements are hidden.

**To update any contact detail or price:** Open ARENA_SITE_CONFIG sheet → ⚡ Arena Config → Open Admin Panel → edit value → Commit Changes.

## Config Keys

```
company_name          phone              pilot_price_monthly
company_number        email_support      pilot_price_annual
duns_number           email_pilot        sovereign_discount
registered_address    email_sales        social_linkedin
ico_ref               email_compliance   social_facebook
vat_number            email_legal        social_instagram
substack_url          email_hello        social_substack
                      email_data_protection
```

## File Inventory

```
arena-config.js          Dynamic config client
ARENA_SITE_CONFIG.gs     GAS Web App source (maintain in Apps Script, copy here for reference)
patch_html_config.py     One-time patcher used to inject data-config attributes (June 2026)
WEBSITE_MANIFEST.md      Full key registry, deployment notes, pending issues
*.html                   The 8 site pages
images/                  All page assets (logos, screenshots, hero images)
```

> **Dead files removed (June 2026):** `genesis.html`, `genesis.md`, `gas-setup.md`, `tier1-5.html` — Kickstarter-era files, no longer referenced anywhere.

## Deployment Workflow

GitHub Pages auto-deploys from `main` branch. No build step.

1. Edit HTML structurally (do not hardcode contact details — use `data-config` attributes)
2. Commit and push to `main`
3. To update contact details without an HTML change: update the ARENA_SITE_CONFIG sheet directly

## Sovereign Infrastructure Principles

- No third-party tracking, analytics, or advertising
- All data lives in Google Workspace (school or company tenant)
- Arena Hub never stores student PII
- DPA (UK GDPR Art. 28) provided on request and linked from site

## Company

**The Arena Hub Ltd** · Company No. 1708605 · Registered in England & Wales  
Founder: Jonathan Baguley · [thearenahub.co.uk](https://thearenahub.co.uk)

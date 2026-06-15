# ARENA HUB WEBSITE MANIFEST
# arena-hub-co-uk — S104 — 2026-06-15
# READ THIS FIRST before any website work

---

## 1. DYNAMIC CONFIG SYSTEM

All contact details, legal identifiers, pricing, and social links are managed through a
**Google Sheets config** + **GAS Web App** that the website fetches on page load.
HTML files should NOT have hardcoded phone/email/pricing values — these are now dynamic.

### Config Sheet Location
- **Google Shared Drive:** `G:\Shared drives\02 – Product – The Arena\05_Websites`
- **Sheet name:** `ARENA_SITE_CONFIG`
- **Tab name:** `CONFIG`
- **Format:** KEY | VALUE | DESCRIPTION | CATEGORY (rows 2+, row 1 = header)

### GAS Web App
- **Script file:** `ARENA_SITE_CONFIG.gs` (in this directory)
- **Setup:** Run `setupSheet()` once to create the sheet in the Shared Drive folder
- **Deployment:** Deploy as Web App — Execute as: Me | Access: Anyone
- **Deployment ID:** `AKfycbxphfIOhEweH4m3WeF8lAVffSPbAB9uUXH-1t0qfYnWPV_G9NHxdbCrcMZHLm6gXROabA`
- **Endpoint:** `https://script.google.com/macros/s/AKfycbxphfIOhEweH4m3WeF8lAVffSPbAB9uUXH-1t0qfYnWPV_G9NHxdbCrcMZHLm6gXROabA/exec`
- **Sheet ID:** `1Fp1pLRiqovICnZCqEUQxMtBJkZIsAc3RbDHAPQVcbZ8`

### JS Loader
- **File:** `arena-config.js` (in this directory)
- **ARENA_CONFIG_URL:** Set this to your `/exec` URL after GAS deployment
- **Behaviour:** Fetches config on DOMContentLoaded, injects into DOM via data attributes
- **Failure:** If fetch fails or key missing → element is hidden (`display:none`)

### HTML Data Attributes
| Attribute | Behaviour |
|---|---|
| `data-config="key"` | Sets element.textContent to config[key] |
| `data-config-href-key="key"` + `data-config-href-prefix="X"` | Sets href to `X + config[key]` |
| `data-config-href-email-key="key"` | Swaps only email portion in existing `mailto:email?subject=...` href |

---

## 2. CONFIG KEYS (24 total)

### CONTACT
| Key | Current Value | Pages |
|---|---|---|
| phone | 01618702916 (DISCONNECTED — update when new number issued) | company, dpa, privacy, terms |
| email_dpo | j.baguley@thearenahub.co.uk | privacy, terms, dpa |
| email_pilot | pilot@thearenahub.co.uk | company, pricing |
| email_sales | sales@thearenahub.co.uk | company, pricing |
| email_support | support@thearenahub.co.uk | platform |
| email_compliance | compliance@thearenahub.co.uk | dpa, compliance |
| email_schools | schools@thearenahub.co.uk | company (contact form dropdown) |
| email_safeguarding | safeguarding@thearenahub.co.uk | company (contact form dropdown) |
| email_data_protection | data-protection@thearenahub.co.uk | company (contact form dropdown) |
| email_info | info@thearenahub.co.uk | company (contact form dropdown) |
| email_scn | sovereign_network@thearenahub.co.uk | pricing |

### LEGAL
| Key | Current Value | Pages |
|---|---|---|
| company_name | The Arena Hub Ltd | dpa |
| company_number | 1708605 | company, dpa, privacy, compliance |
| duns_number | 234652645 | dpa, compliance |
| director_name | Jonathan Baguley | dpa |
| director_title | Founder & Principal Data Architect | dpa |
| dpa_reference | ARENA-DPA-2026-001 | (not yet injected — add if needed) |

### PRICING
| Key | Current Value | Pages |
|---|---|---|
| pilot_price | £495 + VAT | terms, pricing (prose) |
| pilot_duration | 6 weeks | terms (prose) |

### SOCIAL
| Key | Current Value | Pages |
|---|---|---|
| social_linkedin | https://linkedin.com/company/the-arena-hub | company, privacy |
| social_facebook | https://facebook.com/TheArenaHubUK | company |
| social_instagram | https://instagram.com/TheArenaHubUK | company |
| social_substack | https://thearenahub.substack.com | company, privacy |

---

## 3. FILE INVENTORY

### HTML Pages (patched with dynamic config)
| File | Status | Notes |
|---|---|---|
| company.html | ✅ patched | Main company/contact page |
| dpa.html | ✅ patched | Data Processing Agreement |
| privacy.html | ✅ patched | Privacy Policy |
| terms.html | ✅ patched | Terms & Conditions |
| pricing.html | ✅ patched | Pricing tiers (uses href-email-key for parameterized mailto) |
| compliance.html | ✅ patched | Regulatory compliance |
| platform.html | ✅ patched | Platform overview |
| index.html | no config needed | Landing page — no contact details |
| student-hub.html | no config needed | Student page — no contact details |
| admin-batching.html | separate config | Has own ARENA_HUB_CONFIG_URL for Performance Centre only |
| parent-home.html | not audited | May need review |

### Subfolder: thearenahub/
Contains own copies of dpa.html, privacy.html, terms.html.
**PENDING:** These need the same config injection treatment (separate task).

### Config System Files
| File | Purpose |
|---|---|
| ARENA_SITE_CONFIG.gs | GAS: sheet setup + doGet() endpoint + admin sidebar |
| arena-config.js | Client-side: fetches config + injects into DOM |
| patch_html_config.py | One-time patcher: injected data attributes into all HTML files |
| WEBSITE_MANIFEST.md | This file — read before any website work |

### Assets
| File | Notes |
|---|---|
| Kit Room card.jpg | Product card image |
| Performance Centre card.jpg | Product card image |
| Welfare Suite card.jpg | Product card image |
| The Arena Hub Master Concept.pdf | Product concept doc |
| kit-room-card.jpg / performance-centre-card.jpg / welfare-suite-card.jpg | Lowercase duplicates |
| foundation-tier-icon.jpg | Pricing tier icon |
| scn-tier-icon.jpg | SCN tier icon |
| manifest.json | PWA manifest |
| sw.js | Service worker |

---

## 4. DEPLOYMENT WORKFLOW

### One-time setup (already done: HTML patching)
1. ✅ Audit HTML files → identify dynamic values
2. ✅ Write ARENA_SITE_CONFIG.gs (GAS)
3. ✅ Write arena-config.js (client loader)
4. ✅ Patch all HTML files with data-config attributes

### To activate (user action required)
1. Open script.google.com → New project → paste ARENA_SITE_CONFIG.gs
2. Set `FOLDER_ID` = Drive ID of `05_Websites` folder (from Shared Drive URL)
3. Run `setupSheet()` → authorise → sheet created in Shared Drive
4. Deploy → Manage Deployments → New Deployment (Web App, Execute as Me, Access: Anyone)
5. Copy /exec URL → paste into `arena-config.js` at `ARENA_CONFIG_URL = '...'`
6. Commit all modified HTML files + arena-config.js to hosting repo
7. Test: open any page, inspect elements with data-config — values should be live

### Updating config (ongoing)
1. Open ARENA_SITE_CONFIG sheet in Google Sheets
2. ⚡ Arena Config menu → Open Admin Panel
3. Edit values → Commit → changes are live immediately

---

## 5. KNOWN ISSUES / TODO

- **Phone number 01618702916 is DISCONNECTED** — update `phone` key in sheet when new number issued
- **thearenahub/ subfolder** — dpa.html, privacy.html, terms.html not yet patched
- **compliance.html JS strings (lines 378, 470)** — `compliance@thearenahub.co.uk` appears inside JS template strings; left as static to avoid breaking JS. If email changes, also update those strings manually
- **platform.html JS string (line 962)** — `support@thearenahub.co.uk` inside JS; left static
- **company.html contact form dropdown** — `<option>` values have email addresses as text (lines 1680-1687); these are UI labels only (actual routing is GAS-side), not patched
- **pricing.html footer DUNS** — check if line 974 was patched correctly

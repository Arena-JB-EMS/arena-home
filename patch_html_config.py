#!/usr/bin/env python3
"""
patch_html_config.py — S104 — 2026-06-15
Injects arena-config.js data attributes into Arena Hub website HTML files.

Run from the arena-hub-co-uk/ directory:
    python3 patch_html_config.py

Creates .bak backups before modifying any file.

WHAT IT DOES:
  1. Adds <script src="arena-config.js"></script> before </body>
  2. Applies file-specific targeted replacements for each dynamic config value
"""

import re
import shutil
import sys
from pathlib import Path

BASE = Path(__file__).parent
DRY_RUN = '--dry-run' in sys.argv

def patch(filepath, replacements):
    """Apply a list of (old, new) string replacements to a file."""
    p = Path(filepath)
    if not p.exists():
        print(f"  SKIP (not found): {p.name}")
        return

    original = p.read_text(encoding='utf-8')
    content  = original

    for old, new in replacements:
        if old not in content:
            # Try as regex
            count = len(re.findall(re.escape(old), content))
            if count == 0:
                print(f"  WARN [{p.name}]: pattern not found — '{old[:60]}...'")
            continue
        count = content.count(old)
        content = content.replace(old, new)
        print(f"  OK   [{p.name}]: {count}x — '{old[:60].strip()}'")

    if content == original:
        print(f"  INFO [{p.name}]: no changes made")
        return

    if not DRY_RUN:
        shutil.copy2(p, p.with_suffix(p.suffix + '.bak'))
        p.write_text(content, encoding='utf-8')
        print(f"  SAVED: {p.name}")
    else:
        print(f"  DRY-RUN: {p.name} would have been written")


# ── SCRIPT INJECTION ──────────────────────────────────────────────────────────
# Add arena-config.js before </body> in every HTML file that targets users.
# The script tag is idempotent — if already present, skip.

SCRIPT_TAG = '<script src="arena-config.js"></script>'
SCRIPT_MARKER = 'src="arena-config.js"'

TARGET_PAGES = [
    'company.html',
    'dpa.html',
    'privacy.html',
    'terms.html',
    'pricing.html',
    'compliance.html',
    'platform.html',
]

print("\n=== STEP 1: Injecting arena-config.js script tag ===")
for fname in TARGET_PAGES:
    p = BASE / fname
    if not p.exists():
        print(f"  SKIP: {fname}")
        continue
    content = p.read_text(encoding='utf-8')
    if SCRIPT_MARKER in content:
        print(f"  ALREADY PRESENT: {fname}")
        continue
    if '</body>' not in content:
        print(f"  WARN: no </body> in {fname}")
        continue
    new_content = content.replace('</body>', f'  {SCRIPT_TAG}\n</body>', 1)
    if not DRY_RUN:
        shutil.copy2(p, p.with_suffix('.html.bak'))
        p.write_text(new_content, encoding='utf-8')
        print(f"  INJECTED: {fname}")
    else:
        print(f"  DRY-RUN: {fname} would have script injected")


# ── FILE-SPECIFIC REPLACEMENTS ────────────────────────────────────────────────
print("\n=== STEP 2: Injecting data-config attributes ===")

# ─── company.html ─────────────────────────────────────────────────────────────
print("\n[company.html]")
patch(BASE / 'company.html', [

    # Phone — footer-phone link (has icon + text, use span for text, href-key for href)
    (
        '<a href="tel:01618702916" class="footer-phone">\n                    <i class="fas fa-phone" aria-hidden="true"></i> 01618702916\n                </a>',
        '<a href="tel:01618702916" class="footer-phone" data-config-href-prefix="tel:" data-config-href-key="phone">\n                    <i class="fas fa-phone" aria-hidden="true"></i> <span data-config="phone">01618702916</span>\n                </a>'
    ),

    # Company number in footer
    (
        'CH#1708605 &mdash; All rights reserved.',
        'CH#<span data-config="company_number">1708605</span> &mdash; All rights reserved.'
    ),

    # LinkedIn footer link
    (
        '<a id="footer-linkedin" href="https://linkedin.com/company/the-arena-hub" target="_blank" rel="noopener">',
        '<a id="footer-linkedin" href="https://linkedin.com/company/the-arena-hub" data-config-href-prefix="" data-config-href-key="social_linkedin" target="_blank" rel="noopener">'
    ),

    # Facebook footer link
    (
        '<a id="footer-facebook" href="https://facebook.com/TheArenaHubUK" target="_blank" rel="noopener">',
        '<a id="footer-facebook" href="https://facebook.com/TheArenaHubUK" data-config-href-prefix="" data-config-href-key="social_facebook" target="_blank" rel="noopener">'
    ),

    # Instagram footer link
    (
        '<a id="footer-instagram" href="https://instagram.com/TheArenaHubUK" target="_blank" rel="noopener">',
        '<a id="footer-instagram" href="https://instagram.com/TheArenaHubUK" data-config-href-prefix="" data-config-href-key="social_instagram" target="_blank" rel="noopener">'
    ),

    # Pilot email — tier-contact-btn with icon on separate line
    (
        '<a href="mailto:pilot@thearenahub.co.uk" class="tier-contact-btn">\n                            <i class="fas fa-envelope" aria-hidden="true"></i>\n                            pilot@thearenahub.co.uk\n                        </a>',
        '<a href="mailto:pilot@thearenahub.co.uk" class="tier-contact-btn" data-config-href-prefix="mailto:" data-config-href-key="email_pilot">\n                            <i class="fas fa-envelope" aria-hidden="true"></i>\n                            <span data-config="email_pilot">pilot@thearenahub.co.uk</span>\n                        </a>'
    ),

    # Sales email — tier-contact-btn with icon inline (appears 3 times — use replace_all in post-step)
    # Handled via regex replace below
])

# Sales email in company.html (3 occurrences — identical pattern)
p = BASE / 'company.html'
if p.exists():
    content = p.read_text(encoding='utf-8')
    old = '<a href="mailto:sales@thearenahub.co.uk" class="tier-contact-btn">\n                                <i class="fas fa-envelope" aria-hidden="true"></i> sales@thearenahub.co.uk\n                            </a>'
    new = '<a href="mailto:sales@thearenahub.co.uk" class="tier-contact-btn" data-config-href-prefix="mailto:" data-config-href-key="email_sales">\n                                <i class="fas fa-envelope" aria-hidden="true"></i> <span data-config="email_sales">sales@thearenahub.co.uk</span>\n                            </a>'
    count = content.count(old)
    if count and not DRY_RUN:
        content = content.replace(old, new)
        p.write_text(content, encoding='utf-8')
        print(f"  OK   [company.html]: {count}x — sales@thearenahub.co.uk tier-contact-btn")


# ─── dpa.html ────────────────────────────────────────────────────────────────
print("\n[dpa.html]")
patch(BASE / 'dpa.html', [

    # Company number in meta header
    (
        'CH#1708605</p>',
        'CH#<span data-config="company_number">1708605</span></p>'
    ),

    # Signatory block: Company No. + DUNS + Tel + Email (block replacement)
    (
        'Company No. CH#1708605<br>\n                        D-U-N-S: 234652645<br>\n                        Tel: 01618702916<br>\n                        Email: <a href="mailto:compliance@thearenahub.co.uk">compliance@thearenahub.co.uk</a></p>',
        'Company No. CH#<span data-config="company_number">1708605</span><br>\n                        D-U-N-S: <span data-config="duns_number">234652645</span><br>\n                        Tel: <a href="tel:01618702916" data-config="phone" data-config-href-prefix="tel:" data-config-href-key="phone">01618702916</a><br>\n                        Email: <a href="mailto:compliance@thearenahub.co.uk" data-config="email_compliance" data-config-href-prefix="mailto:" data-config-href-key="email_compliance">compliance@thearenahub.co.uk</a></p>'
    ),

    # Director signatory block
    (
        '<strong>Jonathan Baguley</strong> — Founder &amp; Principal Data Architect<br>',
        '<strong><span data-config="director_name">Jonathan Baguley</span></strong> — <span data-config="director_title">Founder &amp; Principal Data Architect</span><br>'
    ),

    # Signatory block — company number line after director
    (
        'The Arena Hub Ltd &nbsp;&bull;&nbsp; CH#1708605</p>\n                <p>Email: <a href="mailto:compliance@thearenahub.co.uk">compliance@thearenahub.co.uk</a></p>\n                <p>Tel: <a href="tel:01618702916">01618702916</a></p>',
        '<span data-config="company_name">The Arena Hub Ltd</span> &nbsp;&bull;&nbsp; CH#<span data-config="company_number">1708605</span></p>\n                <p>Email: <a href="mailto:compliance@thearenahub.co.uk" data-config="email_compliance" data-config-href-prefix="mailto:" data-config-href-key="email_compliance">compliance@thearenahub.co.uk</a></p>\n                <p>Tel: <a href="tel:01618702916" data-config="phone" data-config-href-prefix="tel:" data-config-href-key="phone">01618702916</a></p>'
    ),

    # Footer compliance emails (two occurrences — same pattern, one in list)
    (
        '<a href="mailto:compliance@thearenahub.co.uk">compliance@thearenahub.co.uk</a></li>',
        '<a href="mailto:compliance@thearenahub.co.uk" data-config="email_compliance" data-config-href-prefix="mailto:" data-config-href-key="email_compliance">compliance@thearenahub.co.uk</a></li>'
    ),
    (
        '<a href="tel:01618702916">01618702916</a></li>',
        '<a href="tel:01618702916" data-config="phone" data-config-href-prefix="tel:" data-config-href-key="phone">01618702916</a></li>'
    ),

    # Company footer line
    (
        'The Arena Hub Ltd &nbsp;&bull;&nbsp; CH#1708605 &nbsp;&bull;&nbsp; Registered in England &amp; Wales',
        '<span data-config="company_name">The Arena Hub Ltd</span> &nbsp;&bull;&nbsp; CH#<span data-config="company_number">1708605</span> &nbsp;&bull;&nbsp; Registered in England &amp; Wales'
    ),

    # Inline director mention in body (development mode paragraph)
    (
        'the Processor Director (Jonathan Baguley, <a href="mailto:compliance@thearenahub.co.uk">compliance@thearenahub.co.uk</a>)',
        'the Processor Director (<span data-config="director_name">Jonathan Baguley</span>, <a href="mailto:compliance@thearenahub.co.uk" data-config="email_compliance" data-config-href-prefix="mailto:" data-config-href-key="email_compliance">compliance@thearenahub.co.uk</a>)'
    ),
])


# ─── privacy.html ────────────────────────────────────────────────────────────
print("\n[privacy.html]")
patch(BASE / 'privacy.html', [

    # Meta header company number
    (
        'CH#1708605</p>',
        'CH#<span data-config="company_number">1708605</span></p>'
    ),

    # Intro paragraph company number
    (
        'Company Number CH#1708605.',
        'Company Number CH#<span data-config="company_number">1708605</span>.'
    ),

    # All j.baguley email links (3 occurrences — same pattern)
    (
        '<a href="mailto:j.baguley@thearenahub.co.uk">j.baguley@thearenahub.co.uk</a>',
        '<a href="mailto:j.baguley@thearenahub.co.uk" data-config="email_dpo" data-config-href-prefix="mailto:" data-config-href-key="email_dpo">j.baguley@thearenahub.co.uk</a>'
    ),

    # Contact block phone
    (
        '<a href="tel:01618702916">01618702916</a>',
        '<a href="tel:01618702916" data-config="phone" data-config-href-prefix="tel:" data-config-href-key="phone">01618702916</a>'
    ),

    # Footer phone link (has icon)
    (
        '<a href="tel:01618702916" class="footer-phone">\n                    <i class="fas fa-phone" aria-hidden="true"></i> 01618702916',
        '<a href="tel:01618702916" class="footer-phone" data-config-href-prefix="tel:" data-config-href-key="phone">\n                    <i class="fas fa-phone" aria-hidden="true"></i> <span data-config="phone">01618702916</span>'
    ),

    # Footer email link (DPO)
    (
        '<a href="mailto:j.baguley@thearenahub.co.uk" class="footer-email-btn">',
        '<a href="mailto:j.baguley@thearenahub.co.uk" class="footer-email-btn" data-config-href-prefix="mailto:" data-config-href-key="email_dpo">'
    ),

    # Substack footer link (main URL only)
    (
        '<a href="https://thearenahub.substack.com" target="_blank" rel="noopener"><i class="fas fa-rss" aria-hidden="true"></i> Arena Hub on Substack</a>',
        '<a href="https://thearenahub.substack.com" data-config-href-prefix="" data-config-href-key="social_substack" target="_blank" rel="noopener"><i class="fas fa-rss" aria-hidden="true"></i> Arena Hub on Substack</a>'
    ),

    # LinkedIn footer
    (
        '<a href="https://linkedin.com/company/the-arena-hub" target="_blank" rel="noopener"><i class="fab fa-linkedin" aria-hidden="true"></i> LinkedIn</a>',
        '<a href="https://linkedin.com/company/the-arena-hub" data-config-href-prefix="" data-config-href-key="social_linkedin" target="_blank" rel="noopener"><i class="fab fa-linkedin" aria-hidden="true"></i> LinkedIn</a>'
    ),

    # Footer copyright company number
    (
        'CH#1708605 &mdash; All rights reserved.',
        'CH#<span data-config="company_number">1708605</span> &mdash; All rights reserved.'
    ),
])


# ─── terms.html ──────────────────────────────────────────────────────────────
print("\n[terms.html]")
patch(BASE / 'terms.html', [

    # Pilot price in plain text summary
    (
        'The £495 pilot gives you 6 weeks of full access.',
        'The <span data-config="pilot_price">£495</span> pilot gives you <span data-config="pilot_duration">6 weeks</span> of full access.'
    ),

    # Pilot price in table cell
    (
        '<td>£495 + VAT (one-off, non-refundable after deployment)</td>',
        '<td><span data-config="pilot_price">£495 + VAT</span> (one-off, non-refundable after deployment)</td>'
    ),

    # Pilot price in refund clause
    (
        'The pilot fee of £495 + VAT is non-refundable',
        'The pilot fee of <span data-config="pilot_price">£495 + VAT</span> is non-refundable'
    ),

    # DPO email cancellation clause
    (
        '<a href="mailto:j.baguley@thearenahub.co.uk">j.baguley@thearenahub.co.uk</a>.',
        '<a href="mailto:j.baguley@thearenahub.co.uk" data-config="email_dpo" data-config-href-prefix="mailto:" data-config-href-key="email_dpo">j.baguley@thearenahub.co.uk</a>.'
    ),

    # Support section — email and phone together
    (
        '<a href="mailto:j.baguley@thearenahub.co.uk">j.baguley@thearenahub.co.uk</a> and by phone at <a href="tel:01618702916">01618702916</a>.',
        '<a href="mailto:j.baguley@thearenahub.co.uk" data-config="email_dpo" data-config-href-prefix="mailto:" data-config-href-key="email_dpo">j.baguley@thearenahub.co.uk</a> and by phone at <a href="tel:01618702916" data-config="phone" data-config-href-prefix="tel:" data-config-href-key="phone">01618702916</a>.'
    ),

    # Contact block email
    (
        '<p>Email: <a href="mailto:j.baguley@thearenahub.co.uk">j.baguley@thearenahub.co.uk</a></p>\n                <p>Phone: <a href="tel:01618702916">01618702916</a></p>',
        '<p>Email: <a href="mailto:j.baguley@thearenahub.co.uk" data-config="email_dpo" data-config-href-prefix="mailto:" data-config-href-key="email_dpo">j.baguley@thearenahub.co.uk</a></p>\n                <p>Phone: <a href="tel:01618702916" data-config="phone" data-config-href-prefix="tel:" data-config-href-key="phone">01618702916</a></p>'
    ),

    # Footer phone (icon)
    (
        '<a href="tel:01618702916" class="footer-phone">\n                    <i class="fas fa-phone" aria-hidden="true"></i> 01618702916',
        '<a href="tel:01618702916" class="footer-phone" data-config-href-prefix="tel:" data-config-href-key="phone">\n                    <i class="fas fa-phone" aria-hidden="true"></i> <span data-config="phone">01618702916</span>'
    ),

    # Footer email (DPO)
    (
        '<a href="mailto:j.baguley@thearenahub.co.uk" class="footer-email-btn">',
        '<a href="mailto:j.baguley@thearenahub.co.uk" class="footer-email-btn" data-config-href-prefix="mailto:" data-config-href-key="email_dpo">'
    ),
])


# ─── pricing.html ────────────────────────────────────────────────────────────
print("\n[pricing.html]")

# First read the file to do regex-based parameterized mailto replacement
p = BASE / 'pricing.html'
if p.exists():
    content = p.read_text(encoding='utf-8')
    changed = False

    # pilot email link — with subject parameter (2 occurrences: btn-outline shows email text, btn-gold shows "Register Interest")
    # Pattern: <a href="mailto:pilot@thearenahub.co.uk?subject=..." class="btn btn-outline">
    #                <i ...></i>
    #                pilot@thearenahub.co.uk
    old_pilot_outline = (
        '<a href="mailto:pilot@thearenahub.co.uk?subject=2026 Pilot Programme — Early Interest"\n'
        '               class="btn btn-outline">\n'
        '                <i class="fas fa-envelope" aria-hidden="true"></i>\n'
        '                pilot@thearenahub.co.uk\n'
        '            </a>'
    )
    new_pilot_outline = (
        '<a href="mailto:pilot@thearenahub.co.uk?subject=2026 Pilot Programme — Early Interest"\n'
        '               class="btn btn-outline" data-config-href-email-key="email_pilot">\n'
        '                <i class="fas fa-envelope" aria-hidden="true"></i>\n'
        '                <span data-config="email_pilot">pilot@thearenahub.co.uk</span>\n'
        '            </a>'
    )

    old_pilot_gold = (
        '<a href="mailto:pilot@thearenahub.co.uk?subject=2026 Pilot Programme — Early Interest"\n'
        '               class="btn btn-gold btn-sm">'
    )
    new_pilot_gold = (
        '<a href="mailto:pilot@thearenahub.co.uk?subject=2026 Pilot Programme — Early Interest"\n'
        '               class="btn btn-gold btn-sm" data-config-href-email-key="email_pilot">'
    )

    for old, new in [(old_pilot_outline, new_pilot_outline), (old_pilot_gold, new_pilot_gold)]:
        if old in content:
            content = content.replace(old, new)
            changed = True
            print(f"  OK   [pricing.html]: pilot email link")
        else:
            print(f"  WARN [pricing.html]: pilot pattern not found (check indentation)")

    # sales email links with subject parameters (3 occurrences)
    # Replace href-email-key on each <a href="mailto:sales@...?subject=...">
    sales_re = re.compile(
        r'(<a href="mailto:sales@thearenahub\.co\.uk\?subject=[^"]*")',
        re.DOTALL
    )
    def sales_replace(m):
        tag = m.group(1)
        if 'data-config-href-email-key' in tag:
            return tag
        return tag.rstrip('"') + '" data-config-href-email-key="email_sales"'
    new_content, n = sales_re.subn(sales_replace, content)
    if n:
        content = new_content
        changed = True
        print(f"  OK   [pricing.html]: {n}x sales@ parameterized mailto")

    # sovereign_network email links with subject parameters (2 occurrences)
    scn_re = re.compile(
        r'(<a href="mailto:sovereign_network@thearenahub\.co\.uk\?subject=[^"]*")',
        re.DOTALL
    )
    def scn_replace(m):
        tag = m.group(1)
        if 'data-config-href-email-key' in tag:
            return tag
        return tag.rstrip('"') + '" data-config-href-email-key="email_scn"'
    new_content, n = scn_re.subn(scn_replace, content)
    if n:
        content = new_content
        changed = True
        print(f"  OK   [pricing.html]: {n}x sovereign_network@ parameterized mailto")

    # Plain sales@ link (no subject) — line 957/980
    content = content.replace(
        '<a href="mailto:sales@thearenahub.co.uk?subject=Infrastructure Enquiry" class="btn btn-gold">',
        '<a href="mailto:sales@thearenahub.co.uk?subject=Infrastructure Enquiry" class="btn btn-gold" data-config-href-email-key="email_sales">'
    )
    content = content.replace(
        '<a href="mailto:sales@thearenahub.co.uk">Contact</a>',
        '<a href="mailto:sales@thearenahub.co.uk" data-config-href-prefix="mailto:" data-config-href-key="email_sales">Contact</a>'
    )

    # Company number + DUNS in pricing footer/legal block
    content = content.replace(
        'CH#1708605 &mdash; All rights reserved.',
        'CH#<span data-config="company_number">1708605</span> &mdash; All rights reserved.'
    )

    if changed and not DRY_RUN:
        p.write_text(content, encoding='utf-8')
        print(f"  SAVED: pricing.html")


# ─── compliance.html ─────────────────────────────────────────────────────────
print("\n[compliance.html]")
# Note: lines 378 and 470 are inside JS template strings — only patch plain HTML context
patch(BASE / 'compliance.html', [

    # Plain HTML link in nav/header area (line 266)
    (
        '<a href="mailto:compliance@thearenahub.co.uk">Compliance Enquiries</a>',
        '<a href="mailto:compliance@thearenahub.co.uk" data-config-href-prefix="mailto:" data-config-href-key="email_compliance">Compliance Enquiries</a>'
    ),

    # Company/DUNS in legal footer block
    (
        'CH#1708605 &mdash; All rights reserved.',
        'CH#<span data-config="company_number">1708605</span> &mdash; All rights reserved.'
    ),
])
# Note: lines 378/470 are inside JS strings — patching those risks breaking JS.
# Leave them as static strings; they are error/fallback messages only.


# ─── platform.html ───────────────────────────────────────────────────────────
print("\n[platform.html]")
patch(BASE / 'platform.html', [

    # Plain HTML context (line 618)
    (
        '<a href="mailto:support@thearenahub.co.uk">contact support</a>',
        '<a href="mailto:support@thearenahub.co.uk" data-config-href-prefix="mailto:" data-config-href-key="email_support">contact support</a>'
    ),

    # Line 962 is inside a JS string — leave static to avoid breaking JS
])


print("\n=== PATCH COMPLETE ===")
print("Verify by opening each HTML file and checking data-config attributes are present.")
print("Then open site in browser — elements should populate from arena-config.js.")
print("\nNext step: Deploy ARENA_SITE_CONFIG.gs → get /exec URL → update arena-config.js")

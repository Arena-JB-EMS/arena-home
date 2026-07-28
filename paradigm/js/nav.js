/* ============================================================
   File:    nav.js
   Project: The Arena Hub Paradigm
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Single source of truth for the sidebar nav + breadcrumb on every
   Paradigm/Observatory/Forum page. Each page sets window.PARADIGM_PAGE
   before loading this script:

     window.PARADIGM_PAGE = {
       base: '',            // '' at /paradigm/, '../' one level down
       id: 'library',        // must match an entry in NAV_ITEMS below
       breadcrumb: [
         { label: 'Paradigm', href: 'index.html' },
         { label: 'Research Library' }   // no href = current page
       ]
     };

   Adding a new page = add one row to NAV_ITEMS. Nothing else to touch.
   ============================================================ */

(function () {
  var ICONS = {
    home:        '<path d="M3 10.5 10 4l7 6.5M5 9v7h4v-4h2v4h4V9" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    library:     '<path d="M4 4h4v13H4zM9 4h4v13H9zM14.5 5l3 12-3.8 1L10.7 6z" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linejoin="round"/>',
    shield:      '<path d="M10 3l6 2.2v5c0 4-2.6 6.6-6 7.8-3.4-1.2-6-3.8-6-7.8v-5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',
    search:      '<circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M17 17l-3.8-3.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    chat:        '<path d="M3 5h14v9H8l-4 3v-3H3z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
    question:    '<circle cx="10" cy="10" r="7.2" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M7.8 8a2.2 2.2 0 1 1 3.1 2c-.7.5-1 .9-1 1.7" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="10" cy="14.3" r="0.9" fill="currentColor"/>',
    observatory: '<circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    map:         '<circle cx="5.5" cy="6" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="14.5" cy="6" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="10" cy="14.5" r="2" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M7.2 7.2l1.8 5.5M12.8 7.2l-1.8 5.5M7.5 6h5" stroke="currentColor" stroke-width="1.2"/>',
    trail:       '<path d="M4 16c3-6 9-8 12-13" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="0.5 3.2"/><circle cx="4.5" cy="15" r="1.3" fill="currentColor"/><circle cx="16" cy="3.5" r="1.3" fill="currentColor"/>',
    users:       '<circle cx="7" cy="7" r="2.6" stroke="currentColor" stroke-width="1.4" fill="none"/><circle cx="14" cy="8" r="2.1" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M2.6 16c.6-2.8 2.3-4.3 4.4-4.3s3.8 1.5 4.4 4.3M12 16c.4-2 1.7-3.4 3.4-3.4 1.5 0 2.7 1 3.2 2.7" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/>',
    info:        '<circle cx="10" cy="10" r="7.2" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="9.3" y="8.6" width="1.4" height="5" rx="0.7" fill="currentColor"/><circle cx="10" cy="6.3" r="1" fill="currentColor"/>',
    back:        '<path d="M12 4L6 10l6 6" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  };

  function icon(name) {
    return '<svg class="ic" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' + (ICONS[name] || '') + '</svg>';
  }

  var NAV_ITEMS = [
    { group: null },
    { id: 'home',          label: 'Home',               href: 'index.html',            ic: 'home' },
    { group: 'Paradigm' },
    { id: 'library',       label: 'Research Library',    href: 'library.html',          ic: 'library' },
    { id: 'policy',        label: 'Policy Watch',        href: 'policy.html',           ic: 'shield' },
    { id: 'explore',       label: 'Explore a Question',  href: 'explore.html',          ic: 'search' },
    { id: 'conversations', label: 'Conversations',       href: 'conversations.html',    ic: 'chat' },
    { id: 'questions',     label: 'Emerging Questions',  href: 'questions.html',        ic: 'question' },
    { group: 'Live intelligence' },
    { id: 'observatory',   label: 'Observatory',         href: 'observatory/index.html', ic: 'observatory', badge: 'LIVE' },
    { id: 'knowledge-map', label: 'Knowledge Map',       href: 'knowledge-map.html',     ic: 'map' },
    { id: 'evidence-trail',label: 'Evidence Trail',      href: 'evidence-trail.html',    ic: 'trail' },
    { group: 'Community' },
    { id: 'forum',         label: 'Forum',               href: 'forum/index.html',       ic: 'users' },
    { id: 'about',         label: 'About Paradigm',      href: 'about.html',             ic: 'info' },
    { id: 'trust-centre',  label: 'Trust Centre',        href: 'trust-centre.html',      ic: 'info' }
  ];

  function buildSidebar(page) {
    var base = page.base || '';
    var html = '';
    html += '<div class="sidebar-brand"><a href="' + base + 'index.html">' +
      '<span class="mark">A</span>' +
      '<span class="name">The Arena Hub<span>Paradigm</span></span>' +
      '</a></div>';
    html += '<div class="sidebar-back">' + icon('back') +
      ' <a href="' + base + '../index.html">Back to Arena Hub</a></div>';
    html += '<nav class="sidebar-nav" aria-label="Paradigm sections">';
    NAV_ITEMS.forEach(function (item) {
      if (item.group !== undefined) {
        html += item.group ? '<div class="group-label">' + item.group + '</div>' : '';
        return;
      }
      var isCurrent = item.id === page.id;
      html += '<a href="' + base + item.href + '"' + (isCurrent ? ' class="current" aria-current="page"' : '') + '>' +
        icon(item.ic) + '<span>' + item.label + '</span>' +
        (item.badge ? '<span class="badge">' + item.badge + '</span>' : '') +
        '</a>';
    });
    html += '</nav>';
    html += '<div class="sidebar-foot">Education thrives when evidence is shared, ideas are challenged and understanding evolves together. Paradigm exists to encourage that progress.</div>';
    return html;
  }

  function buildBreadcrumb(trail) {
    if (!trail || !trail.length) return '';
    var parts = trail.map(function (t, i) {
      var isLast = i === trail.length - 1;
      if (isLast || !t.href) {
        return '<span class="current">' + t.label + '</span>';
      }
      return '<a href="' + t.href + '">' + t.label + '</a>';
    });
    return parts.join('<span class="sep">/</span>');
  }

  /* Paradigm Principles — injected before every page's .site-footer,
     site-wide, from this one place, per the Paradigm credibility
     review (Jon, S143 continued, Phase 12). No per-page HTML edits
     needed; new pages get this automatically as long as they load
     nav.js and have a .site-footer element. */
  function buildPrinciples() {
    return (
      '<div class="paradigm-principles" style="max-width:1140px;margin:0 auto;padding:18px 32px;border-top:1px solid var(--border,#E0E4EB);">' +
        '<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:var(--navy-mid,#3D5166);font-weight:700;margin-bottom:8px;">Paradigm Principles</div>' +
        '<ul style="margin:0;padding-left:18px;font-size:12px;color:var(--ink-soft,#6B7280);line-height:1.8;">' +
          '<li>Official guidance always remains authoritative.</li>' +
          '<li>Arena papers are discussion documents intended to encourage evidence-based professional debate.</li>' +
          '<li>Professional disagreement is welcomed.</li>' +
          '<li>Policy interpretation should always be verified against the originating authority.</li>' +
        '</ul>' +
      '</div>'
    );
  }

  function injectPrinciples() {
    var footer = document.querySelector('.site-footer');
    if (!footer || document.querySelector('.paradigm-principles')) return;
    footer.insertAdjacentHTML('beforebegin', buildPrinciples());
  }

  /* Site-wide "last updated" + platform version chip — injected after
     the breadcrumb on every page, RC1 Phase 11 (Jon, 2026-07-28).
     LAST_UPDATED is a per-page-id map of real file-modification dates
     (checked against the live filesystem at time of writing, not
     guessed) — update the relevant entry whenever a page is next
     substantively edited. PLATFORM_VERSION is the whole-Paradigm
     release marker, separate from each paper's own VERSION field. */
  var PLATFORM_VERSION = 'Paradigm RC1';
  var LAST_UPDATED = {
    'home': '2026-07-28', 'library': '2026-07-28', 'policy': '2026-07-28',
    'explore': '2026-07-24', 'conversations': '2026-07-28', 'questions': '2026-07-28',
    'observatory': '2026-07-28', 'knowledge-map': '2026-07-24', 'evidence-trail': '2026-07-24',
    'forum': '2026-07-28', 'about': '2026-07-28', 'trust-centre': '2026-07-28',
    'editorial-standards': '2026-07-28', 'publication-methodology': '2026-07-28'
  };
  function formatMetaDate(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }
  function injectPageMeta(page) {
    var crumbMount = document.getElementById('paradigm-breadcrumb');
    if (!crumbMount || document.querySelector('.page-meta-chip')) return;
    var dateStr = formatMetaDate(LAST_UPDATED[page.id]);
    var bits = [];
    if (dateStr) bits.push('Last updated ' + dateStr);
    bits.push(PLATFORM_VERSION);
    var html = '<div class="page-meta-chip" style="font-size:11px;color:var(--ink-soft,#8A93A3);margin:2px 0 14px;letter-spacing:0.2px;">' + bits.join(' · ') + '</div>';
    crumbMount.insertAdjacentHTML('afterend', html);
  }

  function init() {
    var page = window.PARADIGM_PAGE || { id: '', base: '', breadcrumb: [] };
    var sideMount = document.getElementById('paradigm-sidebar');
    if (sideMount) sideMount.innerHTML = buildSidebar(page);

    var crumbMount = document.getElementById('paradigm-breadcrumb');
    if (crumbMount) crumbMount.innerHTML = buildBreadcrumb(page.breadcrumb);

    injectPrinciples();
    injectPageMeta(page);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ============================================================
   File:    cards.js
   Project: The Arena Hub Paradigm
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Shared card renderers. One function per content type, used by
   every page that lists papers/questions/conversations/regulations
   so a visual change to a card only needs to happen here.
   ============================================================ */

window.ParadigmCards = (function () {

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function tagList(tagsField, limit) {
    var tags = String(tagsField || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    if (limit) tags = tags.slice(0, limit);
    return tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
  }

  function formatDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    if (isNaN(dt.getTime())) return esc(d);
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  var IMPACT_PILL = {
    'Critical':    'red',
    'Significant': 'orange',
    'Operational': 'amber',
    'Low':         'blue'
  };

  var STATUS_PILL = {
    'Active':       'green',
    'Reform':       'amber',
    'Consultation': 'blue',
    'Upcoming':     'blue',
    'Delayed':      'orange',
    'Superseded':   'red'
  };

  function paperCard(p, base) {
    base = base || '';
    var metaBits = [];
    if (p.AUTHOR) metaBits.push(esc(p.AUTHOR));
    metaBits.push(formatDate(p.DATE_PUBLISHED));
    if (p.READING_TIME_MIN) metaBits.push(esc(p.READING_TIME_MIN) + ' min read');
    return (
      '<a class="card interactive paper-card" href="' + base + 'document.html?id=' + encodeURIComponent(p.PAPER_ID) + '" style="display:block;padding:20px;">' +
        '<span class="eyebrow">' + esc(p.TYPE || 'Paper') + '</span>' +
        '<h3 style="font-size:17px;margin-bottom:8px;">' + esc(p.TITLE) + '</h3>' +
        '<p style="color:var(--ink-mid);font-size:13.5px;margin-bottom:12px;">' + esc(p.SHORT_DESCRIPTION) + '</p>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">' + tagList(p.TAGS, 3) + '</div>' +
        '<div style="font-size:12px;color:var(--ink-soft);">' + metaBits.join(' &middot; ') + '</div>' +
      '</a>'
    );
  }

  function questionCard(q, base) {
    base = base || '';
    return (
      '<a class="card interactive question-card" href="' + base + 'questions.html#' + encodeURIComponent(q.QUESTION_ID) + '" style="display:block;padding:18px;">' +
        '<span class="pill amber"><span class="dot"></span>' + esc(q.STATUS || 'Emerging') + '</span>' +
        '<h3 style="font-size:15.5px;margin:10px 0 8px;">' + esc(q.QUESTION_TEXT) + '</h3>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">' + tagList(q.TAGS, 3) + '</div>' +
      '</a>'
    );
  }

  function conversationCard(c, base) {
    base = base || '';
    return (
      '<a class="card interactive conv-card" href="' + base + 'forum/topic.html?id=' + encodeURIComponent(c.CONV_ID) + '" style="display:block;padding:16px;">' +
        '<h3 style="font-size:14.5px;margin-bottom:6px;">' + esc(c.TITLE) + '</h3>' +
        '<div style="font-size:12px;color:var(--ink-soft);">' + esc(c.ACTIVITY_LEVEL || 'Low') + ' activity</div>' +
      '</a>'
    );
  }

  function regulationCard(r, base) {
    base = base || '';
    var impactPill = IMPACT_PILL[r.impactLevel] || 'blue';
    var statusPill = STATUS_PILL[r.status] || 'blue';
    return (
      '<a class="card interactive reg-card" href="' + base + 'policy.html?id=' + encodeURIComponent(r.id) + '" style="display:block;padding:18px;">' +
        '<div style="display:flex;gap:8px;margin-bottom:10px;">' +
          '<span class="pill ' + impactPill + '"><span class="dot"></span>' + esc(r.impactLevel || 'Operational') + '</span>' +
          '<span class="pill ' + statusPill + '">' + esc(r.status || 'Active') + '</span>' +
        '</div>' +
        '<h3 style="font-size:15.5px;margin-bottom:6px;">' + esc(r.title) + '</h3>' +
        '<div style="font-size:12.5px;color:var(--ink-soft);margin-bottom:8px;">' + esc(r.sourceLabel) + ' &middot; ' + formatDate(r.statusDate) + '</div>' +
        '<p style="font-size:13px;color:var(--ink-mid);">' + esc(r.summary) + '</p>' +
      '</a>'
    );
  }

  /* ── Loading state helpers (RC1, 2026-07-28) ──────────────────
     The underlying GAS Web Apps have a genuine cold-start delay on
     first hit — repeatedly observed at several seconds this session.
     Every page that fetches before rendering must show SOMETHING
     immediately, or a first-time visitor sees an empty page and
     reasonably concludes there's no content. loadingSkeleton() fills
     a container with placeholder cards straight away; withTimeout()
     wraps the fetch so that if it's still pending after ~9s, the
     container shows an honest "taking longer than usual" message
     with a manual retry link instead of hanging silently forever. */
  function loadingSkeleton(n, label) {
    var card = '<div class="card" style="padding:18px;opacity:0.55;">' +
      '<div style="height:10px;width:40%;background:var(--border);border-radius:3px;margin-bottom:10px;"></div>' +
      '<div style="height:14px;width:85%;background:var(--border);border-radius:3px;margin-bottom:8px;"></div>' +
      '<div style="height:10px;width:60%;background:var(--border);border-radius:3px;"></div>' +
      '</div>';
    var items = new Array(n || 3).fill(card).join('');
    return '<div style="grid-column:1/-1;font-size:12px;color:var(--ink-soft);margin-bottom:10px;">' + esc(label || 'Loading…') + '</div>' + items;
  }

  function withTimeout(promise, el, opts) {
    opts = opts || {};
    var ms = opts.ms || 9000;
    var reloadLabel = opts.reloadLabel || 'Reload this page';
    var timedOut = false;
    var timer = setTimeout(function () {
      timedOut = true;
      if (el) {
        el.innerHTML = '<div style="grid-column:1/-1;padding:16px 0;font-size:13px;color:var(--ink-soft);">' +
          'This is taking longer than usual to load — the underlying data source may be starting up. ' +
          '<a href="javascript:location.reload()">' + esc(reloadLabel) + '</a>.</div>';
      }
    }, ms);
    return promise.then(function (result) {
      clearTimeout(timer);
      return { result: result, timedOut: timedOut };
    }, function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  return {
    esc: esc,
    tagList: tagList,
    formatDate: formatDate,
    IMPACT_PILL: IMPACT_PILL,
    STATUS_PILL: STATUS_PILL,
    paperCard: paperCard,
    questionCard: questionCard,
    conversationCard: conversationCard,
    regulationCard: regulationCard,
    loadingSkeleton: loadingSkeleton,
    withTimeout: withTimeout
  };
})();

/* ============================================================
   File:    forum-inert.js
   Project: The Arena Hub Paradigm — Forum
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Renders a real-looking form (Submit a Question / Suggest a Paper /
   Feedback / Request Clarification) with NO live submission endpoint,
   per Stage 3 Q4 of ARENA_PARADIGM_ARCHITECTURAL_REVIEW.md — Jon was
   explicit that community submissions must stay visibly inert until a
   moderated, sovereignty-reviewed capture path exists. Do not wire
   this to a real endpoint without that design work happening first
   and a fresh decision recorded in the review doc.
   ============================================================ */

window.ParadigmForumInert = (function () {
  function render(mountEl, opts) {
    opts = opts || {};
    var fields = opts.fields || [
      { label: 'Your question or suggestion', type: 'textarea', placeholder: 'Type here…' },
      { label: 'Topic area', type: 'select', options: opts.topicOptions || [] },
      { label: 'Email (optional — only if you\'d like a reply)', type: 'input' }
    ];

    var html = '<div class="inert-form"><form id="inert-form-el">';
    fields.forEach(function (f, i) {
      html += '<div class="field"><label for="inert-f' + i + '">' + f.label + '</label>';
      if (f.type === 'textarea') {
        html += '<textarea id="inert-f' + i + '" disabled placeholder="' + (f.placeholder || '') + '"></textarea>';
      } else if (f.type === 'select') {
        html += '<select id="inert-f' + i + '" disabled><option>Choose a topic…</option>' +
          f.options.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
      } else {
        html += '<input id="inert-f' + i + '" type="text" disabled placeholder="' + (f.placeholder || '') + '">';
      }
      html += '</div>';
    });
    html += '<button type="submit" class="btn btn-primary disabled" disabled>' + (opts.submitLabel || 'Submit') + '</button>';
    html += '<div class="inert-note" style="margin-top:12px;">Community submissions are not yet open. This is a preview of how it will work once moderation is in place — nothing typed here is sent anywhere.</div>';
    html += '</form></div>';

    mountEl.innerHTML = html;
  }
  return { render: render };
})();

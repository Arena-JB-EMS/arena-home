/* ============================================================
   File:    search.js
   Project: The Arena Hub Paradigm
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Drives explore.html. Reads the fixed response contract from
   ParadigmData.exploreQuestion() (data-loader.js) and renders it —
   this file never touches a data source directly, so swapping the
   contract's internals (e.g. to a future RAG/AI endpoint) never
   requires a change here.
   ============================================================ */

(function () {
  var TRY_PROMPTS = ['KCSIE 2026 changes', 'AI in education', 'Information sharing & GDPR', 'Alternative Provision', 'Evidence retention', 'Deepfakes', 'SEND reform', 'Data sovereignty', 'Inspection'];
  var tryWrap = document.getElementById('try-prompts');
  TRY_PROMPTS.forEach(function (p) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = p;
    b.onclick = function () { document.getElementById('explore-input').value = p; runSearch(p); };
    tryWrap.appendChild(b);
  });

  function esc(s) { return ParadigmCards.esc(s); }

  function itemList(items, mapFn, emptyText) {
    if (!items || !items.length) return '<p class="empty">' + emptyText + '</p>';
    return items.map(mapFn).join('');
  }

  function renderResults(result) {
    document.getElementById('explore-results').style.display = 'block';
    document.getElementById('query-echo').textContent = '"' + result.query + '"';

    document.getElementById('col-official').innerHTML = itemList(result.official_sources, function (r) {
      return '<div class="result-item"><a href="policy.html?id=' + encodeURIComponent(r.id) + '">' + esc(r.title) + '</a><div style="color:var(--ink-soft);font-size:11.5px;margin-top:3px;">' + esc(r.sourceLabel) + '</div></div>';
    }, 'No matching official sources yet.');

    document.getElementById('col-commentary').innerHTML = itemList(result.arena_commentary, function (c) {
      return '<div class="result-item">' + esc(c.text) + '</div>';
    }, 'No Arena commentary written for this yet.');

    document.getElementById('col-papers').innerHTML = itemList(result.related_papers, function (p) {
      return '<div class="result-item"><a href="document.html?id=' + encodeURIComponent(p.PAPER_ID) + '">' + esc(p.TITLE) + '</a></div>';
    }, 'No related papers yet.');

    document.getElementById('col-discussion').innerHTML =
      '<p class="empty">Professional discussion will open shortly.</p><div class="inert-note">See <a href="forum/index.html">Forum</a> for related opening discussions in the meantime.</div>';

    document.getElementById('col-questions').innerHTML = itemList(result.related_questions, function (q) {
      return '<div class="result-item"><a href="questions.html#' + encodeURIComponent(q.QUESTION_ID) + '">' + esc(q.QUESTION_TEXT) + '</a></div>';
    }, 'No related open questions yet.');

    document.getElementById('col-further').innerHTML = itemList(result.further_reading, function (p) {
      return '<div class="result-item"><a href="document.html?id=' + encodeURIComponent(p.PAPER_ID) + '">' + esc(p.TITLE) + '</a></div>';
    }, 'Nothing further linked yet.');
  }

  function runSearch(q) {
    if (!q) return;
    ParadigmData.exploreQuestion(q).then(renderResults);
  }

  document.getElementById('explore-go').addEventListener('click', function () {
    runSearch(document.getElementById('explore-input').value.trim());
  });
  document.getElementById('explore-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') runSearch(e.target.value.trim());
  });

  var qParam = new URLSearchParams(window.location.search).get('q');
  if (qParam) {
    document.getElementById('explore-input').value = qParam;
    runSearch(qParam);
  }
})();

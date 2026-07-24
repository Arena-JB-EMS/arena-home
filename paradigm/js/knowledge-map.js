/* ============================================================
   File:    knowledge-map.js
   Project: The Arena Hub Paradigm
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Dependency-free SVG relationship diagram. Nodes are laid out
   evenly on a circle (no physics/force layout — deliberately simple
   so it stays legible and keyboard-navigable). Reads TOPICS +
   KNOWLEDGE_LINKS from ParadigmData; adding a new topic or link is
   a Sheet row, never a code change.
   ============================================================ */

(function () {
  var esc = ParadigmCards.esc;
  var svg = document.getElementById('km-svg');
  var W = 640, H = 520, CX = W / 2, CY = H / 2 - 10, R = 190;
  var NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  Promise.all([ParadigmData.getTopics(), ParadigmData.getKnowledgeLinks(), ParadigmData.getPapers(), ParadigmData.getQuestions(), ParadigmData.getRegulations('PARADIGM')])
    .then(function (results) {
      var topics = results[0], links = results[1], papers = results[2], questions = results[3], regs = (results[4].regulations || []);
      var positions = {};
      var n = topics.length;

      topics.forEach(function (t, i) {
        var a = (Math.PI * 2 * i / n) - Math.PI / 2;
        positions[t.TOPIC_ID] = { x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R };
      });

      var edgeEls = [];
      links.forEach(function (link) {
        var a = positions[link.TOPIC_ID_A], b = positions[link.TOPIC_ID_B];
        if (!a || !b) return;
        var line = el('line', { class: 'km-edge', x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'data-a': link.TOPIC_ID_A, 'data-b': link.TOPIC_ID_B });
        svg.appendChild(line);
        edgeEls.push(line);
      });

      var nodeEls = {};
      topics.forEach(function (t) {
        var p = positions[t.TOPIC_ID];
        var g = el('g', { class: 'km-node', tabindex: '0', role: 'button', 'aria-label': t.LABEL });
        g.appendChild(el('circle', { cx: p.x, cy: p.y, r: 26 }));
        var text = el('text', { x: p.x, y: p.y + 3, 'text-anchor': 'middle' });
        text.textContent = t.LABEL.length > 12 ? t.LABEL.slice(0, 11) + '…' : t.LABEL;
        g.appendChild(text);
        g.addEventListener('click', function () { selectTopic(t); });
        g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectTopic(t); } });
        svg.appendChild(g);
        nodeEls[t.TOPIC_ID] = g;
      });

      function selectTopic(topic) {
        Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.toggle('active', id === topic.TOPIC_ID); });
        edgeEls.forEach(function (line) {
          var connected = line.getAttribute('data-a') === topic.TOPIC_ID || line.getAttribute('data-b') === topic.TOPIC_ID;
          line.classList.toggle('active', connected);
        });

        var connectedIds = links.filter(function (l) { return l.TOPIC_ID_A === topic.TOPIC_ID || l.TOPIC_ID_B === topic.TOPIC_ID; })
          .map(function (l) { return l.TOPIC_ID_A === topic.TOPIC_ID ? l.TOPIC_ID_B : l.TOPIC_ID_A; });
        var connectedTopics = topics.filter(function (t) { return connectedIds.indexOf(t.TOPIC_ID) !== -1; });

        var paperCount = papers.filter(function (p) { return String(p.TAGS || '').indexOf(topic.TOPIC_ID) !== -1; }).length;
        var regCount = regs.filter(function (r) { return (r.topicTags || []).indexOf(topic.TOPIC_ID) !== -1; }).length;
        var qCount = questions.filter(function (q) { return String(q.TAGS || '').indexOf(topic.TOPIC_ID) !== -1; }).length;

        var side = document.getElementById('km-side');
        side.innerHTML =
          '<h3>' + esc(topic.LABEL) + '</h3>' +
          '<p style="font-size:12px;color:var(--ink-soft);margin-bottom:10px;">' + paperCount + ' paper(s) &middot; ' + regCount + ' guidance item(s) &middot; ' + qCount + ' open question(s)</p>' +
          '<a class="btn btn-ghost" style="width:100%;justify-content:center;margin-bottom:12px;" href="evidence-trail.html">View full Evidence Trail →</a>' +
          '<div>' + (connectedTopics.length
            ? connectedTopics.map(function (t) { return '<div class="link-item">' + esc(t.LABEL) + '</div>'; }).join('')
            : '<p style="font-size:12px;color:var(--ink-soft);">No connections mapped yet.</p>') + '</div>';
      }

      if (topics[0]) selectTopic(topics[0]);
    });
})();

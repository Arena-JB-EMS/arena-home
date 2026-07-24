/* ============================================================
   File:    radar.js
   Project: The Arena Hub Paradigm
   Version: 1.0.0
   Sync:    2026-07-24
   Owner:   The Arena Hub Ltd · Jonathan Baguley
   ============================================================
   Dependency-free canvas radar/spider chart. Used by the Paradigm
   hub strip (small) and the Observatory dashboard (large). Activity
   levels are placeholder until the future monitoring engine (see
   ARENA_PARADIGM_ARCHITECTURAL_REVIEW.md Stage 4a-equivalent —
   Observatory's own "Future Monitoring Engine" section) computes
   them for real; this function only ever draws whatever [label, 0-1]
   pairs it is given.
   ============================================================ */

window.ParadigmRadar = (function () {
  function draw(canvasId, data, opts) {
    opts = opts || {};
    var c = document.getElementById(canvasId);
    if (!c) return;

    // Screen-reader / no-canvas fallback: an equivalent text summary,
    // since the chart itself conveys the same information visually.
    var levelWord = function (v) { return v >= 0.66 ? 'high activity' : (v >= 0.33 ? 'medium activity' : 'low activity'); };
    var summary = data.map(function (d) { return d[0] + ': ' + levelWord(d[1]); }).join(', ');
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', (opts.chartLabel || 'Activity levels by topic') + ' — ' + summary);
    var existingSr = c.parentNode.querySelector('.radar-sr-fallback[data-for="' + canvasId + '"]');
    if (!existingSr) {
      var sr = document.createElement('p');
      sr.className = 'sr-only radar-sr-fallback';
      sr.setAttribute('data-for', canvasId);
      c.parentNode.insertBefore(sr, c.nextSibling);
      existingSr = sr;
    }
    existingSr.textContent = summary;

    var ctx = c.getContext('2d');
    var cx = c.width / 2, cy = c.height / 2;
    var r = opts.radius || (Math.min(c.width, c.height) / 2 - (opts.labelPad || 46));
    var n = data.length;
    var rings = opts.rings || 3;
    var labelColor = opts.labelColor || '#4A5568';
    var gridColor = opts.gridColor || '#E3E6EC';
    var fillColor = opts.fillColor || 'rgba(197,160,89,0.35)';
    var strokeColor = opts.strokeColor || '#C5A059';

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = gridColor;
    for (var ring = 1; ring <= rings; ring++) {
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var a = (Math.PI * 2 * i / n) - Math.PI / 2;
        var rr = r * ring / rings;
        var x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // spokes
    ctx.strokeStyle = gridColor;
    data.forEach(function (d, i) {
      var a = (Math.PI * 2 * i / n) - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.stroke();
    });

    ctx.beginPath();
    data.forEach(function (d, i) {
      var a = (Math.PI * 2 * i / n) - Math.PI / 2;
      var x = cx + Math.cos(a) * r * d[1], y = cy + Math.sin(a) * r * d[1];
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor; ctx.fill();
    ctx.strokeStyle = strokeColor; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = labelColor;
    ctx.font = (opts.font || '10px "Source Sans 3", sans-serif');
    data.forEach(function (d, i) {
      var a = (Math.PI * 2 * i / n) - Math.PI / 2;
      var x = cx + Math.cos(a) * (r + 16), y = cy + Math.sin(a) * (r + 16);
      ctx.textAlign = Math.cos(a) > 0.3 ? 'left' : (Math.cos(a) < -0.3 ? 'right' : 'center');
      ctx.fillText(d[0], x, y);
    });
  }
  return { draw: draw };
})();

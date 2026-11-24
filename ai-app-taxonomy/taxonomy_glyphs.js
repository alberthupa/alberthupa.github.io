/* Shared drawing code: each C topology is its own wireframe, each A value has a small icon.
   Everything draws in currentColor. */
(function () {
  function f(n) { return Math.round(n * 100) / 100; }

  function head(tx, ty, ux, uy, s) {
    s = s || 3.6;
    var bx = tx - ux * s, by = ty - uy * s, w = s * 0.6;
    return '<polygon points="' + f(tx) + ',' + f(ty) + ' ' + f(bx - uy * w) + ',' + f(by + ux * w) + ' ' +
      f(bx + uy * w) + ',' + f(by - ux * w) + '" fill="currentColor" stroke="none"/>';
  }

  /* straight edge between two node centres, with a gap at each end */
  function ln(x1, y1, x2, y2, o) {
    o = o || {};
    var gs = o.gs == null ? 4.8 : o.gs, ge = o.ge == null ? 4.8 : o.ge, hs = o.hs || 3.6;
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    var ax = x1 + ux * gs, ay = y1 + uy * gs, tx = x2 - ux * ge, ty = y2 - uy * ge;
    var ex = o.head ? tx - ux * hs * 0.8 : tx, ey = o.head ? ty - uy * hs * 0.8 : ty;
    return '<line x1="' + f(ax) + '" y1="' + f(ay) + '" x2="' + f(ex) + '" y2="' + f(ey) + '"/>' +
      (o.head ? head(tx, ty, ux, uy, hs) : '');
  }

  /* cubic curve with an arrowhead at its end */
  function cv(p) {
    var dx = p[6] - p[4], dy = p[7] - p[5], L = Math.sqrt(dx * dx + dy * dy);
    return '<path d="M' + p[0] + ' ' + p[1] + ' C' + p[2] + ' ' + p[3] + ',' + p[4] + ' ' + p[5] + ',' +
      p[6] + ' ' + p[7] + '"/>' + head(p[6], p[7], dx / L, dy / L, 3.6);
  }

  var HOLLOW = 'fill="var(--glyph-hollow,#fff)"';
  function nd(x, y, hollow) {
    return '<circle cx="' + x + '" cy="' + y + '" r="3.4" ' + (hollow ? HOLLOW : 'fill="currentColor" stroke="none"') + '/>';
  }
  function sq(x, y, h, hollow) {
    return '<rect x="' + (x - h) + '" y="' + (y - h) + '" width="' + 2 * h + '" height="' + 2 * h + '" rx="1.2" ' +
      (hollow ? HOLLOW : 'fill="currentColor" stroke="none"') + '/>';
  }

  var C = {
    single: function () {
      return '<path d="M27.5 20.8 A9 9 0 1 1 36.5 20.8"/>' + head(36.5, 20.8, -0.867, 0.5, 3.6) + nd(32, 27.5);
    },
    loop: function () {
      return ln(11, 25, 35, 25, {head: true, ge: 8}) +
        '<path d="M35 18.5 l6.5 6.5 l-6.5 6.5 l-6.5 -6.5 z" ' + HOLLOW + '/>' +
        cv([35, 17.5, 35, 3, 11, 3, 11, 20.4]) +
        ln(35, 25, 54, 25, {head: true, gs: 8, ge: 4}) +
        '<path d="M53 25.5 l2.6 3 l5 -7.5"/>' + nd(11, 25);
    },
    sequential: function () {
      var xs = [6, 23.3, 40.6, 58], s = '';
      for (var i = 0; i < 3; i++) s += ln(xs[i], 20, xs[i + 1], 20, {head: true, gs: 5.6, ge: 5.2, hs: 3.2});
      for (var j = 0; j < 4; j++) s += sq(xs[j], 20, 3.7);
      return s;
    },
    review: function () {
      return cv([19.5, 16.6, 26, 7, 38, 7, 44.6, 16.4]) + cv([44.5, 23.4, 38, 33, 26, 33, 19.4, 23.6]) +
        nd(16, 20) + nd(48, 20, true);
    },
    coordinator: function () {
      return ln(10, 20, 54, 6, {head: true}) + ln(10, 20, 54, 20, {head: true}) + ln(10, 20, 54, 34, {head: true}) +
        nd(10, 20) + nd(54, 6, true) + nd(54, 20, true) + nd(54, 34, true);
    },
    parallel: function () {
      var s = '';
      [6, 20, 34].forEach(function (y) {
        s += ln(7, 20, 32, y, {head: true, hs: 3.2}) + ln(32, y, 57, 20, {head: true, hs: 3.2});
      });
      return s + nd(7, 20) + nd(32, 6, true) + nd(32, 20, true) + nd(32, 34, true) + nd(57, 20);
    },
    hierarchy: function () {
      return ln(32, 5, 18, 20) + ln(32, 5, 46, 20) + ln(18, 20, 9, 35) + ln(18, 20, 27, 35) +
        ln(46, 20, 37, 35) + ln(46, 20, 55, 35) +
        nd(32, 5) + nd(18, 20) + nd(46, 20) + nd(9, 35, true) + nd(27, 35, true) + nd(37, 35, true) + nd(55, 35, true);
    },
    handoff: function () {
      return ln(9, 20, 32, 20, {head: true}) + ln(32, 20, 55, 20, {head: true}) +
        nd(9, 20, true) + nd(32, 20, true) + nd(55, 20);
    },
    swarm: function () {
      var p = [[16, 6], [48, 6], [16, 34], [48, 34]], s = '';
      for (var i = 0; i < 4; i++) for (var j = i + 1; j < 4; j++) s += ln(p[i][0], p[i][1], p[j][0], p[j][1]);
      for (var k = 0; k < 4; k++) s += nd(p[k][0], p[k][1]);
      return s;
    },
    groupchat: function () {
      var p = [[9, 6], [55, 6], [9, 34], [55, 34]], s = '';
      for (var i = 0; i < 4; i++) s += ln(p[i][0], p[i][1], 32, 20, {ge: 9});
      for (var k = 0; k < 4; k++) s += nd(p[k][0], p[k][1]);
      return s + '<rect x="25.5" y="13.5" width="13" height="13" rx="1.6" ' + HOLLOW + '/>';
    }
  };

  var A = {
    human: '<path d="M5 3 L5 16 L8.6 12.6 L11 17.5 L13 16.6 L10.7 11.8 L15.5 11.6 Z"/>',
    session: '<rect x="3" y="3" width="14" height="14" rx="2"/><path d="M6 7.5h8M6 10.5h8M6 13.5h5"/>',
    corpus: (function () {
      var s = '';
      [3.5, 8.5, 13.5].forEach(function (y) {
        [3.5, 8.5, 13.5].forEach(function (x) { s += '<rect x="' + x + '" y="' + y + '" width="3" height="3" rx=".6"/>'; });
      });
      return s;
    })(),
    event: '<rect x="2.5" y="4.8" width="15" height="10.6" rx="1.6"/><path d="M3.2 6 L10 11.4 L16.8 6"/>',
    'case': '<rect x="3" y="3" width="14" height="14" rx="2"/><path d="M6.4 10.2 l2.5 2.6 l4.7 -5.3"/>',
    identity: '<circle cx="10" cy="10" r="7" stroke-dasharray="2.6 2.2"/><circle cx="10" cy="10" r="2.4" fill="currentColor" stroke="none"/>',
    weights: '<ellipse cx="10" cy="10" rx="4.6" ry="7"/><path d="M5.6 10h8.8"/>'
  };

  /* ---- anatomy: where the LLM sits inside each unit of work (120×56) ----
     The model is always the same filled disc (--model). Code is outlined boxes. */
  var MODEL = 'fill="var(--model,#B04A2E)" stroke="none"';
  function llm(x, y, r, label) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" ' + MODEL + '/>' +
      (label ? '<text x="' + x + '" y="' + y + '" text-anchor="middle" dominant-baseline="central" font-size="' + f(r * 0.68) +
        '" font-weight="800" fill="#fff" stroke="none" font-family="Inter,Arial,sans-serif">LLM</text>' : '');
  }
  function box(x, y, h) {
    return '<rect x="' + (x - h) + '" y="' + (y - h) + '" width="' + 2 * h + '" height="' + 2 * h + '" rx="2" ' + HOLLOW + '/>';
  }
  function seg(x1, y1, x2, y2, hd) { return ln(x1, y1, x2, y2, {gs: 0, ge: 0, head: hd}); }
  function ring(cx, cy) {
    return '<path d="M' + f(cx - 13.9) + ' ' + (cy - 8) + ' A16 16 0 0 1 ' + f(cx + 13.9) + ' ' + (cy - 8) + '"/>' +
      head(cx + 13.9, cy - 8, 0.5, 0.867, 4) +
      '<path d="M' + f(cx + 13.9) + ' ' + (cy + 8) + ' A16 16 0 0 1 ' + f(cx - 13.9) + ' ' + (cy + 8) + '"/>' +
      head(cx - 13.9, cy + 8, -0.5, -0.867, 4);
  }
  function loopCore(cy) {
    return seg(20, cy, 46, cy) + seg(74, cy, 100, cy) + box(13, cy, 6.5) + box(107, cy, 6.5) + ring(60, cy) + llm(60, cy, 11, true);
  }
  var U = {
    human: function () {
      return '<circle cx="36" cy="19" r="7" ' + HOLLOW + '/><path d="M22 44 a14 13 0 0 1 28 0" ' + HOLLOW + '/>' +
        seg(56, 23, 74, 23, true) + seg(74, 33, 56, 33, true) + llm(90, 28, 10, true);
    },
    session: function () { return loopCore(28); },
    identity: function () {
      var s = loopCore(21) + seg(60, 39, 60, 46, true) + '<path d="M22 50.5h76"/>';
      for (var x = 25; x <= 95; x += 10) s += '<rect x="' + (x - 2) + '" y="48.5" width="4" height="4" fill="currentColor" stroke="none"/>';
      return s;
    },
    'case': function () {
      var xs = [16, 45, 75, 104], s = '';
      for (var i = 0; i < 3; i++) s += seg(xs[i] + 9, 19, xs[i + 1] - 9, 19, true);
      for (var j = 0; j < 4; j++) s += '<path d="M' + xs[j] + ' 28v13" stroke-dasharray="2 2.4"/>' + box(xs[j], 19, 8.5);
      return s + llm(75, 19, 5.2) + '<rect x="6" y="41.5" width="108" height="8" rx="2.5" fill="currentColor" fill-opacity=".16"/>';
    },
    event: function () {
      return '<path d="M8 20h16M8 28h16M8 36h16"/>' + seg(30, 28, 46, 28, true) + box(60, 28, 12) + llm(60, 28, 6.5) +
        seg(74, 28, 90, 28, true) + '<path d="M97 28.5 l4 4.6 l8 -11"/>';
    },
    corpus: function () {
      var s = '';
      [13, 28, 43].forEach(function (y) {
        s += '<rect x="9" y="' + (y - 4) + '" width="20" height="8" rx="1.5" ' + HOLLOW + '/>' + seg(33, y, 52, y, true) +
          llm(60, y, 4.6) + seg(68, y, 87, y, true) + '<rect x="91" y="' + (y - 4) + '" width="20" height="8" rx="1.5" ' + HOLLOW + '/>';
      });
      return s;
    }
  };

  var SVG = ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  window.TAXONOMY_GLYPH = {
    /* topology wireframe, 64×40 */
    topology: function (id, w) {
      w = w || 64;
      return '<svg class="glyph" viewBox="0 0 64 40" width="' + w + '" height="' + f(w * 40 / 64) + '"' + SVG + (C[id] ? C[id]() : '') + '</svg>';
    },
    /* small unit-of-work icon, 20×20 */
    icon: function (id, size) {
      size = size || 20;
      return '<svg class="aicon" viewBox="0 0 20 20" width="' + size + '" height="' + size + '"' + SVG + (A[id] || '') + '</svg>';
    },
    /* where the LLM sits in this unit of work, 120×56 */
    anatomy: function (id, w) {
      w = w || 120;
      return '<svg class="anatomy" viewBox="0 0 120 56" width="' + w + '" height="' + f(w * 56 / 120) + '"' + SVG + (U[id] ? U[id]() : '') + '</svg>';
    }
  };
})();

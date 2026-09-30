/* MedOps i18n runtime — VI (nguồn) ⇄ EN.
   Nạp SAU các script ứng dụng. Dịch DOM trực tiếp nên không cần sửa từng màn.
   API: window.I18N.set('en'|'vi'), .t(str), .add({vi:en}), .missing() */
(function () {
  var LS = 'medops.lang';
  var VI_RE = /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụỳýỷỹỵĂÂĐÊÔƠƯÀÁẢÃẠẰẮẲẴẶẦẤẨẪẬÈÉẺẼẸỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌỒỐỔỖỘỜỚỞỠỢÙÚỦŨỤỪỨỬỮỰỲÝỶỸỴ]/;
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, PRE: 1, NOSCRIPT: 1, TEMPLATE: 1 };
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'data-tip'];
  var dict = Object.create(null);
  var missing = Object.create(null);
  var orig = new WeakMap();
  var lang = 'vi';
  var busy = false;

  /* Luật cho chuỗi động (số, ngày, tiền) — chạy khi tra từ điển trượt. */
  var RULES = [
    [/^(\d+(?:[.,]\d+)?)\s*ngày$/i, '$1 days'],
    [/^(\d+(?:[.,]\d+)?)\s*giờ$/i, '$1 h'],
    [/^(\d+(?:[.,]\d+)?)\s*phút$/i, '$1 min'],
    [/^(\d+(?:[.,]\d+)?)\s*giây$/i, '$1 s'],
    [/^(\d+(?:[.,]\d+)?)\s*tuần$/i, '$1 weeks'],
    [/^(\d+(?:[.,]\d+)?)\s*tháng$/i, '$1 months'],
    [/^(\d+)\s*hộp$/i, '$1 boxes'],
    [/^(\d+)\s*lọ$/i, '$1 bottles'],
    [/^(\d+)\s*vỉ$/i, '$1 blisters'],
    [/^(\d+)\s*viên$/i, '$1 tablets'],
    [/^(\d+)\s*ống$/i, '$1 ampoules'],
    [/^(\d+)\s*gói$/i, '$1 sachets'],
    [/^(\d+)\s*tuýp$/i, '$1 tubes'],
    [/^(\d+)\s*chai$/i, '$1 bottles'],
    [/^([\d.,]+)\s*(SKU|đơn|phiếu|dòng|mục|lô)(\.?)$/i,
      function (m, n, w, dot) {
        var PL = { 'sku': 'SKUs', 'đơn': 'orders', 'phiếu': 'tickets', 'dòng': 'lines', 'mục': 'items', 'lô': 'batches' };
        return num(n) + ' ' + (PL[w.toLowerCase()] || w) + dot;
      }],
    [/^([\d.,]+)\s*(điểm bán|nhà thuốc|nhà cung cấp|người dùng|thay đổi|kết quả|chi nhánh)(\.?)$/i,
      function (m, n, w, dot) {
        var PL = { 'điểm bán': 'stores', 'nhà thuốc': 'pharmacies', 'nhà cung cấp': 'suppliers', 'người dùng': 'users', 'thay đổi': 'changes', 'kết quả': 'results', 'chi nhánh': 'stores' };
        return num(n) + ' ' + (PL[w.toLowerCase()] || w) + dot;
      }],
    [/^([\d.,]+)\s*tr$/i, function (m, n) { return num(n) + 'M'; }],
    [/^([\d.,]+)\s*tỷ$/i, function (m, n) { return num(n) + 'B'; }],
    [/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/, function (m) { return num(m); }],
    [/^\d+,\d+$/, function (m) { return num(m); }],
    [/^Còn\s+(.+)$/i, function (m, r) { return 'Remaining ' + I18N.t(r); }],
    [/^Cách đây\s+(.+)$/i, function (m, r) { return I18N.t(r) + ' ago'; }],
    [/^(.+)\s+trước$/i, function (m, r) { return I18N.t(r) + ' ago'; }],
    [/^Thứ\s*(\d)/i, function (m, n) { return ['', '', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][+n] || m; }],
    [/^Chủ nhật$/i, 'Sunday'],
    [/^Ngày\s+(\d+)/i, 'Day $1']
  ];
  var PROPER = /Dược Vương|Dược Vương|Phúc Khang|Minh Châu|Thanh Thảo|An Khang|Nam Hà|Dược Hậu Giang|Đồng Nai|Hà Nội|Đà Nẵng|Cần Thơ|Việt Nam|Bình Thạnh|Tân Bình|Thủ Đức|Gò Vấp|Bình Tân/g;
  var SPLIT = /(\s*(?:·|\||\/|—|–|→|:|,|;|\(|\)|\[|\]|\u2022)\s*)/;

  function num(s) { return s.replace(/\./g, '\u0000').replace(/,/g, '.').replace(/\u0000/g, ','); }

  function lookupOne(s) {
    if (!s) return null;
    if (dict[s] != null) return dict[s];
    var lower = s.toLowerCase();
    for (var k in dict) { if (k.toLowerCase() === lower) return matchCase(s, dict[k]); }
    for (var i = 0; i < RULES.length; i++) {
      var m = s.match(RULES[i][0]);
      if (m) { var r = RULES[i][1]; return typeof r === 'function' ? r.apply(null, m) : s.replace(RULES[i][0], r); }
    }
    return null;
  }
  function matchCase(src, out) {
    if (src === src.toUpperCase() && /[A-ZĐ]/.test(src)) return out.toUpperCase();
    return out;
  }
  function translate(s) {
    if (!s) return s;
    var core = s.replace(/^[\s\u00a0]+|[\s\u00a0]+$/g, '');
    if (!core) return s;
    if (!VI_RE.test(core) && !dict[core] && !/\d/.test(core)) return s;
    var pre = s.slice(0, s.indexOf(core));
    var post = s.slice(s.indexOf(core) + core.length);
    var hit = lookupOne(core);
    if (hit == null) {
      /* thử tách theo dấu phân cách rồi ghép lại */
      var parts = core.split(SPLIT);
      if (parts.length > 1) {
        var any = false;
        var out = parts.map(function (p) {
          if (!p || SPLIT.test(p) && p.length <= 2) return p;
          var h = lookupOne(p.trim());
          if (h != null) { any = true; return p.replace(p.trim(), h); }
          return p;
        }).join('');
        if (any) hit = out;
      }
    }
    if (hit == null) { if (VI_RE.test(core)) missing[core] = (missing[core] || 0) + 1; return s; }
    if (VI_RE.test(String(hit).replace(PROPER, ''))) missing[core] = (missing[core] || 0) + 1;
    return pre + hit + post;
  }

  function walk(root) {
    var it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP_TAGS[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('[data-i18n-skip]')) return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [], n;
    while ((n = it.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      if (lang === 'en') {
        var src = orig.has(t) ? orig.get(t) : t.nodeValue;
        var out = translate(src);
        if (out !== t.nodeValue) { orig.set(t, src); t.nodeValue = out; }
      } else if (orig.has(t)) { t.nodeValue = orig.get(t); orig.delete(t); }
    });
    var els = root.querySelectorAll ? root.querySelectorAll('*') : [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.closest('[data-i18n-skip]')) continue;
      for (var a = 0; a < ATTRS.length; a++) {
        var name = ATTRS[a], v = el.getAttribute(name);
        if (!v) continue;
        var key = '@' + name;
        var store = el.__i18n || (el.__i18n = {});
        if (lang === 'en') {
          var s0 = key in store ? store[key] : v;
          var o = translate(s0);
          if (o !== v) { store[key] = s0; el.setAttribute(name, o); }
        } else if (key in store) { el.setAttribute(name, store[key]); delete store[key]; }
      }
    }
  }

  var tid = 0;
  function refresh() {
    busy = true;
    try { relocate(); walk(document.body); } catch (e) { I18N.lastError = String((e && e.stack) || e); }
    busy = false;
  }
  function schedule() { clearTimeout(tid); tid = setTimeout(refresh, 60); }

  var I18N = window.I18N = {
    get lang() { return lang; },
    add: function (obj) { for (var k in obj) dict[k] = obj[k]; schedule(); return I18N; },
    t: function (s) { return lang === 'en' ? translate(s) : s; },
    missing: function () {
      return Object.keys(missing).sort(function (a, b) { return missing[b] - missing[a]; })
        .map(function (k) { return [k, missing[k]]; });
    },
    set: function (l) {
      lang = l === 'en' ? 'en' : 'vi';
      try { localStorage.setItem(LS, lang); } catch (e) { }
      document.documentElement.lang = lang;
      if (lang === 'en') { if (!I18N._title) I18N._title = document.title; document.title = translate(I18N._title); }
      else if (I18N._title) document.title = I18N._title;
      refresh();
      paint();
      window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
    },
    toggle: function () { I18N.set(lang === 'en' ? 'vi' : 'en'); }
  };

  /* ---- Bộ chuyển ngôn ngữ (pill VI/EN, góc trên phải) ---- */
  var sw;
  function paint() {
    if (!sw) return;
    var b = sw.querySelectorAll('button');
    for (var i = 0; i < b.length; i++) {
      var on = b[i].dataset.lang === lang;
      b[i].style.background = on ? '#00533F' : 'transparent';
      b[i].style.color = on ? '#FFFFFF' : '#5A6B66';
      b[i].setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }
  function docked(on) {
    sw.style.cssText = (on ? 'position:relative;' : 'position:fixed;left:16px;bottom:16px;') + 'z-index:2147483000;display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:#FFFFFF;border:1px solid #E3E6E5;box-shadow:' + (on ? 'none' : '0 6px 18px rgba(0,51,40,.14)') + ';font-family:var(--font-body,"Public Sans",system-ui,sans-serif)';
  }
  /* Shell nào có #i18n-slot thì pill dời vào topbar (slot xuất hiện sau khi React render). */
  function relocate() {
    if (!sw) return;
    var slot = document.getElementById('i18n-slot');
    if (slot && sw.parentNode !== slot) { slot.appendChild(sw); docked(true); }
    else if (!slot && sw.parentNode !== document.body) { document.body.appendChild(sw); docked(false); }
  }
  function mount() {
    if (sw || !document.body) return;
    sw = document.createElement('div');
    sw.setAttribute('data-i18n-skip', '');
    var slot = document.getElementById('i18n-slot');
    docked(!!slot);
    ['vi', 'en'].forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button'; b.dataset.lang = l; b.textContent = l.toUpperCase();
      b.title = l === 'vi' ? 'Tiếng Việt' : 'English';
      b.style.cssText = 'border:0;cursor:pointer;font:700 11px/1 var(--font-body,"Public Sans",sans-serif);letter-spacing:.06em;padding:7px 11px;border-radius:999px;transition:background .15s,color .15s';
      b.onclick = function () { I18N.set(l); };
      sw.appendChild(b);
    });
    (slot || document.body).appendChild(sw);
    paint();
  }

  function boot() {
    mount();
    /* giữ tham chiếu — observer không có tham chiếu có thể bị GC dọn mất */
    I18N._mo = new MutationObserver(function () { if (!busy && lang === 'en') schedule(); });
    I18N._mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    I18N._iv = setInterval(function () { if (busy) return; if (lang === 'en') schedule(); else relocate(); }, 900);
    var saved; try { saved = localStorage.getItem(LS); } catch (e) { }
    I18N.set(saved === 'en' ? 'en' : 'vi');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

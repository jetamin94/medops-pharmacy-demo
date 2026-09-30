/* Pharmacy — bộ vết tính (calc trace) dùng chung.
   dvComputeReplenish mô phỏng engine bổ sung hiện hành: KHÔNG còn hệ số z hay
   service level — đệm an toàn = ADS × số ngày đệm theo lớp ABC. Hai nhánh vết:
   theo tốc độ bán (ROP/Max · min–max · Croston) và Percentile — nhánh này lấy
   phân vị THẬT trên chuỗi bán từng ngày của SKU (dvWindowSums + dvPercentile);
   mức phục vụ pMin/pMax đến từ ô ABC×VEN. SKU không kèm chuỗi bán ngày thì
   nhánh Percentile hạ xuống bản XẤP XỈ từ ADS và nói ra điều đó trên từng dòng
   vết — chữ "phân vị" không bao giờ đứng trên một phép nhân. Cả hai nhánh có
   bước sàn Min ≥ 1 khi mặt hàng có bán trong kỳ (opts.minFloor).
   opts.serviceLevel đã gỡ khỏi dvOptsFor và không hàm nào ở đây đọc nó.
   CalcTrace render từng bước; WhyPopover là khuôn chung cho các màn cần giải
   thích số. MethodConfig + CalcSandbox là legacy, không màn nào render nữa.
   FormulaEditor vẫn được Settings (chế độ nhà cung cấp) dùng.
   All attach to window. Numbers are illustrative (prototype). */

function dvRoundMOQ(n, moq, pack) {
  n = Math.max(0, n); moq = moq || 1; pack = pack || 1;
  if (n === 0) return 0;
  const byPack = Math.ceil(n / pack) * pack;
  return Math.max(moq, byPack);
}

/* ---- phân vị thật trên chuỗi bán ngày (nhánh Percentile dùng) ----
   dvWindowSums: tổng của mọi cửa sổ w ngày liên tiếp trong chuỗi (tổng trượt) — đây mới
   là "phân bố bán" mà một mức phục vụ nói tới; một con số ADS không có phân bố nào cả.
   dvPercentile: nội suy tuyến tính, quy ước INC (như PERCENTILE.INC) — p=100 trả về đúng
   giá trị lớn nhất quan sát được, không ngoại suy ra ngoài dữ liệu. */
function dvWindowSums(series, w) {
  const out = [];
  if (!Array.isArray(series) || !(w >= 1) || series.length < w) return out;
  let run = 0;
  for (let i = 0; i < series.length; i++) {
    run += series[i] || 0;
    if (i >= w) run -= series[i - w] || 0;
    if (i >= w - 1) out.push(run);
  }
  return out;
}
function dvPercentile(values, p) {
  const a = values.slice().sort((x, y) => x - y);
  if (!a.length) return 0;
  if (a.length === 1) return a[0];
  const idx = (Math.min(100, Math.max(0, p)) / 100) * (a.length - 1);
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (idx - lo);
}
window.dvWindowSums = dvWindowSums;
window.dvPercentile = dvPercentile;

/* inp: {ads, leadtime, onHand, inTransit, transferIn, moq, pack, abc, series?}
   opts: {method, safetyDays, cycle, terms, seasonalFactor, minFloor;
          nhánh percentile: pMin, pMax, cellLabel, window}
   inp.series = lượng bán từng ngày, cũ → mới. CÓ chuỗi thì nhánh percentile lấy phân vị
   thật trên tổng trượt; KHÔNG có thì tính xấp xỉ từ ADS và ghi rõ "xấp xỉ" trên vết. */
function dvComputeReplenish(inp, opts) {
  const o = opts || {}; const terms = o.terms || {};
  const seasonal = terms.seasonal ? (o.seasonalFactor || 1.15) : 1;
  const adsEff = +(inp.ads * seasonal).toFixed(1);
  const lt = inp.leadtime + (o.leadBuffer || 0);
  const R = o.cycle != null ? o.cycle : 7;
  const sd = o.safetyDays != null ? o.safetyDays : 7;
  const ss = Math.round(adsEff * sd);
  const inTransit = terms.inTransit === false ? 0 : (inp.inTransit || 0);
  const transferIn = terms.transfer ? (inp.transferIn || 0) : 0;
  const method = o.method || 'ropmax';
  const steps = [];
  let rop, max, need, q, label;
  const pushMinFloor = () => {
    if (o.minFloor && rop === 0 && adsEff > 0) {
      rop = 1; if (max < 2) max = 2;
      steps.push({ k: 'Sàn Min ≥ 1', f: 'có bán trong kỳ → Min 0 → 1', v: '1', em: false });
    }
  };
  if (method === 'percentile') {
    const pMin = o.pMin != null ? o.pMin : 97.5;
    const pMax = o.pMax != null ? o.pMax : 95;
    const cell = o.cellLabel || 'A×E';
    const win = o.window != null ? o.window : 14;
    const winMin = Math.max(1, Math.round(win / 2));
    const sumsMax = dvWindowSums(inp.series, win);
    const sumsMin = dvWindowSums(inp.series, winMin);
    const real = sumsMax.length > 0 && sumsMin.length > 0;
    if (real) {
      const winTotal = sumsMax[sumsMax.length - 1];
      rop = Math.round(dvPercentile(sumsMin, pMin));
      max = Math.round(dvPercentile(sumsMax, pMax));
      steps.push({ k: 'Tổng bán cửa sổ', f: `cộng lượng bán ${win}n gần nhất`, v: window.NUM(winTotal), em: false });
      steps.push({ k: `Min = P${pMin}[${cell}]`, f: `phân vị ${pMin} trên ${sumsMin.length} cửa sổ ${winMin}n trượt · mức phục vụ ô ${cell}`, v: window.NUM(rop), em: false });
      steps.push({ k: `Max = P${pMax}[${cell}]`, f: `phân vị ${pMax} trên ${sumsMax.length} cửa sổ ${win}n trượt · mức phục vụ ô ${cell}`, v: window.NUM(max), em: false });
    } else {
      /* SKU không kèm chuỗi bán ngày ⇒ không có phân bố nào để lấy phân vị. Tính xấp xỉ
         từ ADS và nói thẳng trên vết — nhãn "P97,5" đặt lên một phép nhân là nói dối
         đúng chỗ người dùng mở ra để tin con số. */
      const winTotal = Math.round(inp.ads * win);
      rop = Math.round(inp.ads * winMin * (pMin / 100));
      max = Math.round(inp.ads * win * (pMax / 100));
      steps.push({ k: 'Tổng bán cửa sổ', f: `xấp xỉ: ADS ${window.NUM(inp.ads)} × ${win}n — SKU chưa kèm chuỗi bán ngày`, v: window.NUM(winTotal), em: false });
      steps.push({ k: 'Min ≈ (xấp xỉ)', f: `ADS × ${winMin}n × ${pMin}% — không phải phân vị; hệ thật đọc phân bố bán ngày của ô ${cell}`, v: window.NUM(rop), em: false });
      steps.push({ k: 'Max ≈ (xấp xỉ)', f: `ADS × ${win}n × ${pMax}% — không phải phân vị; hệ thật đọc phân bố bán ngày của ô ${cell}`, v: window.NUM(max), em: false });
    }
    pushMinFloor();
    need = max - inp.onHand - inTransit - transferIn;
    label = real ? 'Percentile' : 'Percentile (xấp xỉ ADS)';
  } else {
    rop = Math.round(adsEff * lt + ss);
    max = Math.round(adsEff * (lt + R) + ss);
    if (seasonal !== 1) steps.push({ k: 'ADS×mùa', f: `ADS gốc ${window.NUM(inp.ads)} × hệ số ${seasonal}`, v: window.NUM(adsEff), em: false });
    else steps.push({ k: 'ADS', f: 'bình quân bán/ngày', v: window.NUM(adsEff), em: false });
    steps.push({ k: 'SS', f: `ADS × đệm(${inp.abc || '–'}=${sd}n)`, v: window.NUM(ss), em: false });
    if (method === 'minmax') {
      steps.push({ k: 'min (ROP)', f: `ADS × leadtime(${lt}) + SS`, v: window.NUM(rop), em: false });
      steps.push({ k: 'max', f: `ADS × (leadtime+R(${R})) + SS`, v: window.NUM(max), em: false });
      pushMinFloor();
      const below = inp.onHand <= rop;
      need = below ? max - inp.onHand - inTransit - transferIn : 0;
      steps.push({ k: 'Đặt lại?', f: `tồn ${window.NUM(inp.onHand)} ${below ? '≤' : '>'} min ${window.NUM(rop)}`, v: below ? 'Có' : 'Không', em: false });
      label = 'min–max';
    } else if (method === 'croston') {
      steps.push({ k: 'ROP', f: `ADS(làm mượt) × leadtime(${lt}) + SS`, v: window.NUM(rop), em: false });
      steps.push({ k: 'Max', f: `ADS × (leadtime+R) + SS`, v: window.NUM(max), em: false });
      pushMinFloor();
      need = inp.onHand <= rop ? max - inp.onHand - inTransit - transferIn : 0;
      label = 'Croston (bán lẻ tẻ)';
    } else {
      steps.push({ k: 'ROP', f: `ADS × leadtime(${lt}) + SS`, v: window.NUM(rop), em: false });
      steps.push({ k: 'Max', f: `ADS × (leadtime+R(${R})) + SS`, v: window.NUM(max), em: false });
      pushMinFloor();
      need = max - inp.onHand - inTransit - transferIn;
      label = 'ROP/Max';
    }
  }
  const needRaw = Math.round(need);
  const parts = [`Max ${window.NUM(max)}`, `− tồn ${window.NUM(inp.onHand)}`];
  if (terms.inTransit !== false) parts.push(`− đang về ${window.NUM(inp.inTransit || 0)}`);
  if (terms.transfer) parts.push(`− điều chuyển ${window.NUM(inp.transferIn || 0)}`);
  steps.push({ k: 'Cần bổ sung', f: parts.join(' '), v: window.NUM(Math.max(0, needRaw)), em: false });
  q = dvRoundMOQ(needRaw, inp.moq, inp.pack);
  steps.push({ k: 'SL đề xuất (Q)', f: `roundMOQ(${window.NUM(Math.max(0, needRaw))} · MOQ ${inp.moq}, gói ${inp.pack})`, v: window.NUM(q), em: true });
  return { adsEff, ss, rop, max, need: Math.max(0, needRaw), q, label, steps };
}
window.dvComputeReplenish = dvComputeReplenish;

/* safe-ish formula evaluator for provider mode */
function dvEvalFormula(expr, vars) {
  const rhs = expr.replace(/^\s*Q\s*=\s*/i, '');
  const names = Object.keys(vars);
  const body = `"use strict";
    const max=Math.max,min=Math.min,round=Math.round,ceil=Math.ceil,floor=Math.floor,abs=Math.abs;
    const roundMOQ=(n,m=${vars.moq || 1},p=${vars.pack || 1})=>{n=Math.max(0,n); if(n===0)return 0; return Math.max(m, Math.ceil(n/p)*p);};
    return (${rhs});`;
  const fn = new Function(...names, body);
  const out = fn(...names.map((n) => vars[n]));
  if (typeof out !== 'number' || !isFinite(out)) throw new Error('Kết quả không phải số hợp lệ');
  return out;
}
window.dvEvalFormula = dvEvalFormula;

/* ---- CalcTrace: render substitution steps ---- */
function CalcTrace({ r }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {r.steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '7px 0', borderBottom: i < r.steps.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
          <span style={{ width: 108, flex: 'none', fontSize: 12, fontWeight: 700, color: s.em ? 'var(--dv-green)' : 'var(--dv-ink)' }}>{s.k}</span>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{s.f}</span>
          <span style={{ flex: 'none', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: s.em ? 16 : 13.5, color: s.em ? 'var(--dv-green)' : 'var(--dv-ink)' }}>{s.v}</span>
        </div>
      ))}
    </div>
  );
}
window.CalcTrace = CalcTrace;

/* ---- WhyPopover: "Vì sao số này?" trigger + floating trace ---- */
function WhyPopover({ inputs, opts, title }) {
  const { IconHelp, IconX } = window;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const r = dvComputeReplenish(inputs, opts);
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} title="Vì sao số này?" style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid var(--border-strong)', background: open ? 'var(--dv-green)' : '#fff', color: open ? '#fff' : 'var(--dv-ink-faint)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconHelp size={13} /></button>
      {open && (
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 340, background: '#fff', borderRadius: 14, border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)', padding: 16, zIndex: 60, textAlign: 'left', cursor: 'default' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5, color: 'var(--dv-green)', flex: 1 }}>{title || 'Cách tính SL đề xuất'}</span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--dv-mist)', padding: '2px 7px', borderRadius: 999 }}>{r.label}</span>
          </div>
          <CalcTrace r={r} />
          <div style={{ marginTop: 11, fontSize: 11, color: 'var(--dv-ink-faint)', lineHeight: 1.5 }}>Theo tham số đang áp dụng ở Cài đặt. Đổi cách tính tại <b style={{ color: 'var(--dv-ink-soft)' }}>Cài đặt → Chính sách theo loại hàng</b>.</div>
        </div>
      )}
    </span>
  );
}
window.WhyPopover = WhyPopover;

/* ---- sample SKUs for sandbox / formula test ----
   `series` = lượng bán từng ngày của 60 ngày gần nhất (cũ → mới; số dựng cho prototype).
   Nó là NGUỒN của nhánh Percentile — Min/Max lấy phân vị trên tổng trượt của chuỗi này.
   Bất biến: ads = trung bình cộng của series (SP0142: 2.052 ÷ 60 = 34,2 …). Sửa một bên
   phải sửa bên kia — để lệch là hai con số cùng tên nói hai chuyện khác nhau. Hình dạng
   khớp lớp ABC: A/B bán đều mọi ngày, C lẻ tẻ (nhiều ngày 0). */
const CALC_SKUS = [
  { sku: 'SP0142', name: 'Paracetamol 500mg (Hapacol)', abc: 'A', ads: 34.2, onHand: 210, inTransit: 0, transferIn: 40, moq: 80, pack: 10, store: 'Dược Vương Q.1', leadtime: 3, price: 1200,
    series: [34, 31, 33, 25, 45, 51, 26, 44, 34, 31, 37, 36, 51, 21, 23, 38, 54, 43, 35, 46, 22, 24, 22, 34, 39, 28, 33, 21, 30, 23, 27, 29, 39, 36, 24, 26, 37, 37, 44, 35, 51, 20, 28, 22, 40, 43, 32, 31, 18, 42, 32, 22, 60, 37, 51, 28, 37, 28, 40, 42] },
  { sku: 'SP0210', name: 'Augmentin 625mg', abc: 'A', ads: 8.6, onHand: 24, inTransit: 14, transferIn: 0, moq: 20, pack: 14, store: 'Dược Vương Q.3', leadtime: 5, price: 8500,
    series: [9, 6, 7, 11, 12, 18, 6, 10, 9, 9, 11, 12, 12, 5, 10, 7, 7, 7, 9, 7, 6, 11, 6, 8, 8, 10, 8, 6, 8, 8, 9, 9, 11, 7, 5, 8, 10, 8, 7, 9, 11, 4, 6, 7, 8, 11, 7, 7, 4, 14, 10, 8, 11, 9, 12, 7, 7, 9, 10, 8] },
  { sku: 'SP0177', name: 'Omeprazol 20mg', abc: 'B', ads: 11.4, onHand: 96, inTransit: 0, transferIn: 0, moq: 30, pack: 28, store: 'Dược Vương Q.5', leadtime: 3, price: 1100,
    series: [12, 11, 9, 12, 12, 11, 6, 11, 11, 7, 10, 9, 17, 8, 13, 12, 9, 9, 10, 13, 11, 11, 8, 12, 15, 13, 9, 9, 10, 15, 14, 10, 11, 17, 11, 13, 13, 9, 13, 10, 17, 12, 15, 12, 8, 10, 15, 17, 9, 12, 9, 11, 10, 12, 14, 11, 10, 9, 11, 14] },
  { sku: 'SP0312', name: 'Salbutamol 4mg', abc: 'C', ads: 2.1, onHand: 18, inTransit: 0, transferIn: 0, moq: 50, pack: 20, store: 'Dược Vương Thủ Đức', leadtime: 4, price: 380,
    series: [4, 0, 0, 0, 0, 0, 0, 5, 3, 4, 5, 0, 3, 1, 5, 0, 0, 0, 5, 0, 2, 4, 3, 4, 4, 0, 0, 0, 0, 3, 3, 0, 5, 0, 1, 0, 0, 4, 0, 7, 0, 2, 4, 5, 4, 3, 0, 5, 0, 0, 6, 4, 0, 5, 7, 4, 0, 2, 0, 0] },
  { sku: 'SP0455', name: 'Morphin sulfat 10mg', abc: 'C', ads: 0.6, onHand: 5, inTransit: 0, transferIn: 0, moq: 5, pack: 5, store: 'Kho tổng (DC)', leadtime: 7, price: 18500,
    series: [0, 1, 2, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 2, 0, 3, 0, 2, 2, 0, 0] },
];
window.CALC_SKUS = CALC_SKUS;

/* opts builder shared by sandbox/editor from cfg+method+terms.
   serviceLevel ĐÃ GỠ khỏi opts (2026-08-28): hệ số z đi rồi thì không hàm nào đọc nó,
   và nó không phải khoá engine — xem đầu SettingsAdvanced.jsx, what-if đã bỏ
   serviceLevel/budgetCap vì hai khoá đó không có trong ENGINE_DEFAULTS. Settings.jsx
   còn một shim `calcCfg = { ...cfg, serviceLevel: 95 }`; giá trị đó nay không đi tới
   đâu — để nguyên (bản ghi), đừng nối lại trường này. */
function dvOptsFor(sku, cfg, methodByClass, terms, seasonalFactor) {
  const sd = sku.abc === 'A' ? cfg.safetyA : sku.abc === 'B' ? cfg.safetyB : cfg.safetyC;
  return { method: methodByClass[sku.abc] || 'ropmax', safetyDays: sd, cycle: cfg.cycle, terms, seasonalFactor };
}
window.dvOptsFor = dvOptsFor;

/* ---- B: MethodConfig ----
   LEGACY — KHÔNG MÀN NÀO RENDER. Dò lại 2026-08-28: SettingsScreen (Settings.jsx) là nơi
   duy nhất còn dựng thành phần của CalcEngine, và nó chỉ dựng <FormulaEditor> ở mục "Công
   thức Q"; không nhánh sec nào (policy · fefo · approval · transfer · notify · ops ·
   advanced) gọi MethodConfig. Chuỗi bên dưới — mô hình theo lớp ABC, Croston, trần ngân
   sách — KHÔNG mô tả bộ máy hiện hành: cách tính hôm nay chốt ở màn "Chính sách theo loại
   hàng" (SettingsSegments.jsx). Giữ làm bản ghi, đừng xoá, và đừng đọc như hành vi đang
   chạy. */
function MethodConfig({ methodByClass, setMethodByClass, terms, setTerms, seasonalFactor, setSeasonalFactor, onDirty }) {
  const { Switch } = window.DVMedKingDesignSystem_bf17f8;
  const MODELS = [['ropmax', 'ROP / Max'], ['minmax', 'min – max'], ['croston', 'Croston']];
  const setM = (cls, v) => { setMethodByClass({ ...methodByClass, [cls]: v }); onDirty && onDirty(); };
  const setT = (k, v) => { setTerms({ ...terms, [k]: v }); onDirty && onDirty(); };
  const TERMS = [
    ['inTransit', 'Trừ hàng đang về', 'Q = … − hàng đang về (on-order). Tránh đặt trùng lượng đang trên đường.'],
    ['transfer', 'Cộng nguồn điều chuyển nội bộ', 'Q = … − lượng có thể điều chuyển từ điểm thừa. Ưu tiên dùng tồn nội bộ trước khi mua.'],
    ['seasonal', 'Nhân hệ số mùa vụ', 'ADS × hệ số uplift theo mùa (cúm, Tết). Bật để dự báo nhạy với cao điểm.'],
    ['clampBudget', 'Chặn trần ngân sách', 'Cắt giảm Q theo ưu tiên khi tổng vượt trần ngân sách/kỳ.'],
  ];
  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)', marginBottom: 4 }}>Mô hình tính theo nhóm tốc độ bán (ABC)</div>
        <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginBottom: 12, maxWidth: '60ch' }}>Mỗi lớp ABC có thể dùng mô hình khác nhau — hàng bán chậm (C) thường hợp Croston để tránh đặt dư.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['A', 'Bán nhanh'], ['B', 'Trung bình'], ['C', 'Bán chậm / lẻ tẻ']].map(([cls, lbl]) => (
            <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 124, flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: 'var(--dv-green)', background: 'var(--dv-green-50)', width: 24, height: 24, borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{cls}</span>
                <span style={{ fontSize: 13, color: 'var(--dv-ink-soft)' }}>{lbl}</span>
              </span>
              <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3 }}>
                {MODELS.map(([k, l]) => (
                  <button key={k} onClick={() => setM(cls, k)} style={{ border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: methodByClass[cls] === k ? '#fff' : 'transparent', color: methodByClass[cls] === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: methodByClass[cls] === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 14 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)', marginBottom: 10 }}>Thành phần công thức</div>
        {TERMS.map(([k, label, hint]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)' }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--dv-ink-soft)', marginTop: 2, maxWidth: '58ch' }}>{hint}</div>
            </div>
            {k === 'seasonal' && terms.seasonal && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <input type="number" step="0.05" value={seasonalFactor} onChange={(e) => { setSeasonalFactor(Number(e.target.value)); onDirty && onDirty(); }} style={{ width: 66, padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, textAlign: 'center', outline: 'none' }} />
                <span style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>×</span>
              </span>
            )}
            <Switch checked={!!terms[k]} onChange={(v) => setT(k, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
window.MethodConfig = MethodConfig;

/* ---- A: CalcSandbox (live worked example) ----
   LEGACY — KHÔNG MÀN NÀO RENDER (cùng lần dò 2026-08-28 với MethodConfig ở trên). Nó gọi
   dvComputeReplenish nên các con số bên trong vẫn đúng, nhưng "Bảng tính thử" không phải
   màn nào người dùng mở được — chỗ chạy thử còn sống là what-if ở Cài đặt → Sổ tham số.
   Giữ làm bản ghi, đừng xoá. */
function CalcSandbox({ cfg, methodByClass, terms, seasonalFactor, useCustom, customFormula }) {
  const { VND, NUM, IconCalculator, IconStore } = window;
  const [idx, setIdx] = React.useState(0);
  const sku = CALC_SKUS[idx];
  const opts = dvOptsFor(sku, cfg, methodByClass, terms, seasonalFactor);
  const r = dvComputeReplenish(sku, opts);
  let customQ = null, customErr = null;
  if (useCustom) {
    try { customQ = Math.round(dvEvalFormula(customFormula, { ADS: r.adsEff, leadtime: sku.leadtime, R: cfg.cycle, SS: r.ss, ROP: r.rop, Max: r.max, onHand: sku.onHand, inTransit: sku.inTransit, transferIn: sku.transferIn, moq: sku.moq, pack: sku.pack })); }
    catch (e) { customErr = e.message; }
  }
  return (
    <div style={{ background: 'var(--dv-mist)', borderRadius: 14, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconCalculator size={17} /></span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-faint)' }}>Bảng tính thử — chọn SKU để xem phép tính sống</div>
          <select value={idx} onChange={(e) => setIdx(Number(e.target.value))} style={{ marginTop: 4, padding: '8px 11px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, background: '#fff', outline: 'none', minWidth: 280 }}>
            {CALC_SKUS.map((s, i) => <option key={s.sku} value={i}>{s.name} · {s.abc} · {s.store}</option>)}
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {[['Tồn hiện tại', NUM(sku.onHand)], ['Đang về', NUM(sku.inTransit)], ['Leadtime', sku.leadtime + 'n'], ['MOQ / gói', `${sku.moq}/${sku.pack}`], ['Mô hình', r.label]].map(([l, v]) => (
          <span key={l} style={{ display: 'inline-flex', flexDirection: 'column', background: '#fff', borderRadius: 9, padding: '6px 11px', border: '1px solid var(--border-default)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: 'var(--dv-ink-faint)' }}>{l}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--dv-ink)' }}>{v}</span>
          </span>
        ))}
      </div>
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border-default)', padding: '12px 16px' }}>
        <CalcTrace r={r} />
      </div>
      {useCustom && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, background: customErr ? '#FDEBE9' : 'var(--dv-green-900)', color: customErr ? '#9c2b22' : '#fff', borderRadius: 12, padding: '11px 15px' }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1 }}>Công thức tùy chỉnh (chế độ kỹ thuật)</span>
          {customErr ? <span style={{ fontSize: 12.5, fontWeight: 700 }}>Lỗi: {customErr}</span> : <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: 'var(--dv-yellow)' }}>Q = {NUM(customQ)}</span>}
        </div>
      )}
    </div>
  );
}
window.CalcSandbox = CalcSandbox;

/* ---- C: FormulaEditor (provider / technical mode) ---- */
const FORMULA_TOKENS = ['ADS', 'leadtime', 'R', 'SS', 'ROP', 'Max', 'onHand', 'inTransit', 'transferIn', 'moq', 'pack', 'roundMOQ(', 'max(', 'min('];
const FORMULA_DEFAULT = 'roundMOQ( max(Max - onHand - inTransit, 0) )';

function FormulaEditor({ cfg, methodByClass, terms, seasonalFactor, formula, setFormula, onDirty, setToast }) {
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { NUM, IconCode, IconCheckCircle, IconAlertTriangle, IconRotateCcw, IconPlay } = window;
  const taRef = React.useRef(null);
  const [test, setTest] = React.useState(null);
  const insert = (tok) => {
    const ta = taRef.current; if (!ta) { setFormula(formula + tok); return; }
    const s = ta.selectionStart, e = ta.selectionEnd;
    setFormula(formula.slice(0, s) + tok + formula.slice(e)); onDirty && onDirty();
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + tok.length; });
  };
  const runTest = () => {
    const rows = CALC_SKUS.map((sku) => {
      const opts = dvOptsFor(sku, cfg, methodByClass, terms, seasonalFactor);
      const r = dvComputeReplenish(sku, opts);
      try {
        const q = dvEvalFormula(formula, { ADS: r.adsEff, leadtime: sku.leadtime, R: cfg.cycle, SS: r.ss, ROP: r.rop, Max: r.max, onHand: sku.onHand, inTransit: sku.inTransit, transferIn: sku.transferIn, moq: sku.moq, pack: sku.pack });
        return { sku, q: Math.round(q), ok: q >= 0, neg: q < 0 };
      } catch (e) { return { sku, err: e.message, ok: false }; }
    });
    setTest(rows);
    const bad = rows.filter((r) => !r.ok).length;
    setToast(bad ? `Công thức có ${bad} cảnh báo trên ${rows.length} SKU mẫu.` : `Công thức hợp lệ trên cả ${rows.length} SKU mẫu.`);
  };
  return (
    <div style={{ border: '1px solid #2A2F3A', borderRadius: 14, overflow: 'hidden', background: '#10141C' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#161B26', borderBottom: '1px solid #2A2F3A' }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(253,184,19,.16)', color: 'var(--dv-yellow)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{IconCode ? <IconCode size={16} /> : <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{'{}'}</span>}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#fff' }}>Trình soạn công thức (chế độ kỹ thuật)</div>
          <div style={{ fontSize: 11.5, color: '#8B93A3' }}>Chỉ nhà cung cấp phần mềm. Chỉnh sửa biểu thức tính Q — có kiểm tra & test trước khi áp.</div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#8B93A3', marginBottom: 6 }}>Q =</div>
        <textarea ref={taRef} value={formula} onChange={(e) => { setFormula(e.target.value); onDirty && onDirty(); }} spellCheck={false} rows={3}
          style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10, border: '1px solid #2A2F3A', background: '#0A0D13', color: '#E8EDF5', fontFamily: 'var(--font-mono)', fontSize: 14, lineHeight: 1.6, outline: 'none', resize: 'vertical' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {FORMULA_TOKENS.map((t) => (
            <button key={t} onClick={() => insert(t)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--dv-yellow)', background: 'rgba(253,184,19,.1)', border: '1px solid rgba(253,184,19,.28)', borderRadius: 7, padding: '4px 9px', cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 14, flexWrap: 'wrap' }}>
          <button onClick={runTest} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--dv-yellow)', color: 'var(--dv-green)', border: 'none', borderRadius: 999, padding: '9px 16px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{IconPlay && <IconPlay size={14} />}Test trên {CALC_SKUS.length} SKU mẫu</button>
          <button onClick={() => { setFormula(FORMULA_DEFAULT); setTest(null); onDirty && onDirty(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'transparent', color: '#C7CEDA', border: '1px solid #2A2F3A', borderRadius: 999, padding: '9px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{IconRotateCcw && <IconRotateCcw size={14} />}Khôi phục mặc định</button>
        </div>
        {test && (
          <div style={{ marginTop: 14, borderRadius: 10, border: '1px solid #2A2F3A', overflow: 'hidden' }}>
            {test.map((rr, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', background: i % 2 ? '#0E121A' : '#10141C', borderTop: i ? '1px solid #1E2430' : 'none' }}>
                <span style={{ width: 16, color: rr.ok ? '#39C07F' : '#E5705F', display: 'inline-flex' }}>{rr.ok ? (IconCheckCircle && <IconCheckCircle size={15} />) : (IconAlertTriangle && <IconAlertTriangle size={15} />)}</span>
                <span style={{ flex: 1, fontSize: 12.5, color: '#C7CEDA' }}>{rr.sku.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: '#5C6573' }}>· {rr.sku.abc}</span></span>
                {rr.err ? <span style={{ fontSize: 11.5, color: '#E5705F', fontFamily: 'var(--font-mono)' }}>{rr.err}</span>
                  : <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: rr.neg ? '#E5705F' : 'var(--dv-yellow)' }}>Q = {NUM(rr.q)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
window.FormulaEditor = FormulaEditor;
window.FORMULA_DEFAULT = FORMULA_DEFAULT;

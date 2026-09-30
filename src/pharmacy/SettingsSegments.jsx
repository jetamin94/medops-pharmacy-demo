/* Pharmacy — CHÍNH SÁCH THEO LOẠI HÀNG (chốt 2026-08-26, sau Bản chấm 36 case).
   Jet duyệt khung "Luật quyết định" (phương án B cũ) làm màn chính thức; phương án A đã xoá,
   nhưng BẢN ĐỒ NHÓM của nó được nhập vào đây thành bản đồ BẤM ĐƯỢC: bấm ô xem luật đang quyết
   và chỉnh ngay mức phục vụ + tự duyệt của ô; bấm đầu hàng chỉnh đệm an toàn + nhịp rà.
   Phương pháp tính vẫn CHỈ do luật quyết — muốn đổi một nhóm thì thêm luật ngoại lệ.

   6 việc đã sửa theo Bản chấm (2026-08-26):
   1. Trục VEN + hình dạng mặc định TẮT (bật là opt-in — mới gán VEN 612/5.030); cờ trục là MỘT
      state nâng lên SettingsScreen (T04/T29). Nơi lưu thật: tenant_feature classify.* (đã có, migration 0053) — cần
      ticket DVP.
   2. Luật nhận thêm 2 điều kiện: "Chưa đủ dữ liệu (dưới 2 lần bán)" và "SKU cụ thể" (T05/T15).
   3. Xoá luật: bấm X hai nhịp (X → "Xoá?") + setDirty — trước đây xoá thẳng và không dirty (T31/T36).
   4. "Tự duyệt đơn nhỏ" có nhà mới: Switch per ô ABC×VEN trong drawer của bản đồ (T36).
   5. Nhãn hồ sơ tham số đang áp đứng đầu danh sách luật + drawer Ma trận phục vụ (T13).

   Vòng 4 (2026-08-27) — ba chỉnh sau khi ĐỌC CODE ENGINE, không đoán:
   A. Ma trận phục vụ chỉ vẽ những ô bộ máy THẬT SỰ tra. Trục VEN tắt ⇒ run.ts truyền ven=null cho
      mọi mặt hàng ⇒ resolvePercentiles tra VEN_WHEN_UNKNOWN="E" ⇒ đúng 6 khoá cột E còn tác dụng,
      12 khoá V/N trơ. Bản trước vẽ đủ 18 ô bất kể trục — đó là hứa một việc không xảy ra.
   B. Hai trục phân loại gắn nhãn "Console": khoá tenant_feature classify.* chỉ ghi được qua route
      provider, nhà thuốc không tự đổi. Công tắc ở đây là MÔ PHỎNG để duyệt thiết kế.
   C. Luật hệ thống viết theo VAI TRÒ ("điểm đặt hàng NCC"), tên loại điểm đứng trong ngoặc — để
      khi chi nhánh đặt thẳng NCC thì luật không phải viết lại. Và R hạ xuống làm giá trị dự phòng:
      chu kỳ đặt là thuộc tính của cặp (NCC, mặt hàng), khai ở hồ sơ NCC cạnh leadtime + MOQ.

   Vòng 5 (2026-08-28) — Jet chốt 3 điểm:
   ① Chip "N ghi đè phạm vi đang sống" (T34) ĐÃ GỠ cùng bảng ghi đè bên Sổ tham số — nó trỏ vào
      đúng khối vừa biến mất. Lý do gỡ: [đo prod 2026-08-28] `engine_param` 5 hàng, TẤT CẢ `global`;
      và 20 khoá (18 ô + usePercentileEngine + allowLateral) được engine đọc bằng ngữ cảnh RỖNG
      ⇒ ghi được mà không bao giờ có tác dụng (DVP-556 chưa chốt hướng).
   ② "Trọng số gần" → "Ưu tiên 14 ngày gần nhất", kèm một câu nói ra phép trộn thật. Tên cũ là
      dịch máy từ `recentWeight`: đúng nghĩa kỹ thuật, vô nghĩa với người đọc.
   ③ Ma trận ABC×VEN nay chỉ còn sửa ở MÀN NÀY (bấm ô hoặc drawer "Ma trận phục vụ"); 18 dòng
      phẳng bên Sổ tham số đã gỡ, thay bằng một dòng trỏ sang đây.

   ── SỔ TRẠNG THÁI — ● có thật trong engine · ◌ NỢ (cần ticket DVP) ──
   ● pMin/pMax 18 khoá (6 sống khi VEN tắt) · usePercentileEngine (một công tắc CHO CẢ CHUỖI, đọc
     một lần mỗi lượt chạy) · minFloorWhenSold · forecastWindow/recentWeight/cycle/safetyA-C ·
     điểm đặt hàng NCC luôn Tốc độ (cố định theo cấu trúc: lời gọi kho không truyền percentile).
   ◌ ROUTE phương pháp theo luật · preset Min–Max tay + Không tự động · tự duyệt theo ô ·
     nhịp rà theo hàng · lưu luật + cờ trục (đề xuất tenant_setting JSON — engine_param chỉ
     nhận số) · trần đặt theo hạn dùng · CHU KỲ ĐẶT THEO NCC (engine đọc một R chung).
   Trục thứ ba = ĐỘ THƯA (ADI×CV²) — trục chọn công thức; XYZ là lát cắt 3 mức của CHÍNH cv² đó
   (classifyXyz đọc cùng một biến), nên hai nhãn luôn cùng có hoặc cùng trống — không phải hai trục.
   File tự chứa, tiền tố SEG_ — không dùng chung const với Settings.jsx. */

/* ── Claude Code 2026-09-07 — bốn chỗ sửa THEO CODE (DVP-175 việc 1·4·5·6; epic DVP-600) ──
   1. SegAxisBar: hết chip "Console" + chữ "mô phỏng". Trục là HAI TẦNG (ADR-13): Console CHO PHÉP
      (tenant_feature classify.*, route provider) · nhà thuốc BẬT (ClassifyAxesPanel ở Danh mục, route
      classify-axis, DVP-568). Console không cho phép ⇒ ẩn hẳn thẻ trục — không vẽ công tắc chết.
   4. Tự duyệt theo ô (drawer ô) và nhịp rà theo hạng (drawer hàng) mang chip "lộ trình" — Sổ T36 rút
      30-08, DVP-590 "chưa kéo tự duyệt vào đợt này"; đầu hàng bản đồ thôi in nhịp rà như số thật.
   5. "Chu kỳ đặt R — dự phòng" → "Chu kỳ đặt R": engine đọc MỘT R chung (`cycle`); R theo NCC chưa tồn
      tại nên không được gọi ô này là "dự phòng" (câu chân trang trỏ Hồ sơ NCC gỡ theo).
   6. Drawer thêm luật bỏ ô "SKU cụ thể": ngoại lệ một mã là cờ per-SKU ở Danh mục (DVP-577, T09 31-08).
      Luật chỉ theo trục; luật mẫu per-SKU thay bằng luật theo hạng. */

const SEG_ABC = [
  { abc: 'A', label: 'Giá trị cao', skus: 782, gt: 79 },
  { abc: 'B', label: 'Giá trị vừa', skus: 1145, gt: 16 },
  { abc: 'C', label: 'Đuôi dài', skus: 3103, gt: 5 },
];
const SEG_VEN = [
  { ven: 'V', label: 'Sống còn', tone: '#C5372C' },
  { ven: 'E', label: 'Thiết yếu', tone: 'var(--dv-green)' },
  { ven: 'N', label: 'Thông thường', tone: 'var(--dv-ink-faint)' },
];
const SEG_CELLS = { AV: 41, AE: 689, AN: 52, BV: 18, BE: 1041, BN: 86, CV: 9, CE: 2877, CN: 217 };
const SEG_UNASSIGNED = { AE: 663, BE: 979, CE: 2776 };
const SEG_SHAPE_FRAC = { A: [0.34, 0.61], B: [0.14, 0.76], C: [0.03, 0.78] };
/* Số ngày của "giai đoạn gần" — mặc định `recentDays` của `AdsParams` trong engine (lib/engine/ads.ts).
   Để ở một hằng số có tên thay vì gõ "14" vào giữa câu: nhãn và lời giải thích phải cùng đi theo
   nó, nếu không thì ngày engine đổi cửa sổ sẽ có hai con số khác nhau trên cùng một ô. */
const SEG_RECENT_DAYS = 14;
const SEG_SHAPE2 = [
  { key: 'deu', label: 'Đều', tone: '#1d4f8a' },
  { key: 'thua', label: 'Thưa', tone: 'var(--dv-yellow-600)' },
];
const SEG_SHAPE4 = [
  { key: 'smooth', label: 'Đều & ổn định', tone: '#1d4f8a' },
  { key: 'erratic', label: 'Đều nhưng loạn', tone: 'var(--dv-yellow-600)' },
  { key: 'intermittent', label: 'Thưa nhưng đều', tone: 'var(--dv-green)' },
  { key: 'lumpy', label: 'Thưa & loạn', tone: '#C5372C' },
];

const segShapeGroup = (key) => (key === 'deu' || key === 'smooth' || key === 'erratic') ? 'deu' : (key === 'thua' || key === 'intermittent' || key === 'lumpy') ? 'thua' : 'na';
function segSplit(n, abc, gran) {
  const fr = SEG_SHAPE_FRAC[abc];
  const deu = Math.round(n * fr[0]);
  const thua = Math.round(n * fr[1]);
  const na = Math.max(0, n - deu - thua);
  if (gran === 'b2') return { deu, thua, na };
  const smooth = Math.round(deu * 0.82);
  const intermittent = Math.round(thua * 0.81);
  return { smooth, erratic: deu - smooth, intermittent, lumpy: thua - intermittent, na };
}
const SEG_METHODS = {
  pct: { label: 'Percentile', tone: 'var(--dv-green)', bg: 'var(--dv-green-50)', bd: 'var(--dv-green-100)', hint: 'Theo phân bố bán — hợp nhu cầu thưa, ít nhạy với đơn đột biến (khách sỉ)' },
  rate: { label: 'Tốc độ (ADS)', tone: '#1d4f8a', bg: '#e3ecf8', bd: '#c6d8f0', hint: 'ADS tuyến tính — hợp bán đều' },
  manual: { label: 'Min–Max tay', tone: 'var(--dv-yellow-600)', bg: 'var(--dv-yellow-100)', bd: 'var(--dv-yellow)', hint: 'Người đặt per SKU, máy không đụng' },
  none: { label: 'Không tự động', tone: '#C5372C', bg: '#F8E0DD', bd: '#EBB8B2', hint: 'Đặt theo đơn / xem tay (kiểu AZ·CZ)' },
};
/* Jet chốt 2026-08-31 (T09) — hai phương pháp này là quyết định của MỘT MÃ, không phải chính sách
   của một phân khúc: hệ thật đặt chúng bằng một cờ per-SKU ở màn Danh mục (DVP-577). Chào chúng
   cho một luật theo trục là hứa một hình dạng hệ thật không có.
   KHÔNG gỡ khỏi SEG_METHODS — luật per-SKU vẫn dùng, và segMBadge đọc bảng này để vẽ nhãn. */
const SEG_PER_SKU = new Set(['manual', 'none']);
const segFmtP = (v) => String(v).replace('.', ',');
const segPK = (mm, abc, ven) => 'p' + mm + abc + ven;
const segShapeRows = (gran) => gran === 'off' ? [null] : gran === 'b2' ? SEG_SHAPE2 : SEG_SHAPE4;
const segVenCols = (venOn) => venOn ? SEG_VEN : [{ ven: 'E', label: 'Chung (cột E)', tone: 'var(--dv-green)' }];
function segCellCount(abc, ven, shape, venOn, gran) {
  const base = venOn ? SEG_CELLS[abc + ven] : SEG_ABC.find((r) => r.abc === abc).skus;
  if (!shape) return base;
  return segSplit(base, abc, gran)[shape.key] || 0;
}
const segNaTotal = (gran) => gran === 'off' ? 0 : SEG_ABC.reduce((s, r) => s + segSplit(r.skus, r.abc, gran).na, 0);
/* Nhóm "chưa đủ dữ liệu" tồn tại bất kể trục hình dạng bật hay tắt (SKU dưới 2 lần bán) —
   đếm theo phân rã 2 bậc để con số ổn định khi đổi nấc trục. */
const segLowDataTotal = () => SEG_ABC.reduce((s, r) => s + segSplit(r.skus, r.abc, 'b2').na, 0);
const segBadgeTxt = (venOn, gran) => `3 × ${venOn ? 3 : 1} × ${gran === 'off' ? 1 : gran === 'b2' ? 2 : 4} = ${3 * (venOn ? 3 : 1) * (gran === 'off' ? 1 : gran === 'b2' ? 2 : 4)} nhóm${gran !== 'off' ? ' + chưa đủ dữ liệu' : ''}`;

const segMBadge = (m, small) => { const d = SEG_METHODS[m]; return <span style={{ fontSize: small ? 10.5 : 11.5, fontWeight: 700, color: d.tone, background: d.bg, border: `1px solid ${d.bd}`, padding: small ? '2px 8px' : '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>{d.label}</span>; };
const segChip = (txt) => <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', border: '1px solid var(--border-default)', padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>{txt}</span>;

function SegCard({ title, desc, badge, children }) {
  return (
    <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: '6px 24px 16px', marginBottom: 18 }}>
      <div style={{ padding: '16px 0 4px', display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0 }}>{title}</h3>{badge}
      </div>
      {desc && <p style={{ fontSize: 13, color: 'var(--dv-ink-soft)', margin: '0 0 10px', maxWidth: '70ch' }}>{desc}</p>}
      {children}
    </section>
  );
}

/* Thanh trục dùng chung — số nhóm động theo trục bật (ABC cố định).
   State trục sống ở SettingsScreen (MỘT nơi) — mặc định TẮT, bật là opt-in.
   Claude Code 2026-09-07 — HAI TẦNG (ADR-13): Console CHO PHÉP trục (tenant_feature classify.*, chỉ route
   provider ghi) · nhà thuốc BẬT/TẮT (route classify-axis — cùng thân ClassifyAxesPanel ở Danh mục, DVP-568).
   Console chưa cho phép ⇒ thẻ trục ẨN HẲN: một công tắc không bấm được là một lời hứa suông. Hết chữ
   "mô phỏng": công tắc ở đây là công tắc thật của nhà thuốc. */
const SEG_CONSOLE_ALLOWS = { ven: true, shape: true }; /* tenant mẫu: Console đã cho phép cả hai trục */
function SegAxisBar({ venOn, setVenOn, gran, setGran, setToast }) {
  const { Switch } = window.DVMedKingDesignSystem_bf17f8;
  const tile = { flex: '1 1 230px', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '11px 14px', display: 'flex', flexDirection: 'column', gap: 5 };
  const name = { fontWeight: 800, fontSize: 13, fontFamily: 'var(--font-display)', color: 'var(--dv-ink)' };
  const sub = { fontSize: 11, color: 'var(--dv-ink-soft)', lineHeight: 1.45 };
  const allowChip = <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--dv-green)', background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }} title="Console (Dược Vương) đã cho phép trục này cho chuỗi khi khai trương — bật hay tắt là việc của nhà thuốc.">Console cho phép</span>;
  const youChip = (on) => <span style={{ fontSize: 9.5, fontWeight: 700, color: on ? 'var(--dv-green)' : 'var(--dv-ink-faint)', whiteSpace: 'nowrap' }}>{on ? 'bạn đang bật' : 'bạn đang tắt'}</span>;
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
      <div style={tile}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={name}>ABC — giá trị</span><span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '2px 8px', borderRadius: 999 }}>luôn bật · ×3</span></div>
        <div style={sub}>Pareto giá trị bán — trục nền của mọi chuỗi.</div>
      </div>
      {SEG_CONSOLE_ALLOWS.ven && (
      <div style={tile}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span style={name}>VEN — thiết yếu</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {allowChip}{youChip(venOn)}
            <Switch checked={venOn} onChange={(v) => { setVenOn(v); setToast(v ? 'Đã bật trục VEN — số nhóm ×3. Cùng một công tắc với màn Danh mục.' : 'Đã tắt trục VEN — mọi SKU dùng cột E.'); }} />
          </span>
        </div>
        <div style={sub}>Tắt ⇒ bộ máy bỏ qua V/N đã gán, mọi SKU tra cột E. Chưa gán cũng rơi cột E.</div>
      </div>)}
      {SEG_CONSOLE_ALLOWS.shape && (
      <div style={tile}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span style={name}>Hình dạng nhu cầu</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {allowChip}
            <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3 }}>
              {[['off', 'Tắt'], ['b2', '2 bậc'], ['b4', '4 nhóm']].map(([k, l]) => (
                <button key={k} onClick={() => setGran(k)} style={{ border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11.5, background: gran === k ? '#fff' : 'transparent', color: gran === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: gran === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
              ))}
            </span>
          </span>
        </div>
        <div style={sub}>Trục chọn công thức là độ thưa.</div>
      </div>)}
    </div>
  );
}

/* Khối THAM SỐ CỦA PHƯƠNG PHÁP — cuối màn chính sách.
   Không giấu khối Tốc độ khi chuỗi chạy Percentile: kho tổng LUÔN dùng Tốc độ, và cột SS vẫn
   tính từ đệm A/B/C — tham số đổi PHẠM VI áp, không biến mất. */
function SegMethodParams({ cfg, set, setView }) {
  const { Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconArrowRight } = window;
  const pct = cfg.usePercentileEngine === 1;
  const inp = { width: 64, boxSizing: 'border-box', padding: '7px 8px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, textAlign: 'center', outline: 'none', background: '#fff' };
  const box = { flex: '1 1 300px', border: '1px solid var(--border-default)', borderRadius: 12, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9 };
  const lbl = { fontSize: 11, fontWeight: 700, color: 'var(--dv-ink-soft)' };
  /* Vòng 5 — nói ra PHÉP TRỘN, không chỉ nói ra cái tên. `computeAds` chia cửa sổ làm hai
     (14 ngày gần / phần còn lại), tính tốc độ mỗi đoạn rồi trộn: w×gần + (1−w)×trước đó.
     Một cái nhãn "Trọng số gần" không nói được điều đó — và người vận hành thì không đọc
     `lib/engine/ads.ts` để tự suy ra. */
  const wPct = Math.round(Number(cfg.recentWeight) * 100);
  return (
    <SegCard title="Tham số của phương pháp" desc="Tham số đứng cạnh phương pháp dùng nó.">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 12px', borderBottom: '1px solid var(--border-default)', marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)' }}>Sàn Min ≥ 1 cho mặt hàng có bán</span>
        <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>áp sau mọi phương pháp · Max {'<'} 1,3×Min ⇒ nâng 1,5×Min</span>
        <span style={{ marginLeft: 'auto' }}><Switch checked={cfg.minFloorWhenSold === 1} onChange={(v) => set('minFloorWhenSold', v ? 1 : 0)} /></span>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ ...box, borderColor: pct ? 'var(--dv-green-100)' : 'var(--border-default)', background: pct ? 'var(--dv-green-50)' : '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{segMBadge('pct')}<span style={{ fontSize: 10.5, fontWeight: 700, color: pct ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>{pct ? 'đang là mặc định chuỗi' : 'đang tắt ở mặc định'}</span></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.7 }}>Min = P_min[ô](tổng bán cửa sổ Min)<br />Max = P_max[ô](tổng bán cửa sổ Max)</div>
          <div style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>P_min/P_max chỉnh theo Ô trên bản đồ nhóm. Cửa sổ Min/Max tính từ F & LT của chi nhánh.</div>
          <button onClick={() => setView('network')} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '4px 11px', borderRadius: 999, fontWeight: 600, fontSize: 11.5, color: 'var(--dv-green)' }}>Tuyến giao ở Mạng lưới<IconArrowRight size={12} /></button>
        </div>
        <div style={{ ...box, borderColor: !pct ? '#c6d8f0' : 'var(--border-default)', background: !pct ? '#eef4fb' : '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{segMBadge('rate')}<span style={{ fontSize: 10.5, fontWeight: 700, color: '#1d4f8a' }}>luôn áp cho điểm đặt hàng NCC{!pct ? ' · đang là mặc định chuỗi' : ''}</span></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.7 }}>SS = ADS × đệm[A/B/C] · Min = ADS×LT + SS<br />Max = ADS × (LT + R) + SS</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span><div style={lbl}>Cửa sổ (ngày)</div><input type="number" value={cfg.forecastWindow} onChange={(e) => set('forecastWindow', Number(e.target.value))} style={inp} /></span>
            <span><div style={lbl} title={`Bộ máy chia cửa sổ làm hai: ${SEG_RECENT_DAYS} ngày gần nhất và phần còn lại. Ô này là tỉ trọng của đoạn gần khi trộn hai tốc độ.`}>Ưu tiên {SEG_RECENT_DAYS} ngày gần nhất</div><input type="number" step="0.05" min="0" max="1" value={cfg.recentWeight} onChange={(e) => set('recentWeight', Number(e.target.value))} style={inp} /></span>
            {/* Claude Code 2026-09-07 — engine đọc MỘT R chung (`cycle`, ghi đè được theo phạm vi). R theo
                từng NCC chưa tồn tại (◌ nợ ở sổ trạng thái đầu file) nên nhãn không được gọi ô này là
                "dự phòng" — đó là mô tả một hệ chưa có. */}
            <span><div style={lbl} title="Số ngày giữa hai lần đặt hàng. Max phải phủ thời gian chờ hàng CỘNG khoảng trống tới lần đặt kế tiếp.">Chu kỳ đặt R</div><input type="number" value={cfg.cycle} onChange={(e) => set('cycle', Number(e.target.value))} style={inp} /></span>
          </div>
          {/* Câu này là phần đắt nhất của ô trên: nó biến một con số 0–1 thành một câu đọc được,
              và tự đổi theo giá trị đang gõ — không phải một ví dụ chết dán cứng. */}
          <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', lineHeight: 1.55 }}>
            <b style={{ color: 'var(--dv-ink-soft)' }}>{segFmtP(cfg.recentWeight)}</b> = lấy <b style={{ color: 'var(--dv-ink-soft)' }}>{wPct}%</b> theo tốc độ bán của {SEG_RECENT_DAYS} ngày gần nhất, <b style={{ color: 'var(--dv-ink-soft)' }}>{100 - wPct}%</b> theo giai đoạn trước đó. Kéo lên khi nhu cầu đang đổi nhanh (mùa vụ); hạ xuống cho hàng bán đều quanh năm.
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['A', 'B', 'C'].map((a) => <span key={a}><div style={lbl}>Đệm {a} (ngày)</div><input type="number" value={cfg['safety' + a]} onChange={(e) => set('safety' + a, Number(e.target.value))} style={inp} /></span>)}
          </div>
        </div>
      </div>
    </SegCard>
  );
}

/* ════════════ CHÍNH SÁCH THEO LOẠI HÀNG — luật quyết định + bản đồ bấm được ════════════ */
function SegmentPolicy({ cfg, set, setToast, setView, axes, setAxes, auto, setAuto, cadence, setCadence, setDirty, profileName }) {
  const { Button, Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { NUM, IconArrowRight, IconPlus, IconX, IconLock, IconRefresh } = window;
  const Drawer = window.Drawer;
  const venOn = axes.venOn;
  const gran = axes.gran;
  const setVenOn = (v) => { setAxes((a) => ({ ...a, venOn: v })); setDirty(true); };
  const setGran = (g) => { setAxes((a) => ({ ...a, gran: g })); setDirty(true); };
  /* NO_TICKET_YET — lưu luật: đề xuất tenant_setting JSON (ADR-14 nháp ở DVP-596). Luật mẫu theo TRỤC:
     hạng A (bán đều, giá trị cao) → Tốc độ. Claude Code 2026-09-07: luật mẫu per-SKU cũ bỏ cùng ô
     "SKU cụ thể" — ngoại lệ một mã là cờ ở Danh mục (DVP-577). */
  const [exceptions, setExceptions] = React.useState([{ id: 'r1', cond: { abc: 'A' }, method: 'rate', on: true }]);
  /* Số thứ tự luật — bộ đếm ĐƠN ĐIỆU, không phải rs.length: xoá rồi thêm lại cùng điều kiện
     sẽ sinh trùng id (và trùng key React). Giữ trong state để id ổn định qua mỗi lần vẽ lại. */
  const [ruleSeq, setRuleSeq] = React.useState(2); /* r1 đã dùng cho luật mẫu ở trên */
  const [cellSel, setCellSel] = React.useState(null);
  const [rowSel, setRowSel] = React.useState(null);
  const [draft, setDraft] = React.useState(null);
  const [pvOpen, setPvOpen] = React.useState(false);
  const [confirmDel, setConfirmDel] = React.useState(null);
  const defaultMethod = cfg.usePercentileEngine === 1 ? 'pct' : 'rate';
  const floorOn = cfg.minFloorWhenSold === 1;
  const shapeRows = segShapeRows(gran);
  const venCols = segVenCols(venOn);
  const condMatches = (cond, cell) => {
    if (cond.sku) return false; /* luật per-SKU không quyết Ô — nó rút đúng 1 mã khỏi Mặc định */
    if (cond.shape === 'na') return false; /* luật "chưa đủ dữ liệu" quyết nhóm na, không quyết ô */
    if (cond.abc && cond.abc !== cell.abc) return false;
    if (cond.ven && (!venOn || cond.ven !== cell.ven)) return false;
    if (cond.shape && (gran === 'off' || segShapeGroup(cell.shape) !== cond.shape)) return false;
    return true;
  };
  const deciding = (cell) => exceptions.find((r) => r.on && condMatches(r.cond, cell)) || null;
  const naRule = exceptions.find((r) => r.on && r.cond.shape === 'na') || null;
  const allCells = [];
  SEG_ABC.forEach((r) => { venCols.forEach((c) => { shapeRows.forEach((s) => { allCells.push({ abc: r.abc, ven: c.ven, shape: s ? s.key : null, n: segCellCount(r.abc, c.ven, s, venOn, gran) }); }); }); });
  const naCount = segLowDataTotal();
  const skuRuleCount = exceptions.filter((r) => r.on && r.cond.sku).length;
  const ruleCatch = (rule) => {
    if (rule.cond.sku) return 1;
    if (rule.cond.shape === 'na') return rule === naRule ? (rule.cond.abc ? segSplit(SEG_ABC.find((x) => x.abc === rule.cond.abc).skus, rule.cond.abc, 'b2').na : naCount) : 0;
    return allCells.filter((cell) => deciding(cell) === rule).reduce((s, c) => s + c.n, 0);
  };
  /* Trục hình dạng BẬT ⇒ nhóm "chưa đủ dữ liệu" được segSplit tách khỏi allCells, nên phải CỘNG
     lại khi không có luật riêng cho nó. Trục TẮT ⇒ nhóm đó vẫn nằm trong ô A/B/C, đã đếm rồi —
     lúc này có luật riêng thì phải TRỪ ra, nếu không Mặc định và luật "Chưa đủ dữ liệu" cùng
     nhận một đám SKU và tổng vượt quá số mã thật. */
  const defaultCatch = allCells.filter((cell) => !deciding(cell)).reduce((s, c) => s + c.n, 0)
    + (gran !== 'off' && !naRule ? segNaTotal(gran) : 0)
    - (gran === 'off' && naRule ? naCount : 0)
    - skuRuleCount;
  const condChips = (r) => {
    const cond = r.cond;
    if (cond.sku) return [`SKU ${cond.sku}${r.skuName ? ' — ' + r.skuName : ''}`];
    const list = [cond.abc ? `Hạng ${cond.abc}` : null, cond.ven ? (SEG_VEN.find((v) => v.ven === cond.ven) || {}).label : null, cond.shape ? (cond.shape === 'na' ? 'Chưa đủ dữ liệu' : cond.shape === 'thua' ? 'Bán thưa' : 'Bán đều') : null].filter(Boolean);
    return list.length ? list : ['Mọi nhóm'];
  };
  const step = (num, t) => <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '2px 0 8px' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--dv-green)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{num}</span><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14.5, color: 'var(--dv-ink)' }}>{t}</span></div>;
  const ruleRow = (children, style) => <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-default)', flexWrap: 'wrap', ...style }}>{children}</div>;
  const smallInp = { width: 74, boxSizing: 'border-box', padding: '8px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', outline: 'none' };
  const profileChip = <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }}>Hồ sơ: {profileName}</span>;

  return (
    <div>
      <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start', background: 'var(--dv-green-900)', color: '#fff', borderRadius: 'var(--radius-card)', padding: '15px 18px', marginBottom: 16 }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>§</span>
        <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
          <b style={{ color: 'var(--dv-yellow)', fontSize: 13.5 }}>Luật quyết định phương pháp — bản đồ để xem và tinh chỉnh</b> — 3 bước: chọn trục → viết luật → bản đồ nhóm. Muốn đổi phương pháp một nhóm: thêm luật ngoại lệ. Bấm ô trên bản đồ để xem luật đang quyết và chỉnh mức phục vụ của ô.
        </div>
      </div>
      {step(1, 'Chọn trục phân nhóm')}
      <SegAxisBar venOn={venOn} setVenOn={setVenOn} gran={gran} setGran={setGran} setToast={setToast} />
      {step(2, 'Luật chọn phương pháp — áp từ trên xuống')}
      <SegCard title="Luật" desc="Luật đầu tiên khớp sẽ quyết; Mặc định đứng cuối hứng phần còn lại."
        badge={profileChip}>
        {exceptions.map((r) => (
          <React.Fragment key={r.id}>{ruleRow([
            <span key="c" style={{ display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>{condChips(r).map((t) => <React.Fragment key={t}>{segChip(t)}</React.Fragment>)}</span>,
            <IconArrowRight key="a" size={14} />,
            <span key="m">{segMBadge(r.method)}</span>,
            <span key="n" style={{ fontSize: 11.5, color: ruleCatch(r) === 0 ? '#C5372C' : 'var(--dv-ink-faint)', fontWeight: ruleCatch(r) === 0 ? 700 : 400, fontFamily: 'var(--font-mono)' }}>quyết định {NUM(ruleCatch(r))} SKU{ruleCatch(r) === 0 ? ' — luật chết' : ''}</span>,
            <span key="sw" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Switch checked={r.on} onChange={(v) => { setExceptions((rs) => rs.map((x) => x.id === r.id ? { ...x, on: v } : x)); setDirty(true); }} />
              {confirmDel === r.id
                ? <button onClick={() => { setExceptions((rs) => rs.filter((x) => x.id !== r.id)); setConfirmDel(null); setDirty(true); setToast('Đã xoá luật ngoại lệ.'); }} style={{ height: 26, borderRadius: 7, border: '1px solid #EBB8B2', background: '#F8E0DD', cursor: 'pointer', color: '#C5372C', fontSize: 11, fontWeight: 800, padding: '0 9px' }}>Xoá?</button>
                : <button onClick={() => setConfirmDel(r.id)} title="Xoá luật (bấm lần nữa để xác nhận)" style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={14} /></button>}
            </span>,
          ], r.on ? null : { opacity: 0.5 })}</React.Fragment>
        ))}
        {ruleRow([
          <span key="c">{segChip('Mọi nhóm còn lại')}</span>,
          <IconArrowRight key="a" size={14} />,
          <span key="m">{segMBadge(defaultMethod)}</span>,
          <span key="n" style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', fontFamily: 'var(--font-mono)' }}>quyết định {NUM(defaultCatch)} SKU</span>,
          <span key="act" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {defaultMethod === 'pct' && <button onClick={() => setPvOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '5px 11px', borderRadius: 999, fontWeight: 600, fontSize: 11.5, color: 'var(--dv-green)' }}>Ma trận phục vụ<IconArrowRight size={12} /></button>}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--dv-ink-faint)' }}><IconLock size={12} />mặc định chuỗi</span>
          </span>,
        ])}
        <div style={{ padding: '12px 0 2px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" iconRight={<IconPlus size={14} />} onClick={() => setDraft({ abc: '', ven: '', shape: '', sku: '', method: 'rate' })}>Thêm luật ngoại lệ</Button>
          <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Luật dùng trục đang TẮT sẽ bắt 0 SKU cho đến khi bật lại.</span>
        </div>
        <div style={{ borderTop: '1px dashed var(--border-strong)', marginTop: 8, paddingTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', marginBottom: 2 }}>Luật bổ trợ & hệ thống</div>
          {ruleRow([
            <span key="c">{segChip('Có bán trong kỳ')}</span>,
            <IconArrowRight key="a" size={14} />,
            <span key="m" style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--dv-ink)' }}>+ Sàn Min ≥ 1</span>,
            <span key="sw" style={{ marginLeft: 'auto' }}><Switch checked={floorOn} onChange={(v) => set('minFloorWhenSold', v ? 1 : 0)} /></span>,
          ])}
          {/* NO_TICKET_YET — trần đặt theo hạn dùng: engine chưa có khoá lưu (Bản chấm T16) */}
          {ruleRow([
            <span key="c">{segChip('Hàng có shelf-life ngắn')}</span>,
            <IconArrowRight key="a" size={14} />,
            <span key="m" style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--dv-ink)' }}>SL đặt ≤ lượng bán được trước hạn dùng</span>,
            <span key="nb" style={{ fontSize: 10, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '2px 8px', borderRadius: 999 }}>lộ trình</span>,
            <span key="sw" style={{ marginLeft: 'auto' }}><Switch checked={false} onChange={() => setToast('Tính năng đang ở lộ trình — engine chưa có khoá trần theo hạn dùng, cần ticket trước khi bật.')} /></span>,
          ])}
          {/* Viết theo VAI TRÒ, không theo loại điểm: luật thật là "điểm ĐẶT HÀNG NCC dùng Tốc độ,
              điểm NHẬN nội bộ dùng Percentile". Hôm nay kho tổng là thể hiện duy nhất của vai trò
              thứ nhất — nên tên nó đứng trong ngoặc, sau vai trò (khuôn migrations/0001:39). */}
          {ruleRow([
            <span key="c">{segChip('Điểm đặt hàng NCC — mọi SKU')}</span>,
            <IconArrowRight key="a" size={14} />,
            <span key="m">{segMBadge('rate')}</span>,
            <span key="n" style={{ fontSize: 11, color: 'var(--dv-ink-faint)' }}>hiện tại: kho tổng</span>,
            <span key="lk" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--dv-ink-faint)' }}><IconLock size={12} />cố định</span>,
          ], { borderBottom: 'none' })}
        </div>
      </SegCard>
      {step(3, 'Bản đồ nhóm — bấm ô để xem & tinh chỉnh')}
      <SegCard title="Bản đồ nhóm" desc="Màu = phương pháp đang được luật quyết. Bấm ô: xem luật nào quyết, chỉnh mức phục vụ (P_min/P_max) của ô."
        badge={<span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '3px 10px', borderRadius: 999 }}>{segBadgeTxt(venOn, gran)}</span>}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `170px repeat(${venCols.length}, minmax(${venOn ? 150 : 240}px, 1fr))`, gap: 7, minWidth: venOn ? 660 : 440 }}>
            <div />
            {venCols.map((c) => <div key={c.ven} style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: c.tone, paddingBottom: 3 }}>{venOn ? `${c.ven} · ${c.label}` : c.label}</div>)}
            {SEG_ABC.map((r) => (
              <React.Fragment key={r.abc}>
                {shapeRows.map((s, si) => (
                  <React.Fragment key={s ? s.key : 'all'}>
                    <button onClick={() => setRowSel(r.abc)} title="Chỉnh đệm an toàn & nhịp rà của hạng" style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dv-mist)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '8px 11px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: si === 0 ? 'var(--dv-green)' : 'transparent', background: si === 0 ? '#fff' : 'transparent', border: si === 0 ? '1px solid var(--dv-green-100)' : '1px solid transparent', width: 24, height: 24, borderRadius: 7, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{r.abc}</span>
                      <span style={{ minWidth: 0 }}>
                        {s ? <span style={{ fontWeight: 700, fontSize: 12, color: s.tone }}>{s.label}</span> : <span style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--dv-ink)' }}>{r.label}</span>}
                        {si === 0 && <span style={{ display: 'block', fontSize: 10, color: 'var(--dv-ink-faint)' }}>đệm {cfg['safety' + r.abc]}n</span>}
                      </span>
                    </button>
                    {venCols.map((c) => {
                      const cell = { abc: r.abc, ven: c.ven, shape: s ? s.key : null };
                      const n = segCellCount(r.abc, c.ven, s, venOn, gran);
                      const dec = deciding(cell);
                      const m = dec ? dec.method : defaultMethod;
                      const d = SEG_METHODS[m];
                      const isAuto = !!auto[r.abc + c.ven];
                      return (
                        <button key={c.ven} onClick={() => setCellSel(cell)} style={{ textAlign: 'left', cursor: 'pointer', border: `1px solid ${d.bd}`, background: d.bg, borderRadius: 10, padding: '8px 11px', display: 'flex', flexDirection: 'column', gap: 3, opacity: n === 0 ? 0.45 : 1 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: d.tone }}>{d.label}</span>
                            {dec && <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--dv-yellow-600)' }}>• ngoại lệ</span>}
                          </span>
                          {m === 'pct' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--dv-ink)' }}>PV {segFmtP(cfg[segPK('Min', r.abc, c.ven)])}/{segFmtP(cfg[segPK('Max', r.abc, c.ven)])}</span>}
                          <span style={{ fontSize: 10.5, color: 'var(--dv-ink-soft)' }}>{n === 0 ? '0 SKU — ô rỗng' : `${NUM(n)} SKU`}{isAuto ? ' · tự duyệt' : ''}</span>
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            {/* Nhóm này định nghĩa bằng "dưới 2 lần bán", KHÔNG bằng trục hình dạng — nên nó tồn tại
                ở cả hai trạng thái và hàng phải hiện ở cả hai. Trục mặc định đang TẮT, giấu hàng
                này đi là làm SKU mới vô hình đúng trên màn tenant mới mở ra đầu tiên.
                Khác nhau là CHỖ ĐỨNG, và chữ phải nói đúng chỗ đứng đó: trục bật ⇒ segSplit tách
                nhóm ra khỏi các ô; trục tắt ⇒ nhóm vẫn nằm trong các ô A/B/C phía trên. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px dashed var(--border-strong)', borderRadius: 10, padding: '8px 11px' }}>
              <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--dv-ink-soft)' }}>Chưa đủ dữ liệu</span>
            </div>
            <div style={{ gridColumn: `span ${venCols.length}`, border: '1px dashed var(--border-strong)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', background: '#fff' }}>
              <span style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)' }}>{NUM(gran !== 'off' ? segNaTotal(gran) : naCount)} SKU dưới 2 lần bán — {gran !== 'off' ? 'không chia được theo hình dạng, tách riêng khỏi các ô trên' : 'vẫn nằm trong các ô A/B/C ở trên'} → {naRule ? 'luật "Chưa đủ dữ liệu"' : 'luật Mặc định'}</span>
              {segMBadge(naRule ? naRule.method : defaultMethod, true)}
              {naRule && <span style={{ fontSize: 9.5, fontWeight: 700, color: 'var(--dv-yellow-600)' }}>• ngoại lệ</span>}
            </div>
          </div>
        </div>
      </SegCard>
      <SegMethodParams cfg={cfg} set={set} setView={setView} />

      {/* Ma trận phục vụ — CHỈ hiện những ô bộ máy thực sự tra.
          Sự thật engine: trục VEN tắt ⇒ mọi SKU tra VEN_WHEN_UNKNOWN = "E", nên đúng 6 khoá cột E
          còn tác dụng; 12 khoá V/N vẫn ghi được nhưng TRƠ. Bản trước vẽ đủ 18 ô bất kể trục —
          bày ô không ai đọc là hứa một việc không xảy ra.
          Vòng 5: drawer này và drawer của ô là HAI cửa duy nhất vào 18 khoá — bảng phẳng bên
          Sổ tham số đã gỡ. */}
      {pvOpen && (() => {
        const pvCols = venOn ? SEG_VEN : [SEG_VEN[1]];
        const chuaGan = Object.values(SEG_UNASSIGNED).reduce((a, b) => a + b, 0);
        return (
        <Drawer title="Mức phục vụ theo ô — P_min / P_max" sub={`Hồ sơ ${profileName} · tham số của cách tính Percentile · ${pvCols.length * 3 * 2} khoá đang có tác dụng`} onClose={() => setPvOpen(false)}
          footer={<Button variant="primary" size="md" onClick={() => setPvOpen(false)}>Xong</Button>}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', minWidth: venOn ? 360 : 200 }}>
              <thead><tr><th />{pvCols.map((c) => <th key={c.ven} style={{ padding: '6px 9px', fontSize: 11, fontWeight: 700, color: c.tone }}>{venOn ? c.ven : 'Chung (cột E)'}</th>)}</tr></thead>
              <tbody>
                {SEG_ABC.map((r) => (
                  <tr key={r.abc}>
                    <td style={{ padding: '6px 9px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--dv-green)' }}>{r.abc}</td>
                    {pvCols.map((c) => (
                      <td key={c.ven} style={{ padding: '6px 9px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
                          {['Min', 'Max'].map((mm) => <input key={mm} type="number" step="0.5" value={cfg[segPK(mm, r.abc, c.ven)]} onChange={(e) => set(segPK(mm, r.abc, c.ven), Number(e.target.value))} style={{ width: 58, boxSizing: 'border-box', padding: '5px 6px', borderRadius: 7, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, textAlign: 'center', outline: 'none' }} />)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 10 }}>Mỗi ô: dòng trên P_min, dòng dưới P_max.</div>
          {!venOn
            ? <div style={{ marginTop: 12, background: 'var(--dv-mist)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 12px', fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.55 }}>Trục VEN đang tắt nên mọi mặt hàng tra <b style={{ color: 'var(--dv-ink)' }}>cột E</b> — 12 khoá của cột V và N không được đọc tới. Bật trục VEN ở bước 1 (Console đã cho phép) thì hai cột kia hiện ra.</div>
            : <div style={{ marginTop: 12, background: 'var(--dv-mist)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 12px', fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.55 }}>Cột <b style={{ color: 'var(--dv-ink)' }}>V</b> và <b style={{ color: 'var(--dv-ink)' }}>N</b> chỉ áp cho mặt hàng dược sĩ đã gán VEN. {NUM(chuaGan)} mã chưa gán vẫn tra cột E — gán ở Danh mục sản phẩm.</div>}
          <div style={{ marginTop: 10, background: 'var(--dv-yellow-100)', border: '1px solid var(--dv-yellow)', borderRadius: 10, padding: '10px 12px', fontSize: 11.5, color: 'var(--dv-ink)', lineHeight: 1.55 }}>Với hàng bán thưa, <b>luật sàn quyết thay mức phục vụ</b>: đo trên chuỗi thật, 66,7% mặt hàng ra đúng cặp Min 1 / Max 2 do sàn — riêng hạng C là 92%. Chỉnh ô ở đây đổi số rõ nhất tại hạng A.</div>
        </Drawer>
        );
      })()}

      {cellSel && (() => {
        const dec = deciding(cellSel);
        const m = dec ? dec.method : defaultMethod;
        const shapeDef = cellSel.shape ? shapeRows.find((s) => s && s.key === cellSel.shape) : null;
        const n = segCellCount(cellSel.abc, cellSel.ven, shapeDef, venOn, gran);
        const kMin = segPK('Min', cellSel.abc, cellSel.ven), kMax = segPK('Max', cellSel.abc, cellSel.ven);
        /* Mặc định engine đọc từ Settings.jsx qua window (cùng khuôn window.PARAM_PROFILES) —
           chép lại 18 số ở đây là tạo chỗ cho hai bản lệch nhau. */
        const segDef = window.ENGINE_DEFAULTS_38 || {};
        const pDirty = (segDef[kMin] != null && cfg[kMin] !== segDef[kMin]) || (segDef[kMax] != null && cfg[kMax] !== segDef[kMax]);
        return (
          <Drawer title={`Nhóm ${cellSel.abc}${venOn ? ' × ' + cellSel.ven : ''}${shapeDef ? ' × ' + shapeDef.label : ''}`} sub={`${NUM(n)} SKU · phương pháp do luật quyết — mức phục vụ chỉnh tại đây`}
            onClose={() => setCellSel(null)}
            footer={<><Button variant="secondary" size="md" onClick={() => { setDraft({ abc: cellSel.abc, ven: venOn ? cellSel.ven : '', shape: cellSel.shape ? segShapeGroup(cellSel.shape) : '', sku: '', method: 'rate' }); setCellSel(null); }}>Thêm luật cho nhóm này</Button><Button variant="primary" size="md" onClick={() => setCellSel(null)}>Xong</Button></>}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', padding: '2px 0 8px' }}>Luật áp theo thứ tự — luật đậm đang quyết</div>
            {exceptions.filter((r) => r.on && !r.cond.sku).map((r) => {
              const hit = r === dec;
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, marginBottom: 6, background: hit ? 'var(--dv-green-50)' : 'var(--dv-mist)', border: hit ? '1px solid var(--dv-green-100)' : '1px solid transparent', opacity: hit ? 1 : 0.6 }}>
                  <span style={{ display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>{condChips(r).map((t) => <React.Fragment key={t}>{segChip(t)}</React.Fragment>)}</span>
                  <IconArrowRight size={13} />{segMBadge(r.method, true)}
                  {hit && <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 800, color: 'var(--dv-green)' }}>đang quyết</span>}
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 10, background: !dec ? 'var(--dv-green-50)' : 'var(--dv-mist)', border: !dec ? '1px solid var(--dv-green-100)' : '1px solid transparent', opacity: !dec ? 1 : 0.6 }}>
              {segChip('Mặc định')}<IconArrowRight size={13} />{segMBadge(defaultMethod, true)}
              {!dec && <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 800, color: 'var(--dv-green)' }}>đang quyết</span>}
            </div>
            {m === 'pct' && (
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, marginTop: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--dv-ink)', marginBottom: 4 }}>Mức phục vụ (P_min / P_max)</div>
                <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginBottom: 8 }}>Chung cho mọi hình dạng của ô {cellSel.abc}{venOn ? ' × ' + cellSel.ven : ''} — 18 khoá thật của engine, hồ sơ {profileName}.</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="number" step="0.5" value={cfg[kMin]} onChange={(e) => set(kMin, Number(e.target.value))} style={smallInp} />
                  <span style={{ color: 'var(--dv-ink-faint)', fontWeight: 700 }}>/</span>
                  <input type="number" step="0.5" value={cfg[kMax]} onChange={(e) => set(kMax, Number(e.target.value))} style={smallInp} />
                  {/* Lối RA của tầng 1: hai đường xoá ghi đè còn lại đều nằm sau cổng admin, nên
                      không có nút này thì người chỉnh ô không tự về mặc định được. */}
                  {pDirty && <button onClick={() => { set(kMin, segDef[kMin]); set(kMax, segDef[kMax]); setToast('Đã xoá ghi đè — tham số về mặc định hệ thống.'); }} title="Xoá ghi đè — về mặc định hệ thống" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '5px 10px', borderRadius: 999, fontWeight: 600, fontSize: 11.5, color: 'var(--dv-green)' }}><IconRefresh size={12} />về mặc định</button>}
                </div>
                {pDirty && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--dv-yellow-600)', marginTop: 6 }}>• đang khác mặc định ({segFmtP(segDef[kMin])} / {segFmtP(segDef[kMax])})</div>}
              </div>
            )}
            <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 12, marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)' }}>Tự duyệt đơn dưới {Math.round(cfg.approvalThreshold / 1e6)}tr</span>
              <span style={{ fontSize: 11, color: 'var(--dv-ink-faint)' }}>áp cho cả ô {cellSel.abc}{venOn ? ' × ' + cellSel.ven : ''}</span>
              {/* Claude Code 2026-09-07 — Sổ T36 rút 30-08; DVP-590 "chưa kéo tự duyệt vào đợt này": chưa có khoá engine. */}
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '2px 8px', borderRadius: 999 }}>lộ trình</span>
              <span style={{ marginLeft: 'auto' }}><Switch checked={!!auto[cellSel.abc + cellSel.ven]} onChange={(v) => { setAuto((a) => ({ ...a, [cellSel.abc + cellSel.ven]: v })); setToast('Tự duyệt theo ô đang ở lộ trình — engine chưa có khoá, cần ticket trước khi bật thật.'); }} /></span>
            </div>
            {cfg.minFloorWhenSold === 1 && (m === 'pct' || m === 'rate') && <div style={{ marginTop: 12, background: 'var(--dv-yellow-100)', border: '1px solid var(--dv-yellow)', borderRadius: 10, padding: '9px 12px', fontSize: 11.5, color: 'var(--dv-ink)', lineHeight: 1.5 }}><b>Sàn Min ≥ 1 đang bật</b> — với SKU bán thưa, sàn có thể quyết thay phương pháp.</div>}
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--dv-ink-soft)', lineHeight: 1.55 }}>{SEG_METHODS[m].hint}.</div>
          </Drawer>
        );
      })()}

      {rowSel && (() => {
        const r = SEG_ABC.find((x) => x.abc === rowSel);
        return (
          <Drawer title={`Hàng ${r.abc} — ${r.label}`} sub={`${NUM(r.skus)} SKU · ${r.gt}% giá trị`} onClose={() => setRowSel(null)}
            footer={<Button variant="primary" size="md" onClick={() => setRowSel(null)}>Xong</Button>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 13.5 }}>Đệm an toàn (ngày)</span>
              <input type="number" value={cfg['safety' + r.abc]} onChange={(e) => set('safety' + r.abc, Number(e.target.value))} style={smallInp} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 13.5 }}>Nhịp rà soát (ngày) <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '2px 8px', borderRadius: 999, verticalAlign: 'middle' }} title="Sổ T36 rút 30-08 — engine chưa có khoá nhịp rà theo hạng.">lộ trình</span></span>
              <input type="number" value={cadence[r.abc]} onChange={(e) => { setCadence((c) => ({ ...c, [r.abc]: Number(e.target.value) })); setToast('Nhịp rà theo hạng đang ở lộ trình — chưa có khoá engine, số này chưa lưu.'); }} style={smallInp} />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 8 }}>Mốc xếp hạng ABC (≤80% · ≤95%) là chuẩn Pareto cố định.</div>
          </Drawer>
        );
      })()}

      {draft && (
        <Drawer title="Thêm luật ngoại lệ" sub="Điều kiện bỏ trống = áp cho mọi giá trị của trục đó" onClose={() => setDraft(null)}
          footer={<><Button variant="secondary" size="md" onClick={() => setDraft(null)}>Huỷ</Button><Button variant="primary" size="md" onClick={() => { const cond = {}; const skuIn = (draft.sku || '').trim(); if (skuIn) { cond.sku = skuIn.toUpperCase(); } else { if (draft.abc) cond.abc = draft.abc; if (draft.ven) cond.ven = draft.ven; if (draft.shape) cond.shape = draft.shape; } const id = 'r' + ruleSeq; setRuleSeq((n) => n + 1); setExceptions((rs) => [{ id, cond, method: draft.method, on: true }, ...rs]); setDraft(null); setDirty(true); setToast('Đã thêm luật — xem số SKU nó quyết ở danh sách.'); }}>Thêm luật</Button></>}>
          {/* Claude Code 2026-09-07 — ô "SKU cụ thể" (T15) đã bỏ: luật chỉ theo TRỤC. Ngoại lệ cho MỘT mã
              (Min–Max tay · Không tự động) là cờ per-SKU ở màn Danh mục (DVP-577, Jet chốt T09 31-08) —
              hai chỗ ghi đè cho một mã là hai chỗ để lệch. Lời dẫn dưới đây trỏ đúng nhà của nó. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 13, padding: '9px 12px', borderRadius: 10, background: 'var(--dv-mist)', border: '1px solid var(--border-default)', fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>
            <span>Luật đặt theo trục phân nhóm. Cần ngoại lệ cho <b>một mã</b> (Min–Max tay · Không tự động)? Đó là cờ của mã ở Danh mục.</span>
            <button onClick={() => { setDraft(null); setView('products'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '4px 11px', borderRadius: 999, fontWeight: 600, fontSize: 11.5, color: 'var(--dv-green)' }}>Danh mục sản phẩm<IconArrowRight size={12} /></button>
          </div>
          {[['Hạng giá trị (ABC)', 'abc', [['A', 'A — giá trị cao'], ['B', 'B'], ['C', 'C — đuôi dài']], false, ''],
            ['Thiết yếu (VEN)', 'ven', [['V', 'V — sống còn'], ['E', 'E — thiết yếu'], ['N', 'N — thông thường']], !venOn, 'trục đang tắt'],
            ['Hình dạng nhu cầu', 'shape', [['deu', 'Bán đều'], ['thua', 'Bán thưa'], ['na', 'Chưa đủ dữ liệu (dưới 2 lần bán)']], false, '']].map(([label, field, opts, disAll, note]) => (
            <div key={field} style={{ marginBottom: 13, opacity: draft.sku.trim() ? 0.45 : 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--dv-ink)', marginBottom: 5 }}>{label}{disAll && <span style={{ fontSize: 11, color: 'var(--dv-ink-faint)', fontWeight: 500 }}> — {note}</span>}</div>
              <select value={draft[field]} disabled={disAll || !!draft.sku.trim()} onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))} style={{ boxSizing: 'border-box', padding: '9px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, outline: 'none', background: '#fff', width: '100%', opacity: disAll ? 0.5 : 1 }}>
                <option value="">Mọi</option>
                {opts.map(([v, l]) => {
                  const optDis = field === 'shape' ? (v !== 'na' && gran === 'off') : false;
                  return <option key={v} value={v} disabled={optDis}>{l}{optDis ? ' — trục đang tắt' : ''}</option>;
                })}
              </select>
            </div>
          ))}
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--dv-ink)', margin: '2px 0 3px' }}>Phương pháp cho nhóm khớp luật</div>
          <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginBottom: 7 }}>Chỉ hai phương pháp theo nhóm. <b>Min–Max tay</b> và <b>Không tự động</b> là cờ của từng mã, đặt ở màn <b>Danh mục</b> — không phải luật.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {Object.entries(SEG_METHODS).filter(([k]) => !SEG_PER_SKU.has(k) || draft.sku.trim()).map(([k, d]) => (
              <button key={k} onClick={() => setDraft((dr) => ({ ...dr, method: k }))} style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, border: draft.method === k ? `1.5px solid ${d.tone}` : '1px solid var(--border-default)', background: draft.method === k ? d.bg : '#fff' }}>
                {segMBadge(k, true)}<span style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)' }}>{d.hint}</span>
              </button>
            ))}
          </div>
        </Drawer>
      )}
    </div>
  );
}
window.SegmentPolicy = SegmentPolicy;

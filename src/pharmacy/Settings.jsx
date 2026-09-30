/* Pharmacy — CÀI ĐẶT, mô hình 3 TẦNG (dựng lại 2026-08-25; chốt phương án 2026-08-26):
     TẦNG 1 · CHÍNH SÁCH — màn "Chính sách theo loại hàng" (SettingsSegments.jsx →
       SegmentPolicy): khung LUẬT quyết định (phương án B cũ, Jet duyệt 2026-08-26 theo
       Bản chấm 36 case) + BẢN ĐỒ NHÓM bấm được nhập từ phương án A. Phương án A đã xoá.
       Các mục cũ "Theo loại hàng" / "Cách tính Min/Max" / "Phân nhóm & công thức" đã GỘP
       vào màn này. Còn lại: FEFO/Stockdays · Duyệt · Điều chuyển · Thông báo.
     TẦNG 2 · HỒ SƠ VẬN HÀNH — chỉ trỏ link (Mạng lưới · Danh mục · NCC).
     TẦNG 3 · KỸ THUẬT (Dược Vương) — SỔ KIỂM: bảng 20 khoá ngoài ma trận, ngưỡng phân loại
       khoá, what-if, lịch engine (chỉ đọc), công thức Q. Gate role admin.

   ── VÒNG 5 (2026-08-28) — Jet chốt 3 điểm sau khi đọc lại hai tab ──────────────────────
   1. MA TRẬN ABC×VEN CHỈ CÒN MỘT NHÀ. Trước đây 18 khoá percentile sửa được từ BA cửa: bấm ô
      trên bản đồ · drawer "Mức phục vụ theo ô" · và 18 dòng phẳng trong bảng Sổ tham số. Ba cửa
      cho một việc thì không ai biết cửa nào là chỗ đúng. Bảng phẳng là cửa TỆ NHẤT để sửa một
      ma trận — `P_min A × V` cách `P_min A × E` hai dòng và người đọc phải tự dựng lại lưới
      trong đầu. Nay bảng Sổ chỉ còn MỘT dòng trỏ sang bản đồ, kèm số ô đang khác mặc định
      (suy từ ENGINE_DEFAULTS_38, không đếm tay). Bảng còn 20 khoá.
   2. GHI ĐÈ THEO PHẠM VI — GỠ KHỎI PROTOTYPE. Không phải vì thừa chỗ: [đo prod 2026-08-28]
      `engine_param` có 5 hàng, TẤT CẢ `global` — chưa tenant nào từng đặt một ghi đè hẹp nào.
      Và với 20 khoá (18 ô mức phục vụ + `usePercentileEngine` + `allowLateral`) thì engine đọc
      bằng NGỮ CẢNH RỖNG, tức ghi được mà không bao giờ có tác dụng (DVP-556 chưa chốt hướng).
      Bày một mặt UI cho việc đó là hứa một việc không xảy ra. Chip "N ghi đè đang sống" ở tab
      Chính sách gỡ cùng lượt — nó trỏ vào đúng khối này.
   3. "Trọng số gần" → "Ưu tiên 14 ngày gần nhất" (xem SettingsSegments.jsx).
   Kèm: DOI → Stockdays trên mọi nhãn (DVP-565, đã ship ở code thật).

   ── SỔ TRẠNG THÁI — ● có khoá engine thật · ◌ NỢ (cần ticket DVP) ──
   ● 18 khoá pMinAV…pMaxCN (sửa ở tab Chính sách) · usePercentileEngine · minFloorWhenSold ·
     safetyA/B/C · cycle · forecastWindow · recentWeight · fefoTierT1/T2/T3 · fefoBufferDays ·
     overstockDays · doiTargetDays · doiCriticalDays · approvalThreshold · approvalTwoLevel ·
     priceTolerancePct · priceExpiryWarnDays · allowLateral (đủ 38) ·
     notificationMutedTypes (tenant_setting, admin).
   ◌ Sổ nợ của màn chính sách: xem đầu SettingsSegments.jsx. Riêng màn này: khoá công nợ NCC ·
     thanh hồ sơ tham số (schema sẵn, web chưa gửi profileId) · cờ trục phân nhóm (axes —
     đề xuất tenant_feature classify.*, chia sẻ với Console).
   🔒 Ngưỡng phân loại (ABC 80/95 · ADI 1,32 · CV² 0,49 · XYZ 0,5/1,0): hằng số công bố. */

/* ── Claude Code 2026-09-07 — ba chỗ sửa THEO CODE (DVP-175 việc 2·3·4; epic DVP-600) ──
   2. Điều chuyển nội bộ: công tắc allowLateral đã DỜI sang Mạng lưới nguồn bù (DVP-573, Q3) — ở đây chỉ
      còn trạng thái + đường trỏ; Sổ tham số cũng vẽ khoá đó thành dòng trỏ (MOVED_KEYS), không công tắc.
   3. Ghi đè theo phạm vi TRỞ LẠI tầng Kỹ thuật, thu gọn đúng 7 khoá SCOPE_AWARE_KEYS (DVP-556 hướng A
      chốt 29-08; code giữ DVP-484/604; Sổ T34 ●) — ScopeOverridesCompact ở SettingsAdvanced.jsx.
   4. Tự duyệt theo ô / nhịp rà theo hạng: chip "lộ trình" (Sổ T36 rút 30-08) — không gieo ô nào tự duyệt. */

const numInp = { width: 84, boxSizing: 'border-box', padding: '9px 11px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, outline: 'none', textAlign: 'right', color: 'var(--dv-ink)', background: '#fff' };

function Field({ label, hint, children, suffix }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, padding: '16px 0', borderBottom: '1px solid var(--border-default)' }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)' }}>{label}</div>
        {hint && <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 3, lineHeight: 1.45, maxWidth: '52ch' }}>{hint}</div>}
      </div>
      <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>{children}{suffix && <span style={{ fontSize: 13, color: 'var(--dv-ink-soft)', fontWeight: 600 }}>{suffix}</span>}</div>
    </div>
  );
}

function NumField({ label, hint, value, onChange, suffix, min, max, step, width }) {
  return <Field label={label} hint={hint} suffix={suffix}><input type="number" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} style={{ ...numInp, width: width || 84 }} /></Field>;
}

function SecCard({ title, desc, badge, children }) {
  return (
    <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: '6px 24px 12px', marginBottom: 18 }}>
      <div style={{ padding: '16px 0 6px', display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0 }}>{title}</h3>
        {badge}
      </div>
      {desc && <p style={{ fontSize: 13, color: 'var(--dv-ink-soft)', margin: '0 0 4px', maxWidth: '68ch' }}>{desc}</p>}
      {children}
    </section>
  );
}

/* ── 38 khoá engine — đúng ENGINE_DEFAULTS của lib/engine/params.ts ── */
const ENGINE_DEFAULTS_38 = {
  forecastWindow: 60, recentWeight: 0.6, cycle: 7, safetyA: 5, safetyB: 7, safetyC: 10,
  minFloorWhenSold: 0, usePercentileEngine: 0,
  fefoTierT1: 90, fefoTierT2: 60, fefoTierT3: 30, fefoBufferDays: 7, overstockDays: 90,
  doiTargetDays: 30, doiCriticalDays: 7,
  approvalThreshold: 20000000, approvalTwoLevel: 100000000, priceTolerancePct: 2, priceExpiryWarnDays: 14,
  allowLateral: 1,
  pMinAV: 99, pMaxAV: 97.5, pMinAE: 97.5, pMaxAE: 95, pMinAN: 95, pMaxAN: 95,
  pMinBV: 99, pMaxBV: 97.5, pMinBE: 95, pMaxBE: 95, pMinBN: 90, pMaxBN: 90,
  pMinCV: 99, pMaxCV: 97.5, pMinCE: 90, pMaxCE: 85, pMinCN: 85, pMaxCN: 85,
};
/* Màn Chính sách (SettingsSegments.jsx) đọc mặc định qua window để nút "về mặc định" của một ô
   so được với đúng bộ số này — cùng khuôn window.PARAM_PROFILES, thay vì chép lại 18 số. */
window.ENGINE_DEFAULTS_38 = ENGINE_DEFAULTS_38;
/* 18 khoá của ma trận — SUY từ bộ mặc định, không kê tay: thêm một trục sau này thì chỗ đếm
   "bao nhiêu ô đang khác mặc định" tự đi theo. */
const PCT_KEYS = Object.keys(ENGINE_DEFAULTS_38).filter((k) => k.indexOf('pMin') === 0 || k.indexOf('pMax') === 0);
/* Tenant mẫu đã chỉnh 2 khoá (khớp đo ntvmed: engine_param = 2 hàng) */
const TENANT_OVERRIDES = { usePercentileEngine: 1, minFloorWhenSold: 1 };

/* ── bảng SỔ KIỂM (tầng 3) — 20 khoá NGOÀI ma trận ────────────────────────────────────────
   18 khoá percentile cố ý KHÔNG có ở đây (vòng 5): chúng là một ma trận 2 chiều, và bảng phẳng
   là hình thức tệ nhất để đọc một ma trận. Nhà của chúng là bản đồ ở tab Chính sách; bảng này
   chỉ còn một dòng trỏ sang, kèm số ô đang lệch. */
const PARAM_GROUPS = [
  ['Dự trù & dự báo', [
    ['forecastWindow', 'Cửa sổ dự báo', 'ngày'],
    ['recentWeight', 'Ưu tiên 14 ngày gần nhất', '0–1'],
    ['cycle', 'Chu kỳ đặt hàng (R)', 'ngày'],
    ['safetyA', 'Đệm an toàn nhóm A', 'ngày'],
    ['safetyB', 'Đệm an toàn nhóm B', 'ngày'],
    ['safetyC', 'Đệm an toàn nhóm C', 'ngày'],
    ['minFloorWhenSold', 'Sàn Min ≥ 1 khi có bán', '', true],
    ['usePercentileEngine', 'Cách tính Percentile (chi nhánh)', '', true],
  ]],
  ['Quá tồn & cận hạn', [
    ['fefoTierT1', 'FEFO bậc 1 — cận date', 'ngày'],
    ['fefoTierT2', 'FEFO bậc 2 — sắp hết hạn', 'ngày'],
    ['fefoTierT3', 'FEFO bậc 3 — nguy cấp', 'ngày'],
    ['fefoBufferDays', 'Vùng cách ly trước HSD', 'ngày'],
    ['overstockDays', 'Ngưỡng quá tồn', 'ngày'],
    ['doiTargetDays', 'Stockdays mục tiêu', 'ngày'],
    ['doiCriticalDays', 'Stockdays nguy cấp', 'ngày'],
  ]],
  ['Duyệt & quy trình', [
    ['approvalThreshold', 'Ngưỡng cần duyệt', '₫'],
    ['approvalTwoLevel', 'Ngưỡng duyệt 2 cấp', '₫'],
    ['priceTolerancePct', 'Dung sai giá 3-way', '%'],
    ['priceExpiryWarnDays', 'Báo trước giá hết hạn', 'ngày'],
  ]],
  ['Điều chuyển', [
    ['allowLateral', 'Luân chuyển ngang CH ↔ CH', '', true],
  ]],
];

/* Claude Code 2026-09-07 — khoá ĐÃ DỜI (DVP-573; code: MOVED_PARAM_KEYS ở lib/views/engine-settings.ts):
   Sổ kiểm vẫn liệt kê để không thiếu khoá, nhưng vẽ thành dòng trỏ — không có mặt ghi thứ hai. */
const MOVED_KEYS = { allowLateral: ['network', 'chỉnh ở Điểm bán & Mạng lưới › Mạng lưới nguồn bù'] };

const NOTIFY_TYPES = [
  ['stockout', 'Thiếu hàng — tồn dưới Min', 'Chi nhánh có SKU rơi dưới điểm đặt lại.'],
  ['expiry', 'Lô cận hạn & quá tồn', 'Tổng hợp lô cần xử lý theo thang FEFO.'],
  ['approval', 'Đơn chờ duyệt', 'Có đề xuất mua / điều chuyển chờ ký.'],
  ['rfq', 'SLA báo giá (RFQ)', 'RFQ sắp hết hạn mà chưa đủ báo giá.'],
  ['missing-supplier', 'SKU chưa có nhà cung cấp', 'Hàng cần mua nhưng chưa gắn NCC nào.'],
];

/* ── nav: 3 tầng ── */
const SETTINGS_NAV = [
  { group: 'Chính sách', items: [
    ['policy', 'Chính sách theo loại hàng', 'IconScale'],
    ['fefo', 'Quá tồn & cận hạn', 'IconHourglass'],
    ['approval', 'Duyệt & quy trình', 'IconClipboardCheck'],
    ['transfer', 'Điều chuyển nội bộ', 'IconTransfer'],
    ['notify', 'Thông báo', 'IconBell'],
  ] },
  { group: 'Vận hành', items: [
    ['ops', 'Hồ sơ vận hành', 'IconStore'],
    /* Jack 2026-09-04 — "Kết nối hệ thống" thôi là dòng sidebar riêng, về làm một tab của Cài đặt:
       nó là cấu hình của tenant như mọi mục khác ở đây, và nằm cạnh "Lịch chạy engine" thì nhịp
       đồng bộ với nguồn dữ liệu đọc liền một mạch. Route 'connectors' vẫn còn để link cũ không chết. */
    ['connectors', 'Kết nối hệ thống', 'IconPlug'],
  ] },
  { group: 'Kỹ thuật', items: [['advanced', 'Sổ tham số & công cụ', 'IconLock']] },
];

/* ── TẦNG 3 — bảng khoá: Mặc định / Hiện tại / • đã chỉnh / ↺ xoá ghi đè ──
   ↺ = op:'clear' (xoá hàng override, KHÔNG ghi giá trị mới) — đúng hành vi clearEngineParam. */
function ParamTable({ cfg, set, reset }) {
  const { Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconRefresh } = window;
  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-default)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 560, fontFamily: 'var(--font-body)' }}>
        <thead><tr style={{ background: 'var(--dv-mist)' }}>
          {['Tham số', 'Mặc định', 'Hiện tại', ''].map((h, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : 'center', padding: '9px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {PARAM_GROUPS.map(([group, rows]) => (
            <React.Fragment key={group}>
              <tr><td colSpan={4} style={{ padding: '9px 14px', background: 'var(--dv-green-50)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-green)', borderTop: '1px solid var(--border-default)' }}>{group}</td></tr>
              {rows.map(([key, label, suffix, isToggle]) => {
                const changed = cfg[key] !== ENGINE_DEFAULTS_38[key];
                return (
                  <tr key={key} style={{ borderTop: '1px solid var(--border-default)', background: changed ? 'var(--dv-yellow-100)' : '#fff' }}>
                    <td style={{ padding: '9px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--dv-ink)' }}>{label}</span>
                        {changed && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)' }}>• đã chỉnh</span>}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{key}</div>
                    </td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{String(ENGINE_DEFAULTS_38[key])}{suffix ? ' ' + suffix : ''}</td>
                    <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                      {MOVED_KEYS[key]
                        ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{cfg[key] === 1 ? 'Bật' : 'Tắt'} · <span style={{ color: 'var(--dv-green)' }}>{MOVED_KEYS[key][1]}</span></span>
                        : isToggle
                        ? <Switch checked={cfg[key] === 1} onChange={(v) => set(key, v ? 1 : 0)} />
                        : <input type="number" value={cfg[key]} onChange={(e) => set(key, Number(e.target.value))} style={{ width: key.indexOf('approval') === 0 ? 110 : 74, boxSizing: 'border-box', padding: '7px 8px', borderRadius: 8, border: changed ? '1px solid var(--dv-yellow-600)' : '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, textAlign: 'center', outline: 'none', background: '#fff' }} />}
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'center' }}>
                      {changed && !MOVED_KEYS[key] && <button onClick={() => reset(key)} title="Xoá ghi đè — về mặc định hệ thống (op: clear, không ghi giá trị mới)" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '5px 10px', borderRadius: 999, fontWeight: 600, fontSize: 11.5, color: 'var(--dv-green)' }}><IconRefresh size={12} />mặc định</button>}
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Dòng TRỎ ĐƯỜNG thay cho 18 dòng phẳng đã gỡ (vòng 5). Nó phải nói được HAI thứ mà một dòng
   "xem ở chỗ khác" thường thiếu: ma trận có đang lệch mặc định không, và lệch mấy ô — nếu không
   thì Sổ KIỂM mất đúng cái nó sinh ra để trả lời ("chỗ nào đang khác mặc định"). */
function PercentilePointer({ cfg, goto }) {
  const { IconGrid, IconArrowRight } = window;
  const changed = PCT_KEYS.filter((k) => cfg[k] !== ENGINE_DEFAULTS_38[k]).length;
  const Icon = IconGrid || window.IconLayers;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border-default)', background: 'var(--dv-mist)', flexWrap: 'wrap' }}>
      <span style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon size={18} /></span>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)' }}>Mức phục vụ theo ô (ABC × VEN) — {PCT_KEYS.length} khoá</div>
        <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 2, lineHeight: 1.5 }}>
          Sửa trên <b>bản đồ nhóm</b> ở mục Chính sách, không phải ở đây: bảng phẳng bắt người đọc tự dựng lại lưới trong đầu.
        </div>
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: '4px 11px', whiteSpace: 'nowrap', color: changed ? 'var(--dv-yellow-600)' : 'var(--dv-ink-faint)', background: changed ? 'var(--dv-yellow-100)' : '#fff' }}>
        {changed ? `${changed} ô đang khác mặc định` : 'đúng mặc định cả bảng'}
      </span>
      <button onClick={goto} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)', whiteSpace: 'nowrap' }}>Mở bản đồ<IconArrowRight size={14} /></button>
    </div>
  );
}

function LockedThresholds() {
  const { IconLock } = window;
  const ROWS = [
    ['Xếp hạng ABC (Pareto)', 'A ≤ 80% · B ≤ 95% giá trị bán cộng dồn'],
    ['Độ thưa — ADI', '≥ 1,32 = thưa (Syntetos–Boylan 2005)'],
    ['Độ loạn lượng — CV²', '≥ 0,49 = loạn (tính trên những ngày có bán)'],
    ['XYZ trên b = √CV²', 'X < 0,5 ≤ Y < 1,0 ≤ Z'],
  ];
  return (
    <div>
      {ROWS.map(([l, v]) => (
        <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border-default)' }}>
          <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconLock size={15} /></span>
          <span style={{ flex: 1, fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)' }}>{l}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{v}</span>
        </div>
      ))}
      <p style={{ fontSize: 12, color: 'var(--dv-ink-faint)', margin: '10px 0 4px', lineHeight: 1.55 }}>Ngưỡng công bố, giữ nguyên để kết quả đối chiếu được với tài liệu ngành — không mở thành knob. Cần khác đi cho một tenant đặc thù ⇒ quyết định riêng có hồ sơ, không chỉnh tay.</p>
    </div>
  );
}

/* ── TẦNG 2 — hồ sơ vận hành: chỉ trỏ đường ── */
function OpsPanel({ setView }) {
  const { IconStore, IconLayers, IconTag, IconArrowRight } = window;
  const CARDS = [
    { icon: IconStore, title: 'Tuyến giao & chu kỳ rà theo chi nhánh', view: 'network', desc: 'F (lượt giao/tuần) và LT (ngày) của từng điểm bán — thuộc tính của tuyến kho → chi nhánh, quyết định cửa sổ Min/Max của cách tính Percentile.' },
    { icon: IconLayers, title: 'MOQ · quy cách · phân loại VEN theo SKU', view: 'products', desc: 'Dược sĩ gán VEN và chỉnh MOQ/quy cách ngay trên Danh mục — lọc một nhóm rồi gán cả lô.' },
    { icon: IconTag, title: 'Leadtime & bảng giá theo nhà cung cấp', view: 'suppliers', desc: 'Leadtime, MOQ và giá là thuộc tính của cặp (NCC, SKU) — khai ở hồ sơ nhà cung cấp, không đặt mặc định cấp chuỗi.' },
  ];
  return (
    <>
      <div style={{ background: 'var(--dv-green-900)', color: '#fff', borderRadius: 'var(--radius-card)', padding: '16px 20px', marginBottom: 18, fontSize: 13, lineHeight: 1.6 }}>
        Đây là <b style={{ color: 'var(--dv-yellow)' }}>sự thật vận hành</b>, không phải tham số: chúng đổi khi thực tế đổi (mở chi nhánh, đổi NCC), không phải khi đổi ý. Vì vậy chúng được khai ở màn nghiệp vụ tương ứng và bộ máy tự đọc — Cài đặt chỉ trỏ đường.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
        {CARDS.map((c) => (
          <div key={c.view} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-sm)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><c.icon size={19} /></span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, color: 'var(--dv-ink)' }}>{c.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5, flex: 1 }}>{c.desc}</div>
            <button onClick={() => setView(c.view)} style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' }}>Mở màn<IconArrowRight size={14} /></button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ──────────── màn chính ──────────── */
function SettingsScreen({ setToast, setView, role, lastSync, setLastSync, onSync, syncing }) {
  const { PageHeader } = window;
  const { Button, Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconAlertTriangle, IconCheckCircle, IconSparkles, IconLock, IconRefresh } = window;
  const [sec, setSec] = React.useState('policy');
  const [dirty, setDirty] = React.useState(false);
  const [activeProfile, setActiveProfile] = React.useState('default');
  const [histOpen, setHistOpen] = React.useState(false);
  const [whatIf, setWhatIf] = React.useState(false);
  const [cfg, setCfg] = React.useState({ ...ENGINE_DEFAULTS_38, ...TENANT_OVERRIDES });
  /* MỘT state cờ trục cho toàn màn (T04) — mặc định TẮT, bật là opt-in (T29).
     DVP-568 — nơi lưu thật: tenant_feature classify.* (lib/tenant/features.ts:60), nay do Console
     nắm quyền ghi; DVP-568 chuyển về admin nhà thuốc. */
  const [axes, setAxes] = React.useState({ venOn: false, gran: 'off' });
  /* Chỉ gieo ô CHẠM TỚI ĐƯỢC ở trạng thái mặc định. Trục VEN tắt ⇒ bản đồ chỉ vẽ cột E, nên khoá
     hợp lệ là AE/BE/CE. Hai ô cũ BN và CN là ngoại lệ nằm ngủ: không ai thấy để tắt, mà đúng ngày
     Console bật VEN thì chúng tự có hiệu lực dù chưa ai khai. Đừng "khôi phục" chúng. */
  /* Claude Code 2026-09-07 — KHÔNG gieo ô nào nữa: tự duyệt theo ô là lộ trình (Sổ T36 rút 30-08),
     drawer ô mang chip "lộ trình" và không đánh dấu dirty. */
  const [auto, setAuto] = React.useState({}); // lộ trình — tự duyệt theo ô
  const [cadence, setCadence] = React.useState({ A: 30, B: 90, C: 180 }); // NO_TICKET_YET — nhịp rà theo hàng
  const [notifyMuted, setNotifyMuted] = React.useState({});
  const [providerMode, setProviderMode] = React.useState(false);
  const [customFormula, setCustomFormula] = React.useState(window.FORMULA_DEFAULT);
  const set = (k, v) => { setCfg((c) => ({ ...c, [k]: v })); setDirty(true); };
  const reset = (k) => { setCfg((c) => ({ ...c, [k]: ENGINE_DEFAULTS_38[k] })); setDirty(true); setToast('Đã xoá ghi đè — tham số về mặc định hệ thống.'); };
  /* [T35] Lưu tham số PHẢI đẩy mốc "Số liệu" — hệ thật làm đúng vậy (`applyPlanAffectingChange`,
     lib/app/engine-params.ts: tính lại chứ không chỉ xoá bộ nhớ đệm). Trước đây hai toast dưới đây
     khẳng định "đã tính lại" trong khi mốc trên thanh trên cùng đứng yên — prototype nói sai về hệ. */
  const nhichMocSoLieu = () => { if (!setLastSync) return; const d = new Date(); const p2 = (n) => String(n).padStart(2, '0'); setLastSync(`${p2(d.getHours())}:${p2(d.getMinutes())} · ${p2(d.getDate())}-${p2(d.getMonth() + 1)}`); };
  const save = () => { setDirty(false); nhichMocSoLieu(); setToast('Đã lưu tham số — kế hoạch đã tính lại ngay.'); };
  const applyWhatIf = () => { setWhatIf(false); setDirty(false); nhichMocSoLieu(); setToast('Đã áp dụng — một lượt ghi, một lần tính lại kế hoạch.'); };
  const isAdmin = role === 'admin';
  const profileName = ((window.PARAM_PROFILES || []).find((p) => p.id === activeProfile) || { name: 'Mặc định' }).name;
  /* shim cho FormulaEditor/dvOptsFor (cần serviceLevel/methodByClass cũ — giữ tương thích CalcEngine) */
  const calcCfg = { ...cfg, serviceLevel: 95 };
  const calcMethod = { A: 'ropmax', B: 'ropmax', C: 'ropmax' };
  const calcTerms = { inTransit: true };

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1180, margin: '0 auto' }}>
      <PageHeader title="Cài đặt" subtitle="Chính sách theo loại hàng — lưu là tính lại kế hoạch ngay."
        actions={<>{/* Jack 2026-09-04 — dời từ thanh trên cùng: lượt đồng bộ đứng cạnh "Lịch chạy
            engine" (mục Đồng bộ & tính toán bên dưới) và cạnh Lưu, vì cả ba đều làm kế hoạch tính lại. */}
          <button onClick={onSync} disabled={syncing} title="Kéo dữ liệu từ ERP/POS rồi tính lại đề xuất" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: syncing ? 'default' : 'pointer', padding: '8px 15px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color: 'var(--dv-green)' }}>
            <span style={{ display: 'inline-flex', animation: syncing ? 'dvSpin 0.9s linear infinite' : 'none' }}><IconRefresh size={16} /></span>{syncing ? 'Đang đồng bộ…' : 'Đồng bộ & tính toán'}
          </button>
          {dirty
          ? <><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--dv-yellow-600)', fontWeight: 700 }}><IconAlertTriangle size={15} />Có thay đổi chưa lưu</span><Button variant="secondary" size="sm" iconRight={<IconSparkles size={15} />} onClick={() => setWhatIf(true)}>Chạy thử</Button><Button variant="primary" size="sm" onClick={save}>Lưu</Button></>
          : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--dv-green-bright)', fontWeight: 700 }}><IconCheckCircle size={15} />Đã đồng bộ tham số</span>}</>} />

      {lastSync && <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--dv-ink-faint)', fontWeight: 600, margin: '-4px 0 10px' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--dv-green-bright)' }} />Số liệu tính gần nhất <span style={{ fontFamily: 'var(--font-mono)' }}>{lastSync}</span></div>}
      <window.ProfileBar activeProfile={activeProfile} setActiveProfile={setActiveProfile} onHistory={() => setHistOpen(true)} setToast={setToast} />

      <div style={{ display: 'grid', gridTemplateColumns: '232px 1fr', gap: 24, alignItems: 'start' }}>
        {/* sub-nav — 3 tầng hiện ngay trên nav */}
        <nav style={{ position: 'sticky', top: 86, background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: 8 }}>
          {SETTINGS_NAV.map((g) => (
            <div key={g.group}>
              <div style={{ padding: '10px 13px 4px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--dv-ink-faint)' }}>{g.group}</div>
              {g.items.map(([k, label, icon]) => {
                const on = sec === k; const Icon = window[icon];
                return (
                  <button key={k} onClick={() => setSec(k)} style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 13px', border: 'none', cursor: 'pointer', textAlign: 'left', borderRadius: 10, marginBottom: 2, fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 500, fontSize: 13.5, background: on ? 'var(--dv-green-50)' : 'transparent', color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>
                    {on && <span style={{ position: 'absolute', left: 0, top: 9, bottom: 9, width: 3, borderRadius: 999, background: 'var(--dv-yellow)' }} />}
                    <span style={{ color: on ? 'var(--dv-green)' : 'var(--dv-ink-faint)', display: 'inline-flex' }}><Icon size={17} /></span>{label}
                    {k === 'advanced' && !isAdmin && <span style={{ marginLeft: 'auto', fontSize: 9.5, fontWeight: 700, color: 'var(--dv-ink-faint)' }}>admin</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div>
          {sec === 'policy' && <window.SegmentPolicy cfg={cfg} set={set} setToast={setToast} setView={setView} axes={axes} setAxes={setAxes} auto={auto} setAuto={setAuto} cadence={cadence} setCadence={setCadence} setDirty={setDirty} profileName={profileName} />}

          {sec === 'fefo' && (
            <>
              <SecCard title="Thang xử lý cận hạn (FEFO)" desc="Mỗi bậc gắn một hành động đề xuất — lô xếp theo số ngày còn lại tới hạn dùng.">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    ['fefoTierT1', 'Bậc 1 — Cận date', 'Đề xuất chuyển sang điểm bán nhanh', 'IconTransfer', 'yellow'],
                    ['fefoTierT2', 'Bậc 2 — Sắp hết hạn', 'Đề xuất đẩy bán / ưu tiên xuất', 'IconTag', 'yellow'],
                    ['fefoTierT3', 'Bậc 3 — Nguy cấp', 'Xử lý tay: trả NCC / huỷ có biên bản', 'IconAlertTriangle', 'red'],
                    ['fefoBufferDays', 'Vùng cách ly trước hạn dùng', 'Cách ly khỏi bán + ghi nhận huỷ', 'IconLock', 'red'],
                  ].map(([key, label, action, icon, tone]) => {
                    const Icon = window[icon];
                    const col = tone === 'red' ? '#C5372C' : 'var(--dv-yellow-600)';
                    const bg = tone === 'red' ? '#F8E0DD' : 'var(--dv-yellow-100)';
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--border-default)' }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: bg, color: col, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon size={18} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)' }}>{label}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 2 }}>→ {action}</div>
                        </div>
                        <input type="number" value={cfg[key]} onChange={(e) => set(key, Number(e.target.value))} style={numInp} />
                        <span style={{ fontSize: 13, color: 'var(--dv-ink-soft)', fontWeight: 600, width: 40 }}>ngày</span>
                      </div>
                    );
                  })}
                </div>
              </SecCard>
              <SecCard title="Quá tồn & số ngày tồn (Stockdays)" desc="Nhận diện vốn ứ và mốc băng màu trên Tồn kho / Tổng quan.">
                <NumField label="Ngưỡng quá tồn" hint="SKU có số ngày tồn vượt mức này xếp vào “quá tồn” / vốn ứ." value={cfg.overstockDays} onChange={(v) => set('overstockDays', v)} suffix="ngày" min={30} max={365} />
                <NumField label="Stockdays mục tiêu" hint="Mốc “đủ hàng” trên thanh Stockdays — tồn lý tưởng đủ bán bao nhiêu ngày." value={cfg.doiTargetDays} onChange={(v) => set('doiTargetDays', v)} suffix="ngày" min={1} max={120} />
                <NumField label="Stockdays nguy cấp" hint="Dưới mốc này = “Thấp / Khẩn” (thanh đỏ)." value={cfg.doiCriticalDays} onChange={(v) => set('doiCriticalDays', v)} suffix="ngày" min={1} max={30} />
              </SecCard>
            </>
          )}

          {sec === 'approval' && (
            <SecCard title="Duyệt & quy trình" desc="Ngưỡng giá trị và quy tắc phê duyệt đơn mua / điều chuyển.">
              <Field label="Ngưỡng giá trị cần duyệt" hint="Đơn từ mức này trở lên bắt buộc qua phê duyệt.">
                <input type="number" value={cfg.approvalThreshold} onChange={(e) => set('approvalThreshold', Number(e.target.value))} style={{ ...numInp, width: 140 }} /><span style={{ fontSize: 13, color: 'var(--dv-ink-soft)', fontWeight: 600 }}>₫</span>
              </Field>
              <Field label="Bắt buộc 2 cấp duyệt trên" hint="Đơn vượt mức này cần thêm phê duyệt của cấp quản lý.">
                <input type="number" value={cfg.approvalTwoLevel} onChange={(e) => set('approvalTwoLevel', Number(e.target.value))} style={{ ...numInp, width: 140 }} /><span style={{ fontSize: 13, color: 'var(--dv-ink-soft)', fontWeight: 600 }}>₫</span>
              </Field>
              <NumField label="Dung sai giá khi nhập kho (3-way)" hint="Giá hoá đơn lệch trong ±x% so đơn mua được tự thông qua; vượt → phiếu chênh lệch chờ duyệt." value={cfg.priceTolerancePct} onChange={(v) => set('priceTolerancePct', v)} suffix="%" min={0} max={20} />
              <NumField label="Báo trước khi giá NCC hết hạn" hint="Cửa sổ báo sớm để kịp gửi yêu cầu báo giá lại — báo khi đã hết hạn là báo muộn." value={cfg.priceExpiryWarnDays} onChange={(v) => set('priceExpiryWarnDays', v)} suffix="ngày" min={0} max={90} />
              {/* NO_TICKET_YET — supplier.debt_limit có dữ liệu, luật chặn chưa có (fit/gap: giữ + mở ticket) */}
              <Field label="Khoá đơn vượt hạn mức công nợ NCC" hint="Không cho gửi đơn nếu vượt hạn mức công nợ còn lại của nhà cung cấp.">
                <Switch checked={false} onChange={() => setToast('Tính năng đang ở lộ trình — cần quyết định nghiệp vụ trước khi bật.')} />
              </Field>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0 6px' }}>
                <span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Tự duyệt đơn nhỏ theo từng loại hàng → bản đồ nhóm (bấm ô)</span>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '2px 8px', borderRadius: 999 }} title="Sổ T36 rút 30-08 — engine chưa có khoá tự duyệt theo ô; DVP-590: chưa kéo vào đợt này.">lộ trình</span>
                <button onClick={() => setSec('policy')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '5px 12px', borderRadius: 999, fontWeight: 600, fontSize: 12, color: 'var(--dv-green)' }}>Chính sách theo loại hàng →</button>
              </div>
            </SecCard>
          )}

          {sec === 'transfer' && (
            <SecCard title="Điều chuyển nội bộ" desc="Cân bằng tồn giữa các điểm bán trước khi nhập hàng mới.">
              {/* Claude Code 2026-09-07 — DVP-573 đã DỜI công tắc sang Điểm bán & Mạng lưới › Mạng lưới nguồn bù
                  (Q3, DVP-600). Ở đây chỉ còn TRẠNG THÁI + đường trỏ: hai mặt ghi cho một khoá là hai chỗ để lệch. */}
              <Field label="Cho phép luân chuyển ngang CH ↔ CH" hint="Cho chuyển thẳng giữa hai cửa hàng, không bắt buộc qua kho tổng. Bật/tắt ở Mạng lưới nguồn bù — Cài đặt chỉ phản chiếu.">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 11px', borderRadius: 999, whiteSpace: 'nowrap', color: cfg.allowLateral === 1 ? 'var(--dv-green)' : 'var(--dv-ink-faint)', background: cfg.allowLateral === 1 ? 'var(--dv-green-50)' : 'var(--dv-mist)' }}>{cfg.allowLateral === 1 ? 'Đang bật' : 'Đang tắt'} · {cfg.allowLateral === ENGINE_DEFAULTS_38.allowLateral ? 'mặc định' : 'đã chỉnh'}</span>
                  <button onClick={() => setView('network')} style={{ border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontWeight: 600, fontSize: 12.5, color: 'var(--dv-green)', whiteSpace: 'nowrap' }}>Mạng lưới →</button>
                </span>
              </Field>
              {/* Sửa theo Bản chấm T28: ghi chú cũ phủ nhận chính tab "Mạng lưới nguồn bù" —
                  thứ tự nguồn bù LÀ cấu hình được per điểm đích (engine sourceRank, DVP-496). */}
              <div style={{ padding: '14px 0 6px', fontSize: 12.5, color: 'var(--dv-ink-faint)', lineHeight: 1.55, maxWidth: '62ch' }}>Ưu tiên dùng tồn nội bộ trước khi mua là hành vi cố định của bộ máy. Thứ tự nguồn bù <b style={{ color: 'var(--dv-ink-soft)' }}>mặc định</b>: kho tổng trước · điểm dư sau — tuỳ chỉnh cho từng điểm nhận tại <b style={{ color: 'var(--dv-ink-soft)' }}>Điểm bán & Mạng lưới → tab Mạng lưới nguồn bù</b>.</div>
            </SecCard>
          )}

          {sec === 'notify' && (
            <SecCard title="Thông báo" desc="Loại cảnh báo hiện trên chuông trong ứng dụng. Chỉ quản trị viên chỉnh được.">
              {/* Câu "chỉ quản trị viên chỉnh được" ở trên là một LUẬT, nên phải có chốt chặn —
                  trước đây nó chỉ là chữ, mọi vai trò đều gạt được công tắc. Cùng khuôn gate với
                  mục Sổ tham số bên dưới (isAdmin). */}
              {!isAdmin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 2px', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}
                  title="Khoá notificationMutedTypes nằm ở tenant_setting, đường ghi chỉ mở cho vai trò admin của chuỗi.">
                  <IconLock size={14} /> Vai trò hiện tại chỉ xem — nhờ quản trị viên của chuỗi bật/tắt giúp.
                </div>
              )}
              {NOTIFY_TYPES.map(([k, label, hint]) => (
                <Field key={k} label={label} hint={hint}>
                  <span style={{ display: 'inline-flex', ...(isAdmin ? null : { pointerEvents: 'none', opacity: 0.55 }) }}>
                    <Switch checked={!notifyMuted[k]} onChange={(v) => { setNotifyMuted((m) => ({ ...m, [k]: !v })); setDirty(true); }} />
                  </span>
                </Field>
              ))}
              <Field label="Lỗi đồng bộ dữ liệu" hint="Luôn bật — mất đồng bộ là mọi con số phía sau đều cũ, nên loại này không tắt được.">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '3px 10px', borderRadius: 999 }}>luôn bật</span>
                  <span style={{ pointerEvents: 'none', opacity: 0.55 }}><Switch checked={true} onChange={() => {}} /></span>
                </span>
              </Field>
            </SecCard>
          )}

          {sec === 'ops' && <OpsPanel setView={setView} />}

          {sec === 'connectors' && <window.ConnectorsPanel setToast={setToast} />}

          {sec === 'advanced' && (!isAdmin ? (
            <SecCard title="Sổ tham số & công cụ">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 0 22px', color: 'var(--dv-ink-soft)', fontSize: 13.5 }}>
                <IconLock size={18} /> Mục này dành cho quản trị viên & đội kỹ thuật Dược Vương — vai trò hiện tại không có quyền ghi tham số. (Đổi vai trò ở thanh trên để xem.)
              </div>
            </SecCard>
          ) : (
            <>
              <SecCard title="Sổ tham số"
                badge={<span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', padding: '3px 10px', borderRadius: 999 }}>sổ kiểm</span>}>
                <div style={{ padding: '6px 0 14px' }}><ParamTable cfg={cfg} set={set} reset={reset} /></div>
                <div style={{ padding: '0 0 16px' }}><PercentilePointer cfg={cfg} goto={() => setSec('policy')} /></div>
              </SecCard>
              {/* Claude Code 2026-09-07 — DVP-175 việc 3: khối này TRỞ LẠI (vòng 5 gỡ vì "20 khoá đọc ngữ cảnh rỗng");
                  nay đường ghi thật chặn đúng 7 khoá SCOPE_AWARE_KEYS (DVP-556 hướng A) nên mặt UI không còn hứa suông. */}
              <SecCard title="Ghi đè theo phạm vi" desc="Một điểm bán, một nhóm hàng hoặc một SKU chạy số khác toàn chuỗi — chỉ 7 khoá bộ máy đọc theo ngữ cảnh."
                badge={<span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', padding: '3px 10px', borderRadius: 999 }}>7 khoá</span>}>
                <div style={{ padding: '6px 0 14px' }}><window.ScopeOverridesCompact cfg={cfg} setDirty={setDirty} setToast={setToast} /></div>
              </SecCard>
              <SecCard title="Ngưỡng phân loại — khoá" desc="Mốc xếp hạng ABC và ngưỡng hình dạng nhu cầu.">
                <LockedThresholds />
              </SecCard>
              <SecCard title="Chạy thử (what-if)" desc="Xem trước tác động của bộ tham số đang sửa — không ghi gì cho đến khi Áp dụng.">
                <div style={{ padding: '10px 0 16px' }}>
                  <Button variant="secondary" size="md" iconRight={<IconSparkles size={15} />} onClick={() => setWhatIf(true)}>Mở bảng chạy thử</Button>
                </div>
              </SecCard>
              <SecCard title="Lịch chạy engine" desc="Chỉ đọc — kế hoạch tính lại theo nhịp đồng bộ của connector, không có lịch riêng từng tác vụ.">
                <window.EngineScheduleSection setToast={setToast} setView={setView} lastSync={lastSync} />
              </SecCard>
              <SecCard title="Công thức Q (chế độ kỹ thuật)" desc="Chỉ hiện khi máy chủ bật MEDOPS_PROVIDER_MODE=1 — dành riêng đội Dược Vương. Công tắc dưới mô phỏng cờ đó để duyệt thiết kế.">
                <Field label="Mô phỏng MEDOPS_PROVIDER_MODE=1" hint="Trong hệ thật đây là biến môi trường theo máy chủ, không phải công tắc của tenant.">
                  <Switch checked={providerMode} onChange={setProviderMode} />
                </Field>
                {providerMode && (
                  <div style={{ padding: '14px 0' }}>
                    <window.FormulaEditor cfg={calcCfg} methodByClass={calcMethod} terms={calcTerms} seasonalFactor={1} formula={customFormula} setFormula={setCustomFormula} onDirty={() => setDirty(true)} setToast={setToast} />
                  </div>
                )}
              </SecCard>
            </>
          ))}
        </div>
      </div>

      {whatIf && <window.WhatIfDrawer cfg={cfg} onClose={() => setWhatIf(false)} onApply={applyWhatIf} />}
      {histOpen && <window.ParamHistoryDrawer onClose={() => setHistOpen(false)} setToast={setToast} />}
    </div>
  );
}
window.SettingsScreen = SettingsScreen;

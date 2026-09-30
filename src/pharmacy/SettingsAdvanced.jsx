/* Pharmacy — Settings advanced widgets: profiles (N3), what-if preview (N2),
   engine schedule — READ-ONLY (N4/DVP-371), param history (N7).
   Each attaches to window and is composed by SettingsScreen.

   2026-08-25 — dựng lại theo mô hình Cài đặt 3 TẦNG (xem đầu file Settings.jsx):
   · WhatIfDrawer đọc khoá THẬT của engine (doiTargetDays · safetyC · pMinAE) thay cho
     serviceLevel/budgetCap — hai khoá KHÔNG tồn tại trong ENGINE_DEFAULTS.
     Chạy thử không ghi; “Áp dụng” = MỘT request nhiều khoá, MỘT lần tính lại (fix lỗi 37
     request tuần tự đo được ở fit/gap ntvmed §C).
   · EngineScheduleSection thành CHỈ-ĐỌC: phản chiếu nhịp đồng bộ của connector (DVP-371).
     3 ô select lịch riêng của bản cũ là núm không có nơi lưu — không bảng nào giữ giờ chạy,
     không scheduler nào đọc. Chữ trên màn nói theo NĂNG LỰC (connector nguồn bán); tên hãng
     chỉ đứng trong ngoặc ở vị trí pilot — không lặp lại lỗi `kind === "odoo"`.
   · ProfileBar: ◌ NỢ UI — schema sẵn (engine_param.profile_id + valid_from/to, migration 0001;
     tRPC đã nhận profileId), chỉ web chưa gửi. Giữ nguyên thiết kế. T13: hồ sơ có lịch (valid_to)
     hết hạn tự quay về "Mặc định"; hồ sơ "Mặc định" áp quanh năm, kích hoạt tay.

   ── VÒNG 5 (2026-08-28) — Jet chốt ────────────────────────────────────────────────
   · `ScopeOverrideTable` (N1) ĐÃ GỠ. Lý do không phải "thừa chỗ": [đo prod 2026-08-28]
     `engine_param` có 5 hàng, TẤT CẢ `global` — chưa tenant nào từng đặt một ghi đè hẹp nào.
     Và với 20 khoá (18 ô mức phục vụ + `usePercentileEngine` + `allowLateral`) thì engine đọc
     bằng NGỮ CẢNH RỖNG — ghi được mà không bao giờ có tác dụng (DVP-556 chưa chốt hướng).
     Bày một mặt UI cho việc đó là hứa một việc không xảy ra. Cần lại thì dựng theo hướng
     chốt ở 556 — bản cũ còn nguyên ở `_backup-2026-08-28/`.
   · DOI → Stockdays trên mọi nhãn (DVP-565).

   ── VÒNG 7 (2026-08-30) — Jet chốt: GIỮ thanh hồ sơ + Lịch sử, BỎ hoàn tác ────────
   Thanh hồ sơ ở lại: nó tự khai nợ đúng cách (chip "lộ trình" nhìn thấy được + toast nói
   thẳng ở mọi hành động), tức đang làm ĐÚNG chứ không phải màn hứa suông — tôi đã đề xuất
   gỡ nó và đó là đề xuất sai. Nút "Khôi phục" từng dòng lịch sử thì GỠ — không vì nó nói
   dối (toast của nó cũng khai nợ), mà vì sản phẩm thật đang XOÁ hẳn đường ghi hoàn tác
   (DVP-569): giữ nó trên hình vẽ là vẽ một tính năng sắp không còn tồn tại.
   Bảng lịch sử ở lại nguyên vẹn.

   ── Claude Code 2026-09-07 — GHI ĐÈ THEO PHẠM VI trở lại, THU GỌN (DVP-175 việc 3) ──
   Vòng 5 gỡ vì "20 khoá được đọc bằng ngữ cảnh rỗng". Từ 29-08 (DVP-556 hướng A) đường ghi thật CHẶN mọi
   khoá ngoài 7 khoá SCOPE_AWARE_KEYS (forecastWindow · recentWeight · cycle · safetyA/B/C · minFloorWhenSold)
   — ghi được là có tác dụng. Code đang có khối này ở tầng Kỹ thuật (DVP-484/604, Sổ T34 ●), chọn phạm vi
   bằng TÊN + MÃ (UX-04) — prototype vẽ đúng hình đó: ScopeOverridesCompact ở cuối file. */

/* ============ N3 + N7 — ProfileBar ============ */
const PARAM_PROFILES = [
  { id: 'default', name: 'Mặc định', range: 'Quanh năm', note: 'Bộ tham số nền', color: 'var(--dv-green)' },
  { id: 'flu', name: 'Mùa cao điểm (cúm)', range: '01/10 – 31/12', note: 'Cửa sổ 30n · đệm hô hấp · phục vụ cao', color: '#1d4f8a' },
  { id: 'tet', name: 'Tết Nguyên đán', range: '20/01 – 20/02', note: 'Tích trữ trước nghỉ · đệm +50%', color: '#9c2b22' },
];
const PARAM_HISTORY = [
  { at: '23/08/2026 · 09:12', by: 'Trần Thị Mai', change: 'Ô A×E: P_min 97,5 → 98', profile: 'Mặc định', tone: 'edit' },
  { at: '11/08/2026 · 16:40', by: 'Vũ Minh Đức', change: 'Bật “Sàn Min ≥ 1 khi có bán”', profile: 'Mặc định', tone: 'edit' },
  { at: '02/08/2026 · 08:05', by: 'Vũ Minh Đức', change: 'Bật cách tính Percentile cho tầng chi nhánh', profile: 'Mặc định', tone: 'edit' },
  { at: '15/05/2026 · 11:20', by: 'Trần Thị Mai', change: 'Kích hoạt hồ sơ “Mùa cao điểm”', profile: 'Mùa cao điểm', tone: 'profile' },
  /* Vòng 5: mục cũ ở đây là một ghi đè theo điểm bán ("Ghi đè DOI Dược Vương Q.1 = 20 ngày").
     Ghi đè theo phạm vi đã gỡ khỏi màn, nên một dòng lịch sử nhắc tính năng đó sẽ để người đọc
     đi tìm một ô không còn tồn tại. Thay bằng một thay đổi có thật trên bản đồ nhóm. */
  { at: '02/05/2026 · 14:33', by: 'Nguyễn Văn Bình', change: 'Ô C×E: P_max 85 → 87', profile: 'Mặc định', tone: 'edit' },
];

function ProfileBar({ activeProfile, setActiveProfile, onHistory, setToast }) {
  const { IconLayers, IconCalendar, IconPlus, IconClock, IconChevronDown } = window;
  const [open, setOpen] = React.useState(false);
  const active = PARAM_PROFILES.find((p) => p.id === activeProfile) || PARAM_PROFILES[0];
  const ref = React.useRef(null);
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: '12px 16px', marginBottom: 18, position: 'relative', overflow: 'visible', flexWrap: 'wrap' }}>
      <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: active.color, borderTopLeftRadius: 'var(--radius-card)', borderBottomLeftRadius: 'var(--radius-card)' }} />
      <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconLayers size={19} /></span>
      <div style={{ minWidth: 0 }}>
        {/* Thanh này là ◌ NỢ UI trọn vẹn (xem đầu file): đổi hồ sơ chỉ đổi cái nhãn, nhân bản
            chỉ hiện toast. Nợ đó phải ĐỌC ĐƯỢC TRÊN MÀN như mọi chỗ khác trong bộ này —
            chip "lộ trình" + toast nói thẳng, chứ không diễn cho giống đã chạy. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)' }}>Hồ sơ tham số đang áp dụng
          <span title="Web chưa gửi profileId — đổi hồ sơ và nhân bản chưa nối vào tham số thật. Schema đã sẵn (engine_param.profile_id + valid_from/to)." style={{ fontSize: 10, fontWeight: 800, textTransform: 'none', letterSpacing: 0, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>lộ trình</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)' }}>{active.name}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--dv-ink-soft)', fontWeight: 600 }}><IconCalendar size={13} />{active.range}</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{active.id === 'default' ? 'Áp quanh năm — kích hoạt tay' : `Theo lịch ${active.range} — hết hạn tự quay về "Mặc định"`}</div>
      </div>
      <div ref={ref} style={{ position: 'relative', marginLeft: 'auto' }}>
        <button onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--dv-ink)' }}>
          Đổi hồ sơ<span style={{ display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', color: 'var(--dv-ink-faint)' }}><IconChevronDown size={15} /></span>
        </button>
        {open && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 320, background: '#fff', borderRadius: 14, border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)', padding: 7, zIndex: 40 }}>
            {PARAM_PROFILES.map((p) => {
              const on = p.id === activeProfile;
              return (
                <button key={p.id} onClick={() => { setActiveProfile(p.id); setOpen(false); setToast(`Hồ sơ "${p.name}" đang ở lộ trình — mới đổi được cái nhãn, tham số chưa đổi theo.`); }} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 11, padding: '11px 12px', border: 'none', cursor: 'pointer', borderRadius: 10, background: on ? 'var(--dv-green-50)' : 'transparent' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: p.color, marginTop: 5, flex: 'none' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)' }}>{p.name}</span>{on && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: '#fff', border: '1px solid var(--dv-green-100)', padding: '1px 6px', borderRadius: 999 }}>ĐANG DÙNG</span>}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{p.range} · {p.note}</span>
                  </span>
                </button>
              );
            })}
            <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 5, paddingTop: 5 }}>
              <button onClick={() => { setOpen(false); setToast('Nhân bản hồ sơ đang ở lộ trình — chưa có biểu mẫu đặt tên & khoảng hiệu lực.'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', border: 'none', cursor: 'pointer', borderRadius: 10, background: 'transparent', fontWeight: 600, fontSize: 13, color: 'var(--dv-green)' }}><IconPlus size={16} />Nhân bản hồ sơ mới…</button>
            </div>
          </div>
        )}
      </div>
      <button onClick={onHistory} title="Lịch sử thay đổi tham số" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '8px 13px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--dv-ink-soft)' }}><IconClock size={15} />Lịch sử</button>
    </div>
  );
}
window.ProfileBar = ProfileBar;
window.PARAM_PROFILES = PARAM_PROFILES;

/* ============ N7 — Param history drawer ============ */
function ParamHistoryDrawer({ onClose }) {
  const Drawer = window.Drawer;
  const { IconClock, IconLayers } = window;
  /* Tông 'scope' đã bỏ cùng lượt gỡ ghi đè theo phạm vi (vòng 5) — giữ một nhánh màu cho một
     loại sự kiện không còn sinh ra được là để lại một nhánh chết. */
  const toneMap = { edit: ['var(--dv-mist)', 'var(--dv-ink-soft)', 'IconClock'], profile: ['var(--dv-green-50)', 'var(--dv-green)', 'IconLayers'] };
  return (
    <Drawer title="Lịch sử thay đổi tham số" sub="Ai · khi nào · giá trị cũ → mới" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PARAM_HISTORY.map((h, i) => {
          const [bg, fg, icon] = toneMap[h.tone] || toneMap.edit; const Icon = window[icon];
          return (
            <div key={i} style={{ display: 'flex', gap: 13, padding: '14px 0', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon size={16} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dv-ink)' }}>{h.change}</div>
                <div style={{ fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{h.by} · {h.at} · hồ sơ <b style={{ color: 'var(--dv-ink-soft)' }}>{h.profile}</b></div>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 16, lineHeight: 1.5 }}>Mỗi thay đổi được ghi vào Nhật ký chung — chỉ thêm, không sửa, không xoá.</p>
    </Drawer>
  );
}
window.ParamHistoryDrawer = ParamHistoryDrawer;

/* ============ N2 — What-if preview drawer ============ */
function WhatIfDrawer({ cfg, onClose, onApply }) {
  const Drawer = window.Drawer;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { VND } = window;
  const { IconTrendUp, IconTrendDown, IconSparkles, IconArrowRight } = window;
  // baseline = bộ tham số đang áp dụng (Stockdays 30 · đệm C 10 · P_min A×E 97,5); Δ minh hoạ.
  const base = { lines: 64, value: 418000000, shortage: 37, overstock: 48 };
  const doiD = (Number(cfg.doiTargetDays) - 30);
  const safetyD = (Number(cfg.safetyC) - 10);
  const slD = (Number(cfg.pMinAE) - 97.5) * 2;
  const next = {
    lines: Math.max(0, Math.round(base.lines + slD * 3 + doiD * 1 + safetyD * 1.5)),
    value: Math.max(0, Math.round(base.value + slD * 9000000 + doiD * 4200000 + safetyD * 5000000)),
    shortage: Math.max(0, Math.round(base.shortage - slD * 1.5 - doiD * 0.6 - safetyD * 0.8)),
    overstock: Math.max(0, Math.round(base.overstock + doiD * 0.8 + safetyD * 1.2)),
  };
  const Row = ({ label, from, to, fmt, goodDir }) => {
    const delta = to - from; const up = delta > 0;
    const good = goodDir === 'up' ? up : goodDir === 'down' ? !up : null;
    const col = delta === 0 ? 'var(--dv-ink-faint)' : good ? 'var(--dv-green-bright)' : '#C5372C';
    const Arrow = up ? IconTrendUp : IconTrendDown;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--dv-ink)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-faint)' }}>{fmt(from)}</div>
        <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconArrowRight size={14} /></span>
        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 15, color: 'var(--dv-ink)', minWidth: 72, textAlign: 'right' }}>{fmt(to)}</div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, minWidth: 56, justifyContent: 'flex-end', fontSize: 12, fontWeight: 700, color: col }}>{delta !== 0 && <Arrow size={13} />}{delta === 0 ? '—' : `${up ? '+' : ''}${fmt(delta)}`}</span>
      </div>
    );
  };
  return (
    <Drawer title="Chạy thử tham số (what-if)" sub="Chạy thử không ghi gì — chỉ “Áp dụng” mới ghi: một lượt, một lần tính lại"
      onClose={onClose}
      footer={<><Button variant="secondary" size="md" onClick={onClose}>Hủy</Button><Button variant="primary" size="md" iconRight={<IconArrowRight size={15} />} onClick={onApply}>Áp dụng tham số này</Button></>}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--dv-green-900)', color: '#fff', borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconSparkles size={18} /></span>
        <div style={{ fontSize: 12.5, lineHeight: 1.55 }}>Mô phỏng trên dữ liệu kỳ hiện tại với <b style={{ color: 'var(--dv-yellow)' }}>Stockdays {cfg.doiTargetDays}n</b> · <b style={{ color: 'var(--dv-yellow)' }}>đệm C {cfg.safetyC}n</b> · <b style={{ color: 'var(--dv-yellow)' }}>P_min A×E {String(cfg.pMinAE).replace('.', ',')}</b>. So với bộ tham số đang áp dụng.</div>
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '0 0 6px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-faint)' }}>
        <span style={{ flex: 1 }}>Chỉ số</span><span>Hiện tại</span><span style={{ width: 22 }} /><span style={{ minWidth: 72, textAlign: 'right' }}>Dự kiến</span><span style={{ minWidth: 56, textAlign: 'right' }}>Δ</span>
      </div>
      <Row label="Dòng hàng cần nhập" from={base.lines} to={next.lines} fmt={(n) => String(n)} goodDir="none" />
      <Row label="Giá trị mua dự kiến" from={base.value} to={next.value} fmt={(n) => VND(n)} goodDir="none" />
      <Row label="Điểm thiếu hàng" from={base.shortage} to={next.shortage} fmt={(n) => String(n)} goodDir="down" />
      <Row label="SKU quá tồn" from={base.overstock} to={next.overstock} fmt={(n) => String(n)} goodDir="down" />
    </Drawer>
  );
}
window.WhatIfDrawer = WhatIfDrawer;

/* ============ N4 — Engine schedule: CHỈ ĐỌC (DVP-371) ============ */
function EngineScheduleSection({ setToast, setView, lastSync }) {
  const { IconPlug, IconCheckCircle, IconCalculator, IconArrowRight } = window;
  const syncLabel = lastSync || '16:04 · 23-08';
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderBottom: '1px solid var(--border-default)', flexWrap: 'wrap' }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconPlug size={19} /></span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)' }}>Connector nguồn bán & tồn kho <span style={{ fontWeight: 500, color: 'var(--dv-ink-faint)' }}>(pilot: KiotViet)</span></div>
          <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>Đồng bộ gần nhất <b style={{ color: 'var(--dv-ink-soft)' }}>{syncLabel}</b> · chu kỳ 180 phút · <span style={{ color: 'var(--dv-green-bright)', fontWeight: 700 }}>thành công</span></div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--dv-green-50)', color: 'var(--dv-green)', borderRadius: 999, padding: '5px 12px', fontSize: 11.5, fontWeight: 700 }}><IconCheckCircle size={14} />đang hoạt động</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 0', borderBottom: '1px solid var(--border-default)', flexWrap: 'wrap' }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconCalculator size={19} /></span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)' }}>Tính lại kế hoạch (dự trù · điều chuyển · FEFO)</div>
          <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>Chạy ngay sau mỗi lượt đồng bộ thành công và sau mỗi lần lưu tham số — không có lịch riêng cho từng tác vụ.</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--dv-mist)', color: 'var(--dv-ink-soft)', borderRadius: 999, padding: '5px 12px', fontSize: 11.5, fontWeight: 700 }}>tự động · chỉ đọc</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingTop: 14, flexWrap: 'wrap' }}>
        {/* [T35] Bỏ nút "Đồng bộ ngay" ở đây (Jet chốt 2026-08-29 — lược bỏ thứ trùng): nó chỉ bắn
            một thông báo, trong khi nút thật "Đồng bộ & tính toán" đã nằm sẵn trên thanh trên cùng
            ở MỌI màn. Hai nút cho một việc là hai chỗ để lệch nhau, và cái ở đây là cái giả. */}
        <button onClick={() => setView && setView('connectors')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '9px 16px', borderRadius: 999, fontWeight: 600, fontSize: 13, color: 'var(--dv-green)' }}>Kết nối hệ thống<IconArrowRight size={14} /></button>
        <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Đổi chu kỳ / thông tin kết nối ở màn Kết nối hệ thống.</span>
      </div>
    </div>
  );
}
window.EngineScheduleSection = EngineScheduleSection;

/* ============ Ghi đè theo phạm vi — THU GỌN (Claude Code 2026-09-07, DVP-175 việc 3) ============
   Khớp app/(portal)/settings/_scope-overrides.tsx: phạm vi chọn bằng TÊN + MÃ (điểm bán từ danh sách
   chi nhánh, nhóm hàng từ Danh mục, SKU gõ mã hoặc tên có gợi ý — UX-04); giá trị gửi đi là MÃ. Chỉ 7 khoá
   SCOPE_AWARE_KEYS — bộ máy phân giải hẹp-thắng: SKU › nhóm hàng › điểm bán › toàn chuỗi.
   Gỡ = op:'clear' (xoá hàng), KHÁC "đặt lại bằng mặc định": hàng vẫn nằm đó thì đổi số toàn chuỗi sau này
   sẽ lặng lẽ không áp cho phạm vi ấy. */
const SCOPE_KEYS_7 = [
  ['forecastWindow', 'Cửa sổ dự báo', 'ngày'],
  ['recentWeight', 'Ưu tiên 14 ngày gần nhất', '0–1'],
  ['cycle', 'Chu kỳ đặt hàng (R)', 'ngày'],
  ['safetyA', 'Đệm an toàn nhóm A', 'ngày'],
  ['safetyB', 'Đệm an toàn nhóm B', 'ngày'],
  ['safetyC', 'Đệm an toàn nhóm C', 'ngày'],
  ['minFloorWhenSold', 'Sàn Min ≥ 1 khi có bán', '0/1'],
];
/* Dữ liệu mẫu — hệ thật đọc danh sách chi nhánh (màn Mạng lưới), nhóm hàng (Danh mục) và tìm SKU qua
   GET /api/products/search. Mã điểm bán là mã POS (dạng branchId của nguồn bán), không phải tên gõ tay. */
const SCOPE_BRANCHES = [
  ['432758', 'Kho tổng Bình Tân', true], ['437217', 'Dược Vương Q.1', false], ['437218', 'Dược Vương Tân Bình', false],
  ['437219', 'Dược Vương Gò Vấp', false], ['437220', 'Dược Vương Thủ Đức', false], ['437221', 'Dược Vương Bình Chánh', false],
];
const SCOPE_CATEGORIES = ['Kháng sinh', 'Giảm đau · hạ sốt', 'Tim mạch · huyết áp', 'Vitamin & khoáng chất', 'Thiết bị y tế'];
const SCOPE_SKU_HINTS = [['SP0455', 'Morphin sulfat 10mg'], ['SP0102', 'Paracetamol 500mg'], ['SP0210', 'Amoxicillin 500mg'], ['SP0333', 'Vitamin C 1000mg']];
const SCOPE_TYPES = [['store', 'Điểm bán'], ['category', 'Nhóm hàng'], ['sku', 'SKU']];

function ScopeOverridesCompact({ cfg, setDirty, setToast }) {
  const { IconX } = window;
  const defaults = window.ENGINE_DEFAULTS_38 || {};
  /* Một hàng mẫu để thấy hình bảng — [đo prod 28-08] engine_param chưa có ghi đè hẹp nào, nên hệ thật
     thường mở ra ở trạng thái rỗng (empty-state bên dưới). */
  const [rows, setRows] = React.useState([{ scopeType: 'store', scopeId: '437218', key: 'cycle', value: 14 }]);
  const [scopeType, setScopeType] = React.useState('store');
  const [scopeId, setScopeId] = React.useState('');
  const [key, setKey] = React.useState('cycle');
  const [value, setValue] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(null);
  const inp = { boxSizing: 'border-box', padding: '8px 10px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, outline: 'none', background: '#fff' };
  const branchName = (code) => { const b = SCOPE_BRANCHES.find((x) => x[0] === code); return b ? b[1] : null; };
  const typeLabel = (t) => (SCOPE_TYPES.find((x) => x[0] === t) || ['', t])[1];
  const keyLabel = (k) => (SCOPE_KEYS_7.find((x) => x[0] === k) || [k, k])[1];
  const keyUnit = (k) => (SCOPE_KEYS_7.find((x) => x[0] === k) || [k, k, ''])[2];
  const canAdd = scopeId.trim() !== '' && String(value).trim() !== '';
  const add = () => {
    const id = scopeId.trim();
    setRows((rs) => [...rs.filter((r) => !(r.scopeType === scopeType && r.scopeId === id && r.key === key)), { scopeType, scopeId: id, key, value: Number(value) }]);
    setScopeId(''); setValue(''); setDirty(true);
    setToast('Đã thêm ghi đè — kế hoạch tính lại khi Lưu.');
  };
  const remove = (r) => { setRows((rs) => rs.filter((x) => x !== r)); setConfirmDel(null); setDirty(true); setToast(`Đã gỡ ghi đè · ${keyLabel(r.key)} của ${typeLabel(r.scopeType)} ${r.scopeId} về số toàn chuỗi.`); };
  const picker = scopeType === 'store'
    ? <select value={scopeId} onChange={(e) => setScopeId(e.target.value)} style={{ ...inp, maxWidth: 260 }} aria-label="Điểm bán"><option value="">— chọn điểm bán —</option>{SCOPE_BRANCHES.map(([code, nm, wh]) => <option key={code} value={code}>{nm} · {code}{wh ? ' (kho tổng)' : ''}</option>)}</select>
    : scopeType === 'category'
    ? <select value={scopeId} onChange={(e) => setScopeId(e.target.value)} style={{ ...inp, maxWidth: 260 }} aria-label="Nhóm hàng"><option value="">— chọn nhóm hàng —</option>{SCOPE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
    : <><input value={scopeId} onChange={(e) => setScopeId(e.target.value)} list="proto-sku-hints" placeholder="gõ mã hoặc tên sản phẩm" style={{ ...inp, width: 230, fontFamily: 'var(--font-mono)' }} aria-label="SKU (mã hoặc tên)" /><datalist id="proto-sku-hints">{SCOPE_SKU_HINTS.map(([c, n]) => <option key={c} value={c}>{n}</option>)}</datalist></>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', margin: 0, maxWidth: '72ch', lineHeight: 1.55 }}>Mặc định mọi tham số áp <b>toàn chuỗi</b>. Khi trùng nhau, bộ máy lấy phạm vi <b>hẹp nhất</b>: SKU › nhóm hàng › điểm bán › toàn chuỗi. Các khoá khác (18 ô mức phục vụ, công tắc engine…) chỉ có nghĩa toàn chuỗi — đường ghi từ chối.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <select value={scopeType} onChange={(e) => { setScopeType(e.target.value); setScopeId(''); }} style={inp} aria-label="Loại phạm vi">{SCOPE_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        {picker}
        <select value={key} onChange={(e) => setKey(e.target.value)} style={{ ...inp, maxWidth: 240 }} aria-label="Tham số">{SCOPE_KEYS_7.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Giá trị (${keyUnit(key)})`} style={{ ...inp, width: 118, textAlign: 'right', fontFamily: 'var(--font-mono)' }} aria-label="Giá trị ghi đè" />
        <button onClick={add} disabled={!canAdd} style={{ padding: '8px 14px', borderRadius: 999, border: 'none', cursor: canAdd ? 'pointer' : 'default', background: canAdd ? 'var(--dv-green)' : 'var(--dv-mist)', color: canAdd ? '#fff' : 'var(--dv-ink-faint)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13 }}>Thêm ghi đè</button>
      </div>
      {rows.length === 0
        ? <p style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', margin: 0 }}>Chưa có ghi đè nào — mọi phạm vi đang chạy theo số toàn chuỗi.</p>
        : <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 520 }}>
            <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Phạm vi', 'Tham số', 'Toàn chuỗi', 'Ghi đè', ''].map((h, i) => <th key={i} style={{ textAlign: i >= 2 ? 'right' : 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.scopeType}:${r.scopeId}:${r.key}`} style={{ borderTop: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '8px 12px' }}><div style={{ fontWeight: 600, fontSize: 13, color: 'var(--dv-ink)' }}>{typeLabel(r.scopeType)}{r.scopeType === 'store' && branchName(r.scopeId) ? <span style={{ fontWeight: 400 }}> · {branchName(r.scopeId)}</span> : null}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{r.scopeId}</div></td>
                  <td style={{ padding: '8px 12px' }}><div style={{ fontWeight: 600, fontSize: 13, color: 'var(--dv-ink)' }}>{keyLabel(r.key)}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{r.key}</div></td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{String(cfg && cfg[r.key] != null ? cfg[r.key] : defaults[r.key])}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 800, color: 'var(--dv-ink)' }}>{String(r.value)}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    {confirmDel === r
                      ? <button onClick={() => remove(r)} title={`${typeLabel(r.scopeType)} ${r.scopeId} về số toàn chuỗi cho "${keyLabel(r.key)}" — kế hoạch tính lại ngay`} style={{ height: 26, borderRadius: 7, border: '1px solid #EBB8B2', background: '#F8E0DD', cursor: 'pointer', color: '#C5372C', fontSize: 11, fontWeight: 800, padding: '0 9px' }}>Gỡ?</button>
                      : <button onClick={() => setConfirmDel(r)} title="Gỡ ghi đè (bấm lần nữa để xác nhận)" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontWeight: 600, fontSize: 12, color: 'var(--dv-ink-soft)' }}><IconX size={12} />Gỡ</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div>
  );
}
window.ScopeOverridesCompact = ScopeOverridesCompact;

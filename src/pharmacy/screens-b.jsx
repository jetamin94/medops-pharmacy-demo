/* Pharmacy screens B — Suppliers, Expiry/FEFO, Offers, Invites, Connectors, Audit. */

/* ============ SUPPLIERS ============ */
function SupplierProfileDrawer({ s, onClose, setToast }) {
  const { VND } = window;
  const { Button, Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconShieldCheck, IconAlertTriangle } = window;
  const Drawer = window.Drawer;
  const miss = s.missing;
  const [f, setF] = React.useState({
    code: s.id, name: s.name, mst: miss ? '' : '0301234567', addr: miss ? '' : '12 Lê Lợi, Q.1, TP.HCM',
    contact: 'Nguyễn Văn A', phone: '0909 123 456', email: 'kinhdoanh@ncc.vn', bank: miss ? '' : 'Vietcombank · 0071000123456',
    leadtime: s.leadtime, moq: 50, creditDays: 30, creditLimit: s.debtLimit, returnPolicy: miss ? '' : 'Đổi/trả trong 30 ngày với hàng lỗi, cận date',
    minOrder: miss ? '' : '3.000.000', leadBuffer: miss ? '' : '1', orderCycle: 7, orderDays: miss ? [] : ['t2', 't5'], skipWeekend: !miss,
    priority: !miss, coCq: miss ? 'missing' : 'valid', coCqExp: miss ? '' : '31/12/2026', status: s.status === 'pending' ? 'pending' : 'active',
  });
  const upd = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const [cycleNoted, setCycleNoted] = React.useState(false);
  const noteCycleDebt = () => { if (cycleNoted) return; setCycleNoted(true); setToast('Chu kỳ đặt theo NCC đang ở lộ trình — bộ máy hiện dùng một chu kỳ chung cho cả chuỗi.'); };
  const [daysNoted, setDaysNoted] = React.useState(false);
  const noteDaysDebt = () => { if (daysNoted) return; setDaysNoted(true); setToast('Lịch đặt theo ngày trong tuần đang ở lộ trình — bộ máy chưa có bước chốt đơn theo lịch.'); };
  const [wdNoted, setWdNoted] = React.useState(false);
  const noteWorkdayDebt = () => { if (wdNoted) return; setWdNoted(true); setToast('Cộng leadtime theo ngày làm việc đang ở lộ trình — bộ máy hiện cộng ngày liên tục, chưa có lịch nghỉ.'); };
  const il = { display: 'block', fontWeight: 600, fontSize: 12.5, color: 'var(--dv-ink)', marginBottom: 6 };
  const ii = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff' };
  const iim = { ...ii, fontFamily: 'var(--font-mono)' };
  const missStyle = (val) => val ? {} : { borderColor: '#C5372C', background: '#FFFBF0' };
  const F = ({ label, k, mono, full, ph, flag }) => (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={il}>{label} {flag && !f[k] && <span style={{ color: '#C5372C', fontWeight: 700 }}>· thiếu</span>}</label>
      <input value={f[k]} placeholder={ph} onChange={(e) => upd(k, e.target.value)} style={{ ...(mono ? iim : ii), ...(flag ? missStyle(f[k]) : {}) }} />
    </div>
  );
  const G = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>{children}</div>;
  const Head = (t) => <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', margin: '8px 0 12px', paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>{t}</div>;
  return (
    <Drawer title={f.name} sub={`${f.code} · hồ sơ nhà cung cấp`} onClose={onClose}
      footer={<><Button variant="secondary" size="md" onClick={onClose}>Hủy</Button><Button variant="primary" size="md" onClick={() => { setToast(`Đã lưu hồ sơ NCC ${f.code}.`); onClose(); }}>Lưu hồ sơ</Button></>}>
      {miss && <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFBF0', border: '1px solid #F5E0A8', borderRadius: 12, padding: '11px 14px', marginBottom: 16 }}><span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconAlertTriangle size={17} /></span><span style={{ fontSize: 12.5, color: 'var(--dv-ink)' }}>NCC này còn <b>thiếu thông tin bắt buộc</b> (đánh dấu đỏ). Bổ sung trước khi đặt hàng ở NCC này.</span></div>}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', marginBottom: 12 }}>Thông tin pháp lý</div>
      <G><F label="Mã NCC" k="code" mono /><div><label style={il}>MST {f.mst && !/^(\d{10}|\d{13})$/.test(f.mst) && <span style={{ color: '#C5372C', fontWeight: 700 }}>· sai định dạng</span>}{miss && !f.mst && <span style={{ color: '#C5372C', fontWeight: 700 }}>· thiếu</span>}</label><input value={f.mst} placeholder="10 hoặc 13 số" onChange={(e) => upd('mst', e.target.value)} style={{ ...iim, ...((f.mst && !/^(\d{10}|\d{13})$/.test(f.mst)) || (miss && !f.mst) ? { borderColor: '#C5372C', background: '#FFFBF0' } : {}) }} /></div></G>
      <div style={{ marginBottom: 14 }}><F label="Tên nhà cung cấp" k="name" full /></div>
      <div style={{ marginBottom: 14 }}><F label="Địa chỉ" k="addr" full flag /></div>
      {Head('Liên hệ & thanh toán')}
      <G><F label="Người liên hệ" k="contact" /><F label="Điện thoại" k="phone" mono /></G>
      <G><F label="Email" k="email" mono /><F label="TK ngân hàng" k="bank" flag /></G>
      {Head('Điều khoản thương mại')}
      <G>
        <div><label style={il}>Leadtime (ngày)</label><input value={f.leadtime} onChange={(e) => upd('leadtime', e.target.value)} style={iim} /></div>
        <div><label style={il}>MOQ mặc định</label><input value={f.moq} onChange={(e) => upd('moq', e.target.value)} style={iim} /></div>
      </G>
      <G>
        <div><label style={il}>Hạn thanh toán (ngày công nợ)</label><input value={f.creditDays} onChange={(e) => upd('creditDays', e.target.value)} style={iim} /></div>
        <div><label style={il}>Hạn mức công nợ (₫)</label><input value={f.creditLimit} onChange={(e) => upd('creditLimit', e.target.value)} style={iim} /></div>
      </G>
      <div style={{ marginBottom: 14 }}><F label="Chính sách trả hàng" k="returnPolicy" full flag /></div>
      {Head('Ràng buộc gom đơn')}
      {/* NO_TICKET_YET — MỘT ghi chú cho cả ô. Ba trường ở đây (giá trị đơn tối thiểu ·
          buffer leadtime · NCC ưu tiên bên dưới) mới chỉ là trường HỒ SƠ: bộ máy gom đơn
          không đọc trường nào trong số đó, nên đừng dán chữ "engine" lên nhãn của chúng.
          Chưa có mã việc trong Jashboard — đừng bịa số DVP. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#FFFBF0', border: '1px solid #F5E0A8', borderRadius: 10, padding: '9px 12px', marginBottom: 14 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)', background: '#fff', padding: '1px 7px', borderRadius: 999, border: '1px solid #F5E0A8', whiteSpace: 'nowrap' }}>lộ trình</span>
        <span style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)' }} title="Ba ô này lưu vào hồ sơ NCC nhưng chưa có bước nào của bộ máy đọc tới: đơn vẫn gom theo nhu cầu từng mặt hàng, không theo giá trị đơn tối thiểu, không cộng thêm buffer, không xếp NCC ưu tiên lên trước.">Bộ máy chưa đọc các ô này — nhập vào không đổi cách gom đơn.</span>
      </div>
      <G>
        <div><label style={il}>Giá trị đơn tối thiểu (₫)</label><input value={f.minOrder} onChange={(e) => upd('minOrder', e.target.value)} placeholder="vd: 3.000.000" style={iim} /></div>
        <div><label style={il}>Buffer leadtime (ngày)</label><input value={f.leadBuffer} onChange={(e) => upd('leadBuffer', e.target.value)} placeholder="vd: 1" style={iim} /></div>
      </G>
      {/* NO_TICKET_YET — Chu kỳ đặt (R) theo từng NCC. Bộ máy hôm nay CHỈ giải một chu kỳ chung cho cả
          chuỗi (một ô duy nhất ở màn Cài đặt); cột chu kỳ theo NCC, và theo cặp NCC-mặt hàng, chưa tồn
          tại. Ô dưới đây vẽ trước hình dạng đó: nhập vào KHÔNG làm đổi số Max bộ máy đang tính. Chưa
          có mã việc trong Jashboard — đừng bịa số DVP. */}
      <div style={{ border: '1px solid var(--border-default)', borderRadius: 12, padding: '14px 16px', marginBottom: 14, background: '#fff' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...il, display: 'flex', alignItems: 'center', gap: 7 }} title="Số ngày giữa hai lần đặt hàng cho NCC này. Bộ máy tính Max = sức bán × (thời gian chờ + chu kỳ) + đệm, nên chu kỳ dài thì trữ nhiều hơn.">
            Chu kỳ đặt (ngày)
            <span title="Chưa nối vào bộ máy — bộ máy hiện dùng một chu kỳ chung cho cả chuỗi." style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)', background: '#FFFBF0', padding: '1px 7px', borderRadius: 999, border: '1px solid #F5E0A8', whiteSpace: 'nowrap' }}>lộ trình</span>
          </label>
          <input type="number" min="1" value={f.orderCycle} onChange={(e) => { upd('orderCycle', e.target.value); noteCycleDebt(); }} placeholder="vd: 7" style={{ ...iim, maxWidth: 210 }} />
          <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 6 }}>Bỏ trống = dùng chu kỳ mặc định của chuỗi (Cài đặt).</div>
          <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 3 }}>Chu kỳ = bao nhiêu ngày một lần; lịch dưới = ngày nào trong tuần.</div>
        </div>
      {/* NO_TICKET_YET — lịch đặt theo ngày trong tuần. f.orderDays chỉ là state của form:
          không có bước nào trong bộ máy chốt đơn theo thứ. Cùng loại nợ với ô Chu kỳ đặt ở
          trên, nên gắn cùng một nhãn "lộ trình". Chưa có mã việc — đừng bịa số DVP. */}
      <div style={{ marginBottom: 6 }}>
        <label style={{ ...il, display: 'flex', alignItems: 'center', gap: 7 }}>
          Lịch đặt hàng cố định
          <span title="Chưa nối vào bộ máy — hiện không có bước chốt đơn theo ngày trong tuần." style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)', background: '#FFFBF0', padding: '1px 7px', borderRadius: 999, border: '1px solid #F5E0A8', whiteSpace: 'nowrap' }}>lộ trình</span>
        </label>
        <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginBottom: 8 }} title="Đây là dự định thiết kế, chưa phải hành vi đang chạy: bộ máy hiện đề xuất theo nhu cầu từng mặt hàng, không gom lại chờ tới ngày NCC nhận đặt.">Dự định: chỉ chốt đơn vào các ngày NCC nhận đặt. Chọn ngày ở đây chưa đổi ngày chốt.</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[['t2', 'T2'], ['t3', 'T3'], ['t4', 'T4'], ['t5', 'T5'], ['t6', 'T6'], ['t7', 'T7'], ['cn', 'CN']].map(([k, l]) => {
            const on = (f.orderDays || []).includes(k);
            return <button key={k} onClick={() => { upd('orderDays', on ? f.orderDays.filter((d) => d !== k) : [...(f.orderDays || []), k]); noteDaysDebt(); }} style={{ width: 42, height: 38, borderRadius: 10, border: on ? '1px solid var(--dv-green)' : '1px solid var(--border-strong)', background: on ? 'var(--dv-green)' : '#fff', color: on ? '#fff' : 'var(--dv-ink-soft)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13 }}>{l}</button>;
          })}
        </div>
      </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 0 4px' }}>
        {/* NO_TICKET_YET — lịch ngày làm việc. Bộ máy cộng leadtime tuyến tính (leadtime +
            buffer, xem dvComputeReplenish ở CalcEngine.jsx); không có bảng lịch nghỉ nào
            trong bản mẫu này. Chưa có mã việc — đừng bịa số DVP. */}
        <Switch checked={f.skipWeekend} onChange={(v) => { upd('skipWeekend', v); noteWorkdayDebt(); }} />
        <div><div style={{ fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>Tính leadtime theo ngày làm việc<span title="Chưa nối vào bộ máy — hiện chưa có lịch nghỉ nào để trừ." style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)', background: '#FFFBF0', padding: '1px 7px', borderRadius: 999, border: '1px solid #F5E0A8', whiteSpace: 'nowrap' }}>lộ trình</span></div><div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }} title="Dự định: bỏ Thứ 7, Chủ nhật và ngày lễ khi cộng leadtime. Hiện bộ máy cộng ngày liên tục, nên ngày dự kiến nhận có thể sớm hơn thực tế.">Dự định bỏ T7 · CN · ngày lễ khi cộng leadtime. Hiện vẫn cộng ngày liên tục.</div></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0 4px' }}>
        <Switch checked={f.priority} onChange={(v) => upd('priority', v)} /><span style={{ fontSize: 13.5, fontWeight: 600 }} title="Đánh dấu ưu tiên trong hồ sơ NCC. Bộ máy chưa đọc cờ này — xem ghi chú ở mục Ràng buộc gom đơn.">NCC ưu tiên</span>
      </div>
      {Head('Chứng từ')}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: f.coCq === 'valid' ? 'var(--dv-green-50)' : '#FFFBF0', border: `1px solid ${f.coCq === 'valid' ? 'var(--dv-green-100)' : '#F5E0A8'}`, borderRadius: 12, padding: '12px 14px' }}>
        <span style={{ color: f.coCq === 'valid' ? 'var(--dv-green)' : 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconShieldCheck size={18} /></span>
        <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--dv-ink)' }}>Chứng từ CO/CQ</div><div style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)' }}>{f.coCq === 'valid' ? `Hợp lệ · hết hạn ${f.coCqExp}` : 'Chưa có / hết hạn — cần cập nhật'}</div></div>
        <Button variant="secondary" size="sm" onClick={() => setToast('Mở tải lên chứng từ CO/CQ.')}>Cập nhật</Button>
      </div>
    </Drawer>
  );
}

/* ============ SUPPLIERS (tabs: Danh bạ · Lời mời & truy cập — G1) ============ */
function SuppliersScreen({ setView, setToast, initialTab }) {
  const { SUPPLIERS, INVITES, VND, NUM, PageHeader, StatusBadge, StatusTabs, SearchBox, Toolbar, GhostBtn } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconFilter, IconAlertTriangle, IconChevronDown, IconChevronRight, IconTag, IconEdit, IconPlus, IconMail, IconMore, IconClock, IconX, IconCheck } = window;
  const lcBtn = (color) => ({ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 9px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 9, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color });
  const [tab, setTab] = React.useState(initialTab || 'list');
  const [q, setQ] = React.useState('');
  const [exp, setExp] = React.useState(null);
  const [edit, setEdit] = React.useState(null);
  const [memb, setMemb] = React.useState({}); // sku -> 'suspended' | 'disconnected' (override active)
  const [lcMenu, setLcMenu] = React.useState(null);
  const membOf = (id) => memb[id] || 'active';
  const setMembOf = (id, v, msg) => { setMemb((m) => ({ ...m, [id]: v })); setLcMenu(null); setToast(msg); };
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(25);
  const [ltOv, setLtOv] = React.useState({}); // T12: leadtime ghi đè theo cặp NCC × SKU — trống = thừa kế từ hồ sơ NCC
  const [cyOv, setCyOv] = React.useState({}); // NO_TICKET_YET: chu kỳ đặt ghi đè theo cặp NCC × SKU — trống = thừa kế chu kỳ NCC
  const [cyNoted, setCyNoted] = React.useState(false);
  const cyOf = (sup) => sup.orderCycle || 7; // NO_TICKET_YET: bộ máy giải MỘT chu kỳ chung cho cả chuỗi (Cài đặt); chu kỳ theo NCC chưa có cột nào chứa
  const noteCyDebt = () => { if (cyNoted) return; setCyNoted(true); setToast('Chu kỳ đặt theo NCC đang ở lộ trình — bộ máy hiện dùng một chu kỳ chung cho cả chuỗi.'); };
  const offers = window.OpsStore.use().offers;
  const rows = SUPPLIERS.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  React.useEffect(() => { setPage(1); }, [q]);
  const pageRows = rows.slice((page - 1) * size, page * size);
  // competing prices for a sample SKU
  const COMPET = {
    NCC01: [{ sku: 'Paracetamol 500mg', price: 9000, vat: 5, moq: 100, valid: '30/09/2026' }, { sku: 'Vitamin C 1000mg', price: 6000, vat: 8, moq: 50, valid: '31/08/2026' }],
    NCC02: [{ sku: 'Amoxicillin 500mg', price: 7600, vat: 5, moq: 50, valid: '15/10/2026' }, { sku: 'Cefuroxim 500mg', price: 36500, vat: 5, moq: 20, valid: '15/10/2026' }],
    NCC05: [{ sku: 'Augmentin 625mg', price: 56500, vat: 8, moq: 20, valid: '30/06/2026' }, { sku: 'Enterogermina', price: 40000, vat: 8, moq: 20, valid: '31/07/2026' }],
  };

  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="Nhà cung cấp" subtitle="Hồ sơ NCC: leadtime, công nợ, số SKU, giá cạnh tranh theo sản phẩm — và quản lý lời mời truy cập cổng NCC."
        actions={<window.ExportImportBar label="Nhà cung cấp" columns={['Mã', 'Tên', 'Leadtime', 'Công nợ', 'Hạn mức', 'Số SKU', 'Trạng thái']}
          exportRows={() => SUPPLIERS.map((s) => [s.id, s.name, s.leadtime, s.debt, s.debtLimit, s.skus, s.status])}
          sampleRows={[{ cells: ['NCC09', 'OPC Pharma', '4', '0', '150000000', '64', 'active'] }, { cells: ['NCC10', 'Sanofi VN', '6', '0', '500000000', '210', 'active'], _warn: 'MST trùng NCC03', _warnCol: 0 }]} setToast={setToast} />} />
      <div style={{ marginBottom: 18 }}>
        <StatusTabs items={[['list', 'Danh bạ NCC', SUPPLIERS.length], ['invites', 'Lời mời & truy cập', INVITES.length], ['reconcile', 'Liên kết mạng (MST)'], ['offers', 'Duyệt SP mới', offers.filter((o) => o.status === 'pending').length || null]]} value={tab} onChange={setTab} />
      </div>
      {tab === 'invites' ? <InvitesPanel setToast={setToast} /> : tab === 'reconcile' ? <ReconcilePanel setToast={setToast} /> : tab === 'offers' ? <OffersPanel setToast={setToast} /> : <>
      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Tìm nhà cung cấp…" />
        {/* NO_TICKET_YET — nút này CHƯA làm gì: không có onClick, không có bộ lọc nào phía
            sau. Cùng lỗi đã sửa ở màn Nhật ký (bộ lọc theo loại đối tượng); ở đây cần chốt
            trước lọc theo cái gì (trạng thái · thiếu hồ sơ · nguồn dữ liệu) rồi mới dựng.
            Chưa có mã việc trong Jashboard — đừng bịa số DVP. */}
        <GhostBtn icon={<IconFilter size={15} />}>Bộ lọc</GhostBtn>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{rows.length} nhà cung cấp</span>
      </Toolbar>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>
            {['Nhà cung cấp', 'Leadtime', 'Công nợ / hạn mức', 'Số SKU', 'Giao đúng hạn', 'Trạng thái', ''].map((h, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : i === 6 ? 'right' : 'center', padding: '11px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {pageRows.map((s) => {
              const debtPct = s.debt / s.debtLimit;
              const isOpen = exp === s.id;
              const prices = COMPET[s.id];
              return (
                <React.Fragment key={s.id}>
                  <tr style={{ borderTop: '1px solid var(--border-default)', background: isOpen ? 'var(--dv-mist)' : 'transparent', cursor: 'pointer' }} onClick={() => setExp(isOpen ? null : s.id)}>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}><IconChevronRight size={15} /></span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-green)' }}>{s.name}</span>
                            {s.source === 'dv_odoo'
                              ? <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '1px 7px', borderRadius: 999, border: '1px solid var(--dv-green-100)' }}>DV Odoo</span>
                              : <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', padding: '1px 7px', borderRadius: 999, border: '1px solid var(--border-default)' }}>Nhập tay</span>}
                            <span title="Danh mục do nhà thuốc sở hữu (Portal own) — giá & hồ sơ quản lý tại portal" style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green-bright)', background: '#fff', padding: '1px 7px', borderRadius: 999, border: '1px solid var(--dv-green-100)' }}>Portal own</span>
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{s.id} · ★ {s.rating}</div>
                        </div>
                        {s.missing && <span title="Thiếu thông tin hồ sơ — bấm để bổ sung" onClick={(e) => { e.stopPropagation(); setEdit(s); }} style={{ color: '#C5372C', display: 'inline-flex', cursor: 'pointer' }}><IconAlertTriangle size={15} /></span>}
                      </div>
                    </td>
                    <td style={{ padding: '13px 18px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13.5 }}>{s.leadtime} ngày</td>
                    <td style={{ padding: '13px 18px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, textAlign: 'center', color: debtPct > 0.8 ? '#C5372C' : 'var(--dv-ink)', fontWeight: 600 }}>{VND(s.debt)}</div>
                      <div style={{ height: 5, borderRadius: 999, background: '#EEF0EF', margin: '4px auto 0', maxWidth: 130, overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${debtPct * 100}%`, background: debtPct > 0.8 ? '#C5372C' : debtPct > 0.5 ? 'var(--dv-yellow-600)' : 'var(--dv-green-bright)' }} /></div>
                    </td>
                    <td style={{ padding: '13px 18px', textAlign: 'center' }}>
                      <button onClick={(e) => { e.stopPropagation(); setExp(isOpen ? null : s.id); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, color: 'var(--dv-green-bright)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--dv-green-100)' }}>{s.skus}</button>
                    </td>
                    <td style={{ padding: '13px 18px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13.5, color: s.otd >= 95 ? 'var(--dv-green-bright)' : 'var(--dv-yellow-600)', fontWeight: 700 }}>{s.otd}%</td>
                    <td style={{ padding: '13px 18px', textAlign: 'center' }}>{s.missing ? <StatusBadge status="low" label="Thiếu thông tin" /> : (() => { const mb = membOf(s.id); return mb === 'suspended' ? <StatusBadge status="pending" label="Tạm ngưng" /> : mb === 'disconnected' ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: 'var(--dv-mist)', color: 'var(--dv-ink-soft)', fontWeight: 700, fontSize: 12 }}><span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--dv-ink-faint)' }} />Đã ngắt</span> : <StatusBadge status={s.status === 'pending' ? 'pending' : 'active'} />; })()}</td>
                    <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
                        {prices && <span style={{ fontSize: 12.5, color: 'var(--dv-green-bright)', fontWeight: 700 }}>{prices.length} giá</span>}
                        <button onClick={(e) => { e.stopPropagation(); setEdit(s); }} title="Sửa hồ sơ" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={15} /></button>
                        {!s.missing && s.status !== 'pending' && (
                          <span style={{ position: 'relative' }}>
                            <button onClick={(e) => { e.stopPropagation(); setLcMenu(lcMenu === s.id ? null : s.id); }} title="Vòng đời kết nối" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: lcMenu === s.id ? 'var(--dv-mist)' : '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconMore size={16} /></button>
                            {lcMenu === s.id && (() => { const mb = membOf(s.id); return (
                              <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 230, background: '#fff', borderRadius: 12, border: '1px solid var(--border-default)', boxShadow: '0 16px 40px rgba(0,30,22,.18)', padding: 6, zIndex: 50, textAlign: 'left' }}>
                                {mb === 'active' && <>
                                  <button onClick={() => setMembOf(s.id, 'suspended', `Đã tạm ngưng ${s.name} — ẩn khỏi RFQ đang mở & không nhận RFQ mới, giữ lịch sử.`)} style={lcBtn('var(--dv-yellow-600)')}>{React.createElement(IconClock, { size: 15 })}Tạm ngưng kết nối</button>
                                  <button onClick={() => setMembOf(s.id, 'disconnected', `Đã ngắt kết nối ${s.name}. Lịch sử PO/báo giá cũ vẫn giữ.`)} style={lcBtn('#C5372C')}>{React.createElement(IconX, { size: 15 })}Ngắt kết nối</button>
                                </>}
                                {mb === 'suspended' && <>
                                  <button onClick={() => setMembOf(s.id, 'active', `Đã mở lại kết nối ${s.name}.`)} style={lcBtn('var(--dv-green)')}>{React.createElement(IconCheck, { size: 15 })}Mở lại kết nối</button>
                                  <button onClick={() => setMembOf(s.id, 'disconnected', `Đã ngắt kết nối ${s.name}.`)} style={lcBtn('#C5372C')}>{React.createElement(IconX, { size: 15 })}Ngắt kết nối</button>
                                </>}
                                {mb === 'disconnected' && <button onClick={() => setMembOf(s.id, 'active', `Đã kết nối lại ${s.name}.`)} style={lcBtn('var(--dv-green)')}>{React.createElement(IconCheck, { size: 15 })}Kết nối lại</button>}
                                <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', padding: '7px 9px 3px', lineHeight: 1.45 }}>{mb === 'active' ? 'Tạm ngưng: ẩn NCC khỏi cả RFQ đang mở và RFQ mới; có thể mở lại bất kỳ lúc nào.' : mb === 'suspended' ? 'NCC đang tạm ngưng — đã ẩn khỏi RFQ. Mở lại để khôi phục.' : 'Đã ngắt — có thể kết nối lại bất kỳ lúc nào.'}</div>
                              </div>
                            ); })()}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr><td colSpan={7} style={{ padding: 0, background: '#fafbfb' }}>
                      <div style={{ padding: '6px 18px 16px 50px' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', margin: '10px 0 8px', display: 'flex', alignItems: 'center', gap: 7 }}><IconTag size={14} />Danh mục SKU đang cung cấp · bảng giá hiệu lực</div>
                        {prices ? <>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead><tr>{['Sản phẩm', 'Đơn giá', 'VAT', 'MOQ', 'Leadtime', 'Chu kỳ', 'Hiệu lực đến'].map((h, i) => <th key={i} title={h === 'Leadtime' ? 'Thuộc tính của cặp NCC × SKU — trống = thừa kế leadtime NCC.' : h === 'Chu kỳ' ? 'Chu kỳ đặt của cặp NCC × mặt hàng — trống = thừa kế chu kỳ của NCC.' : undefined} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '6px 12px', fontSize: 11, fontWeight: 700, color: 'var(--dv-ink-faint)', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
                          <tbody>{prices.map((p, i) => (
                            <tr key={i} style={{ borderTop: '1px solid var(--border-default)' }}>
                              <td style={{ padding: '8px 12px', fontSize: 13, fontWeight: 600 }}>{p.sku}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{VND(p.price)}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{p.vat}%</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{p.moq}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{(() => { const lk = s.id + '|' + p.sku; const ov = ltOv[lk] || ''; return (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                  <input value={ov} placeholder={`${s.leadtime} ngày`} onChange={(ev) => setLtOv((m) => ({ ...m, [lk]: ev.target.value }))} onClick={(ev) => ev.stopPropagation()} title="Trống = thừa kế leadtime NCC. Nhập số ngày để ghi đè riêng cho cặp NCC × SKU này." style={{ width: 64, boxSizing: 'border-box', padding: '4px 8px', borderRadius: 7, border: ov ? '1px solid var(--dv-green)' : '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'right', outline: 'none', background: '#fff', color: 'var(--dv-ink)' }} />
                                  {ov ? <span title="Đang ghi đè leadtime NCC cho riêng SKU này." style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '1px 6px', borderRadius: 999, border: '1px solid var(--dv-green-100)', whiteSpace: 'nowrap' }}>ghi đè</span> : null}
                                </span>
                              ); })()}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right' }}>{(() => { const ck = s.id + '|' + p.sku; const cv = cyOv[ck] || ''; return (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                                  <input value={cv} placeholder={`${cyOf(s)} ngày`} onChange={(ev) => { setCyOv((m) => ({ ...m, [ck]: ev.target.value })); noteCyDebt(); }} onClick={(ev) => ev.stopPropagation()} title="Trống = thừa kế chu kỳ đặt của NCC. Nhập số ngày để ghi đè riêng cho cặp NCC × SKU này — đang ở lộ trình, bộ máy chưa đọc số này." style={{ width: 64, boxSizing: 'border-box', padding: '4px 8px', borderRadius: 7, border: cv ? '1px solid var(--dv-green)' : '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12, textAlign: 'right', outline: 'none', background: '#fff', color: 'var(--dv-ink)' }} />
                                  {cv ? <span title="Đang ghi đè chu kỳ đặt của NCC cho riêng SKU này." style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '1px 6px', borderRadius: 999, border: '1px solid var(--dv-green-100)', whiteSpace: 'nowrap' }}>ghi đè</span> : null}
                                </span>
                              ); })()}</td>
                              <td style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{p.valid}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--border-default)' }}>
                          <span style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>Hiển thị {prices.length} / {s.skus} SKU đang cung cấp</span>
                          <button onClick={(e) => { e.stopPropagation(); window.__productQuery = s.name.split(' (')[0]; setView('products'); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 12.5 }}>Xem tất cả {s.skus} SKU →</button>
                        </div>
                        </> : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '12px 16px' }}>
                            <span style={{ fontSize: 13, color: 'var(--dv-ink-soft)' }}>NCC đang cung cấp <b style={{ color: 'var(--dv-ink)' }}>{s.skus} SKU</b>. Chi tiết bảng giá chưa đồng bộ về portal.</span>
                            <button onClick={(e) => { e.stopPropagation(); window.__productQuery = s.name.split(' (')[0]; setView('products'); }} style={{ border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, color: 'var(--dv-green)', fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap' }}>Xem tất cả →</button>
                          </div>
                        )}
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              );
            })}
            {/* DVP-324: empty-state khi lọc không ra kết quả — trước đây chỉ còn header bảng trống */}
            {rows.length === 0 && <tr><td colSpan={7} style={{ padding: 0, borderTop: '1px solid var(--border-default)' }}><window.EmptyState icon="IconUsers" title="Không có NCC nào khớp tìm kiếm" hint={`Không tìm thấy nhà cung cấp nào khớp “${q}”. Thử từ khóa ngắn hơn, hoặc kiểm tra tab “Liên kết mạng (MST)” nếu NCC đó thuộc danh mục hệ cũ.`} /></td></tr>}
          </tbody>
        </table>
      </div>
      <window.Pagination page={page} size={size} total={rows.length} onPage={setPage} onSize={setSize} sizes={[25, 50, 100]} note="" />
      </>}
      {edit && <SupplierProfileDrawer s={edit} onClose={() => setEdit(null)} setToast={setToast} />}
    </div>
  );
}
window.SuppliersScreen = SuppliersScreen;

/* ============ EXPIRY / FEFO — thang 3 bậc 90/60/30 + buffer (khớp Cài đặt) ============ */
const FEFO_TIERS = [
  { k: 'overdue', max: 0, label: 'Đã quá hạn', action: 'Cách ly + hủy theo quy định', bg: '#7A1B14', fg: '#fff' },
  { k: 'buffer', max: 7, label: 'Cách ly', action: 'Cách ly khỏi bán + ghi nhận hủy', bg: '#C5372C', fg: '#fff' },
  { k: 't3', max: 30, label: 'Bậc 3 · ≤30n', action: 'Markdown mạnh / trả NCC', bg: '#F8E0DD', fg: '#9c2b22' },
  { k: 't2', max: 60, label: 'Bậc 2 · ≤60n', action: 'Khuyến mãi / đẩy bán', bg: '#FFF1CF', fg: '#8a6a00' },
  { k: 't1', max: 90, label: 'Bậc 1 · ≤90n', action: 'Chuyển CH bán nhanh', bg: '#D6ECE5', fg: '#00533F' },
];
const tierOf = (days) => FEFO_TIERS.find((t) => days <= t.max) || null;

function ExpiryScreen({ setView, setToast }) {
  const { EXPIRY, VND, NUM, PageHeader, Table, Th, Td, Tr, Tip } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconHourglass, IconAlertTriangle, IconCalendarClock, IconSettings, IconTransfer } = window;
  const totalRisk = EXPIRY.reduce((s, e) => s + e.value, 0);
  const count = (k) => EXPIRY.filter((e) => tierOf(e.days) && tierOf(e.days).k === k).length;
  /* DVP-334: tách "Lô cách ly (≤7n)" khỏi Bậc 3 — cách ly là hành động kho tức thì, gộp vào Bậc 3 làm chìm mất việc gấp nhất */
  const kpis = [
    { ic: IconTransfer, v: count('t1'), l: 'Bậc 1 — cận date (≤90n)', s: 'Chuyển CH bán nhanh', tone: 'green' },
    { ic: IconCalendarClock, v: count('t2'), l: 'Bậc 2 — sắp hết hạn (≤60n)', s: 'Khuyến mãi / đẩy bán', tone: 'yellow' },
    { ic: IconAlertTriangle, v: count('t3'), l: 'Bậc 3 — nguy cấp (≤30n)', s: 'Markdown mạnh / trả NCC', tone: 'red' },
    { ic: IconAlertTriangle, v: count('buffer') + count('overdue'), l: 'Lô cách ly (≤7n)', s: 'Tách khỏi bán · gồm cả quá hạn', tone: 'red' },
    { ic: IconHourglass, v: VND(totalRisk), l: 'Giá trị rủi ro', s: `${EXPIRY.filter((e) => e.days <= 90).length} lô trong thang FEFO`, tone: 'green' },
  ];
  /* DVP-334: danh sách nhiều lô → cần tìm + lọc bậc + phân trang, không thể là bảng phẳng */
  const [q, setQ] = React.useState('');
  const [tier, setTier] = React.useState('all');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(25);
  React.useEffect(() => { setPage(1); }, [q, tier]);
  const inScale = [...EXPIRY].filter((e) => e.days <= 90 && tierOf(e.days));
  const nTier = (k) => k === 'all' ? inScale.length : inScale.filter((e) => tierOf(e.days).k === k).length;
  const list = inScale
    .filter((e) => (tier === 'all' || tierOf(e.days).k === tier) && (e.name + e.sku + e.lot).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.days - b.days);
  const pageRows = list.slice((page - 1) * size, page * size);
  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1180, margin: '0 auto' }}>
      <PageHeader title="Cận hạn / FEFO" subtitle="First-Expired-First-Out: lô được xếp vào thang 3 bậc theo số ngày còn lại — mỗi bậc gắn một hành động đề xuất tự động."
        actions={<Button variant="secondary" size="sm" iconRight={<IconSettings size={15} />} onClick={() => setView('settings')}>Ngưỡng 90/60/30 · Cài đặt</Button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 46, height: 46, borderRadius: '50%', background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{React.createElement(k.ic, { size: 22 })}</span>
            <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: k.tone === 'red' ? '#C5372C' : 'var(--dv-green)' }}>{k.v}</div><div style={{ fontSize: 12.5, color: 'var(--dv-ink)', fontWeight: 700, lineHeight: 1.3 }}>{k.l}</div><div style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)', marginTop: 1 }}>{k.s}</div></div>
          </div>
        ))}
      </div>
      <window.Toolbar>
        <window.SearchBox value={q} onChange={setQ} placeholder="Tìm SKU, tên thuốc, số lô…" width={280} />
        <span style={{ marginLeft: 'auto' }}><window.StatusTabs value={tier} onChange={setTier} items={[['all', 'Tất cả', nTier('all')], ['t1', 'Bậc 1', nTier('t1')], ['t2', 'Bậc 2', nTier('t2')], ['t3', 'Bậc 3', nTier('t3')], ['buffer', 'Cách ly', nTier('buffer')], ['overdue', 'Quá hạn', nTier('overdue')]]} /></span>
      </window.Toolbar>
      <Table minWidth={1020}>
        <thead><tr><Th>Sản phẩm</Th><Th>Lô</Th><Th>Điểm bán</Th><Th align="center">Hạn dùng</Th><Th align="center">Còn lại</Th><Th align="center">Bậc FEFO</Th><Th align="right">SL</Th><Th align="right">Giá trị rủi ro</Th><Th align="center">Hành động</Th></tr></thead>
        <tbody>
          {pageRows.map((e) => {
            const t = tierOf(e.days);
            if (!t) return null;
            const crit = t.k === 't3' || t.k === 'buffer' || t.k === 'overdue';
            return (
              <Tr key={e.lot} highlight={crit}>
                <Td strong><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{e.name}{(() => { const m = window.skuMeta && window.skuMeta(e.sku); if (!m) return null; return <>{m.type === 'rx' && <span style={{ fontSize: 9.5, fontWeight: 800, color: '#6b3fa0', background: '#F0E8F6', padding: '1px 6px', borderRadius: 5 }}>Rx</span>}{m.storage === 'lanh' && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1d4f8a', background: '#E5EEFb', padding: '1px 6px', borderRadius: 5 }}>Lạnh</span>}{window.ControlBadge && <window.ControlBadge k={m.control} />}</>; })()}</span><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)', fontWeight: 400 }}>{e.sku}</div></Td>
                <Td mono color="var(--dv-ink-soft)">{e.lot}</Td>
                <Td color="var(--dv-ink-soft)">{e.store}</Td>
                <Td align="center" mono>{e.exp}</Td>
                <Td align="center"><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: crit ? '#C5372C' : t.k === 't2' ? 'var(--dv-yellow-600)' : 'var(--dv-green-bright)' }}>{e.days} ngày</span></Td>
                <Td align="center"><Tip text={`${t.label}: ${t.action}.`}><span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: t.bg, color: t.fg, whiteSpace: 'nowrap' }}>{t.label}</span></Tip></Td>
                <Td align="right" mono>{NUM(e.qty)}</Td>
                <Td align="right" mono strong color={crit ? '#C5372C' : 'var(--dv-ink)'}>{VND(e.value)}</Td>
                <Td align="center">
                  {/* NO_TICKET_YET — màn này KHÔNG ghi gì vào window.OpsStore, nên câu cũ ("đã tạo
                      phiếu nháp … xem ở Điều chuyển") gửi người dùng đi tìm một chứng từ không có.
                      Chưa tự sinh phiếu được cho tử tế: thẻ điều chuyển in "thừa · N ngày tồn" cho
                      điểm gửi, mà EXPIRY chỉ có số ngày còn tới hạn dùng — không có số ngày tồn nào
                      để điền, và bịa ra một con số ở ô đó lại đúng loại lỗi này. Nên nút chuyển
                      người dùng sang đúng chỗ tạo phiếu tay. Chưa có mã việc — đừng bịa số DVP. */}
                  {t.k === 't1' ? <button onClick={() => { setToast(`Lô ${e.lot}: bộ máy chưa tự sinh phiếu chuyển — tạo phiếu tay ở Tồn kho chi nhánh.`); setView('inventory'); }} title="Bậc 1 — hành động đề xuất là đẩy sang điểm bán nhanh. Bộ máy chưa tự sinh phiếu điều chuyển; nút này mở màn Tồn kho chi nhánh, nơi tạo phiếu chuyển tay." style={{ border: '1px solid var(--dv-green-100)', background: '#fff', cursor: 'pointer', padding: '5px 11px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12, color: 'var(--dv-green)', whiteSpace: 'nowrap' }}>Tạo phiếu ở Tồn kho →</button>
                    : t.k === 't3' ? <span title="Bậc 3 — nguy cấp: markdown mạnh / trả NCC là quyết định thủ công, không tạo phiếu tự động." style={{ fontSize: 12, fontWeight: 600, color: 'var(--dv-ink-faint)', whiteSpace: 'nowrap' }}>Xử lý tay</span>
                    : null}
                </Td>
              </Tr>
            );
          })}
          {list.length === 0 && <tr><td colSpan={9} style={{ padding: 0 }}><window.EmptyState icon="IconHourglass" title="Không có lô nào khớp bộ lọc" hint="Số trên mỗi chip cho biết bậc nào còn lô. Chỉ những lô còn ≤90 ngày mới nằm trong thang FEFO." /></td></tr>}
        </tbody>
      </Table>
      <window.Pagination page={page} size={size} total={list.length} onPage={setPage} onSize={setSize} />
    </div>
  );
}
window.ExpiryScreen = ExpiryScreen;

/* ============ OFFERS (Duyệt SP mới) ============ */
function OffersPanel({ setToast }) {
  const { VND, StatusBadge, StatusTabs } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconSparkles, IconCheck, IconX } = window;
  const rows = window.OpsStore.use().offers;
  const [tab, setTab] = React.useState('pending');
  const act = (id, status, msg) => { window.OpsStore.set((st) => ({ offers: st.offers.map((x) => x.id === id ? { ...x, status } : x) })); setToast(msg); };
  const filtered = rows.filter((r) => tab === 'all' || r.status === tab);
  return (
    <div>
      <p style={{ fontSize: 13.5, color: 'var(--dv-ink-soft)', margin: '0 0 16px', lineHeight: 1.5 }}>Pipeline các sản phẩm ngoài danh mục do NCC mời chào. Chấp nhận để thêm vào danh mục, hoặc từ chối.</p>
      <div style={{ marginBottom: 18 }}>
        <StatusTabs items={[['pending', 'Chờ duyệt', rows.filter((r) => r.status === 'pending').length], ['approved', 'Đã thêm', rows.filter((r) => r.status === 'approved').length], ['rejected', 'Từ chối', rows.filter((r) => r.status === 'rejected').length], ['all', 'Tất cả', rows.length]]} value={tab} onChange={setTab} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
        {filtered.map((o) => (
          <div key={o.id} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: 18, position: 'relative', overflow: 'hidden' }}>
            <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--dv-yellow)' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconSparkles size={20} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--dv-ink)' }}>{o.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{o.ncc} · {o.pack}</div>
              </div>
              <StatusBadge status={o.status} size="sm" />
            </div>
            <div style={{ display: 'flex', gap: 18, padding: '10px 0', borderTop: '1px solid var(--border-default)', borderBottom: o.note ? '1px solid var(--border-default)' : 'none', marginBottom: o.note ? 12 : 14 }}>
              <div><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Giá đề nghị</div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)' }}>{VND(o.price)}</div></div>
              <div><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>VAT</div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 17, color: 'var(--dv-ink)' }}>{o.vat}%</div></div>
            </div>
            {o.note && <p style={{ fontSize: 13, color: 'var(--dv-ink-soft)', margin: '0 0 14px', lineHeight: 1.5 }}>“{o.note}”</p>}
            {o.status === 'pending' && (
              <div style={{ display: 'flex', gap: 9 }}>
                <button onClick={() => act(o.id, 'rejected', `Đã từ chối ${o.name}.`)} style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', fontWeight: 600, fontSize: 13 }}><IconX size={15} />Từ chối</button>
                <Button variant="primary" size="sm" onClick={() => act(o.id, 'approved', `Đã thêm ${o.name} vào danh mục.`)} style={{ flex: 1, justifyContent: 'center' }}>Thêm vào danh mục</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
window.OffersPanel = OffersPanel;

/* ============ INVITES — panel bên trong tab “Lời mời & truy cập” của Nhà cung cấp (G1) ============ */
/* Yêu cầu kết nối NCC (ADR-10 ④) — NCC tự đăng ký xin kết nối, admin nhà thuốc duyệt.
   MST = gợi-ý-only: matched / unmatched / conflict (JET-137). NCC chưa-map vẫn dùng bình thường. */
const CONNECT_REQ = [
  { id: 'cr1', ncc: 'Dược phẩm OPC', mst: '0301234567', contact: 'kinhdoanh@opcpharma.vn', sent: '2 giờ trước', mapped: 'matched', match: 'OPC Pharma (đã có trong danh bạ)' },
  { id: 'cr2', ncc: 'Mediplantex', mst: '0100823456', contact: 'sales@mediplantex.vn', sent: 'Hôm qua', mapped: 'unmatched', match: 'Chưa khớp NCC nào — sẽ tạo mới' },
  { id: 'cr3', ncc: 'Công ty Dược Hà Tây', mst: '0500112233', contact: 'cskh@duochatay.vn', sent: '2 ngày trước', mapped: 'conflict', match: 'Trùng MST với “DP Hà Tây” — cần xác minh' },
];
function ConnectApprovals({ setToast }) {
  const { StatusBadge } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconLink, IconStore, IconAlertTriangle, IconCheck } = window;
  const [rows, setRows] = React.useState(CONNECT_REQ);
  const mapTone = { matched: ['var(--dv-green-50)', 'var(--dv-green)', 'Khớp MST'], unmatched: ['var(--dv-mist)', 'var(--dv-ink-soft)', 'Chưa khớp'], conflict: ['#F8E0DD', '#9c2b22', 'Trùng MST'] };
  const act = (id, ok) => { const r = rows.find((x) => x.id === id); setRows((rs) => rs.filter((x) => x.id !== id)); setToast(ok ? `Đã duyệt kết nối với ${r.ncc} — thêm vào danh bạ (active).` : `Đã từ chối yêu cầu kết nối từ ${r.ncc}.`); };
  if (rows.length === 0) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid #F5E0A8', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'var(--dv-yellow-100)', borderBottom: '1px solid #F5E0A8' }}>
        <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconLink size={18} /></span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--dv-ink)' }}>Yêu cầu kết nối từ NCC</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--dv-yellow-600)', background: '#fff', padding: '3px 10px', borderRadius: 999 }}>{rows.length} chờ duyệt</span>
      </div>
      <div style={{ padding: '4px 0' }}>
        {rows.map((r, i) => {
          const [bg, fg, ml] = mapTone[r.mapped];
          return (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 18px', borderTop: i ? '1px solid var(--border-default)' : 'none', flexWrap: 'wrap' }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconStore size={19} /></span>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)' }}>{r.ncc}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>MST {r.mst} · {r.contact} · {r.sent}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 180 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start', padding: '2px 9px', borderRadius: 999, background: bg, color: fg, fontWeight: 700, fontSize: 11 }}>{r.mapped === 'conflict' && <IconAlertTriangle size={11} />}{ml}</span>
                <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{r.match}</span>
              </div>
              <div style={{ display: 'inline-flex', gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={() => act(r.id, false)}>Từ chối</Button>
                <Button variant="primary" size="sm" iconRight={<IconCheck size={15} />} onClick={() => act(r.id, true)}>{r.mapped === 'unmatched' ? 'Duyệt & tạo NCC' : 'Duyệt kết nối'}</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Danh mục NCC cũ (hệ cũ) cần đối soát MST với org-mạng (luồng B). data-only = badge xám TRUNG TÍNH. */
const RECONCILE_NCC = [
  { id: 'r1', name: 'Dược Hậu Giang (DHG)', mst: '1800156801', skus: 142, mapped: 'matched', org: 'Dược Hậu Giang (DHG)' },
  { id: 'r2', name: 'Imexpharm', mst: '1100273070', skus: 98, mapped: 'matched', org: 'Công ty CP Dược phẩm Imexpharm' },
  { id: 'r3', name: 'NCC Minh Long', mst: '0312667788', skus: 54, mapped: 'unmatched', org: null },
  { id: 'r4', name: 'Công ty Tradiphar', mst: '', skus: 23, mapped: 'unmatched', org: null },
  { id: 'r5', name: 'DP Hà Tây', mst: '0500112233', skus: 31, mapped: 'conflict', org: '2 org trùng MST' },
];
function ReconcilePanel({ setToast }) {
  const { IconLink, IconCheck, IconAlertTriangle } = window;
  const [rows, setRows] = React.useState(RECONCILE_NCC);
  const tone = { matched: ['var(--dv-green-50)', 'var(--dv-green)', 'Đã liên kết'], unmatched: ['var(--dv-mist)', 'var(--dv-ink-soft)', 'Chưa liên kết'], conflict: ['#FFF1CF', '#9c6a00', 'Trùng MST'] };
  const link = (id) => { const r = rows.find((x) => x.id === id); setRows((rs) => rs.map((x) => x.id === id ? { ...x, mapped: 'matched', org: x.name } : x)); setToast(`Đã liên kết ${r.name} với NCC mạng.`); };
  const counts = { unmatched: rows.filter((r) => r.mapped === 'unmatched').length, conflict: rows.filter((r) => r.mapped === 'conflict').length };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: 'var(--dv-mist)', borderRadius: 14, padding: '13px 16px', marginBottom: 18 }}>
        <span style={{ color: 'var(--dv-ink-faint)', flex: 'none', marginTop: 1 }}><IconLink size={17} /></span>
        <div style={{ fontSize: 13, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>Đối soát danh mục NCC hệ cũ với nhà cung cấp mạng MedOps qua MST. NCC <b>chưa liên kết</b> vẫn dùng bình thường (mua/nhập) — đây là trạng thái dữ-liệu trung tính, không phải lỗi. {counts.unmatched} chưa liên kết · {counts.conflict} trùng MST.</div>
      </div>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>{['NCC danh mục', 'MST', 'Số SKU', 'Liên kết mạng', 'Trạng thái', ''].map((h, i) => <th key={i} style={{ textAlign: i === 2 ? 'right' : 'left', padding: '11px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => { const [bg, fg, l] = tone[r.mapped]; return (
              <tr key={r.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13.5 }}>{r.name}</td>
                <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: r.mst ? 'var(--dv-ink)' : 'var(--dv-ink-faint)' }}>{r.mst || 'thiếu MST'}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{r.skus}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: r.org ? 'var(--dv-ink)' : 'var(--dv-ink-faint)' }}>{r.org || '—'}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: bg, color: fg, fontWeight: 700, fontSize: 11.5 }}>{r.mapped === 'conflict' && <IconAlertTriangle size={11} />}{l}</span></td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {r.mapped === 'unmatched' && <button onClick={() => link(r.id)} style={{ border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' }}>Gắn thủ công</button>}
                  {r.mapped === 'conflict' && <button onClick={() => setToast('Mở xác minh trùng MST.')} style={{ border: '1px solid #F0C8C3', background: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontWeight: 700, fontSize: 12.5, color: '#9c6a00' }}>Xác minh</button>}
                  {r.mapped === 'matched' && <span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconCheck size={17} /></span>}
                </td>
              </tr>
            ); })}
            {/* DVP-324: danh mục NCC hệ cũ trống — trạng thái bình thường, không phải lỗi */}
            {rows.length === 0 && <tr><td colSpan={6} style={{ padding: 0 }}><window.EmptyState icon="IconLink" title="Không có NCC nào cần đối soát" hint="Danh mục NCC hệ cũ trống hoặc đã liên kết hết với NCC mạng. NCC thêm mới qua cổng mạng đã có MST nên không xuất hiện ở đây." /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
window.ReconcilePanel = ReconcilePanel;

function InvitesPanel({ setToast }) {
  const { INVITES, StatusBadge, Table, Th, Td, Tr } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconMail, IconLink, IconUsers, IconInfo } = window;
  const [rows, setRows] = React.useState(INVITES);
  return (
    <>
      <ConnectApprovals setToast={setToast} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', borderRadius: 12, padding: '12px 15px', marginBottom: 20 }}>
        <span style={{ color: 'var(--dv-green)', flex: 'none', marginTop: 1 }}><IconLink size={16} /></span>
        <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>Yêu cầu kết nối đến từ <b style={{ color: 'var(--dv-ink)' }}>NCC gửi qua cổng mạng</b> (nhập mã/MST nhà thuốc) hoặc MedOps mai mối. Nhà thuốc không còn tự mời NCC — MedOps gác cổng tổ chức.</div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--dv-ink)', marginBottom: 12 }}>Lịch sử kết nối</div>
      <Table>
        <thead><tr><Th>Nhà cung cấp</Th><Th>Email</Th><Th>Ngày gửi</Th><Th>Trạng thái</Th><Th align="right">Thao tác</Th></tr></thead>
        <tbody>
          {rows.map((iv, i) => (
            <Tr key={i}>
              <Td strong><span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconUsers size={15} /></span>{iv.ncc}</span></Td>
              <Td mono color="var(--dv-ink-soft)">{iv.email}</Td>
              <Td mono color="var(--dv-ink-soft)">{iv.sent}</Td>
              <Td><StatusBadge status={iv.status === 'claimed' ? 'confirmed' : iv.status === 'expired' ? 'expired' : 'pending'} label={iv.status === 'claimed' ? 'Đã kích hoạt' : iv.status === 'expired' ? 'Hết hạn' : 'Chờ kích hoạt'} /></Td>
              <Td align="right">
                <div style={{ display: 'inline-flex', gap: 6 }}>
                  <button onClick={() => setToast('Đã sao chép liên kết kích hoạt.')} title="Sao chép liên kết" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconLink size={15} /></button>
                  {iv.status !== 'claimed' && <button onClick={() => setToast(`Đã gửi lại lời mời cho ${iv.ncc}.`)} style={{ padding: '6px 11px', borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12.5, color: 'var(--dv-green)' }}>Gửi lại</button>}
                  <button onClick={() => { setRows((r) => r.filter((x) => x !== iv)); setToast(`Đã thu hồi lời mời ${iv.ncc}.`); }} style={{ padding: '6px 11px', borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12.5, color: '#C5372C' }}>Thu hồi</button>
                </div>
              </Td>
            </Tr>
          ))}
          {/* DVP-324: chưa có kết nối nào — nói đúng mô hình: nhà thuốc không tự mời, NCC gửi yêu cầu qua cổng mạng */}
          {rows.length === 0 && <tr><td colSpan={5} style={{ padding: 0 }}><window.EmptyState icon="IconMail" title="Chưa có kết nối NCC nào" hint="Khi NCC gửi yêu cầu kết nối qua cổng mạng (bằng mã hoặc MST nhà thuốc), yêu cầu sẽ hiện ở đầu tab này để duyệt — duyệt xong sẽ được ghi vào lịch sử." /></td></tr>}
        </tbody>
      </Table>
    </>
  );
}
window.InvitesPanel = InvitesPanel;

/* ConnectorsScreen — moved to AdminScreens.jsx (operator-layer: read-only credentials + store mapping + schedule). Old duplicate removed. */

/* ============ AUDIT ============ */
function AuditScreen() {
  const { AUDIT, PageHeader, SearchBox, Toolbar, GhostBtn, StatusTabs, exportCSV } = window;
  const { IconFilter, IconDownload } = window;
  const [q, setQ] = React.useState('');
  const roleColor = { purchasing: 'var(--dv-green-bright)', approver: 'var(--dv-yellow-600)', warehouse: '#1d4f8a', system: 'var(--dv-ink-faint)', supplier: '#7a4fb5' };
  /* Lọc theo LOẠI đối tượng — đây là màn người ta mở ra để kiểm chứng "thao tác X có được ghi
     không", nên lọc theo loại chứng từ là việc tự nhiên nhất. Mã đối tượng có dạng LOẠI-số
     (PO-2406-121 · DC-0042) hoặc chỉ LOẠI (PARAM). Danh sách loại lấy TỪ dữ liệu, không kê tay:
     thêm một loại mới vào AUDIT là chip tự hiện, không có bảng nào để quên cập nhật. */
  const OBJ_LABELS = { PARAM: 'Tham số', PO: 'Đơn mua', DC: 'Điều chuyển', RFQ: 'Báo giá', SYNC: 'Đồng bộ', GRN: 'Nhập kho' };
  const objKind = (o) => { const s = String(o || '—'); const i = s.indexOf('-'); return i > 0 ? s.slice(0, i) : s; };
  const [showFilter, setShowFilter] = React.useState(false);
  const [kind, setKind] = React.useState('all');
  const byText = AUDIT.filter((a) => (a.who + a.act + a.obj).toLowerCase().includes(q.toLowerCase()));
  const kinds = Array.from(new Set(AUDIT.map((a) => objKind(a.obj))));
  const rows = byText.filter((a) => kind === 'all' || objKind(a.obj) === kind);
  const [size, setSize] = React.useState(10);
  const [offset, setOffset] = React.useState(0);
  React.useEffect(() => { setOffset(0); }, [q, kind]);
  const pageRows = rows.slice(offset, offset + size);
  const doExport = () => exportCSV('nhat_ky_hoat_dong.csv', ['Thời điểm', 'Người thực hiện', 'Vai trò', 'Hành động', 'Đối tượng', 'Chi tiết'], rows.map((a) => [a.at, a.who, a.role, a.act, a.obj, a.detail]));
  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1080, margin: '0 auto' }}>
      {/* DVP-345: nêu rõ chính sách lưu trữ — thông tin compliance, phải hiển thị chứ không ngầm định.
          Sửa 2026-08-28: "24 tháng" là CHÍNH SÁCH, không phải điều bản mẫu này chứng minh được
          (bản mẫu không giữ lịch sử nào cả) — nên câu chữ phải nói rõ đó là cam kết lưu trữ.
          Nửa còn lại thì kiểm được: NAV giới hạn mục 'audit' cho admin + approver. */}
      <PageHeader title="Nhật ký hoạt động" subtitle="Sổ ghi chỉ-thêm (append-only) — mọi thao tác đều được lưu vết phục vụ kiểm toán. Theo chính sách lưu trữ: giữ tối thiểu 24 tháng. Chỉ Quản trị viên và Người phê duyệt xem được." />
      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Tìm theo người, hành động, đối tượng…" width={320} />
        <GhostBtn icon={<IconFilter size={15} />} active={showFilter || kind !== 'all'} onClick={() => setShowFilter((v) => !v)}>Bộ lọc{kind !== 'all' ? ' · 1' : ''}</GhostBtn>
        <GhostBtn icon={<IconDownload size={15} />} onClick={doExport}>Xuất CSV</GhostBtn>
        {kind !== 'all' && <button onClick={() => setKind('all')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, color: 'var(--dv-green)' }}>Xoá lọc</button>}
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{rows.length} dòng</span>
      </Toolbar>
      {showFilter && (
        <div style={{ marginBottom: 16 }} title="Lọc theo loại đối tượng của bản ghi. Xuất CSV lấy đúng phần đang lọc.">
          <StatusTabs value={kind} onChange={setKind}
            items={[['all', 'Tất cả', byText.length]].concat(kinds.map((k) => [k, OBJ_LABELS[k] || k, byText.filter((a) => objKind(a.obj) === k).length]))} />
        </div>
      )}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {pageRows.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '13px 20px', borderTop: i ? '1px solid var(--border-default)' : 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-faint)', minWidth: 116 }}>{a.at}</span>
            <span style={{ minWidth: 150, fontSize: 13.5, fontWeight: 700, color: 'var(--dv-ink)' }}>{a.who}<span style={{ display: 'block', fontWeight: 600, fontSize: 11, color: roleColor[a.role] || 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{a.role}</span></span>
            <span style={{ flex: 1, fontSize: 13.5, color: 'var(--dv-ink)' }}>{a.act} <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--dv-green-bright)' }}>{a.obj}</span> <span style={{ color: 'var(--dv-ink-soft)' }}>· {a.detail}</span></span>
          </div>
        ))}
        {rows.length === 0 && <div style={{ padding: '28px 20px', textAlign: 'center', fontSize: 13, color: 'var(--dv-ink-soft)' }}>Không có bản ghi nào khớp tìm kiếm / bộ lọc.</div>}
      </div>
      <window.KeysetPager offset={offset} size={size} total={rows.length} onOlder={() => setOffset((o) => o + size)} onNewer={() => setOffset((o) => Math.max(0, o - size))} />
    </div>
  );
}
window.AuditScreen = AuditScreen;


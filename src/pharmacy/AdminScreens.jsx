/* Pharmacy — Users & RBAC (2.4) + enhanced Connectors (3.1). */
const cxSelInp = { padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff', color: 'var(--dv-ink)' };

/* ================= USERS & RBAC ================= */
const STAFF = [
  { id: 'U01', name: 'Nguyễn Văn Bình', email: 'binh@duocvuong.vn', role: 'admin', stores: 'Toàn chuỗi', status: 'active', last: 'Đang hoạt động' },
  { id: 'U02', name: 'Trần Thị Mai', email: 'mai@duocvuong.vn', role: 'purchasing', stores: 'Kho tổng', status: 'active', last: '08:42 hôm nay' },
  { id: 'U03', name: 'Lê Văn Hùng', email: 'hung@duocvuong.vn', role: 'warehouse', stores: 'Kho tổng · Q.1 · Q.5', status: 'active', last: '08:15 hôm nay' },
  { id: 'U04', name: 'Phạm Thị Lan', email: 'lan@duocvuong.vn', role: 'planning', stores: 'Toàn chuỗi', status: 'active', last: 'Hôm qua 17:30' },
  { id: 'U05', name: 'Vũ Minh Đức', email: 'duc@duocvuong.vn', role: 'approver', stores: 'Toàn chuỗi', status: 'active', last: 'Hôm qua 16:50' },
  { id: 'U06', name: 'Đỗ Thị Hạnh', email: 'hanh@duocvuong.vn', role: 'purchasing', stores: 'Kho tổng', status: 'locked', last: '02/06/2026' },
];
const ROLE_LABELS = { admin: 'Quản trị', planning: 'Kế hoạch', purchasing: 'Mua hàng', warehouse: 'Kho', approver: 'Phê duyệt' };
const ROLE_TONE = { admin: ['#F0E8F6', '#6b3fa0'], planning: ['var(--dv-green-50)', 'var(--dv-green)'], purchasing: ['#E5EEFb', '#1d4f8a'], warehouse: ['var(--dv-yellow-100)', 'var(--dv-yellow-600)'], approver: ['#FDEBE9', '#9c2b22'] };

function RoleChip({ r }) {
  const [bg, fg] = ROLE_TONE[r] || ['var(--dv-mist)', 'var(--dv-ink-soft)'];
  return <span style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: bg, color: fg }}>{ROLE_LABELS[r] || r}</span>;
}

function UsersScreen({ setToast }) {
  const { PageHeader, StatusTabs, SearchBox, Toolbar, StatusBadge } = window;
  const { Button, Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconUser, IconMail, IconPlus, IconEdit } = window;
  const [tab, setTab] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [invite, setInvite] = React.useState(false);
  const [rows, setRows] = React.useState(STAFF);
  const toggle = (id) => setRows((r) => r.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u));
  const list = rows.filter((u) => (tab === 'all' || u.status === tab) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  React.useEffect(() => { setPage(1); }, [q, tab]);
  const pageRows = list.slice((page - 1) * size, page * size);

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1120, margin: '0 auto' }}>
      {/* DVP-340: thống nhất "người dùng" (nút · ô tìm · cột · toast) — màn quản trị tài khoản hệ thống, không riêng nhân sự */}
      <PageHeader title="Người dùng & phân quyền" subtitle="Quản lý tài khoản người dùng nội bộ và vai trò truy cập (RBAC). Khác với “Quản lý NCC & lời mời” dành cho nhà cung cấp bên ngoài."
        actions={<span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
          <window.ExportImportBar label="Người dùng" importable={false} columns={['Họ tên', 'Email', 'Vai trò', 'Điểm bán', 'Trạng thái']}
            exportRows={() => STAFF.map((u) => [u.name, u.email, u.role, u.stores, u.status])}
            sampleRows={[{ cells: ['Ngô Văn G', 'g@duocvuong.vn', 'warehouse', 'Kho tổng', 'active'] }, { cells: ['Phan Thị H', 'h@duocvuong.vn', 'manager', 'Toàn chuỗi', 'active'], _warn: 'Vai trò không hợp lệ', _warnCol: 2 }]} setToast={setToast} />
          <Button variant="accent" size="md" iconRight={<IconPlus size={16} />} onClick={() => setInvite(true)}>Mời người dùng</Button>
        </span>} />

      {invite && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', padding: 20, marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
          <span style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--dv-yellow)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1fr', gap: 14, alignItems: 'end' }}>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Họ tên</label><input placeholder="Nguyễn Văn B" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', fontSize: 14, outline: 'none' }} /></div>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Email công ty</label><input placeholder="nguoidung@duocvuong.vn" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13.5, outline: 'none' }} /></div>
            <div><label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Vai trò</label><select style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border-strong)', fontSize: 14, outline: 'none', background: '#fff' }}>{Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="md" onClick={() => setInvite(false)}>Hủy</Button>
            <Button variant="primary" size="md" iconRight={<IconMail size={15} />} onClick={() => { setInvite(false); setToast('Đã gửi lời mời người dùng qua email.'); }}>Gửi lời mời</Button>
          </div>
        </div>
      )}

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Tìm người dùng…" width={280} />
        <span style={{ marginLeft: 'auto' }}><StatusTabs items={[['all', 'Tất cả', rows.length], ['active', 'Hoạt động', rows.filter((u) => u.status === 'active').length], ['locked', 'Đã khóa', rows.filter((u) => u.status === 'locked').length]]} value={tab} onChange={setTab} /></span>
      </Toolbar>

      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 640, fontFamily: 'var(--font-body)' }}>
          {/* DVP-228: gỡ cột "Điểm bán phụ trách" — RBAC gate theo màn, không theo chi nhánh; không có nguồn dữ liệu.
              DVP-382 #6: gỡ cột "Đăng nhập cuối" — chuỗi 6 điểm bán thì ai dùng ai không đã biết; cột không dẫn tới hành động nào. */}
          <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Người dùng', 'Vai trò', 'Trạng thái', ''].map((h, i) => <th key={i} style={{ textAlign: i === 3 ? 'right' : 'left', padding: '11px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-default)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {pageRows.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                <td style={{ padding: '13px 18px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, flex: 'none' }}>{u.name.split(' ').slice(-1)[0][0]}{u.name[0]}</span><div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{u.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{u.email}</div></div></div></td>
                <td style={{ padding: '13px 18px' }}><RoleChip r={u.role} /></td>
                <td style={{ padding: '13px 18px' }}>{u.status === 'active' ? <StatusBadge status="active" label="Hoạt động" /> : <StatusBadge status="rejected" label="Đã khóa" />}</td>
                <td style={{ padding: '13px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 7, alignItems: 'center' }}>
                    <button onClick={() => setToast(`Mở sửa vai trò cho ${u.name}.`)} title="Sửa" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={15} /></button>
                    <button onClick={() => { toggle(u.id); setToast(u.status === 'active' ? `Đã khóa ${u.name}.` : `Đã mở khóa ${u.name}.`); }} style={{ padding: '6px 11px', borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12.5, color: u.status === 'active' ? '#C5372C' : 'var(--dv-green)' }}>{u.status === 'active' ? 'Khóa' : 'Mở khóa'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <window.Pagination page={page} size={size} total={list.length} onPage={setPage} onSize={setSize} />
      <AccessMatrix />
    </div>
  );
}
window.UsersScreen = UsersScreen;

/* DVP-339: Ma trận truy cập (vai trò × màn) — SUY RA từ window.NAV (nguồn-sự-thật của sidebar),
   không chép tay: sửa quyền ở NAV là bảng này đổi theo, không bao giờ lệch. */
function AccessMatrix() {
  const { NAV, ROLES, IconCheck, IconShieldCheck } = window;
  const roleKeys = Object.keys(ROLES);
  const [only, setOnly] = React.useState('all');
  const cols = only === 'all' ? roleKeys : [only];
  return (
    <section style={{ marginTop: 30 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}><IconShieldCheck size={19} />Ma trận truy cập</h2>
          <p style={{ fontSize: 13, color: 'var(--dv-ink-soft)', margin: '5px 0 0', maxWidth: '78ch', lineHeight: 1.5 }}>Vai trò nào vào được màn nào. Bảng suy trực tiếp từ khai báo điều hướng của hệ thống — đổi quyền ở đó thì bảng này đổi theo, nên không có chuyện bảng nói một đằng hệ thống chạy một nẻo.</p>
        </div>
        <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3, flexWrap: 'wrap' }}>
          {[['all', 'Mọi vai trò'], ...roleKeys.map((k) => [k, ROLES[k]])].map(([k, l]) => { const on = only === k; return (
            <button key={k} onClick={() => setOnly(k)} style={{ border: 'none', cursor: 'pointer', padding: '7px 13px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, background: on ? '#fff' : 'transparent', color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: on ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
          ); })}
        </span>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 200 + cols.length * 118, fontFamily: 'var(--font-body)' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>
            <th style={{ textAlign: 'left', padding: '11px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', borderBottom: '1px solid var(--border-default)' }}>Màn</th>
            {cols.map((r) => <th key={r} style={{ textAlign: 'center', padding: '11px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>{ROLES[r]}</th>)}
          </tr></thead>
          <tbody>
            {NAV.map((grp) => (
              <React.Fragment key={grp.section}>
                <tr><td colSpan={cols.length + 1} style={{ padding: '9px 18px', background: 'var(--dv-green-50)', fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dv-green)', borderTop: '1px solid var(--border-default)' }}>{grp.section}</td></tr>
                {grp.items.map(([id, label, , roles]) => (
                  <tr key={id} style={{ borderTop: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '10px 18px', fontSize: 13.5, fontWeight: 600, color: 'var(--dv-ink)' }}>{label}</td>
                    {cols.map((r) => (
                      <td key={r} style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {roles.includes(r)
                          ? <span title={`${ROLES[r]} xem được ${label}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 7, background: 'var(--dv-green-50)', color: 'var(--dv-green)' }}><IconCheck size={14} /></span>
                          : <span title={`${ROLES[r]} không vào được ${label}`} style={{ color: 'var(--border-strong)', fontSize: 15, fontWeight: 700 }}>·</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 10, lineHeight: 1.5 }}>Ô trống nghĩa là <b>màn không hiện trong menu</b> của vai trò đó. Quyền thao tác bên trong từng màn (duyệt, sửa, xoá) do vai trò trên mỗi phiếu quyết định — không nằm ở bảng này.</div>
    </section>
  );
}

/* ================= CONNECTORS (enhanced) ================= */
function TokenCountdown({ hours = 18 }) {
  const { IconClock } = window;
  const [secs, setSecs] = React.useState(hours * 3600 + 1320);
  React.useEffect(() => { const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(id); }, []);
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: h < 2 ? '#C5372C' : 'var(--dv-green-bright)' }}><IconClock size={14} />{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>;
}

const CONNECTORS = [
  { key: 'kiotviet', name: 'KiotViet POS', desc: 'Tồn kho · bán hàng · điểm bán', icon: 'IconPlug', status: 'connected', kind: 'pos', token: true, managed: true, env: 'live',
    fields: [['Retailer', 'duocvuong', false], ['Client ID', 'dv-9f2a4c81-prod', false], ['Client Secret', '••••••••••••••••', true]] },
  { key: 'medcomm', name: 'Medcomm', desc: 'Quản trị nhà thuốc · tồn · bán', icon: 'IconPlug', status: 'connected', kind: 'pos', managed: true, env: 'live',
    fields: [['Base URL', 'https://api.medcomm.vn', false], ['Mã nhà thuốc', 'DV-0042', false], ['API Key', '••••••••••••', true]] },
  { key: 'odoo', name: 'Odoo ERP', desc: 'Công nợ · hóa đơn VAT · NCC master', icon: 'IconPlug', status: 'connected', kind: 'erp', managed: true, env: 'live',
    fields: [['URL JSON-RPC', 'https://erp.duocvuong.vn/jsonrpc', false], ['Database', 'dv_prod', false], ['User', 'api@duocvuong.vn', false], ['API Key', '••••••••••••', true]] },
  { key: 'zalo', name: 'Zalo OA', desc: 'Kênh thông báo cảnh báo', icon: 'IconBell', status: 'connected', kind: 'notify', env: 'live',
    fields: [['OA ID', '579112233445566', false], ['Access Token', '••••••••••••', true]] },
  { key: 'webhook', name: 'Webhook / n8n', desc: 'Tự động hóa sự kiện', icon: 'IconLink', status: 'connected', kind: 'automation', env: 'mock',
    fields: [['Endpoint', 'https://n8n.dv.vn/webhook/pharma', false], ['HMAC Secret', '••••••••', true]],
    events: ['product', 'stock', 'invoice', 'order', 'pricebook'] },
  /* DVP-343: ca "chưa cấu hình" — app đã xử lý, design trước đây chỉ vẽ connector đã chạy */
  { key: 'lark', name: 'Lark Suite', desc: 'Phê duyệt 1-chạm · thông báo', icon: 'IconCheckCircle', status: 'disconnected', kind: 'notify',
    fields: [['App ID', '', false], ['App Secret', '', true]] },
];
const ENV_META = { live: ['LIVE', 'var(--dv-green-50)', 'var(--dv-green)'], mock: ['MOCK', 'var(--dv-yellow-100)', 'var(--dv-yellow-600)'] };
/* Operator-level: map điểm bán ↔ chi nhánh provider (admin chuỗi tự cấu hình) */
const STORE_BRANCH_MAP = [
  { store: 'Kho tổng (DC)', branch: 'KV-1001 · Kho tổng', flows: { stock: true, sales: false, price: true } },
  { store: 'Dược Vương Q.1', branch: 'KV-1002 · CN Quận 1', flows: { stock: true, sales: true, price: true } },
  { store: 'Dược Vương Q.3', branch: 'KV-1003 · CN Quận 3', flows: { stock: true, sales: true, price: true } },
  { store: 'Dược Vương Q.5', branch: 'KV-1004 · CN Quận 5', flows: { stock: true, sales: true, price: false } },
  { store: 'Dược Vương Gò Vấp', branch: '— chưa map —', flows: { stock: false, sales: false, price: false } },
];
const SYNC_HEALTH = [
  { src: 'KiotViet', at: '08:55 · 4,2s', status: 'ok', detail: '1.842 SKU · 10 điểm bán' },
  { src: 'Medcomm', at: '08:55 · 3,1s', status: 'ok', detail: '4 điểm bán đồng bộ' },
  { src: 'Odoo', at: '08:55 · 2,1s', status: 'ok', detail: 'Công nợ 8 NCC' },
  { src: 'Zalo OA', at: '08:40', status: 'ok', detail: '3 thông báo đã gửi' },
];
const STATUS_DOT = { connected: ['var(--dv-green-bright)', 'Đang kết nối'], warning: ['var(--dv-yellow-600)', 'Cảnh báo'], disconnected: ['var(--dv-ink-faint)', 'Chưa kết nối'] };

function ConnectorCard({ c, setToast }) {
  const { Button, Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconChevronDown, IconLock, IconAlertTriangle, IconPlug } = window;
  const Icon = window[c.icon];
  const [open, setOpen] = React.useState(c.key === 'kiotviet');
  /* DVP-342: luồng dữ liệu do TENANT tự bật/tắt (credential vẫn do Dược Vương giữ) — banner đã hứa quyền này, giờ mới có nút */
  const [flow, setFlow] = React.useState(c.status !== 'disconnected');
  const [confirm, setConfirm] = React.useState(false);
  const [dot, label] = STATUS_DOT[c.status];
  const ro = c.managed;
  const unconfigured = c.status === 'disconnected' && c.fields.every(([, v]) => !v);
  const [envL, envBg, envFg] = ENV_META[c.env || 'live'];
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer' }} onClick={() => setOpen((o) => !o)}>
        <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon size={21} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--dv-green)', display: 'flex', alignItems: 'center', gap: 8 }}>{c.name}{ro && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', padding: '2px 8px', borderRadius: 999 }}><IconLock size={11} />Dược Vương quản lý</span>}</div>
          <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{c.desc}</div>
        </div>
        {/* DVP-343: môi trường là trạng thái vận hành — phải thấy ngay, không nằm trong phần mở rộng.
            Chưa cấu hình thì KHÔNG gắn nhãn môi trường: kênh chưa nối thì chưa thuộc live hay mock nào cả. */}
        {!unconfigured && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 800, letterSpacing: '.06em', padding: '3px 8px', borderRadius: 6, background: envBg, color: envFg }}>{envL}</span>}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: unconfigured ? 'var(--dv-ink-faint)' : dot }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: unconfigured ? 'var(--dv-ink-faint)' : dot }} />{unconfigured ? 'Chưa cấu hình' : !flow ? 'Đã tắt luồng' : label}</span>
        <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}><IconChevronDown size={18} /></span>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--border-default)', padding: 20 }}>
          {ro && <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--dv-mist)', borderRadius: 10, padding: '10px 13px', marginBottom: 14, fontSize: 12.5, color: 'var(--dv-ink-soft)' }}><span style={{ color: 'var(--dv-ink-faint)' }}><IconLock size={15} /></span>Credential do Dược Vương cấu hình &amp; bảo mật. Cần đổi kết nối? <b style={{ color: 'var(--dv-green)' }}>Liên hệ Dược Vương.</b></div>}
          {unconfigured && <window.EmptyState icon="IconPlug" title="Chưa cấu hình kết nối này" hint="Nhập thông tin bên dưới rồi bấm Lưu cấu hình. Chưa cấu hình thì kênh này không nhận được dữ liệu nào — cảnh báo sẽ chỉ đi qua các kênh còn lại." />}
          {/* DVP-342: bật/tắt luồng — có bước xác nhận vì tắt luồng làm dữ liệu ngừng chảy ngay */}
          {!unconfigured && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: flow ? 'var(--dv-green-50)' : '#F8E0DD', border: '1px solid ' + (flow ? 'var(--dv-green-100)' : '#F0C8C3'), borderRadius: 12, padding: '11px 15px', marginBottom: 14 }}>
              <span style={{ color: flow ? 'var(--dv-green)' : '#C5372C', display: 'inline-flex', flex: 'none' }}>{flow ? <IconPlug size={16} /> : <IconAlertTriangle size={16} />}</span>
              <div style={{ flex: 1, fontSize: 12.5, color: 'var(--dv-ink)', lineHeight: 1.45 }}>
                <b>{flow ? 'Luồng dữ liệu đang bật' : 'Luồng dữ liệu đã tắt'}</b> — {flow ? 'MedOps đang nhận dữ liệu từ kênh này theo lịch đồng bộ.' : 'MedOps ngừng nhận dữ liệu; số liệu trên các màn sẽ giữ nguyên ở lần đồng bộ cuối.'}
              </div>
              {confirm
                ? <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: '#C5372C' }}>Xác nhận?</span>
                    <Button variant="secondary" size="sm" onClick={() => setConfirm(false)}>Hủy</Button>
                    <Button variant="primary" size="sm" onClick={() => { setFlow((v) => !v); setConfirm(false); setToast(flow ? `Đã tắt luồng ${c.name} — dữ liệu ngừng chảy từ bây giờ.` : `Đã bật lại luồng ${c.name}.`); }}>{flow ? 'Tắt luồng' : 'Bật luồng'}</Button>
                  </span>
                : <Button variant="secondary" size="sm" onClick={() => setConfirm(true)}>{flow ? 'Tắt luồng' : 'Bật luồng'}</Button>}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {c.fields.map(([label, val, secret]) => (
              <div key={label}><label style={{ display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 6, color: ro ? 'var(--dv-ink-faint)' : 'var(--dv-ink)' }}>{label}</label><input defaultValue={val} type={secret ? 'password' : 'text'} readOnly={ro} placeholder={val ? '' : 'Chưa cấu hình'} style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none', background: ro ? 'var(--dv-mist)' : '#fff', color: ro ? 'var(--dv-ink-soft)' : 'var(--dv-ink)' }} /></div>
            ))}
          </div>
          {c.token && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, background: 'var(--dv-mist)', borderRadius: 10, padding: '9px 14px' }}><span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', fontWeight: 600 }}>Token hết hạn sau:</span><TokenCountdown /><span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>(tự làm mới)</span></div>}
          {c.events && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-faint)', marginBottom: 8 }}>Sự kiện đã đăng ký</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {c.events.map((ev) => <span key={ev} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '4px 10px', borderRadius: 999, border: '1px solid var(--dv-green-100)' }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dv-green-bright)' }} />{ev}</span>)}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {ro
              ? <><Button variant="secondary" size="md" onClick={() => setToast(`${c.name}: kết nối thành công (200 OK).`)}>Kiểm tra kết nối</Button>{c.kind === 'pos' && <Button variant="ghost" size="md" onClick={() => setToast(`Đang đồng bộ ${c.name}…`)}>Đồng bộ ngay</Button>}<Button variant="ghost" size="md" onClick={() => setToast('Đã gửi yêu cầu đổi kết nối tới Dược Vương.')}>Yêu cầu Dược Vương</Button></>
              : <><Button variant="primary" size="md" onClick={() => setToast(`Đã lưu cấu hình ${c.name}.`)}>Lưu cấu hình</Button><Button variant="secondary" size="md" onClick={() => setToast(`${c.name}: kết nối thành công (200 OK).`)}>Kiểm tra kết nối</Button></>}
          </div>
        </div>
      )}
    </div>
  );
}

/* Operator-level mapping: điểm bán ↔ chi nhánh provider + luồng dữ liệu */
function StoreMappingCard({ setToast }) {
  const { Switch } = window.DVMedKingDesignSystem_bf17f8;
  const { IconStore } = window;
  const [rows, setRows] = React.useState(STORE_BRANCH_MAP);
  const toggle = (i, flow) => setRows((rs) => rs.map((r, j) => j === i ? { ...r, flows: { ...r.flows, [flow]: !r.flows[flow] } } : r));
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px 6px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--dv-green)', margin: 0 }}>Map điểm bán ↔ chi nhánh</h3>
        <p style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', margin: '4px 0 0' }}>Bạn (admin chuỗi) tự gán mỗi điểm bán với chi nhánh trên hệ quản trị và chọn luồng dữ liệu đồng bộ.</p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Điểm bán', 'Chi nhánh (provider)', 'Tồn', 'Bán', 'Giá'].map((h, i) => <th key={i} style={{ textAlign: i < 2 ? 'left' : 'center', padding: '10px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r, i) => {
              const unmapped = r.branch.includes('chưa map');
              return (
                <tr key={r.store} style={{ borderTop: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '11px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconStore size={15} /></span><span style={{ fontWeight: 600, fontSize: 13.5 }}>{r.store}</span></div></td>
                  <td style={{ padding: '11px 16px' }}>
                    <select defaultValue={r.branch} onChange={() => setToast(`Đã map ${r.store}`)} style={{ ...cxSelInp, padding: '7px 10px', fontSize: 13, color: unmapped ? '#C5372C' : 'var(--dv-ink)', borderColor: unmapped ? '#F0C8C3' : 'var(--border-strong)' }}>
                      <option>{r.branch}</option><option>KV-1005 · CN Gò Vấp</option><option>KV-1006 · CN Tân Bình</option>
                    </select>
                  </td>
                  {['stock', 'sales', 'price'].map((fl) => (
                    <td key={fl} style={{ padding: '11px 16px', textAlign: 'center' }}><div style={{ display: 'inline-flex' }}><Switch checked={r.flows[fl]} onChange={() => toggle(i, fl)} /></div></td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SyncScheduleCard({ setToast }) {
  const { Switch } = window.DVMedKingDesignSystem_bf17f8;
  const [auto, setAuto] = React.useState(true);
  const [every, setEvery] = React.useState('30');
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--dv-green)', margin: '0 0 14px' }}>Lịch đồng bộ</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>Tự động đồng bộ</div><div style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>Kéo dữ liệu định kỳ từ hệ quản trị</div></div>
        <Switch checked={auto} onChange={(v) => { setAuto(v); setToast(v ? 'Đã bật tự đồng bộ' : 'Đã tắt tự đồng bộ'); }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12 }}>
        <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5, color: auto ? 'var(--dv-ink)' : 'var(--dv-ink-faint)' }}>Tần suất</div></div>
        <select value={every} disabled={!auto} onChange={(e) => setEvery(e.target.value)} style={{ ...cxSelInp, opacity: auto ? 1 : 0.5 }}><option value="15">Mỗi 15 phút</option><option value="30">Mỗi 30 phút</option><option value="60">Mỗi giờ</option></select>
      </div>
    </div>
  );
}

/* Jack 2026-09-04 — "Kết nối hệ thống" giờ là MỘT TAB của Cài đặt. Thân màn tách ra thành
   ConnectorsPanel (không PageHeader riêng) để tab dùng; ConnectorsScreen bọc lại panel này cho
   route 'connectors' cũ — một thân, hai lối vào, không có bản chép thứ hai để lệch nhau. */
function ConnectorsPanel({ setToast }) {
  const { IconRefresh, IconLock } = window;
  return (
    <div>
      <div style={{ fontSize: 13, color: 'var(--dv-ink-soft)', lineHeight: 1.5, marginBottom: 14 }}>Kết nối hệ quản trị do Dược Vương cấu hình. Bạn tự quản map điểm bán, luồng dữ liệu và lịch đồng bộ.</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: 'var(--dv-mist)', borderRadius: 14, padding: '13px 16px', marginBottom: 20 }}>
        <span style={{ color: 'var(--dv-ink-faint)', flex: 'none', marginTop: 1 }}><IconLock size={17} /></span>
        <div style={{ fontSize: 13, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>Phần <b style={{ color: 'var(--dv-ink)' }}>credential &amp; chọn hệ quản trị</b> do đội kỹ thuật Dược Vương phụ trách (bảo mật key). Phần <b style={{ color: 'var(--dv-ink)' }}>map điểm bán, bật/tắt luồng, lịch đồng bộ</b> bên dưới do bạn tự cấu hình.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 300px)', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CONNECTORS.map((c) => <ConnectorCard key={c.key} c={c} setToast={setToast} />)}
          <StoreMappingCard setToast={setToast} />
          <SyncScheduleCard setToast={setToast} />
        </div>
        {/* sync health */}
        <section style={{ position: 'sticky', top: 86, background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '16px 18px 12px' }}>
            <span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconRefresh size={17} /></span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--dv-green)', margin: 0 }}>Sức khỏe đồng bộ</h3>
          </div>
          {SYNC_HEALTH.map((h, i) => (
            <div key={h.src} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '12px 18px', borderTop: '1px solid var(--border-default)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', marginTop: 5, background: h.status === 'ok' ? 'var(--dv-green-bright)' : 'var(--dv-yellow-600)', flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{h.src}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{h.at}</span></div>
                <div style={{ fontSize: 12, color: h.status === 'ok' ? 'var(--dv-ink-soft)' : 'var(--dv-yellow-600)', marginTop: 2 }}>{h.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--dv-ink-soft)', fontWeight: 600 }}>Token KiotViet (24h)</span>
            <TokenCountdown />
          </div>
        </section>
      </div>
    </div>
  );
}
window.ConnectorsPanel = ConnectorsPanel;

function ConnectorsScreen({ setToast }) {
  const { PageHeader } = window;
  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1180, margin: '0 auto' }}>
      <PageHeader title="Kết nối hệ thống" subtitle="Mục này đã chuyển vào Cài đặt → Vận hành → Kết nối hệ thống." />
      <ConnectorsPanel setToast={setToast} />
    </div>
  );
}
window.ConnectorsScreen = ConnectorsScreen;

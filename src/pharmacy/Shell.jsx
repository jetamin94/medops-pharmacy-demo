/* DV Connect — Pharmacy Ops shell: deep-green sidebar + white topbar, role-filtered nav. */
/* Claude Code 2026-09-07 — 'CTKM nhà cung cấp' rời sidebar (khối CTKM / NCC-RFQ đóng băng theo khung
   ưu tiên Jet chốt 06-09; DVP-175 việc 7). Route 'promos' vẫn sống cho link cũ — ẩn ≠ xoá. */

/* Feature flags Console → Portal (cầu nối qua localStorage; key theo tenant).
   Console (ProfileFeatures) ghi medops_flags_<tenant>; Portal đọc & ẩn menu tương ứng.
   T04: cùng key này giờ mang thêm classify.ven / classify.xyz / classify.shape — Console ghi;
   Danh mục + Tồn kho ẩn cột theo cờ. Nơi lưu thật NỢ tenant_setting (NO_TICKET_YET). */
const NAV_FEATURE = { transfers: 'transfer', rfq: 'rfq', expiry: 'fefo', offers: 'supplier_portal' };
function readTenantFlags() {
  try {return JSON.parse(localStorage.getItem('medops_flags_duocvuong') || '{}');} catch (e) {return {};}
}
window.readTenantFlags = readTenantFlags;
const NAV = [
{ section: 'Vận hành', items: [
  ['dashboard', 'Tổng quan', 'IconDashboard', ['admin', 'planning', 'purchasing', 'warehouse', 'approver']],
  ['inventory', 'Tồn kho chi nhánh', 'IconBoxes', ['admin', 'planning', 'purchasing', 'warehouse']],
  ['transfers', 'Điều chuyển', 'IconTransfer', ['admin', 'planning', 'warehouse']],
  ['receiving', 'Nhận hàng', 'IconReceive', ['admin', 'warehouse']],
  ['expiry', 'Cận hạn / FEFO', 'IconHourglass', ['admin', 'planning', 'warehouse']]]
},
{ section: 'Mua hàng', items: [
  ['purchasing', 'Đề xuất mua hàng', 'IconCart', ['admin', 'planning', 'purchasing']],
  ['missing-supplier', 'SKU chưa có NCC', 'IconLink', ['admin', 'planning', 'purchasing']],
  /* Claude Code 2026-09-07 — 'promos' (CTKM nhà cung cấp) rời sidebar: khối đóng băng 06-09. */
  ['rfq', 'Yêu cầu báo giá', 'IconQuote', ['admin', 'purchasing']],
  ['approvals', 'Chờ duyệt', 'IconClipboardCheck', ['admin', 'approver']]]
  /* Jack 2026-09-04 — 'Duyệt SP mới' rời sidebar; lối vào là tab "offers" của màn Nhà cung cấp
     (route 'offers' vẫn sống cho link cũ). */
},
{ section: 'Danh mục', items: [
  ['products', 'Danh mục sản phẩm', 'IconBox', ['admin', 'planning', 'purchasing']],
  ['suppliers', 'Nhà cung cấp', 'IconSuppliers', ['admin', 'purchasing']],
  ['network', 'Điểm bán & Mạng lưới', 'IconStore', ['admin', 'planning']],
  ['masterlists', 'Dữ liệu nền', 'IconLayers', ['admin', 'planning']]]
},
{ section: 'Quản trị', items: [
  ['users', 'Người dùng & phân quyền', 'IconShieldCheck', ['admin']],
  /* Jack 2026-09-04 — 'Kết nối' về làm tab trong Cài đặt; route vẫn sống, chỉ rời sidebar. */
  ['settings', 'Cài đặt', 'IconSettings', ['admin', 'planning']],
  ['audit', 'Nhật ký', 'IconAudit', ['admin', 'approver']]]
}];


const ROLES = {
  admin: 'Quản trị viên', planning: 'Kế hoạch', purchasing: 'Mua hàng', warehouse: 'Kho', approver: 'Phê duyệt'
};
/* DVP-205: sidebar KHÔNG có badge số đếm — không có nguồn đếm tin cậy (số sẽ cũ / bịa).
   Việc cần xử lý hiển thị ở chuông thông báo trên topbar. */

/* DVP-339: NAV + ROLES là nguồn-sự-thật của RBAC — ma trận truy cập suy ra từ đây, không chép tay */
window.NAV = NAV;window.ROLES = ROLES;

/* ---------- Notification center (A3) ---------- */
function NotifBell({ setView }) {
  const { NOTIFICATIONS } = window;
  const { IconBell, IconCheck } = window;
  const [open, setOpen] = React.useState(false);
  const [read, setRead] = React.useState(() => new Set());
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const unread = NOTIFICATIONS.filter((n) => !read.has(n.id)).length;
  const toneCol = { red: ['#F8E0DD', '#C5372C'], yellow: ['var(--dv-yellow-100)', 'var(--dv-yellow-600)'], green: ['var(--dv-green-50)', 'var(--dv-green-bright)'] };
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ position: 'relative', border: 'none', background: open ? 'var(--dv-mist)' : 'transparent', borderRadius: 10, cursor: 'pointer', color: 'var(--dv-ink-soft)', padding: 7, display: 'inline-flex' }}>
        <IconBell size={21} />
        {unread > 0 && <span style={{ position: 'absolute', top: 1, right: 0, minWidth: 16, height: 16, padding: '0 4px', borderRadius: 999, background: 'var(--dv-danger)', color: '#fff', border: '2px solid #fff', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 9.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
      </button>
      {open &&
      <div style={{ position: 'absolute', right: 0, top: '125%', zIndex: 80, width: 390, background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid var(--border-default)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--dv-green)' }}>Thông báo</span>
            {unread > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#C5372C', background: '#F8E0DD', padding: '1px 8px', borderRadius: 999 }}>{unread} mới</span>}
            <button onClick={() => setRead(new Set(NOTIFICATIONS.map((n) => n.id)))} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 12 }}><IconCheck size={13} />Đánh dấu đã đọc</button>
          </div>
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {/* JET-153: work queue — nhóm theo mức khẩn, mỗi mục có hành động đi thẳng vào việc */}
            {(() => {
            const ACTION_LABEL = { rfq: 'Mở RFQ', receiving: 'Xử lý nhận hàng', approvals: 'Vào duyệt', inventory: 'Xem tồn kho', expiry: 'Xử lý cận hạn', purchasing: 'Xem đề xuất', suppliers: 'Mở NCC', dashboard: 'Xem tổng quan' };
            const urgent = NOTIFICATIONS.filter((n) => n.tone !== 'green');
            const info = NOTIFICATIONS.filter((n) => n.tone === 'green');
            const Item = (n, i) => {
              const Icon = window[n.icon];
              const [bg, fg] = toneCol[n.tone] || toneCol.green;
              const isRead = read.has(n.id);
              return (
                <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '12px 16px', borderTop: i ? '1px solid var(--border-default)' : 'none', background: isRead ? '#fff' : 'rgba(253,184,19,.05)' }}>
                    <span style={{ width: 34, height: 34, borderRadius: 10, background: bg, color: fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 1 }}><Icon size={17} /></span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: isRead ? 500 : 700, color: 'var(--dv-ink)', lineHeight: 1.4 }}>{n.text}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                        <button onClick={() => {setRead((r) => new Set([...r, n.id]));setOpen(false);setView(n.to);}} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: n.tone === 'red' ? 'var(--dv-green)' : 'var(--dv-green-50)', color: n.tone === 'red' ? '#fff' : 'var(--dv-green)', cursor: 'pointer', padding: '4px 11px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11.5 }}>{ACTION_LABEL[n.to] || 'Mở'} →</button>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{n.time}</span>
                        {!isRead && <button onClick={() => setRead((r) => new Set([...r, n.id]))} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: 'var(--dv-ink-faint)', padding: 0 }}>Đã đọc</button>}
                      </span>
                    </span>
                    {!isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dv-danger)', flex: 'none', marginTop: 6 }} />}
                  </div>);

            };
            return <>
                {urgent.length > 0 && <div style={{ padding: '9px 16px 7px', fontSize: 10.5, fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color: '#C5372C', background: '#FDF6F5' }}>Cần xử lý · {urgent.filter((n) => !read.has(n.id)).length}</div>}
                {urgent.map(Item)}
                {info.length > 0 && <div style={{ padding: '9px 16px 7px', fontSize: 10.5, fontWeight: 800, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--dv-ink-faint)', background: 'var(--dv-mist)', borderTop: '1px solid var(--border-default)' }}>Thông tin</div>}
                {info.map(Item)}
              </>;
          })()}
          </div>
        </div>
      }
    </div>);

}
window.NotifBell = NotifBell;

function usePharmIsMobile(bp = 900) {
  const [m, setM] = React.useState(typeof window !== 'undefined' && window.innerWidth < bp);
  React.useEffect(() => {const h = () => setM(window.innerWidth < bp);window.addEventListener('resize', h);return () => window.removeEventListener('resize', h);}, []);
  return m;
}
window.usePharmIsMobile = usePharmIsMobile;

function PharmaSidebar({ view, setView, role, mobile, open, onClose }) {
  const flags = readTenantFlags();
  const aside =
  <aside style={{ width: 256, flex: 'none', background: 'var(--dv-green)', color: '#fff', display: 'flex', flexDirection: 'column', height: '100vh', ...(mobile ? { position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 95, transform: open ? 'translateX(0)' : 'translateX(-105%)', transition: 'transform .26s cubic-bezier(.22,1,.36,1)', boxShadow: open ? '0 0 50px rgba(0,30,22,.4)' : 'none' } : { position: 'sticky', top: 0 }) }}>
      <div style={{ padding: '22px 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <window.MedOpsLogo size={22} reversed tagline="Vận hành chuỗi dược" />
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 12px' }}>
        {NAV.map(({ section, items }) => {
        const visible = items.filter(([id,,, roles]) => roles.includes(role) && !(NAV_FEATURE[id] && flags[NAV_FEATURE[id]] === false));
        if (!visible.length) return null;
        return (
          <div key={section} style={{ marginBottom: 14 }}>
              <div style={{ padding: '8px 12px 6px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.42)' }}>{section}</div>
              {visible.map(([k, label, icon]) => {
              const on = view === k;
              const Icon = window[icon];
              return (
                <button key={k} onClick={() => {setView(k);onClose && onClose();}} style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderRadius: 10, marginBottom: 2, fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 500, fontSize: 14.5,
                  background: on ? 'rgba(255,255,255,.12)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,.74)' }}>
                    {on && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 3, borderRadius: 999, background: 'var(--dv-yellow)' }} />}
                    <span style={{ color: on ? 'var(--dv-yellow)' : 'rgba(255,255,255,.6)', display: 'inline-flex' }}><Icon size={19} /></span>
                    <span style={{ flex: 1 }}>{label}</span>
                  </button>);

            })}
            </div>);

      })}
      </nav>
      <div style={{ margin: 12, background: 'rgba(255,255,255,.07)', borderRadius: 14, padding: 14, display: 'flex', gap: 11, alignItems: 'center' }}>
        <span style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{React.createElement(window.IconShieldCheck, { size: 20 })}</span>
        <div style={{ lineHeight: 1.3 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}>Nhà thuốc Dược Vương</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.6)' }}>9 điểm bán · Kho tổng Q.Bình Tân</div>
        </div>
      </div>
    </aside>;
  if (!mobile) return aside;
  return <>
    {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,30,22,.45)' }} />}
    {aside}
  </>;
}
window.PharmaSidebar = PharmaSidebar;

function RolePicker({ role, setRole, setView }) {
  const [open, setOpen] = React.useState(false);
  const { IconUser, IconChevronDown } = window;
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '7px 12px 7px 8px', borderRadius: 999 }}>
        <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconUser size={18} /></span>
        <span style={{ textAlign: 'left', lineHeight: 1.25 }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>Nguyễn Văn Bình</span>
          <span style={{ display: 'block', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{ROLES[role]} · MedOps</span>
        </span>
        <span style={{ color: 'var(--dv-ink-faint)' }}><IconChevronDown size={16} /></span>
      </button>
      {open &&
      <div style={{ position: 'absolute', right: 0, top: '115%', zIndex: 60, width: 240, background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-default)', padding: 8 }}>
          {/* DVP-483 — lối vào "Hồ sơ của tôi". Màn này KHÔNG ở sidebar: bên code `/profile` khai
             `hidden: true` (mở cho MỌI vai trò, nhưng vào từ khối người dùng trên topbar). */}
          <button onClick={() => {setView('profile');setOpen(false);}} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: '9px 10px', borderRadius: 9, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--dv-ink)' }}>Hồ sơ của tôi</button>
          <div style={{ height: 1, background: 'var(--border-default)', margin: '6px 4px' }} />
          <div style={{ padding: '6px 10px 4px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dv-ink-faint)' }}>Xem với vai trò</div>
          {Object.entries(ROLES).map(([k, label]) =>
        <button key={k} onClick={() => {setRole(k);setOpen(false);}} style={{ width: '100%', textAlign: 'left', border: 'none', background: role === k ? 'var(--dv-green-50)' : 'transparent', cursor: 'pointer', padding: '9px 10px', borderRadius: 9, fontFamily: 'var(--font-body)', fontWeight: role === k ? 700 : 500, fontSize: 14, color: role === k ? 'var(--dv-green)' : 'var(--dv-ink)' }}>{label}</button>
        )}
        </div>
      }
    </div>);

}

function PharmaTopbar({ title, role, setRole, syncing, lastSync, onLogout, setView, mobile, onMenu }) {
  const { IconBell, IconLogout } = window;
  return (
    <header style={{ height: mobile ? 60 : 70, flex: 'none', background: '#fff', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: mobile ? 10 : 18, padding: mobile ? '0 14px' : '0 28px', position: 'sticky', top: 0, zIndex: 40 }}>
      {mobile && <button onClick={onMenu} aria-label="Mở menu" style={{ border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', width: 40, height: 40, borderRadius: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dv-green)', flex: 'none' }}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
      </button>}
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: mobile ? 16.5 : 20, fontWeight: 800, color: 'var(--dv-green)', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{title}</h1>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: mobile ? 8 : 14, flex: 'none' }}>
        {!mobile && lastSync && <span title="Thời điểm dữ liệu được tính toán gần nhất" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--dv-ink-faint)', fontFamily: 'var(--font-body)', fontWeight: 600, whiteSpace: 'nowrap' }}><span style={{ width: 7, height: 7, borderRadius: 999, background: syncing ? 'var(--dv-yellow-600)' : 'var(--dv-green-bright)', flex: 'none', animation: syncing ? 'dvPulse 1s ease-in-out infinite' : 'none' }} />{syncing ? 'Đang đồng bộ…' : 'Số liệu ' + lastSync}</span>}
        {/* Jack 2026-09-04 — chip "Hồ sơ" + nút "Đồng bộ & tính toán" đã DỜI vào màn Cài đặt:
            hồ sơ tham số đổi ở ProfileBar (Cài đặt), còn lượt đồng bộ nằm cạnh "Lịch chạy engine" —
            nơi nói nhịp chạy. Thanh trên cùng giữ lại mốc "Số liệu" vì đó là thông tin đọc,
            không phải thao tác. */}        <NotifBell setView={setView} />
        <div id="i18n-slot" style={{ display: 'inline-flex', flex: 'none' }} />
        <window.FeedbackLauncher surface="pharmacy" route={title} tenant="duocvuong" role={role} />
        {!mobile && <><div style={{ width: 1, height: 30, background: 'var(--border-default)' }} />
        <RolePicker role={role} setRole={setRole} setView={setView} />
        <button onClick={onLogout} title="Đăng xuất" style={{ border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', padding: 9, borderRadius: 999, display: 'inline-flex' }}><IconLogout size={18} /></button></>}
      </div>
    </header>);

}
window.PharmaTopbar = PharmaTopbar;

/* ---------- SyncDrawer: 'Đồng bộ & tính toán' → drawer tiến trình (khớp app; thay no-op prototype) ---------- */
function SyncDrawer({ open, onStart, onDone, onClose }) {
  const { IconRefresh, IconCheckCircle, IconX, IconPlug, IconDownload, IconLayers, IconCalculator, IconHourglass } = window;
  const STAGES = [
  ['Kết nối nguồn dữ liệu', 'Odoo ERP · KiotViet POS', IconPlug],
  ['Kéo tồn kho & giá mua', '1.842 SKU · 10 điểm bán', IconDownload],
  ['Chuẩn hoá & khớp danh mục', 'ánh xạ SKU · đơn vị · lô/HSD', IconLayers],
  ['Tính lại đề xuất & điều chuyển', 'engine ADS · ROP · Max', IconCalculator],
  ['Cập nhật cảnh báo cận hạn', 'FEFO · lô cách ly', IconHourglass]];

  const [step, setStep] = React.useState(0);
  const done = step >= STAGES.length;
  React.useEffect(() => {
    if (!open) {setStep(0);return;}
    setStep(0);onStart && onStart();
    let i = 0,timer;
    const tick = () => {
      i += 1;setStep(i);
      if (i < STAGES.length) {timer = setTimeout(tick, 640);} else
      {const d = new Date();const p = (x) => String(x).padStart(2, '0');onDone && onDone(`${p(d.getHours())}:${p(d.getMinutes())} · ${p(d.getDate())}-${p(d.getMonth() + 1)}`);}
    };
    timer = setTimeout(tick, 640);
    return () => clearTimeout(timer);
  }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 140, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={done ? onClose : undefined} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.4)', animation: 'dvFade .2s ease' }} />
      <div style={{ position: 'relative', width: 'min(432px, 96vw)', height: '100%', background: '#fff', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', animation: 'dvFade .2s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--border-default)' }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: done ? 'var(--dv-green-50)' : 'var(--dv-mist)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><span style={{ display: 'inline-flex', animation: done ? 'none' : 'dvSpin .9s linear infinite' }}>{done ? <IconCheckCircle size={21} /> : <IconRefresh size={20} />}</span></span>
          <div style={{ flex: 1 }}><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0 }}>{done ? 'Đồng bộ hoàn tất' : 'Đang đồng bộ & tính toán'}</h3><div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{done ? 'Dữ liệu & đề xuất đã được cập nhật' : 'Kéo dữ liệu từ ERP/POS rồi tính lại đề xuất'}</div></div>
          <button onClick={onClose} disabled={!done} title="Đóng" style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: done ? 'pointer' : 'not-allowed', opacity: done ? 1 : 0.5, color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 22px' }}>
          {STAGES.map(([label, sub, Ic], i) => {
            const st = step > i ? 'done' : step === i ? 'run' : 'wait';
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 4px', opacity: st === 'wait' ? 0.5 : 1, transition: 'opacity .2s' }}>
                <span style={{ width: 34, height: 34, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: st === 'done' ? 'var(--dv-green)' : st === 'run' ? 'var(--dv-green-50)' : 'var(--dv-mist)', color: st === 'done' ? '#fff' : 'var(--dv-green)' }}>{st === 'done' ? <IconCheckCircle size={18} /> : <span style={{ display: 'inline-flex', animation: st === 'run' ? 'dvSpin .9s linear infinite' : 'none' }}><Ic size={17} /></span>}</span>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)' }}>{label}</div><div style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>{sub}</div></div>
                {st === 'done' && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dv-green-bright)' }}>Xong</span>}
                {st === 'run' && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dv-yellow-600)' }}>Đang chạy…</span>}
              </div>);

          })}
        </div>
        {done && <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border-default)', background: 'var(--dv-green-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--dv-green)', fontWeight: 700 }}><IconCheckCircle size={16} />Đã tính lại đề xuất mua & điều chuyển</div>
          <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 4 }}>1.842 SKU · 10 điểm bán · nguồn Odoo + KiotViet</div>
          <button onClick={onClose} style={{ marginTop: 12, width: '100%', border: 'none', background: 'var(--dv-green)', color: '#fff', cursor: 'pointer', padding: '11px', borderRadius: 10, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>Đóng</button>
        </div>}
      </div>
    </div>);

}
window.SyncDrawer = SyncDrawer;

/* ---------- Login ---------- */
function PharmaLogin({ onLogin }) {
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconShieldCheck, IconTruck, IconCheckCircle } = window;
  const [email, setEmail] = React.useState('binh@duocvuong.vn');
  const [pw, setPw] = React.useState('••••••••••');
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      {/* Brand panel */}
      <div style={{ flex: '1 1 50%', background: 'var(--dv-green)', color: '#fff', padding: '56px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -120, top: -120, width: 420, height: 420, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -160, width: 320, height: 320, borderRadius: '50%', background: 'rgba(253,184,19,.06)' }} />
        <window.MedOpsLogo size={30} reversed tagline="Vận hành chuỗi dược" />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', color: 'var(--dv-yellow)', textTransform: 'uppercase', marginBottom: 16 }}>Cổng vận hành nội bộ · Vận hành chuỗi cung ứng</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 42, lineHeight: 1.08, letterSpacing: '-0.02em', margin: 0, maxWidth: '15ch', color: '#fff' }}>Mua hàng thông minh — không rủi ro.</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.78)', lineHeight: 1.6, marginTop: 18, maxWidth: '42ch' }}>Dự báo nhu cầu, tối ưu tồn kho và đặt hàng minh bạch cho toàn chuỗi nhà thuốc.</p>
          <div style={{ display: 'flex', gap: 26, marginTop: 34 }}>
            {[[IconCheckCircle, '100% hàng chính hãng'], [IconTruck, 'Giao 24h toàn quốc'], [IconShieldCheck, 'CO/CQ đầy đủ']].map(([Ic, t], i) =>
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>
                <span style={{ color: 'var(--dv-yellow)', display: 'inline-flex' }}><Ic size={18} /></span>{t}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.5)' }}>© 2026 Công ty CP Thương Mại Dược Vương</div>
      </div>
      {/* Form */}
      <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dv-paper)', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: 'var(--dv-green)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Đăng nhập</h2>
          <p style={{ color: 'var(--dv-ink-soft)', margin: '0 0 28px', fontSize: 14.5 }}>Cổng vận hành nội bộ MedOps — Dược Vương.</p>
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)', marginBottom: 7 }}>Email công ty</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', borderRadius: 12, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 15, marginBottom: 18, outline: 'none' }} />
          <label style={{ display: 'block', fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)', marginBottom: 7 }}>Mật khẩu</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', borderRadius: 12, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 15, marginBottom: 14, outline: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--dv-ink-soft)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--dv-green)', width: 16, height: 16 }} />Ghi nhớ đăng nhập
            </label>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13.5, color: 'var(--dv-green-bright)', fontWeight: 600, textDecoration: 'none' }}>Quên mật khẩu?</a>
          </div>
          <Button variant="primary" size="lg" onClick={onLogin} style={{ width: '100%', justifyContent: 'center' }}>Đăng nhập</Button>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--dv-ink-faint)', marginTop: 22 }}>Bản demo · Nhà thuốc Dược Vương · Dữ liệu minh họa</p>
        </div>
      </div>
    </div>);

}
window.PharmaLogin = PharmaLogin;
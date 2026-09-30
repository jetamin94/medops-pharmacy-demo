/* Pharmacy — DANH MỤC (2.1): nền dùng chung + hồ sơ mặt hàng + bộ lọc.
   Tách 2026-09-07 (DVP-586): tệp cũ 102 KB gộp HAI màn không liên quan — Danh mục sản phẩm
   (2.1) và Điểm bán & Mạng lưới (2.2). `write_files` không có chế độ vá, nên kích thước tệp
   LÀ trần sửa đổi: đo 2026-08-30, một lượt ghi 101 KB hết ngân sách output ⇒ tệp đóng băng,
   không lượt trả lời nào của bất kỳ tác nhân nào đẩy nổi. Cắt theo đúng đường nối sẵn có:
     · MasterData.jsx          — nền + ProductDrawer + bộ lọc  (tệp này)
     · MasterData-products.jsx — màn ProductMaster
     · MasterData-network.jsx  — màn StoresNetwork
   Thứ tự nạp trong `Pharmacy Portal.html` phải giữ đúng thứ tự trên: khai báo cấp cao nhất của
   một script `text/babel` lên `window` (Babel hạ const→var — đo bằng `typeof window.mdInp`
   trên bản đang chạy 2026-09-07), nên tệp sau đọc được tệp trước, KHÔNG ngược lại. */

/* ---------------- shared form atoms ---------------- */
const mdInp = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff', color: 'var(--dv-ink)' };
const mdMono = { ...mdInp, fontFamily: 'var(--font-mono)' };
const mdLbl = { display: 'block', fontWeight: 600, fontSize: 12.5, color: 'var(--dv-ink)', marginBottom: 6 };

function Drawer({ title, sub, onClose, children, footer }) {
  const { IconX } = window;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.32)', animation: 'dvFade .2s ease' }} />
      <div style={{ position: 'relative', width: 'min(560px, 96vw)', height: '100%', background: 'var(--surface-subtle)', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', animation: 'dvSlideIn .26s var(--ease-out)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', background: '#fff', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: 0 }}>{title}</h3>
            {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>{children}</div>
        {footer && <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', background: '#fff', borderTop: '1px solid var(--border-default)' }}>{footer}</div>}
      </div>
    </div>
  );
}
window.Drawer = Drawer;

/* Badge control_class — quản lý đặc biệt (gây nghiện/hướng thần/tiền chất) */
function ControlBadge({ k }) {
  if (!k || k === 'khong') return null;
  const map = { gay_nghien: 'Gây nghiện', huong_than: 'Hướng thần', tien_chat: 'Tiền chất' };
  const { IconLock } = window;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 999, background: '#F8E0DD', color: '#9c2b22', fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}><IconLock size={11} />{map[k] || 'Kiểm soát'}</span>;
}
window.ControlBadge = ControlBadge;
/* derive control_class từ data cũ (storage='kiemsoat' → gây nghiện) */
window.ctrlOf = (p) => p.control || (p.storage === 'kiemsoat' ? 'gay_nghien' : 'khong');

function StorageBadge({ k }) {
  const map = { thuong: ['Thường', 'var(--dv-mist)', 'var(--dv-ink-soft)', 'IconBox'], mat: ['Mát 8–15°C', '#EAF3EF', '#0A7F64', 'IconBox'], lanh: ['Lạnh 2–8°C', '#E5EEFb', '#1d4f8a', 'IconSnowflake'], kiemsoat: ['Lạnh 2–8°C', '#E5EEFb', '#1d4f8a', 'IconSnowflake'] };
  const [label, bg, fg, icon] = map[k] || map.thuong;
  const Icon = window[icon];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: bg, color: fg, fontWeight: 600, fontSize: 11.5, whiteSpace: 'nowrap' }}><Icon size={12} />{label}</span>;
}
function TypeBadge({ k }) {
  const rx = k === 'rx';
  return <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 6, background: rx ? '#F0E8F6' : 'var(--dv-green-50)', color: rx ? '#6b3fa0' : 'var(--dv-green)', fontWeight: 800, fontSize: 11, letterSpacing: '0.03em' }}>{rx ? 'Rx' : 'OTC'}</span>;
}
function AbcChip({ c }) {
  /* DVP-516 — hạng do engine xếp ở kho tổng, nên SKU chưa vào vòng tính thì KHÔNG có hạng. Thiếu
     nhánh này bảng vẽ một viên xám RỖNG: đọc thành "có hạng nhưng mất chữ", trong khi hồ sơ sản
     phẩm cùng ca lại ghi rõ "Chưa phân hạng". Hai chỗ nói một chuyện thì phải nói cùng một câu. */
  if (!c) return <span title="Engine chưa xếp hạng SKU này — hạng tính lại mỗi lượt đồng bộ." style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', whiteSpace: 'nowrap', cursor: 'help' }}>Chưa phân hạng</span>;
  const col = c === 'A' ? 'var(--dv-green)' : c === 'B' ? 'var(--dv-yellow-600)' : 'var(--dv-ink-soft)';
  const bg = c === 'A' ? 'var(--dv-green-50)' : c === 'B' ? 'var(--dv-yellow-100)' : 'var(--dv-mist)';
  return <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: col, background: bg, padding: '2px 8px', borderRadius: 6 }}>{c}</span>;
}

/* ---------------- product master data ---------------- */
const PRODUCTS = [
  { sku: 'SP0142', name: 'Paracetamol 500mg (Hapacol)', unit: 'Hộp', conv: '1 Hộp = 10 vỉ × 10 viên', pack: 'Hộp 10 vỉ', group: 'Thuốc · Giảm đau hạ sốt · Paracetamol', type: 'otc', country: 'Việt Nam', reg: 'VD-21558-14', barcode: '8936045220142', storage: 'thuong', ncc: 'Dược Hậu Giang', abc: 'A', xyz: 'X', shape: 'deu', safety: '', kvMin: 80, kvMax: 400, price: 1200 },
  { sku: 'SP0088', name: 'Amoxicillin 500mg', unit: 'Hộp', conv: '1 Hộp = 100 viên', pack: 'Hộp 100 viên', group: 'Thuốc · Kháng sinh · Beta-lactam', type: 'rx', country: 'Việt Nam', reg: 'VD-18234-13', barcode: '8935201100889', storage: 'thuong', ncc: 'Imexpharm', abc: 'A', xyz: 'Y', shape: 'deu', safety: '', kvMin: 40, kvMax: 260, price: 950 },
  { sku: 'SP0210', name: 'Augmentin 625mg', unit: 'Hộp', conv: '1 Hộp = 2 vỉ × 7 viên', pack: 'Hộp 14 viên', group: 'Thuốc · Kháng sinh · Beta-lactam', type: 'rx', country: 'Anh', reg: 'VN-17645-14', barcode: '5099811210210', storage: 'thuong', ncc: 'DKSH Việt Nam', abc: 'A', xyz: 'Z', shape: 'thua', safety: '8', kvMin: 20, kvMax: 120, price: 8500 },
  { sku: 'SP0177', name: 'Omeprazol 20mg', unit: 'Hộp', conv: '1 Hộp = 2 vỉ × 14 viên', pack: 'Hộp 28 viên', group: 'Thuốc · Tiêu hóa · Ức chế bơm proton', type: 'rx', country: 'Việt Nam', reg: 'VD-25011-16', barcode: '8935201100177', storage: 'thuong', ncc: 'Stella (STADA VN)', abc: 'B', xyz: 'Y', shape: 'deu', safety: '', kvMin: 30, kvMax: 180, price: 1100 },
  { sku: 'SP0188', name: 'Enterogermina', unit: 'Hộp', conv: '1 Hộp = 20 ống', pack: 'Hộp 20 ống', group: 'TPCN · Men vi sinh', type: 'otc', country: 'Ý', reg: 'VN-19872-16', barcode: '8004995200188', storage: 'lanh', ncc: 'DKSH Việt Nam', abc: 'B', xyz: 'Y', shape: 'deu', safety: '', kvMin: 25, kvMax: 160, price: 4200 },
  { sku: 'SP0245', name: 'Cefuroxim 500mg', unit: 'Hộp', conv: '1 Hộp = 10 viên', pack: 'Hộp 10 viên', group: 'Thuốc · Kháng sinh · Cephalosporin', type: 'rx', country: 'Việt Nam', reg: 'VD-22019-15', barcode: '8935201100245', storage: 'thuong', ncc: 'Pymepharco', abc: 'B', xyz: 'Z', shape: 'thua', safety: '', kvMin: 15, kvMax: 90, price: 5800 },
  { sku: 'SP0312', name: 'Salbutamol 4mg', unit: 'Hộp', conv: '1 Hộp = 2 vỉ × 10 viên', pack: 'Hộp 20 viên', group: 'Thuốc · Hô hấp · Giãn phế quản', type: 'rx', country: 'Việt Nam', reg: 'VD-20114-13', barcode: '8935201100312', storage: 'thuong', ncc: 'Boston Pharma', abc: 'C', xyz: 'Z', shape: 'thua', safety: '12', kvMin: 50, kvMax: 300, price: 380 },
  { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', unit: 'Tuýp', conv: '1 Tuýp = 10 viên', pack: 'Tuýp 10 viên', group: 'TPCN · Vitamin & khoáng', type: 'otc', country: 'Việt Nam', reg: 'VD-23344-15', barcode: '8936045220156', storage: 'thuong', ncc: 'Dược Hậu Giang', abc: 'B', xyz: 'X', shape: 'deu', safety: '', kvMin: 60, kvMax: 320, price: 850 },
  { sku: 'SP0301', name: 'Berberin 10mg', unit: 'Lọ', conv: '1 Lọ = 100 viên', pack: 'Lọ 100 viên', group: 'Thuốc · Tiêu hóa · Kháng khuẩn ruột', type: 'otc', country: 'Việt Nam', reg: 'VD-15578-11', barcode: '8935201100301', storage: 'thuong', ncc: 'Mekophar', abc: 'C', xyz: 'X', shape: 'deu', safety: '', kvMin: 40, kvMax: 240, price: 150 },
  { sku: 'SP0098', name: 'Loratadin 10mg', unit: 'Hộp', conv: '1 Hộp = 3 vỉ × 10 viên', pack: 'Hộp 30 viên', group: 'Thuốc · Kháng dị ứng · Kháng histamin', type: 'otc', country: 'Việt Nam', reg: 'VD-19002-13', barcode: '8935201100098', storage: 'thuong', ncc: 'Traphaco', abc: 'C', xyz: 'Y', shape: 'deu', safety: '', kvMin: 20, kvMax: 130, price: 800 },
  { sku: 'SP0067', name: 'Smecta hương cam', unit: 'Hộp', conv: '1 Hộp = 30 gói', pack: 'Hộp 30 gói', group: 'Thuốc · Tiêu hóa · Hấp phụ', type: 'otc', country: 'Pháp', reg: 'VN-18922-15', barcode: '3582910014067', storage: 'thuong', ncc: 'DKSH Việt Nam', abc: 'C', xyz: 'Z', shape: 'thua', lifecycle: 'ngung_dat', safety: '', kvMin: 15, kvMax: 100, price: 3600 },
  { sku: 'SP0421', name: 'Insulin Mixtard 100IU', unit: 'Lọ', conv: '1 Lọ = 10ml', pack: 'Lọ 10ml', group: 'Thuốc · Nội tiết · Đái tháo đường', type: 'rx', country: 'Đan Mạch', reg: 'VN-17234-13', barcode: '5702815100421', storage: 'lanh', ncc: 'DKSH Việt Nam', abc: 'B', xyz: 'Z', shape: 'thua', safety: '10', kvMin: 8, kvMax: 48, price: 92000 },
  { sku: 'SP0455', name: 'Morphin sulfat 10mg', unit: 'Ống', conv: '1 Hộp = 5 ống', pack: 'Hộp 5 ống', group: 'Thuốc · Giảm đau · Opioid', type: 'rx', country: 'Việt Nam', reg: 'QLĐB-455-18', barcode: '8935201100455', storage: 'kiemsoat', ncc: 'CPC1 Hà Nội', abc: 'C', xyz: 'Z', shape: 'thua', safety: '14', kvMin: 4, kvMax: 20, price: 18500 },
  { sku: 'SP0399', name: 'Hoạt huyết dưỡng não Cebraton', unit: 'Hộp', conv: '1 Hộp = 5 vỉ × 10 viên', pack: 'Hộp 50 viên', group: 'TPCN · Bổ não', type: 'otc', country: 'Việt Nam', reg: 'VD-27781-17', barcode: '8936045220399', storage: 'thuong', ncc: '', abc: 'C', xyz: 'Y', safety: '', kvMin: 12, kvMax: 80, price: 2300 },
  { sku: 'SP0412', name: 'Men vi sinh Bioacimin Gold', unit: 'Hộp', conv: '1 Hộp = 30 gói', pack: 'Hộp 30 gói', group: 'TPCN · Men vi sinh', type: 'otc', country: 'Việt Nam', reg: 'VD-26654-17', barcode: '8936045220412', storage: 'thuong', ncc: '', abc: 'C', xyz: 'Y', safety: '', kvMin: 10, kvMax: 64, price: 6800 },
];
const GROUPS = ['Tất cả nhóm']; // deprecated — bộ lọc nhóm derive động từ MD_CATEGORIES (xem mdGroupFilterOptions)
window.mdGroupFilterOptions = () => (window.MD_CATEGORIES || []).flatMap((g) => g.children);
/* tra cứu thuộc tính tuân thủ theo SKU (Rx/bảo quản/control) — dùng chung cho Tồn kho, Đề xuất mua */
window.skuMeta = (sku) => { const p = PRODUCTS.find((x) => x.sku === sku); return p ? { type: p.type, storage: p.storage, control: window.ctrlOf(p) } : null; };

/* Which NCCs supply each SKU (reverse of NCC→SKU). isDefault = NCC mặc định dùng cho dự trù.
   active=false → còn báo giá nhưng không ưu tiên. Empty → chỉ NCC mặc định của sản phẩm. */
const PRODUCT_SUPPLIERS = {
  SP0142: [{ ncc: 'Dược Hậu Giang', price: 9000, vat: 5, moq: 100, leadtime: 2, default: true }, { ncc: 'DKSH Việt Nam', price: 9400, vat: 5, moq: 50, leadtime: 3 }, { ncc: 'Pymepharco', price: 9200, vat: 8, moq: 80, leadtime: 3 }],
  SP0088: [{ ncc: 'Imexpharm', price: 7600, vat: 5, moq: 50, leadtime: 3, default: true }, { ncc: 'Dược Hậu Giang', price: 7900, vat: 5, moq: 50, leadtime: 2 }, { ncc: 'DKSH Việt Nam', price: 8100, vat: 5, moq: 40, leadtime: 3 }],
  SP0210: [{ ncc: 'DKSH Việt Nam', price: 56500, vat: 8, moq: 20, leadtime: 3, default: true }, { ncc: 'Dược Hậu Giang', price: 57000, vat: 8, moq: 20, leadtime: 2 }, { ncc: 'Imexpharm', price: 59000, vat: 8, moq: 20, leadtime: 3 }],
  SP0177: [{ ncc: 'Stella (STADA VN)', price: 14600, vat: 5, moq: 30, leadtime: 4, default: true }, { ncc: 'Imexpharm', price: 15200, vat: 5, moq: 30, leadtime: 3 }],
  SP0188: [{ ncc: 'DKSH Việt Nam', price: 40000, vat: 8, moq: 20, leadtime: 3, default: true }, { ncc: 'Mega Lifesciences', price: 41500, vat: 8, moq: 15, leadtime: 6 }],
  SP0245: [{ ncc: 'Pymepharco', price: 36500, vat: 5, moq: 20, leadtime: 3, default: true }, { ncc: 'Imexpharm', price: 37000, vat: 5, moq: 20, leadtime: 3 }],
  SP0312: [{ ncc: 'Boston Pharma', price: 2900, vat: 8, moq: 100, leadtime: 5, default: true }],
  SP0156: [{ ncc: 'Dược Hậu Giang', price: 6000, vat: 8, moq: 50, leadtime: 2, default: true }, { ncc: 'Traphaco', price: 6300, vat: 8, moq: 40, leadtime: 2 }],
};

function ProductDrawer({ p, onClose, setToast }) {
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconLock, IconSuppliers, IconCheck, IconCart, IconAlertTriangle } = window;
  const { VND } = window;
  const sups = PRODUCT_SUPPLIERS[p.sku] || (p.ncc ? [{ ncc: p.ncc, price: null, vat: 5, moq: 50, leadtime: 3, default: true }] : []);
  const [f, setF] = React.useState({ ...p });
  const upd = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const Row = ({ children, cols = 2 }) => <div style={{ display: 'grid', gridTemplateColumns: cols === 2 ? '1fr 1fr' : '1fr', gap: 14, marginBottom: 14 }}>{children}</div>;
  const F = ({ label, k, mono, full, ph }) => (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}><label style={mdLbl}>{label}</label><input value={f[k] || ''} placeholder={ph} onChange={(e) => upd(k, e.target.value)} style={mono ? mdMono : mdInp} /></div>
  );
  const Sel = ({ label, k, opts, full, ph }) => (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}><label style={mdLbl}>{label}</label>
      <select value={f[k] || ''} onChange={(e) => upd(k, e.target.value)} style={mdInp}>
        {ph && <option value="">{ph}</option>}
        {(opts.includes(f[k]) || !f[k]) ? null : <option value={f[k]}>{f[k]} (cũ)</option>}
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
  // validate định dạng (SĐK / barcode / MST)
  const regOk = !f.reg || /^(VD|VN|QLĐB|VS|GC)-?\S/i.test(f.reg);
  const barcodeOk = !f.barcode || /^\d{8}$|^\d{13}$/.test(String(f.barcode));
  const VF = ({ label, k, ph, ok, err }) => (
    <div><label style={mdLbl}>{label}</label><input value={f[k] || ''} placeholder={ph} onChange={(e) => upd(k, e.target.value)} style={{ ...mdMono, borderColor: ok ? 'var(--border-strong)' : '#C5372C' }} />{!ok && <div style={{ fontSize: 11, color: '#C5372C', marginTop: 4 }}>{err}</div>}</div>
  );
  const BASE_UNITS = ['viên', 'vỉ', 'ống', 'gói', 'ml', 'tuýp', 'lọ', 'chai', 'gam'];
  return (
    <Drawer title={f._new ? (f.name || 'Sản phẩm mới') : f.name} sub={f._new ? 'Tạo SKU mới · dữ liệu nền' : `${f.sku} · sửa hồ sơ sản phẩm`} onClose={onClose}
      footer={<><Button variant="secondary" size="md" onClick={onClose}>Hủy</Button><Button variant="primary" size="md" onClick={() => { setToast(f._new ? `Đã tạo SKU ${f.sku || 'mới'}.` : `Đã lưu hồ sơ ${f.sku}.`); onClose(); }}>{f._new ? 'Tạo sản phẩm' : 'Lưu sản phẩm'}</Button></>}>
      {!f.ncc && <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFBF0', border: '1px solid #F5E0A8', borderRadius: 12, padding: '11px 14px', marginBottom: 16 }}><span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconAlertTriangle size={17} /></span><span style={{ fontSize: 12.5, color: 'var(--dv-ink)' }}>SKU này <b>chưa gắn NCC mặc định</b> — engine dùng leadtime/MOQ mặc định, không gom được vào đơn mua. Chọn NCC ở mục <b>Tham số dự trù</b> bên dưới.</span></div>}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', marginBottom: 12 }}>Thông tin chung</div>
      <Row><F label="Mã SKU" k="sku" mono /><Sel label="ĐVT" k="unit" opts={window.MD_UNITS} /></Row>
      <Row cols={1}><F label="Tên sản phẩm" k="name" full /></Row>
      <Row><F label="Hoạt chất" k="ingredient" ph="VD: Amoxicilin" /><F label="Hàm lượng" k="strength" ph="VD: 500mg" /></Row>
      <div style={{ marginBottom: 14 }}>
        <label style={mdLbl}>Đơn vị quy đổi</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, color: 'var(--dv-ink-soft)' }}>1 <b>{f.unit || 'ĐVT'}</b> =</span>
          <input type="number" min={1} value={f.factor != null ? f.factor : ''} onChange={(e) => upd('factor', e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))} placeholder="số" style={{ ...mdMono, width: 90 }} />
          <select value={f.baseUnit || 'viên'} onChange={(e) => upd('baseUnit', e.target.value)} style={{ ...mdInp, width: 120 }}>{BASE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}</select>
          <span style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>(đơn vị cơ sở nhỏ nhất)</span>
        </div>
        {f.conv && <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 6 }}>Quy cách chi tiết (KiotViet): {f.conv}</div>}
      </div>
      <Row><Sel label="Quy cách đóng gói" k="pack" opts={window.MD_PACKS} /><div><label style={mdLbl}>Điều kiện bảo quản (nhiệt độ)</label><select value={f.storage} onChange={(e) => upd('storage', e.target.value)} style={mdInp}>{window.MD_STORAGE.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</select></div></Row>
      <Row>
        <div><label style={mdLbl}>Phân loại</label><select value={f.type} onChange={(e) => upd('type', e.target.value)} style={mdInp}><option value="otc">OTC — không kê đơn</option><option value="rx">Rx — kê đơn</option></select></div>
        <div><label style={mdLbl}>Quản lý đặc biệt (control_class)</label><select value={f.control || 'khong'} onChange={(e) => upd('control', e.target.value)} style={mdInp}>{window.MD_CONTROL.map((x) => <option key={x.key} value={x.key}>{x.label}</option>)}</select></div>
      </Row>
      <Row cols={1}><div><label style={mdLbl}>Nhóm hàng (phân cấp)</label><window.CascadeSelect value={f.group} onChange={(v) => upd('group', v)} /></div></Row>
      <Row>
        <Sel label="Nước sản xuất" k="country" opts={window.MD_COUNTRIES} />
        <div />
      </Row>
      <Row><VF label="Số đăng ký" k="reg" ph="VD-12345-67" ok={regOk} err="Định dạng VD-/VN-/QLĐB-…" /><VF label="Barcode" k="barcode" ph="EAN-8/13" ok={barcodeOk} err="Barcode phải 8 hoặc 13 chữ số" /></Row>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', margin: '8px 0 12px', paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>Tham số dự trù</div>
      <Row>
        <Sel label="NCC mặc định" k="ncc" opts={window.mdSupplierNames()} ph="— Chọn NCC —" />
        <div><label style={mdLbl}>Phân loại ABC · speed_class</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dv-mist)', borderRadius: 9, padding: '9px 12px', minHeight: 22 }}>
            {f.abc ? <AbcChip c={f.abc} /> : <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dv-ink-faint)' }}>Chưa phân hạng</span>}
          </div>
          <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 4 }}>Engine tự xếp ở kho tổng theo Pareto giá trị bán — tính lại mỗi lượt đồng bộ (DVP-516).</div>
        </div>
      </Row>
      <Row>
        <div><label style={mdLbl}>safety_days override</label><input value={f.safety} placeholder="trống = theo nhóm" onChange={(e) => upd('safety', e.target.value)} style={mdMono} /></div>
        {/* T02 — ô gán VEN đi theo ĐÚNG cờ đã ẩn cột / bộ lọc / chip độ phủ / nút gán cả lô. Tenant
            tắt VEN mà ô này vẫn mở là để người dùng đặt một giá trị không màn nào đọc lại được.
            Tắt thì KHÔNG dựng ô giữ chỗ: một dòng "đã tắt" cũng là mời hỏi lại chuyện đã chốt. */}
        {mdColOn('ven') && (
          <div><label style={mdLbl}>VEN — mức thiết yếu</label>
            <select value={['V', 'E', 'N'].includes(f.ven) ? f.ven : ''} onChange={(e) => upd('ven', e.target.value)} style={mdInp}>
              <option value="">— chưa gán</option><option value="V">V — sống còn</option><option value="E">E — thiết yếu</option><option value="N">N — thông thường</option>
            </select>
            {/* Thang bậc phải khớp mdVenOf: KHÔNG có nấc "mặc định E" — suy không ra thì bỏ trống,
                bảng hiện "—" và bộ lọc gọi là "Chưa xác định". */}
            <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 4, lineHeight: 1.45 }}>Dược sĩ gán thì thắng. Chưa gán: suy từ kê đơn, rồi nhóm “Thuốc”. Suy không ra thì để trống.</div>
          </div>
        )}
      </Row>
      <Row>
        <div><label style={mdLbl}>Trạng thái kinh doanh</label>
          <select value={f.lifecycle || 'dang_ban'} onChange={(e) => upd('lifecycle', e.target.value)} style={mdInp}>
            <option value="dang_ban">Đang bán</option><option value="ngung_dat">Ngừng đặt — bán nốt tồn</option>
          </select>
          {/* [T15] ĐÃ NỐI BỘ MÁY — DVP-586, lên prod 2026-09-01. Câu cũ ("Ghi để theo dõi. Chưa nối
              bộ máy…") đúng khi viết và sai từ hôm đó; để nguyên là màn nói dối theo chiều ngược lại.

              Và trạng thái thứ ba "Ngừng hẳn" ĐÃ BỎ (Jet chốt 01-09): không còn hành vi nào đo được
              cho nó. Ẩn khỏi Tồn kho bị bác ở F04 (dược sĩ tra mã không thấy dòng sẽ hiểu thành "nhà
              thuốc không bán mặt hàng này"); ẩn khỏi Cận hạn trái với chính nhu cầu ("vẫn theo dõi
              hạn dùng"); chặn bán thì MedOps không làm được vì bán nằm ở POS; còn cắt điều chuyển thì
              Jet chốt GIỮ. Một trạng thái nghe dứt khoát hơn mà không làm thêm gì là màn hình hứa quá
              hệ. Mở lại khi và chỉ khi có một hành vi đo được khác — xem F04 §Phương án thay thế. */}
          <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 4 }}>Ngừng đặt chỉ tắt phần <b>đề xuất MUA</b>. Tồn còn lại vẫn bán, vẫn điều chuyển được giữa các điểm, và hạn dùng vẫn theo dõi như cũ.</div>
        </div>
        <div />
      </Row>
      <Row cols={1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--dv-mist)', borderRadius: 12, padding: '12px 14px' }}>
          <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconLock size={16} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink)' }}>min / max KiotViet</div>
            <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Đồng bộ từ KiotViet — chỉ đọc. Min/Max do portal tính.</div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--dv-ink-soft)' }}>{f.kvMin} / {f.kvMax}</span>
        </div>
      </Row>
      {/* [T10] DỰNG LẠI 2026-08-31 — DVP-577 đã ship đường ghi (product_ext.auto_plan/plan_min/
          plan_max · POST /api/products/plan-mode · engine đọc qua ReplenishInput.manual). Ở hồ sơ
          SKU khối này CHỈ ĐỌC: đường sửa là panel theo bộ lọc ở màn Danh mục. */}
      {!f._new && <Row cols={1}><window.PlanModeRow sku={f.sku} /></Row>}
      <Row cols={1}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--dv-mist)', borderRadius: 12, padding: '12px 14px' }}>
          <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconLock size={16} /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink)' }}>Giá bán lẻ</div>
            <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Đồng bộ từ KiotViet — chỉ đọc. Engine không dùng giá bán để tính dự trù.</div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: 'var(--dv-ink-soft)' }}>{VND(f.price)}</span>
        </div>
      </Row>

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', margin: '8px 0 12px', paddingTop: 14, borderTop: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: 7 }}><IconSuppliers size={14} />Nhà cung cấp đang cung cấp ({sups.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sups.length === 0 && <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', borderRadius: 10, padding: '11px 14px' }}>Chưa có NCC nào cung cấp SKU này. Chọn <b>NCC mặc định</b> ở trên hoặc tạo RFQ để mời báo giá.</div>}
        {sups.map((sp, i) => {
          const best = sups.every((o) => sp.price == null || o.price == null || sp.price <= o.price) && sp.price != null;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: sp.default ? 'var(--dv-green-50)' : '#fff', border: `1px solid ${sp.default ? 'var(--dv-green-100)' : 'var(--border-default)'}`, borderRadius: 12, padding: '11px 14px' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: sp.default ? 'var(--dv-green)' : 'var(--dv-mist)', color: sp.default ? '#fff' : 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12 }}>{sp.ncc.slice(0, 2).toUpperCase()}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{sp.ncc}</span>
                  {sp.default && <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--dv-green)', background: '#fff', border: '1px solid var(--dv-green-100)', padding: '1px 6px', borderRadius: 5 }}>MẶC ĐỊNH</span>}
                  {best && !sp.default && <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--dv-green)', background: 'var(--dv-yellow)', padding: '1px 6px', borderRadius: 5 }}>GIÁ TỐT</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 1 }}>MOQ {sp.moq} · leadtime {sp.leadtime}n · VAT {sp.vat}%</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14.5, color: 'var(--dv-green)' }}>{sp.price == null ? '—' : VND(sp.price)}</div>
                <div style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>giá nhập</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
        <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>So sánh giá đầy đủ ở màn “Nhà cung cấp” &amp; trong RFQ.</span>
        <button onClick={() => setToast(`Mở RFQ cho ${p.name} tới ${sups.length} NCC.`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '7px 13px', borderRadius: 999, color: 'var(--dv-green)', fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap' }}><IconCart size={14} />Tạo RFQ sản phẩm này</button>
      </div>
    </Drawer>
  );
}

/* DVP-515 — THANH ĐIỀU KIỆN ĐỘNG cho Danh mục sản phẩm.
   Thay ba điều khiển bày sẵn (MultiSelect nhóm · dãy pill ABC · StatusTabs OTC/Rx) bằng đúng cơ
   chế đã ship ở /inventory (DVP-512): chưa lọc gì thì thanh chỉ có một nút "+ Lọc"; mỗi điều kiện
   đang áp là một chip mang sẵn GIÁ TRỊ, bấm chip sửa tại chỗ, ✕ bỏ.

   Trục nào có mặt ở đây là ĐO ĐƯỢC trên prod 2026-08-20, không phải chọn theo cảm giác:
     · Kiểm soát đặc biệt — 9/13.128 mã (8 gây nghiện + 1 hướng thần). Nhỏ nhất mà quan trọng nhất:
       chính vì hiếm nên trước đây không có cách nào lấy ra, trong khi đó là nhóm phải giữ sổ riêng.
     · ABC — DVP-516: hạng ENGINE tính ở KHO TỔNG (plan_output), không phải ô dữ liệu nền do người
       khai (cột đó rỗng 0/13.128 trên cả ba tenant thật).
     · XYZ · Kê đơn — có dữ liệu thật.
   Bốn cột CỐ Ý không lọc/sắp được: NCC mặc định (0 liên kết ưu tiên trên mọi tenant) · Leadtime
   (0 hàng có giá trị — "3n" đang hiện là hằng số fallback) · MOQ · Quy cách (đúng 1 giá trị trên
   13.128 hàng). Bấm sắp lên một cột hằng là hứa một việc rồi không làm gì.
   "Nhóm hàng" cũng vắng: DVP-495 đã gỡ bộ lọc đó khỏi /inventory theo yêu cầu chủ dự án, nên
   không tự thêm lại ở đây. */
const MD_FILTER_FIELDS = [
  { key: 'abc', group: 'Phân loại', label: 'ABC', opts: [['A', 'A'], ['B', 'B'], ['C', 'C'], ['none', 'Chưa phân hạng']] },
  { key: 'ven', group: 'Phân loại', label: 'VEN', opts: [['V', 'V — sống còn'], ['E', 'E — thiết yếu'], ['N', 'N — thông thường'], ['none', 'Chưa xác định']], hint: 'Lọc theo đúng giá trị đang HIỆN: dược sĩ gán nếu có, không thì suy từ kê đơn / nhóm “Thuốc”.' },
  { key: 'xyz', group: 'Phân loại', label: 'XYZ', opts: [['X', 'X — đều'], ['Y', 'Y — dao động'], ['Z', 'Z — thất thường'], ['none', 'Chưa tính']] },
  { key: 'shape', group: 'Phân loại', label: 'Hình dạng', opts: [['deu', 'Đều'], ['thua', 'Thưa'], ['none', 'Chưa đủ dữ liệu']], hint: 'Độ thưa giao dịch do máy đo — trục chọn công thức dự trù; XYZ chỉ là chỉ báo đệm.' },
  // DVP-523 — trục "Nhóm hàng" trở lại (đảo DVP-495). Lý do gỡ lúc đó là TỐN CHỖ vì quá nhiều
  // giá trị (prod: 209 nhóm ở relife), không phải dữ liệu xấu — nên điều kiện để nó quay lại là
  // ô chọn phải TÌM ĐƯỢC, xem MD_SEARCH_THRESHOLD.
  { key: 'cat', group: 'Phân loại', label: 'Nhóm hàng', opts: null },
  { key: 'rx', group: 'Tuân thủ', label: 'Kê đơn', opts: [['rx', 'Thuốc kê đơn (Rx)'], ['otc', 'Không kê đơn (OTC)']], hint: 'Chọn cả hai bằng không lọc — mọi mặt hàng đều rơi vào một trong hai.' },
  { key: 'control', group: 'Tuân thủ', label: 'Kiểm soát đặc biệt', opts: [['gay_nghien', 'Gây nghiện'], ['huong_than', 'Hướng thần'], ['tien_chat', 'Tiền chất'], ['kiem_soat_dac_biet', 'Kiểm soát đặc biệt (khác)']], hint: 'Nhóm phải giữ sổ theo dõi riêng. Không chọn gì ⇒ không lọc (kể cả mặt hàng thường).' },
  // [T15] DVP-586 — hai trạng thái, không ba; và bộ máy ĐÃ đọc cờ này (prod 2026-09-01).
  { key: 'lifecycle', group: 'Vòng đời', label: 'Trạng thái', opts: [['dang_ban', 'Đang bán'], ['ngung_dat', 'Ngừng đặt — bán nốt tồn']], hint: 'Ngừng đặt chỉ tắt đề xuất MUA; tồn còn lại vẫn bán, vẫn điều chuyển được, hạn dùng vẫn theo dõi.' },
];

/* Nhóm hàng có thật trong danh mục, sắp theo bảng chữ cái. Đọc từ dữ liệu, KHÔNG kê tay: danh
   sách lựa chọn co lại theo bộ lọc đang áp thì người dùng lọc vào một nhóm rồi không quay ra được. */
const MD_CAT_OPTS = [...new Set(PRODUCTS.map((p) => p.group))].sort().map((g) => [g, g]);

/* Ngưỡng hiện ô tìm trong danh sách lựa chọn. 8 vì mọi trục kê sẵn đều ≤ 5 lựa chọn, nên nó chỉ
   chạm danh sách ĐỘNG đến từ dữ liệu — đúng chỗ cardinality không kiểm soát được. */
const MD_SEARCH_THRESHOLD = 8;

/* T04 — ẩn cột phân loại theo cờ tenant. NỢ tenant_setting classify.* — bảng cờ thật chưa có;
   đọc qua window.readTenantFlags nếu shell cung cấp, mặc định HIỆN đủ.
   Cột tên "Hình dạng" nhưng KHOÁ CỜ là `classify.sparsity` — cờ đặt theo NĂNG LỰC (độ thưa giao
   dịch), không theo nhãn hiện trên đầu cột. Bản trước gõ 'classify.shape', một khoá không hệ nào
   ghi, nên cột không bao giờ ẩn được dù tenant đã tắt. Vẫn nhận 'classify.shape' làm BÍ DANH cũ. */
const mdFlags = (typeof window.readTenantFlags === 'function') ? window.readTenantFlags() : {};
const mdShapeOff = mdFlags['classify.sparsity'] === false || (mdFlags['classify.sparsity'] === undefined && mdFlags['classify.shape'] === false);
const mdColOn = (k) => !(k === 'ven' && mdFlags['classify.ven'] === false) && !(k === 'xyz' && mdFlags['classify.xyz'] === false) && !(k === 'shape' && mdShapeOff);

/* T03 — Hình dạng cầu (máy đo độ thưa giao dịch): trục chọn công thức của engine. */
const MD_SHAPE_LABEL = { deu: 'Đều', thua: 'Thưa' };

/* Thang bậc VEN — mirror deriveVen (lib/views/ven.ts): người gán thắng tuyệt đối, rồi kê đơn,
   rồi nhóm "Thuốc", còn lại chưa xác định. */
const mdVenOf = (p) => (['V', 'E', 'N'].includes(p.ven) ? p.ven : p.type === 'rx' ? 'E' : String(p.group || '').startsWith('Thuốc') ? 'E' : null);
/* Một danh sách dùng cho CẢ menu chọn lẫn câu xác nhận — hai bản kê tay là hai chỗ để lệch nhãn. */
const MD_VEN_OPTS = [['V', 'V — sống còn'], ['E', 'E — thiết yếu'], ['N', 'N — thông thường'], ['', 'Bỏ gán']];
const mdVenLabel = (v) => (MD_VEN_OPTS.find((o) => o[0] === v) || [, v])[1];

function MdChip({ field, value, onChange, onRemove }) {
  const all = field.opts || (field.key === 'cat' ? MD_CAT_OPTS : []);
  const [open, setOpen] = React.useState(value.length === 0);
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', d); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', d); document.removeEventListener('keydown', k); };
  }, []);
  const on = value.length > 0;
  // Chip phải nói được GIÁ TRỊ, không chỉ tên trường — ghi mỗi "ABC" thì vẫn phải mở ra mới biết
  // đang lọc gì, tức lại giấu trạng thái một lần nữa.
  const summary = value.length === 0 ? 'chọn…' : value.length === 1 ? (all.find((o) => o[0] === value[0]) || [, value[0]])[1] : `${value.length} mục`;
  const needle = q.trim().toLowerCase();
  // Mục ĐANG CHỌN luôn hiện kể cả khi không khớp từ khoá: thấy lựa chọn của mình biến mất thì
  // người dùng đọc thành "vừa bị bỏ chọn", rồi bấm lại — hoá ra bỏ chọn thật.
  const opts = needle ? all.filter(([v, t]) => value.includes(v) || String(t).toLowerCase().includes(needle)) : all;
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 9, background: on ? 'var(--dv-green-50)' : '#fff', border: `1px solid ${on ? 'var(--dv-green)' : 'var(--border-default)'}`, overflow: 'hidden' }}>
        <button onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 3px 6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>
          <span style={{ color: 'var(--dv-ink-soft)', fontWeight: 500 }}>{field.label}:</span>{summary}<span style={{ opacity: 0.6 }}>▾</span>
        </button>
        <button onClick={onRemove} title={`Bỏ điều kiện ${field.label}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 8px 6px 2px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: on ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>✕</button>
      </span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 40, minWidth: 232, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 8 }}>
          {all.length > MD_SEARCH_THRESHOLD && (
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Tìm trong ${all.length} mục…`}
              style={{ width: '100%', boxSizing: 'border-box', padding: '6px 9px', borderRadius: 8, border: '1px solid var(--border-default)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', marginBottom: 4 }} />
          )}
          {needle !== '' && opts.length === 0 && (
            <div style={{ padding: '9px 8px', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>Không mục nào khớp “{q}”.</div>
          )}
          {opts.map(([v, t]) => {
            const sel = value.includes(v);
            return (
              <button key={v} onClick={() => toggle(v)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '7px 8px', border: 'none', background: sel ? 'var(--dv-green-50)' : 'transparent', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: sel ? 700 : 500, color: sel ? 'var(--dv-green)' : 'var(--dv-ink)', textAlign: 'left' }}>
                <span style={{ width: 15, height: 15, borderRadius: 4, border: sel ? 'none' : '1.5px solid var(--border-default)', background: sel ? 'var(--dv-green)' : '#fff', color: '#fff', fontSize: 10, lineHeight: '15px', textAlign: 'center', flex: 'none' }}>{sel ? '✓' : ''}</span>
                <span style={{ flex: 1 }}>{t}</span>
              </button>
            );
          })}
          {field.hint && <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', padding: '6px 8px 2px', lineHeight: 1.4 }}>{field.hint}</div>}
        </div>
      )}
    </span>
  );
}

function MdAddFilter({ hidden, onAdd }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const d = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', d);
    return () => document.removeEventListener('mousedown', d);
  }, []);
  const avail = MD_FILTER_FIELDS.filter((f) => mdColOn(f.key) && hidden.includes(f.key) && f.label.toLowerCase().includes(q.trim().toLowerCase()));
  const groups = [...new Set(avail.map((f) => f.group))];
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => { setOpen((o) => !o); setQ(''); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 9, border: '1px dashed var(--border-default)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink-soft)' }}>+ Lọc</button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 40, minWidth: 224, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 8 }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm điều kiện…" style={{ width: '100%', boxSizing: 'border-box', padding: '6px 9px', borderRadius: 8, border: '1px solid var(--border-default)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', marginBottom: 4 }} />
          {avail.length === 0 && <div style={{ padding: '9px 8px', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>Đã dùng hết điều kiện khớp “{q}”.</div>}
          {groups.map((g) => (
            <div key={g}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', padding: '6px 8px 3px' }}>{g}</div>
              {avail.filter((f) => f.group === g).map((f) => (
                <button key={f.key} onClick={() => { onAdd(f.key); setOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '6px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--dv-ink)' }}>{f.label}</button>
              ))}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}


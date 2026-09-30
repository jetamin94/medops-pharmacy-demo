/* Pharmacy — DỮ LIỆU NỀN (master lists) + Export/Import dùng chung.
   Nguồn chuẩn hóa cho các dropdown ở Danh mục sản phẩm & các màn master.
   Tất cả attach lên window. Import là luồng GIẢ LẬP (preview + validate + toast). */

/* ---------------- shared master lists ---------------- */
window.MD_UNITS = ['Hộp', 'Vỉ', 'Viên', 'Tuýp', 'Lọ', 'Ống', 'Gói', 'Chai', 'Túi', 'Cái'];
window.MD_PACKS = ['Hộp 10 vỉ', 'Hộp 100 viên', 'Hộp 14 viên', 'Hộp 28 viên', 'Hộp 30 viên', 'Hộp 20 viên', 'Hộp 10 viên', 'Hộp 20 ống', 'Hộp 5 ống', 'Hộp 30 gói', 'Tuýp 10 viên', 'Lọ 100 viên', 'Lọ 10ml', 'Chai 60ml'];
window.MD_COUNTRIES = ['Việt Nam', 'Pháp', 'Ý', 'Anh', 'Đan Mạch', 'Ấn Độ', 'Hàn Quốc', 'Đức', 'Thái Lan', 'Mỹ'];
window.MD_STORAGE = [
  { key: 'thuong', label: 'Thường', note: 'Nhiệt độ phòng < 30°C' },
  { key: 'mat', label: 'Mát 8–15°C', note: 'Tránh nóng, nơi mát' },
  { key: 'lanh', label: 'Lạnh 2–8°C', note: 'Dây chuyền lạnh GSP' },
];
/* control_class — phân loại quản lý đặc biệt, ĐỘC LẬP với nhiệt độ bảo quản */
window.MD_CONTROL = [
  { key: 'khong', label: 'Thường', note: 'Không thuộc diện kiểm soát' },
  { key: 'gay_nghien', label: 'Gây nghiện', note: 'Tủ khóa, sổ theo dõi, duyệt riêng' },
  { key: 'huong_than', label: 'Hướng thần', note: 'Quản lý đặc biệt theo quy chế' },
  { key: 'tien_chat', label: 'Tiền chất', note: 'Khai báo, kiểm soát số lượng' },
];
/* nhóm hàng phân cấp: tuyến → nhóm con.

   DVP-578 — hai mục CỐ Ý dài, không phải rác: nhóm con 74 ký tự dưới "Thuốc" và mã tự sinh
   16 ký tự ở "Vật tư tiêu hao". Chúng lấy hình dạng (không phải nội dung) từ dữ liệu thật của
   một tenant sau khi nhập từ file — xem chú thích ở CategoryTree. Rút ngắn chúng cho "gọn" là
   xoá mất đúng ca đã làm vỡ màn, và bố cục sẽ lại trông ổn trong khi thực tế thì không. */
window.MD_CATEGORIES = [
  { name: 'Thuốc', code: 'THUOC', children: ['Giảm đau hạ sốt', 'Kháng sinh', 'Tiêu hóa', 'Hô hấp', 'Kháng dị ứng', 'Nội tiết', 'Tim mạch', 'Giảm đau (Opioid)', 'Thuốc gây mê-gây tê, chế phẩm dùng trong phẫu thuật và chăm sóc vết thương'] },
  { name: 'TPCN', code: 'TPCN', children: ['Men vi sinh', 'Vitamin & khoáng', 'Bổ gan', 'Tăng đề kháng'] },
  { name: 'Thiết bị & vật tư', code: 'TBVT', children: ['Khẩu trang', 'Băng gạc', 'Que test', 'Dụng cụ đo'] },
  { name: 'Vật tư tiêu hao', code: 'GRP_0FB5B3D1E780', children: ['Dung dịch tiêm tĩnh mạch & các loại dung dịch vô trùng khác'] },
  { name: 'Mỹ phẩm', code: 'MP', children: ['Chăm sóc da', 'Chống nắng'] },
];
window.mdCategoryFlat = () => window.MD_CATEGORIES.flatMap((g) => g.children.map((c) => `${g.name} · ${c}`));
/* danh sách NCC lấy từ master NCC (data.jsx) */
window.mdSupplierNames = () => (window.SUPPLIERS || []).map((s) => s.name);
/* mã danh mục tự sinh (bỏ dấu, lấy chữ cái đầu mỗi từ) — app bắt buộc có CODE, hiển thị mỗi dòng */
window.mdCode = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').split(/[\s·/&()-]+/).filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 5);

/* ---------------- CascadeSelect: tuyến → nhóm con ---------------- */
function CascadeSelect({ value, onChange }) {
  // value = "Thuốc · Kháng sinh · Beta-lactam"  → dùng 2 cấp đầu
  const parts = (value || '').split(' · ');
  const top = parts[0] || '';
  const sub = parts[1] || '';
  const cats = window.MD_CATEGORIES;
  const subs = (cats.find((c) => c.name === top) || {}).children || [];
  const sel = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff', color: 'var(--dv-ink)' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
      <select value={top} onChange={(e) => onChange(e.target.value)} style={sel}>
        <option value="">— Tuyến —</option>
        {cats.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
      </select>
      <select value={sub} onChange={(e) => onChange(`${top} · ${e.target.value}`)} disabled={!top} style={{ ...sel, opacity: top ? 1 : 0.5 }}>
        <option value="">— Nhóm —</option>
        {subs.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
window.CascadeSelect = CascadeSelect;

/* ---------------- ImportModal: luồng giả lập (preview + validate) ---------------- */
function ImportModal({ title, columns, sampleRows, onClose, onImport }) {
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconX, IconUpload, IconSheet, IconCheckCircle, IconAlertTriangle, IconDownload } = window;
  const [stage, setStage] = React.useState('drop'); // drop | preview
  const rows = sampleRows || [];
  const okCount = rows.filter((r) => !r._warn).length;
  const warnCount = rows.length - okCount;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.4)', animation: 'dvFade .2s ease' }} />
      <div style={{ position: 'relative', width: 'min(680px, 96vw)', maxHeight: '88vh', background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--border-default)' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconUpload size={19} /></span>
          <div style={{ flex: 1 }}><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: 0 }}>Nhập {title}</h3><div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Tải lên CSV/Excel · hệ thống kiểm tra trước khi ghi</div></div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
        </div>

        {stage === 'drop' && (
          <div style={{ padding: 22 }}>
            <div onClick={() => setStage('preview')} style={{ border: '2px dashed var(--border-strong)', borderRadius: 14, padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--dv-mist)' }}>
              <span style={{ width: 54, height: 54, borderRadius: '50%', background: '#fff', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><IconSheet size={26} /></span>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--dv-ink)' }}>Kéo thả tệp vào đây, hoặc bấm để chọn</div>
              <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 4 }}>Hỗ trợ .xlsx, .csv · tối đa 10.000 dòng</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
              <button onClick={() => { const cols = columns; window.exportCSV(`mau-${title}.csv`, cols, [cols.map(() => '')]); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 13 }}><IconDownload size={15} />Tải tệp mẫu</button>
              <span style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>Cột bắt buộc: {columns.slice(0, 4).join(', ')}…</span>
            </div>
          </div>
        )}

        {stage === 'preview' && (
          <>
            <div style={{ display: 'flex', gap: 10, padding: '14px 22px', borderBottom: '1px solid var(--border-default)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--dv-green-50)', color: 'var(--dv-green)', borderRadius: 999, padding: '6px 13px', fontWeight: 700, fontSize: 13 }}><IconCheckCircle size={15} />{okCount} dòng hợp lệ</span>
              {warnCount > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFBF0', color: 'var(--dv-yellow-600)', borderRadius: 999, padding: '6px 13px', fontWeight: 700, fontSize: 13 }}><IconAlertTriangle size={15} />{warnCount} dòng cảnh báo</span>}
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '0 22px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
                <thead><tr>{['', ...columns].map((h, i) => <th key={i} style={{ position: 'sticky', top: 0, background: '#fff', textAlign: 'left', padding: '11px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-default)', background: r._warn ? '#FFFBF0' : '#fff' }}>
                      <td style={{ padding: '9px 10px' }}>{r._warn ? <span title={r._warn} style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconAlertTriangle size={15} /></span> : <span style={{ color: 'var(--dv-green-bright)', display: 'inline-flex' }}><IconCheckCircle size={15} /></span>}</td>
                      {columns.map((c, j) => <td key={j} style={{ padding: '9px 10px', fontSize: 12.5, color: r._warn && j === r._warnCol ? '#C5372C' : 'var(--dv-ink)', fontWeight: r._warn && j === r._warnCol ? 700 : 400, whiteSpace: 'nowrap' }}>{r.cells[j]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {warnCount > 0 && <div style={{ fontSize: 12, color: 'var(--dv-ink-soft)', padding: '12px 0', lineHeight: 1.5 }}>Dòng cảnh báo sẽ bị bỏ qua hoặc cần sửa. Giá trị không khớp dữ liệu nền (nhóm hàng, NCC, ĐVT) được tô đỏ.</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--border-default)' }}>
              <Button variant="secondary" size="md" onClick={() => setStage('drop')}>Chọn tệp khác</Button>
              <Button variant="primary" size="md" onClick={() => { onImport(okCount); onClose(); }}>Nhập {okCount} dòng hợp lệ</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
window.ImportModal = ImportModal;

/* ---------------- ExportImportBar: cụm nút dùng chung trên các màn master ---------------- */
function ExportImportBar({ label, columns, exportRows, sampleRows, setToast, importable = true }) {
  const { IconDownload, IconUpload } = window;
  const [imp, setImp] = React.useState(false);
  const btn = { display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--dv-ink)' };
  return (
    <span style={{ display: 'inline-flex', gap: 8 }}>
      <button style={btn} onClick={() => { window.exportCSV(`${label}.csv`, columns, exportRows()); setToast && setToast(`Đã xuất ${label} (CSV).`); }}><IconDownload size={15} />Xuất</button>
      {/* DVP-382 #4/#5: importable={false} chỉ tắt "Nhập" ở đúng call-site được chốt; các màn master khác vẫn giữ */}
      {importable && <button style={btn} onClick={() => setImp(true)}><IconUpload size={15} />Nhập</button>}
      {imp && <ImportModal title={label} columns={columns} sampleRows={sampleRows} onClose={() => setImp(false)} onImport={(n) => setToast && setToast(`Đã nhập ${n} dòng vào ${label}.`)} />}
    </span>
  );
}
window.ExportImportBar = ExportImportBar;

/* ---------------- AddMasterItem: form thêm mục cho từng tab dữ liệu nền ---------------- */
function AddMasterItem({ tab, tabLabel, onClose, setToast }) {
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconX, IconPlus } = window;
  const [v, setV] = React.useState({ a: '', b: '', top: window.MD_CATEGORIES[0].name });
  const cfg = {
    cat: { title: 'nhóm hàng', fields: [['top', 'Tuyến', 'select'], ['a', 'Tên nhóm con', 'text']] },
    unit: { title: 'đơn vị tính', fields: [['a', 'Tên đơn vị', 'text']] },
    storage: { title: 'điều kiện bảo quản', fields: [['a', 'Tên hiển thị', 'text'], ['b', 'Mô tả', 'text']] },
    country: { title: 'quốc gia', fields: [['a', 'Tên quốc gia', 'text']] },
  }[tab];
  const lbl = { display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 7, color: 'var(--dv-ink)' };
  const inp = { width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: 10, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14.5, outline: 'none', background: '#fff' };
  const canSave = v.a.trim();
  const save = () => {
    if (tab === 'cat') window.MD_CATEGORIES.find((c) => c.name === v.top).children.push(v.a.trim());
    else if (tab === 'unit') window.MD_UNITS.push(v.a.trim());
    else if (tab === 'country') window.MD_COUNTRIES.push(v.a.trim());
    else if (tab === 'storage') window.MD_STORAGE.push({ key: v.a.trim().toLowerCase().replace(/\s+/g, '_'), label: v.a.trim(), note: v.b.trim() });
    setToast(`Đã thêm "${v.a.trim()}" vào ${cfg.title}.`); onClose();
  };
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.4)', animation: 'dvFade .2s ease' }} />
      <div style={{ position: 'relative', width: 'min(440px, 96vw)', background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--border-default)' }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconPlus size={19} /></span>
          <div style={{ flex: 1 }}><h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0 }}>Thêm {cfg.title}</h3><div style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>{tabLabel}</div></div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 15 }}>
          {cfg.fields.map(([k, label, type]) => (
            <div key={k}>
              <label style={lbl}>{label}</label>
              {type === 'select'
                ? <select value={v.top} onChange={(e) => setV((x) => ({ ...x, top: e.target.value }))} style={inp}>{window.MD_CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}</select>
                : <input value={v[k]} onChange={(e) => setV((x) => ({ ...x, [k]: e.target.value }))} placeholder={label + '…'} style={inp} autoFocus={k === 'a'} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid var(--border-default)' }}>
          <Button variant="secondary" size="md" onClick={onClose}>Hủy</Button>
          <Button variant="primary" size="md" onClick={save} disabled={!canSave}>Thêm</Button>
        </div>
      </div>
    </div>
  );
}
window.AddMasterItem = AddMasterItem;

/* ---------------- ImportPanel: TAB "Nhập từ file" — chọn tệp → KHỚP CỘT → xem trước ----------------
   App tách import thành tab riêng (DVP-192): thêm bước mapping (khớp cột) trước preview, trình bày inline
   thay vì modal. Modal ImportModal vẫn dùng cho các màn master khác (Danh mục SP, NCC, Điểm bán…). */
const IMPORT_TARGETS = {
  cat: {
    label: 'Nhóm hàng', file: 'nhom-hang-2026.xlsx', total: 26,
    columns: ['Tuyến', 'Nhóm con', 'Mã'],
    fileHeaders: ['Nhóm cha', 'Nhóm con', 'Mã code', 'Ghi chú'],
    autoMap: { 'Nhóm cha': 'Tuyến', 'Nhóm con': 'Nhóm con', 'Mã code': 'Mã', 'Ghi chú': '' },
    rows: [
      { cells: ['Thuốc', 'Kháng sinh', 'KS'] }, { cells: ['Thuốc', 'Tiêu hóa', 'TH'] },
      { cells: ['TPCN', 'Men vi sinh', 'MVS'] },
      { cells: ['Thuốc', 'Da liễu', 'DL'], _warn: 'Nhóm con mới — sẽ được tạo khi nhập', _warnCol: 1 },
    ],
  },
  unit: {
    label: 'Đơn vị tính', file: 'don-vi-tinh.csv', total: 12,
    columns: ['Đơn vị', 'Ghi chú'],
    fileHeaders: ['Tên ĐVT', 'Diễn giải'],
    autoMap: { 'Tên ĐVT': 'Đơn vị', 'Diễn giải': 'Ghi chú' },
    rows: [{ cells: ['Hộp', ''] }, { cells: ['Vỉ', ''] }, { cells: ['Khay', 'đơn vị mới'], _warn: 'Đơn vị chưa có — sẽ được thêm', _warnCol: 0 }],
  },
  storage: {
    label: 'Điều kiện bảo quản', file: 'bao-quan.xlsx', total: 4,
    columns: ['Mã', 'Tên', 'Mô tả'],
    fileHeaders: ['code', 'Tên hiển thị', 'Mô tả', 'Nhiệt độ'],
    autoMap: { 'code': 'Mã', 'Tên hiển thị': 'Tên', 'Mô tả': 'Mô tả', 'Nhiệt độ': '' },
    rows: [{ cells: ['thuong', 'Thường', '< 30°C'] }, { cells: ['lanh', 'Lạnh 2–8°C', 'Dây chuyền lạnh GSP'] }],
  },
  country: {
    label: 'Quốc gia SX', file: 'quoc-gia-sx.csv', total: 32,
    columns: ['Quốc gia'],
    fileHeaders: ['Nước sản xuất', 'ISO'],
    autoMap: { 'Nước sản xuất': 'Quốc gia', 'ISO': '' },
    rows: [{ cells: ['Việt Nam'] }, { cells: ['Nhật Bản'], _warn: 'Quốc gia mới', _warnCol: 0 }],
  },
};
window.IMPORT_TARGETS = IMPORT_TARGETS;

/* MapPicker: dropdown chọn trường hệ thống (thay <select> native — hiển thị giá trị đã chọn rõ ràng, đúng brand) */
function MapPicker({ value, options, warn, onChange }) {
  const { IconChevronDown, IconCheck, IconAlertTriangle } = window;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);
  const has = !!value;
  const items = [{ v: '', l: '— Bỏ qua cột này —' }].concat(options.map((o) => ({ v: o, l: o })));
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: has ? '1px solid var(--dv-green)' : '1px dashed var(--border-strong)', background: has ? '#fff' : 'var(--dv-mist)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: has ? 600 : 400, color: has ? 'var(--dv-ink)' : 'var(--dv-ink-faint)', textAlign: 'left' }}>
        <span style={{ flex: 1 }}>{has ? value : '— Bỏ qua cột này —'}</span>
        {warn && <span title="Trường đã được gán cho cột khác" style={{ display: 'inline-flex', color: 'var(--dv-yellow-600)' }}><IconAlertTriangle size={15} /></span>}
        <span style={{ display: 'inline-flex', color: 'var(--dv-ink-faint)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><IconChevronDown size={15} /></span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', padding: 4 }}>
          {items.map((o) => {
            const on = o.v === (value || '');
            return <button key={o.v || 'skip'} onClick={() => { onChange(o.v); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', border: 'none', background: on ? 'var(--dv-green-50)' : 'transparent', cursor: 'pointer', borderRadius: 7, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: on ? 700 : 500, color: o.v ? 'var(--dv-ink)' : 'var(--dv-ink-faint)', textAlign: 'left' }}><span style={{ flex: 1 }}>{o.l}</span>{on && <span style={{ display: 'inline-flex', color: 'var(--dv-green)' }}><IconCheck size={15} /></span>}</button>;
          })}
        </div>
      )}
    </div>
  );
}
window.MapPicker = MapPicker;

function ImportPanel({ initialTarget, setToast }) {
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconSheet, IconCheckCircle, IconAlertTriangle, IconDownload, IconArrowRight, IconChevronRight, IconChevronDown, IconLink, IconX, IconFile } = window;
  const [target, setTarget] = React.useState(IMPORT_TARGETS[initialTarget] ? initialTarget : 'cat');
  const [step, setStep] = React.useState(1);        // 1 chọn tệp · 2 khớp cột · 3 xem trước
  const [picked, setPicked] = React.useState(false);
  const cfg = IMPORT_TARGETS[target];
  const [map, setMap] = React.useState({ ...cfg.autoMap });

  const goTarget = (t) => { setTarget(t); setStep(1); setPicked(false); setMap({ ...IMPORT_TARGETS[t].autoMap }); };
  const restart = () => { setStep(1); setPicked(false); setMap({ ...cfg.autoMap }); };

  const okCount = cfg.rows.filter((r) => !r._warn).length;
  const warnCount = cfg.rows.length - okCount;
  const mappedCols = cfg.columns.filter((c) => Object.values(map).includes(c));
  const allMapped = mappedCols.length === cfg.columns.length;
  const missing = cfg.columns.filter((c) => !Object.values(map).includes(c));

  const STEPS = ['Chọn tệp', 'Khớp cột', 'Xem trước'];
  const TARGET_KEYS = ['cat', 'unit', 'storage', 'country'];

  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      <div style={{ height: 4, background: 'var(--dv-yellow)' }} />

      {/* stepper */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border-default)', flexWrap: 'wrap' }}>
        {STEPS.map((label, i) => {
          const n = i + 1; const done = step > n; const active = step === n;
          return (
            <React.Fragment key={label}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5, background: done || active ? 'var(--dv-green)' : 'var(--dv-mist)', color: done || active ? '#fff' : 'var(--dv-ink-faint)', boxShadow: active ? '0 0 0 4px var(--dv-green-50)' : 'none' }}>{done ? <IconCheckCircle size={16} /> : n}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5, color: active ? 'var(--dv-green)' : done ? 'var(--dv-ink)' : 'var(--dv-ink-faint)' }}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <span style={{ flex: 1, minWidth: 24, height: 2, margin: '0 14px', background: step > n ? 'var(--dv-green)' : 'var(--border-strong)', borderRadius: 2 }} />}
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ padding: 24 }}>
        {step === 1 && (
          <>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)', marginBottom: 9 }}>Nhập vào danh mục</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {TARGET_KEYS.map((k) => {
                  const on = target === k;
                  return <button key={k} onClick={() => goTarget(k)} style={{ border: on ? '1.5px solid var(--dv-green)' : '1px solid var(--border-strong)', background: on ? 'var(--dv-green-50)' : '#fff', color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)', cursor: 'pointer', padding: '8px 15px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13 }}>{IMPORT_TARGETS[k].label}</button>;
                })}
              </div>
            </div>

            {!picked ? (
              <div onClick={() => setPicked(true)} style={{ border: '2px dashed var(--border-strong)', borderRadius: 14, padding: '44px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--dv-mist)' }}>
                <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: 'var(--shadow-sm)' }}><IconSheet size={27} /></span>
                <div style={{ fontWeight: 700, fontSize: 15.5, color: 'var(--dv-ink)' }}>Kéo thả tệp vào đây, hoặc bấm để chọn</div>
                <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 5 }}>Hỗ trợ .xlsx, .csv · tối đa 10.000 dòng</div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, border: '1px solid var(--border-default)', borderRadius: 14, padding: '16px 18px', background: 'var(--dv-green-50)' }}>
                <span style={{ width: 44, height: 44, borderRadius: 11, background: '#fff', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconFile size={22} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--dv-ink)' }}>{cfg.file}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{cfg.total} dòng · đã đọc tiêu đề · sẵn sàng khớp cột</div>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 13 }}><IconCheckCircle size={16} />Đã tải</span>
                <button onClick={() => setPicked(false)} title="Bỏ tệp" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={16} /></button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => window.exportCSV(`mau-${cfg.label}.csv`, cfg.columns, [cfg.columns.map(() => '')])} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 13 }}><IconDownload size={15} />Tải tệp mẫu ({cfg.label})</button>
              <Button variant="primary" size="md" disabled={!picked} iconRight={<IconArrowRight size={16} />} onClick={() => setStep(2)}>Tiếp tục — Khớp cột</Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconLink size={17} /></span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--dv-green)' }}>Khớp cột trong tệp với trường hệ thống</div>
                <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Hệ thống đã tự khớp theo tên cột — kiểm tra lại các cột chưa khớp.</div>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: allMapped ? 'var(--dv-green-50)' : '#FFFBF0', color: allMapped ? 'var(--dv-green)' : 'var(--dv-yellow-600)', borderRadius: 999, padding: '6px 13px', fontWeight: 700, fontSize: 12.5 }}>{allMapped ? <IconCheckCircle size={15} /> : <IconAlertTriangle size={15} />}{mappedCols.length}/{cfg.columns.length} trường đã khớp</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', gap: 12, padding: '0 4px 8px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--dv-ink-faint)' }}>
              <span>Cột trong tệp</span><span></span><span>Trường hệ thống</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cfg.fileHeaders.map((h) => {
                const val = map[h] || '';
                const dup = val && Object.entries(map).some(([k2, v]) => k2 !== h && v === val);
                return (
                  <div key={h} style={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', gap: 12, alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--dv-mist)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '10px 13px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink)' }}><span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconSheet size={15} /></span>{h}</span>
                    <span style={{ display: 'inline-flex', justifyContent: 'center', color: val ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}><IconArrowRight size={17} /></span>
                    <window.MapPicker value={val} options={cfg.columns} warn={dup} onChange={(v) => setMap((m) => ({ ...m, [h]: v }))} />
                  </div>
                );
              })}
            </div>
            {!allMapped && <div style={{ marginTop: 14, fontSize: 12.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>Còn trường bắt buộc chưa khớp: <b style={{ color: 'var(--dv-ink)' }}>{missing.join(', ')}</b>. Chọn cột nguồn tương ứng để tiếp tục.</div>}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <Button variant="ghost" size="md" onClick={() => setStep(1)}>Quay lại</Button>
              <Button variant="primary" size="md" disabled={!allMapped} iconRight={<IconArrowRight size={16} />} onClick={() => setStep(3)}>Tiếp tục — Xem trước</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'var(--dv-green-50)', color: 'var(--dv-green)', borderRadius: 999, padding: '6px 13px', fontWeight: 700, fontSize: 13 }}><IconCheckCircle size={15} />{okCount} dòng hợp lệ</span>
              {warnCount > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#FFFBF0', color: 'var(--dv-yellow-600)', borderRadius: 999, padding: '6px 13px', fontWeight: 700, fontSize: 13 }}><IconAlertTriangle size={15} />{warnCount} dòng cảnh báo</span>}
              <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>Nhập vào <b style={{ color: 'var(--dv-ink)' }}>{cfg.label}</b> · từ {cfg.file}</span>
            </div>
            <div style={{ border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
                <thead><tr>{['', ...cfg.columns].map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '11px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
                <tbody>
                  {cfg.rows.map((r, i) => (
                    <tr key={i} style={{ borderTop: i ? '1px solid var(--border-default)' : 'none', background: r._warn ? '#FFFBF0' : '#fff' }}>
                      <td style={{ padding: '10px 12px', width: 34 }}>{r._warn ? <span title={r._warn} style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconAlertTriangle size={15} /></span> : <span style={{ color: 'var(--dv-green-bright)', display: 'inline-flex' }}><IconCheckCircle size={15} /></span>}</td>
                      {cfg.columns.map((c, j) => <td key={j} style={{ padding: '10px 12px', fontSize: 13, color: r._warn && j === r._warnCol ? '#C5372C' : 'var(--dv-ink)', fontWeight: r._warn && j === r._warnCol ? 700 : 400, whiteSpace: 'nowrap' }}>{r.cells[j] || <span style={{ color: 'var(--dv-ink-faint)' }}>—</span>}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {warnCount > 0 && <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', padding: '12px 2px 0', lineHeight: 1.5 }}>Dòng cảnh báo vẫn nhập được — giá trị mới sẽ được tạo trong dữ liệu nền. Ô tô đỏ là giá trị chưa khớp danh mục hiện có.</div>}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>Quay lại — Khớp cột</Button>
              <Button variant="primary" size="md" iconRight={<IconCheckCircle size={16} />} onClick={() => { setToast(`Đã nhập ${okCount} dòng vào ${cfg.label}.`); restart(); }}>Nhập {okCount} dòng hợp lệ</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
window.ImportPanel = ImportPanel;

/* ---------------- CategoryTree: cây NHÓM HÀNG (tuyến → nhóm con) ----------------

   DVP-578 (phản hồi #27, 2026-08-31) — ĐỔI CHIỀU BỐ CỤC, không chỉ nới số.

   ## Vì sao
   Bản trước là lưới thẻ `repeat(auto-fill, minmax(250px,1fr))`, mỗi thẻ đổ sẵn MỌI nhóm con.
   Nó đúng với dữ liệu demo (tên ~8 ký tự, mã 5 ký tự do `mdCode` cắt, 4 tuyến × ~6 nhóm).
   Dữ liệu thật của một tenant sau khi nhập từ file thì khác hẳn — đo trên prod 2026-08-31:

     · 105 nhóm / 10 tuyến (demo: 26 / 4);
     · tên nhóm dài tới 74 ký tự (demo: 19);
     · mã tự sinh khi nhập dài 16 ký tự — `GRP_0FB5B3D1E780` (demo: 5);
     · một tuyến ("1. Thuốc") có 50 nhóm con.

   Hậu quả đo được ở màn thật, tại đúng 1440×756 của người báo lỗi: nút Xóa của tuyến mã-dài
   nhô 38px ra ngoài thẻ `overflow:hidden` ⇒ BIẾN MẤT (mọi tuyến mã ngắn còn dư 13px), và ô
   tên nhóm con cao 234px vì vỡ mỗi dòng một từ. Không giá trị `minmax()` nào sửa được cả hai:
   50 hàng nhồi trong một cột hẹp là sai HÌNH DẠNG, không phải sai kích thước.

   ## Ba luật của bố cục mới
   1. Tuyến trải HẾT BỀ NGANG trang — tên dài có chỗ thở, không phải cột 250px.
   2. Nhóm con chỉ dựng khi MỞ tuyến. Mặc định thu gọn (10 hàng quét được bằng mắt), trừ khi
      chỉ có đúng một tuyến — lúc đó không có gì để duyệt nên thu gọn chỉ tổ giấu nội dung.
   3. Trong mọi hàng ngang: ĐÚNG MỘT phần tử co được (`mdNameCell`, có `minWidth:0`), mọi phần
      tử khác `flex:'none'`. `minWidth:0` mới là chốt — mặc định flex item là `min-width:auto`,
      tức không co nhỏ hơn nội dung, nên nó đẩy phần sau ra ngoài mà không báo gì.

   Khớp 1-1 với code thật: app/(portal)/masterlists/_editor.tsx (hàm GroupTab). */

/* Ô TÊN — phần tử DUY NHẤT co được trong một hàng ngang. */
window.mdNameCell = { flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
/* Ô MÃ — không co, có trần bề ngang; giá trị đủ nằm ở `title` của chỗ gọi. */
window.mdCodeCell = { flex: 'none', maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 11 };

/* MỘT bố cục cho MỌI loại dữ liệu nền (DVP-58x).
   Trước đây bốn tab dựng bốn hình khác nhau (cây thẻ · pill · thẻ ngang · pill) — cùng một việc
   "xem/đổi tên/xoá một mục trong danh mục" phải bảo trì bốn lần. MDRow là hàng duy nhất; MDList
   xếp hàng vào một thẻ. Nhóm hàng vẫn phân cấp, chỉ là hàng cha (tone group) + hàng con thụt lề —
   phân cấp là DỮ LIỆU, không phải một bố cục riêng.
   Ba luật hàng ngang giữ nguyên từ DVP-578: đúng một phần tử co được (mdNameCell, minWidth:0),
   mọi phần tử khác flex:'none'; ô mã có trần bề ngang; tên nhóm con xuống dòng chứ không cắt. */
window.mdIconBtn = (color) => ({ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' });

function MDRow({ icon: Ic, title, note, code, codeTitle, count, countTitle, group, indent, wrapTitle, edit, setEdit, editId, commitEdit, onRename, onDelete, onToggle, opened }) {
  const { IconEdit, IconX, IconChevronDown, IconChevronRight } = window;
  const editing = edit && editId && edit.id === editId;
  const editInput = { flex: 1, minWidth: 0, border: '1px solid var(--dv-green)', borderRadius: 7, padding: '5px 8px', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 15px', paddingLeft: 15 + (indent ? 30 : 0), background: group ? 'var(--dv-green-50)' : '#fff', borderTop: '1px solid var(--border-default)' }}>
      {onToggle
        ? <button onClick={onToggle} aria-expanded={!!opened} aria-label={(opened ? 'Thu gọn ' : 'Mở ') + title} style={window.mdIconBtn('var(--dv-green)')}>{opened ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}</button>
        : null}
      {Ic ? <span style={{ width: 28, height: 28, borderRadius: 8, background: group ? 'var(--dv-green)' : 'var(--dv-mist)', color: group ? '#fff' : 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Ic size={15} /></span> : null}
      {editing
        ? <input autoFocus value={edit.val} onChange={(e) => setEdit({ ...edit, val: e.target.value })} onBlur={commitEdit} onKeyDown={(e) => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEdit(null); }} style={{ ...editInput, ...(group ? { fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--dv-green)' } : null) }} />
        : (
          <span style={{ ...window.mdNameCell, ...(wrapTitle ? { whiteSpace: 'normal', overflow: 'visible', lineHeight: 1.45, wordBreak: 'break-word' } : null) }}>
            <span title={wrapTitle ? undefined : title} style={{ fontFamily: group ? 'var(--font-display)' : 'var(--font-body)', fontWeight: group ? 800 : 600, fontSize: group ? 15 : 13.5, color: group ? 'var(--dv-green)' : 'var(--dv-ink)' }}>{title}</span>
            {note ? <span style={{ display: 'block', fontSize: 12.5, fontWeight: 400, color: 'var(--dv-ink-soft)' }}>{note}</span> : null}
          </span>
        )}
      {count != null ? <span title={countTitle} style={{ flex: 'none', fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color: 'var(--dv-green)', background: '#fff', border: '1px solid var(--dv-green-100)', borderRadius: 999, padding: '2px 9px' }}>{count}</span> : null}
      {code ? <code title={codeTitle || ('Mã ' + code)} style={{ ...window.mdCodeCell, color: 'var(--dv-ink-faint)' }}>{code}</code> : null}
      {onRename ? <button onClick={onRename} title="Đổi tên" style={window.mdIconBtn(group ? 'var(--dv-green)' : 'var(--dv-ink-faint)')}><IconEdit size={14} /></button> : null}
      {onDelete ? <button onClick={onDelete} title="Xóa" style={window.mdIconBtn('#C5372C')}><IconX size={15} /></button> : null}
    </div>
  );
}
window.MDRow = MDRow;

/* MDList — thẻ chứa hàng + nút thêm ở chân. `children` là chuỗi MDRow đã dựng. */
function MDList({ children, addLabel, onAdd, toolbar }) {
  const { IconPlus } = window;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {toolbar}
      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        {children}
      </div>
      {onAdd ? (
        <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 15px', border: '2px dashed var(--border-strong)', background: 'transparent', borderRadius: 'var(--radius-card)', cursor: 'pointer', color: 'var(--dv-green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--dv-green-50)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconPlus size={16} /></span>{addLabel}
        </button>
      ) : null}
    </div>
  );
}
window.MDList = MDList;

/* ---------------- Màn DỮ LIỆU NỀN ---------------- */
function MasterListsScreen({ setToast }) {
  const { PageHeader, StatusTabs, MDList, MDRow } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconLayers, IconBox, IconSnowflake, IconMapPin, IconPlus, IconEdit, IconX, IconUpload, IconDownload } = window;
  const [tab, setTab] = React.useState('cat');
  const [mode, setMode] = React.useState('manage'); // manage | import
  const [adding, setAdding] = React.useState(false);
  const [, force] = React.useReducer((n) => n + 1, 0);
  const [edit, setEdit] = React.useState(null); // { id: 'top|Thuốc' | 'sub|Thuốc|Kháng sinh', val }
  /* Một hàm sửa tên cho MỌI loại: id = scope|… */
  const commitEdit = () => {
    if (!edit) { return; }
    const val = edit.val.trim();
    const [scope, k1, k2] = edit.id.split('|');
    if (val) {
      if (scope === 'top' || scope === 'sub') {
        const g = window.MD_CATEGORIES.find((c) => c.name === k1);
        if (g && scope === 'top') g.name = val;
        else if (g) { const i = g.children.indexOf(k2); if (i >= 0) g.children[i] = val; }
      } else if (scope === 'unit') { const i = window.MD_UNITS.indexOf(k1); if (i >= 0) window.MD_UNITS[i] = val; }
      else if (scope === 'country') { const i = window.MD_COUNTRIES.indexOf(k1); if (i >= 0) window.MD_COUNTRIES[i] = val; }
      else if (scope === 'storage') { const x = window.MD_STORAGE.find((s) => s.key === k1); if (x) x.label = val; }
    }
    setEdit(null); force();
  };
  const addTop = () => { const name = 'Tuyến mới'; window.MD_CATEGORIES.push({ name, children: [] }); setEdit({ id: 'top|' + name, val: name }); force(); };
  const delTop = (name) => { const used = (window.PRODUCTS || []).filter((p) => (p.group || '').startsWith('Thuốc') && (p.group || '').includes(name)).length; const g0 = window.MD_CATEGORIES.find((c) => c.name === name); if (g0 && g0.children.length) { setToast(`Không thể xóa tuyến "${name}" — còn ${g0.children.length} nhóm con. Xóa hoặc chuyển nhóm con trước.`); return; } const i = window.MD_CATEGORIES.findIndex((c) => c.name === name); if (i >= 0) window.MD_CATEGORIES.splice(i, 1); setToast(`Đã xóa tuyến "${name}".`); force(); };
  const addSub = (top) => { const g = window.MD_CATEGORIES.find((c) => c.name === top); if (g) { const name = 'Nhóm mới'; g.children.push(name); setEdit({ id: `sub|${top}|${name}`, val: name }); force(); } };
  const delSub = (top, c) => { const used = (window.PRODUCTS || []).filter((p) => (p.group || '').includes(c)).length; if (used > 0) { setToast(`Không thể xóa "${c}" — đang có ${used} SKU dùng nhóm này. Chuyển nhóm cho SKU trước.`); return; } const g = window.MD_CATEGORIES.find((x) => x.name === top); if (g) { const i = g.children.indexOf(c); if (i >= 0) g.children.splice(i, 1); } setToast(`Đã xóa nhóm "${c}".`); force(); };

  const cats = window.MD_CATEGORIES;
  const [open, setOpen] = React.useState(() => (cats.length === 1 ? cats.map((g) => g.name) : []));
  const isOpen = (n) => open.indexOf(n) >= 0;
  const toggle = (n) => setOpen((s) => (s.indexOf(n) >= 0 ? s.filter((x) => x !== n) : s.concat(n)));
  const allOpen = cats.length > 0 && cats.every((g) => isOpen(g.name));

  /* Nhãn nút thêm khai riêng: hạ chữ toàn bộ nhãn tab làm "Quốc gia SX" thành "quốc gia sx". */
  const TABS = [['cat', 'Nhóm hàng', window.mdCategoryFlat().length], ['unit', 'Đơn vị tính', window.MD_UNITS.length], ['storage', 'Điều kiện bảo quản', window.MD_STORAGE.length], ['country', 'Quốc gia SX', window.MD_COUNTRIES.length]];
  const ADD_LABEL = { cat: 'Thêm tuyến', unit: 'Thêm đơn vị tính', storage: 'Thêm điều kiện bảo quản', country: 'Thêm quốc gia' };

  const sampleFor = {
    cat: { columns: ['Tuyến', 'Nhóm con', 'Mã'], rows: [
      { cells: ['Thuốc', 'Kháng sinh', 'KS'] }, { cells: ['Thuốc', 'Tiêu hóa', 'TH'] },
      { cells: ['TPCN', 'Men vi sinh', 'MVS'] }, { cells: ['Thuốc', 'Da liễu', 'DL'], _warn: 'Tuyến hợp lệ, nhóm mới sẽ được tạo', _warnCol: 1 },
    ] },
    unit: { columns: ['Đơn vị', 'Ghi chú'], rows: [{ cells: ['Hộp', ''] }, { cells: ['Vỉ', ''] }, { cells: ['Khay', 'đơn vị mới'], _warn: 'Đơn vị chưa có', _warnCol: 0 }] },
    storage: { columns: ['Mã', 'Tên', 'Mô tả'], rows: [{ cells: ['thuong', 'Thường', '< 30°C'] }, { cells: ['lanh', 'Lạnh 2–8°C', 'GSP'] }] },
    country: { columns: ['Quốc gia'], rows: [{ cells: ['Việt Nam'] }, { cells: ['Nhật Bản'], _warn: 'Quốc gia mới', _warnCol: 0 }] },
  };
  const simpleRows = tab === 'unit'
    ? window.MD_UNITS.map((u) => ({ key: u, title: u, icon: IconBox, editId: 'unit|' + u, onDelete: () => { const used = (window.PRODUCTS || []).filter((p) => p.unit === u).length; if (used > 0) { setToast(`Không thể xóa ĐVT "${u}" — ${used} SKU đang dùng.`); return; } const i = window.MD_UNITS.indexOf(u); if (i >= 0) window.MD_UNITS.splice(i, 1); setToast(`Đã xóa đơn vị "${u}".`); force(); } }))
    : tab === 'storage'
      ? window.MD_STORAGE.map((x) => ({ key: x.key, title: x.label, note: x.note, code: x.key, icon: x.key === 'lanh' ? IconSnowflake : IconBox, editId: 'storage|' + x.key, onDelete: () => setToast(`Điều kiện bảo quản "${x.label}" đang được tham chiếu — không xoá được.`) }))
      : tab === 'country'
        ? window.MD_COUNTRIES.map((c) => ({ key: c, title: c, icon: IconMapPin, editId: 'country|' + c, onDelete: () => { const i = window.MD_COUNTRIES.indexOf(c); if (i >= 0) window.MD_COUNTRIES.splice(i, 1); setToast(`Đã xóa "${c}".`); force(); } }))
        : [];

  const s = sampleFor[tab];
  const exportRows = () => {
    if (tab === 'cat') return window.MD_CATEGORIES.flatMap((g) => g.children.map((c) => [g.name, c, window.mdCode(c)]));
    if (tab === 'unit') return window.MD_UNITS.map((u) => [u, '']);
    if (tab === 'storage') return window.MD_STORAGE.map((x) => [x.key, x.label, x.note]);
    return window.MD_COUNTRIES.map((c) => [c]);
  };

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader title="Dữ liệu nền" subtitle="Danh mục chuẩn hóa dùng cho mọi dropdown trong hệ thống — nhóm hàng phân cấp, đơn vị tính, điều kiện bảo quản, quốc gia. Quản lý tập trung để tránh sai lệch & vỡ bộ lọc."
        actions={mode === 'manage'
          ? <button onClick={() => { const lbl = TABS.find((t) => t[0] === tab)[1]; window.exportCSV(`Dữ liệu nền · ${lbl}.csv`, s.columns, exportRows()); setToast(`Đã xuất ${lbl} (CSV).`); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--dv-ink)' }}><IconDownload size={15} />Xuất</button>
          : null} />

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'inline-flex', background: 'var(--dv-mist)', borderRadius: 999, padding: 4, gap: 4 }}>
          {[['manage', 'Quản lý danh mục', IconLayers], ['import', 'Nhập từ file', IconUpload]].map(([k, l, Ic]) => (
            <button key={k} onClick={() => setMode(k)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer', padding: '9px 17px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13.5, background: mode === k ? '#fff' : 'transparent', color: mode === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: mode === k ? 'var(--shadow-sm)' : 'none', transition: 'all .16s' }}><Ic size={15} />{l}</button>
          ))}
        </div>
      </div>

      {mode === 'import' && <window.ImportPanel initialTarget={tab} setToast={setToast} />}

      {mode === 'manage' && (<>
      <div style={{ marginBottom: 18 }}>
        <StatusTabs items={TABS} value={tab} onChange={setTab} />
      </div>

      <div style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', marginBottom: 12 }}>Thay đổi ở đây áp dụng cho dropdown ở Danh mục sản phẩm và các màn liên quan.</div>
      {adding && <AddMasterItem tab={tab} tabLabel={TABS.find((t) => t[0] === tab)[1]} onClose={() => setAdding(false)} setToast={setToast} />}

      {tab === 'cat' ? (
        <MDList addLabel="Thêm tuyến" onAdd={addTop}
          toolbar={cats.length > 1 ? (
            <div style={{ display: 'flex' }}>
              <button onClick={() => setOpen(allOpen ? [] : cats.map((g) => g.name))} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '7px 13px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-ink)' }}>
                {allOpen ? 'Thu gọn tất cả' : `Mở tất cả (${cats.length} tuyến)`}
              </button>
            </div>
          ) : null}>
          {cats.map((g) => {
            const opened = isOpen(g.name);
            return (
              <React.Fragment key={g.name}>
                <MDRow group icon={IconLayers} title={g.name} code={g.code || window.mdCode(g.name)}
                  codeTitle={`Mã ${g.code || window.mdCode(g.name)} — không sửa được: đổi mã phá tham chiếu của sản phẩm`}
                  count={g.children.length} countTitle="Số nhóm con"
                  opened={opened} onToggle={() => toggle(g.name)}
                  edit={edit} setEdit={setEdit} editId={'top|' + g.name} commitEdit={commitEdit}
                  onRename={() => setEdit({ id: 'top|' + g.name, val: g.name })} onDelete={() => delTop(g.name)} />
                {opened && (g.children.length === 0
                  ? <div style={{ padding: '13px 15px 13px 45px', borderTop: '1px solid var(--border-default)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Tuyến này chưa có nhóm con.</div>
                  : g.children.map((c) => (
                    <MDRow key={c} indent wrapTitle title={c} code={window.mdCode(c)} codeTitle={`Mã nhóm ${window.mdCode(c)} (tự sinh)`}
                      edit={edit} setEdit={setEdit} editId={`sub|${g.name}|${c}`} commitEdit={commitEdit}
                      onRename={() => setEdit({ id: `sub|${g.name}|${c}`, val: c })} onDelete={() => delSub(g.name, c)} />
                  )))}
                {opened && (
                  <button onClick={() => addSub(g.name)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: '100%', border: 'none', borderTop: '1px solid var(--border-default)', background: 'transparent', cursor: 'pointer', padding: '11px 15px 11px 45px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' }}><IconPlus size={14} />Thêm nhóm con</button>
                )}
              </React.Fragment>
            );
          })}
        </MDList>
      ) : (
        <MDList addLabel={ADD_LABEL[tab]} onAdd={() => setAdding(true)}>
          {simpleRows.map((r) => (
            <MDRow key={r.key} icon={r.icon} title={r.title} note={r.note} code={r.code} wrapTitle={r.wrap}
              edit={edit} setEdit={setEdit} editId={r.editId} commitEdit={commitEdit}
              onRename={() => setEdit({ id: r.editId, val: r.title })} onDelete={r.onDelete} />
          ))}
        </MDList>
      )}
      </>)}
    </div>
  );
}
window.MasterListsScreen = MasterListsScreen;

/* Pharmacy — ĐIỂM BÁN & MẠNG LƯỚI (2.2): màn StoresNetwork. Tách khỏi `MasterData.jsx`
   2026-09-07; nạp SAU nó (dùng mdInp · mdLbl · Drawer khai ở tệp đó). */

/* ---------------- stores & network (2.2) ---------------- */
/* DVP-510 — "Kho tổng" là mô hình của MedOps, KHÔNG phải của POS.
   [Đo — KiotViet GET /branches, sandbox ntcmed, 2026-08-20] response có đúng 10 trường:
   id · branchName · address · locationName · wardName · contactNumber · email · retailerId ·
   createdDate · modifiedDate — không trường nào nói về loại chi nhánh.
   Vòng đồng bộ chỉ ĐOÁN từ tên lúc tạo điểm bán lần đầu, và không bao giờ ghi đè sau đó;
   phép đoán trượt cả hai chiều (0 kho ở ntcmed, 2 kho ở relife) nên cột Loại phải sửa được tại đây. */
/* T20 — freq = số chuyến giao/tuần (F), lt = leadtime giao nội bộ (ngày) của TUYẾN kho → chi nhánh;
   đầu vào cửa sổ Min/Max của cách tính Percentile — màn Cài đặt chỉ trỏ về đây. */
const NETWORK_STORES = [
  { id: 'KHO', name: 'Kho tổng (DC)', addr: 'KCN Tân Tạo, Q. Bình Tân, TP.HCM', kv: 'KV-1001', type: 'wh', mgr: 'Lê Văn Hùng', freq: 7, lt: 0.5, status: 'active' },
  { id: 'DV01', name: 'Dược Vương Q.1', addr: '142 Nguyễn Trãi, Q.1', kv: 'KV-1002', type: 'store', mgr: 'Nguyễn Thị Hoa', freq: 5, lt: 0.5, status: 'active' },
  { id: 'DV02', name: 'Dược Vương Q.3', addr: '88 Võ Văn Tần, Q.3', kv: 'KV-1003', type: 'store', mgr: 'Trần Văn Nam', freq: 5, lt: 0.5, status: 'active' },
  { id: 'DV03', name: 'Dược Vương Q.5', addr: '255 Trần Hưng Đạo, Q.5', kv: 'KV-1004', type: 'store', mgr: 'Phạm Thị Linh', freq: 4, lt: 0.5, status: 'active' },
  { id: 'DV04', name: 'Dược Vương Gò Vấp', addr: '410 Quang Trung, Gò Vấp', kv: 'KV-1005', type: 'store', mgr: 'Đỗ Văn Sơn', freq: 3, lt: 1, status: 'active' },
  { id: 'DV05', name: 'Dược Vương Tân Bình', addr: '72 Cộng Hòa, Tân Bình', kv: 'KV-1006', type: 'store', mgr: 'Vũ Thị Mai', freq: 4, lt: 0.5, status: 'active' },
  { id: 'DV06', name: 'Dược Vương Thủ Đức', addr: '19 Võ Văn Ngân, Thủ Đức', kv: 'KV-1007', type: 'store', mgr: 'Bùi Văn Khoa', freq: 2, lt: 1, status: 'active' },
  { id: 'DV07', name: 'Dược Vương Bình Thạnh', addr: '305 Xô Viết Nghệ Tĩnh, BT', kv: 'KV-1008', type: 'store', mgr: 'Hồ Thị Thu', freq: 3, lt: 1, status: 'paused' },
  { id: 'DV08', name: 'Dược Vương Q.7', addr: '125 Nguyễn Thị Thập, Q.7', kv: 'KV-1009', type: 'store', mgr: 'Lý Văn Tài', freq: 4, lt: 0.5, status: 'active' },
  { id: 'DV09', name: 'Dược Vương Bình Tân', addr: '60 Tên Lửa, Bình Tân', kv: 'KV-1010', type: 'store', mgr: 'Cao Thị Bích', freq: 3, lt: 1, status: 'active' },
];
const DEFAULT_SOURCES = {
  DV01: ['Kho tổng (DC)', 'Dược Vương Q.3'], DV02: ['Kho tổng (DC)', 'Dược Vương Q.1'], DV03: ['Kho tổng (DC)', 'Dược Vương Q.1'],
  DV04: ['Kho tổng (DC)'], DV05: ['Kho tổng (DC)', 'Dược Vương Tân Bình'], DV06: ['Kho tổng (DC)', 'Dược Vương Q.7'],
  DV07: ['Kho tổng (DC)'], DV08: ['Kho tổng (DC)', 'Dược Vương Q.5'], DV09: ['Kho tổng (DC)'],
};

/* Engine hai tầng cần ĐÚNG 1 kho tổng đang hoạt động. Rào chỉ chặn việc THÊM kho khi thêm xong
   sẽ có QUÁ MỘT kho hoạt động — bỏ kho thì luôn được, kể cả kho cuối cùng.
   DVP-513: luật đầu tiên là "khoảng cách tới 1 không được tăng". Nó qua được ca 3 kho → 2 kho
   nhưng chặn CẢ HAI lối ra khỏi trạng thái đúng (1→0 và 1→2), nên chuỗi có đúng 1 kho không còn
   đường nào CHUYỂN kho tổng sang điểm bán khác — hai câu từ chối chỉ vào nhau.
   Hai trạng thái sai không đối xứng: 0 kho là chỗ dừng an toàn (engine từ chối thẳng, băng đỏ ở
   màn này, 0→1 luôn đi được); 2 kho mới là thứ engine không phân giải nổi "kho nào đặt hàng cho
   chuỗi". Nên chỉ chặn đường VÀO 2 kho. Kho TẠM DỪNG không tính — đó đúng là tập hợp engine đếm.
   Bảng chuyển: 0→1 ✓ · 1→0 ✓ · 1→2 ✗ · 2→1 ✓ · 3→2 ✓ · 2→3 ✗
   Mirror của setBranchWarehouse (lib/app/branch-status.ts). */
window.whGuard = function whGuard(rows, s) {
  const before = rows.filter((r) => r.type === 'wh' && r.status === 'active').length;
  const meActive = s.status === 'active';
  const after = before + (meActive ? (s.type === 'wh' ? -1 : 1) : 0);
  const lastOne = s.type === 'wh' && meActive && before === 1;
  if (!(after > 1 && after > before)) return { ok: true, before, after, lastOne };
  const others = rows.filter((r) => r.type === 'wh' && r.status === 'active' && r.id !== s.id).map((r) => r.name).join(', ');
  return {
    ok: false, before, after, lastOne,
    why: `Chuỗi đã có kho tổng đang hoạt động: ${others}. Engine tính kế hoạch mua của cả chuỗi từ ĐÚNG MỘT kho. Muốn chuyển kho tổng sang "${s.name}": bỏ kho tổng ở ${others} trước (được phép, kể cả khi đó là kho cuối), rồi quay lại đặt điểm bán này.`,
  };
};

/* T26 — DVP-222: "tạm dừng" chỉ chặn chiều NHẬN điều chuyển; điểm vẫn là NGUỒN để rút tồn ra. */
const NETWORK_PAUSE_HINT = 'Tạm dừng: điểm NGỪNG NHẬN điều chuyển, vẫn là NGUỒN để rút tồn ra.';

function StoresNetwork({ setToast }) {
  const { PageHeader, StatusTabs } = window;
  // Switch đã gỡ khỏi destructure: màn này KHÔNG dựng công tắc luân chuyển ngang (xem T22 dưới).
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconStore, IconBox, IconMapPin, IconChevronUp, IconChevronDown, IconX, IconPlus, IconArrowRight, IconPlug, IconAlertTriangle, IconCheck, IconSettings } = window;
  const { Tip } = window;
  const [tab, setTab] = React.useState('list');
  /* T22 — công tắc luân chuyển ngang CH ↔ CH nằm ở Cài đặt → Điều chuyển nội bộ và KHÔNG được đọc
     về đây: prototype chưa có đường đọc cờ tenant, nên `lateral` dưới đây là GIẢ ĐỊNH CỐ ĐỊNH của
     bản dựng (mở hết ứng viên nguồn), không phải trạng thái thật của tenant. Vì thế thẻ ở đầu tab
     chỉ được CHỈ ĐƯỜNG tới công tắc, tuyệt đối không vẽ trạng thái bật/tắt — vẽ là bịa một số đo.
     NO_TICKET_YET — nối cờ thật cần đường đọc tenant_setting, chưa có ticket. */
  const lateral = true;
  const [sources, setSources] = React.useState(DEFAULT_SOURCES);
  const [rows, setRows] = React.useState(NETWORK_STORES);
  /* [T20] Mốc "đã lưu" của lịch giao — so với nó mới biết hàng nào còn treo. */
  const [lichGoc, setLichGoc] = React.useState(NETWORK_STORES);
  const lichDoi = rows.filter((r) => { const g = lichGoc.find((x) => x.id === r.id); return g && (String(g.freq) !== String(r.freq) || String(g.lt) !== String(r.lt)); });
  const [ask, setAsk] = React.useState(null); // id điểm bán đang chờ xác nhận đổi loại
  const [askStatus, setAskStatus] = React.useState(null); // id điểm bán đang chờ xác nhận tạm dừng / kích hoạt
  const [nsOpen, setNsOpen] = React.useState(false); // drawer Thêm điểm bán
  const [nsF, setNsF] = React.useState({ name: '', type: 'store', addr: '', template: '' });
  const storeRows = rows.filter((s) => s.type === 'store');
  const allNames = rows.map((s) => s.name);
  const whActive = rows.filter((s) => s.type === 'wh' && s.status === 'active').length;

  const flipType = (s) => {
    const g = window.whGuard(rows, s);
    if (!g.ok) { setToast(g.why); setAsk(null); return; }
    // DVP-513 — bỏ kho tổng cuối cùng nay được phép vì đó là bước 1 của việc CHUYỂN kho tổng.
    // Nói thẳng hệ quả; băng đỏ ở đầu màn giữ trạng thái đó trong tầm mắt cho tới khi đặt kho mới.
    setRows((rs) => rs.map((r) => (r.id === s.id ? { ...r, type: r.type === 'wh' ? 'store' : 'wh' } : r)));
    setAsk(null);
    setToast(s.type === 'wh'
      ? (g.lastOne
        ? `${s.name} chuyển thành cửa hàng — chuỗi TẠM THờI không có kho tổng. Đặt một điểm bán khác làm kho tổng để Dự trù chạy lại.`
        : `${s.name} chuyển thành cửa hàng. Dự trù sẽ tính lại ở vòng recompute kế tiếp.`)
      : `${s.name} là kho tổng. Dự trù sẽ tính lại ở vòng recompute kế tiếp.`);
  };

  // T26 — DVP-222: đổi trạng thái với xác nhận hai bước ngay trên hàng; nói rõ chiều bị chặn.
  const flipStatus = (s) => {
    const pausing = s.status === 'active';
    setRows((rs) => rs.map((r) => (r.id === s.id ? { ...r, status: pausing ? 'paused' : 'active' } : r)));
    setAskStatus(null);
    setToast(pausing ? `Đã tạm dừng ${s.name} — ngừng nhận điều chuyển; vẫn là nguồn rút tồn.` : `Đã kích hoạt ${s.name} — nhận điều chuyển trở lại.`);
  };
  const move = (storeId, idx, dir) => {
    setSources((s) => {
      const arr = [...s[storeId]]; const j = idx + dir;
      if (j < 0 || j >= arr.length) return s;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...s, [storeId]: arr };
    });
  };
  const remove = (storeId, idx) => setSources((s) => ({ ...s, [storeId]: s[storeId].filter((_, i) => i !== idx) }));
  const add = (storeId, name) => setSources((s) => s[storeId].includes(name) ? s : ({ ...s, [storeId]: [...s[storeId], name] }));

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="Điểm bán & Mạng lưới" subtitle="Danh sách điểm bán (map KiotViet) và cấu hình thứ tự nguồn bù hàng cho engine điều chuyển."
        actions={<span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}><window.ExportImportBar label="Điểm bán" importable={false} columns={['Mã', 'Tên', 'Loại', 'Địa chỉ', 'Map KiotViet', 'Quản lý']}
          exportRows={() => rows.map((s) => [s.id, s.name, s.type === 'wh' ? 'Kho tổng' : 'Cửa hàng', s.addr, s.kv, s.mgr])}
          sampleRows={[{ cells: ['DV10', 'Dược Vương Q.10', 'Cửa hàng', '20 Ba Tháng Hai, Q.10', 'KV-1011', 'Trần Văn E'] }, { cells: ['DV11', 'Dược Vương Q.4', 'Cửa hàng', '5 Hoàng Diệu, Q.4', '', 'Lê Thị F'], _warn: 'Chưa map KiotViet branch', _warnCol: 4 }]} setToast={setToast} /><Button variant="accent" size="md" iconRight={<IconPlus size={16} />} onClick={() => setNsOpen(true)}>Thêm điểm bán</Button></span>} />
      <div style={{ marginBottom: 18 }}>
        <StatusTabs items={[['list', 'Điểm bán', rows.length], ['network', 'Mạng lưới nguồn bù', storeRows.length]]} value={tab} onChange={setTab} />
      </div>

      {tab === 'list' && (
        <>
        {/* DVP-510 — nói sớm, tại chỗ sửa được. Trước bản này sai số kho tổng chỉ lộ ra LÚC ENGINE CHẠY,
            hàng giờ sau, ở màn Dự trù — cách xa màn duy nhất sửa được nó. */}
        {whActive !== 1 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#FDECEA', border: '1px solid #F3C4BE', borderRadius: 14, padding: '13px 16px', marginBottom: 14 }}>
            <span style={{ color: '#C5372C', display: 'inline-flex', flex: 'none', marginTop: 1 }}><IconAlertTriangle size={18} /></span>
            <div style={{ fontSize: 12.5, color: 'var(--dv-ink)', lineHeight: 1.55 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: '#9c2b22', marginBottom: 2 }}>
                {whActive === 0 ? 'Chưa có kho tổng nào đang hoạt động' : `Đang có ${whActive} kho tổng hoạt động`}
                {' '}— engine dự trù không chạy được
              </div>
              Engine hai tầng cần <b>đúng một</b> kho tổng đang hoạt động: nơi đặt hàng từ NCC, và là nguồn điều chuyển cho các cửa hàng.
              {whActive === 0
                ? ' Chọn một điểm bán ở cột Loại bên dưới và đặt làm kho tổng.'
                : ' Bỏ bớt ở cột Loại bên dưới, hoặc tạm dừng kho không dùng.'}
              <div style={{ color: 'var(--dv-ink-soft)', marginTop: 4 }}>Đến khi đủ điều kiện, màn <b>Dự trù</b> và <b>Điều chuyển</b> sẽ trống.</div>
              {/* T18 — NO_TICKET_YET: nhánh cố-ý-không-kho-tổng cần quyết định sản phẩm trước khi có ticket */}
              {whActive === 0 && <div style={{ color: 'var(--dv-ink-soft)', marginTop: 4 }}>Chuỗi cố ý vận hành không kho tổng? Dự trù theo từng điểm đang ở lộ trình — cần quyết định sản phẩm.</div>}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: 'var(--dv-ink-soft)', marginBottom: 12 }}>
          <IconMapPin size={14} style={{ color: 'var(--dv-green)', flex: 'none', marginTop: 2 }} />
          <span>Cột <b>Map KiotViet</b> là branchId đồng bộ từ connector — nguồn: <b>Quản trị › Kết nối › KiotViet POS</b>. Điểm bán mới cần gán branch trước khi đồng bộ tồn. Cột <b>Loại</b> ngược lại là <b>của MedOps</b>: POS không có khái niệm kho tổng, nên chỉ sửa được ở đây.</span>
        </div>
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1220, fontFamily: 'var(--font-body)' }}>
            <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Điểm bán', 'Loại', 'Địa chỉ', 'Map KiotViet', 'Quản lý', 'Giao/tuần (F)', 'LT giao (ngày)', 'Trạng thái'].map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-default)' }}>{i === 3 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{h}<Tip text="branchId đồng bộ từ connector KiotViet (Quản trị › Kết nối). Chỉ đọc — điểm bán mới chưa map sẽ hiện ‘chưa gán’."><span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--dv-ink-faint)', color: 'var(--dv-ink-faint)', fontSize: 9, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>?</span></Tip></span> : i === 1 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{h}<Tip text="Khái niệm của MedOps, không đồng bộ từ POS: KiotViet chỉ có chi nhánh, không có trường phân loại kho. Vòng đồng bộ đoán từ tên lúc tạo điểm bán lần đầu và không ghi đè sau đó — sửa tại đây."><span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--dv-ink-faint)', color: 'var(--dv-ink-faint)', fontSize: 9, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>?</span></Tip></span> : i === 5 ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{h}<Tip text="F & LT của tuyến kho → chi nhánh quyết định cửa sổ Min/Max của cách tính Percentile — Cài đặt chỉ trỏ về đây."><span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--dv-ink-faint)', color: 'var(--dv-ink-faint)', fontSize: 9, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'help' }}>?</span></Tip></span> : h}</th>)}</tr></thead>
            <tbody>
              {rows.map((s) => {
                const wh = s.type === 'wh';
                const g = window.whGuard(rows, s);
                const asking = ask === s.id;
                return (
                <tr key={s.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '12px 16px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 32, height: 32, borderRadius: 8, background: wh ? 'var(--dv-green)' : 'var(--dv-green-50)', color: wh ? '#fff' : 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{wh ? <IconBox size={16} /> : <IconStore size={16} />}</span><div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{s.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{s.id}</div></div></div></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: wh ? 'var(--dv-green-50)' : 'var(--dv-mist)', color: wh ? 'var(--dv-green)' : 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{wh ? 'Kho tổng / DC' : 'Cửa hàng'}</span>
                      {asking ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <button onClick={() => flipType(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'var(--dv-green)', color: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11.5, whiteSpace: 'nowrap' }}><IconCheck size={12} />Xác nhận</button>
                          <button onClick={() => setAsk(null)} style={{ width: 24, height: 24, borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={12} /></button>
                        </span>
                      ) : g.ok ? (
                        <button onClick={() => setAsk(s.id)} title={g.lastOne ? 'Chuỗi sẽ tạm thời không có kho tổng — đây là bước 1 của việc chuyển kho tổng sang điểm bán khác.' : undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: `1px dashed ${g.lastOne ? '#E0A9A2' : 'var(--border-strong)'}`, background: '#fff', cursor: 'pointer', padding: '3px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11.5, color: g.lastOne ? '#9c2b22' : 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{wh ? <IconStore size={12} /> : <IconBox size={12} />}{wh ? 'Bỏ kho tổng' : 'Đặt làm kho tổng'}</button>
                      ) : (
                        <Tip text={g.why}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px dashed var(--border-default)', padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: 'var(--dv-ink-faint)', cursor: 'not-allowed', whiteSpace: 'nowrap' }}>{wh ? <IconStore size={12} /> : <IconBox size={12} />}{wh ? 'Bỏ kho tổng' : 'Đặt làm kho tổng'}</span></Tip>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{s.addr}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: s.kv ? 'var(--dv-ink-soft)' : 'var(--dv-yellow-600)' }}>{s.kv ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--dv-green-bright)' }} />{s.kv}</span> : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontWeight: 600 }}><IconPlug size={13} />chưa gán</span>}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{s.mgr}</td>
                  {/* T20 — F & LT sửa được từng hàng: tham số tuyến giao, không phải tham số SKU */}
                  <td style={{ padding: '12px 16px' }}><input type="number" min={0} max={7} value={s.freq} onChange={(e) => setRows((rs) => rs.map((r) => (r.id === s.id ? { ...r, freq: e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0) } : r)))} aria-label={`Số chuyến giao mỗi tuần — ${s.name}`} style={{ ...mdMono, width: 64, padding: '6px 8px', fontSize: 12.5 }} /></td>
                  <td style={{ padding: '12px 16px' }}><input type="number" min={0.5} max={7} step={0.5} value={s.lt} onChange={(e) => setRows((rs) => rs.map((r) => (r.id === s.id ? { ...r, lt: e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0) } : r)))} aria-label={`Leadtime giao (ngày) — ${s.name}`} style={{ ...mdMono, width: 64, padding: '6px 8px', fontSize: 12.5 }} /></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      {s.status === 'active' ? <window.StatusBadge status="active" label="Hoạt động" /> : <window.StatusBadge status="pending" label="Tạm dừng" />}
                      {askStatus === s.id ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <button onClick={() => flipStatus(s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: s.status === 'active' ? '#C5372C' : 'var(--dv-green)', color: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11.5, whiteSpace: 'nowrap' }}><IconCheck size={12} />Xác nhận</button>
                          <button onClick={() => setAskStatus(null)} style={{ width: 24, height: 24, borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={12} /></button>
                        </span>
                      ) : (
                        <button onClick={() => setAskStatus(s.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px dashed var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '3px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11.5, color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{s.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}</button>
                      )}
                    </div>
                    {askStatus === s.id && s.status === 'active' && <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 5, maxWidth: 250, lineHeight: 1.45 }}>{NETWORK_PAUSE_HINT}</div>}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* [T20] Hai ô lịch giao là thao tác DUY NHẤT trên hàng này không báo gì — đổi loại điểm và
            tạm dừng điểm đều có. Một nút ở chân bảng, chỉ hiện khi có thay đổi: ít hơn N nút trên
            N hàng, và dùng lại đúng khuôn "Lưu mạng lưới" của tab bên cạnh. */}
        {lichDoi.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 14 }}>
            <span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{lichDoi.length} điểm bán đổi lịch giao, chưa lưu</span>
            <Button variant="primary" size="sm" onClick={() => { setLichGoc(rows); setToast(`Đã lưu lịch giao ${lichDoi.length} điểm bán — dự trù tính lại ở vòng recompute kế tiếp.`); }}>Lưu lịch giao</Button>
          </div>
        )}
        <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 9, lineHeight: 1.55 }}>
          Đổi loại điểm bán được ghi vào <b>Nhật ký</b> (<span style={{ fontFamily: 'var(--font-mono)' }}>branch.warehouse.change</span>) và làm <b>hết hạn dự trù</b> đang lưu — số Min/Max tính lại ở vòng recompute kế tiếp. Kho đang <b>tạm dừng</b> không tính vào điều kiện “đúng một kho tổng”. <b>Chuyển</b> kho tổng sang điểm bán khác là hai bước: bỏ kho hiện tại, rồi đặt kho mới.
        </div>
        </>
      )}

      {tab === 'network' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', borderRadius: 14, padding: '13px 18px', marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)' }}>Cho phép luân chuyển ngang CH ↔ CH</div>
              <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 2 }}>Khi bật, cửa hàng có thể là nguồn bù cho cửa hàng khác (không bắt buộc qua kho tổng).</div>
            </div>
            {/* T22 — thẻ CHỈ ĐƯỜNG, không phải đèn báo. Bản trước đeo dấu ✓ và nói "tab này chỉ phản
                chiếu", nhưng không có gì được phản chiếu cả: cờ ở đây là hằng số của bản dựng, nên
                dấu ✓ luôn sáng kể cả khi tenant đã tắt. Bỏ dấu ✓, chỉ nói công tắc nằm ở đâu. */}
            <span title="Bật/tắt ở Cài đặt → Điều chuyển nội bộ. Thẻ này chỉ chỉ đường — nó KHÔNG cho biết công tắc đang bật hay tắt." style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: '#fff', border: '1px solid var(--dv-green-100)', color: 'var(--dv-ink-soft)', fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap', cursor: 'help' }}><IconSettings size={13} />Bật/tắt ở Cài đặt → Điều chuyển nội bộ</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {storeRows.map((store) => {
              const list = sources[store.id] || [];
              /* T26 — điểm TẠM DỪNG là điểm "NGỪNG NHẬN điều chuyển" (NETWORK_PAUSE_HINT). Thẻ ở tab
                 này cấu hình đúng chiều NHẬN, nên với điểm đang dừng nó phải KHOÁ. Khoá chứ không
                 giấu: thứ tự nguồn đã đặt còn nguyên trên màn, kích hoạt lại là dùng tiếp, không
                 phải khai lại — và người xem thấy được vì sao thẻ này không bấm được.
                 Điểm dừng vẫn nằm trong danh sách NGUỒN của thẻ khác (allNames không lọc) — đó là
                 nửa còn lại của cùng một câu, và là chỗ bản trước tự mâu thuẫn. */
              const paused = store.status !== 'active';
              const candidates = paused ? [] : allNames.filter((n) => n !== store.name && !list.includes(n) && (lateral || n === 'Kho tổng (DC)'));
              const stepBtn = (off, extra) => ({ width: 26, height: 26, borderRadius: 7, border: '1px solid var(--border-default)', background: '#fff', cursor: off ? 'default' : 'pointer', opacity: off ? 0.4 : 1, color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...extra });
              return (
                <div key={store.id} style={{ background: paused ? 'var(--dv-mist)' : '#fff', borderRadius: 'var(--radius-card)', border: `1px ${paused ? 'dashed' : 'solid'} var(--border-default)`, boxShadow: paused ? 'none' : 'var(--shadow-sm)', padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: paused ? 'var(--border-default)' : 'var(--dv-green-50)', color: paused ? 'var(--dv-ink-faint)' : 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconStore size={15} /></span>
                    <div style={{ fontWeight: 700, fontSize: 14, color: paused ? 'var(--dv-ink-soft)' : 'var(--dv-ink)' }}>{store.name}</div>
                    {paused && <window.StatusBadge status="pending" label="Tạm dừng" />}
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>Nguồn bù ưu tiên</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, opacity: paused ? 0.55 : 1 }}>
                    {list.map((src, i) => (
                      <div key={src} style={{ display: 'flex', alignItems: 'center', gap: 9, background: paused ? '#fff' : 'var(--dv-mist)', borderRadius: 10, padding: '7px 8px 7px 11px' }}>
                        <span style={{ width: 20, height: 20, borderRadius: 6, background: i === 0 && !paused ? 'var(--dv-yellow)' : 'var(--border-default)', color: i === 0 && !paused ? 'var(--dv-green)' : 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, flex: 'none' }}>{i + 1}</span>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: paused ? 'var(--dv-ink-soft)' : 'var(--dv-ink)' }}>{src}</span>
                        <button onClick={() => move(store.id, i, -1)} disabled={paused || i === 0} style={stepBtn(paused || i === 0)}><IconChevronUp size={14} /></button>
                        <button onClick={() => move(store.id, i, 1)} disabled={paused || i === list.length - 1} style={stepBtn(paused || i === list.length - 1)}><IconChevronDown size={14} /></button>
                        <button onClick={() => remove(store.id, i)} disabled={paused} style={stepBtn(paused, { color: paused ? 'var(--dv-ink-faint)' : '#C5372C' })}><IconX size={14} /></button>
                      </div>
                    ))}
                  </div>
                  {paused ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 11, fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex', flex: 'none', marginTop: 1 }}><IconAlertTriangle size={13} /></span>
                      <span>{NETWORK_PAUSE_HINT} Thứ tự nguồn giữ nguyên; sửa được sau khi kích hoạt điểm ở tab <b>Điểm bán</b>.</span>
                    </div>
                  ) : candidates.length > 0 && (
                    <div style={{ marginTop: 9, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {candidates.map((c) => (
                        <button key={c} onClick={() => add(store.id, c)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: '1px dashed var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--dv-ink-soft)' }}><IconPlus size={12} />{c}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}><Button variant="primary" size="md" onClick={() => setToast('Đã lưu cấu hình mạng lưới nguồn bù.')}>Lưu mạng lưới</Button></div>
        </>
      )}

      {/* T27 — Thêm điểm bán + cấp tồn đầu theo điểm khuôn. NO_TICKET_YET — thuật toán cấp tồn đầu
          chưa có ticket, nút chính chỉ báo lộ trình. Nhập Excel tồn đầu vẫn tắt (DVP-382). */}
      {nsOpen && (
        <Drawer title="Thêm điểm bán" sub="tạo mới · cấp tồn đầu theo điểm khuôn" onClose={() => setNsOpen(false)}
          footer={<>
            <Button variant="secondary" size="md" onClick={() => setNsOpen(false)}>Hủy</Button>
            <Button variant="primary" size="md" onClick={() => setToast('Tính năng đang ở lộ trình — thuật toán cấp tồn đầu cần ticket trước khi nối.')}>Tạo điểm bán</Button>
          </>}>
          <div style={{ marginBottom: 14 }}><label style={mdLbl}>Tên điểm bán</label><input value={nsF.name} onChange={(e) => setNsF((x) => ({ ...x, name: e.target.value }))} placeholder="VD: Dược Vương Q.10" style={mdInp} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div><label style={mdLbl}>Loại</label><select value={nsF.type} onChange={(e) => setNsF((x) => ({ ...x, type: e.target.value }))} style={mdInp}><option value="store">Cửa hàng</option><option value="wh">Kho tổng / DC</option></select></div>
            <div />
          </div>
          <div style={{ marginBottom: 18 }}><label style={mdLbl}>Địa chỉ</label><input value={nsF.addr} onChange={(e) => setNsF((x) => ({ ...x, addr: e.target.value }))} placeholder="Số nhà, đường, quận" style={mdInp} /></div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', margin: '8px 0 12px', paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>Cấp tồn đầu</div>
          <div style={{ marginBottom: 10 }}><label style={mdLbl}>Điểm khuôn (điểm tương tự)</label>
            <select value={nsF.template} onChange={(e) => setNsF((x) => ({ ...x, template: e.target.value }))} style={mdInp}>
              <option value="">— Chọn điểm bán tương tự —</option>
              {storeRows.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div style={{ fontSize: 12, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', borderRadius: 10, padding: '10px 13px', lineHeight: 1.5 }}>Máy đề xuất danh mục + SL từ điểm khuôn → đổ thành chùm phiếu điều chuyển.</div>
          <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 8 }}>Map KiotViet gán sau ở Quản trị › Kết nối. Nhập Excel tồn đầu chưa mở.</div>
        </Drawer>
      )}
    </div>
  );
}
window.StoresNetwork = StoresNetwork;

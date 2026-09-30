/* Pharmacy — hai màn design BẮT KỊP code (DVP-483, 2026-08-16).

   Khác mọi file khác trong thư mục này: hai màn dưới đây TỒN TẠI TRONG CODE TRƯỚC, design chưa
   từng có. Đây là lượt cập nhật ngược, không phải thiết kế mới — nên nhãn, cột, thứ tự sắp xếp
   và câu chữ đều chép theo code. Muốn đổi chỗ nào thì đổi ở code trước, rồi mới sửa ở đây.

   Nguồn đối chiếu:
     · SKU chưa có NCC  → app/(portal)/purchasing/missing-supplier/{page,_table}.tsx  (JET-184)
     · Hồ sơ của tôi    → app/(portal)/profile/page.tsx + components/ChangePasswordForm.tsx (DVP-433)

   Lưu ý RBAC: `/profile` bên code khai `hidden: true` — mở cho MỌI vai trò nhưng KHÔNG chiếm
   dòng sidebar; lối vào là khối người dùng trên topbar. Vì thế nó không có mặt trong `NAV`. */

/* ------------------------------------------------------------- SKU chưa có NCC (worklist) ---- */

/* Sắp sẵn theo đúng luật của `buildMissingSupplierWorklist`: ABC (A→B→C) → `ads` giảm dần → mã
   SKU tăng dần; SKU chưa phân loại (`abc: null` — chưa từng vào engine) xếp SAU hạng C. */
const MISSING_NCC_SEED = [
  { code: 'SP0421', name: 'Rotundin 30mg', abc: 'A', ads: 42, blockingPo: 'PO-2608-011' },
  { code: 'SP0388', name: 'Cetirizin 10mg', abc: 'A', ads: 31, blockingPo: null },
  { code: 'SP0455', name: 'Kem bôi Silkron 10g', abc: 'B', ads: 18, blockingPo: 'PO-2608-014' },
  { code: 'SP0402', name: 'Dung dịch NaCl 0,9% 500ml', abc: 'B', ads: 12, blockingPo: null },
  { code: 'SP0499', name: 'Băng gạc y tế 10x10cm', abc: 'C', ads: 6, blockingPo: null },
  { code: 'SP0510', name: 'Nhiệt kế điện tử Omron', abc: 'C', ads: 3, blockingPo: null },
  { code: 'SP0533', name: 'Men vi sinh Bifina R', abc: null, ads: 0, blockingPo: null },
  { code: 'SP0547', name: 'Túi chườm nóng lạnh', abc: null, ads: 0, blockingPo: null },
  { code: 'SP0561', name: 'Khẩu trang y tế 4 lớp (hộp 50)', abc: null, ads: 0, blockingPo: null },
];

function AbcChip({ abc }) {
  const map = { A: ['var(--dv-green-50)', 'var(--dv-green)'], B: ['var(--dv-yellow-100)', 'var(--dv-yellow-600)'], C: ['var(--dv-mist)', 'var(--dv-ink-soft)'] };
  const [bg, fg] = map[abc] || ['var(--dv-mist)', 'var(--dv-ink-faint)'];
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 26, padding: '3px 8px', borderRadius: 7, background: bg, color: fg, fontSize: 12, fontWeight: 700 }}>{abc || '—'}</span>;
}

/* Ba trạng thái, đúng nhánh của `StatusChip` bên code — thứ tự kiểm cũng giữ nguyên: đang chặn PO
   là tin xấu nhất nên nó thắng trước, kể cả khi SKU đã có hạng ABC. */
function MissNccStatus({ row }) {
  const [label, bg, fg] =
    row.blockingPo ? ['Đang chặn PO', '#F8E0DD', '#C5372C'] :
    row.abc ? ['Chưa cần nhập', 'var(--dv-green-50)', 'var(--dv-green)'] :
    ['Chưa phân loại', 'var(--dv-mist)', 'var(--dv-ink-soft)'];
  return <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 999, background: bg, color: fg, fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</span>;
}

function MissingSupplierScreen({ setView, setToast, role }) {
  const { PageHeader, Toolbar, Table, Th, Td, Tr, EmptyState, Pagination } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconLink, IconUpload, IconDownload } = window;
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const rows = MISSING_NCC_SEED;
  const shown = rows.slice((page - 1) * size, page * size);
  /* Import CSV (`supply_link`) sống ở màn Dữ liệu nền — vai trò hẹp hơn màn này (admin/planning,
     KHÔNG có purchasing). Ẩn CTA nếu vai trò hiện tại bấm vào sẽ bị chặn: nút chết còn tệ hơn
     không có nút. Cùng luật với `canImport` bên code. */
  const canImport = role === 'admin' || role === 'planning';

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader
        title="SKU chưa có NCC"
        subtitle={`${rows.length} SKU (đã loại dịch vụ/bao bì) chưa gắn nhà cung cấp — chưa thể tạo đơn mua/RFQ cho tới khi có NCC.`}
        actions={canImport ? <Button variant="accent" size="md" iconLeft={<IconUpload size={16} />} onClick={() => setView('masterlists')}>Import NCC (CSV)</Button> : null} />

      <Toolbar>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'var(--dv-ink-soft)', maxWidth: '68ch' }}>
          <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', flex: 'none' }}><IconLink size={16} /></span>
          Lấy toàn bộ SKU mua được, không chỉ SKU đang cần nhập — mục tiêu là dọn sạch dữ liệu nền.
        </span>
        <span style={{ marginLeft: 'auto' }}>
          <Button variant="secondary" size="sm" iconLeft={<IconDownload size={15} />} onClick={() => setToast('Đã xuất CSV toàn bộ danh sách — không chỉ trang đang xem.')}>Xuất CSV</Button>
        </span>
      </Toolbar>

      <Table minWidth={760}>
        <thead>
          <tr>
            <Th width={120}>Mã SKU</Th>
            <Th>Tên</Th>
            <Th width={80}>ABC</Th>
            <Th align="right" width={130}>Bán TB/ngày</Th>
            <Th width={150}>Trạng thái</Th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <Tr key={r.code} highlight={!!r.blockingPo}>
              <Td mono strong nowrap>{r.code}</Td>
              <Td>{r.name}</Td>
              <Td><AbcChip abc={r.abc} /></Td>
              <Td align="right" mono>{r.ads}</Td>
              <Td><MissNccStatus row={r} /></Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {rows.length === 0 && <EmptyState icon="IconCheckCircle" title="Mọi SKU đều đã có NCC" hint="Không còn dòng nào cần dọn — danh sách này rỗng là trạng thái tốt." />}

      <div style={{ marginTop: 14 }}>
        <Pagination page={page} size={size} total={rows.length} onPage={setPage} onSize={(s) => { setSize(s); setPage(1); }} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- Hồ sơ của tôi --------- */

function ProfileScreen({ role, setToast, setView }) {
  const { PageHeader, ROLES } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const [cur, setCur] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  const card = { background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' };
  const cardHead = { padding: '14px 18px', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14.5, color: 'var(--dv-green)' };
  const row = { display: 'flex', fontSize: 13.5, padding: '9px 0', borderBottom: '1px solid var(--border-default)' };
  const keyCol = { color: 'var(--dv-ink-faint)', width: 150, flex: 'none' };
  const valCol = { fontWeight: 600, color: 'var(--dv-ink)' };
  const label = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--dv-ink-soft)', marginBottom: 14 };
  const input = { padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-default)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', color: 'var(--dv-ink)' };

  const submit = (e) => {
    e.preventDefault();
    if (mismatch || !cur || !next) return;
    setCur(''); setNext(''); setConfirm('');
    setToast('Đã đổi mật khẩu — các thiết bị khác đã bị đăng xuất.');
  };

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="Hồ sơ của tôi" subtitle="Thông tin tài khoản và mật khẩu đăng nhập." />

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'start' }}>
        <div style={card}>
          <div style={cardHead}>Tài khoản</div>
          <div style={{ padding: '4px 18px 18px' }}>
            <div style={row}><span style={keyCol}>Tên hiển thị</span><span style={valCol}>Nguyễn Văn Bình</span></div>
            <div style={{ ...row, borderBottom: 'none' }}><span style={keyCol}>Vai trò</span><span style={valCol}>{ROLES[role] || role}</span></div>
            {/* Cố ý KHÔNG có ô sửa tên ở đây: đổi tên là việc của admin ở màn Người dùng — không
                mở đường thứ hai cho cùng một phép ghi (DVP-278). */}
            <p style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', margin: '12px 0 0', lineHeight: 1.6 }}>
              Cần đổi tên hiển thị hoặc vai trò? Quản trị viên của nhà thuốc làm việc đó ở màn{' '}
              <button onClick={() => setView('users')} style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 12.5, fontFamily: 'var(--font-body)' }}>Người dùng &amp; phân quyền</button>.
            </p>
          </div>
        </div>

        <div style={card}>
          <div style={cardHead}>Đổi mật khẩu</div>
          <form onSubmit={submit} style={{ padding: 18 }}>
            <label style={label}>Mật khẩu hiện tại<input type="password" value={cur} onChange={(e) => setCur(e.target.value)} style={input} /></label>
            <label style={label}>Mật khẩu mới<input type="password" value={next} onChange={(e) => setNext(e.target.value)} style={input} /></label>
            <label style={label}>
              Nhập lại mật khẩu mới
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ ...input, borderColor: mismatch ? '#C5372C' : 'var(--border-default)' }} />
              {mismatch && <span style={{ fontSize: 12.5, color: '#C5372C', fontWeight: 500 }}>Hai ô chưa khớp nhau.</span>}
            </label>
            <Button variant="primary" size="md" type="submit">Đổi mật khẩu</Button>
            <p style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', margin: '12px 0 0', lineHeight: 1.6 }}>
              Đổi mật khẩu sẽ đăng xuất mọi thiết bị khác đang dùng tài khoản này; thiết bị hiện tại vẫn giữ nguyên.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MISSING_NCC_SEED, MissingSupplierScreen, ProfileScreen });

/* Pharmacy — DANH MỤC (2.1): màn ProductMaster. Tách khỏi `MasterData.jsx` 2026-09-07;
   nạp SAU nó (dùng PRODUCTS · MD_FILTER_FIELDS · ProductDrawer khai ở tệp đó). */

function ProductMaster({ setToast }) {
  const { PageHeader, SearchBox, Toolbar, GhostBtn, NUM, VND } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconBox, IconEdit, IconFilter, IconPlus, IconBarcode, IconAlertTriangle, IconTag, IconCheck, IconX } = window;
  const [tab, setTab] = React.useState('list'); // DVP-382 #1: tab 'abcxyz' đã gỡ — engine không tính XYZ
  const [q, setQ] = React.useState(() => { const v = window.__productQuery || ''; window.__productQuery = null; return v; });
  const [bar, setBar] = React.useState({ abc: [], ven: [], xyz: [], shape: [], cat: [], rx: [], control: [], lifecycle: [] });
  const [added, setAdded] = React.useState([]); // khoá vừa thêm, chưa điền — chỉ sống trong phiên
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  const [sel, setSel] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  // T02 — gán VEN cả lô: chọn nhiều SKU rồi gán một lần (mirror thanh chọn ở Tồn kho)
  const [mdSel, setMdSel] = React.useState(() => new Set());
  const [venPick, setVenPick] = React.useState(false);
  // T02 — giá trị VEN đang CHỜ XÁC NHẬN (null = chưa chọn gì; '' là một giá trị hợp lệ: "Bỏ gán").
  const [venAsk, setVenAsk] = React.useState(null);
  // "Chọn tất cả" của đầu bảng chỉ phủ TRANG. mdAllHits = đã bung ra toàn bộ kết quả đang lọc.
  const [mdAllHits, setMdAllHits] = React.useState(false);
  const mdCb = { width: 17, height: 17, accentColor: 'var(--dv-green)', cursor: 'pointer', flex: 'none' };
  const mdToggle = (sku) => { setMdAllHits(false); setMdSel((s) => { const n = new Set(s); n.has(sku) ? n.delete(sku) : n.add(sku); return n; }); };
  const mdClearSel = () => { setMdSel(new Set()); setMdAllHits(false); setVenPick(false); setVenAsk(null); };
  /* [T02] VEN vừa gán trong phiên. Trước đây nút "Xác nhận" chỉ bắn một thông báo rồi bỏ chọn:
     cột VEN đứng im, chip độ phủ đứng im — người dùng gán xong không có cách nào biết nó đã ăn.
     `''` là một giá trị HỢP LỆ ("Bỏ gán"), nên phải phân biệt với `undefined` (chưa đụng tới). */
  const [venLocal, setVenLocal] = React.useState({});
  const venOf = (p) => (venLocal[p.sku] !== undefined ? (venLocal[p.sku] || null) : mdVenOf(p));
  // Deep-link: mở sẵn hồ sơ SKU khi điều hướng từ nơi khác (vd “gán NCC” ở Đề xuất mua)
  React.useEffect(() => {
    const fsku = window.__focusSku; window.__focusSku = null;
    if (fsku) { const p = PRODUCTS.find((x) => x.sku === fsku); if (p) setSel(p); }
  }, []);

  const has = (k, v) => bar[k].length === 0 || bar[k].includes(v == null ? 'none' : v);
  const rows = PRODUCTS.filter((p) =>
    has('abc', p.abc) && has('ven', venOf(p)) && has('xyz', p.xyz) && has('shape', p.shape) &&
    (bar.cat.length === 0 || bar.cat.includes(p.group)) &&
    has('rx', p.type) && (bar.control.length === 0 || bar.control.includes(window.ctrlOf(p))) &&
    (bar.lifecycle.length === 0 || bar.lifecycle.includes(p.lifecycle || 'dang_ban')) &&
    (p.name + p.sku + p.barcode + p.ncc).toLowerCase().includes(q.toLowerCase()));

  /* Vòng ba nấc: tăng → giảm → VỀ MẶC ĐỊNH (theo mã). Nấc thứ ba không phải trang trí — không có
     nó thì bảng không bao giờ quay lại được thứ tự gốc. Thiếu giá trị xuống CUỐI ở cả hai chiều,
     khớp NULLS LAST của bản SQL: để mặc định thì bấm "giảm dần" trên XYZ được một trang toàn ô
     trống, tức cột trả lời "không có gì" đúng lúc người ta đi tìm cái có. */
  const SORTABLE = { name: (p) => p.name, group: (p) => p.group, abc: (p) => p.abc, ven: (p) => venOf(p), xyz: (p) => p.xyz, rx: (p) => (p.type === 'rx' ? 1 : 0) };
  const clickSort = (k) => setSort((s) => (s.key !== k ? { key: k, dir: 'asc' } : s.dir === 'asc' ? { key: k, dir: 'desc' } : { key: null, dir: 'asc' }));
  const sorted = React.useMemo(() => {
    if (!sort.key) return [...rows].sort((a, b) => a.sku.localeCompare(b.sku));
    const of = SORTABLE[sort.key]; const sign = sort.dir === 'desc' ? -1 : 1;
    return [...rows].sort((a, b) => {
      const va = of(a), vb = of(b);
      if (va == null && vb == null) return a.sku.localeCompare(b.sku);
      if (va == null) return 1;
      if (vb == null) return -1;
      const c = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'vi');
      return c !== 0 ? sign * c : a.sku.localeCompare(b.sku); // hoà ⇒ rơi về mã, để phân trang tất định
    });
  }, [rows, sort]);
  // Đổi bộ lọc ⇒ câu "toàn bộ kết quả đang lọc" đang nói về một tập KHÁC; hạ cờ (giữ nguyên SKU đã chọn).
  React.useEffect(() => { setPage(1); setMdAllHits(false); setVenAsk(null); }, [q, bar, sort]);
  const pageRows = sorted.slice((page - 1) * size, page * size);
  const mdAllOn = pageRows.length > 0 && pageRows.every((p) => mdSel.has(p.sku));
  /* T02 — số lượng cho thao tác cả lô. NO_TICKET_YET: ở bản thật, "chọn hết kết quả đang lọc" KHÔNG
     được gửi 5.030 id lên — endpoint gán VEN cả lô phải nhận chính BỘ LỌC (cùng vị ngữ bảng đang
     dùng) rồi tự đếm ở server; danh sách id chỉ dành cho ca chọn tay. Fixture ở đây nhỏ nên vẫn liệt
     kê được từng mã — đó là giới hạn của prototype, không phải hình dạng của API. */
  const mdCount = mdAllHits ? rows.length : mdSel.size;
  const mdCanExpand = mdAllOn && !mdAllHits && rows.length > pageRows.length;
  const mdSelectAllHits = () => { setMdSel(new Set(sorted.map((p) => p.sku))); setMdAllHits(true); setVenAsk(null); };
  const mdSelectPageOnly = () => { setMdSel(new Set(pageRows.map((p) => p.sku))); setMdAllHits(false); setVenAsk(null); };

  const shown = MD_FILTER_FIELDS.filter((f) => mdColOn(f.key) && (bar[f.key].length > 0 || added.includes(f.key)));
  const hidden = MD_FILTER_FIELDS.filter((f) => !shown.includes(f)).map((f) => f.key);
  const activeCount = MD_FILTER_FIELDS.filter((f) => bar[f.key].length > 0).length;

  // Cột nào sắp được thì tiêu đề mang mũi tên; cột hằng số thì KHÔNG — xem chú thích đầu khối.
  // T03/T04 — VEN · XYZ · Hình dạng ẩn theo cờ tenant (mdColOn); căn phải theo TÊN cột, không theo chỉ số.
  const HEAD = [
    ['Sản phẩm', 'name'], ['Nhóm', 'group'], ['Loại', 'rx'], ['Bảo quản', null], ['Quy cách', null],
    ['NCC mặc định', null], ['ABC', 'abc'],
    ...(mdColOn('ven') ? [['VEN', 'ven']] : []),
    ...(mdColOn('xyz') ? [['XYZ', 'xyz']] : []),
    ...(mdColOn('shape') ? [['Hình dạng', null, 'Trục chọn công thức là ĐỘ THƯA (máy đo); XYZ chỉ là chỉ báo đệm.']] : []),
    ['min/max (KV)', null], ['Leadtime', null], ['MOQ', null], ['Giá bán', null], ['', null],
  ];

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1320, margin: '0 auto' }}>
      <PageHeader title="Danh mục sản phẩm" subtitle="Hồ sơ đầy đủ cho từng SKU — nguồn dữ liệu chính cho engine dự trù. min/max đồng bộ từ KiotViet (chỉ đọc); Min/Max do portal tính."
        actions={<span style={{ display: 'inline-flex', gap: 10, alignItems: 'center' }}>
          {/* DVP-516 — KHÔNG có cột ABC ở đây. Hồ sơ sản phẩm vừa đóng đường khai tay hạng ABC (engine
              xếp ở kho tổng, tính lại mỗi lượt đồng bộ); để cột đó trong file mẫu là mở lại đúng đường
              vừa đóng, bằng lối rộng hơn — một file Excel ghi đè cả danh mục. */}
          <window.ExportImportBar label="Danh mục sản phẩm" columns={['SKU', 'Tên', 'ĐVT', 'Quy cách', 'Nhóm', 'Loại', 'Bảo quản', 'NCC mặc định', 'Giá bán']}
            exportRows={() => PRODUCTS.map((p) => [p.sku, p.name, p.unit, p.pack, p.group, p.type, p.storage, p.ncc, p.price])}
            sampleRows={[
              { cells: ['SP0512', 'Cetirizin 10mg', 'Hộp', 'Hộp 10 vỉ', 'Thuốc · Kháng dị ứng', 'otc', 'thuong', 'Traphaco', '900'] },
              { cells: ['SP0513', 'Vitamin D3 1000IU', 'Lọ', 'Lọ 60 viên', 'TPCN · Vitamin & khoáng', 'otc', 'thuong', 'Dược Hậu Giang', '2400'] },
              { cells: ['SP0514', 'Atorvastatin 20mg', 'Hộp', 'Hộp 30 viên', 'Thuốc · Tim mạch', 'rx', 'thuong', 'NCC chưa có', '3200'], _warn: 'NCC không khớp danh bạ', _warnCol: 7 },
            ]} setToast={setToast} />
          {/* T05 — SKU mới KHÔNG mặc định hạng B: để trống tới khi engine xếp hạng (DVP-516) */}
          <Button variant="accent" size="md" iconRight={<IconPlus size={16} />} onClick={() => setSel({ _new: true, sku: '', name: '', unit: 'Hộp', conv: '', pack: '', group: '', type: 'otc', country: 'Việt Nam', reg: '', barcode: '', storage: 'thuong', ncc: '', abc: '', safety: '', kvMin: 0, kvMax: 0, price: 0 })}>Thêm SKU</Button>
        </span>} />

      {tab === 'list' && (
        <>
          <Toolbar>
            <SearchBox value={q} onChange={setQ} placeholder="Tìm theo tên, mã, barcode, NCC…" width={300} />
            {shown.map((f) => (
              <MdChip key={f.key} field={f} value={bar[f.key]}
                onChange={(v) => { setBar((b) => ({ ...b, [f.key]: v })); setAdded((a) => a.filter((x) => x !== f.key)); }}
                onRemove={() => { setBar((b) => ({ ...b, [f.key]: [] })); setAdded((a) => a.filter((x) => x !== f.key)); }} />
            ))}
            <MdAddFilter hidden={hidden} onAdd={(k) => setAdded((a) => (a.includes(k) ? a : [...a, k]))} />
            {activeCount > 0 && (
              <button onClick={() => { setBar({ abc: [], ven: [], xyz: [], shape: [], cat: [], rx: [], control: [], lifecycle: [] }); setAdded([]); }} style={{ padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--dv-ink-soft)', textDecoration: 'underline' }}>Xoá {activeCount} bộ lọc</button>
            )}
          </Toolbar>
          {/* Dòng tổng kết: con số cho biết HÌNH DẠNG vấn đề trước khi bấm vào đâu cả. */}
          <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', margin: '0 0 12px' }}>
            {NUM ? NUM(rows.length) : rows.length} SKU{activeCount > 0 ? ` khớp ${activeCount} điều kiện` : ''}
            {sort.key && <span> · sắp theo <b style={{ color: 'var(--dv-ink)' }}>{(HEAD.find(([, k]) => k === sort.key) || [''])[0]}</b> {sort.dir === 'asc' ? 'tăng dần' : 'giảm dần'}</span>}
            {/* [T02] ĐÃ GỠ chip độ phủ VEN (Jet chốt 2026-08-30). Nó nói lại bằng phân số đúng thứ
                mà CỘT VEN ngay bên dưới đã nói theo từng dòng, kèm nguồn suy. Bản cũ tệ hơn nữa:
                chuỗi gõ cứng "612/5.030" đứng cạnh một con số đếm thật.
                [Quan sát — Dược Vương, nguồn/ngày chưa xác định] con số cũ là 612/5.030. Số đo prod
                gần nhất ngược hẳn: đã gán 0/13.128 (duoc-vuong) · 0/9.549 (relife), đo 2026-08-20
                qua `lib/views/ven.ts`. Giữ ở đây làm xuất xứ, không hiện lên màn. */}
          </div>

          {/* T10 — chế độ dự trù per-SKU (DVP-577). Panel theo BỘ LỌC: hai nút áp cho cả tập lọc,
              ô số cố định chỉ mở khi bộ lọc còn đúng một mã. Xem src/pharmacy/PlanMode.jsx. */}
          <window.PlanModePanel rows={rows} setToast={setToast} />

          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1560, fontFamily: 'var(--font-body)' }}>
              <thead><tr style={{ background: 'var(--dv-mist)' }}>
                <th style={{ width: 30, padding: '11px 6px 11px 16px', borderBottom: '1px solid var(--border-default)' }}><input type="checkbox" checked={mdAllOn} onChange={() => { setMdAllHits(false); setVenAsk(null); setMdSel(() => (mdAllOn ? new Set() : new Set(pageRows.map((p) => p.sku)))); }} title="Chọn tất cả SKU trong TRANG này. Muốn cả bộ lọc thì bung tiếp ở thanh chọn bên dưới." aria-label="Chọn tất cả SKU trong trang" style={mdCb} /></th>
                {HEAD.map(([h, k, tip], i) => {
                  const on = k && sort.key === k;
                  const align = ['min/max (KV)', 'Leadtime', 'MOQ', 'Giá bán'].includes(h) ? 'right' : 'left';
                  const base = { textAlign: align, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-default)' };
                  if (!k) return <th key={i} title={tip} style={{ ...base, padding: '11px 16px', color: 'var(--dv-ink-soft)', cursor: tip ? 'help' : undefined }}>{h}</th>;
                  return (
                    <th key={i} style={{ ...base, padding: 0 }}>
                      <button onClick={() => clickSort(k)} title={on ? (sort.dir === 'asc' ? 'Đang tăng dần — bấm để giảm dần' : 'Đang giảm dần — bấm để về thứ tự mặc định') : `Sắp theo ${h}`}
                        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', gap: 4, padding: '11px 16px', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>
                        {h}<span style={{ opacity: on ? 1 : 0.3, fontSize: 10 }}>{on && sort.dir === 'desc' ? '▼' : '▲'}</span>
                      </button>
                    </th>
                  );
                })}
              </tr></thead>
              <tbody>
                {pageRows.map((p) => { const _sl = PRODUCT_SUPPLIERS[p.sku] || []; const _ds = _sl.find((x) => x.default) || _sl[0]; const _ven = venOf(p); return (
                  <tr key={p.sku} style={{ borderTop: '1px solid var(--border-default)', cursor: 'pointer' }} onClick={() => setSel(p)}>
                    <td style={{ padding: '12px 6px 12px 16px' }} onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={mdSel.has(p.sku)} onChange={() => mdToggle(p.sku)} aria-label={`Chọn ${p.sku}`} style={mdCb} /></td>
                    <td style={{ padding: '12px 16px' }}><div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{p.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{p.sku} · {p.barcode}</div></td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--dv-ink-soft)', maxWidth: 180 }}>{p.group.split(' · ').slice(1).join(' · ')}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}><TypeBadge k={p.type} /><ControlBadge k={window.ctrlOf(p)} />{p.lifecycle === 'ngung_dat' && <span title="Engine không đề xuất MUA mã này nữa. Tồn còn lại vẫn bán, vẫn điều chuyển được giữa các điểm, và hạn dùng vẫn theo dõi." style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 999, background: 'var(--dv-yellow-100)', color: 'var(--dv-yellow-600)', fontWeight: 700, fontSize: 10.5, whiteSpace: 'nowrap' }}>Ngừng đặt</span>}</span></td>
                    <td style={{ padding: '12px 16px' }}><StorageBadge k={p.storage} /></td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{p.pack}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: p.ncc ? 'var(--dv-ink)' : 'var(--dv-ink-faint)' }}>{p.ncc || <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--dv-yellow-600)', fontWeight: 700, fontSize: 12 }}><IconAlertTriangle size={13} />Chưa gắn NCC</span>}</td>
                    <td style={{ padding: '12px 16px' }}><span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}><AbcChip c={p.abc} /></span></td>
                    {mdColOn('ven') && <td style={{ padding: '12px 16px' }}>{_ven ? <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: 'var(--dv-ink-soft)' }}>{_ven}</span> : <span style={{ color: 'var(--dv-ink-faint)' }}>—</span>}</td>}
                    {mdColOn('xyz') && <td style={{ padding: '12px 16px' }}>{p.xyz ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{p.xyz}</span> : <span style={{ color: 'var(--dv-ink-faint)' }}>—</span>}</td>}
                    {mdColOn('shape') && <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>{p.shape ? <span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{MD_SHAPE_LABEL[p.shape]}</span> : <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Chưa đủ dữ liệu</span>}</td>}
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{p.kvMin}/{p.kvMax}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }} title={_ds ? `Leadtime NCC mặc định: ${_ds.leadtime} ngày` : 'Chưa có NCC mặc định'}>{_ds ? _ds.leadtime + 'n' : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }} title={_ds ? `Số lượng đặt tối thiểu (NCC mặc định)` : ''}>{_ds ? _ds.moq : '—'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>{VND(p.price)}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}><span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconEdit size={16} /></span></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
          <window.Pagination page={page} size={size} total={rows.length} onPage={setPage} onSize={setSize} />

          {/* T02 — thanh chọn dính đáy (mirror Tồn kho): gán VEN một lần cho cả lô SKU đang chọn.
              Hai thứ khác bản trước:
              (1) BUNG ĐƯỢC ra toàn bộ kết quả đang lọc. "Chọn tất cả" ở đầu bảng chỉ phủ 10 hàng
                  của TRANG, nên gán VEN cho 5.030 mã theo lối đó là ~503 lượt lặp tay.
              (2) Gán VEN có XÁC NHẬN HAI BƯỚC. Đây là thao tác nặng tay nhất màn này — đổi phân
                  hạng hàng loạt, không có Hoàn tác — trong khi hai việc nhẹ hơn ở tab Điểm bán
                  (đổi loại điểm, tạm dừng điểm) đều đã hỏi lại. Nặng hơn mà hỏi ít hơn là ngược. */}
          {mdSel.size > 0 && (
            <div style={{ position: 'sticky', bottom: 18, marginTop: 16, zIndex: 30, display: 'flex', alignItems: 'center', gap: 14, background: 'var(--dv-green-900)', color: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-lg)', padding: '13px 18px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 14 }}>
                <span style={{ minWidth: 26, height: 26, padding: '0 7px', borderRadius: 999, background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13 }}>{NUM ? NUM(mdCount) : mdCount}</span>
                SKU đã chọn
              </span>
              {mdCanExpand && (
                <button onClick={mdSelectAllHits} title="Đang chọn hết SKU của trang này. Bung ra toàn bộ SKU khớp bộ lọc hiện tại, không chỉ trang đang xem." style={{ border: '1px solid rgba(255,255,255,.35)', background: 'transparent', color: '#fff', cursor: 'pointer', padding: '6px 13px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, whiteSpace: 'nowrap' }}>Chọn hết {NUM ? NUM(rows.length) : rows.length} kết quả đang lọc</button>
              )}
              {mdAllHits && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'rgba(255,255,255,.82)', flexWrap: 'wrap' }}>
                  Toàn bộ kết quả đang lọc
                  <button onClick={mdSelectPageOnly} style={{ border: 'none', background: 'transparent', color: '#fff', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 700, textDecoration: 'underline' }}>chỉ chọn trang này</button>
                </span>
              )}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 9, alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={mdClearSel} style={{ border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>Bỏ chọn</button>
                {mdColOn('ven') && (venAsk === null ? (
                  <span style={{ position: 'relative', display: 'inline-block' }}>
                    <button onClick={() => setVenPick((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', background: 'var(--dv-yellow)', color: 'var(--dv-green)', cursor: 'pointer', padding: '9px 17px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5 }}><IconTag size={15} />Gán VEN cho {NUM ? NUM(mdCount) : mdCount} SKU đang chọn</button>
                    {venPick && (
                      <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', right: 0, zIndex: 40, minWidth: 200, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 10, boxShadow: 'var(--shadow-lg)', padding: 6 }}>
                        {MD_VEN_OPTS.map(([v, t]) => (
                          <button key={t} onClick={() => { setVenAsk(v); setVenPick(false); }} style={{ width: '100%', textAlign: 'left', padding: '7px 10px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: v ? 700 : 500, color: v ? 'var(--dv-ink)' : 'var(--dv-ink-soft)' }}>{t}</button>
                        ))}
                      </div>
                    )}
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.28)', borderRadius: 999, padding: '5px 6px 5px 14px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{venAsk ? `Gán ${mdVenLabel(venAsk)}` : 'Bỏ gán VEN'} cho {NUM ? NUM(mdCount) : mdCount} SKU?</span>
                    {/* [T02] Áp thẳng vào dữ liệu rồi mới báo — cùng khuôn `flipStatus` của tab Điểm bán. */}
                    <button onClick={() => { const n = NUM ? NUM(mdCount) : mdCount; const skus = mdAllHits ? rows.map((p) => p.sku) : [...mdSel]; setVenLocal((v) => { const nx = { ...v }; skus.forEach((k) => { nx[k] = venAsk || ''; }); return nx; }); setToast(venAsk ? `Đã gán VEN ${venAsk} cho ${n} SKU.` : `Đã bỏ gán VEN cho ${n} SKU.`); mdClearSel(); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'var(--dv-yellow)', color: 'var(--dv-green)', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13 }}><IconCheck size={14} />Xác nhận</button>
                    <button onClick={() => setVenAsk(null)} title="Huỷ — giữ nguyên các SKU đang chọn" style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid rgba(255,255,255,.28)', background: 'transparent', cursor: 'pointer', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconX size={13} /></button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {sel && <ProductDrawer p={sel} onClose={() => setSel(null)} setToast={setToast} />}
    </div>
  );
}
window.ProductMaster = ProductMaster;


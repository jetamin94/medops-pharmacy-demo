/* Pharmacy — Receiving / GRN with 3-way match (full fidelity). */

function MatchFlag({ match }) {
  const map = {
    matched: { label: 'Khớp', bg: '#D6ECE5', fg: '#00533F', ic: 'IconCheck' },
    short: { label: 'Thiếu hàng', bg: '#F8E0DD', fg: '#9c2b22', ic: 'IconAlertTriangle' },
    over: { label: 'Dư hàng', bg: '#FFF1CF', fg: '#8a6a00', ic: 'IconAlertTriangle' },
    price: { label: 'Lệch giá', bg: '#FFF1CF', fg: '#8a6a00', ic: 'IconAlertTriangle' },
  };
  const m = map[match] || map.matched;
  const Icon = window[m.ic];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: m.bg, color: m.fg, fontWeight: 700, fontSize: 12 }}><Icon size={13} />{m.label}</span>;
}

/* DVP-332: điểm vào "Tạo phiếu nhận" từ PO ĐÃ DUYỆT — trước đây màn nhận hàng không có đường tạo phiếu,
   chỉ chờ lô tự xuất hiện. Nguồn PO: approvals kind='buy' đã duyệt & gửi (state='sent') và chưa có GRN. */
function CreateGRNPicker({ onClose, setToast }) {
  const { VND, IconX, IconCart } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const st = window.OpsStore.use();
  const used = new Set(st.shipments.map((s) => s.po));
  const pos = st.approvals.filter((a) => a.kind === 'buy' && a.state === 'sent' && !used.has(a.id));
  const [sel, setSel] = React.useState(null);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,20,14,.42)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-lg)', width: 'min(620px, 100%)', maxHeight: '84vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ flex: 1 }}><div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)' }}>Tạo phiếu nhận từ đơn mua</div><div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 3 }}>Chỉ đơn đã duyệt &amp; gửi NCC mới nhận hàng được.</div></div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconX size={20} /></button>
        </div>
        <div style={{ padding: 18 }}>
          {pos.length === 0
            ? <window.EmptyState icon="IconCart" title="Chưa có đơn mua nào chờ nhận" hint="Đơn phải được duyệt và gửi NCC ở màn Chờ duyệt thì mới tạo được phiếu nhận. Đơn đã tạo phiếu nhận rồi cũng không hiện lại ở đây." />
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {pos.map((p) => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${sel === p.id ? 'var(--dv-green)' : 'var(--border-default)'}`, background: sel === p.id ? 'var(--dv-green-50)' : '#fff', borderRadius: 12, padding: '12px 14px', cursor: 'pointer' }}>
                    <input type="radio" name="po" checked={sel === p.id} onChange={() => setSel(p.id)} style={{ width: 17, height: 17, accentColor: 'var(--dv-green)' }} />
                    <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconCart size={16} /></span>
                    <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 13.5 }}>{p.ncc}</span><span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{p.id} · {p.lines} dòng</span></span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{VND(p.value)}</span>
                  </label>
                ))}
              </div>}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '14px 22px', borderTop: '1px solid var(--border-default)', background: '#fafbfb' }}>
          <Button variant="secondary" size="md" onClick={onClose}>Hủy</Button>
          <Button variant="primary" size="md" disabled={!sel} onClick={() => {
            const p = pos.find((x) => x.id === sel); if (!p) return;
            const id = 'GRN-2406-' + (32 + st.shipments.filter((s) => s.id.startsWith('GRN-2406')).length);
            window.OpsStore.set((s2) => ({ shipments: [{ id, po: p.id, ncc: p.ncc, eta: 'Chờ giao', lines: p.lines, carrier: '—', tracking: '—', status: 'pending' }, ...s2.shipments] }));
            setToast(`Đã tạo phiếu nhận ${id} từ ${p.id} — mở phiếu để nhập số lô, HSD và đối chiếu 3 chiều.`);
            onClose();
          }}>Tạo phiếu nhận</Button>
        </div>
      </div>
    </div>
  );
}

/* Tra cứu lô & HSD KHÔNG còn ở màn này.
   Trước đây màn Nhận hàng có một khối tìm-lô riêng, vì lúc đó không đâu tra được số lô. Nay màn
   Cận hạn / FEFO đã tìm được theo số lô (nó vốn đã có cột "Lô" và toàn bộ sổ lô, chỉ thiếu vế tìm —
   DVP-507). Giữ hai chỗ tra cho cùng một việc là dựng hai nguồn sự thật, và cái ở đây còn hẹp hơn:
   nó chỉ nhìn thấy các phiếu nhập gần đây. Nên còn lại một con trỏ, không phải bản sao. */
function LotLookupPointer({ setView }) {
  const { IconHourglass, IconArrowRight } = window;
  return (
    <section style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 13, background: 'var(--dv-mist)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', padding: '14px 18px', flexWrap: 'wrap' }}>
      <span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconHourglass size={18} /></span>
      <span style={{ flex: '1 1 320px', minWidth: 0, fontSize: 13, color: 'var(--dv-ink)' }}>
        <b>Cần tra một số lô cụ thể?</b> — lô đó đang ở điểm bán nào, còn bao nhiêu ngày hạn: tra ở màn <b>Cận hạn / FEFO</b>, nơi có toàn bộ sổ lô chứ không chỉ các phiếu nhập gần đây.
      </span>
      <button onClick={() => setView && setView('expiry')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' }}>
        Mở Cận hạn / FEFO <IconArrowRight size={14} />
      </button>
    </section>
  );
}

function ReceivingList({ onOpen, setToast, setView }) {
  const { PageHeader, StatusBadge, Table, Th, Td, Tr } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconTruck, IconChevronRight, IconPlus } = window;
  const SHIPMENTS = window.OpsStore.use().shipments;
  const [picker, setPicker] = React.useState(false);
  return (
    <>
      {picker && <CreateGRNPicker onClose={() => setPicker(false)} setToast={setToast} />}
      <PageHeader title="Nhận hàng (GRN)" subtitle="Lô hàng đang về và nhập kho — đối chiếu 3 chiều giữa đơn mua, phiếu giao và hóa đơn."
        actions={<Button variant="accent" size="md" iconRight={<IconPlus size={16} />} onClick={() => setPicker(true)}>Tạo phiếu nhận</Button>} />
      <Table minWidth={820}>
        <thead><tr><Th>Phiếu GRN</Th><Th>Đơn mua</Th><Th>Nhà cung cấp</Th><Th>Vận chuyển</Th><Th align="center">Số dòng</Th><Th>Dự kiến</Th><Th>Trạng thái</Th><Th align="right"></Th></tr></thead>
        <tbody>
          {SHIPMENTS.map((s) => (
            <Tr key={s.id} onClick={() => onOpen(s)}>
              <Td strong color="var(--dv-green)"><span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconTruck size={15} /></span>{s.id}{s.fromSupplier && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-yellow)', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap' }}>Từ cổng NCC</span>}</span></Td>
              <Td mono color="var(--dv-ink-soft)">{s.po}</Td>
              <Td>{s.ncc}</Td>
              <Td mono color="var(--dv-ink-soft)">{s.carrier} · {s.tracking}</Td>
              <Td align="center" mono>{s.lines}</Td>
              <Td color="var(--dv-ink-soft)">{s.eta}</Td>
              <Td><StatusBadge status={s.status === 'pending' ? 'pending' : s.status} label={s.status === 'pending' ? 'Chờ nhập' : undefined} /></Td>
              <Td align="right"><span style={{ color: 'var(--dv-ink-faint)' }}><IconChevronRight size={18} /></span></Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      <LotLookupPointer setView={setView} />
    </>
  );
}

function GRNEntry({ shipment, onBack, setToast }) {
  const { GRN_DETAIL, VND, NUM } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconChevronLeft, IconPackage, IconAlertTriangle, IconCheckCircle } = window;
  const d = GRN_DETAIL;
  const [lines, setLines] = React.useState(() => d.lines.map((l) => ({ ...l, received: l.received })));
  const [posted, setPosted] = React.useState(false);
  const [shortMode, setShortMode] = React.useState('wait'); // wait = còn chờ NCC giao tiếp · close = đóng đơn
  const [einvNo, setEinvNo] = React.useState('');
  const [einvDate, setEinvDate] = React.useState('');
  /* DVP-332: quyết định THEO TỪNG DÒNG lệch — trước đây chỉ có một công tắc chung cho cả phiếu,
     không nói được "dòng này chấp nhận, dòng kia là hàng tặng, dòng nọ loại ra". */
  const [dec, setDec] = React.useState({});
  const DECISIONS = [
    ['accept', 'Chấp nhận', 'Nhập kho theo số thực nhận, tính tiền bình thường.'],
    ['free', 'Hàng tặng', 'Nhập kho nhưng không tính tiền — hàng khuyến mãi / giao bù.'],
    ['reject', 'Loại', 'Không nhập dòng này — trả lại NCC.'],
  ];

  const TOL = 0.02; // dung sai giá ±2% (cấu hình ở Cài đặt → Duyệt & quy trình)
  const pricePct = (l) => l.poPrice ? (l.invPrice - l.poPrice) / l.poPrice : 0;

  const calcMatch = (l) => {
    if (l.received < l.ordered) return 'short';
    if (l.received > l.ordered) return 'over';
    if (l.invPrice !== l.poPrice) return 'price';
    return 'matched';
  };
  const upd = (sku, field, val) => setLines((ls) => ls.map((l) => l.sku === sku ? { ...l, [field]: val } : l));
  const flags = lines.map(calcMatch);
  const hasIssue = flags.some((f) => f !== 'matched');
  const shortLines = lines.filter((l) => calcMatch(l) === 'short');
  const overLines = lines.filter((l) => calcMatch(l) === 'over');
  const priceLines = lines.filter((l) => calcMatch(l) === 'price');
  const priceOver = priceLines.filter((l) => Math.abs(pricePct(l)) > TOL); // vượt dung sai → chờ duyệt
  const issueLines = lines.filter((l) => calcMatch(l) !== 'matched');
  const undecided = issueLines.filter((l) => !dec[l.sku]);
  const noInvoice = !einvNo.trim() || !einvDate;
  const blockPost = undecided.length > 0 || noInvoice;
  /* dòng loại không nhập kho; hàng tặng nhập nhưng không tính tiền */
  const totalRecv = lines.reduce((s, l) => dec[l.sku] === 'reject' || dec[l.sku] === 'free' ? s : s + l.received * l.invPrice, 0);

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto' }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-soft)', fontWeight: 600, fontSize: 13.5, padding: '4px 0', marginBottom: 12 }}><IconChevronLeft size={17} />Quay lại danh sách nhận hàng</button>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--dv-green)', margin: 0, letterSpacing: '-0.02em' }}>Nhập kho · {shipment.id}</h2>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-faint)', marginTop: 5 }}>{shipment.po} · {shipment.ncc} · {shipment.carrier} {shipment.tracking}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasIssue
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#9c2b22', background: '#F8E0DD', padding: '7px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13 }}><IconAlertTriangle size={15} />{flags.filter((f) => f !== 'matched').length} dòng lệch — cần xử lý</span>
            : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--dv-green-bright)', background: '#D6ECE5', padding: '7px 14px', borderRadius: 999, fontWeight: 700, fontSize: 13 }}><IconCheckCircle size={15} />Khớp 3 chiều</span>}
        </div>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1180, fontFamily: 'var(--font-body)' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>
            {['Sản phẩm', 'SL đặt', 'SL nhận', 'Số lô', 'HSD', 'Giá ĐH', 'Giá HĐ', 'Trạng thái (3-way)'].map((h, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : i >= 1 && i <= 2 || i >= 5 && i <= 6 ? 'right' : 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-default)' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {lines.map((l) => {
              const match = calcMatch(l);
              return (
                <tr key={l.sku} style={{ borderTop: '1px solid var(--border-default)', background: match !== 'matched' ? '#FFFBF0' : 'transparent' }}>
                  <td style={{ padding: '13px 16px' }}><div style={{ fontWeight: 700, fontSize: 13.5 }}>{l.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{l.sku}</div></td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--dv-ink-soft)' }}>{NUM(l.ordered)}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                    <input type="number" value={l.received} disabled={posted} onChange={(e) => upd(l.sku, 'received', Number(e.target.value))} style={{ width: 76, textAlign: 'right', padding: '7px 9px', borderRadius: 8, border: `1px solid ${match === 'short' || match === 'over' ? '#C5372C' : 'var(--border-strong)'}`, fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, outline: 'none', color: match === 'short' || match === 'over' ? '#C5372C' : 'var(--dv-ink)' }} />
                  </td>
                  <td style={{ padding: '13px 16px' }}><input value={l.lot} disabled={posted} onChange={(e) => upd(l.sku, 'lot', e.target.value)} style={{ width: 92, padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none' }} /></td>
                  <td style={{ padding: '13px 16px' }}><input type="date" title="Hạn sử dụng (HSD)" value={(() => { const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(l.exp || ''); return m ? `${m[3]}-${m[2]}-${m[1]}` : (l.exp || ''); })()} disabled={posted} onChange={(e) => upd(l.sku, 'exp', e.target.value)} style={{ width: 140, padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none' }} /></td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{VND(l.poPrice)}</td>
                  <td style={{ padding: '13px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: match === 'price' ? '#8a6a00' : 'var(--dv-ink)' }}>{VND(l.invPrice)}{match === 'price' && <div style={{ fontSize: 10.5, fontWeight: 700, color: Math.abs(pricePct(l)) <= TOL ? 'var(--dv-green-bright)' : '#9c2b22' }}>{pricePct(l) > 0 ? '+' : ''}{(pricePct(l) * 100).toFixed(1)}%</div>}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <MatchFlag match={match} />
                    {match === 'short' && <div style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)', marginTop: 3 }}>thiếu {NUM(l.ordered - l.received)} · {shortMode === 'wait' ? 'chờ giao tiếp' : 'đóng đơn'}</div>}
                    {match === 'over' && <div style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)', marginTop: 3 }}>dư {NUM(l.received - l.ordered)} · cần xác nhận</div>}
                    {match === 'price' && <div style={{ fontSize: 10.5, color: Math.abs(pricePct(l)) <= TOL ? 'var(--dv-green-bright)' : '#9c2b22', marginTop: 3, fontWeight: 600 }}>{Math.abs(pricePct(l)) <= TOL ? 'trong dung sai · tự duyệt' : 'vượt ±2% → chờ duyệt'}</div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasIssue && <div style={{ marginTop: 16, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-sm)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)' }}>Xử lý sai lệch · từng dòng</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: undecided.length ? '#C5372C' : 'var(--dv-green-bright)' }}>{undecided.length ? `còn ${undecided.length}/${issueLines.length} dòng chưa quyết định` : `đã quyết định đủ ${issueLines.length} dòng`}</span>
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', margin: '0 0 14px', maxWidth: '84ch' }}>Mỗi dòng lệch cần một quyết định riêng — không chốt phiếu được khi còn dòng bỏ trống.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {issueLines.map((l) => {
            const m = calcMatch(l); const d2 = dec[l.sku];
            const why = m === 'short' ? `Thiếu ${NUM(l.ordered - l.received)} so với đơn đặt` : m === 'over' ? `Dư ${NUM(l.received - l.ordered)} so với đơn đặt` : `Giá hóa đơn lệch ${pricePct(l) > 0 ? '+' : ''}${(pricePct(l) * 100).toFixed(1)}%`;
            return (
              <div key={l.sku} style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', border: `1px solid ${d2 ? 'var(--border-default)' : '#F0C8C3'}`, background: d2 ? '#fff' : '#FFFBF0', borderRadius: 12, padding: '11px 14px' }}>
                <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><span style={{ fontWeight: 700, fontSize: 13.5 }}>{l.name}</span><MatchFlag match={m} /></div>
                  <div style={{ fontSize: 12, color: 'var(--dv-ink-soft)', marginTop: 2 }}>{why}</div>
                </div>
                <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3, flexWrap: 'wrap' }}>
                  {DECISIONS.map(([k, lb, hint]) => (
                    <button key={k} title={hint} disabled={posted} onClick={() => setDec((x) => ({ ...x, [l.sku]: k }))} style={{ border: 'none', cursor: posted ? 'default' : 'pointer', padding: '7px 13px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: d2 === k ? '#fff' : 'transparent', color: d2 === k ? (k === 'reject' ? '#C5372C' : 'var(--dv-green)') : 'var(--dv-ink-soft)', boxShadow: d2 === k ? 'var(--shadow-xs)' : 'none' }}>{lb}</button>
                  ))}
                </span>
              </div>
            );
          })}
          {shortLines.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: 'var(--dv-mist)', borderRadius: 12, padding: '11px 14px' }}>
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--dv-ink)' }}>Phần thiếu của đơn mua · {shortLines.length} dòng</div>
                <div style={{ fontSize: 12, color: 'var(--dv-ink-soft)' }}>Quyết định trên áp cho hàng đã nhận. Còn phần chưa giao thì xử lý thế nào?</div>
              </div>
              <span style={{ display: 'inline-flex', background: '#fff', borderRadius: 999, padding: 3 }}>
                {[['wait', 'Còn chờ NCC giao tiếp'], ['close', 'Đóng đơn (không giao tiếp)']].map(([k, lb]) => (
                  <button key={k} disabled={posted} onClick={() => setShortMode(k)} style={{ border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: shortMode === k ? 'var(--dv-green-50)' : 'transparent', color: shortMode === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>{lb}</button>
                ))}
              </span>
            </div>
          )}
          {priceOver.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: 'var(--dv-mist)', borderRadius: 12, padding: '12px 14px' }}>
              <span style={{ color: 'var(--dv-ink-soft)', display: 'inline-flex', marginTop: 1 }}><IconAlertTriangle size={16} /></span>
              <div style={{ fontSize: 12.5, color: 'var(--dv-ink)' }}><b>{priceOver.length} dòng lệch giá vượt dung sai ±2%</b> → dòng nào chọn <b>Chấp nhận</b> sẽ tự tạo <b>phiếu chờ duyệt</b> chuyển Mua hàng đối soát. Lệch trong dung sai được tự duyệt.</div>
            </div>
          )}
        </div>
      </div>}

      {/* DVP-332: khối hóa đơn tách riêng — trước đây chỉ hiện khi có lệch giá, nên phiếu khớp hoàn toàn không có chỗ nhập HĐĐT */}
      <div style={{ marginTop: 16, background: '#fff', border: `1px solid ${noInvoice ? '#F5E0A8' : 'var(--border-default)'}`, borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-sm)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)' }}>Hóa đơn điện tử</div>
          {noInvoice
            ? <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '3px 9px', borderRadius: 999 }}>CHỜ BỔ SUNG</span>
            : <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '3px 9px', borderRadius: 999 }}>ĐÃ CÓ</span>}
          <span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Bắt buộc trước khi chốt phiếu — đối soát 3-way với MISA cần số hóa đơn.</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div><label style={{ display: 'block', fontSize: 11, color: 'var(--dv-ink-faint)', marginBottom: 4 }}>Số hóa đơn (HĐĐT)</label><input value={einvNo} disabled={posted} onChange={(e) => setEinvNo(e.target.value)} placeholder="VD: 00012345" style={{ width: 170, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none' }} /></div>
          <div><label style={{ display: 'block', fontSize: 11, color: 'var(--dv-ink-faint)', marginBottom: 4 }}>Ngày hóa đơn</label><input type="date" value={einvDate} disabled={posted} onChange={(e) => setEinvDate(e.target.value)} style={{ width: 160, padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none' }} /></div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-sm)', padding: '16px 22px', flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giá trị nhập thực tế</div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--dv-green)' }}>{VND(totalRecv)}</div></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          {posted
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 15 }}><IconCheckCircle size={20} />Đã nhập kho{priceOver.length > 0 ? ` · ${priceOver.length} chênh lệch giá đã chuyển duyệt` : ''} — cập nhật tồn KiotViet.</span>
            : <>
                {blockPost && <span style={{ fontSize: 12.5, color: '#9c2b22', fontWeight: 600, maxWidth: '30ch' }}>{undecided.length ? `Còn ${undecided.length} dòng lệch chưa quyết định.` : 'Cần số và ngày hóa đơn trước khi chốt phiếu.'}</span>}
                <Button variant="secondary" size="md" onClick={onBack}>Lưu nháp</Button>
                <Button variant="primary" size="md" iconRight={<IconPackage size={17} />} disabled={blockPost} onClick={() => {
                  if (blockPost) return;
                  setPosted(true);
                  window.OpsStore.set((st) => {
                    const next = { shipments: st.shipments.map((x) => x.id === shipment.id ? { ...x, status: 'received' } : x) };
                    if (priceOver.length > 0) {
                      const totalVar = priceOver.reduce((s, l) => s + (l.invPrice - l.poPrice) * l.received, 0);
                      next.approvals = [{
                        id: 'PV-' + shipment.id.replace('GRN-', ''), kind: 'price',
                        title: `Chênh lệch giá — ${shipment.id} (${shipment.ncc})`,
                        lines: priceOver.filter((l) => dec[l.sku] === 'accept').length || priceOver.length, value: totalVar, by: 'Lê Văn Hùng', role: 'Kho', at: 'Vừa xong', state: 'pending',
                        ncc: shipment.ncc, grn: shipment.id,
                        reason: `Nhập kho ${shipment.id}: ${priceOver.length} dòng giá hóa đơn vượt dung sai ±2% so với đơn mua.`,
                        einvoiceNo: einvNo, invoiceDate: einvDate,
                        items: priceOver.map((l) => ({ sku: l.sku, name: l.name, qty: l.received, poPrice: l.poPrice, invPrice: l.invPrice, diffPct: pricePct(l) })),
                      }, ...st.approvals];
                    }
                    return next;
                  });
                  const parts = [`${lines.length} dòng`];
                  if (shortLines.length) parts.push(`thiếu ${shortLines.length} (${shortMode === 'wait' ? 'chờ giao tiếp' : 'đóng đơn'})`);
                  const nFree = issueLines.filter((l) => dec[l.sku] === 'free').length; const nRej = issueLines.filter((l) => dec[l.sku] === 'reject').length;
                  if (nFree) parts.push(`${nFree} dòng hàng tặng`);
                  if (nRej) parts.push(`${nRej} dòng loại`);
                  if (priceOver.length) parts.push(`${priceOver.length} chênh lệch giá → Chờ duyệt`);
                  setToast(`Đã nhập kho ${shipment.id} — ${parts.join(' · ')}. Ghi Nhật ký.`);
                }}>Chốt phiếu &amp; nhập kho</Button>
              </>}
        </div>
      </div>
    </div>
  );
}

function ReceivingScreen({ setToast, setView }) {
  const [open, setOpen] = React.useState(null);
  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1160, margin: '0 auto' }}>
      {open ? <GRNEntry shipment={open} onBack={() => setOpen(null)} setToast={setToast} /> : <ReceivingList onOpen={setOpen} setToast={setToast} setView={setView} />}
    </div>
  );
}
window.ReceivingScreen = ReceivingScreen;

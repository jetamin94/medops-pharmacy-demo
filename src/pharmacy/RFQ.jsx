/* Pharmacy — RFQ: list + compare matrix + award (full fidelity). */

function RFQList({ rfqs, onOpen, onNew, setToast }) {
  const { PageHeader, StatusBadge, StatusTabs, SLACountdown } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconQuote, IconPlus, IconChevronRight } = window;
  const [tab, setTab] = React.useState('all');
  const filtered = rfqs.filter((r) => tab === 'all' || r.status === tab);
  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1180, margin: '0 auto' }}>
      <PageHeader title="Yêu cầu báo giá (RFQ)" subtitle="Gửi yêu cầu báo giá tới nhiều nhà cung cấp, so sánh và chọn (award). Báo giá được niêm phong — NCC không thấy giá của nhau."
        actions={<Button variant="accent" size="md" iconRight={<IconPlus size={16} />} onClick={onNew}>Tạo RFQ</Button>} />
      <div style={{ marginBottom: 18 }}>
        <StatusTabs items={[['all', 'Tất cả', rfqs.length], ['open', 'Đang mở', rfqs.filter((r) => r.status === 'open').length], ['submitted', 'Đã đủ báo giá', rfqs.filter((r) => r.status === 'submitted').length], ['awarded', 'Đã chọn', rfqs.filter((r) => r.status === 'awarded').length]]} value={tab} onChange={setTab} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && <window.EmptyState icon="IconQuote" title="Không có RFQ nào ở mục này" hint="Bấm “Tạo RFQ” để gửi yêu cầu báo giá từ giỏ dự trù hoặc chọn SKU thủ công." />}
        {filtered.map((r) => (
          <div key={r.id} onClick={() => onOpen(r.id)} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: 18, display: 'flex', alignItems: 'center', gap: 18, cursor: 'pointer' }}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconQuote size={21} /></span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--dv-ink)' }}>{r.title}</span>
                <StatusBadge status={r.status} size="sm" />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)', marginTop: 3 }}>{r.id} · {r.lines} dòng · {r.nccs} NCC mời · tạo {r.created}</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Đã báo giá</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)' }}>{r.quoted}<span style={{ color: 'var(--dv-ink-faint)', fontWeight: 500 }}>/{r.nccs}</span></span>
              </div>
            </div>
            <div style={{ minWidth: 130, textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>SLA</div>
              {r.status === 'awarded' ? <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--dv-ink-faint)' }}>Hoàn tất</span> : <SLACountdown deadline={r.deadline} compact />}
            </div>
            <span style={{ color: 'var(--dv-ink-faint)' }}><IconChevronRight size={20} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RFQCompare({ rfqId, onBack, setToast, setView }) {
  const { RFQ_DETAIL, SUPPLIERS, VND, NUM, StatusBadge, SLACountdown, DeltaChip, FillBar, VatToggle, Tip } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconChevronLeft, IconLock, IconAward, IconClock, IconCheck, IconTransfer } = window;
  const d = RFQ_DETAIL;
  const active = d.suppliers.filter((s) => s.offers);
  // CTKM: quy đổi giá net/đơn vị (tầng A: pct → amount → bonus)
  const netBase = (o) => {
    let p = o.price;
    (o.promo || []).forEach((pr) => {
      if (pr.type === 'pct') p = p * (1 - pr.value / 100);
      else if (pr.type === 'amount') p = p - pr.value;
      else if (pr.type === 'bonus') p = p * pr.buy / (pr.buy + pr.free);
    });
    return Math.round(p);
  };
  const [priceMode, setPriceMode] = React.useState('net'); // net (sau CTKM) | list (đơn giá)
  const [vat, setVat] = React.useState('excl');
  const [awarded, setAwarded] = React.useState(false);
  const baseUnit = (o) => priceMode === 'net' ? netBase(o) : o.price;
  const cellPrice = (o) => vat === 'incl' ? Math.round(baseUnit(o) * (1 + o.vat / 100)) : baseUnit(o);
  const listCell = (o) => vat === 'incl' ? Math.round(o.price * (1 + o.vat / 100)) : o.price;
  const lineTarget = (l, vatPct) => vat === 'incl' ? Math.round(l.target * (1 + (vatPct != null ? vatPct : 5) / 100)) : l.target;
  const hasPromo = (o) => o && o.promo && o.promo.length > 0;
  // best (lowest) supplier per line theo giá hiệu lực đang xem
  const bestFor = (sku) => {
    let best = null;
    active.forEach((s) => { const o = s.offers[sku]; if (o && (!best || baseUnit(o) < baseUnit(best))) best = { id: s.id, ...o }; });
    return best;
  };
  // alloc[sku] = { [nccId]: qty } · split[sku] = đang tách nguồn
  const [split, setSplit] = React.useState({});
  const [alloc, setAlloc] = React.useState(() => { const a = {}; d.lines.forEach((l) => { const b = bestFor(l.sku); if (b) a[l.sku] = { [b.id]: Math.min(b.fill, l.qty) }; }); return a; });
  const allocOf = (sku) => alloc[sku] || {};
  const cellQty = (sku, sid) => allocOf(sku)[sid] || 0;
  const lineAllocated = (l) => Object.values(allocOf(l.sku)).reduce((s, q) => s + q, 0);
  const setSingle = (sku, sid, qty) => setAlloc((a) => ({ ...a, [sku]: { [sid]: qty } }));
  const setSplitQty = (sku, sid, qty) => setAlloc((a) => { const row = { ...(a[sku] || {}) }; if (qty > 0) row[sid] = qty; else delete row[sid]; return { ...a, [sku]: row }; });
  const toggleSplit = (l) => setSplit((s) => {
    const on = !s[l.sku];
    if (!on) { const b = bestFor(l.sku); setAlloc((a) => ({ ...a, [l.sku]: b ? { [b.id]: Math.min(b.fill, l.qty) } : {} })); }
    return { ...s, [l.sku]: on };
  });
  const effQty = (sku, sid) => { const s = active.find((x) => x.id === sid); const o = s && s.offers[sku]; return o ? Math.min(o.fill, cellQty(sku, sid)) : 0; };
  const total = d.lines.reduce((sum, l) => sum + Object.keys(allocOf(l.sku)).reduce((s2, sid) => { const sup = active.find((x) => x.id === sid); const o = sup && sup.offers[l.sku]; return o ? s2 + cellPrice(o) * effQty(l.sku, sid) : s2; }, 0), 0);
  const awardedSuppliers = [...new Set(d.lines.flatMap((l) => Object.keys(allocOf(l.sku)).filter((sid) => cellQty(l.sku, sid) > 0)))];
  /* DVP-326: kết quả award — giữ lại danh sách PO nháp đã sinh để hiện thành khối, không chỉ một dòng chữ */
  const [result, setResult] = React.useState(null);
  const perSupplier = (sid) => {
    const sup = active.find((x) => x.id === sid);
    const ls = d.lines.filter((l) => cellQty(l.sku, sid) > 0);
    return { sup, lines: ls.length, value: ls.reduce((s2, l) => s2 + cellPrice(sup.offers[l.sku]) * effQty(l.sku, sid), 0) };
  };

  return (
    <div style={{ padding: '20px 28px 40px', maxWidth: 1340, margin: '0 auto' }}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-soft)', fontWeight: 600, fontSize: 13.5, padding: '4px 0', marginBottom: 12 }}><IconChevronLeft size={17} />Quay lại danh sách RFQ</button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--dv-green)', margin: 0, letterSpacing: '-0.02em' }}>{d.title}</h2>
            <StatusBadge status={awarded ? 'awarded' : 'open'} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-faint)', marginTop: 5 }}>{d.id} · {d.lines.length} dòng · {d.suppliers.length} NCC được mời</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Hạn báo giá (SLA)</div><SLACountdown deadline={d.deadline} /></div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, textAlign: 'right' }}>So sánh theo</div>
            <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3 }}>
              {[['net', 'Giá net (sau CTKM)'], ['list', 'Đơn giá list']].map(([k, lb]) => (
                <button key={k} onClick={() => setPriceMode(k)} style={{ border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: priceMode === k ? '#fff' : 'transparent', color: priceMode === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: priceMode === k ? 'var(--shadow-xs)' : 'none' }}>{lb}</button>
              ))}
            </span>
          </div>
          <VatToggle value={vat} onChange={setVat} />
        </div>
      </div>

      {/* sealed notice */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--dv-green-900)', color: '#fff', borderRadius: 12, padding: '10px 16px', marginBottom: 18 }}>
        <span style={{ color: 'var(--dv-yellow)', display: 'inline-flex' }}><IconLock size={16} /></span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Báo giá <b style={{ color: 'var(--dv-yellow)' }}>niêm phong</b> — mỗi nhà cung cấp chỉ thấy giá của chính họ. So sánh và <b style={{ color: 'var(--dv-yellow)' }}>giá mục tiêu</b> chỉ hiển thị phía nhà thuốc.</span>
      </div>

      {/* compare matrix */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 920, fontFamily: 'var(--font-body)' }}>
          <thead>
            <tr>
              <th style={{ position: 'sticky', left: 0, zIndex: 3, background: 'var(--dv-mist)', textAlign: 'left', padding: '14px 16px', minWidth: 230, borderBottom: '1px solid var(--border-default)', borderRight: '1px solid var(--border-default)' }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-soft)' }}>Sản phẩm · giá mục tiêu</span>
              </th>
              {d.suppliers.map((s) => (
                <th key={s.id} style={{ background: 'var(--dv-mist)', padding: '12px 16px', minWidth: 168, borderBottom: '1px solid var(--border-default)', borderLeft: '1px solid var(--border-default)', verticalAlign: 'top' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: s.offers ? 'var(--dv-green)' : 'var(--dv-ink-faint)', textAlign: 'left' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textAlign: 'left', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {s.offers ? <><IconClock size={11} />Leadtime {s.leadtime}n · {s.submittedAt}</> : <span style={{ color: 'var(--dv-yellow-600)', fontWeight: 600 }}>{s.submittedAt}</span>}
                  </div>
                  {s.orderPromo && <div style={{ marginTop: 6, textAlign: 'left' }}><Tip text={s.orderPromo.type === 'rebate' ? `Thưởng doanh số ${s.orderPromo.period} ${s.orderPromo.pct}% — tính back-end, không vào giá đơn vị.` : `Chiết khấu thêm ${s.orderPromo.pct}% khi tổng đơn ≥ ${VND(s.orderPromo.threshold)} — tính ở bước chốt đơn.`}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', padding: '2px 7px', borderRadius: 999 }}>CTKM đơn: {s.orderPromo.label}</span></Tip></div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.lines.map((l) => {
              const best = bestFor(l.sku);
              return (
                <tr key={l.sku} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ position: 'sticky', left: 0, zIndex: 2, background: '#fff', padding: '14px 16px', borderRight: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)' }}>{l.name}</span>{(() => { const m = window.skuMeta && window.skuMeta(l.sku); if (!m) return null; return <>{m.type === 'rx' && <span style={{ fontSize: 9.5, fontWeight: 800, color: '#6b3fa0', background: '#F0E8F6', padding: '1px 6px', borderRadius: 5 }}>Rx</span>}{m.storage === 'lanh' && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1d4f8a', background: '#E5EEFb', padding: '1px 6px', borderRadius: 5 }}>Lạnh</span>}{window.ControlBadge && <window.ControlBadge k={m.control} />}</>; })()}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{l.sku} · SL {NUM(l.qty)} {l.unit}</div>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--dv-mist)', padding: '3px 9px', borderRadius: 999 }}>
                        <Tip text="Giá mục tiêu là số nội bộ của nhà thuốc — NCC không nhìn thấy cột này khi báo giá."><span style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'help', borderBottom: '1px dotted var(--border-strong)' }}>Mục tiêu · nội bộ</span></Tip>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' }}>{VND(lineTarget(l))}</span>
                      </span>
                      {!awarded && <button onClick={() => toggleSplit(l)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, border: `1px solid ${split[l.sku] ? 'var(--dv-green)' : 'var(--border-strong)'}`, background: split[l.sku] ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', padding: '3px 9px', borderRadius: 999, fontWeight: 700, fontSize: 11, color: split[l.sku] ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}><IconTransfer size={12} />{split[l.sku] ? 'Đang tách nguồn' : 'Tách nguồn'}</button>}
                    </div>
                    {split[l.sku] && (() => { const al = lineAllocated(l); const diff = al - l.qty; return (
                      <div style={{ marginTop: 7, fontSize: 11.5, fontWeight: 600, color: diff === 0 ? 'var(--dv-green-bright)' : diff < 0 ? 'var(--dv-yellow-600)' : '#C5372C' }}>
                        Đã phân bổ {NUM(al)}/{NUM(l.qty)} {l.unit}{diff < 0 ? ` · thiếu ${NUM(-diff)}` : diff > 0 ? ` · dư ${NUM(diff)}` : ' · đủ'}
                      </div>
                    ); })()}
                  </td>
                  {d.suppliers.map((s) => {
                    const o = s.offers && s.offers[l.sku];
                    const isBest = best && s.id === best.id;
                    const qSel = cellQty(l.sku, s.id);
                    const isAwarded = qSel > 0;
                    const isSplit = split[l.sku];
                    if (!o) return <td key={s.id} style={{ padding: '14px 16px', borderLeft: '1px solid var(--border-default)', textAlign: 'center', color: 'var(--dv-ink-faint)', fontSize: 13 }}>—</td>;
                    return (
                      <td key={s.id} onClick={() => { if (awarded || isSplit) return; setSingle(l.sku, s.id, Math.min(o.fill, l.qty)); }} style={{ padding: '12px 14px', borderLeft: '1px solid var(--border-default)', cursor: awarded || isSplit ? 'default' : 'pointer', background: isAwarded ? 'rgba(0,83,63,0.06)' : isBest ? 'rgba(10,127,100,0.035)' : 'transparent', position: 'relative', verticalAlign: 'top' }}>
                        {isAwarded && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--dv-green)' }} />}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 15, color: 'var(--dv-ink)', fontVariantNumeric: 'tabular-nums' }}>{VND(cellPrice(o))}</span>
                          {isBest && <span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--dv-green)', background: 'var(--dv-yellow)', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.03em' }}>TỐT NHẤT</span>}
                        </div>
                        {hasPromo(o) && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                          {priceMode === 'net' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)', textDecoration: 'line-through' }}>{VND(listCell(o))}</span>}
                          <Tip text={'CTKM: ' + o.promo.map((p) => p.label).join(' + ')}><span style={{ fontSize: 9.5, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '1px 6px', borderRadius: 4, letterSpacing: '0.03em', cursor: 'help' }}>CÓ CTKM</span></Tip>
                        </div>}
                        <div style={{ marginBottom: 7 }}><DeltaChip offered={cellPrice(o)} target={lineTarget(l, o.vat)} size="sm" /></div>
                        <FillBar have={o.fill} need={l.qty} width={120} />
                        {isSplit
                          ? <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input type="number" value={qSel || ''} placeholder="0" min={0} max={o.fill} disabled={awarded} onChange={(e) => setSplitQty(l.sku, s.id, Math.max(0, Math.min(o.fill, Number(e.target.value))))} style={{ width: 66, textAlign: 'right', padding: '5px 8px', borderRadius: 7, border: `1px solid ${isAwarded ? 'var(--dv-green)' : 'var(--border-strong)'}`, fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: 'var(--dv-green)', outline: 'none' }} />
                              <span style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>/ {NUM(o.fill)}</span>
                            </div>
                          : <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ width: 17, height: 17, borderRadius: '50%', border: isAwarded ? 'none' : '2px solid var(--border-strong)', background: isAwarded ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{isAwarded && <IconCheck size={11} color="#fff" />}</span>
                              <span style={{ fontSize: 11.5, fontWeight: 600, color: isAwarded ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>{isAwarded ? `Đã chọn · ${NUM(effQty(l.sku, s.id))}` : 'Chọn'}</span>
                              {o.fill < l.qty && <span style={{ marginLeft: 'auto' }}><Tip text={`Chỉ đáp ứng ${NUM(o.fill)}/${NUM(l.qty)} — bấm “Tách nguồn” để bù từ NCC khác.`}><span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '1px 6px', borderRadius: 999 }}>MỘT PHẦN</span></Tip></span>}
                            </div>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DVP-326: khối kết quả award → PO nháp đã sinh, kèm tổng giá trị từng đơn */}
      {result && <div style={{ marginTop: 20, background: '#fff', border: '1px solid var(--dv-green-100)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--dv-green-50)', padding: '12px 20px', borderBottom: '1px solid var(--dv-green-100)' }}>
          <span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconAward size={18} /></span>
          <b style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--dv-green)' }}>Kết quả award — {result.pos.length} đơn mua nháp đã sinh</b>
          <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Đang chờ duyệt · chưa gửi NCC</span>
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontFamily: 'var(--font-body)' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Mã đơn nháp', 'Nhà cung cấp', 'Số dòng', 'Giá trị', ''].map((h, i) => <th key={i} style={{ textAlign: i >= 2 && i <= 3 ? 'right' : 'left', padding: '10px 20px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)' }}>{h}</th>)}</tr></thead>
          <tbody>
            {result.pos.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border-default)' }}>
                <td style={{ padding: '12px 20px', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--dv-green)' }}>{p.id}</td>
                <td style={{ padding: '12px 20px', fontSize: 13.5, fontWeight: 600 }}>{p.ncc}</td>
                <td style={{ padding: '12px 20px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{p.lines}</td>
                <td style={{ padding: '12px 20px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13.5 }}>{VND(p.value)}</td>
                <td style={{ padding: '12px 20px', textAlign: 'right' }}><span style={{ fontSize: 11, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '3px 9px', borderRadius: 999 }}>CHỜ DUYỆT</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderTop: '1px solid var(--border-default)', background: '#fafbfb', flexWrap: 'wrap' }}>
          <div><span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Tổng giá trị award</span><div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 21, color: 'var(--dv-green)' }}>{VND(result.total)}</div></div>
          <span style={{ marginLeft: 'auto' }}><Button variant="primary" size="md" onClick={() => { setView && setView('approvals'); }}>Tới hàng Chờ duyệt</Button></span>
        </div>
      </div>}

      {/* award bar */}
      <div style={{ position: 'sticky', bottom: 0, marginTop: 20, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tổng giá trị award ({vat === 'incl' ? 'có VAT' : 'chưa VAT'})</div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--dv-green)', letterSpacing: '-0.02em' }}>{VND(total)}</div></div>
        <div style={{ borderLeft: '1px solid var(--border-default)', paddingLeft: 22 }}><div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phân bổ</div><div style={{ fontSize: 14, fontWeight: 700, color: 'var(--dv-ink)', marginTop: 4 }}>{awardedSuppliers.length} nhà cung cấp · {d.lines.length} dòng</div></div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
          {awarded
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 15 }}><IconCheck size={20} />Đã award — đơn mua nháp đã vào hàng Chờ duyệt.</span>
            : <Button variant="accent" size="lg" iconRight={<IconAward size={18} />} onClick={() => {
                if (!awardedSuppliers.length) { setToast('Chưa phân bổ dòng hàng nào cho NCC.'); return; }
                const over = d.lines.find((l) => lineAllocated(l) > l.qty);
                if (over) { setToast(`Phân bổ "${over.name}" vượt nhu cầu (${window.NUM(lineAllocated(over))}/${window.NUM(over.qty)}) — giảm bớt trước khi award.`); return; }
                setAwarded(true);
                setResult({ pos: awardedSuppliers.map((sid, i) => { const ps = perSupplier(sid); return { id: `PO-RFQ-${130 + i}`, ncc: ps.sup.name, lines: ps.lines, value: ps.value }; }), total });
                const ROPS = { SP0088: { onHand: 120, rop: 360 }, SP0245: { onHand: 70, rop: 180 }, SP0210: { onHand: 110, rop: 300 }, SP0177: { onHand: 150, rop: 280 } };
                const newApprovals = awardedSuppliers.map((sid, i) => {
                  const sup = active.find((x) => x.id === sid);
                  const supMaster = SUPPLIERS.find((x) => x.id === sid) || {};
                  const lines = d.lines.filter((l) => cellQty(l.sku, sid) > 0);
                  const items = lines.map((l) => { const o = sup.offers[l.sku]; return { sku: l.sku, name: l.name, qty: effQty(l.sku, sid), unit: l.unit, price: netBase(o), priceList: o.price, vat: o.vat, ...(ROPS[l.sku] || { onHand: 0, rop: 0 }), abc: 'A' }; });
                  const value = items.reduce((sum, it) => sum + it.qty * it.price, 0);
                  return { id: `PO-RFQ-${130 + i}`, kind: 'buy', title: `Đơn mua — ${sup.name} (award ${d.id})`, lines: items.length, value,
                    by: 'Trần Thị Mai', role: 'Mua hàng', at: 'Vừa xong', state: 'pending',
                    ncc: sup.name, leadtime: sup.leadtime, debt: supMaster.debt || 0, debtLimit: supMaster.debtLimit || 200000000, budget: 418000000, budgetCap: 500000000,
                    reason: `Tạo từ kết quả award ${d.id} — giá đã chốt theo báo giá niêm phong${Object.keys(split).some((k) => split[k]) ? ', có dòng tách nguồn nhiều NCC' : ''}.`, items };
                });
                window.OpsStore.set((st) => ({
                  approvals: [...newApprovals, ...st.approvals],
                  rfqs: st.rfqs.map((r) => r.id === d.id ? { ...r, status: 'awarded' } : r),
                }));
                setToast(`Đã award cho ${awardedSuppliers.length} NCC — ${newApprovals.length} đơn nháp vào Chờ duyệt.`);
              }}>Award &amp; tạo đơn mua</Button>}
        </div>
      </div>
    </div>
  );
}

function RFQScreen({ setToast, setView }) {
  const [openId, setOpenId] = React.useState(null);
  const [building, setBuilding] = React.useState(false);
  /* Auto-mở trình tạo RFQ khi điều hướng từ Đề xuất mua (cầu nối Q4) */
  React.useEffect(() => {
    if (window.__openRfqBuilder) {
      window.__openRfqBuilder = false;
      setBuilding(true);
      if (window.__rfqFocusNcc) { setToast(`Tạo RFQ từ giỏ dự trù — gợi ý gồm dòng của ${window.__rfqFocusNcc}.`); window.__rfqFocusNcc = null; }
    }
  }, []);
  const s = window.OpsStore.use();
  const rfqs = s.rfqs;
  const create = ({ title, lines, lineCount, nccs, sla, routeMode }) => {
    const id = 'RFQ-2406-' + String(9 + rfqs.filter((r) => r.id.startsWith('RFQ-2406')).length).padStart(2, '0');
    window.OpsStore.set((st) => ({ rfqs: [{ id, title, lines: lineCount != null ? lineCount : (Array.isArray(lines) ? lines.length : lines), lineItems: Array.isArray(lines) ? lines : [], routeMode, nccs, quoted: 0, status: 'open', deadline: Date.now() + sla * 3.6e6, created: '11/06/2026', fresh: true }, ...st.rfqs] }));
    setBuilding(false);
    setToast(`Đã gửi ${id} tới ${nccs} NCC — hạn báo giá ${sla} giờ (badge RFQ +1).`);
  };
  if (openId) return <RFQCompare rfqId={openId} onBack={() => setOpenId(null)} setToast={setToast} setView={setView} />;
  return (
    <>
      <RFQList rfqs={rfqs} onOpen={(id) => { const r = rfqs.find((x) => x.id === id); if (r && r.fresh) { setToast('RFQ vừa gửi — chưa có báo giá để so sánh.'); return; } setOpenId(id); }} onNew={() => setBuilding(true)} setToast={setToast} />
      {building && <window.RFQBuilder onClose={() => setBuilding(false)} onCreate={create} setToast={setToast} />}
    </>
  );
}
window.RFQScreen = RFQScreen;

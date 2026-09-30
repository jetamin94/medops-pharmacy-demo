/* Pharmacy — Màn 2+3 (JET-170): Dự trù tối ưu CTKM (OptimizerView) + Gen-PO (PromoPoDrawer).
   Nguyên tắc D6/Q9: gợi ý KHÔNG tự set — luôn thấy số gốc; người mua bấm Áp. */

const OPT_GROUPS = [
  {
    ncc: 'Dược Hậu Giang (DHG)', leadtime: 2, pendingPromo: null, minOrder: null,
    lines: [
      { sku: 'SP0142', name: 'Paracetamol 500mg', unit: 'Hộp', price: 1200, baseQty: 45, optQty: 51, pctBase: 5, pctOpt: 8, gift: null,
        promoLabel: 'CK bậc thang (KM-101)', why: 'Thêm 6 hộp đạt bậc ≥51 → CK 8% thay 5%. Tiết kiệm ~2.000₫/hộp trên cả dòng; +6 hộp ≈ 1,5 ngày bán — không vượt Max.', warn: null },
      { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', unit: 'Tuýp', price: 850, baseQty: 60, optQty: 60, pctBase: 0, pctOpt: 0, gift: null,
        promoLabel: null, why: 'Không có CTKM áp dụng — giữ nhu cầu cơ sở.', warn: null },
      { sku: 'SP0301', name: 'Berberin 10mg', unit: 'Lọ', price: 150, baseQty: 40, optQty: 40, pctBase: 0, pctOpt: 0, gift: null,
        promoLabel: 'Bậc CK ≥100: 6%', why: 'Ngưỡng ưu đãi 100 lọ VƯỢT nhu cầu 30 ngày (72) → engine giữ 40, không ép theo ngưỡng.', warn: 'MOQ ưu đãi 100 > SL bán 30 ngày (72) — không gợi ý tăng' },
    ],
  },
  {
    ncc: 'Imexpharm', leadtime: 3, pendingPromo: 'KM-103 “Tặng bậc thang nhóm kháng sinh” đang CHỜ XÁC NHẬN — chưa đưa vào tối ưu.',
    minOrder: { id: 'KM-104', threshold: 20000000, pct: 2 },
    lines: [
      { sku: 'SP0088', name: 'Amoxicillin 500mg', unit: 'Hộp', price: 7600, baseQty: 560, optQty: 560, pctBase: 0, pctOpt: 0, gift: null,
        promoLabel: null, why: 'CTKM tặng bậc (KM-103) chờ xác nhận — xác nhận ở “CTKM nhà cung cấp” để engine tính suất tặng.', warn: null },
      { sku: 'SP0177', name: 'Omeprazol 20mg', unit: 'Hộp', price: 14600, baseQty: 380, optQty: 400, pctBase: 0, pctOpt: 0, gift: null,
        promoLabel: 'Góp ngưỡng đơn (KM-104)', why: 'Thêm 20 hộp (chẵn thùng) → +292.000₫ vào tổng đơn, góp phần đạt ngưỡng 20tr để CẢ ĐƠN hưởng thêm 2%.', warn: null },
      { sku: 'SP0210', name: 'Augmentin 625mg', unit: 'Hộp', price: 59000, baseQty: 110, optQty: 110, pctBase: 0, pctOpt: 0, gift: null,
        promoLabel: null, why: 'Giữ nhu cầu cơ sở.', warn: 'Lô NCC HSD 03/2027 — mua vượt 140 sẽ quá 60% vòng đời HSD khi về kho' },
    ],
  },
  {
    ncc: 'DKSH Việt Nam', leadtime: 3, pendingPromo: null, minOrder: null,
    lines: [
      { sku: 'SP0188', name: 'Enterogermina', unit: 'Hộp', price: 92000, baseQty: 25, optQty: 30, pctBase: 0, pctOpt: 0,
        gift: { base: { qty: 2 }, opt: { qty: 3 }, sku: 'Enterogermina', invoiced: true },
        promoLabel: 'Mua 10 tặng 1 (KM-102)', why: 'Làm tròn lên bội 10 (25→30) → đủ 3 suất tặng thay 2. Hàng tặng CÓ hoá đơn, giá 0.', warn: null },
      { sku: 'SP0067', name: 'Smecta hương cam', unit: 'Hộp', price: 105000, baseQty: 15, optQty: 15, pctBase: 0, pctOpt: 0, gift: null,
        promoLabel: null, why: 'Không có CTKM áp dụng — giữ nhu cầu cơ sở.', warn: null },
    ],
  },
];

const oVND = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '₫';
const oNUM = (n) => new Intl.NumberFormat('vi-VN').format(n);

/* ---------- Màn 2: Optimizer preview ---------- */
function OptimizerView({ setToast, setView }) {
  const { IconPercent, IconAlertTriangle, IconInfo, IconCheck, IconArrowRight, IconTrendUp, IconFile } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const [applied, setApplied] = React.useState({}); // sku -> true
  const [po, setPo] = React.useState(null); // group đang gen PO
  const [created, setCreated] = React.useState([]);

  const qtyOf = (l) => applied[l.sku] ? l.optQty : l.baseQty;
  const pctOf = (l) => applied[l.sku] ? l.pctOpt : l.pctBase;
  const lineNet = (l) => qtyOf(l) * l.price * (1 - pctOf(l) / 100);
  const groupTotal = (g) => g.lines.reduce((s, l) => s + lineNet(l), 0);
  const toggle = (sku) => setApplied((a) => ({ ...a, [sku]: !a[sku] }));
  const applyAll = (g) => { setApplied((a) => { const n = { ...a }; g.lines.forEach((l) => { if (l.optQty !== l.baseQty) n[l.sku] = true; }); return n; }); setToast(`Đã áp tất cả gợi ý của ${g.ncc} — vẫn xem lại được từng dòng.`); };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
        <span style={{ color: 'var(--dv-green)', flex: 'none', marginTop: 1 }}><IconPercent size={17} /></span>
        <div style={{ fontSize: 12.5, color: 'var(--dv-ink)', lineHeight: 1.5 }}><b>Dự trù tối ưu theo CTKM.</b> Engine đề xuất trên <b>nhu cầu cơ sở</b>; cột "Tối ưu" là <b>gợi ý</b> tận dụng CTKM — không tự áp. Bấm <b>Áp</b> từng dòng hoặc cả gói; luôn thấy số gốc. Quản lý CTKM tại <b style={{ color: 'var(--dv-green)', cursor: 'pointer' }} onClick={() => setView('promos')}>CTKM nhà cung cấp</b>.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {OPT_GROUPS.map((g) => {
          const total = groupTotal(g);
          const hasSuggest = g.lines.some((l) => l.optQty !== l.baseQty && !applied[l.sku]);
          const overMin = g.minOrder && total >= g.minOrder.threshold;
          const isCreated = created.includes(g.ncc);
          return (
            <section key={g.ncc} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border-default)', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--dv-green)' }}>{g.ncc}</div>
                  <div style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>Leadtime {g.leadtime} ngày · {g.lines.length} dòng · tổng hiện tại <b style={{ color: 'var(--dv-ink)', fontFamily: 'var(--font-mono)' }}>{oVND(total)}</b>{g.minOrder && overMin ? ' (đã gồm −2% toàn đơn khi gen PO)' : ''}</div>
                </div>
                {hasSuggest && <Button variant="secondary" size="sm" iconLeft={<IconTrendUp size={14} />} onClick={() => applyAll(g)}>Áp tất cả gợi ý</Button>}
                {isCreated
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 13 }}><IconCheck size={15} />Đã tạo PO nháp</span>
                  : <Button variant="primary" size="sm" iconRight={<IconFile size={14} />} onClick={() => setPo(g)}>Tạo PO nháp (CTKM)</Button>}
              </div>

              {g.pendingPromo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 20px', background: 'var(--dv-yellow-100)', borderBottom: '1px solid #F5E0A8', fontSize: 12.5, color: 'var(--dv-ink)' }}>
                  <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconInfo size={15} /></span>{g.pendingPromo}
                  <span onClick={() => setView('promos')} style={{ marginLeft: 'auto', fontWeight: 700, fontSize: 12, color: 'var(--dv-green)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Xác nhận →</span>
                </div>
              )}
              {g.minOrder && !overMin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 20px', background: 'var(--dv-green-50)', borderBottom: '1px solid var(--dv-green-100)', fontSize: 12.5, color: 'var(--dv-ink)' }}>
                  <span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconTrendUp size={15} /></span>
                  <span>Gần ngưỡng đơn: thêm <b style={{ fontFamily: 'var(--font-mono)' }}>{oVND(g.minOrder.threshold - total)}</b> đạt {oVND(g.minOrder.threshold)} → <b>cả đơn CK thêm {g.minOrder.pct}%</b> ({g.minOrder.id}).</span>
                </div>
              )}
              {g.minOrder && overMin && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 20px', background: 'var(--dv-green-50)', borderBottom: '1px solid var(--dv-green-100)', fontSize: 12.5, color: 'var(--dv-green)', fontWeight: 600 }}>
                  <IconCheck size={15} />Đơn đã đạt ngưỡng {oVND(g.minOrder.threshold)} → cả đơn hưởng thêm {g.minOrder.pct}% ({g.minOrder.id}).
                </div>
              )}

              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
                <thead><tr style={{ background: 'var(--dv-mist)' }}>
                  {['Sản phẩm', 'Nhu cầu cơ sở', 'Tối ưu CTKM', 'Chênh', 'CTKM áp dụng', ''].map((h, i) => <th key={i} style={{ textAlign: i >= 1 && i <= 3 ? 'right' : 'left', padding: '9px 16px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {g.lines.map((l) => {
                    const on = !!applied[l.sku];
                    const delta = l.optQty - l.baseQty;
                    return (
                      <React.Fragment key={l.sku}>
                        <tr style={{ borderTop: '1px solid var(--border-default)', background: on ? 'rgba(0,83,63,.035)' : '#fff' }}>
                          <td style={{ padding: '11px 16px' }}>
                            <div style={{ fontWeight: 700, fontSize: 13.5 }}>{l.name}</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{l.sku} · {oVND(l.price)}/{l.unit}</div>
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: on ? 400 : 800, color: on ? 'var(--dv-ink-faint)' : 'var(--dv-ink)' }}>{oNUM(l.baseQty)}</td>
                          <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: on ? 800 : 600, color: delta !== 0 ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>{oNUM(l.optQty)}</span>
                            {l.gift && <div style={{ fontSize: 10.5, color: 'var(--dv-yellow-600)', fontWeight: 700 }}>+{on ? l.gift.opt.qty : l.gift.base.qty} tặng</div>}
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: delta > 0 ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)' }}>{delta > 0 ? '+' + oNUM(delta) : '—'}</td>
                          <td style={{ padding: '11px 16px' }}>
                            {l.promoLabel
                              ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: 'var(--dv-yellow-100)', color: 'var(--dv-yellow-600)', fontWeight: 700, fontSize: 11 }}><IconPercent size={11} />{l.promoLabel}{pctOf(l) > 0 ? ` · −${pctOf(l)}%` : ''}</span>
                              : <span style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }}>—</span>}
                            {l.warn && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4, fontSize: 11, fontWeight: 600, color: '#9c6a00' }}><IconAlertTriangle size={12} />{l.warn}</div>}
                          </td>
                          <td style={{ padding: '11px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            {delta !== 0 && (on
                              ? <button onClick={() => toggle(l.sku)} style={{ border: '1px solid var(--border-strong)', background: '#fff', color: 'var(--dv-ink-soft)', borderRadius: 999, padding: '6px 13px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Hoàn tác</button>
                              : <button onClick={() => toggle(l.sku)} style={{ border: 'none', background: 'var(--dv-green)', color: '#fff', borderRadius: 999, padding: '7px 14px', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Áp gợi ý</button>)}
                          </td>
                        </tr>
                        <tr style={{ background: on ? 'rgba(0,83,63,.035)' : '#fff' }}>
                          <td colSpan={6} style={{ padding: '0 16px 10px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 12, color: 'var(--dv-ink-soft)', lineHeight: 1.5 }}>
                              <span style={{ color: 'var(--dv-green-bright)', flex: 'none', marginTop: 1, fontWeight: 700, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.04em' }}>Vì sao:</span>{l.why}
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>

      {po && <PromoPoDrawer group={po} applied={applied} onClose={() => setPo(null)} onSent={(ncc) => { setCreated((c) => [...c, ncc]); setPo(null); setToast(`Đã tạo PO nháp (CTKM) cho ${ncc} — vào hàng Chờ duyệt.`); }} />}
    </div>
  );
}
window.OptimizerView = OptimizerView;

/* ---------- Màn 3: Gen-PO drawer (Zone-3) ---------- */
function PromoPoDrawer({ group, applied, onClose, onSent }) {
  const { IconX, IconAlertTriangle, IconSend, IconPercent } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const qtyOf = (l) => applied[l.sku] ? l.optQty : l.baseQty;
  const pctOf = (l) => applied[l.sku] ? l.pctOpt : l.pctBase;

  const buyRows = group.lines.filter((l) => qtyOf(l) > 0).map((l) => {
    const qty = qtyOf(l), pct = pctOf(l);
    const priceAfter = l.price * (1 - pct / 100);
    return { ...l, qty, pct, priceAfter, amount: qty * priceAfter, giftQty: l.gift ? (applied[l.sku] ? l.gift.opt.qty : l.gift.base.qty) : 0 };
  });
  const giftRows = buyRows.filter((r) => r.giftQty > 0).map((r) => ({ sku: r.sku + '-G', name: r.gift.sku, qty: r.giftQty, invoiced: r.gift.invoiced }));
  const subTotal = buyRows.reduce((s, r) => s + r.qty * r.price, 0);
  const lineDiscount = buyRows.reduce((s, r) => s + r.qty * (r.price - r.priceAfter), 0);
  const afterLine = subTotal - lineDiscount;
  const orderPct = group.minOrder && afterLine >= group.minOrder.threshold ? group.minOrder.pct : 0;
  const orderDiscount = afterLine * orderPct / 100;
  const giftValue = giftRows.reduce((s, gr) => { const src = group.lines.find((l) => l.gift && l.gift.sku === gr.name); return s + (src ? src.price * gr.qty : 0); }, 0);
  const grand = afterLine - orderDiscount;
  const warns = group.lines.filter((l) => l.warn);
  const th = { textAlign: 'right', padding: '9px 9px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.03em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' };
  const td = { padding: '10px 9px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5 };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.32)' }} />
      <div style={{ position: 'relative', width: 'min(680px, 96vw)', height: '100%', background: 'var(--dv-paper, #F1F1F1)', boxShadow: '0 0 60px rgba(0,30,22,.3)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '17px 22px', background: '#fff', borderBottom: '1px solid var(--border-default)', flex: 'none' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: 0 }}>PO nháp (CTKM) — {group.ncc}</h3>
            <div style={{ fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 2 }}>Sinh từ dự trù tối ưu · leadtime {group.leadtime} ngày · giá đã gồm CTKM dòng{orderPct ? ` + CK toàn đơn ${orderPct}%` : ''}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          {warns.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#FFFBF0', border: '1px solid #F5E0A8', borderRadius: 12, padding: '11px 14px', marginBottom: 16 }}>
              <span style={{ color: 'var(--dv-yellow-600)', flex: 'none', marginTop: 1 }}><IconAlertTriangle size={16} /></span>
              <div style={{ fontSize: 12.5, color: 'var(--dv-ink)', lineHeight: 1.5 }}>{warns.map((l) => <div key={l.sku}><b>{l.name}:</b> {l.warn}</div>)}</div>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border-default)', overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead><tr style={{ background: 'var(--dv-mist)' }}>
                <th style={{ ...th, textAlign: 'left' }}>Sản phẩm</th><th style={th}>SL cần mua</th><th style={th}>SL tặng</th><th style={th}>Đơn giá</th><th style={th}>%CTKM</th><th style={th}>Giá sau KM</th><th style={th}>Thành tiền</th>
              </tr></thead>
              <tbody>
                {buyRows.map((r) => (
                  <tr key={r.sku} style={{ borderTop: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '10px 12px' }}><div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{r.sku}</div></td>
                    <td style={{ ...td, fontWeight: 700 }}>{oNUM(r.qty)}</td>
                    <td style={{ ...td, color: r.giftQty ? 'var(--dv-yellow-600)' : 'var(--dv-ink-faint)', fontWeight: r.giftQty ? 700 : 400 }}>{r.giftQty || '—'}</td>
                    <td style={td}>{oVND(r.price)}</td>
                    <td style={{ ...td, color: r.pct ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)', fontWeight: r.pct ? 700 : 400 }}>{r.pct ? `−${r.pct}%` : '—'}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{oVND(r.priceAfter)}</td>
                    <td style={{ ...td, fontWeight: 800 }}>{oVND(r.amount)}</td>
                  </tr>
                ))}
                {giftRows.map((gr) => (
                  <tr key={gr.sku} style={{ borderTop: '1px dashed var(--border-strong)', background: 'rgba(253,184,19,.06)' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 999, background: 'var(--dv-yellow)', color: 'var(--dv-green)', fontWeight: 800, fontSize: 10, fontFamily: 'var(--font-display)' }}>TẶNG</span>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{gr.name}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{gr.invoiced ? 'Có hoá đơn — giá 0' : 'Không hoá đơn'}</div>
                    </td>
                    <td style={{ ...td, fontWeight: 700 }}>{oNUM(gr.qty)}</td>
                    <td style={td}>—</td>
                    <td style={{ ...td, color: 'var(--dv-ink-faint)' }}>0₫</td>
                    <td style={td}>—</td>
                    <td style={{ ...td, color: 'var(--dv-ink-faint)' }}>0₫</td>
                    <td style={{ ...td, color: 'var(--dv-ink-faint)' }}>0₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tổng kết */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border-default)', padding: '14px 18px' }}>
            {[['Tổng trước KM', oVND(subTotal), null],
              ['Chiết khấu theo dòng', '−' + oVND(lineDiscount), 'var(--dv-green-bright)'],
              orderPct ? [`CK toàn đơn ${orderPct}% (${group.minOrder.id})`, '−' + oVND(orderDiscount), 'var(--dv-green-bright)'] : null,
              giftValue ? ['Giá trị hàng tặng (quy đổi)', oVND(giftValue), 'var(--dv-yellow-600)'] : null,
            ].filter(Boolean).map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                <span style={{ color: 'var(--dv-ink-soft)' }}>{l}</span><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: c || 'var(--dv-ink)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 2px', borderTop: '1px solid var(--border-default)', marginTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15 }}>Tổng sau KM</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--dv-green)' }}>{oVND(grand)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', background: '#fff', borderTop: '1px solid var(--border-default)', flex: 'none' }}>
          <Button variant="secondary" size="md" onClick={onClose}>Đóng</Button>
          <Button variant="primary" size="md" iconRight={<IconSend size={15} />} onClick={() => {
            if (window.OpsStore) {
              window.OpsStore.set((st) => ({ approvals: [{
                id: 'PO-KM-' + Math.floor(100 + Math.random() * 900), kind: 'buy', title: `Đơn mua — ${group.ncc} (CTKM)`,
                lines: buyRows.length + giftRows.length, value: grand, by: 'Trần Thị Mai', role: 'Mua hàng', at: 'Vừa xong', state: 'pending',
                ncc: group.ncc, leadtime: group.leadtime, debt: 0, debtLimit: 300000000, budget: 418000000, budgetCap: 500000000,
                reason: `Sinh từ Dự trù tối ưu CTKM: ${buyRows.filter((r) => r.pct > 0).length} dòng có CK, ${giftRows.length} dòng tặng${orderPct ? `, CK toàn đơn ${orderPct}%` : ''}. Giá đã gồm CTKM.`,
                items: buyRows.map((r) => ({ sku: r.sku, name: r.name, qty: r.qty, unit: r.unit, price: Math.round(r.priceAfter), onHand: 0, rop: 0, abc: 'A' })),
              }, ...st.approvals] }));
            }
            onSent(group.ncc);
          }}>Gửi duyệt</Button>
        </div>
      </div>
    </div>
  );
}
window.PromoPoDrawer = PromoPoDrawer;

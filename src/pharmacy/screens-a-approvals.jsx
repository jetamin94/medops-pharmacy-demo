/* Pharmacy screens A3 — Chờ duyệt (chi tiết · hàng duyệt · đề xuất của bộ máy).

   ── CẮT TỆP 2026-08-30 (Jet chốt) ─────────────────────────────────────────────
   `screens-a.jsx` cũ gộp ba màn, phình tới 113 KB và ĐÓNG BĂNG: công cụ ghi tệp của
   Claude Design không có chế độ vá, phải phát lại toàn bộ tệp trong một lời gọi, nên
   trên ~100 KB thì không lượt trả lời nào ghi nổi — sửa một dòng cũng không.
   Cắt theo đúng ba mục tệp đã tự chia. MÀN HÌNH KHÔNG ĐỔI MỘT CHẤM.

   Phân giải tên: mọi `function` khai ở cấp cao nhất của một script babel đều tự thành
   thuộc tính của `window` (đã đo trên prototype đang chạy: `window.dvSourceLeftText`
   là hàm dù không dòng nào gán nó). Nên A2/A3 gọi được hàm dùng chung của A1 —
   ở đây là `dvEvidence`, `StoreChips`, `dvSourceLeftText`. Mọi lời gọi đều nằm trong hàm render.
   Không `const`/`let` cấp cao nhất nào bị dùng chéo phần (đã quét).

   ⚠ Giữ mỗi phần DƯỚI 60 KB. Vượt là đóng băng lại. */

/* ============ APPROVALS ============ */
function PriceVarianceDetail({ a }) {
  const { VND, NUM } = window;
  const { IconInfo } = window;
  const totalVar = a.items.reduce((s, it) => s + (it.invPrice - it.poPrice) * it.qty, 0);
  return (
    <div style={{ borderTop: '1px solid var(--border-default)', background: '#fafbfb', padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 14, fontSize: 13, color: 'var(--dv-ink)', lineHeight: 1.5 }}>
        <span style={{ color: 'var(--dv-green-bright)', display: 'inline-flex', marginTop: 1, flex: 'none' }}><IconInfo size={16} /></span>
        <span><b>Lý do:</b> {a.reason} — từ phiếu nhập kho <b>{a.grn}</b>.</span>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>
            {['Sản phẩm', 'SL nhận', 'Giá ĐH (PO)', 'Giá HĐ', 'Lệch/đv', 'Tổng lệch'].map((h, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 14px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {a.items.map((it) => { const d = it.invPrice - it.poPrice; return (
              <tr key={it.sku} style={{ borderTop: '1px solid var(--border-default)' }}>
                <td style={{ padding: '9px 14px' }}><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)' }}>{it.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{it.sku}</div></td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{NUM(it.qty)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{VND(it.poPrice)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: '#8a6a00' }}>{VND(it.invPrice)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#9c2b22' }}>{d > 0 ? '+' : ''}{VND(d)} <span style={{ fontWeight: 400, color: 'var(--dv-ink-faint)' }}>({(it.diffPct * 100).toFixed(1)}%)</span></td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: '#9c2b22' }}>{d > 0 ? '+' : ''}{VND(d * it.qty)}</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nhà cung cấp</div><div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--dv-ink)' }}>{a.ncc}</div></div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tổng chên lệch phải đối soát</div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: '#9c2b22' }}>{totalVar > 0 ? '+' : ''}{VND(totalVar)}</div></div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 10 }}>Duyệt = chấp nhận giá hóa đơn & ghi công nợ theo giá mới. Từ chối = giữ giá PO, yêu cầu NCC điều chỉnh hóa đơn.</div>
    </div>
  );
}

function ApprovalDetail({ a }) {
  if (a.kind === 'price') return <PriceVarianceDetail a={a} />;
  const { VND, NUM } = window;
  const { IconInfo, IconArrowRight, IconAlertTriangle, IconStore } = window;
  const isBuy = a.kind === 'buy';
  const [byStore, setByStore] = React.useState(false);
  const [expl, setExpl] = React.useState(null); // sku đang mở bằng-chứng engine (JET-151)
  /* [T30] Cùng hàm với Đề xuất mua (`dvEvidence`, đầu file) — không giữ bản chép thứ hai ở đây. */
  const evidenceOf = (it) => dvEvidence(it, a.leadtime);
  const debtPct = isBuy ? a.debt / a.debtLimit : 0;
  const debtAfter = isBuy ? (a.debt + a.value) / a.debtLimit : 0;
  const budgetPct = isBuy ? a.budget / a.budgetCap : 0;
  return (
    <div style={{ borderTop: '1px solid var(--border-default)', background: '#fafbfb', padding: '16px 20px' }}>
      {/* reason */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 14, fontSize: 13, color: 'var(--dv-ink)', lineHeight: 1.5 }}>
        <span style={{ color: 'var(--dv-green-bright)', display: 'inline-flex', marginTop: 1, flex: 'none' }}><IconInfo size={16} /></span>
        <span><b>Lý do đề xuất:</b> {a.reason}</span>
      </div>

      {/* line items */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-faint)' }}>Chi tiết dòng hàng ({a.items.length})</span>
        {isBuy && <button onClick={() => setByStore((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--border-default)', background: byStore ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', padding: '5px 11px', borderRadius: 999, fontWeight: 700, fontSize: 12, color: 'var(--dv-green)' }}><IconStore size={13} />{byStore ? 'Ẩn phân bổ cửa hàng' : 'Tách theo cửa hàng'}</button>}
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border-default)', background: '#fff', marginBottom: 14 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>
            {(isBuy ? ['Sản phẩm', 'ABC', 'Tồn / ROP', 'SL đặt', 'Đơn giá', 'Thành tiền'] : ['Sản phẩm', 'ABC', 'Tồn 2 đầu (ngày)', 'SL chuyển', 'Đơn giá', 'Giá trị']).map((h, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : i === 1 ? 'center' : 'right', padding: '8px 14px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {a.items.map((it) => {
              const abcColor = it.abc === 'A' ? 'var(--dv-green)' : it.abc === 'B' ? 'var(--dv-yellow-600)' : 'var(--dv-ink-soft)';
              const abcBg = it.abc === 'A' ? 'var(--dv-green-50)' : it.abc === 'B' ? 'var(--dv-yellow-100)' : 'var(--dv-mist)';
              return (
                <React.Fragment key={it.sku}>
                <tr style={{ borderTop: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '9px 14px' }}><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)' }}>{it.name}
                    {/* [T05] SKU mới — đề xuất đầu tiên nên duyệt tay */}
                    {it.newSku && <span title="Chưa đủ lịch sử bán — đề xuất đầu tiên nên duyệt tay" style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', padding: '1px 7px', borderRadius: 999, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Mới</span>}
                    {/* [T16] ĐÃ GỠ badge ở đây cùng lúc với màn Đề xuất mua — xem chú thích ở đó. */}
                  </div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{it.sku}</div></td>
                  <td style={{ padding: '9px 14px', textAlign: 'center' }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11.5, color: abcColor, background: abcBg, padding: '1px 7px', borderRadius: 5 }}>{it.abc}</span></td>
                  {isBuy
                    ? <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}><span style={{ color: it.onHand < it.rop ? '#C5372C' : 'var(--dv-ink)', fontWeight: 700 }}>{NUM(it.onHand)}</span><span style={{ color: 'var(--dv-ink-faint)' }}> / {NUM(it.rop)}</span></td>
                    : <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}><span title={it.fromDoi == null ? 'Phiếu chưa mang số ngày tồn của nguồn' : undefined} style={{ color: it.fromDoi == null ? 'var(--dv-ink-faint)' : 'var(--dv-green-bright)' }}>{it.fromDoi == null ? '—' : it.fromDoi}</span> <span style={{ color: 'var(--dv-ink-faint)' }}>→</span> <span style={{ color: '#C5372C', fontWeight: 700 }}>{it.toDoi}</span></td>}
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>
                    {NUM(it.qty)} <span style={{ color: 'var(--dv-ink-faint)', fontWeight: 400 }}>{it.unit}</span>
                    {isBuy && <button onClick={() => setExpl(expl === it.sku ? null : it.sku)} title="Vì sao SL này?" style={{ marginLeft: 7, border: '1px solid ' + (expl === it.sku ? 'var(--dv-green)' : 'var(--border-strong)'), background: expl === it.sku ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', width: 20, height: 20, borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', verticalAlign: 'middle' }}>?</button>}
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{VND(it.price)}</td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700 }}>{VND(it.qty * it.price)}</td>
                </tr>
                {isBuy && expl === it.sku && (() => { const ev = evidenceOf(it); return (
                  <tr style={{ background: 'var(--dv-green-900, #003328)' }}><td colSpan={6} style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                        <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--dv-yellow)', marginBottom: 7 }}>Vì sao đặt {NUM(it.qty)} {it.unit}? · phép thế engine</div>
                        {/* [T30/T03] Tầng tính: kho tổng theo ADS, tầng chi nhánh theo Percentile (ô ma trận) */}
                        <div style={{ fontSize: 11, lineHeight: 1.55, color: 'rgba(255,255,255,.72)', marginBottom: 6 }}>Kho tổng — luôn tính theo Tốc độ (ADS); tầng chi nhánh dùng Percentile theo ô.</div>
                        {it.sparse && <div style={{ fontSize: 11, lineHeight: 1.55, color: 'rgba(255,255,255,.72)', marginBottom: 6 }}>SKU bán thưa → tầng chi nhánh tính Percentile.</div>}
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.75, color: 'rgba(255,255,255,.92)' }}>
                          ADS ≈ <b style={{ color: 'var(--dv-yellow)' }}>{ev.ads}</b>/ngày · leadtime {ev.lead}n · SS {NUM(ev.ss)} · đệm lớp {it.abc} = {ev.buf}n<br />
                          Max = {ev.ads}×({ev.lead}+{ev.buf}) + {NUM(ev.ss)} = <b style={{ color: 'var(--dv-yellow)' }}>{NUM(ev.max)}</b><br />
                          Cần = Max − tồn {NUM(it.onHand)} − đang về {NUM(ev.onOrder)} = {NUM(ev.raw)}{ev.moq > 1 ? <> → làm tròn MOQ {ev.moq} = <b style={{ color: 'var(--dv-yellow)' }}>{NUM(it.qty)}</b></> : <> ≈ <b style={{ color: 'var(--dv-yellow)' }}>{NUM(it.qty)}</b></>}
                          {/* [T06] Sàn Min ≥ 1 (luật sàn) — chỉ hiện khi dòng có cờ floorApplied */}
                          {it.floorApplied && <><br />Sàn Min ≥ 1 đè: Min 0 → 1 (có bán trong kỳ).</>}
                        </div>
                      </div>
                      <div style={{ flex: '0 1 220px', fontSize: 11.5, lineHeight: 1.6, color: 'rgba(255,255,255,.72)' }}>
                        Giá lấy từ <b style={{ color: '#fff' }}>bảng giá {a.ncc}</b> (hiệu lực) · gom vào đơn này vì {a.ncc} là NCC mặc định của SKU.<br />Tham số: hồ sơ “Mặc định” · xem Cài đặt → Chính sách theo loại hàng.
                      </div>
                    </div>
                  </td></tr>
                ); })()}
                {isBuy && byStore && <tr style={{ background: '#fafbfb' }}><td colSpan={6} style={{ padding: '4px 14px 10px 14px' }}><window.StoreChips sku={it.sku} qty={it.qty} /></td></tr>}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* decision context */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        {isBuy ? <>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '11px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Nhà cung cấp · leadtime</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--dv-ink)' }}>{a.ncc}</div>
            <div style={{ fontSize: 12, color: 'var(--dv-ink-soft)' }}>Giao sau {a.leadtime} ngày</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '11px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>Công nợ NCC sau đơn này</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: debtAfter > 0.85 ? '#C5372C' : 'var(--dv-ink)' }}>{VND(a.debt + a.value)}</span><span style={{ fontSize: 11, color: 'var(--dv-ink-faint)' }}>/ {VND(a.debtLimit)}</span></div>
            <div style={{ height: 5, borderRadius: 999, background: '#EEF0EF', marginTop: 5, overflow: 'hidden', position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 0, width: `${Math.min(100, debtPct * 100)}%`, background: 'var(--dv-green-bright)' }} />
              <span style={{ position: 'absolute', inset: 0, left: `${Math.min(100, debtPct * 100)}%`, width: `${Math.min(100 - debtPct * 100, (debtAfter - debtPct) * 100)}%`, background: debtAfter > 0.85 ? '#C5372C' : 'var(--dv-yellow-600)' }} />
            </div>
            <div style={{ fontSize: 11, color: debtAfter > 0.85 ? '#C5372C' : 'var(--dv-ink-faint)', marginTop: 3, fontWeight: debtAfter > 0.85 ? 700 : 400 }}>{Math.round(debtAfter * 100)}% hạn mức{debtAfter > 0.85 ? ' · vượt ngưỡng cảnh báo' : ''}</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '11px 14px' }}>
            <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Ngân sách mua kỳ này</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{VND(a.budget)} <span style={{ fontSize: 11, color: 'var(--dv-ink-faint)' }}>/ {VND(a.budgetCap)}</span></div>
            <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', marginTop: 3 }}>Còn {VND(a.budgetCap - a.budget)} khả dụng</div>
          </div>
        </> : <>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '11px 14px', gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Từ (thừa)</div><div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--dv-green)' }}>{a.from}</div></div>
              <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconArrowRight size={18} /></span>
              <div><div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Đến (thiếu)</div><div style={{ fontSize: 13.5, fontWeight: 700, color: '#C5372C' }}>{a.to}</div></div>
            </div>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: a.kiotviet ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)' }}>{a.kiotviet ? '● Sẽ ghi KiotViet 2 điểm' : '○ Ghi tay KiotViet'}</span>
          </div>
          {/* [T24] Số dư NGUỒN sau chuyển. Bản trước sai hai chỗ: "Chỉ lấy phần DƯ trên Max của
              nguồn" KHÔNG đúng khi nguồn là kho tổng (fixture DC-0043 Kho tổng → Gò Vấp đang nằm
              ngay trong hàng chờ), và con số đi kèm là ƯỚC LƯỢNG từ `fromDoi` kẹp `Math.max(0, …)`
              nên không bao giờ âm — không tra ngược được, không bao giờ thấy cảnh báo. Nay: phiếu
              MANG THEO tồn nguồn thật thì tính thật, âm thì nói là âm; không mang thì nói thẳng là
              chưa tính được. Chỉ tính cho phiếu MỘT dòng: tồn nguồn là số theo từng SKU. */}
          {(() => {
            const one = a.items.length === 1 ? a.items[0] : null;
            if (one && typeof a.fromOnHand === 'number') {
              const r = dvSourceLeftText(a.fromIsWh, a.fromOnHand, a.fromMax, one.qty);
              return <div style={{ gridColumn: '1 / -1', fontSize: 12, color: r.warn ? '#C5372C' : 'var(--dv-ink-soft)', fontWeight: r.warn ? 600 : 400, lineHeight: 1.5 }}>{r.text}</div>;
            }
            return (
              <div title="Kho tổng cấp cả phần dưới Max của chính nó (sẵn = toàn bộ tồn); điểm bán chỉ cấp phần dư TRÊN Max. Phiếu này chưa mang tồn nguồn nên không suy ra được số còn lại." style={{ gridColumn: '1 / -1', fontSize: 12, color: 'var(--dv-ink-faint)', lineHeight: 1.5 }}>
                Phiếu chưa mang tồn của nguồn — chưa tính được số còn lại sau chuyển{a.items.length > 1 ? ' (phiếu nhiều dòng: tồn tính theo từng mã)' : ''}.
              </div>
            );
          })()}
        </>}
      </div>
    </div>
  );
}

/* DVP-328: chính sách ngưỡng duyệt — MỘT nguồn cho cả dòng chính sách, badge cấp duyệt và logic duyệt hàng loạt.
   Ngưỡng là cấu hình theo tenant (Cài đặt → Duyệt & quy trình), nên hiển thị là "chính sách hiện hành", không phải luật chung. */
const AUTO_BELOW = 20000000;
const TWO_LEVEL_ABOVE = 100000000; // khớp cfg.twoLevelAbove (Settings) — đơn ≥100tr cần 2 cấp duyệt
const levelOf = (v) => v < AUTO_BELOW ? { k: 'auto', label: 'Tự động', bg: 'var(--dv-green-50)', fg: 'var(--dv-green)' } : v < TWO_LEVEL_ABOVE ? { k: 'l1', label: '1 cấp', bg: 'var(--dv-yellow-100)', fg: 'var(--dv-yellow-600)' } : { k: 'l2', label: '2 cấp', bg: '#F8E0DD', fg: '#9c2b22' };
function ApprovalRow({ a, onAct }) {
  const { VND } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconCart, IconTransfer, IconCheck, IconX, IconChevronDown, IconEye, IconReceive } = window;
  const [open, setOpen] = React.useState(false);
  const done = a.state === 'sent' || a.state === 'rejected';
  const awaitingL2 = a.state === 'awaiting_l2';
  const needs2 = a.value >= TWO_LEVEL_ABOVE;
  const Icon = a.kind === 'buy' ? IconCart : a.kind === 'price' ? IconReceive : IconTransfer;
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: `1px solid ${open ? 'var(--dv-green-100)' : 'var(--border-default)'}`, boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setOpen((o) => !o)}>
        <span style={{ width: 42, height: 42, borderRadius: 11, background: a.kind === 'buy' ? 'var(--dv-green-50)' : 'var(--dv-yellow-100)', color: a.kind === 'buy' ? 'var(--dv-green)' : 'var(--dv-yellow-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon size={20} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--dv-ink)' }}>{a.title}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-faint)' }}>{a.id} · {a.lines} dòng · tạo bởi {a.by} ({a.role}) · {a.at}</div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 700, color: open ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}><IconEye size={15} />{open ? 'Ẩn chi tiết' : 'Chi tiết'}</span>
        {/* DVP-328: cấp duyệt + công nợ NCC ngay trên hàng — người duyệt biết vì sao phiếu này tới tay mình mà không phải mở chi tiết */}
        {(() => { const lv = levelOf(a.value); return <span title={`Chính sách: tự động <${VND(AUTO_BELOW)} · 1 cấp <${VND(TWO_LEVEL_ABOVE)} · 2 cấp ≥${VND(TWO_LEVEL_ABOVE)}`} style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: lv.bg, color: lv.fg, whiteSpace: 'nowrap', flex: 'none' }}>{lv.label}</span>; })()}
        {a.debt != null && a.debtLimit != null && (() => { const after = (a.debt + a.value) / a.debtLimit; const hot = after > 0.85; return (
          <span title={`Công nợ ${a.ncc} sau đơn này: ${VND(a.debt + a.value)} / ${VND(a.debtLimit)}`} style={{ minWidth: 92, flex: 'none' }}>
            <span style={{ display: 'block', fontSize: 10, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Công nợ NCC</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 12, color: hot ? '#C5372C' : 'var(--dv-ink-soft)' }}>{Math.round(after * 100)}%{hot ? ' ⚠' : ''}</span>
            <span style={{ display: 'block', height: 4, borderRadius: 999, background: '#EEF0EF', marginTop: 3, overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${Math.min(100, after * 100)}%`, background: hot ? '#C5372C' : 'var(--dv-green-bright)' }} /></span>
          </span>
        ); })()}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-ink)', minWidth: 120, textAlign: 'right' }}>{VND(a.value)}</div>
        <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}><IconChevronDown size={18} /></span>
      </div>

      {open && <ApprovalDetail a={a} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderTop: '1px solid var(--border-default)', background: open ? '#fafbfb' : 'transparent' }}>
        {done
          ? <span style={{ fontWeight: 700, fontSize: 13, color: a.state === 'sent' ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{a.state === 'sent' ? <><IconCheck size={16} />{a.kind === 'price' ? 'Đã duyệt chênh lệch' : 'Đã duyệt & gửi'}</> : <><IconX size={16} />Đã từ chối</>}</span>
          : awaitingL2
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--dv-ink-soft)' }}><span style={{ fontSize: 11, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '3px 9px', borderRadius: 999 }}>CHỜ CẤP 2</span>Cấp 1 đã duyệt ({a.decidedL1 || 'Mua hàng'}) · đơn ≥ {VND(TWO_LEVEL_ABOVE)} cần cấp 2.</span>
            : <span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{needs2 ? <><span style={{ fontSize: 11, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '3px 9px', borderRadius: 999, marginRight: 7 }}>2 CẤP</span>Đơn ≥ {VND(TWO_LEVEL_ABOVE)} — duyệt cấp 1 trước.</> : a.kind === 'buy' ? 'Duyệt sẽ gửi đơn tới NCC.' : a.kind === 'price' ? 'Duyệt = chấp nhận giá HĐ & ghi công nợ.' : 'Duyệt sẽ ghi điều chuyển vào KiotViet.'}</span>}
        {!done && <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={() => onAct(a.id, 'rejected', `Đã từ chối ${a.id}.`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', fontWeight: 600, fontSize: 13 }}><IconX size={15} />Từ chối</button>
          {awaitingL2
            ? <Button variant="primary" size="sm" onClick={() => onAct(a.id, 'sent', `Đã duyệt cấp 2 & gửi ${a.id}.`)}>Duyệt cấp 2 → Gửi</Button>
            : needs2
              ? <Button variant="primary" size="sm" onClick={() => onAct(a.id, 'awaiting_l2', `Đã duyệt cấp 1 ${a.id} — chuyển chờ cấp 2.`)}>Duyệt cấp 1</Button>
              : <Button variant="primary" size="sm" onClick={() => onAct(a.id, 'sent', `Đã duyệt & gửi ${a.id}.`)}>Duyệt → Gửi</Button>}
        </div>}
      </div>
    </div>
  );
}

/* DVP-329: gợi ý engine CHƯA phải phiếu — gộp chung hàng đợi khiến người dùng tưởng gợi ý đã là đơn.
   Nguồn: điều chuyển state='suggested' trong OpsStore (engine sinh, chưa ai tạo chứng từ). */
function EngineSuggestions({ setToast, setView }) {
  const { VND, NUM, IconTransfer, IconArrowRight, IconPlus } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const sug = window.OpsStore.use().transfers.filter((t) => t.state === 'suggested');
  if (!sug.length) return null;
  return (
    <section style={{ marginTop: 30 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--dv-ink-soft)', margin: 0 }}>Gợi ý từ engine · chưa tạo phiếu</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{sug.length}</span>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', margin: '0 0 12px', maxWidth: '82ch', lineHeight: 1.5 }}>Đây <b>chưa phải chứng từ</b> — engine tính ra và đề nghị, chưa ai tạo phiếu. Không duyệt trực tiếp được: phải tạo phiếu trước, rồi phiếu mới vào hàng chờ duyệt ở trên.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sug.map((t) => (
          <div key={t.id} style={{ background: 'repeating-linear-gradient(135deg, #fafbfb 0 10px, #fff 10px 20px)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-card)', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF0EF', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconTransfer size={17} /></span>
            <div style={{ flex: '1 1 260px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 700, color: 'var(--dv-ink)', flexWrap: 'wrap' }}>{t.name}<span style={{ fontSize: 10, fontWeight: 800, color: 'var(--dv-ink-soft)', background: '#EEF0EF', padding: '2px 8px', borderRadius: 999, letterSpacing: '.03em' }}>GỢI Ý</span></div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--dv-ink-soft)', marginTop: 3 }}>{t.from}<IconArrowRight size={13} />{t.to} · {NUM(t.qty)} {t.unit || 'hộp'}</div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 96 }}><div style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Giá trị</div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{VND(t.value || 0)}</div></div>
            <Button variant="secondary" size="sm" iconRight={<IconPlus size={15} />} onClick={() => { window.OpsStore.set((st) => ({ transfers: st.transfers.map((x) => x.id === t.id ? { ...x, state: 'approved' } : x) })); setToast(`Đã tạo phiếu điều chuyển từ gợi ý ${t.id} — xem ở màn Điều chuyển.`); }}>Tạo phiếu</Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApprovalsScreen({ setToast, setView }) {
  const { PageHeader, StatusTabs } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconSend } = window;
  const [tab, setTab] = React.useState('all');
  const [q, setQ] = React.useState('');
  const s = window.OpsStore.use();
  const rows = s.approvals;
  const filtered = rows.filter((r) => (tab === 'all' || r.kind === tab) && (r.id + r.title + (r.ncc || '') + (r.from || '') + (r.to || '')).toLowerCase().includes(q.toLowerCase()));
  const pending = rows.filter((r) => r.state === 'pending' || r.state === 'awaiting_l2');
  const act = (id, state, msg) => { window.OpsStore.set((st) => ({ approvals: st.approvals.map((x) => x.id === id ? { ...x, state, ...(state === 'awaiting_l2' ? { decidedL1: 'Bạn (Mua hàng)' } : {}) } : x) })); setToast(msg); };

  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1080, margin: '0 auto' }}>
      <PageHeader title="Chờ duyệt" subtitle="Hàng đợi hợp nhất các đơn mua nháp và phiếu điều chuyển. Mở chi tiết để xem dòng hàng, lý do đề xuất, công nợ NCC và ngân sách trước khi duyệt."
      actions={<Button variant="accent" size="sm" iconRight={<IconSend size={16} />} onClick={() => { let l2 = 0, credit = 0; window.OpsStore.set((st) => ({ approvals: st.approvals.map((x) => { if (x.state !== 'pending') return x; if (x.value >= 100000000) { l2++; return { ...x, state: 'awaiting_l2', decidedL1: 'Bạn (Mua hàng)' }; } if (x.debt != null && x.debtLimit != null && (x.debt + x.value) > x.debtLimit) { credit++; return x; } return { ...x, state: 'sent' }; }) })); const parts = []; if (l2) parts.push(`${l2} đơn ≥100tr chuyển chờ cấp 2`); if (credit) parts.push(`${credit} đơn vượt hạn mức công nợ giữ lại — mở chi tiết để xử lý`); setToast(parts.length ? `Đã duyệt & gửi đơn an toàn; ${parts.join(' · ')}.` : `Đã duyệt & gửi tất cả.`); }}>Duyệt &amp; gửi đơn an toàn ({pending.filter((r) => r.state === 'pending').length})</Button>} />

      <window.PipelineSteps steps={['Đề xuất (Mua/Kho)', 'Chờ duyệt (Phê duyệt)', 'Gửi NCC / Ghi KiotViet']} active={1} />

      {/* DVP-328: dòng chính sách ngưỡng — người duyệt hiểu ngay vì sao phiếu rơi vào tay mình */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--dv-mist)', borderRadius: 12, padding: '11px 16px', margin: '14px 0 16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--dv-ink-faint)' }}>Chính sách hiện hành</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--dv-ink)' }}>
          {[['Tự động', `< ${window.VND(AUTO_BELOW)}`, 'var(--dv-green-50)', 'var(--dv-green)'], ['1 cấp', `< ${window.VND(TWO_LEVEL_ABOVE)}`, 'var(--dv-yellow-100)', 'var(--dv-yellow-600)'], ['2 cấp', `≥ ${window.VND(TWO_LEVEL_ABOVE)}`, '#F8E0DD', '#9c2b22']].map(([l, r, bg, fg]) => (
            <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 11, fontWeight: 800, padding: '3px 9px', borderRadius: 999, background: bg, color: fg }}>{l}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-soft)' }}>{r}</span></span>
          ))}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--dv-ink-faint)' }}>Cấu hình theo chuỗi tại <b style={{ color: 'var(--dv-green)' }}>Cài đặt → Duyệt &amp; quy trình</b></span>
      </div>

      <div style={{ marginBottom: 14 }}>
        <StatusTabs items={[['all', 'Tất cả', rows.length], ['buy', 'Đơn mua', rows.filter((r) => r.kind === 'buy').length], ['transfer', 'Điều chuyển', rows.filter((r) => r.kind === 'transfer').length], ['price', 'Chênh lệch giá', rows.filter((r) => r.kind === 'price').length]]} value={tab} onChange={setTab} />
      </div>
      <window.Toolbar>
        <window.SearchBox value={q} onChange={setQ} placeholder="Tìm mã phiếu, NCC, điểm bán…" width={300} />
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{filtered.length} / {rows.length} phiếu</span>
      </window.Toolbar>

      {/* DVP-329: hai hàng đợi TÁCH BẠCH — phiếu đã tạo (duyệt được) vs gợi ý engine (chưa là phiếu) */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--dv-green)', margin: 0 }}>Phiếu đã tạo · chờ duyệt</h3>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{filtered.length}</span>
        <span style={{ fontSize: 12, color: 'var(--dv-ink-soft)' }}>— đã là chứng từ, duyệt là gửi đi</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && <window.EmptyState icon="IconClipboardCheck" title="Hàng chờ trống" hint="Không còn mục nào chờ duyệt ở bộ lọc này — đề xuất mới từ Mua hàng / Kho sẽ xuất hiện tại đây." />}
        {filtered.map((a) => <ApprovalRow key={a.id} a={a} onAct={act} />)}
      </div>
      <EngineSuggestions setToast={setToast} setView={setView} />
    </div>
  );
}
window.ApprovalsScreen = ApprovalsScreen;

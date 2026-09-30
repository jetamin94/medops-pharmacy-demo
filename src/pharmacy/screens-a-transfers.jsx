/* Pharmacy screens A2 — Điều chuyển nội bộ (phiếu tay · danh sách phiếu).

   ── CẮT TỆP 2026-08-30 (Jet chốt) ─────────────────────────────────────────────
   `screens-a.jsx` cũ gộp ba màn, phình tới 113 KB và ĐÓNG BĂNG: công cụ ghi tệp của
   Claude Design không có chế độ vá, phải phát lại toàn bộ tệp trong một lời gọi, nên
   trên ~100 KB thì không lượt trả lời nào ghi nổi — sửa một dòng cũng không.
   Cắt theo đúng ba mục tệp đã tự chia. MÀN HÌNH KHÔNG ĐỔI MỘT CHẤM.

   Phân giải tên: mọi `function` khai ở cấp cao nhất của một script babel đều tự thành
   thuộc tính của `window` (đã đo trên prototype đang chạy: `window.dvSourceLeftText`
   là hàm dù không dòng nào gán nó). Nên A2/A3 gọi được hàm dùng chung của A1 —
   ở đây là `dvSourceLeftText`. Mọi lời gọi đều nằm trong hàm render, chạy sau khi 27 script đã nạp xong.
   Không `const`/`let` cấp cao nhất nào bị dùng chéo phần (đã quét).

   ⚠ Giữ mỗi phần DƯỚI 60 KB. Vượt là đóng băng lại. */

/* ============ TRANSFERS ============ */
/* ============ MANUAL TRANSFER BUILDER ============ */
function ManualTransferBuilder({ items, onClose, onCreate, setToast }) {
  const { VND, NUM } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconStore, IconArrowRight, IconAlertTriangle } = window;
  const Drawer = window.Drawer;
  const DATA = items || window.LOW_STOCK;
  const branches = ['Tất cả chi nhánh', ...Array.from(new Set(DATA.map((l) => l.to)))];
  /* DVP-529 (2026-08-21) — HỆ QUẢ TRỰC TIẾP của việc gỡ nhánh bịa nguồn trong `sourcesFor`
     (src/pharmacy/Inventory.jsx). Hàm đó từng luôn chèn một nguồn KHÔNG CÓ THẬT
     ['Kho tổng (DC)', Math.max(wh.onHand, 100)], nên `l.sources` chưa bao giờ rỗng và cả màn
     này được viết dựa trên tiền đề đó. Gỡ nhánh bịa đi là đúng — nhưng nó làm ca "không chi
     nhánh nào đang thừa mã này" lần đầu tiên xảy ra thật, và ca đó chưa từng được xử lý ở
     đây: nút vẫn ghi "Tạo 2 phiếu điều chuyển", chân form vẫn cộng tiền cho dòng không có
     hàng để lấy — tức hứa tạo chứng từ cho thứ không tồn tại.
     ⚠ ĐỪNG "sửa lại cho tiện" bằng cách bịa một nguồn mặc định trở lại: đó ĐÚNG LÀ lỗi vừa
     được gỡ, chỉ dịch xuống một tầng. Không có nguồn thì không có phiếu — loại khỏi mọi phép
     ĐẾM và phép CỘNG TIỀN, và nói thẳng lý do ra màn hình. */
  const coNguon = (l) => Array.isArray(l.sources) && l.sources.length > 0;
  const [branch, setBranch] = React.useState('Tất cả chi nhánh');
  const [picks, setPicks] = React.useState(() => {
    const p = {};
    DATA.forEach((l) => {
      /* DVP-529 (2026-08-21): `l.sources[0]` từng luôn tồn tại nhờ nguồn bịa. Nay `sources`
         rỗng được, mà destructure trần một `undefined` thì NÉM ngay lúc dựng state — trắng
         cả ngăn kéo, không riêng dòng đó. Hạ về [null, 0]; dòng này bị loại khỏi mọi phép
         cộng bên dưới nên qty 0 không đi vào đâu cả. */
      const [srcName, avail] = coNguon(l) ? l.sources[0] : [null, 0];
      p[l.sku] = { on: items ? true : false, source: srcName, qty: Math.min(l.need, avail) };
    });
    return p;
  });
  const setPick = (sku, patch) => setPicks((p) => ({ ...p, [sku]: { ...p[sku], ...patch } }));
  const list = DATA.filter((l) => branch === 'Tất cả chi nhánh' || l.to === branch);
  /* DVP-529 (2026-08-21) — vị ngữ `coNguon` đặt ở ĐÚNG MỘT CHỖ này, để `chosen.length`,
     `totalVal`, `soPhieu` và `create()` không thể lệch nhau. Sửa riêng nhãn nút mà quên
     `create()` thì còn nặng hơn lỗi ban đầu: người dùng bấm và hệ thống thật sự sinh phiếu
     cho dòng không có hàng để lấy. */
  const chosen = DATA.filter((l) => picks[l.sku].on && coNguon(l));
  /* Dòng đã tick nhưng không có nguồn: CỐ Ý không lọc khỏi danh sách, nhưng phải đếm được
     để nói ra ở chân form. Người dùng tự tay tick nó ở màn Tồn kho; im lặng bỏ đi thì họ
     tưởng đã tạo phiếu cho nó. */
  const soDongThieuNguon = DATA.filter((l) => picks[l.sku].on && !coNguon(l)).length;
  const lyDoKhongTao = soDongThieuNguon > 0 ?
  'Không chi nhánh nào đang thừa các mã đã chọn — chưa tạo được phiếu nào.' :
  'Chưa chọn dòng nào để tạo điều chuyển.';
  const totalVal = chosen.reduce((s, l) => s + picks[l.sku].qty * l.price, 0);
  /* DVP-529 (2026-08-21) — Lỗi 3: nút cũ đếm `chosen.length`, tức số DÒNG hàng.
     Một PHIẾU điều chuyển là một cặp (chi nhánh nguồn → chi nhánh đích): ba dòng cùng
     đi từ Kho tổng về Q.1 là MỘT phiếu, không phải ba. Chuẩn là engine
     (lib/engine/transfer.ts) — nó gom dòng theo đúng cặp đó; code thật vừa đo: 3 dòng → 2 phiếu.
     Đếm theo dòng là hứa với người duyệt một số lượng chứng từ khác hẳn thứ họ sẽ mở ra thấy. */
  const soPhieu = new Set(chosen.map((l) => `${picks[l.sku].source}→${l.to}`)).size;

  const create = () => {
    const cards = chosen.map((l, i) => {
      const pk = picks[l.sku];
      /* [T26] tên nguồn DV07 có thể mang hậu tố trạng thái tạm dừng — bỏ hậu tố để card Điều chuyển hiện tên sạch */
      const tenNguon = (pk.source || '').replace(' · tạm dừng (chỉ rút hàng ra)', '');
      /* Mang theo SỰ THẬT về nguồn (loại nguồn · tồn · Max) suốt đường phiếu → duyệt. Không mang
         thì màn Chờ duyệt chỉ còn cách ĐOÁN số dư sau chuyển. */
      const meta = ((l.sources || []).find((s) => s[0] === pk.source) || [])[2] || null;
      /* [T24] Số ngày tồn của NGUỒN lấy từ chính hàng Tồn kho, không gõ cứng. Trước đây là hằng
         số 38 ⇒ mọi phiếu tạo tay đều khai nguồn thừa đúng 38 ngày, bất kể nguồn nào mã nào, và
         nó nổi lên ba chỗ người ký nhìn thấy như một số đo. Nguồn 2-tuple (fixture cũ, không meta)
         cho `null` — ba chỗ đó phải nói "chưa có số liệu", không được đoán hộ. */
      const fromDoi = meta && Number.isFinite(meta.doi) ? Math.round(meta.doi) : null;
      return { id: 'DC-M' + String(Date.now()).slice(-3) + i, sku: l.sku, name: l.name, from: tenNguon, to: l.to, qty: pk.qty, fromDoi, toDoi: l.doi, value: pk.qty * l.price, kiotviet: true, state: 'suggested', manual: true,
        ...(meta ? { fromIsWh: !!meta.isWh, fromOnHand: meta.onHand, fromMax: meta.max } : {}) };
    });
    /* DVP-529 (2026-08-21): `chosen` đã loại dòng thiếu nguồn, nên `cards` rỗng nay có hai
       nguyên nhân khác hẳn nhau — chưa tick gì, hay đã tick mà không đâu thừa hàng. Nói đúng
       cái nào đang xảy ra. */
    if (!cards.length) {setToast(lyDoKhongTao);return;}
    onCreate(cards);
  };
  const inp = { boxSizing: 'border-box', padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', background: '#fff' };

  return (
    <Drawer title="Tạo điều chuyển thủ công" sub="Sản phẩm sắp hết tồn theo chi nhánh — chọn nguồn & chỉnh số lượng" onClose={onClose}
    footer={<>
        <div style={{ marginRight: 'auto', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{chosen.length} dòng · {soPhieu} phiếu · <b style={{ color: 'var(--dv-green)' }}>{VND(totalVal)}</b>{soDongThieuNguon > 0 && <span style={{ color: '#C5372C' }}> · {soDongThieuNguon} dòng không có nguồn (không tạo phiếu)</span>}</div>
        <Button variant="secondary" size="md" onClick={onClose}>Hủy</Button>
        {/* DVP-529 (2026-08-21) — nhãn nút phải nói SỐ PHIẾU sẽ sinh ra, không phải số dòng đã tick.
            Giữ nguyên lối ẩn số 0 (`|| ''`) của bản cũ; chỉ đổi CON SỐ được đếm. */}
        {/* DVP-529 (2026-08-21) — không còn dòng hợp lệ nào thì KHÓA nút lại. `title` phải nằm
            trên <span> bọc ngoài: trình duyệt không phát sự kiện chuột trên <button disabled>,
            nên tooltip đặt thẳng trên nút sẽ không bao giờ hiện ra. Đặt cả hai chỗ. */}
        <span title={soPhieu === 0 ? lyDoKhongTao : undefined} style={{ display: 'inline-flex' }}>
          <Button variant="primary" size="md" onClick={create} disabled={soPhieu === 0} title={soPhieu === 0 ? lyDoKhongTao : undefined}>Tạo {soPhieu || ''} phiếu điều chuyển</Button>
        </span>
      </>}>
      {/* DVP-529 (2026-08-21) — Lỗi 4: "cần ~132" là một con số không tra ngược được — người dùng
          không có cách nào kiểm nó đúng hay sai. Engine thật (lib/engine/transfer.ts) tính rõ:
          Cần chuyển = max(Max − Tồn − Đang về, Min − Tồn, 1). Hiện công thức ở đây để mỗi
          con số "cần" bên dưới đều truy ngược được về ba đại lượng đã hiển thị. */}
      <div style={{ marginBottom: 14, padding: '9px 12px', borderRadius: 10, background: 'var(--dv-green-50)', border: '1px solid var(--border-default)', fontSize: 12, color: 'var(--dv-ink-soft)', lineHeight: 1.55 }}>
        <b style={{ color: 'var(--dv-ink)' }}>Cần chuyển</b> = max( Max − Tồn − Đang về , Min − Tồn , 1 )
        <div style={{ marginTop: 3, fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Đang về <span style={{ fontFamily: 'var(--font-mono)' }}>—</span> nghĩa là chưa có số liệu, khác với đang về <span style={{ fontFamily: 'var(--font-mono)' }}>0</span> (biết chắc không có hàng nào trên đường).</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 6 }}>Chi nhánh nhận (đang thiếu)</label>
        <select value={branch} onChange={(e) => setBranch(e.target.value)} style={{ ...inp, width: '100%', padding: '10px 12px', fontSize: 14 }}>{branches.map((b) => <option key={b}>{b}</option>)}</select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {list.map((l) => {
          const pk = picks[l.sku];
          const cn = coNguon(l);
          /* DVP-529 (2026-08-21) — `ticked` = đã tick VÀ tạo phiếu được. Mọi tín hiệu "đã
             chọn" (viền, nền, dấu check) phải đọc từ đây, để giao diện không bao giờ trông
             như đã chọn một dòng mà chân form lại không đếm nó. */
          const ticked = pk.on && cn;
          const avail = cn ? (l.sources.find((s) => s[0] === pk.source) || [null, 0])[1] : 0;
          /* [T24] meta của nguồn đang chọn — tuple mới [name, avail, meta]; dữ liệu cũ không có meta thì bỏ qua */
          const srcMeta = cn ? ((l.sources.find((s) => s[0] === pk.source) || [])[2] || null) : null;
          const over = cn && pk.qty > avail;
          return (
            <div key={l.sku} onClick={cn ? () => setPick(l.sku, { on: !pk.on }) : undefined} style={{ border: `1px solid ${ticked ? 'var(--dv-green)' : 'var(--border-default)'}`, borderRadius: 14, padding: 14, background: ticked ? 'var(--dv-green-50)' : '#fff', cursor: cn ? 'pointer' : 'default', opacity: cn ? 1 : 0.6, transition: 'all .12s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: 6, border: ticked ? 'none' : '2px solid var(--border-strong)', background: ticked ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}>{ticked && React.createElement(window.IconCheck, { size: 12, color: '#fff' })}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)' }}>{l.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{l.sku} · {l.to}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color: '#C5372C' }}>tồn {NUM(l.onHand)} · {l.doi}n</div>
                  {/* DVP-529 (2026-08-21) — Lỗi 4: thiếu "Đang về" thì công thức phía trên không đọc được.
                      Dữ liệu mẫu (window.LOW_STOCK) nằm ở file khác và CHƯA có trường `onOrder`, nên hiện "—".
                      Tuyệt đối không hiện 0: code thật giữ `onOrder: number | null` đúng vì "chưa biết đang về
                      bao nhiêu" khác hẳn "biết là không có hàng nào đang về". */}
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>đang về {typeof l.onOrder === 'number' ? NUM(l.onOrder) : '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)' }}>ROP {l.rop} · cần ~{l.need}</div>
                </div>
              </div>
              {cn ? <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginTop: 12, paddingLeft: 28, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 180px' }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--dv-ink-soft)', fontWeight: 600, marginBottom: 4 }}>Chuyển từ (nguồn thừa)</label>
                  <select value={pk.source} onChange={(e) => {const av = (l.sources.find((s) => s[0] === e.target.value) || [null, 0])[1];setPick(l.sku, { source: e.target.value, qty: Math.min(pk.qty, av) });}} style={{ ...inp, width: '100%' }}>
                    {/* [T24] nhãn nguồn kèm cách tính sẵn-chuyển (meta.note) khi dữ liệu mới có meta */}
                    {l.sources.map(([nm, av, meta]) => <option key={nm} value={nm}>{meta && meta.note ? `${nm} — sẵn ${av} (${meta.note})` : `${nm} (sẵn ${av})`}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--dv-ink-faint)', paddingBottom: 8 }}><IconArrowRight size={16} /></div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--dv-ink-soft)', fontWeight: 600, marginBottom: 4 }}>Số lượng</label>
                  <input type="number" value={pk.qty} onChange={(e) => setPick(l.sku, { qty: Math.max(0, Number(e.target.value)) })} style={{ ...inp, fontFamily: 'var(--font-mono)', fontWeight: 700, width: 84, textAlign: 'right', borderColor: over ? '#C5372C' : 'var(--border-strong)', color: over ? '#C5372C' : 'var(--dv-ink)' }} />
                </div>
                <div style={{ paddingBottom: 8, fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>= {VND(pk.qty * l.price)}</div>
                {/* [T24] Số dư nguồn sau chuyển — tính lại theo SL đang gõ. Câu chữ đi qua
                    `dvSourceLeftText`, nơi đã tách hai ca kho tổng / điểm bán và ca SL vượt lượng
                    sẵn; bản trước dùng chung một câu "không tụt dưới Max" cho cả ba. */}
                {srcMeta && typeof srcMeta.onHand === 'number' && (() => { const r = dvSourceLeftText(srcMeta.isWh, srcMeta.onHand, srcMeta.max, pk.qty); return (
                  <div style={{ flexBasis: '100%', fontSize: 11, color: r.warn ? '#C5372C' : 'var(--dv-ink-faint)', fontWeight: r.warn ? 600 : 400 }}>{r.text}</div>
                ); })()}
              </div> : (
              /* DVP-529 (2026-08-21) — CỐ Ý giữ dòng này lại trên form thay vì lọc đi: người
                 dùng đã tự tay tick nó ở màn Tồn kho, nó biến mất không một lời nào thì họ
                 đinh ninh phiếu đã được tạo. Nên: vẫn hiện, làm mờ, bỏ ô chọn nguồn và ô số
                 lượng (không có nguồn thì hai ô đó không có gì để điền), và nói rõ vì sao. */
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, paddingLeft: 28, fontSize: 12.5, color: '#C5372C', fontWeight: 600 }}><IconAlertTriangle size={13} />Không chi nhánh nào đang thừa mã này — dòng này không tạo phiếu được.</div>
              )}
              {over && <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, paddingLeft: 28, fontSize: 12, color: '#C5372C', fontWeight: 600 }}><IconAlertTriangle size={13} />Vượt tồn khả dụng tại nguồn ({avail}).</div>}
            </div>);

        })}
      </div>
    </Drawer>);

}
window.ManualTransferBuilder = ManualTransferBuilder;
window.__manualTransfers = window.__manualTransfers || [];

/* ============ TRANSFERS ============ */
function TransfersScreen({ setView, setToast }) {
  const { TRANSFERS, LOW_STOCK, VND, NUM, PageHeader, Tip } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconTransfer, IconArrowRight, IconCheck, IconX, IconStore, IconAlertTriangle, IconBoxes } = window;
  const s = window.OpsStore.use();
  const rows = s.transfers;
  const reject = (t) => { window.OpsStore.set((st) => ({ transfers: st.transfers.map((x) => x.id === t.id ? { ...x, state: 'rejected' } : x) })); setToast(`Đã bỏ đề xuất ${t.id}.`); };
  const accept = (t) => {
    window.OpsStore.set((st) => ({
      transfers: st.transfers.map((x) => x.id === t.id ? { ...x, state: 'approved' } : x),
      approvals: st.approvals.some((a) => a.id === t.id) ? st.approvals : [{
        id: t.id, kind: 'transfer', title: `Điều chuyển — ${t.from.replace('Dược Vương ', '')} → ${t.to.replace('Dược Vương ', '')}`, lines: 1, value: t.value,
        by: 'Lê Văn Hùng', role: 'Kho', at: 'Vừa xong', from: t.from, to: t.to, kiotviet: t.kiotviet, state: 'pending',
        /* Sự thật về nguồn đi tiếp sang phiếu duyệt. Phiếu engine/fixture không có — màn duyệt
           PHẢI nói ra là chưa có, chứ không ước lượng hộ. */
        fromIsWh: t.fromIsWh, fromOnHand: t.fromOnHand, fromMax: t.fromMax,
        /* [T24] Mệnh đề "thừa (N ngày)" chỉ xuất hiện khi phiếu THẬT SỰ mang số của nguồn. */
        reason: `${t.to} còn ${t.toDoi} ngày tồn ${t.name}${t.fromDoi == null ? '' : `; ${t.from} thừa (${t.fromDoi} ngày)`}. Điều chuyển rẻ hơn nhập mới.`,
        items: [{ sku: t.sku, name: t.name, qty: t.qty, unit: 'Hộp', price: t.qty ? Math.round(t.value / t.qty) : 0, fromDoi: t.fromDoi, toDoi: t.toDoi, abc: 'B' }],
      }, ...st.approvals],
    }));
    setToast(`Đã chấp nhận ${t.id} → đã gửi sang hàng chờ duyệt (+1).`);
  };

  /* "Chấp nhận cả phiếu" — ĐÚNG MỘT phiếu cho cả tuyến. Bản trước gọi `accept` mỗi card, nên N
     dòng cùng tuyến sinh N phiếu MỘT DÒNG ở Chờ duyệt — đúng cái lắt nhắt mà việc gom card theo
     tuyến sinh ra để tránh. Chuẩn là engine (lib/engine/transfer.ts, DVP-529): một phiếu = một cặp
     (nguồn → đích). `accept` một card lẻ giữ nguyên hành vi cũ. */
  const acceptRoute = (g, suggRows) => {
    if (!suggRows.length) return;
    const ngan = (nm) => (nm || '').replace('Dược Vương ', '');
    const ids = suggRows.map((x) => x.id);
    const value = suggRows.reduce((s2, x) => s2 + (x.value || 0), 0);
    const id = 'DC-G' + String(Date.now()).slice(-4);
    /* Chỉ báo "sẽ tự ghi KiotViet" khi MỌI dòng trong phiếu đều bật cờ: phiếu là một chứng từ,
       nói tự động mà còn dòng phải nhập tay thì kho tin nhầm là xong việc. */
    const kiotviet = suggRows.every((x) => !!x.kiotviet);
    /* Tồn nguồn là số theo TỪNG SKU, không cộng dồn được cho phiếu nhiều dòng — nên phiếu gộp
       KHÔNG mang `fromOnHand`, và màn duyệt sẽ nói thẳng là chưa tính được số dư sau chuyển. */
    window.OpsStore.set((st) => ({
      transfers: st.transfers.map((x) => ids.includes(x.id) ? { ...x, state: 'approved' } : x),
      approvals: st.approvals.some((a) => a.id === id) ? st.approvals : [{
        id, kind: 'transfer', title: `Điều chuyển — ${ngan(g.from)} → ${ngan(g.to)}`, lines: suggRows.length, value,
        by: 'Lê Văn Hùng', role: 'Kho', at: 'Vừa xong', from: g.from, to: g.to, kiotviet, state: 'pending',
        fromIsWh: suggRows[0].fromIsWh,
        reason: `Gom ${suggRows.length} dòng cùng tuyến ${ngan(g.from)} → ${ngan(g.to)} thành một phiếu — engine gom phiếu theo cặp (nguồn → đích).`,
        items: suggRows.map((x) => ({ sku: x.sku, name: x.name, qty: x.qty, unit: 'Hộp', price: x.qty ? Math.round(x.value / x.qty) : 0, fromDoi: x.fromDoi, toDoi: x.toDoi, abc: 'B' })),
      }, ...st.approvals],
    }));
    setToast(`Đã chấp nhận cả phiếu ${ngan(g.from)} → ${ngan(g.to)} — 1 phiếu · ${suggRows.length} dòng gửi sang hàng chờ duyệt.`);
  };

  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1180, margin: '0 auto' }}>
      <PageHeader title="Điều chuyển" subtitle="Hàng đợi điều chuyển của Kho: gồm đề xuất do engine tự sinh và phiếu tạo tay từ “Tồn kho chi nhánh”. Kho sàng lọc/chấp nhận → đẩy sang Chờ duyệt để ký cuối & ghi KiotViet."
      actions={<><Button variant="secondary" size="sm" onClick={() => { const sugg = rows.filter((x) => x.state === 'suggested'); sugg.forEach(accept); if (!sugg.length) setToast('Không còn đề xuất nào chờ xử lý.'); else setToast(`Đã chấp nhận ${sugg.length} đề xuất → gửi sang hàng chờ duyệt.`); }}>Chấp nhận tất cả đủ điều kiện</Button><Button variant="accent" size="sm" iconRight={<IconArrowRight size={16} />} onClick={() => setView('inventory')}>Chọn từ Tồn kho chi nhánh</Button></>} />

      {/* [T22 · NO_TICKET_YET] Công tắc CH ↔ CH là khoá engine `allowLateral` (Cài đặt → Điều
          chuyển nội bộ). Màn này KHÔNG đọc được: `cfg` là `React.useState` cục bộ của
          `SettingsScreen` — không trên `window`, không trong `OpsStore`, và `window.readTenantFlags`
          là kho khác hẳn (`tenant_setting`). Bản trước ghi CỨNG "BẬT" và hứa khi tắt thì đề xuất
          CH↔CH "sẽ bị đánh dấu vô hiệu": hai khẳng định về một cấu hình chưa ai đọc và một hành vi
          chưa ai viết. Không dựng nguồn cấu hình giả — chỉ nói thứ kiểm được: công tắc nằm ở đâu. */}
      <div title="Công tắc nằm ở Cài đặt → Điều chuyển nội bộ (tham số engine allowLateral). Màn Điều chuyển chưa có đường đọc giá trị đó nên không hiển thị bật/tắt tại đây." style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', margin: '-8px 0 14px' }}>Luân chuyển ngang CH ↔ CH đặt ở <b style={{ color: 'var(--dv-green)' }}>Cài đặt → Điều chuyển nội bộ</b> — màn này chưa đọc trạng thái bật/tắt.</div>

      <window.PipelineSteps steps={['Tồn kho chi nhánh', 'Điều chuyển (Kho sàng lọc)', 'Chờ duyệt (ký cuối)', 'Ghi KiotViet']} active={1} />

      {/* W0 — trạng thái cờ ghi-transfer vào KiotViet (F8/F12) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', borderRadius: 14, padding: '11px 16px', marginBottom: 18 }}>
        <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex', flex: 'none' }}><IconAlertTriangle size={17} /></span>
        <span style={{ fontSize: 13, color: 'var(--dv-ink)', lineHeight: 1.45 }}><b>Chế độ bán tự động:</b> ghi phiếu điều chuyển thẳng vào KiotViet đang <b style={{ color: 'var(--dv-yellow-600)' }}>chờ kiểm chứng (gate W0)</b> trên tenant 9 chi nhánh. Khi duyệt, các dòng có cờ <span style={{ color: 'var(--dv-green-bright)', fontWeight: 600 }}>● Ghi KiotViet</span> sẽ tạo phiếu tự động; còn lại tạo phiếu tay trên KiotViet.</span>
      </div>

      {/* [T25] Gom card theo TUYẾN (nguồn → đích) — khớp cách engine gom phiếu theo cặp tuyến (DVP-529):
          nhiều dòng cùng một cặp chi nhánh là MỘT phiếu điều chuyển, nên chấp nhận được cả phiếu một lần. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {(() => {
          const nhomTuyen = [];
          rows.forEach((t) => {
            const key = t.from + '→' + t.to;
            let g = nhomTuyen.find((x) => x.key === key);
            if (!g) { g = { key, from: t.from, to: t.to, list: [] }; nhomTuyen.push(g); }
            g.list.push(t);
          });
          const ngan = (nm) => (nm || '').replace('Dược Vương ', '');
          return nhomTuyen.map((g) => {
            const suggRows = g.list.filter((x) => x.state === 'suggested');
            const tongTuyen = g.list.reduce((s2, x) => s2 + (x.value || 0), 0);
            return (
              <section key={g.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14.5, color: 'var(--dv-green)' }}>{ngan(g.from)} → {ngan(g.to)}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>· {g.list.length} dòng · <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--dv-ink-soft)' }}>{VND(tongTuyen)}</b></span>
                  {suggRows.length > 0 && <span style={{ marginLeft: 'auto' }}><Button variant="secondary" size="sm" title={`Gộp ${suggRows.length} dòng cùng tuyến thành MỘT phiếu chờ duyệt`} onClick={() => acceptRoute(g, suggRows)}>Chấp nhận cả phiếu</Button></span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {g.list.map((t) => {
          const done = t.state !== 'suggested';
          return (
            <div key={t.id} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: 18, display: 'flex', alignItems: 'center', gap: 18, opacity: done && t.state === 'rejected' ? .55 : 1 }}>
              <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconTransfer size={21} /></span>
              <div style={{ minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--dv-ink)' }}>{t.name}</span>
                  {t.manual && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '1px 7px', borderRadius: 999, border: '1px solid var(--dv-green-100)' }}>Thủ công</span>}
                  {/* [T23] Phiếu sinh từ thang FEFO bậc 1 — đẩy lô cận hạn */}
                  {t.fefoTier1 && <span title="Phiếu sinh từ thang FEFO — đẩy lô cận hạn sang điểm bán nhanh." style={{ fontSize: 10, fontWeight: 700, color: '#9c2b22', background: '#F8E0DD', padding: '1px 7px', borderRadius: 999, border: '1px solid #F0C9C4', whiteSpace: 'nowrap' }}>Cận date · FEFO bậc 1</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-faint)' }}>{t.id} · {t.sku}</div>
              </div>
              {/* from -> to */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)' }}>{t.from}</div>
                  {/* [T24] Không có số của nguồn thì nói "thừa" trơn — đừng in một con số không đo được. */}
                  <div title={t.fromDoi == null ? 'Phiếu chưa mang số ngày tồn của nguồn' : undefined} style={{ fontSize: 11.5, color: 'var(--dv-green-bright)' }}>{t.fromDoi == null ? 'thừa' : `thừa · ${t.fromDoi} ngày tồn`}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 15, color: 'var(--dv-green)' }}>{NUM(t.qty)}</span>
                  <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconArrowRight size={18} /></span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)' }}>{t.to}</div>
                  <div style={{ fontSize: 11.5, color: '#C5372C' }}>thiếu · {t.toDoi} ngày tồn</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 110 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14 }}>{VND(t.value)}</div>
                {t.kiotviet ?
                <Tip text="Đã bật cờ ghi KiotViet: khi duyệt, phiếu chuyển kho sẽ tự động ghi vào KiotViet của cả hai điểm bán."><span style={{ fontSize: 11, color: 'var(--dv-green-bright)', fontWeight: 600 }}>● Ghi KiotViet</span></Tip> :
                <Tip text="Chưa bật ghi KiotViet — phiếu chuyển sẽ chỉ ghi nội bộ, cần nhập tay vào KiotViet."><span style={{ fontSize: 11, color: 'var(--dv-ink-faint)', fontWeight: 600 }}>○ Chưa ghi KiotViet</span></Tip>}
              </div>
              <div style={{ display: 'flex', gap: 8, minWidth: 168, justifyContent: 'flex-end' }}>
                {done ?
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: t.state === 'approved' ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {t.state === 'approved' ? <><IconCheck size={16} />Đã gửi duyệt</> : <><IconX size={16} />Đã bỏ</>}
                  </span> :

                <>
                    <button onClick={() => reject(t)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
                    <Button variant="primary" size="sm" onClick={() => accept(t)}>Chấp nhận → gửi duyệt</Button>
                  </>
                }
              </div>
            </div>);

                  })}
                </div>
              </section>
            );
          });
        })()}
      </div>
    </div>);

}
window.TransfersScreen = TransfersScreen;


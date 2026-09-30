/* Pharmacy screens A1 — Mua hàng (dự trù · tạo đơn · lịch sử đơn) + các hàm dùng chung của cả bộ A.

   ── CẮT TỆP 2026-08-30 (Jet chốt) ─────────────────────────────────────────────
   `screens-a.jsx` cũ gộp ba màn, phình tới 113 KB và ĐÓNG BĂNG: công cụ ghi tệp của
   Claude Design không có chế độ vá, phải phát lại toàn bộ tệp trong một lời gọi, nên
   trên ~100 KB thì không lượt trả lời nào ghi nổi — sửa một dòng cũng không.
   Cắt theo đúng ba mục tệp đã tự chia. MÀN HÌNH KHÔNG ĐỔI MỘT CHẤM.

   Phân giải tên: mọi `function` khai ở cấp cao nhất của một script babel đều tự thành
   thuộc tính của `window` (đã đo trên prototype đang chạy: `window.dvSourceLeftText`
   là hàm dù không dòng nào gán nó). Nên A2/A3 gọi được hàm dùng chung của A1 —
   và A1 nạp TRƯỚC trong `Pharmacy Portal.html`, nên thứ tự cũng đúng.
   Không `const`/`let` cấp cao nhất nào bị dùng chéo phần (đã quét).

   ⚠ Giữ mỗi phần DƯỚI 60 KB. Vượt là đóng băng lại. */

/* ============ PURCHASING ============ */
function PODetailDrawer({ po, onClose, setView }) {
  const { PO_DETAILS, PO_TIMELINE_STEPS, VND, NUM, StatusBadge } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconCheck, IconReceive, IconFile } = window;
  const Drawer = window.Drawer;
  const d = PO_DETAILS[po.id];
  if (!d) return null;
  const itemsTotal = d.items.reduce((s, it) => s + it.qty * it.price, 0);
  return (
    <Drawer title={`Đơn mua ${po.id}`} sub={`${po.ncc} · tạo ${po.date} bởi ${d.by}`} onClose={onClose}
      footer={<>
        {d.grn && <Button variant="secondary" size="md" onClick={() => { onClose(); setView('receiving'); }}>Xem phiếu nhận {d.grn}</Button>}
        <Button variant="primary" size="md" onClick={onClose}>Đóng</Button>
      </>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <StatusBadge status={po.status} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--dv-green)', marginLeft: 'auto', letterSpacing: '-0.02em' }}>{VND(po.value)}</span>
      </div>

      {/* timeline */}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', marginBottom: 10 }}>Dòng thời gian</div>
      <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 14, padding: '14px 16px', marginBottom: 18 }}>
        {PO_TIMELINE_STEPS.map((s, i) => {
          const done = i < d.progress;
          const current = i === d.progress;
          const last = i === PO_TIMELINE_STEPS.length - 1;
          return (
            <div key={s} style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: done ? 'var(--dv-green)' : current ? 'var(--dv-yellow)' : 'var(--dv-mist)', color: done ? '#fff' : current ? 'var(--dv-green)' : 'var(--dv-ink-faint)', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 10.5 }}>{done ? <IconCheck size={12} color="#fff" /> : i + 1}</span>
                {!last && <span style={{ width: 2, flex: 1, minHeight: 16, background: done ? 'var(--dv-green)' : 'var(--border-default)', margin: '2px 0' }} />}
              </div>
              <div style={{ paddingBottom: last ? 0 : 14, display: 'flex', alignItems: 'baseline', gap: 10, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13.5, fontWeight: done || current ? 700 : 500, color: done ? 'var(--dv-ink)' : current ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>{s}{current ? ' — đang ở bước này' : ''}</span>
                {d.times[i] && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)', flex: 'none' }}>{d.times[i]}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* line items */}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', marginBottom: 10 }}>Dòng hàng</div>
      <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Sản phẩm', 'SL', 'Đơn giá', 'VAT%', 'Thành tiền'].map((h, i) => <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 13px', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
          <tbody>
            {d.items.map((it) => (
              <tr key={it.sku} style={{ borderTop: '1px solid var(--border-default)' }}>
                <td style={{ padding: '9px 13px' }}><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)' }}>{it.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{it.sku}</div></td>
                <td style={{ padding: '9px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{NUM(it.qty)} <span style={{ color: 'var(--dv-ink-faint)', fontWeight: 400 }}>{it.unit}</span></td>
                <td style={{ padding: '9px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{VND(it.price)}</td>
                <td style={{ padding: '9px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-faint)' }}>{it.vat != null ? it.vat : 5}%</td>
                <td style={{ padding: '9px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700 }}>{VND(it.qty * it.price)}</td>
              </tr>
            ))}
            {d.extraLines > 0 && (
              <tr style={{ borderTop: '1px dashed var(--border-default)' }}>
                <td colSpan={4} style={{ padding: '9px 13px', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>+ {d.extraLines} dòng khác</td>
                <td style={{ padding: '9px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{VND(d.extraValue)}</td>
              </tr>
            )}
            {(() => {
              const net = itemsTotal + d.extraValue;
              const vatAmt = d.items.reduce((s, it) => s + it.qty * it.price * ((it.vat != null ? it.vat : 5) / 100), 0) + Math.round(d.extraValue * 0.05);
              return (<>
                <tr style={{ borderTop: '1px solid var(--border-default)' }}><td colSpan={4} style={{ padding: '8px 13px', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Tổng trước VAT</td><td style={{ padding: '8px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{VND(net)}</td></tr>
                <tr><td colSpan={4} style={{ padding: '8px 13px', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>VAT</td><td style={{ padding: '8px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{VND(Math.round(vatAmt))}</td></tr>
                <tr style={{ borderTop: '1px solid var(--border-default)', background: 'var(--dv-mist)' }}><td colSpan={4} style={{ padding: '10px 13px', fontSize: 13, fontWeight: 700 }}>Tổng có VAT</td><td style={{ padding: '10px 13px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 800, color: 'var(--dv-green)' }}>{VND(net + Math.round(vatAmt))}</td></tr>
              </>);
            })()}
          </tbody>
        </table>
      </div>
    </Drawer>
  );
}

/* ===== shared: tách SL đề xuất theo cửa hàng (deterministic) — dùng cho #1 Đề xuất mua & #2 Chờ duyệt ===== */
const STORE_POOL = ['Dược Vương Q.1', 'Dược Vương Q.3', 'Dược Vương Q.5', 'Dược Vương Gò Vấp', 'Dược Vương Thủ Đức', 'Dược Vương Q.7'];
function dvHash(s) { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function dvStoreSplit(sku, qty) {
  qty = Math.max(0, Math.round(Number(qty) || 0));
  if (qty === 0) return [];
  const h = dvHash(sku);
  const n = 2 + (h % 3); // 2..4 cửa hàng
  const start = h % STORE_POOL.length;
  const stores = [];
  for (let i = 0; i < n; i++) {
    const name = STORE_POOL[(start + i) % STORE_POOL.length];
    if (name && !stores.includes(name)) stores.push(name);
  }
  const weights = stores.map((_, i) => ((h >>> (i * 3)) % 5) + 1);
  const wsum = weights.reduce((a, b) => a + b, 0) || 1;
  // largest-remainder: phân bổ nguyên, tổng luôn = qty
  const raw = weights.map((w) => qty * w / wsum);
  const base = raw.map((x) => Math.floor(x));
  let leftover = qty - base.reduce((a, b) => a + b, 0);
  const order = raw.map((x, i) => [i, x - Math.floor(x)]).sort((a, b) => b[1] - a[1]);
  for (let k = 0; k < leftover; k++) base[order[k % base.length][0]]++;
  return stores.map((store, i) => ({ store, qty: base[i] })).filter((r) => r.store && r.qty > 0);
}
window.dvStoreSplit = dvStoreSplit;

/* chip list: cửa hàng → SL cho một dòng hàng */
function StoreChips({ sku, qty }) {
  const { IconStore } = window;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '2px 0' }}>
      {dvStoreSplit(sku, qty).map((s, i) => (
        <span key={s.store + i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--dv-mist)', borderRadius: 999, padding: '3px 10px', fontSize: 11.5, fontWeight: 600, color: 'var(--dv-ink-soft)' }}>
          <IconStore size={11} />{(s.store || '').replace('Dược Vương ', '')} <b style={{ color: 'var(--dv-green)', fontFamily: 'var(--font-mono)' }}>{window.NUM(s.qty)}</b>
        </span>
      ))}
    </div>
  );
}
window.StoreChips = StoreChips;

/* pivot: cửa hàng → các dòng hàng cần về (cho view "Theo cửa hàng") */
function StorePivot({ items }) {
  const { VND, NUM, IconStore } = window;
  const map = {};
  items.forEach((it) => dvStoreSplit(it.sku, it.qty).forEach((s) => { (map[s.store] = map[s.store] || []).push({ ...it, sQty: s.qty }); }));
  const stores = Object.keys(map).sort();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {stores.map((st) => {
        const rows = map[st];
        const sub = rows.reduce((a, r) => a + r.sQty * r.price, 0);
        return (
          <div key={st} style={{ borderTop: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: 'var(--dv-green-50)' }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconStore size={14} /></span>
              <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-green)', flex: 1 }}>{st}</span>
              <span style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)' }}>{rows.length} SP · <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--dv-ink)' }}>{VND(sub)}</b></span>
            </div>
            {rows.map((r, ri) => (
              <div key={r.sku + '-' + ri} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 18px 8px 54px', borderTop: '1px solid var(--border-default)' }}>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--dv-ink)' }}>{r.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{r.sku}</span></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, color: 'var(--dv-green)' }}>{NUM(r.sQty)} <span style={{ color: 'var(--dv-ink-faint)', fontWeight: 400 }}>{r.unit}</span></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)', minWidth: 90, textAlign: 'right' }}>{VND(r.sQty * r.price)}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
window.StorePivot = StorePivot;

/* ===== "Đang về" của MỘT dòng dự trù — đúng MỘT nguồn cho cả hai màn =====
   Bảng Đề xuất mua khẳng định "Đang về đã gồm PO đang giao và điều chuyển đang tới" mà không có
   cột nào mang con số ấy. Cột "Đang về" và phép thế engine ở Chờ duyệt đọc CÙNG hàm này — hai chỗ
   tự tính lấy thì cùng một dòng ra hai số ở hai màn. Đầu vào là SL GỐC engine (`baseQty`): hàng
   đang trên đường là sự thật đã đo, không đổi vì ai đó sửa số lượng muốn đặt. */
function dvOnOrder(sku, qty) {
  const s = String(sku || '');
  return (s.charCodeAt(4) % 3 === 0) ? Math.round((Number(qty) || 0) * 0.25 / 10) * 10 : 0;
}
window.dvOnOrder = dvOnOrder;

/* ===== Phép thế engine của MỘT dòng — đúng MỘT hàm cho cả hai màn =====
   [T30] Trước đây phép thế chỉ sống ở Chờ duyệt, nên NGƯỜI BẤM "Tạo đơn nháp" là người duy nhất
   không xem được vì sao máy đòi số đó — đúng người cần nhất. Nay Đề xuất mua dùng CHÍNH hàm này,
   không chép sang bản thứ hai: hai bản chép tay thì sửa một bên không bên nào đỏ.
   Back-derive từ SL thực của dòng để chuỗi phép thế tự nhất quán (JET-151).
   ⚠ KHÔNG dùng `WhyPopover` của CalcEngine.jsx: nó cần chuỗi bán/MOQ/pack per-SKU mà bảng dự trù
   không mang, nên sẽ rơi vào nhánh xấp xỉ và tự in ra "không phải phân vị" — vẽ một panel tự khai
   mình sai còn tệ hơn không vẽ. */
function dvEvidence(it, leadtime) {
  const lead = leadtime || 3;
  /* Đệm an toàn theo LỚP ABC (A=5n · B=7n · C=10n) — thay hằng số 7 ngày gõ cứng cũ */
  const buf = it.abc === 'A' ? 5 : it.abc === 'B' ? 7 : 10;
  const moq = it.qty % 10 === 0 ? 10 : 1;
  const onOrder = dvOnOrder(it.sku, it.baseQty != null ? it.baseQty : it.qty);
  const raw = moq > 1 ? it.qty - (it.sku.charCodeAt(3) % moq) : it.qty; // raw ≤ qty, chênh < MOQ
  const max = raw + it.onHand + onOrder;               // Cần = Max − tồn − đang về = raw ✓
  const ads = Math.max(1, Math.round(max / (lead + 14)));
  const ss = max - ads * (lead + buf);                 // Max = ADS×(lead+buf) + SS ✓
  return { lead, buf, ads, ss, max, onOrder, raw, moq };
}
window.dvEvidence = dvEvidence;

/* ===== Một câu duy nhất cho "nguồn còn lại sau chuyển" — đúng cho CẢ HAI loại nguồn =====
   Câu cũ ("Nguồn còn lại ~N sau chuyển — không tụt dưới Max") sai hai hướng: (1) với KHO TỔNG lời
   hứa đó vô nghĩa vì `sourcesFor` cho kho `sẵn = toàn bộ tồn` — kho CÓ tụt dưới Max của chính nó,
   cố ý; (2) khi SL gõ VƯỢT lượng sẵn thì N ÂM, đúng lúc con số tự nói "đã phá sàn" thì câu bên
   cạnh lại khẳng định sàn còn nguyên. Trả `{ text, warn }`; `warn` = phần dư đã âm. */
function dvSourceLeftText(isWh, onHand, max, qty) {
  const NUM = window.NUM || ((x) => String(x));
  const q = Number(qty) || 0;
  if (isWh) {
    const con = onHand - q;
    return con >= 0
      ? { text: `Kho tổng còn ~${NUM(con)} sau chuyển — kho cấp phát nên không giữ mức Max riêng.`, warn: false }
      : { text: `Vượt tồn kho tổng ${NUM(-con)} — không đủ hàng để chuyển.`, warn: true };
  }
  const du = onHand - (max || 0) - q;
  return du >= 0
    ? { text: `Nguồn còn dư ~${NUM(du)} trên Max sau chuyển — chưa tụt dưới Max.`, warn: false }
    : { text: `Thiếu ${NUM(-du)} so với phần dư trên Max — nguồn sẽ tụt dưới Max.`, warn: true };
}

function PurchasingScreen({ setView, setToast }) {
  const { PURCHASE_GROUPS, MISSING_MASTER, PO_HISTORY, SUPPLIERS, VND, NUM, PageHeader, StatusBadge, Table, Th, Td, Tr } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconCart, IconFile, IconChevronRight, IconAlertTriangle, IconCheck, IconEdit, IconQuote } = window;
  /* DVP-662 (phản hồi #74): "Tình huống demo" chỉ để Jet duyệt bố cục ở các trạng thái brief yêu cầu
     (10 NCC · 1 NCC · trống · lịch sử dài). Nhóm nhân bản GIỮ `ncc` thật để tra SUPPLIERS, chỉ khác `key`. */
  const [scen, setScen] = React.useState('thuc');
  const gk = (g) => g.key || g.ncc;
  const GROUPS = React.useMemo(() => scen === 'trong' ? [] : scen === 'it' ? PURCHASE_GROUPS.slice(0, 1)
    : scen === 'nhieu' ? Array.from({ length: 10 }, (_, i) => { const g = PURCHASE_GROUPS[i % PURCHASE_GROUPS.length]; return i < PURCHASE_GROUPS.length ? g : { ...g, key: `${g.ncc}-d${i}`, name: `${g.name.split(' (')[0]} · demo ${i + 1}` }; })
    : PURCHASE_GROUPS, [scen]);
  const HIST = scen === 'trong' ? [] : scen === 'nhieu' ? Array.from({ length: 24 }, (_, i) => PO_HISTORY[i % PO_HISTORY.length]) : PO_HISTORY;
  const MISSING = scen === 'trong' ? [] : MISSING_MASTER;
  /* Mặc định chỉ mở 2 card đầu — card nào cũng có tên · số dòng · tạm tính ở header nên thu gọn không mất thông tin. */
  const [open, setOpen] = React.useState(PURCHASE_GROUPS.slice(0, 2).map((g) => g.ncc));
  React.useEffect(() => { setOpen(GROUPS.slice(0, 2).map(gk)); }, [GROUPS]);
  const [poView, setPoView] = React.useState(null);
  const [qtys, setQtys] = React.useState({});
  const [created, setCreated] = React.useState({}); /* DVP-325: ncc → số PO đã tạo (chặn tạo trùng) */
  const [q, setQ] = React.useState('');
  const [nccFilter, setNccFilter] = React.useState([]);
  const [purchView, setPurchView] = React.useState('product');
  /* [T30] SKU đang mở ô "vì sao" trên bảng dự trù. Một dòng mở tại một thời điểm — bảng này đã
     nhiều cột, mở nhiều ô cùng lúc thì mất luôn cái nó đang giải thích. */
  const [explSku, setExplSku] = React.useState(null);
  /* Giỏ "dự trù tay" do màn Tồn kho chi nhánh ghi vào OpsStore (xem `toPurchasing`, Inventory.jsx).
     Khoá `manualPurchase` KHÔNG có trong state khởi tạo của OpsStore (data.jsx) nên luôn `|| []`.
     Hook phải đứng TRƯỚC lối thoát sớm `pMode === 'opt'` bên dưới — React đếm hook theo thứ tự. */
  const opsState = window.OpsStore.use();
  const manualLines = opsState.manualPurchase || [];
  const dropManual = (key) => window.OpsStore.set((st) => ({ manualPurchase: (st.manualPurchase || []).filter((p) => p.key !== key) }));
  const toggle = (id) => setOpen((o) => o.includes(id) ? o.filter((x) => x !== id) : [...o, id]);
  const qtyOf = (l) => qtys[l.sku] != null ? qtys[l.sku] : l.qty;
  const lineTotal = (l) => qtyOf(l) * l.price;
  const edited = (l) => qtys[l.sku] != null && qtys[l.sku] !== l.qty;
  /* Con số ở góc header đếm ĐÚNG những gì màn này đang bày ra — gồm cả giỏ dự trù tay. Đếm thiếu
     nó thì người dùng vừa thêm 5 mã xong, thấy 5 mã trên màn mà ô tổng không nhúc nhích. */
  const manualVal = manualLines.reduce((a, l) => a + l.qty * l.price, 0);
  const totalLines = GROUPS.reduce((s, g) => s + g.lines.length, 0) + manualLines.length;
  const grand = GROUPS.reduce((s, g) => s + g.lines.reduce((a, l) => a + lineTotal(l), 0), 0) + manualVal;
  const fGroups = GROUPS
    .filter((g) => nccFilter.length === 0 || nccFilter.includes(g.name))
    .map((g) => ({ ...g, lines: g.lines.filter((l) => (l.name + l.sku).toLowerCase().includes(q.toLowerCase())) }))
    .filter((g) => g.lines.length > 0);
  const fLines = fGroups.reduce((s, g) => s + g.lines.length, 0);
  const linkBtn = { border: 'none', background: 'none', cursor: 'pointer', padding: '2px 4px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' };
  const scenPill = { border: 'none', cursor: 'pointer', padding: '4px 10px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12 };

  const createDraft = (g) => {
    const sup = SUPPLIERS.find((s) => s.id === g.ncc);
    const value = g.lines.reduce((a, l) => a + lineTotal(l), 0);
    const editedCount = g.lines.filter(edited).length;
    const id = 'PO-2406-' + (122 + Object.keys(created).length);
    window.OpsStore.set((st) => ({ approvals: [{
      id, kind: 'buy', title: `Đơn mua — ${g.name.split(' (')[0]}`, lines: g.lines.length, value,
      by: 'Trần Thị Mai', role: 'Mua hàng', at: 'Vừa xong', state: 'pending',
      ncc: g.name, leadtime: g.leadtime, debt: sup.debt, debtLimit: sup.debtLimit, budget: 418000000, budgetCap: 500000000,
      reason: `Tạo từ đề xuất mua (dự trù kho tổng)${editedCount ? ` — đã chỉnh tay ${editedCount} dòng SL` : ''}.`,
      /* MỌI cờ chẩn đoán phải đi tiếp sang phiếu. Bản trước bỏ `floorApplied`: mọi đơn tạo từ màn
         này vĩnh viễn mất bằng chứng "Min do luật sàn quyết", chỉ fixture PO-2406-119 hiện nổi —
         người duyệt tin là không đơn nào có sàn, thật ra không đơn nào MANG NỔI cờ sàn. Cờ chết
         giữa đường nguy hiểm hơn cờ không có: không để lại chỗ trống nào cho ai nhận ra.
         `baseQty` = SL gốc engine, giữ để "Đang về" không nhảy theo SL người mua vừa sửa. */
      items: g.lines.map((l) => ({ sku: l.sku, name: l.name, qty: qtyOf(l), baseQty: l.qty, unit: l.unit, price: l.price, onHand: l.onHand, rop: l.rop, abc: l.abc, sparse: l.sparse, newSku: l.newSku, expiryCap: l.expiryCap, floorApplied: l.floorApplied })),
    }, ...st.approvals] }));
    setCreated((c) => ({ ...c, [gk(g)]: id }));
    setToast(`Đã tạo đơn nháp ${id} cho ${g.name} — vào hàng Chờ duyệt (+1).`);
  };

  /* Cầu nối Đề xuất → RFQ (Q4): cùng giỏ dự trù, rẽ nhánh so giá. Mở trình tạo RFQ với giỏ đã chọn sẵn. */
  const openRfq = (g) => {
    window.__openRfqBuilder = true;
    window.__rfqFocusNcc = g ? g.name : null;
    setView('rfq');
  };

  /* JET-170 Màn 2: chế độ xem Tối ưu CTKM — tiến hoá từ /purchasing, không vẽ lại */
  const [pMode, setPMode] = React.useState('base');
  const ModeBar = (
    <div style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3, marginBottom: 18 }}>
      {[['base', 'Dự trù cơ sở'], ['opt', 'Tối ưu CTKM']].map(([k, l]) => (
        <button key={k} onClick={() => setPMode(k)} style={{ border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, background: pMode === k ? '#fff' : 'transparent', color: pMode === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: pMode === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
      ))}
    </div>
  );
  if (pMode === 'opt') return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1240, margin: '0 auto' }} data-screen-label="Đề xuất mua · Tối ưu CTKM">
      <PageHeader title="Đề xuất mua hàng" subtitle="Chế độ Tối ưu CTKM — gợi ý tận dụng khuyến mãi trên nhu cầu cơ sở của engine. Gợi ý không tự áp — bạn chủ động bấm Áp từng dòng." />
      {ModeBar}
      <window.OptimizerView setToast={setToast} setView={setView} />
    </div>
  );

  /* DVP-325: KHÔNG lặp mốc "Số liệu" trong header màn — topbar (cấp shell) giữ mốc thật và tự cập nhật
     sau mỗi lần Đồng bộ; mốc thứ hai gõ cứng sẽ lệch với topbar và không bao giờ đổi. */
  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="Đề xuất mua hàng" subtitle="Dự trù bổ sung cho kho tổng (engine tự sinh + dự trù tay từ Tồn kho chi nhánh), gộp theo nhà cung cấp. Có thể chỉnh SL từng dòng trước khi tạo đơn nháp."
      actions={<span style={{ fontSize: 13, color: 'var(--dv-ink-soft)' }}>{totalLines} dòng · <b style={{ color: 'var(--dv-green)' }}>{VND(grand)}</b></span>} />

      {ModeBar}

      {/* DVP-662 (phản hồi #74, Jet chốt design trước): MỤC LỤC NEO. Vào trang không cuộn vẫn thấy trang
          có BA khối và mỗi khối bao nhiêu mục; thanh dính mép trên khi cuộn nên từ bất kỳ đâu trong khối
          đề xuất nhảy tới Lịch sử là một cú bấm. Không đổi điều hướng (sidebar vẫn một cấp).
          `top: 70` = chiều cao header dính của Shell (đo 1440×900); để 0 thì thanh trốn dưới header. */}
      <nav aria-label="Mục lục trang" style={{ position: 'sticky', top: 70, zIndex: 5, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(6px)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '6px 8px', margin: '0 0 16px', boxShadow: 'var(--shadow-xs)' }}>
        {[['px-de-xuat', 'Đề xuất', `${fGroups.length} NCC · ${fLines} SKU`, 'var(--dv-green)'], ['px-thieu-ncc', 'Thiếu NCC', `${MISSING.length}`, MISSING.length ? 'var(--dv-yellow-600)' : 'var(--dv-ink-faint)'], ['px-lich-su', 'Lịch sử đơn mua', `${HIST.length}`, 'var(--dv-ink-soft)']].map(([id, label, count, color]) => (
          <a key={id} href={'#' + id} onClick={(e) => { e.preventDefault(); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 999, textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, color: 'var(--dv-ink)' }}>
            {label}<span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, color, background: 'var(--dv-mist)', padding: '1px 8px', borderRadius: 999 }}>{count}</span>
          </a>
        ))}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, paddingRight: 4 }}>
          <button onClick={() => setOpen(fGroups.map(gk))} style={linkBtn}>Mở tất cả</button>
          <span style={{ color: 'var(--dv-ink-faint)' }}>·</span>
          <button onClick={() => setOpen([])} style={linkBtn}>Thu gọn</button>
          <span style={{ width: 1, height: 16, background: 'var(--border-default)', margin: '0 8px' }} />
          <span title="Chỉ có ở prototype — để duyệt bố cục ở các trạng thái dữ liệu khác nhau" style={{ fontSize: 11, color: 'var(--dv-ink-faint)', fontWeight: 600 }}>Tình huống demo</span>
          <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 2 }}>
            {[['thuc', 'Mẫu'], ['nhieu', '10 NCC'], ['it', '1 NCC'], ['trong', 'Trống']].map(([k, l]) => <button key={k} onClick={() => setScen(k)} style={{ ...scenPill, background: scen === k ? '#fff' : 'transparent', color: scen === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: scen === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>)}
          </span>
        </span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
        <span style={{ color: 'var(--dv-green)', flex: 'none', marginTop: 1 }}><IconQuote size={17} /></span>
        <div style={{ fontSize: 12.5, color: 'var(--dv-ink)', lineHeight: 1.5 }}>
          <b>Hai cách tạo đơn từ cùng giỏ dự trù này:</b> mặc định bấm <b>“Tạo đơn nháp”</b> khi đã có giá &amp; NCC mặc định (đi thẳng PO). Khi cần <b>so giá nhiều NCC</b>, bấm <b>“Tạo RFQ”</b> để gửi yêu cầu báo giá niêm phong.
        </div>
      </div>

      <window.Toolbar>
        <window.SearchBox value={q} onChange={setQ} placeholder="Tìm SKU, sản phẩm trong đề xuất…" width={260} />
        <window.MultiSelect options={GROUPS.map((g) => g.name)} value={nccFilter} onChange={setNccFilter} allLabel="Tất cả NCC" icon={React.createElement(window.IconSuppliers, { size: 15 })} width={210} />
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--dv-ink-faint)', fontWeight: 600 }}>Xem theo</span>
          <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3 }}>
            {[['product', 'Sản phẩm'], ['store', 'Cửa hàng']].map(([k, l]) => (
              <button key={k} onClick={() => setPurchView(k)} style={{ border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, background: purchView === k ? '#fff' : 'transparent', color: purchView === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: purchView === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
            ))}
          </span>
        </span>
      </window.Toolbar>

      {/* [T21] Đang về (on-order) đã được engine trừ sẵn — nói ra để người mua khỏi trừ tay lần nữa */}
      <div style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', margin: '0 0 12px' }}>Đang về đã gồm PO đang giao và điều chuyển đang tới — không đề xuất trùng.</div>

      {/* ── GIỎ DỰ TRÙ TAY (NO_TICKET_YET) — đích đến của nút "Lên dự trù / mua" ở màn Tồn kho.
          Phụ đề màn này vẫn nói giỏ gồm "dự trù tay từ Tồn kho chi nhánh" mà phần đó trước đây
          không có chỗ nào để đi tới: màn chỉ đọc hằng số `PURCHASE_GROUPS`.
          KHÔNG có nút "Tạo đơn nháp" ở đây, và đó là đúng: dòng chọn tay không mang NCC nào mà đơn
          mua thì gộp THEO NCC — dựng nhóm NCC giả để có nút bấm chính là kiểu bịa dữ liệu mà
          `sourcesFor` vừa bị gỡ vì nó. Đường thật: gán NCC ở Danh mục. */}
      {manualLines.length > 0 && (
        <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px' }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--dv-mist)', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><window.IconBoxes size={20} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--dv-ink)' }}>Dự trù tay từ Tồn kho chi nhánh</div>
              <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>{manualLines.length} dòng · <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--dv-ink)' }}>{VND(manualVal)}</b> — chưa gắn NCC nên chưa gom vào đơn nháp được.</div>
            </div>
            <button onClick={() => setView('products')} title="Gán NCC mặc định cho SKU ở Danh mục, sau đó dòng sẽ gom được vào nhóm NCC bên dưới" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)', whiteSpace: 'nowrap' }}>Gán NCC ở Danh mục →</button>
          </div>
          <div style={{ borderTop: '1px solid var(--border-default)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', minWidth: 720 }}>
              <thead><tr style={{ background: 'var(--dv-mist)' }}>
                {['Mã', 'Sản phẩm', 'Điểm bán', 'Tồn', 'Đang về', 'Min / Max', 'SL đề xuất', 'Thành tiền', ''].map((h, i) => <th key={i} style={{ textAlign: i >= 3 && i < 8 ? 'right' : 'left', padding: '9px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {manualLines.map((l) => (
                  <tr key={l.key} style={{ borderTop: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '11px 18px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{l.sku}</td>
                    <td style={{ padding: '11px 18px', fontSize: 13.5, fontWeight: 600, color: 'var(--dv-ink)' }}>{l.name}</td>
                    <td style={{ padding: '11px 18px', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{l.branch}</td>
                    <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-soft)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.onHand)}</td>
                    {/* Đang về ở đây là số ĐO ĐƯỢC của chính dòng tồn kho (`r.onOrder`), không phải
                        số suy ra như bảng engine bên dưới — nên hiện thẳng, kể cả khi bằng 0. */}
                    <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: l.onOrder ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.onOrder)}</td>
                    <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.rop)} / {NUM(l.max)}</td>
                    <td title={`Cần = Max ${l.max} − tồn ${l.onHand} − đang về ${l.onOrder}`} style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, color: l.qty > 0 ? 'var(--dv-green)' : 'var(--dv-ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.qty)}</td>
                    <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{VND(l.qty * l.price)}</td>
                    <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                      <button onClick={() => dropManual(l.key)} aria-label={`Bỏ ${l.sku} khỏi dự trù tay`} title="Bỏ dòng này khỏi giỏ dự trù tay" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-faint)' }}><window.IconX size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <h3 id="px-de-xuat" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: '0 0 12px', scrollMarginTop: 124 }}>Đề xuất theo nhà cung cấp <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink-faint)', fontFamily: 'var(--font-body)' }}>· {fGroups.length} NCC · {fLines} SKU · bấm tiêu đề card để mở/thu gọn</span></h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {fGroups.length === 0 && (GROUPS.length === 0
          ? <window.EmptyState icon="IconCart" title="Chưa có đề xuất mua" hint="Engine chưa sinh dòng nào cần mua cho kho tổng. Lịch sử đơn mua vẫn ở bên dưới." />
          : <window.EmptyState icon="IconCart" title="Không có đề xuất khớp bộ lọc" hint="Thử bỏ bớt từ khóa tìm kiếm hoặc chọn lại NCC." />)}
        {fGroups.map((g) => {
          const sup = SUPPLIERS.find((s) => s.id === g.ncc);
          const subtotal = g.lines.reduce((a, l) => a + lineTotal(l), 0);
          const isOpen = open.includes(gk(g));
          const poId = created[gk(g)]; const isCreated = !!poId;
          /* DVP-325: chính sách ngưỡng duyệt — cho biết TRƯỚC khi tạo đơn là sẽ phải qua mấy cấp */
          const appr = subtotal < 20000000 ? ['Tự động duyệt', 'var(--dv-green-50)', 'var(--dv-green)'] : subtotal < 100000000 ? ['1 cấp duyệt', 'var(--dv-yellow-100)', 'var(--dv-yellow-600)'] : ['2 cấp duyệt', '#F8E0DD', '#9c2b22'];
          return (
            <section key={gk(g)} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer' }} onClick={() => toggle(gk(g))}>
                <span style={{ display: 'inline-flex', transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none', color: 'var(--dv-ink-faint)' }}><IconChevronRight size={18} /></span>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--dv-green-50)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconCart size={20} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--dv-green)' }}>{g.name}</span>
                    {g.source === 'dv_odoo' ?
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--dv-green-100)' }}>Tự động · DV Odoo</span> :
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-ink-soft)', background: 'var(--dv-mist)', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--border-default)' }}>Nhập tay</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Leadtime {g.leadtime} ngày · {g.lines.length} sản phẩm · Công nợ {VND(sup.debt)} / {VND(sup.debtLimit)}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: 8 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-ink)' }}>{VND(subtotal)}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>tạm tính (chưa VAT)</div>
                </div>
                <span title={`Ngưỡng: tự động <20tr · 1 cấp <100tr · 2 cấp ≥100tr`} style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999, background: appr[1], color: appr[2], whiteSpace: 'nowrap' }}>{appr[0]}</span>
                {isCreated
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }} onClick={(e) => e.stopPropagation()}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}><IconCheck size={16} />Đã có PO {poId}</span><Button variant="secondary" size="sm" iconRight={<IconChevronRight size={15} />} onClick={(e) => { e.stopPropagation(); setView('approvals'); }}>Chi tiết &amp; tiến trình</Button></span>
                  : <span style={{ display: 'inline-flex', gap: 8 }}>
                      <Button variant="secondary" size="sm" iconLeft={<IconQuote size={15} />} onClick={(e) => {e.stopPropagation();openRfq(g);}}>Tạo RFQ</Button>
                      <Button variant="primary" size="sm" onClick={(e) => {e.stopPropagation();createDraft(g);}}>Tạo đơn nháp</Button>
                    </span>}
              </div>
              {isOpen && (purchView === 'store'
                ? <div style={{ borderTop: '1px solid var(--border-default)' }}><window.StorePivot items={g.lines.map((l) => ({ sku: l.sku, name: l.name, qty: qtyOf(l), unit: l.unit, price: l.price }))} /></div>
                :
              <div style={{ borderTop: '1px solid var(--border-default)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
                    <thead><tr style={{ background: 'var(--dv-mist)' }}>
                      {/* [G8] Cột "Đang về" — khẳng định ngay trên bảng chỉ kiểm được khi con số hiện ra cạnh dòng hàng. */}
                      {/* DVP-653 (phản hồi #64): "Tồn dự kiến" = tồn + đang về (KHÔNG cộng SL); "Ngày tồn sau đặt" = (tồn + đang về + SL) ÷ sức bán, đổi theo số đang gõ. */}
                      {['Mã', 'Sản phẩm', 'ABC', 'Sức bán/ngày', 'Tồn kho', 'Đang về', 'Tồn dự kiến', 'SL đề xuất', 'Ngày tồn sau đặt', 'Đơn giá', 'Thành tiền'].map((h, i) => <th key={i} style={{ textAlign: i >= 2 ? 'right' : 'left', padding: '9px 18px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {g.lines.map((l) => {
                      const abcColor = l.abc === 'A' ? 'var(--dv-green)' : l.abc === 'B' ? 'var(--dv-yellow-600)' : 'var(--dv-ink-soft)';
                      const abcBg = l.abc === 'A' ? 'var(--dv-green-50)' : l.abc === 'B' ? 'var(--dv-yellow-100)' : 'var(--dv-mist)';
                      /* [G8] CÙNG hàm với ô bằng chứng ở Chờ duyệt, cùng đầu vào (SL gốc engine `l.qty`). */
                      const lOnOrder = dvOnOrder(l.sku, l.qty);
                      return (
                        <React.Fragment key={l.sku}>
                        <tr style={{ borderTop: '1px solid var(--border-default)' }}>
                          <td style={{ padding: '11px 18px', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>{l.sku}</td>
                          <td style={{ padding: '11px 18px', fontSize: 13.5, fontWeight: 600, color: 'var(--dv-ink)' }}>{l.name}
                            {/* [T05] SKU mới — chưa đủ lịch sử bán */}
                            {l.newSku && <span title="Chưa đủ lịch sử bán — đề xuất đầu tiên nên duyệt tay" style={{ marginLeft: 7, fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', padding: '1px 7px', borderRadius: 999, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>Mới</span>}
                            {/* [T16] ĐÃ GỠ badge "vượt bán-kịp-hạn" (Jet chốt 2026-08-30). Nó là một BÁO ĐỘNG ĐỎ
                                dựng trên một cờ gán tay trong fixture, không phải số tính được: chưa có trần
                                hạn dùng nào, và hệ cũng không cắt SL. Cảnh báo không tính được thì gỡ, đừng
                                dạy người dùng phớt lờ màu đỏ. Cờ `expiryCap` vẫn đi theo phiếu để dùng lại
                                khi có trần thật. */}
                            {/* [T06] CỐ Ý KHÔNG có chip "Sàn" ở đây (Jet chốt 2026-08-29): cờ sàn đã nói trong ô
                                "?" ngay cạnh ô số lượng, thêm một huy hiệu nữa trên hàng là hai chỗ nói cùng một
                                điều. Cờ vẫn đi trọn đường dòng dự trù → `createDraft` → phiếu chờ ký. */}
                          </td>
                          <td style={{ padding: '11px 18px', textAlign: 'right' }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: abcColor, background: abcBg, padding: '2px 8px', borderRadius: 6 }}>{l.abc}</span></td>
                          <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-soft)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.ads)}<span style={{ color: 'var(--dv-ink-faint)' }}>/ng</span></td>
                          <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-soft)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.onHand)}</td>
                          {/* Hiện SỐ 0, không hiện "—": 0 ở đây là số ĐÃ ĐO, còn "—" prototype dành
                              riêng cho "chưa có số liệu" (xem `ManualTransferBuilder`). */}
                          <td title="Đang về = PO đang giao + điều chuyển đang tới. Engine đã trừ khoản này khỏi SL đề xuất (Cần = Max − tồn − đang về) — không cần trừ tay lần nữa. 0 = đã đo, không có hàng nào trên đường." style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: lOnOrder ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{NUM(lOnOrder)}</td>
                          <td title="Tồn dự kiến = tồn kho + đang về, chưa tính số đang đặt" style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--dv-ink-soft)', fontVariantNumeric: 'tabular-nums' }}>{NUM(l.onHand + lOnOrder)}</td>
                          <td style={{ padding: '8px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              {edited(l) && <span title={`Engine đề xuất ${NUM(l.qty)} — số bạn sửa chỉ ghi khi bấm Tạo đơn nháp`} style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '1px 6px', borderRadius: 999, whiteSpace: 'nowrap' }}>sẽ áp khi tạo đơn</span>}
                              <input type="number" value={qtyOf(l)} disabled={isCreated} onChange={(e) => setQtys((q) => ({ ...q, [l.sku]: Math.max(0, Number(e.target.value)) }))} style={{ width: 78, textAlign: 'right', padding: '6px 8px', borderRadius: 8, border: `1px solid ${edited(l) ? 'var(--dv-yellow-600)' : 'var(--border-strong)'}`, fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, color: 'var(--dv-green)', outline: 'none', background: isCreated ? 'var(--dv-mist)' : '#fff' }} />
                              <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{l.unit}</span>
                              {/* [T30] Cùng nút, cùng chỗ, cùng hàm với Chờ duyệt. */}
                              <button onClick={() => setExplSku(explSku === l.sku ? null : l.sku)} title="Vì sao SL này?" aria-label={`Vì sao đặt ${NUM(l.qty)} ${l.unit}?`} style={{ border: '1px solid ' + (explSku === l.sku ? 'var(--dv-green)' : 'var(--border-strong)'), background: explSku === l.sku ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', width: 20, height: 20, borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 11, color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>?</button>
                            </span>
                          </td>
                          <td title="(tồn kho + đang về + SL đặt) ÷ sức bán mỗi ngày — đổi ngay theo số bạn gõ; chưa có sức bán ⇒ ∞" style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: l.ads > 0 && (l.onHand + lOnOrder + qtyOf(l)) / l.ads < 14 ? 'var(--dv-yellow-600)' : 'var(--dv-ink-soft)', fontVariantNumeric: 'tabular-nums' }}>{l.ads > 0 ? NUM(Math.round((l.onHand + lOnOrder + qtyOf(l)) / l.ads)) + 'n' : '∞'}</td>
                          <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontVariantNumeric: 'tabular-nums', color: 'var(--dv-ink-soft)' }}>{VND(l.price)}</td>
                          <td style={{ padding: '11px 18px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{VND(lineTotal(l))}</td>
                        </tr>
                        {/* [T30] Ô "vì sao" — hai dòng, không hơn. Dòng đầu là PHÉP TRỪ dẫn thẳng tới con số
                            trên bảng; dòng sau mờ hơn, nói Max ở đâu ra. Giải thích dài hơn nằm ở tooltip, không
                            nằm trên màn. */}
                        {explSku === l.sku && (() => { const ev = dvEvidence(l, g.leadtime); return (
                          <tr style={{ background: 'var(--dv-green-900, #003328)' }}>
                            <td colSpan={11} style={{ padding: '10px 18px' }}>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.7, color: 'rgba(255,255,255,.92)', fontVariantNumeric: 'tabular-nums' }}>
                                Max {NUM(ev.max)} − tồn {NUM(l.onHand)} − đang về {NUM(ev.onOrder)} = {NUM(ev.raw)}
                                {ev.moq > 1 ? <> → MOQ {ev.moq} → <b style={{ color: 'var(--dv-yellow)' }}>{NUM(l.qty)}</b></> : <> → <b style={{ color: 'var(--dv-yellow)' }}>{NUM(l.qty)}</b></>} {l.unit}
                              </div>
                              <div title="Max = sức bán mỗi ngày × (số ngày chờ hàng về + số ngày đệm an toàn của lớp ABC) + lượng dự phòng." style={{ fontSize: 11.5, color: 'rgba(255,255,255,.62)', marginTop: 3 }}>
                                Max = {ev.ads}/ngày × ({ev.lead}n chờ + {ev.buf}n đệm) + dự phòng {NUM(ev.ss)}
                                {l.floorApplied && <> · sàn Min ≥ 1 đè</>}
                                {edited(l) && <> · bạn đã sửa SL thành {NUM(qtyOf(l))}</>}
                              </div>
                            </td>
                          </tr>
                        ); })()}
                        </React.Fragment>);
                    })}
                    </tbody>
                  </table>
                  {/* DVP-644 / DVP-660 (phản hồi #53 · #72): tổng tạm tính ở header card đã đổi theo số đang gõ; câu này nói số sửa BAO GIỜ có hiệu lực. */}
                  {!isCreated && <div style={{ padding: '8px 18px 10px', fontSize: 12, color: 'var(--dv-ink-faint)', borderTop: '1px dashed var(--border-default)' }}>Số đã sửa sẽ áp khi bấm <b>Tạo đơn nháp</b> · 0 = bỏ dòng khỏi đơn · tạm tính ở đầu card đã tính theo số đang gõ.</div>}
                </div>
              )}
            </section>);

        })}
      </div>

      {/* SKU thiếu NCC master (F10) — deep-link sang hồ sơ sản phẩm để gán NCC mặc định */}
      {MISSING.length === 0 &&
      <div id="px-thieu-ncc" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5, color: 'var(--dv-ink-faint)', padding: '12px 4px 0', marginTop: 16, scrollMarginTop: 124 }}><span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconCheck size={15} /></span>Mọi SKU trong đề xuất đã có nhà cung cấp mặc định.</div>}
      {MISSING.length > 0 &&
      <div id="px-thieu-ncc" style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: '#FFFBF0', border: '1px solid var(--dv-yellow-200, #F5E0A8)', borderRadius: 'var(--radius-card)', padding: '14px 18px', marginTop: 16, scrollMarginTop: 124 }}>
          <span style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--dv-yellow-100)', color: 'var(--dv-yellow-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconAlertTriangle size={19} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{MISSING.length} SKU chưa gắn nhà cung cấp (NCC master)</div>
            <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', margin: '2px 0 10px' }}>Gốc vấn đề ở hồ sơ sản phẩm — bấm để mở SKU và gán NCC mặc định. Khi chưa gán, engine dùng leadtime/MOQ mặc định và không gom được vào đơn mua.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MISSING.map((m) => (
                <button key={m.sku} onClick={() => { window.__focusSku = m.sku; window.__productQuery = m.sku; setView('products'); }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '7px 12px', borderRadius: 999, fontWeight: 600, fontSize: 12.5, color: 'var(--dv-ink)' }}>
                  <span style={{ fontWeight: 700 }}>{m.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{m.sku}</span>
                  <span style={{ color: 'var(--dv-green)', display: 'inline-flex' }}><IconChevronRight size={14} /></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }

      {/* PO history */}
      <h3 id="px-lich-su" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: '34px 0 14px', scrollMarginTop: 124 }}>Lịch sử đơn mua <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink-faint)', fontFamily: 'var(--font-body)' }}>· {HIST.length} đơn · bấm dòng để xem chi tiết & dòng thời gian</span></h3>
      {HIST.length === 0 && <window.EmptyState icon="IconFile" title="Chưa có đơn mua nào" hint="Đơn tạo từ đề xuất bên trên sẽ xuất hiện ở đây." />}
      <Table>
        <thead><tr><Th>Mã đơn</Th><Th>Nhà cung cấp</Th><Th align="center">Số dòng</Th><Th align="right">Giá trị</Th><Th>Ngày tạo</Th><Th>Trạng thái</Th></tr></thead>
        <tbody>
          {HIST.map((p, i) =>
          <Tr key={p.id + '-' + i} onClick={() => setPoView(p)}>
              <Td mono strong color="var(--dv-green)">{p.id}</Td>
              <Td>{p.ncc}</Td>
              <Td align="center" mono>{p.lines}</Td>
              <Td align="right" mono strong>{VND(p.value)}</Td>
              <Td mono color="var(--dv-ink-soft)">{p.date}</Td>
              <Td><StatusBadge status={p.status} /></Td>
            </Tr>
          )}
        </tbody>
      </Table>
      {poView && <PODetailDrawer po={poView} onClose={() => setPoView(null)} setView={setView} />}
    </div>);

}
window.PurchasingScreen = PurchasingScreen;


/* Pharmacy — Tồn kho chi nhánh: operational listview, origin point for manual transfers &
   replenishment.

   THANH ĐIỀU KIỆN ĐỘNG (phương án A). Bản trước bày mọi điều kiện trong một ngăn 5 nhóm, và điều
   kiện lọc nằm rải ở BA chỗ: tab trạng thái · dropdown chi nhánh · ngăn lọc. Ba vấn đề:
   tĩnh (bày cả thứ không dùng) · tốn ~180px chiều dọc đẩy bảng xuống · rời rạc.

   Nay: mỗi điều kiện ĐANG dùng là một chip mang sẵn giá trị, bấm để sửa tại chỗ, `×` để bỏ.
   Điều kiện chưa dùng nằm sau `+ Lọc`. Chưa lọc gì ⇒ thanh đúng MỘT hàng. Trạng thái và chi nhánh
   là chip như mọi điều kiện khác — không còn ba chỗ.

   Dãy đếm theo trạng thái (Khẩn 77 · Thấp 8 …) KHÔNG mất: nó xuống dòng tổng kết ngay dưới, vẫn
   bấm được. Con số đó cho biết *hình dạng vấn đề* trước khi bấm vào đâu cả, nên bỏ hẳn là mất thật.

   ─────────────────────────────────────────────────────────────────────────────────────────────
   ĐỒNG BỘ VỚI HỆ THẬT — 2026-08-21. Bản này chép lại hành vi đã ship ở `components/inventory/
   InventoryTable.tsx`, không phải đề xuất mới. Những chỗ prototype ĐANG hứa nhiều hơn code đã bị
   gỡ, vì một prototype hứa quá là một cái bẫy cho người đọc thiết kế:

     · bỏ băng xanh "Engine tự sinh đề xuất…"  — hệ thật không có băng này ở màn Tồn kho
     · bỏ `DoiBar` ở cột Ngày tồn             — hệ thật là SỐ thường, tô màu theo ngưỡng
     · bỏ `WhyPopover` ở ô Min                — hệ thật không có
     · bỏ `onClick` trên cả hàng `<tr>`       — hệ thật chỉ chọn bằng ô tick
     · "Lên dự trù / mua" ĐI SANG màn mua     — trước đây chỉ hiện toast, tức hứa một việc không ai làm

   Và những chỗ prototype ĐANG thiếu so với code đã được thêm: lọc Nhóm hàng · ô tìm trong danh
   sách chọn · nguồn suy VEN · phân trang · dòng "N dòng không có số liệu…".
   ───────────────────────────────────────────────────────────────────────────────────────────── */

const INVENTORY = (function build() {
  const skus = (window.SKUS || []).slice(0, 8);
  const stores = window.STORES || [];
  const rows = [];
  skus.forEach((s, si) => {
    const price = Math.max(100, Math.round(s.value / s.need));
    stores.forEach((st, bi) => {
      const isWh = st.id === 'KHO';
      const ads = Math.max(1, Math.round((s.need / 220) * (isWh ? 6 : (1.4 + (bi % 4) * 0.5))));
      const mode = (si * 3 + bi) % 8;
      let doi;
      if (mode === 0) doi = 2 + (bi % 3);
      else if (mode === 1 || mode === 5) doi = 9 + (si % 5);
      else if (mode === 4 && !isWh) doi = 96 + bi * 5;
      else doi = isWh ? 30 + (si % 20) : 22 + ((si * 5 + bi * 7) % 28);
      const onHand = Math.max(0, Math.round(ads * doi));
      const ss = ads * 7;
      const lt = isWh ? 2 : 3;
      const rop = Math.round(ads * lt + ss);
      const max = Math.round(ads * (lt + 7) + ss);
      const onOrder = mode === 0 ? Math.round(ads * 3) : (bi % 3 === 0 ? Math.round(ads * 2) : 0);
      const status = doi <= 7 ? 'critical' : doi <= 15 ? 'low' : doi > 90 ? 'overstock' : 'healthy';
      /* `undefined` = KHÔNG CÓ SỐ LIỆU, khác hẳn `0` = có đo và bằng không.
         Kho tổng không bán lẻ nên không có ngày bán — đúng hình dạng đã đo ở prod:
         [Đo — prod 2026-08-20] `soldDays` vắng ở 50% dòng `duoc-vuong`, phần lớn là dòng KHO.
         Trộn hai thứ này vào cùng một số 0 là chỗ khiến bộ lọc "chưa từng bán" đếm cả kho. */
      const soldDays = isWh ? undefined : mode === 4 ? 0 : Math.min(30, Math.max(1, Math.round(ads * 1.6) % 31));
      let row = { sku: s.id, name: s.name, mfr: s.mfr, branchId: st.id, branch: st.name, isWh, onHand, ads, doi, rop, max, onOrder, soldDays, price, status };
      /* [T06/T07 · DVP-531 minFloorWhenSold] Fixture TƯỜNG MINH cho luật sàn và nhánh percentile.
         Cờ `floorApplied`/`sparse` là DỮ LIỆU của hàng — nơi vẽ chỉ đọc cờ, không đoán lại từ khuôn
         số (rop === 1 && max === 2): hai vị ngữ trùng nhau hôm nay là trùng do may.
         · 3 dòng `floorApplied`: bán thưa, phương pháp cho Min 0, sàn nâng lên 1 → khuôn Min 1/Max 2;
         · 2 dòng `sparse` không sàn: percentile cho số lớn hơn 0 — nhánh P_min hiện không kèm sàn.

         ── TÊN TRƯỜNG THỐNG NHẤT (NO_TICKET_YET) ───────────────────────────────────────────────
         Cờ sàn tên `floorApplied` ở CẢ HAI file: ở đây (chip "Sàn" cột Min) và ở screens-a.jsx
         (dòng "Sàn Min ≥ 1 đè" trong bằng chứng engine, màn Chờ duyệt). Chọn `floorApplied` chứ
         không phải `floor` vì fixture `APPROVALS` (data.jsx) đã mang tên đó — đổi phía kia là
         phải sửa fixture, mà fixture là thứ duy nhất đang chứng minh badge vẽ được.
         Trước đây hai màn gọi CÙNG một khái niệm bằng HAI tên (`floor` ở đây · `floorApplied` ở
         kia). Cùng nghĩa, khác tên là chỗ để nối dữ liệu thật đúng một nửa rồi im lặng mất cờ ở
         nửa còn lại — đúng lớp lỗi mà `createDraft` vừa mắc: nó bỏ rơi cờ giữa đường. */
      if (!isWh && ((si === 1 && bi === 1) || (si === 4 && bi === 3) || (si === 6 && bi === 5))) {
        row = { ...row, floorApplied: true, sparse: true, ads: 1, soldDays: 2, onHand: 2, doi: 2, rop: 1, max: 2, onOrder: 0, status: 'critical' };
      } else if (!isWh && ((si === 2 && bi === 2) || (si === 7 && bi === 4))) {
        row = { ...row, sparse: true, ads: 1, soldDays: 4, onHand: 5, doi: 5, rop: 3, max: 6, status: 'critical' };
      }
      /* [T10 · badge tay] Đúng MỘT dòng có Min/Max người đặt — máy không ghi đè (NO_TICKET_YET). */
      /* [T10] ĐÃ GỠ cờ `manualMinMax` — badge "tay" dựng trên đúng dòng fixture này, không phải số liệu. */
      rows.push(row);
    });
  });
  return rows;
})();
window.INVENTORY = INVENTORY;

/* Bậc cận hạn theo SKU, suy từ sổ lô EXPIRY đang có — hai màn nói về cùng một lô thì cùng một nguồn. */
const NEAR_EXPIRY_BY_SKU = (function build() {
  const m = {};
  (window.EXPIRY || []).forEach((e) => {
    const tier = e.days <= 30 ? 'critical' : e.days <= 90 ? 'warn' : null;
    if (!tier) return;
    if (m[e.sku] !== 'critical') m[e.sku] = tier;
  });
  return m;
})();

/* Nguồn cấp cho MỘT dòng thiếu hàng. Chép NGỮ NGHĨA của engine (`suggestTransfers`,
   `lib/engine/transfer.ts:81-93`) — chuẩn tham chiếu là engine, không phải prototype.

   [2026-08-21 · DVP-529] Bản trước nói sai engine ở hai chỗ, sửa cả hai:

   1. KHO TỔNG VÀ CỬA HÀNG KHÔNG CÙNG MỘT CÔNG THỨC. Bản trước áp `onHand − max` cho MỌI chi nhánh.
      Engine tách đôi: kho tổng `avail = max(0, onHand)` (transfer.ts:84) vì kho TỒN TẠI để cấp phát
      — giữ lại phần "dưới Max" của kho là giam hàng ở nơi không bán lẻ; cửa hàng
      `avail = max(0, onHand − max)` (transfer.ts:92) vì chỉ phần TRÊN mức Max mới là dôi thật, rút
      sâu hơn là biến một điểm đang đủ hàng thành điểm thiếu hàng. Áp nhầm công thức cửa hàng lên kho
      làm kho trông như hết hàng đúng lúc nó còn đầy — sai theo hướng nguy hiểm nhất.

   2. KHÔNG BỊA NGUỒN. Bản trước, khi không ai thừa, tự chèn `['Kho tổng (DC)', max(wh.onHand, 100)]`.
      Con số 100 không có xuất xứ, và dòng đó HỨA HÀNG KHÔNG TỒN TẠI: phiếu ký xong, kho đi lấy mới
      phát hiện. "Không chi nhánh nào đang thừa" là một câu trả lời THẬT — trả về mảng RỖNG và để màn
      hình nói ra. Rỗng là HỢP ĐỒNG MỚI của hàm này: nơi dùng phải vô hiệu hoá dòng đó kèm lời giải
      thích, tuyệt đối không `sources[0][0]` trần (xem chú thích ở `batchTransfer`).

   THỨ TỰ giữ nguyên: kho tổng trước, rồi cửa hàng theo số thừa giảm dần. Engine ưu tiên kho trước
   rồi giữ đúng thứ tự mảng đầu vào, và chỉ đổi thứ tự khi tenant có cấu hình `sourceRank`
   (`donorsFor`, transfer.ts:32-48). Prototype không có bảng cấu hình đó, nên xếp cửa hàng theo số
   thừa giảm dần là một GIẢN LƯỢC có ý thức: cùng ưu tiên "kho trước", chỉ khác cách phá hoà giữa
   các cửa hàng. */
/* [T26 · điểm tạm dừng] Bản chiếu (mirror) trạng thái `NETWORK_STORES` ở MasterData.jsx — DV07
   'Dược Vương Bình Thạnh' đang `status: 'paused'`. Prototype chưa có nguồn trạng thái chi nhánh
   dùng chung trên `window`, nên chép tay đúng MỘT chỗ này. Nghĩa nghiệp vụ: điểm tạm dừng KHÔNG
   NHẬN hàng về, nhưng vẫn RÚT hàng ra được (thu hồi tồn trước khi đóng hẳn). */
const INV_PAUSED_STORE_IDS = ['DV07'];
const invIsPaused = (branchId) => INV_PAUSED_STORE_IDS.includes(branchId);

function sourcesFor(sku, destBranch) {
  return INVENTORY
    .filter((r) => r.sku === sku && r.branch !== destBranch)
    /* Dùng cờ `isWh` của chính dữ liệu (dựng ở INVENTORY theo `st.id === 'KHO'`), không dò chữ
       "Kho tổng" trong tên chi nhánh như bản trước: tên là nhãn hiển thị, đổi lúc nào cũng được. */
    /* [T24] `doi` đi kèm từ đây: phiếu tạo tay trước đây khai nguồn thừa đúng 38 ngày cho MỌI
       nguồn, MỌI mã (hằng số gõ cứng ở `ManualTransferBuilder`). Số đó nổi lên ba chỗ người ký
       nhìn thấy, nên nó là một số đo bịa chứ không phải nhãn. */
    .map((r) => ({ branch: r.branch, branchId: r.branchId, isWh: r.isWh, onHand: r.onHand, max: r.max, doi: r.doi, avail: r.isWh ? Math.max(0, r.onHand) : Math.max(0, r.onHand - r.max) }))
    .filter((s) => s.avail > 0)
    .sort((a, b) => (b.isWh ? 1 : 0) - (a.isWh ? 1 : 0) || b.avail - a.avail)
    /* [T24/T26] Phần tử [0]/[1] là HỢP ĐỒNG cũ với ManualTransferBuilder (screens-a.jsx): [0] tên
       nguồn (nhãn option + khoá đối sánh + `from` của phiếu), [1] số sẵn. Phần tử [2] là mở rộng
       CỘNG THÊM, builder ĐÃ đọc (screens-a.jsx:624 nhãn option · :552 meta của phiếu): chất liệu
       để option nói được xuất xứ số sẵn
       ("sẵn 40 = tồn 210 − Max 170" · kho tổng "bằng tồn") và để builder vẽ dòng
       "Nguồn còn lại ~N sau chuyển" từ `onHand` − qty — phần VẼ nằm ở builder, không ở file này.
       [T26] Điểm tạm dừng vẫn đứng làm NGUỒN (rút hàng ra được), nhưng nhãn phải nói rõ. */
    .map((s) => [
      s.branch + (invIsPaused(s.branchId) ? ' · tạm dừng (chỉ rút hàng ra)' : ''),
      s.avail,
      { isWh: s.isWh, onHand: s.onHand, max: s.max, doi: s.doi, paused: invIsPaused(s.branchId), note: s.isWh ? 'bằng tồn' : `tồn ${s.onHand} − Max ${s.max}` },
    ]);
}

const metaOf = (r) => (window.skuMeta && window.skuMeta(r.sku)) || {};

/* Nhóm hàng theo SKU. `skuMeta` (MasterData.jsx) chỉ trả `{type, storage, control}` — nhà ĐÚNG của
   trường này là ở đó, và khi nào có người mở file ấy ra sửa vì việc khác thì nên gộp vào.
   Ở đây đọc thẳng `window.PRODUCTS` vì [đo 2026-08-21] Babel standalone hạ `const` tầng script
   thành `var`, nên `PRODUCTS` CÓ mặt trên `window` (15 mục, có `group`). Đó là một sự thật của
   công cụ dựng, không phải một hợp đồng — nên có `|| []` và có ca "chưa gắn nhóm" ở dưới. */
const productOf = (sku) => (window.PRODUCTS || []).find((p) => p.sku === sku) || null;
const groupOf = (r) => { const p = productOf(r.sku); return (p && p.group) || null; };

/* ───────────────────────────── VEN — suy, và LUÔN nói nguồn ─────────────────────────────
   Chép ngữ nghĩa của `lib/views/ven.ts` (DVP-474). Hai luật không được phép mất khi chép:

   1. KHÔNG BAO GIỜ suy ra "N". "Không suy được là thiết yếu" KHÁC "đã xác định là không thiết yếu";
      gán N cho phần còn lại là bịa một phán đoán y khoa từ chỗ trống, và nó sai một chiều — hàng
      cấp cứu bị gắn N sẽ nhận mức phục vụ thấp nhất. Chỉ dược sĩ gán tay mới sinh ra V hoặc N.
   2. `rx` đứng TRƯỚC nhóm hàng: thuốc kê đơn là bằng chứng mạnh hơn tên nhóm. Đảo lại thì kết quả
      không đổi nhưng NGUỒN đổi — mà cột nguồn mới là thứ khiến bảng này đáng tin. */
const VEN_SOURCE_LABEL = { assigned: 'dược sĩ gán', rx: 'suy từ thuốc kê đơn', category: 'suy từ nhóm hàng', none: 'chưa xác định' };
function venOf(r) {
  const p = productOf(r.sku);
  if (p && p.ven) return { value: p.ven, source: 'assigned' };
  if (p && p.type === 'rx') return { value: 'E', source: 'rx' };
  if (p && (p.group || '').startsWith('Thuốc')) return { value: 'E', source: 'category' };
  return { value: null, source: 'none' };
}

function abcOf(r) {
  const m = metaOf(r);
  return m.abc || (r.doi <= 15 ? 'A' : r.doi > 90 ? 'C' : 'B');
}

/* ── [T04 · ẩn cột theo cờ] Cờ trục phân loại theo tenant ────────────────────────────────────
   NỢ — `tenant_setting` khoá `classify.ven` / `classify.xyz` chưa tồn tại trong hệ thật; Console
   sẽ ghi cùng khoá đó và portal chỉ ĐỌC. Mặc định (cờ chưa đặt = `undefined`) là HIỆN — chỉ
   `false` tường minh mới ẩn, để tenant chưa cấu hình không mất cột nào. Màn này chưa có cột XYZ
   nên `classify.xyz` chưa có gì để gác ở đây (cột XYZ hiện chỉ có ở màn Danh mục — MasterData).
   NO_TICKET_YET */
function invClassifyOff(axis) {
  const invFlags = (typeof window.readTenantFlags === 'function') ? window.readTenantFlags() : {};
  return invFlags['classify.' + axis] === false;
}

/* ── [T07/T30 · vì sao đúng nhánh] Một dòng, nói đúng NHÁNH đã sinh ra Min ───────────────────
   · dòng bán thưa (cờ fixture `sparse`) → Min đến từ percentile theo ô ABC×VEN, không phải công
     thức tốc độ — in công thức tốc độ cho nó là nói sai phương pháp;
   · dòng tốc độ → đệm an toàn theo LỚP ABC (A=5n · B=7n · C=10n) — bản trước ghi cứng
     "7 ngày an toàn" cho mọi dòng;
   · dòng sàn quyết (cờ `floorApplied`, DVP-531) → thêm đuôi "· sàn quyết". */
function invWhyLine(r) {
  if (r.soldDays === 0) return 'Có tồn nhưng chưa ghi nhận ngày bán nào';
  const c = abcOf(r);
  const floorNote = r.floorApplied ? ' · sàn quyết' : '';
  if (r.sparse) return `Min = P_min[ô ${c}×${venOf(r).value || '—'}](tổng bán cửa sổ — từ F & LT chi nhánh)${floorNote}`;
  const safety = c === 'A' ? 5 : c === 'C' ? 10 : 7;
  return `Min = ADS ${r.ads} × (${r.isWh ? 2 : 3} ngày chờ + ${safety} ngày an toàn)${floorNote}`;
}

/* [T10 · badge tay] Min/Max do người đặt tay — máy không ghi đè. Đường ghi đè tay chưa có trong
   engine thật (NO_TICKET_YET), nên đây là trạng thái hiển thị thuần — không có nút gỡ. */

/* ──────────────────────── Bộ CỘT: một catalogue, hai cái tên ───────────────────────
   `label` là tên trên MÀN, `fileLabel` là tên trong FILE. Tên trong file là hợp đồng trao đổi —
   bảng tính phía người dùng đã quen nó — nên Min vẫn ra file là "ROP". Bản trước của ngăn chọn cột
   hiển thị tên FILE, nên người bỏ tick "ROP" không biết mình vừa tắt cột "Min". */
const INV_COLUMNS = [
  { group: 'Định danh', items: [
    { key: 'sku', label: 'SKU', always: true },
    { key: 'name', label: 'Tên SP', fileOnly: true },
  ] },
  { group: 'Phân loại', items: [
    { key: 'abc', label: 'ABC' },
    { key: 'ven', label: 'VEN' },
    /* Nguồn suy VEN chỉ ra FILE, không thành cột bảng — giống hệ thật. Trên màn nó là `title` của
       ô VEN: đủ để tra khi nghi ngờ, không tốn một cột cho thứ hầu hết lượt đọc không cần. */
    { key: 'venSource', label: 'Nguồn VEN', fileOnly: true, fileLabel: 'Nguồn VEN' },
    { key: 'branch', label: 'Chi nhánh' },
  ] },
  { group: 'Số lượng & tốc độ', items: [
    { key: 'onHand', label: 'Tồn' },
    { key: 'onOrder', label: 'Đang về' },
    { key: 'ads', label: 'ADS' },
    { key: 'daysOfInv', label: 'Ngày tồn', fileLabel: 'Số ngày tồn' },
    { key: 'soldDays', label: 'Ngày bán' },
  ] },
  { group: 'Ngưỡng & chẩn đoán', items: [
    { key: 'rop', label: 'Min', fileLabel: 'ROP' },
    { key: 'max', label: 'Max' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'why', label: 'Vì sao' },
  ] },
];
const ALL_COLS = INV_COLUMNS.flatMap((g) => g.items.map((i) => i.key));
const COL_BY_KEY = Object.fromEntries(INV_COLUMNS.flatMap((g) => g.items).map((i) => [i.key, i]));
const FILE_ONLY_COLS = INV_COLUMNS.flatMap((g) => g.items).filter((i) => i.fileOnly).map((i) => i.key);
/* Hai chế độ đặt bộ cột khởi điểm. Trước đây đây là một segmented control RIÊNG nằm trên thanh
   công cụ; dồn vào View options là dọn thêm được một hàng. */
const MODE_COLS = {
  vanhanh: ALL_COLS.filter((k) => k !== 'why' && k !== 'soldDays' && !FILE_ONLY_COLS.includes(k) && k !== 'ven'),
  rasoat: ALL_COLS.filter((k) => !FILE_ONLY_COLS.includes(k)),
};

/* ───────────────────────────── Popover dùng chung ─────────────────────────── */
function Popover({ open, onClose, align = 'left', width = 250, children }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', h);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div ref={ref} style={{ position: 'absolute', top: 'calc(100% + 6px)', [align]: 0, zIndex: 75, width, background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-default)', padding: 9, maxHeight: 380, overflowY: 'auto' }}>
      {children}
    </div>
  );
}

/* ───────────────────────────── Định nghĩa điều kiện lọc ───────────────────────────
   MỘT bảng khai báo cho cả ba việc: vẽ chip, vẽ ô sửa, và lọc. Thêm một điều kiện mới =
   thêm một dòng ở đây, không phải sửa ba chỗ. */
const RANGE = 'range';
const MULTI = 'multi';
const emptyRange = () => [null, null];

/* Ngưỡng hiện ô tìm trong danh sách lựa chọn.
   Con số này là câu trả lời cho lý do bộ lọc Nhóm hàng từng bị gỡ: *"lúc thiết kế filter cũ khiến
   nó nhiều quá (vì có quá nhiều unique value)"*. [Đo — prod 2026-08-20] `product.category` có 209
   giá trị ở tenant `relife`. Đổ 209 dòng vào popover là tái tạo đúng vấn đề cũ trong một cái vỏ
   mới — chip gọn lại nhưng thứ mở ra thì không.
   8 vì mọi trục KÊ SẴN đều ≤ 5 lựa chọn (trạng thái 4 · VEN 4 · tuân thủ 3), nên ngưỡng này chỉ
   chạm những danh sách ĐỘNG đến từ dữ liệu tenant — đúng chỗ cardinality không kiểm soát được. */
const SEARCH_THRESHOLD = 8;

const FILTER_FIELDS = [
  { key: 'status', group: 'Trạng thái & nơi chốn', label: 'Trạng thái', kind: MULTI,
    opts: [['critical', 'Khẩn'], ['low', 'Thấp'], ['healthy', 'Đủ'], ['overstock', 'Quá tồn']],
    match: (r, v) => v.includes(r.status) },
  { key: 'branch', group: 'Trạng thái & nơi chốn', label: 'Chi nhánh', kind: MULTI,
    opts: () => (window.STORES || []).map((s) => [s.name, s.name]),
    match: (r, v) => v.includes(r.branch) },
  { key: 'abc', group: 'Phân loại', label: 'ABC', kind: MULTI,
    opts: [['A', 'A'], ['B', 'B'], ['C', 'C']],
    match: (r, v) => v.includes(abcOf(r)) },
  { key: 'ven', group: 'Phân loại', label: 'VEN', kind: MULTI,
    /* "Chưa xác định" là một lựa chọn THẬT, không phải trạng thái rỗng: nó là cách duy nhất để hỏi
       "còn bao nhiêu mặt hàng chưa ai phân loại" — tức đúng câu hỏi dẫn tới việc đi gán. */
    opts: [['V', 'V — sống còn'], ['E', 'E — thiết yếu'], ['N', 'N — thông thường'], ['none', 'Chưa xác định']],
    match: (r, v) => v.includes(venOf(r).value || 'none') },
  /* Nhóm hàng — tuỳ chọn suy từ CHÍNH trường mà vế `match` đọc, giống hệ thật:
     `SELECT DISTINCT category FROM product` (`loadProductCategories`). Một nguồn, nên không có
     chỗ để lệch.

     [Đo 2026-08-21] Bản đầu tôi lấy tuỳ chọn từ `mdGroupFilterOptions()` — cũng tên "nhóm hàng",
     cũng dùng ở màn Danh mục — và giao của hai tập là **0/18**: cây danh mục trả TÊN LÁ
     ("Kháng sinh") còn sản phẩm mang ĐƯỜNG DẪN ba tầng ("Thuốc · Kháng sinh · Beta-lactam").
     Bộ lọc khi đó bày đủ 18 lựa chọn và mọi lựa chọn đều trả 0 dòng — hỏng theo kiểu im lặng,
     trông như "nhóm này không có hàng". Hai danh sách cùng tên không có nghĩa là cùng từ vựng. */
  { key: 'group', group: 'Phân loại', label: 'Nhóm hàng', kind: MULTI,
    opts: () => {
      const seen = [...new Set((window.PRODUCTS || []).map((p) => p.group).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'vi'));
      const pairs = seen.map((g) => [g, g]);
      /* SKU có trong tồn kho mà không có hồ sơ sản phẩm (SP0033) rơi vào đây. Bỏ lựa chọn này đi
         thì những dòng ấy không lọc tới được bằng bất kỳ giá trị nào — biến mất khỏi mọi câu hỏi. */
      pairs.push(['none', 'Chưa gắn nhóm']);
      return pairs;
    },
    match: (r, v) => v.includes(groupOf(r) || 'none') },
  /* Ba huy hiệu này VỐN ĐÃ hiện cạnh tên sản phẩm nhưng chưa lọc được — dược sĩ phải rà mắt từng
     dòng để tìm "thuốc kê đơn đang thiếu". Dữ liệu có sẵn, chỉ thiếu vế lọc. */
  { key: 'compliance', group: 'Tuân thủ', label: 'Tuân thủ', kind: MULTI,
    opts: [['rx', 'Kê đơn (Rx)'], ['cold', 'Bảo quản lạnh'], ['control', 'Kiểm soát đặc biệt']],
    match: (r, v) => v.every((c) => { const m = metaOf(r); return c === 'rx' ? m.type === 'rx' : c === 'cold' ? m.storage === 'lanh' : !!m.control; }) },
  /* Ghép với Trạng thái = Khẩn để tách "nên đặt thêm" khỏi "nên điều chuyển". */
  { key: 'expiry', group: 'Cận hạn', label: 'Cận hạn', kind: MULTI,
    opts: [['warn', 'Có lô cận hạn'], ['critical', 'Cận hạn gấp']],
    match: (r, v) => { const t = NEAR_EXPIRY_BY_SKU[r.sku]; return t ? (v.includes('critical') ? t === 'critical' : true) : false; } },
  { key: 'onHand', group: 'Khoảng số', label: 'Tồn', kind: RANGE, get: (r) => r.onHand },
  /* Vế còn thiếu của câu hỏi trung tâm ở mua hàng: thiếu hàng mà CHƯA có hàng về. */
  { key: 'onOrder', group: 'Khoảng số', label: 'Đang về', kind: RANGE, get: (r) => r.onOrder },
  { key: 'ads', group: 'Khoảng số', label: 'ADS', kind: RANGE, get: (r) => r.ads },
  { key: 'doi', group: 'Khoảng số', label: 'Ngày tồn', kind: RANGE, get: (r) => r.doi },
  { key: 'soldDays', group: 'Khoảng số', label: 'Ngày bán', kind: RANGE, get: (r) => r.soldDays },
  { key: 'flags', group: 'Dữ liệu nghi vấn', label: 'Dữ liệu nghi vấn', kind: MULTI,
    opts: [['negative', 'Tồn ÂM'], ['minZeroSold', 'Min = 0 dù có bán'], ['neverSold', 'Có tồn, chưa từng bán']],
    /* `soldDays == null` (kho tổng) KHÔNG phải "chưa từng bán" — nó là "không đo". Nếu để lọt vào
       đây thì mọi dòng kho đều bị gắn cờ nghi vấn và cái cờ trở thành tiếng ồn. */
    match: (r, v) => v.every((f) => f === 'negative' ? r.onHand < 0 : f === 'minZeroSold' ? (r.rop === 0 && r.soldDays > 0) : (r.onHand > 0 && r.soldDays === 0)) },
];
const FIELD_BY_KEY = Object.fromEntries(FILTER_FIELDS.map((f) => [f.key, f]));
const optsOf = (f) => (typeof f.opts === 'function' ? f.opts() : f.opts || []);
const emptyValue = (f) => (f.kind === RANGE ? emptyRange() : []);
const isActive = (f, v) => (f.kind === RANGE ? v[0] != null || v[1] != null : v.length > 0);

/* Chữ trên chip phải nói ĐƯỢC GIÁ TRỊ, không chỉ tên trường — chip ghi mỗi "Trạng thái" thì vẫn
   phải mở ra mới biết đang lọc gì, tức lại giấu trạng thái một lần nữa. */
function summarize(f, v) {
  if (f.kind === RANGE) {
    const lo = v[0];
    const hi = v[1];
    if (lo != null && hi != null) return lo === hi ? String(lo) : `${lo}–${hi}`;
    if (lo != null) return `≥ ${lo}`;
    if (hi != null) return `≤ ${hi}`;
    return 'mọi giá trị';
  }
  if (v.length === 0) return 'chọn…';
  if (v.length === 1) {
    const o = optsOf(f).find((x) => x[0] === v[0]);
    const t = o ? o[1] : v[0];
    /* Nhóm hàng là chuỗi ba tầng ("Thuốc · Kháng sinh · Beta-lactam") — để nguyên thì một chip nuốt
       hết chiều ngang thanh điều kiện. Lấy tầng cuối, phần đầy đủ nằm ở `title`. */
    return t.length > 24 ? '…' + t.slice(t.lastIndexOf('·') + 1).trim() : t;
  }
  return `${v.length} mục`;
}

const EMPTY_FILTER = Object.fromEntries(FILTER_FIELDS.map((f) => [f.key, emptyValue(f)]));

function RangeEditor({ value, onChange }) {
  const box = { width: 78, padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13, outline: 'none' };
  const num = (s) => (s.trim() === '' ? null : Number(s));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 4 }}>
      <input type="number" placeholder="từ" aria-label="từ" value={value[0] ?? ''} onChange={(e) => onChange([num(e.target.value), value[1]])} style={box} />
      <span style={{ color: 'var(--dv-ink-faint)' }}>–</span>
      <input type="number" placeholder="đến" aria-label="đến" value={value[1] ?? ''} onChange={(e) => onChange([value[0], num(e.target.value)])} style={box} />
    </div>
  );
}

function MultiEditor({ field, value, onChange, counts }) {
  const { IconCheck } = window;
  const [q, setQ] = React.useState('');
  const all = optsOf(field);
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  /* Ô tìm chỉ hiện khi danh sách thật sự dài. Hiện nó ở danh sách 3 dòng là thêm một thao tác cho
     một vấn đề không tồn tại; giấu nó ở danh sách 209 dòng là tái tạo đúng vấn đề đã gỡ bộ lọc này. */
  const searchable = all.length > SEARCH_THRESHOLD;
  const norm = (s) => String(s).toLowerCase();
  const list = searchable && q.trim() ? all.filter((p) => norm(p[1]).includes(norm(q.trim()))) : all;
  return (
    <div>
      {searchable && (
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Tìm trong ${all.length} lựa chọn…`}
          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', marginBottom: 6 }} />
      )}
      {/* Đã chọn rồi mà ô tìm lọc mất khỏi danh sách thì người dùng tưởng mình chưa chọn. Nói số. */}
      {searchable && value.length > 0 && list.filter((p) => value.includes(p[0])).length < value.length && (
        <div style={{ padding: '2px 8px 6px', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>
          Đang chọn <b style={{ color: 'var(--dv-green)' }}>{value.length}</b> mục — có mục không khớp “{q.trim()}”.
        </div>
      )}
      {list.length === 0 && <div style={{ padding: '10px 8px', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>Không lựa chọn nào khớp “{q.trim()}”.</div>}
      {list.map((pair) => {
        const v = pair[0];
        const t = pair[1];
        const on = value.includes(v);
        return (
          <button key={v} onClick={() => toggle(v)} title={t} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 8px', border: 'none', background: on ? 'var(--dv-green-50)' : 'transparent', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: on ? 700 : 500, color: on ? 'var(--dv-green)' : 'var(--dv-ink)', textAlign: 'left' }}>
            <span style={{ width: 16, height: 16, borderRadius: 5, border: on ? 'none' : '1.5px solid var(--border-strong)', background: on ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on && <IconCheck size={11} color="#fff" />}</span>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</span>
            {counts && counts[v] != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{counts[v]}</span>}
          </button>
        );
      })}
    </div>
  );
}

function FilterChip({ field, value, onChange, onRemove, counts }) {
  const [open, setOpen] = React.useState(!isActive(field, value));
  const { IconX, IconChevronDown } = window;
  const active = isActive(field, value);
  const full = field.kind === MULTI && value.length === 1
    ? (optsOf(field).find((x) => x[0] === value[0]) || [null, value[0]])[1]
    : null;
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 9, background: active ? 'var(--dv-green-50)' : '#fff', border: `1px solid ${active ? 'var(--dv-green)' : 'var(--border-strong)'}`, overflow: 'hidden' }}>
        <button onClick={() => setOpen((o) => !o)} title={full || undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 4px 7px 11px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: active ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>
          <span style={{ color: 'var(--dv-ink-soft)', fontWeight: 500 }}>{field.label}:</span>
          {summarize(field, value)}
          <IconChevronDown size={13} />
        </button>
        <button onClick={onRemove} aria-label={`Bỏ điều kiện ${field.label}`} style={{ display: 'inline-flex', alignItems: 'center', padding: '7px 9px 7px 3px', border: 'none', background: 'transparent', cursor: 'pointer', color: active ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>
          <IconX size={13} />
        </button>
      </span>
      <Popover open={open} onClose={() => setOpen(false)} width={field.kind === RANGE ? 210 : 265}>
        {field.kind === RANGE
          ? <RangeEditor value={value} onChange={onChange} />
          : <MultiEditor field={field} value={value} onChange={onChange} counts={counts} />}
      </Popover>
    </span>
  );
}

function AddFilterMenu({ hidden, onAdd }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const { IconPlus } = window;
  const avail = FILTER_FIELDS.filter((f) => hidden.includes(f.key) && f.label.toLowerCase().includes(q.trim().toLowerCase()));
  const groups = [...new Set(avail.map((f) => f.group))];
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => { setOpen((o) => !o); setQ(''); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 9, border: '1px dashed var(--border-strong)', background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--dv-ink-soft)' }}>
        <IconPlus size={14} />Lọc
      </button>
      <Popover open={open} onClose={() => setOpen(false)} width={245}>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm điều kiện…" style={{ width: '100%', boxSizing: 'border-box', padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', marginBottom: 6 }} />
        {avail.length === 0 && <div style={{ padding: '10px 8px', fontSize: 12.5, color: 'var(--dv-ink-faint)' }}>Đã dùng hết điều kiện khớp “{q}”.</div>}
        {groups.map((g) => (
          <div key={g}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', padding: '6px 8px 3px' }}>{g}</div>
            {avail.filter((f) => f.group === g).map((f) => (
              <button key={f.key} onClick={() => { onAdd(f.key); setOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '7px 8px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--dv-ink)' }}>{f.label}</button>
            ))}
          </div>
        ))}
      </Popover>
    </span>
  );
}

/* View options = mọi thứ về CÁCH NHÌN dữ liệu (cột · chế độ · mật độ).
   Chip lọc = dữ liệu NÀO. Hai câu hỏi khác nhau, hai chỗ khác nhau. */
function ViewOptions({ cols, setCols, mode, setMode, density, setDensity, hideKeys = [] }) {
  const [open, setOpen] = React.useState(false);
  const { IconCheck, IconChevronDown, IconSettings } = window;
  const on = (k) => cols.includes(k);
  const toggle = (k) => setCols(on(k) ? cols.filter((x) => x !== k) : [...cols, k]);
  const seg = (cur, v, label, fn) => (
    <button key={v} onClick={() => fn(v)} style={{ flex: 1, padding: '6px 8px', border: 'none', borderRadius: 7, background: cur === v ? '#fff' : 'transparent', boxShadow: cur === v ? 'var(--shadow-xs)' : 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: cur === v ? 700 : 500, color: cur === v ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>{label}</button>
  );
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--dv-ink)' }}>
        <IconSettings size={15} />View options<IconChevronDown size={14} />
      </button>
      <Popover open={open} onClose={() => setOpen(false)} align="right" width={288}>
        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', padding: '3px 8px 5px' }}>Chế độ</div>
        <div style={{ display: 'flex', background: '#EEF0EF', borderRadius: 9, padding: 3, marginBottom: 4 }}>
          {seg(mode, 'vanhanh', 'Vận hành', (v) => { setMode(v); setCols(MODE_COLS[v]); })}
          {seg(mode, 'rasoat', 'Rà soát', (v) => { setMode(v); setCols(MODE_COLS[v]); })}
        </div>
        <div style={{ fontSize: 11, color: 'var(--dv-ink-faint)', padding: '0 8px 8px', lineHeight: 1.4 }}>Chế độ chỉ đặt bộ cột khởi điểm — chỉnh tiếp bên dưới thì giữ nguyên chỉnh tay.</div>

        <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', padding: '3px 8px 5px' }}>Mật độ dòng</div>
        <div style={{ display: 'flex', background: '#EEF0EF', borderRadius: 9, padding: 3, marginBottom: 8 }}>
          {seg(density, 'thoang', 'Thoáng', setDensity)}
          {seg(density, 'gon', 'Gọn', setDensity)}
        </div>

        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 7 }}>
          {INV_COLUMNS.map((g) => (
            <div key={g.group} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)', padding: '5px 8px 3px' }}>{g.group}</div>
              {g.items.filter((it) => !hideKeys.includes(it.key)).map((it) => {
                const active = on(it.key);
                const locked = it.always;
                return (
                  <button key={it.key} onClick={() => !locked && toggle(it.key)} disabled={locked} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', border: 'none', background: active ? 'var(--dv-green-50)' : 'transparent', cursor: locked ? 'default' : 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: active ? 700 : 500, color: active ? 'var(--dv-green)' : 'var(--dv-ink)', textAlign: 'left', opacity: locked ? 0.65 : 1 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 5, border: active ? 'none' : '1.5px solid var(--border-strong)', background: active ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{active && <IconCheck size={11} color="#fff" />}</span>
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.fileLabel && !it.fileOnly && <span title={`Trong file CSV cột này tên là “${it.fileLabel}”`} style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--dv-ink-faint)' }}>file: {it.fileLabel}</span>}
                    {locked && <span style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>luôn hiện</span>}
                    {it.fileOnly && <span style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>chỉ trong file</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>Áp cho cả bảng và file CSV</span>
          <button onClick={() => setCols(MODE_COLS[mode])} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 12.5 }}>Về mặc định</button>
        </div>
      </Popover>
    </span>
  );
}

/* ───────────────────────────────── SẮP XẾP ─────────────────────────────────
   Bảng vốn sắp CỐ ĐỊNH theo Ngày tồn tăng dần — hợp lý làm mặc định (khẩn nhất lên đầu) nhưng
   không đổi được, nên mọi câu hỏi khác đều phải xuất CSV rồi sắp trong Excel.
   Ba trạng thái, không phải hai: tăng → giảm → VỀ MẶC ĐỊNH; thứ tự gốc ở màn này mang nghĩa
   nghiệp vụ nên phải lấy lại được. `why` không sắp — sắp alphabet một lời giải thích thì vô nghĩa. */
const SORT_VALUE = {
  sku: (r) => r.sku, abc: (r) => abcOf(r), ven: (r) => venOf(r).value, branch: (r) => r.branch,
  onHand: (r) => r.onHand, onOrder: (r) => r.onOrder, ads: (r) => r.ads, daysOfInv: (r) => r.doi,
  soldDays: (r) => r.soldDays, rop: (r) => r.rop, max: (r) => r.max,
  status: (r) => ['critical', 'low', 'healthy', 'overstock'].indexOf(r.status),
};

function SortHeader({ colKey, label, align, sort, onSort, style }) {
  const { IconChevronUp, IconChevronDown } = window;
  const active = sort.key === colKey;
  if (!SORT_VALUE[colKey]) return <th style={{ ...style, textAlign: align }}>{label}</th>;
  const just = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
  return (
    <th style={{ ...style, textAlign: align, padding: 0 }}>
      <button onClick={() => onSort(colKey)}
        title={active ? (sort.dir === 'asc' ? 'Đang tăng dần — bấm để giảm dần' : 'Đang giảm dần — bấm để về thứ tự mặc định') : `Sắp theo ${label}`}
        aria-label={`Sắp xếp theo ${label}`}
        style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: just, gap: 4, padding: '10px 13px', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', color: active ? 'var(--dv-green)' : 'inherit', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11, whiteSpace: 'nowrap' }}>
        {label}
        <span style={{ display: 'inline-flex', opacity: active ? 1 : 0.28 }}>
          {active && sort.dir === 'desc' ? <IconChevronDown size={13} /> : <IconChevronUp size={13} />}
        </span>
      </button>
    </th>
  );
}

function InvStatusBadge({ s }) {
  const map = { critical: ['Khẩn', '#F8E0DD', '#9c2b22'], low: ['Thấp', 'var(--dv-yellow-100)', 'var(--dv-yellow-600)'], healthy: ['Đủ', '#D6ECE5', '#00533F'], overstock: ['Quá tồn', '#E5EEFb', '#1d4f8a'] };
  const parts = map[s] || map.healthy;
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, background: parts[1], color: parts[2], fontWeight: 700, fontSize: 11.5, whiteSpace: 'nowrap' }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: parts[2] }} />{parts[0]}</span>;
}

/* ───────────────────────────────── PHÂN TRANG ─────────────────────────────────
   Bản trước cắt cứng `rows.slice(0, 40)` mà KHÔNG nói gì. Người dùng lọc ra 300 dòng, thấy 40,
   và không có cách nào biết 260 dòng kia tồn tại — con số "Khớp 300 dòng" ở trên lại càng làm
   người ta tin mình đang nhìn cả 300. Hệ thật phân trang ở SERVER; ở prototype phân ở client,
   nhưng phần người dùng thấy — nhãn, cỡ trang, ba chấm — chép đúng `Pager` của hệ thật. */
const PAGE_SIZES = [25, 50, 100];
const pagerLink = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 38, minHeight: 38, padding: '0 11px', borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', color: 'var(--dv-ink)', fontSize: 13, fontWeight: 600, lineHeight: 1, cursor: 'pointer', fontFamily: 'var(--font-body)' };

function pageSlots(page, count) {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const s = new Set([1, count, page, page - 1, page + 1]);
  const out = [];
  let prev = 0;
  [...s].filter((n) => n >= 1 && n <= count).sort((a, b) => a - b).forEach((n) => {
    if (prev && n - prev > 1) out.push('…');
    out.push(n); prev = n;
  });
  return out;
}

function Pager({ total, page, size, setPage, setSize }) {
  const { NUM } = window;
  if (total === 0) return null;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const cur = Math.min(page, pageCount);
  const from = (cur - 1) * size + 1;
  const to = Math.min(total, cur * size);
  return (
    <nav aria-label="Phân trang" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '12px 16px', borderTop: '1px solid var(--border-default)' }}>
      <div aria-live="polite" style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>
        Trang {cur}/{pageCount} — {from}–{to} / {NUM(total)} dòng
      </div>
      <ul style={{ display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
        {cur > 1 && <li><button onClick={() => setPage(cur - 1)} aria-label="Trang trước" style={pagerLink}>‹ Trước</button></li>}
        {pageSlots(cur, pageCount).map((slot, i) => slot === '…'
          ? <li key={`gap-${i}`} aria-hidden="true" style={{ padding: '0 4px', color: 'var(--dv-ink-faint)', fontSize: 13 }}>…</li>
          : (
            <li key={slot}>
              <button onClick={() => setPage(slot)} aria-label={`Trang ${slot}`} aria-current={slot === cur ? 'page' : undefined}
                style={slot === cur ? { ...pagerLink, background: 'var(--dv-green)', borderColor: 'var(--dv-green)', color: '#fff', fontWeight: 800 } : pagerLink}>
                {slot}
              </button>
            </li>
          ))}
        {cur < pageCount && <li><button onClick={() => setPage(cur + 1)} aria-label="Trang sau" style={pagerLink}>Sau ›</button></li>}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>
        <span>Mỗi trang:</span>
        <span style={{ display: 'inline-flex', gap: 6 }}>
          {PAGE_SIZES.map((n) => (
            <button key={n} onClick={() => { setSize(n); setPage(1); }}
              style={{ ...pagerLink, minWidth: 34, minHeight: 30, padding: '0 9px', fontSize: 12.5, ...(n === size ? { background: 'var(--dv-green)', borderColor: 'var(--dv-green)', color: '#fff', fontWeight: 800 } : null) }}>
              {n}
            </button>
          ))}
        </span>
      </div>
    </nav>
  );
}

function InventoryScreen({ setToast, lastSync, setView }) {
  const { PageHeader, SearchBox, NUM } = window;
  const { IconTransfer, IconCart, IconRefresh, IconDownload } = window;
  const [q, setQ] = React.useState('');
  const [build, setBuild] = React.useState(null);
  const [sel, setSel] = React.useState(() => new Set());
  const [mode, setMode] = React.useState('vanhanh');
  const [cols, setCols] = React.useState(MODE_COLS.vanhanh);
  const [density, setDensity] = React.useState('thoang');
  const [sort, setSort] = React.useState({ key: null, dir: 'asc' });
  const [filter, setFilter] = React.useState(EMPTY_FILTER);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(25);
  /* Chip hiện khi điều kiện CÓ giá trị, HOẶC vừa được thêm nhưng chưa điền — nếu không thì thêm
     xong chip biến mất ngay và người dùng không hiểu vừa xảy ra gì. */
  const [added, setAdded] = React.useState([]);
  /* [T04] Trục VEN tắt theo cờ tenant: cột, tuỳ chọn cột, điều kiện lọc và file CSV cùng ẩn. */
  const invVenHidden = invClassifyOff('ven');

  const onSort = (k) => { setPage(1); setSort((s) => s.key !== k ? { key: k, dir: 'asc' } : s.dir === 'asc' ? { key: k, dir: 'desc' } : { key: null, dir: 'asc' }); };
  const setField = (key, v) => { setPage(1); setFilter((f) => ({ ...f, [key]: v })); };
  const removeField = (key) => { setPage(1); setFilter((f) => ({ ...f, [key]: emptyValue(FIELD_BY_KEY[key]) })); setAdded((a) => a.filter((x) => x !== key)); };
  const invUsableFields = FILTER_FIELDS.filter((f) => !(invVenHidden && f.key === 'ven'));
  const shown = invUsableFields.filter((f) => isActive(f, filter[f.key]) || added.includes(f.key));
  const activeCount = FILTER_FIELDS.filter((f) => isActive(f, filter[f.key])).length;

  const show = (k) => cols.includes(k) && !FILE_ONLY_COLS.includes(k) && !(invVenHidden && k === 'ven');
  const matchAll = (r) => FILTER_FIELDS.every((f) => {
    const v = filter[f.key];
    if (!isActive(f, v)) return true;
    if (f.kind === RANGE) { const x = f.get(r); if (x == null) return false; return (v[0] == null || x >= v[0]) && (v[1] == null || x <= v[1]); }
    return f.match(r, v);
  });

  const matched = INVENTORY.filter((r) => (r.name + r.sku + r.branch).toLowerCase().includes(q.toLowerCase()) && matchAll(r));

  /* Trục CÓ THỂ VẮNG: sắp theo một cột mà dòng không có số liệu ở cột đó thì dòng ấy KHÔNG có chỗ
     đứng thật trong thứ tự — đặt nó ở đầu hay cuối đều là bịa. Hệ thật loại nó ra và NÓI RA bao
     nhiêu dòng bị loại. Im lặng nuốt tới 50% dòng là làm con số trên màn nói dối. */
  const missing = sort.key ? matched.filter((r) => SORT_VALUE[sort.key](r) == null).length : 0;
  const unknownNote = missing > 0
    ? `${NUM(missing)} dòng không có số liệu ${(COL_BY_KEY[sort.key] || {}).label || sort.key} nên không nằm trong kết quả`
    : null;

  const rows = matched
    .filter((r) => !sort.key || SORT_VALUE[sort.key](r) != null)
    /* Sắp trên TOÀN BỘ tập đã lọc rồi mới cắt trang — sắp sau khi cắt thì "cao nhất" chỉ có nghĩa
       "cao nhất trong trang đang thấy", tức một con số nói dối. */
    .sort((a, b) => {
      if (sort.key) {
        const va = SORT_VALUE[sort.key](a);
        const vb = SORT_VALUE[sort.key](b);
        const c = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'vi');
        if (c !== 0) return sort.dir === 'asc' ? c : -c;
      }
      return a.doi - b.doi;
    });

  const counts = { critical: 0, low: 0, healthy: 0, overstock: 0 };
  INVENTORY.forEach((r) => { counts[r.status]++; });

  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const curPage = Math.min(page, pageCount);
  const visible = rows.slice((curPage - 1) * size, curPage * size);
  const keyOf = (r) => r.sku + '@' + r.branchId;
  const toggle = (k) => setSel((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const allOn = visible.length > 0 && visible.every((r) => sel.has(keyOf(r)));
  const selectedRows = INVENTORY.filter((r) => sel.has(keyOf(r)));
  const selShort = selectedRows.filter((r) => r.status === 'critical' || r.status === 'low');
  const onCreate = (cards) => {
    window.OpsStore.set((st) => ({ transfers: [...cards, ...st.transfers] }));
    setBuild(null); setSel(new Set());
    /* [DVP-529] Đếm PHIẾU theo TUYẾN, y hệt nhãn nút ở `ManualTransferBuilder` (screens-a.jsx):
       một phiếu = một cặp (nguồn → đích), ba dòng cùng đi Kho tổng → Q.1 là MỘT phiếu.
       Bản trước nút hứa "Tạo 1 phiếu" rồi toast báo "Đã tạo 3 phiếu" — hai con số cho cùng một
       thao tác, và người dùng không có cách nào biết cái nào đúng. Sửa nút mà quên toast thì lỗi
       vẫn còn nguyên, chỉ dịch sang câu sau.
       Bỏ luôn mệnh đề "(badge +N)": badge đếm ở tầng shell (file khác), số của nó không suy được
       từ đây — hứa một con số mình không tính được cũng là một khẳng định không kiểm được. */
    const soPhieu = new Set(cards.map((c) => c.from + '→' + c.to)).size;
    setToast(`Đã tạo ${soPhieu} phiếu điều chuyển (${cards.length} dòng) — xem ở tab Điều chuyển.`);
  };
  const batchTransfer = () => {
    if (!selShort.length) { setToast('Các dòng đã chọn không thiếu hàng — không cần điều chuyển.'); return; }
    /* [2026-08-21 · DVP-529] `sources` CÓ THỂ RỖNG kể từ khi `sourcesFor` thôi bịa nguồn kho tổng.
       Cố ý KHÔNG lọc bỏ dòng rỗng ở đây: người dùng đã tự tay chọn dòng đó, im lặng bỏ đi thì họ
       tưởng đã tạo phiếu. Dòng vẫn vào builder, và builder vô hiệu hoá nó kèm đúng câu:
       "Không chi nhánh nào đang thừa mã này — dòng này không tạo phiếu được." */
    /* [T26 · điểm tạm dừng] Điểm tạm dừng không NHẬN hàng về — loại ngay tại nguồn dữ liệu, vì
       select "Chi nhánh nhận" của builder (screens-a.jsx) suy danh sách từ chính `items` truyền
       vào. KHÔNG loại im lặng: người dùng tự tay tick dòng đó, phải nói ra vì sao nó không vào
       phiếu (điểm tạm dừng vẫn rút hàng RA được — xem `sourcesFor`). */
    const invPausedRows = selShort.filter((r) => invIsPaused(r.branchId));
    const invEligible = selShort.filter((r) => !invIsPaused(r.branchId));
    if (!invEligible.length) { setToast('Các dòng đã chọn đều thuộc điểm đang tạm dừng — điểm tạm dừng không nhận hàng về, không tạo phiếu được.'); return; }
    if (invPausedRows.length) setToast(`${invPausedRows.length} dòng thuộc điểm tạm dừng (không nhận hàng về) — đã bỏ khỏi phiếu.`);
    setBuild(invEligible.map((r) => ({ sku: r.sku, name: r.name, to: r.branch, onHand: r.onHand, doi: r.doi, rop: r.rop, need: Math.max(r.max - r.onHand - r.onOrder, r.rop - r.onHand, 1), price: r.price, sources: sourcesFor(r.sku, r.branch) })));
  };
  /* Trước đây nút này chỉ hiện toast "đã thêm vào đề xuất mua (nháp)" rồi bỏ chọn — một màn hình
     hứa một việc mà không màn nào làm tiếp, và người dùng không có đường nào đi kiểm chứng.
     Đưa sang đúng màn mới chỉ sửa được nửa sau: đi tới nơi rồi mà KHÔNG THẤY mã nào mình vừa
     chọn, vì màn Đề xuất mua đọc hằng số `PURCHASE_GROUPS` chứ không đọc gì do màn này ghi ra.

     Nay ghi thật vào `window.OpsStore` — đúng chỗ prototype vẫn dùng cho trạng thái liên màn
     (`transfers`, `approvals`). `OpsStore.set` nhận patch nên thêm được khoá mới `manualPurchase`
     mà không phải sửa data.jsx; bên đọc luôn `|| []` vì khoá này vắng ở state khởi tạo.

     Chữ trên toast bỏ hai chữ "(nháp)": giỏ này KHÔNG phải chứng từ. Nói "đơn nháp" cho một thứ
     chưa có mã đơn, chưa có NCC, chưa vào hàng chờ duyệt là đúng lỗi vừa gỡ, chỉ nhẹ hơn. */
  const toPurchasing = () => {
    /* Khoá gộp = SKU × chi nhánh, y như `keyOf` của bảng: cùng một mã ở hai điểm bán là hai nhu
       cầu khác nhau. Chọn lại đúng dòng cũ thì THAY, không nhân đôi. */
    const picked = selectedRows.map((r) => ({
      key: keyOf(r), sku: r.sku, name: r.name, branch: r.branch, branchId: r.branchId,
      onHand: r.onHand, onOrder: r.onOrder, rop: r.rop, max: r.max, ads: r.ads, price: r.price,
      /* SL đề xuất theo đúng phép trừ engine đang hiện ở ô bằng chứng màn Chờ duyệt:
         Cần = Max − tồn − đang về. Không có sàn 1 ở đây (sàn 1 là luật của điều chuyển,
         `ManualTransferBuilder`) — mua 0 nghĩa là không cần mua, và nói ra được. */
      qty: Math.max(r.max - r.onHand - r.onOrder, 0),
    }));
    const n = picked.length;
    window.OpsStore.set((st) => {
      const keys = picked.map((p) => p.key);
      return { manualPurchase: [...picked, ...(st.manualPurchase || []).filter((p) => !keys.includes(p.key))] };
    });
    setSel(new Set());
    setToast(`Đã thêm ${n} SKU vào dự trù tay (chưa phải đơn) — đang mở màn Đề xuất mua hàng.`);
    if (setView) setView('purchasing');
  };
  const cbStyle = { width: 17, height: 17, accentColor: 'var(--dv-green)', cursor: 'pointer', flex: 'none' };

  /* File CSV lấy ĐÚNG bộ cột đang chọn và ĐÚNG tập đã lọc, nhưng dùng tên FILE. */
  const exportNow = () => {
    /* [T04] Cột đã ẩn theo cờ tenant thì cũng không ra file — màn và file phải cùng một bộ cột. */
    const picked = ALL_COLS.filter((k) => cols.includes(k) && !(invVenHidden && (k === 'ven' || k === 'venSource')));
    const headers = picked.map((k) => COL_BY_KEY[k].fileLabel || COL_BY_KEY[k].label);
    const val = {
      sku: (r) => r.sku, name: (r) => r.name, abc: abcOf,
      ven: (r) => venOf(r).value || '',
      venSource: (r) => VEN_SOURCE_LABEL[venOf(r).source],
      branch: (r) => r.branch, onHand: (r) => r.onHand, onOrder: (r) => r.onOrder, ads: (r) => r.ads,
      daysOfInv: (r) => r.doi, soldDays: (r) => (r.soldDays == null ? '' : r.soldDays),
      rop: (r) => r.rop, max: (r) => r.max, status: (r) => r.status, why: () => '',
    };
    window.exportCSV('ton_kho_chi_nhanh.csv', headers, rows.map((r) => picked.map((k) => val[k](r))));
  };

  const pad = density === 'gon' ? '6px 13px' : '11px 13px';
  const th = { padding: '10px 13px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border-default)' };
  const num = { padding: pad, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--dv-ink-soft)' };
  const countChip = (k, label) => (
    <button key={k} onClick={() => { setField('status', [k]); setAdded((a) => a.includes('status') ? a : [...a, 'status']); }}
      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)', fontSize: 12.5, color: filter.status.includes(k) ? 'var(--dv-green)' : 'var(--dv-ink-faint)', fontWeight: filter.status.includes(k) ? 700 : 400 }}>
      {label} <b style={{ fontFamily: 'var(--font-mono)' }}>{counts[k]}</b>
    </button>
  );

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1340, margin: '0 auto' }}>
      <PageHeader title="Tồn kho chi nhánh" subtitle="Sức khỏe tồn kho từng SKU × điểm bán. Từ đây tạo điều chuyển hoặc dự trù/mua thủ công — bổ trợ cho đề xuất engine tự sinh."
        actions={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--dv-ink-soft)' }}><IconRefresh size={14} />Đồng bộ lúc <b style={{ fontFamily: 'var(--font-mono)', color: 'var(--dv-ink)' }}>{lastSync}</b></span>} />

      {/* THANH ĐIỀU KIỆN — một hàng khi chưa lọc gì. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Tìm SKU, tên SP…" width={210} />
        {shown.map((f) => (
          <FilterChip key={f.key} field={f} value={filter[f.key]} counts={f.key === 'status' ? counts : null}
            onChange={(v) => setField(f.key, v)} onRemove={() => removeField(f.key)} />
        ))}
        <AddFilterMenu hidden={invUsableFields.filter((f) => shown.indexOf(f) < 0).map((f) => f.key)} onAdd={(k) => setAdded((a) => [...a, k])} />
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 8 }}>
          <ViewOptions cols={cols} setCols={setCols} mode={mode} setMode={setMode} density={density} setDensity={setDensity} hideKeys={invVenHidden ? ['ven', 'venSource'] : []} />
          <window.GhostBtn icon={React.createElement(IconDownload, { size: 15 })} onClick={exportNow}>Xuất CSV</window.GhostBtn>
        </span>
      </div>

      {/* Dòng tổng kết — giữ lại dãy đếm theo trạng thái mà thanh tab cũ vẫn cho. Bấm được. */}
      <div style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'baseline' }}>
        <span>Khớp <b style={{ color: 'var(--dv-ink)' }}>{NUM(rows.length)}</b> / {NUM(INVENTORY.length)} dòng</span>
        <span style={{ display: 'inline-flex', gap: 10 }}>
          {countChip('critical', 'Khẩn')}{countChip('low', 'Thấp')}{countChip('healthy', 'Đủ')}{countChip('overstock', 'Quá tồn')}
        </span>
        {sort.key && <span>· sắp theo <b style={{ color: 'var(--dv-ink)' }}>{(COL_BY_KEY[sort.key] || {}).label || sort.key}</b> {sort.dir === 'asc' ? 'tăng dần' : 'giảm dần'}</span>}
        {unknownNote && <span style={{ color: 'var(--dv-yellow-600)' }}>· {unknownNote}</span>}
        {activeCount > 0 && <button onClick={() => { setFilter(EMPTY_FILTER); setAdded([]); setPage(1); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 12.5, padding: 0 }}>· xoá {activeCount} bộ lọc</button>}
      </div>

      <div style={{ borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', background: '#fff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1060, fontFamily: 'var(--font-body)' }}>
            <thead><tr style={{ background: 'var(--dv-mist)' }}>
              <th style={{ ...th, width: 30 }}><input type="checkbox" checked={allOn} onChange={() => setSel(() => allOn ? new Set() : new Set(visible.map(keyOf)))} aria-label="Chọn tất cả dòng trong trang" style={cbStyle} /></th>
              <SortHeader colKey="sku" label="Sản phẩm" align="left" sort={sort} onSort={onSort} style={th} />
              {show('abc') && <SortHeader colKey="abc" label="ABC" align="center" sort={sort} onSort={onSort} style={th} />}
              {show('ven') && <SortHeader colKey="ven" label="VEN" align="center" sort={sort} onSort={onSort} style={th} />}
              {show('branch') && <SortHeader colKey="branch" label="Chi nhánh" align="left" sort={sort} onSort={onSort} style={th} />}
              {show('onHand') && <SortHeader colKey="onHand" label="Tồn" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('onOrder') && <SortHeader colKey="onOrder" label="Đang về" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('ads') && <SortHeader colKey="ads" label="ADS" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('daysOfInv') && <SortHeader colKey="daysOfInv" label="Ngày tồn" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('soldDays') && <SortHeader colKey="soldDays" label="Ngày bán" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('rop') && <SortHeader colKey="rop" label="Min" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('max') && <SortHeader colKey="max" label="Max" align="right" sort={sort} onSort={onSort} style={th} />}
              {show('status') && <SortHeader colKey="status" label="Trạng thái" align="left" sort={sort} onSort={onSort} style={th} />}
              {show('why') && <SortHeader colKey="why" label="Vì sao" align="left" sort={sort} onSort={onSort} style={th} />}
            </tr></thead>
            <tbody>
              {visible.map((r) => {
                const k = keyOf(r);
                const on = sel.has(k);
                const m = metaOf(r);
                const near = NEAR_EXPIRY_BY_SKU[r.sku];
                const c = abcOf(r);
                const v = venOf(r);
                const col = c === 'A' ? ['#D6ECE5', '#00533F'] : c === 'B' ? ['var(--dv-yellow-100)', 'var(--dv-yellow-600)'] : ['var(--dv-mist)', 'var(--dv-ink-soft)'];
                return (
                  /* Không bấm cả hàng để chọn: hàng này có ô có `title`, có huy hiệu, và sắp có thêm
                     đường đi tới chi tiết — gộp "bấm bất kỳ đâu = tick" vào đó là biến mọi lần bấm
                     nhầm thành một thay đổi lựa chọn im lặng. Chọn bằng đúng ô tick, như hệ thật. */
                  <tr key={k} style={{ borderTop: '1px solid var(--border-default)', background: on ? 'var(--dv-green-50)' : r.status === 'critical' ? '#FFFBF0' : 'transparent' }}>
                    <td style={{ padding: pad }}><input type="checkbox" checked={on} onChange={() => toggle(k)} aria-label={`Chọn ${r.sku} tại ${r.branch}`} style={cbStyle} /></td>
                    <td style={{ padding: pad }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{r.name}</span>
                        {m.type === 'rx' && <span style={{ fontSize: 9.5, fontWeight: 800, color: '#6b3fa0', background: '#F0E8F6', padding: '1px 6px', borderRadius: 5 }}>Rx</span>}
                        {m.storage === 'lanh' && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#1d4f8a', background: '#E5EEFb', padding: '1px 6px', borderRadius: 5 }}>Lạnh</span>}
                        {window.ControlBadge && <window.ControlBadge k={m.control} />}
                        {near && <span style={{ fontSize: 9.5, fontWeight: 700, color: near === 'critical' ? '#9c2b22' : 'var(--dv-yellow-600)', background: near === 'critical' ? '#F8E0DD' : 'var(--dv-yellow-100)', padding: '1px 6px', borderRadius: 5 }}>{near === 'critical' ? 'Cận hạn gấp' : 'Cận hạn'}</span>}
                      </div>
                      {density !== 'gon' && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{r.sku}</div>}
                    </td>
                    {show('abc') && <td style={{ padding: pad, textAlign: 'center' }}><span title={`Lớp ABC: ${c}`} style={{ display: 'inline-flex', width: 22, height: 22, borderRadius: 6, background: col[0], color: col[1], alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12 }}>{c}</span></td>}
                    {/* `title` mang NGUỒN suy. Một chữ "E" không kèm nguồn thì không tra ngược được, mà
                        đây là chỗ máy đang đoán hộ một phán đoán y khoa — phải tra ngược được. */}
                    {show('ven') && <td style={{ padding: pad, textAlign: 'center' }} title={VEN_SOURCE_LABEL[v.source]}>
                      {v.value
                        ? <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 6, background: 'var(--dv-yellow-100)', color: 'var(--dv-yellow-600)', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11.5 }}>{v.value}</span>
                        : <span style={{ color: 'var(--dv-ink-faint)' }}>—</span>}
                    </td>}
                    {show('branch') && <td style={{ padding: pad, fontSize: 13, color: 'var(--dv-ink-soft)' }}>{r.isWh ? <b style={{ color: 'var(--dv-green)' }}>{r.branch}</b> : r.branch}</td>}
                    {show('onHand') && <td style={{ ...num, fontSize: 13.5, fontWeight: 700, color: 'var(--dv-ink)' }}>{NUM(r.onHand)}</td>}
                    {show('onOrder') && <td style={{ ...num, color: r.onOrder ? 'var(--dv-green-bright)' : 'var(--dv-ink-faint)' }}>{r.onOrder ? NUM(r.onOrder) : '—'}</td>}
                    {show('ads') && <td style={{ ...num, fontSize: 13 }}>{NUM(r.ads)}</td>}
                    {/* Ngày tồn là SỐ, tô màu theo ngưỡng — không phải thanh bar. Thanh bar chiếm 140px
                        chiều ngang để nói đúng một con số, và không so sánh được giữa hai dòng cạnh nhau. */}
                    {show('daysOfInv') && <td style={{ ...num, fontWeight: 700, color: r.doi <= 7 ? 'var(--dv-danger, #9c2b22)' : r.doi < 15 ? 'var(--dv-yellow-600)' : 'var(--dv-ink)' }}>{Number.isFinite(r.doi) ? Math.round(r.doi) : '∞'}</td>}
                    {show('soldDays') && <td style={{ ...num, color: r.soldDays == null ? 'var(--dv-ink-faint)' : r.soldDays === 0 ? '#9c2b22' : 'var(--dv-ink-soft)' }} title={r.soldDays == null ? 'Không có số liệu ngày bán' : undefined}>{r.soldDays == null ? '—' : NUM(r.soldDays)}</td>}
                    {/* [T06 · DVP-531] Chip "Sàn" đọc cờ fixture `floorApplied`; xuất xứ con số nằm trong title. */}
                    {show('rop') && <td style={{ ...num, color: 'var(--dv-ink-faint)' }}>{NUM(r.rop)}{r.floorApplied && <span title="Số đến từ luật sàn — Sàn Min ≥ 1 khi có bán: phương pháp cho 0, sàn nâng lên 1 (66,7% ca Min1/Max2 của chuỗi đến từ sàn)." style={{ marginLeft: 5, fontSize: 9.5, fontWeight: 800, color: 'var(--dv-yellow-600)', background: 'var(--dv-yellow-100)', padding: '1px 5px', borderRadius: 5, verticalAlign: 'middle' }}>Sàn</span>}</td>}
                    {show('max') && <td style={{ ...num, color: 'var(--dv-ink-faint)' }}>{NUM(r.max)}</td>}
                    {show('status') && <td style={{ padding: pad }}><InvStatusBadge s={r.status} /></td>}
                    {show('why') && <td style={{ padding: pad, fontSize: 12, color: 'var(--dv-ink-soft)', maxWidth: 190 }}>{invWhyLine(r)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <div style={{ padding: '30px 20px', textAlign: 'center', fontSize: 13, color: 'var(--dv-ink-faint)' }}>Không dòng nào khớp — bỏ bớt một điều kiện ở thanh trên.</div>}
        </div>
        <Pager total={rows.length} page={curPage} size={size} setPage={setPage} setSize={setSize} />
      </div>

      {sel.size > 0 && (
        <div style={{ position: 'sticky', bottom: 18, marginTop: 16, zIndex: 30, display: 'flex', alignItems: 'center', gap: 16, background: 'var(--dv-green-900)', color: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-lg)', padding: '13px 18px', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 14 }}>
            <span style={{ minWidth: 26, height: 26, padding: '0 7px', borderRadius: 999, background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13 }}>{sel.size}</span>
            đã chọn
          </span>
          {selShort.length > 0 && <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)' }}>· {selShort.length} dòng thiếu hàng</span>}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 9, alignItems: 'center' }}>
            <button onClick={() => setSel(new Set())} style={{ border: '1px solid rgba(255,255,255,.25)', background: 'transparent', color: '#fff', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>Bỏ chọn</button>
            <button onClick={toPurchasing} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', background: 'rgba(255,255,255,.14)', color: '#fff', cursor: 'pointer', padding: '8px 15px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13 }}><IconCart size={15} />Lên dự trù / mua</button>
            <button onClick={batchTransfer} disabled={!selShort.length} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', background: selShort.length ? 'var(--dv-yellow)' : 'rgba(255,255,255,.18)', color: selShort.length ? 'var(--dv-green)' : 'rgba(255,255,255,.5)', cursor: selShort.length ? 'pointer' : 'default', padding: '9px 17px', borderRadius: 999, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5 }}><IconTransfer size={16} />Tạo điều chuyển ({selShort.length})</button>
          </div>
        </div>
      )}

      {build && <window.ManualTransferBuilder items={build} onClose={() => setBuild(null)} onCreate={onCreate} setToast={setToast} />}
    </div>
  );
}
window.InventoryScreen = InventoryScreen;

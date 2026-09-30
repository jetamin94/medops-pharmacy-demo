/* DV MedKing Ops Portal — Pharmacy side mock data (Dược Vương chain pilot). */

/* ---- Stores in the Dược Vương chain ---- */
const STORES = [
  { id: 'DV01', name: 'Dược Vương Q.1', short: 'Q.1' },
  { id: 'DV02', name: 'Dược Vương Q.3', short: 'Q.3' },
  { id: 'DV03', name: 'Dược Vương Q.5', short: 'Q.5' },
  { id: 'DV04', name: 'Dược Vương Gò Vấp', short: 'Gò Vấp' },
  { id: 'DV05', name: 'Dược Vương Tân Bình', short: 'Tân Bình' },
  { id: 'DV06', name: 'Dược Vương Thủ Đức', short: 'Thủ Đức' },
  { id: 'DV07', name: 'Dược Vương Bình Thạnh', short: 'Bình Thạnh' },
  { id: 'DV08', name: 'Dược Vương Q.7', short: 'Q.7' },
  { id: 'DV09', name: 'Dược Vương Bình Tân', short: 'Bình Tân' },
  { id: 'KHO', name: 'Kho tổng (DC)', short: 'Kho tổng' },
];

/* ---- Suppliers (NCC) ---- */
const SUPPLIERS = [
  { id: 'NCC01', name: 'Dược Hậu Giang (DHG)', leadtime: 2, debt: 184000000, debtLimit: 300000000, skus: 142, rating: 4.8, otd: 98, status: 'active', missing: false, source: 'dv_odoo' },
  { id: 'NCC02', name: 'Imexpharm', leadtime: 3, debt: 96500000, debtLimit: 200000000, skus: 88, rating: 4.6, otd: 96, status: 'active', missing: false, source: 'dv_odoo' },
  { id: 'NCC03', name: 'Traphaco', leadtime: 2, debt: 52000000, debtLimit: 150000000, skus: 76, rating: 4.7, otd: 97, status: 'active', missing: false, source: 'dv_odoo' },
  { id: 'NCC04', name: 'Stella (STADA VN)', leadtime: 4, debt: 210000000, debtLimit: 250000000, skus: 64, rating: 4.3, otd: 91, status: 'active', missing: true, source: 'manual' },
  { id: 'NCC05', name: 'DKSH Việt Nam', leadtime: 3, debt: 320000000, debtLimit: 500000000, skus: 196, rating: 4.5, otd: 95, status: 'active', missing: false, source: 'manual' },
  { id: 'NCC06', name: 'Boston Pharma', leadtime: 5, debt: 18000000, debtLimit: 120000000, skus: 41, rating: 4.1, otd: 88, status: 'active', missing: true, source: 'manual' },
  { id: 'NCC07', name: 'Pymepharco', leadtime: 3, debt: 74000000, debtLimit: 180000000, skus: 58, rating: 4.4, otd: 94, status: 'active', missing: false, source: 'dv_odoo' },
  { id: 'NCC08', name: 'Mega Lifesciences', leadtime: 6, debt: 0, debtLimit: 100000000, skus: 33, rating: 4.0, otd: 90, status: 'pending', missing: true, source: 'manual' },
];

/* ---- SKUs / products ---- */
const SKUS = [
  { id: 'SP0142', name: 'Paracetamol 500mg (Hapacol)', unit: 'Hộp 10 vỉ', mfr: 'DHG', doi: 4, need: 1800, value: 1620000 },
  { id: 'SP0088', name: 'Amoxicillin 500mg', unit: 'Hộp 100 viên', mfr: 'Imexpharm', doi: 6, need: 640, value: 5120000 },
  { id: 'SP0210', name: 'Augmentin 625mg', unit: 'Hộp 14 viên', mfr: 'GSK', doi: 9, need: 320, value: 18560000 },
  { id: 'SP0033', name: 'Efferalgan 500mg', unit: 'Hộp 16 viên', mfr: 'UPSA', doi: 12, need: 280, value: 4760000 },
  { id: 'SP0301', name: 'Berberin 10mg', unit: 'Lọ 100 viên', mfr: 'Mekophar', doi: 3, need: 900, value: 990000 },
  { id: 'SP0156', name: 'Vitamin C 1000mg sủi', unit: 'Tuýp 10 viên', mfr: 'DHG', doi: 8, need: 540, value: 3240000 },
  { id: 'SP0177', name: 'Omeprazol 20mg', unit: 'Hộp 28 viên', mfr: 'Stella', doi: 5, need: 410, value: 6150000 },
  { id: 'SP0245', name: 'Cefuroxim 500mg', unit: 'Hộp 10 viên', mfr: 'Pymepharco', doi: 7, need: 260, value: 9620000 },
  { id: 'SP0098', name: 'Loratadin 10mg', unit: 'Hộp 30 viên', mfr: 'Traphaco', doi: 14, need: 180, value: 1440000 },
  { id: 'SP0312', name: 'Salbutamol 4mg', unit: 'Hộp 20 viên', mfr: 'Boston', doi: 2, need: 720, value: 2160000 },
  { id: 'SP0067', name: 'Smecta hương cam', unit: 'Hộp 30 gói', mfr: 'Ipsen', doi: 11, need: 220, value: 7920000 },
  { id: 'SP0188', name: 'Enterogermina', unit: 'Hộp 20 ống', mfr: 'Sanofi', doi: 6, need: 340, value: 13600000 },
];

/* ---- 8 Dashboard KPIs ---- */
const KPIS = [
  { key: 'stockout', icon: 'IconAlertTriangle', tone: 'red', value: '37', label: 'Điểm thiếu hàng', sub: '12 SKU tại 5 điểm bán', tip: 'Số lượt (điểm bán × SKU) đang có tồn dưới mức tồn tối thiểu (Min) — cần bổ sung gấp. Bấm vào để xem đúng chừng đó dòng ở tab Khẩn.' },
  { key: 'tobuy', icon: 'IconCart', tone: 'yellow', value: '64', label: 'Cần nhập', sub: 'Trên 5 nhà cung cấp', tip: 'Số dòng đề xuất mua cho kho tổng, gộp theo nhà cung cấp, dựa trên dự báo nhu cầu và tồn kho hiện tại.' },
  { key: 'spend', icon: 'IconWallet', tone: 'green', value: '418tr', label: 'Giá trị mua dự kiến', sub: 'Kỳ nhập 7 ngày tới', tip: 'Tổng giá trị (chưa VAT) của toàn bộ đề xuất mua trong kỳ kế hoạch hiện tại.' },
  { key: 'deadstock', icon: 'IconCoins', tone: 'red', value: '262tr', label: 'Vốn ứ quá tồn', sub: '48 SKU > 90 ngày tồn', tip: 'Vốn ứ đọng (₫) ở các SKU có số ngày tồn kho vượt ngưỡng quá tồn 90 ngày. Tiền đang "ngủ" trong kho.' },
  { key: 'transfer', icon: 'IconTransfer', tone: 'yellow', value: '21', label: 'Cần điều chuyển', sub: 'Giữa 6 điểm bán', tip: 'Số đề xuất điều chuyển nội bộ: chuyển hàng từ điểm thừa sang điểm thiếu thay vì nhập mới.' },
  /* Thẻ này CỐ Ý gộp cả hai loại: nó dẫn tới màn Chờ duyệt, mà màn đó liệt kê cả đơn mua lẫn phiếu
     điều chuyển. Code từng thu về chỉ-PO (lúc điều chuyển chưa duyệt được) rồi đã sửa lại cho khớp
     đúng thẻ này — DVP-508. */
  { key: 'approve', icon: 'IconClipboardCheck', tone: 'yellow', value: '9', label: 'Chờ duyệt', sub: '5 đơn mua · 4 điều chuyển', tip: 'Số đơn nháp (mua + điều chuyển) đang chờ người có thẩm quyền phê duyệt.' },
  { key: 'expiryRisk', icon: 'IconHourglass', tone: 'yellow', value: '13,5tr', label: 'Giá trị cận hạn', sub: '7 lô trong thang FEFO', tip: 'Tổng giá trị (₫) các lô còn ≤ 90 ngày hạn dùng — xử lý theo thang 3 bậc ở màn Cận hạn / FEFO.' },
  { key: 'ncc', icon: 'IconSuppliers', tone: 'red', value: '2', label: 'NCC còn thiếu', sub: 'SKU chưa có NCC master', tip: 'Số SKU chưa gắn nhà cung cấp trong NCC master — chưa thể tạo đơn mua/RFQ.' },
];

/* ---- "Cần xử lý gấp" rows ----
   abc + min: dòng phụ dưới tên SP in "mã · ABC · Min" — hai con số này trả lời "vì sao gấp" và
   "ngưỡng đích là bao nhiêu", hợp với ô Tồn (ngày) ngay bên cạnh. `value` (giá trị tồn) giữ lại cho
   các màn khác dùng, nhưng KHÔNG còn hiện ở dòng phụ: tiền không nói được nên làm gì tiếp. */
const URGENT = [
  { sku: 'SP0312', name: 'Salbutamol 4mg', store: 'Dược Vương Q.5', doi: 2, action: 'Điều chuyển từ Q.1', type: 'transfer', value: 2160000, abc: 'C', min: 40 },
  { sku: 'SP0301', name: 'Berberin 10mg', store: 'Kho tổng (DC)', doi: 3, action: 'Tạo đơn mua DHG', type: 'buy', value: 990000, abc: 'C', min: 260 },
  { sku: 'SP0142', name: 'Paracetamol 500mg', store: 'Dược Vương Gò Vấp', doi: 4, action: 'Điều chuyển từ Kho tổng', type: 'transfer', value: 1620000, abc: 'A', min: 120 },
  { sku: 'SP0177', name: 'Omeprazol 20mg', store: 'Kho tổng (DC)', doi: 5, action: 'RFQ — bảng giá hết hạn', type: 'rfq', value: 6150000, abc: 'B', min: 55 },
  { sku: 'SP0088', name: 'Amoxicillin 500mg', store: 'Dược Vương Tân Bình', doi: 6, action: 'Tạo đơn mua Imexpharm', type: 'buy', value: 5120000, abc: 'A', min: 60 },
];

/* ---- Purchasing suggestions grouped by supplier ----
   abc = phân loại ABC (F2) · ads = sức bán/ngày toàn chuỗi (F3) · onHand = tồn kho tổng hiện tại
   source = nguồn NCC master: 'dv_odoo' (tự điền từ Odoo DV) | 'manual' (nhập tay)  (F10) */
const PURCHASE_GROUPS = [
  { ncc: 'NCC01', name: 'Dược Hậu Giang (DHG)', leadtime: 2, source: 'dv_odoo', lines: [
    { sku: 'SP0142', name: 'Paracetamol 500mg (Hapacol)', abc: 'A', ads: 62, onHand: 240, rop: 520, qty: 1800, unit: 'Hộp', price: 9000, total: 16200000 },
    { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', abc: 'B', ads: 19, onHand: 150, rop: 300, qty: 540, unit: 'Tuýp', price: 6000, total: 3240000 },
    /* [T06] `floorApplied` phải có Ở ĐÂY, không chỉ ở phiếu chờ duyệt: `createDraft` map cờ này
       sang phiếu, nên trước đây MỌI đơn tạo từ màn Đề xuất mua đều ra Chờ duyệt với cờ rỗng —
       và cùng mã SP0301 lại `floorApplied: true` ở fixture Chờ duyệt (dưới). Hai fixture nói
       ngược nhau về cùng một mã. */
    { sku: 'SP0301', name: 'Berberin 10mg', abc: 'C', ads: 31, onHand: 90, rop: 260, qty: 900, unit: 'Lọ', price: 1100, total: 990000, sparse: true, floorApplied: true },
  ] },
  { ncc: 'NCC02', name: 'Imexpharm', leadtime: 3, source: 'dv_odoo', lines: [
    { sku: 'SP0088', name: 'Amoxicillin 500mg', abc: 'A', ads: 24, onHand: 120, rop: 360, qty: 640, unit: 'Hộp', price: 8000, total: 5120000 },
    { sku: 'SP0245', name: 'Cefuroxim 500mg', abc: 'B', ads: 11, onHand: 70, rop: 180, qty: 260, unit: 'Hộp', price: 37000, total: 9620000, newSku: true },
  ] },
  { ncc: 'NCC05', name: 'DKSH Việt Nam', leadtime: 3, source: 'manual', lines: [
    { sku: 'SP0210', name: 'Augmentin 625mg', abc: 'A', ads: 14, onHand: 110, rop: 300, qty: 320, unit: 'Hộp', price: 58000, total: 18560000, expiryCap: true },
    { sku: 'SP0188', name: 'Enterogermina', abc: 'B', ads: 16, onHand: 95, rop: 240, qty: 340, unit: 'Hộp', price: 40000, total: 13600000 },
    { sku: 'SP0067', name: 'Smecta hương cam', abc: 'C', ads: 9, onHand: 60, rop: 150, qty: 220, unit: 'Hộp', price: 36000, total: 7920000 },
  ] },
];
/* SKU chưa gắn NCC master (F10) — engine dùng leadtime/MOQ mặc định, không gom được vào PO */
const MISSING_MASTER = [
  { sku: 'SP0399', name: 'Hoạt huyết dưỡng não Cebraton' },
  { sku: 'SP0412', name: 'Men vi sinh Bioacimin Gold' },
];

const PO_HISTORY = [
  { id: 'PO-2406-118', ncc: 'Dược Hậu Giang', lines: 8, value: 42600000, date: '06/06/2026', status: 'received' },
  { id: 'PO-2406-117', ncc: 'DKSH Việt Nam', lines: 4, value: 61240000, date: '05/06/2026', status: 'sent' },
  { id: 'PO-2406-116', ncc: 'Imexpharm', lines: 3, value: 14740000, date: '04/06/2026', status: 'approved' },
  { id: 'PO-2406-115', ncc: 'Traphaco', lines: 6, value: 22300000, date: '03/06/2026', status: 'received' },
];

/* ---- PO detail (drawer + timeline) ---- */
const PO_TIMELINE_STEPS = ['Tạo nháp', 'Duyệt', 'Gửi NCC', 'NCC xác nhận', 'Đang giao', 'Đã nhận (GRN)'];
const PO_DETAILS = {
  'PO-2406-118': { by: 'Trần Thị Mai', progress: 6, grn: 'GRN-2406-28',
    items: [
      { sku: 'SP0142', name: 'Paracetamol 500mg (Hapacol)', qty: 1800, unit: 'Hộp', price: 9000 },
      { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', qty: 540, unit: 'Tuýp', price: 6000 },
      { sku: 'SP0301', name: 'Berberin 10mg', qty: 900, unit: 'Lọ', price: 1100 },
      { sku: 'SP0420', name: 'Hapacol Sủi 650', qty: 480, unit: 'Hộp', price: 28000 },
    ], extraLines: 4, extraValue: 8730000,
    times: ['05/06 08:10', '05/06 09:02', '05/06 09:05', '05/06 10:40', '06/06 07:30', '06/06 13:45'] },
  'PO-2406-117': { by: 'Trần Thị Mai', progress: 3, grn: null,
    items: [
      { sku: 'SP0210', name: 'Augmentin 625mg', qty: 320, unit: 'Hộp', price: 58000 },
      { sku: 'SP0188', name: 'Enterogermina', qty: 340, unit: 'Hộp', price: 40000 },
      { sku: 'SP0067', name: 'Smecta hương cam', qty: 220, unit: 'Hộp', price: 36000 },
      { sku: 'SP0421', name: 'Insulin Mixtard 100IU', qty: 230, unit: 'Lọ', price: 92000 },
    ], extraLines: 0, extraValue: 0,
    times: ['05/06 08:20', '05/06 08:50', '05/06 08:52', null, null, null] },
  'PO-2406-116': { by: 'Trần Thị Mai', progress: 2, grn: 'GRN-2406-30',
    items: [
      { sku: 'SP0088', name: 'Amoxicillin 500mg', qty: 640, unit: 'Hộp', price: 8000 },
      { sku: 'SP0245', name: 'Cefuroxim 500mg', qty: 260, unit: 'Hộp', price: 37000 },
    ], extraLines: 0, extraValue: 0,
    times: ['04/06 14:05', '04/06 16:30', null, null, null, null] },
  'PO-2406-115': { by: 'Trần Thị Mai', progress: 6, grn: 'GRN-2406-29',
    items: [
      { sku: 'SP0098', name: 'Loratadin 10mg', qty: 450, unit: 'Hộp', price: 8000 },
      { sku: 'SP0430', name: 'Boganic', qty: 600, unit: 'Hộp', price: 22000 },
      { sku: 'SP0399', name: 'Hoạt huyết dưỡng não Cebraton', qty: 250, unit: 'Hộp', price: 22000 },
    ], extraLines: 0, extraValue: 0,
    times: ['03/06 09:15', '03/06 10:00', '03/06 10:02', '03/06 11:30', '04/06 06:50', '04/06 15:20'] },
};

/* ---- Notification center ---- */
const NOTIFICATIONS = [
  { id: 'N1', icon: 'IconClock', tone: 'red', text: 'RFQ-2406-08 còn dưới 6 giờ SLA — 3/4 NCC đã báo giá', time: '08:30 hôm nay', to: 'rfq' },
  { id: 'N2', icon: 'IconReceive', tone: 'red', text: 'GRN-2406-30 có 2 cảnh báo lệch 3 chiều (thiếu SL · lệch giá)', time: '08:12 hôm nay', to: 'receiving' },
  { id: 'N3', icon: 'IconClipboardCheck', tone: 'yellow', text: '9 mục đang chờ duyệt — 5 đơn mua · 4 điều chuyển', time: '08:42 hôm nay', to: 'approvals' },
  { id: 'N4', icon: 'IconHourglass', tone: 'yellow', text: 'Lô CF2403 (Cefuroxim) còn 15 ngày — đề xuất trả NCC', time: '07:55 hôm nay', to: 'expiry' },
  { id: 'N5', icon: 'IconQuote', tone: 'green', text: 'Imexpharm vừa gửi báo giá RFQ-2406-08 (4/4 dòng)', time: 'Hôm qua 17:48', to: 'rfq' },
  { id: 'N6', icon: 'IconSuppliers', tone: 'yellow', text: '3 NCC thiếu thông tin hồ sơ — engine không gom được đơn', time: 'Hôm qua 16:20', to: 'suppliers' },
];

/* ---- Transfer suggestions ---- */
const TRANSFERS = [
  { id: 'DC-0042', sku: 'SP0312', name: 'Salbutamol 4mg', from: 'Dược Vương Q.1', to: 'Dược Vương Q.5', qty: 60, fromDoi: 41, toDoi: 2, value: 2160000, kiotviet: true },
  { id: 'DC-0043', sku: 'SP0142', name: 'Paracetamol 500mg', from: 'Kho tổng (DC)', to: 'Dược Vương Gò Vấp', qty: 120, fromDoi: 38, toDoi: 4, value: 1080000, kiotviet: true },
  { id: 'DC-0044', sku: 'SP0098', name: 'Loratadin 10mg', from: 'Dược Vương Q.7', to: 'Dược Vương Thủ Đức', qty: 40, fromDoi: 52, toDoi: 9, value: 320000, kiotviet: false },
  /* fefoTier1: phiếu sinh từ luồng đẩy cận date (thang FEFO bậc 1) — màn Điều chuyển gắn badge riêng */
  { id: 'DC-0045', sku: 'SP0156', name: 'Vitamin C 1000mg sủi', from: 'Dược Vương Bình Thạnh', to: 'Dược Vương Tân Bình', qty: 80, fromDoi: 47, toDoi: 11, value: 480000, kiotviet: true, fefoTier1: true },
  /* DC-0046: CÙNG TUYẾN Q.1 → Q.5 với DC-0042 — để cách gom card theo cặp tuyến nhìn thấy được trên màn Điều chuyển */
  { id: 'DC-0046', sku: 'SP0301', name: 'Berberin 10mg', from: 'Dược Vương Q.1', to: 'Dược Vương Q.5', qty: 40, fromDoi: 41, toDoi: 3, value: 44000, kiotviet: true },
];

/* ---- Sản phẩm sắp hết tồn theo chi nhánh (cho điều chuyển thủ công) ---- */
const LOW_STOCK = [
  { sku: 'SP0312', name: 'Salbutamol 4mg', to: 'Dược Vương Q.5', onHand: 8, doi: 2, rop: 40, need: 62, price: 380, sources: [['Dược Vương Q.1', 120], ['Kho tổng (DC)', 300]] },
  { sku: 'SP0301', name: 'Berberin 10mg', to: 'Dược Vương Q.3', onHand: 14, doi: 3, rop: 50, need: 80, price: 1100, sources: [['Kho tổng (DC)', 260], ['Dược Vương Q.1', 40]] },
  { sku: 'SP0142', name: 'Paracetamol 500mg', to: 'Dược Vương Gò Vấp', onHand: 30, doi: 4, rop: 120, need: 140, price: 9000, sources: [['Kho tổng (DC)', 400], ['Dược Vương Q.7', 90]] },
  { sku: 'SP0088', name: 'Amoxicillin 500mg', to: 'Dược Vương Tân Bình', onHand: 22, doi: 6, rop: 60, need: 70, price: 8000, sources: [['Kho tổng (DC)', 180], ['Dược Vương Q.1', 30]] },
  { sku: 'SP0177', name: 'Omeprazol 20mg', to: 'Dược Vương Thủ Đức', onHand: 18, doi: 5, rop: 55, need: 60, price: 15000, sources: [['Kho tổng (DC)', 160]] },
  { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', to: 'Dược Vương Q.7', onHand: 26, doi: 8, rop: 70, need: 64, price: 6000, sources: [['Dược Vương Bình Thạnh', 80], ['Kho tổng (DC)', 300]] },
];

/* ---- Approvals queue (unified) — with line detail + decision context ---- */
const APPROVALS = [
  { id: 'PO-2406-119', kind: 'buy', title: 'Đơn mua — Dược Hậu Giang', lines: 3, value: 20430000, by: 'Trần Thị Mai', role: 'Mua hàng', at: '08:42 hôm nay',
    ncc: 'Dược Hậu Giang (DHG)', leadtime: 2, debt: 184000000, debtLimit: 300000000, budget: 418000000, budgetCap: 500000000,
    reason: 'Tồn kho tổng 3 SKU dưới điểm đặt lại (ROP) sau đồng bộ KiotViet 08:55.',
    items: [
      { sku: 'SP0142', name: 'Paracetamol 500mg', qty: 1800, unit: 'Hộp', price: 9000, onHand: 240, rop: 520, abc: 'A' },
      { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', qty: 540, unit: 'Tuýp', price: 6000, onHand: 150, rop: 300, abc: 'B' },
      { sku: 'SP0301', name: 'Berberin 10mg', qty: 900, unit: 'Lọ', price: 1100, onHand: 90, rop: 260, abc: 'C', floorApplied: true },
    ] },
  { id: 'PO-2406-120', kind: 'buy', title: 'Đơn mua — Imexpharm', lines: 2, value: 14740000, by: 'Trần Thị Mai', role: 'Mua hàng', at: '08:40 hôm nay',
    ncc: 'Imexpharm', leadtime: 3, debt: 96500000, debtLimit: 200000000, budget: 418000000, budgetCap: 500000000,
    reason: 'Bổ sung kháng sinh cho kho tổng theo dự báo 60 ngày.',
    items: [
      { sku: 'SP0088', name: 'Amoxicillin 500mg', qty: 640, unit: 'Hộp', price: 8000, onHand: 120, rop: 360, abc: 'A' },
      { sku: 'SP0245', name: 'Cefuroxim 500mg', qty: 260, unit: 'Hộp', price: 37000, onHand: 70, rop: 180, abc: 'B', newSku: true },
    ] },
  { id: 'DC-0042', kind: 'transfer', title: 'Điều chuyển — Q.1 → Q.5', lines: 1, value: 2160000, by: 'Lê Văn Hùng', role: 'Kho', at: '08:15 hôm nay',
    from: 'Dược Vương Q.1', to: 'Dược Vương Q.5', kiotviet: true,
    reason: 'Q.5 còn 2 ngày tồn Salbutamol; Q.1 thừa (41 ngày). Điều chuyển rẻ hơn nhập mới.',
    items: [{ sku: 'SP0312', name: 'Salbutamol 4mg', qty: 60, unit: 'Hộp', price: 36000, fromDoi: 41, toDoi: 2, abc: 'C' }] },
  { id: 'PO-2406-121', kind: 'buy', title: 'Đơn mua — DKSH Việt Nam', lines: 3, value: 124800000, by: 'Trần Thị Mai', role: 'Mua hàng', at: 'Hôm qua 17:20',
    ncc: 'DKSH Việt Nam', leadtime: 3, debt: 320000000, debtLimit: 500000000, budget: 418000000, budgetCap: 500000000,
    reason: 'Bổ sung nhóm A theo ROP. Đơn ≥ 100tr — cần duyệt 2 cấp. Lưu ý: công nợ NCC đang ở 64% hạn mức.',
    items: [
      { sku: 'SP0210', name: 'Augmentin 625mg', qty: 320, unit: 'Hộp', price: 58000, onHand: 110, rop: 300, abc: 'A' },
      { sku: 'SP0188', name: 'Enterogermina', qty: 340, unit: 'Hộp', price: 40000, onHand: 95, rop: 240, abc: 'B' },
      { sku: 'SP0067', name: 'Smecta hương cam', qty: 220, unit: 'Hộp', price: 36000, onHand: 60, rop: 150, abc: 'C' },
    ] },
  { id: 'DC-0043', kind: 'transfer', title: 'Điều chuyển — Kho tổng → Gò Vấp', lines: 1, value: 1080000, by: 'Lê Văn Hùng', role: 'Kho', at: 'Hôm qua 16:55',
    from: 'Kho tổng (DC)', to: 'Dược Vương Gò Vấp', kiotviet: true,
    reason: 'Gò Vấp còn 4 ngày tồn Paracetamol; kho tổng đủ cấp.',
    items: [{ sku: 'SP0142', name: 'Paracetamol 500mg', qty: 120, unit: 'Hộp', price: 9000, fromDoi: 38, toDoi: 4, abc: 'A' }] },
];

/* ---- Expiry / FEFO lots — thang 3 bậc 90/60/30 + buffer 7n (khớp Cài đặt) ---- */
const EXPIRY = [
  { sku: 'SP0245', name: 'Cefuroxim 500mg', lot: 'CF2403', store: 'Dược Vương Q.5', exp: '24/06/2026', days: 15, qty: 22, value: 814000, action: 'Trả NCC / đổi lô' },
  { sku: 'SP0210', name: 'Augmentin 625mg', lot: 'AG2405', store: 'Dược Vương Q.3', exp: '28/06/2026', days: 19, qty: 86, value: 4988000, action: 'Markdown 30% / trả NCC' },
  { sku: 'SP0188', name: 'Enterogermina', lot: 'EN2406', store: 'Dược Vương Q.7', exp: '05/07/2026', days: 26, qty: 54, value: 2160000, action: 'Markdown / đẩy bán gấp' },
  { sku: 'SP0033', name: 'Efferalgan 500mg', lot: 'EF2312', store: 'Kho tổng (DC)', exp: '12/07/2026', days: 33, qty: 140, value: 2380000, action: 'Khuyến mãi đẩy bán' },
  { sku: 'SP0067', name: 'Smecta hương cam', lot: 'SM2404', store: 'Dược Vương Bình Tân', exp: '20/07/2026', days: 41, qty: 38, value: 1368000, action: 'Khuyến mãi 15%' },
  { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', lot: 'VC2403', store: 'Dược Vương Tân Bình', exp: '21/08/2026', days: 71, qty: 120, value: 1020000, action: 'Chuyển CH bán nhanh' },
  { sku: 'SP0098', name: 'Loratadin 10mg', lot: 'LR2402', store: 'Kho tổng (DC)', exp: '03/09/2026', days: 84, qty: 95, value: 760000, action: 'Chuyển CH bán nhanh' },
];

/* ---- RFQ list ---- */
function ts(h) { return Date.now() + h * 3.6e6; }
const RFQS = [
  { id: 'RFQ-2406-08', title: 'Bổ sung kháng sinh Q2', lines: 4, nccs: 4, quoted: 3, status: 'open', deadline: ts(5.4), created: '07/06/2026' },
  { id: 'RFQ-2406-07', title: 'Hạ giá nhóm giảm đau', lines: 6, nccs: 3, quoted: 3, status: 'open', deadline: ts(28), created: '07/06/2026' },
  { id: 'RFQ-2406-06', title: 'Vitamin & TPCN tháng 6', lines: 9, nccs: 5, quoted: 5, status: 'submitted', deadline: ts(-12), created: '05/06/2026' },
  { id: 'RFQ-2406-05', title: 'Tiêu hóa — bổ sung tồn', lines: 3, nccs: 4, quoted: 4, status: 'awarded', deadline: ts(-48), created: '03/06/2026' },
];

/* ---- RFQ compare matrix (RFQ-2406-08) ---- */
const RFQ_DETAIL = {
  id: 'RFQ-2406-08', title: 'Bổ sung kháng sinh Q2', deadline: ts(5.4),
  lines: [
    { sku: 'SP0088', name: 'Amoxicillin 500mg', qty: 640, unit: 'Hộp', target: 8000 },
    { sku: 'SP0245', name: 'Cefuroxim 500mg', qty: 260, unit: 'Hộp', target: 37000 },
    { sku: 'SP0210', name: 'Augmentin 625mg', qty: 320, unit: 'Hộp', target: 58000 },
    { sku: 'SP0177', name: 'Omeprazol 20mg', qty: 410, unit: 'Hộp', target: 15000 },
  ],
  suppliers: [
    { id: 'NCC02', name: 'Imexpharm', leadtime: 3, submittedAt: '2 giờ trước', orderPromo: { type: 'order_tier', threshold: 50000000, pct: 2, label: 'Đơn ≥50tr +2%' }, offers: {
      SP0088: { price: 7600, fill: 640, vat: 5, promo: [{ type: 'pct', value: 5, label: 'CK 5%' }] }, SP0245: { price: 36500, fill: 260, vat: 5 },
      SP0210: { price: 59000, fill: 200, vat: 8, promo: [{ type: 'bonus', buy: 10, free: 1, label: 'Mua 10 tặng 1' }] }, SP0177: { price: 14600, fill: 410, vat: 5 } } },
    { id: 'NCC01', name: 'Dược Hậu Giang', leadtime: 2, submittedAt: '4 giờ trước', offers: {
      SP0088: { price: 7900, fill: 640, vat: 5 }, SP0245: { price: 37200, fill: 260, vat: 5, promo: [{ type: 'amount', value: 1500, label: '-1.500₫/hộp' }] },
      SP0210: { price: 57000, fill: 320, vat: 8 }, SP0177: { price: 15200, fill: 410, vat: 5, promo: [{ type: 'pct', value: 4, label: 'CK 4%' }] } } },
    { id: 'NCC05', name: 'DKSH Việt Nam', leadtime: 3, submittedAt: '1 giờ trước', orderPromo: { type: 'rebate', period: 'quý', pct: 1.5, label: 'Thưởng quý 1,5%' }, offers: {
      SP0088: { price: 8100, fill: 500, vat: 5 }, SP0245: { price: 35900, fill: 260, vat: 5, promo: [{ type: 'pct', value: 3, label: 'CK 3%' }, { type: 'bonus', buy: 20, free: 1, label: 'Mua 20 tặng 1' }] },
      SP0210: { price: 56500, fill: 320, vat: 8 }, SP0177: null } },
    { id: 'NCC07', name: 'Pymepharco', leadtime: 3, submittedAt: 'Chưa báo giá', offers: null },
  ],
};

/* ---- Receiving / GRN shipments ---- */
const SHIPMENTS = [
  { id: 'GRN-2406-31', po: 'PO-2406-117', ncc: 'DKSH Việt Nam', eta: 'Hôm nay 14:00', lines: 5, carrier: 'GHN', tracking: 'GHN84512330', status: 'shipping' },
  { id: 'GRN-2406-30', po: 'PO-2406-116', ncc: 'Imexpharm', eta: 'Đã đến', lines: 3, carrier: 'Nội bộ', tracking: '—', status: 'pending' },
  { id: 'GRN-2406-29', po: 'PO-2406-115', ncc: 'Traphaco', eta: 'Đã đến', lines: 6, carrier: 'Viettel Post', tracking: 'VT220914', status: 'received' },
];

const GRN_DETAIL = {
  id: 'GRN-2406-30', po: 'PO-2406-116', ncc: 'Imexpharm',
  lines: [
    { sku: 'SP0088', name: 'Amoxicillin 500mg', ordered: 640, received: 640, lot: 'AM2406', exp: '15/05/2028', poPrice: 8000, invPrice: 8000, match: 'matched' },
    { sku: 'SP0245', name: 'Cefuroxim 500mg', ordered: 260, received: 240, lot: 'CF2406', exp: '02/03/2028', poPrice: 37000, invPrice: 37000, match: 'short' },
    { sku: 'SP0177', name: 'Omeprazol 20mg', ordered: 410, received: 410, lot: 'OM2405', exp: '20/01/2028', poPrice: 15000, invPrice: 15600, match: 'price' },
  ],
};

/* ---- Supplier new-product offers (pipeline) ---- */
const OFFERS = [
  { id: 'OF-118', ncc: 'Boston Pharma', name: 'Bostanex 5mg (Desloratadin)', pack: 'Hộp 10 vỉ × 10 viên', price: 42000, vat: 5, note: 'Thay thế Telfast, giá thấp hơn 12%', status: 'pending' },
  { id: 'OF-117', ncc: 'Mega Lifesciences', name: 'Bivinadol Extra', pack: 'Hộp 10 vỉ × 10 viên', price: 18000, vat: 8, note: 'Giảm đau hạ sốt, nhóm bán chạy', status: 'pending' },
  { id: 'OF-116', ncc: 'Pymepharco', name: 'Pyfaclor 250mg', pack: 'Hộp 12 viên', price: 51000, vat: 5, note: 'Kháng sinh Cefaclor', status: 'pending' },
  { id: 'OF-115', ncc: 'DHG', name: 'Hapacol Sủi 650', pack: 'Hộp 24 gói', price: 28000, vat: 8, note: '', status: 'approved' },
];

/* ---- Org / invites ---- */
const INVITES = [
  { ncc: 'Mega Lifesciences', email: 'sales@megawecare.com.vn', sent: '06/06/2026', status: 'pending' },
  { ncc: 'OPC Pharma', email: 'kinhdoanh@opcpharma.com', sent: '04/06/2026', status: 'claimed' },
  { ncc: 'Hậu Giang Nature', email: 'b2b@hgnature.vn', sent: '02/06/2026', status: 'expired' },
];

/* ---- Audit log ---- */
const AUDIT = [
  /* Cài đặt chảy vào Nhật ký: sửa/gỡ tham số dự trù đều để lại vết (obj PARAM) */
  { at: '09:20:11 09/06', who: 'Trần Thị Mai', role: 'admin', act: 'Sửa tham số dự trù', obj: 'PARAM', detail: 'Ô A×E: P_min 97,5 → 98 · hồ sơ Mặc định' },
  { at: '09:18:40 09/06', who: 'Trần Thị Mai', role: 'admin', act: 'Gỡ ghi đè tham số', obj: 'PARAM', detail: 'doiTargetDays — về mặc định hệ thống (op: clear)' },
  { at: '09:12:04 09/06', who: 'Trần Thị Mai', role: 'purchasing', act: 'Tạo đơn mua nháp', obj: 'PO-2406-121', detail: '3 dòng · 40.080.000₫ · DKSH' },
  { at: '08:55:31 09/06', who: 'Hệ thống', role: 'system', act: 'Đồng bộ KiotViet', obj: 'SYNC-7741', detail: '10 điểm bán · 1.842 SKU · 4,2s' },
  { at: '08:42:18 09/06', who: 'Nguyễn Văn Bình', role: 'approver', act: 'Duyệt đơn mua', obj: 'PO-2406-118', detail: 'Gửi NCC Dược Hậu Giang' },
  { at: '08:15:07 09/06', who: 'Lê Văn Hùng', role: 'warehouse', act: 'Tạo điều chuyển', obj: 'DC-0042', detail: 'Q.1 → Q.5 · Salbutamol ×60' },
  { at: '17:48:55 08/06', who: 'Imexpharm', role: 'supplier', act: 'Gửi báo giá', obj: 'RFQ-2406-08', detail: '4/4 dòng · SLA còn 23g' },
  { at: '16:30:12 08/06', who: 'Trần Thị Mai', role: 'purchasing', act: 'Award RFQ', obj: 'RFQ-2406-05', detail: 'Chọn Traphaco · 3 dòng' },
];

Object.assign(window, {
  STORES, SUPPLIERS, SKUS, KPIS, URGENT, PURCHASE_GROUPS, MISSING_MASTER, PO_HISTORY, TRANSFERS, LOW_STOCK,
  APPROVALS, EXPIRY, RFQS, RFQ_DETAIL, SHIPMENTS, GRN_DETAIL, OFFERS, INVITES, AUDIT,
  PO_TIMELINE_STEPS, PO_DETAILS, NOTIFICATIONS,
});

/* ---- OpsStore: trạng thái "sống" dùng chung giữa các màn (A5/S2) ----
   DC-0042/0043 đã nằm trong hàng Chờ duyệt nên khởi tạo 'approved' ở màn Điều chuyển. */
window.OpsStore = (() => {
  /* khép vòng 2 cổng: đọc phiếu giao do cổng NCC tạo (localStorage) */
  const readIncoming = () => { try { return JSON.parse(localStorage.getItem('dv_ops_incoming') || '[]'); } catch (e) { return []; } };
  let state = {
    approvals: APPROVALS.map((a) => ({ ...a, state: 'pending' })),
    transfers: TRANSFERS.map((t) => ({ ...t, state: ['DC-0042', 'DC-0043'].includes(t.id) ? 'approved' : 'suggested' })),
    rfqs: RFQS.map((r) => ({ ...r })),
    offers: OFFERS.map((o) => ({ ...o })),
    shipments: [...readIncoming().map((s) => ({ ...s, status: s.status === 'received' ? 'received' : s.status })), ...SHIPMENTS.map((s) => ({ ...s }))],
  };
  const subs = new Set();
  const get = () => state;
  const set = (patch) => { state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }; subs.forEach((f) => f(state)); };
  const use = () => {
    const [s, setS] = React.useState(state);
    React.useEffect(() => { const f = (ns) => setS(ns); subs.add(f); return () => subs.delete(f); }, []);
    return s;
  };
  /* tab cổng NCC mở song song: vận đơn mới xuất hiện trực tiếp */
  window.addEventListener('storage', (e) => {
    if (e.key !== 'dv_ops_incoming') return;
    const inc = readIncoming();
    set((st) => ({ shipments: [...inc.filter((x) => !st.shipments.some((y) => y.id === x.id)), ...st.shipments] }));
  });
  return { get, set, use };
})();

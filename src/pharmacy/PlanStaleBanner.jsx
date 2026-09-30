/* Pharmacy — băng "kế hoạch đang hiện đã cũ" (DVP-514).

   Đối ứng 1:1 với `components/plan/PlanStaleBanner.tsx` trong code thật, và được ghép ở CẤP TRANG
   đúng như bên đó (`app/(portal)/purchasing/page.tsx` và `…/transfers/page.tsx` render nó trên
   `<PageTitle>`). Ở prototype, chỗ tương đương là router trong `Pharmacy Portal.html`.

   VÌ SAO CẦN — [Đo — prod, tenant `ntvmed`, 2026-08-20] bỏ kho tổng để chuỗi còn 0 kho rồi gọi
   `loadPlan`:

       [1 kho tổng]  loadPlan → 2499 dòng · transfers=94
       [0 kho tổng]  loadPlan → 2499 dòng · transfers=94   ← y nguyên

   Màn KHÔNG trống, KHÔNG báo lỗi — nó phục vụ kế hoạch cũ. Nguy hiểm nằm ở chỗ 94 gợi ý kia
   rút hàng TỪ một điểm bán không còn là kho tổng.

   ĐỂ XEM THỬ: bật bảng chỉnh (góc phải) › *Kịch bản* › **Số kho tổng hoạt động** — đặt 0 hoặc 2.
   Trong sản phẩm thật con số này đến từ `countActiveWarehouses(loadBranches(…))` và đổi khi người
   dùng bấm ở **Điểm bán & Mạng lưới › cột Loại**. */
function PlanStaleBanner({ activeWarehouses, what }) {
  const { IconAlertTriangle } = window;
  if (activeWarehouses === 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, background: '#FDECEA', border: '1px solid #C5372C', borderRadius: 'var(--radius-card)', padding: '13px 16px', marginBottom: 18 }}>
      <span style={{ color: '#C5372C', flex: 'none', marginTop: 1, display: 'inline-flex' }}><IconAlertTriangle size={18} /></span>
      <div style={{ fontSize: 13, color: 'var(--dv-ink)', lineHeight: 1.6 }}>
        <b>
          {activeWarehouses === 0
            ? 'Chuỗi chưa có kho tổng nào đang hoạt động — '
            : `Chuỗi đang có ${activeWarehouses} kho tổng hoạt động — `}
          {what} bên dưới là của lần tính gần nhất.
        </b>{' '}
        Engine cần <b>đúng một</b> kho tổng mới tính lại được, nên số đang hiện <b>không phản ánh cấu hình hiện tại</b>
        {activeWarehouses === 0 ? ' — kể cả các dòng rút hàng từ điểm bán nay không còn là kho tổng' : ''}. Sửa ở{' '}
        <b>Điểm bán &amp; Mạng lưới</b> › cột <b>Loại</b>, số sẽ tự tính lại.
      </div>
    </div>
  );
}
window.PlanStaleBanner = PlanStaleBanner;

/* Pharmacy — TRANG CHI TIẾT phiếu điều chuyển (DVP-552, phản hồi tenant #24).

   Đối ứng 1:1 với `app/(portal)/transfers/[id]/page.tsx` trong code thật, và cũng được ghép ở CẤP
   ROUTER (`Pharmacy Portal.html`) đúng như bên đó nó là một route riêng — không phải một khối bên
   trong màn Điều chuyển.

   VÌ SAO CÓ — người dùng (mymy, 25-08) báo về CHÍNH bản DVP-542 vừa lên hôm trước:

       "Với những đơn gom điều chuyển số lượng nhiều, việc view thông tin dòng đơn hàng với UI
        này sẽ gặp khó khăn"

   Bản đó mở dòng hàng bằng một khối NGAY TRONG dòng bảng, cao tối đa 320px với thanh cuộn riêng,
   lồng trong một trang cũng đang cuộn. Ở màn Chờ duyệt thì hợp (liếc trước khi ký); với phiếu gom
   thật 43–49 dòng thì không đọc nổi. Nên khối đó đã bị GỠ khỏi màn Điều chuyển và GIỮ ở Chờ duyệt.

   ── VÌ SAO CÓ DỮ LIỆU MOCK RIÊNG Ở ĐÂY ────────────────────────────────────────────────────────
   `TRANSFERS` trong `data.jsx` là ĐỀ XUẤT của engine: mỗi dòng đúng một SKU. Nó không diễn được thứ
   mà màn này sinh ra để giải — một phiếu GOM nhiều dòng. Nên hai phiếu mẫu bên dưới cố ý có một
   phiếu ngắn (2 dòng) và một phiếu dài (18 dòng): người duyệt thiết kế phải nhìn được đúng ca khó,
   không phải ca dễ.

   ── BA CHỖ CỐ Ý, ĐỀU LÀ QUYẾT ĐỊNH CHỨ KHÔNG PHẢI TRANG TRÍ ────────────────────────────────────
   1. MỐC CHƯA XẢY RA THÌ GHI RA, KHÔNG ĐỂ TRỐNG. `dispatched_at` chỉ có từ DVP-527, nên phiếu cũ
      hơn sẽ không bao giờ có mốc "rời kho" *dù đã đi thật*. Một ô trống đọc thành "chưa xảy ra";
      chữ "chưa xảy ra" thì đọc đúng như thế.
   2. MÃ HỆ NGOÀI rỗng KHÔNG ĐỌC ĐƯỢC LÀ "CHƯA ĐẨY". [Đo — prod, 2026-08-23] `TRF-202608-001` có
      job đẩy ở trạng thái `sent` mà mã vẫn rỗng: hệ ngoài nhận phiếu nhưng không trả mã. Tín hiệu
      đúng cho "đã rời kho" là mốc ở ô bên cạnh.
   3. GIÁ TRỊ rỗng LÀ "CHƯA BIẾT", KHÁC 0đ. SKU chưa khai giá nhập bị bỏ RA NGOÀI bảng giá (cố ý),
      nên quy về 0 là khẳng định hàng không đáng tiền.

   ĐỂ XEM THỬ: bảng chỉnh (góc phải) › *Kịch bản* › **Mở phiếu điều chuyển** — đổi giữa phiếu
   ngắn (đã duyệt, đã rời kho) và phiếu dài (18 dòng, còn chờ ký). */

const TRANSFER_TICKETS = [
  {
    id: 'TRF-202608-025',
    externalRef: 'TRF000059',
    status: 'approved',
    dispatchedAt: '8 giờ trước',
    from: 'Kho tổng (DC)',
    to: 'Dược Vương Q.5',
    value: 2160000,
    createdBy: 'Lê Văn Hùng',
    createdAt: '9 giờ trước',
    decidedBy: 'Nguyễn Văn Bình',
    decidedAt: '8 giờ trước',
    lines: [
      { sku: 'SP0312', name: 'Salbutamol 4mg', qty: 60 },
      { sku: 'SP0301', name: 'Berberin 10mg', qty: 80 },
    ],
  },
  {
    /* Phiếu GOM — ca mà phản hồi #24 nói tới. 18 dòng, trong khi khối mở-tại-chỗ cũ cao 320px. */
    id: 'TRF-202608-024',
    externalRef: null,
    status: 'pending_approval',
    dispatchedAt: null,
    from: 'Kho tổng (DC)',
    to: 'Dược Vương Gò Vấp',
    value: null,
    createdBy: 'mymy',
    createdAt: '1 ngày trước',
    decidedBy: null,
    decidedAt: null,
    lines: [
      { sku: 'SP0142', name: 'Paracetamol 500mg (Hapacol)', qty: 120 },
      { sku: 'SP0088', name: 'Amoxicillin 500mg', qty: 64 },
      { sku: 'SP0210', name: 'Augmentin 625mg', qty: 32 },
      { sku: 'SP0033', name: 'Efferalgan 500mg', qty: 28 },
      { sku: 'SP0301', name: 'Berberin 10mg', qty: 90 },
      { sku: 'SP0156', name: 'Vitamin C 1000mg sủi', qty: 54 },
      { sku: 'SP0177', name: 'Omeprazol 20mg', qty: 41 },
      { sku: 'SP0245', name: 'Cefuroxim 500mg', qty: 26 },
      { sku: 'SP0098', name: 'Loratadin 10mg', qty: 18 },
      { sku: 'SP0312', name: 'Salbutamol 4mg', qty: 72 },
      { sku: 'SP0067', name: 'Smecta hương cam', qty: 22 },
      { sku: 'SP0188', name: 'Enterogermina', qty: 34 },
      { sku: 'SP0420', name: 'Hapacol Sủi 650', qty: 48 },
      { sku: 'SP0430', name: 'Boganic', qty: 60 },
      { sku: 'SP0399', name: 'Hoạt huyết dưỡng não Cebraton', qty: 25 },
      { sku: 'SP0412', name: 'Men vi sinh Bioacimin Gold', qty: 30 },
      { sku: 'SP0421', name: 'Insulin Mixtard 100IU', qty: 23 },
      /* Mã vắng khỏi danh mục vẫn HIỆN RA: người đọc cần thấy "có một dòng lạ" hơn là thấy một
         phiếu ngắn đi mà không biết vì sao. */
      { sku: 'SP9999', name: null, qty: 12 },
    ],
  },
];

const TRF_STATUS = {
  pending_approval: { label: 'Chờ ký duyệt', bg: '#FFF4D6', fg: '#8A6100' },
  approved: { label: 'Hàng đang trên đường', bg: '#E3F2EC', fg: '#04684D' },
  executed: { label: 'Đã nhận', bg: '#EEF0EF', fg: '#525B58' },
  rejected: { label: 'Từ chối', bg: '#FDECEA', fg: '#C5372C' },
};

function TrfMuc({ nhan, children }) {
  return (
    <div style={{ background: '#fff', padding: '13px 18px' }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: '#6B7472', marginBottom: 5 }}>{nhan}</div>
      <div style={{ fontSize: 13.5, color: 'var(--dv-ink)' }}>{children}</div>
    </div>
  );
}

/* Một mốc vòng đời. `luc` rỗng ⇒ mốc CHƯA xảy ra — nói thế thay vì để trống. */
function TrfMoc({ nhan, ai, luc }) {
  const xong = !!luc;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, padding: '9px 0' }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', flex: 'none', background: xong ? 'var(--dv-green)' : '#E3E6E5', border: xong ? 'none' : '1px solid #CBD2CF' }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)', minWidth: 200 }}>{nhan}</span>
      {xong
        ? <span style={{ fontSize: 12.5, color: '#525B58' }}>{ai ? ai + ' · ' : ''}{luc}</span>
        : <span style={{ fontSize: 12.5, color: '#8A938F' }}>chưa xảy ra</span>}
    </div>
  );
}

/* Thẻ có tiêu đề. CỐ Ý tự định nghĩa, không mượn chỗ khác — đo tại chỗ 2026-08-25:
   `Card` của bộ thiết kế (`window.DVMedKingDesignSystem_*.Card`) **không có prop `title`**, và
   `window.SecCard` thì nằm trong `Settings.jsx` nên dùng chéo màn là tạo một ràng buộc ngầm giữa
   hai màn không liên quan. `flush` bỏ đệm ngang để bảng dòng hàng chạy hết chiều rộng thẻ. */
function TrfCard({ title, flush, children }) {
  return (
    <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid #EEF0EF' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--dv-green)', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: flush ? 0 : '4px 20px 14px' }}>{children}</div>
    </section>
  );
}

function TransferDetailScreen({ ticketId, setView, setToast }) {
  const t = TRANSFER_TICKETS.find((x) => x.id === ticketId) || TRANSFER_TICKETS[0];
  const st = TRF_STATUS[t.status] || TRF_STATUS.executed;
  const tongSl = t.lines.reduce((s, l) => s + l.qty, 0);
  const vnd = (n) => n.toLocaleString('vi-VN') + '₫';

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', marginBottom: 18 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--dv-green)' }}>Phiếu {t.id}</div>
          <div style={{ fontSize: 13, color: '#525B58', marginTop: 3 }}>
            {t.from} → {t.to} · {t.lines.length} dòng · tổng {tongSl}
          </div>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 11px', borderRadius: 999, background: st.bg, color: st.fg }}>{st.label}</span>
          <button type="button" onClick={() => setView('transfers')} style={{ border: '1px solid #CBD2CF', background: '#fff', color: 'var(--dv-ink)', borderRadius: 999, padding: '7px 15px', fontSize: 12.5, cursor: 'pointer' }}>← Về danh sách</button>
        </span>
      </div>

      <div style={{ background: '#E3E6E5', borderRadius: 'var(--radius-card)', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 1, boxShadow: 'var(--shadow-card)' }}>
        <TrfMuc nhan="Mã phiếu"><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{t.id}</span></TrfMuc>
        <TrfMuc nhan="Mã hệ ngoài">
          {t.externalRef
            ? <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{t.externalRef}</span>
            : <span style={{ color: '#8A938F', cursor: 'help' }} title="Hệ ngoài không trả mã — KHÔNG đọc được là chưa đẩy">—</span>}
        </TrfMuc>
        <TrfMuc nhan="Giá trị tồn dịch chuyển">
          {t.value == null
            ? <span style={{ color: '#8A938F', cursor: 'help' }} title="Phiếu có SKU chưa khai giá nhập — không định giá được">—</span>
            : <span style={{ fontFamily: 'var(--font-mono)' }}>{vnd(t.value)}</span>}
        </TrfMuc>
        <TrfMuc nhan="Từ → Đến">{t.from} <span style={{ color: '#8A938F' }}>→</span> {t.to}</TrfMuc>
      </div>

      <div style={{ marginTop: 18 }}>
        <TrfCard title="Vòng đời phiếu" flush>
          <div style={{ padding: '4px 18px 14px' }}>
            <TrfMoc nhan="Tạo phiếu" ai={t.createdBy} luc={t.createdAt} />
            <TrfMoc nhan={t.status === 'rejected' ? 'Từ chối' : 'Ký duyệt'} ai={t.decidedBy} luc={t.decidedAt} />
            <TrfMoc nhan="Rời kho (đẩy sang hệ ngoài)" ai={null} luc={t.dispatchedAt} />
          </div>
          {t.status === 'pending_approval' && (
            <div style={{ padding: '12px 18px', borderTop: '1px solid #E3E6E5', display: 'flex', gap: 9 }}>
              <button type="button" onClick={() => setToast && setToast('Đã duyệt phiếu ' + t.id + '.')} style={{ border: 'none', background: 'var(--dv-green)', color: '#fff', borderRadius: 999, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Duyệt</button>
              <button type="button" onClick={() => setToast && setToast('Đã từ chối phiếu ' + t.id + '.')} style={{ border: '1px solid #C5372C', background: '#fff', color: '#C5372C', borderRadius: 999, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Từ chối</button>
            </div>
          )}
        </TrfCard>
      </div>

      <div style={{ marginTop: 18 }}>
        <TrfCard title={'Dòng hàng · ' + t.lines.length + ' dòng'} flush>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--dv-mist, #F3F6F5)' }}>
                <th style={{ textAlign: 'left', padding: '9px 16px', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: '#6B7472' }}>Mã SKU</th>
                <th style={{ textAlign: 'left', padding: '9px 16px', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: '#6B7472' }}>Tên sản phẩm</th>
                <th style={{ textAlign: 'right', padding: '9px 16px', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: '#6B7472' }}>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {t.lines.map((l, i) => (
                <tr key={l.sku + i} style={{ borderTop: '1px solid #EEF0EF' }}>
                  <td style={{ padding: '10px 16px', fontSize: 13.5 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--dv-green-bright, #04684D)' }}>{l.sku}</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13.5, color: 'var(--dv-ink)' }}>
                    {l.name || <i style={{ color: '#9F2D22' }}>không có trong danh mục</i>}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13.5, textAlign: 'right', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>{l.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TrfCard>
      </div>
    </div>
  );
}

window.TRANSFER_TICKETS = TRANSFER_TICKETS;
window.TransferDetailScreen = TransferDetailScreen;

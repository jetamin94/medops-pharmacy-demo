/* PlanMode — chế độ dự trù per-SKU (T10 · đối ứng DVP-577)

   Vì sao khối này SỐNG LẠI: bản trước bị gỡ (Jet chốt 2026-08-30) vì bấm Lưu không ghi đi đâu —
   không cột nào lưu, engine không đọc. 2026-08-31 DVP-577 ship đường ghi thật:
     · cột DB   product_ext.auto_plan · plan_min · plan_max (migration 0068)
     · đường ghi POST /api/products/plan-mode → lib/app/plan-mode.ts
     · engine   ReplenishInput.manual — nguồn Min/Max THỨ BA, đứng trên cả percentile
   Nên lý do gỡ đã hết hiệu lực, và hình dạng dưới đây là hình dạng hệ thật.

   MỘT CỜ, BA TRẠNG THÁI:
     bật (mặc định)          → máy tự tính
     tắt + CÓ số             → dùng đúng số đó, engine không tính lại ở bất kỳ lượt nào
     tắt + để TRỐNG          → không đề xuất gì; mã rời khỏi Đề xuất mua hàng

   BỐN ĐIỀU MÀN PHẢI NÓI ĐÚNG (hệ thật làm đúng vậy):
     1. Cặp số áp ở KHO TỔNG, điểm bán về 0 — áp mọi nơi thì "giữ 500 hộp" thành 1.500 với 3 điểm bán.
     2. Luật sàn KHÔNG đè lên số người đặt — sàn cứu con số MÁY tính ra quá thấp.
     3. Công thức đòi cao hơn mức đã khoá thì màn NÓI RA (calc_trace.autoMax) — số vẫn giữ nguyên.
     4. Bật lại tự-tính thì XOÁ số đã gõ — giữ lại là để một hàng dữ liệu nằm im không ai đọc.

   Chỗ đặt: màn Danh mục, panel theo BỘ LỌC. Hai nút áp cho cả tập lọc; ô số cố định chỉ mở khi bộ
   lọc còn ĐÚNG MỘT mã (một cặp Min/Max là con số của riêng một mặt hàng). Nút khoá lại và NÓI RA
   điều kiện mở, không biến mất. */

window.MD_PLAN = window.MD_PLAN || {}; // sku → { auto: 0|1, min: '', max: '' }
window.mdPlanOf = (sku) => window.MD_PLAN[sku] || { auto: 1, min: '', max: '' };
/* calc_trace.autoMax — con số công thức ĐÒI, hiện ở panel "Cách tính" của Tồn kho. Ở prototype suy
   từ fixture để dòng cảnh báo có số thật thay vì hằng gõ cứng. */
window.mdAutoMax = (p) => Math.round((p.kvMax || 0) * 1.35) || 0;

function PlanModePanel({ rows, setToast }) {
  const { NUM, IconLock, IconAlertTriangle, IconCheck } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const [, force] = React.useReducer((n) => n + 1, 0);
  const one = rows.length === 1 ? rows[0] : null;
  const plan = one ? window.mdPlanOf(one.sku) : null;
  const n = rows.length;

  const applyAuto = () => {
    rows.forEach((p) => { window.MD_PLAN[p.sku] = { auto: 1, min: '', max: '' }; });
    force(); setToast(`Đã đặt máy tự tính cho ${NUM(n)} SKU — số Min/Max đã gõ được xoá.`);
  };
  /* "Đặt theo đơn" = XÓA cặp số, không phải giữ lại. Hệ thật: _plan-mode.tsx gửi { autoPlan:false,
     planMin:null, planMax:null } ⇒ setPlanMode ghi NULL ⇒ engine trả q = 0 ⇒ mã rời khỏi Đề xuất mua.
     Giữ số lại thì mã vẫn là "số cố định" trong khi nút và toast nói đã chuyển sang đặt-theo-đơn. */
  const applyManual = () => {
    rows.forEach((p) => { window.MD_PLAN[p.sku] = { auto: 0, min: '', max: '' }; });
    force(); setToast(`Đã đặt theo đơn cho ${NUM(n)} SKU — đã xoá cặp số; những mã này không còn đề xuất mua.`);
  };
  const setNum = (k, v) => { const c = window.mdPlanOf(one.sku); window.MD_PLAN[one.sku] = { ...c, auto: 0, [k]: v.replace(/[^\d]/g, '') }; force(); };

  const autoCount = rows.filter((p) => window.mdPlanOf(p.sku).auto === 1).length;
  const manualBlank = rows.filter((p) => { const c = window.mdPlanOf(p.sku); return c.auto === 0 && !c.min && !c.max; }).length;
  const autoMax = one ? window.mdAutoMax(one) : 0;
  const lockedMax = plan && plan.auto === 0 && plan.max ? Number(plan.max) : null;

  const inp = { width: 92, boxSizing: 'border-box', padding: '9px 11px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 13.5, fontWeight: 700, textAlign: 'center', outline: 'none', background: '#fff' };
  const note = { fontSize: 11.5, color: 'var(--dv-ink-soft)', lineHeight: 1.5 };

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-sm)', padding: '15px 18px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14.5, color: 'var(--dv-ink)' }}>Chế độ dự trù</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--dv-green)', background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', padding: '3px 10px', borderRadius: 999 }}>áp cho {NUM(n)} SKU đang lọc</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{NUM(autoCount)} máy tự tính · {NUM(n - autoCount)} đặt theo đơn</span>
      </div>
      <div style={{ ...note, marginBottom: 12, maxWidth: '84ch' }}>Cặp số áp ở <b>kho tổng</b>, điểm bán về 0. Luật sàn <b>không</b> đè lên số bạn đặt. Bật lại máy tự tính thì <b>xoá</b> số đã gõ.</div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
        <Button variant="secondary" size="sm" onClick={applyAuto}>Máy tự tính</Button>
        <Button variant="secondary" size="sm" onClick={applyManual}>Đặt theo đơn</Button>

        <span style={{ width: 1, height: 26, background: 'var(--border-default)', margin: '0 4px' }} />

        {one ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink)' }}>Số cố định cho <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{one.sku}</code></span>
            <input value={plan.min} onChange={(e) => setNum('min', e.target.value)} placeholder="Min" aria-label="Min cố định" style={inp} />
            <span style={{ color: 'var(--dv-ink-faint)' }}>/</span>
            <input value={plan.max} onChange={(e) => setNum('max', e.target.value)} placeholder="Max" aria-label="Max cố định" style={inp} />
            {plan.auto === 0 && !plan.min && !plan.max && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, color: '#C5372C' }}><IconAlertTriangle size={13} />Để trống ⇒ mã rời khỏi Đề xuất mua hàng</span>
            )}
            {plan.auto === 1 && !plan.min && !plan.max && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--dv-ink-faint)' }}><IconCheck size={13} />Gõ số là tự chuyển sang <b>số cố định</b> — để trống cả hai ô mới là đặt theo đơn</span>
            )}
          </span>
        ) : (
          <span title={`Ô số chỉ mở khi bộ lọc còn đúng một mã — hiện ${window.NUM(n)} mã khớp.`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 999, border: '1px dashed var(--border-strong)', background: 'var(--dv-mist)', fontSize: 12, fontWeight: 700, color: 'var(--dv-ink-faint)', cursor: 'not-allowed' }}>
            <IconLock size={13} />Số cố định — lọc còn <b>đúng 1 mã</b> mới mở (hiện {NUM(n)} mã)
          </span>
        )}
      </div>

      {lockedMax != null && autoMax > lockedMax && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginTop: 12, background: 'var(--dv-yellow-100)', border: '1px solid var(--dv-yellow)', borderRadius: 12, padding: '10px 13px' }}>
          <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex', flex: 'none' }}><IconAlertTriangle size={16} /></span>
          <div style={{ fontSize: 12.5, color: 'var(--dv-ink)', lineHeight: 1.5 }}>Công thức đòi Max <b>{NUM(autoMax)}</b>, cao hơn mức đã khoá <b>{NUM(lockedMax)}</b> — <b>số vẫn giữ nguyên</b>. Xem phép thế số ở panel <i>Cách tính</i> của Tồn kho (<code style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>calc_trace.autoMax</code>).</div>
        </div>
      )}

      {manualBlank > 0 && !one && (
        <div style={{ ...note, marginTop: 10, color: '#C5372C', fontWeight: 600 }}>{NUM(manualBlank)} mã đang đặt theo đơn mà chưa có số — những mã đó không có đề xuất mua.</div>
      )}
    </div>
  );
}
window.PlanModePanel = PlanModePanel;

/* Hàng CHỈ ĐỌC trong hồ sơ SKU. Đường sửa nằm ở panel theo bộ lọc của màn Danh mục — một cặp
   Min/Max là con số của riêng một mặt hàng, nhưng thao tác đặt nó là thao tác trên tập lọc. */
function PlanModeRow({ sku }) {
  const { IconLock, NUM } = window;
  const c = window.mdPlanOf(sku);
  const manual = c.auto === 0;
  const blank = manual && !c.min && !c.max;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--dv-mist)', borderRadius: 12, padding: '12px 14px' }}>
      <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconLock size={16} /></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink)' }}>Chế độ dự trù</div>
        <div style={{ fontSize: 11.5, color: blank ? '#C5372C' : 'var(--dv-ink-faint)' }}>
          {!manual ? 'Máy tự tính — engine đặt Min/Max mỗi lượt.'
            : blank ? 'Đặt theo đơn, chưa có số ⇒ mã không có đề xuất mua.'
              : 'Đặt theo đơn — engine không tính lại cặp số này. Áp ở kho tổng, điểm bán về 0.'}
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, color: manual && !blank ? 'var(--dv-ink)' : 'var(--dv-ink-soft)' }}>{manual && !blank ? `${NUM(Number(c.min || 0))} / ${NUM(Number(c.max || 0))}` : '—'}</span>
    </div>
  );
}
window.PlanModeRow = PlanModeRow;

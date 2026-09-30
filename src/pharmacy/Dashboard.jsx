/* Pharmacy — Tổng quan "Sức khỏe tồn kho" dashboard. */

function KpiCard({ k, onClick }) {
  const { IconBadge } = window.DVMedKingDesignSystem_bf17f8;
  const { Tip } = window;
  const { IconArrowRight } = window;
  const Icon = window[k.icon];
  const toneRing = k.tone === 'red' ? '#C5372C' : k.tone === 'yellow' ? 'var(--dv-yellow-600)' : 'var(--dv-green-bright)';
  const valColor = k.tone === 'red' ? '#C5372C' : 'var(--dv-green)';
  return (
    <div className="dv-kpi" onClick={onClick} style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
      <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: toneRing, opacity: .85 }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--dv-yellow)', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}><Icon size={21} /></span>
        <span onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex' }}><Tip text={k.tip}><span style={{ fontSize: 12, color: 'var(--dv-ink-faint)' }} /></Tip></span>
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, color: valColor, letterSpacing: '-0.02em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{k.value}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14, color: 'var(--dv-ink)', marginTop: 6 }}>{k.label}</div>
        <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)', marginTop: 3 }}>{k.sub}</div>
      </div>
      <span className="dv-kpi-go" style={{ position: 'absolute', right: 14, bottom: 14, width: 28, height: 28, borderRadius: '50%', background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconArrowRight size={15} /></span>
    </div>
  );
}

/* ncc → missing-supplier, KHÔNG phải suppliers: thẻ đếm SKU chưa gắn NCC master, nên đích phải là
   màn liệt kê đúng những SKU đó. */
const KPI_TARGETS = { stockout: 'inventory', tobuy: 'purchasing', spend: 'purchasing', deadstock: 'inventory', transfer: 'transfers', approve: 'approvals', expiryRisk: 'expiry', ncc: 'missing-supplier' };

function PharmaDashboard({ setView, lastSync, syncing }) {
  const { KPIS, URGENT, SKUS, StatusBadge, VND, DoiBar, Tip, Skel } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconArrowRight, IconTransfer, IconCart, IconQuote, IconCheckCircle } = window;
  const actionMeta = { transfer: { ic: IconTransfer, tone: 'yellow' }, buy: { ic: IconCart, tone: 'green' }, rfq: { ic: IconQuote, tone: 'red' } };

  return (
    <div style={{ padding: '24px 28px 40px', maxWidth: 1360, margin: '0 auto' }}>
      {/* sync banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--dv-green-50)', border: '1px solid var(--dv-green-100)', borderRadius: 14, padding: '11px 16px', marginBottom: 20 }}>
        <span style={{ color: 'var(--dv-green-bright)', display: 'inline-flex' }}><IconCheckCircle size={18} /></span>
        <span style={{ fontSize: 13.5, color: 'var(--dv-ink)', fontWeight: 600 }}>Đã đồng bộ KiotViet &amp; Odoo lúc <span style={{ fontFamily: 'var(--font-mono)' }}>{lastSync}</span> — 10 điểm bán · 1.842 SKU.</span>
        {/* Không ghi một nhịp cụ thể ở đây: nhịp thật là nhịp của connector, đặt được 30..1440 phút
            per-tenant, nên mọi con số ghi cứng ở banner sẽ sai với phần lớn tenant. Chỉ tay tới nơi
            đọc được sự thật. */}
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>Nhịp chạy engine — xem Cài đặt → Lịch chạy engine</span>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 26 }}>
        {KPIS.map((k) => <KpiCard key={k.key} k={k} onClick={() => setView(KPI_TARGETS[k.key] || 'dashboard')} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 22, alignItems: 'start' }}>
        {/* Urgent table */}
        <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 20px 14px', borderBottom: '1px solid var(--border-default)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--dv-danger)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0 }}>Cần xử lý gấp</h3>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: '#C5372C', background: '#F8E0DD', padding: '2px 9px', borderRadius: 999 }}>{URGENT.length} mục</span>
            <button onClick={() => setView('purchasing')} style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13 }}>Xem tất cả <IconArrowRight size={14} /></button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
            <thead><tr style={{ background: 'var(--dv-mist)' }}>
              {['Sản phẩm', 'Điểm bán', 'Tồn (ngày)', 'Đề xuất', ''].map((h, i) => <th key={i} style={{ textAlign: i === 2 ? 'center' : 'left', padding: '9px 16px', fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--dv-ink-soft)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {syncing ? [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '14px 16px' }}><Skel w="70%" h={13} /><div style={{ height: 6 }} /><Skel w="40%" h={9} /></td>
                  <td style={{ padding: '14px 16px' }}><Skel w="80%" h={12} /></td>
                  <td style={{ padding: '14px 16px' }}><Skel w={28} h={16} r={8} /></td>
                  <td style={{ padding: '14px 16px' }}><Skel w="75%" h={12} /></td>
                  <td style={{ padding: '14px 16px' }}><Skel w={60} h={26} r={999} /></td>
                </tr>
              )) : URGENT.map((u, i) => {
                const m = actionMeta[u.type];
                return (
                  <tr key={i} style={{ borderTop: '1px solid var(--border-default)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{u.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{u.sku} · ABC {u.abc} · Min {u.min}</div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{u.store}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 16, color: u.doi <= 3 ? '#C5372C' : 'var(--dv-yellow-600)' }}>{u.doi}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--dv-ink)' }}>
                        <span style={{ color: m.tone === 'red' ? '#C5372C' : m.tone === 'yellow' ? 'var(--dv-yellow-600)' : 'var(--dv-green-bright)', display: 'inline-flex' }}>{React.createElement(m.ic, { size: 15 })}</span>
                        {u.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button onClick={() => setView(u.type === 'buy' ? 'purchasing' : u.type === 'rfq' ? 'rfq' : 'transfers')} style={{ border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', padding: '6px 12px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, color: 'var(--dv-green)' }}>Xử lý</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Days of inventory panel */}
        <section style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', padding: '18px 20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', margin: 0 }}>Số ngày tồn kho</h3>
            <Tip text="Days of Inventory (DOI): số ngày bán hết tồn kho hiện tại theo tốc độ bán bình quân. Vạch dọc = ngưỡng mục tiêu 30 ngày."><span /></Tip>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12, color: 'var(--dv-ink-soft)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: 'var(--dv-green-bright)' }} />Đủ</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: 'var(--dv-yellow)' }} />Thấp</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: 'var(--dv-danger)' }} />Khẩn</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {syncing ? [...Array(9)].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 150, flex: 'none' }}><Skel w="85%" h={12} /><div style={{ height: 5 }} /><Skel w="45%" h={9} /></div>
                <div style={{ flex: 1 }}><Skel h={8} r={999} /></div>
              </div>
            )) : SKUS.slice(0, 9).map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 150, flex: 'none' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{s.mfr}</div>
                </div>
                <div style={{ flex: 1 }}><DoiBar days={s.doi} /></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
window.PharmaDashboard = PharmaDashboard;

/* Pharmacy — Màn 1a: Quản lý & Key-in CTKM (JET-170). List + lọc + form + Nhận/Xác nhận (D3). */

function PromosScreen({ setToast, setView }) {
  const { PageHeader, StatusTabs, SearchBox, Toolbar, PROMOS_SEED, PROMO_FAMILIES, describePromo, PromoSourceBadge, PromoStatusBadge, promoFamilyLabel, promoScopeLabel, PromoFormDrawer } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconPercent, IconPlus, IconEdit, IconCheck, IconInfo, IconChevronDown } = window;
  const [rows, setRows] = React.useState(PROMOS_SEED);
  const [tab, setTab] = React.useState('all');
  const [q, setQ] = React.useState('');
  const [ncc, setNcc] = React.useState('all');
  const [fam, setFam] = React.useState('all');
  const [form, setForm] = React.useState(null); // null | 'new' | promo object
  const [expand, setExpand] = React.useState(null);

  const nccs = [...new Set(rows.map((r) => r.ncc))];
  const filtered = rows.filter((r) =>
    (tab === 'all' || r.status === tab) && (ncc === 'all' || r.ncc === ncc) && (fam === 'all' || r.family === fam) &&
    (r.name + r.ncc + r.scopeRef).toLowerCase().includes(q.toLowerCase()));
  const pendingCount = rows.filter((r) => r.status === 'pending_confirm').length;

  const confirm = (id) => {
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: 'active' } : r));
    setToast('Đã xác nhận CTKM — từ giờ được đưa vào dự trù tối ưu.');
  };
  const save = (f) => {
    if (form === 'new') {
      setRows((rs) => [{ ...f, id: 'KM-' + (106 + rs.length), from: f.from.split('-').reverse().join('/'), to: f.to.split('-').reverse().join('/'), source: 'pharmacy', status: 'active' }, ...rs]);
      setToast('Đã lưu CTKM — áp dụng ở lần dự trù kế tiếp.');
    } else {
      setRows((rs) => rs.map((r) => r.id === form.id ? { ...r, ...f, from: typeof f.from === 'string' && f.from.includes('-') ? f.from.split('-').reverse().join('/') : f.from, to: typeof f.to === 'string' && f.to.includes('-') ? f.to.split('-').reverse().join('/') : f.to } : r));
      setToast('Đã cập nhật CTKM.');
    }
    setForm(null);
  };

  const selInp = { padding: '9px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13.5, outline: 'none', background: '#fff', color: 'var(--dv-ink)' };

  return (
    <div style={{ padding: '24px 28px 48px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="CTKM nhà cung cấp" subtitle="Chương trình khuyến mãi NCC dùng cho dự trù tối ưu & so sánh báo giá. Hai nguồn: nhà thuốc tự nhập hoặc NCC khai qua cổng mạng (cần xác nhận)."
        actions={<Button variant="accent" size="md" iconRight={<IconPlus size={16} />} onClick={() => setForm('new')}>Nhập CTKM</Button>} />

      {pendingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--dv-yellow-100)', border: '1px solid #F5E0A8', borderRadius: 14, padding: '12px 16px', marginBottom: 18 }}>
          <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex', flex: 'none' }}><IconInfo size={18} /></span>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--dv-ink)' }}><b>{pendingCount} CTKM do NCC khai</b> đang chờ xác nhận — chưa được đưa vào dự trù tối ưu cho tới khi bạn bấm Xác nhận.</span>
          <Button variant="secondary" size="sm" onClick={() => setTab('pending_confirm')}>Xem chờ xác nhận</Button>
        </div>
      )}

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Tìm CTKM, NCC, sản phẩm…" width={280} />
        <select value={ncc} onChange={(e) => setNcc(e.target.value)} style={selInp}><option value="all">Mọi NCC</option>{nccs.map((n) => <option key={n}>{n}</option>)}</select>
        <select value={fam} onChange={(e) => setFam(e.target.value)} style={selInp}><option value="all">Mọi họ CTKM</option>{PROMO_FAMILIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <span style={{ marginLeft: 'auto' }}>
          <StatusTabs items={[['all', 'Tất cả', rows.length], ['active', 'Hiệu lực', rows.filter((r) => r.status === 'active').length], ['pending_confirm', 'Chờ xác nhận', pendingCount || null], ['expired', 'Hết hiệu lực', rows.filter((r) => r.status === 'expired').length]]} value={tab} onChange={setTab} />
        </span>
      </Toolbar>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
          <thead><tr style={{ background: 'var(--dv-mist)' }}>{['Chương trình', 'NCC', 'Họ CTKM', 'Phạm vi', 'Thời hạn', 'Nguồn', 'Trạng thái', ''].map((h, i) => <th key={i} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--dv-ink-soft)', whiteSpace: 'nowrap' }}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((p) => (
              <React.Fragment key={p.id}>
                <tr onClick={() => setExpand(expand === p.id ? null : p.id)} style={{ borderTop: '1px solid var(--border-default)', cursor: 'pointer', background: expand === p.id ? 'var(--dv-mist)' : '#fff' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--dv-yellow-100)', color: 'var(--dv-yellow-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><IconPercent size={16} /></span>
                      <div><div style={{ fontWeight: 700, fontSize: 13.5 }}>{p.name}</div><div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{p.id}{p.wh ? ` · ${p.wh}` : ''}</div></div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.ncc}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink-soft)' }}>{promoFamilyLabel(p.family)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--dv-ink-soft)', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{promoScopeLabel(p)}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.from} – {p.to}</td>
                  <td style={{ padding: '12px 16px' }}><PromoSourceBadge source={p.source} /></td>
                  <td style={{ padding: '12px 16px' }}><PromoStatusBadge status={p.status} /></td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 7, alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                      {p.status === 'pending_confirm' && <Button variant="primary" size="sm" iconLeft={<IconCheck size={14} />} onClick={() => confirm(p.id)}>Xác nhận</Button>}
                      <button onClick={() => setForm(p)} title="Sửa" style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconEdit size={15} /></button>
                      <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', transform: expand === p.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}><IconChevronDown size={16} /></span>
                    </div>
                  </td>
                </tr>
                {expand === p.id && (
                  <tr style={{ background: 'var(--dv-mist)' }}>
                    <td colSpan={8} style={{ padding: '0 16px 14px' }}>
                      <div style={{ background: 'var(--dv-green-900, #003328)', color: '#fff', borderRadius: 12, padding: '12px 16px', fontSize: 13, lineHeight: 1.6 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--dv-yellow)', display: 'block', marginBottom: 4 }}>Diễn giải</span>
                        {describePromo(p)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--dv-ink-faint)', fontSize: 13.5 }}>Không có CTKM nào khớp bộ lọc.</td></tr>}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--dv-ink-faint)', marginTop: 12 }}>
        <IconInfo size={14} />CTKM hiệu lực được engine dùng ở <b style={{ color: 'var(--dv-green)', cursor: 'pointer' }} onClick={() => setView('purchasing')}>Đề xuất mua hàng → Tối ưu CTKM</b> và so sánh báo giá RFQ.
      </div>

      {form && <PromoFormDrawer mode="pharmacy" initial={form === 'new' ? null : { ...form, from: form.from.split('/').reverse().join('-'), to: form.to.split('/').reverse().join('-') }} onClose={() => setForm(null)} onSave={save} />}
    </div>
  );
}
window.PromosScreen = PromosScreen;

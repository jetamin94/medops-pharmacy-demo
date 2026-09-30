/* MedOps — CTKM (khuyến mãi NCC) dùng chung 2 cổng (JET-170 Màn 1).
   Taxonomy JET-168: họ (family) × dựa-vào (basis) × phạm-vi (scope) × bảng bậc (tiers) + cờ.
   Superset theo JET-169 — v1-cut sau khi Jet chốt D1. */

const PROMO_FAMILIES = [
  ['discount', 'Chiết khấu'],
  ['gift', 'Tặng SP'],
  ['gift_tiered', 'Tặng SP theo bậc'],
  ['min_order', 'Đơn hàng tối thiểu'],
];
const PROMO_BASIS = [['qty', 'Số lượng'], ['value', 'Giá trị']];
const PROMO_SCOPES = [['sku', '1 sản phẩm'], ['group', 'Nhóm SP'], ['vendor', 'Tất cả SP của NCC'], ['division', 'Division']];
const PROMO_SKUS = ['Paracetamol 500mg', 'Amoxicillin 500mg', 'Augmentin 625mg', 'Omeprazol 20mg', 'Enterogermina', 'Vitamin C 1000mg sủi', 'Berberin 10mg', 'Cefuroxim 500mg'];
const PROMO_GROUPS = ['Kháng sinh', 'Giảm đau hạ sốt', 'Tiêu hóa', 'TPCN', 'Hô hấp'];
const PROMO_DIVISIONS = ['ETC (kê đơn)', 'OTC (không kê đơn)', 'TPCN'];

const pVND = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '₫';

/* Diễn giải tự nhiên (Excel cột "Mô tả") — người nhập tự kiểm */
function describePromo(p) {
  const unit = p.basis === 'value' ? '₫ ' : '';
  const val = (v) => p.basis === 'value' ? pVND(v) : new Intl.NumberFormat('vi-VN').format(v);
  const scopeTxt = p.scope === 'sku' ? p.scopeRef : p.scope === 'group' ? `nhóm ${p.scopeRef}` : p.scope === 'division' ? `division ${p.scopeRef}` : 'toàn bộ SP của NCC';
  let core = '';
  if (p.family === 'discount') {
    core = (p.tiers || []).map((t) => `Mua ${scopeTxt} từ ${val(t.from)}${t.to ? `–${val(t.to)}` : ' trở lên'} → CK ${t.pct}%`).join('; ');
  } else if (p.family === 'gift') {
    const t = (p.tiers || [])[0] || {};
    core = `Mua đủ ${val(t.threshold || 0)} ${scopeTxt} → tặng ${t.giftQty || 0} ${t.giftSku || '—'}`;
  } else if (p.family === 'gift_tiered') {
    core = (p.tiers || []).map((t) => `Đạt ${val(t.threshold)} → tặng ${t.giftQty} ${t.giftSku}`).join('; ');
  } else if (p.family === 'min_order') {
    core = (p.tiers || []).map((t) => `Tổng đơn NCC đạt ${pVND(t.from)} → CK thêm ${t.pct}% toàn đơn`).join('; ');
  }
  const flags = [];
  if (p.family !== 'discount' && p.family !== 'min_order') flags.push(p.invoiceGift ? 'hàng tặng CÓ hoá đơn (giá 0)' : 'hàng tặng KHÔNG hoá đơn');
  if (p.foldIntoPrice) flags.push(`quy đổi ~${p.foldPct || 0}% vào giá net khi so sánh`);
  return `${core}. Hiệu lực ${p.from}–${p.to}${flags.length ? '. ' + flags.join(' · ') : ''}.`;
}

/* Mock — trộn nguồn (D3: source ncc cần Nhận/Xác nhận trước khi vào dự trù) */
const PROMOS_SEED = [
  { id: 'KM-101', name: 'CK bậc thang Paracetamol Q3', ncc: 'Dược Hậu Giang (DHG)', wh: '', family: 'discount', basis: 'qty', scope: 'sku', scopeRef: 'Paracetamol 500mg', from: '01/07/2026', to: '30/09/2026', tiers: [{ from: 10, to: 20, pct: 3 }, { from: 21, to: 50, pct: 5 }, { from: 51, to: null, pct: 8 }], invoiceGift: false, foldIntoPrice: true, foldPct: 5, source: 'ncc', status: 'active' },
  { id: 'KM-102', name: 'Mua 10 tặng 1 Enterogermina', ncc: 'DKSH Việt Nam', wh: 'Kho HCM', family: 'gift', basis: 'qty', scope: 'sku', scopeRef: 'Enterogermina', from: '15/06/2026', to: '15/08/2026', tiers: [{ threshold: 10, giftSku: 'Enterogermina', giftQty: 1 }], invoiceGift: true, foldIntoPrice: true, foldPct: 9, source: 'pharmacy', status: 'active' },
  { id: 'KM-103', name: 'Tặng bậc thang nhóm kháng sinh', ncc: 'Imexpharm', wh: '', family: 'gift_tiered', basis: 'qty', scope: 'group', scopeRef: 'Kháng sinh', from: '01/07/2026', to: '31/07/2026', tiers: [{ threshold: 300, giftSku: 'Vitamin C 1000mg sủi', giftQty: 10 }, { threshold: 600, giftSku: 'Vitamin C 1000mg sủi', giftQty: 25 }], invoiceGift: false, foldIntoPrice: false, foldPct: 0, source: 'ncc', status: 'pending_confirm' },
  { id: 'KM-104', name: 'Đơn ≥20tr chiết khấu thêm 2%', ncc: 'Imexpharm', wh: '', family: 'min_order', basis: 'value', scope: 'vendor', scopeRef: '', from: '01/07/2026', to: '30/09/2026', tiers: [{ from: 20000000, to: null, pct: 2 }], invoiceGift: false, foldIntoPrice: false, foldPct: 0, source: 'ncc', status: 'active' },
  { id: 'KM-105', name: 'CK 4% toàn danh mục Q2', ncc: 'Pymepharco', wh: '', family: 'discount', basis: 'value', scope: 'vendor', scopeRef: '', from: '01/04/2026', to: '30/06/2026', tiers: [{ from: 0, to: null, pct: 4 }], invoiceGift: false, foldIntoPrice: true, foldPct: 4, source: 'pharmacy', status: 'expired' },
];

function PromoSourceBadge({ source }) {
  const ncc = source === 'ncc';
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 999, background: ncc ? '#E5EEFb' : 'var(--dv-mist)', color: ncc ? '#1d4f8a' : 'var(--dv-ink-soft)', fontWeight: 700, fontSize: 11 }}>{ncc ? 'NCC cung cấp' : 'Nhà thuốc nhập'}</span>;
}
function PromoStatusBadge({ status }) {
  const map = { active: ['Đang hiệu lực', 'var(--dv-green-50)', 'var(--dv-green)'], pending_confirm: ['Chờ xác nhận', 'var(--dv-yellow-100)', 'var(--dv-yellow-600)'], expired: ['Hết hiệu lực', 'var(--dv-mist)', 'var(--dv-ink-faint)'] };
  const [l, bg, fg] = map[status] || map.active;
  return <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 999, background: bg, color: fg, fontWeight: 700, fontSize: 11 }}>{l}</span>;
}
function promoFamilyLabel(f) { const x = PROMO_FAMILIES.find(([k]) => k === f); return x ? x[1] : f; }
function promoScopeLabel(p) { return p.scope === 'vendor' ? 'Tất cả SP' : p.scope === 'sku' ? p.scopeRef : `${p.scope === 'group' ? 'Nhóm' : 'Division'}: ${p.scopeRef}`; }

/* ---------- Form tạo/sửa CTKM (progressive disclosure) — dùng ở cả 2 cổng ----------
   mode: 'pharmacy' (chọn NCC) | 'supplier' (org của phiên; nhà thuốc theo selector toàn cục) */
function PromoFormDrawer({ mode, initial, pharmacyName, onClose, onSave }) {
  const { IconX, IconPlus, IconInfo } = window;
  const nccOptions = (window.SUPPLIERS || []).filter((s) => s.status === 'active').map((s) => s.name);
  const [f, setF] = React.useState(initial || { name: '', ncc: nccOptions[0] || 'Dược Hậu Giang (DHG)', wh: '', family: '', basis: 'qty', scope: 'sku', scopeRef: PROMO_SKUS[0], from: '2026-07-01', to: '2026-09-30', tiers: [], invoiceGift: false, foldIntoPrice: false, foldPct: 0 });
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const setFamily = (fam) => setF((x) => ({ ...x, family: fam, tiers: fam === 'discount' || fam === 'min_order' ? [{ from: fam === 'min_order' ? 50000000 : 10, to: null, pct: 5 }] : [{ threshold: fam === 'gift' ? 10 : 100, giftSku: PROMO_SKUS[4], giftQty: 1 }] }));
  const setTier = (i, k, v) => setF((x) => ({ ...x, tiers: x.tiers.map((t, j) => j === i ? { ...t, [k]: v } : t) }));
  const addTier = () => setF((x) => ({ ...x, tiers: [...x.tiers, x.family === 'discount' || x.family === 'min_order' ? { from: 0, to: null, pct: 0 } : { threshold: 0, giftSku: PROMO_SKUS[4], giftQty: 1 }] }));
  const rmTier = (i) => setF((x) => ({ ...x, tiers: x.tiers.filter((_, j) => j !== i) }));
  const isDiscount = f.family === 'discount' || f.family === 'min_order';
  const isGift = f.family === 'gift' || f.family === 'gift_tiered';
  const valid = f.name.trim() && f.family && f.tiers.length > 0 && (f.scope === 'vendor' || f.scopeRef);

  const fld = { display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 6, color: 'var(--dv-ink)' };
  const inp = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff' };
  const mono = { ...inp, fontFamily: 'var(--font-mono)' };
  const seg = (val, items, cb) => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map(([k, l]) => <button key={k} onClick={() => cb(k)} style={{ border: val === k ? '2px solid var(--dv-green)' : '1px solid var(--border-strong)', background: val === k ? 'var(--dv-green-50)' : '#fff', color: val === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', borderRadius: 10, padding: '9px 14px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>{l}</button>)}
    </div>
  );
  const Sec = ({ n, title, children }) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ width: 22, height: 22, borderRadius: 999, background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11 }}>{n}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13.5, color: 'var(--dv-ink)' }}>{title}</span>
      </div>
      {children}
    </div>
  );
  const swRow = (label, hint, key) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13.5 }}>{label}</div><div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)' }}>{hint}</div></div>
      <button onClick={() => set(key, !f[key])} style={{ width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', background: f[key] ? 'var(--dv-green)' : 'var(--border-strong)', position: 'relative', flex: 'none' }}><span style={{ position: 'absolute', top: 3, left: f[key] ? 21 : 3, width: 20, height: 20, borderRadius: 999, background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.3)', transition: 'left .15s' }} /></button>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 120, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.32)' }} />
      <div style={{ position: 'relative', width: 'min(560px, 96vw)', height: '100%', background: 'var(--dv-paper, #F1F1F1)', boxShadow: '0 0 60px rgba(0,30,22,.3)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '17px 22px', background: '#fff', borderBottom: '1px solid var(--border-default)', flex: 'none' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: 0 }}>{initial ? 'Sửa CTKM' : 'Tạo CTKM'}</h3>
            <div style={{ fontSize: 12, color: 'var(--dv-ink-faint)', marginTop: 2 }}>{mode === 'supplier' ? `Khai cho ${pharmacyName || 'nhà thuốc'} — nhà thuốc sẽ xác nhận trước khi dùng` : 'Nhập CTKM mà NCC báo cho nhà thuốc'}</div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={18} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 22 }}>
          <Sec n={1} title="Thông tin chung">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              {mode === 'pharmacy'
                ? <div><label style={fld}>Nhà cung cấp</label><select value={f.ncc} onChange={(e) => set('ncc', e.target.value)} style={inp}>{(nccOptions.length ? nccOptions : [f.ncc]).map((n) => <option key={n}>{n}</option>)}</select></div>
                : <div><label style={fld}>Nhà thuốc áp dụng</label><input value={pharmacyName || ''} readOnly style={{ ...inp, background: 'var(--dv-mist)', color: 'var(--dv-ink-soft)' }} /></div>}
              <div><label style={fld}>Kho NCC (tuỳ chọn)</label><select value={f.wh} onChange={(e) => set('wh', e.target.value)} style={inp}><option value="">Mọi kho</option><option>Kho HCM</option><option>Kho Hà Nội</option><option>Kho Đà Nẵng</option></select></div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={fld}>Tên chương trình</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="VD: CK bậc thang Paracetamol Q3" style={inp} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={fld}>Bắt đầu</label><input type="date" value={f.from} onChange={(e) => set('from', e.target.value)} style={mono} /></div>
              <div><label style={fld}>Kết thúc</label><input type="date" value={f.to} onChange={(e) => set('to', e.target.value)} style={mono} /></div>
            </div>
          </Sec>

          <Sec n={2} title="Loại khuyến mãi (họ)">{seg(f.family, PROMO_FAMILIES, setFamily)}</Sec>

          {f.family && <>
            {f.family !== 'min_order' && <Sec n={3} title="Dựa vào">{seg(f.basis, PROMO_BASIS, (v) => set('basis', v))}</Sec>}
            {f.family !== 'min_order' && (
              <Sec n={4} title="Phạm vi áp dụng">
                {seg(f.scope, PROMO_SCOPES, (v) => set('scope', v))}
                {f.scope !== 'vendor' && (
                  <div style={{ marginTop: 10 }}>
                    <label style={fld}>{f.scope === 'sku' ? 'Chọn sản phẩm' : f.scope === 'group' ? 'Chọn nhóm SP' : 'Chọn division'}</label>
                    <select value={f.scopeRef} onChange={(e) => set('scopeRef', e.target.value)} style={inp}>
                      {(f.scope === 'sku' ? PROMO_SKUS : f.scope === 'group' ? PROMO_GROUPS : PROMO_DIVISIONS).map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                )}
              </Sec>
            )}
            <Sec n={f.family === 'min_order' ? 3 : 5} title={isDiscount ? 'Bảng bậc chiết khấu' : 'Ngưỡng & sản phẩm tặng'}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isDiscount ? '1fr 1fr 90px 36px' : '1fr 1.4fr 80px 36px', gap: 8, padding: '9px 12px', background: 'var(--dv-mist)', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--dv-ink-soft)' }}>
                  {isDiscount ? <><span>{f.basis === 'value' || f.family === 'min_order' ? 'Từ (₫)' : 'Mua từ'}</span><span>{f.basis === 'value' || f.family === 'min_order' ? 'Đến (₫)' : 'Mua đến'}</span><span>CK %</span><span /></> : <><span>Ngưỡng mua</span><span>SP tặng</span><span>SL tặng</span><span /></>}
                </div>
                {f.tiers.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: isDiscount ? '1fr 1fr 90px 36px' : '1fr 1.4fr 80px 36px', gap: 8, padding: '8px 12px', borderTop: '1px solid var(--border-default)', alignItems: 'center' }}>
                    {isDiscount ? <>
                      <input value={t.from ?? ''} onChange={(e) => setTier(i, 'from', Number(e.target.value) || 0)} style={{ ...mono, padding: '7px 9px', fontSize: 13 }} />
                      <input value={t.to ?? ''} placeholder="∞" onChange={(e) => setTier(i, 'to', e.target.value === '' ? null : Number(e.target.value) || 0)} style={{ ...mono, padding: '7px 9px', fontSize: 13 }} />
                      <input value={t.pct ?? ''} onChange={(e) => setTier(i, 'pct', Number(e.target.value) || 0)} style={{ ...mono, padding: '7px 9px', fontSize: 13 }} />
                    </> : <>
                      <input value={t.threshold ?? ''} onChange={(e) => setTier(i, 'threshold', Number(e.target.value) || 0)} style={{ ...mono, padding: '7px 9px', fontSize: 13 }} />
                      <select value={t.giftSku} onChange={(e) => setTier(i, 'giftSku', e.target.value)} style={{ ...inp, padding: '7px 9px', fontSize: 13 }}>{PROMO_SKUS.map((o) => <option key={o}>{o}</option>)}</select>
                      <input value={t.giftQty ?? ''} onChange={(e) => setTier(i, 'giftQty', Number(e.target.value) || 0)} style={{ ...mono, padding: '7px 9px', fontSize: 13 }} />
                    </>}
                    <button onClick={() => rmTier(i)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={14} /></button>
                  </div>
                ))}
                {(f.family !== 'gift') && <button onClick={addTier} style={{ width: '100%', border: 'none', borderTop: '1px dashed var(--border-strong)', background: 'transparent', cursor: 'pointer', padding: '9px 0', color: 'var(--dv-green)', fontWeight: 700, fontSize: 12.5, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><IconPlus size={14} />Thêm bậc</button>}
              </div>
              {isGift && <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 7 }}>SP tặng có thể khác SP mua.</div>}
            </Sec>
            <Sec n={f.family === 'min_order' ? 4 : 6} title="Cờ xử lý">
              {isGift && swRow('Hoá đơn SP tặng', 'Hàng tặng xuất hoá đơn giá 0 (Y) hay ngoài hoá đơn (N)', 'invoiceGift')}
              {swRow('Tính CTKM vào giá', 'Quy đổi ưu đãi vào giá net khi so sánh báo giá', 'foldIntoPrice')}
              {f.foldIntoPrice && <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 2 }}><label style={{ ...fld, marginBottom: 0 }}>Quy đổi ~</label><input value={f.foldPct} onChange={(e) => set('foldPct', Number(e.target.value) || 0)} style={{ ...mono, width: 80 }} /><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dv-ink-soft)' }}>% giá</span></div>}
            </Sec>
            {/* preview diễn giải */}
            <div style={{ background: 'var(--dv-green-900, #003328)', color: '#fff', borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 11 }}>
              <span style={{ color: 'var(--dv-yellow)', flex: 'none', marginTop: 1 }}><IconInfo size={17} /></span>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--dv-yellow)', marginBottom: 5 }}>Diễn giải — tự kiểm trước khi lưu</div>
                <div style={{ fontSize: 13, lineHeight: 1.6 }}>{describePromo({ ...f, from: f.from.split('-').reverse().join('/'), to: f.to.split('-').reverse().join('/') })}</div>
              </div>
            </div>
          </>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', background: '#fff', borderTop: '1px solid var(--border-default)', flex: 'none' }}>
          <button onClick={onClose} style={{ border: '1px solid var(--border-strong)', background: '#fff', color: 'var(--dv-green)', borderRadius: 999, padding: '10px 20px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Hủy</button>
          <button disabled={!valid} onClick={() => valid && onSave(f)} style={{ border: 'none', background: valid ? 'var(--dv-green)' : 'var(--border-strong)', color: '#fff', borderRadius: 999, padding: '10px 22px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, cursor: valid ? 'pointer' : 'default' }}>{initial ? 'Lưu thay đổi' : mode === 'supplier' ? 'Khai CTKM' : 'Lưu CTKM'}</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PROMO_FAMILIES, PROMO_BASIS, PROMO_SCOPES, PROMO_SKUS, PROMOS_SEED, describePromo, PromoSourceBadge, PromoStatusBadge, promoFamilyLabel, promoScopeLabel, PromoFormDrawer });

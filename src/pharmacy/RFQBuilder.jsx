/* Pharmacy — Trình tạo RFQ (A1): chọn dòng hàng (giỏ dự trù / tay) → chọn NCC mời → SLA & gửi. */

function RFQBuilder({ onClose, onCreate, setToast }) {
  const { PURCHASE_GROUPS, SKUS, SUPPLIERS, VND, NUM } = window;
  const { Button } = window.DVMedKingDesignSystem_bf17f8;
  const { IconCheck, IconSearch, IconClock, IconLock, IconAlertTriangle, IconChevronLeft, IconArrowRight, IconSend, IconX } = window;
  const Drawer = window.Drawer;

  /* candidate lines: replenishment basket (flattened) + full catalog for manual picking */
  const basket = React.useMemo(() => PURCHASE_GROUPS.flatMap((g) => g.lines.map((l) => ({ sku: l.sku, name: l.name, unit: l.unit, qty: l.qty, price: l.price, target: l.price, fromBasket: true, ncc: g.ncc, nccName: g.name }))), []);
  const catalog = React.useMemo(() => {
    const inBasket = new Set(basket.map((b) => b.sku));
    return SKUS.filter((s) => !inBasket.has(s.id)).map((s) => ({ sku: s.id, name: s.name, unit: s.unit.split(' ')[0], qty: s.need, price: Math.round(s.value / s.need), fromBasket: false, ncc: s.mfr }));
  }, [basket]);

  const [step, setStep] = React.useState(0);
  const [src, setSrc] = React.useState('basket');
  const [q, setQ] = React.useState('');
  const [picks, setPicks] = React.useState(() => {
    const p = {};
    basket.forEach((l) => { p[l.sku] = { on: true, qty: l.qty, target: l.price, line: l }; });
    catalog.forEach((l) => { p[l.sku] = { on: false, qty: l.qty, target: l.price, line: l }; });
    return p;
  });
  const setPick = (sku, patch) => setPicks((p) => ({ ...p, [sku]: { ...p[sku], ...patch } }));
  const [nccs, setNccs] = React.useState(() => SUPPLIERS.filter((s) => !s.missing && s.status === 'active').slice(0, 4).map((s) => s.id));
  const toggleNcc = (id) => setNccs((n) => n.includes(id) ? n.filter((x) => x !== id) : [...n, id]);
  // #1 routing: 'route' = mỗi SKU gửi tới NCC liên quan · 'broad' = đấu giá rộng (rổ chung)
  const [routeMode, setRouteMode] = React.useState('route');
  const [lineNccs, setLineNccs] = React.useState({}); // sku -> [nccId] (override; trống = theo NCC mặc định)
  // route NCC theo supply_link (id) — không suy từ tên nhà sản xuất. line.ncc là id NCC (vd 'NCC01') từ giỏ dự trù.
  const defNccOf = (line) => { if (line.ncc && /^NCC/.test(line.ncc)) return line.ncc; const s = SUPPLIERS.find((x) => x.id === line.ncc); return s ? s.id : null; };
  const routeNccsOf = (line) => { if (lineNccs[line.sku] !== undefined) return lineNccs[line.sku]; const d = defNccOf(line); return d ? [d] : []; };
  const setRoute = (line, arr) => setLineNccs((m) => ({ ...m, [line.sku]: arr }));
  const addRoute = (line, id) => setRoute(line, [...routeNccsOf(line), id]);
  const removeRoute = (line, id) => setRoute(line, routeNccsOf(line).filter((x) => x !== id));
  const [title, setTitle] = React.useState('Bổ sung tồn kho 11/06');
  const [sla, setSla] = React.useState(48);

  const chosen = Object.values(picks).filter((p) => p.on);
  const totalTarget = chosen.reduce((s, p) => s + p.qty * p.target, 0);
  const routedNccs = [...new Set(chosen.flatMap((p) => routeNccsOf(p.line)))];
  const routeValid = chosen.every((p) => routeNccsOf(p.line).length > 0);
  const effNccCount = routeMode === 'route' ? routedNccs.length : nccs.length;
  const pool = src === 'basket' ? basket : catalog;
  const list = pool.filter((l) => (l.name + l.sku).toLowerCase().includes(q.toLowerCase()));

  const inp = { boxSizing: 'border-box', padding: '7px 9px', borderRadius: 8, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-mono)', fontSize: 12.5, outline: 'none', background: '#fff', fontWeight: 700 };
  const lbl = { display: 'block', fontSize: 11, color: 'var(--dv-ink-soft)', fontWeight: 600, marginBottom: 4 };
  const STEPS = ['Chọn dòng hàng', 'Chọn NCC mời', 'SLA & gửi'];

  const send = () => {
    if (!chosen.length) { setToast('Chưa chọn dòng hàng nào.'); return; }
    const fullLines = chosen.map((p) => ({ sku: p.line.sku, name: p.line.name, qty: p.qty, unit: p.line.unit, target_price: p.target || p.line.price || 0, route_ncc_ids: routeMode === 'route' ? routeNccsOf(p.line) : nccs }));
    if (routeMode === 'route') {
      if (!routeValid) { setToast('Có dòng chưa gán NCC nào để gửi — chọn NCC hoặc chuyển “Đấu giá rộng”.'); return; }
      onCreate({ title: title || 'RFQ mới', routeMode, sla, lines: fullLines, lineCount: chosen.length, nccs: routedNccs.length });
    } else {
      if (!nccs.length) { setToast('Chưa chọn nhà cung cấp nào để mời.'); return; }
      onCreate({ title: title || 'RFQ mới', routeMode, sla, lines: fullLines, lineCount: chosen.length, nccs: nccs.length });
    }
  };

  return (
    <Drawer title="Tạo yêu cầu báo giá" sub={`Bước ${step + 1}/3 · ${STEPS[step]}`} onClose={onClose}
      footer={<>
        <div style={{ marginRight: 'auto', fontSize: 13, color: 'var(--dv-ink-soft)' }}>{chosen.length} dòng · {effNccCount} NCC · <b style={{ color: 'var(--dv-green)' }}>{VND(totalTarget)}</b></div>
        {step > 0 && <Button variant="secondary" size="md" onClick={() => setStep(step - 1)}>Quay lại</Button>}
        {step < 2
          ? <Button variant="primary" size="md" iconRight={<IconArrowRight size={15} />} onClick={() => setStep(step + 1)}>Tiếp tục</Button>
          : <Button variant="accent" size="md" iconRight={<IconSend size={15} />} onClick={send}>Gửi RFQ tới {effNccCount} NCC</Button>}
      </>}>

      {/* step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={i}>
            <button onClick={() => setStep(i)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer', padding: '5px 11px', borderRadius: 999, background: i === step ? 'var(--dv-green)' : 'transparent', color: i === step ? '#fff' : i < step ? 'var(--dv-green)' : 'var(--dv-ink-faint)', fontFamily: 'var(--font-body)', fontWeight: i === step ? 700 : 600, fontSize: 12.5 }}>
              <span style={{ width: 17, height: 17, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 10.5, background: i === step ? 'var(--dv-yellow)' : i < step ? 'var(--dv-green)' : 'var(--dv-mist)', color: i === step ? 'var(--dv-green)' : i < step ? '#fff' : 'var(--dv-ink-faint)' }}>{i < step ? <IconCheck size={10} color="#fff" /> : i + 1}</span>
              {s}
            </button>
            {i < 2 && <span style={{ flex: 'none', width: 14, height: 1, background: 'var(--border-strong)' }} />}
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3 }}>
              {[['basket', `Từ giỏ dự trù (${basket.length})`], ['manual', 'Chọn tay từ danh mục']].map(([k, l]) => (
                <button key={k} onClick={() => setSrc(k)} style={{ border: 'none', cursor: 'pointer', padding: '6px 13px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: src === k ? '#fff' : 'transparent', color: src === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: src === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
              ))}
            </span>
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--dv-mist)', borderRadius: 999, padding: '8px 13px', border: '1px solid var(--border-default)', marginBottom: 13 }}>
            <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconSearch size={15} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm…" style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-body)', fontSize: 13.5 }} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {list.map((l) => {
              const pk = picks[l.sku];
              return (
                <div key={l.sku} onClick={() => setPick(l.sku, { on: !pk.on })} style={{ border: `1px solid ${pk.on ? 'var(--dv-green)' : 'var(--border-default)'}`, borderRadius: 13, padding: '11px 13px', background: pk.on ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', transition: 'all .12s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 6, border: pk.on ? 'none' : '2px solid var(--border-strong)', background: pk.on ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{pk.on && <IconCheck size={12} color="#fff" />}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{l.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{l.sku} · {l.ncc}</div>
                    </div>
                    {l.fromBasket && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--dv-green)', background: '#fff', padding: '1px 7px', borderRadius: 999, border: '1px solid var(--dv-green-100)', flex: 'none' }}>Giỏ dự trù</span>}
                  </div>
                  {pk.on && (
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 12, marginTop: 10, paddingLeft: 28, flexWrap: 'wrap' }}>
                      <div><label style={lbl}>Số lượng ({l.unit})</label><input type="number" value={pk.qty} onChange={(e) => setPick(l.sku, { qty: Math.max(0, Number(e.target.value)) })} style={{ ...inp, width: 90, textAlign: 'right' }} /></div>
                      <div><label style={lbl}>Giá mục tiêu (₫)</label><input type="number" value={pk.target} onChange={(e) => setPick(l.sku, { target: Math.max(0, Number(e.target.value)) })} style={{ ...inp, width: 110, textAlign: 'right' }} /></div>
                      <div style={{ alignSelf: 'flex-end', paddingBottom: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--dv-ink-soft)' }}>= {VND(pk.qty * pk.target)}</div>
                    </div>
                  )}
                </div>
              );
            })}
            {!list.length && <div style={{ textAlign: 'center', padding: '28px 0', fontSize: 13, color: 'var(--dv-ink-faint)' }}>Không tìm thấy sản phẩm phù hợp.</div>}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <div style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3, marginBottom: 14 }}>
            {[['route', 'Theo NCC phù hợp'], ['broad', 'Đấu giá rộng']].map(([k, lb]) => (
              <button key={k} onClick={() => setRouteMode(k)} style={{ border: 'none', cursor: 'pointer', padding: '7px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5, background: routeMode === k ? '#fff' : 'transparent', color: routeMode === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', boxShadow: routeMode === k ? 'var(--shadow-xs)' : 'none' }}>{lb}</button>
            ))}
          </div>

          {routeMode === 'route' ? (
            <>
              <p style={{ fontSize: 13, color: 'var(--dv-ink-soft)', margin: '0 0 14px', lineHeight: 1.5 }}>Mỗi SKU chỉ gửi tới NCC liên quan — NCC mặc định được mời sẵn, có thể <b>thêm NCC đối thủ</b> để so giá. Mỗi NCC chỉ thấy phần dòng của họ. Báo giá <b>niêm phong</b>.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {chosen.map((p) => {
                  const line = p.line;
                  const route = routeNccsOf(line);
                  const def = defNccOf(line);
                  const cand = window.SUPPLIERS.filter((s) => s.status === 'active' && !s.missing && !route.includes(s.id));
                  return (
                    <div key={line.sku} style={{ border: `1px solid ${route.length ? 'var(--border-default)' : '#F5C0BA'}`, borderRadius: 13, padding: '11px 13px', background: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 9 }}>
                        <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)' }}>{line.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{line.sku} · {NUM(p.qty)} {line.unit}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center' }}>
                        {route.map((id) => { const s = window.SUPPLIERS.find((x) => x.id === id); if (!s) return null; const isDef = id === def; return (
                          <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isDef ? 'var(--dv-green-50)' : 'var(--dv-mist)', border: `1px solid ${isDef ? 'var(--dv-green-100)' : 'var(--border-default)'}`, padding: '4px 8px 4px 11px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--dv-ink)' }}>
                            {s.name.split(' (')[0]}{isDef && <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--dv-green)', letterSpacing: '0.03em' }}>MẶC ĐỊNH</span>}
                            <button onClick={() => removeRoute(line, id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex', padding: 0 }}><IconX size={12} /></button>
                          </span>
                        ); })}
                        {cand.length > 0 && (
                          <select value="" onChange={(e) => { if (e.target.value) addRoute(line, e.target.value); }} style={{ border: '1px dashed var(--border-strong)', background: '#fff', cursor: 'pointer', padding: '5px 9px', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--dv-green)', outline: 'none' }}>
                            <option value="">+ thêm NCC…</option>
                            {cand.map((s) => <option key={s.id} value={s.id}>{s.name.split(' (')[0]}</option>)}
                          </select>
                        )}
                        {route.length === 0 && <span style={{ fontSize: 11.5, fontWeight: 700, color: '#C5372C' }}>Chưa có NCC — chọn để gửi</span>}
                      </div>
                    </div>
                  );
                })}
                {!chosen.length && <div style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: 'var(--dv-ink-faint)' }}>Quay lại bước 1 để chọn dòng hàng.</div>}
              </div>
              <div style={{ marginTop: 13, fontSize: 12.5, color: 'var(--dv-ink-soft)' }}><b style={{ color: 'var(--dv-green)' }}>{routedNccs.length}</b> NCC sẽ nhận RFQ (mỗi NCC một bộ dòng riêng).</div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 13, color: 'var(--dv-ink-soft)', margin: '0 0 14px', lineHeight: 1.5 }}>Gửi <b>toàn bộ rổ</b> tới các NCC được chọn để ép giá cạnh tranh / tìm nguồn mới. Báo giá <b>niêm phong</b>.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {window.SUPPLIERS.filter((s) => s.status === 'active' && !s.missing).map((s) => {
                  const on = nccs.includes(s.id);
                  return (
                    <div key={s.id} onClick={() => toggleNcc(s.id)} style={{ border: `1px solid ${on ? 'var(--dv-green)' : 'var(--border-default)'}`, borderRadius: 13, padding: '12px 14px', background: on ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11, transition: 'all .12s' }}>
                      <span style={{ width: 18, height: 18, borderRadius: 6, border: on ? 'none' : '2px solid var(--border-strong)', background: on ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on && <IconCheck size={12} color="#fff" />}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)', display: 'flex', alignItems: 'center', gap: 7 }}>
                          {s.name}
                          {s.missing && <span title="Thiếu thông tin hồ sơ" style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex' }}><IconAlertTriangle size={13} /></span>}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--dv-ink-soft)' }}>Leadtime {s.leadtime}n · giao đúng hạn {s.otd}% · ★ {s.rating}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--dv-ink-faint)', flex: 'none' }}>{s.skus} SKU</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 6 }}>Tiêu đề RFQ</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: 10, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 8 }}>Thời hạn báo giá (SLA)</label>
            <div style={{ display: 'flex', gap: 9 }}>
              {[24, 48, 72].map((h) => (
                <button key={h} onClick={() => setSla(h)} style={{ flex: 1, border: `1px solid ${sla === h ? 'var(--dv-green)' : 'var(--border-default)'}`, background: sla === h ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer', borderRadius: 12, padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: sla === h ? 'var(--dv-green)' : 'var(--dv-ink)' }}><IconClock size={15} />{h}h</span>
                  <span style={{ fontSize: 11, color: 'var(--dv-ink-soft)' }}>{h === 24 ? 'Gấp' : h === 48 ? 'Tiêu chuẩn' : 'Thư thả'}</span>
                </button>
              ))}
            </div>
          </div>
          {/* summary */}
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ padding: '11px 14px', background: 'var(--dv-mist)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-soft)' }}>Tóm tắt</div>
            {[['Dòng hàng', `${chosen.length} dòng`], ['NCC được mời', window.SUPPLIERS.filter((s) => nccs.includes(s.id)).map((s) => s.name.split(' (')[0]).join(' · ') || '—'], ['Tổng giá trị mục tiêu', VND(totalTarget)], ['Hạn báo giá', `${sla} giờ kể từ khi gửi`]].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderTop: '1px solid var(--border-default)', fontSize: 13 }}>
                <span style={{ color: 'var(--dv-ink-soft)', minWidth: 130, flex: 'none' }}>{k}</span>
                <span style={{ fontWeight: 700, color: 'var(--dv-ink)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--dv-green-900)', color: '#fff', borderRadius: 12, padding: '10px 14px' }}>
            <span style={{ color: 'var(--dv-yellow)', display: 'inline-flex', flex: 'none' }}><IconLock size={15} /></span>
            <span style={{ fontSize: 12.5 }}>Giá mục tiêu chỉ hiển thị nội bộ — NCC thấy <b style={{ color: 'var(--dv-yellow)' }}>giá đề nghị</b> làm mốc, không thấy giá của NCC khác.</span>
          </div>
        </>
      )}
    </Drawer>
  );
}
window.RFQBuilder = RFQBuilder;

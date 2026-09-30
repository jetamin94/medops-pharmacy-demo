/* MedOps — Ghi nhận phản hồi trong hệ thống (feedback).
   Gửi từ Pharmacy + Supplier Portal · triage tại Console (Dược Vương).
   Ngữ cảnh tự đính: màn/route + tenant + vai trò + thiết bị. Đánh dấu vùng = click chọn element.

   ── DVP-469/470 (code ship 2026-08-14) — phản hồi là HỘI THOẠI HAI CHIỀU ──────────────────
   Bản trước của file này mô hình hoá sai ở ba chỗ, mỗi chỗ làm người gửi mù một phần:
   · một trường `reply` duy nhất ⇒ MedOps trả lời lần hai là GHI ĐÈ lần một, mất lịch sử.
     Nay là thread nhiều tin, hai phía `provider` (MedOps) / `sender` (người gửi);
   · không `white-space: pre-wrap` ⇒ thư nhiều dòng bị nuốt xuống-dòng thành một khối chữ liền;
   · chấm đỏ không có gì TẮT nó ⇒ trả lời một cái là nó sáng mãi. Nay mở tab "Phản hồi của tôi"
     = đã xem, mốc xem theo TỪNG PHÍA nên tin mình gửi không tự báo chưa-đọc cho mình.
   Thêm: người gửi NHẮN TIẾP được ngay trong thread — trước phải mở phản hồi mới, mất mạch.

   Khớp code: `components/feedback/FeedbackThread.tsx` (thread dùng chung Console + drawer) ·
   `components/feedback/FeedbackDrawer.tsx` · `app/api/feedback/route.ts` (action reply | seen) ·
   enum ở `lib/feedback/store.ts`. Canon: `docs/tdd/F45-feedback.md`. */

const FB_CATEGORIES = [
  ['bug', 'Lỗi', '#C5372C', '#F8E0DD'],
  ['feature', 'Đề xuất tính năng', 'var(--dv-green)', 'var(--dv-green-50)'],
  ['uiux', 'Góp ý UI/UX', '#1d4f8a', '#E5EEFb'],
  ['data', 'Sai dữ liệu', '#9c6a00', '#FFF1CF'],
  ['question', 'Câu hỏi / hỗ trợ', 'var(--dv-ink-soft)', 'var(--dv-mist)'],
];
/* Khoá phải khớp `FEEDBACK_STATUSES` (lib/feedback/store.ts): new · in_progress · done · rejected.
   Bản trước dùng 'doing' — không có khoá đó ở backend. */
const FB_STATUS = {
  new: ['Mới', 'var(--dv-yellow-100)', 'var(--dv-yellow-600)'],
  in_progress: ['Đang xử lý', '#E5EEFb', '#1d4f8a'],
  done: ['Đã xong', 'var(--dv-green-50)', 'var(--dv-green)'],
  rejected: ['Từ chối', 'var(--dv-mist)', 'var(--dv-ink-soft)'],
};
function FbCatChip({ cat }) {
  const c = FB_CATEGORIES.find(([k]) => k === cat) || FB_CATEGORIES[4];
  return <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 999, background: c[3], color: c[2], fontWeight: 700, fontSize: 11 }}>{c[1]}</span>;
}
function FbStatusChip({ status }) {
  const [l, bg, fg] = FB_STATUS[status] || FB_STATUS.new;
  return <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 999, background: bg, color: fg, fontWeight: 700, fontSize: 11 }}>{l}</span>;
}

/* `dd/MM HH:mm` giờ máy người xem. Mốc hỏng ⇒ trả chuỗi gốc thay vì "Invalid Date". */
function fbWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ---------- Thread một phản hồi — DÙNG CHUNG drawer (người gửi) + Console (triage) ----------
   Vì sao dùng chung: trước bản này mỗi bên render câu trả lời một kiểu và CẢ HAI đều quên
   `pre-wrap`. Sửa hai nơi thì lần sau vẫn lệch; một component thì không.
   `viewerSide` quyết định nhãn: cùng phía với người xem ⇒ "Bạn". Thiếu nó thì Console gọi
   người gửi là "Bạn" và ngược lại. */
function FbThread({ messages, viewerSide, emptyHint }) {
  if (!messages || messages.length === 0) {
    return emptyHint ? <div style={{ fontSize: 12.5, color: 'var(--dv-ink-faint)', fontStyle: 'italic' }}>{emptyHint}</div> : null;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {messages.map((m) => {
        const mine = m.side === viewerSide;
        const provider = m.side === 'provider';
        const who = mine ? 'Bạn' : provider ? 'MedOps' : (m.authorName || 'Người gửi');
        return (
          <div key={m.id} style={{ background: provider ? '#E7F5EE' : 'var(--dv-mist)', border: `1px solid ${provider ? 'rgba(20,107,69,.18)' : 'var(--border-default)'}`, borderRadius: 10, padding: '9px 11px', alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '92%' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, color: provider ? '#146b45' : 'var(--dv-ink-soft)' }}>{who}</span>
              {!mine && provider && m.authorName && <span style={{ fontSize: 10.5, color: 'var(--dv-ink-faint)' }}>{m.authorName}</span>}
              <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--dv-ink-faint)', whiteSpace: 'nowrap' }}>{fbWhen(m.at)}</span>
            </div>
            {/* `pre-wrap` là cả điểm mấu chốt: giữ xuống dòng người viết đã gõ, vẫn tự ngắt dòng
                dài. `break-word` để một URL dài không kéo giãn drawer. */}
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: provider ? '#146b45' : 'var(--dv-ink)', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{m.body}</div>
          </div>
        );
      })}
    </div>
  );
}

/* Ô nhắn tiếp trên từng phản hồi. ⌘/Ctrl+Enter để gửi; gửi xong tự xoá ô. */
function FbReplyBox({ onSend }) {
  const [text, setText] = React.useState('');
  const send = () => { if (!text.trim()) return; onSend(text.trim()); setText(''); };
  const ok = !!text.trim();
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', marginTop: 8 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
        rows={2}
        placeholder="Nhắn tiếp cho MedOps…"
        style={{ flex: 1, border: '1px solid var(--border-default)', borderRadius: 8, padding: '7px 10px', fontSize: 12.5, fontFamily: 'var(--font-body)', lineHeight: 1.5, resize: 'vertical', minHeight: 44, boxSizing: 'border-box', outline: 'none', background: '#fff' }}
      />
      <button onClick={send} disabled={!ok} style={{ border: 'none', borderRadius: 8, padding: '9px 13px', background: 'var(--dv-green)', color: '#fff', fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-display)', cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.5, flex: 'none' }}>Gửi</button>
    </div>
  );
}

/* Phản hồi của tôi (seed) — thread nhiều tin, có cả nội dung MÌNH đã gửi (`body`) để đối chiếu
   MedOps đang trả lời điều gì. `unread` = dẫn xuất "có tin mới hơn mốc mình đã xem". */
const FB_MINE_SEED = [
  {
    id: 'FB-108', cat: 'bug', status: 'in_progress', at: '10/07',
    title: 'Bảng tồn kho không cuộn được trên màn nhỏ',
    route: 'Tồn kho chi nhánh',
    body: 'Mở trên laptop 13" thì bảng tồn kho cắt mất 3 cột cuối.\nKéo ngang không được, chỉ cuộn dọc thôi.',
    unread: true,
    messages: [
      { id: 1, side: 'provider', authorName: 'Hà', at: '2026-07-11T09:20:00', body: 'Bên mình dựng lại được lỗi ở 1366×768. Đang sửa.' },
      { id: 2, side: 'sender', authorName: 'Chị Lan', at: '2026-07-11T10:02:00', body: 'Cảm ơn. Cho hỏi khoảng khi nào có ạ?' },
      { id: 3, side: 'provider', authorName: 'Hà', at: '2026-07-11T14:35:00', body: 'Dự kiến cuối tuần này.\n\nNếu gấp thì tạm thu trình duyệt xuống 90% là đủ 3 cột.' },
    ],
  },
  {
    id: 'FB-095', cat: 'data', status: 'done', at: '05/07',
    title: 'Giá Augmentin lệch với KiotViet',
    route: 'Danh mục sản phẩm',
    body: 'Augmentin 625mg trên MedOps là 12.500đ, trên KiotViet là 13.200đ.',
    unread: true,
    messages: [
      { id: 1, side: 'provider', authorName: 'Tuấn', at: '2026-07-06T08:10:00', body: 'Đã đồng bộ lại bảng giá — kiểm tra giúp bên mình nhé.' },
    ],
  },
  {
    id: 'FB-081', cat: 'feature', status: 'rejected', at: '28/06',
    title: 'Muốn xuất PDF phiếu điều chuyển',
    route: 'Điều chuyển',
    body: 'Kho cần bản in kèm chữ ký khi giao hàng sang điểm bán.',
    unread: false,
    messages: [
      { id: 1, side: 'provider', authorName: 'Hà', at: '2026-06-29T11:00:00', body: 'Trùng tính năng in phiếu sắp ra ở bản tới nên bên mình khép mục này.' },
    ],
  },
];

/* ---------- Launcher: nút topbar + drawer gửi / xem phản hồi ---------- */
function FeedbackLauncher({ surface, route, tenant, role, compact }) {
  const { IconQuote, IconX } = window;
  const [open, setOpen] = React.useState(false);
  const [marking, setMarking] = React.useState(false);
  const [marked, setMarked] = React.useState(null);

  /* Danh sách "của tôi" là STATE, không phải hằng số: chấm đỏ ở FAB và nội dung drawer phải đọc
     cùng một nguồn, nếu không thì mở tab xong chấm đỏ vẫn sáng (đúng lỗi DVP-469 đã sửa). */
  const [mine, setMine] = React.useState(FB_MINE_SEED);
  const unread = mine.filter((f) => f.unread).length;
  const markSeen = React.useCallback(() => setMine((ms) => (ms.some((f) => f.unread) ? ms.map((f) => ({ ...f, unread: false })) : ms)), []);
  const sendReply = React.useCallback((id, text) => setMine((ms) => ms.map((f) => (f.id === id
    ? { ...f, messages: [...(f.messages || []), { id: (f.messages || []).length + 1, side: 'sender', authorName: null, at: new Date().toISOString(), body: text }] }
    : f))), []);

  /* chế độ đánh dấu vùng: click 1 element bất kỳ để neo phản hồi */
  React.useEffect(() => {
    if (!marking) return;
    const over = (e) => { e.target.__fbOutline = e.target.style.outline; e.target.style.outline = '2px solid var(--dv-yellow)'; };
    const out = (e) => { e.target.style.outline = e.target.__fbOutline || ''; };
    const click = (e) => {
      e.preventDefault(); e.stopPropagation();
      const t = e.target;
      const label = (t.textContent || '').trim().slice(0, 60) || t.tagName.toLowerCase();
      setMarked({ label, tag: t.tagName.toLowerCase() });
      t.style.outline = t.__fbOutline || '';
      setMarking(false); setOpen(true);
    };
    const esc = (e) => { if (e.key === 'Escape') setMarking(false); };
    document.addEventListener('mouseover', over, true);
    document.addEventListener('mouseout', out, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', esc, true);
    return () => { document.removeEventListener('mouseover', over, true); document.removeEventListener('mouseout', out, true); document.removeEventListener('click', click, true); document.removeEventListener('keydown', esc, true); };
  }, [marking]);

  const [fabPos, setFabPos] = React.useState(() => { try { const s = JSON.parse(localStorage.getItem('medops_fab_pos')); return s && typeof s.left === 'number' ? s : null; } catch (e) { return null; } });
  const [fabHidden, setFabHidden] = React.useState(() => { try { return localStorage.getItem('medops_fab_hidden') === '1'; } catch (e) { return false; } });
  const hideFab = () => { setFabHidden(true); try { localStorage.setItem('medops_fab_hidden', '1'); } catch (e) {} };
  const showFab = () => { setFabHidden(false); try { localStorage.removeItem('medops_fab_hidden'); } catch (e) {} };
  const dragRef = React.useRef(null);
  const onFabDown = (e) => { const r = e.currentTarget.getBoundingClientRect(); dragRef.current = { ox: e.clientX - r.left, oy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, w: r.width, h: r.height, moved: false }; try { e.currentTarget.setPointerCapture(e.pointerId); } catch (er) {} };
  const onFabMove = (e) => { const d = dragRef.current; if (!d) return; if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 5) return; d.moved = true; const left = Math.max(8, Math.min(window.innerWidth - d.w - 8, e.clientX - d.ox)); const top = Math.max(72, Math.min(window.innerHeight - d.h - 8, e.clientY - d.oy)); d.last = { left, top }; setFabPos(d.last); };
  const onFabUp = () => { const d = dragRef.current; dragRef.current = null; if (!d) return; if (d.moved && d.last) { try { localStorage.setItem('medops_fab_pos', JSON.stringify(d.last)); } catch (er) {} } else { setOpen(true); } };
  const fbPortal = (node) => (window.ReactDOM && window.ReactDOM.createPortal ? window.ReactDOM.createPortal(node, document.body) : node);
  return (
    <>
      {fbPortal(<>
      {/* FAB (kéo để di chuyển · ✕ để ẩn) + hint + drawer — portal ra body để nổi trên mọi form-aside */}
      {!open && !marking && !compact && (fabHidden ? (
        <button onClick={showFab} title="Hiện nút góp ý" style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 260, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 42, border: 'none', borderRadius: '12px 0 0 12px', background: 'var(--dv-green)', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,30,22,.25)' }}><IconQuote size={15} />{unread > 0 && <span style={{ position: 'absolute', top: 6, left: 6, width: 7, height: 7, borderRadius: 999, background: 'var(--dv-yellow)' }} />}</button>
      ) : (
        <div onPointerDown={onFabDown} onPointerMove={onFabMove} onPointerUp={onFabUp} title="Góp ý — kéo để di chuyển; bấm để mở" style={{ position: 'fixed', zIndex: 260, ...(fabPos ? { left: fabPos.left, top: fabPos.top } : { right: 20, bottom: 110 }), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--dv-green)', color: '#fff', cursor: 'grab', padding: '11px 12px 11px 17px', borderRadius: 999, boxShadow: '0 10px 30px rgba(0,30,22,.28)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13.5, touchAction: 'none', userSelect: 'none' }}>
          <IconQuote size={16} />Góp ý{unread > 0 && <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--dv-yellow)' }} />}
          <span onPointerDown={(e) => e.stopPropagation()} onClick={hideFab} title="Ẩn nút góp ý" role="button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 999, background: 'rgba(255,255,255,.2)', cursor: 'pointer', marginLeft: 2, flex: 'none' }}><IconX size={12} /></span>
        </div>
      ))}
      {marking && (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center', zIndex: 200, pointerEvents: 'none' }}>
          <div style={{ background: 'var(--dv-green-900, #003328)', color: '#fff', padding: '11px 20px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,30,22,.35)' }}>
            Bấm vào thành phần cần góp ý — <span style={{ color: 'var(--dv-yellow)' }}>Esc để hủy</span>
          </div>
        </div>
      )}
      {open && !marking && <FeedbackDrawer surface={surface} route={route} tenant={tenant} role={role} marked={marked} mine={mine} markSeen={markSeen} sendReply={sendReply} clearMark={() => setMarked(null)} onClose={() => { setOpen(false); setMarked(null); }} onMark={() => { setOpen(false); setMarking(true); }} />}
      </>)}
    </>
  );
}

function FeedbackDrawer({ surface, route, tenant, role, marked, mine, markSeen, sendReply, clearMark, onClose, onMark }) {
  const { IconX, IconEye, IconUpload, IconSend, IconInfo, IconCheckCircle } = window;
  const [tab, setTab] = React.useState('send');
  const [cat, setCat] = React.useState('bug');
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [files, setFiles] = React.useState([]);
  const [sent, setSent] = React.useState(false);
  const device = 'Chrome 126 · macOS · 1440×900';
  const fld = { display: 'block', fontWeight: 600, fontSize: 12.5, marginBottom: 6, color: 'var(--dv-ink)' };
  const inp = { width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', background: '#fff' };
  const ctxChip = (l, v) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--dv-mist)', borderRadius: 999, padding: '4px 10px', fontSize: 11.5, color: 'var(--dv-ink-soft)' }}><b style={{ color: 'var(--dv-ink-faint)', fontWeight: 700, textTransform: 'uppercase', fontSize: 9.5, letterSpacing: '.04em' }}>{l}</b>{v}</span>
  );

  /* Mở tab "Phản hồi của tôi" = đã xem ⇒ tắt chấm đỏ. Đây là thứ trước DVP-469 KHÔNG có. */
  React.useEffect(() => { if (tab === 'mine') markSeen(); }, [tab, markSeen]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,22,.32)' }} />
      <div style={{ position: 'relative', width: 'min(480px, 96vw)', height: '100%', background: 'var(--dv-paper, #F1F1F1)', boxShadow: '0 0 60px rgba(0,30,22,.3)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 0', background: '#fff', flex: 'none' }}>
          <h3 style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--dv-green)', margin: 0 }}>Phản hồi</h3>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border-default)', background: '#fff', cursor: 'pointer', color: 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><IconX size={17} /></button>
        </div>
        <div style={{ display: 'flex', gap: 2, padding: '10px 20px 0', background: '#fff', borderBottom: '1px solid var(--border-default)', flex: 'none' }}>
          {[['send', 'Gửi phản hồi'], ['mine', `Phản hồi của tôi (${mine.length})`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '9px 13px', fontFamily: 'var(--font-body)', fontWeight: tab === k ? 700 : 600, fontSize: 13.5, color: tab === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)', borderBottom: tab === k ? '2.5px solid var(--dv-yellow)' : '2.5px solid transparent', marginBottom: -1 }}>{l}</button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {tab === 'send' && (sent ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <span style={{ display: 'inline-flex', color: 'var(--dv-green-bright)' }}><IconCheckCircle size={52} /></span>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--dv-green)', marginTop: 14 }}>Đã gửi phản hồi</div>
              <p style={{ fontSize: 13.5, color: 'var(--dv-ink-soft)', margin: '8px auto 20px', maxWidth: '32ch', lineHeight: 1.5 }}>Đội MedOps sẽ tiếp nhận. Theo dõi và nhắn tiếp ở tab "Phản hồi của tôi".</p>
              <button onClick={() => { setSent(false); setTitle(''); setDesc(''); setFiles([]); clearMark(); }} style={{ border: '1px solid var(--border-strong)', background: '#fff', color: 'var(--dv-green)', borderRadius: 999, padding: '9px 18px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Gửi phản hồi khác</button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={fld}>Phân loại</label>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {FB_CATEGORIES.map(([k, l, fg, bg]) => (
                    <button key={k} onClick={() => setCat(k)} style={{ border: cat === k ? `2px solid ${fg}` : '1px solid var(--border-strong)', background: cat === k ? bg : '#fff', color: cat === k ? fg : 'var(--dv-ink-soft)', borderRadius: 999, padding: '7px 13px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={fld}>Tiêu đề</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tóm tắt ngắn gọn…" style={inp} /></div>
              <div style={{ marginBottom: 14 }}><label style={fld}>Mô tả chi tiết</label><textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Điều gì xảy ra? Bạn mong đợi gì?" style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} /></div>

              <div style={{ marginBottom: 14 }}>
                <label style={fld}>Vùng liên quan trên màn hình <span style={{ fontWeight: 400, color: 'var(--dv-ink-faint)' }}>· tuỳ chọn</span></label>
                {marked
                  ? <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'var(--dv-yellow-100)', border: '1px solid #F5E0A8', borderRadius: 10, padding: '9px 12px' }}>
                      <span style={{ color: 'var(--dv-yellow-600)', display: 'inline-flex', flex: 'none' }}><IconEye size={15} /></span>
                      <span style={{ flex: 1, fontSize: 12.5, color: 'var(--dv-ink)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>&lt;{marked.tag}&gt; "{marked.label}"</span>
                      <button onClick={clearMark} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex', padding: 0 }}><IconX size={14} /></button>
                    </div>
                  : <button onClick={onMark} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px dashed var(--border-strong)', background: '#fff', color: 'var(--dv-green)', borderRadius: 10, padding: '9px 14px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}><IconEye size={15} />Đánh dấu vùng trên màn hình</button>}
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={fld}>Đính kèm <span style={{ fontWeight: 400, color: 'var(--dv-ink-faint)' }}>· ảnh/file, tuỳ chọn</span></label>
                <button onClick={() => setFiles((f) => [...f, `anh-man-hinh-${f.length + 1}.png`])} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px dashed var(--border-strong)', background: '#fff', color: 'var(--dv-ink-soft)', borderRadius: 10, padding: '9px 14px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}><IconUpload size={15} />Chọn file…</button>
                {files.length > 0 && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>{files.map((f, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid var(--border-default)', borderRadius: 999, padding: '4px 10px', fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--dv-ink-soft)' }}>{f}<button onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-ink-faint)', display: 'inline-flex', padding: 0 }}><IconX size={12} /></button></span>)}</div>}
              </div>

              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border-default)', padding: '11px 13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--dv-ink-faint)', marginBottom: 8 }}><IconInfo size={13} />Ngữ cảnh tự đính kèm</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {ctxChip('Màn', route)}{ctxChip('Tenant', tenant)}{ctxChip('Vai trò', role)}{ctxChip('Thiết bị', device)}
                </div>
              </div>
            </>
          ))}

          {tab === 'mine' && (
            mine.length === 0 ? (
              <div style={{ padding: '32px 8px', textAlign: 'center', color: 'var(--dv-ink-faint)', fontSize: 13.5 }}>Chưa có phản hồi nào.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {mine.map((f) => (
                  <div key={f.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border-default)', padding: 13 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{f.id}</span>
                      <FbCatChip cat={f.cat} /><FbStatusChip status={f.status} />
                      {f.unread && <span title="Có tin mới" style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--dv-green-bright)' }} />}
                      <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--dv-ink-faint)' }}>{f.at}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--dv-ink)', marginTop: 7 }}>{f.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--dv-ink-faint)', marginTop: 2 }}>Màn: {f.route}</div>
                    {/* Nội dung MÌNH đã gửi — thiếu nó thì không đối chiếu được MedOps trả lời điều gì. */}
                    {f.body && <div style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.55, color: 'var(--dv-ink-soft)', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{f.body}</div>}
                    {f.messages && f.messages.length > 0 && <div style={{ marginTop: 10 }}><FbThread messages={f.messages} viewerSide="sender" /></div>}
                    <FbReplyBox onSend={(text) => sendReply(f.id, text)} />
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {tab === 'send' && !sent && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '13px 20px', background: '#fff', borderTop: '1px solid var(--border-default)', flex: 'none' }}>
            <button disabled={!title.trim()} onClick={() => title.trim() && setSent(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: 'none', background: title.trim() ? 'var(--dv-green)' : 'var(--border-strong)', color: '#fff', borderRadius: 999, padding: '11px 22px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, cursor: title.trim() ? 'pointer' : 'default' }}><IconSend size={15} />Gửi phản hồi</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FB_CATEGORIES, FB_STATUS, FB_MINE_SEED, FbCatChip, FbStatusChip, FbThread, FbReplyBox, fbWhen, FeedbackLauncher });

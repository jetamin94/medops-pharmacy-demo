/* DV MedKing — shared widget kit for the Ops Portal prototypes.
   Procurement-specific components + helpers. Exported to window. */

/* ---------- Helpers ---------- */
const VND = (n) => (n == null ? '—' : new Intl.NumberFormat('vi-VN').format(Math.round(n)) + '\u20AB');
const NUM = (n) => new Intl.NumberFormat('vi-VN').format(n);
const PCT = (n) => (n > 0 ? '+' : '') + n.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '%';
window.VND = VND; window.NUM = NUM; window.PCT = PCT;

/* ---------- MedOps logo (wordmark + accent bar) ----------
   reversed=true → trắng + vàng (nền xanh) · false → MED xanh đậm + OPS xanh sáng (nền sáng) */
function MedOpsLogo({ size = 22, reversed = true, tagline, mono }) {
  const medColor = mono ? mono : reversed ? '#fff' : 'var(--dv-green)';
  const opsColor = mono ? mono : reversed ? 'var(--dv-yellow)' : 'var(--dv-green-bright)';
  const accent = mono ? mono : 'var(--dv-yellow)';
  const tagColor = reversed ? 'rgba(255,255,255,.62)' : 'var(--dv-ink-faint)';
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.01em', lineHeight: 0.9, display: 'inline-flex', flexDirection: 'column', gap: '0.34em' }}>
      <span style={{ fontSize: size, color: medColor }}>MED<span style={{ color: opsColor }}>OPS</span></span>
      {tagline !== undefined && (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4em' }}>
          <span style={{ height: '0.16em', width: '3.4em', background: accent, borderRadius: 99, display: 'block' }} />
          <span style={{ height: '0.16em', width: '0.16em', borderRadius: '50%', background: accent, display: 'block' }} />
          {tagline && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.2em', letterSpacing: '0.18em', textTransform: 'uppercase', color: tagColor, whiteSpace: 'nowrap' }}>{tagline}</span>}
        </span>
      )}
    </span>
  );
}
/* Square "M" app-tile mark */
function MedOpsMark({ size = 30, radius }) {
  const r = radius != null ? radius : Math.round(size * 0.24);
  return (
    <span style={{ width: size, height: size, borderRadius: r, background: 'var(--dv-green)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', position: 'relative' }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: size * 0.56, color: '#fff', lineHeight: 1, marginTop: -size * 0.02 }}>M</span>
      <span style={{ position: 'absolute', bottom: size * 0.18, height: Math.max(2, size * 0.06), width: size * 0.34, borderRadius: 99, background: 'var(--dv-yellow)' }} />
    </span>
  );
}
window.MedOpsLogo = MedOpsLogo;
window.MedOpsMark = MedOpsMark;

/* ---------- Pagination (offset, numbered) — khớp <Pagination> hệ thống thật (JET-96 M1)
   ARIA: nav[aria-label] · aria-current · status "Trang X/Y — A–B / N dòng" · size-picker.
   Demo dùng cỡ trang nhỏ để thấy điều hướng; production: 25/50/100 (mặc định 25). */
function Pagination({ page, size, total, onPage, onSize, sizes = [10, 25, 50], note = 'demo · production 25/50/100' }) {
  const pages = Math.max(1, Math.ceil(total / size));
  const cur = Math.min(Math.max(1, page), pages);
  const from = total === 0 ? 0 : (cur - 1) * size + 1;
  const to = Math.min(total, cur * size);
  // dải số trang wrap-safe: 1 … (cur-1) cur (cur+1) … last
  const nums = [];
  const push = (n) => { if (!nums.includes(n) && n >= 1 && n <= pages) nums.push(n); };
  push(1); push(2); for (let d = -1; d <= 1; d++) push(cur + d); push(pages - 1); push(pages);
  nums.sort((a, b) => a - b);
  const withGaps = []; let prev = 0;
  nums.forEach((n) => { if (n - prev > 1) withGaps.push('…' + n); withGaps.push(n); prev = n; });
  const btn = (active, disabled) => ({ minWidth: 34, height: 34, padding: '0 9px', borderRadius: 9, border: active ? 'none' : '1px solid var(--border-strong)', background: active ? 'var(--dv-green)' : '#fff', color: active ? '#fff' : disabled ? 'var(--dv-ink-faint)' : 'var(--dv-ink)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 13, cursor: disabled || active ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.5 : 1 });
  const { IconChevronLeft, IconChevronRight } = window;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 12 }}>
      <div style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }} aria-live="polite">{total === 0 ? 'Không có dòng nào' : <>Trang <b style={{ color: 'var(--dv-ink)' }}>{cur}</b>/{pages} — {from}–{to} / <b style={{ color: 'var(--dv-ink)' }}>{total}</b> dòng</>}</div>
      {pages > 1 && (
        <nav aria-label="Phân trang" style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <button aria-label="Trang trước" disabled={cur === 1} onClick={() => onPage(cur - 1)} style={btn(false, cur === 1)}><IconChevronLeft size={16} /></button>
          {withGaps.map((n, i) => typeof n === 'string'
            ? <span key={'g' + i} style={{ minWidth: 20, textAlign: 'center', color: 'var(--dv-ink-faint)', fontSize: 13 }}>…</span>
            : <button key={n} aria-label={'Trang ' + n} aria-current={n === cur ? 'page' : undefined} onClick={() => n !== cur && onPage(n)} style={btn(n === cur, false)}>{n}</button>)}
          <button aria-label="Trang sau" disabled={cur === pages} onClick={() => onPage(cur + 1)} style={btn(false, cur === pages)}><IconChevronRight size={16} /></button>
        </nav>
      )}
      {onSize && (
        <label style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--dv-ink-soft)' }}>
          Cỡ trang
          <select value={size} onChange={(e) => { onSize(Number(e.target.value)); onPage(1); }} style={{ height: 34, padding: '0 8px', borderRadius: 9, border: '1px solid var(--border-strong)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, background: '#fff', color: 'var(--dv-ink)', cursor: 'pointer' }}>
            {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {note && <span style={{ fontSize: 11, color: 'var(--dv-ink-faint)' }}>· {note}</span>}
        </label>
      )}
    </div>
  );
}

/* ---------- KeysetPager (Cũ hơn / Mới hơn) — cho Nhật ký append-only (keyset, JET-96 M3) ---------- */
function KeysetPager({ offset, size, total, onOlder, onNewer }) {
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(total, offset + size);
  const { IconChevronLeft, IconChevronRight } = window;
  const bs = (disabled) => ({ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 999, border: '1px solid var(--border-strong)', background: '#fff', color: disabled ? 'var(--dv-ink-faint)' : 'var(--dv-green)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1 });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
      <span style={{ fontSize: 12.5, color: 'var(--dv-ink-soft)' }} aria-live="polite">{from}–{to} / <b style={{ color: 'var(--dv-ink)' }}>{total}</b> bản ghi</span>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
        <button disabled={offset === 0} onClick={onNewer} style={bs(offset === 0)}><IconChevronLeft size={15} />Mới hơn</button>
        <button disabled={to >= total} onClick={onOlder} style={bs(to >= total)}>Cũ hơn<IconChevronRight size={15} /></button>
      </div>
    </div>
  );
}
window.Pagination = Pagination;
window.KeysetPager = KeysetPager;

/* ---------- Status badge (procurement tones) ---------- */
const STATUS_MAP = {
  draft:      { label: 'Nháp',        bg: '#EEF0EF', fg: '#525B58', dot: '#8A938F' },
  suggested:  { label: 'Đề xuất',     bg: '#FFF1CF', fg: '#8a6a00', dot: '#E1A100' },
  pending:    { label: 'Chờ duyệt',   bg: '#FFF1CF', fg: '#8a6a00', dot: '#E1A100' },
  approved:   { label: 'Đã duyệt',    bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  sent:       { label: 'Đã gửi',      bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  open:       { label: 'Đang mở',     bg: '#E5EEFb', fg: '#1d4f8a', dot: '#2A6FDB' },
  submitted:  { label: 'Đã báo giá',  bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  awarded:    { label: 'Đã chọn',     bg: '#00533F', fg: '#ffffff', dot: '#FDB813' },
  received:   { label: 'Đã nhận',     bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  rejected:   { label: 'Từ chối',     bg: '#F8E0DD', fg: '#9c2b22', dot: '#C5372C' },
  active:     { label: 'Hiệu lực',    bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  expired:    { label: 'Hết hạn',     bg: '#F8E0DD', fg: '#9c2b22', dot: '#C5372C' },
  confirmed:  { label: 'Đã xác nhận', bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  shipping:   { label: 'Đang giao',   bg: '#E5EEFb', fg: '#1d4f8a', dot: '#2A6FDB' },
  matched:    { label: 'Khớp',        bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
  mismatch:   { label: 'Lệch',        bg: '#F8E0DD', fg: '#9c2b22', dot: '#C5372C' },
  partial:    { label: 'Một phần',    bg: '#FFF1CF', fg: '#8a6a00', dot: '#E1A100' },
  critical:   { label: 'Khẩn',        bg: '#F8E0DD', fg: '#9c2b22', dot: '#C5372C' },
  low:        { label: 'Thấp',        bg: '#FFF1CF', fg: '#8a6a00', dot: '#E1A100' },
  healthy:    { label: 'Đủ',          bg: '#D6ECE5', fg: '#00533F', dot: '#0A7F64' },
};
function StatusBadge({ status, label, size = 'md' }) {
  const s = STATUS_MAP[status] || STATUS_MAP.draft;
  const pad = size === 'sm' ? '2px 9px 2px 7px' : '4px 11px 4px 8px';
  const fs = size === 'sm' ? 11.5 : 12.5;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: pad, borderRadius: 999,
      background: s.bg, color: s.fg, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: fs, whiteSpace: 'nowrap', lineHeight: 1.3 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flex: 'none' }} />
      {label || s.label}
    </span>
  );
}
window.StatusBadge = StatusBadge;

/* ---------- SLA countdown ---------- */
function useTick(ms = 1000) {
  const [, set] = React.useState(0);
  React.useEffect(() => { const id = setInterval(() => set((n) => n + 1), ms); return () => clearInterval(id); }, [ms]);
}
function SLACountdown({ deadline, compact = false }) {
  useTick(1000);
  const diff = deadline - Date.now();
  const over = diff <= 0;
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3.6e6), m = Math.floor((abs % 3.6e6) / 6e4), s = Math.floor((abs % 6e4) / 1000);
  const urgent = !over && diff < 3.6e6 * 2;
  const color = over ? '#C5372C' : urgent ? '#E1A100' : 'var(--dv-green-bright)';
  const bg = over ? '#F8E0DD' : urgent ? '#FFF1CF' : '#D6ECE5';
  const txt = over ? 'Quá hạn ' : '';
  const time = h > 24 ? `${Math.floor(h / 24)}n ${h % 24}g` : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  const { IconClock } = window;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: compact ? '3px 9px' : '5px 11px', borderRadius: 999,
      background: bg, color, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: compact ? 12 : 13, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      <IconClock size={compact ? 13 : 15} />{txt}{time}
    </span>
  );
}
window.SLACountdown = SLACountdown;

/* ---------- Offered-vs-target delta chip ---------- */
function DeltaChip({ offered, target, size = 'md' }) {
  if (offered == null || target == null) return <span style={{ color: 'var(--dv-ink-faint)' }}>—</span>;
  const d = offered - target;
  const pct = target ? (d / target) * 100 : 0;
  const good = d <= 0; // lower than target price = good for buyer
  const color = d === 0 ? 'var(--dv-ink-soft)' : good ? 'var(--dv-green-bright)' : '#C5372C';
  const bg = d === 0 ? '#EEF0EF' : good ? '#D6ECE5' : '#F8E0DD';
  const { IconArrowDown, IconArrowUp } = window;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: size === 'sm' ? '2px 7px' : '3px 8px', borderRadius: 999,
      background: bg, color, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: size === 'sm' ? 11.5 : 12.5, fontVariantNumeric: 'tabular-nums' }}>
      {d !== 0 && (good ? <IconArrowDown size={12} /> : <IconArrowUp size={12} />)}
      {d === 0 ? '±0%' : PCT(pct)}
    </span>
  );
}
window.DeltaChip = DeltaChip;

/* ---------- Partial-fulfil indicator ---------- */
function FillBar({ have, need, width = 96 }) {
  const ratio = Math.max(0, Math.min(1, have / need));
  const full = have >= need;
  const color = full ? 'var(--dv-green-bright)' : ratio >= 0.5 ? 'var(--dv-yellow-600)' : '#C5372C';
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, minWidth: width }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 600, color: 'var(--dv-ink)', fontVariantNumeric: 'tabular-nums' }}>
        {NUM(have)}<span style={{ color: 'var(--dv-ink-faint)' }}>/{NUM(need)}</span>
        {!full && <span style={{ color: 'var(--dv-yellow-600)', fontWeight: 700 }}> · {Math.round(ratio * 100)}%</span>}
      </span>
      <span style={{ height: 5, borderRadius: 999, background: '#EEF0EF', overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${ratio * 100}%`, background: color, borderRadius: 999 }} />
      </span>
    </span>
  );
}
window.FillBar = FillBar;

/* ---------- Days-of-inventory bar ---------- */
function DoiBar({ days, target = 30, max = 60 }) {
  const tone = days <= 7 ? 'critical' : days <= 15 ? 'low' : 'healthy';
  const color = tone === 'critical' ? '#C5372C' : tone === 'low' ? '#E1A100' : 'var(--dv-green-bright)';
  const pct = Math.max(4, Math.min(100, (days / max) * 100));
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 150 }}>
      <span style={{ position: 'relative', flex: 1, height: 8, borderRadius: 999, background: '#EEF0EF' }}>
        <span style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: color, borderRadius: 999 }} />
        <span style={{ position: 'absolute', top: -2, bottom: -2, left: `${(target / max) * 100}%`, width: 2, background: 'var(--dv-ink-faint)', opacity: .5 }} />
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, fontWeight: 700, color, minWidth: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{days}<span style={{ color: 'var(--dv-ink-faint)', fontWeight: 500 }}>ng</span></span>
    </span>
  );
}
window.DoiBar = DoiBar;

/* ---------- Jargon tooltip ---------- */
function Tip({ text, children }) {
  const [open, setOpen] = React.useState(false);
  const { IconHelp } = window;
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4 }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', cursor: 'help' }}><IconHelp size={13} /></span>
      {open && (
        <span style={{ position: 'absolute', bottom: '130%', left: 0, zIndex: 50, width: 240, padding: '10px 12px',
          background: 'var(--dv-green-900)', color: '#fff', borderRadius: 10, fontFamily: 'var(--font-body)', fontWeight: 400,
          fontSize: 12.5, lineHeight: 1.45, boxShadow: 'var(--shadow-lg)', textTransform: 'none', letterSpacing: 0 }}>{text}</span>
      )}
    </span>
  );
}
window.Tip = Tip;

/* ---------- VAT incl/excl toggle ---------- */
function VatToggle({ value, onChange }) {
  return (
    <span style={{ display: 'inline-flex', background: '#EEF0EF', borderRadius: 999, padding: 3 }}>
      {[['excl', 'Chưa VAT'], ['incl', 'Có VAT']].map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)} style={{ border: 'none', cursor: 'pointer', padding: '5px 14px', borderRadius: 999,
          fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12.5,
          background: value === k ? '#fff' : 'transparent', color: value === k ? 'var(--dv-green)' : 'var(--dv-ink-soft)',
          boxShadow: value === k ? 'var(--shadow-xs)' : 'none' }}>{l}</button>
      ))}
    </span>
  );
}
window.VatToggle = VatToggle;

/* ---------- Status tabs (Tất cả / Chờ… ) ---------- */
function StatusTabs({ items, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border-default)' }}>
      {items.map(([k, label, count]) => {
        const on = value === k;
        return (
          <button key={k} onClick={() => onChange(k)} style={{ position: 'relative', border: 'none', background: 'transparent', cursor: 'pointer',
            padding: '10px 14px 12px', fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 500, fontSize: 14,
            color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            {label}
            {count != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 700, padding: '1px 7px', borderRadius: 999,
              background: on ? 'var(--dv-green)' : '#EEF0EF', color: on ? '#fff' : 'var(--dv-ink-soft)' }}>{count}</span>}
            {on && <span style={{ position: 'absolute', left: 8, right: 8, bottom: -1, height: 3, borderRadius: 999, background: 'var(--dv-yellow)' }} />}
          </button>
        );
      })}
    </div>
  );
}
window.StatusTabs = StatusTabs;

/* ---------- Page header ---------- */
function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 22, flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--dv-green)', margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p style={{ fontFamily: 'var(--font-body)', color: 'var(--dv-ink-soft)', margin: '6px 0 0', fontSize: 14.5, maxWidth: '70ch' }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}
window.PageHeader = PageHeader;

/* ---------- Toolbar (search + filters) ---------- */
function Toolbar({ children }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>{children}</div>;
}
function SearchBox({ value, onChange, placeholder, width = 280 }) {
  const { IconSearch } = window;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'var(--dv-mist)', borderRadius: 999, padding: '9px 15px', width, border: '1px solid var(--border-default)' }}>
      <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex' }}><IconSearch size={17} /></span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--dv-ink)' }} />
    </span>
  );
}
function GhostBtn({ icon, children, onClick, active }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: '1px solid var(--border-default)', background: active ? 'var(--dv-green-50)' : '#fff', cursor: 'pointer',
      padding: '8px 14px', borderRadius: 999, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13.5, color: active ? 'var(--dv-green)' : 'var(--dv-ink-soft)' }}>
      {icon}{children}
    </button>
  );
}
window.Toolbar = Toolbar; window.SearchBox = SearchBox; window.GhostBtn = GhostBtn;

/* ---------- Data table primitives ---------- */
function Table({ children, minWidth }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-default)', background: '#fff' }}>
      <table style={{ width: '100%', minWidth, borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>{children}</table>
    </div>
  );
}
function Th({ children, align = 'left', width }) {
  return <th style={{ position: 'sticky', top: 0, zIndex: 1, textAlign: align, width, background: 'var(--dv-mist)', color: 'var(--dv-ink-soft)', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', padding: '12px 16px', borderBottom: '1px solid var(--border-default)', whiteSpace: 'nowrap' }}>{children}</th>;
}
function Td({ children, align = 'left', mono, strong, color, nowrap }) {
  return <td style={{ textAlign: align, padding: '13px 16px', fontSize: 14, color: color || 'var(--dv-ink)', fontWeight: strong ? 700 : 400, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontVariantNumeric: mono ? 'tabular-nums' : 'normal', whiteSpace: nowrap ? 'nowrap' : 'normal' }}>{children}</td>;
}
function Tr({ children, onClick, hover = true, highlight }) {
  const [h, setH] = React.useState(false);
  return (
    <tr onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ borderBottom: '1px solid var(--border-default)', cursor: onClick ? 'pointer' : 'default',
        background: highlight ? '#FFFBF0' : (hover && h ? 'var(--dv-mist)' : 'transparent'), transition: 'background 120ms' }}>{children}</tr>
  );
}
window.Table = Table; window.Th = Th; window.Td = Td; window.Tr = Tr;

/* ---------- Tiny inline icon badge (square, soft) ---------- */
function MiniBadge({ children, tone = 'green' }) {
  const map = { green: ['var(--dv-green-50)', 'var(--dv-green)'], yellow: ['var(--dv-yellow-100)', 'var(--dv-yellow-600)'], red: ['#F8E0DD', '#C5372C'], blue: ['#E5EEFb', '#1d4f8a'] };
  const [bg, fg] = map[tone] || map.green;
  return <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: bg, color: fg, flex: 'none' }}>{children}</span>;
}
window.MiniBadge = MiniBadge;

/* ---------- MultiSelect filter (checkbox popover) ----------
   Empty selection === "all". `allLabel` shown when nothing/everything picked. */
function MultiSelect({ options, value, onChange, allLabel = 'Tất cả', icon, width = 200, align = 'left' }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const { IconChevronDown, IconCheck, IconX } = window;
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const sel = value || [];
  const toggle = (opt) => { onChange(sel.includes(opt) ? sel.filter((x) => x !== opt) : [...sel, opt]); };
  const summary = sel.length === 0 ? allLabel : sel.length === 1 ? sel[0] : `${sel.length} đã chọn`;
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen((o) => !o)} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, width, boxSizing: 'border-box', padding: '9px 12px', borderRadius: 9, border: `1px solid ${open ? 'var(--dv-green-bright)' : 'var(--border-strong)'}`, background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: sel.length ? 'var(--dv-ink)' : 'var(--dv-ink-soft)', boxShadow: open ? 'var(--focus-ring)' : 'none', textAlign: 'left' }}>
        {icon && <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', flex: 'none' }}>{icon}</span>}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</span>
        {sel.length > 0 && <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 11, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--dv-green)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{sel.length}</span>}
        <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s' }}><IconChevronDown size={15} /></span>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', [align]: 0, zIndex: 70, width: Math.max(width, 230), background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-default)', padding: 7, maxHeight: 320, overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px 8px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--dv-ink-faint)' }}>{allLabel} ({sel.length || options.length})</span>
            {sel.length > 0 && <button onClick={() => onChange([])} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--dv-green-bright)', fontWeight: 700, fontSize: 12 }}><IconX size={12} />Bỏ chọn</button>}
          </div>
          {options.map((opt) => {
            const on = sel.includes(opt);
            return (
              <button key={opt} onClick={() => toggle(opt)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 9px', border: 'none', background: on ? 'var(--dv-green-50)' : 'transparent', cursor: 'pointer', borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? 'var(--dv-green)' : 'var(--dv-ink)', textAlign: 'left', marginBottom: 1 }}>
                <span style={{ width: 17, height: 17, borderRadius: 5, border: on ? 'none' : '1.5px solid var(--border-strong)', background: on ? 'var(--dv-green)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{on && <IconCheck size={12} color="#fff" />}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </span>
  );
}
window.MultiSelect = MultiSelect;

/* ---------- Empty state + CSV export (Gói 3) ---------- */
function EmptyState({ icon = 'IconInbox', title, hint }) {
  const Icon = window[icon] || window.IconInbox;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '46px 20px', textAlign: 'center' }}>
      <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--dv-mist)', color: 'var(--dv-ink-faint)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={24} /></span>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5, color: 'var(--dv-ink)' }}>{title}</div>
      {hint && <div style={{ fontSize: 13, color: 'var(--dv-ink-soft)', maxWidth: '46ch', lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}
window.EmptyState = EmptyState;

function exportCSV(filename, header, rows) {
  const esc = (c) => { const s = String(c == null ? '' : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const csv = '\uFEFF' + [header.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
window.exportCSV = exportCSV;

/* ---------- Skeleton bar (hiện khi đồng bộ) ---------- */
function Skel({ w = '100%', h = 12, r = 6 }) {
  return <span className="dv-skel" style={{ display: 'block', width: w, height: h, borderRadius: r }} />;
}
window.Skel = Skel;

/* ---------- Toast ---------- */
function Toast({ msg, onDone }) {
  React.useEffect(() => { if (!msg) return; const id = setTimeout(onDone, 3200); return () => clearTimeout(id); }, [msg]);
  const { IconCheckCircle } = window;
  if (!msg) return null;
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 200,
      display: 'flex', alignItems: 'center', gap: 11, background: 'var(--dv-green-900)', color: '#fff', padding: '13px 20px',
      borderRadius: 14, boxShadow: 'var(--shadow-lg)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, animation: 'dvToast .32s var(--ease-out)' }}>
      <span style={{ color: 'var(--dv-yellow)', display: 'inline-flex' }}><IconCheckCircle size={20} /></span>{msg}
    </div>
  );
}
window.Toast = Toast;

/* ---------- Pipeline stepper — shows where a screen sits in a multi-stage flow ---------- */
function PipelineSteps({ steps, active }) {
  const { IconChevronRight } = window;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 999, padding: '6px 8px', marginBottom: 18, width: 'fit-content', maxWidth: '100%' }}>
      {steps.map((s, i) => {
        const on = i === active;
        const done = i < active;
        return (
          <React.Fragment key={i}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 999, background: on ? 'var(--dv-green)' : 'transparent', color: on ? '#fff' : done ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, background: on ? 'var(--dv-yellow)' : done ? 'var(--dv-green-50)' : 'var(--dv-mist)', color: on ? 'var(--dv-green)' : done ? 'var(--dv-green)' : 'var(--dv-ink-faint)' }}>{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: on ? 700 : 600, fontSize: 12.5, whiteSpace: 'nowrap' }}>{s}</span>
            </span>
            {i < steps.length - 1 && <span style={{ color: 'var(--dv-ink-faint)', display: 'inline-flex', flex: 'none' }}><IconChevronRight size={14} /></span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
window.PipelineSteps = PipelineSteps;

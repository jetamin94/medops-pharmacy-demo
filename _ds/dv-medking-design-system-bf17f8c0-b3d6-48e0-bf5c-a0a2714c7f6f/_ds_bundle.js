/* @ds-bundle: {"format":3,"namespace":"DVMedKingDesignSystem_bf17f8","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconBadge","sourcePath":"components/brand/IconBadge.jsx"},{"name":"NumberMarker","sourcePath":"components/brand/NumberMarker.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"Card","sourcePath":"components/data/Card.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"e35506952b58","components/brand/IconBadge.jsx":"ab2785db1517","components/brand/NumberMarker.jsx":"f6623b6affd2","components/data/Badge.jsx":"8dc0c8a1f624","components/data/Card.jsx":"57b8058e8513","components/data/StatCard.jsx":"10acd9225416","components/feedback/Alert.jsx":"68a863c37506","components/forms/Checkbox.jsx":"fe9109847fa7","components/forms/Input.jsx":"4dd7df5ffd7b","components/forms/Switch.jsx":"994da6fc5641","components/navigation/Tabs.jsx":"0f4b5168cde9","ui_kits/icons.jsx":"6d20850d9abc","ui_kits/portal/Cart.jsx":"aeada7b7f847","ui_kits/portal/Catalogue.jsx":"5e0f519cde9d","ui_kits/portal/Dashboard.jsx":"df055f7c5218","ui_kits/portal/Shell.jsx":"da86b1ae9d10","ui_kits/portal/data.jsx":"e1fd87e6cbca","ui_kits/website/Contact.jsx":"92199d817ed9","ui_kits/website/Hero.jsx":"5a80050c27bd","ui_kits/website/Sections.jsx":"6ebb5980b11d","ui_kits/website/SiteHeader.jsx":"7028278cee9b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DVMedKingDesignSystem_bf17f8 = window.DVMedKingDesignSystem_bf17f8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DV MedKing primary action. Pill-shaped, Montserrat label.
 * Variants: primary (green), accent (yellow CTA), secondary (outline),
 * ghost, onBrand (white pill for use on green surfaces).
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '8px 18px',
      fontSize: 13,
      height: 36,
      gap: 8
    },
    md: {
      padding: '12px 26px',
      fontSize: 15,
      height: 46,
      gap: 9
    },
    lg: {
      padding: '15px 34px',
      fontSize: 17,
      height: 56,
      gap: 10
    }
  };
  const variants = {
    primary: {
      background: 'var(--dv-green)',
      color: 'var(--dv-white)',
      border: '2px solid transparent',
      boxShadow: 'var(--shadow-sm)'
    },
    accent: {
      background: 'var(--dv-yellow)',
      color: 'var(--dv-green)',
      border: '2px solid transparent',
      boxShadow: 'var(--shadow-accent)'
    },
    secondary: {
      background: 'var(--dv-white)',
      color: 'var(--dv-green)',
      border: '2px solid var(--dv-green)',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--dv-green)',
      border: '2px solid transparent',
      boxShadow: 'none'
    },
    onBrand: {
      background: 'var(--dv-white)',
      color: 'var(--dv-green)',
      border: '2px solid transparent',
      boxShadow: 'var(--shadow-sm)'
    }
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    className: "dv-button",
    "data-variant": variant,
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: s.padding,
      minHeight: s.height,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: s.fontSize,
      lineHeight: 1,
      letterSpacing: '0.01em',
      borderRadius: 'var(--radius-pill)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.filter = 'none';
    },
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.filter = 'brightness(1.06)';
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex'
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/IconBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DV MedKing icon badge — a fully-round yellow disc with a centered glyph.
 * Signature brand motif. Pass a Lucide/SVG icon (or short glyph) as children.
 * On green surfaces it stays yellow; on white it is the one place yellow is
 * allowed as a fill (never as text).
 */
function IconBadge({
  children,
  size = 'md',
  tone = 'yellow',
  style,
  ...rest
}) {
  const sizes = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 88
  };
  const px = sizes[size] || sizes.md;
  const tones = {
    yellow: {
      background: 'var(--dv-yellow)',
      color: 'var(--dv-green)'
    },
    green: {
      background: 'var(--dv-green)',
      color: 'var(--dv-white)'
    },
    soft: {
      background: 'var(--dv-green-100)',
      color: 'var(--dv-green)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--dv-green)',
      boxShadow: 'inset 0 0 0 2px var(--dv-green)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "dv-icon-badge",
    "data-tone": tone,
    style: {
      width: px,
      height: px,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-round)',
      flex: 'none',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: px * 0.42,
      ...(tones[tone] || tones.yellow),
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/IconBadge.jsx", error: String((e && e.message) || e) }); }

// components/brand/NumberMarker.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Large numeral motif (01 / 02 / 03) for step lists, value props and section
 * markers. Renders a Montserrat-black numeral; `tone` controls contrast.
 */
function NumberMarker({
  value,
  tone = 'soft',
  size = 'lg',
  style,
  ...rest
}) {
  const sizes = {
    md: 64,
    lg: 96,
    xl: 128
  };
  const px = sizes[size] || sizes.lg;
  const tones = {
    soft: 'var(--dv-green-100)',
    green: 'var(--dv-green)',
    bright: 'var(--dv-green-bright)',
    yellow: 'var(--dv-yellow)',
    outline: 'transparent'
  };
  const label = typeof value === 'number' ? String(value).padStart(2, '0') : value;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "dv-numeral",
    "data-tone": tone,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: px,
      lineHeight: 0.8,
      letterSpacing: '-0.03em',
      color: tones[tone] || tones.soft,
      WebkitTextStroke: tone === 'outline' ? '2px var(--dv-green-300)' : undefined,
      display: 'inline-block',
      ...style
    }
  }, rest), label);
}
Object.assign(__ds_scope, { NumberMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/NumberMarker.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Compact status/label pill. Use `tone` for semantic meaning. `dot` adds a
 * leading status dot. Renders in Public Sans, uppercase optional via `caps`.
 */
function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  caps = false,
  style,
  ...rest
}) {
  const palette = {
    neutral: {
      soft: ['var(--dv-mist)', 'var(--dv-ink-soft)'],
      solid: ['var(--dv-ink-soft)', '#fff'],
      line: ['var(--dv-ink-soft)']
    },
    brand: {
      soft: ['var(--dv-green-100)', 'var(--dv-green)'],
      solid: ['var(--dv-green)', '#fff'],
      line: ['var(--dv-green)']
    },
    success: {
      soft: ['var(--dv-success-soft)', 'var(--dv-green-bright)'],
      solid: ['var(--dv-green-bright)', '#fff'],
      line: ['var(--dv-green-bright)']
    },
    warning: {
      soft: ['var(--dv-warning-soft)', 'var(--dv-warning)'],
      solid: ['var(--dv-warning)', 'var(--dv-green-900)'],
      line: ['var(--dv-warning)']
    },
    danger: {
      soft: ['var(--dv-danger-soft)', 'var(--dv-danger)'],
      solid: ['var(--dv-danger)', '#fff'],
      line: ['var(--dv-danger)']
    },
    accent: {
      soft: ['var(--dv-yellow-100)', 'var(--dv-green)'],
      solid: ['var(--dv-yellow)', 'var(--dv-green)'],
      line: ['var(--dv-yellow-600)']
    }
  };
  const p = palette[tone] || palette.neutral;
  let bg, fg, bd;
  if (variant === 'solid') {
    [bg, fg] = p.solid;
    bd = 'transparent';
  } else if (variant === 'outline') {
    bg = 'transparent';
    fg = p.line[0];
    bd = p.line[0];
  } else {
    [bg, fg] = p.soft;
    bd = 'transparent';
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "dv-badge",
    "data-tone": tone,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 11px',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 12.5,
      lineHeight: 1.4,
      letterSpacing: caps ? '0.06em' : 0,
      textTransform: caps ? 'uppercase' : 'none',
      color: fg,
      background: bg,
      border: `1.5px solid ${bd}`,
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: fg,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * DV MedKing surface card — 18px radius, soft green-tinted shadow.
 * `interactive` adds a lift on hover. Use `accentBar` for a top yellow rule.
 */
function Card({
  children,
  variant = 'default',
  interactive = false,
  accentBar = false,
  padding = 24,
  style,
  ...rest
}) {
  const variants = {
    default: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid var(--border-default)'
    },
    flat: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      boxShadow: 'none',
      border: '1px solid var(--border-default)'
    },
    subtle: {
      background: 'var(--surface-subtle)',
      color: 'var(--text-body)',
      boxShadow: 'none',
      border: '1px solid transparent'
    },
    brand: {
      background: 'var(--surface-brand)',
      color: 'var(--text-on-brand)',
      boxShadow: 'var(--shadow-card)',
      border: '1px solid transparent'
    }
  };
  const v = variants[variant] || variants.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "dv-card",
    "data-variant": variant,
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-card)',
      padding,
      overflow: 'hidden',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...v,
      ...style
    },
    onMouseEnter: e => {
      if (!interactive) return;
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    },
    onMouseLeave: e => {
      if (!interactive) return;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = v.boxShadow;
    }
  }, rest), accentBar && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 5,
      background: 'var(--dv-yellow)'
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Card.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Metric / KPI block. Big Montserrat value, optional label, delta and icon
 * badge. Use `onBrand` when placed on a green surface.
 */
function StatCard({
  value,
  label,
  sublabel,
  icon,
  delta,
  deltaDirection = 'up',
  onBrand = false,
  style,
  ...rest
}) {
  const fg = onBrand ? 'var(--dv-white)' : 'var(--dv-green)';
  const muted = onBrand ? 'rgba(255,255,255,0.78)' : 'var(--dv-ink-soft)';
  const deltaColor = deltaDirection === 'down' ? onBrand ? '#FFC9C2' : 'var(--dv-danger)' : onBrand ? 'var(--dv-yellow)' : 'var(--dv-green-bright)';
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "dv-statcard",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    className: "dv-icon-badge",
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: 'var(--dv-yellow)',
      color: 'var(--dv-green)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 40,
      lineHeight: 1,
      letterSpacing: '-0.02em',
      color: fg
    }
  }, value), label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 15,
      color: onBrand ? 'var(--dv-white)' : 'var(--dv-ink)'
    }
  }, label), sublabel && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13.5,
      color: muted
    }
  }, sublabel), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 13.5,
      color: deltaColor,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, deltaDirection === 'down' ? '▾' : '▴'), delta));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Inline alert / callout banner. Tone sets the accent stripe + soft fill.
 * Optional icon, title and dismiss action.
 */
function Alert({
  children,
  title,
  tone = 'info',
  icon,
  onDismiss,
  style,
  ...rest
}) {
  const tones = {
    info: {
      bar: 'var(--dv-green-bright)',
      fill: 'var(--dv-green-50)',
      fg: 'var(--dv-green)'
    },
    success: {
      bar: 'var(--dv-green-bright)',
      fill: 'var(--dv-success-soft)',
      fg: 'var(--dv-green)'
    },
    warning: {
      bar: 'var(--dv-yellow)',
      fill: 'var(--dv-warning-soft)',
      fg: 'var(--dv-green-900)'
    },
    danger: {
      bar: 'var(--dv-danger)',
      fill: 'var(--dv-danger-soft)',
      fg: 'var(--dv-danger)'
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: "dv-alert",
    "data-tone": tone,
    style: {
      position: 'relative',
      display: 'flex',
      gap: 14,
      padding: '16px 18px 16px 20px',
      background: t.fill,
      borderRadius: 'var(--radius-md)',
      borderLeft: `5px solid ${t.bar}`,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      width: 36,
      height: 36,
      borderRadius: '50%',
      background: tone === 'warning' ? 'var(--dv-yellow)' : t.bar,
      color: tone === 'warning' ? 'var(--dv-green)' : '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15.5,
      color: t.fg,
      marginBottom: 3
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      color: 'var(--dv-ink)',
      lineHeight: 1.5
    }
  }, children)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "\u0110\xF3ng",
    style: {
      flex: 'none',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--dv-ink-soft)',
      fontSize: 18,
      lineHeight: 1,
      padding: 2
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Checkbox with label. Checked state fills green with a white tick.
 * Controlled (`checked`) or uncontrolled (`defaultChecked`).
 */
function Checkbox({
  checked,
  defaultChecked = false,
  disabled = false,
  label,
  id,
  onChange,
  style,
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const boxId = id || `dv-cb-${Math.random().toString(36).slice(2, 8)}`;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: boxId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: boxId,
    type: "button",
    role: "checkbox",
    "aria-checked": on,
    onClick: toggle,
    disabled: disabled,
    style: {
      width: 22,
      height: 22,
      flex: 'none',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-xs)',
      border: on ? '1.5px solid var(--dv-green)' : '1.5px solid var(--border-strong)',
      background: on ? 'var(--dv-green)' : 'var(--dv-white)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)'
    }
  }, rest), on && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--dv-ink)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input with label, helper/error text and optional leading/trailing
 * adornments. Rounded (radius-sm), green focus ring.
 */
function Input({
  label,
  placeholder,
  value,
  defaultValue,
  type = 'text',
  helperText,
  error,
  disabled = false,
  required = false,
  iconLeft,
  iconRight,
  id,
  onChange,
  style,
  ...rest
}) {
  const inputId = id || `dv-input-${Math.random().toString(36).slice(2, 8)}`;
  const [focused, setFocused] = React.useState(false);
  const borderColor = error ? 'var(--dv-danger)' : focused ? 'var(--dv-green-bright)' : 'var(--border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--dv-ink)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--dv-danger)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 14px',
      minHeight: 46,
      background: disabled ? 'var(--dv-mist)' : 'var(--dv-white)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focused && !error ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--dv-ink-faint)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--dv-ink)',
      minWidth: 0
    }
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--dv-ink-faint)'
    }
  }, iconRight)), (helperText || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: error ? 'var(--dv-danger)' : 'var(--dv-ink-soft)'
    }
  }, error || helperText));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Toggle switch. Track turns green when on; pill knob slides. Controlled via
 * `checked` + `onChange`, or uncontrolled with `defaultChecked`.
 */
function Switch({
  checked,
  defaultChecked = false,
  disabled = false,
  label,
  id,
  onChange,
  style,
  ...rest
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const switchId = id || `dv-switch-${Math.random().toString(36).slice(2, 8)}`;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: switchId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: switchId,
    type: "button",
    role: "switch",
    "aria-checked": on,
    onClick: toggle,
    disabled: disabled,
    style: {
      position: 'relative',
      width: 46,
      height: 27,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      padding: 0,
      background: on ? 'var(--dv-green-bright)' : 'var(--dv-line-strong)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 22 : 3,
      width: 21,
      height: 21,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--dv-ink)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tab navigation. Controlled via `value` + `onChange`, or uncontrolled with
 * `defaultValue`. `variant` pill = filled pill switcher; underline = classic.
 * `items`: [{ value, label, icon?, badge? }].
 */
function Tabs({
  items = [],
  value,
  defaultValue,
  variant = 'underline',
  onChange,
  style,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? (items[0] && items[0].value));
  const active = isControlled ? value : internal;
  const select = v => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  if (variant === 'pill') {
    return /*#__PURE__*/React.createElement("div", _extends({
      role: "tablist",
      style: {
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        background: 'var(--dv-mist)',
        borderRadius: 'var(--radius-pill)',
        ...style
      }
    }, rest), items.map(it => {
      const on = it.value === active;
      return /*#__PURE__*/React.createElement("button", {
        key: it.value,
        role: "tab",
        "aria-selected": on,
        onClick: () => select(it.value),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '9px 18px',
          border: 'none',
          cursor: 'pointer',
          borderRadius: 'var(--radius-pill)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 14,
          background: on ? 'var(--dv-green)' : 'transparent',
          color: on ? '#fff' : 'var(--dv-ink-soft)',
          boxShadow: on ? 'var(--shadow-sm)' : 'none',
          transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)'
        }
      }, it.icon && /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex'
        }
      }, it.icon), it.label);
    }));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 28,
      borderBottom: '2px solid var(--border-default)',
      ...style
    }
  }, rest), items.map(it => {
    const on = it.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      role: "tab",
      "aria-selected": on,
      onClick: () => select(it.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '0 2px 12px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 15,
        color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)',
        boxShadow: on ? 'inset 0 -3px 0 var(--dv-yellow)' : 'none',
        marginBottom: -2,
        transition: 'color var(--dur-fast) var(--ease-out)'
      }
    }, it.icon && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex'
      }
    }, it.icon), it.label, it.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 12,
        padding: '1px 8px',
        borderRadius: 'var(--radius-pill)',
        background: on ? 'var(--dv-green-100)' : 'var(--dv-mist)',
        color: on ? 'var(--dv-green)' : 'var(--dv-ink-soft)'
      }
    }, it.badge));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/icons.jsx
try { (() => {
/* Lucide-style outline icons (2.2px stroke) shared across the DV MedKing kits.
   Exported to window so sibling babel scripts can use them. */

const Svg = ({
  size = 22,
  children,
  stroke = 2.2
}) => /*#__PURE__*/React.createElement("svg", {
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: stroke,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, children);
const IconZap = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("polyline", {
  points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
}));
const IconShield = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
}));
const IconCheckCircle = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "22 4 12 14.01 9 11.01"
}));
const IconTruck = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M1 3h15v13H1z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 8h4l3 3v5h-7z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "5.5",
  cy: "18.5",
  r: "2.5"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "18.5",
  cy: "18.5",
  r: "2.5"
}));
const IconPill = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7z"
}), /*#__PURE__*/React.createElement("path", {
  d: "m8.5 8.5 7 7"
}));
const IconPackage = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M16.5 9.4 7.5 4.21"
}), /*#__PURE__*/React.createElement("path", {
  d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "3.27 6.96 12 12.01 20.73 6.96"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "22.08",
  x2: "12",
  y2: "12"
}));
const IconClock = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 6 12 12 16 14"
}));
const IconAward = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "8",
  r: "6"
}), /*#__PURE__*/React.createElement("path", {
  d: "M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"
}));
const IconSearch = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "11",
  cy: "11",
  r: "8"
}), /*#__PURE__*/React.createElement("line", {
  x1: "21",
  y1: "21",
  x2: "16.65",
  y2: "16.65"
}));
const IconCart = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("circle", {
  cx: "9",
  cy: "21",
  r: "1"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "20",
  cy: "21",
  r: "1"
}), /*#__PURE__*/React.createElement("path", {
  d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
}));
const IconArrowRight = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 5 19 12 12 19"
}));
const IconPhone = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
}));
const IconMapPin = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
const IconFile = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "14 2 14 8 20 8"
}));
const IconHome = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "9 22 9 12 15 12 15 22"
}));
const IconGrid = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "3",
  width: "7",
  height: "7"
}), /*#__PURE__*/React.createElement("rect", {
  x: "14",
  y: "3",
  width: "7",
  height: "7"
}), /*#__PURE__*/React.createElement("rect", {
  x: "14",
  y: "14",
  width: "7",
  height: "7"
}), /*#__PURE__*/React.createElement("rect", {
  x: "3",
  y: "14",
  width: "7",
  height: "7"
}));
const IconBell = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M13.73 21a2 2 0 0 1-3.46 0"
}));
const IconUser = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "7",
  r: "4"
}));
const IconPlus = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "5",
  x2: "12",
  y2: "19"
}), /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const IconMinus = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("line", {
  x1: "5",
  y1: "12",
  x2: "19",
  y2: "12"
}));
const IconChart = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("line", {
  x1: "18",
  y1: "20",
  x2: "18",
  y2: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  y1: "20",
  x2: "12",
  y2: "4"
}), /*#__PURE__*/React.createElement("line", {
  x1: "6",
  y1: "20",
  x2: "6",
  y2: "14"
}));
const IconThermometer = p => /*#__PURE__*/React.createElement(Svg, p, /*#__PURE__*/React.createElement("path", {
  d: "M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"
}));
Object.assign(window, {
  IconZap,
  IconShield,
  IconCheckCircle,
  IconTruck,
  IconPill,
  IconPackage,
  IconClock,
  IconAward,
  IconSearch,
  IconCart,
  IconArrowRight,
  IconPhone,
  IconMapPin,
  IconFile,
  IconHome,
  IconGrid,
  IconBell,
  IconUser,
  IconPlus,
  IconMinus,
  IconChart,
  IconThermometer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Cart.jsx
try { (() => {
/* DV Connect — cart drawer + order success */
function CartDrawer({
  open,
  onClose,
  items,
  setItems
}) {
  const {
    Button,
    Alert,
    IconBadge
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconMinus,
    IconPlus,
    IconCart
  } = window;
  const cur = window.dvCurrency;
  const [placed, setPlaced] = React.useState(false);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const ship = subtotal > 0 && subtotal < 2000000 ? 30000 : 0;
  const total = subtotal + ship;
  const setQty = (id, d) => setItems(prev => prev.map(it => it.id === id ? {
    ...it,
    qty: Math.max(0, it.qty + d)
  } : it).filter(it => it.qty > 0));
  return /*#__PURE__*/React.createElement(React.Fragment, null, open && /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,51,40,.4)',
      zIndex: 40
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: 400,
      zIndex: 50,
      background: '#fff',
      boxShadow: 'var(--shadow-lg)',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform var(--dur-base) var(--ease-out)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 22px',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      fontWeight: 800,
      margin: 0,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconCart, {
    size: 20
  }), " Gi\u1ECF h\xE0ng"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      border: 'none',
      background: 'transparent',
      fontSize: 24,
      cursor: 'pointer',
      color: 'var(--dv-ink-soft)',
      lineHeight: 1
    }
  }, "\xD7")), placed ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      padding: 30,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    size: "xl"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 23,
      margin: '6px 0 0'
    }
  }, "\u0110\u1EB7t h\xE0ng th\xE0nh c\xF4ng!"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--dv-ink-soft)',
      margin: 0
    }
  }, "\u0110\u01A1n ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--dv-green)'
    }
  }, "#DV-1043"), " \u0111\xE3 \u0111\u01B0\u1EE3c ti\u1EBFp nh\u1EADn. Giao trong 24h."), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: () => {
      setPlaced(false);
      setItems([]);
      onClose();
    }
  }, "Ti\u1EBFp t\u1EE5c mua h\xE0ng")) : items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      color: 'var(--dv-ink-faint)'
    }
  }, /*#__PURE__*/React.createElement(IconCart, {
    size: 48
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)'
    }
  }, "Gi\u1ECF h\xE0ng \u0111ang tr\u1ED1ng")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14.5
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12.5,
      color: 'var(--dv-ink-faint)'
    }
  }, cur(it.price), " \xB7 ", it.maker)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(it.id, -1),
    style: qtyBtn
  }, /*#__PURE__*/React.createElement(IconMinus, {
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      minWidth: 18,
      textAlign: 'center'
    }
  }, it.qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(it.id, 1),
    style: qtyBtn
  }, /*#__PURE__*/React.createElement(IconPlus, {
    size: 14
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 22px 22px',
      borderTop: '1px solid var(--border-default)'
    }
  }, ship > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info"
  }, "Th\xEAm ", cur(2000000 - subtotal), " \u0111\u1EC3 \u0111\u01B0\u1EE3c ", /*#__PURE__*/React.createElement("strong", null, "mi\u1EC5n ph\xED giao h\xE0ng"), ".")), /*#__PURE__*/React.createElement(Row, {
    label: "T\u1EA1m t\xEDnh",
    value: cur(subtotal)
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Ph\xED giao h\xE0ng",
    value: ship === 0 ? 'Miễn phí' : cur(ship)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      margin: '10px 0 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 16
    }
  }, "T\u1ED5ng c\u1ED9ng"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 24,
      color: 'var(--dv-green)'
    }
  }, cur(total))), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    fullWidth: true,
    onClick: () => setPlaced(true)
  }, "X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng")))));
}
const qtyBtn = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '1.5px solid var(--border-strong)',
  background: '#fff',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--dv-green)'
};
function Row({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--dv-ink-soft)',
      padding: '3px 0'
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: 'var(--dv-ink)'
    }
  }, value));
}
window.CartDrawer = CartDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Catalogue.jsx
try { (() => {
/* DV Connect — catalogue grid + add to cart */
function Catalogue({
  query,
  addToCart
}) {
  const {
    Card,
    Badge,
    Button,
    Tabs
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconPlus,
    IconThermometer
  } = window;
  const cur = window.dvCurrency;
  const [cat, setCat] = React.useState('all');
  const products = window.DV_PRODUCTS;
  const stockMap = {
    in: ['success', 'Còn hàng'],
    low: ['warning', 'Sắp hết'],
    cold: ['brand', 'Kho lạnh']
  };
  const tagTone = {
    Rx: 'danger',
    OTC: 'success',
    TPCN: 'accent',
    VTYT: 'neutral'
  };
  const filtered = products.filter(p => (cat === 'all' || p.cat === cat) && (!query || (p.name + p.maker).toLowerCase().includes(query.toLowerCase())));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: cat,
    onChange: setCat,
    items: [{
      value: 'all',
      label: 'Tất cả',
      badge: products.length
    }, {
      value: 'rx',
      label: 'Thuốc kê đơn'
    }, {
      value: 'otc',
      label: 'Không kê đơn'
    }, {
      value: 'tpcn',
      label: 'TPCN'
    }, {
      value: 'vtyt',
      label: 'Vật tư y tế'
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16
    }
  }, filtered.map(p => {
    const [stone, slabel] = stockMap[p.stock];
    return /*#__PURE__*/React.createElement(Card, {
      key: p.id,
      padding: 20,
      interactive: true,
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--dv-green-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--dv-green)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 18
      }
    }, p.maker.slice(0, 2).toUpperCase()), /*#__PURE__*/React.createElement(Badge, {
      tone: tagTone[p.tag],
      variant: "soft",
      caps: true
    }, p.tag)), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 17,
        fontWeight: 800,
        margin: '0 0 4px',
        lineHeight: 1.25
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--dv-ink-faint)',
        marginBottom: 2
      }
    }, p.maker), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--dv-ink-soft)',
        marginBottom: 14
      }
    }, p.unit), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: stone,
      dot: true
    }, p.stock === 'cold' ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(IconThermometer, {
      size: 13
    }), " ", slabel) : slabel)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: 20,
        color: 'var(--dv-green)'
      }
    }, cur(p.price)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'var(--dv-ink-faint)'
      }
    }, "gi\xE1 s\u1EC9 / \u0111\u01A1n v\u1ECB")), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(IconPlus, {
        size: 16
      }),
      onClick: () => addToCart(p)
    }, "Th\xEAm")));
  })), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 60,
      color: 'var(--dv-ink-faint)',
      fontFamily: 'var(--font-body)'
    }
  }, "Kh\xF4ng t\xECm th\u1EA5y s\u1EA3n ph\u1EA9m ph\xF9 h\u1EE3p."));
}
window.Catalogue = Catalogue;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Catalogue.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Dashboard.jsx
try { (() => {
/* DV Connect — dashboard view */
function Dashboard({
  setView
}) {
  const {
    Card,
    StatCard,
    Badge,
    Button,
    IconBadge
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconPackage,
    IconFile,
    IconTruck,
    IconArrowRight
  } = window;
  const cur = window.dvCurrency;
  const comp = window.dvCompact;
  const orders = window.DV_ORDERS;
  const statusMap = {
    shipping: ['warning', 'Đang giao'],
    done: ['success', 'Hoàn tất']
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 26,
      fontWeight: 900,
      margin: '0 0 4px'
    }
  }, "Ch\xE0o bu\u1ED5i s\xE1ng, Nh\xE0 thu\u1ED1c An Khang \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--dv-ink-soft)',
      margin: 0
    }
  }, "T\u1ED5ng quan ho\u1EA1t \u0111\u1ED9ng mua h\xE0ng th\xE1ng 6/2026.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 22
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: /*#__PURE__*/React.createElement(IconPackage, {
      size: 20
    }),
    value: "44",
    label: "\u0110\u01A1n trong th\xE1ng",
    delta: "12%",
    deltaDirection: "up"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 22
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: /*#__PURE__*/React.createElement(IconTruck, {
      size: 20
    }),
    value: "2",
    label: "\u0110ang v\u1EADn chuy\u1EC3n"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 22,
    variant: "brand"
  }, /*#__PURE__*/React.createElement(StatCard, {
    onBrand: true,
    icon: /*#__PURE__*/React.createElement(IconFile, {
      size: 20
    }),
    value: comp(8240000),
    label: "C\xF4ng n\u1EE3 hi\u1EC7n t\u1EA1i",
    sublabel: "H\u1EA1n m\u1EE9c 30.000.000\u20AB"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 22
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: comp(46500000),
    label: "Chi ti\xEAu th\xE1ng",
    delta: "8%",
    deltaDirection: "up"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 24px 14px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      margin: 0
    }
  }, "\u0110\u01A1n h\xE0ng g\u1EA7n \u0111\xE2y"), /*#__PURE__*/React.createElement("a", {
    onClick: () => setView('orders'),
    style: {
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: 14,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, "T\u1EA5t c\u1EA3 ", /*#__PURE__*/React.createElement(IconArrowRight, {
    size: 15
  }))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      textAlign: 'left',
      color: 'var(--dv-ink-faint)',
      fontSize: 12.5
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      fontWeight: 600,
      padding: '8px 24px'
    }
  }, "M\xE3 \u0111\u01A1n"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontWeight: 600,
      padding: '8px 0'
    }
  }, "Ng\xE0y"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontWeight: 600,
      padding: '8px 0'
    }
  }, "SP"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontWeight: 600,
      padding: '8px 0'
    }
  }, "Gi\xE1 tr\u1ECB"), /*#__PURE__*/React.createElement("th", {
    style: {
      fontWeight: 600,
      padding: '8px 24px'
    }
  }, "Tr\u1EA1ng th\xE1i"))), /*#__PURE__*/React.createElement("tbody", null, orders.map(o => {
    const [tone, label] = statusMap[o.status];
    return /*#__PURE__*/React.createElement("tr", {
      key: o.id,
      style: {
        borderTop: '1px solid var(--border-default)'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 24px',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--dv-green)'
      }
    }, o.id), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 0',
        color: 'var(--dv-ink-soft)'
      }
    }, o.date), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 0',
        color: 'var(--dv-ink-soft)'
      }
    }, o.items), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 0',
        fontWeight: 600
      }
    }, cur(o.total)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: '13px 24px'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      dot: true
    }, label)));
  })))), /*#__PURE__*/React.createElement(Card, {
    padding: 24,
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    size: "lg",
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(IconPackage, {
    size: 26
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      fontWeight: 800,
      margin: '0 0 8px'
    }
  }, "\u0110\u1EB7t l\u1EA1i nhanh"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      color: 'var(--dv-ink-soft)',
      margin: '0 0 18px',
      lineHeight: 1.55
    }
  }, "T\u1EA1o \u0111\u01A1n m\u1EDBi t\u1EEB danh m\u1EE5c thu\u1ED1c th\u01B0\u1EDDng mua c\u1EE7a nh\xE0 thu\u1ED1c b\u1EA1n ch\u1EC9 trong v\xE0i thao t\xE1c."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    iconRight: /*#__PURE__*/React.createElement(IconArrowRight, {
      size: 18
    }),
    onClick: () => setView('catalogue'),
    style: {
      marginTop: 'auto'
    }
  }, "M\u1EDF danh m\u1EE5c thu\u1ED1c"))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/Shell.jsx
try { (() => {
/* DV Connect — app shell: green sidebar + white topbar */
function Sidebar({
  view,
  setView
}) {
  const {
    IconHome,
    IconGrid,
    IconPackage,
    IconFile,
    IconChart
  } = window;
  const items = [['dashboard', 'Tổng quan', /*#__PURE__*/React.createElement(IconHome, {
    size: 20
  })], ['catalogue', 'Danh mục thuốc', /*#__PURE__*/React.createElement(IconGrid, {
    size: 20
  })], ['orders', 'Đơn hàng', /*#__PURE__*/React.createElement(IconPackage, {
    size: 20
  })], ['debt', 'Công nợ', /*#__PURE__*/React.createElement(IconFile, {
    size: 20
  })], ['report', 'Báo cáo', /*#__PURE__*/React.createElement(IconChart, {
    size: 20
  })]];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 252,
      flex: 'none',
      background: 'var(--dv-green)',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 16px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-horizontal-yellow.png",
    alt: "DV Connect",
    style: {
      height: 34,
      marginLeft: 6,
      marginBottom: 28
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, items.map(([k, label, icon]) => {
    const on = view === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => setView(k),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '12px 14px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 15,
        background: on ? 'rgba(255,255,255,.12)' : 'transparent',
        color: on ? '#fff' : 'rgba(255,255,255,.78)',
        boxShadow: on ? 'inset 3px 0 0 var(--dv-yellow)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: on ? 'var(--dv-yellow)' : 'rgba(255,255,255,.7)',
        display: 'inline-flex'
      }
    }, icon), label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      background: 'rgba(255,255,255,.08)',
      borderRadius: 'var(--radius-md)',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 14,
      color: 'var(--dv-yellow)'
    }
  }, "Hotline \u0111\u1EB7t h\xE0ng"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 20,
      marginTop: 4
    }
  }, "1800 6789"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: 'rgba(255,255,255,.7)',
      marginTop: 2
    }
  }, "7:30 \u2013 21:00 m\u1ED7i ng\xE0y")));
}
window.Sidebar = Sidebar;
function Topbar({
  title,
  cartCount,
  onCart,
  query,
  setQuery
}) {
  const {
    IconSearch,
    IconBell,
    IconCart,
    IconUser
  } = window;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 72,
      flex: 'none',
      background: '#fff',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '0 28px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      margin: 0
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 18,
      flex: 1,
      maxWidth: 420,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--dv-mist)',
      borderRadius: 'var(--radius-pill)',
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--dv-ink-faint)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(IconSearch, {
    size: 18
  })), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "T\xECm thu\u1ED1c, ho\u1EA1t ch\u1EA5t, nh\xE0 s\u1EA3n xu\u1EA5t\u2026",
    style: {
      border: 'none',
      outline: 'none',
      background: 'transparent',
      flex: 1,
      fontFamily: 'var(--font-body)',
      fontSize: 14.5,
      color: 'var(--dv-ink)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      position: 'relative',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'var(--dv-ink-soft)',
      padding: 6
    }
  }, /*#__PURE__*/React.createElement(IconBell, {
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--dv-danger)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onCart,
    style: {
      position: 'relative',
      border: 'none',
      background: 'var(--dv-green-50)',
      cursor: 'pointer',
      color: 'var(--dv-green)',
      padding: 10,
      borderRadius: 'var(--radius-sm)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement(IconCart, {
    size: 20
  }), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -6,
      right: -6,
      minWidth: 19,
      height: 19,
      padding: '0 5px',
      borderRadius: 999,
      background: 'var(--dv-yellow)',
      color: 'var(--dv-green)',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 11.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, cartCount)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingLeft: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--dv-green)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(IconUser, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 14
    }
  }, "NT An Khang"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--dv-ink-faint)'
    }
  }, "\u0110\u1ED1i t\xE1c \xB7 Q.1")))));
}
window.Topbar = Topbar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/data.jsx
try { (() => {
/* DV Connect — sample catalogue data (shared via window) */
window.DV_PRODUCTS = [{
  id: 'p1',
  name: 'Paracetamol 500mg',
  maker: 'Stella',
  cat: 'otc',
  unit: 'Hộp 10 vỉ x 10 viên',
  price: 42000,
  stock: 'in',
  tag: 'OTC'
}, {
  id: 'p2',
  name: 'Amoxicillin 500mg',
  maker: 'Imexpharm',
  cat: 'rx',
  unit: 'Hộp 10 vỉ x 10 viên',
  price: 78000,
  stock: 'in',
  tag: 'Rx'
}, {
  id: 'p3',
  name: 'Vitamin C 1000mg',
  maker: 'DHG Pharma',
  cat: 'tpcn',
  unit: 'Tuýp 20 viên sủi',
  price: 36000,
  stock: 'low',
  tag: 'TPCN'
}, {
  id: 'p4',
  name: 'Omeprazole 20mg',
  maker: 'Savipharm',
  cat: 'rx',
  unit: 'Hộp 3 vỉ x 10 viên',
  price: 95000,
  stock: 'in',
  tag: 'Rx'
}, {
  id: 'p5',
  name: 'Oresol hương cam',
  maker: 'Bidiphar',
  cat: 'otc',
  unit: 'Hộp 20 gói',
  price: 54000,
  stock: 'in',
  tag: 'OTC'
}, {
  id: 'p6',
  name: 'Khẩu trang y tế 4 lớp',
  maker: 'Nam Anh',
  cat: 'vtyt',
  unit: 'Thùng 50 hộp',
  price: 480000,
  stock: 'in',
  tag: 'VTYT'
}, {
  id: 'p7',
  name: 'Cetirizine 10mg',
  maker: 'Domesco',
  cat: 'otc',
  unit: 'Hộp 10 vỉ x 10 viên',
  price: 48000,
  stock: 'low',
  tag: 'OTC'
}, {
  id: 'p8',
  name: 'Insulin Mixtard 100IU',
  maker: 'Novo Nordisk',
  cat: 'rx',
  unit: 'Hộp 1 lọ 10ml',
  price: 165000,
  stock: 'cold',
  tag: 'Rx'
}];
window.DV_ORDERS = [{
  id: 'DV-1042',
  date: '06/06',
  items: 12,
  total: 2840000,
  status: 'shipping'
}, {
  id: 'DV-1038',
  date: '04/06',
  items: 7,
  total: 1260000,
  status: 'done'
}, {
  id: 'DV-1031',
  date: '01/06',
  items: 21,
  total: 4180000,
  status: 'done'
}, {
  id: 'DV-1025',
  date: '28/05',
  items: 4,
  total: 540000,
  status: 'done'
}];
window.dvCurrency = n => n.toLocaleString('vi-VN') + '₫';
window.dvCompact = n => {
  const m = n / 1e6;
  const s = (Math.round(m * 100) / 100).toString().replace('.', ',');
  return s + ' tr₫';
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
/* DV MedKing website — partner CTA band + footer */
function ContactCTA({
  formRef
}) {
  const {
    Card,
    Button,
    Input,
    Checkbox,
    IconBadge
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconAward
  } = window;
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    ref: formRef,
    style: {
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '88px 32px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "brand",
    padding: 0,
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 44px'
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    size: "lg",
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(IconAward, {
    size: 28
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 34,
      fontWeight: 900,
      color: '#fff',
      margin: '0 0 14px',
      letterSpacing: '-0.02em'
    }
  }, "Tr\u1EDF th\xE0nh \u0111\u1ED1i t\xE1c ph\xE2n ph\u1ED1i"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,.85)',
      margin: 0
    }
  }, "\u0110\u1EC3 l\u1EA1i th\xF4ng tin, \u0111\u1ED9i ng\u0169 D\u01B0\u1EE3c V\u01B0\u01A1ng s\u1EBD li\xEAn h\u1EC7 t\u01B0 v\u1EA5n b\u1EA3ng gi\xE1 s\u1EC9 v\xE0 ch\xEDnh s\xE1ch c\xF4ng n\u1EE3 trong v\xF2ng 24 gi\u1EDD."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: 'flex',
      gap: 26,
      fontFamily: 'var(--font-display)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      color: 'var(--dv-yellow)'
    }
  }, "0\u20AB"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,.8)'
    }
  }, "Ph\xED m\u1EDF t\xE0i kho\u1EA3n")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      color: 'var(--dv-yellow)'
    }
  }, "30 ng\xE0y"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,.8)'
    }
  }, "C\xF4ng n\u1EE3 linh ho\u1EA1t")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      margin: 10,
      borderRadius: 'var(--radius-md)',
      padding: '32px 30px'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    size: "lg"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      margin: '6px 0 0'
    }
  }, "\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u!"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--dv-ink-soft)',
      margin: 0
    }
  }, "Ch\xFAng t\xF4i s\u1EBD li\xEAn h\u1EC7 trong 24h.")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "T\xEAn nh\xE0 thu\u1ED1c / ph\xF2ng kh\xE1m",
    placeholder: "Nh\xE0 thu\u1ED1c An Khang"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
    placeholder: "09xx xxx xxx"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Khu v\u1EF1c",
    placeholder: "TP. H\u1ED3 Ch\xED Minh"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    defaultChecked: true,
    label: "T\xF4i \u0111\u1ED3ng \xFD nh\u1EADn t\u01B0 v\u1EA5n t\u1EEB D\u01B0\u1EE3c V\u01B0\u01A1ng"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    fullWidth: true,
    onClick: () => setSent(true)
  }, "G\u1EEDi y\xEAu c\u1EA7u b\xE1o gi\xE1")))))));
}
window.ContactCTA = ContactCTA;
function SiteFooter() {
  const cols = [['Sản phẩm', ['Thuốc kê đơn', 'Thuốc không kê đơn', 'Thực phẩm chức năng', 'Vật tư y tế']], ['Công ty', ['Về Dược Vương', 'Quy trình GSP', 'Tuyển dụng', 'Tin tức']], ['Hỗ trợ', ['Trở thành đối tác', 'Chính sách công nợ', 'Vận chuyển', 'Liên hệ']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--dv-green-900)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '56px 32px 32px',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-horizontal-yellow.png",
    alt: "DV MedKing",
    style: {
      height: 40,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,.7)',
      margin: 0,
      maxWidth: '34ch'
    }
  }, "C\xF4ng ty C\u1ED5 ph\u1EA7n Th\u01B0\u01A1ng M\u1EA1i D\u01B0\u1EE3c V\u01B0\u01A1ng \u2014 chu\u1ED7i cung \u1EE9ng & ph\xE2n ph\u1ED1i d\u01B0\u1EE3c ph\u1EA9m ch\xEDnh h\xE3ng."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      letterSpacing: '.2em',
      fontSize: 12,
      color: 'var(--dv-yellow)'
    }
  }, "FAST \xB7 SAFE \xB7 EFFECTIVE")), cols.map(([h, links]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 14,
      marginBottom: 14,
      color: '#fff'
    }
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(255,255,255,.72)'
    },
    href: "#"
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,.12)',
      padding: '18px 32px',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'rgba(255,255,255,.55)'
    }
  }, "\xA9 2026 D\u01B0\u1EE3c V\u01B0\u01A1ng \xB7 GPKD s\u1ED1 0312345678 do S\u1EDF KH&\u0110T TP.HCM c\u1EA5p"));
}
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
/* DV MedKing website — hero with trust seal panel */
function Hero({
  onQuote
}) {
  const {
    Button,
    IconBadge,
    StatCard,
    Badge
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconArrowRight,
    IconShield,
    IconTruck,
    IconCheckCircle,
    IconClock
  } = window;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '72px 32px 80px',
      display: 'grid',
      gridTemplateColumns: '1.05fr 0.95fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "brand",
    caps: true,
    dot: true
  }, "\u0110\u1ECBnh v\u1ECB kh\xF4ng r\u1EE7i ro")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 56,
      fontWeight: 900,
      lineHeight: 1.04,
      letterSpacing: '-0.03em',
      color: 'var(--dv-green)',
      margin: '0 0 20px'
    }
  }, "Ph\xE2n ph\u1ED1i d\u01B0\u1EE3c ph\u1EA9m", /*#__PURE__*/React.createElement("br", null), "ch\xEDnh h\xE3ng \u2014 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--dv-green-bright)'
    }
  }, "kh\xF4ng r\u1EE7i ro"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      lineHeight: 1.6,
      color: 'var(--dv-ink-soft)',
      margin: '0 0 30px',
      maxWidth: '46ch'
    }
  }, "Ngu\u1ED3n h\xE0ng minh b\u1EA1ch, ch\u1EE9ng t\u1EEB CO/CQ \u0111\u1EA7y \u0111\u1EE7, b\u1EA3o qu\u1EA3n \u0111\u1EA1t chu\u1EA9n GSP v\xE0 giao nhanh 24h to\xE0n qu\u1ED1c. T\u1ED1i \u01B0u chi ph\xED cho nh\xE0 thu\u1ED1c c\u1EE7a b\u1EA1n."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(IconArrowRight, {
      size: 18
    }),
    onClick: onQuote
  }, "Nh\u1EADn b\xE1o gi\xE1 ngay"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg"
  }, "Xem danh m\u1EE5c thu\u1ED1c")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 30
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: "1.200+",
    label: "Nh\xE0 thu\u1ED1c \u0111\u1ED1i t\xE1c"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "24h",
    label: "Giao to\xE0n qu\u1ED1c"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: 'var(--border-default)'
    }
  }), /*#__PURE__*/React.createElement(StatCard, {
    value: "100%",
    label: "H\xE0ng ch\xEDnh h\xE3ng"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--dv-green)',
      borderRadius: 'var(--radius-card)',
      padding: 36,
      color: '#fff',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -30,
      right: -20,
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: 200,
      lineHeight: 1,
      color: 'rgba(255,255,255,.05)'
    }
  }, "DV"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(IconBadge, {
    size: "lg"
  }, /*#__PURE__*/React.createElement(IconShield, {
    size: 28
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 19
    }
  }, "Cam k\u1EBFt ch\u1EA5t l\u01B0\u1EE3ng"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: 'rgba(255,255,255,.78)'
    }
  }, "Truy xu\u1EA5t ngu\u1ED3n g\u1ED1c t\u1EEBng l\xF4"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      position: 'relative'
    }
  }, [[/*#__PURE__*/React.createElement(IconCheckCircle, {
    size: 20
  }), 'Chứng từ CO/CQ đầy đủ', 'Hóa đơn VAT, giấy phép lưu hành'], [/*#__PURE__*/React.createElement(IconClock, {
    size: 20
  }), 'Bảo quản chuẩn GSP', 'Kho lạnh, kiểm soát nhiệt độ 24/7'], [/*#__PURE__*/React.createElement(IconTruck, {
    size: 20
  }), 'Giao nhanh, đúng hẹn', 'Đội xe chuyên dụng toàn quốc']].map(([ic, t, s], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: 'rgba(255,255,255,.08)',
      borderRadius: 14,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--dv-yellow)',
      flex: 'none'
    }
  }, ic), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 15.5
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,.72)'
    }
  }, s))))))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
/* DV MedKing website — value pillars + 01/02/03 process */
function Pillars() {
  const {
    Card,
    IconBadge
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconZap,
    IconShield,
    IconChart
  } = window;
  const items = [[/*#__PURE__*/React.createElement(IconZap, {
    size: 26
  }), 'Nhanh chóng', 'Đặt hàng online, xử lý trong giờ, giao nội thành trong ngày và toàn quốc trong 24–48h.'], [/*#__PURE__*/React.createElement(IconShield, {
    size: 26
  }), 'An toàn', '100% hàng chính hãng với CO/CQ đầy đủ, truy xuất nguồn gốc và bảo quản đạt chuẩn GSP.'], [/*#__PURE__*/React.createElement(IconChart, {
    size: 26
  }), 'Hiệu quả', 'Giá sỉ minh bạch, công nợ linh hoạt và báo cáo mua hàng giúp nhà thuốc tối ưu chi phí.']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '88px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dv-overline",
    style: {
      marginBottom: 10
    }
  }, "V\xEC sao ch\u1ECDn D\u01B0\u1EE3c V\u01B0\u01A1ng"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 900,
      letterSpacing: '-0.02em',
      margin: 0
    }
  }, "Ba cam k\u1EBFt c\u1ED1t l\xF5i")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, items.map(([ic, t, d], i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    interactive: true,
    accentBar: true,
    padding: 32
  }, /*#__PURE__*/React.createElement(IconBadge, {
    size: "lg",
    style: {
      marginBottom: 18
    }
  }, ic), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24,
      fontWeight: 800,
      margin: '0 0 10px'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15.5,
      lineHeight: 1.6,
      color: 'var(--dv-ink-soft)',
      margin: 0
    }
  }, d))))));
}
window.Pillars = Pillars;
function Process() {
  const {
    NumberMarker
  } = window.DVMedKingDesignSystem_bf17f8;
  const steps = [['Tuyển chọn & kiểm định', 'Chỉ nhập hàng từ nhà sản xuất và nhà nhập khẩu được cấp phép, kiểm tra CO/CQ từng lô.'], ['Bảo quản đạt chuẩn GSP', 'Kho đạt chuẩn “Thực hành tốt bảo quản thuốc”, kiểm soát nhiệt độ và độ ẩm 24/7.'], ['Giao hàng & truy xuất', 'Đội xe chuyên dụng, đóng gói an toàn, mỗi đơn đều truy xuất được nguồn gốc.']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--dv-green)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '88px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 48,
      maxWidth: 620
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dv-overline",
    style: {
      color: 'var(--dv-yellow)',
      marginBottom: 10
    }
  }, "Quy tr\xECnh ki\u1EC3m so\xE1t"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 900,
      letterSpacing: '-0.02em',
      margin: 0,
      color: '#fff'
    }
  }, "Kh\xF4ng r\u1EE7i ro qua t\u1EEBng b\u01B0\u1EDBc")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 40
    }
  }, steps.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderTop: '2px solid rgba(255,255,255,.18)',
      paddingTop: 22
    }
  }, /*#__PURE__*/React.createElement(NumberMarker, {
    value: i + 1,
    tone: "yellow",
    size: "lg",
    style: {
      color: 'var(--dv-yellow)'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      margin: '14px 0 10px',
      color: '#fff'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      lineHeight: 1.6,
      color: 'rgba(255,255,255,.82)',
      margin: 0
    }
  }, d))))));
}
window.Process = Process;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/SiteHeader.jsx
try { (() => {
/* DV MedKing corporate website — sticky green header */
function SiteHeader({
  onCta
}) {
  const {
    Button
  } = window.DVMedKingDesignSystem_bf17f8;
  const {
    IconPhone
  } = window;
  const nav = ['Trang chủ', 'Danh mục thuốc', 'Quy trình', 'Đối tác', 'Tin tức'];
  const [active, setActive] = React.useState('Trang chủ');
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'var(--dv-green)',
      color: '#fff',
      boxShadow: '0 2px 14px rgba(0,51,40,.22)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 32px',
      height: 76,
      display: 'flex',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-horizontal-yellow.png",
    alt: "DV MedKing",
    style: {
      height: 40
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 26,
      marginLeft: 12
    }
  }, nav.map(n => /*#__PURE__*/React.createElement("a", {
    key: n,
    onClick: () => setActive(n),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      color: active === n ? 'var(--dv-yellow)' : 'rgba(255,255,255,.88)',
      paddingBottom: 4,
      boxShadow: active === n ? 'inset 0 -3px 0 var(--dv-yellow)' : 'none'
    }
  }, n))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      color: 'var(--dv-yellow)',
      fontWeight: 700,
      fontFamily: 'var(--font-display)'
    }
  }, /*#__PURE__*/React.createElement(IconPhone, {
    size: 18
  }), " 1800 6789"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "sm",
    onClick: onCta
  }, "Nh\u1EADn b\xE1o gi\xE1"))));
}
window.SiteHeader = SiteHeader;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/SiteHeader.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconBadge = __ds_scope.IconBadge;

__ds_ns.NumberMarker = __ds_scope.NumberMarker;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();

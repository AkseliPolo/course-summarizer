import { t } from '../lib/i18n.js'
import { cx } from '../lib/util.js'

const filled = { fill: 'currentColor', stroke: 'none' }

const ICONS = {
  play: <path d="M8 5.5v13l11-6.5z" {...filled} />,
  pause: <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" {...filled} />,
  next: <path d="M6 5.5v13l9-6.5zM16.5 5.5h2v13h-2z" {...filled} />,
  prev: <path d="M18 5.5v13l-9-6.5zM5.5 5.5h2v13h-2z" {...filled} />,
  speaker: (
    <>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z" {...filled} />
      <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  flame: <path d="M12 3c.8 3.2 4.8 5 4.8 9.6a4.8 4.8 0 0 1-9.6 0c0-1.6.7-2.9 1.7-3.8.2 1.3.8 2.2 1.7 2.6C10.4 8.9 10.7 5.6 12 3z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  back: <path d="M14.5 5.5L8 12l6.5 6.5" />,
  lock: (
    <>
      <rect x="6" y="11" width="12" height="9" rx="2" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
    </>
  ),
  gift: (
    <>
      <path d="M4.5 11h15v9h-15zM3.5 7.5h17V11h-17zM12 7.5V20" />
      <path d="M12 7.5c-1.4-3.4-5.6-3-4.8 0M12 7.5c1.4-3.4 5.6-3 4.8 0" />
    </>
  ),
}

export function Icon({ name, size = 20 }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  )
}

// Renders `inline code` inside a sentence.
export function Rich({ text }) {
  return text
    .split(/(`[^`]+`)/g)
    .map((part, index) => (part.startsWith('`') && part.length > 2 ? <code key={index}>{part.slice(1, -1)}</code> : part))
}

export function Code({ code }) {
  return (
    <pre className="code">
      <code>{code}</code>
    </pre>
  )
}

// A circular meter. The colour comes from the --unit custom property of its surroundings.
export function Ring({ value, size = 56, stroke = 6, label, children }) {
  const radius = (size - stroke) / 2
  const length = 2 * Math.PI * radius
  const share = Math.min(Math.max(value, 0), 1)
  const centre = size / 2

  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={label}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring-track" cx={centre} cy={centre} r={radius} strokeWidth={stroke} />
        {share > 0 && (
          <circle
            className="ring-fill"
            cx={centre}
            cy={centre}
            r={radius}
            strokeWidth={stroke}
            strokeDasharray={length}
            strokeDashoffset={length * (1 - share)}
            transform={`rotate(-90 ${centre} ${centre})`}
          />
        )}
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  )
}

export function Meter({ value, label }) {
  const share = Math.min(Math.max(value, 0), 1)
  return (
    <span className="meter" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(share * 100)}>
      <span style={{ width: `${share * 100}%` }} />
    </span>
  )
}

export const unitColor = unit => ({ '--unit': `var(--series-${unit.color})` })

export function UnitTag({ unit, children }) {
  return (
    <span className="unit-tag" style={unitColor(unit)}>
      <i className="dot" />
      {unit.label}
      {children}
    </span>
  )
}

// Header shared by the flashcard and quiz sessions.
export function SessionBar({ back, backLabel, title, step, total, children }) {
  return (
    <div className="session-bar">
      <a className="back" href={back}>
        <Icon name="back" size={18} />
        {backLabel}
      </a>
      <span className="session-title">{title}</span>
      <span className={cx('session-extra')}>{children}</span>
      <Meter value={step / total} label={t('{step} of {total} done', { step, total })} />
    </div>
  )
}

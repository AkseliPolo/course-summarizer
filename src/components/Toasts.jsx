import { useGame } from '../lib/store.jsx'
import { cx } from '../lib/util.js'

export function Toasts() {
  const { toasts } = useGame()

  return (
    <div className="toasts no-print" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={cx('toast', toast.kind)}>
          <span className="toast-icon">{toast.icon}</span>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Code, Icon, Rich, UnitTag } from '../components/ui.jsx'
import { count, t } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'

export default function Sheet() {
  const { dispatch, course, progress } = useGame()
  const groups = course.units
    .map(unit => ({ unit, points: unit.points.filter(point => progress.starred[point.id]) }))
    .filter(group => group.points.length > 0)
  const starred = groups.reduce((sum, group) => sum + group.points.length, 0)

  return (
    <div className="sheet">
      <header className="page-head no-print">
        <p className="eyebrow">{t('For the exam')}</p>
        <h1>{t('Cheat sheet')}</h1>
        <p className="lede">
          {t(
            'Star the points you are least sure of while you study {title}. They collect here, ready to copy out by hand if your exam allows a cheat sheet. Writing them down is revision in itself.',
            course,
          )}
        </p>
        {starred > 0 && (
          <div className="actions">
            <button className="btn primary" onClick={() => window.print()}>
              {t('Print a draft')}
            </button>
            <span className="muted">
              {t('{points} starred', { points: count(starred, 'point') })}
            </span>
          </div>
        )}
      </header>

      {starred === 0 && (
        <section className="card empty">
          <Icon name="star" size={28} />
          <h2>{t('Nothing starred yet')}</h2>
          <p>{t('Open a unit and press the star next to any key point. It will be collected here, grouped by unit.')}</p>
          <div className="actions">
            <a className="btn primary" href={`#/learn/${course.units[0].id}`}>
              {t('Start with {label}', course.units[0])}
            </a>
          </div>
        </section>
      )}

      {groups.map(({ unit, points }) => (
        <section key={unit.id} className="sheet-group">
          <h2>
            <UnitTag unit={unit} /> {unit.title}
          </h2>
          <ul>
            {points.map(point => (
              <li key={point.id} className="sheet-item">
                <div>
                  <strong>{point.term}. </strong>
                  <Rich text={point.text} />
                  {point.code && <Code code={point.code} />}
                </div>
                <button
                  className="icon-btn star on no-print"
                  onClick={() => dispatch({ type: 'star', id: point.id })}
                  aria-label={t('Remove {term} from the cheat sheet', point)}
                  title={t('Remove from cheat sheet')}
                >
                  <Icon name="star" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

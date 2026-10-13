import { Icon, Ring, UnitTag, unitColor } from '../components/ui.jsx'
import { CHESTS, dayOf, readiness, unitProgress } from '../lib/game.js'
import { count, percent, t } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'
import { cx, daysUntil } from '../lib/util.js'

function headline(course) {
  if (!course.examDate) return course.title
  const days = daysUntil(course.examDate)
  if (days > 1) return t('Exam in {days} days', { days })
  if (days === 1) return t('Exam tomorrow')
  if (days === 0) return t('Exam today')
  return course.title
}

export default function Home() {
  const { state, dispatch, course, progress } = useGame()
  const today = dayOf(state)
  const minutes = Math.floor(today.seconds / 60)
  const goal = state.settings.goalMin
  const ready = Math.round(readiness(progress, course) * 100)
  const units = course.units.map(unit => ({ unit, ...unitProgress(progress, unit) }))
  const weakest = units.reduce((lowest, entry) => (entry.mastery < lowest.mastery ? entry : lowest)).unit
  const hasCore = course.points.some(point => point.core)
  const examSize = Math.min(course.examQuestions, course.questions.length)

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <p className="eyebrow">{[course.title, course.code].filter(Boolean).join(' · ')}</p>
          <h1>{headline(course)}</h1>
          <p className="lede">
            {examSize > 0 && t('The mock exam is {questions} in {minutes} minutes.', { questions: count(examSize, 'question'), minutes: course.examMinutes }) + ' '}
            {t('Your weakest area right now is {label}, {title}.', weakest)}
          </p>
          <div className="actions">
            <a className="btn primary" href={`#/learn/${weakest.id}`}>
              {t('Continue with {label}', weakest)}
            </a>
            <a className="btn" href={hasCore ? '#/cards/core' : '#/cards/all'}>
              {hasCore ? t('Must-know flashcards') : t('Flashcards')}
            </a>
            {course.questions.length > 0 && (
              <a className="btn" href="#/quiz/mix">
                {t('Mixed quiz')}
              </a>
            )}
          </div>
        </div>
        <div className="hero-ring">
          <Ring value={ready / 100} size={168} stroke={12} label={t('Exam readiness {percent}', { percent: percent(ready) })}>
            <strong>{ready}%</strong>
            <span>{t('exam ready')}</span>
          </Ring>
        </div>
      </section>

      <section className="card today" aria-label={t('Today')}>
        <div className="today-head">
          <Ring value={minutes / goal} size={88} stroke={8} label={t('{minutes} of {goal} minutes studied today', { minutes, goal })}>
            <strong>{minutes}</strong>
            <span>{t('of {goal} min', { goal })}</span>
          </Ring>
          <div>
            <h2>{t('Today')}</h2>
            <p>{t('Every minute of active study earns 2 XP, in any course. Reach a milestone to unlock a bonus.')}</p>
          </div>
        </div>
        <ol className="chests">
          {CHESTS.map(chest => {
            const claimed = today.claimed.includes(chest.minutes)
            const open = !claimed && minutes >= chest.minutes
            return (
              <li key={chest.minutes}>
                <button
                  className={cx('chest', claimed && 'claimed', open && 'ready')}
                  disabled={!open}
                  onClick={() => dispatch({ type: 'claim', minutes: chest.minutes })}
                >
                  <Icon name={claimed ? 'check' : open ? 'gift' : 'lock'} size={18} />
                  <span className="chest-time">{chest.minutes} min</span>
                  <span className="chest-xp">{claimed ? t('Collected') : open ? t('Collect +{xp}', chest) : `+${chest.xp} XP`}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </section>

      <section>
        <h2 className="section-title">{t('Units')}</h2>
        <div className="units">
          {units.map(({ unit, seen, total, right, questions, mastery }) => (
            <article key={unit.id} className="card unit" style={unitColor(unit)}>
              <header>
                <UnitTag unit={unit} />
                <Ring value={mastery} size={48} stroke={5} label={t('{percent} mastered', { percent: percent(Math.round(mastery * 100)) })}>
                  <b>{Math.round(mastery * 100)}%</b>
                </Ring>
              </header>
              <h3>{unit.title}</h3>
              <p className="unit-blurb">{unit.blurb}</p>
              <p className="unit-meta">
                {t('{seen}/{total} points reviewed', { seen, total })}
                {questions > 0 && ' · ' + t('{right}/{questions} questions right', { right, questions })}
              </p>
              <div className="unit-actions">
                <a className="btn small primary" href={`#/learn/${unit.id}`}>
                  {t('Learn')}
                </a>
                <a className="btn small" href={`#/cards/${unit.id}`}>
                  {t('Flashcards')}
                </a>
                {questions > 0 && (
                  <a className="btn small" href={`#/quiz/${unit.id}`}>
                    {t('Quiz')}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

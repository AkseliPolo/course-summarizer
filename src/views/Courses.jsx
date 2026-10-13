import { useState } from 'react'
import { Ring } from '../components/ui.jsx'
import { courseSeconds, progressOf, readiness } from '../lib/game.js'
import { count, languageName, percent, t, tx } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'
import { cx, daysUntil, duration } from '../lib/util.js'

function examNote(course) {
  if (!course.examDate) return ''
  const days = daysUntil(course.examDate)
  if (days > 1) return t('Exam in {days} days', { days })
  if (days === 1) return t('Exam tomorrow')
  if (days === 0) return t('Exam today')
  return t('Exam was on {date}', { date: course.examDate })
}

export default function Courses() {
  const { state, library, course: active, removeCourse, selectCourse, storage } = useGame()
  const [message, setMessage] = useState(null) // { ok, text }

  function study(id) {
    selectCourse(id)
    window.location.hash = '#/'
  }

  async function remove(course) {
    const question = t('Remove "{title}" from the list? Your progress and study time are kept, and return if you add it again.', course)
    if (!window.confirm(question)) return
    try {
      await removeCourse(course.id)
      setMessage({ ok: true, text: t('Removed "{title}".', course) })
    } catch (error) {
      setMessage({ ok: false, text: error.message })
    }
  }

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{t('Library')}</p>
        <h1>{t('Courses')}</h1>
        <p className="lede">
          {t('Each course keeps its own progress. Study time, XP, streaks and achievements add up across all of them.')}
        </p>
        <div className="actions">
          <a className="btn primary" href="#/courses/new">
            {t('Add a course')}
          </a>
        </div>
      </header>

      {message && (
        <p className={cx('status', message.ok ? 'ok' : 'error')} role="status">
          {message.text}
        </p>
      )}

      <section className="courses">
        {library.courses.map(course => {
          const ready = Math.round(readiness(progressOf(state, course.id), course) * 100)
          const isActive = course.id === active.id
          const translated = Object.keys(course.variants).length > 0
          return (
            <article key={course.id} className={cx('card course-card', isActive && 'active')}>
              <header>
                <div>
                  <p className="eyebrow">{[course.code, examNote(course)].filter(Boolean).join(' · ') || t('Course')}</p>
                  <h2>{course.title}</h2>
                </div>
                <Ring value={ready / 100} size={64} stroke={6} label={t('{percent} exam ready', { percent: percent(ready) })}>
                  <b>{ready}%</b>
                </Ring>
              </header>
              <p className="muted">
                {count(course.units.length, 'unit')} · {count(course.points.length, 'key point')} ·{' '}
                {count(course.questions.length, 'question')} · {course.languages.map(languageName).join(t(' and '))}
              </p>
              <p>
                {tx('{time} studied', { time: <strong>{duration(courseSeconds(state, course.id))}</strong> })}
              </p>
              <div className="actions">
                {isActive ? (
                  <a className="btn small primary" href="#/">
                    {t('Studying now')}
                  </a>
                ) : (
                  <button className="btn small primary" onClick={() => study(course.id)}>
                    {t('Study this course')}
                  </button>
                )}
                {/* A course with translations cannot be written as one plain text, so it is not edited here. */}
                {!course.builtin && !translated && (
                  <a className="btn small" href={`#/courses/edit/${course.id}`}>
                    {t('Edit')}
                  </a>
                )}
                {!course.builtin && (
                  <button className="btn small" onClick={() => remove(course)}>
                    {t('Remove')}
                  </button>
                )}
              </div>
            </article>
          )
        })}

        <a className="card course-card add-card" href="#/courses/new">
          <span className="add-plus" aria-hidden="true">
            +
          </span>
          <strong>{t('Add a course')}</strong>
          <span className="muted">{t('Type or paste your notes, or let an AI turn your slides into a course.')}</span>
        </a>
      </section>

      {library.problems.length > 0 && (
        <section className="card">
          <h2>{t('Files that could not be loaded')}</h2>
          <ul className="rules">
            {library.problems.map(problem => (
              <li key={problem.name}>
                <strong>{problem.name}.json:</strong> {problem.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {storage.onDisk && (
        <p className="muted folder-note">
          {tx('Added courses are saved as files in {folder}. Copying that folder to another computer brings your courses along.', {
            folder: <code>{storage.folder}\courses</code>,
          })}{' '}
          <button className="link" onClick={storage.openFolder}>
            {t('Open the folder')}
          </button>
        </p>
      )}
    </>
  )
}

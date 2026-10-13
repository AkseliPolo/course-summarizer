import { useEffect, useState } from 'react'
import { Question } from '../components/Question.jsx'
import { Icon, Meter, Rich, UnitTag } from '../components/ui.jsx'
import { XP } from '../lib/game.js'
import { useKey } from '../lib/hooks.js'
import { count, percent, t } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'
import { clock, cx, shuffle } from '../lib/util.js'

const storageKey = course => 'course-summarizer:exam:' + course.id

// Takes questions from each week in turn, so every week is represented evenly.
function buildRun(course, total) {
  const piles = course.units.map(unit => shuffle(unit.questions))
  const chosen = []
  for (let round = 0; chosen.length < total && piles.some(pile => pile.length > round); round++) {
    for (const pile of piles) {
      if (pile[round] && chosen.length < total) chosen.push(pile[round])
    }
  }
  return {
    startedAt: Date.now(),
    items: shuffle(chosen).map(question => ({
      id: question.id,
      order: shuffle(question.options.map((option, index) => index)),
    })),
    answers: {}, // question id -> chosen option index
  }
}

// An exam in progress survives a page reload, as long as its time has not run out.
function loadRun(course) {
  try {
    const run = JSON.parse(localStorage.getItem(storageKey(course)))
    const valid = run?.items?.every(item => course.questionById[item.id]) && Date.now() - run.startedAt < course.examMinutes * 60_000
    return valid ? run : null
  } catch {
    return null
  }
}

export default function Exam() {
  const { dispatch, course, progress } = useGame()
  const { questionById } = course
  const TOTAL = Math.min(course.examQuestions, course.questions.length)
  const LIMIT = course.examMinutes * 60
  const [run, setRun] = useState(() => loadRun(course))
  const [result, setResult] = useState(null)
  const [at, setAt] = useState(0)
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    if (!run) return
    localStorage.setItem(storageKey(course), JSON.stringify(run))
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [run, course])

  const elapsed = run ? Math.max(0, Math.floor((now - run.startedAt) / 1000)) : 0
  const remaining = Math.max(0, LIMIT - elapsed)

  function start() {
    setResult(null)
    setAt(0)
    setNow(Date.now())
    setRun(buildRun(course, TOTAL))
    window.scrollTo(0, 0)
  }

  function finish() {
    const results = run.items.map(item => ({
      id: item.id,
      answered: run.answers[item.id] !== undefined,
      correct: run.answers[item.id] === questionById[item.id].answer,
    }))
    const seconds = Math.min(LIMIT, Math.round((Date.now() - run.startedAt) / 1000))
    dispatch({ type: 'examDone', results, seconds })
    localStorage.removeItem(storageKey(course))
    setResult({ ...run, results, seconds })
    setRun(null)
    window.scrollTo(0, 0)
  }

  function confirmFinish() {
    const open = run.items.length - Object.keys(run.answers).length
    const message = open > 0 ? t('{open} questions are unanswered. Finish anyway?', { open }) : t('Finish the exam and see your result?')
    if (window.confirm(message)) finish()
  }

  // Time is up.
  useEffect(() => {
    if (run && remaining === 0) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, remaining])

  function pick(option) {
    const item = run.items[at]
    setRun({ ...run, answers: { ...run.answers, [item.id]: option } })
  }

  function move(delta) {
    setAt(Math.min(Math.max(at + delta, 0), run.items.length - 1))
  }

  useKey(event => {
    if (!run) return
    const number = Number(event.key)
    if (number >= 1 && number <= run.items[at].order.length) pick(run.items[at].order[number - 1])
    else if (event.key === 'ArrowRight' || event.key === 'Enter') move(1)
    else if (event.key === 'ArrowLeft') move(-1)
  })

  if (run) {
    const item = run.items[at]
    const question = questionById[item.id]
    const answered = Object.keys(run.answers).length

    return (
      <div className="session exam">
        <div className="exam-bar">
          <span className={cx('timer', remaining < 300 && 'low')} aria-label={t('Time remaining')}>
            <Icon name="clock" size={18} />
            {clock(remaining)}
          </span>
          <span className="muted">
            {t('{answered} of {total} answered', { answered, total: run.items.length })}
          </span>
          <button className="btn small" onClick={confirmFinish}>
            {t('Finish exam')}
          </button>
          <Meter value={answered / run.items.length} label={t('Questions answered')} />
        </div>

        <Question
          question={question}
          order={item.order}
          picked={run.answers[item.id]}
          reveal={false}
          onPick={pick}
          eyebrow={[t('Question {at} of {total}', { at: at + 1, total: run.items.length }), question.code && t('Code reading')].filter(Boolean).join(' · ')}
        />

        <div className="exam-nav">
          <button className="btn" onClick={() => move(-1)} disabled={at === 0}>
            {t('Previous')}
          </button>
          <button className="btn primary" onClick={() => move(1)} disabled={at === run.items.length - 1}>
            {t('Next')}
          </button>
        </div>

        <ol className="exam-grid" aria-label={t('All questions')}>
          {run.items.map((entry, index) => (
            <li key={entry.id}>
              <button
                className={cx('cell', index === at && 'current', run.answers[entry.id] !== undefined && 'answered')}
                onClick={() => setAt(index)}
                aria-label={t('Question {number}', { number: index + 1 }) + (run.answers[entry.id] !== undefined ? ', ' + t('answered') : '')}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  if (result) return <Result result={result} course={course} onRetry={start} />

  const best = Math.max(0, ...progress.exams.map(exam => exam.score / exam.total))

  if (TOTAL === 0) {
    return (
      <div className="session">
        <header className="page-head">
          <p className="eyebrow">{t('Dress rehearsal')}</p>
          <h1>{t('Mock exam')}</h1>
          <p className="lede">{t('{title} has no practice questions yet, so there is nothing to build an exam from.', course)}</p>
        </header>
      </div>
    )
  }

  return (
    <div className="session">
      <header className="page-head">
        <p className="eyebrow">{t('Dress rehearsal')}</p>
        <h1>{t('Mock exam')}</h1>
        <p className="lede">
          {t('The same shape as the real thing: {questions} in {minutes} minutes, drawn evenly from every unit of {title}.', {
            questions: count(TOTAL, 'question'),
            minutes: course.examMinutes,
            title: course.title,
          })}
        </p>
      </header>

      <section className="card">
        <ul className="rules">
          <li>{t('No feedback until you finish, just like the real exam.')}</li>
          <li>{t('You can move between questions and change answers until you finish.')}</li>
          <li>{t('The timer keeps running if you leave the page. An unfinished exam is restored when you come back.')}</li>
          <li>
            {t('Finishing earns {done} XP plus {each} XP for every correct answer.', { done: XP.examDone, each: XP.examCorrect })}
          </li>
        </ul>
        <div className="actions">
          <button className="btn primary big" onClick={start}>
            {t('Start the exam')}
          </button>
        </div>
      </section>

      {progress.exams.length > 0 && (
        <section>
          <h2 className="section-title">{t('Past attempts')}</h2>
          <table className="attempts">
            <thead>
              <tr>
                <th>{t('Date')}</th>
                <th>{t('Score')}</th>
                <th>{t('Time used')}</th>
              </tr>
            </thead>
            <tbody>
              {progress.exams
                .map((exam, index) => ({ ...exam, index }))
                .reverse()
                .map(exam => (
                  <tr key={exam.index}>
                    <td>{exam.day}</td>
                    <td>
                      {exam.score} / {exam.total} ({percent(Math.round((exam.score / exam.total) * 100))})
                      {exam.score / exam.total === best && progress.exams.length > 1 ? ' · ' + t('best') : ''}
                    </td>
                    <td>{clock(exam.seconds)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}

function Result({ result, course, onRetry }) {
  const { questionById, unitById, units } = course
  const [wrongOnly, setWrongOnly] = useState(true)
  const score = result.results.filter(entry => entry.correct).length
  const total = result.results.length
  const share = Math.round((score / total) * 100)

  const byUnit = units.map(unit => {
    const mine = result.results.filter(entry => questionById[entry.id].unit === unit.id)
    return { unit, right: mine.filter(entry => entry.correct).length, total: mine.length }
  })

  const shown = result.items
    .map((item, index) => ({ ...item, index, ...result.results[index] }))
    .filter(entry => !wrongOnly || !entry.correct)

  return (
    <div className="session">
      <header className="page-head">
        <p className="eyebrow">{t('Mock exam result')}</p>
        <h1>
          {t('{score} of {total} correct', { score, total })}
        </h1>
        <p className="lede">
          {t('{percent} in {time}. You earned {xp} XP.', { percent: percent(share), time: clock(result.seconds), xp: XP.examDone + score * XP.examCorrect })}{' '}
          {share >= 80 ? t('That is a strong result.') : t('The units with the shortest bars below are where to spend your time.')}
        </p>
        <div className="actions">
          <button className="btn primary" onClick={onRetry}>
            {t('New exam')}
          </button>
          <a className="btn" href="#/">
            {t('Back to studying')}
          </a>
        </div>
      </header>

      <section className="card">
        <h2>{t('Score by unit')}</h2>
        <ul className="breakdown">
          {byUnit.map(({ unit, right, total: count }) => (
            <li key={unit.id}>
              <span className="break-label">
                <UnitTag unit={unit} />
                <a href={`#/learn/${unit.id}`}>{unit.title}</a>
              </span>
              <span className="break-bar">
                <span style={{ width: `${count ? (right / count) * 100 : 0}%` }} />
              </span>
              <span className="break-value">
                {right}/{count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="review-head">
          <h2>{t('Review')}</h2>
          <div className="segmented" role="group" aria-label={t('Which questions to review')}>
            <button className={cx(wrongOnly && 'on')} aria-pressed={wrongOnly} onClick={() => setWrongOnly(true)}>
              {t('Missed {count}', { count: total - score })}
            </button>
            <button className={cx(!wrongOnly && 'on')} aria-pressed={!wrongOnly} onClick={() => setWrongOnly(false)}>
              {t('All {count}', { count: total })}
            </button>
          </div>
        </div>

        {shown.length === 0 && <p className="muted">{t('Nothing missed. Every answer was correct.')}</p>}

        {shown.map(entry => {
          const question = questionById[entry.id]
          const status = entry.correct ? t('Correct') : entry.answered ? t('Wrong') : t('Not answered')
          return (
            <div key={entry.id} className="review-item">
              <Question
                question={question}
                order={entry.order}
                picked={result.answers[entry.id]}
                reveal
                eyebrow={`${t('Question {number}', { number: entry.index + 1 })} · ${unitById[question.unit].label} · ${status}`}
              />
              <p className="review-why">
                <Rich text={question.why} />
              </p>
            </div>
          )
        })}
      </section>
    </div>
  )
}

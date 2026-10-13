import { useState } from 'react'
import { Question } from '../components/Question.jsx'
import { Icon, Rich, SessionBar, unitColor } from '../components/ui.jsx'
import { XP, answerXp } from '../lib/game.js'
import { useKey } from '../lib/hooks.js'
import { t } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'
import { cx, shuffle } from '../lib/util.js'

const ROUND = 10

// Questions you got wrong last time come first, then new ones, then ones you already know.
function buildRound(course, scope, progress) {
  const pool = scope === 'mix' ? course.questions : course.unitById[scope].questions
  const rank = question => {
    const record = progress.questions[question.id]
    return !record ? 1 : record.last ? 2 : 0
  }
  const chosen = shuffle(pool)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, ROUND)
  return shuffle(chosen).map(question => ({
    question,
    order: shuffle(question.options.map((option, index) => index)),
  }))
}

export default function Quiz({ scope }) {
  const { dispatch, course, progress } = useGame()
  const [round, setRound] = useState(() => buildRound(course, scope, progress))
  const [at, setAt] = useState(0)
  const [picked, setPicked] = useState(undefined)
  const [combo, setCombo] = useState(0)
  const [missed, setMissed] = useState([])
  const [earned, setEarned] = useState(0)
  const [done, setDone] = useState(false)

  const unit = course.unitById[scope]
  const title = unit ? t('Quiz · {label}', unit) : t('Mixed quiz')
  const back = unit ? `#/learn/${unit.id}` : '#/'
  const { question, order } = round[at]
  const answered = picked !== undefined
  const correct = picked === question.answer
  const isLast = at === round.length - 1

  function pick(option) {
    if (answered) return
    const right = option === question.answer
    const streak = right ? combo + 1 : 0
    setPicked(option)
    setCombo(streak)
    if (right) setEarned(earned + answerXp(streak))
    else setMissed([...missed, question])
    dispatch({ type: 'answer', id: question.id, correct: right, combo: streak })
  }

  function next() {
    if (!answered) return
    if (isLast) {
      dispatch({ type: 'quizDone', correct: round.length - missed.length, total: round.length })
      setDone(true)
      return
    }
    setAt(at + 1)
    setPicked(undefined)
  }

  function restart() {
    setRound(buildRound(course, scope, progress))
    setAt(0)
    setPicked(undefined)
    setCombo(0)
    setMissed([])
    setEarned(0)
    setDone(false)
  }

  useKey(event => {
    if (done) return
    const number = Number(event.key)
    if (number >= 1 && number <= order.length) pick(order[number - 1])
    else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      next()
    }
  })

  if (done) {
    const score = round.length - missed.length
    const perfect = missed.length === 0
    const bonus = XP.quizDone + (perfect ? XP.quizPerfect : 0)
    return (
      <div className="session">
        <SessionBar back={back} backLabel={t('Back')} title={title} step={round.length} total={round.length} />
        <section className="card summary">
          <p className="eyebrow">{perfect ? t('Flawless round') : t('Round complete')}</p>
          <h1>
            {t('{score} of {total} correct', { score, total: round.length })}
          </h1>
          <p className="lede">
            {perfect
              ? t('You earned {total} XP: {answers} for answers and {bonus} for finishing without a mistake.', { total: earned + bonus, answers: earned, bonus })
              : t('You earned {total} XP: {answers} for answers and {bonus} for finishing.', { total: earned + bonus, answers: earned, bonus })}
          </p>
          <div className="actions">
            <button className="btn primary" onClick={restart} autoFocus>
              {t('Another round')}
            </button>
            <a className="btn" href="#/exam">
              {t('Try the mock exam')}
            </a>
            <a className="btn" href="#/">
              {t('Done')}
            </a>
          </div>
        </section>

        {missed.length > 0 && (
          <section className="missed">
            <h2>{t('Worth another look')}</h2>
            {missed.map(item => (
              <article key={item.id} className="card missed-item">
                <p className="missed-q">
                  <Rich text={item.q} />
                </p>
                <p>
                  <strong>{t('Answer:')} </strong>
                  <Rich text={item.options[item.answer]} />
                </p>
                <p className="muted">
                  <Rich text={item.why} />
                </p>
              </article>
            ))}
          </section>
        )}
      </div>
    )
  }

  return (
    <div className="session" style={unitColor(course.unitById[question.unit])}>
      <SessionBar back={back} backLabel={t('Back')} title={title} step={at + (answered ? 1 : 0)} total={round.length}>
        {combo >= 2 && (
          <span className="combo" key={combo}>
            <Icon name="flame" size={16} />
            {t('{combo} in a row', { combo })}
          </span>
        )}
      </SessionBar>

      <Question
        question={question}
        order={order}
        picked={picked}
        reveal={answered}
        onPick={pick}
        eyebrow={[t('Question {at} of {total}', { at: at + 1, total: round.length }), course.unitById[question.unit].label, question.code && t('Code reading')]
          .filter(Boolean)
          .join(' · ')}
      />

      {answered && (
        <div className={cx('feedback', correct ? 'good' : 'bad')} role="status">
          <strong>
            <Icon name={correct ? 'check' : 'x'} size={18} />
            {correct ? t('Correct, +{xp} XP', { xp: answerXp(combo) }) : t('Not quite')}
          </strong>
          <p>
            <Rich text={question.why} />
          </p>
          <div>
            <button className="btn primary" onClick={next} autoFocus>
              {isLast ? t('Finish') : t('Next question')} <kbd>Enter</kbd>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

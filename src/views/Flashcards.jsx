import { useState } from 'react'
import { Code, Icon, Rich, SessionBar, UnitTag, unitColor } from '../components/ui.jsx'
import { useKey } from '../lib/hooks.js'
import { t } from '../lib/i18n.js'
import { useSpeech } from '../lib/speech.jsx'
import { useGame } from '../lib/store.jsx'
import { shuffle } from '../lib/util.js'

const ROUND = 12

// scope is a unit id, 'core' (must-know points from every unit) or 'all'.
function poolFor(course, scope) {
  if (scope === 'core') return course.points.filter(point => point.core)
  if (scope === 'all') return course.points
  return course.unitById[scope].points
}

// The cards you know least come first; within the same level the order is random.
function deal(course, scope, progress) {
  const box = point => progress.points[point.id]?.box ?? 0
  return shuffle(poolFor(course, scope))
    .sort((a, b) => box(a) - box(b))
    .slice(0, ROUND)
}

export default function Flashcards({ scope }) {
  const { state, dispatch, course, progress } = useGame()
  const { supported, speak, stop } = useSpeech()
  const [deck, setDeck] = useState(() => deal(course, scope, progress))
  const [at, setAt] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [known, setKnown] = useState(0)
  const [xpAtStart, setXpAtStart] = useState(state.xp)

  const unit = course.unitById[scope]
  const title = unit ? t('Flashcards · {label}', unit) : scope === 'core' ? t('Must-know flashcards') : t('All flashcards')
  const back = unit ? `#/learn/${unit.id}` : '#/'
  const card = deck[at]
  const autoRead = state.settings.autoRead

  function readAnswer() {
    speak(card.say ?? card.text)
  }

  function reveal() {
    setRevealed(true)
    if (autoRead) readAnswer()
  }

  function rate(knew) {
    stop()
    dispatch({ type: 'rate', id: card.id, knew })
    if (knew) setKnown(known + 1)
    setRevealed(false)
    setAt(at + 1)
  }

  function dealAgain() {
    setDeck(deal(course, scope, progress))
    setAt(0)
    setKnown(0)
    setRevealed(false)
    setXpAtStart(state.xp)
  }

  useKey(event => {
    if (!card) return
    if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
      event.preventDefault()
      reveal()
    } else if (revealed && (event.key === '1' || event.key === 'ArrowLeft')) {
      rate(false)
    } else if (revealed && (event.key === '2' || event.key === 'ArrowRight')) {
      rate(true)
    }
  })

  if (!card) {
    return (
      <div className="session">
        <SessionBar back={back} backLabel={t('Back')} title={title} step={1} total={1} />
        <section className="card summary">
          <p className="eyebrow">{t('Round complete')}</p>
          <h1>
            {t('{known} of {total} recalled', { known, total: deck.length })}
          </h1>
          <p className="lede">
            {t('You earned {xp} XP. Cards you missed come back first in the next round; cards you recall three times in a row count as mastered.', {
              xp: state.xp - xpAtStart,
            })}
          </p>
          <div className="actions">
            <button className="btn primary" onClick={dealAgain} autoFocus>
              {t('Another round')}
            </button>
            {unit && unit.questions.length > 0 && (
              <a className="btn" href={`#/quiz/${unit.id}`}>
                {t('Take the quiz')}
              </a>
            )}
            <a className="btn" href="#/">
              {t('Done')}
            </a>
          </div>
        </section>
      </div>
    )
  }

  const cardUnit = course.unitById[card.unit]

  return (
    <div className="session" style={unitColor(cardUnit)}>
      <SessionBar back={back} backLabel={t('Back')} title={title} step={at} total={deck.length}>
        {at + 1} / {deck.length}
      </SessionBar>

      <article className="card flashcard">
        <UnitTag unit={cardUnit}> · {card.topic}</UnitTag>
        <h1 className="flash-term">{card.term}</h1>
        {card.gloss && <p className="gloss">{card.gloss}</p>}

        {revealed ? (
          <div className="flash-answer">
            <p>
              <Rich text={card.text} />
            </p>
            {card.code && <Code code={card.code} />}
          </div>
        ) : (
          <p className="flash-hint">{t('Explain it in your own words, out loud if you can. Then check.')}</p>
        )}
      </article>

      <div className="flash-actions">
        {revealed ? (
          <>
            <button className="btn bad big" onClick={() => rate(false)}>
              {t('Not yet')} <kbd>1</kbd>
            </button>
            <button className="btn good big" onClick={() => rate(true)}>
              {t('Knew it')} <kbd>2</kbd>
            </button>
          </>
        ) : (
          <button className="btn primary big" onClick={reveal}>
            {t('Show answer')} <kbd>{t('Space')}</kbd>
          </button>
        )}
      </div>

      {supported && (
        <div className="flash-options">
          {revealed && (
            <button className="btn small" onClick={readAnswer}>
              <Icon name="speaker" size={18} />
              {t('Read aloud')}
            </button>
          )}
          <label className="check-label">
            <input
              type="checkbox"
              checked={autoRead}
              onChange={event => dispatch({ type: 'settings', patch: { autoRead: event.target.checked } })}
            />
            {t('Read answers aloud automatically')}
          </label>
        </div>
      )}
    </div>
  )
}

import { t } from '../lib/i18n.js'
import { cx } from '../lib/util.js'
import { Code, Icon, Rich } from './ui.jsx'

// One multiple-choice question.
//   order   the option indexes in the order they are shown (shuffled per session)
//   picked  the chosen option index, or undefined
//   reveal  show which option is right and which was picked wrongly
//   onPick  called with the option index; leave it out for a read-only review
export function Question({ question, order, picked, reveal, onPick, eyebrow }) {
  return (
    <article className="card question">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="q-text">
        <Rich text={question.q} />
      </h2>
      {question.code && <Code code={question.code} />}

      <ol className={cx('options', reveal && 'revealed')}>
        {order.map((option, position) => {
          const isPicked = picked === option
          const isRight = option === question.answer
          const status = reveal ? (isRight ? 'correct' : isPicked ? 'wrong' : '') : isPicked ? 'picked' : ''
          return (
            <li key={option}>
              <button className={cx('option', status)} aria-pressed={isPicked} disabled={!onPick} onClick={() => onPick?.(option)}>
                <kbd>{position + 1}</kbd>
                <span className="option-text">
                  <Rich text={question.options[option]} />
                </span>
                {status === 'correct' && (
                  <span className="option-mark">
                    <Icon name="check" size={16} />
                    {t('Correct')}
                  </span>
                )}
                {status === 'wrong' && (
                  <span className="option-mark">
                    <Icon name="x" size={16} />
                    {t('Your answer')}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </article>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Code, Icon, Rich, UnitTag, unitColor } from '../components/ui.jsx'
import { useKey } from '../lib/hooks.js'
import { languageName, t } from '../lib/i18n.js'
import { useSpeech } from '../lib/speech.jsx'
import { useGame } from '../lib/store.jsx'
import { cx } from '../lib/util.js'

const RATES = [0.8, 1, 1.2, 1.5, 1.8]
const WORDS_PER_MINUTE = 160

function spokenText(point) {
  return `${point.term}. ${point.say ?? point.text}`
}

export default function Learn({ unit }) {
  const { state, dispatch, progress } = useGame()
  const { supported, noVoice, lang, speak, stop } = useSpeech()
  const [coreOnly, setCoreOnly] = useState(false)
  const [index, setIndex] = useState(-1)
  const [playing, setPlaying] = useState(false)

  const topics = useMemo(
    () =>
      unit.topics
        .map(topic => ({ ...topic, points: topic.points.filter(point => !coreOnly || point.core) }))
        .filter(topic => topic.points.length > 0),
    [unit, coreOnly],
  )
  const queue = useMemo(() => topics.flatMap(topic => topic.points), [topics])
  const current = queue[index]
  const currentId = current?.id

  // Read the current point aloud, mark it as reviewed, then move on to the next one.
  // Changing the voice or the speed gives a new speak function, which restarts the point.
  useEffect(() => {
    if (!playing || !current) return
    speak(
      spokenText(current),
      () => {
        dispatch({ type: 'seen', id: current.id, heard: true })
        if (index + 1 < queue.length) {
          setIndex(index + 1)
        } else {
          setPlaying(false)
          setIndex(-1)
        }
      },
      () => setPlaying(false),
    )
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, currentId, speak])

  useEffect(() => {
    if (playing && currentId) {
      document.getElementById(`point-${currentId}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [playing, currentId])

  function toggle() {
    if (playing) {
      setPlaying(false)
      return
    }
    if (!current) {
      const firstNew = queue.findIndex(point => !progress.points[point.id]?.seen)
      setIndex(Math.max(firstNew, 0))
    }
    setPlaying(true)
  }

  function playFrom(position) {
    if (playing && position === index) {
      setPlaying(false)
      return
    }
    setIndex(position)
    setPlaying(true)
  }

  function step(delta) {
    setIndex(Math.min(Math.max(index + delta, 0), queue.length - 1))
  }

  function showCoreOnly(value) {
    setPlaying(false)
    setIndex(-1)
    setCoreOnly(value)
  }

  useKey(event => {
    if (event.key === ' ') {
      event.preventDefault()
      toggle()
    } else if (event.key === 'ArrowRight' && current) {
      step(1)
    } else if (event.key === 'ArrowLeft' && current) {
      step(-1)
    }
  })

  const position = new Map(queue.map((point, at) => [point.id, at]))
  const words = queue.reduce((count, point) => count + spokenText(point).split(/\s+/).length, 0)
  const listenMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE / state.settings.rate))
  const coreCount = unit.points.filter(point => point.core).length

  return (
    <div className="learn" style={unitColor(unit)}>
      <header className="page-head">
        <a className="back" href="#/">
          <Icon name="back" size={18} />
          {t('All units')}
        </a>
        <UnitTag unit={unit} />
        <h1>{unit.title}</h1>
        <p className="lede">{unit.blurb}</p>
        <div className="actions">
          <div className="segmented" role="group" aria-label={t('Which points to show')}>
            <button className={cx(!coreOnly && 'on')} aria-pressed={!coreOnly} onClick={() => showCoreOnly(false)}>
              {t('All {count}', { count: unit.points.length })}
            </button>
            <button className={cx(coreOnly && 'on')} aria-pressed={coreOnly} onClick={() => showCoreOnly(true)}>
              {t('Must-know {count}', { count: coreCount })}
            </button>
          </div>
          <a className="btn" href={`#/cards/${unit.id}`}>
            {t('Flashcards')}
          </a>
          {unit.questions.length > 0 && (
            <a className="btn" href={`#/quiz/${unit.id}`}>
              {t('Quiz')}
            </a>
          )}
        </div>
        {noVoice && (
          <p className="notice" role="status">
            <strong>{t('No {language} voice in this browser.', { language: languageName(lang) })}</strong>{' '}
            {t(
              'This course is in {language}, so it needs a {language} voice to be read properly. Microsoft Edge and Google Chrome include voices for many languages for free; more can be added in the Windows speech settings.',
              { language: languageName(lang) },
            )}
          </p>
        )}
      </header>

      {topics.map(topic => (
        <section key={topic.title} className="topic">
          <h2>{topic.title}</h2>
          <ol className="points">
            {topic.points.map(point => {
              const at = position.get(point.id)
              const isCurrent = at === index
              const seen = progress.points[point.id]?.seen
              const starred = progress.starred[point.id]
              return (
                <li key={point.id} id={`point-${point.id}`} className={cx('point', isCurrent && 'current')}>
                  {supported && (
                    <button
                      className="icon-btn point-play"
                      onClick={() => playFrom(at)}
                      aria-label={isCurrent && playing ? t('Pause') : t('Read aloud: {term}', point)}
                    >
                      <Icon name={isCurrent && playing ? 'pause' : 'speaker'} />
                    </button>
                  )}
                  <div className="point-body">
                    <h3>
                      {point.term}
                      {/* <wbr>: without it the term, its gloss and the tag are one unbreakable word. */}
                      {point.gloss && (
                        <>
                          <wbr />
                          <span className="gloss">{point.gloss}</span>
                        </>
                      )}
                      {point.core && (
                        <>
                          <wbr />
                          <span className="tag">{t('Must-know')}</span>
                        </>
                      )}
                    </h3>
                    <p>
                      <Rich text={point.text} />
                    </p>
                    {point.code && <Code code={point.code} />}
                  </div>
                  <div className="point-tools">
                    <button
                      className={cx('icon-btn star', starred && 'on')}
                      onClick={() => dispatch({ type: 'star', id: point.id })}
                      aria-pressed={Boolean(starred)}
                      aria-label={starred ? t('Remove from cheat sheet') : t('Add to cheat sheet')}
                      title={starred ? t('On your cheat sheet') : t('Add to cheat sheet')}
                    >
                      <Icon name="star" />
                    </button>
                    <button
                      className={cx('icon-btn check', seen && 'on')}
                      onClick={() => dispatch({ type: 'seen', id: point.id })}
                      aria-pressed={Boolean(seen)}
                      aria-label={seen ? t('Reviewed') : t('Mark as reviewed')}
                      title={seen ? t('Reviewed') : t('Mark as reviewed (+5 XP)')}
                    >
                      <Icon name="check" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}

      <div className="player no-print" role="region" aria-label={t('Read aloud')}>
        {supported ? (
          <>
            <button className="icon-btn" onClick={() => step(-1)} disabled={!current || index === 0} aria-label={t('Previous point')}>
              <Icon name="prev" />
            </button>
            <button className="play-btn" onClick={toggle} aria-label={playing ? t('Pause') : t('Read this unit aloud')}>
              <Icon name={playing ? 'pause' : 'play'} size={24} />
            </button>
            <button
              className="icon-btn"
              onClick={() => step(1)}
              disabled={!current || index === queue.length - 1}
              aria-label={t('Next point')}
            >
              <Icon name="next" />
            </button>
            <div className="player-now">
              <strong>{current ? current.term : t('Listen to {label}', unit)}</strong>
              <span>
                {current
                  ? t('{at} of {total}', { at: index + 1, total: queue.length })
                  : t('{points} points, about {minutes} min', { points: queue.length, minutes: listenMinutes })}
                {noVoice && ' · ' + t('no {language} voice', { language: languageName(lang) })}
              </span>
            </div>
            <label className="player-rate">
              <span className="sr-only">{t('Reading speed')}</span>
              <select
                value={state.settings.rate}
                onChange={event => dispatch({ type: 'settings', patch: { rate: Number(event.target.value) } })}
              >
                {RATES.map(rate => (
                  <option key={rate} value={rate}>
                    {rate}×
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <p className="player-now">{t('This browser cannot read text aloud. Try Chrome or Edge.')}</p>
        )}
      </div>
    </div>
  )
}

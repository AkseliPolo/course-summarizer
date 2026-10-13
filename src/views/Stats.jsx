import { useRef } from 'react'
import { Icon, Meter } from '../components/ui.jsx'
import { ACHIEVEMENTS, courseSeconds, dayOf, levelInfo, lifetime, streaks } from '../lib/game.js'
import { count, languageName, locale, percent, t } from '../lib/i18n.js'
import { useSpeech } from '../lib/speech.jsx'
import { useGame } from '../lib/store.jsx'
import { cx, dayKey, duration } from '../lib/util.js'

const GOALS = [15, 30, 45, 60, 90]
const RATES = [0.8, 1, 1.2, 1.5, 1.8]
const WEEKS = 26

const minutesOn = (state, date) => Math.floor(dayOf(state, dayKey(date)).seconds / 60)
const shortDate = date => date.toLocaleDateString(locale(), { day: 'numeric', month: 'short' })

// A column chart of one series. Only the columns flagged with `show` get a value label;
// every value is in the hover tooltip and in the table for screen readers.
function Columns({ caption, note, columns, top, goal, slim }) {
  return (
    <figure className="chart">
      <figcaption>{caption}</figcaption>
      {note && <p className="chart-note">{note}</p>}
      <div className={cx('chart-plot', slim && 'slim')} style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
        {goal && (
          <div className="chart-goal" style={{ bottom: `${(goal.value / top) * 100}%` }}>
            <span>{goal.label}</span>
          </div>
        )}
        {columns.map((column, index) => (
          // Tooltips near an edge open inwards, so they never spill out of the chart.
          <div
            key={column.key}
            className={cx('chart-col', index < columns.length / 3 && 'at-start', index >= (columns.length * 2) / 3 && 'at-end')}
            tabIndex={0}
            aria-label={column.tip}
          >
            <span className="chart-tip">{column.tip}</span>
            {column.show && column.value > 0 && <span className="chart-value">{column.value}</span>}
            <span className="chart-bar" style={{ height: `${(column.value / top) * 100}%` }} />
            {column.label && <span className="chart-label">{column.label}</span>}
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <tbody>
          {columns.map(column => (
            <tr key={column.key}>
              <td>{column.tip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

function LastSevenDays({ state }) {
  const goal = state.settings.goalMin
  const days = Array.from({ length: 7 }, (unused, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    return { date, minutes: minutesOn(state, date), label: index === 6 ? t('Today') : date.toLocaleDateString(locale(), { weekday: 'short' }) }
  })
  const peak = Math.max(...days.map(day => day.minutes))

  return (
    <Columns
      caption={t('Minutes studied, last 7 days')}
      top={Math.max(goal, peak) * 1.15}
      goal={{ value: goal, label: t('Daily goal {goal} min', { goal }) }}
      columns={days.map((day, index) => ({
        key: dayKey(day.date),
        label: day.label,
        value: day.minutes,
        tip: `${day.label}: ${day.minutes} min`,
        show: index === 6 || day.minutes === peak,
      }))}
    />
  )
}

function HoursOfDay({ state }) {
  const minutes = state.hours.map(seconds => Math.round(seconds / 60))
  const peak = Math.max(...minutes)
  const peakHour = minutes.indexOf(peak)
  const clock = hour => `${String(hour).padStart(2, '0')}:00`

  return (
    <Columns
      slim
      caption={t('When you study')}
      note={
        peak > 0
          ? t('Most of your studying happens around {time}.', { time: clock(peakHour) })
          : t('Minutes studied in each hour of the day. It fills in as you study.')
      }
      top={Math.max(peak, 1) * 1.15}
      columns={minutes.map((value, hour) => ({
        key: hour,
        label: hour % 6 === 0 ? clock(hour) : '',
        value,
        tip: t('{from} to {to}: {value} min in total', { from: clock(hour), to: clock((hour + 1) % 24), value }),
        show: hour === peakHour,
      }))}
    />
  )
}

// One square per day, Monday to Sunday down each column, darker for more minutes.
function Calendar({ state }) {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7) - (WEEKS - 1) * 7)
  const level = minutes => (minutes >= 60 ? 4 : minutes >= 30 ? 3 : minutes >= 15 ? 2 : minutes >= 1 ? 1 : 0)

  const weeks = Array.from({ length: WEEKS }, (unusedWeek, week) =>
    Array.from({ length: 7 }, (unusedDay, weekday) => {
      const date = new Date(start)
      date.setDate(start.getDate() + week * 7 + weekday)
      return { date, future: date > today, minutes: minutesOn(state, date) }
    }),
  )

  return (
    <figure className="chart">
      <figcaption>{t('Last {weeks} weeks', { weeks: WEEKS })}</figcaption>
      <p className="chart-note">
        {t('{start} to today. Each square is one day, Monday at the top.', { start: shortDate(start) })}
      </p>
      <div className="calendar" role="img" aria-label={t('Study minutes per day over the last {weeks} weeks', { weeks: WEEKS })}>
        {weeks.map(week => (
          <div key={dayKey(week[0].date)} className="calendar-week">
            {week.map(day =>
              day.future ? (
                <span key={dayKey(day.date)} className="calendar-day future" />
              ) : (
                <span
                  key={dayKey(day.date)}
                  className={`calendar-day heat-${level(day.minutes)}`}
                  title={`${shortDate(day.date)}: ${day.minutes} min`}
                />
              ),
            )}
          </div>
        ))}
      </div>
      <p className="calendar-legend">
        <span className="calendar-day heat-0" /> 0
        <span className="calendar-day heat-1" /> 1+
        <span className="calendar-day heat-2" /> 15+
        <span className="calendar-day heat-3" /> 30+
        <span className="calendar-day heat-4" /> {t('60+ minutes')}
      </p>
    </figure>
  )
}

function TimeByCourse({ state, library }) {
  const known = new Set(library.courses.map(course => course.id))
  const removed = Object.keys(state.names).filter(id => !known.has(id))
  const rows = [
    ...library.courses.map(course => ({ id: course.id, title: course.title })),
    ...removed.map(id => ({ id, title: t('{title} (removed)', { title: state.names[id] }) })),
  ]
    .map(row => ({ ...row, seconds: courseSeconds(state, row.id) }))
    .sort((a, b) => b.seconds - a.seconds)
  const most = Math.max(1, ...rows.map(row => row.seconds))

  return (
    <>
      <h2>{t('Time by course')}</h2>
      <ul className="breakdown wide">
        {rows.map(row => (
          <li key={row.id}>
            <span className="break-label">{row.title}</span>
            <span className="break-bar">
              <span style={{ width: `${(row.seconds / most) * 100}%` }} />
            </span>
            <span className="break-value">{duration(row.seconds)}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Stats() {
  const { state, dispatch, library, course, storage } = useGame()
  const speech = useSpeech()
  const restoreInput = useRef(null)
  const level = levelInfo(state.xp)
  const totals = lifetime(state)
  const streak = streaks(state)
  const unlocked = ACHIEVEMENTS.filter(achievement => state.achievements[achievement.id]).length
  const language = languageName(course.lang)
  const languageKey = course.lang.toLowerCase().split('-')[0]

  const groups = [
    {
      title: t('Time'),
      tiles: [
        { label: t('Days studied'), value: totals.studyDays },
        { label: t('Current streak'), value: count(streak.current, 'day') },
        { label: t('Longest streak'), value: count(streak.longest, 'day') },
        { label: t('Best day'), value: totals.bestDay.seconds ? duration(totals.bestDay.seconds) : t('None yet'), note: totals.bestDay.key },
        { label: t('Average per study day'), value: totals.studyDays ? duration(totals.seconds / totals.studyDays) : t('None yet') },
        { label: t('Time spent listening'), value: duration(state.stats.listenSeconds) },
      ],
    },
    {
      title: t('Knowledge'),
      tiles: [
        { label: t('Key points reviewed'), value: totals.reviewed },
        { label: t('Key points mastered'), value: totals.mastered, note: t('Recalled three times in a row') },
        { label: t('Key points heard'), value: state.stats.heard },
        { label: t('Flashcards rated'), value: state.stats.cards },
        { label: t('Cheat sheet stars'), value: totals.starred },
        { label: t('Courses'), value: library.courses.length },
      ],
    },
    {
      title: t('Practice'),
      tiles: [
        { label: t('Questions answered'), value: totals.answers },
        { label: t('Answer accuracy'), value: totals.answers ? percent(Math.round((totals.right / totals.answers) * 100)) : t('None yet') },
        { label: t('Best run of correct answers'), value: state.stats.bestCombo },
        { label: t('Quizzes finished'), value: state.stats.quizzes, note: t('{count} without a mistake', { count: state.stats.perfect }) },
        { label: t('Mock exams taken'), value: totals.exams, note: totals.exams ? t('Best score {percent}', { percent: percent(Math.round(totals.bestExam * 100)) }) : '' },
        { label: t('Time rewards collected'), value: state.stats.chests },
      ],
    },
  ]

  function downloadBackup() {
    const blob = new Blob([JSON.stringify({ ...state, updatedAt: Date.now() }, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `course-summarizer-backup-${dayKey()}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  async function restoreBackup(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    let saved = null
    try {
      saved = JSON.parse(await file.text())
    } catch {
      // handled below
    }
    if (!saved || typeof saved.xp !== 'number') {
      window.alert(t('That file is not a Course Summarizer backup.'))
      return
    }
    if (window.confirm(t('Replace all current progress with this backup? This cannot be undone.'))) {
      dispatch({ type: 'restore', saved })
    }
  }

  function reset() {
    if (window.confirm(t('Erase all XP, study time, progress, stars and exam results in every course? This cannot be undone.'))) {
      dispatch({ type: 'reset' })
    }
  }

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">{t('All courses, all time')}</p>
        <h1>{t('{time} studied', { time: duration(totals.seconds) })}</h1>
        <div className="level-card">
          <p>
            <strong>
              {t('Level {level}: {title}', { level: level.level, title: t(level.title) })}
            </strong>
          </p>
          <Meter value={level.progress} label={t('Progress to the next level')} />
          <p className="muted">
            {t('{xp} XP. {left} XP to level {next}.', { xp: state.xp, left: level.ceiling - state.xp, next: level.level + 1 })}
          </p>
        </div>
      </header>

      {groups.map(group => (
        <section key={group.title}>
          <h2 className="section-title">{group.title}</h2>
          <div className="stats">
            {group.tiles.map(tile => (
              <div key={tile.label} className="card stat-tile">
                <span className="stat-label">{tile.label}</span>
                <span className="stat-value">{tile.value}</span>
                {tile.note && <span className="stat-note">{tile.note}</span>}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="card">
        <TimeByCourse state={state} library={library} />
      </section>

      <section className="card">
        <Calendar state={state} />
      </section>

      <section className="chart-pair">
        <div className="card">
          <LastSevenDays state={state} />
        </div>
        <div className="card">
          <HoursOfDay state={state} />
        </div>
      </section>

      <section>
        <h2 className="section-title">
          {t('Achievements')}{' '}
          <span className="muted">
            {t('{unlocked} of {total}', { unlocked, total: ACHIEVEMENTS.length })}
          </span>
        </h2>
        <ul className="trophies">
          {ACHIEVEMENTS.map(achievement => {
            const earned = state.achievements[achievement.id]
            return (
              <li key={achievement.id} className={cx('card trophy', !earned && 'locked')}>
                <span className="trophy-icon">{earned ? achievement.icon : <Icon name="lock" size={18} />}</span>
                <div>
                  <strong>{t(achievement.name)}</strong>
                  <p>{t(achievement.desc)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="card settings">
        <h2>{t('Settings')}</h2>

        <label className="field">
          <span>{t('Daily goal')}</span>
          <select
            value={state.settings.goalMin}
            onChange={event => dispatch({ type: 'settings', patch: { goalMin: Number(event.target.value) } })}
          >
            {GOALS.map(goal => (
              <option key={goal} value={goal}>
                {t('{goal} minutes', { goal })}
              </option>
            ))}
          </select>
        </label>

        {speech.supported ? (
          <>
            <label className="field">
              <span>{t('{language} voice', { language })}</span>
              <select
                value={speech.voice?.voiceURI ?? ''}
                onChange={event =>
                  dispatch({ type: 'settings', patch: { voices: { ...state.settings.voices, [languageKey]: event.target.value } } })
                }
              >
                {speech.voices.length === 0 && <option value="">{t('No {language} voice in this browser', { language })}</option>}
                {speech.voices.map(voice => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>{t('Reading speed')}</span>
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

            <div className="field">
              <span>{t('Try the voice')}</span>
              <button className="btn small" onClick={() => speech.speak(course.points[0].say ?? course.points[0].text)}>
                <Icon name="speaker" size={18} />
                {t('Play a sample')}
              </button>
            </div>
          </>
        ) : (
          <p className="muted">{t('This browser cannot read text aloud. Chrome and Edge can.')}</p>
        )}

        <div className="field">
          <span>{t('Where it is saved')}</span>
          {storage.onDisk ? (
            <div className="field-row">
              <code>{storage.folder}</code>
              <button className="btn small" onClick={storage.openFolder}>
                {t('Open folder')}
              </button>
            </div>
          ) : (
            <p className="muted">{t('In this browser only. Start Course Summarizer.exe to keep everything as files in Documents.')}</p>
          )}
        </div>

        <div className="field">
          <span>{t('Backup')}</span>
          <div className="field-row">
            <button className="btn small" onClick={downloadBackup}>
              {t('Download a backup')}
            </button>
            <button className="btn small" onClick={() => restoreInput.current.click()}>
              {t('Restore from a backup')}
            </button>
            <input ref={restoreInput} type="file" accept=".json,application/json" hidden onChange={restoreBackup} />
          </div>
        </div>

        <div className="field">
          <span>{t('Start over')}</span>
          <button className="btn small danger" onClick={reset}>
            {t('Reset all progress')}
          </button>
        </div>
      </section>
    </>
  )
}

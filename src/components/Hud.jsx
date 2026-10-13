import { dayOf, levelInfo, streaks } from '../lib/game.js'
import { INTERFACE_LANGUAGES, t } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'
import { cx } from '../lib/util.js'
import { Icon, Meter } from './ui.jsx'

const TABS = [
  { path: '', label: 'Study', views: ['', 'learn', 'cards', 'quiz'] },
  { path: 'exam', label: 'Mock exam', views: ['exam'] },
  { path: 'sheet', label: 'Cheat sheet', views: ['sheet'] },
  { path: 'courses', label: 'Courses', views: ['courses'] },
  { path: 'stats', label: 'Stats', views: ['stats'] },
]

const ADD_COURSE = '+add'

export function Hud({ view }) {
  const { state, dispatch, gain, library, course, selectCourse, storage } = useGame()
  const level = levelInfo(state.xp)
  const streak = streaks(state).current
  const minutes = Math.floor(dayOf(state).seconds / 60)

  function switchCourse(event) {
    if (event.target.value === ADD_COURSE) {
      window.location.hash = '#/courses/new'
      return
    }
    selectCourse(event.target.value)
    window.location.hash = '#/'
  }

  return (
    <header className="hud no-print">
      <div className="hud-inner">
        <a className="brand" href="#/">
          Course Summarizer
        </a>

        <div className="course-switch">
          <label>
            <span className="sr-only">{t('Course')}</span>
            <select value={course.id} onChange={switchCourse}>
              {library.courses.map(option => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
              <option value={ADD_COURSE}>{t('+ Add a course…')}</option>
            </select>
          </label>

          {/* The language of the interface, and of the course when the course has a translation. */}
          <div className="segmented language" role="group" aria-label={t('Language')}>
            {INTERFACE_LANGUAGES.map(({ code, name }) => (
              <button
                key={code}
                className={cx(state.settings.language === code && 'on')}
                aria-pressed={state.settings.language === code}
                title={name}
                lang={code}
                onClick={() => dispatch({ type: 'settings', patch: { language: code } })}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="hud-stats">
          <span className={cx('stat', streak > 0 && 'lit')} title={t('{streak}-day streak. Study 5 minutes a day to keep it.', { streak })}>
            <Icon name="flame" size={18} />
            {streak}
          </span>
          <span className="stat" title={t('Active study time today, all courses')}>
            <Icon name="clock" size={18} />
            {minutes} min
          </span>
          <a className="level" href="#/stats" title={t('{xp} XP. Next level at {next} XP.', { xp: state.xp, next: level.ceiling })}>
            <span className="level-badge" key={`level-${level.level}`}>
              {level.level}
            </span>
            <span className="level-meta">
              <span className="level-title">{t(level.title)}</span>
              <Meter value={level.progress} label={t('Progress to the next level')} />
            </span>
            {gain && (
              <span className="xp-pop" key={`gain-${gain.id}`}>
                +{gain.amount} XP
              </span>
            )}
          </a>
        </div>

        <nav className="tabs" aria-label={t('Main')}>
          {TABS.map(tab => (
            <a key={tab.path} href={`#/${tab.path}`} className={cx(tab.views.includes(view) && 'on')}>
              {t(tab.label)}
            </a>
          ))}
        </nav>
      </div>

      {storage.onDisk && !storage.connected && (
        <p className="hud-warning" role="alert">
          {t('Course Summarizer is no longer running, so progress is only being kept in this window. Start it again to save it to disk.')}
        </p>
      )}
    </header>
  )
}

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { builtinCourses } from '../data/builtin.js'
import { inLanguage, normalizeCourse } from './courses.js'
import { ACHIEVEMENTS, CHESTS, XP, answerXp, dayOf, levelInfo, progressOf } from './game.js'
import { setLanguage, t } from './i18n.js'
import { createStore } from './storage.js'
import { dayKey } from './util.js'

const TICK_MS = 5000
const IDLE_MS = 90_000
const SAVE_SOON_MS = 1200
const SAVE_LATER_MS = 30_000 // the study clock alone does not need to hit the disk every tick

const FIRST_COURSE = builtinCourses[0].id

const initialState = {
  v: 2,
  xp: 0,
  activeCourse: FIRST_COURSE,
  courses: {}, // course id -> { points, questions, starred, exams }
  names: {}, // course id -> title, so stats can still name a course after it is removed
  days: {}, // 'YYYY-MM-DD' -> { seconds, xp, claimed, courses: { course id -> seconds } }
  hours: Array(24).fill(0), // seconds studied in each hour of the day
  achievements: {}, // id -> day it was unlocked
  stats: { heard: 0, listenSeconds: 0, cards: 0, bestCombo: 0, quizzes: 0, perfect: 0, chests: 0 },
  // language: the language of the interface, and of a course when the course has it. English unless changed.
  settings: { goalMin: 30, language: 'en', voices: {}, rate: 1, autoRead: false },
}

// Version 1 knew only one course and kept its progress at the top level.
function migrateV1(old) {
  const days = Object.fromEntries(
    Object.entries(old.days ?? {}).map(([key, day]) => [key, { ...day, courses: { [FIRST_COURSE]: day.seconds } }]),
  )
  return {
    ...initialState,
    xp: old.xp ?? 0,
    days,
    achievements: old.achievements ?? {},
    stats: { ...initialState.stats, ...old.stats },
    settings: {
      ...initialState.settings,
      goalMin: old.settings?.goalMin ?? 30,
      rate: old.settings?.rate ?? 1,
      autoRead: old.settings?.autoRead ?? false,
      voices: old.settings?.voiceURI ? { en: old.settings.voiceURI } : {},
    },
    courses: {
      [FIRST_COURSE]: {
        points: old.points ?? {},
        questions: old.questions ?? {},
        starred: old.starred ?? {},
        exams: old.exams ?? [],
      },
    },
  }
}

function init(saved) {
  if (!saved || typeof saved !== 'object') return initialState
  if (saved.v !== 2) return migrateV1(saved)
  return {
    ...initialState,
    ...saved,
    hours: Array.isArray(saved.hours) && saved.hours.length === 24 ? saved.hours : initialState.hours,
    stats: { ...initialState.stats, ...saved.stats },
    settings: { ...initialState.settings, ...saved.settings },
  }
}

function patchDay(state, patch) {
  const key = dayKey()
  return { ...state, days: { ...state.days, [key]: { ...dayOf(state, key), ...patch } } }
}

function patchCourse(state, courseId, patch) {
  return { ...state, courses: { ...state.courses, [courseId]: { ...progressOf(state, courseId), ...patch } } }
}

function addXp(state, amount) {
  if (amount <= 0) return state
  return patchDay({ ...state, xp: state.xp + amount }, { xp: dayOf(state).xp + amount })
}

function recordAnswer(state, courseId, id, correct) {
  const questions = progressOf(state, courseId).questions
  const previous = questions[id] ?? { right: 0, wrong: 0 }
  const record = {
    right: previous.right + (correct ? 1 : 0),
    wrong: previous.wrong + (correct ? 0 : 1),
    last: correct,
  }
  return patchCourse(state, courseId, { questions: { ...questions, [id]: record } })
}

// Actions about what you know carry the id of the course they belong to.
function reducer(state, action) {
  const { courseId } = action

  switch (action.type) {
    case 'tick': {
      const day = dayOf(state)
      const after = day.seconds + action.seconds
      const earned = (Math.floor(after / 30) - Math.floor(day.seconds / 30)) * XP.perHalfMinute
      const hours = state.hours.map((seconds, hour) => (hour === action.hour ? seconds + action.seconds : seconds))
      const courses = { ...day.courses, [courseId]: (day.courses?.[courseId] ?? 0) + action.seconds }
      let next = patchDay({ ...state, hours }, { seconds: after, courses })
      if (next.names[courseId] !== action.title) next = { ...next, names: { ...next.names, [courseId]: action.title } }
      if (action.listening) next = { ...next, stats: { ...next.stats, listenSeconds: next.stats.listenSeconds + action.seconds } }
      return addXp(next, earned)
    }

    case 'seen': {
      const points = progressOf(state, courseId).points
      const point = points[action.id]
      let next = state
      if (!point?.seen) {
        next = addXp(patchCourse(state, courseId, { points: { ...points, [action.id]: { box: 0, ...point, seen: true } } }), XP.seen)
      }
      if (action.heard) next = { ...next, stats: { ...next.stats, heard: next.stats.heard + 1 } }
      return next
    }

    case 'rate': {
      const points = progressOf(state, courseId).points
      const box = action.knew ? Math.min(3, (points[action.id]?.box ?? 0) + 1) : 0
      const next = patchCourse(state, courseId, { points: { ...points, [action.id]: { seen: true, box } } })
      const stats = { ...next.stats, cards: next.stats.cards + 1 }
      return addXp({ ...next, stats }, action.knew ? XP.cardKnown : XP.cardMissed)
    }

    case 'answer': {
      const next = recordAnswer(state, courseId, action.id, action.correct)
      if (!action.correct) return next
      const stats = { ...next.stats, bestCombo: Math.max(next.stats.bestCombo, action.combo) }
      return addXp({ ...next, stats }, answerXp(action.combo))
    }

    case 'quizDone': {
      const perfect = action.correct === action.total
      const stats = {
        ...state.stats,
        quizzes: state.stats.quizzes + 1,
        perfect: state.stats.perfect + (perfect ? 1 : 0),
      }
      return addXp({ ...state, stats }, XP.quizDone + (perfect ? XP.quizPerfect : 0))
    }

    case 'examDone': {
      let next = state
      for (const result of action.results) {
        if (result.answered) next = recordAnswer(next, courseId, result.id, result.correct)
      }
      const score = action.results.filter(result => result.correct).length
      const exam = { day: dayKey(), score, total: action.results.length, seconds: action.seconds }
      next = patchCourse(next, courseId, { exams: [...progressOf(next, courseId).exams, exam] })
      return addXp(next, XP.examDone + score * XP.examCorrect)
    }

    case 'star': {
      const starred = { ...progressOf(state, courseId).starred }
      if (starred[action.id]) delete starred[action.id]
      else starred[action.id] = true
      return patchCourse(state, courseId, { starred })
    }

    case 'claim': {
      const day = dayOf(state)
      const chest = CHESTS.find(c => c.minutes === action.minutes)
      if (!chest || day.claimed.includes(chest.minutes) || day.seconds < chest.minutes * 60) return state
      const next = patchDay(state, { claimed: [...day.claimed, chest.minutes] })
      return addXp({ ...next, stats: { ...next.stats, chests: next.stats.chests + 1 } }, chest.xp)
    }

    case 'unlock': {
      const achievements = { ...state.achievements }
      for (const id of action.ids) achievements[id] = dayKey()
      return { ...state, achievements }
    }

    case 'selectCourse':
      return { ...state, activeCourse: action.id }

    case 'settings':
      return { ...state, settings: { ...state.settings, ...action.patch } }

    case 'restore':
      return init(action.saved)

    case 'reset':
      return { ...initialState, activeCourse: state.activeCourse, settings: state.settings }

    default:
      return state
  }
}

// The built-in courses plus every course file that could be read. Files that could not are
// reported, not dropped silently.
function buildLibrary(files) {
  const courses = builtinCourses.map(raw => normalizeCourse(raw, { builtin: true }))
  const problems = []
  for (const file of files) {
    try {
      if (file.raw === null) throw new Error(t('It is not valid JSON.'))
      const course = normalizeCourse(file.raw)
      if (courses.some(existing => existing.id === course.id)) throw new Error(t('Another course already uses the id "{id}".', { id: course.id }))
      courses.push(course)
    } catch (error) {
      problems.push({ name: file.name, message: error.message })
    }
  }
  return { courses, problems }
}

const GameContext = createContext(null)

export function useGame() {
  return useContext(GameContext)
}

export function GameProvider({ boot, children }) {
  const store = useMemo(() => createStore(boot.server), [boot.server])
  const [state, rawDispatch] = useReducer(reducer, boot.saved, init)
  // Everything rendered below reads its words in this language.
  setLanguage(state.settings.language)
  const [library, setLibrary] = useState(() => buildLibrary(boot.files))
  const [toasts, setToasts] = useState([])
  const [gain, setGain] = useState(null)
  const [connected, setConnected] = useState(true)
  const previous = useRef(state)
  const lastAction = useRef('')

  // The active course, in the preferred language if it has a translation. Ids are the same in
  // every language, so progress is shared between them.
  const chosen = library.courses.find(candidate => candidate.id === state.activeCourse) ?? library.courses[0]
  const course = useMemo(() => inLanguage(chosen, state.settings.language), [chosen, state.settings.language])
  const progress = progressOf(state, course.id)

  // Views dispatch plain actions; the active course is filled in here.
  const dispatch = useCallback(
    action => {
      lastAction.current = action.type
      rawDispatch({ courseId: course.id, ...action })
    },
    [course.id],
  )

  const toast = useCallback(message => {
    const id = crypto.randomUUID()
    setToasts(list => [...list, { id, ...message }])
    setTimeout(() => setToasts(list => list.filter(item => item.id !== id)), 5000)
  }, [])

  // Save every change, and celebrate what the change unlocked.
  useEffect(() => {
    const before = previous.current
    previous.current = state
    if (before === state) return

    store.save(state, lastAction.current === 'tick' ? SAVE_LATER_MS : SAVE_SOON_MS)

    if (state.xp > before.xp) setGain({ id: state.xp, amount: state.xp - before.xp })

    const level = levelInfo(state.xp)
    if (level.level > levelInfo(before.xp).level) {
      toast({ kind: 'level', icon: level.level, title: t('Level {level}', level), text: t('You are now a {title}.', { title: t(level.title) }) })
    }

    for (const achievement of ACHIEVEMENTS) {
      if (state.achievements[achievement.id] && !before.achievements[achievement.id]) {
        toast({ kind: 'trophy', icon: achievement.icon, title: t(achievement.name), text: t(achievement.desc) })
      }
    }

    const minutesBefore = Math.floor(dayOf(before).seconds / 60)
    const minutesNow = Math.floor(dayOf(state).seconds / 60)
    for (const chest of CHESTS) {
      if (minutesBefore < chest.minutes && minutesNow >= chest.minutes) {
        toast({ kind: 'chest', icon: '🎁', title: t('{minutes} minutes studied', chest), text: t('Collect +{xp} XP on the Study page.', chest) })
      }
    }

    const earned = ACHIEVEMENTS.filter(a => !state.achievements[a.id] && a.test(state, library.courses))
    if (earned.length > 0) rawDispatch({ type: 'unlock', ids: earned.map(a => a.id) })
  }, [state, library, store, toast])

  // The study clock: time only counts while you are here and doing something, or listening.
  const active = useRef(course)
  useEffect(() => {
    active.current = course
  })

  useEffect(() => {
    let lastInput = Date.now()
    let lastTick = Date.now()
    let carry = 0
    const onInput = () => {
      lastInput = Date.now()
    }
    const inputs = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart']
    for (const name of inputs) window.addEventListener(name, onInput, { passive: true })

    const timer = setInterval(() => {
      const now = Date.now()
      const elapsed = Math.min(now - lastTick, TICK_MS * 3) / 1000
      lastTick = now
      const listening = Boolean(window.speechSynthesis?.speaking)
      const attending = document.visibilityState === 'visible' && now - lastInput < IDLE_MS
      if (!listening && !attending) return
      carry += elapsed
      const whole = Math.floor(carry)
      carry -= whole
      if (whole === 0) return
      lastAction.current = 'tick'
      rawDispatch({
        type: 'tick',
        seconds: whole,
        courseId: active.current.id,
        title: active.current.title,
        hour: new Date().getHours(),
        listening,
      })
    }, TICK_MS)

    return () => {
      clearInterval(timer)
      for (const name of inputs) window.removeEventListener(name, onInput)
    }
  }, [])

  // Keep the launcher informed that the window is still open, and write the last changes
  // to disk when it is hidden or closed.
  useEffect(() => {
    store.onStatus(setConnected)
    // Progress made while the launcher was not running goes to disk straight away.
    if (boot.browserIsNewer) store.save(previous.current, 0)
    const heartbeat = setInterval(store.ping, 20_000)
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') store.flush()
    }
    document.addEventListener('visibilitychange', flushWhenHidden)
    window.addEventListener('pagehide', store.flush)
    return () => {
      clearInterval(heartbeat)
      document.removeEventListener('visibilitychange', flushWhenHidden)
      window.removeEventListener('pagehide', store.flush)
    }
  }, [store, boot.browserIsNewer])

  const value = useMemo(() => {
    // Adds a course from its raw JSON, or replaces the added course with the same id.
    async function addCourse(raw) {
      const added = normalizeCourse(raw)
      if (builtinCourses.some(builtin => builtin.id === added.id)) {
        throw new Error(t('"{title}" has the same id as a built-in course. Give it a different "id".', added))
      }
      // The id is saved with the course, so renaming it later does not detach its progress.
      await store.saveCourse(added.id, { ...raw, id: added.id })
      setLibrary(current => ({ ...current, courses: [...current.courses.filter(existing => existing.id !== added.id), added] }))
      return added
    }

    // Progress is kept, so adding the course again later picks up where you left off.
    async function removeCourse(id) {
      await store.removeCourse(id)
      setLibrary(current => ({ ...current, courses: current.courses.filter(existing => existing.id !== id) }))
    }

    return {
      state,
      dispatch,
      toasts,
      gain,
      library,
      course,
      progress,
      addCourse,
      removeCourse,
      selectCourse: id => rawDispatch({ type: 'selectCourse', id }),
      storage: { onDisk: boot.server, folder: boot.folder, connected, openFolder: store.openFolder },
    }
  }, [state, dispatch, toasts, gain, library, course, progress, store, boot.server, boot.folder, connected])

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

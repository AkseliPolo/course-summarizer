import { dayKey } from './util.js'

// The player's profile (XP, level, time, streaks, achievements) is shared by every course.
// What you know (reviewed points, answers, stars, exam results) is kept per course.

// ---- XP ---------------------------------------------------------------

export const XP = {
  perHalfMinute: 1, // active study time
  seen: 5, // first time a key point is reviewed
  cardKnown: 4,
  cardMissed: 1,
  quizDone: 15,
  quizPerfect: 25,
  examDone: 50,
  examCorrect: 5,
}

// A correct answer is worth 10 XP, plus 2 for every answer already in the streak (max +10).
export function answerXp(combo) {
  return 10 + Math.min(Math.max(combo - 1, 0), 5) * 2
}

// ---- Levels -----------------------------------------------------------

const TITLES = [
  'Fresh Start',
  'Note Taker',
  'Quick Learner',
  'Steady Hand',
  'Sharp Mind',
  'Deep Diver',
  'Pattern Spotter',
  'Problem Solver',
  'Night Scholar',
  'Promise Keeper',
  'Exam Slayer',
  'Grand Master',
]

// Total XP needed to reach a level: 0, 100, 250, 450, 700, 1000 ...
export function levelFloor(level) {
  return 25 * (level - 1) * (level + 2)
}

export function levelInfo(xp) {
  let level = 1
  while (xp >= levelFloor(level + 1)) level++
  const floor = levelFloor(level)
  const ceiling = levelFloor(level + 1)
  return {
    level,
    title: TITLES[Math.min(level, TITLES.length) - 1],
    floor,
    ceiling,
    progress: (xp - floor) / (ceiling - floor),
  }
}

// ---- Time -------------------------------------------------------------

export const CHESTS = [
  { minutes: 10, xp: 20 },
  { minutes: 25, xp: 40 },
  { minutes: 45, xp: 60 },
  { minutes: 60, xp: 80 },
  { minutes: 90, xp: 120 },
]

const emptyDay = { seconds: 0, xp: 0, claimed: [], courses: {} }

export function dayOf(state, key = dayKey()) {
  return state.days[key] ?? emptyDay
}

export function totalSeconds(state) {
  return Object.values(state.days).reduce((sum, day) => sum + day.seconds, 0)
}

export function courseSeconds(state, courseId) {
  return Object.values(state.days).reduce((sum, day) => sum + (day.courses?.[courseId] ?? 0), 0)
}

const STREAK_SECONDS = 5 * 60
const DAY_MS = 86_400_000

// A day counts towards a streak once it has five minutes of study.
// current: today only counts once it is earned, but an unfinished today does not break yesterday's streak.
export function streaks(state) {
  const studied = key => dayOf(state, key).seconds >= STREAK_SECONDS

  const cursor = new Date()
  if (!studied(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let current = 0
  while (studied(dayKey(cursor))) {
    current++
    cursor.setDate(cursor.getDate() - 1)
  }

  let longest = 0
  let run = 0
  let previous = null
  for (const key of Object.keys(state.days).filter(studied).sort()) {
    const time = new Date(`${key}T12:00:00`).getTime()
    run = previous !== null && Math.round((time - previous) / DAY_MS) === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
    previous = time
  }

  return { current, longest: Math.max(longest, current) }
}

// ---- Mastery ----------------------------------------------------------

const emptyProgress = { points: {}, questions: {}, starred: {}, exams: [] }

export function progressOf(state, courseId) {
  return state.courses[courseId] ?? emptyProgress
}

// unseen 0 · reviewed 0.25 · recalled once 0.5 · twice 0.75 · three times 1
function strength(record) {
  return record?.seen ? (1 + record.box) / 4 : 0
}

export function unitProgress(progress, unit) {
  const seen = unit.points.filter(point => progress.points[point.id]?.seen).length
  const recall = unit.points.reduce((sum, point) => sum + strength(progress.points[point.id]), 0) / unit.points.length
  const right = unit.questions.filter(question => progress.questions[question.id]?.last).length
  return {
    seen,
    total: unit.points.length,
    right,
    questions: unit.questions.length,
    // Half from recalling the key points, half from answering the questions correctly.
    mastery: unit.questions.length > 0 ? (recall + right / unit.questions.length) / 2 : recall,
  }
}

export function readiness(progress, course) {
  return course.units.reduce((sum, unit) => sum + unitProgress(progress, unit).mastery, 0) / course.units.length
}

// ---- Lifetime totals --------------------------------------------------

// Counts over every course ever studied, including ones that have since been removed.
export function lifetime(state) {
  const all = Object.values(state.courses)
  const points = all.flatMap(progress => Object.values(progress.points))
  const answers = all.flatMap(progress => Object.values(progress.questions))
  const exams = all.flatMap(progress => progress.exams)
  const right = answers.reduce((sum, record) => sum + record.right, 0)
  const wrong = answers.reduce((sum, record) => sum + record.wrong, 0)
  const days = Object.entries(state.days).filter(([, day]) => day.seconds > 0)
  const best = days.reduce((top, entry) => (entry[1].seconds > top[1].seconds ? entry : top), ['', { seconds: 0 }])

  return {
    seconds: totalSeconds(state),
    studyDays: days.length,
    bestDay: { key: best[0], seconds: best[1].seconds },
    reviewed: points.filter(point => point.seen).length,
    mastered: points.filter(point => point.box >= 3).length,
    starred: all.reduce((sum, progress) => sum + Object.keys(progress.starred).length, 0),
    answers: right + wrong,
    right,
    exams: exams.length,
    bestExam: Math.max(0, ...exams.map(exam => exam.score / exam.total)),
  }
}

// ---- Achievements -----------------------------------------------------

// Each test gets the saved state and the list of courses currently in the library.
const inSomeCourse = (state, courses, test) => courses.some(course => test(progressOf(state, course.id), course))
const longestDay = state => Math.max(0, ...Object.values(state.days).map(day => day.seconds))
const coursesStudied = state =>
  new Set(Object.values(state.days).flatMap(day => Object.entries(day.courses ?? {}).filter(([, seconds]) => seconds >= 60).map(([id]) => id))).size

const HOUR = 3600

export const ACHIEVEMENTS = [
  { id: 'first-xp', icon: '👋', name: 'Hello, World', desc: 'Earn your first XP.', test: s => s.xp > 0 },
  { id: 'heard-25', icon: '🎧', name: 'Podcast mode', desc: 'Listen to 25 key points read aloud.', test: s => s.stats.heard >= 25 },
  { id: 'heard-100', icon: '📻', name: 'Audiophile', desc: 'Listen to 100 key points read aloud.', test: s => s.stats.heard >= 100 },
  {
    id: 'core-seen',
    icon: '🧭',
    name: 'Essentials covered',
    desc: 'Review every must-know point of a course.',
    test: (s, courses) =>
      inSomeCourse(s, courses, (progress, course) => {
        const core = course.points.filter(point => point.core)
        return core.length > 0 && core.every(point => progress.points[point.id]?.seen)
      }),
  },
  {
    id: 'all-seen',
    icon: '📚',
    name: 'Cover to cover',
    desc: 'Review every key point of a course.',
    test: (s, courses) => inSomeCourse(s, courses, (progress, course) => course.points.every(point => progress.points[point.id]?.seen)),
  },
  { id: 'cards-50', icon: '🃏', name: 'Card shark', desc: 'Rate 50 flashcards.', test: s => s.stats.cards >= 50 },
  { id: 'combo-5', icon: '🔥', name: 'On a roll', desc: 'Answer 5 questions correctly in a row.', test: s => s.stats.bestCombo >= 5 },
  { id: 'combo-10', icon: '⚡', name: 'Unstoppable', desc: 'Answer 10 questions correctly in a row.', test: s => s.stats.bestCombo >= 10 },
  { id: 'perfect', icon: '💎', name: 'Flawless', desc: 'Finish a quiz without a single mistake.', test: s => s.stats.perfect >= 1 },
  {
    id: 'unit-80',
    icon: '⛰️',
    name: 'Unit conquered',
    desc: 'Reach 80% mastery in any unit.',
    test: (s, courses) => inSomeCourse(s, courses, (progress, course) => course.units.some(unit => unitProgress(progress, unit).mastery >= 0.8)),
  },
  {
    id: 'all-80',
    icon: '🏔️',
    name: 'Every summit',
    desc: 'Reach 80% mastery in every unit of a course.',
    test: (s, courses) => inSomeCourse(s, courses, (progress, course) => course.units.every(unit => unitProgress(progress, unit).mastery >= 0.8)),
  },
  { id: 'time-30', icon: '⏱️', name: 'Half-hour hero', desc: 'Study for 30 minutes in one day.', test: s => longestDay(s) >= 30 * 60 },
  { id: 'time-90', icon: '🎯', name: 'Exam-length focus', desc: 'Study for 90 minutes in one day.', test: s => longestDay(s) >= 90 * 60 },
  { id: 'chests', icon: '🗝️', name: 'Treasure hunter', desc: 'Collect all five time rewards in one day.', test: s => Object.values(s.days).some(day => day.claimed.length >= CHESTS.length) },
  { id: 'streak-2', icon: '📆', name: 'Back for more', desc: 'Study two days in a row.', test: s => streaks(s).longest >= 2 },
  { id: 'streak-7', icon: '🗓️', name: 'One week strong', desc: 'Study seven days in a row.', test: s => streaks(s).longest >= 7 },
  { id: 'total-5h', icon: '🕔', name: 'Five-hour club', desc: 'Study for five hours in total.', test: s => totalSeconds(s) >= 5 * HOUR },
  { id: 'total-24h', icon: '🌍', name: 'Around the clock', desc: 'Study for 24 hours in total.', test: s => totalSeconds(s) >= 24 * HOUR },
  { id: 'listen-30', icon: '🔊', name: 'Good listener', desc: 'Spend 30 minutes listening to key points.', test: s => s.stats.listenSeconds >= 30 * 60 },
  { id: 'courses-2', icon: '🎒', name: 'Double major', desc: 'Study two different courses.', test: s => coursesStudied(s) >= 2 },
  { id: 'sheet-10', icon: '✍️', name: 'Cheat sheet architect', desc: 'Star 10 points for a cheat sheet.', test: s => lifetime(s).starred >= 10 },
  { id: 'exam-done', icon: '📝', name: 'Dress rehearsal', desc: 'Finish a full mock exam.', test: s => lifetime(s).exams > 0 },
  { id: 'exam-80', icon: '🎓', name: 'Exam ready', desc: 'Score 80% or more in a mock exam.', test: s => lifetime(s).bestExam >= 0.8 },
  { id: 'level-5', icon: '⭐', name: 'Sharp Mind', desc: 'Reach level 5.', test: s => levelInfo(s.xp).level >= 5 },
  { id: 'level-10', icon: '🌟', name: 'Promise Keeper', desc: 'Reach level 10.', test: s => levelInfo(s.xp).level >= 10 },
]

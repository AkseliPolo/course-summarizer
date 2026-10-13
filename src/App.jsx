import { useEffect } from 'react'
import { Hud } from './components/Hud.jsx'
import { Toasts } from './components/Toasts.jsx'
import { useRoute } from './lib/hooks.js'
import { useSpeech } from './lib/speech.jsx'
import { useGame } from './lib/store.jsx'
import CourseEditor from './views/CourseEditor.jsx'
import Courses from './views/Courses.jsx'
import Exam from './views/Exam.jsx'
import Flashcards from './views/Flashcards.jsx'
import Home from './views/Home.jsx'
import Learn from './views/Learn.jsx'
import Quiz from './views/Quiz.jsx'
import Sheet from './views/Sheet.jsx'
import Stats from './views/Stats.jsx'

// Routes live in the URL hash: #/learn/w3, #/cards/core, #/quiz/mix, #/exam, #/courses/new ...
// The pages about one course are keyed by it and its language, so switching either starts them afresh.
function pageFor([view, arg, extra], course) {
  const unit = course.unitById[arg]
  const key = `${course.id}/${course.lang}/${arg}`
  const hasCore = course.points.some(point => point.core)

  if (view === 'learn' && unit) return <Learn key={key} unit={unit} />
  if (view === 'cards' && (unit || arg === 'all' || (arg === 'core' && hasCore))) return <Flashcards key={key} scope={arg} />
  if (view === 'quiz' && (unit ? unit.questions.length > 0 : arg === 'mix' && course.questions.length > 0)) {
    return <Quiz key={key} scope={arg} />
  }
  if (view === 'exam') return <Exam key={`${course.id}/${course.lang}`} />
  if (view === 'sheet') return <Sheet />
  if (view === 'courses' && arg === 'new') return <CourseEditor key="new" />
  if (view === 'courses' && arg === 'edit') return <CourseEditor key={extra} editId={extra} />
  if (view === 'courses') return <Courses />
  if (view === 'stats' || view === 'progress') return <Stats />
  return <Home />
}

export default function App() {
  const route = useRoute()
  const [view = '', arg] = route
  const { state, course } = useGame()
  const { stop } = useSpeech()
  const { language } = state.settings

  useEffect(() => {
    document.title = `Course Summarizer · ${course.title}`
  }, [course.title])

  // Tells the browser and screen readers which language the interface is in.
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  // Stop reading aloud when the page, the course or its language changes.
  useEffect(() => stop, [view, arg, course.id, course.lang, stop])

  return (
    <>
      <Hud view={view === 'progress' ? 'stats' : view} />
      <main className="page">{pageFor(route, course)}</main>
      <Toasts />
    </>
  )
}

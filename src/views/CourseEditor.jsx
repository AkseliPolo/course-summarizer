import { useMemo, useRef, useState } from 'react'
import { Icon } from '../components/ui.jsx'
import { AI_PROMPT, normalizeCourse } from '../lib/courses.js'
import { courseToText, exampleText, parseCourseText } from '../lib/courseText.js'
import { count, interfaceLanguage, languageName, t, tx } from '../lib/i18n.js'
import { useGame } from '../lib/store.jsx'

const LANGUAGES = ['en', 'fi', 'sv', 'de', 'fr', 'es']
const SHOWN_TERMS = 8
const PLACEHOLDER =
  '# Week 1: Relational model\nPrimary key: A column that identifies exactly one row.\nForeign key: A column that refers to the primary key of another table.\n\n? What does a primary key guarantee?\n+ Every row can be identified uniquely\n- The table is sorted'

const capital = word => word.charAt(0).toUpperCase() + word.slice(1)

// An AI assistant usually wraps its answer in a code fence or a sentence. If the text holds
// a JSON object, this returns { value } or { error }; if it is not JSON at all, null.
function readJson(text) {
  const trimmed = text.trim()
  if (!/^(```|\{)/.test(trimmed) && !/"units"\s*:/.test(trimmed)) return null
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end < start) return { error: t('This looks like a course file, but it has no complete { ... } object.') }
  try {
    return { value: JSON.parse(trimmed.slice(start, end + 1)) }
  } catch (error) {
    return { error: t('This looks like a course file, but it is not valid JSON: {message}', error) }
  }
}

// What the text in the box would become: { course, raw, notes } or { error, notes }.
function readDraft(text, fields, existing) {
  if (text.trim() === '') return { empty: true, notes: [] }

  const json = readJson(text)
  if (json?.error) return { error: json.error, notes: [], isFile: true }

  let raw
  let notes = []
  if (json) {
    raw = existing ? { ...json.value, id: existing.id } : json.value
  } else {
    const parsed = parseCourseText(text)
    notes = parsed.problems
    raw = {
      ...parsed.raw,
      id: existing?.id,
      // Details written in the text itself win over the fields above it.
      title: parsed.raw.title || fields.title.trim(),
      lang: parsed.raw.lang || fields.lang,
      examDate: parsed.raw.examDate || fields.examDate,
      code: parsed.raw.code || existing?.code,
      examQuestions: existing?.examQuestions,
      examMinutes: existing?.examMinutes,
    }
    if (raw.units.length === 0) return { error: t('No key points yet. Write one as "Term: explanation".'), notes }
  }

  try {
    return { course: normalizeCourse(raw), raw, notes, isFile: Boolean(json) }
  } catch (error) {
    return { error: error.message, notes, isFile: Boolean(json) }
  }
}

// editId: the id of an added course to change, or nothing to make a new one.
export default function CourseEditor({ editId }) {
  const { library, addCourse, selectCourse } = useGame()
  const existing = library.courses.find(course => course.id === editId && !course.builtin)
  const [title, setTitle] = useState(existing?.title ?? '')
  // A new course starts in the language you are using the app in.
  const [lang, setLang] = useState(existing?.lang ?? interfaceLanguage())
  const [examDate, setExamDate] = useState(existing?.examDate ?? '')
  const [text, setText] = useState(() => (existing ? courseToText(existing) : ''))
  const [message, setMessage] = useState(null) // { ok, text }
  const fileInput = useRef(null)

  // The messages in a draft are written in the language of the interface, so it is read again when that changes.
  const shownIn = interfaceLanguage()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draft = useMemo(() => readDraft(text, { title, lang, examDate }, existing), [text, title, lang, examDate, existing, shownIn])
  const languages = LANGUAGES.includes(lang) ? LANGUAGES : [...LANGUAGES, lang]

  async function openFile(event) {
    const file = event.target.files[0]
    event.target.value = ''
    if (!file) return
    setText(await file.text())
    setMessage(null)
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(AI_PROMPT)
      setMessage({ ok: true, text: t('Prompt copied. Paste it into an AI assistant, add your notes or slides after it, then paste the whole answer into the box.') })
    } catch {
      setMessage({ ok: false, text: t('The prompt could not be copied from this window.') })
    }
  }

  async function save() {
    if (!draft.course) return
    const clash = library.courses.find(course => course.id === draft.course.id && course.id !== existing?.id)
    if (clash?.builtin) {
      setMessage({ ok: false, text: t('"{title}" is a built-in course. Give yours a different name.', clash) })
      return
    }
    if (clash && !window.confirm(t('You already have a course called "{title}". Replace it? Your progress in it is kept.', clash))) return
    try {
      const saved = await addCourse(draft.raw)
      selectCourse(saved.id)
      window.location.hash = '#/'
    } catch (error) {
      setMessage({ ok: false, text: error.message })
    }
  }

  return (
    <>
      <header className="page-head">
        <a className="back" href="#/courses">
          <Icon name="back" size={18} />
          {t('Courses')}
        </a>
        <h1>{existing ? t('Edit {title}', existing) : t('Add a course')}</h1>
        <p className="lede">
          {tx(
            'Type or paste your notes below. Every line written as {format} becomes a key point that can be read aloud, turned into a flashcard and starred for your cheat sheet.',
            { format: <code>{t('Term: explanation')}</code> },
          )}
        </p>
      </header>

      <section className="editor">
        <div className="card editor-main">
          <div className="editor-fields">
            <label>
              <span>{t('Course name')}</span>
              <input value={title} onChange={event => setTitle(event.target.value)} placeholder={t('Database basics')} disabled={draft.isFile} />
            </label>
            <label>
              <span>{t('Language')}</span>
              <select value={lang} onChange={event => setLang(event.target.value)} disabled={draft.isFile}>
                {languages.map(code => (
                  <option key={code} value={code}>
                    {capital(languageName(code))}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>{t('Exam date (optional)')}</span>
              <input type="date" value={examDate} onChange={event => setExamDate(event.target.value)} disabled={draft.isFile} />
            </label>
          </div>
          {draft.isFile && <p className="muted">{t('This is a complete course file, so its own name, language and exam date are used.')}</p>}

          <label className="paste">
            <span>{t('Course content')}</span>
            <textarea
              rows={18}
              value={text}
              onChange={event => setText(event.target.value)}
              placeholder={t(PLACEHOLDER)}
              spellCheck={false}
            />
          </label>

          <div className="actions">
            <button className="btn primary" onClick={save} disabled={!draft.course}>
              {existing ? t('Save changes') : t('Add this course')}
            </button>
            {!existing && (
              <button className="btn" onClick={() => setText(exampleText())}>
                {t('Show me an example')}
              </button>
            )}
            <button className="btn" onClick={() => fileInput.current.click()}>
              {t('Open a file')}
            </button>
            <input ref={fileInput} type="file" accept=".txt,.md,.json,text/plain,application/json" hidden onChange={openFile} />
            <button className="btn" onClick={copyPrompt}>
              {t('Copy the AI prompt')}
            </button>
          </div>

          {message && (
            <p className={`status ${message.ok ? 'ok' : 'error'}`} role="status">
              {message.text}
            </p>
          )}
        </div>

        <aside className="editor-side">
          <div className="card preview" aria-live="polite">
            <p className="eyebrow">{t('Preview')}</p>
            {draft.empty && <p className="muted">{t('What you write appears here as units, key points and questions.')}</p>}
            {draft.error && <p className="status error">{draft.error}</p>}
            {draft.course && (
              <>
                <h2>{draft.course.title}</h2>
                <p className="muted">
                  {count(draft.course.units.length, 'unit')} · {count(draft.course.points.length, 'key point')} ·{' '}
                  {count(draft.course.questions.length, 'question')}
                </p>
                <ol className="outline">
                  {draft.course.units.map(unit => (
                    <li key={unit.id}>
                      <strong>
                        {unit.label}: {unit.title}
                      </strong>
                      <span className="muted">
                        {count(unit.points.length, 'key point')}, {count(unit.questions.length, 'question')}
                      </span>
                      <p>
                        {unit.points
                          .slice(0, SHOWN_TERMS)
                          .map(point => point.term)
                          .join(' · ')}
                        {unit.points.length > SHOWN_TERMS && ' · ' + t('and {more} more', { more: unit.points.length - SHOWN_TERMS })}
                      </p>
                    </li>
                  ))}
                </ol>
              </>
            )}
            {draft.notes.length > 0 && (
              <ul className="notes">
                {draft.notes.map(note => (
                  <li key={`${note.line}-${note.text}`}>
                    <strong>{t('Line {line}:', note)}</strong> {note.text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card format">
            <h2>{t('How to write it')}</h2>
            <dl>
              <dt>
                <code>{t('# Week 1: Title')}</code>
              </dt>
              <dd>{t('starts a unit')}</dd>
              <dt>
                <code>{t('## Topic')}</code>
              </dt>
              <dd>{t('groups points inside a unit (optional)')}</dd>
              <dt>
                <code>{t('Term: explanation')}</code>
              </dt>
              <dd>{tx('a key point. Put {mark} in front if it is must-know', { mark: <code>!</code> })}</dd>
              <dt>
                <code>{t('? Question')}</code>
              </dt>
              <dd>
                {tx('a question, followed by {right}, {wrong} lines and an optional {why}', {
                  right: <code>{t('+ right answer')}</code>,
                  wrong: <code>{t('- wrong answer')}</code>,
                  why: <code>{t('= why')}</code>,
                })}
              </dd>
              <dt>
                <code>```</code>
              </dt>
              <dd>{t('a line of three backticks before and after a code example, placed under its point or question')}</dd>
            </dl>
            <p className="muted">
              {t("Bullet lists pasted from notes work too. With the AI prompt, paste the assistant's whole answer into the box; it is recognised automatically.")}
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}

import { t } from './i18n.js'
import { hash, slug } from './util.js'

function fail(message) {
  throw new Error(message)
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// Code keeps its indentation; only empty lines around it are dropped.
function codeOf(value) {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  return value.replace(/^\s*\n/, '').replace(/\s+$/, '')
}

function positiveInt(value, fallback) {
  return Number.isInteger(value) && value > 0 ? value : fallback
}

function unique(base, taken) {
  let id = base
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`
  taken.add(id)
  return id
}

const languageCode = lang => lang.toLowerCase().split('-')[0]
const sameWords = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase()

const DEFAULT_NAMES = {
  en: { week: 'Week', unit: 'Unit', topic: 'Topic' },
  fi: { week: 'Viikko', unit: 'Osio', topic: 'Aihe' },
}

// ---- Translations ----
// A course can carry its content in more languages: translations: { fi: { title, units: [...] } }.
// A translation follows the course item by item, in the same order, and only holds the words:
// ids, code examples, must-know marks and correct answers come from the course itself. Whatever
// a translation leaves out is shown in the course's own language.
// Each item is an object, or the short list form that the built-in translations use.

function readTopic(entry) {
  if (Array.isArray(entry)) return { title: text(entry[0]), points: Array.isArray(entry[1]) ? entry[1] : [] }
  return { title: text(entry?.title), points: Array.isArray(entry?.points) ? entry.points : [] }
}

function readPoint(entry) {
  if (Array.isArray(entry)) return { term: text(entry[0]), text: text(entry[1]), say: text(entry[2]) }
  return { term: text(entry?.term), text: text(entry?.text), say: text(entry?.say) }
}

function readQuestion(entry) {
  if (Array.isArray(entry)) return { q: text(entry[0]), options: Array.isArray(entry[1]) ? entry[1] : [], why: text(entry[2]) }
  return { q: text(entry?.q), options: Array.isArray(entry?.options) ? entry.options : [], why: text(entry?.why) }
}

function assemble(fields, units) {
  const points = units.flatMap(unit => unit.points)
  const questions = units.flatMap(unit => unit.questions)
  return {
    ...fields,
    units,
    points,
    questions,
    unitById: Object.fromEntries(units.map(unit => [unit.id, unit])),
    questionById: Object.fromEntries(questions.map(question => [question.id, question])),
  }
}

// The same course with its words in another language. Next to each term it shows the term in
// the course's own language, because that is the word the documentation and the code use.
function translate(base, lang, translation) {
  const units = base.units.map((unit, unitIndex) => {
    const unitWords = translation.units?.[unitIndex] ?? {}
    const topics = unit.topics.map(topic => {
      const topicWords = readTopic(unitWords.topics?.[topic.at])
      const title = topicWords.title || topic.title
      const points = topic.points.map((point, pointIndex) => {
        const words = readPoint(topicWords.points[pointIndex])
        const term = words.term || point.term
        return {
          ...point,
          topic: title,
          term,
          text: words.text || point.text,
          say: words.text ? words.say || undefined : point.say,
          gloss: sameWords(term, point.term) ? undefined : point.term,
        }
      })
      return { ...topic, title, points }
    })
    const questions = unit.questions.map((question, questionIndex) => {
      const words = readQuestion(unitWords.questions?.[questionIndex])
      return {
        ...question,
        q: words.q || question.q,
        options: question.options.map((option, optionIndex) => text(words.options[optionIndex]) || option),
        why: words.why || question.why,
      }
    })
    return {
      ...unit,
      label: text(unitWords.label) || unit.label,
      title: text(unitWords.title) || unit.title,
      blurb: text(unitWords.blurb) || unit.blurb,
      topics,
      points: topics.flatMap(topic => topic.points),
      questions,
    }
  })
  return assemble({ ...base, lang, title: text(translation.title) || base.title }, units)
}

// Turns a raw course (the JSON format described on the Courses page) into the shape the app
// works with. Throws an Error that says what is wrong, in words a person can act on.
export function normalizeCourse(raw, { builtin = false } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) fail(t('The file must contain one course object.'))
  const title = text(raw.title) || fail(t('The course needs a name.'))
  const id = slug(text(raw.id) || title) || fail(t('The course name must contain letters or numbers.'))
  if (!Array.isArray(raw.units) || raw.units.length === 0) fail(t('The course needs at least one unit with key points.'))

  const lang = text(raw.lang) || 'en'
  const translations = Object.entries(raw.translations && typeof raw.translations === 'object' ? raw.translations : {})
    .filter(([code, words]) => words && typeof words === 'object' && languageCode(code) !== languageCode(lang))
    .map(([code, words]) => [languageCode(code), words])

  // Units and topics without a name are numbered in the course's own language.
  const names = DEFAULT_NAMES[languageCode(lang)] ?? DEFAULT_NAMES.en

  const unitIds = new Set()
  const pointIds = new Set()
  const questionIds = new Set()

  const units = raw.units.map((rawUnit, index) => {
    const where = t('Unit {n}', { n: index + 1 })
    if (!rawUnit || typeof rawUnit !== 'object') fail(t('{where} must be an object.', { where }))
    const unitTitle = text(rawUnit.title) || fail(t('{where} needs a title.', { where }))
    const unitId = unique(slug(text(rawUnit.id)) || `u${index + 1}`, unitIds)

    // A unit either groups its points into topics, or lists the points directly.
    const rawTopics = Array.isArray(rawUnit.topics)
      ? rawUnit.topics
      : Array.isArray(rawUnit.points)
        ? [{ title: unitTitle, points: rawUnit.points }]
        : []

    const topics = rawTopics
      .map((rawTopic, topicIndex) => {
        const topicTitle = text(rawTopic?.title) || `${names.topic} ${topicIndex + 1}`
        const points = (Array.isArray(rawTopic?.points) ? rawTopic.points : []).map((rawPoint, pointIndex) => {
          const term = text(rawPoint?.term) || fail(t('{where}, "{topic}", point {n} needs a term.', { where, topic: topicTitle, n: pointIndex + 1 }))
          return {
            id: unique(`${unitId}/${slug(term) || 'point'}`, pointIds),
            unit: unitId,
            topic: topicTitle,
            term,
            text: text(rawPoint.text) || fail(t('{where}, point "{term}" needs an explanation.', { where, term })),
            code: codeOf(rawPoint.code),
            say: text(rawPoint.say) || undefined,
            // A term worth knowing in another language too, written by the course's author.
            gloss: text(rawPoint.gloss ?? rawPoint.fi) || undefined,
            core: Boolean(rawPoint.core),
          }
        })
        return { title: topicTitle, at: topicIndex, points }
      })
      .filter(topic => topic.points.length > 0)

    const points = topics.flatMap(topic => topic.points)
    if (points.length === 0) fail(t('{where} ("{title}") has no key points.', { where, title: unitTitle }))

    const questions = (Array.isArray(rawUnit.questions) ? rawUnit.questions : []).map((rawQuestion, questionIndex) => {
      const which = t('{where}, question {n}', { where, n: questionIndex + 1 })
      const prompt = text(rawQuestion?.q) || fail(t('{which} needs its question text.', { which }))
      const options = (Array.isArray(rawQuestion.options) ? rawQuestion.options : []).map(option => String(option).trim()).filter(Boolean)
      if (options.length < 2) fail(t('{which} needs at least two answers.', { which }))
      const answer = rawQuestion.answer === undefined ? 0 : rawQuestion.answer
      if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
        fail(t('{which}: "answer" must be the position of the correct option, counting from 0.', { which }))
      }
      const code = codeOf(rawQuestion.code)
      return {
        id: unique(`${unitId}/q-${hash(prompt + (code ?? ''))}`, questionIds),
        unit: unitId,
        q: prompt,
        code,
        options,
        answer,
        why: text(rawQuestion.why),
      }
    })

    return {
      id: unitId,
      label: text(rawUnit.label) || (rawUnit.week ? `${names.week} ${rawUnit.week}` : `${names.unit} ${index + 1}`),
      color: (index % 8) + 1, // which of the eight series colours the unit wears
      title: unitTitle,
      blurb: text(rawUnit.blurb),
      topics,
      points,
      questions,
    }
  })

  const base = assemble(
    {
      id,
      builtin,
      title,
      code: text(raw.code),
      lang,
      languages: [languageCode(lang), ...translations.map(([code]) => code)],
      examDate: /^\d{4}-\d{2}-\d{2}$/.test(raw.examDate) ? raw.examDate : '',
      examQuestions: positiveInt(raw.examQuestions, 40),
      examMinutes: positiveInt(raw.examMinutes, 90),
    },
    units,
  )

  // variants: the same course in each of its other languages, with the same ids throughout,
  // so progress carries over when the language is switched.
  return { ...base, variants: Object.fromEntries(translations.map(([code, words]) => [code, translate(base, code, words)])) }
}

// The course as it should be shown when the reader prefers the given language.
export function inLanguage(course, preferred) {
  return course.variants[languageCode(preferred)] ?? course
}

// An example course file, shown in the file format help and offered as a download.
export const EXAMPLE_COURSE = {
  title: 'Database basics',
  code: 'EXAMPLE-101',
  lang: 'en',
  examDate: '2026-12-10',
  examQuestions: 20,
  examMinutes: 45,
  units: [
    {
      label: 'Week 1',
      title: 'Relational model',
      blurb: 'Tables, keys and how they relate.',
      topics: [
        {
          title: 'Keys',
          points: [
            {
              term: 'Primary key',
              text: 'A column, or set of columns, whose value identifies exactly one row. It must be unique and can never be null.',
              code: 'CREATE TABLE student (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL\n);',
              core: true,
            },
            {
              term: 'Foreign key',
              text: 'A column that refers to the primary key of another table. Use `backticks` around inline code such as `student_id`.',
            },
          ],
        },
      ],
      questions: [
        {
          q: 'What does a primary key guarantee?',
          options: ['Every row can be identified uniquely', 'The table is sorted', 'The column is encrypted', 'Rows cannot be deleted'],
          answer: 0,
          why: 'A primary key is unique and not null, so each value points to exactly one row.',
        },
      ],
    },
  ],
}

// A ready-made request for an AI assistant: paste it together with your course material.
export const AI_PROMPT = `Turn the course material I paste below into a study file for the Course Summarizer app.

Reply with ONE JSON object and nothing else, in exactly this shape:

${JSON.stringify(EXAMPLE_COURSE, null, 2)}

Rules:
- One unit per week or chapter. Give each unit a "label" (for example "Week 3"), a "title" and a one-sentence "blurb".
- Group the key points of each unit into "topics". Aim for 4 to 8 points per topic.
- Each point has a short "term" (it is the front of a flashcard) and a "text" of one to three plain sentences that would make sense read aloud. Put any code example in "code", not in the text. Wrap inline code in the text in backticks.
- Set "core": true on the points a student must know to pass.
- Write 10 to 20 multiple-choice "questions" per unit, each with four "options". "answer" is the position of the correct option, counting from 0. The app shuffles the options, so never write "all of the above". Add a one- or two-sentence "why" that explains the answer. Include questions that ask what a piece of code does, with the code in "code".
- "lang" is the language of the content as a code such as "en" or "fi". "examDate" (YYYY-MM-DD), "examQuestions" and "examMinutes" are optional.
- Cover the whole material evenly, and state only what the material supports.

Course material:
`

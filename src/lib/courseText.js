// A course written as plain text, for typing or pasting notes without any JSON.
//
//   # Week 1: Relational model      a unit ("label: title", or just a title)
//   > Tables, keys and relations.   an optional one-line summary of the unit
//   ## Keys                         a topic inside the unit (optional)
//   Primary key: Identifies a row.  a key point: "term: explanation"
//   ! Foreign key: Refers to ...    the same, marked must-know
//   ```                             a code example for the point or question above it
//   SELECT * FROM student;
//   ```
//   ? What does a key guarantee?    a question
//   + Each row is unique            its correct answer
//   - The table is sorted           wrong answers
//   = Because keys are unique.      why the answer is right (optional)
//
// The reader is forgiving, because notes are messy: bullets (- * •) are accepted in front of a
// point, "term - explanation" works as well as "term: explanation", and a line with neither
// becomes a point named after its first words.

import { interfaceLanguage, t } from './i18n.js'

const HEADER_FIELDS = {
  course: 'title',
  title: 'title',
  kurssi: 'title',
  code: 'code',
  koodi: 'code',
  language: 'lang',
  lang: 'lang',
  kieli: 'lang',
  exam: 'examDate',
  tentti: 'examDate',
}

const LANGUAGE_NAMES = { english: 'en', englanti: 'en', finnish: 'fi', suomi: 'fi', swedish: 'sv', ruotsi: 'sv' }

const TERM_WORDS = 6

function firstWords(sentence) {
  const words = sentence.split(/\s+/)
  const short = words.slice(0, TERM_WORDS).join(' ').replace(/[.,;:!?]+$/, '')
  return words.length > TERM_WORDS ? `${short}…` : short
}

// Returns { raw, problems }: the course in the JSON shape, and notes about lines that were
// skipped or look wrong, each with the number of the line it is about.
export function parseCourseText(source) {
  const raw = { title: '', units: [] }
  const problems = []
  let unit = null
  let topic = null
  let question = null // the question whose answers are being read
  let target = null // the point or question a code example belongs to
  let fence = null // the lines of an open ``` block
  let fenceLine = 0

  const note = (line, message) => problems.push({ line, text: message })

  function closeQuestion() {
    if (!question) return
    const { line, q, code, options, why } = question
    question = null
    const right = options.filter(option => option.right).length
    if (options.length < 2) return note(line, t('This question needs at least two answers: one line starting with + and one or more starting with -. It was left out.'))
    if (right === 0) return note(line, t('This question has no correct answer. Start the right one with +. It was left out.'))
    if (right > 1) return note(line, t('This question has more than one answer starting with +. Keep one. It was left out.'))
    currentUnit().questions.push({ q, code, options: options.map(option => option.text), answer: options.findIndex(option => option.right), why })
  }

  function startUnit(heading) {
    closeQuestion()
    const labelled = /^(.{1,30}?):\s+(.+)$/.exec(heading)
    unit = { title: labelled ? labelled[2].trim() : heading, topics: [], questions: [] }
    if (labelled) unit.label = labelled[1].trim()
    raw.units.push(unit)
    topic = null
    target = null
  }

  function currentUnit() {
    if (!unit) startUnit(t('Key points'))
    return unit
  }

  function currentTopic() {
    const owner = currentUnit()
    if (!topic) {
      topic = { title: owner.title, points: [] }
      owner.topics.push(topic)
    }
    return topic
  }

  function addCode(lines) {
    const code = lines.join('\n')
    if (target) target.code = target.code ? `${target.code}\n${code}` : code
  }

  const lines = source.replace(/\r\n?/g, '\n').split('\n')

  lines.forEach((whole, index) => {
    const number = index + 1

    // Inside a ``` block everything is code, exactly as written.
    if (fence) {
      if (/^\s*```/.test(whole)) {
        addCode(fence)
        fence = null
      } else {
        fence.push(whole)
      }
      return
    }
    if (/^\s*```/.test(whole)) {
      if (!target) note(number, t('This code example has no key point or question above it, so it was left out.'))
      fence = []
      fenceLine = number
      return
    }

    // Lines indented by four spaces or a tab are code too.
    if (target && /^( {4,}|\t)\S/.test(whole)) {
      addCode([whole.replace(/^( {4}|\t)/, '')])
      return
    }

    const line = whole.trim()
    if (line === '') {
      if (question && question.options.length > 0) closeQuestion()
      return
    }

    // Course details, before the first unit.
    const header = !unit && /^([a-z]+)\s*:\s*(.+)$/i.exec(line)
    if (header && HEADER_FIELDS[header[1].toLowerCase()]) {
      const field = HEADER_FIELDS[header[1].toLowerCase()]
      const value = header[2].trim()
      raw[field] = field === 'lang' ? (LANGUAGE_NAMES[value.toLowerCase()] ?? value.toLowerCase()) : value
      return
    }

    if (/^##\s*\S/.test(line)) {
      closeQuestion()
      topic = { title: line.replace(/^##\s*/, ''), points: [] }
      currentUnit().topics.push(topic)
      target = null
      return
    }
    if (/^#\s*\S/.test(line)) {
      startUnit(line.replace(/^#\s*/, ''))
      return
    }
    if (/^>\s*\S/.test(line) && unit && unit.topics.length === 0 && !question) {
      unit.blurb = line.replace(/^>\s*/, '')
      return
    }
    if (/^\?\s*\S/.test(line)) {
      closeQuestion()
      question = { line: number, q: line.replace(/^\?\s*/, ''), options: [], why: '' }
      target = question
      return
    }
    if (question) {
      const answer = /^([+-])\s+(.+)$/.exec(line)
      if (answer) {
        question.options.push({ right: answer[1] === '+', text: answer[2].trim() })
        return
      }
      if (/^=\s*\S/.test(line)) {
        question.why = line.replace(/^=\s*/, '')
        return
      }
      if (question.options.length === 0) {
        question.q += ` ${line}` // a question that runs over more than one line
        return
      }
      closeQuestion()
    }

    // Everything else is a key point.
    const bulleted = /^[-*•·]\s+/.test(line)
    let body = line.replace(/^[-*•·]\s+/, '')
    const core = /^!\s*/.test(body)
    body = body.replace(/^!\s*/, '')
    if (body === '') return

    const split = /^(.{1,80}?)(?::\s+|\s+[–—-]\s+)(\S.*)$/.exec(body)
    if (!split && !bulleted && !core && target && target.term) {
      target.text += ` ${body}` // an explanation that runs over more than one line
      return
    }
    const point = split ? { term: split[1].trim(), text: split[2].trim() } : { term: firstWords(body), text: body }
    if (core) point.core = true
    currentTopic().points.push(point) // may open the first unit, which clears the target
    target = point
  })

  if (fence) {
    addCode(fence)
    note(fenceLine, t('This code example is never closed. End it with a line of three backticks.'))
  }
  closeQuestion()

  for (const each of raw.units) each.topics = each.topics.filter(candidate => candidate.points.length > 0)
  return { raw, problems }
}

// Line breaks become spaces; spaces inside the text are kept as they are.
const oneLine = value => value.replace(/\s*\n\s*/g, ' ').trim()

// The reverse: a course as text, for editing one that already exists.
export function courseToText(course) {
  const out = []
  for (const unit of course.units) {
    out.push(`# ${oneLine(unit.label)}: ${oneLine(unit.title)}`)
    if (unit.blurb) out.push(`> ${oneLine(unit.blurb)}`)
    // A unit written without topics has one topic named after the unit; that needs no heading.
    const plain = unit.topics.length === 1 && unit.topics[0].title === unit.title
    for (const topic of unit.topics) {
      if (!plain) out.push('', `## ${oneLine(topic.title)}`)
      for (const point of topic.points) {
        // A colon inside a term would be read as the end of the term.
        out.push(`${point.core ? '! ' : ''}${oneLine(point.term).replace(/:\s+/g, ', ')}: ${oneLine(point.text)}`)
        if (point.code) out.push('```', point.code, '```')
      }
    }
    for (const question of unit.questions) {
      out.push('', `? ${oneLine(question.q)}`)
      if (question.code) out.push('```', question.code, '```')
      question.options.forEach((option, index) => out.push(`${index === question.answer ? '+' : '-'} ${oneLine(option)}`))
      if (question.why) out.push(`= ${oneLine(question.why)}`)
    }
    out.push('')
  }
  return `${out.join('\n').trim()}\n`
}

export const EXAMPLE_TEXT = `# Week 1: Relational model
> Tables, keys and how they relate.

## Keys
! Primary key: A column, or set of columns, whose value identifies exactly one row. It can never be empty.
\`\`\`
CREATE TABLE student (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
\`\`\`
Foreign key: A column that refers to the primary key of another table.

## Queries
SELECT: Reads rows from a table. Use \`WHERE\` to choose which rows.

? What does a primary key guarantee?
+ Every row can be identified uniquely
- The table is sorted
- The column is encrypted
= A primary key is unique and never empty, so each value points to exactly one row.

# Week 2: Normalisation
First normal form: Every cell holds one value, and every row is unique.
`

const EXAMPLE_TEXT_FI = `# Viikko 1: Relaatiomalli
> Taulut, avaimet ja niiden väliset suhteet.

## Avaimet
! Pääavain: Sarake tai sarakejoukko, jonka arvo yksilöi täsmälleen yhden rivin. Se ei voi koskaan olla tyhjä.
\`\`\`
CREATE TABLE opiskelija (
  id INTEGER PRIMARY KEY,
  nimi TEXT NOT NULL
);
\`\`\`
Viiteavain: Sarake, joka viittaa toisen taulun pääavaimeen.

## Kyselyt
SELECT: Lukee rivejä taulusta. Rivit valitaan \`WHERE\`-ehdolla.

? Mitä pääavain takaa?
+ Jokainen rivi voidaan yksilöidä
- Taulu on järjestetty
- Sarake on salattu
= Pääavain on yksilöllinen eikä koskaan tyhjä, joten jokainen arvo osoittaa täsmälleen yhteen riviin.

# Viikko 2: Normalisointi
Ensimmäinen normaalimuoto: Jokaisessa solussa on yksi arvo, ja jokainen rivi on yksilöllinen.
`

// The example in the language of the interface.
export const exampleText = () => (interfaceLanguage() === 'fi' ? EXAMPLE_TEXT_FI : EXAMPLE_TEXT)

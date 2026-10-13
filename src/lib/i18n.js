import { Fragment, createElement } from 'react'
import fi from './i18n.fi.js'

// The interface is written in English in the code. Every other language is a table from the
// English sentence to its translation; a sentence that has no entry is shown in English.
// (Course content is translated separately, in the course itself.)

const TABLES = { fi }
const LOCALES = { en: 'en-GB', fi: 'fi-FI' }

export const INTERFACE_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fi', name: 'Suomi' },
]

let language = 'en'

// Called by the store before anything is rendered, and again whenever the setting changes.
export function setLanguage(code) {
  language = TABLES[code] ? code : 'en'
}

export const interfaceLanguage = () => language

// The locale for dates and weekday names.
export const locale = () => LOCALES[language]

const words = english => TABLES[language]?.text[english] ?? english
const fill = (template, values) => template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match)

// t('Exam in {days} days', { days: 3 })
export function t(english, values) {
  return values ? fill(words(english), values) : words(english)
}

// The same for a sentence with elements in it. Returns its pieces, ready to render:
// tx('{time} studied', { time: <strong>2 h</strong> })
export function tx(english, values) {
  return words(english)
    .split(/(\{\w+\})/)
    .map((piece, index) => {
      const name = /^\{(\w+)\}$/.exec(piece)?.[1]
      return name && name in values ? createElement(Fragment, { key: index }, values[name]) : piece
    })
}

// count(1, 'unit') -> "1 unit", count(3, 'unit') -> "3 units"; in Finnish "1 osio", "3 osiota".
export function count(amount, noun) {
  const forms = TABLES[language]?.nouns[noun]
  if (forms) return `${amount} ${amount === 1 ? forms[0] : forms[1]}`
  return `${amount} ${noun}${amount === 1 ? '' : 's'}`
}

// percent(80) -> "80%", in Finnish "80 %"
export function percent(value) {
  return language === 'fi' ? `${value} %` : `${value}%`
}

// 'fi' -> 'Finnish', or 'suomi' when the interface is in Finnish
export function languageName(code) {
  const base = code.toLowerCase().split('-')[0]
  try {
    return new Intl.DisplayNames([language], { type: 'language' }).of(base) ?? code
  } catch {
    return code
  }
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from './store.jsx'

// Reading aloud uses the browser's built-in Web Speech API: free, no account and no key.
// A course is read with a voice of its own language (the course's "lang").

// Inline code is rewritten so an English voice can pronounce it: `todos.map()` -> "todos dot map".
const CODE_WORDS = [
  [/<!doctype html>/gi, ' doctype H T M L '],
  [/<>\s*(?:…|\.\.\.)?\s*<\/>/g, ' a fragment '],
  [/<\/?([a-z][\w-]*)[^>]*>/gi, ' $1 tag '],
  [/!important/g, ' important '],
  [/\.\.\./g, ' spread '],
  [/!==/g, ' not equal to '],
  [/===/g, ' triple equals '],
  [/==/g, ' double equals '],
  [/=>/g, ' arrow '],
  [/&&/g, ' and and '],
  [/\|\|/g, ' or or '],
  [/\?\?/g, ' double question mark '],
  [/\?\./g, ' question dot '],
  [/\$\{[^}]*\}/g, ' dollar curly braces '],
  [/\[\]/g, ' empty array '],
  [/\{\}/g, ' curly braces '],
  [/(?<=\w)\.(?=\w)/g, ' dot '],
  [/(^|\s)\.(?=\w)/g, '$1dot '],
  [/#(?=\w)/g, ' hash '],
  [/@(?=\w)/g, ' at '],
  [/:(?=\w)/g, ' colon '],
  [/:/g, ', '],
  [/\//g, ' slash '],
  [/\*/g, ' star '],
  [/</g, ' less than '],
  [/>/g, ' greater than '],
  [/[{}()[\];`"'!]/g, ' '],
  [/=/g, ' equals '],
  [/_/g, ' '],
  [/([a-z])([A-Z])/g, '$1 $2'],
]

// The same idea for a Finnish voice, kept short: name the symbols that matter and drop the rest.
const CODE_WORDS_FI = [
  [/<!doctype html>/gi, ' doctype HTML '],
  [/<>\s*(?:…|\.\.\.)?\s*<\/>/g, ' fragmentti '],
  [/<\/?([a-z][\w-]*)[^>]*>/gi, ' $1-elementti '],
  [/!important/g, ' important '],
  [/\.\.\./g, ' kolme pistettä '],
  [/!==/g, ' eri suuri kuin '],
  [/===/g, ' kolme yhtäsuuruusmerkkiä '],
  [/==/g, ' kaksi yhtäsuuruusmerkkiä '],
  [/=>/g, ' nuoli '],
  [/&&/g, ' ja-ja '],
  [/\|\|/g, ' tai-tai '],
  [/\[\]/g, ' tyhjä taulukko '],
  [/\{\}/g, ' aaltosulkeet '],
  [/(?<=\w)\.(?=\w)/g, ' piste '],
  [/(^|\s)\.(?=\w)/g, '$1piste '],
  [/#(?=\w)/g, ' risuaita '],
  [/\//g, ' kautta '],
  [/[{}()[\];`"'!<>*=_:@?$]/g, ' '],
  [/([a-z])([A-Z])/g, '$1 $2'],
]

const SPOKEN_CODE = { en: CODE_WORDS, fi: CODE_WORDS_FI }

const baseLanguage = lang => lang.toLowerCase().split('-')[0]

// Other languages hear inline code as it is written.
function codeToWords(code, lang) {
  const table = SPOKEN_CODE[baseLanguage(lang)]
  return table ? table.reduce((text, [pattern, words]) => text.replace(pattern, words), code) : code
}

export function speakable(text, lang = 'en') {
  return text
    .replace(/`([^`]+)`/g, (match, code) => ` ${codeToWords(code, lang)} `)
    .replace(/\s+/g, ' ')
    // The words of the code join what follows them: "closest -metodin" and "null , jos" read badly.
    .replace(/ (?=-\p{L})/gu, '')
    .replace(/ (?=[,.;:!?])/g, '')
    .trim()
}

// Chrome's online voices go silent about 15 seconds into a long utterance and never report
// that they finished. Speaking one sentence at a time keeps every utterance short.
function sentences(text) {
  return text
    .split(/(?<=[.!?:;])\s+/)
    .flatMap(sentence => (sentence.length > 180 ? sentence.split(/(?<=,)\s+/) : [sentence]))
    .filter(Boolean)
}

export function voicesFor(voices, lang) {
  const wanted = baseLanguage(lang)
  return voices.filter(voice => baseLanguage(voice.lang) === wanted)
}

// Browsers list English voices from a dozen countries; without a hint, start with these.
const USUAL_REGIONS = { en: ['en-us', 'en-gb'] }

// The voice you chose, or else the best-sounding one for the course's language:
// natural online voices first, and among equals the course's own region.
function pickVoice(voices, lang, voiceURI) {
  const matching = voicesFor(voices, lang)
  const chosen = matching.find(voice => voice.voiceURI === voiceURI)
  if (chosen) return chosen

  const regions = [lang.toLowerCase(), ...(USUAL_REGIONS[baseLanguage(lang)] ?? [])]
  const score = voice => {
    const region = regions.indexOf(voice.lang.toLowerCase().replace('_', '-'))
    const quality = /natural/i.test(voice.name) ? 20 : /^google/i.test(voice.name) ? 10 : 0
    return quality + (region === -1 ? 0 : regions.length - region) + (voice.default ? 0.5 : 0)
  }
  return matching.reduce((best, voice) => (best === null || score(voice) > score(best) ? voice : best), null)
}

const SpeechContext = createContext(null)

export function useSpeech() {
  return useContext(SpeechContext)
}

export function SpeechProvider({ children }) {
  const { state, course } = useGame()
  const { rate } = state.settings
  const lang = course.lang
  const voiceURI = state.settings.voices[baseLanguage(lang)]
  const supported = 'speechSynthesis' in window
  const [voices, setVoices] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const turn = useRef(0)
  const current = useRef(null)

  // Voices load asynchronously in most browsers.
  useEffect(() => {
    if (!supported) return
    const synth = window.speechSynthesis
    const read = () => setVoices(synth.getVoices())
    read()
    synth.addEventListener('voiceschanged', read)
    return () => {
      synth.removeEventListener('voiceschanged', read)
      synth.cancel()
    }
  }, [supported])

  const voice = useMemo(() => pickVoice(voices, lang, voiceURI), [voices, lang, voiceURI])

  const stop = useCallback(() => {
    turn.current++
    if (supported) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  // Speaks one piece of text. onDone runs only if it was read to the end; onFail if the
  // browser could not speak it. Neither runs when the speech is interrupted by stop().
  const speak = useCallback(
    (text, onDone, onFail) => {
      if (!supported) return
      const synth = window.speechSynthesis
      const mine = ++turn.current
      synth.cancel()

      function finish(completed) {
        if (turn.current !== mine) return
        if (!completed) {
          turn.current++
          synth.cancel()
        }
        setSpeaking(false)
        if (completed) onDone?.()
        else onFail?.()
      }

      // The browser queues utterances itself, so every sentence can be handed over at once.
      const parts = sentences(speakable(text, lang))
      const queue = parts.map((part, index) => {
        const utterance = new SpeechSynthesisUtterance(part)
        if (voice) utterance.voice = voice
        utterance.lang = voice?.lang ?? lang
        utterance.rate = rate
        if (index === parts.length - 1) utterance.onend = () => finish(true)
        utterance.onerror = () => finish(false)
        return utterance
      })

      // Keep a reference: Chrome may garbage-collect a speaking utterance and never fire onend.
      current.current = queue
      setSpeaking(true)
      for (const utterance of queue) synth.speak(utterance)
    },
    [supported, voice, lang, rate],
  )

  const value = useMemo(
    () => ({
      supported,
      lang,
      voice,
      // The voices that can read the current course.
      voices: voicesFor(voices, lang),
      // Voices have loaded, but none of them speaks the course's language.
      noVoice: voices.length > 0 && voicesFor(voices, lang).length === 0,
      speaking,
      speak,
      stop,
    }),
    [supported, lang, voice, voices, speaking, speak, stop],
  )

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
}

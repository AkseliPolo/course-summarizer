// Where progress and added courses are kept.
//
// Started from Course Summarizer.exe, the app talks to the launcher's small local API and
// everything is stored as files in Documents\Course Summarizer. Opened any other way (the dev server, a plain web host),
// that API does not exist and everything stays in this browser's localStorage instead.
// localStorage is written in both cases, so it doubles as a backup copy.

import { t } from './i18n.js'

const STATE_KEY = 'course-summarizer:v2'
const COURSES_KEY = 'course-summarizer:courses'
// What the same things were saved as while the app was called Luntti. Still read, never written.
const OLD_STATE_KEYS = ['luntti:v2', 'luntti:v1']
const OLD_COURSES_KEY = 'luntti:courses'
const JSON_HEADERS = { 'Content-Type': 'application/json' }

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch {
    return null
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the session still works, it just is not saved here.
  }
}

const localState = () => [STATE_KEY, ...OLD_STATE_KEYS].map(readLocal).find(Boolean) ?? null
const localCourses = () => readLocal(COURSES_KEY) ?? readLocal(OLD_COURSES_KEY) ?? []

function parse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

// Loads everything once, before the app renders.
export async function bootstrap() {
  let disk = null
  try {
    const response = await fetch('/api/data', { cache: 'no-store' })
    const type = response.headers.get('content-type') ?? ''
    if (response.ok && type.includes('application/json')) disk = await response.json()
  } catch {
    // No launcher behind this page.
  }

  const local = localState()

  if (!disk) {
    const courses = localCourses()
    return { server: false, folder: '', saved: local, files: courses.map(raw => ({ name: raw.id ?? raw.title, raw })) }
  }

  // If the launcher was not running for a while, the browser copy can be the newer one.
  const onDisk = disk.state ? parse(disk.state) : null
  const browserIsNewer = (local?.updatedAt ?? 0) > (onDisk?.updatedAt ?? 0)
  return {
    server: true,
    folder: disk.folder,
    saved: browserIsNewer ? local : onDisk,
    browserIsNewer,
    files: disk.courses.map(file => ({ name: file.name, raw: parse(file.text) })),
  }
}

export function createStore(server) {
  let timer = 0
  let due = Infinity
  let pending = null
  let report = () => {}

  async function send(path, options) {
    try {
      const response = await fetch(path, options)
      report(response.ok)
      return response.ok
    } catch {
      report(false)
      return false
    }
  }

  function flush() {
    clearTimeout(timer)
    due = Infinity
    if (pending === null) return
    const body = pending
    pending = null
    // keepalive lets the last save finish while the window is closing; browsers cap its size.
    send('/api/state', { method: 'PUT', headers: JSON_HEADERS, body, keepalive: body.length < 60_000 })
  }

  return {
    // Called with true or false after every request to the launcher.
    onStatus(listener) {
      report = listener
    },

    // delay: how long the write to disk may wait. Ticks of the study clock can wait longer
    // than an answer or a star, so the file is not rewritten every few seconds.
    save(state, delay) {
      const stamped = { ...state, updatedAt: Date.now() }
      writeLocal(STATE_KEY, stamped)
      if (!server) return
      pending = JSON.stringify(stamped)
      const when = Date.now() + delay
      if (when < due) {
        clearTimeout(timer)
        due = when
        timer = setTimeout(flush, delay)
      }
    },

    flush,

    ping() {
      if (server) send('/api/ping', { cache: 'no-store' })
    },

    async saveCourse(id, raw) {
      if (server) {
        const ok = await send(`/api/courses/${id}`, { method: 'PUT', headers: JSON_HEADERS, body: JSON.stringify(raw, null, 2) })
        if (!ok) throw new Error(t('The course could not be saved. Is Course Summarizer still running?'))
        return
      }
      const others = localCourses().filter(course => course.id !== id)
      writeLocal(COURSES_KEY, [...others, { ...raw, id }])
    },

    async removeCourse(id) {
      if (server) {
        const ok = await send(`/api/courses/${id}`, { method: 'DELETE' })
        if (!ok) throw new Error(t('The course could not be removed. Is Course Summarizer still running?'))
        return
      }
      writeLocal(COURSES_KEY, localCourses().filter(course => course.id !== id))
    },

    openFolder() {
      if (server) send('/api/open-folder', { method: 'PUT' })
    },
  }
}

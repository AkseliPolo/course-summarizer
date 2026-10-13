import { useEffect, useRef, useState } from 'react'

function readHash() {
  return window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
}

// '#/learn/w3' -> ['learn', 'w3']
export function useRoute() {
  const [parts, setParts] = useState(readHash)

  useEffect(() => {
    function onChange() {
      setParts(readHash())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return parts
}

// Page-wide keyboard shortcuts. The handler always sees the latest state.
export function useKey(handler) {
  const latest = useRef(handler)

  useEffect(() => {
    latest.current = handler
  })

  useEffect(() => {
    function onKey(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      const element = event.target
      if (element.closest?.('input, select, textarea')) return
      // Space and Enter already activate a focused button or link.
      if ((event.key === ' ' || event.key === 'Enter') && element.closest?.('button, a')) return
      latest.current(event)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

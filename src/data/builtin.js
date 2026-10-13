import w1 from './w1.js'
import w2 from './w2.js'
import w3 from './w3.js'
import w4 from './w4.js'
import w5 from './w5.js'
import w6 from './w6.js'
import w7 from './w7.js'
import fi1 from './fi/w1.js'
import fi2 from './fi/w2.js'
import fi3 from './fi/w3.js'
import fi4 from './fi/w4.js'
import fi5 from './fi/w5.js'
import fi6 from './fi/w6.js'
import fi7 from './fi/w7.js'

// Courses that ship inside the app. More can be added from the Courses page.
export const builtinCourses = [
  {
    id: 'web-sovellusten-perusteet',
    title: 'Web-sovellusten perusteet',
    code: 'IN00DL12-3008',
    lang: 'en',
    examDate: '2026-10-14',
    examQuestions: 40,
    examMinutes: 90,
    units: [w1, w2, w3, w4, w5, w6, w7],
    // The same course in Finnish, unit by unit in the same order.
    translations: {
      fi: { units: [fi1, fi2, fi3, fi4, fi5, fi6, fi7] },
    },
  },
]

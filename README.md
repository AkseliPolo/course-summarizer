# Course Summarizer

A study app that turns a course into its key points and makes learning them feel like a game.
It reads the points aloud, drills them as flashcards and quizzes, runs a timed mock exam, and
rewards the time you put in with XP, levels, streaks and achievements.

It ships with one course, *Web-sovellusten perusteet* (IN00DL12-3008), in English and Finnish:
281 key points and 128 practice questions over seven weeks. You can add your own courses by
typing or pasting notes.

## Start it

Double-click **`Course Summarizer.exe`**. It opens in its own window, and everything you do is
saved in `Documents\Course Summarizer`. Closing the window closes the app.

The EXE is not stored in this repository. Build it with the two commands below (Windows, with
[Node.js](https://nodejs.org) 20.19 or newer installed):

```bash
npm install
npm run exe
```

To work on the app itself, `npm run dev` starts it in the browser at http://localhost:5173.

## What you can do in it

| Page | What it is for |
|---|---|
| **Study** | The course at a glance: exam countdown, how ready you are, today's study time and its rewards, and one card per unit. |
| **Learn** (inside a unit) | Every key point of the unit, with code examples. Press play to have them read aloud one after another. Tick a point as reviewed, or star it for the cheat sheet. |
| **Flashcards** | A term is shown; explain it, reveal the answer, and say whether you knew it. Cards you miss come back first. |
| **Quiz** | Ten multiple-choice questions with an explanation after each answer. Correct answers in a row build a combo worth more XP. |
| **Mock exam** | The shape of the real exam (40 questions in 90 minutes for the built-in course): no feedback until the end, then a score per unit and a review of what you missed. |
| **Cheat sheet** | The points you starred, grouped by unit, ready to print or copy out by hand. |
| **Courses** | Switch between courses, add a new one, edit or remove the ones you added. |
| **Stats** | Total time studied, streaks, a 26-week calendar, time per course, achievements and settings. |

The **EN / FI** switch in the top bar changes the language of the interface, and of the course
when the course has that language.

## How it works

The app has two parts: a web app that does all the work, and a small Windows program that
shows it in a window and keeps its files.

```
 Course Summarizer.exe  (launcher/CourseSummarizer.cs)
   |  serves the web app from inside the EXE on http://localhost:47631
   |  opens it in an Edge or Chrome app window
   |  reads and writes  Documents\Course Summarizer\
   |                       progress.json        XP, time, what you know
   |                       courses\*.json       courses you added
   v
 The web app  (React, in src/)
     data/      the built-in course, one file per week, plus its Finnish translation
     lib/       the rules: courses, progress, XP, speech, saving, translations
     views/     one file per page
```

### The launcher

`Course Summarizer.exe` is a single C# file compiled with the compiler that is part of Windows,
so building it needs no extra tools. The built web app is embedded inside the EXE. When it
starts, it:

1. serves the web app on a local-only address (`http://localhost:47631`),
2. opens that address in an Edge or Chrome *app window* with its own browser profile, and
3. answers a handful of requests from the page: load everything, save progress, save or remove
   a course, open the data folder.

It exits when the window is closed. It listens on this computer only, and refuses requests that
come from other websites.

### The web app

- **Courses** are plain data. A course has units, a unit has topics, a topic has key points
  (a term, an explanation, an optional code example, a must-know mark), and a unit has
  multiple-choice questions. `lib/courses.js` checks a course and gives every point and question
  a stable id. A translation holds only the words, item by item in the same order, so the ids,
  and with them your progress, are the same in every language.
- **State** lives in one place, `lib/store.jsx`: a reducer holds your profile (XP, study time per
  day, achievements, settings) and, per course, what you know (which points you reviewed, how
  well you recall each card, your answers, stars and exam results). Pages read it through a
  React context and change it by dispatching actions such as `seen`, `rate`, `answer` or `star`.
- **Saving**: every change is written to the browser's localStorage at once and sent to the
  launcher a moment later, which writes `progress.json` (keeping the previous version as a
  `.bak`). Opened without the launcher, for example with `npm run dev`, the app simply stays in
  localStorage.
- **The study clock** counts a second only while the window is visible and you have moved,
  typed or scrolled in the last 90 seconds, or while a point is being read aloud. That time is
  what earns XP and feeds the stats.
- **Reading aloud** uses the browser's built-in speech synthesis: free, no account, no key. A
  course is read by a voice of its own language, one sentence at a time, and inline code is
  rewritten into words first (`todos.map()` becomes "todos dot map").
- **The interface language**: the code is written in English, and `lib/i18n.fi.js` maps each
  English sentence to Finnish. A sentence without a translation is shown in English.

### The game

| You do this | You earn |
|---|---|
| Study actively | 1 XP per 30 seconds |
| Review a key point for the first time | 5 XP |
| Rate a flashcard | 4 XP if you knew it, 1 XP if not |
| Answer a quiz question correctly | 10 XP, plus up to 10 more for a streak |
| Finish a quiz | 15 XP, plus 25 for no mistakes |
| Finish a mock exam | 50 XP, plus 5 per correct answer |
| Reach 10, 25, 45, 60 and 90 minutes in a day | a bonus to collect: 20 to 120 XP |

XP adds up to levels. Studying at least five minutes a day keeps a streak going. A unit's
mastery is half how well you recall its points (a card needs three correct recalls in a row to
count as mastered) and half how many of its questions you last answered correctly; the course's
exam readiness is the average over its units. There are 25 achievements.

## Adding a course

Open **Courses → Add a course** and type or paste your notes. A preview shows what they become.

```
# Week 1: Relational model
> Tables, keys and how they relate.

## Keys
! Primary key: A column whose value identifies exactly one row.
Foreign key: A column that refers to the primary key of another table.

? What does a primary key guarantee?
+ Every row can be identified uniquely
- The table is sorted
= A primary key is unique and never empty.
```

| Line | Meaning |
|---|---|
| `# Week 1: Title` | starts a unit |
| `## Topic` | groups points inside a unit (optional) |
| `Term: explanation` | a key point; put `!` in front if it is must-know |
| `? Question` | a question, followed by one `+ right answer`, one or more `- wrong answer` lines and an optional `= why` |
| a line of three backticks | before and after a code example, under its point or question |

Bullet lists pasted from notes work too. The page can also copy a ready-made prompt for an AI
assistant: paste the prompt and your material into the assistant, then paste its whole answer
back into the box.

Added courses are saved as files in `Documents\Course Summarizer\courses`.

## Where things are

```
index.html                    the page the app loads into
src/main.jsx, src/App.jsx     start-up and which page to show (routes are in the URL hash)
src/data/                     the built-in course; src/data/fi/ is its Finnish translation
src/lib/courses.js            reads and checks a course, applies translations
src/lib/courseText.js         the plain-text course format
src/lib/store.jsx             all state, and the study clock
src/lib/game.js               XP, levels, streaks, mastery, achievements
src/lib/speech.jsx            reading aloud
src/lib/storage.js            saving: localStorage and the launcher
src/lib/i18n.js, i18n.fi.js   the interface in English and Finnish
src/views/                    one file per page
src/components/               the top bar, a question, small shared pieces
src/styles.css                all styles, light and dark
launcher/CourseSummarizer.cs  the Windows program
tools/build-exe.mjs           builds the web app, draws the icon, compiles the EXE
```

## About the built-in course

The course content is a study summary written for exam revision. It is not official course
material, and it may contain mistakes: check anything that matters against the lectures.

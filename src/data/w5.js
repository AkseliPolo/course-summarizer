// Week 5 — React hooks and effects, plus the object-oriented JavaScript readings

export default {
  id: 'w5',
  week: 5,
  title: 'Hooks, effects & OOP',
  blurb: 'Rules of hooks, useEffect and its dependency array, fetching data in React, forms, debugging, and object-oriented JavaScript: this, constructors, private fields, getters and static.',
  topics: [
    {
      title: 'Hooks',
      points: [
        {
          term: 'Hooks',
          fi: 'hookit',
          core: true,
          text: 'Hooks are functions whose names start with `use`. They let a function component use React features such as state with `useState` and side effects with `useEffect`.',
        },
        {
          term: 'Rules of hooks',
          core: true,
          text: 'Call hooks only at the top level of a component, never inside a condition, a loop or a nested function. And call them only from components or other hooks. React identifies each hook by the order it is called in, so that order must never change.',
        },
        {
          term: 'Lazy initial state',
          text: 'If you pass a function to `useState`, React runs it only on the first render and uses its return value as the initial state. That is the place for slow work such as reading localStorage.',
          code: "const [todos, setTodos] = useState(() => {\n  const json = localStorage.getItem('todos')\n  return json ? JSON.parse(json) : []\n})",
        },
        {
          term: 'Custom hooks',
          text: 'A custom hook is your own function that starts with `use` and calls other hooks. It lets several components share the same logic; each component that calls it still gets its own separate state.',
          code: 'function useDocumentTitle(title) {\n  useEffect(() => {\n    const original = document.title\n    document.title = title\n    return () => { document.title = original }\n  }, [title])\n}',
        },
      ],
    },
    {
      title: 'useEffect',
      points: [
        {
          term: 'Side effects',
          fi: 'sivuvaikutus',
          core: true,
          text: 'A side effect is anything that reaches outside rendering: fetching data, starting a timer, writing to localStorage, changing the document title. Effects must not run during rendering itself.',
        },
        {
          term: 'useEffect',
          core: true,
          text: '`useEffect` takes a function and runs it after the component has rendered and the screen has been updated. It is how a component synchronises with something outside React.',
          code: 'useEffect(() => {\n  document.title = todos.length + \' tasks\'\n}, [todos])',
        },
        {
          term: 'Dependency array',
          fi: 'riippuvuustaulukko',
          core: true,
          text: 'The second argument controls when the effect runs again. With no array it runs after every render. With an empty array it runs once, after the first render. With values in the array it runs after the first render and whenever one of those values has changed.',
          code: 'useEffect(() => { ... })           // after every render\nuseEffect(() => { ... }, [])       // once, after the first render\nuseEffect(() => { ... }, [todos])  // first render + when todos changes',
        },
        {
          term: 'Cleanup function',
          fi: 'siivousfunktio',
          core: true,
          text: 'An effect can return a function. React calls it before running the effect again and when the component is removed from the page. Use it to stop timers, cancel requests and undo whatever the effect set up.',
          code: 'useEffect(() => {\n  const id = setInterval(() => setCounter(c => c + 1), 1000)\n  return () => clearInterval(id)\n}, [])',
        },
        {
          term: 'Infinite loop trap',
          core: true,
          text: 'An effect that sets state and has no dependency array runs after every render, and setting state causes another render. The component renders forever. Always give such an effect a dependency array.',
        },
        {
          term: 'Stale values in effects',
          text: 'An effect sees the state and props from the render it was created in. If it uses a value that is missing from the dependency array, it keeps working with the old value. Either list the value or use an updater function.',
        },
        {
          term: 'Saving state with an effect',
          text: 'To persist state, write it to localStorage in an effect that depends on that state. It then saves automatically after every change.',
          code: "useEffect(() => {\n  localStorage.setItem('todos', JSON.stringify(todos))\n}, [todos])",
        },
        {
          term: 'StrictMode runs effects twice',
          text: 'In development, StrictMode mounts every component twice: the effect runs, its cleanup runs, and the effect runs again. This is deliberate, to reveal effects with missing cleanup. It does not happen in a production build.',
        },
      ],
    },
    {
      title: 'Fetching data in React',
      points: [
        {
          term: 'Fetching in an effect',
          core: true,
          text: 'Load data in an effect with an empty dependency array, so the request is made once when the component appears. Store the result in state; the state change renders the data.',
          code: "useEffect(() => {\n  async function loadRecipes() {\n    try {\n      const response = await fetch('https://dummyjson.com/recipes')\n      if (!response.ok) throw new Error('HTTP error: ' + response.status)\n      const data = await response.json()\n      setRecipes(data.recipes)\n    } catch (err) {\n      setError('Loading the recipes failed.')\n    } finally {\n      setLoading(false)\n    }\n  }\n  loadRecipes()\n}, [])",
        },
        {
          term: 'The effect function cannot be async',
          core: true,
          text: 'An async function always returns a promise, but an effect must return either nothing or a cleanup function. So define an async function inside the effect and call it straight away.',
        },
        {
          term: 'Loading, error and data states',
          core: true,
          text: 'A component that fetches needs three pieces of state: the data, a loading flag that starts as true, and an error message. Render something different for each: a loading text, an error message, or the data.',
          code: '{loading && <p>Loading recipes...</p>}\n{error && <p role="alert">{error}</p>}\n{!loading && !error && <RecipeList recipes={recipes} />}',
        },
        {
          term: 'Initial state for fetched data',
          core: true,
          text: 'The first render happens before any data has arrived. Start a list as an empty array so that `map` works; if the state starts as undefined, calling `map` on it throws.',
        },
        {
          term: 'Cancelling a request',
          text: 'Create an `AbortController`, pass its `signal` to fetch, and call `abort` in the effect\'s cleanup. That cancels a request whose component has already gone away.',
        },
      ],
    },
    {
      title: 'Forms in React',
      points: [
        {
          term: 'Submitting a form in React',
          core: true,
          text: 'Put `onSubmit` on the form element. In the handler, call `preventDefault`, validate the values from state, use them, and clear the fields by resetting the state.',
          code: "function addTodo(event) {\n  event.preventDefault()\n  if (!newTodo.trim()) return\n  setTodos([...todos, newTodo.trim()])\n  setNewTodo('')\n}\n\n<form onSubmit={addTodo}>\n  <input value={newTodo} onChange={e => setNewTodo(e.target.value)} />\n  <button type=\"submit\">Add</button>\n</form>",
        },
        {
          term: 'Several fields',
          text: 'Either keep one state variable per field, or keep one object and update it with the field\'s `name` as a computed key.',
          code: 'setForm({ ...form, [event.target.name]: event.target.value })',
        },
        {
          term: 'Checkboxes and selects',
          text: 'A checkbox is controlled with `checked` and read from `event.target.checked`. A select\'s value arrives as a string, so convert it with `Number` when you need a numeric id.',
        },
        {
          term: 'Showing validation errors',
          text: 'Keep the error message in state and render it conditionally next to the form. Clear it when the input becomes valid.',
        },
      ],
    },
    {
      title: 'Debugging React',
      points: [
        {
          term: 'Reading error messages',
          core: true,
          text: 'Read the first line of the console error and the file and line it points to. The component stack below it shows which component was rendering when the error happened.',
        },
        {
          term: 'Common React errors',
          core: true,
          text: 'Cannot read properties of undefined, reading map: the data has not loaded yet. Each child in a list should have a unique key: add a key. Too many re-renders: state is being set during rendering. Objects are not valid as a React child: you put a whole object in the JSX.',
        },
        {
          term: 'React Developer Tools',
          text: 'The browser extension adds a Components tab where you can select any component and inspect its current props and state.',
        },
        {
          term: 'Logging in a component',
          text: 'A `console.log` in a component body runs on every render, which makes it a quick way to see when and why a component renders. In development with StrictMode it appears twice.',
        },
      ],
    },
    {
      title: 'Objects, this and constructors',
      points: [
        {
          term: 'Methods',
          fi: 'metodi',
          core: true,
          text: 'A method is a function stored as a property of an object. Inside it, `this` gives access to the object\'s other properties.',
          code: "const user = {\n  name: 'Ada',\n  greet() {\n    return 'Hi, ' + this.name\n  },\n}",
        },
        {
          term: 'How this is decided',
          core: true,
          text: 'The value of `this` is not fixed when a function is written. It is decided each time the function is called: in `user.greet()`, `this` is the object before the dot.',
        },
        {
          term: 'Losing this',
          core: true,
          text: 'If you take a method off its object and call it on its own, or pass it somewhere as a callback, there is no object before the dot and `this` is undefined. Wrap the call in an arrow function to keep the object.',
          code: 'const greet = user.greet\ngreet()                            // this is undefined -> TypeError\n\nsetTimeout(() => user.greet(), 100)   // works',
        },
        {
          term: 'Arrow functions and this',
          core: true,
          text: 'An arrow function has no `this` of its own; it uses the `this` of the code around it. That makes arrows good for callbacks inside methods, and wrong for defining the methods themselves.',
        },
        {
          term: 'Constructor functions',
          fi: 'konstruktorifunktio',
          text: 'Before classes, objects were created with ordinary functions named with a capital letter and called with `new`. A class does the same thing with clearer syntax.',
          code: "function User(name) {\n  this.name = name\n}\n\nconst user = new User('Ada')",
        },
        {
          term: 'What new does',
          core: true,
          text: 'Calling a function with `new` creates an empty object, links it to the function\'s prototype, runs the function with `this` set to the new object, and returns that object.',
        },
      ],
    },
    {
      title: 'Encapsulation and static members',
      points: [
        {
          term: 'Encapsulation',
          fi: 'kapselointi',
          core: true,
          text: 'Encapsulation means hiding an object\'s internal data and exposing only a controlled public interface, so outside code cannot put the object into an invalid state.',
        },
        {
          term: 'Private fields',
          fi: 'yksityinen kenttä',
          core: true,
          text: 'A field whose name starts with a hash is private. It can be read and written only by code inside the class body. Trying to reach it from outside is a syntax error.',
          code: "class Person {\n  #address\n\n  constructor(name) {\n    this.name = name\n    this.#address = 'Example Street 1'\n  }\n}\n\nconst person = new Person('John')\nperson.name       // 'John'\nperson.#address   // SyntaxError",
        },
        {
          term: 'Getters and setters',
          fi: 'getteri ja setteri',
          core: true,
          text: 'A getter and a setter look like an ordinary property from outside, but run a method when the property is read or assigned. A setter is the place to validate a new value. A getter without a setter makes the property read-only.',
          code: "class Person {\n  #address = ''\n\n  get address() {\n    return this.#address\n  }\n\n  set address(newAddress) {\n    if (newAddress.trim() === '') return\n    this.#address = newAddress\n  }\n}\n\nperson.address = 'New Street 2'   // runs the setter\nperson.address                    // runs the getter",
        },
        {
          term: 'Static methods',
          fi: 'staattinen metodi',
          core: true,
          text: 'A static method belongs to the class itself, not to its instances. You call it on the class name without creating an object, the way you call `Math.abs`. Use static for utilities that need no instance data.',
          code: 'class Temperature {\n  static toFahrenheit(celsius) {\n    return celsius * 9 / 5 + 32\n  }\n}\n\nTemperature.toFahrenheit(100)   // 212',
        },
        {
          term: 'Overriding methods',
          fi: 'ylikirjoittaminen',
          text: 'A subclass can define a method with the same name as one in its parent, and the subclass version is used. Inside it, `super.method()` calls the parent\'s version so you can extend rather than replace it.',
        },
      ],
    },
  ],

  questions: [
    {
      q: 'How many times does this effect run while the component stays on the page?',
      code: 'useEffect(() => {\n  loadPosts()\n}, [])',
      options: [
        'Once, after the first render',
        'After every render',
        'Never, because the array is empty',
        'Once before the first render',
      ],
      answer: 0,
      why: 'An empty dependency array means nothing can change, so the effect runs only after the first render. (In development StrictMode runs it twice on purpose.)',
    },
    {
      q: 'When does this effect run?',
      code: "useEffect(() => {\n  document.title = todos.length + ' tasks'\n}, [todos])",
      options: [
        'After the first render, and again whenever `todos` has changed',
        'Only when `todos` changes, not after the first render',
        'After every render',
        'Only once',
      ],
      answer: 0,
      why: 'Every effect runs after the first render. After that, React re-runs it only when a value in the dependency array is different.',
    },
    {
      q: 'What happens when this component renders?',
      code: 'function Counter() {\n  const [count, setCount] = useState(0)\n\n  useEffect(() => {\n    setCount(count + 1)\n  })\n\n  return <p>{count}</p>\n}',
      options: [
        'An infinite loop: every render runs the effect, which triggers another render',
        'It shows 1 and stops',
        'It shows 0 and stops',
        'It throws, because effects cannot set state',
      ],
      answer: 0,
      why: 'Without a dependency array the effect runs after every render, and each run changes state, which renders again.',
    },
    {
      q: 'There is no dependency array. What happens every second?',
      code: 'useEffect(() => {\n  const id = setInterval(() => {\n    setCounter(counter + 1)\n  }, 1000)\n\n  return () => clearInterval(id)\n})',
      options: [
        'The counter goes up by one; the cleanup clears the old interval and the effect starts a new one',
        'A new interval is added each time, so the counter speeds up',
        'The counter goes to 1 and stays there',
        'Nothing; an effect cannot start a timer',
      ],
      answer: 0,
      why: 'The effect re-runs after every render, but its cleanup runs first and clears the previous interval, so only one timer is ever active.',
    },
    {
      q: 'An empty dependency array is added. What does the counter show after five seconds?',
      code: 'const [counter, setCounter] = useState(0)\n\nuseEffect(() => {\n  const id = setInterval(() => {\n    setCounter(counter + 1)\n  }, 1000)\n\n  return () => clearInterval(id)\n}, [])',
      options: ['`1`', '`5`', '`0`', '`4`'],
      answer: 0,
      why: 'The effect runs once and its callback keeps seeing the counter from the first render, 0. Every tick sets the state to 0 + 1. `setCounter(c => c + 1)` fixes it.',
    },
    {
      q: 'When does React call the function an effect returns?',
      options: [
        'Before the effect runs again, and when the component is removed',
        'Immediately after the effect, on the same render',
        'Only when the page is closed',
        'Only if the effect throws an error',
      ],
      answer: 0,
      why: 'That function is the cleanup. It undoes the previous effect before the next one starts, and once more when the component unmounts.',
    },
    {
      q: 'Why is this wrong?',
      code: "useEffect(async () => {\n  const response = await fetch('/api/posts')\n  setPosts(await response.json())\n}, [])",
      options: [
        'An async function returns a promise, but an effect must return nothing or a cleanup function',
        '`await` cannot be used together with `fetch`',
        'Effects are not allowed to set state',
        'The dependency array must contain `posts`',
      ],
      answer: 0,
      why: 'Define an async function inside the effect and call it, instead of making the effect function itself async.',
    },
    {
      q: 'What happens on the first render?',
      code: "function Users() {\n  const [users, setUsers] = useState()\n\n  useEffect(() => {\n    fetch('/api/users').then(r => r.json()).then(setUsers)\n  }, [])\n\n  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>\n}",
      options: [
        'TypeError: cannot read properties of undefined (reading \'map\')',
        'An empty list is shown until the data arrives',
        'The list of users is shown straight away',
        'The effect runs first, so the data is ready',
      ],
      answer: 0,
      why: 'Effects run after rendering, so on the first render `users` is still undefined. Start with `useState([])`.',
    },
    {
      q: 'Where should `setLoading(false)` go so that it runs whether the fetch succeeds or fails?',
      options: [
        'In the `finally` block',
        'At the end of the `try` block',
        'In the `catch` block',
        'Before the `try` block',
      ],
      answer: 0,
      why: '`finally` always runs. At the end of `try` it would be skipped on an error; in `catch` it would be skipped on success.',
    },
    {
      q: 'Which of these breaks the rules of hooks?',
      options: [
        '`if (isOpen) { const [text, setText] = useState(\'\') }`',
        '`const [text, setText] = useState(\'\')` on the first line of a component',
        'Calling `useEffect` twice in the same component',
        'Calling `useState` inside a custom hook named `useForm`',
      ],
      answer: 0,
      why: 'Hooks must be called in the same order on every render, so they cannot sit inside a condition.',
    },
    {
      q: 'When does the function passed to `useState` run?',
      code: "const [todos, setTodos] = useState(() => {\n  const json = localStorage.getItem('todos')\n  return json ? JSON.parse(json) : []\n})",
      options: [
        'Only on the first render',
        'On every render',
        'Every time `setTodos` is called',
        'Never; `useState` ignores functions',
      ],
      answer: 0,
      why: 'This is lazy initial state. React calls the function once to get the starting value and ignores it afterwards.',
    },
    {
      q: 'What does this line do in a form with several inputs?',
      code: 'setForm({ ...form, [event.target.name]: event.target.value })',
      options: [
        'Copies the form object and updates the one property named after the input that changed',
        'Replaces the whole form with a single property',
        'Creates an array containing the input\'s name and value',
        'Adds a property that is literally called `event.target.name`',
      ],
      answer: 0,
      why: 'The square brackets make a computed key: the input\'s `name` attribute decides which property is overwritten in the copy.',
    },
    {
      q: 'What is the most likely cause of the error "Too many re-renders"?',
      options: [
        'State is set during rendering, for example `onClick={setCount(count + 1)}`',
        'A list is rendered without keys',
        'A component has more than one `useState`',
        'An effect has an empty dependency array',
      ],
      answer: 0,
      why: 'Calling the setter while rendering triggers a new render, which calls it again. Wrap it: `onClick={() => setCount(count + 1)}`.',
    },
    {
      q: 'This runs in strict mode, as all module code does. What happens?',
      code: "const user = {\n  name: 'Ada',\n  greet() {\n    return 'Hi, ' + this.name\n  },\n}\n\nconst greet = user.greet\nconsole.log(greet())",
      options: [
        'It throws a TypeError, because `this` is undefined',
        "It prints `'Hi, Ada'`",
        "It prints `'Hi, undefined'`",
        "It prints `'Hi, user'`",
      ],
      answer: 0,
      why: '`this` is decided by how the function is called. Called on its own, with no object before the dot, `this` is undefined.',
    },
    {
      q: 'What happens on the last line?',
      code: "class Person {\n  #address = 'Example Street 1'\n\n  constructor(name) {\n    this.name = name\n  }\n}\n\nconst person = new Person('John')\nconsole.log(person.#address)",
      options: [
        'A SyntaxError: private fields cannot be accessed outside the class',
        "It prints `'Example Street 1'`",
        'It prints `undefined`',
        'It prints `null`',
      ],
      answer: 0,
      why: 'A hash field exists only for code inside the class body. Expose it through a getter if outside code needs to read it.',
    },
    {
      q: 'What does this print?',
      code: "class Person {\n  #address = 'Unknown'\n\n  get address() {\n    return this.#address\n  }\n\n  set address(value) {\n    if (value.trim() === '') return\n    this.#address = value\n  }\n}\n\nconst person = new Person()\nperson.address = 'Oulu'\nperson.address = '   '\nconsole.log(person.address)",
      options: ["`'Oulu'`", "`'   '`", "`'Unknown'`", 'It throws a TypeError'],
      answer: 0,
      why: 'Assigning to `address` runs the setter. The first value is stored; the second is only spaces, so the setter returns early and keeps Oulu.',
    },
    {
      q: 'What does this print?',
      code: 'class Temperature {\n  static toFahrenheit(celsius) {\n    return celsius * 9 / 5 + 32\n  }\n}\n\nconst t = new Temperature()\nconsole.log(Temperature.toFahrenheit(100), typeof t.toFahrenheit)',
      options: ["`212 'undefined'`", "`212 'function'`", "`undefined 'function'`", 'It throws a TypeError'],
      answer: 0,
      why: 'A static method lives on the class, not on its instances. That is why you write `Math.abs(-5)` without creating a Math object.',
    },
    {
      q: 'What does this print?',
      code: 'class Rectangle {\n  constructor(width, height) {\n    this.width = width\n    this.height = height\n  }\n\n  get area() {\n    return this.width * this.height\n  }\n}\n\nconst r = new Rectangle(2, 3)\nconsole.log(r.area)',
      options: ['`6`', 'The function itself', '`undefined`', 'It throws, because `area` was not called'],
      answer: 0,
      why: 'A getter is read like a property, without parentheses, and runs its method each time.',
    },
    {
      q: 'Which of these does the `new` operator NOT do?',
      options: [
        'Copy every method of the class onto the new object',
        'Create a new empty object',
        'Run the constructor with `this` set to the new object',
        'Return the new object',
      ],
      answer: 0,
      why: 'Methods are not copied. The new object is linked to the prototype, where the methods are stored once and shared.',
    },
  ],
}

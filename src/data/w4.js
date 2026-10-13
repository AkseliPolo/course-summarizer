// Week 4 — React basics

export default {
  id: 'w4',
  week: 4,
  title: 'React basics',
  blurb: 'Components, JSX, props, state with useState, event handlers, updating arrays in state, and thinking in React.',
  topics: [
    {
      title: 'What React is',
      points: [
        {
          term: 'React',
          core: true,
          text: 'React is a JavaScript library for building user interfaces out of components. You describe what the UI should look like for the current data, and React updates the DOM to match.',
        },
        {
          term: 'Declarative versus imperative',
          text: 'With the DOM API you write the steps: create an element, set its text, append it. With React you declare the result you want for a given state, and React works out the steps.',
        },
        {
          term: 'Components',
          fi: 'komponentti',
          core: true,
          text: 'A component is a JavaScript function that returns JSX. Its name must start with a capital letter, and you use it like an HTML tag. The same component can be rendered many times.',
          code: 'function Greeting() {\n  return <div>Hello Jaakko</div>\n}\n\nexport default Greeting',
        },
        {
          term: 'Entry point',
          text: 'The HTML file contains one empty root element. In `main.jsx`, `createRoot` takes that element and renders the top-level App component into it. Vite is the tool that runs the dev server and builds the project.',
          code: "createRoot(document.getElementById('root')).render(<App />)",
        },
        {
          term: 'Virtual DOM',
          text: 'When state changes, React calls your components again, compares the new result with the previous one, and changes only the DOM nodes that are actually different.',
        },
      ],
    },
    {
      title: 'JSX',
      points: [
        {
          term: 'JSX',
          core: true,
          text: 'JSX is a syntax that looks like HTML but lives inside JavaScript. A build tool compiles it into ordinary function calls; browsers cannot run it directly.',
        },
        {
          term: 'One root element',
          core: true,
          text: 'A component must return a single root element. To return several siblings without an extra div, wrap them in a fragment, written as an empty pair of tags.',
          code: 'return (\n  <>\n    <h1>Title</h1>\n    <p>Text</p>\n  </>\n)',
        },
        {
          term: 'Curly braces in JSX',
          core: true,
          text: 'Curly braces switch from markup back to JavaScript. Any expression can go inside: a variable, a calculation, a function call or a ternary. Statements such as `if` and `for` cannot.',
          code: '<h2>{props.name}</h2>\n<p>In stock: {props.inStock ? \'Yes\' : \'No\'}</p>',
        },
        {
          term: 'JSX differences from HTML',
          core: true,
          text: 'Use `className` instead of class and `htmlFor` instead of for. Event names are camelCase, as in `onClick`. Every tag must be closed. The `style` attribute takes an object, not a string.',
          code: '<label htmlFor="email" className="field">Email</label>\n<input id="email" />\n<div style={{ display: \'flex\', justifyContent: \'space-evenly\' }} />',
        },
        {
          term: 'Conditional rendering',
          fi: 'ehdollinen renderöinti',
          core: true,
          text: 'Use a ternary to choose between two things, the and-and operator to show something or nothing, or pick the JSX into a variable with ordinary `if` or `switch` before the return.',
          code: '{loading && <p>Loading...</p>}\n{error ? <p>{error}</p> : <List items={items} />}',
        },
        {
          term: 'Rendering lists',
          core: true,
          text: 'Turn an array of data into an array of elements with `map`. Each element in the list needs a `key`.',
          code: '{products.map(product => (\n  <ProductCard key={product.id} name={product.name} price={product.price} />\n))}',
        },
        {
          term: 'Keys',
          core: true,
          text: 'A key must be unique among siblings and stay the same between renders. It tells React which item is which when the list changes. Use an id from the data; an array index breaks when items are reordered or removed.',
        },
      ],
    },
    {
      title: 'Props',
      points: [
        {
          term: 'Props',
          fi: 'propsit',
          core: true,
          text: 'Props are the inputs a parent passes to a child component, written like HTML attributes. The child receives them all as one object.',
          code: '<ProductCard name="Carrot" price={2.5} inStock={true} />\n\nfunction ProductCard(props) {\n  return <h2>{props.name}</h2>\n}',
        },
        {
          term: 'Props are read-only',
          core: true,
          text: 'A component must never change its own props. If a value needs to change over time, it belongs in state.',
        },
        {
          term: 'Destructuring props',
          text: 'Instead of writing `props.name` everywhere, unpack the props directly in the parameter list.',
          code: 'function TodoItem({ todo, onToggle, onDelete }) { ... }',
        },
        {
          term: 'Passing values',
          text: 'A string can be passed in quotes. Everything else goes in curly braces: numbers, booleans, objects, arrays and functions.',
        },
        {
          term: 'One-way data flow',
          fi: 'yksisuuntainen tietovirta',
          core: true,
          text: 'Data flows down from parent to child through props. To send something back up, the parent passes a function as a prop and the child calls it.',
          code: '// parent\n<TodoItem todo={todo} onDelete={deleteItem} />\n\n// child\n<button onClick={() => onDelete(todo.id)}>Delete</button>',
        },
      ],
    },
    {
      title: 'State',
      points: [
        {
          term: 'State',
          fi: 'tila',
          core: true,
          text: 'State is a component\'s memory: data that changes over time and affects what is rendered. When state changes, React renders the component again.',
        },
        {
          term: 'useState',
          core: true,
          text: '`useState` returns a pair: the current value and a function to change it. The argument is the initial value, used only on the first render.',
          code: 'const [count, setCount] = useState(0)',
        },
        {
          term: 'Why a normal variable is not enough',
          core: true,
          text: 'A local variable is created fresh on every render, so its value is lost. And changing it does not tell React to render again, so the screen never updates.',
          code: 'function BadCounter() {\n  let count = 0\n  function handleClick() {\n    count = count + 1   // changes, but nothing re-renders\n  }\n  return <button onClick={handleClick}>Clicked {count} times</button>\n}',
        },
        {
          term: 'Setting state triggers a render',
          core: true,
          text: 'Calling the setter does two things: it stores the new value, and it asks React to call the component function again with that value.',
        },
        {
          term: 'State is a snapshot',
          core: true,
          text: 'Within one render the state variable never changes. After calling the setter, the variable still holds the old value until the next render, so logging it right away shows the old value.',
          code: "function handleClick() {\n  console.log('Before: ' + count)   // 0\n  setCount(count + 1)\n  console.log('After: ' + count)    // still 0\n}",
        },
        {
          term: 'Updater function',
          core: true,
          text: 'Passing a function to the setter gives you the latest pending value. Use it whenever the new state depends on the old one, especially when updating more than once in the same handler.',
          code: 'setCount(count + 1)\nsetCount(count + 1)        // still adds only 1 in total\n\nsetCount(c => c + 1)\nsetCount(c => c + 1)       // adds 2',
        },
        {
          term: 'State is private to each instance',
          text: 'If you render the same component three times, each one has its own separate state. Changing one does not affect the others.',
        },
        {
          term: 'Never mutate state',
          core: true,
          text: 'Treat state as read-only and always give the setter a new array or object. React compares references: if you change the existing array and pass the same one back, React sees no change and does not render.',
        },
      ],
    },
    {
      title: 'Arrays and objects in state',
      points: [
        {
          term: 'Adding to an array in state',
          core: true,
          text: 'Create a new array with the spread syntax and the new item. Do not use `push`.',
          code: '// todos.push(newTodo)   NOT like this\nsetTodos([...todos, newTodo])',
        },
        {
          term: 'Removing from an array in state',
          core: true,
          text: 'Use `filter` to build a new array without the item.',
          code: 'setTodos(todos.filter(todo => todo.id !== id))',
        },
        {
          term: 'Changing an item in an array in state',
          core: true,
          text: 'Use `map`. Return a changed copy for the matching item, made with spread, and return every other item as it is.',
          code: 'setTodos(todos.map(todo =>\n  todo.id === id ? { ...todo, done: !todo.done } : todo\n))',
        },
        {
          term: 'Updating an object in state',
          text: 'Spread the old object into a new one and override the properties that change.',
          code: "setUser({ ...user, name: 'Ada' })",
        },
      ],
    },
    {
      title: 'Events in React',
      points: [
        {
          term: 'Event handlers',
          fi: 'tapahtumankäsittelijä',
          core: true,
          text: 'Pass a function to `onClick`. Writing the function name with parentheses would call it during rendering instead of on click. To pass an argument, wrap the call in an arrow function.',
          code: '<button onClick={handleClick}>Add 1</button>\n<button onClick={() => setCount(count + 10)}>Add 10</button>\n<button onClick={handleClick()}>Wrong</button>',
        },
        {
          term: 'Controlled input',
          fi: 'kontrolloitu syöte',
          core: true,
          text: 'A controlled input gets its `value` from state and updates that state in `onChange`. State is the single source of truth, so the field always shows exactly what the state holds.',
          code: 'const [text, setText] = useState(\'\')\n\n<input value={text} onChange={event => setText(event.target.value)} />',
        },
        {
          term: 'Uncontrolled input',
          text: 'An input without a `value` prop keeps its own value in the DOM. You can still listen to `onChange`, but React does not decide what the field shows.',
        },
        {
          term: 'The React event object',
          text: 'Handlers receive an event object that works like the native one: `event.target.value` for a field\'s content, `event.preventDefault()` to stop a form from reloading the page.',
        },
      ],
    },
    {
      title: 'Thinking in React',
      points: [
        {
          term: 'Thinking in React',
          core: true,
          text: 'Five steps: break the UI into a component hierarchy, build a static version with props, find the minimal state, decide which component owns each piece of state, and add the callbacks that send changes back up.',
        },
        {
          term: 'What belongs in state',
          text: 'A value is not state if it never changes, if it arrives from a parent as a prop, or if it can be calculated from other state or props. Calculate derived values during rendering instead of storing them.',
        },
        {
          term: 'Lifting state up',
          fi: 'tilan nostaminen',
          core: true,
          text: 'When two components need the same data, move the state to their closest common parent. The parent passes the value down as a prop, together with a function the children call to change it.',
          code: '<StoreMenu\n  activeItemName={activeItemName}\n  updateActiveItem={name => setActiveItemName(name)}\n/>',
        },
        {
          term: 'Render and commit',
          core: true,
          text: 'Every update has three steps. A trigger: the first render or a state change. Rendering: React calls your components. Commit: React applies the differences to the DOM.',
        },
        {
          term: 'Rendering must be pure',
          text: 'Given the same props and state, a component should return the same JSX and change nothing outside itself. Side effects belong in event handlers or effects.',
        },
      ],
    },
  ],

  questions: [
    {
      q: 'Why must a React component\'s name start with a capital letter?',
      options: [
        'Lowercase names in JSX are treated as built-in HTML tags',
        'JavaScript functions must always be capitalised',
        'Capitalised functions run faster',
        'It is only a style convention with no effect',
      ],
      answer: 0,
      why: 'React decides by the first letter: `<div>` is an HTML element, `<Greeting>` is your component.',
    },
    {
      q: 'What is JSX?',
      options: [
        'A syntax extension that is compiled into JavaScript function calls',
        'A template language that browsers run directly',
        'A new version of HTML',
        'A CSS-in-JavaScript library',
      ],
      answer: 0,
      why: 'JSX only looks like HTML. A build tool such as Vite compiles it to JavaScript before the browser sees it.',
    },
    {
      q: 'What is wrong with this component?',
      code: 'function App() {\n  return (\n    <h1>Title</h1>\n    <p>Text</p>\n  )\n}',
      options: [
        'It returns two sibling elements without a single root',
        'The function name must be lowercase',
        'JSX cannot be wrapped in parentheses',
        'Nothing; it renders a heading and a paragraph',
      ],
      answer: 0,
      why: 'A component returns one root element. Wrap the siblings in a div or in a fragment: `<>...</>`.',
    },
    {
      q: 'Which attribute sets a CSS class in JSX?',
      options: ['`className`', '`class`', '`cssClass`', '`classList`'],
      answer: 0,
      why: '`class` is a reserved word in JavaScript, so JSX uses `className`.',
    },
    {
      q: 'The user clicks the button three times. What does the button say?',
      code: 'function BadCounter() {\n  let count = 0\n\n  function handleClick() {\n    count = count + 1\n  }\n\n  return <button onClick={handleClick}>Clicked {count} times</button>\n}',
      options: [
        'Clicked 0 times',
        'Clicked 3 times',
        'Clicked 1 times',
        'It throws an error on the first click',
      ],
      answer: 0,
      why: 'Changing a local variable does not trigger a render, so the screen never updates. This needs `useState`.',
    },
    {
      q: 'count is 0 and the button is clicked once. What is printed?',
      code: "const [count, setCount] = useState(0)\n\nfunction handleClick() {\n  console.log('Before: ' + count)\n  setCount(count + 1)\n  console.log('After: ' + count)\n}",
      options: [
        '`Before: 0` then `After: 0`',
        '`Before: 0` then `After: 1`',
        '`Before: 1` then `After: 1`',
        '`Before: 0` then `After: undefined`',
      ],
      answer: 0,
      why: 'State is a snapshot. The variable keeps its value for the whole render; the new value arrives with the next render.',
    },
    {
      q: 'count is 0. After one click, what is count?',
      code: 'function handleClick() {\n  setCount(count + 1)\n  setCount(count + 1)\n  setCount(count + 1)\n}',
      options: ['`1`', '`3`', '`0`', '`2`'],
      answer: 0,
      why: 'In this render count is 0, so all three calls say "set it to 1".',
    },
    {
      q: 'count is 0. After one click, what is count?',
      code: 'function handleClick() {\n  setCount(c => c + 1)\n  setCount(c => c + 1)\n  setCount(c => c + 1)\n}',
      options: ['`3`', '`1`', '`0`', '`2`'],
      answer: 0,
      why: 'An updater function receives the latest pending value, so the three updates build on each other.',
    },
    {
      q: 'A new todo is added but the list on screen does not change. Why?',
      code: 'function addNewTodo(text) {\n  todos.push({ id: todos.length + 1, title: text, done: false })\n  setTodos(todos)\n}',
      options: [
        'The same array is passed back, so React sees no change',
        '`push` cannot add objects to an array',
        '`setTodos` must be called before `push`',
        'State arrays are frozen, so `push` throws',
      ],
      answer: 0,
      why: 'React compares the old and new state by reference. Create a new array instead: `setTodos([...todos, newTodo])`.',
    },
    {
      q: 'Which line correctly removes the todo with the given id from state?',
      options: [
        '`setTodos(todos.filter(todo => todo.id !== id))`',
        '`setTodos(todos.splice(id, 1))`',
        '`todos.pop(id)`',
        '`setTodos(todos.filter(todo => todo.id === id))`',
      ],
      answer: 0,
      why: 'filter returns a new array that keeps everything except the matching item. The version that compares with `===` would keep only the item you wanted to delete.',
    },
    {
      q: 'What does `toggleTodo(2)` leave in state?',
      code: "// todos: [{ id: 1, done: true }, { id: 2, done: false }]\n\nfunction toggleTodo(id) {\n  setTodos(todos.map(todo =>\n    todo.id === id ? { ...todo, done: !todo.done } : todo\n  ))\n}",
      options: [
        '`[{ id: 1, done: true }, { id: 2, done: true }]`',
        '`[{ id: 2, done: true }]`',
        '`[{ id: 1, done: false }, { id: 2, done: true }]`',
        '`[{ id: 1, done: true }, { id: 2, done: false }]`',
      ],
      answer: 0,
      why: 'map keeps every item. Only the one whose id matches is replaced by a copy with done flipped.',
    },
    {
      q: 'What is the problem with this button?',
      code: '<button onClick={deleteItem(todo.id)}>Delete</button>',
      options: [
        '`deleteItem` is called during rendering, not when the button is clicked',
        '`onClick` cannot be used on a button',
        'Arguments cannot be passed to event handlers',
        'Nothing; this is correct',
      ],
      answer: 0,
      why: 'The parentheses call the function immediately. Wrap it: `onClick={() => deleteItem(todo.id)}`.',
    },
    {
      q: 'Can a child component change the props it receives?',
      options: [
        'No, props are read-only; it asks the parent to change by calling a function passed as a prop',
        'Yes, by assigning to `props.name`',
        'Yes, but only inside an event handler',
        'Yes, by calling `setProps`',
      ],
      answer: 0,
      why: 'Data flows one way, from parent to child. Changes go back up through callback props.',
    },
    {
      q: 'What is the `key` prop used for when rendering a list?',
      options: [
        'It lets React tell the items apart between renders',
        'It sets the element\'s `id` attribute in the DOM',
        'It sorts the list',
        'It is passed to the child as `props.key`',
      ],
      answer: 0,
      why: 'Keys give each item a stable identity so React can match old and new items. A key is not available to the child as a prop.',
    },
    {
      q: 'The cart is empty, so `count` is 0. What does this render inside the div?',
      code: 'return <div>{count && <p>Items: {count}</p>}</div>',
      options: ['`0`', 'Nothing', '`Items: 0`', '`false`'],
      answer: 0,
      why: 'And-and returns its left side when that is falsy, and React renders the number 0. Write `count > 0 && ...` instead.',
    },
    {
      q: 'Two sibling components need to show and change the same value. Where should the state live?',
      options: [
        'In their closest common parent, passed down as props',
        'In both components, kept in sync with effects',
        'In a global variable outside React',
        'In whichever sibling renders first',
      ],
      answer: 0,
      why: 'This is lifting state up. The parent owns the state and gives the children the value and a function to change it.',
    },
    {
      q: 'In which order do the three steps of a React update happen?',
      options: [
        'Trigger, render, commit',
        'Render, trigger, commit',
        'Commit, render, trigger',
        'Trigger, commit, render',
      ],
      answer: 0,
      why: 'Something triggers an update, React calls your components to render, and then commits the changes to the DOM.',
    },
    {
      q: 'The user types `ab` into this field, one letter at a time. What does the field show?',
      code: "const [textValue, setTextValue] = useState('')\n\nfunction handleChange(event) {\n  setTextValue(event.target.value.toUpperCase())\n}\n\nreturn <input type=\"text\" value={textValue} onChange={handleChange} />",
      options: ['`AB`', '`ab`', '`A`', 'Nothing; the field stays empty'],
      answer: 0,
      why: 'In a controlled input the field shows whatever is in state, and here the handler stores the uppercased text.',
    },
  ],
}

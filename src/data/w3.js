// Week 3 — The DOM

export default {
  id: 'w3',
  week: 3,
  title: 'DOM',
  blurb: 'The DOM tree, selecting and changing elements, events and delegation, forms, building dynamic content, and localStorage.',
  topics: [
    {
      title: 'The DOM',
      points: [
        {
          term: 'What the DOM is',
          fi: 'dokumenttioliomalli',
          core: true,
          text: 'The Document Object Model is the browser\'s live tree of objects built from the HTML. JavaScript changes what the user sees by changing this tree, not by editing the HTML file.',
        },
        {
          term: 'The document object',
          text: 'The global `document` object is the entry point to the tree. Every element, piece of text and comment in the page is a node somewhere beneath it.',
        },
        {
          term: 'Where to put scripts',
          core: true,
          text: 'A script runs as soon as the browser reaches it. If it runs before the elements exist, your selectors return null. Put the script at the end of the body, or load it with `defer` or `type="module"`.',
        },
        {
          term: 'ES modules',
          fi: 'moduulit',
          text: 'A file can `export` functions and values, and another file can `import` them by name. In the browser the entry script must be loaded with `type="module"`.',
          code: "// dataUtils.js\nexport function getInStock(cameras) {\n  return cameras.filter(camera => camera.inStock)\n}\n\n// main.js\nimport { getInStock } from './dataUtils.js'",
        },
      ],
    },
    {
      title: 'Selecting elements',
      points: [
        {
          term: 'querySelector',
          core: true,
          text: '`document.querySelector` takes any CSS selector and returns the first matching element, or null if nothing matches.',
          code: "const app = document.querySelector('#app')\nconst firstCard = document.querySelector('.product')",
        },
        {
          term: 'querySelectorAll',
          core: true,
          text: '`document.querySelectorAll` returns a NodeList of every match. A NodeList has `forEach` and works with `for...of`, but it is not an array: it has no `map` or `filter` until you convert it with `Array.from`.',
        },
        {
          term: 'getElementById',
          text: '`document.getElementById` finds one element by its id. Unlike `querySelector`, you pass the id without a hash sign.',
        },
        {
          term: 'closest',
          text: '`element.closest` takes a selector and walks upward from the element, returning the nearest ancestor that matches, or the element itself. It returns null if there is none.',
        },
      ],
    },
    {
      title: 'Changing the page',
      points: [
        {
          term: 'textContent',
          core: true,
          text: '`textContent` reads or replaces the text inside an element. Anything you assign is shown as plain text, so tags appear literally on screen. That makes it safe for user input.',
        },
        {
          term: 'innerHTML',
          core: true,
          text: '`innerHTML` parses the string you assign as HTML and builds elements from it. Never use it with text that came from a user, because it can inject scripts into your page.',
          code: "box.textContent = '<h1>Hi</h1>'   // shows the characters <h1>Hi</h1>\nbox.innerHTML   = '<h1>Hi</h1>'   // shows a heading that says Hi",
        },
        {
          term: 'classList',
          core: true,
          text: '`classList` adds, removes and toggles CSS classes without touching the others. `toggle` adds the class if it is missing and removes it if it is present.',
          code: "card.classList.add('product')\ncard.classList.toggle('favorite')",
        },
        {
          term: 'Attributes and data attributes',
          core: true,
          text: '`setAttribute` and `getAttribute` write and read any attribute. Custom data goes in attributes that start with `data-`. Whatever you read back is always a string, even if you stored a number.',
          code: "item.setAttribute('data-id', todo.id)   // stored as \"1\"\nitem.getAttribute('data-id')           // '1', a string",
        },
        {
          term: 'Creating elements',
          core: true,
          text: 'Building an element takes three steps: create it with `document.createElement`, fill in its content and classes, then attach it to the page with `append`. Until it is attached it is not visible.',
          code: "const title = document.createElement('h2')\ntitle.textContent = camera.model\narticle.append(title)",
        },
        {
          term: 'Removing and clearing',
          text: 'Call `element.remove()` to take one element out of the page. To empty a container, set its `textContent` or `innerHTML` to an empty string.',
        },
        {
          term: 'The render pattern',
          core: true,
          text: 'Keep the data in a JavaScript array, and write one render function that clears the container and rebuilds every element from the data. After any change to the data, call render again.',
          code: "function render(products) {\n  container.textContent = ''\n  for (const product of products) {\n    const card = document.createElement('div')\n    card.textContent = product.title\n    container.append(card)\n  }\n}",
        },
      ],
    },
    {
      title: 'Events',
      points: [
        {
          term: 'addEventListener',
          fi: 'tapahtumankuuntelija',
          core: true,
          text: '`addEventListener` takes an event name and a function, and calls the function every time that event happens on the element. Pass the function itself; do not call it.',
          code: "button.addEventListener('click', () => {\n  count++\n  counter.textContent = count\n})",
        },
        {
          term: 'The event object',
          core: true,
          text: 'The handler receives an event object describing what happened. `event.target` is the element the event started on, and for a text field `event.target.value` is its current content.',
        },
        {
          term: 'target versus currentTarget',
          core: true,
          text: '`event.target` is the innermost element that was actually clicked. `event.currentTarget` is the element the listener is attached to. They differ whenever the click lands on a child.',
        },
        {
          term: 'preventDefault',
          core: true,
          text: '`event.preventDefault()` cancels the browser\'s built-in reaction to an event, such as reloading the page when a form is submitted or following a link when it is clicked.',
        },
        {
          term: 'Bubbling',
          fi: 'kupliminen',
          core: true,
          text: 'After an event fires on an element, it travels up through every ancestor to the document, running their listeners for that event too. `event.stopPropagation()` stops the journey.',
        },
        {
          term: 'Event delegation',
          fi: 'tapahtumien delegointi',
          core: true,
          text: 'Instead of one listener per item, attach a single listener to their shared parent and use `event.target` with `closest` to find which item was hit. It works because of bubbling, and it also covers items added later.',
          code: "list.addEventListener('click', event => {\n  const item = event.target.closest('.list-item')\n  if (!item) return\n  toggle(item.getAttribute('data-id'))\n})",
        },
        {
          term: 'Common events',
          text: '`click` for buttons, `input` each time a field\'s value changes, `change` when a change is committed, `submit` on a form, `keydown` for key presses, and `DOMContentLoaded` when the HTML has been parsed.',
        },
      ],
    },
    {
      title: 'Forms',
      points: [
        {
          term: 'The submit event',
          core: true,
          text: 'Listen for `submit` on the form element, not for a click on the button, so pressing Enter works too. Call `preventDefault` first, or the browser reloads the page.',
          code: "form.addEventListener('submit', event => {\n  event.preventDefault()\n  addTodo(input.value.trim())\n  input.value = ''\n})",
        },
        {
          term: 'Reading input values',
          core: true,
          text: 'A field\'s `value` is always a string, even for a number input, so convert it with `Number` before doing arithmetic. A checkbox uses the boolean `checked` property instead.',
        },
        {
          term: 'Validation',
          text: 'HTML attributes such as `required`, `type`, `min` and `maxlength` give basic validation for free. In JavaScript, `trim` the value and reject it if it is empty.',
        },
        {
          term: 'Live filtering',
          text: 'Listen for the `input` event on a search field, filter the data array with `includes`, and render the result. Convert both sides with `toLowerCase` so the search ignores case.',
          code: "filterInput.addEventListener('input', event => {\n  const search = event.target.value.toLowerCase()\n  render(products.filter(p => p.title.toLowerCase().includes(search)))\n})",
        },
      ],
    },
    {
      title: 'localStorage',
      points: [
        {
          term: 'What localStorage is',
          core: true,
          text: 'A key and value store built into the browser. The data survives page reloads and browser restarts, and each origin has its own separate storage.',
        },
        {
          term: 'The localStorage API',
          core: true,
          text: '`setItem` saves a value under a key, `getItem` reads it back, `removeItem` deletes one key and `clear` deletes everything. Reading a key that does not exist gives null.',
        },
        {
          term: 'Strings only',
          core: true,
          text: 'localStorage can only store strings. Save an array or object with `JSON.stringify` and read it back with `JSON.parse`, with a fallback for the first visit when nothing is stored yet.',
          code: "localStorage.setItem('todos', JSON.stringify(todos))\n\nconst json = localStorage.getItem('todos')\nconst todos = json ? JSON.parse(json) : []",
        },
        {
          term: 'sessionStorage',
          text: '`sessionStorage` has the same API, but its data is cleared when the tab is closed.',
        },
        {
          term: 'Limits of localStorage',
          text: 'It holds about five megabytes, it is synchronous, and any script on the page can read it, so never store passwords or secrets there. Unlike cookies, it is not sent to the server.',
        },
      ],
    },
  ],

  questions: [
    {
      q: 'What is the DOM?',
      options: [
        'A tree of objects the browser builds from the HTML, which JavaScript can read and change',
        'The HTML file as it is stored on the server',
        'A JavaScript library for building user interfaces',
        'The part of CSS that controls layout',
      ],
      answer: 0,
      why: 'The DOM is the browser\'s in-memory model of the page. Changing it changes what is on screen; the HTML file itself is never modified.',
    },
    {
      q: 'What does the page show?',
      code: '<div id="test">Test</div>\n\n<script>\n  document.getElementById("test").textContent = "<h1>Hello World!</h1>"\n</script>',
      options: [
        'The literal text `<h1>Hello World!</h1>`, tags included',
        'A large heading that says Hello World!',
        'The original word Test',
        'Nothing; the div is emptied',
      ],
      answer: 0,
      why: '`textContent` never parses HTML, so the tags are shown as plain characters. `innerHTML` would have produced a heading.',
    },
    {
      q: 'There is no element with the class `sidebar` on the page. What does this print?',
      code: "const element = document.querySelector('.sidebar')\nconsole.log(element)",
      options: ['`null`', '`undefined`', 'An empty array', 'It throws an error'],
      answer: 0,
      why: '`querySelector` returns null when nothing matches. The error only comes later, when you try to use a property of null.',
    },
    {
      q: 'What happens when this runs on a page with three list items?',
      code: "const items = document.querySelectorAll('li')\nconst texts = items.map(li => li.textContent)",
      options: [
        'TypeError: `items.map` is not a function',
        '`texts` is an array of three strings',
        '`texts` is a NodeList of three strings',
        '`texts` is `undefined`',
      ],
      answer: 0,
      why: 'A NodeList has `forEach` but not `map`. Convert it first: `Array.from(items).map(...)`.',
    },
    {
      q: 'What does this print?',
      code: '<div id="box" class="card open"></div>\n\n<script>\n  const box = document.querySelector(\'#box\')\n  box.classList.toggle(\'open\')\n  box.classList.toggle(\'active\')\n  console.log(box.className)\n</script>',
      options: ["`'card active'`", "`'card open active'`", "`'card'`", "`'active'`"],
      answer: 0,
      why: 'toggle removes a class that is present and adds one that is missing. `open` is removed, `active` is added, `card` is untouched.',
    },
    {
      q: 'The page shows nothing new after this code runs. Why?',
      code: "const title = document.createElement('h2')\ntitle.textContent = 'Canon EOS R5'",
      options: [
        'The element was created but never attached to the page',
        '`createElement` only works for div elements',
        '`textContent` cannot be set on a new element',
        'The script needs to call `render()` afterwards',
      ],
      answer: 0,
      why: 'A created element lives only in memory until you attach it, for example with `document.body.append(title)`.',
    },
    {
      q: 'What is wrong with this line?',
      code: "button.addEventListener('click', handleClick())",
      options: [
        '`handleClick` runs immediately, and its return value is registered as the listener',
        'Nothing; this is the correct way to add a listener',
        'The event name should be `onclick`',
        '`addEventListener` needs a third argument',
      ],
      answer: 0,
      why: 'The parentheses call the function right away. Pass the function itself: `addEventListener(\'click\', handleClick)`.',
    },
    {
      q: 'The user clicks the Delete button. What is printed?',
      code: '<ul id="list">\n  <li><button>Delete</button></li>\n</ul>\n\n<script>\n  const list = document.querySelector(\'#list\')\n  list.addEventListener(\'click\', event => {\n    console.log(event.target.tagName, event.currentTarget.tagName)\n  })\n</script>',
      options: ['`BUTTON UL`', '`UL UL`', '`UL BUTTON`', '`BUTTON BUTTON`'],
      answer: 0,
      why: '`target` is the element that was actually clicked. `currentTarget` is the element the listener is attached to.',
    },
    {
      q: 'Why does a single click listener on a list also work for items added to the list later?',
      options: [
        'Click events bubble up from the item to the list, where the listener is',
        'The browser copies listeners onto new child elements automatically',
        '`addEventListener` re-runs whenever the DOM changes',
        'It does not work; each new item needs its own listener',
      ],
      answer: 0,
      why: 'This is event delegation. The listener is on the parent, and every click inside it bubbles up, no matter when the child was created.',
    },
    {
      q: 'The user ticks the checkbox of the first todo. What happens?',
      code: "let list = [{ id: 1, text: 'Learn JavaScript', completed: false }]\n\nfunction toggleState(id) {\n  const item = list.find(item => item.id === id)\n  if (item) item.completed = !item.completed\n}\n\n// inside the click listener; the element has data-id=\"1\"\ntoggleState(closestItem.getAttribute('data-id'))",
      options: [
        'Nothing changes, because the string `\'1\'` is not strictly equal to the number `1`',
        'The first todo is marked completed',
        'It throws a TypeError',
        'Every todo is marked completed',
      ],
      answer: 0,
      why: '`getAttribute` always returns a string. Either convert it with `Number`, or compare with double equals as the lecture demo did.',
    },
    {
      q: 'The counter starts at 0. What does it show after three clicks?',
      code: "button.addEventListener('click', () => {\n  let count = 0\n  count++\n  counter.textContent = count\n})",
      options: ['`1`', '`3`', '`0`', '`2`'],
      answer: 0,
      why: 'The variable is declared inside the handler, so every click starts again from 0. To keep state between clicks, declare it outside.',
    },
    {
      q: 'The user types 5 into the field. What is printed?',
      code: '<input id="amount" type="number">\n\n<script>\n  const amount = document.querySelector(\'#amount\').value\n  console.log(amount + 1)\n</script>',
      options: ["`'51'`", '`6`', '`NaN`', '`undefined`'],
      answer: 0,
      why: 'An input\'s value is always a string, even with `type="number"`. Plus with a string joins the two. Use `Number(amount) + 1`.',
    },
    {
      q: 'The user types `lap` into the search field. Which products are shown?',
      code: "const products = [{ title: 'Laptop' }, { title: 'Tablet' }]\n\nfilterInput.addEventListener('input', event => {\n  const searchText = event.target.value\n  render(products.filter(p => p.title.includes(searchText)))\n})",
      options: ['None', 'Laptop', 'Laptop and Tablet', 'Tablet'],
      answer: 0,
      why: '`includes` is case-sensitive, and `Laptop` contains a capital L. Lowercase both sides to make the search ignore case.',
    },
    {
      q: 'What does calling `event.preventDefault()` in a form\'s submit handler do?',
      options: [
        'Stops the browser from sending the form and reloading the page',
        'Stops the event from bubbling to parent elements',
        'Clears every field in the form',
        'Disables the submit button',
      ],
      answer: 0,
      why: 'The default action of a submit is a page navigation. Stopping bubbling is a different method, `stopPropagation`.',
    },
    {
      q: 'What does this print?',
      code: "localStorage.setItem('count', 5)\nconsole.log(typeof localStorage.getItem('count'))",
      options: ["`'string'`", "`'number'`", "`'object'`", "`'undefined'`"],
      answer: 0,
      why: 'localStorage stores everything as a string. The number 5 comes back as the string 5.',
    },
    {
      q: 'What does this print?',
      code: "localStorage.setItem('user', { name: 'Ada' })\nconsole.log(localStorage.getItem('user'))",
      options: ["`'[object Object]'`", "`{ name: 'Ada' }`", "`'{\"name\":\"Ada\"}'`", '`null`'],
      answer: 0,
      why: 'The object is converted to a string the default way, which loses the data. Save it with `JSON.stringify` instead.',
    },
    {
      q: 'What is the difference between localStorage and sessionStorage?',
      options: [
        'sessionStorage is cleared when the tab is closed; localStorage is kept',
        'sessionStorage is stored on the server; localStorage in the browser',
        'sessionStorage can store objects; localStorage only strings',
        'localStorage is cleared on every page reload',
      ],
      answer: 0,
      why: 'Both have the same API and both store only strings. They differ only in how long the data lives.',
    },
  ],
}

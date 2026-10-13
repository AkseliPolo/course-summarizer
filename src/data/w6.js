// Week 6 — Asynchronous JavaScript, Fetch, HTTP and REST

export default {
  id: 'w6',
  week: 6,
  title: 'Async, Fetch & REST',
  blurb: 'The event loop, callbacks, promises, async and await, the Fetch API, JSON over HTTP, and the ideas behind REST.',
  topics: [
    {
      title: 'Synchronous and asynchronous code',
      points: [
        {
          term: 'One thread',
          fi: 'yksisäikeinen',
          core: true,
          text: 'JavaScript runs one piece of code at a time. While a slow synchronous task is running, nothing else can happen: the page cannot respond to clicks or repaint.',
        },
        {
          term: 'Asynchronous operations',
          fi: 'asynkroninen',
          core: true,
          text: 'Slow work such as a network request or a timer is started and handed to the browser. Your code carries on immediately, and the result is handled later by a callback or a promise.',
        },
        {
          term: 'Event loop',
          fi: 'tapahtumasilmukka',
          core: true,
          text: 'Finished asynchronous work waits in a queue. The event loop takes the next callback from the queue only when the currently running code has completely finished. So asynchronous callbacks always run after the synchronous code around them.',
          code: "console.log('A')\nsetTimeout(() => console.log('B'), 0)\nconsole.log('C')\n// A, C, B",
        },
        {
          term: 'Promise callbacks run before timers',
          text: 'Promise callbacks wait in their own higher-priority queue. When the current code finishes, all pending promise callbacks run before any timer callback, even a timer of zero milliseconds.',
        },
      ],
    },
    {
      title: 'Callbacks',
      points: [
        {
          term: 'Callbacks',
          fi: 'takaisinkutsu',
          core: true,
          text: 'A callback is a function you pass to another function so that it can be called later, for example when a timer fires, an event happens or data arrives.',
        },
        {
          term: 'Callback hell',
          core: true,
          text: 'When several asynchronous steps depend on each other, callbacks end up nested inside callbacks. The code drifts to the right, becomes hard to read, and every level needs its own error handling. Promises were created to fix this.',
          code: 'loadUser(id, user => {\n  loadOrders(user, orders => {\n    loadInvoice(orders[0], invoice => {\n      show(invoice)\n    })\n  })\n})',
        },
      ],
    },
    {
      title: 'Promises',
      points: [
        {
          term: 'Promise',
          fi: 'lupaus',
          core: true,
          text: 'A promise is an object that stands for the eventual result of an asynchronous operation. You get it immediately, and attach handlers for the value that arrives later.',
        },
        {
          term: 'Promise states',
          core: true,
          text: 'A promise starts as pending. It then becomes either fulfilled with a value or rejected with an error. Once settled, it never changes again.',
        },
        {
          term: 'then',
          core: true,
          text: '`then` registers a function to run when the promise is fulfilled, and receives the value. It returns a new promise, which is what makes chaining possible.',
        },
        {
          term: 'Promise chaining',
          fi: 'ketjutus',
          core: true,
          text: 'Whatever a `then` handler returns becomes the input of the next `then`. If it returns a promise, the chain waits for it. If it returns nothing, the next handler receives undefined.',
          code: "fetch('/api/todos')\n  .then(response => response.json())\n  .then(todos => console.log(todos))\n  .catch(error => console.error(error))",
        },
        {
          term: 'catch',
          core: true,
          text: '`catch` handles a rejection from any earlier step in the chain, including an error thrown inside a `then` handler. After a catch has handled the error, the chain continues normally.',
        },
        {
          term: 'finally',
          text: '`finally` runs whether the promise was fulfilled or rejected. It receives no value and is meant for cleanup, such as hiding a loading indicator.',
        },
        {
          term: 'Creating a promise',
          text: 'The Promise constructor takes a function with two parameters, `resolve` and `reject`. Call `resolve` with the result when the work succeeds, or `reject` with an error when it fails.',
          code: 'function wait(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms))\n}',
        },
        {
          term: 'Promise.all',
          text: '`Promise.all` takes an array of promises, runs them in parallel, and fulfils with an array of all their results. If any one of them rejects, the whole thing rejects.',
          code: "const [categories, products] = await Promise.all([\n  api('/categories'),\n  api('/products'),\n])",
        },
      ],
    },
    {
      title: 'async and await',
      points: [
        {
          term: 'async functions',
          core: true,
          text: 'A function marked `async` always returns a promise. A value you return becomes the fulfilled value; an error you throw becomes a rejection.',
        },
        {
          term: 'await',
          core: true,
          text: '`await` pauses the async function until a promise settles, then gives you its value. Only that function is paused; the rest of the program keeps running.',
          code: "async function loadTodos() {\n  const response = await fetch('/api/todos')\n  const todos = await response.json()\n  return todos\n}",
        },
        {
          term: 'Where await is allowed',
          core: true,
          text: '`await` can only be used inside an async function, or at the top level of a module. Anywhere else it is a syntax error.',
        },
        {
          term: 'Errors with await',
          core: true,
          text: 'When an awaited promise rejects, `await` throws the error. Put the awaits in a `try` block and handle failures in `catch`, exactly like synchronous errors.',
        },
        {
          term: 'Forgetting await',
          core: true,
          text: 'Without `await` you get the pending promise itself, not its value. The code keeps running with a promise where you expected data, which usually shows up as undefined properties.',
        },
        {
          term: 'Sequential versus parallel',
          text: 'Two awaits in a row run one after the other: the second request starts only when the first has finished. To run independent requests at the same time, start them together and await `Promise.all`.',
        },
        {
          term: 'Syntactic sugar over promises',
          text: 'Async and await do not replace promises; they are a more readable way to use them. Any async function can also be consumed with `then` and `catch`.',
        },
      ],
    },
    {
      title: 'The Fetch API',
      points: [
        {
          term: 'fetch',
          core: true,
          text: '`fetch` starts an HTTP request and returns a promise. That promise fulfils with a Response object as soon as the status and headers arrive. It is not the data yet.',
        },
        {
          term: 'Two awaits',
          core: true,
          text: 'Reading data takes two steps, and both are asynchronous. First await `fetch` to get the response. Then await `response.json()` to download the body and parse it.',
        },
        {
          term: 'response.ok and status',
          core: true,
          text: '`response.status` is the numeric status code. `response.ok` is true when the status is between 200 and 299.',
        },
        {
          term: 'fetch does not reject on HTTP errors',
          core: true,
          text: 'The fetch promise rejects only when the request itself fails, such as a network error or a blocked request. A 404 or a 500 still fulfils normally. You must check `response.ok` yourself and throw if it is false.',
          code: "const response = await fetch(url)\nif (!response.ok) {\n  throw new Error('HTTP error: ' + response.status)\n}\nconst data = await response.json()",
        },
        {
          term: 'POST with JSON',
          core: true,
          text: 'To send data, pass an options object: the `method`, a `Content-Type` header of `application/json`, and a `body` that is a string made with `JSON.stringify`.',
          code: "const response = await fetch('/api/todos', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Buy milk' }),\n})\nconst created = await response.json()",
        },
        {
          term: 'PUT, PATCH and DELETE with fetch',
          text: 'The other methods follow the same pattern as POST: set `method`, and include headers and a body when you send data. A DELETE usually has no body.',
        },
        {
          term: 'Reading the body',
          text: '`response.json()` parses the body as JSON and `response.text()` gives it as a plain string. The body can be read only once, and parsing an empty or non-JSON body as JSON throws.',
        },
      ],
    },
    {
      title: 'JSON over HTTP',
      points: [
        {
          term: 'JSON as the data format',
          core: true,
          text: 'APIs send data as JSON text with the header `Content-Type: application/json`. On the client, `response.json()` turns that text into ordinary JavaScript objects and arrays.',
        },
        {
          term: 'Finding the data in a response',
          text: 'An API often wraps its list inside an object. Look at the response shape first: the array may be at `data.posts` or `data.recipes` rather than at the top level.',
        },
        {
          term: 'Unexpected token errors',
          text: 'A SyntaxError about an unexpected token while parsing usually means the server did not send JSON at all. Often it sent an HTML error page because the URL was wrong.',
        },
      ],
    },
    {
      title: 'REST',
      points: [
        {
          term: 'REST',
          core: true,
          text: 'REST is a style for designing web APIs. Data is modelled as resources, each resource has a URL, the HTTP method says what to do with it, and every request is stateless.',
        },
        {
          term: 'Resource URLs',
          fi: 'resurssi',
          core: true,
          text: 'URLs name things, not actions. Use plural nouns: `/todos` is the whole collection and `/todos/42` is one item. The action comes from the HTTP method, so a path like `/getTodos` is never needed.',
          code: 'GET    /todos        all todos\nGET    /todos/42     one todo\nPOST   /todos        create a todo\nPUT    /todos/42     replace todo 42\nDELETE /todos/42     delete todo 42',
        },
        {
          term: 'CRUD and HTTP methods',
          core: true,
          text: 'The four basic data operations map onto methods. Create is POST, read is GET, update is PUT or PATCH, and delete is DELETE.',
        },
        {
          term: 'Stateless requests',
          text: 'Each request must carry everything the server needs to handle it. The server does not remember which request came before.',
        },
      ],
    },
  ],

  questions: [
    {
      q: 'In what order are the letters printed?',
      code: "console.log('A')\nsetTimeout(() => console.log('B'), 0)\nconsole.log('C')",
      options: ['A C B', 'A B C', 'B A C', 'C A B'],
      answer: 0,
      why: 'Even with a delay of zero, the timer callback waits in the queue until all the synchronous code has finished.',
    },
    {
      q: 'In what order are the numbers printed?',
      code: 'console.log(1)\nsetTimeout(() => console.log(2), 0)\nPromise.resolve().then(() => console.log(3))\nconsole.log(4)',
      options: ['1 4 3 2', '1 2 3 4', '1 4 2 3', '1 3 4 2'],
      answer: 0,
      why: 'Synchronous code first: 1 and 4. Then promise callbacks, which have priority over timers: 3. The timer comes last: 2.',
    },
    {
      q: 'Which of these is NOT a state a promise can be in?',
      options: ['Cancelled', 'Pending', 'Fulfilled', 'Rejected'],
      answer: 0,
      why: 'A promise is pending, then settles as fulfilled or rejected. There is no cancelled state.',
    },
    {
      q: 'What is printed?',
      code: 'Promise.resolve(2)\n  .then(n => n * 3)\n  .then(n => { console.log(n) })\n  .then(n => console.log(n))',
      options: ['`6` then `undefined`', '`6` then `6`', '`2` then `6`', '`6` only'],
      answer: 0,
      why: 'The second handler logs 6 but returns nothing, so the third handler receives undefined.',
    },
    {
      q: 'What is printed?',
      code: "Promise.reject(new Error('fail'))\n  .then(() => console.log('A'))\n  .catch(() => console.log('B'))\n  .then(() => console.log('C'))",
      options: ['B C', 'A B C', 'B', 'A C'],
      answer: 0,
      why: 'The rejection skips the first then and lands in catch. Once catch has handled it, the chain continues with the next then.',
    },
    {
      q: 'What does this print?',
      code: 'async function getNumber() {\n  return 42\n}\n\nconst result = getNumber()\nconsole.log(result)',
      options: ['A promise', '`42`', '`undefined`', 'It throws a SyntaxError'],
      answer: 0,
      why: 'An async function always returns a promise. To get 42 you need `await getNumber()` or `.then`.',
    },
    {
      q: 'The API returns a JSON array. What does this print?',
      code: "async function load() {\n  const response = await fetch('/api/todos')\n  const todos = response.json()\n  console.log(Array.isArray(todos))\n}",
      options: ['`false`', '`true`', '`undefined`', 'It throws a TypeError'],
      answer: 0,
      why: '`response.json()` returns a promise. Without `await`, `todos` is that promise, not the array.',
    },
    {
      q: 'In what order are the numbers printed?',
      code: "async function run() {\n  console.log('1')\n  await null\n  console.log('2')\n}\n\nrun()\nconsole.log('3')",
      options: ['1 3 2', '1 2 3', '3 1 2', '1 3'],
      answer: 0,
      why: 'The function runs synchronously up to the first await. await pauses it and lets the rest of the script continue, so 3 is printed before 2.',
    },
    {
      q: 'The server answers this request with status 404. What is printed?',
      code: "try {\n  const response = await fetch('/api/missing')\n  console.log('ok: ' + response.ok)\n} catch (error) {\n  console.log('caught')\n}",
      options: ['`ok: false`', '`caught`', '`ok: true`', 'Nothing'],
      answer: 0,
      why: 'fetch only rejects when the request itself fails. A 404 is a normal response with `ok` set to false.',
    },
    {
      q: 'When does the promise returned by `fetch` reject?',
      options: [
        'When the request cannot be completed, for example a network failure',
        'Whenever the status code is 400 or higher',
        'Whenever the status code is 500 or higher',
        'When the response body is not JSON',
      ],
      answer: 0,
      why: 'HTTP error statuses still fulfil. Check `response.ok` and throw your own error for those.',
    },
    {
      q: 'What is printed?',
      code: "async function load() {\n  try {\n    throw new Error('x')\n    console.log('A')\n  } catch {\n    console.log('B')\n  } finally {\n    console.log('C')\n  }\n}\n\nload()",
      options: ['B C', 'A B C', 'B', 'A C'],
      answer: 0,
      why: 'The throw jumps straight to catch, skipping the rest of try. finally always runs afterwards.',
    },
    {
      q: 'What is missing from this request if the server should receive JSON?',
      code: "await fetch('/api/todos', {\n  method: 'POST',\n  body: { name: 'Buy milk' },\n})",
      options: [
        'The body must be `JSON.stringify(...)` and a `Content-Type: application/json` header is needed',
        'Nothing; fetch converts objects to JSON automatically',
        'The method should be GET when sending data',
        'Only the URL needs to end in `.json`',
      ],
      answer: 0,
      why: 'fetch sends the body as given. An object would be sent as the text `[object Object]`, and without the header the server will not parse it as JSON.',
    },
    {
      q: 'The request returns `{ "posts": [...], "total": 251 }`. Which line stores the list of posts in state?',
      code: "const response = await fetch('https://dummyjson.com/posts')\nconst data = await response.json()",
      options: ['`setPosts(data.posts)`', '`setPosts(data)`', '`setPosts(response.posts)`', '`setPosts(JSON.parse(data))`'],
      answer: 0,
      why: 'The array is one level down, inside the `posts` property of the parsed object.',
    },
    {
      q: 'Which request follows REST conventions for reading the todo with id 7?',
      options: ['`GET /todos/7`', '`GET /getTodo?id=7`', '`POST /todos/get/7`', '`GET /todo/read/7`'],
      answer: 0,
      why: 'The URL names the resource with a plural noun and its id. The method, GET, says what to do with it.',
    },
    {
      q: 'Which HTTP method creates a new resource in a REST API?',
      options: ['POST', 'GET', 'PUT', 'DELETE'],
      answer: 0,
      why: 'Create maps to POST, read to GET, update to PUT or PATCH, and delete to DELETE.',
    },
    {
      q: 'What problem do promises solve compared with plain callbacks?',
      options: [
        'Deeply nested callbacks that are hard to read and to handle errors in',
        'JavaScript being single-threaded',
        'Network requests being slow',
        'Variables being function-scoped',
      ],
      answer: 0,
      why: 'Promises flatten "callback hell" into a chain and let one `catch` handle errors from every step.',
    },
    {
      q: 'One of the three requests fails. What happens to `Promise.all`?',
      code: 'const results = await Promise.all([loadA(), loadB(), loadC()])',
      options: [
        'It rejects, and the await throws',
        'It fulfils with the two successful results',
        'It fulfils with `undefined` in place of the failed one',
        'It waits forever',
      ],
      answer: 0,
      why: '`Promise.all` is all-or-nothing: it fulfils only if every promise fulfils.',
    },
    {
      q: 'What happens when this code is loaded?',
      code: "function load() {\n  const response = await fetch('/api/todos')\n  return response.json()\n}",
      options: [
        'A SyntaxError, because `await` is used in a function that is not async',
        'It works, and returns the todos',
        'It returns a pending promise',
        'It returns `undefined`',
      ],
      answer: 0,
      why: '`await` is only valid inside an `async` function, or at the top level of a module.',
    },
  ],
}

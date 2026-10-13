// Week 7 — Node.js, Express and the full stack

export default {
  id: 'w7',
  week: 7,
  title: 'Express & full stack',
  blurb: 'HTTP methods and status codes in depth, Node.js, building a REST API with Express, CORS and the dev proxy, connecting React to the backend, and error handling.',
  topics: [
    {
      title: 'HTTP methods',
      points: [
        {
          term: 'GET',
          core: true,
          text: 'GET reads a resource. It has no body, and it must not change anything on the server.',
        },
        {
          term: 'POST',
          core: true,
          text: 'POST creates a new resource or submits data, which travels in the request body. Sending the same POST twice creates two resources.',
        },
        {
          term: 'PUT and PATCH',
          core: true,
          text: 'PUT replaces a whole resource with the one in the body, so every field must be sent. PATCH changes only the fields that are included.',
        },
        {
          term: 'DELETE',
          core: true,
          text: 'DELETE removes the resource at the URL.',
        },
        {
          term: 'Safe methods',
          fi: 'turvallinen',
          core: true,
          text: 'A method is safe if it does not change anything on the server. GET is safe. POST, PUT, PATCH and DELETE are not.',
        },
        {
          term: 'Idempotent methods',
          fi: 'idempotentti',
          core: true,
          text: 'A method is idempotent if sending the same request many times leaves the server in the same state as sending it once. GET, PUT and DELETE are idempotent. POST is not.',
        },
      ],
    },
    {
      title: 'Status codes in depth',
      points: [
        {
          term: '200 and 201',
          core: true,
          text: '200 OK is the general success code. 201 Created is the answer to a POST that created something; the body normally contains the new resource, and a Location header gives its URL.',
        },
        {
          term: '204 No Content',
          core: true,
          text: '204 means the request succeeded and there is deliberately no body. It is the usual answer to a successful DELETE.',
        },
        {
          term: '400 Bad Request',
          core: true,
          text: '400 means the request itself is wrong: broken JSON, a missing required field, or a value of the wrong type. The client has to fix the request.',
        },
        {
          term: '401 and 403',
          core: true,
          text: '401 Unauthorized means the server does not know who you are: log in first. 403 Forbidden means it knows who you are, and you are not allowed.',
        },
        {
          term: '404 Not Found',
          core: true,
          text: '404 means there is no resource at this URL, for example an id that does not exist.',
        },
        {
          term: '409 and 422',
          text: '409 Conflict means the request clashes with the current state, such as a duplicate. 422 Unprocessable Content means the request is well-formed but fails validation rules.',
        },
        {
          term: '500 Internal Server Error',
          core: true,
          text: '500 means the server code failed with an error it did not handle. It is the server\'s fault, not the client\'s.',
        },
      ],
    },
    {
      title: 'Node.js',
      points: [
        {
          term: 'Node.js',
          core: true,
          text: 'Node.js runs JavaScript outside the browser. It has no window, no document and no DOM, but it can read files, listen on network ports and talk to databases.',
        },
        {
          term: 'npm and package.json',
          core: true,
          text: 'npm installs packages into the `node_modules` folder. `package.json` lists the project\'s dependencies and its scripts, so anyone can recreate the folder with `npm install`. `node_modules` is never committed to git.',
        },
        {
          term: 'CommonJS and ES modules',
          text: 'Node supports two module systems. CommonJS uses `require` and `module.exports`. ES modules use `import` and `export`, and are enabled by setting type to module in `package.json`.',
          code: "const express = require('express')   // CommonJS\nimport express from 'express'        // ES module",
        },
        {
          term: 'Front end versus back end',
          core: true,
          text: 'Front-end code is downloaded and run in each user\'s browser, so users can read and change it. Back-end code runs on the server, where it can keep secrets, enforce rules and access the database.',
        },
        {
          term: 'Environment variables',
          text: 'Settings that differ between machines, such as the port, are read from `process.env` with a fallback for local development.',
          code: 'const port = Number(process.env.PORT || 3000)',
        },
      ],
    },
    {
      title: 'Express',
      points: [
        {
          term: 'Express',
          core: true,
          text: 'Express is a minimal web framework for Node. You create an app, register routes and middleware on it, and start it listening on a port.',
          code: "const express = require('express')\nconst app = express()\n\napp.use(express.json())\n\napp.get('/todos', (req, res) => {\n  res.json(todos)\n})\n\napp.listen(3000, () => {\n  console.log('Listening on port 3000')\n})",
        },
        {
          term: 'Routes',
          fi: 'reitti',
          core: true,
          text: 'A route is the combination of an HTTP method and a path, with a handler function. `app.get`, `app.post`, `app.put`, `app.patch` and `app.delete` each register one.',
        },
        {
          term: 'req and res',
          core: true,
          text: 'Every handler receives two objects. `req` describes the incoming request: its params, query, body and headers. `res` is what you use to send the response.',
        },
        {
          term: 'Route parameters',
          core: true,
          text: 'A colon in a path marks a parameter. With the path `/todos/:id`, a request for `/todos/42` puts 42 into `req.params.id`, as a string. Convert it with `Number` if your ids are numbers.',
          code: "app.get('/api/orders/:id', (req, res) => {\n  const id = Number(req.params.id)\n  ...\n})",
        },
        {
          term: 'Request body',
          core: true,
          text: 'A JSON request body is available as `req.body`, but only if the `express.json()` middleware has been registered. Without it, `req.body` is undefined.',
        },
        {
          term: 'Sending responses',
          core: true,
          text: '`res.json` sends data as JSON with status 200. Chain `res.status` in front to choose another code. Each request must get exactly one response, so `return` after sending an error.',
          code: "res.json(todos)                                  // 200\nres.status(201).json(todo)                       // 201 Created\nres.status(204).end()                            // 204, no body\nreturn res.status(404).json({ error: 'Not found' })",
        },
        {
          term: 'Middleware',
          fi: 'väliohjelmisto',
          core: true,
          text: 'Middleware is a function that runs before the route handlers, in the order it was registered with `app.use`. It can read or change the request, and must either send a response or call `next` to pass the request on.',
          code: "app.use('/todos/:id', (req, res, next) => {\n  const todo = todos.find(todo => todo.id === req.params.id)\n  if (!todo) return res.status(404).json({ error: 'Not found' })\n  req.todo = todo\n  next()\n})",
        },
        {
          term: 'Error-handling middleware',
          text: 'Express recognises an error handler by its four parameters: error, request, response and next. Register it last. It is where you turn unexpected errors into a 500 response.',
        },
      ],
    },
    {
      title: 'Building a REST API',
      points: [
        {
          term: 'CRUD routes',
          core: true,
          text: 'A complete resource has five routes: GET the collection, GET one item by id, POST to create, PUT or PATCH an item by id to update it, and DELETE an item by id.',
        },
        {
          term: 'A POST handler',
          core: true,
          text: 'Validate the body and answer 400 if it is invalid. Otherwise build the new object with an id generated on the server, store it, and answer 201 with the created object.',
          code: "app.post('/todos', (req, res) => {\n  const error = validateTodo(req.body)\n  if (error) return res.status(400).json({ error })\n\n  const todo = { id: randomUUID(), name: req.body.name.trim(), done: false }\n  todos.push(todo)\n  res.status(201).location('/todos/' + todo.id).json(todo)\n})",
        },
        {
          term: 'Validating on the server',
          core: true,
          text: 'Never trust data from the client. Anyone can send any request, so the server must check every field itself, even when the React form already validates.',
        },
        {
          term: 'In-memory data',
          text: 'Data kept in an array variable lives only as long as the server process. Restarting the server loses it all. Real applications store data in a database.',
        },
        {
          term: 'Unknown routes',
          text: 'A final `app.use` without a path catches every request no earlier route answered. Use it to send a 404 as JSON, so API clients never receive an HTML page.',
        },
      ],
    },
    {
      title: 'CORS and the dev proxy',
      points: [
        {
          term: 'Origin',
          fi: 'alkuperä',
          core: true,
          text: 'An origin is the combination of scheme, host and port. Localhost on port 5173 and localhost on port 3000 are two different origins, because the ports differ.',
        },
        {
          term: 'Same-origin policy',
          core: true,
          text: 'For security, the browser does not let JavaScript read a response from a different origin unless that server explicitly allows it.',
        },
        {
          term: 'CORS',
          core: true,
          text: 'Cross-Origin Resource Sharing is how a server gives that permission. It adds the header `Access-Control-Allow-Origin` to its responses, naming the origins that may read them.',
        },
        {
          term: 'Who enforces CORS',
          core: true,
          text: 'CORS is enforced by the browser, not by the server. Tools such as curl or Postman are not affected at all. So a CORS error is always fixed on the server side, never in the React code.',
        },
        {
          term: 'The cors middleware',
          text: 'In Express, install the `cors` package and register it before the routes. It adds the right headers and answers the browser\'s preflight requests.',
          code: "const cors = require('cors')\napp.use(cors())",
        },
        {
          term: 'Preflight request',
          text: 'Before a cross-origin request that sends JSON or uses PUT, PATCH or DELETE, the browser first sends an OPTIONS request to ask whether the real request is allowed.',
        },
        {
          term: 'Dev proxy',
          fi: 'välityspalvelin',
          core: true,
          text: 'The alternative is to avoid crossing origins. The Vite dev server can forward every request that starts with `/api` to the Express server. The browser only ever talks to its own origin, so CORS never comes into play.',
          code: "// vite.config.js\nserver: {\n  proxy: { '/api': 'http://127.0.0.1:3000' },\n}",
        },
        {
          term: 'Serving the build from Express',
          text: 'In production, Express can serve the built React files itself with `express.static`. Front end and API then share one origin.',
        },
      ],
    },
    {
      title: 'Connecting React to the backend',
      points: [
        {
          term: 'Full-stack architecture',
          core: true,
          text: 'The React app runs in the browser and holds the UI state. The Express server owns the data. They communicate only through HTTP requests carrying JSON.',
        },
        {
          term: 'Loading on mount',
          core: true,
          text: 'Fetch the initial data in an effect with an empty dependency array, and put the result into state.',
        },
        {
          term: 'Creating through the API',
          core: true,
          text: 'Send a POST, wait for the response, and add the object the server returned to state. The server\'s version is the one to use, because it contains the generated id.',
          code: "const created = await api('/todos', {\n  method: 'POST',\n  body: JSON.stringify({ name }),\n})\nsetTodos([...todos, created])",
        },
        {
          term: 'A fetch wrapper',
          text: 'Put the repeated work in one function: prefix the path, set the JSON header, parse the body, and throw an Error when `response.ok` is false. Components then only deal with data or a caught error.',
          code: "export async function api(path, options = {}) {\n  const response = await fetch('/api' + path, {\n    ...options,\n    headers: { 'Content-Type': 'application/json', ...options.headers },\n  })\n  const data = await response.json()\n  if (!response.ok) throw new Error(data.error || 'HTTP error ' + response.status)\n  return data\n}",
        },
        {
          term: 'Preventing double submits',
          text: 'Keep a sending flag in state. Set it to true before the request and back to false in `finally`, and disable the form while it is true.',
        },
      ],
    },
    {
      title: 'Error handling',
      points: [
        {
          term: 'try, catch and finally',
          fi: 'virheenkäsittely',
          core: true,
          text: 'When an error is thrown inside `try`, the rest of that block is skipped and `catch` runs. `finally` runs afterwards in every case, success or failure.',
        },
        {
          term: 'Throwing errors',
          text: 'Create your own error with `throw new Error` and a message. The message is available in the catch block as `error.message`.',
        },
        {
          term: 'Two kinds of fetch failure',
          core: true,
          text: 'A network failure makes fetch reject, so it lands in `catch` by itself. An HTTP error status does not: the promise fulfils, and you must check `response.ok` and throw yourself.',
        },
        {
          term: 'Errors in promise chains',
          text: 'A `catch` at the end of a chain handles a rejection from any step before it, including an error thrown inside a `then`. A rejected promise that nothing catches is reported as an uncaught error in the console.',
        },
        {
          term: 'try and catch need await',
          core: true,
          text: 'A `try` block only catches a rejected promise if you `await` it inside the block. Without `await`, the function has already moved on when the rejection happens, and the error goes unhandled.',
        },
        {
          term: 'Showing errors to the user',
          text: 'Store the error message in state and render it, ideally with a way to retry. A failed request should never leave the user looking at a blank or frozen screen.',
        },
      ],
    },
  ],

  questions: [
    {
      q: 'Which of these HTTP methods is NOT idempotent?',
      options: ['POST', 'GET', 'PUT', 'DELETE'],
      answer: 0,
      why: 'Repeating a POST creates a new resource each time. Repeating a GET, PUT or DELETE leaves the server in the same state as doing it once.',
    },
    {
      q: 'What does it mean that an HTTP method is "safe"?',
      options: [
        'It does not change anything on the server',
        'It is always sent over an encrypted connection',
        'It can be repeated with the same result',
        'It requires the user to be logged in',
      ],
      answer: 0,
      why: 'Safe means read-only. Being repeatable with the same effect is idempotency, a different property.',
    },
    {
      q: 'Which status code should a successful `POST /todos` return?',
      options: ['201 Created', '200 OK', '204 No Content', '202 Accepted'],
      answer: 0,
      why: '201 says a new resource was created. The body normally contains it, including the id the server generated.',
    },
    {
      q: 'A todo is deleted successfully and the server sends no body. Which status code fits?',
      options: ['204 No Content', '201 Created', '404 Not Found', '200 OK with an empty string'],
      answer: 0,
      why: '204 means success with deliberately no body.',
    },
    {
      q: 'What is the difference between 401 and 403?',
      options: [
        '401: the server does not know who you are. 403: it knows, and you are not allowed',
        '401: you are not allowed. 403: the server does not know who you are',
        '401 is a server error, 403 is a client error',
        'They mean the same thing',
      ],
      answer: 0,
      why: '401 is about authentication (log in first). 403 is about authorisation (logged in, but no permission).',
    },
    {
      q: 'A client sends `POST /todos` with a body that has no name, and the name is required. Which status code should the server return?',
      options: ['400 Bad Request', '500 Internal Server Error', '404 Not Found', '201 Created'],
      answer: 0,
      why: 'The request is invalid and the client must fix it, so it is a 4xx code. 500 would wrongly blame the server.',
    },
    {
      q: 'What is Node.js?',
      options: [
        'A runtime that runs JavaScript outside the browser',
        'A JavaScript framework for building user interfaces',
        'A web server written in C++',
        'A database for JSON documents',
      ],
      answer: 0,
      why: 'Node is the environment. Express is a framework that runs on Node; React is a UI library.',
    },
    {
      q: 'Which of these is NOT available in Node.js?',
      options: ['`document`', '`console`', '`setTimeout`', '`JSON`'],
      answer: 0,
      why: 'There is no page in Node, so there is no `document`, `window` or DOM.',
    },
    {
      q: 'A client requests `GET /users/42`. What does the server send?',
      code: "app.get('/users/:id', (req, res) => {\n  res.json({ id: req.params.id, type: typeof req.params.id })\n})",
      options: [
        '`{"id":"42","type":"string"}`',
        '`{"id":42,"type":"number"}`',
        '`{"id":":id","type":"string"}`',
        '`{"type":"undefined"}`',
      ],
      answer: 0,
      why: 'Route parameters are parts of the URL, so they are always strings.',
    },
    {
      q: 'A client sends valid JSON to this server. What does it log?',
      code: "const express = require('express')\nconst app = express()\n\napp.post('/todos', (req, res) => {\n  console.log(req.body)\n  res.status(201).end()\n})\n\napp.listen(3000)",
      options: ['`undefined`', 'The parsed object', 'The JSON as a string', 'An empty object'],
      answer: 0,
      why: 'Nothing parses the body, because `app.use(express.json())` is missing.',
    },
    {
      q: 'Which status code does this route respond with?',
      code: "app.get('/ping', (req, res) => {\n  res.json({ ok: true })\n})",
      options: ['200', '201', '204', '100'],
      answer: 0,
      why: 'If you do not call `res.status`, Express uses 200.',
    },
    {
      q: 'The server stores todos with numeric ids. A client requests `GET /todos/1`. What does it receive?',
      code: "const todos = [{ id: 1, name: 'Milk' }]\n\napp.get('/todos/:id', (req, res) => {\n  const todo = todos.find(todo => todo.id === req.params.id)\n  if (!todo) return res.status(404).json({ error: 'Not found' })\n  res.json(todo)\n})",
      options: [
        'Status 404, because the string `\'1\'` never strictly equals the number `1`',
        'Status 200 with the Milk todo',
        'Status 500',
        'Status 400',
      ],
      answer: 0,
      why: '`req.params.id` is a string. Convert it first: `Number(req.params.id)`.',
    },
    {
      q: 'What must a middleware function do?',
      options: [
        'Either send a response or call `next()`',
        'Always call `next()`, even after sending a response',
        'Return the modified request object',
        'Be registered after all the routes',
      ],
      answer: 0,
      why: 'If it does neither, the request is never answered and the client waits until it times out.',
    },
    {
      q: 'How does Express recognise an error-handling middleware?',
      options: [
        'It has four parameters: error, req, res, next',
        'Its name starts with `error`',
        'It is registered with `app.error()`',
        'It is the first middleware registered',
      ],
      answer: 0,
      why: 'The four-parameter signature is the signal. Register it after the routes.',
    },
    {
      q: 'What happens to the todos when the server process is restarted?',
      code: "const todos = []\n\napp.post('/todos', (req, res) => {\n  todos.push(req.body)\n  res.status(201).json(req.body)\n})",
      options: [
        'They are all lost, because the array only exists in memory',
        'They are restored from `package.json`',
        'They are kept, because `const` values are permanent',
        'They are saved in the browser\'s localStorage',
      ],
      answer: 0,
      why: 'A variable lives only as long as the process. Keeping data across restarts needs a file or a database.',
    },
    {
      q: 'Which pair of URLs has the same origin?',
      options: [
        '`https://example.com/a` and `https://example.com/b`',
        '`http://localhost:5173` and `http://localhost:3000`',
        '`http://example.com` and `https://example.com`',
        '`https://api.example.com` and `https://example.com`',
      ],
      answer: 0,
      why: 'An origin is scheme, host and port. The path is not part of it. The other pairs differ in port, scheme or host.',
    },
    {
      q: 'What enforces CORS?',
      options: [
        'The browser',
        'The Express server',
        'The network router',
        'The React library',
      ],
      answer: 0,
      why: 'The server only sends headers. The browser reads them and decides whether your JavaScript may see the response.',
    },
    {
      q: 'React on port 5173 calls an API on port 3000 and the console shows a CORS error. Where is the fix?',
      options: [
        'On the server: send `Access-Control-Allow-Origin`, for example with the `cors` middleware',
        'In React: add a `cors: true` option to `useEffect`',
        'In the fetch call: set the method to OPTIONS',
        'In the browser: reload the page with the cache disabled',
      ],
      answer: 0,
      why: 'Only the server can give permission. The alternative is to avoid the cross-origin request entirely with a dev proxy.',
    },
    {
      q: 'With this Vite config, React calls `fetch(\'/api/products\')`. Why is there no CORS problem?',
      code: "// vite.config.js\nserver: {\n  port: 5173,\n  proxy: { '/api': 'http://127.0.0.1:3000' },\n}",
      options: [
        'The browser sends the request to its own origin, and Vite forwards it to Express',
        'The proxy setting switches CORS off in the browser',
        'Requests to localhost are never subject to CORS',
        'Express detects Vite and adds the headers automatically',
      ],
      answer: 0,
      why: 'From the browser\'s point of view the request stays on port 5173. The hop to port 3000 happens between two servers, where CORS does not apply.',
    },
    {
      q: 'The server answers this DELETE with `res.status(204).end()`. What happens on the client?',
      code: "const response = await fetch('/todos/' + id, { method: 'DELETE' })\nconst data = await response.json()",
      options: [
        '`response.json()` throws, because there is no body to parse',
        '`data` is `null`',
        '`data` is an empty object',
        '`fetch` rejects, because 204 is not 200',
      ],
      answer: 0,
      why: 'A 204 response has an empty body, and an empty string is not valid JSON. Check `response.ok` and skip the parsing.',
    },
    {
      q: 'Why is `created` added to state, rather than a todo object built in the browser?',
      code: "async function addTodo(name) {\n  const response = await fetch('/todos', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ name }),\n  })\n  const created = await response.json()\n  setTodos([...todos, created])\n}",
      options: [
        'The server\'s version has the generated id and any defaults the server filled in',
        'State can only hold objects that came from `fetch`',
        'A locally built object could not be rendered',
        'It makes the request faster',
      ],
      answer: 0,
      why: 'The server owns the data. Without its id you could not update or delete that todo later.',
    },
    {
      q: 'The server at this address is not running. What is printed?',
      code: "async function load() {\n  try {\n    fetch('http://localhost:9999/todos')\n    console.log('A')\n  } catch {\n    console.log('B')\n  }\n}\n\nload()",
      options: [
        'A, and the failed request is reported as an uncaught error',
        'B',
        'A then B',
        'Nothing',
      ],
      answer: 0,
      why: 'Without `await` the try block finishes before the promise rejects, so catch never sees the error.',
    },
  ],
}

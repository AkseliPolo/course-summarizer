// Week 2 — JavaScript

export default {
  id: 'w2',
  week: 2,
  title: 'JavaScript',
  blurb: 'Variables and types, functions and scope, objects, arrays and their methods, classes and the prototype chain, JSON.',
  topics: [
    {
      title: 'Variables and types',
      points: [
        {
          term: 'let, const and var',
          fi: 'muuttujat',
          core: true,
          text: '`const` cannot be reassigned. `let` can, and both are limited to the block they are declared in. `var` is the old function-scoped form and is best avoided.',
        },
        {
          term: 'Primitive types',
          fi: 'perustietotyypit',
          core: true,
          text: 'The primitives are string, number, boolean, null, undefined, bigint and symbol. Everything else is an object, including arrays and functions.',
        },
        {
          term: 'Dynamic typing',
          text: 'A variable has no fixed type; the value it holds does. The `typeof` operator returns the type as a string. Two surprises: `typeof null` is `object`, and so is `typeof` an array.',
        },
        {
          term: 'Loose versus strict equality',
          core: true,
          text: 'Triple equals compares value and type with no conversion. Double equals converts the types first, so the string 5 equals the number 5. Use triple equals unless you have a reason not to.',
          code: "5 === '5'   // false\n5 == '5'    // true: the string is converted to a number",
        },
        {
          term: 'Truthy and falsy',
          core: true,
          text: 'In a condition, six values count as false: `false`, zero, the empty string, `null`, `undefined` and `NaN`. Everything else is truthy, including an empty array and an empty object.',
        },
        {
          term: 'undefined versus null',
          text: '`undefined` means no value has been assigned: a declared variable, a missing property, a function with no return. `null` is a value you assign on purpose to mean nothing.',
        },
        {
          term: 'Template literals',
          text: 'A string written in backticks can embed any expression inside a dollar sign and curly braces, and can span several lines.',
          code: 'const age = 20\nconst text = `Hi, I am ${age} years old`',
        },
        {
          term: 'Type coercion with plus',
          text: 'If either side of a plus is a string, the other side is converted to a string and they are joined. Minus, times and divide always convert to numbers.',
          code: "'5' + 3   // '53'\n'5' - 3   // 2",
        },
      ],
    },
    {
      title: 'Functions and scope',
      points: [
        {
          term: 'Three ways to write a function',
          fi: 'funktiot',
          core: true,
          text: 'A function declaration, a function expression stored in a variable, and an arrow function. All three are called the same way.',
          code: 'function describe(name, age = 0) {\n  return name + \' is \' + age\n}\n\nconst describe2 = function (name, age = 0) {\n  return name + \' is \' + age\n}\n\nconst describe3 = (name, age) => name + \' is \' + age',
        },
        {
          term: 'Arrow functions',
          fi: 'nuolifunktio',
          core: true,
          text: 'An arrow function with no curly braces returns its expression automatically. With curly braces it needs an explicit `return`. With exactly one parameter the parentheses are optional.',
          code: 'const sum = (a, b) => a + b          // implicit return\nconst sum2 = (a, b) => { return a + b }\nconst times5 = x => x * 5',
        },
        {
          term: 'Parameters and return',
          text: 'A parameter can have a default value that is used when the argument is missing. A function that reaches its end without a `return` gives back `undefined`.',
        },
        {
          term: 'Functions are values',
          core: true,
          text: 'A function can be stored in a variable, passed to another function as an argument, and returned from a function. A function passed in to be called later is a callback.',
          code: 'function run(task) {\n  task()\n}\n\nrun(() => console.log(\'done\'))',
        },
        {
          term: 'Scope',
          fi: 'näkyvyysalue',
          core: true,
          text: 'A variable declared with `let` or `const` exists only inside the nearest pair of curly braces. Inner code can read outer variables, but outer code cannot see inner ones.',
        },
        {
          term: 'Hoisting',
          text: 'Function declarations can be called before the line that defines them. Variables declared with `let` and `const` cannot be used before their declaration: that throws a ReferenceError.',
        },
        {
          term: 'Closures',
          fi: 'sulkeuma',
          core: true,
          text: 'A function remembers the variables of the place where it was created, even after the outer function has finished. Each call of the outer function creates a fresh, private set of variables.',
          code: 'function makeCounter() {\n  let count = 0\n  return () => ++count\n}\n\nconst next = makeCounter()\nnext() // 1\nnext() // 2',
        },
      ],
    },
    {
      title: 'Objects',
      points: [
        {
          term: 'Object literals',
          fi: 'olio',
          core: true,
          text: 'An object is a collection of key and value pairs. Read a property with a dot, or with square brackets when the key is in a variable. Objects can be nested inside objects and arrays.',
          code: "const group = {\n  name: 'Harsoset',\n  children: [{ name: 'Teppo', age: 4 }, { name: 'Liisa', age: 3 }],\n}\n\ngroup.children[1].name   // 'Liisa'",
        },
        {
          term: 'Objects are references',
          fi: 'viittaus',
          core: true,
          text: 'Assigning an object to another variable does not copy it. Both variables point to the same object, so a change through one is visible through the other. Two separate objects with the same content are not equal.',
          code: "const a = { name: 'Ada' }\nconst b = a\nb.name = 'Bob'\na.name          // 'Bob'\n\n({}) === ({})   // false",
        },
        {
          term: 'const and objects',
          text: '`const` only stops the variable from being reassigned. The object or array it points to can still be changed.',
        },
        {
          term: 'Destructuring',
          core: true,
          text: 'Destructuring unpacks properties into variables in one line. It works for objects by name and for arrays by position.',
          code: "const { name, age } = user\nconst [first, second] = list",
        },
        {
          term: 'Spread syntax',
          core: true,
          text: 'Three dots copy the contents of an object or array into a new one. It is the standard way to make a changed copy without touching the original.',
          code: 'const older = { ...user, age: user.age + 1 }\nconst longer = [...list, newItem]',
        },
        {
          term: 'Optional chaining and nullish coalescing',
          text: 'A question mark before a dot stops and gives `undefined` if the value on the left is null or undefined, instead of throwing. A double question mark supplies a fallback for null or undefined.',
          code: "const city = user.address?.city ?? 'Unknown'",
        },
      ],
    },
    {
      title: 'Arrays',
      points: [
        {
          term: 'Array basics',
          fi: 'taulukko',
          text: 'Arrays are indexed from zero and have a `length`. `push` and `pop` add and remove at the end, `unshift` and `shift` at the start. All four change the original array.',
        },
        {
          term: 'Looping',
          text: 'A classic `for` loop uses an index. A `for...of` loop gives you each value directly, which is usually what you want.',
          code: 'for (let i = 0; i < numbers.length; i++) { total += numbers[i] }\n\nfor (const number of numbers) { total += number }',
        },
        {
          term: 'map',
          core: true,
          text: '`map` returns a new array of the same length, where each item is the result of calling your function on the original item.',
          code: '[1, 2, 3].map(n => n * 10)   // [10, 20, 30]',
        },
        {
          term: 'filter',
          core: true,
          text: '`filter` returns a new array containing only the items for which your function returns a truthy value.',
          code: "cameras.filter(camera => camera.sensor === 'APS-C')",
        },
        {
          term: 'reduce',
          core: true,
          text: '`reduce` boils an array down to one value. Your function receives the running result and the current item, and the second argument is the starting value.',
          code: '[5, 10, 15].reduce((sum, n) => sum + n, 0)   // 30',
        },
        {
          term: 'find, some, every and includes',
          text: '`find` returns the first matching item or `undefined`. `some` and `every` return true or false. `includes` checks whether a value is in the array.',
        },
        {
          term: 'forEach',
          text: '`forEach` runs a function for every item and returns `undefined`. Use it for side effects such as logging; use `map` when you want a new array.',
        },
        {
          term: 'sort',
          core: true,
          text: '`sort` changes the original array, and without a compare function it sorts items as strings, so 10 comes before 9. Pass a compare function for numbers: a minus b for ascending, b minus a for descending.',
          code: '[10, 9, 1].sort()                  // [1, 10, 9]\n[10, 9, 1].sort((a, b) => a - b)   // [1, 9, 10]',
        },
        {
          term: 'Mutating versus non-mutating',
          core: true,
          text: '`push`, `pop`, `splice`, `sort` and `reverse` change the original array. `map`, `filter`, `slice`, `concat` and spread return a new one. A pure function never changes the array it was given.',
        },
      ],
    },
    {
      title: 'Classes and prototypes',
      points: [
        {
          term: 'Class syntax',
          fi: 'luokka',
          core: true,
          text: 'A class is a blueprint for objects. The `constructor` runs when you create an instance with `new` and sets up its properties on `this`. Methods are written without the function keyword.',
          code: "class Person {\n  constructor(name, age) {\n    this.name = name\n    this.age = age\n  }\n\n  introduce() {\n    return 'Name: ' + this.name\n  }\n}\n\nconst person = new Person('John Doe', 30)",
        },
        {
          term: 'Inheritance with extends',
          fi: 'perintä',
          core: true,
          text: 'A class can extend another and inherits all its methods. In the subclass constructor you must call `super` before using `this`. A method with the same name overrides the parent\'s, and `super.method()` still reaches the original.',
          code: "class Student extends Person {\n  constructor(name, age, school) {\n    super(name, age)\n    this.school = school\n  }\n\n  introduce() {\n    return super.introduce() + ', school: ' + this.school\n  }\n}",
        },
        {
          term: 'Prototype chain',
          fi: 'prototyyppiketju',
          core: true,
          text: 'Every object has a hidden link to another object, its prototype. When you read a property, JavaScript looks on the object first and then walks up the chain until it finds it or reaches null.',
        },
        {
          term: 'Where methods live',
          text: 'Class methods are stored once, on the class\'s prototype, and shared by every instance. Properties set on `this` in the constructor are stored separately on each instance.',
        },
        {
          term: 'Classes are syntactic sugar',
          text: 'The class keyword is a cleaner way to write what JavaScript has always done with constructor functions and prototypes. `typeof` a class is `function`.',
        },
        {
          term: 'instanceof',
          text: '`instanceof` checks whether a class appears anywhere in an object\'s prototype chain, so a Student is an instance of both Student and Person.',
        },
      ],
    },
    {
      title: 'JSON',
      points: [
        {
          term: 'What JSON is',
          core: true,
          text: 'JSON is a text format for exchanging data, based on JavaScript object syntax. It is how browsers and servers usually send data to each other.',
        },
        {
          term: 'JSON syntax rules',
          core: true,
          text: 'Keys and strings must be in double quotes. The only allowed values are objects, arrays, strings, numbers, true, false and null. Functions, undefined, comments and trailing commas are not allowed.',
          code: '{\n  "name": "Nappaset",\n  "children": [\n    { "name": "Matti", "age": 6 },\n    { "name": "Anna", "age": 4 }\n  ]\n}',
        },
        {
          term: 'JSON.stringify',
          core: true,
          text: '`JSON.stringify` turns a JavaScript value into a JSON string, ready to be sent or stored. Functions and undefined properties are silently left out.',
        },
        {
          term: 'JSON.parse',
          core: true,
          text: '`JSON.parse` turns a JSON string back into a JavaScript value. If the text is not valid JSON it throws a SyntaxError.',
          code: "const text = JSON.stringify({ name: 'Ada' })   // '{\"name\":\"Ada\"}'\nconst user = JSON.parse(text)                  // { name: 'Ada' }",
        },
      ],
    },
  ],

  questions: [
    {
      q: 'What does this print?',
      code: 'console.log(typeof null)',
      options: ["`'object'`", "`'null'`", "`'undefined'`", "`'boolean'`"],
      answer: 0,
      why: 'A long-standing quirk of the language: `typeof null` is `object`. Check for null with `value === null`.',
    },
    {
      q: 'What does this print?',
      code: "console.log('5' + 3, '5' - 3)",
      options: ['`53 2`', '`8 2`', '`53 53`', '`8 NaN`'],
      answer: 0,
      why: 'Plus with a string joins strings, giving 53. Minus only works on numbers, so the string is converted and the result is 2.',
    },
    {
      q: 'What does this print?',
      code: "console.log(1 == '1', 1 === '1')",
      options: ['`true false`', '`true true`', '`false false`', '`false true`'],
      answer: 0,
      why: 'Double equals converts the string to a number first. Triple equals compares type as well, and a number is never strictly equal to a string.',
    },
    {
      q: 'Which of these values is falsy?',
      options: ['`0`', "`'0'`", '`[]`', '`{}`'],
      answer: 0,
      why: 'The falsy values are false, 0, the empty string, null, undefined and NaN. A non-empty string, an empty array and an empty object are all truthy.',
    },
    {
      q: 'What does this print?',
      code: "const user = { name: 'Ada' }\nconst copy = user\ncopy.name = 'Bob'\nconsole.log(user.name)",
      options: ["`'Bob'`", "`'Ada'`", '`undefined`', 'It throws a TypeError'],
      answer: 0,
      why: 'Assignment does not copy an object. `copy` and `user` refer to the same object, so the change is visible through both.',
    },
    {
      q: 'What does this print?',
      code: 'const list = [1, 2]\nlist.push(3)\nconsole.log(list.length)',
      options: ['`3`', '`2`', 'It throws a TypeError', '`undefined`'],
      answer: 0,
      why: '`const` prevents reassigning the variable, not changing the array it points to. `list = [1, 2, 3]` would throw; `push` is fine.',
    },
    {
      q: 'What does this print?',
      code: 'const nums = [1, 2, 3, 4]\nconst out = nums.filter(n => n % 2 === 0).map(n => n * 10)\nconsole.log(out)',
      options: ['`[20, 40]`', '`[10, 20, 30, 40]`', '`[2, 4]`', '`[10, 30]`'],
      answer: 0,
      why: 'filter keeps the even numbers, 2 and 4. map then multiplies each by 10.',
    },
    {
      q: 'What does this print?',
      code: "const cart = [\n  { name: 'Laptop', price: 1000, quantity: 1 },\n  { name: 'Mouse', price: 50, quantity: 2 },\n]\nconst total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)\nconsole.log(total)",
      options: ['`1100`', '`1050`', '`3`', '`2100`'],
      answer: 0,
      why: 'reduce starts at 0 and adds price times quantity for each item: 1000 + 100.',
    },
    {
      q: 'What does this print?',
      code: 'function makeCounter() {\n  let count = 0\n  return () => ++count\n}\n\nconst a = makeCounter()\nconst b = makeCounter()\na()\na()\nconsole.log(a(), b())',
      options: ['`3 1`', '`3 3`', '`1 1`', '`3 4`'],
      answer: 0,
      why: 'Each call to makeCounter creates its own count variable. a has been called three times, b once.',
    },
    {
      q: 'What does this print?',
      code: 'const double = x => { x * 2 }\nconsole.log(double(4))',
      options: ['`undefined`', '`8`', '`4`', 'It throws a SyntaxError'],
      answer: 0,
      why: 'With curly braces an arrow function needs an explicit return. Without one, the function returns undefined.',
    },
    {
      q: 'What does this print?',
      code: 'console.log([10, 9, 1].sort())',
      options: ['`[1, 10, 9]`', '`[1, 9, 10]`', '`[10, 9, 1]`', '`[9, 10, 1]`'],
      answer: 0,
      why: 'Without a compare function, sort compares items as strings, and the string 10 comes before 9. Use `sort((a, b) => a - b)` for numbers.',
    },
    {
      q: 'What does this print?',
      code: 'const numbers = [4, 5, 1, 99]\nnumbers.sort((a, b) => b - a)\nconsole.log(numbers[0])',
      options: ['`99`', '`1`', '`4`', '`5`'],
      answer: 0,
      why: 'b minus a sorts in descending order, and sort changes the original array, so the largest number is now first.',
    },
    {
      q: 'What happens when this runs?',
      code: 'console.log(score)\nlet score = 5',
      options: [
        'It throws a ReferenceError',
        'It prints `undefined`',
        'It prints `5`',
        'It prints `null`',
      ],
      answer: 0,
      why: 'A `let` variable cannot be used before its declaration. With `var` this would print undefined instead.',
    },
    {
      q: 'What does this print?',
      code: "class Animal {\n  constructor(name) {\n    this.name = name\n  }\n  speak() {\n    return this.name + ' makes a sound'\n  }\n}\n\nclass Dog extends Animal {\n  speak() {\n    return super.speak() + ', woof'\n  }\n}\n\nconsole.log(new Dog('Rex').speak())",
      options: [
        "`'Rex makes a sound, woof'`",
        "`'Rex makes a sound'`",
        "`'undefined makes a sound, woof'`",
        'It throws, because Dog has no constructor',
      ],
      answer: 0,
      why: 'Dog has no constructor of its own, so the parent constructor runs and sets the name. Dog overrides speak and calls the parent version through super.',
    },
    {
      q: 'In a subclass constructor, what must happen before you can use `this`?',
      options: [
        '`super()` must be called',
        'All properties must be declared with `let`',
        'The parent class must be instantiated with `new`',
        'Nothing; `this` is always available',
      ],
      answer: 0,
      why: 'In a derived class the parent constructor creates the object, so `this` does not exist until `super()` has run.',
    },
    {
      q: 'Where are the methods of a class stored?',
      options: [
        'Once, on the prototype, shared by all instances',
        'Copied onto every instance when it is created',
        'In the global scope',
        'Inside the constructor function\'s local variables',
      ],
      answer: 0,
      why: 'Methods live on `ClassName.prototype`. Instances find them by walking up the prototype chain.',
    },
    {
      q: 'Which of these is valid JSON?',
      options: [
        '`{"name": "Ada", "age": 36}`',
        '`{name: "Ada", age: 36}`',
        "`{'name': 'Ada', 'age': 36}`",
        '`{"name": "Ada", "age": 36,}`',
      ],
      answer: 0,
      why: 'JSON requires double quotes around keys and strings, and does not allow a trailing comma.',
    },
    {
      q: 'What does this print?',
      code: "const data = JSON.stringify({ id: 1, done: false })\nconsole.log(typeof data)",
      options: ["`'string'`", "`'object'`", "`'json'`", "`'undefined'`"],
      answer: 0,
      why: 'stringify produces a string. To get an object back you call `JSON.parse`.',
    },
  ],
}

// Week 1 — HTML & CSS
// Each point: term (flashcard front), text (the explanation, read aloud), optional code,
// fi (Finnish term), core (must-know). Inline code in text is wrapped in `backticks`.

export default {
  id: 'w1',
  week: 1,
  title: 'HTML & CSS',
  blurb: 'How the web works, HTML structure and semantics, CSS selectors and the cascade, the box model, Flexbox and responsive design.',
  topics: [
    {
      title: 'How the web works',
      points: [
        {
          term: 'Client–server model',
          fi: 'asiakas–palvelin-malli',
          core: true,
          text: 'The browser is the client: it sends a request, and a server sends back a response. The client always starts the conversation; the server only answers.',
        },
        {
          term: 'URL anatomy',
          text: 'A URL is made of a scheme such as `https`, a host such as `example.com`, an optional port, a path, an optional query string after a question mark, and an optional fragment after a hash.',
          code: 'https://example.com:443/products/42?sort=asc#reviews\n└scheme┘ └── host ──┘└port┘└─ path ──┘└ query ┘└fragment┘',
        },
        {
          term: 'DNS',
          fi: 'nimipalvelu',
          text: 'The Domain Name System translates a domain name into the IP address of the server. This lookup happens before the browser can connect.',
        },
        {
          term: 'HTTP request',
          fi: 'pyyntö',
          core: true,
          text: 'A request has a method such as GET or POST, a path, headers, and for some methods a body.',
          code: 'GET /index.html HTTP/1.1\nHost: example.com\nAccept: text/html',
        },
        {
          term: 'HTTP response',
          fi: 'vastaus',
          core: true,
          text: 'A response has a status code, headers such as `Content-Type`, and usually a body: HTML, CSS, JavaScript, JSON or an image.',
          code: 'HTTP/1.1 200 OK\nContent-Type: text/html\n\n<!DOCTYPE html>...',
        },
        {
          term: 'HTTP is stateless',
          fi: 'tilaton',
          core: true,
          text: 'Every request is independent. The server remembers nothing about earlier requests unless the client sends something along each time, such as a cookie or a token.',
        },
        {
          term: 'Status code groups',
          fi: 'tilakoodit',
          core: true,
          text: 'Codes starting with 2 mean success, 3 means redirection, 4 means the client made a mistake, and 5 means the server failed. Know 200 OK, 404 Not Found and 500 Internal Server Error.',
        },
        {
          term: 'Loading a page',
          text: 'The browser requests the HTML, parses it into the DOM, and then makes a separate request for every linked stylesheet, script and image before it can render the page.',
        },
        {
          term: 'HTML, CSS and JavaScript',
          core: true,
          text: 'HTML gives a page its structure and meaning, CSS controls how it looks, and JavaScript adds behaviour and interactivity.',
        },
      ],
    },
    {
      title: 'HTML structure',
      points: [
        {
          term: 'Document skeleton',
          core: true,
          text: 'Every page starts with the doctype, then an `<html>` element containing a `<head>` for metadata such as the title and stylesheet links, and a `<body>` for everything visible.',
          code: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>My page</title>\n  </head>\n  <body>\n    <h1>Hello world</h1>\n  </body>\n</html>',
        },
        {
          term: 'Element anatomy',
          fi: 'elementti',
          core: true,
          text: 'An element is an opening tag, some content and a closing tag. Attributes go inside the opening tag as name and value pairs.',
          code: '<a href="https://example.com" target="_blank">A link</a>\n<!-- tag   attribute="value"            content   closing tag -->',
        },
        {
          term: 'Void elements',
          text: 'Some elements have no content and no closing tag. The common ones are `<img>`, `<br>`, `<hr>`, `<input>`, `<meta>` and `<link>`.',
        },
        {
          term: 'Nesting',
          text: 'Elements can contain other elements, but they must be closed in the reverse order they were opened. Overlapping tags are invalid.',
          code: '<p>This is <strong>correct</strong></p>\n<p>This is <strong>wrong</p></strong>',
        },
        {
          term: 'Headings',
          fi: 'otsikot',
          text: 'Headings run from `<h1>` to `<h6>` and form the outline of the page. Choose the level by the structure of the content, never by how large you want the text to look.',
        },
        {
          term: 'Links and images',
          core: true,
          text: 'A link is an `<a>` element with an `href` attribute. An image is an `<img>` element with `src` for the file and `alt` for a text description, which screen readers use and which shows if the image fails to load.',
        },
        {
          term: 'Lists',
          text: 'An unordered list `<ul>` shows bullets and an ordered list `<ol>` shows numbers. In both, every item is an `<li>` element.',
        },
        {
          term: 'Block and inline elements',
          core: true,
          text: 'Block elements such as `<div>`, `<p>` and `<h1>` start on a new line and take the full available width. Inline elements such as `<span>`, `<a>` and `<strong>` flow inside a line of text.',
        },
        {
          term: 'id and class',
          core: true,
          text: 'An `id` must be unique on the page. A `class` can be reused on many elements, and one element can have several classes separated by spaces.',
          code: '<p id="intro" class="note highlighted">...</p>',
        },
        {
          term: 'Character references',
          text: 'To show characters that HTML reserves, write a character reference: `&lt;` for a less-than sign, `&gt;` for greater-than and `&amp;` for an ampersand.',
          say: 'To show characters that HTML reserves, write a character reference: ampersand L T semicolon for a less-than sign, ampersand G T semicolon for greater-than, and ampersand A M P semicolon for an ampersand.',
        },
      ],
    },
    {
      title: 'Semantic HTML',
      points: [
        {
          term: 'Semantic elements',
          fi: 'semanttiset elementit',
          core: true,
          text: 'Semantic elements describe what content means, not how it looks. The main ones are `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>` and `<footer>`.',
        },
        {
          term: 'Why semantics matter',
          core: true,
          text: 'Semantic markup makes a page accessible to screen readers, easier for search engines to understand, and easier for developers to read and maintain.',
        },
        {
          term: 'div and span',
          text: 'A `<div>` is a generic block container and a `<span>` is a generic inline container. Neither carries meaning, so use them only when no semantic element fits.',
        },
        {
          term: 'article versus section',
          text: 'An `<article>` is self-contained and would still make sense on its own, like a blog post or a product card. A `<section>` groups related content under a heading.',
        },
        {
          term: 'Form basics',
          fi: 'lomake',
          text: 'A `<form>` groups inputs. Each `<input>` should have a `<label>` connected through matching `for` and `id` attributes, and the `name` attribute is the key the value is sent under.',
          code: '<form>\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required>\n  <button type="submit">Send</button>\n</form>',
        },
      ],
    },
    {
      title: 'CSS basics and selectors',
      points: [
        {
          term: 'CSS rule',
          fi: 'CSS-sääntö',
          core: true,
          text: 'A rule is a selector followed by a block of declarations. Each declaration is a property, a colon, a value and a semicolon.',
          code: 'h1 {\n  color: blue;\n  font-size: 50px;\n}',
        },
        {
          term: 'Three ways to add CSS',
          core: true,
          text: 'An external stylesheet linked with a `<link>` element in the head is the normal way. You can also write rules in a `<style>` element, or put declarations directly in an element\'s `style` attribute.',
          code: '<link rel="stylesheet" href="style.css">\n<style> p { color: red; } </style>\n<h1 style="color: yellow;">Inline</h1>',
        },
        {
          term: 'Basic selectors',
          fi: 'valitsimet',
          core: true,
          text: 'A type selector such as `p` matches every element of that type. A class selector starts with a dot, as in `.card`. An id selector starts with a hash, as in `#main`.',
        },
        {
          term: 'Combining selectors',
          text: 'Write selectors together to narrow them: `div.menu-item` matches only div elements with that class. A space means any descendant, as in `nav a`, and a greater-than sign means direct children only, as in `ul > li`.',
        },
        {
          term: 'Pseudo-classes',
          text: 'A pseudo-class selects an element in a particular state, written after a colon: `a:hover` while the pointer is over a link, `input:focus` while a field is active, `li:first-child` for the first item.',
        },
        {
          term: 'The cascade',
          fi: 'kaskadi',
          core: true,
          text: 'When several rules set the same property on an element, the browser picks a winner. Higher specificity wins first; if specificity is equal, the rule that comes later in the source wins.',
        },
        {
          term: 'Specificity',
          fi: 'spesifisyys',
          core: true,
          text: 'From strongest to weakest: an inline `style` attribute, then id selectors, then classes and pseudo-classes, then element types. One id beats any number of classes, and one class beats any number of element types.',
          code: '#lead        /* 1 id               -> strongest */\n.note.big    /* 2 classes                       */\np.note       /* 1 class + 1 type                */\np            /* 1 type             -> weakest   */',
        },
        {
          term: 'Inheritance',
          fi: 'periytyminen',
          text: 'Text properties such as `color`, `font-family` and `line-height` are inherited by child elements. Box properties such as `margin`, `padding`, `border` and `width` are not.',
        },
        {
          term: 'CSS units',
          text: '`px` is a fixed size. A percentage is relative to the parent. `em` is relative to the element\'s own font size and `rem` to the root font size. `vw` and `vh` are percentages of the viewport width and height.',
        },
      ],
    },
    {
      title: 'The box model',
      points: [
        {
          term: 'Box model',
          fi: 'laatikkomalli',
          core: true,
          text: 'Every element is a rectangular box with four layers. From the inside out: content, padding, border and margin.',
        },
        {
          term: 'Padding versus margin',
          core: true,
          text: 'Padding is space inside the border, between the border and the content, and the element\'s background shows through it. Margin is transparent space outside the border that pushes other elements away.',
        },
        {
          term: 'box-sizing',
          core: true,
          text: 'By default, `width` sets only the content width, so padding and border are added on top. With `box-sizing: border-box`, the width includes padding and border.',
          code: '.box { width: 200px; padding: 20px; border: 5px solid; }\n/* content-box (default): 200 + 2*20 + 2*5 = 250px wide */\n/* border-box:            200px wide, content shrinks  */',
        },
        {
          term: 'The display property',
          text: '`display: block` puts an element on its own line. `inline` keeps it in the text flow and ignores width and height. `inline-block` flows inline but respects width and height. `none` removes the element from the page.',
        },
        {
          term: 'Shorthand values',
          text: 'With two values, as in `margin: 10px 20px`, the first is top and bottom and the second is left and right. Four values go clockwise: top, right, bottom, left.',
        },
        {
          term: 'Centering a block',
          text: 'Give a block element a width or max-width and set `margin: 0 auto`. The browser splits the leftover horizontal space evenly on both sides.',
        },
      ],
    },
    {
      title: 'Flexbox',
      points: [
        {
          term: 'Flex container and items',
          core: true,
          text: 'Setting `display: flex` on an element makes it a flex container. Its direct children become flex items and line up in a row by default.',
          code: 'div.menu {\n  display: flex;\n  justify-content: space-between;\n}',
        },
        {
          term: 'Main axis and cross axis',
          fi: 'pääakseli ja poikkiakseli',
          core: true,
          text: 'The main axis runs in the flex direction, horizontally by default. The cross axis is perpendicular to it. With `flex-direction: column` the two swap, so the main axis becomes vertical.',
        },
        {
          term: 'justify-content',
          core: true,
          text: 'Distributes items along the main axis. Values include `flex-start`, `center`, `flex-end`, `space-between`, `space-around` and `space-evenly`. `space-between` pushes the first and last items to the edges.',
        },
        {
          term: 'align-items',
          core: true,
          text: 'Positions items along the cross axis. The default is `stretch`, which makes every item as tall as the container. Other values are `flex-start`, `center` and `flex-end`.',
        },
        {
          term: 'Perfect centering',
          core: true,
          text: 'To center something both horizontally and vertically, make its parent a flex container and set both `justify-content` and `align-items` to `center`.',
          code: '.parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
        },
        {
          term: 'flex-wrap and gap',
          text: 'By default items never wrap: they shrink to fit one line. `flex-wrap: wrap` lets them flow onto new lines. `gap` sets the space between items without using margins.',
        },
        {
          term: 'flex-grow',
          text: 'Decides how leftover space is shared. An item with `flex-grow: 1` grows to fill free space, and several such items share it equally. The shorthand `flex: 1` is the usual way to write this.',
        },
        {
          term: 'Typical Flexbox uses',
          text: 'Navigation bars with `space-between`, centering content, rows of cards that wrap, and a sticky footer made with a column container where the main content has `flex: 1`.',
        },
      ],
    },
    {
      title: 'Responsive design',
      points: [
        {
          term: 'Viewport meta tag',
          core: true,
          text: 'Without the viewport meta tag, a phone renders the page as a zoomed-out desktop page. The tag tells the browser to use the real device width.',
          code: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
        },
        {
          term: 'Media queries',
          fi: 'mediakyselyt',
          core: true,
          text: 'A media query applies rules only when a condition holds, most often a minimum or maximum viewport width.',
          code: '.menu { flex-direction: column; }\n\n@media (min-width: 768px) {\n  .menu { flex-direction: row; }\n}',
        },
        {
          term: 'Mobile first',
          text: 'Write the base styles for small screens, then add `min-width` media queries that adjust the layout for larger screens.',
        },
        {
          term: 'Fluid sizing',
          text: 'Prefer percentages, `rem`, `max-width` and flex wrapping over fixed pixel widths, so the layout adapts between breakpoints. For images, `max-width: 100%` stops them overflowing their container.',
        },
      ],
    },
  ],

  questions: [
    {
      q: 'Which part of an HTTP response tells the browser whether the request succeeded?',
      options: ['The status code', 'The Content-Type header', 'The request method', 'The URL fragment'],
      answer: 0,
      why: 'The status code summarises the result: 2xx success, 3xx redirect, 4xx client error, 5xx server error.',
    },
    {
      q: 'A server answers with status 404. What does that tell you?',
      options: [
        'The client asked for a resource that does not exist',
        'The server crashed while handling the request',
        'The resource has moved to a new address',
        'The request succeeded but there is no content',
      ],
      answer: 0,
      why: '4xx codes are client errors. 404 means Not Found. A server crash would be a 5xx code.',
    },
    {
      q: 'What does it mean that HTTP is stateless?',
      options: [
        'Each request is handled independently; the server keeps no memory of earlier requests',
        'The server can never store any data',
        'The connection is not encrypted',
        'Responses never include a status code',
      ],
      answer: 0,
      why: 'Stateless is about the protocol: nothing carries over between requests unless the client sends it again, for example in a cookie.',
    },
    {
      q: 'Which of these is a void element, written without a closing tag?',
      options: ['`<img>`', '`<p>`', '`<a>`', '`<li>`'],
      answer: 0,
      why: '`<img>` has no content, so it has no closing tag. So do `<br>`, `<input>`, `<meta>` and `<link>`.',
    },
    {
      q: 'Which element is the best choice for a site\'s main navigation links?',
      options: ['`<nav>`', '`<div class="nav">`', '`<section>`', '`<aside>`'],
      answer: 0,
      why: '`<nav>` is the semantic element for navigation. A div works visually but carries no meaning for screen readers or search engines.',
    },
    {
      q: 'What colour is the heading text?',
      code: '<!-- style.css contains:  h1 { color: blue; } -->\n<head>\n  <link rel="stylesheet" href="style.css">\n  <style>\n    h1 { color: green; }\n  </style>\n</head>\n<body>\n  <h1 style="color: yellow;">CSS Demo</h1>\n</body>',
      options: ['Yellow', 'Green', 'Blue', 'Black'],
      answer: 0,
      why: 'An inline `style` attribute has higher specificity than any selector in a stylesheet, so it wins.',
    },
    {
      q: 'The second heading has no style attribute. What colour is it?',
      code: '<!-- style.css contains:  h1 { color: blue; } -->\n<head>\n  <link rel="stylesheet" href="style.css">\n  <style>\n    h1 { color: green; }\n  </style>\n</head>\n<body>\n  <h1 style="color: yellow;">CSS Demo</h1>\n  <h1>Second heading</h1>\n</body>',
      options: ['Green', 'Blue', 'Yellow', 'Black'],
      answer: 0,
      why: 'Both rules use the selector `h1`, so specificity is equal and the later one wins. The `<style>` block comes after the linked file.',
    },
    {
      q: 'What colour is the paragraph text?',
      code: '<p id="lead" class="note">Hello</p>\n\n<style>\n  #lead  { color: red; }\n  p.note { color: blue; }\n  .note  { color: green; }\n  p      { color: black; }\n</style>',
      options: ['Red', 'Blue', 'Green', 'Black'],
      answer: 0,
      why: 'An id selector beats any combination of classes and element types, no matter where it appears in the source.',
    },
    {
      q: 'How wide is this box on screen, with the default `box-sizing`?',
      code: '.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}',
      options: ['250px', '200px', '225px', '245px'],
      answer: 0,
      why: 'With the default content-box, width is only the content: 200 + 20 + 20 padding + 5 + 5 border = 250px.',
    },
    {
      q: 'How wide is this box on screen?',
      code: '.box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}',
      options: ['200px', '250px', '150px', '240px'],
      answer: 0,
      why: 'With border-box the width includes padding and border, so the box is exactly 200px and the content area shrinks to 150px.',
    },
    {
      q: 'Four menu items sit inside this container. How are they laid out?',
      code: 'div.menu {\n  display: flex;\n  justify-content: space-between;\n}',
      options: [
        'In a row, first item at the left edge, last at the right edge, equal gaps between',
        'In a row, all packed together in the centre',
        'In a column, spread from top to bottom',
        'In a row, with equal space on both sides of every item including the edges',
      ],
      answer: 0,
      why: 'The default direction is a row, and `space-between` puts the free space only between items, so the outer items touch the edges.',
    },
    {
      q: 'What does `align-items: center` do in this container?',
      code: '.sidebar {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}',
      options: [
        'Centres the items horizontally',
        'Centres the items vertically',
        'Centres the text inside each item',
        'Nothing, because the direction is column',
      ],
      answer: 0,
      why: '`align-items` works on the cross axis. In a column container the main axis is vertical, so the cross axis is horizontal.',
    },
    {
      q: 'On a phone that is 480px wide, is the menu visible?',
      code: '.menu { display: none; }\n\n@media (min-width: 600px) {\n  .menu { display: flex; }\n}',
      options: [
        'No, it is hidden',
        'Yes, as a flex container',
        'Yes, as a block element',
        'Only after the page is zoomed',
      ],
      answer: 0,
      why: 'The media query applies only at 600px and wider. At 480px only the first rule applies.',
    },
    {
      q: 'Which property is inherited by child elements by default?',
      options: ['`color`', '`margin`', '`border`', '`padding`'],
      answer: 0,
      why: 'Text properties such as color and font-family inherit. Box properties do not, otherwise every child would get its parent\'s border.',
    },
    {
      q: 'What is the difference between padding and margin?',
      options: [
        'Padding is inside the border, margin is outside it',
        'Padding is outside the border, margin is inside it',
        'Padding works only on block elements, margin only on inline elements',
        'There is no difference; they are two names for the same space',
      ],
      answer: 0,
      why: 'From the inside out the box model is content, padding, border, margin. The background colour fills the padding but not the margin.',
    },
    {
      q: 'Which meta tag makes a page lay out correctly on a phone?',
      options: [
        '`<meta name="viewport" content="width=device-width, initial-scale=1.0">`',
        '`<meta charset="UTF-8">`',
        '`<meta name="mobile" content="true">`',
        '`<meta name="description" content="responsive">`',
      ],
      answer: 0,
      why: 'Without the viewport tag, a phone pretends to be a wide desktop screen and shrinks the page, so media queries never match.',
    },
  ],
}

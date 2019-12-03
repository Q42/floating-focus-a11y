# floating-focus-a11y
A clear, beautiful and easy to implement focus-state solution.

## Installation
With [npm](https://www.npmjs.com/) installed, run
```bash
$ npm install @q42/floating-focus-a11y --save
```

## Usage
Import the package and instantiate the class on page load:
```javascript
import FloatingFocus from '@q42/floating-focus-a11y';
new FloatingFocus(containerElement); // Element is an optional parameter which defaults to `document.body`
```

Define a default outline and outline-offset. Either of these values can be overruled per component:
```css
// Hide all default focus states if a mouse is used, this is completely optional ofcourse
*:focus {
  outline: none;
}

// Default outline value, which will be applied to all elements receiving focus, this is a required step.
.floating-focus-enabled *:focus, .floating-focus-enabled .focus {
  outline: dodgerblue solid 2px;
  outline-offset: 8px;
}

// Give all buttons a green focus state instead of dodgerblue, this is optional in case it's needed.
.floating-focus-enabled [type="button"]:focus {
  outline-color: green;
  outline-offset: 4px;
}
```

It's also possible to define a focus-target attribute on focusable elements:
```html
<input type="file" class="hidden" id="file-upload-123" focus-target="file-upload-123-label"/>
<label id="file-upload-123-label" for="file-upload-123">Please upload a file</label>
```
This will append the `focus` class to the target element and make the focus box appear around the target element.

## Develop
```bash
$ npm run build
$ npm run watch
$ npm run test
```

## Deploy
```bash
# bump version
$ npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]

# pubplish
$ npm publish
```

## License
[MIT](https://opensource.org/licenses/MIT)

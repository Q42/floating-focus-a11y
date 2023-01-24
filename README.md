<h1 align="center">Floating Focus</h1>

<p align="center">
	<a href="https://github.com/Q42/floating-focus-a11y"><img src="https://github.com/q42/floating-focus-a11y/actions/workflows/node.js.yml/badge.svg" alt="Build status"></a>
	<a href="https://www.npmjs.com/package/@q42/floating-focus-a11y"><img src="https://img.shields.io/npm/v/@q42/floating-focus-a11y.svg?sanitize=true" alt="Package version"></a>
	<a href="https://www.npmjs.com/package/@q42/floating-focus-a11y"><img src="https://img.shields.io/npm/l/@q42/floating-focus-a11y.svg?sanitize=true" alt="Package license"></a>
</p>

<p align="center">
	A clear, beautiful and easy to implement focus-state solution that improves accessibility and usability.
</p>
	
<p align="center">
<a href="https://engineering.q42.nl/floating-focus/">https://engineering.q42.nl/floating-focus/</a>
</p>

![Drag Racing](https://thumbs.gfycat.com/GrimLoneKakapo-size_restricted.gif)

---

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
/* Hide all default focus states if a mouse is used, this is completely optional ofcourse */
*:focus {
  outline: none;
}

/* Default outline value, which will be applied to all elements receiving focus, this is a required step. */
/* The .focus class is used by the focus target, more below. */
.floating-focus-enabled :focus, .floating-focus-enabled .focus {
  outline: dodgerblue solid 2px;
  outline-offset: 8px;
}

/* Give all buttons a green focus state instead of dodgerblue, this is optional in case it's needed. */
.floating-focus-enabled [type="button"]:focus {
  outline-color: green;
  outline-offset: 4px;
}
```

### Focus target

Sometimes the actual element that receives focus is hidden from view, as is common with a custom input field. In this case it's possible to define a `focus-target` attribute on the focusable element.

```html
<input type="file" class="hidden" id="file-upload-123" focus-target="file-upload-123-label"/>
<label id="file-upload-123-label" for="file-upload-123">Please upload a file</label>
```

This will append the `focus` class to the target element and make the visual focus box appear around the target element, instead of the element that actually has the native focus.

### Separate stylesheet

For convenience, the styles are included in the script by default. There is also an option to include the stylesheet separately. This is particularly useful with strict `style-src 'self'` CORS headers.

Import unstyled dist file:
```javascript
import FloatingFocus from '@q42/floating-focus-a11y/dist/unstyled';
```

The stylesheet can then be separately imported with your favorite CSS preprocessor:
```css
@import '@q42/floating-focus-a11y/dist/unstyled';
```

### Extra cautions

- Watch out with CSS transitions: if an element that will be focused has a `transition` for `outline-color` / `outline-width` / `outline-style` (including `all` !), the floating focus will not display correctly on that element.

## Develop
```bash
$ npm run build
$ npm run watch
$ npm run test
```

## Deploy
```bash
# bump version
$ npm version [major | minor | patch | premajor | preminor | prepatch | prerelease]

# publish
$ npm publish
```

## License
[MIT](https://opensource.org/licenses/MIT)

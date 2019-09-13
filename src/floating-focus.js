import './floating-focus.scss';

export default class FloatingFocus {
	constructor(container = document.body) {
		this.container = container;

		this.bindEventListenersToInstance();

		this.addKeydownEvents();
		this.addMouseDownEvents();
		this.addFocusEvents();
		this.addBlurEvents();
		this.addScrollResizeEvents();
	}

	constructFloatingElement() {
		const element = document.createElement('div');
		element.classList.add('floating-focus');

		this.container.appendChild(element);
		return element; // Floater pun intended.
	}

	bindEventListenersToInstance() {
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleScrollResize = this.handleScrollResize.bind(this);
		this.handleScrollResize = this.handleScrollResize.bind(this);
	}

	addKeydownEvents() {
		document.addEventListener('keydown', this.handleKeyDown, false);
	}

	addMouseDownEvents() {
		document.addEventListener('mousedown', this.handleMouseDown, false);
	}

	addFocusEvents() {
		document.addEventListener('focus', this.handleFocus, true);
	}

	addBlurEvents() {
		document.addEventListener('blur', this.handleBlur, true);
	}

	addScrollResizeEvents() {
		document.addEventListener('scroll', this.handleScrollResize, false);
		window.addEventListener('resize', this.handleScrollResize, false);
	}

	handleKeyDown(e) {
		// Show animation only upon Tab or Arrow keys press.
		if (e.keyCode !== 9 && !(e.keyCode > 36 && e.keyCode < 41)) {
			return;
		}

		if (!this.floater) {
			this.floater = this.constructFloatingElement();
		}

		this.enableFloatingFocus();
	}

	handleMouseDown() {
		if (!this.floater) {
			return;
		}

		this.disableFloatingFocus();
	}

	handleScrollResize() {
		if (!this.floater || !this.target) {
			return;
		}

		requestAnimationFrame(() => this.repositionElement(this.target, this.floater));
	}

	enableFloatingFocus() {
		this.container.classList.add('floating-focus-enabled');
		this.floater.classList.add('enabled');
	}

	disableFloatingFocus() {
		this.container.classList.remove('floating-focus-enabled');
		this.floater.classList.remove('enabled');
	}

	handleFocus(e) {
		const target = e.target;

		if (!this.floater || !this.container) {
			return;
		}

		if (target === this.floater) {
			this.handleBlur();
			return;
		}

		console.log(this.container, this.container.contains(target));

		if (!this.container.contains(target)) {
			this.handleBlur();
			return;
		}

		this.floater.classList.add('visible');
		this.floater.classList.add('helper');
		this.floater.classList.add('moving');

		this.resolveTargetOutlineStyle(target, this.floater);
		this.repositionElement(target, this.floater);

		this.target = target;
		this.target.classList.add('floating-focused');

		clearTimeout(this.movingTimeout);
		this.movingTimeout = setTimeout(() => this.floater.classList.remove('moving'), 200);

		clearTimeout(this.helperFadeTimeout);
		this.helperFadeTimeout = setTimeout(() => this.floater.classList.remove('helper'), 800);
	}

	handleBlur() {
		if (!this.floater) {
			return;
		}

		this.floater.classList.remove('visible');
		this.floater.classList.remove('helper');
		this.floater.classList.remove('moving');

		if (!this.target) {
			return;
		}

		this.target.classList.remove('floating-focused');
	}

	resolveTargetOutlineStyle(target, floater) {
		const targetStyle = window.getComputedStyle(target);

		Object.assign(floater.style, {
			padding: targetStyle.outlineOffset ? targetStyle.outlineOffset : null,
			color: targetStyle.outlineColor,
			borderWidth: targetStyle.outlineWidth,
			borderBottomLeftRadius: targetStyle.borderBottomLeftRadius,
			borderBottomRightRadius: targetStyle.borderBottomRightRadius,
			borderTopLeftRadius: targetStyle.borderTopLeftRadius,
			borderTopRightRadius: targetStyle.borderTopRightRadius
		});
	}

	repositionElement(target, floater) {
		const rect = target.getBoundingClientRect();

		const left = rect.left + rect.width / 2;
		const top = rect.top + rect.height / 2;

		floater.style.left = `${left}px`;
		floater.style.top = `${top}px`;
		floater.style.width = `${rect.width}px`;
		floater.style.height = `${rect.height}px`;
	}
}

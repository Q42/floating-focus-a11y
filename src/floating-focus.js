import './floating-focus.scss';
import { isEqual, pick } from 'lodash';

const MOVE_DURATION = 200;

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
		this.monitorElementPosition = this.monitorElementPosition.bind(this);
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
		clearInterval(this.monitorElementPositionInterval);
		this.monitorElementPositionInterval = setInterval(this.monitorElementPosition, 250);
	}

	disableFloatingFocus() {
		this.container.classList.remove('floating-focus-enabled');
		this.floater.classList.remove('enabled');
		clearInterval(this.monitorElementPositionInterval);
	}

	handleFocus(e) {
		let target = e.target;

		if (!this.floater || !this.container) {
			return;
		}

		if (target === this.floater) {
			this.handleBlur();
			return;
		}

		if (!this.container.contains(target)) {
			this.handleBlur();
			return;
		}

		const focusTargetAttribute = target.getAttribute('focus-target');
		if (focusTargetAttribute) {
			const focusTarget = document.querySelector(`#${focusTargetAttribute}`);
			if (focusTarget) {
				target = focusTarget;
				target.classList.add('focus');
			}
		}

		this.floater.classList.add('visible');
		this.floater.classList.add('helper');
		this.floater.classList.add('moving');

		this.resolveTargetOutlineStyle(target, this.floater);
		this.repositionElement(target, this.floater);

		this.target = target;
		this.target.classList.add('floating-focused');

		clearTimeout(this.movingTimeout);
		this.movingTimeout = setTimeout(() => this.floater.classList.remove('moving'), MOVE_DURATION);

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
		this.target.classList.remove('focus');
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

	standardizeFloat(number) {
		return number.toFixed(3).replace(/\.0+$/, '').replace(/\.([^0]+)0+$/, '.$1');
	}

	getFloaterPosition(target) {
		const rect = target.getBoundingClientRect();

		const { width, height } = rect;
		const left = rect.left + rect.width / 2;
		const top = rect.top + rect.height / 2;

		return {
			left: `${this.standardizeFloat(left)}px`,
			top: `${this.standardizeFloat(top)}px`,
			width: `${this.standardizeFloat(width)}px`,
			height: `${this.standardizeFloat(height)}px`,
		};
	}

	monitorElementPosition() {
		const newFloaterPosition = this.getFloaterPosition(this.target);

		if (!isEqual( pick(this.floater.style, ['left','top','width','height']), newFloaterPosition )) {
			this.floater.classList.add('moving');
			Object.assign(this.floater.style, newFloaterPosition);
			clearTimeout(this.movingTimeout);
			this.movingTimeout = setTimeout(() => this.floater.classList.remove('moving'), MOVE_DURATION);
		}
	}

	repositionElement(target, floater) {
		Object.assign(floater.style, this.getFloaterPosition(target));
	}
}

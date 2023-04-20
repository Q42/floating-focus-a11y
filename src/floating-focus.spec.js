import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import FloatingFocus, { HELPER_FADE_TIME, MONITOR_INTERVAL } from './floating-focus'

describe('Floating focus', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb())
  })

  afterEach(() => {
    document.body.className = ''
    document.body.innerHTML = ''
    jest.clearAllTimers()
    window.requestAnimationFrame.mockRestore()
  })

  it('Should bind all required event listeners on construction', () => {
    expect(document.addEventListener).not.toHaveBeenCalled()

    const floatingFocus = new FloatingFocus()

    expect(document.addEventListener).toHaveBeenNthCalledWith(1, 'keydown', floatingFocus.handleKeyDown, false)
    expect(document.addEventListener).toHaveBeenNthCalledWith(2, 'mousedown', floatingFocus.handleMouseDown, false)
    expect(document.addEventListener).toHaveBeenNthCalledWith(3, 'focus', floatingFocus.handleFocus, true)
    expect(document.addEventListener).toHaveBeenNthCalledWith(4, 'blur', floatingFocus.handleBlur, true)
    expect(document.addEventListener).toHaveBeenNthCalledWith(5, 'scroll', floatingFocus.handleScrollResize, true)
    expect(window.addEventListener).toHaveBeenNthCalledWith(6, 'resize', floatingFocus.handleScrollResize, true)
  })

  it('Should not do anything if the keyboard input is not Tab or Arrow keys', () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.enableFloatingFocus = jest.fn()

    floatingFocus.handleKeyDown({ keyCode: 21 })
    expect(floatingFocus.enableFloatingFocus).not.toHaveBeenCalled()

    floatingFocus.handleKeyDown({ keyCode: 42 })
    expect(floatingFocus.enableFloatingFocus).not.toHaveBeenCalled()

    floatingFocus.handleKeyDown({ keyCode: 9 })
    expect(floatingFocus.enableFloatingFocus).toHaveBeenCalled()
  })

  it('Should construct, append and return a floating element', () => {
    const floatingFocus = new FloatingFocus()
    const floatingElement = floatingFocus.constructFloatingElement()

    expect(floatingElement instanceof Element).toBe(true)
    expect(floatingElement.classList.contains('floating-focus')).toBe(true)
    expect(floatingElement.tagName).toBe('DIV')
    expect(document.body.contains(floatingElement)).toBe(true)
  })

  it("Should create the 'floater' element when it is not present yet", () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.constructFloatingElement = jest.fn().mockImplementation(() => document.createElement('div'))

    expect(floatingFocus.constructFloatingElement).not.toHaveBeenCalled()

    floatingFocus.handleKeyDown({ keyCode: 9 })
    expect(floatingFocus.constructFloatingElement).toHaveBeenCalled()
  })

  it("Should not recreate the 'floater' element when it's already present created", () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.constructFloatingElement = jest.fn().mockImplementation(() => document.createElement('div'))

    expect(floatingFocus.constructFloatingElement).not.toHaveBeenCalled()

    floatingFocus.handleKeyDown({ keyCode: 9 })
    expect(floatingFocus.constructFloatingElement).toHaveBeenCalled()

    floatingFocus.handleKeyDown({ keyCode: 9 })
    expect(floatingFocus.constructFloatingElement).toHaveBeenCalledTimes(1)
  })

  it("Should only try to disable focus it the 'element' was created before", () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.disableFloatingFocus = jest.fn()

    expect(floatingFocus.disableFloatingFocus).not.toHaveBeenCalled()

    floatingFocus.handleMouseDown()

    expect(floatingFocus.disableFloatingFocus).not.toHaveBeenCalled()

    floatingFocus.handleKeyDown({ keyCode: 9 })
    floatingFocus.handleMouseDown()

    expect(floatingFocus.disableFloatingFocus).toHaveBeenCalled()
  })

  it("Should only reposition if a target and 'floater' was set, when scrolling or resizing", async () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.repositionElement = jest.fn()

    floatingFocus.handleScrollResize()

    expect(floatingFocus.repositionElement).not.toHaveBeenCalled()

    floatingFocus.floater = document.createElement('div')
    floatingFocus.target = document.createElement('div')

    floatingFocus.handleScrollResize()

    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(floatingFocus.repositionElement).toHaveBeenCalled()
  })

  it('Should enable the floating element by setting the appropriate classes', () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.floater = document.createElement('div')

    expect(document.body.classList.contains('floating-focus-enabled')).toBe(false)
    expect(floatingFocus.floater.classList.contains('enabled')).toBe(false)

    floatingFocus.enableFloatingFocus()

    expect(document.body.classList.contains('floating-focus-enabled')).toBe(true)
    expect(floatingFocus.floater.classList.contains('enabled')).toBe(true)
  })

  it('Should disable the floating element by removing the appropriate classes', () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.floater = document.createElement('div')

    floatingFocus.enableFloatingFocus()

    expect(document.body.classList.contains('floating-focus-enabled')).toBe(true)
    expect(floatingFocus.floater.classList.contains('enabled')).toBe(true)

    floatingFocus.disableFloatingFocus()

    expect(document.body.classList.contains('floating-focus-enabled')).toBe(false)
    expect(floatingFocus.floater.classList.contains('enabled')).toBe(false)
  })

  it('Should early return if not meeting requirements yet, when calling for focus handling', () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.resolveTargetOutlineStyle = jest.fn()
    const target = document.createElement('div')

    floatingFocus.handleFocus({ target }) // Missing 'floater' element

    expect(floatingFocus.resolveTargetOutlineStyle).not.toHaveBeenCalled()

    floatingFocus.floater = floatingFocus.constructFloatingElement()
    floatingFocus.handleFocus({ target: floatingFocus.floater }) // Target is the same as 'floater' element
    floatingFocus.handleFocus({ target }) // Target is not inside the body

    expect(floatingFocus.resolveTargetOutlineStyle).not.toHaveBeenCalled()

    document.body.appendChild(target)
    floatingFocus.handleFocus({ target }) // Successful handleFocus call

    expect(floatingFocus.resolveTargetOutlineStyle).toHaveBeenCalled()
  })

  it('Should set all appropriate classes when handling focus', async () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.floater = floatingFocus.constructFloatingElement()
    const target = document.createElement('div')
    document.body.appendChild(target)

    floatingFocus.handleFocus({ target })

    expect(floatingFocus.floater.classList.contains('visible')).toBe(true)
    expect(floatingFocus.floater.classList.contains('helper')).toBe(true)
    expect(floatingFocus.floater.classList.contains('moving')).toBe(true)

    expect(floatingFocus.target).toBe(target)
    expect(floatingFocus.target.classList.contains('floating-focused')).toBe(true)

    floatingFocus.floater.dispatchEvent(new Event('transitionend'))

    expect(floatingFocus.floater.classList.contains('moving')).toBe(false)

    jest.advanceTimersByTime(HELPER_FADE_TIME)

    expect(floatingFocus.floater.classList.contains('helper')).toBe(false)
  })

  it('Should change the target to a different element when the focused element has a focus-target attribute', async () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.floater = floatingFocus.constructFloatingElement()
    const target = document.createElement('div')
    const focusTarget = document.createElement('div')
    target.setAttribute('focus-target', 'element123')
    focusTarget.id = 'element123'
    document.body.appendChild(target)
    document.body.appendChild(focusTarget)

    floatingFocus.handleFocus({ target })

    expect(floatingFocus.target).toEqual(focusTarget)
    expect(focusTarget.classList.contains('focus')).toBe(true)
  })

  it('Should use the existing target if its focus-target cannot be found', () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.floater = floatingFocus.constructFloatingElement()
    const target = document.createElement('div')
    target.setAttribute('focus-target', 'element123')
    document.body.appendChild(target)

    floatingFocus.handleFocus({ target })

    expect(floatingFocus.target).toEqual(target)
    expect(target.classList.contains('focus')).toBe(true)
  })

  it('Should resolve the target outline style and reposition the element when handling focus', () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.resolveTargetOutlineStyle = jest.fn()
    floatingFocus.repositionElement = jest.fn()
    floatingFocus.floater = floatingFocus.constructFloatingElement()
    const target = document.createElement('div')
    document.body.appendChild(target)

    expect(floatingFocus.resolveTargetOutlineStyle).not.toHaveBeenCalled()
    expect(floatingFocus.resolveTargetOutlineStyle).not.toHaveBeenCalled()

    floatingFocus.handleFocus({ target })

    expect(floatingFocus.resolveTargetOutlineStyle).toHaveBeenCalled()
    expect(floatingFocus.resolveTargetOutlineStyle).toHaveBeenCalled()
  })

  it("Should early return when 'floater' is not present when handling blur", () => {
    const floatingFocus = new FloatingFocus()

    expect(floatingFocus.handleBlur()).toBe(undefined)
  })

  it("Should remove all visibility classes from the 'floater' when handleBlur is called", () => {
    const floatingFocus = new FloatingFocus()
    floatingFocus.target = document.createElement('div')
    floatingFocus.floater = floatingFocus.constructFloatingElement()
    floatingFocus.floater.classList.add('visible')
    floatingFocus.floater.classList.add('helper')
    floatingFocus.floater.classList.add('moving')

    expect(floatingFocus.floater.classList.contains('visible')).toBe(true)
    expect(floatingFocus.floater.classList.contains('helper')).toBe(true)
    expect(floatingFocus.floater.classList.contains('moving')).toBe(true)

    floatingFocus.handleBlur()

    expect(floatingFocus.floater.classList.contains('visible')).toBe(false)
    expect(floatingFocus.floater.classList.contains('helper')).toBe(false)
    expect(floatingFocus.floater.classList.contains('moving')).toBe(false)
  })

  it('Should resolve and append the outline styling from the target element', () => {
    const floatingFocus = new FloatingFocus()
    const target = document.createElement('div')
    const floater = floatingFocus.constructFloatingElement()

    const targetStyle = {
      outlineOffset: '8px',
      outlineColor: 'dodgerblue',
      outlineStyle: 'dashed',
      outlineWidth: '2px',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
    }

    window.getComputedStyle = jest.fn().mockImplementation(() => targetStyle)

    floatingFocus.resolveTargetOutlineStyle(target, floater)

    expect(floater.style.color).toBe(targetStyle.outlineColor)
    expect(floater.style.borderWidth).toBe(targetStyle.outlineWidth)
    expect(floater.style.borderStyle).toBe(targetStyle.outlineStyle)
    expect(floater.style.borderBottomLeftRadius).toBe(targetStyle.borderBottomLeftRadius)
    expect(floater.style.borderBottomRightRadius).toBe(targetStyle.borderBottomRightRadius)
    expect(floater.style.borderTopLeftRadius).toBe(targetStyle.borderTopLeftRadius)
    expect(floater.style.borderTopRightRadius).toBe(targetStyle.borderTopRightRadius)
  })

  it("Should correctly offset the target element's border radii by its outline offset", () => {
    const floatingFocus = new FloatingFocus()
    const target = document.createElement('div')
    const floater = floatingFocus.constructFloatingElement()

    const targetStyle = {
      outlineOffset: '8px',
      borderBottomLeftRadius: '6px',
      borderBottomRightRadius: '0px',
      borderTopLeftRadius: null,
    }

    window.getComputedStyle = jest.fn().mockImplementation(() => targetStyle)

    floatingFocus.resolveTargetOutlineStyle(target, floater)

    expect(floater.style.borderBottomLeftRadius).toBe('14px')
    expect(floater.style.borderBottomRightRadius).toBe('0px')
    expect(floater.style.borderTopLeftRadius).toBe('0px')
    expect(floater.style.borderTopRightRadius).toBe('0px')

    targetStyle.outlineOffset = null

    floatingFocus.resolveTargetOutlineStyle(target, floater)

    expect(floater.style.borderBottomLeftRadius).toBe(targetStyle.borderBottomLeftRadius)
  })

  it.each([4, 0])("Should reposition 'floater' based on target position -- outline offset %d", (outlineOffset) => {
    const floatingFocus = new FloatingFocus()
    const target = document.createElement('div')
    const floater = floatingFocus.constructFloatingElement()
    const targetStyle = window.getComputedStyle(target)
    targetStyle.outlineOffset = outlineOffset

    const rect = {
      left: 42,
      top: 84,
      width: 42,
      height: 128,
    }

    target.getBoundingClientRect = jest.fn().mockImplementation(() => rect)

    floatingFocus.repositionElement(target, floater)

    expect(floater.style.left).toBe(`${rect.left + rect.width / 2}px`)
    expect(floater.style.top).toBe(`${rect.top + rect.height / 2}px`)
    expect(floater.style.width).toBe(`${rect.width + outlineOffset * 2}px`)
    expect(floater.style.height).toBe(`${rect.height + outlineOffset * 2}px`)
  })

  it("Should automatically reposition the 'floater' when the target element's position changes", async () => {
    const floatingFocus = new FloatingFocus()
    const target = document.createElement('div')
    document.body.appendChild(target)

    const rect = {
      left: 42,
      top: 84,
      width: 42,
      height: 128,
    }

    target.getBoundingClientRect = jest.fn().mockImplementation(() => ({ ...rect }))

    floatingFocus.handleKeyDown({ keyCode: 9 })
    floatingFocus.enableFloatingFocus()
    floatingFocus.handleFocus({ target }, true)

    // Cleanup because transitionend is not called in this setup of jsdom
    floatingFocus.floater.classList.remove('moving')
    floatingFocus.floaterIsMoving = false

    expect(floatingFocus.floater.style.left).toBe(`${rect.left + rect.width / 2}px`)
    expect(floatingFocus.floater.style.top).toBe(`${rect.top + rect.height / 2}px`)

    jest.advanceTimersByTime(MONITOR_INTERVAL)
    expect(floatingFocus.floater.classList.contains('moving')).toBe(false)

    jest.advanceTimersByTime(MONITOR_INTERVAL)
    expect(floatingFocus.floater.classList.contains('moving')).toBe(false)

    rect.left += 42
    rect.top += 42

    expect(floatingFocus.floater.classList.contains('moving')).toBe(false)
    expect(floatingFocus.floater.style.left).not.toBe(`${rect.left + rect.width / 2}px`)
    expect(floatingFocus.floater.style.top).not.toBe(`${rect.top + rect.height / 2}px`)

    jest.advanceTimersByTime(MONITOR_INTERVAL)

    expect(floatingFocus.floater.classList.contains('moving')).toBe(true)
    expect(floatingFocus.floater.style.left).toBe(`${rect.left + rect.width / 2}px`)
    expect(floatingFocus.floater.style.top).toBe(`${rect.top + rect.height / 2}px`)
  })

  describe('addPixels', () => {
    it("Should correctly add up pixel amounts as if it's a normal calculation", () => {
      const floatingFocus = new FloatingFocus()

      const number1 = Math.random() * 10
      const number2 = Math.random() * 10

      expect(floatingFocus.addPixels(`${number1}px`, `${number2}px`)).toBe(`${number1 + number2}px`)
    })

    it('Should return null in case of invalid input', () => {
      const floatingFocus = new FloatingFocus()

      const number1 = '10px'
      const number2 = 'apx'

      expect(floatingFocus.addPixels(number1, number2)).toBeNull()
    })
  })
})

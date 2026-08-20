const MIRRORED_PROPERTIES = [
  "direction",
  "boxSizing",
  "width",
  "overflowX",
  "overflowY",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderStyle",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "fontStretch",
  "fontSize",
  "lineHeight",
  "fontFamily",
  "textAlign",
  "textTransform",
  "textIndent",
  "textDecoration",
  "letterSpacing",
  "wordSpacing",
  "tabSize",
  "wordBreak",
] as const

export type CaretCoordinates = {
  top: number
  left: number
  height: number
}

/**
 * Measures where the caret sits inside a plain <textarea> by rendering an
 * offscreen clone of its text up to the caret and reading the resulting
 * layout. Textareas have no native API for this.
 */
export function getCaretCoordinates(textarea: HTMLTextAreaElement, caretIndex: number): CaretCoordinates {
  const computed = window.getComputedStyle(textarea)

  const mirror = document.createElement("div")
  mirror.style.position = "absolute"
  mirror.style.visibility = "hidden"
  mirror.style.whiteSpace = "pre-wrap"
  mirror.style.wordWrap = "break-word"

  for (const prop of MIRRORED_PROPERTIES) {
    mirror.style[prop] = computed[prop]
  }

  document.body.appendChild(mirror)

  mirror.textContent = textarea.value.substring(0, caretIndex)

  const span = document.createElement("span")
  span.textContent = textarea.value.substring(caretIndex) || "."
  mirror.appendChild(span)

  const textareaRect = textarea.getBoundingClientRect()
  const borderTop = parseInt(computed.borderTopWidth || "0", 10)
  const borderLeft = parseInt(computed.borderLeftWidth || "0", 10)

  const coordinates: CaretCoordinates = {
    top: textareaRect.top + borderTop + span.offsetTop - textarea.scrollTop,
    left: textareaRect.left + borderLeft + span.offsetLeft - textarea.scrollLeft,
    height: parseInt(computed.lineHeight || computed.fontSize, 10),
  }

  document.body.removeChild(mirror)

  return coordinates
}

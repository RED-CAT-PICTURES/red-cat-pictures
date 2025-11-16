export default function (text: string, idealLength: number, maxLength?: number): string {
  const len = text.length

  // If there is a maxLength and the whole text fits inside it, return as-is.
  if (maxLength !== undefined && len <= maxLength) {
    return text
  }

  // Compute the effective limit:
  // - If maxLength is undefined: use idealLength.
  // - If maxLength is defined: use min(idealLength, maxLength).
  const limit = maxLength === undefined ? idealLength : Math.min(idealLength, maxLength)

  // If the text is already shorter than or equal to limit, return as-is.
  if (len <= limit) {
    return text
  }

  // Find the last space before or at the limit.
  const cutIndex = text.lastIndexOf(' ', limit)

  // If there is no space before the limit, we have a single long word or
  // first word longer than limit. Return original string for simplicity.
  if (cutIndex === -1) {
    return text
  }

  // Trim trailing space and return substring.
  return text.slice(0, cutIndex).trimEnd()
}

const extractDomain = string => {
  if (!string) return string

  if (string.includes('http')) {
    const lastIndexOf = string.lastIndexOf('http://')

    return string.slice(lastIndexOf + 7)
  }

  if (string.includes('https')) {
    const lastIndexOf = string.lastIndexOf('https://')

    return string.slice(lastIndexOf + 8)
  }

  return string
}

module.exports = extractDomain

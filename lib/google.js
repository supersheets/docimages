const HEADER_CONTENT_DISPOSITION = 'content-disposition'
const HEADER_CONTENT_TYPE = 'content-type'
const HEADER_CONTENT_LENGTH = 'content-length'
const DEFAULT_CONTENT_TYPE = 'image/png'

function parseResponseHeaders(headers) {
  return {
    name: getContentName(headers),
    type: getContentType(headers),
    length: getContentLength(headers)
  }
}

function getContentType(headers) {
  return headers[HEADER_CONTENT_TYPE] || DEFAULT_CONTENT_TYPE
}

function getContentName(headers) {
  // 'inline;filename="pasted image 0.png"'
  let value = headers[HEADER_CONTENT_DISPOSITION]
  if (value) {
    let matches = value.match(/^inline;filename="(.*)"/)
    if (matches) {
      return matches[1]
    }
  } 
  return null
}

function getContentLength(headers) {
  let length = -1
  try {
    length = parseInt(headers[HEADER_CONTENT_LENGTH])
    if (isNaN(length)) {
      length = -1
    }
  } catch (err) {
    console.error(err)
  }
  return length
}

module.exports = { 
  parseResponseHeaders,
  getContentName
}

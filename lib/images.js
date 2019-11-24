
const jessy = require('jessy')
const nessy = require('nessy')

function getInlineImages(doc) {
  let images = [ ]
  for (let id in doc.inlineObjects) {
    let obj = doc.inlineObjects[id]
    if (isImage(obj)) {
      images.push(extractImageProperties(obj))
    }
  }
  return images
}

function isImage(obj) {
  let imageUri = jessy("inlineObjectProperties.embeddedObject.imageProperties.contentUri", obj)
  return imageUri && true || false
}

function extractImageProperties(obj) {
  let image = obj.inlineObjectProperties.embeddedObject
  let id = obj.objectId
  let uri = jessy("imageProperties.contentUri", image)
  let height = jessy("size.height.magnitude", image)
  let width = jessy("size.width.magnitude", image)
  let unit = jessy("size.height.unit", image)
  return { id, uri, height, width, unit }
}

// map: objectId => { uri }
function replaceInlineImages(doc, map) {
  for (let id in doc.inlineObjects) {
    let obj = doc.inlineObjects[id]
    if (isImage(obj) && map[id] && map[id].uri) {
      nessy("inlineObjectProperties.embeddedObject.imageProperties.contentUri", map[id].uri, '.', obj)
    }
  }
  return doc
}


// "{"bucket":"images.supersheets.io","key":"test/pasted image 0.png","edits":{"resize":{"fit":"fill"}}}"


function encodeUri(bucket, key, edits) {
  return Buffer.from(JSON.stringify({ bucket, key })).toString('base64')
}

module.exports = {
  getInlineImages,
  replaceInlineImages,
  encodeUri
}

const { getInlineImages, replaceInlineImages, encodeUri } = require('./lib/images')
const { streamUrlToS3 } = require('./lib/s3')

async function uploadAndReplaceImages(s3, doc, options) {
  options = options || { }
  // Init params
  let skip = options.skip || { }
  let bucket = options.bucket 
  let base_url = options.base_url 
  if (!bucket) throw new Error("Must supply S3 bucket: options.bucket")
  if (!base_url) throw new Error("Must supply the base url of your image asset host (e.g. cloudfront): options.base_url")
  let prefix = options.prefix || ''
  // Get all images in the google doc that aren't in the skip map
  let images = getInlineImages(doc).filter(img => !skip[img.id] && true || false)
  // Upload all the images in the google doc to S3 in parallel
  let uploads = [ ]
  images.forEach(img => {
    uploads.push(streamUrlToS3(s3, img.uri, {
      id: img.id,
      Bucket: bucket,
      prefix
    }))
  })
  let results = await Promise.all(uploads)
  // Construct uris of the images (asset host)
  let map = results.reduce((map, result) => {
    let bucket = result.upload.Bucket
    let key = result.upload.Key
    let uri = `${base_url}/${encodeUri(bucket, key)}`
    map[result.options.id] = { uri }
    return map
  }, { })
  // Replace the image uris in the google doc to our asset host
  doc = replaceInlineImages(doc, map)
  return { uploads: results, map, doc }
}


module.exports = uploadAndReplaceImages
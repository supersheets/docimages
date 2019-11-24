const fetch = require('node-fetch')
const { createHash } = require('crypto')
const { promisify } = require('util')
const { parseResponseHeaders } = require('./google')

async function streamUrlToS3(s3, url, options) {
  options = options || { }
  let res = await fetch(url, { compress: false })
  let headers = { }
  res.headers.forEach((value, name) => {
    headers[name] = value
  })
  let meta = parseResponseHeaders(headers)
  meta.name = `${hash(url)}.png`
  let params = { 
    Bucket: options.Bucket, 
    Key: `${options.prefix || ''}${meta.name}`, 
    ContentType: meta.type,
    ContentLength: meta.length,
    Body: res.body
  }
  let upload = promisify(s3.upload).bind(s3)
  let data = await upload(params)
  return {
    url,
    options,
    meta,
    upload: data
  }
}

function hash(str) {
  return createHash('sha1').update(str).digest('hex')
}

module.exports = { 
  streamUrlToS3
}

// Google image response from 
// https://lh5.googleusercontent.com/SA6jnoskBOShrK-5BuLa4VR4TRNL1nue32w7QcJQjXYw6j2WuG_nh0tmTnWgl_GKgudil5o2IwZnoimguHaEiivitroMHovCzEC8pHO1QXg5A6rV1Li5kxF8-rrwx4zsoSV9SqkLqGaoAh-DCg
// 
// { status: 200,
// statusText: 'OK',
// headers:
//  { 'access-control-allow-origin': '*',
//    'access-control-expose-headers': 'Content-Length',
//    age: '460',
//    'alt-svc':
//     'quic=":443"; ma=2592000; v="46,43",h3-Q049=":443"; ma=2592000,h3-Q048=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000',
//    'cache-control': 'public, max-age=86400, no-transform',
//    connection: 'close',
//    'content-disposition': 'inline;filename="pasted image 0.png"',
//    'content-length': '1802250',
//    'content-type': 'image/png',
//    date: 'Sun, 03 Nov 2019 22:32:41 GMT',
//    etag: '"v1"',
//    expires: 'Mon, 04 Nov 2019 22:32:41 GMT',
//    server: 'fife',
//    'timing-allow-origin': '*',
//    vary: 'Origin',
//    'x-content-type-options': 'nosniff',
//    'x-xss-protection': '0' } }

// s3 upload result
//
// { ETag: '"7479486ef7dfa55ec32dc24e2c757701"',
//       Location:
//        'https://s3.us-west-2.amazonaws.com/images.supersheets.io/test/photo-1423347834838-5162bb452ca7.jpeg',
//       key: 'test/photo-1423347834838-5162bb452ca7.jpeg',
//       Key: 'test/photo-1423347834838-5162bb452ca7.jpeg',
//       Bucket: 'images.supersheets.io' }

// async function pipeImageUrlToDestStream(url, dest) {
//   let res = await fetch(url)
//   return new Promise((resolve, reject) => {
//     res.body.pipe(dest).on('error', (err) => {
//       reject(err)
//       return
//     }).on('close', () => {
//       resolve(true)
//       return
//     })
//   })
// }

// fetch('https://assets-cdn.github.com/images/modules/logos_page/Octocat.png')
//     .then(res => {
//         const dest = fs.createWriteStream('./octocat.png');
//         res.body.pipe(dest);
//     });


// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
//     var params = {Bucket: 'bucket', Key: 'key', Body: stream};
// s3.upload(params, function(err, data) {
//   console.log(err, data);
// });
// Uploading a stream with concurrency of 1 and partSize of 10mb
// var params = {Bucket: 'bucket', Key: 'key', Body: stream};
// var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
// s3.upload(params, options, function(err, data) {
//   console.log(err, data);
// });
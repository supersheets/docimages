require('dotenv').config()
const { streamUrlToS3 } = require('../lib/s3')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const BUCKET = process.env['S3_BUCKET']
const PREFIX = process.env['S3_UPLOAD_PREFIX']

const IMAGE_URL = 'https://images.unsplash.com/photo-1423347834838-5162bb452ca7'
const COMPRESSED_BODY_IMAGE_URL = 'https://api.adorable.io/avatars/50/jane.doe@supersheets.io.png'

describe('s3', () => {
  it ('should stream an image at a url to s3 bucket', async () => {
    let url = IMAGE_URL
    let data = await streamUrlToS3(s3, url, {
      Bucket: BUCKET, 
      prefix: PREFIX
    })
    let name = "565010e41c6949473dfcc341ab1303c051549307.png"
    expect(data).toMatchObject({
      url,
      options: {
        Bucket: BUCKET, 
        prefix: PREFIX
      },
      meta: {
        name,
        "type": "image/jpeg",
        "length": 1994229
      },
      upload: {
        "ETag": expect.anything(),
        "Location": `https://s3.us-west-2.amazonaws.com/${BUCKET}/${PREFIX}${name}`,
        "key": `${PREFIX}${name}`,
        "Key": `${PREFIX}${name}`,
        "Bucket": BUCKET
      }
    })
  }, 30 * 1000)
  it ('should stream an image with gzip response body', async () => {
    let url = COMPRESSED_BODY_IMAGE_URL
    let data = await streamUrlToS3(s3, url, {
      Bucket: BUCKET, 
      prefix: PREFIX
    })
    let name = "1177c0e6d03ae69a8b749dd3781371b08183d55d.png"  
    expect(data).toMatchObject({
      url,
      options: {
        Bucket: BUCKET, 
        prefix: PREFIX
      },
      meta: {
        name,
        "type": "image/png",
        "length": 3800
      },
      upload: {
        "ETag": expect.anything(),
        "Location": `https://s3.us-west-2.amazonaws.com/${BUCKET}/${PREFIX}${name}`,
        "key": `${PREFIX}${name}`,
        "Key": `${PREFIX}${name}`,
        "Bucket": BUCKET
      }
    })
  }, 30 * 1000)
})

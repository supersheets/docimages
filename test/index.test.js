require('dotenv').config()
const fetchdoc = require('./fetch')
const docimages = require('../index')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const BUCKET = process.env['S3_BUCKET']
const PREFIX = process.env['S3_UPLOAD_PREFIX']
const BASE_URL = process.env['CLOUDFRONT_BASE_URL']

const DOC_SINGLE_IMAGE = '1yIiUG7aoN2zYBInfvYwHZuYO1SK4E-B6ijf0pfy4y-E'
const DOC_MULTIPLE_IMAGES = '1uN0JMqlHJ2Kdg7a-NCmUXL_-BkAIC9f46s_AfyW4Da0'

describe('uploadAndReplaceImages', () => {
  it ('should upload images of a google doc with 1 image', async () => {
    let doc = await fetchdoc(DOC_SINGLE_IMAGE)
    let res = await docimages(s3, doc, {
      bucket: BUCKET,
      prefix: `${PREFIX}${doc.documentId}/`,
      base_url: BASE_URL
    })
    expect(res.map).toEqual({
      "kix.9tgu98jrxwha": {
        "uri": expect.stringMatching(/^https:\/\/d2zo69nzepejt3\.cloudfront\.net(.*)$/)
      }
    })
    expect(res.uploads.length).toBe(1)
    expect(res.uploads[0]).toMatchObject({
      "url": expect.stringMatching(/^https(.*)googleusercontent.com/),
      "options": {
        "id": "kix.9tgu98jrxwha",
        "Bucket": BUCKET,
        "prefix": "test/1yIiUG7aoN2zYBInfvYwHZuYO1SK4E-B6ijf0pfy4y-E/"
      },
      "meta": {
        "name": expect.stringMatching(/\.png$/),
        "type": "image/png",
        "length": 1802250
      },
      "upload": {
        "ETag": expect.anything(),
        "Location": expect.anything(),
        "key": expect.stringMatching(/test\/1yIiUG7aoN2zYBInfvYwHZuYO1SK4E-B6ijf0pfy4y-E\/(.*)\.png$/),
        "Key": expect.stringMatching(/test\/1yIiUG7aoN2zYBInfvYwHZuYO1SK4E-B6ijf0pfy4y-E\/(.*)\.png$/),
        "Bucket": BUCKET,
      }
    })
    console.log(JSON.stringify(res.uploads, null, 2))
    console.log(JSON.stringify(res.map, null, 2))
  }, 30 * 1000)
  it ('should upload images of a google doc with multiple images', async () => {
    let doc = await fetchdoc(DOC_MULTIPLE_IMAGES)
    let res = await docimages(s3, doc, {
      bucket: BUCKET,
      prefix: `${PREFIX}${doc.documentId}/`,
      base_url: BASE_URL
    })
    expect(res.uploads.length).toBe(3)
    expect(res.map).toMatchObject({
      "kix.9tgu98jrxwha": { uri: expect.anything() },
      "kix.fa42ll79c9w3": { uri: expect.anything() },
      "kix.lgb3ejwb13y5": { uri: expect.anything() }
    })
  }, 30 * 1000)
  it ('should skip all images', async () => {
    let doc = await fetchdoc(DOC_MULTIPLE_IMAGES)
    let skip = {
      "kix.9tgu98jrxwha": true,
      "kix.fa42ll79c9w3": true,
      "kix.lgb3ejwb13y5": true,
    }
    let res = await docimages(s3, doc, {
      bucket: BUCKET,
      prefix: `${PREFIX}${doc.documentId}/`,
      base_url: BASE_URL,
      skip
    })
    expect(res.uploads.length).toBe(0)
    expect(res.map).toEqual({ })
  }, 30 * 1000)
  it ('should skip only some images', async () => {
    let doc = await fetchdoc(DOC_MULTIPLE_IMAGES)
    let skip = {
      "kix.9tgu98jrxwha": true,
      "kix.fa42ll79c9w3": true,
      //"kix.lgb3ejwb13y5": true,
    }
    let res = await docimages(s3, doc, {
      bucket: BUCKET,
      prefix: `${PREFIX}${doc.documentId}/`,
      base_url: BASE_URL,
      skip
    })
    expect(res.uploads.length).toBe(1)
    expect(res.map).toEqual({ 
      "kix.lgb3ejwb13y5":{ uri: expect.anything() }
    })
  }, 30 * 1000)
})

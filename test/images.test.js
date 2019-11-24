require('dotenv').config()
const { getTestDoc } = require('./util')
const { getInlineImages, replaceInlineImages } = require('../lib/images')

describe('getInlineImageObjects', () => {
  it ('should get inline image objects', async () => {
    let doc = getTestDoc('normal.test.json')
    let images = getInlineImages(doc)
    expect(images.length).toBe(1)
    expect(images[0]).toMatchObject({
      id: "kix.9tgu98jrxwha",
      uri: expect.stringMatching(/^https:\/\/(.*)\.googleusercontent\.com/),
      height: 220.875,
      width: 331.8968253968254,
      unit: "PT"
    })
  })
})

describe('replace', () => {
  it ('should get inline image objects', async () => {
    let doc = getTestDoc('normal.test.json')
    let map = {
      "kix.9tgu98jrxwha": {
        uri: "https://d2zo69nzepejt3.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMuc3VwZXJzaGVldHMuaW8iLCJrZXkiOiJ0ZXN0L3Bhc3RlZCBpbWFnZSAwLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJmaWxsIn19fQ=="
      }
    }
    replaceInlineImages(doc, map)
    let images = getInlineImages(doc)
    console.log(JSON.stringify(images, null, 2))
    expect(images[0]).toMatchObject({
      uri: "https://d2zo69nzepejt3.cloudfront.net/eyJidWNrZXQiOiJpbWFnZXMuc3VwZXJzaGVldHMuaW8iLCJrZXkiOiJ0ZXN0L3Bhc3RlZCBpbWFnZSAwLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJmaXQiOiJmaWxsIn19fQ=="
    })
  })
})


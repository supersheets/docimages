require('dotenv').config()
const { getTestDoc } = require('./util')
const { parseResponseHeaders, getContentName } = require('../lib/google')

describe('parseResponseHeaders', () => {
  it ('should get image filename from content-disposition', async () => {
    let headers = getTestDoc('headers.test.json')
    let ret = parseResponseHeaders(headers)
    expect(ret).toEqual({
      "name": "pasted image 0.png",
      "type": "image/png",
      "length": 1802250
    })
  })
})

describe('getContentName', () => {
  it ('should get image filename from content-disposition', async () => {
    let headers = { 
      'content-disposition': 'inline;filename="pasted image 0.png"'
    }
    let ret = getContentName(headers)
    expect(ret).toEqual("pasted image 0.png")
  })
  it ('should return null if no content-disposition header', async () => {
    let headers = { }
    let ret = getContentName(headers)
    expect(ret).toEqual(null)
  })
  it ('should return null if content disposition does not follow expected format', async () => {
    let headers = { 
      'content-disposition': 'inline'
    }
    let ret = getContentName(headers)
    expect(ret).toEqual(null)
  })
})
require('dotenv').config()
const axios = require('axios')
const qs = require('querystring')
const jwt = require('jsonwebtoken')
const ACCESSTOKENURL = 'https://www.googleapis.com/oauth2/v4/token'
const SCOPES = [ 
  "https://www.googleapis.com/auth/documents"
]

async function get(docid) {
  let token = await accesstoken({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
  })
  let url = `https://docs.googleapis.com/v1/documents/${docid}`
  return (await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } })).data
}

function encodeRequestToken(options) {
  options = options || { }
  let header = {
    "alg":"RS256",
    "typ":"JWT"
  }
  let epoch = Math.floor(Date.now() / 1000)
  let claims = {
    iss: options.GOOGLE_CLIENT_EMAIL,
    scope: SCOPES.join(' '),
    aud: "https://www.googleapis.com/oauth2/v4/token",
    iat: epoch,
    exp: epoch + 60 * 60  // 1 hr 
  }
  let token = jwt.sign(claims, options.GOOGLE_PRIVATE_KEY, { algorithm: 'RS256', header })
  return token
}

async function requestAccessToken(token) {
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  let body = {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: token
  }
  let res = await axios.post(ACCESSTOKENURL, qs.stringify(body), headers)
  return res.data
}

async function accesstoken(options) {
  options = options || { }
  let token = encodeRequestToken(options)
  return (await requestAccessToken(token)).access_token
}

module.exports = get

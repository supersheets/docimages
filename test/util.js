const fs = require('fs')
const path = require('path')

function getTestDoc(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'docs', name)))
}

module.exports = {
  getTestDoc
}
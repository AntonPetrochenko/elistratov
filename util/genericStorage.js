const fs = require('fs')

function init(storageName) {
  const tf = `./${storageName}.json`
  let storage = []
  if (fs.existsSync(tf)) {
    storage = JSON.parse(fs.readFileSync(tf).toString())
  }
  
  function write(key, value) {
      storage[key] = value
      fs.writeFileSync(tf, JSON.stringify(storage))
  }
  
  function writeBatch(objChanges) {
    for (let changeIdx in objChanges) {
      storage[changeIdx] = objChanges[changeIdx]
    }
    fs.writeFileSync(tf, JSON.stringify(storage))
  }
  
  function read() {
    return storage
  }  

  return {
    read, write, writeBatch
  }
}


module.exports = {
  init
}
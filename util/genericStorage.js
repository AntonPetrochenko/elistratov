const fs = require('fs')

function make(storageName) {
  let tf = `./${storageName}.json`
  let storage = {}
  if (fs.existsSync(tf)) {
    storage = JSON.parse(fs.readFileSync(tf).toString())
  }
  
  // function write(key, value) {
  //     storage[key] = value
  //     fs.writeFileSync(tf, JSON.stringify(storage))
  // }
  
  function write(objChanges) {
    for (let changeIdx in objChanges) {
      storage[changeIdx] = objChanges[changeIdx]
    }
    fs.writeFileSync(tf, JSON.stringify(storage))

    console.log(JSON.stringify(storage))
  }
  
  function get() {
    return storage
  }  

  return {
    get, write
  }
}


module.exports = {
  make
}
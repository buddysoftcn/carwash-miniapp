let request = require('operation.js')
let carWash = require('../utils/carWash.js')

module.exports.createOrder = createOrder

function createOrder(params) {
  return new Promise((resolve, reject) => {
    request.startRequest('POST', '/orders', params, true)
      .then(data => {        
        resolve(data)       
      })
      .catch(e => {
        reject(e)
      })
  })

}  
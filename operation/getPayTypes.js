let request = require('operation.js')
let carWash = require('../utils/carWash.js')
let payType = require('../model/payType.js')

module.exports.getPayTypes = getPayTypes

function getPayTypes() {
  return new Promise((resolve, reject) => {
    request.getRequest('/pay-types', null, true)
      .then(data => {
        if (request.SUCCESSED == data.status) {
          payType.setCurrentPayTypes(data.items)
          resolve(data.items)
        } else {
          reject(null)
        }
      })
      .catch(e => {
        wx.showToast({
          title: e,
          icon: 'none'
        })
      })
  })
}
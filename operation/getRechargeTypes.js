let request = require('operation.js')
let carWash = require('../utils/carWash.js')
let rechargeType = require('../model/rechargeType.js')

module.exports.getRechargeTypes = getRechargeTypes

function getRechargeTypes() {
  return new Promise((resolve, reject) => {
    request.getRequest('/recharge-types', null, true)
      .then(data => {
        if (request.SUCCESSED == data.status) {
          rechargeType.setCurrentRechargeTypes(data.items)
          resolve(data.items)
        } else {
          reject(null)
        }
      })
      .catch(e => {
        reject(null)
        wx.showToast({
          title: e,
          icon: 'none'
        })
      })
  })
}
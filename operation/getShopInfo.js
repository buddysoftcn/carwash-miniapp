let request = require('operation.js')
let shop = require('../model/shop.js')

module.exports.getShopInfo = getShopInfo

function getShopInfo() {
  return new Promise((resolve, reject) => {
    request.getRequest('/shop-info?shopSid=' + getApp().buddysoft.shopSid, null, false)
      .then(data => {
        if (request.SUCCESSED == data.status) {
          shop.setShopInfo(data)
          resolve()
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
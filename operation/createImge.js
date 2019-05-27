let request = require('operation.js')
let carWash = require('../utils/carWash.js')

module.exports.createImage = createImage

/**
 * image:图片地址
 * type : 0 商铺；1 公告；2 商品
 */
function createImage(targetSid,image,type) {
  return new Promise((resolve, reject) => {
    request.startRequest('POST', '/site/upload-image', {'sid':targetSid,'type':type,'image':image}, true)
      .then(data => {
        if (request.SUCCESSED == data.status) {                    
          resolve(image)
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
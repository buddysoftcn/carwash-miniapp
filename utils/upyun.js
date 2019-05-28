let carWash = require('carWash.js')
let base64 = require('base64.js')
let md5 = require('md5.js')
let sha1 = require('hmac_sha1.js')

function uploadImage(path, success, fail) {
  let date = (new Date()).toGMTString()
  let tmpDate = new Date()
  let month = tmpDate.getMonth() + 1

  let paths = path.split('.')
  let imageName = paths[paths.length - 2] + '.' + paths[paths.length - 1]

  let opts = {
    'save-key': month + '/' + carWash.UP_YUN_IMAGE_PATH + imageName,
    bucket: carWash.UP_YUN_BUCKET,
    expiration: Math.round(new Date().getTime() / 1000) + 3600,
    date: date
  }

  let policy = base64.encode(JSON.stringify(opts))

  let data = ['POST', '/' + carWash.UP_YUN_BUCKET, date, policy].join('&')
  let signature = sha1(md5.hexMD5(carWash.UP_YUN_PASSWORD), data)

  wx.uploadFile({
    url: carWash.UP_YUN_API,
    filePath: path,
    name: 'file',
    formData: {
      authorization: 'UPYUN ' + carWash.UP_YUN_OPERATOR + ':' + signature,
      policy: policy
    },
    success: function (res) {
      // 检查图片是否上传成功
      if (200 == res.statusCode) {
        success('http://' + carWash.UP_YUN_IMAGE_DOMAIN + '/' + month + carWash.UP_YUN_IMAGE_PATH + imageName)
      }else {
        fail('图片上传失败')
      }
    },
    fail: function (res) {
      console.log(res)
      fail('图片上传失败')
    }
  })
}

// 删除图片
function delImage(path) {
  path = path.substring(path.indexOf('.net/') + 4)

  let date = (new Date()).toGMTString()
  let data = ['DELETE', '/' + carWash.UP_YUN_BUCKET + path, date].join('&')
  let authValue = sha1(md5.hexMD5(carWash.UP_YUN_PASSWORD), data)
  authValue = 'UPYUN ' + carWash.UP_YUN_OPERATOR + ':' + authValue

  wx.request({
    url: carWash.UP_YUN_DELETE_API + path,
    data: null,
    method: 'DELETE',
    header: {      
      'authorization': authValue,
      'x-upyun-async': 'true',
      'x-date':date
    },
    success(res) {
      if (200 == res.statusCode) {
        console.log('delimage success')
      }else {
        console.log('delimage fail')  
      }
    },
    fail(res) {
      console.log('delimage fail')
    }
  })
}

module.exports.uploadImage = uploadImage
module.exports.delImage = delImage
var carWash = require('carWash.js')
var base64 = require('base64.js')
var md5 = require('md5.js')
var sha1 = require('hmac_sha1.js')

function uploadImage(path, success, fail) {
  let date = (new Date()).toGMTString()
  let tmpDate = new Date()
  let month = tmpDate.getMonth() + 1

  let paths = path.split('.')
  let imageName = paths[paths.length - 2] + '.' + paths[paths.length - 1]
  var opts = {
    'save-key': month + '/' + carWash.UP_YUN_IMAGE_PATH + imageName,
    bucket: carWash.UP_YUN_BUCKET,
    expiration: Math.round(new Date().getTime() / 1000) + 3600,
    date: date
  }

  var policy = base64.encode(JSON.stringify(opts))

  var data = ['POST', '/' + carWash.UP_YUN_BUCKET, date, policy].join('&')
  var signature = sha1(md5.hexMD5(carWash.UP_YUN_PASSWORD), data)

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

module.exports.uploadImage = uploadImage
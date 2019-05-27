// pages/editAnnouncement/editAnnouncement.js
let mode = getApp().MODE_CREATE
let request = require('../../operation/operation.js')
let requestCreateImage = require('../../operation/createImge.js')
let upyun = require('../../utils/upyun.js')

let uploadedImageIndex = 0 // 当前上传图片序号
let title,desc
let announce = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],  // 界面中显示的图片数据
    weight: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShowEditWeight:function() {
    wx.navigateTo({
      url: '../editWeight/editWeight?weight=' + this.data.weight,
    })
  },

  onSave:function(event) {
    title = event.detail.value.title
    desc = event.detail.value.desc

    let message = null
    if (0 == title.length) {
      message = '请输入公告标题'
    }else if (0 == desc.length) {
      message = '请输入公告详情'
    }else if (0 == this.data.images.length) {
      message = '请选择至少一张公告图片'
    }
    if (null != message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      })

      return
    }

    this.uploadAnnounce()
    // wx.navigateBack({
      
    // })
  },

  // 选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片、
        console.log(res)
        let tmpImage =[]
        for (let index = 0; index < res.tempFilePaths.length;index ++) {
          tmpImage.push({ 'path': res.tempFilePaths[index], 'dirty': true })
        }
        that.setData({
          images: that.data.images.concat(tmpImage)
        });
      }
    })
  },

  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },

  uploadAnnounce:function() {
    if (getApp().MODE_CREATE == mode) {            
      this.create()      
    }
  },

  // 创建公告
  create:function() {
    let that = this
    request.postRequest('/announces', {'title':title,'desc':desc,'weight':this.data.weight}, true)
    .then(data => {
      announce = data.object

      that.uploadImage()
    }).catch(e => {

    })
  },

  // 创建图片
  addImage:function() {
    let path = ''

    for (var index = 0; index < this.data.images.length; index++) {
      if (this.data.images[index].dirty) {
        if (0 < index) {
          path = path + '|'
        }

        path = path + this.data.images[index].path
      }
    }
   
    if ('' != path) {      
      requestCreateImage.createImage(announce.sid,path,1)
      .then(data => {
        console.log(data)
      }).catch(e => {
        console.log(e)
      })
    }
  },

  /**
   * 获取需要上传服务器的图片
   * return array
   */
  checkUploadImages: function () {
    var result = false

    for (var index = 0; index < this.data.images.length; index++) {
      if (this.data.images[index].dirty) { 
        result = true
        break
      }
    }

    return result
  },

  /**
   * 上传图片到又拍云
   */
  uploadImage: function () {
    var that = this
    if (uploadedImageIndex + 1 <= this.data.images.length) {           
      if (0 > this.data.images[uploadedImageIndex].path.indexOf('://tmp')) {
        uploadedImageIndex++
        this.uploadImage()
        return
      }
      
      upyun.uploadImage(this.data.images[uploadedImageIndex].path,
        function (filePath) {
          that.data.images[uploadedImageIndex].path = filePath
          uploadedImageIndex++
          that.uploadImage()
        },
        function (fail) {
          wx.showToast({
            title: fail,
            icon: none
          })          
        })

    } else {
      // 图片上传完成处理流程
      that.addImage()
    }
  },


})
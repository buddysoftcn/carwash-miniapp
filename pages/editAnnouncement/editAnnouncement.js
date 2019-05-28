// pages/editAnnouncement/editAnnouncement.js
let mode = getApp().MODE_CREATE
let request = require('../../operation/operation.js')
let requestCreateImage = require('../../operation/createImge.js')
let upyun = require('../../utils/upyun.js')
let carWash = require('../../utils/carWash.js')

let uploadedImageIndex = 0 // 当前上传图片序号
let title,desc
let announce = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    desc:'',
    images: [],  // 界面中显示的图片数据
    weight: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mode) {
      mode = options.mode
      announce = getApp().globalData.param
      this.initView()
      wx.setNavigationBarTitle({title:'编辑公告'})
    }

    getApp().notificationCenter.register(carWash.EDIT_WEIGHT_MESSAGE, this, "handleEditWeightMessage");
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
    announce = null
    uploadedImageIndex = 0
    getApp().notificationCenter.remove(carWash.EDIT_WEIGHT_MESSAGE, this)
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
  },

  // 选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片、
        let tmpImage =[]
        for (let index = 0; index < res.tempFilePaths.length;index ++) {
          tmpImage.push({ 'sid':'0','path': res.tempFilePaths[index], 'dirty': true })
        }
        that.setData({
          images: that.data.images.concat(tmpImage)
        });
      }
    })
  },

  // 预览图片
  previewImage: function (e) {
    let tmpImage = []
    for (let index = 0;index < this.data.images.length;index++) {
      tmpImage.push(this.data.images[index].path)
    }
    
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: tmpImage // 需要预览的图片http链接列表
    })
  },

  // 删除图片
  onDelImage:function(event) {
    let tmpfiles = this.data.images;
    let index = event.currentTarget.id
    
    // if (event.currentTarget.dataset.sid && '0' != event.currentTarget.dataset.sid) {
    //   delImages.push({ 'sid': event.currentTarget.dataset.sid, 'url': event.currentTarget.dataset.url})    
    // }
    
    tmpfiles.splice(index, 1)
    this.setData({
      images: tmpfiles
    })
  },

  uploadAnnounce:function() {
    wx.showLoading({
      title: '请稍候',
      mask: true
    })

    if (getApp().MODE_CREATE == mode) {            
      this.create()      
    }else {
      this.edit()
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

  // 编辑公告
  edit:function() {
    let that = this
    request.putRequest('/announces/' + announce.sid, { 'title': title, 'desc': desc, 'weight': this.data.weight }, true)
      .then(data => {
        that.uploadImage()
      }).catch(e => {

      })
  },

  // 创建图片
  addImage:function() {
    if (this.checkUploadImages()) {
      let path = '', that = this

      for (var index = 0; index < this.data.images.length; index++) {
        if (0 < index) {
          path = path + '|'
        }

        path = path + this.data.images[index].path
      }

      if ('' != path) { // 有新图需要添加     
        requestCreateImage.createImage(announce.sid, path, 1)
          .then(data => {        
            that.back()            
          }).catch(e => {
            console.log(e)
          })
      }

    }else {
      that.back()
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

  initView:function() {
    if (announce) {
      let tmpImages = []

      for (let index = 0; index < announce.images.length; index ++) {
        tmpImages.push({'sid':announce.images[index].sid,'path':announce.images[index].url,'dirty':false})
      }

      this.setData({
        title:announce.title,
        desc:announce.desc,
        weight:announce.weight,
        images:tmpImages
      })
    }
  },

  handleEditWeightMessage: function (object) {
    this.setData({
      weight: object.weight
    });
  },

  back:function() {
    wx.hideLoading()
    
    getApp().notificationCenter.post(carWash.UPDATE_ANNOUNCE_MESSAGE, null)

    wx.navigateBack({
      delta: 1,
    })
  }
})
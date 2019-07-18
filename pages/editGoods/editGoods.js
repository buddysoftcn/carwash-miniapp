// pages/editGoods/editGoods.js
let carWash = require('../../utils/carWash.js')
let mode = getApp().MODE_CREATE
let request = require('../../operation/operation.js')
let requestCreateImage = require('../../operation/createImge.js')
let upyun = require('../../utils/upyun.js')

let uploadedImageIndex = 0 // 当前上传图片序号
let goods = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    images:[],
    price:'',
    discount:'',
    weight:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mode) {
      mode = options.mode
      goods = getApp().globalData.param
      this.initView()
      wx.setNavigationBarTitle({ title: '编辑商品' })
    }else {
      mode = getApp().MODE_CREATE
    }

    getApp().notificationCenter.register(carWash.EDIT_PRICE_MESSAGE, this, "handleEditPriceMessage")
    getApp().notificationCenter.register(carWash.EDIT_DISCOUNT_MESSAGE, this, "handleEditDiscountMessage")
    getApp().notificationCenter.register(carWash.EDIT_WEIGHT_MESSAGE, this, "handleEditWeightMessage")
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
    uploadedImageIndex = 0
    goods = null
    getApp().notificationCenter.remove(carWash.EDIT_PRICE_MESSAGE, this)
    getApp().notificationCenter.remove(carWash.EDIT_DISCOUNT_MESSAGE, this)
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

  // 选择图片
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片、
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
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

  // 删除图片
  onDelImage: function (event) {
    let tmpfiles = this.data.images;
    let index = event.currentTarget.id

    tmpfiles.splice(index, 1)
    this.setData({
      images: tmpfiles
    })
  },

  onShowEditPrice: function () {
    wx.navigateTo({
      url: '../editGoodsPrice/editGoodsPrice?price=' + this.data.price,
    })
  },

  onShowEditDiscount:function() {
    wx.navigateTo({
      url: '../editGoodsDiscount/editGoodsDiscount?discount=' + this.data.discount,
    })
  },

  onShowEditWeight:function() {
    wx.navigateTo({
      url: '../editWeight/editWeight?weight=' + this.data.weight,
    })
  },

  onSave: function (event) {
    let name = event.detail.value.name
    let message = ''
    if (0 == name.length) {
      message = '请输入商品简介'
    }else if (0 == this.data.images.length) {
      message = '请至少选择一张商品图片'
    }else if (0 == this.data.price.length) {
      message = '请输入商品实际价格'
    }

    if ('' != message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel:false
      })
    }else {
      wx.showLoading({
        title: '请稍候',
        mask: true
      })

      if (getApp().MODE_CREATE == mode) {
        this.create(name)
      } else {
        this.edit(name)
      }
    }
  },

  // 创建商品
  create: function (name) {
    let that = this
    request.postRequest('/items', { 'name': name, 'price': this.data.price, 'discount':this.data.discount, 'weight': this.data.weight }, true)
      .then(data => {
        goods = data.object
        that.uploadImage()
      }).catch(e => {

      })
  },

  // 编辑商品
  edit: function (name) {
    let that = this
    request.putRequest('/items/' + goods.sid, { 'name': name, 'price': this.data.price, 'discount': this.data.discount, 'weight': this.data.weight }, true)
      .then(data => {
        that.uploadImage()
      }).catch(e => {

      })
  },

  // 创建图片
  addImage: function () {
    let path = '', that = this

    for (var index = 0; index < this.data.images.length; index++) {
      if (0 < index) {
        path = path + '|'
      }

      path = path + this.data.images[index]
    }

    if ('' != path) {
      requestCreateImage.createImage(goods.sid, path, 2)
        .then(data => {
          that.back()
        }).catch(e => {
          console.log(e)
        })
    }
  },

  /**
   * 上传图片到又拍云
   */
  uploadImage: function () {
    var that = this
    if (uploadedImageIndex + 1 <= this.data.images.length) {
      if (0 > this.data.images[uploadedImageIndex].indexOf('://tmp')) {
        uploadedImageIndex++
        this.uploadImage()
        return
      }

      upyun.uploadImage(this.data.images[uploadedImageIndex],
        function (filePath) {
          that.data.images[uploadedImageIndex] = filePath
          uploadedImageIndex++
          that.uploadImage()
        },
        function (fail) {
          wx.showToast({
            title: fail,
            icon: 'none'
          })
        })

    } else {
      // 图片上传完成处理流程
      that.addImage()
    }
  },

  initView: function () {
    if (goods) {
      let tmpImages = []

      for (let index = 0; index < goods.images.length; index++) {
        tmpImages.push(goods.images[index].url)
      }

      this.setData({
        name: goods.name,
        price: goods.price,
        discount: goods.discount,
        weight: goods.weight,
        images: tmpImages
      })
    }
  },

  handleEditPriceMessage:function(object) {
    this.setData({
      price: object.price
    });
  },

  handleEditDiscountMessage: function (object) {
    this.setData({
      discount: object.discount
    });
  },

  handleEditWeightMessage:function(object) {
    this.setData({
      weight: object.weight
    });
  },

  back: function () {
    wx.hideLoading()
    getApp().notificationCenter.post(carWash.UPDATE_GOODS_MESSAGE, null)

    let delta = 1
    if (getApp().MODE_EDIT == mode) {
      delta = 2
    }
    wx.navigateBack({
      delta: delta,
    })
  }
})
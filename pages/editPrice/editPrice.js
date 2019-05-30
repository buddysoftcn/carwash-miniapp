// pages/editPrice/editPrice.js
let mode = getApp().MODE_CREATE
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carModel:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mode) {
      mode = options.mode
      this.setData({
        carModel: getApp().globalData.param
      })
    }
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

  onSave:function(event) {
    let model = event.detail.value.model
    let normalPrice = event.detail.value.normalPrice
    let weight = event.detail.value.weight
    let message = ''
    if (0 == model.length) {
      message = '请输入车型描述'
    } else if (0 == normalPrice.length) {
      message = '请输入洗车价格'
    }else if (0 == weight.length) {
      message = '请输入显示位置'
    }

    if ('' != message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel: false
      })
    } else {
      wx.showLoading({
        title: '请稍候',
        mask: true
      })
      if (getApp().MODE_CREATE == mode) {
        this.create(model, normalPrice, weight)
      } else {
        this.edit(model, normalPrice, weight)
      }
    }   
  },

  // 创建
  create: function (model,normalPrice,weight) {
    let that = this

    request.postRequest('/car-models', { 'model': model, 'normalPrice': normalPrice, 'weight': weight }, true)
      .then(data => {
        wx.hideLoading()
        that.back()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      })
  },

  // 编辑支付方式
  edit: function (model, normalPrice, weight) {
    let that = this

    request.putRequest('/car-models/' + this.data.carModel.sid, { 'model': model, 'normalPrice': normalPrice, 'weight': weight }, true)
      .then(data => {
        wx.hideLoading()
        that.back()
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      })
  },

  back: function () {
    getApp().notificationCenter.post(carWash.UPDATE_CAR_MODEL_MESSAGE, {})
    wx.navigateBack({
      delta: 1,
    })
  }
})
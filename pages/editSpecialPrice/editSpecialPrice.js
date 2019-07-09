// pages/editSpecialPrice/editSpecialPrice.js
let shopModel = require('../../model/shop.js')
let carModel = require('../../model/carModel.js')
let carWash = require('../../utils/carWash.js')
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    mode:'create',
    afterTomorrowUI: util.formatDate(util.afterTomorrow()),
    afterTomorrow: util.afterTomorrow(),
    specialDateBegin:'',
    specialDateEnd:'',
    pickDisabled:false,
    carModels:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()

    getApp().notificationCenter.register(carWash.UPDATE_SHOP_MESSAGE, this, "updateView")
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
    getApp().notificationCenter.remove(carWash.UPDATE_SHOP_MESSAGE, this)
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

  bindDateBeginChange:function(event) {
    this.setData({
      specialDateBegin:event.detail.value
    })
  },

  bindDateEndChange: function(event) {
    this.setData({
      specialDateEnd: event.detail.value
    })
  },

  onEditPirce:function(event) {
    if ('create' == this.data.mode) {
      getApp().globalData.param = event.currentTarget.dataset.carmodel
      wx.navigateTo({
        url: '../editSpecialDatePrice/editSpecialDatePrice',
      })
    }    
  },

  onSave:function() {
    let that = this 

    if (this.data.specialDateBegin > this.data.specialDateEnd) {
      wx.showModal({
        title: '提示',
        content: '【开始日期】不能大于 【结束日期】',
        showCancel:false
      })
    }else {
      request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'specialDateBegin': this.data.specialDateBegin, 'specialDateEnd': this.data.specialDateEnd},true)
      .then(data => {
        shop.shopSetting.specialDateBegin = that.data.specialDateBegin
        shop.shopSetting.specialDateEnd = that.data.specialDateEnd
        shopModel.setShopInfo(shop)
        that.back('设置成功')
      }).catch(e => {

      })
    }
  },

  onDel: function () {
    let that = this

    wx.showModal({
      title: '删除',
      content: '删除后，您可以创建新的特别服务日期，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'specialDateBegin': '', 'specialDateEnd': '' }, true)
            .then(data => {
              shop.shopSetting.specialDateBegin = null
              shop.shopSetting.specialDateEnd = null
              shopModel.setShopInfo(shop)
              that.back('删除成功')

            }).catch(e => {

            })
        } else if (res.cancel) {
        }
      }
    })
  },

  onStart:function() {
    this.setData({
      show:false
    })
  },

  onCancel:function() {
    wx.navigateBack({
      delta: 1,
    })
  },

  initView:function() {
    shop = shopModel.getShopInfo()
    let show = false, mode = 'create',pickDisabled = false,specialDateBegin = '',specialDateEnd = ''
    if (shop.shopSetting.specialDateBegin) {
      mode= 'edit'
      pickDisabled = true
      specialDateBegin = shop.shopSetting.specialDateBegin
      specialDateEnd = shop.shopSetting.specialDateEnd
    }else {
      show = true
      specialDateBegin = this.data.afterTomorrow
      specialDateEnd = this.data.afterTomorrow
    }

    this.setData({
      show:show,
      mode:mode,
      pickDisabled: pickDisabled,
      specialDateBegin: specialDateBegin,
      specialDateEnd: specialDateEnd,
      carModels: carModel.getCurrentCarModels()
    })
  },

  updateView:function() {    
    this.setData({
      carModels: carModel.getCurrentCarModels()
    })
  },

  back: function (title) {
    getApp().notificationCenter.post(carWash.UPDATE_SHOP_MESSAGE, null)

    wx.showToast({
      title: title,
    })

    wx.navigateBack({
      delta: 1,
    })
  }
})
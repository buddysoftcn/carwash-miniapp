// pages/settingTime/settingTime.js
let shopModel = require('../../model/shop.js')
let util = require('../../utils/util.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    restDate:'',
    washMinutes:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()

    getApp().notificationCenter.register(carWash.UPDATE_SHOP_MESSAGE, this, "handleUpdateShopMessage")
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

  handleUpdateShopMessage:function(object) {
    this.initView()
  },

  initView:function() {
    let shop = shopModel.getShopInfo()

    this.initRestDate(shop)
    this.initWashMinutes(shop)
  },

  initRestDate:function(shop) {
    if (shop) {
      if (shop.shopSetting.restBegin && shop.shopSetting.restEnd) {
        this.setData({
          restDate: util.formatDate(shop.shopSetting.restBegin) + '-' + util.formatDate(shop.shopSetting.restEnd)
        })
      }else {
        this.setData({
          restDate:''
        })
      }
    }
  },

  initWashMinutes:function(shop) {  
    if (shop.shopSetting.washMinutes) {
      this.setData({
        washMinutes: shop.shopSetting.washMinutes
      })
    }else {
      this.setData({
        washMinutes:''
      })
    }
  }
})
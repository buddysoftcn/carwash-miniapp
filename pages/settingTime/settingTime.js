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
    washMinutes:'',
    workTimeBegin:'',
    workTimeEnd: '',
    lunchTimeBegin:'',
    lunchTimeEnd: '',
    specialDate:''
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
    this.initWorkTime(shop)
    this.initLunchTime(shop)
    this.initSpecialDate(shop)
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
  },

  initWorkTime:function(shop) {
    if (shop.shopSetting.workTimeBegin) {
      this.setData({
        workTimeBegin: util.formatTime(shop.shopSetting.workTimeBegin),
        workTimeEnd: util.formatTime(shop.shopSetting.workTimeEnd)
      })
    } else {
      this.setData({
        workTimeBegin: '',
        workTimeEnd:''
      })
    }
  },

  initLunchTime:function(shop) {
    if (shop.shopSetting.lunchTimeBegin) {
      this.setData({
        lunchTimeBegin: util.formatTime(shop.shopSetting.lunchTimeBegin),
        lunchTimeEnd: util.formatTime(shop.shopSetting.lunchTimeEnd)
      })
    } else {
      this.setData({
        lunchTimeBegin: '',
        lunchTimeEnd: ''
      })
    }
  },

  initSpecialDate:function(shop) {
    if (shop.shopSetting.specialDateBegin) {
      this.setData({
        specialDate: util.formatDate(shop.shopSetting.specialDateBegin) + '-' + util.formatDate(shop.shopSetting.specialDateEnd),
      })
    }else {
      this.setData({
        specialDate:''
      })
    }
  }

})
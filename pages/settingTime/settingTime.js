// pages/settingTime/settingTime.js
let shopModel = require('../../model/shop.js')
let util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    restDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()
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

  initView:function() {
    let shop = shopModel.getShopInfo()

    this.initRestDate(shop)
  },

  initRestDate:function(shop) {
    if (shop) {
      if (shop.shopSetting.restBegin && shop.shopSetting.restEnd) {
        this.setData({
          restDate: util.formatDate(shop.shopSetting.restBegin) + '-' + util.formatDate(shop.shopSetting.restEnd)
        })
      }
    }
  }
})
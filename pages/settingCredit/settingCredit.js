// pages/settingCredit/settingCredit.js
let shopModel = require('../../model/shop.js')
let request = require('../../operation/operation.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fowardTimes:['30','45','60'],
    fowardTimeIndex:0,
    cancelTimes: [{ 'text': '半小时', 'value': '30' }, { 'text': '1 小时', 'value': '60' }, { 'text': '2 小时', 'value': '120'} ],
    cancelTimeIndex: 1,
    disableTimes:['3','7','30'],
    disableTimeIndex:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initShopInfo()
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

  bindForwardTimeChange:function(event) {
    let fowardTime = this.data.fowardTimes[event.detail.value]
    let that = this

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'appointFowardMinutes': fowardTime }, true)
      .then(data => {
        that.setData({
          fowardTimeIndex: event.detail.value
        })
        shop.shopSetting.appointFowardMinutes = fowardTime
        shopModel.setShopInfo(shop)
        wx.showToast({
          title: '设置成功',
        })
      }).catch(e => {

      })
  },

  bindCancelTimeChange:function(event) {
    let cancelTime = this.data.cancelTimes[event.detail.value].value
    let that = this

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'cancelForwardMinutes': cancelTime }, true)
      .then(data => {
        that.setData({
          cancelTimeIndex: event.detail.value
        })
        shop.shopSetting.cancelForwardMinutes = cancelTime
        shopModel.setShopInfo(shop)
        wx.showToast({
          title: '设置成功',
        })
      }).catch(e => {

      })
  },

  bindBanTimeChange:function(event) {
    let disableTime = this.data.disableTimes[event.detail.value]
    let that = this

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'discreditUserBanDays': disableTime }, true)
      .then(data => {
        that.setData({
          disableTimeIndex: event.detail.value
        })
        shop.shopSetting.discreditUserBanDays = disableTime
        shopModel.setShopInfo(shop)
        wx.showToast({
          title: '设置成功',
        })
      }).catch(e => {

      })
  },

  initShopInfo: function () {
    shop = shopModel.getShopInfo()
    if (shop) {
      let index = 0
      
      if (shop.shopSetting.appointFowardMinutes) {
        for (index = 0; index < this.data.fowardTimes.length; index++) {          
          if (shop.shopSetting.appointFowardMinutes == this.data.fowardTimes[index]) {            
            break
          }
        }
        
        this.setData({
          fowardTimeIndex: index
        })
      }

      if (shop.shopSetting.cancelForwardMinutes) {
        for (index = 0; index < this.data.cancelTimes.length; index++) {        
          if (shop.shopSetting.cancelForwardMinutes == this.data.cancelTimes[index].value) {
            break
          }
        }
        
        this.setData({
          cancelTimeIndex: index
        })
      }

      if (shop.shopSetting.discreditUserBanDays) {
        for (index = 0; index < this.data.disableTimes.length; index++) {
          if (shop.shopSetting.discreditUserBanDays == this.data.disableTimes[index]) {
            break
          }
        }

        this.setData({
          disableTimeIndex: index
        })
      }
      
    }
  }

})
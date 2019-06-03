// pages/editLunchTime/editLunchTime.js
let shopModel = require('../../model/shop.js')
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: ['11:30', '12:00'],
    startTimeIndex: 1,
    endTime: ['12:30', '13:00', '13:30'],
    endTimeIndex: 1
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

  bindWorkTimeBeginChange: function (event) {
    this.setData({
      startTimeIndex: event.detail.value
    })
  },

  bindWorkTimeEndChange: function (event) {
    this.setData({
      endTimeIndex: event.detail.value
    })
  },

  onSave: function () {
    let that = this
    let lunchTimeBeginNew = this.data.startTime[this.data.startTimeIndex]
    let lunchTimeEndNew = this.data.endTime[this.data.endTimeIndex]

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'lunchTimeBeginNew': lunchTimeBeginNew, 'lunchTimeEndNew': lunchTimeEndNew }, true)
      .then(data => {
        shop.shopSetting.lunchTimeBeginNew = lunchTimeBeginNew
        shop.shopSetting.lunchTimeEndNew = lunchTimeEndNew
        shop.shopSetting.lunchTimeEnableDate = data.object.lunchTimeEnableDate
        shopModel.setShopInfo(shop)
        that.initView()
        wx.showToast({
          title: '设置成功',
        })

        that.back()
      }).catch(e => {

      })
  },

  initView: function () {
    shop = shopModel.getShopInfo()

    let lunchTimeBegin = util.formatTime(shop.shopSetting.lunchTimeBegin)
    let beginTimesSize = this.data.startTime.length
    let lunchTimeEnd = util.formatTime(shop.shopSetting.lunchTimeEnd)
    let endTimesSize = this.data.endTime.length
    let startTimeIndex = 0, endTimeIndex = 0

    for (startTimeIndex; startTimeIndex < beginTimesSize; startTimeIndex++) {
      if (lunchTimeBegin == this.data.startTime[startTimeIndex]) {
        break
      }
    }

    for (endTimeIndex; endTimeIndex < endTimesSize; endTimeIndex++) {
      if (lunchTimeEnd == this.data.endTime[endTimeIndex]) {
        break
      }
    }

    this.setData({
      startTimeIndex: startTimeIndex,
      endTimeIndex: endTimeIndex
    })
  },

  back: function () {
    getApp().notificationCenter.post(carWash.UPDATE_SHOP_MESSAGE, null)

    wx.navigateBack({

    })
  }

})
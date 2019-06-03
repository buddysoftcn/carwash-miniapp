// pages/editWorkingTime/editWorkingTime.js
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
    startTime:['06:00','06:30','07:00','07:30','08:00','08:30','09:00'],
    startTimeIndex:4,
    endTime: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
    endTimeIndex: 4
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

  bindWorkTimeBeginChange: function(event) {   
    this.setData({
      startTimeIndex:event.detail.value
    })
  },

  bindWorkTimeEndChange: function (event) {
    this.setData({
      endTimeIndex: event.detail.value
    })
  },

  onSave:function() {
    let that = this
    let workTimeBeginNew = this.data.startTime[this.data.startTimeIndex]
    let workTimeEndNew = this.data.endTime[this.data.endTimeIndex]

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'workTimeBeginNew': workTimeBeginNew, 'workTimeEndNew': workTimeEndNew }, true)
      .then(data => {
        shop.shopSetting.workTimeBeginNew = workTimeBeginNew
        shop.shopSetting.workTimeEndNew = workTimeEndNew
        shop.shopSetting.workTimeEnableDate = data.object.workTimeEnableDate
        shopModel.setShopInfo(shop)
        that.initView()
        wx.showToast({
          title: '设置成功',
        })

        that.back()
      }).catch(e => {

      })
  },

  initView:function() {
    shop = shopModel.getShopInfo()

    let workTimeBegin = util.formatTime(shop.shopSetting.workTimeBegin)
    let beginTimesSize = this.data.startTime.length
    let workTimeEnd = util.formatTime(shop.shopSetting.workTimeEnd)
    let endTimesSize = this.data.endTime.length
    let startTimeIndex = 0,endTimeIndex = 0
    
    for (startTimeIndex; startTimeIndex < beginTimesSize; startTimeIndex++) {
      if (workTimeBegin == this.data.startTime[startTimeIndex]) {
        break
      }
    }

    for (endTimeIndex; endTimeIndex < endTimesSize; endTimeIndex++) {
      if (workTimeEnd == this.data.endTime[endTimeIndex]) {
        break
      }
    }

    this.setData({
      startTimeIndex: startTimeIndex,
      endTimeIndex: endTimeIndex
    })
  },

  back:function() {
    getApp().notificationCenter.post(carWash.UPDATE_SHOP_MESSAGE, null)

    wx.navigateBack({
      
    })
  }

})
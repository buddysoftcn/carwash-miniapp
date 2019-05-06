// pages/editWorkingTime/editWorkingTime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime:['06:00','06:30','07:00','07:30','08:00','08:30','09:00'],
    startTimeIndex:4,
    endTime: ['05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00'],
    endTimeIndex: 4

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onSave:function() {
    wx.navigateBack({
      delta: 1,
    })
  }
})
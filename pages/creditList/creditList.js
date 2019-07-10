// pages/creditList/creditList.js
let request = require('../../operation/operation.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserCredit(options.userSid)
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

  getUserCredit:function(userSid) {
    let that = this 

    wx.showLoading({
      title: '请稍候',
    })

    request.getRequest('/orders?category=client_orders&state=discredit&userSid=' + userSid,null,true)
    .then(data => {
      wx.hideLoading()      
      that.setData({
        orders:data.items
      })
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
        icon:'none'
      })
    })
  }
})
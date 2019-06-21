// pages/editEmploye/editEmploye.js
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let clerk = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    alias:'',
    useBalance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    clerk = getApp().globalData.param

    wx.setNavigationBarTitle({
      title: clerk.user.nickName
    })

    this.setData({
      alias:clerk.alias,
      useBalance:clerk.useBalance
    })
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
    wx.showLoading({
      title: '请稍候',
      mask:true
    })

    let useBalance = 0
    if (true == event.detail.value.useBalance) {
      useBalance = 1
    }

    request.putRequest('/clerks/' + clerk.sid,{'alias':event.detail.value.alias,'useBalance':useBalance},true)
    .then(data => {
      wx.hideLoading()
      getApp().notificationCenter.post(carWash.UPDATE_CLERKS_MESSAGE, null)
      wx.navigateBack({

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
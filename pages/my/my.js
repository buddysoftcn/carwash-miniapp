// pages/my/my.js
let userModel = require('../../model/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clerk:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let role = userModel.getRole()

    if (userModel.ROLE_CLERK == role.role) {
      this.setData({
        clerk:true
      })
    }

    this.updateUserInfo()
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
    this.updateUserInfo()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onClickMemberCard:function() {
    wx.navigateTo({
      url: '../searchMember/searchMember',
    })
  },

  updateUserInfo:function() {
    getApp().getUserInfo(function() {
      wx.stopPullDownRefresh()
    })
  }
})
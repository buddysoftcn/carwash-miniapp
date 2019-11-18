// pages/my/my.js
let userModel = require('../../model/user.js')
let getShopInfo = require('../../operation/getShopInfo.js')
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
    this.initView()
    if (this.isAuth()) {
      this.updateUserInfo()
      this.updateShopInfo()
    }else {
      wx.navigateTo({
        url: '../index/index',
      })
    }    
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
    if (this.isAuth()) {
      this.updateUserInfo()
      this.updateShopInfo()
    }  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onSearchByNumber:function() {
    let url = '../searchMember/searchMember?mode=number' 
    if (false == this.isAuth()) {
      url = '../index/index'
    }

    wx.navigateTo({
      url: url,
    })
  },

  onSearchByMember:function() {
    let url = '../searchMember/searchMember?mode=member'
    if (false == this.isAuth()) {
      url = '../index/index'
    }

    wx.navigateTo({
      url: url,
    })
  },

  onClickMemberCard:function() {
    wx.navigateTo({
      url: '../searchMember/searchMember',
    })
  },

  initView:function() {
    let role = userModel.getRole(),clerk = false

    if (userModel.ROLE_OWNER != role.role) {
      clerk = true
    }

    this.setData({
      clerk: clerk
    })
  },

  updateUserInfo:function() {
    let that = this 

    getApp().getUserInfo(function() {
      wx.stopPullDownRefresh()
      that.initView()
    })
  },

  updateShopInfo:function() {
    getShopInfo.getShopInfo()
  },

  isAuth:function () {
    let role = userModel.getRole(), result = true
    if (userModel.ROLE_OWNER == role.role || userModel.ROLE_CLERK == role.role) {

    } else {
      result = false
    }

    return result
  },

})
// pages/authEmploye/authEmploye.js
let clerk = null
let getShopInfoRequest = require('../../operation/getShopInfo.js')
let userModel = require('../../model/user.js')
let request = require('../../operation/operation.js')
let authViewTemplate = require('../../template/authView/authView.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAuthView: false,
    clerk:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getShopInfoRequest.getShopInfo()

    clerk = getApp().globalData.param
    this.setData({
      clerk:clerk
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

  onEnter:function() {    
    let user = userModel.getRole()
    if (userModel.ROLE_NO_LOGIN == user.role) {
      authViewTemplate.showView(this, true)
    }else {
      this.joinShop()
    }
    
  },

  bindGetUserInfo: function (event) {
    let that = this 

    this.setData({
      showAuthView: false
    })

    getApp().login(event.detail, function (userInfo, message) {
      if (null != userInfo) {                   
        userModel.setCurrentUser(userInfo)        
        that.joinShop()
      }else {

      }
    })
  },

  joinShop:function() {
    wx.showLoading({
      title: '请稍候',
      mask: true
    })    
    request.postRequest('/clerks/join/' + clerk.clerkSid,{},true)
      .then(data => {
        getApp().getUserInfo(function (user) {
          wx.hideLoading()

          if (null != user) {
            wx.reLaunch({
              url: '../home/home',
            })
          }
        })            
      }).catch(e => {
        wx.hideLoading()
        if (-1 == e.status) {
          wx.navigateTo({
            url: '../authEmployeFailed/authEmployeFailed',
          })
        }
      })
  }

})
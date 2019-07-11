// pages/memberDetail/memberDetail.js
let carWash = require('../../utils/carWash.js')
let request = require('../../operation/operation.js')
let userModel = require('../../model/user.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    member:null,
    useBalance:false,
    useMember:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initUserView()
    this.initPowerView()
    this.getMemberInfo()

    getApp().notificationCenter.register(carWash.UPDATE_MEMBER_INFO, this, "getMemberInfo");
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
    getApp().notificationCenter.remove(carWash.UPDATE_MEMBER_INFO, this)
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
   * 查看用户信用记录
   */
  onShowUserCreditList:function() {
    wx.navigateTo({
      url: '../creditList/creditList?userSid=' + this.data.user.sid,
    })
  },

  onClickAddConsume:function() {
    getApp().globalData.param = this.data.user
    
    wx.navigateTo({
      url: '../addConsume/addConsume',
    })
  },

  /**
   * 显示会员卡
   */
  onShowPay:function() {
    getApp().globalData.param = this.data.user

    wx.navigateTo({
      url: '../memberRecharge/memberRecharge',
    })
  },

  /**
   * 获取用户会员卡信息
   */
  getMemberInfo:function() {
    let that = this
    wx.showLoading({
      title: '请稍候',
    })
    request.getRequest('/user/member?userSid=' + this.data.user.sid,null,true)
    .then(data => {
      if (null != data.object.expiredAt) {
        data.object.uiExpiredAt = data.object.expiredAt.substring(0,10)
      }else {
        data.object.uiExpiredAt = ''
      }
      
      wx.hideLoading()
      that.setData({
        member:data.object
      })  
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
        icon:'none'
      })
    })
  },

  initUserView:function() {
    this.setData({
      user: getApp().globalData.param
    })
  },

  initPowerView:function() {
    let currentUser = userModel.getCurrentUser(), useBalance = false,useMember = false
    console.log(currentUser)
    if (false == currentUser.asClerk) {
      useBalance = true
      useMember = true
    }else {
      if (1 == currentUser.asClerk.useBalance) {
        useBalance = true
      }
    }

    this.setData({
      useBalance: useBalance,
      useMember: useMember
    })
  }

 })
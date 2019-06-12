// pages/home/home.js
let util = require('../../utils/util.js')
let shopModel = require('../../model/shop.js')
let map = new Map()
let data = []
let currentDate = null
let shop = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',  // 时间导航日期
    week:'',  // 时间导航星期
    showHelpOrderView:false,
    showOrderView:false,
    showPaymentView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    wx.setNavigationBarTitle({
      title: getApp().buddysoft.name
    })

    shop = shopModel.getShopInfo()
    currentDate = util.today()
    this.initDate(currentDate)
    this.initWorktimeList()
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
  onCell:function() {
    this.setData({
      showHelpOrderView: true
    })
  },
  onCellPayment:function() {
    this.setData({
      showPaymentView: true
    })
  },
  onCellCancelPayment:function() {
    wx.navigateTo({
      url: '../cancelPaymentOrder/cancelPaymentOrder',
    })
  },
  onPayment:function() {
    this.setData({
      showPaymentView:false
    })
    wx.navigateTo({
      url: '../paymentOrder/paymentOrder',
    })
  },
  onOrder: function () {
    this.setData({
      showHelpOrderView: false
    })

    wx.navigateTo({
      url: '../addOrder/addOrder',
    })
  },
  onAddMoreOrder:function() {
    wx.navigateTo({
      url: '../addMoreOrder/addMoreOrder',
    })
  },
  onOrderLater: function () {
    this.setData({
      showHelpOrderView: false
    })
  },
  onUnOrder:function() {
    this.setData({
      showOrderView: false
    })
  },
  onUnOrderLater:function() {
    this.setData({
      showOrderView:false
    })
  },
  onClose:function() {
    this.setData({
      showHelpOrderView: false,
      showOrderView: false,
      showPaymentView: false
    })
  },

  initDate:function(date) {
    this.setData({
      date:util.formatDate(date),
      week:util.week(date)
    })
  },

  initWorktimeList:function() {
    this.initWorktime()
  },

  initWorktime:function() {
    console.log(shop)
    console.log(currentDate)
    if (shop) {
      let workTimeBegin = shop
        data.push({'a':10,'b':20})
        map.set(1,data[0])
      data[0].a = 30
        console.log(map)
    }
  },

  makeDatetime:function(time) {

  }
})
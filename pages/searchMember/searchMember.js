// pages/searchMember/searchMember.js
let request = require('../../operation/operation.js')
let mode = 'number'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchBarTitle:'',
    searchBarValue:'',
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    mode = options.mode

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

  onInputing: function (event) {
    let value = event.detail.value

    this.setData({
      searchBarValue: value.toUpperCase()
    })
  },

  onSearch:function(event) {
    let value = event.detail.value,param = 'plateNumber',that = this
    
    wx.showLoading({
      title: '请稍候',
    })
    request.getRequest('/user/index?' + param + '=' + value,null, true)
    .then(data => {
      wx.hideLoading()
      that.setData({
        users:data.items
      })
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
        icon:'none'
      })      
    })
  },

  onShowMemberDetail:function(event) {
    let user = event.currentTarget.dataset.user
    getApp().globalData.param = user
    
    wx.navigateTo({
      url: '../memberDetail/memberDetail',
    })
  },

  initView:function() {
    let title = ''
    if ('number' == mode) {
      title = '车牌号'
    }

    wx.setNavigationBarTitle({
      title: '搜索' + title,
    })

    this.setData({
      searchBarTitle:title
    })
  }
})
// pages/announcementList/announcementList.js
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    announces:[],
    height:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()
    this.getAnnouncements()

    getApp().notificationCenter.register(carWash.UPDATE_ANNOUNCE_MESSAGE, this, "getAnnouncements");
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
    getApp().notificationCenter.remove(carWash.UPDATE_ANNOUNCE_MESSAGE, this)
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

  onEditAnoncement:function() {
    wx.navigateTo({
      url: '../editAnnouncement/editAnnouncement',
    })
  },
  onPreview: function (event) {
    getApp().globalData.param = event.currentTarget.dataset.announce
    wx.navigateTo({
      url: '../previewAnnouncement/previewAnnouncement',
    })
  },

  getAnnouncements:function() {
    let self = this

    request.getRequest('/announces', null, true)
    .then(data => {
      self.setData({
        announces:data.items
      })
    }).catch(e => {

    })
  },

  initView:function() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {      
        that.setData({
          height: (res.windowHeight - 94)
        })
      },
    })
  }

})
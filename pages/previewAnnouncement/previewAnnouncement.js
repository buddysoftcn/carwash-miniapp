// pages/previewAnnouncement/previewAnnouncement.js
let request = require('../../operation/operation.js')
let upyun = require('../../utils/upyun.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    announce:null,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      announce: getApp().globalData.param
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

  onShareAppMessage: function (event) {
    console.log(event)
  },

  onEdit:function() {
    getApp().globalData.param = this.data.announce

    wx.navigateTo({
      url: '../editAnnouncement/editAnnouncement?mode=' + getApp().MODE_EDIT    
    })
  },

  onDel:function() {
    let that = this

    wx.showModal({
      title: '删除公告',
      content: '删除公告后，将无法找回，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          that.delAnnounce()
        } else if (res.cancel) {          
        }
      }
    })
  },

  // 删除公告
  delAnnounce:function() {
    wx.showLoading({
      title: '请稍候',
      mask: true
    })

    let announce = this.data.announce
    // // 删除又拍云上的图片
    // if (announce.images && 0 < announce.images.length) {
    //   for (let index = 0; index < announce.images.length; index++) {
    //     upyun.delImage(announce.images[index].url)
    //   }
    // }
    
    request.deleteRequest('/announces/' + announce.sid, null, true)
      .then(data => {
        wx.hideLoading()
        getApp().notificationCenter.post(carWash.UPDATE_ANNOUNCE_MESSAGE,{})
        wx.navigateBack({
          delta: 1,
        })
      }).catch(e => {

      })
  }
})
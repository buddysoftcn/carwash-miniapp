// pages/previewAnnouncement/previewAnnouncement.js
let request = require('../../operation/operation.js')
let upyun = require('../../utils/upyun.js')
let carWash = require('../../utils/carWash.js')
let userModel = require('../../model/user.js')

let announce = null
let mode = 'view' // edit 店主正常进入界面；view 通过分享方式进入

Page({

  /**
   * 页面的初始数据
   */
  data: {
    announce:null,
    // 滚动视图配置参数
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    mode:'view',
    role:null // clerk/null clerk 代表用户是店铺工作人员；null 为普通用户或者游客
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sid) {      
      mode = 'view'
      this.getAnnounce(options.sid)          
    }else {
      mode = 'edit'
      announce = getApp().globalData.param
      this.initAnnounce()
    }  
    
    this.initViewHeight()
    this.initToolbarView()  
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
    announce = null
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
    return {
      title: announce.title,
      path: '/pages/previewAnniuncement/previewAnniuncement?sid=' + announce.sid
    }
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

  onOpenMiniApp:function() {
    wx.navigateToMiniProgram({
      appId: getApp().buddysoft.wxUserAppID,
      success(res) {
        console.log('打开成功')
      }
    })    
  },

  onBackHome:function() {
    wx.reLaunch({
      url: '../../pages/home/home',
    })
  },

  // 删除公告
  delAnnounce:function() {
    wx.showLoading({
      title: '请稍候',
      mask: true
    })

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
  },

  getAnnounce:function(sid) {
    let that = this
    wx.showLoading({
      title: '请稍候',
    })
    request.getRequest('/announces/' + sid,null,false)
    .then(data => {
      wx.hideLoading()
      announce = data.object
      that.initAnnounce()
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
      })
    })
  },

  initAnnounce:function() {
    this.setData({
      announce: announce
    })
  },

  initToolbarView:function() {
    let userRole = userModel.getRole(),role = null

    if (userModel.ROLE_OWNER == userRole.role || userModel.ROLE_CLERK == userRole.role) {
      role = 'clerk'
    }

    this.setData({
      mode:mode,
      role:role
    })
  },

  initViewHeight: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight - 94)
        that.setData({
          height: (res.windowHeight - 94)
        })
      },
    })
  }
  
})
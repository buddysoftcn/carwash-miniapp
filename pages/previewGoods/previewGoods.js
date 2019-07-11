// pages/previewGoods/previewGoods.js
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let userModel = require('../../model/user.js')

let goods = null
let mode = 'view' // edit 店主正常进入界面；view 通过分享方式进入

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:{},
     // 滚动视图配置参数
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,

    mode: 'view',
    role: null // clerk/null clerk 代表用户是店铺工作人员；null 为普通用户或者游客
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.sid) {
      mode = 'view'
      this.getGoods(options.sid)
    } else {
      mode = 'edit'
      goods = getApp().globalData.param
      this.setData({
        goods: goods
      })
    }

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
      title: goods.name,
      path: '/pages/previewGoods/previewGoods?sid=' + goods.sid
    }
  },

  onEdit: function () {
    getApp().globalData.param = this.data.goods

    wx.navigateTo({
      url: '../editGoods/editGoods?mode=' + getApp().MODE_EDIT
    })
  },

  onDel: function () {
    let that = this

    wx.showModal({
      title: '删除商品',
      content: '删除商品后，将无法找回，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          that.delGoods()
        } else if (res.cancel) {
        }
      }
    })
  },

  onOpenMiniApp: function () {
    wx.navigateToMiniProgram({
      appId: carWash.CAR_WASH_CLIENT_APPID,
      success(res) {
        console.log('打开成功')
      }
    })
  },

  onBackHome: function () {
    wx.reLaunch({
      url: '../../pages/home/home',
    })
  },

  // 删除公告
  delGoods: function () {
    wx.showLoading({
      title: '请稍候',
      mask: true
    })

    let goods = this.data.goods

    request.deleteRequest('/items/' + goods.sid, null, true)
      .then(data => {
        wx.hideLoading()
        getApp().notificationCenter.post(carWash.UPDATE_GOODS_MESSAGE, {})
        wx.navigateBack({
          delta: 1,
        })
      }).catch(e => {

      })
  },

  getGoods: function (sid) {
    let that = this
    wx.showLoading({
      title: '请稍候',
    })
    request.getRequest('/items/' + sid, null, false)
      .then(data => {
        wx.hideLoading()
        goods = data.object
        that.setData({
          goods: data.object
        })
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
        })
      })
  },

  initToolbarView: function () {
    let userRole = userModel.getRole(), role = null

    if (userModel.ROLE_OWNER == userRole.role || userModel.ROLE_CLERK == userRole.role) {
      role = 'clerk'
    }

    this.setData({
      mode: mode,
      role: role
    })
  }
})
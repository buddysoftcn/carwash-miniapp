// pages/previewGoods/previewGoods.js
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:{},
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
      goods: getApp().globalData.param
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
  }
})
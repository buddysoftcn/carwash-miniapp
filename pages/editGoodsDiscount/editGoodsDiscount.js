// pages/editGoodsDiscount/editGoodsDiscount.js
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      discount: options.discount
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

  onSave: function (event) {
    let discount = event.detail.value.discount

    if (0 == discount.length) {
      wx.showModal({
        title: '提示',
        content: '请输入商品打折状况',
        showCancel: false
      })
    } else {
      getApp().notificationCenter.post(carWash.EDIT_DISCOUNT_MESSAGE, { 'discount': discount })
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})
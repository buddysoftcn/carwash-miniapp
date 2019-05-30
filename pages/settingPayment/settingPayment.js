// pages/settingPayment/settingPayment.js
let getPayTypeRequest = require('../../operation/getPayTypes.js')
let carWash = require('../../utils/carWash.js')
let request = require('../../operation/operation.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payTypes:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPayTypes()

    getApp().notificationCenter.register(carWash.UPDATE_PAY_TYPE_MESSAGE, this, "getPayTypes");
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
    getApp().notificationCenter.remove(carWash.UPDATE_PAY_TYPE_MESSAGE, this)
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

  onDel:function(event) {
    let that = this
    const { position, instance } = event.detail;

    wx.showModal({
      title: '删除付款方式',
      content: '删除后，将无法找回，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          instance.close()
          that.delPayType(event.currentTarget.dataset.paytype)
        } else if (res.cancel) {
          instance.close()
        }
      }
    })
  },

  onEditPayment:function(event) { 
    if ('cell' == event.detail) {
      getApp().globalData.param = event.currentTarget.dataset.paytype
      wx.navigateTo({
        url: '../editPayment/editPayment?mode=' + getApp().MODE_EDIT,
      })
    }   
  },

  onCreatePayment:function() {
    wx.navigateTo({
      url: '../editPayment/editPayment',
    })
  },

  delPayType:function(payType) {
    let that = this
    wx.showLoading({
      title: '请稍候',
      mask: true
    })

    request.deleteRequest('/pay-types/' + payType.sid, null, true)
      .then(data => {
        wx.hideLoading()
        that.getPayTypes()      
      }).catch(e => {

      })
  },

  getPayTypes:function() {
    let that = this
    getPayTypeRequest.getPayTypes()
    .then(data => {
      that.setData({
        payTypes:data
      })
    })
  }
})
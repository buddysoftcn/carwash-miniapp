// pages/addOrder/addOrder.js
let util = require('../../utils/util.js')
let createOrderOperation = require('../../operation/createOrder.js')
let carWash = require('../../utils/carWash.js')
let currentWorkTime = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    time:'',
    plateNumber:'豫CHP517'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentWorkTime = getApp().globalData.param

    this.setData({
      date: util.formatDate(currentWorkTime.date),
      time:util.formatTime(currentWorkTime.time)
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

  bindPlateNumberInput:function(event) {
    let value = event.detail.value

    this.setData({
      plateNumber: value.toUpperCase()
    })
  },

  onAdd:function(event) {
    let plateNumber = event.detail.value.plateNumber
    if (0 == plateNumber.length
    ) {
      wx.showModal({
        title: '提示',
        content: '请输入完整的车牌号',
        showCancel:false
      })
    }else {
      wx.showLoading({
        title: '请稍候',
        mask:true        
      })

      let params = { 'type': 0, 'date': currentWorkTime.date, 'time': currentWorkTime.time,'plateNumber':plateNumber}
      createOrderOperation.createOrder(params)
      .then(data => {
        wx.hideLoading()
        getApp().notificationCenter.post(carWash.UPDATE_WORKTIMES_MESSAGE, null)
        currentWorkTime.plateNumber = plateNumber
        getApp().globalData.param = currentWorkTime
        wx.navigateTo({
          url: '../addOrderFinished/addOrderFinished',
        })
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      })
    }    
  }
})
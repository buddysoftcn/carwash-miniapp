// pages/orderUnFinishedList/orderUnFinishedList.js
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let originalOrders = []
let orders = [] // 分组后的订单数据
let currentOrder = null // 当前要处理的订单，比如 结账、取消预约、车主违约

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPaymentView:false,
    currentOrder:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    originalOrders = getApp().globalData.param    
    this.initOrderList(originalOrders)

    getApp().notificationCenter.register(carWash.UPDATE_WORKTIMES_MESSAGE, this, "refreshOrderList")
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
    getApp().notificationCenter.remove(carWash.UPDATE_WORKTIMES_MESSAGE, this)
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

  onCell:function(event) {
    currentOrder = event.currentTarget.dataset.order

    this.setData({
      showPaymentView:true,
      currentOrder:currentOrder
    })
  },

  onClose: function () {
    this.setData({     
      showPaymentView: false
    })
  },

  onPayment:function() {
    getApp().globalData.param = currentOrder

    this.setData({
      showPaymentView: false
    })
    wx.navigateTo({
      url: '../paymentOrder/paymentOrder?source=unFinishedList',
    })
  },

  /**
   * 洗车订单取消操作
   */
  onCancelOrder: function () {
    let that = this

    this.setData({
      showPaymentView: false
    })

    wx.showModal({
      title: '取消预约',
      content: '确定取消吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask:true
          })

          request.postRequest('/orders/cancel/' + currentOrder.sid, null, true)
            .then(data => {
              wx.hideLoading()
              that.refreshOrderList()
            }).catch(e => {
              wx.hideLoading()
              wx.showToast({
                title: e.msg,
                icon:'none'
              })
            })
        }
      }
    })

  },

  initOrderList: function (ordersParam) {
    let orderMap = new Map(),tmpOrders = []
    orders = []

    for (let index = 0, size = ordersParam.length; index < size; index++) {
      ordersParam[index].uiTime = ordersParam[index].time.substring(0, 5)
      
      if (orderMap.get(ordersParam[index].date)) {
        orders[index].worktordersmes.push(ordersParam[index])
      }else {
        tmpOrders = []
        tmpOrders.push(ordersParam[index])
        orders.push({ 'date': util.formatDate(ordersParam[index].date),'orders':tmpOrders})
        orderMap.set(ordersParam[index].date,tmpOrders)
      }
    }

    this.setData({
      orders:orders
    })
  },

  refreshOrderList:function() {
    let index = 0
    for (let size = originalOrders.length; index < size; index++) {
      if (currentOrder.sid == originalOrders[index].sid) {
        break
      }
    }

    originalOrders.splice(index,1)
    this.initOrderList(originalOrders)
  }

})
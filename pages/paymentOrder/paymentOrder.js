// pages/paymentOrder.js
let currentOrder = null
let util = require('../../utils/util.js')
let carWash = require('../../utils/carWash.js')
let payTypeModel = require('../../model/payType.js')
let request = require('../../operation/operation.js')
let autoBack = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber:'',
    datatime:'',
    showPopupView:false,
    payTypes: [],
    mode: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.source) {
      autoBack = true
    }
    currentOrder = getApp().globalData.param

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

  /**
   * 结账事件
   */
  onPayment:function(event) {
    let amount = event.detail.value.amount
    if (0 == amount.length) {
      wx.showModal({
        title: '提示',
        content: '请输入现金数额',
        showCancel:false
      })

      return
    }

    wx.showLoading({
      title: '请稍候',
      make:true
    })

    request.postRequest('/orders/finish/' + currentOrder.sid, { 'payTypeName': this.data.mode.name, 'amount': amount},true)
    .then(data => {
      currentOrder.payTypeName = this.data.mode.name
      currentOrder.amount = amount

      getApp().globalData.param = currentOrder
      getApp().notificationCenter.post(carWash.UPDATE_WORKTIMES_MESSAGE, null)

      wx.hideLoading()
      if (autoBack) {  // 从未处理订单来的，直接返回上级界面
        wx.navigateBack({
          delta: 1,
        })
      }else {
        wx.navigateTo({
          url: '../paymentOrderFinished/paymentOrderFinished',
        })
      }
      
    }).catch(e => {      
      wx.hideLoading()

      wx.showToast({
        title: e.msg,
        icon: 'none'
      })
    })
  },

  onShowPaymentView:function() {
    this.setData({
      showPopupView: true
    })
  },

  onShowEditRemark:function() {
    wx.navigateTo({
      url: '../editPaymentRemark/editPaymentRemark',
    })
  },

  checkboxChange:function(e) {    
    let payTypes = this.data.payTypes, values = e.detail.value,item = null
    
    for (var i = 0, lenI = payTypes.length; i < lenI; ++i) {
      payTypes[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (payTypes[i].value == values[j]) {          
          payTypes[i].checked = true;          
        }else {
          payTypes[i].checked = false;
        }
      }
    }
    
    for (let index = 0, size = payTypes.length; index < size; index++) {
      if (true == payTypes[index].checked) {
        item = payTypes[index]
      }
    }
    this.setData({
      mode: item,
      showPopupView:false,
      payTypes: payTypes
    });
  },

  onClose:function() {
    this.setData({
      showPopupView:false
    })
  },

  /**
   * 初始化视图界面
   */
  initView:function() {
    let datetime = util.formatDate(currentOrder.date) + ' ' + util.formatTime(currentOrder.time)
    this.setData({
      plateNumber:currentOrder.plateNumber,
      datetime: datetime
    })

    this.initPayTypeView()
  },

  initPayTypeView:function() {
    if ('clerk' == currentOrder.createdBy) {
      this.setData({
        payTypes: [{ 'name': '现金', 'value': '现金', 'checked': true}],        
      })   

      this.setData({        
        mode: this.data.payTypes[0]
      })             
    }
  }
})
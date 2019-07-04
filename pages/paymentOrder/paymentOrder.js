// pages/paymentOrder.js
let util = require('../../utils/util.js')
let carWash = require('../../utils/carWash.js')
let payTypeModel = require('../../model/payType.js')
let shopModel = require('../../model/shop.js')
let request = require('../../operation/operation.js')

let currentOrder = null
let autoBack = false

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plateNumber:'',
    datatime:'',
    showPopupView:false,
    payTypes: [], // 支付类型
    currentPayType: {},  // 当前支付类型
    member:null, // 会员卡信息,
    price:''  // 洗车金额
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

    request.postRequest('/orders/finish/' + currentOrder.sid, { 'payTypeName': this.data.currentPayType.value, 'amount': amount},true)
    .then(data => {
      currentOrder.payTypeName = this.data.currentPayType.name
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
      currentPayType: item,
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
    if ('clerk' == currentOrder.createdBy) {  // 店员创建的订单，只支持现金结账
      this.setData({
        payTypes: [{ 'name': '现金', 'value': '现金', 'checked': true}],        
      })   

      this.setData({        
        currentPayType: this.data.payTypes[0]
      })             
    }else {
      this.getPayInfo()
    }
  },

  /**
   * 初始化用户订单支付视图
   */
  initUserPayTypeView:function(payInfo) {
    console.log(payInfo)
    let payTypes = payTypeModel.getCurrentPayTypes(),tmpPayTypes = [],member = null
    for (let index = 0, size = payTypes.length; index < size; index++) {
      if ('会员卡' == payTypes[index].name && payInfo.member) {
        tmpPayTypes.push({ 'name': payTypes[index].name + ' (' + payInfo.member.serial + ')', 'value': payTypes[index].name, 'checked': false })
      }else {
        tmpPayTypes.push({ 'name': payTypes[index].name, 'value': payTypes[index].name, 'checked': false })
      }      
    }
    
    if (null != payInfo && null != payInfo.member) { // 如果用户存在会员卡，默认选择会员卡
      member = payInfo.member
    }else { // 如果不存在会员卡，将会员卡选项移除
      tmpPayTypes.splice(0,1)
    }

    tmpPayTypes[0].checked = true // 有会员卡时，会员卡会在第一个

    this.setData({
      payTypes: tmpPayTypes,
      currentPayType: tmpPayTypes[0],
      member: member
    }) 
  },

  /**
   * 初始化洗车价格
   */
  initPriceView:function(payInfo) {
    if (payInfo.carModel) {
      let shopSetting = shopModel.getShopInfo().shopSetting, price = ''
      if (shopSetting.specialDateBegin && shopSetting.specialDateEnd) {
        let today = util.today()

        if (shopSetting.specialDateBegin <= today && shopSetting.specialDateEnd >= today) {
          price = payInfo.carModel.specialPrice / 100  
        }
      }else {
        price = payInfo.carModel.normalPrice/100
      }

      this.setData({
        price:price
      })
    }
  },

  /**
   * 获取用户结账信息
   */
  getPayInfo:function() {
    let that = this
    wx.showLoading({
      title: '请稍候',
    })

    request.postRequest('/plates/pay-info', { 'number': currentOrder.plateNumber},true)
    .then(data => {         
      wx.hideLoading()
      that.initUserPayTypeView(data.object)
      that.initPriceView(data.object)
    }).catch(e => {   
      wx.hideLoading()   
      that.initUserPayTypeView(null)
    })
  }

})
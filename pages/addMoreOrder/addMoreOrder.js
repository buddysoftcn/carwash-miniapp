// pages/addMoreOrder/addMoreOrder.js
let util = require('../../utils/util.js')
let payTypeModel = require('../../model/payType.js')
let request = require('../../operation/operation.js')
let date = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopupView: false,
    payTypes: [],
    mode: {},

    dateUI:'',
    plateNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDate()
    this.initPayTypeView()
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

  bindPlateNumberInput: function (event) {
    let value = event.detail.value

    this.setData({
      plateNumber: value.toUpperCase()
    })
  },

  /**
   * 确认补录事件
   */
  onPayment: function (event) {
    let amount = event.detail.value.amount,plateNumber = event.detail.value.plateNumber
    let message = ''
    if (0 == plateNumber.length || 7 != plateNumber.length) {
      message = '请输入完整的车牌号'
    }else if (0 == amount.length) {
      message = '请输入洗车金额'
    }else if (null == this.data.mode) {
      message = '请选择付款方式'
    }

    if ('' != message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel:false
      })

      return
    }else {
      wx.showLoading({
        title: '请稍候',
        mask:true
      })

      request.postRequest('/orders/record',{'date':date,'plateNumber':plateNumber,'payTypeName':this.data.mode.value,'amount':amount},true)
      .then(data => {
        wx.hideLoading()
        getApp().globalData.param = data.object
        wx.navigateTo({
          url: '../addMoreOrderFinished/addMoreOrderFinished',
        })
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
          icon:'none'
        })
      })
    }
    
  },
  onShowPaymentView: function () {
    this.setData({
      showPopupView: true
    })
  },
  onShowEditRemark: function () {
    wx.navigateTo({
      url: '../editPaymentRemark/editPaymentRemark',
    })
  },
  checkboxChange: function (e) {
    let payTypes = this.data.payTypes, values = e.detail.value, item = null

    for (let i = 0, lenI = payTypes.length; i < lenI; ++i) {
      payTypes[i].checked = false;

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (payTypes[i].value == values[j]) {
          payTypes[i].checked = true;
        } else {
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
      showPopupView: false,
      payTypes: payTypes
    });
  },
  onClose: function () {
    this.setData({
      showPopupView: false
    })
  },

  initDate:function() {
    date = util.today()

    this.setData({
      dateUI:util.formatDate(date)
    })
  },

  initPayTypeView: function () {
    this.setData({
      payTypes: [{ 'name': '现金', 'value': '现金', 'checked': true }],
    })

    this.setData({
      mode: this.data.payTypes[0]
    })    
  }
})
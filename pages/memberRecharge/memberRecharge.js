// pages/memberRecharge/memberRecharge.js
let rechargeTypeModel = require('../../model/rechargeType.js')
let createOrderOperation = require('../../operation/createOrder.js')
let carWash = require('../../utils/carWash.js')

let user = null
let currentRechargeType = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeTypes: []    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user = getApp().globalData.param
    this.initRechargeTypeList()
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
   * 确认充值事件
   */
  onSave:function() {
    if (null == currentRechargeType) {
      wx.showToast({
        title: '请选择充值类型',
        icon:'none'
      })
    }else {
      // 会员充值
      wx.showLoading({
        title: '请稍候',
      })
      createOrderOperation.createOrder({'type':1,'userSid':user.sid,'rechargeTypeSid':currentRechargeType.value})
      .then(data => {
        wx.hideLoading()      
        getApp().notificationCenter.post(carWash.UPDATE_MEMBER_INFO, {})
        wx.navigateBack({
          delta: 1,
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

  /**
   * 单选变化事件
   */
  checkboxChange:function(e) {
    let rechargeTypes = this.data.rechargeTypes, values = e.detail.value, item = null

    for (var i = 0, lenI = rechargeTypes.length; i < lenI; ++i) {
      rechargeTypes[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (rechargeTypes[i].value == values[j]) {
          rechargeTypes[i].checked = true;
        } else {
          rechargeTypes[i].checked = false;
        }
      }
    }

    for (let index = 0, size = rechargeTypes.length; index < size; index++) {
      if (true == rechargeTypes[index].checked) {
        item = rechargeTypes[index]
      }
    }

    if (null != item) {
      currentRechargeType = item
    }else {
      currentRechargeType = null
    }    

    this.setData({ 
      rechargeTypes: rechargeTypes
    });
  },

  /**
   * 初始化类型列表
   */
  initRechargeTypeList:function() {
    let rechargeTypes = rechargeTypeModel.getCurrentRechargeTypes()
    let result = [], checked = true
    for (let index = 0, size = rechargeTypes.length; index < size; index++) {
      if (0 == index) { 
        checked = true
      }else {
        checked = false
      }
      result.push({ 'name': '充值 ' + rechargeTypes[index].payAmount/100 + ' 元，实际到账 ' + rechargeTypes[index].rechargeAmount/100 + ' 元', 'value': rechargeTypes[index].sid , 'checked': checked})
    }

    this.setData({
      rechargeTypes:result
    })

    // 设置当前选择的充值类型
    if (0 < result.length) {
      currentRechargeType = result[0]
    }
  }
})
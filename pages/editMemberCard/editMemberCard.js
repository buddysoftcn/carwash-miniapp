// pages/editMemberCard/editMemberCard.js
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let mode = 'create'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rechargeType:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.mode) {
      mode = 'edit'
      wx.setNavigationBarTitle({title:'编辑充值额度'})

      this.setData({
        rechargeType: getApp().globalData.param
      })
    }
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

  onSave:function(event) {
    let payAmount = event.detail.value.payAmount
    let rechargeAmount = event.detail.value.rechargeAmount
    let message = ''
    if (0 == payAmount.length) {
      message = '请输入充值额度'
    }else if (0 == rechargeAmount.length) {
      message = '请输入实际到账额度'
    }

    if ('' != message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel:false
      })
    }else {
      if ('create' == mode) {
        this.create(payAmount, rechargeAmount)
      }else {
        this.edit(payAmount, rechargeAmount)      
      }
    }

  },

  create: function (payAmount, rechargeAmount) {
    let that = this

    request.postRequest('/recharge-types', { 'payAmount': payAmount * 100, 'rechargeAmount': rechargeAmount * 100},true)
    .then(data => {
      that.back('添加成功')  
    }).catch(e => {

    })
  },

  edit: function (payAmount, rechargeAmount) {
    let that = this

    request.putRequest('/recharge-types/' + this.data.rechargeType.sid, { 'payAmount': payAmount * 100, 'rechargeAmount': rechargeAmount * 100 }, true)
      .then(data => {
        that.back('修改成功')
      }).catch(e => {

      })
  },

  back: function (title) {    
    getApp().notificationCenter.post(carWash.UPDATE_RECHARGE_TYPE_MESSAGE, null)

    wx.showToast({
      title: title,
    })

    wx.navigateBack({
      delta: 1,
    })
  }

})
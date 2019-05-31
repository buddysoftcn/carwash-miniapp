// pages/settingMemberCard/settingMemberCard.js
let shopModel = require('../../model/shop.js')
let request = require('../../operation/operation.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carCount:['1','2'],   // 会员卡允许绑定的车辆数量
    carCountIndex:0,

    validityMonths: [{ 'text': '半年', 'value': '6' }, { 'text': '1年', 'value': '12' }, { 'text': '2年', 'value': '24' }],
    validityMonthIndex:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initShopInfo()
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
    shop = null
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

  bindCarCountChange:function(event) {    
    let that = this

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'bindingPlates':parseInt(event.detail.value) + 1},true)
    .then(data => {
      that.setData({
        carCountIndex: event.detail.value
      })
      shop.shopSetting.bindingPlates = parseInt(event.detail.value) + 1
      shopModel.setShopInfo(shop)
      wx.showToast({
        title: '设置成功',
      })
    }).catch(e => {

    })
  },

  bindValidityMonthsChange:function(event) {
    let month = this.data.validityMonths[event.detail.value]
    let that = this

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'validityMonths': month.value }, true)
      .then(data => {
        that.setData({
          validityMonthIndex: event.detail.value
        })
        shop.shopSetting.validityMonths = month.value
        shopModel.setShopInfo(shop)
        wx.showToast({
          title: '设置成功',
        })
      }).catch(e => {

      })
  },

  initShopInfo:function() {
    shop = shopModel.getShopInfo()
    if (shop) {
      this.setData({
        carCountIndex:shop.shopSetting.bindingPlates - 1
      })

      if (shop.shopSetting.validityMonths) {
        let index = 0
        for (index = 0; index < this.data.validityMonths.length; index++) {
          if (shop.shopSetting.validityMonths == this.data.validityMonths[index].value) {
            break
          }
        }

        this.setData({
          validityMonthIndex: index
        })
      }
    }
  },

  onEditMemberCard:function() {
    wx.navigateTo({
      url: '../editMemberCard/editMemberCard',
    })
  }
})
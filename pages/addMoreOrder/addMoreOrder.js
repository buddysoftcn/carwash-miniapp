// pages/addMoreOrder/addMoreOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopupView: false,
    checkboxItems: [
      { name: '会员卡 （33061089）', value: '会员卡', checked: true },
      { name: '现金', value: '现金' },
      { name: '建行信用卡', value: '建行信用卡' }
    ],
    mode: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      mode: this.data.checkboxItems[0]
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onPayment: function () {
    wx.navigateTo({
      url: '../addMoreOrderFinished/addMoreOrderFinished',
    })
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
    var checkboxItems = this.data.checkboxItems, values = e.detail.value, item = null

    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
        } else {
          checkboxItems[i].checked = false;
        }
      }
    }

    for (let index = 0, size = checkboxItems.length; index < size; index++) {
      if (true == checkboxItems[index].checked) {
        item = checkboxItems[index]
      }
    }
    this.setData({
      mode: item,
      showPopupView: false,
      checkboxItems: checkboxItems
    });
  },
  onClose: function () {
    this.setData({
      showPopupView: false
    })
  }
})
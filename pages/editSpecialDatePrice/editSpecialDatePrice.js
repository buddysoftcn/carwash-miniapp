// pages/editSpecialDatePrice/editSpecialDatePrice.js
let request = require('../../operation/operation.js')
let getShopInfoRequest = require('../../operation/getShopInfo.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carModel:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.param)
    this.setData({
      carModel: getApp().globalData.param
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

  onSave:function(event) {
    let price = event.detail.value.price
    if (0 == price.length) {
      wx.showModal({
        title: '提示',
        content: '请输入价格',
        showCancel:false
      })

      return
    }else {
      
      request.putRequest('/car-models/' + this.data.carModel.sid,{'specialPrice':price * 100},true)
      .then(data => {
        getShopInfoRequest.getShopInfo()
        .then (data => {
          getApp().notificationCenter.post(carWash.UPDATE_SHOP_MESSAGE, null)
          wx.navigateBack({

          })
        })
        
      }).then(e => {

      })
    }
  }
  
})
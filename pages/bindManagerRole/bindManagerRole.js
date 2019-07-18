// pages/bindManagerRole/bindManagerRole.js
let request = require('../../operation/operation.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  onClickLogin: function (event) {
    
    let password = event.detail.value.password.trim()
    if (0 == password.length) {
      wx.showModal({
        title: '提示',
        content: '请输入店铺密码',
        showCancel: false
      })
    }else {
      wx.showLoading({
        title: '请稍候',
        mask: true
      })

      request.postRequest('/user/bind-owner', {'password':password}, true)
        .then(data => {
          wx.hideLoading()

          if (request.SUCCESSED == data.status) {
            wx.navigateTo({
              url: '../authManagerSuccessed/authManagerSuccessed'
            })
          }
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
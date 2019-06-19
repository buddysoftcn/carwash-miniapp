// pages/inviteEmploye/inviteEmploye.js
let userModel = require('../../model/user.js')
let shopModel = require('../../model/shop.js')
let request = require('../../operation/operation.js')

let clerk = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName:'',
    avatar:'',
    shopName:'',

    showShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = userModel.getCurrentUser()
    let shopInfo = shopModel.getShopInfo()
    
    this.setData({
      nickName:userInfo.user.nickName,
      avatar:userInfo.user.avatarUrl,
      shopName:shopInfo.shop.name
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

  onCreate:function() {
    let that = this

    request.postRequest('/clerks', {}, true)
      .then(data => {
        clerk = data.object

        that.setData({
          showShare:true
        })
      })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    this.setData({
      showShare: false
    })
    console.log('/pages/authEmploye/authEmploye?sid=' + clerk.sid + '&nickname=' + this.data.nickName + '&shopname=' + this.data.shopName + '&avatar=' + this.data.avatar)
    return {
      title:'店员邀请',
      path: '/pages/authEmploye/authEmploye?sid=' + clerk.sid + '&nickname=' + this.data.nickName + '&shopname=' + this.data.shopName + '&avatar=' + this.data.avatar
    }
  }

})
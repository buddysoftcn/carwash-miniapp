// pages/userList/userList.js
let request = require('../../operation/operation.js')
let util = require('../../utils/util.js')

let currentUser = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // inputShowed: false,
    // inputVal: "",
    show:false,
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUsers()
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

 
  onClickUser:function(event) {
    this.setData({
      show:true
    })

    currentUser = event.currentTarget.dataset.user
  },

  onClickCancel:function() {
    this.setData({
      show:false
    })

    currentUser = null
  },

  /**
   * 恢复用户信用
   */
  onClickRecover: function () {
    let that = this

    this.setData({
      show: false
    })

    wx.showLoading({
      title: '请稍候',
    })

    request.postRequest('/user/recover', { 'userSid': currentUser.userSid},true)
    .then(data => {
      wx.hideLoading()
      that.getUsers()
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
        icon:'none'
      })
    })
  },

  /**
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  */

  getUsers:function() {
    let that = this
    wx.showLoading({
      title: '请稍候',
    })

    request.getRequest('/user/banned-user-index',null,true) 
    .then(data => {
      wx.hideLoading()
      that.renderList(data.items)
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
        icon:'none'
      })
    })
  },

  renderList:function(users) {
    for (let index = 0, size = users.length; index < size; index++) {
      users[index].banDateEnd = util.addDays(users[index].banDate, users[index].banDays)
      users[index].banDateEnd = util.formatDate(users[index].banDateEnd)
    }

    this.setData({
      users:users
    })
  }
})
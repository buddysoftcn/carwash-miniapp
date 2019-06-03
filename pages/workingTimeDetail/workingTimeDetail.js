// pages/workingTimeDetail/workingTimeDetail.js
let shopModel = require('../../model/shop.js')
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: 'create',
    workTimeBegin:'',
    workTimeEnd:'',
    workTimeBeginNew:'',
    workTimeEndNew:'',
    workTimeEnableDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()

    getApp().notificationCenter.register(carWash.UPDATE_SHOP_MESSAGE, this, "initView")
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
    getApp().notificationCenter.remove(carWash.UPDATE_SHOP_MESSAGE, this)
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

  onEditTime:function () {
    wx.navigateTo({
      url: '../editWorkingTime/editWorkingTime'      
    })
  },

  onDel:function() {
    let that = this

    wx.showModal({
      title: '删除',
      content: '删除后，您可以再设置工作时间，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'workTimeBeginNew': '','workTimeEndNew':'' }, true)
            .then(data => {
              shop.shopSetting.workTimeBeginNew = null
              shop.shopSetting.workTimeBeginEnd = null
              shopModel.setShopInfo(shop)
              that.initView()
              wx.showToast({
                title: '删除成功',
              })
            }).catch(e => {

            })
        } else if (res.cancel) {
        }
      }
    })
  },

  initView:function() {
    shop = shopModel.getShopInfo()

    let mode = 'create', workTimeBegin = '', workTimeEnd = '', workTimeBeginNew = '', workTimeEndNew = '', workTimeEnableDate = ''
    if (shop.shopSetting.workTimeBeginNew) {
      mode = 'edit'
      workTimeBeginNew = shop.shopSetting.workTimeBeginNew
      workTimeEndNew = shop.shopSetting.workTimeEndNew
      workTimeEnableDate = shop.shopSetting.workTimeEnableDate
    }
      
    workTimeBegin = shop.shopSetting.workTimeBegin
    workTimeEnd = shop.shopSetting.workTimeEnd

    this.setData({
      mode:mode,
      workTimeBegin:util.formatTime(workTimeBegin),
      workTimeEnd: util.formatTime(workTimeEnd),
      workTimeBeginNew:workTimeBeginNew,
      workTimeEndNew:workTimeEndNew,
      workTimeEnableDate:workTimeEnableDate
    })
  }

})
// pages/lunchTimeDetail/lunchTimeDetail.js
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
    lunchTimeBegin: '',
    lunchTimeEnd: '',
    lunchTimeBeginNew: '',
    lunchTimeEndNew: '',
    lunchTimeEnableDate: ''
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

  onEditTime:function() {
    wx.navigateTo({
      url: '../editLunchTime/editLunchTime'
    })
  },

  onDel: function () {
    let that = this

    wx.showModal({
      title: '删除',
      content: '删除后，您可以再设置午休时间，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'lunchTimeBeginNew': '', 'lunchTimeEndNew': '' }, true)
            .then(data => {
              shop.shopSetting.lunchTimeBeginNew = null
              shop.shopSetting.lunchTimeEndNew = null
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

  initView: function () {
    shop = shopModel.getShopInfo()

    let mode = 'create', lunchTimeBegin = '', lunchTimeEnd = '', lunchTimeBeginNew = '', lunchTimeEndNew = '', lunchTimeEnableDate = ''
    if (shop.shopSetting.lunchTimeBeginNew) {
      mode = 'edit'
      lunchTimeBeginNew = shop.shopSetting.lunchTimeBeginNew
      lunchTimeEndNew = shop.shopSetting.lunchTimeEndNew
      lunchTimeEnableDate = shop.shopSetting.lunchTimeEnableDate
    }

    lunchTimeBegin = shop.shopSetting.lunchTimeBegin
    lunchTimeEnd = shop.shopSetting.lunchTimeEnd

    this.setData({
      mode: mode,
      lunchTimeBegin: util.formatTime(lunchTimeBegin),
      lunchTimeEnd: util.formatTime(lunchTimeEnd),
      lunchTimeBeginNew: lunchTimeBeginNew,
      lunchTimeEndNew: lunchTimeEndNew,
      lunchTimeEnableDate: lunchTimeEnableDate
    })
  }
})
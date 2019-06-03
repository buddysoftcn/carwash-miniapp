// pages/editWorkingEfficiency/editWorkingEfficiency.js
let shopModel = require('../../model/shop.js')
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    times: [{ 'text': '10分钟/辆', 'value': '10' }, { 'text': '15分钟/辆', 'value': '15' }, { 'text': '20分钟/辆', 'value': '20' }, { 'text': '25分钟/辆', 'value': '25' }, { 'text': '30分钟/辆', 'value': '30' },
      { 'text': '35分钟/辆', 'value': '35' }, { 'text': '40分钟/辆', 'value': '40' }, { 'text': '45分钟/辆', 'value': '45' }, { 'text': '50分钟/辆', 'value': '50' }, { 'text': '55分钟/辆', 'value': '55' },
      { 'text': '60分钟/辆', 'value': '60' },],
    index:3,
    mode:'create',
    washMinutes:'',
    washMinutesNew:'',
    washMinutesEnableDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()
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

  bindMinutesChange:function(event) {
    console.log(event)
    let that = this
    let washMinutesNew = this.data.times[event.detail.value].value
    
    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'washMinutesNew': washMinutesNew }, true)
      .then(data => {
        console.log(data)
        shop.shopSetting.washMinutesNew = washMinutesNew
        shop.shopSetting.washMinutesEnableDate = data.object.washMinutesEnableDate
        shopModel.setShopInfo(shop)
        that.initView()    
        wx.showToast({
          title: '设置成功',
        })          
      }).catch(e => {

      })
  },

  onDel:function() {
    let that = this

    wx.showModal({
      title: '删除',
      content: '删除后，您可以再设置洗车效率，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'washMinutesNew': '' }, true)
            .then(data => {              
              shop.shopSetting.washMinutesNew = null
              shop.shopSetting.washMinutesEnableDate = null
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
    
    let mode = 'create', washMinutes, washMinutesNew, washMinutesEnableDate, timeIndex = 0,size = 0

    if (shop.shopSetting.washMinutesNew) {
      mode = 'del' 
      washMinutesNew = shop.shopSetting.washMinutesNew 
      washMinutesEnableDate = shop.shopSetting.washMinutesEnableDate
    }else {    
      washMinutesNew = ''
      washMinutesEnableDate = ''
    }
    washMinutes = shop.shopSetting.washMinutes

    for (timeIndex = 0, size = this.data.times.length; timeIndex < size; timeIndex++) {
      if (this.data.times[timeIndex].value == washMinutes) {
        break
      }
    }
    console.log(mode)
    console.log(shop)
    this.setData({
      mode: mode,
      index: timeIndex,
      washMinutes: washMinutes,
      washMinutesNew: washMinutesNew,
      washMinutesEnableDate: washMinutesEnableDate
    })
  }

})
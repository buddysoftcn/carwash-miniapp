// pages/editHoliday/editHoliday.js
let shopModel = require('../../model/shop.js')
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    afterTomorrowUI:'',
    afterTomorrow:'',
    restBegin:'',
    restEnd:'',
    mode:''
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

  onSave:function () {
    if (this.data.restEnd < this.data.restBegin) {
      wx.showModal({
        title: '提示',
        content: '【开始日期】不能大于【结束日期】',
        showCancel:false
      })

      return
    }

    request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'restBegin': this.data.restBegin,'restEnd':this.data.restEnd }, true)
      .then(data => {        
        shop.shopSetting.restBegin = this.data.restBegin
        shop.shopSetting.restEnd = this.data.restEnd
        shopModel.setShopInfo(shop)
        wx.showToast({
          title: '设置成功',
        })

        wx.navigateBack({
          delta: 1,
        })
      }).catch(e => {

      })
    
  },

  onDel:function() {
    wx.showModal({
      title: '删除',
      content: '删除后，您可以创建新的放假日期，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          request.putRequest('/shop-settings/' + shop.shopSetting.sid, { 'restBegin': '', 'restEnd': '' }, true)
            .then(data => {
              shop.shopSetting.restBegin = null
              shop.shopSetting.restEnd = null
              shopModel.setShopInfo(shop)
              wx.showToast({
                title: '删除成功',
              })

              wx.navigateBack({
                delta: 1,
              })
            }).catch(e => {

            })
        } else if (res.cancel) {
        }
      }
    })
  },

  bindRestBeginDateChange:function(event) {    
    this.setData({
      restBegin:event.detail.value
    })
  },

  bindRestEndDateChange:function(event) {
    this.setData({
      restEnd: event.detail.value
    })
  },

  initView:function() {
    shop = shopModel.getShopInfo()

    let afterTomorrow = util.afterTomorrow(),mode = 'create',restBegin,restEnd
    if (shop && shop.shopSetting.restBegin && '' != shop.shopSetting.restBegin) {
      mode = 'edit'

      restBegin = shop.shopSetting.restBegin
      restEnd = shop.shopSetting.restEnd
    }else {
      restBegin = afterTomorrow
      restEnd = afterTomorrow
    }

    this.setData({
      mode:mode,
      afterTomorrowUI: util.formatDate(afterTomorrow),
      afterTomorrow: afterTomorrow,
      restBegin: restBegin,
      restEnd: restEnd
    })
  }

})
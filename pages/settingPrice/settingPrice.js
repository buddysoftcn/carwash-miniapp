// pages/settingPrice/settingPrice.js
let carWash = require('../../utils/carWash.js')
let request = require('../../operation/operation.js')
let carModel = require('../../model/carModel.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carModels:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarModels()

    getApp().notificationCenter.register(carWash.UPDATE_CAR_MODEL_MESSAGE, this, "getCarModels");
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
    getApp().notificationCenter.remove(carWash.UPDATE_CAR_MODEL_MESSAGE, this)
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

  onCreateCar:function() {
    wx.navigateTo({
      url: '../editPrice/editPrice',
    })
  },

  onEditCar:function(event) {
    if ('cell' == event.detail) {
      getApp().globalData.param = event.currentTarget.dataset.carmodel
      wx.navigateTo({
        url: '../editPrice/editPrice?mode=' + getApp().MODE_EDIT,
      })
    }   
  },

  onDel: function (event) {
    let that = this
    const { position, instance } = event.detail;

    wx.showModal({
      title: '提示',
      content: '删除后，将无法找回，确定要删除吗？',
      success(res) {
        if (res.confirm) {
          instance.close()
          that.delCarModel(event.currentTarget.dataset.carmodel)
        } else if (res.cancel) {
          instance.close()
        }
      }
    })
  },

  getCarModels: function () {
    let that = this
    request.getRequest('/car-models', null, true)
      .then(data => {
        carModel.setCurrentCarModels(data.items)
        that.setData({
          carModels: data.items
        })
      }).catch(e => {

      })
  },

  delCarModel: function (carModel) {
    let that = this
    wx.showLoading({
      title: '请稍候',
      mask: true
    })

    request.deleteRequest('/car-models/' + carModel.sid, null, true)
      .then(data => {
        wx.hideLoading()
        that.getCarModels()
      }).catch(e => {

      })
  }
})
// pages/addConsume/addConsume.js
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let datetime = ''
let user = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopupView:false,
    plates:null,
    currentPlate:null,
    uiDatetime:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user = getApp().globalData.param
    this.initDatetimeView()
    this.getUserPlates()
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

  onShowPlateView:function() {
    this.setData({
      showPopupView:true
    })
  },

  onClose: function () {
    this.setData({
      showPopupView: false
    })
  },

  onAdd:function(event) {    
    let message = null,amount = event.detail.value.amount,desc = event.detail.value.desc
    if (null == this.data.currentPlate) {
      message = '请选择车牌号码'
    }else if (0 == amount.length) {
      message = '请输入消费金额'
    }

    if (null != message) {
      wx.showModal({
        title: '提示',
        content: message,
        showCancel:false
      })
    }else {
      wx.showLoading({
        title: '请稍候',
      })

      request.postRequest('/orders/record', { 'type': 2, 'plateNumber': this.data.currentPlate.number, 'payTypeName': '现金', 'date': datetime.substring(0, 10), 'time': datetime.substring(11),'amount':amount * 100,'desc':desc},true)
      .then(data => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '添加成功',
          showCancel:false,

          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                
              })
            } else if (res.cancel) {              
            }
          }
        })
      }).catch(e => {
        wx.hideLoading()
        wx.showToast({
          title: e.msg,
        })
      })
    }
  },

  /**
   * 单选变化事件
   */
  checkboxChange: function (e) {
    let plates = this.data.plates, values = e.detail.value, item = null    

    for (var i = 0, lenI = plates.length; i < lenI; ++i) {
      plates[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (plates[i].sid == values[j]) {
          plates[i].checked = true;
        } else {
          plates[i].checked = false;
        }
      }
    }

    for (let index = 0, size = plates.length; index < size; index++) {
      if (true == plates[index].checked) {
        item = plates[index]
      }
    }

    this.setData({
      showPopupView:false,
      currentPlate:item,
      plates: plates
    });
  },


  getUserPlates:function() {
    let that = this
    wx.showLoading({
      title: '请稍候',
    })
    request.getRequest('/plates?userSid=' + user.sid,null,true)
    .then(data => {
      wx.hideLoading()

      for (let index = 0, size = data.items.length; index < size; index++) {
        if (0 == index) {
          data.items[index].checked = true
        }else {
          data.items[index].checked = false
        }
      }

      that.setData({
        plates:data.items
      })

      if (0 < data.items.length) {
        this.setData({
          currentPlate: data.items[0]
        })
      }
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({
        title: e.msg,
        icon:'none'
      })      
    })
  },

  initDatetimeView:function() {
    let now = new Date(),uiDatetime = ''
    datetime = util.formatDateTime(now)
    uiDatetime = util.formatDate(datetime.substring(0,10)) + ' ' + util.formatTime(datetime.substring(11))

    this.setData({
      uiDatetime: uiDatetime
    })

  }

})
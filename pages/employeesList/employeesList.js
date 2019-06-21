// pages/employeesList/employeesList.js
let util = require('../../utils/util.js')
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clerks:[],
    waitingClerks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  
    getApp().notificationCenter.register(carWash.UPDATE_CLERKS_MESSAGE, this, "getEmployees");

    this.getEmployees()
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
    getApp().notificationCenter.remove(carWash.UPDATE_CLERKS_MESSAGE, this)
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

 
  onEditEmploye: function (event) {
    console.log(event)
    if ("click" == event.type && 'cell' == event.detail) {
      getApp().globalData.param = event.currentTarget.dataset.clerk
      
      wx.navigateTo({
        url: '../editEmploye/editEmploye',
      })
    }    
  },

  onInviteEmploye:function() {
    wx.navigateTo({
      url: '../inviteEmploye/inviteEmploye'      
    })
  },

  onClose:function(event) {
    const { instance } = event.detail;

    wx.showModal({
      title: '删除店员',
      content: '删除后店员将无法使用，确定要删除吗？',
      success(res) {
        if (res.confirm) {          
          instance.close()
        } else if (res.cancel) {          
          instance.close()
        }
      }
    })
  },

  getEmployees:function() {
    let that = this

    request.getRequest('/clerks', {}, true)
      .then(data => {
        that.filterData(data.items)        
      })
  },

  filterData:function(data) {
    let clerks = [],waitingClerks = [],now = new Date()
    for (let index = 0,size = data.length; index < size; index++) {
      if (0 == data[index].state) {
        data[index].createdAtUI = data[index].createdAt.substring(0,16)
        
        if (parseInt(now - util.makeDate(data[index].createdAt))/1000/60 > 30) {
          data[index].waiting = '链接失效'
        }else {
          data[index].waiting = '等待回应'
        }
        
        waitingClerks.push(data[index])
      }else {
        clerks.push(data[index])
      }
    }

    this.setData({
      clerks:clerks,
      waitingClerks: waitingClerks
    })
  }
})
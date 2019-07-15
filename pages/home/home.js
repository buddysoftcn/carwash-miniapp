// pages/home/home.js
let util = require('../../utils/util.js')
let shopModel = require('../../model/shop.js')
let userModel = require('../../model/user.js')
let request = require('../../operation/operation.js')
let carWash = require('../../utils/carWash.js')

let worktimesMap = null // 所有工作时间放入字典中
let worktimes = null    // 按小时将工作时间进行分组  
let currentWorkTime = null // 当前要处理的工作时间
let currentDate = null
let unFinishedOrders = null // 未完成订单
let shop = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',  // 时间导航日期
    week:'',  // 时间导航星期
    holiday:'', //时间导航放假提示
    showHelpOrderView:false,
    showUnFinishedOrderView:false,
    showPaymentView:false,
    showWYBtn:true, // 显示违约按钮
    showCancelBtn:true, // 显示取消预约按钮
    popViewMessage:'',  // 弹出视图动态显示的信息
    
    worktimes:[],
    worktimesCreatedCount:0,
    worktimesFinishedCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if(true == this.openIndexPage()) {
      return
    }
  
    wx.setNavigationBarTitle({
      title: getApp().buddysoft.name
    })

    shop = shopModel.getShopInfo()
    currentDate = util.today()
    this.initDate(currentDate)
    this.initWorktimeList()
    this.getUnFinishedOrders()
    getApp().notificationCenter.register(carWash.UPDATE_WORKTIMES_MESSAGE, this, "initWorktimeList")
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
    getApp().notificationCenter.remove(carWash.UPDATE_WORKTIMES_MESSAGE, this)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initWorktimeList()
    this.getUnFinishedOrders()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onCell:function(event) {    
    currentWorkTime = event.currentTarget.dataset.worktime

    if (null == currentWorkTime.order) {  // 显示帮助预约视图
      this.setData({
        popViewMessage: currentWorkTime.time,
        showHelpOrderView: true
      })
    }else {
      if ('finished' == currentWorkTime.order.state || 'discredit' == currentWorkTime.order.state) {  // 显示订单完成界面
        getApp().globalData.param = currentWorkTime.order
        
        wx.navigateTo({
          url: '../cancelPaymentOrder/cancelPaymentOrder',
        })
      }else {
        let showWYBtn = true,showCancelBtn = true
        if ('clerk' == currentWorkTime.order.createdBy) { // 店员自己创建的订单，不显示违约操作入口
          showWYBtn = false
        }else if ('client' == currentWorkTime.order.createdBy) {
          showCancelBtn = false
        }
        this.setData({  // 显示洗车结账、取消预约、车主违约视图
          popViewMessage: currentWorkTime.order.plateNumber,
          showPaymentView: true,
          showWYBtn: showWYBtn,
          showCancelBtn: showCancelBtn
        })
      }
      
    }
    
  },

  /**
   * 洗车结账
   */
  onPayment:function() {    
    getApp().globalData.param = currentWorkTime.order

    this.setData({
      showPaymentView:false
    })
    wx.navigateTo({
      url: '../paymentOrder/paymentOrder',
    })
  },

  /**
   * 帮助预约
   */
  onOrder: function () {
    getApp().globalData.param = currentWorkTime

    this.setData({
      showHelpOrderView: false
    })

    wx.navigateTo({
      url: '../addOrder/addOrder',
    })
  },

  /**
   * 洗车补录
   */
  onAddMoreOrder:function() {
    wx.navigateTo({
      url: '../addMoreOrder/addMoreOrder',
    })
  },

  /**
   * 洗车订单取消操作
   */
  onCancelOrder:function() {
    let that = this

    this.setData({
      showPaymentView:false
    })

    wx.showModal({
      title: '取消预约',
      content: '取消后，车主可以预约此时刻，确定取消吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask:true
          })

          request.postRequest('/orders/cancel/' + currentWorkTime.order.sid,null,true)
          .then(data => {
            wx.hideLoading()
            that.initWorktimeList()
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
  },

  onDiscreditOrder:function() {
    let that = this

    this.setData({
      showPaymentView: false
    })

    wx.showModal({
      title: '车主违约',
      content: '违约操作将影响车主信誉值，确定车主违约吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候',
            mask: true
          })

          request.postRequest('/orders/discredit/' + currentWorkTime.order.sid, null, true)
            .then(data => {
              wx.hideLoading()
              that.initWorktimeList()
            }).catch(e => {
              wx.hideLoading()
              wx.showToast({
                title: e.msg,
                icon: 'none'
              })
            })
        }
      }
    })
  },

  onOrderLater: function () {
    this.setData({
      showHelpOrderView: false
    })
  },
  /**
   * 显示未完成订单处理界面
   */
  onUnOrder:function() {
    this.setData({
      showUnFinishedOrderView: false
    })

    getApp().globalData.param = unFinishedOrders
    wx.navigateTo({
      url: '../orderUnFinishedList/orderUnFinishedList',
    })
  },

  /**
   * 未完成订单暂不处理
   */
  onUnOrderLater:function() {
    this.setData({
      showUnFinishedOrderView:false
    })
  },

  onClose:function() {
    this.setData({
      showHelpOrderView: false,
      showUnFinishedOrderView: false,
      showPaymentView: false
    })
  },

  /**
   * 日期向前事件
   */
  onForwardDay:function() {
    currentDate = util.subtractOneDay(currentDate)    
    this.initDate(currentDate)
    this.initWorktimeList()
  },

  onNextDay:function() {
    currentDate = util.addOneDay(currentDate)
    this.initDate(currentDate)
    this.initWorktimeList()
  },

  initDate:function(date) {
    let holiday = ''
    if (null != shop.shopSetting.restBegin && shop.shopSetting.restEnd && (shop.shopSetting.restBegin <= currentDate && shop.shopSetting.restEnd >= currentDate)) {
      holiday = '（今日休息）'
    }

    this.setData({
      date:util.formatDate(date),
      week:util.week(date),
      holiday: holiday
    })
  },

  initWorktimeList:function() {
    this.initWorktimesMap()
    this.initWorktimes()    
    this.getOrders()    
  },

  initWorktimesMap:function() {    
    console.log(shop)    

    if (shop) {      
      worktimesMap = new Map()

      let workTimeBegin = util.makeDate(currentDate + ' ' + shop.shopSetting.workTimeBegin)
      const workTimeEnd = util.makeDate(currentDate + ' ' + shop.shopSetting.workTimeEnd)
      const washMinutes = shop.shopSetting.washMinutes      
      const lunchTimeBegin = util.makeDate(currentDate + ' ' + shop.shopSetting.lunchTimeBegin)
      const lunchTimeEnd = util.makeDate(currentDate + ' ' + shop.shopSetting.lunchTimeEnd)
      let worktime = null

      // 计算上午工作时间
      while (workTimeBegin < lunchTimeBegin && parseInt(lunchTimeBegin - workTimeBegin)/1000/60 >= washMinutes) { 
        worktime = this.initWorktime(workTimeBegin)
        worktimesMap.set(worktime.datetime,worktime)                          
        workTimeBegin = this.makeNextWorktime(workTimeBegin, washMinutes)             
      }

      workTimeBegin = lunchTimeEnd 

      //计算下午工作时间
      while (workTimeBegin < workTimeEnd && parseInt(workTimeEnd - workTimeBegin)/1000/60 >= washMinutes) {
        worktime = this.initWorktime(workTimeBegin)
        worktimesMap.set(worktime.datetime, worktime) 
        workTimeBegin = this.makeNextWorktime(workTimeBegin, washMinutes)        
      }      
    }
  },

  initWorktime:function(datetime) {
    let worktime = {}
    worktime.datetime = util.formatDateTime(datetime)
    worktime.hour = datetime.getHours()
    worktime.date = [datetime.getFullYear(), datetime.getMonth() + 1, datetime.getDate()].map(util.formatNumber).join('-')
    worktime.time = [datetime.getHours(), datetime.getMinutes()].map(util.formatNumber).join(':')
    worktime.order = null

    return worktime
  },

  initWorktimes:function() {
    let worktimesGroupMap = new Map(),index = -1
    worktimes = []

    if (worktimesMap) {
      let worktimeGroup = null,tmpWorktimes = null
      
      for (let worktime of worktimesMap) {    
        worktimeGroup = worktimesGroupMap.get(worktime[1].hour)
        if (worktimeGroup) {                            
          worktimes[index].worktimes.push(worktime[1])
        }else {                   
          tmpWorktimes = []
          tmpWorktimes.push(worktime[1])
          worktimes.push({ 'hour': worktime[1].hour, 'worktimes': tmpWorktimes})
          worktimesGroupMap.set(worktime[1].hour, tmpWorktimes)

          index++
        }
      }
    }
  },

  renderWorkTimeList:function(orders) {
    wx.stopPullDownRefresh()
    
    if (orders) {
      let worktime = null, worktimesCreatedCount = 0, worktimesFinishedCount = 0

      for (let index = 0, size = orders.length; index < size; index++) {
        worktime = worktimesMap.get(orders[index].date + ' ' + orders[index].time)
        if (worktime) {
          if ('canceled' != orders[index].state) {
            worktime.order = orders[index]
          }      
        }

        if ('created' == orders[index].state) {
          worktimesCreatedCount++
        }

        if ('finished' == orders[index].state) {
          worktimesFinishedCount++
        }
      }

      this.setData({
        worktimesCreatedCount: worktimesCreatedCount,
        worktimesFinishedCount: worktimesFinishedCount
      })
    }    
    this.setData({
      worktimes: worktimes      
    })
  },

  /**
   * 查询某天订单
   */
  getOrders:function() {
    wx.showLoading({
      title: '请稍候',
      mask:true
    })

    let that = this
    request.getRequest('/orders?category=onedayappoints&type=0&date=' + currentDate,null,true)
    .then(data => {
      wx.hideLoading()
      that.renderWorkTimeList(data.items)
    }).catch(e => {
      wx.hideLoading()
    })
  },

  /**
   * 查询历史未完成的订单
   */
  getUnFinishedOrders:function() {
    let that = this
    request.getRequest('/orders?category=unfinished_appoints&type=0', null, true)
      .then(data => {
        if (data.items && 0 < data.items.length) {
          unFinishedOrders = data.items

          this.setData({
            showUnFinishedOrderView:true,
            popViewMessage:data.items.length
          })
        }
      })
  },

  makeNextWorktime:function(datetime,washMinutes) {    
    datetime = datetime.setMinutes(datetime.getMinutes() + washMinutes) // 计算向后的时间
    datetime = new Date(datetime)
    return datetime
  },

  openIndexPage:function() {
    let role = userModel.getRole()
    if (userModel.ROLE_OWNER == role.role || userModel.ROLE_CLERK == role.role) {
      return false  
    } else {      
      wx.reLaunch({
        url: '/pages/index/index',
      }) 

      return true
    }  
  }

})
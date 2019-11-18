//index.js
//获取应用实例
const app = getApp()

let getShopInfoRequest = require('../../operation/getShopInfo.js')
let authViewTemplate = require('../../template/authView/authView.js')
let userModel = require('../../model/user.js')
let mode = 'manager'

Page({
  data: {  
    showAuthView:false,
    shopName:''
  },
 
  onLoad: function () {    
    this.setData({
      shopName:getApp().buddysoft.name
    })
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    // getShopInfoRequest.getShopInfo()
  },
  
  /**
    * 用户点击右上角分享
  */
  onShareAppMessage: function () {

  },

  onClickManager:function() {
    mode = 'manager'
    authViewTemplate.showView(this,true)
  },
  onClickEmploye:function() {
    mode = 'employe'
    authViewTemplate.showView(this, true)
  },

  bindGetUserInfo: function (event) {     
    this.setData({
      showAuthView:false
    })

    getApp().login(event.detail,function(userInfo,message) {      
      if (null != userInfo) {
        userModel.setCurrentUser(userInfo)

        let role = userModel.getRole()        
        if ('manager' == mode) {
          
          if (userModel.ROLE_NORMAL == role.role) {
            wx.navigateTo({
              url: '../bindManagerRole/bindManagerRole'
            })
          }else if (userModel.ROLE_OWNER == role.role) {
            wx.reLaunch({
              url: '../home/home',
            })
          }
        }else if ('employe' == mode) {
          if (userModel.ROLE_CLERK == role.role) {
            wx.reLaunch({
              url: '../home/home',
            })
          }else {
            userModel.removeCurrentUser()
            wx.navigateTo({
              url: '../employeLoginFailed/employeLoginFailed'
            })
          }
          
        }    
      }
    })
  },

  onClose:function() {
    this.setData({
      showAuthView: false
    })
  }
  
})

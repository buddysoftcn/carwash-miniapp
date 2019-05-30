//index.js
//获取应用实例
const app = getApp()

let authViewTemplate = require('../../template/authView/authView.js')
let userModel = require('../../model/user.js')
let mode = 'manager'

Page({
  data: {  
    showAuthView:false  
  },
 
  onLoad: function () {
    
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
          console.log(role.role)
          if (userModel.ROLE_NORMAL == role.role) {
            wx.navigateTo({
              url: '../bindManagerRole/bindManagerRole'
            })
          }else if (userModel.ROLE_OWNER == role.role) {
            wx.reLaunch({
              url: '../home/home',
            })
          }
        }else {
          wx.navigateTo({
            url: '../employeLoginFailed/employeLoginFailed'
          })
        }    
      }
    })
  }
})

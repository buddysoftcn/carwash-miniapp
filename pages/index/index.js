//index.js
//获取应用实例
const app = getApp()

let authViewTemplate = require('../../template/authView/authView.js')
let role = 'manager'

Page({
  data: {  
    showAuthView:false  
  },
 
  onLoad: function () {
    
  },

  onClickManager:function() {
    role = 'manager'
    authViewTemplate.showView(this,true)
  },
  onClickEmploye:function() {
    role = 'employe'
    authViewTemplate.showView(this, true)
  },

  bindGetUserInfo: function (event) { 
    this.setData({
      showAuthView:false
    })
    
    if ('manager' == role) {
      wx.navigateTo({
        url: '../bindManagerRole/bindManagerRole'
      })
    }else {
      wx.navigateTo({
        url: '../employeLoginFailed/employeLoginFailed'
      })
    }    
  }
})

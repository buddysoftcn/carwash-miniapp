//index.js
//获取应用实例
const app = getApp()

let authViewTemplate = require('../../template/authView/authView.js')

Page({
  data: {  
    showAuthView:false  
  },
 
  onLoad: function () {
    
  },

  onClickManager:function() {
    authViewTemplate.showView(this,true)
  },

  bindGetUserInfo: function (event) { 
    console.log(event)
    wx.navigateTo({
      url: '../bindManagerRole/bindManagerRole'      
    })
  }
})

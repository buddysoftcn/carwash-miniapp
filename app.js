//app.js
let buddysoft = require('/buddysoft/buddysoft.js')
let request = require('/operation/operation.js')
let userModel = require('/model/user.js')
let notificationCenter = require('/utils/notification.js');

App({
  buddysoft:null,
  notificationCenter: null,
  MODE_CREATE : 1,
  MODE_EDIT : 2,

  onLaunch: function () {    
    this.buddysoft = buddysoft.buddysoftShop
    this.notificationCenter = notificationCenter.center();    
  },

  // 初始化界面
  initEnterPage:function() {
    let role = userModel.getRole(),url = ''
    if (userModel.ROLE_OWNER == role.role || userModel.ROLE_CLERK == role.role) {
      url = '/pages/home/home'
    }else {
      url = '/pages/index/index'
    }

    wx.reLaunch({
      url: url,
    }) 
  },

  onShow: function (options) {
    if (options.path.indexOf('authEmploye/authEmploye') >= 0 && (options.scene == 1007 || options.scene == 1008 || options.scene == 1044)) { // 验证会员界面
      // 通过群/个人分享卡片进来      
      this.globalData.param = { 'clerkSid': options.query.sid, 'nickname': options.query.nickname, 'shopname': options.query.shopname, 'avatar': options.query.avatar}
      this.initEnterPage()
    } 
  },

  // 登录请求
  login:function(wxUserInfo,cb) {
    wx.login({
      success: function (res) {
        wxUserInfo.userInfo.code = res.code
        
        var that = this, params = { 'wxCode': wxUserInfo.userInfo.code, 'shopSid': getApp().buddysoft.shopSid, 'app':'shop'}
        if (wxUserInfo.encryptedData) {
          params.encryptedData = wxUserInfo.encryptedData
          params.iv = wxUserInfo.iv
        }       

        request.postRequest('/user/wx-login', params, false)
          .then(data => {
            if (request.SUCCESSED == data.status) {                        
              typeof cb == "function" && cb(data,'')
            } else {
              cb(null, '登录失败')
            }
          }).catch(e => {
            cb(null, '登录失败')
          })
      },
      fail: function (res) {        
        cb(null, '微信获取用户信息失败')
      }
    })
  },

  // 更新用户信息请求
  getUserInfo:function(cb) {
    request.getRequest('/user/info',null,true)
    .then(data => {
      if (request.SUCCESSED == data.status) {
        userModel.setCurrentUser(data)

        cb(data)
      }else {
        cb(null)
      }
    }).catch(e => {
      cb(null)
    })
  },

  globalData: {
    userInfo: null,
    param: {},  // 用于保存页面参数传值
  }
})
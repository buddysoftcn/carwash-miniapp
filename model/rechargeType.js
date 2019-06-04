const RECHARGE_TYPE_KEY = 'rechargeTypeKey'

function setCurrentRechargeTypes(payTypes) {
  wx.setStorageSync(RECHARGE_TYPE_KEY, payTypes)
}

function getCurrentRechargeTypes() {
  return wx.getStorageSync(RECHARGE_TYPE_KEY)
}

module.exports = {
  setCurrentRechargeTypes: setCurrentRechargeTypes,
  getCurrentRechargeTypes: getCurrentRechargeTypes
}
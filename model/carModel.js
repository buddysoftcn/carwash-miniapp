const CAR_MODEL_KEY = 'carModelKey'

function setCurrentCarModels(carModels) {
  wx.setStorageSync(CAR_MODEL_KEY, carModels)
}

function getCurrentCarModels() {
  return wx.getStorageSync(CAR_MODEL_KEY)
}

module.exports = {
  setCurrentCarModels: setCurrentCarModels,
  getCurrentCarModels: getCurrentCarModels
}
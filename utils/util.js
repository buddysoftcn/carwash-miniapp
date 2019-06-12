// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 今天
 */
function today() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 后天
 */
function afterTomorrow() {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()

  date = new Date(year,month,day + 2)
  year = date.getFullYear()
  month = date.getMonth() + 1
  day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

function formatDate(date) {
  date = date.split('-')
  return date[1] + "月" + date[2] + "日 "
}

function formatTime(time) {
  time = time.split(':')
  return time[0] + ":" + time[1]
}

function week(date) {
  date = date.split('-')
  date = new Date(date[0], date[1], date[2])

  console.log(date)

  let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  let day = date.getDay()
  
  return weeks[day]
}

module.exports = {
  // formatTime: formatTime,
  today: today,
  afterTomorrow: afterTomorrow,
  week: week,
  formatDate: formatDate,
  formatTime: formatTime
}

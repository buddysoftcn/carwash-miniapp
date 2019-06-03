// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

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

module.exports = {
  // formatTime: formatTime,
  afterTomorrow: afterTomorrow,
  formatDate: formatDate,
  formatTime: formatTime
}

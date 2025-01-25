const current_timezone = moment.tz.guess();
const current_cookie_tz = getCookie('timezone')
if (current_cookie_tz !== current_timezone) {
    setCookie('timezone', current_timezone)
    window.location.reload()
}
// console.log(moment().format(), `Местное время (${current_cookie_tz})`)

//
// console.log(moment().tz('America/Los_Angeles').format(), 'America/Los_Angeles')
// console.log(moment().utc().format(), 'UTC')
// console.log(moment().tz('Europe/Moscow').format(), 'Europe/Moscow')
// console.log(moment().tz('Asia/Shanghai').format(), 'Asia/Shanghai')
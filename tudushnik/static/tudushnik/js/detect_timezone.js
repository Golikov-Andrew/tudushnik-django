const current_timezone = moment.tz.guess();
// console.log(current_timezone)
setCookie('timezone', current_timezone)
console.log(getCookie('timezone'))
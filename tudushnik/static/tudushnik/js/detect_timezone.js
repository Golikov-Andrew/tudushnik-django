const current_timezone = moment.tz.guess();
const current_cookie_tz = getCookie('timezone')
if (current_cookie_tz !== current_timezone) {
    setCookie('timezone', current_timezone)
    window.location.reload()
}

const logout_link_button = document.querySelector('#logout_link_button');
if (logout_link_button !== null) {
    logout_link_button.addEventListener('click', (evt) => {
        evt.preventDefault()
        if (is_cookie_exists('refresh_token') !== undefined) delete_cookie('refresh_token')
        if (is_cookie_exists('access_token') !== undefined) delete_cookie('access_token')
        window.location.href = '/logout/'
    })
}

// console.log(moment().format(), `Местное время (${current_cookie_tz})`)

//
// console.log(moment().tz('America/Los_Angeles').format(), 'America/Los_Angeles')
// console.log(moment().utc().format(), 'UTC')
// console.log(moment().tz('Europe/Moscow').format(), 'Europe/Moscow')
// console.log(moment().tz('Asia/Shanghai').format(), 'Asia/Shanghai')
const pagination_limit = document.getElementById('pagination_limit')
let btns_pagination_ctrl = document.getElementsByClassName('btn_pagination_ctrl')

pagination_limit.addEventListener('change', (ev) => {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let params = Object.fromEntries(urlSearchParams.entries());
    params['limit'] = pagination_limit.value
    let new_query_string = []
    for (let k in params) {
        new_query_string.push(k + '=' + params[k])
    }
    window.location.href = '?' + new_query_string.join('&')
})

for (let i = 0, cur_btn; i < btns_pagination_ctrl.length; i++) {
    cur_btn = btns_pagination_ctrl[i]
    cur_btn.addEventListener('click', (ev) => {
        window.location.href = cur_btn.getAttribute('data-href') + '&limit=' + pagination_limit.value
    })
}
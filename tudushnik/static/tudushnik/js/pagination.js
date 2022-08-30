const PAGINATION_LIMIT = 'pagination_limit'
const pagination_limit = document.getElementById('pagination_limit')
let btns_pagination_ctrl = document.getElementsByClassName('btn_pagination_ctrl')

// let current_user_pagination_limit = localStorage.getItem(PAGINATION_LIMIT)
// if(current_user_pagination_limit!==null){
//     let urlSearchParams = new URLSearchParams(window.location.search);
//     if(urlSearchParams.get('limit')!==current_user_pagination_limit){
//         urlSearchParams.set('limit', current_user_pagination_limit)
//         window.location.href = '?' + urlSearchParams.toString()
//     }
// }

pagination_limit.addEventListener('change', (ev) => {
    let urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('limit', pagination_limit.value)
    // localStorage.setItem(PAGINATION_LIMIT, pagination_limit.value)
    window.location.href = '?' + urlSearchParams.toString()
})

for (let i = 0, cur_btn; i < btns_pagination_ctrl.length; i++) {
    cur_btn = btns_pagination_ctrl[i]
    cur_btn.addEventListener('click', (ev) => {
        window.location.href = cur_btn.getAttribute('data-href') + '&limit=' + pagination_limit.value
    })
}
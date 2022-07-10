let btns_item_delete = document.getElementsByClassName('btn_item_delete')
function item_delete_handle_response(json_data, redirect_url) {
    let json_obj = JSON.parse(json_data)
    if ('success' in json_obj) {
        if (json_obj['success'] === true) {
            window.location.href = redirect_url
        }
    }

}

function init_btns_item_delete(entity_name, redirect_url) {
    for (let i = 0, cur_btn; i < btns_item_delete.length; i++) {
        cur_btn = btns_item_delete[i]
        cur_btn.addEventListener('click', (ev) => {
            let ans = confirm(`Вы действительно хотите удалить ${entity_name} ${cur_btn.getAttribute('data-item-title')}`)
            if (ans === true) {
                send_post_json(ev, cur_btn.getAttribute('data-post-url'), {}, (resp) => {
                    item_delete_handle_response(resp, redirect_url)
                }, csrfToken)
            }
        })
    }
}
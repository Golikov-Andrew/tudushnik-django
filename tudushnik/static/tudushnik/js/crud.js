let btns_item_delete = document.getElementsByClassName('btn_item_delete')

function item_delete_handle_response(json_data, redirect_url) {
    let json_obj = JSON.parse(json_data)
    if ('success' in json_obj) {
        if (json_obj['success'] === true) {
            window.location.href = redirect_url
        }else if(json_obj['success'] === false){
            alert(json_obj['errors'][0])
        }
    }
}

function init_btns_item_delete() {
    for (let i = 0, cur_btn, entity_name, redirect_url; i < btns_item_delete.length; i++) {
        cur_btn = btns_item_delete[i]
        entity_name = cur_btn.getAttribute('data-entity-name')
        redirect_url = cur_btn.getAttribute('data-redirect-url')
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
function pop_from_list(list, value) {
    const index = list.indexOf(value)
    if (index !== -1) {
        return list.splice(index, 1)[0]
    }
    return null
}

function send_post_formdata(e, csrftoken, url, formdata, func_on_success, func_on_error) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.onerror = function () {
        if (func_on_error !== undefined) {
            func_on_error(xhr.response);
        } else {
            console.error(xhr.response)
        }
    }
    xhr.onload = function () {
        func_on_success(xhr.response);
    }
    if (csrftoken !== undefined) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
    xhr.send(formdata);
    if (e !== undefined) e.preventDefault();
}

function get_dict_from_list_by_key_val(list, key, val, def = false) {
    for (let i = 0, c; i < list.length; i++) {
        c = list[i]
        if (c[key] === val) {
            return c
        }
    }
    return def
}

function remove_dict_from_list_by_key_val_if_exists(list, key, val, def = false) {
    for (let i = 0, c; i < list.length; i++) {
        c = list[i]
        if (c[key] === val) {
            return list.splice(i, 1)
        }
    }
    return null
}

function get_dict_n_index_from_list_by_key_val(list, key, val, def = false) {
    for (let i = 0, c; i < list.length; i++) {
        c = list[i]
        if (c[key] === val) {
            return {
                obj: c,
                index: i
            }
        }
    }
    return def
}

export {
    pop_from_list,
    send_post_formdata,
    get_dict_from_list_by_key_val,
    get_dict_n_index_from_list_by_key_val,
    remove_dict_from_list_by_key_val_if_exists
}
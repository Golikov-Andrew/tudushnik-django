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
        if(func_on_error !== undefined){
            func_on_error(xhr.response);
        }else{
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

export {
    pop_from_list, send_post_formdata
}
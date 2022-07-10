const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value

function showElem(elem) {
    elem.classList.remove('hidden');
}

function hideElem(elem) {
    elem.classList.add('hidden')
}

function send_post_form(e, url, form_elem, func_on_success) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    let formData = new FormData(form_elem);
    xhr.onerror = function () {
        console.log(xhr.response);
    }
    xhr.onload = function () {
        func_on_success(xhr.response);
    }
    xhr.send(formData);
    e.preventDefault();
}

function send_post_json(e, url, json_obj, func, csrftoken) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    if (csrftoken !== undefined) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }

    xhr.onerror = function () {
        console.log(xhr.response);
    }
    xhr.onload = function () {
        if (func !== undefined) {
            func(xhr.response);
        } else {
            console.log(xhr.response);
        }
    }
    xhr.send(JSON.stringify(json_obj));
    if (e !== undefined) {
        e.preventDefault();
    }
}

function send_post_formdata(e, url, formdata, func_on_success) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);

    xhr.onerror = function () {
        console.log(xhr.response);
    }
    xhr.onload = function () {
        func_on_success(xhr.response);
    }
    xhr.send(formdata);
    e.preventDefault();
}
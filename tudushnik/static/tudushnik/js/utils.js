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

function send_json(e, method, url, json_obj, func, csrftoken) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
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

function send_json_promise(e, method, url, json_obj, csrftoken) {
    if (e !== undefined) e.preventDefault();

    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        if (csrftoken !== undefined) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }

        xhr.onerror = function () {
            reject(new Error("Network Error"));
        }
        xhr.onload = function () {
            if (this.status === 200) {
                resolve(this.response);
            } else {
                let error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        }
        xhr.send(JSON.stringify(json_obj));

    })
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

function build_query_string(query_string_dictionary) {
    let new_query_string = []
    for (let k in query_string_dictionary) {
        new_query_string.push(k + '=' + query_string_dictionary[k])
    }
    return '?' + new_query_string.join('&')
}

function getStrOrJSON(str) {
    let result;
    if ((str.slice(0, 1) === '{' && str.slice(-1) === '}') || (str.slice(0, 1) === '[' && str.slice(-1) === ']')) {
        result = JSON.parse(str)
    } else {
        result = str
    }
    return result
}

function tryToStringify(obj) {
    let result;
    if (Array.isArray(obj)) {
        // console.log('is array')
        result = JSON.stringify(obj)
    } else {
        result = obj
    }
    return result
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

function div(val, by) {
    return (val - val % by) / by;
}

function addMultiEventListener(el, s, fn) {
    s.forEach(e => el.addEventListener(e, fn, false))
}

function showHelper(parent, color, x, y, w, h) {
    let new_div = document.createElement('div')
    new_div.style.backgroundColor = color
    new_div.style.display = 'inline-block'
    new_div.style.opacity = '0.5'
    new_div.style.position = 'absolute'
    new_div.style.zIndex = '1000000'
    new_div.style.left = `${x}px`
    new_div.style.top = `${y}px`
    new_div.style.width = `${w}px`
    new_div.style.height = `${h}px`
    parent.appendChild(new_div)
    setTimeout(() => {
        parent.removeChild(new_div)
    }, 10000)
}

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

function tryToStringify(obj){
    let result;
    if (Array.isArray(obj)) {
        console.log('is array')
        result = JSON.stringify(obj)
    } else {
        result = obj
    }
    return result
}

// http://localhost:8080/projects/?limit=10&search={%22id%22:%22val1%22,%22title%22:%22fdkjsfjk%22}&sku_list=[%22abc1%22,%22abc2%22,%22abc3%22]
function get_query_string_dictionary() {
    let result = {}
    let urlSearchParams = new URLSearchParams(window.location.search);
    result = Object.fromEntries(urlSearchParams.entries());
    for (let k in result) {
        result[k] = getStrOrJSON(result[k])
    }
    return result
}
let qs = get_query_string_dictionary()
console.log(qs)
let sf = tryToStringify(qs)
console.log(build_query_string(qs))

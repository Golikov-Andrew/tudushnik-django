const inp_id_duration = document.getElementById('id_duration')
const parentElem = inp_id_duration.parentElement

function createInputNumber(label_text, data_seconds, max_value) {
    let elem = document.createElement('input')
    elem.classList.add('duration_controller')
    elem.setAttribute('type', 'number')
    elem.setAttribute('min', '0')
    if (max_value !== undefined)
        elem.setAttribute('max', max_value);
    elem.setAttribute('data-seconds', data_seconds)
    let label = document.createElement('label')
    label.innerText = `${label_text}: `
    label.append(elem)
    parentElem.append(label)
    parentElem.append(' ')
    return elem
}

const inp_duration_hours_ctrl = createInputNumber('Часов', 60 * 60)
const inp_duration_minutes_ctrl = createInputNumber('Минут', 60, 59)
// const inp_duration_seconds_ctrl = createInputNumber('Секунд', 1, 59)


let duration_controllers = document.getElementsByClassName('duration_controller')
for (let i = 0, c; i < duration_controllers.length; i++) {
    c = duration_controllers[i]
    c.addEventListener('change', calc_duration_in_sec)
}


function calc_duration_in_sec() {
    let result = 0
    for (let i = 0, c; i < duration_controllers.length; i++) {
        c = duration_controllers[i]
        result += Math.floor((+c.value * (+c.getAttribute('data-seconds'))) / 60) * 60;
    }
    inp_id_duration.value = result
}

init_duration_controllers(+inp_id_duration.value)

function init_duration_controllers(new_val) {
    let hours = div(new_val, 60 * 60)
    let minutes = div(new_val - (hours * 60 * 60), 60)
    // let seconds = new_val - ((hours * 60 * 60) + (minutes * 60))
    inp_duration_hours_ctrl.value = hours
    inp_duration_minutes_ctrl.value = minutes
    // inp_duration_seconds_ctrl.value = seconds
    calc_duration_in_sec();
}

const id_begin_at = document.querySelector('#id_begin_at')
const begin_at_delta = document.querySelector('input[name="begin_at_delta"]')
let old_begin_at_value;
if (id_begin_at !== null && begin_at_delta !== null) {
    old_begin_at_value = id_begin_at.value;
    id_begin_at.addEventListener('change', () => {
        begin_at_delta.value = moment.duration(moment(id_begin_at.value).diff(old_begin_at_value)).asSeconds()
    })
}


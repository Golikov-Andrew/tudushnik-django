const inp_id_duration = document.getElementById('id_duration')
const parentElem = inp_id_duration.parentElement

function createInputNumber(label_text, data_seconds) {
    let elem = document.createElement('input')
    elem.classList.add('duration_controller')
    elem.setAttribute('type', 'number')
    elem.style.width = '42px'
    elem.setAttribute('min', '0')
    elem.setAttribute('data-seconds', data_seconds)
    let label = document.createElement('label')
    label.innerText = `${label_text}: `
    label.append(elem)
    parentElem.append(label)
    parentElem.append(' ')
    return elem
}

const inp_duration_hours_ctrl = createInputNumber('Часов', 60 * 60)
const inp_duration_minutes_ctrl = createInputNumber('Минут', 60)
const inp_duration_seconds_ctrl = createInputNumber('Секунд', 1)


let duration_controllers = document.getElementsByClassName('duration_controller')
for (let i = 0, c; i < duration_controllers.length; i++) {
    c = duration_controllers[i]
    c.addEventListener('change', (ev) => {
        let new_val = +ev.target.value
        calc_duration_in_sec(new_val)
    })
}


function calc_duration_in_sec() {
    let result = 0
    for (let i = 0, c; i < duration_controllers.length; i++) {
        c = duration_controllers[i]
        result += +c.value * (+c.getAttribute('data-seconds'))
    }
    inp_id_duration.value = result
    console.log(result)
}

init_duration_controllers(+inp_id_duration.value)

function init_duration_controllers(new_val) {
    let hours = div(new_val, 60 * 60)
    let minutes = div(new_val - (hours * 60 * 60), 60)
    let seconds = new_val - ((hours * 60 * 60) + (minutes * 60))
    inp_duration_hours_ctrl.value = hours
    inp_duration_minutes_ctrl.value = minutes
    inp_duration_seconds_ctrl.value = seconds
}


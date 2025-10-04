class DurationWidget {
    #src_input_element;
    #parent_element;
    #container;
    #input_duration_controllers = {}

    constructor(src_input_element_selector) {
        this.#src_input_element = document.querySelector(src_input_element_selector)
        this.#parent_element = this.#src_input_element.parentElement

        this.#container = document.createElement('div')
        this.#container.classList.add('duration_widget')
        this.#parent_element.appendChild(this.#container)

        this.#input_duration_controllers = {
            hours: this.#create_input_number_element('Час.', 60 * 60),
            minutes: this.#create_input_number_element('Мин.', 60, 59)
        }
    }

    #create_input_number_element(label_text, data_seconds, max_value) {
        const container = document.createElement('div')
        this.#container.append(container)

        let label = document.createElement('label')
        label.innerText = `${label_text}: `
        container.appendChild(label)

        let elem = document.createElement('input')
        elem.classList.add('duration_controller')
        elem.setAttribute('type', 'number')
        elem.setAttribute('min', '0')
        if (max_value !== undefined)
            elem.setAttribute('max', max_value);
        elem.setAttribute('data-seconds', data_seconds)

        container.appendChild(elem)

        elem.addEventListener('change', () => {
            this.#calc_duration_in_sec()
        })
        return elem
    }

    #calc_duration_in_sec() {
        let result = 0
        for (const key in this.#input_duration_controllers) {
            const c = this.#input_duration_controllers[key]
            result += Math.floor((+c.value * (+c.getAttribute('data-seconds'))) / 60) * 60;
        }
        this.#src_input_element.value = result
    }

    init() {
        const new_val = +this.#src_input_element.value;
        let hours = div(new_val, 60 * 60)
        let minutes = div(new_val - (hours * 60 * 60), 60)
        // let seconds = new_val - ((hours * 60 * 60) + (minutes * 60))
        this.#input_duration_controllers.hours.value = hours
        this.#input_duration_controllers.minutes.value = minutes
        // inp_duration_seconds_ctrl.value = seconds
        this.#calc_duration_in_sec();
    }
}

export {
    DurationWidget
}



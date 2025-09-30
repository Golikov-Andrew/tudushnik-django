import template from './template.html'
import compiledCssString from './styles.less';
import {
    get_dict_from_list_by_key_val,
    get_dict_n_index_from_list_by_key_val
} from "../../utils/utils";

class BinaryFilterWidgetComponent extends HTMLElement {
    #DQM;
    #hand_element;
    #path_element;
    #buttons;
    #current_value;

    constructor() {
        super();
        this.#current_value = ''

    }

    get DQN() {
        return this.#DQM;
    }

    set DQM(dqm) {
        this.#DQM = dqm
    }

    connectedCallback() {
        this.shadowRootMy = this.attachShadow({mode: 'closed'});
        const templateContent = document.importNode(
            document.createRange().createContextualFragment(template).firstElementChild.content,
            true
        );

        const styleSheet = new CSSStyleSheet();
        styleSheet.replaceSync(compiledCssString);
        this.shadowRootMy.adoptedStyleSheets = [styleSheet];
        this.shadowRootMy.append(templateContent);

        this.field_name = this.getAttribute('data-field-name')
        this.#buttons = {
            no: this.shadowRootMy.querySelector('.place.no'),
            yes: this.shadowRootMy.querySelector('.place.yes'),
        }
        this.#hand_element = this.shadowRootMy.querySelector('.hand')
        this.#path_element = this.shadowRootMy.querySelector('.path')
        // this.#hand_element.setAttribute('data-field-name', this.field_name)

    }

    add_listeners(listeners) {
        // additional listeners
        listeners.forEach((item) => {
            for (const key in this.#buttons) {
                this.#buttons[key].addEventListener(item[0], item[1])
            }
        })
    }

    init() {
        if (this.#DQM.filters.hasOwnProperty(this.field_name)) {
            this.#current_value = this.#DQM.filters[this.field_name]
            this.#path_element.classList.add(this.#current_value)
        }
        // let it = get_dict_n_index_from_list_by_key_val(this.#DQM.filters, 'n', this.field_name)
        // if (it !== false) {
        //     for (const key in this.#buttons) {
        //         debugger;
        //         if (it.obj.n === this.field_name && it.obj.v === key) {
        //             // this.#buttons[key].innerHTML += it.index
        //             this.classList.add(it.obj.v)
        //             this.#current_value = it.obj.v
        //             this.classList.add(it.obj.v)
        //             break;
        //         }
        //     }
        // }

        // default listener
        for (const key in this.#buttons) {
            let current_button_value = this.#buttons[key].getAttribute('data-value')

            this.#buttons[key].addEventListener('click', () => {
                if (this.#current_value === '') {
                    this.#current_value = current_button_value
                    this.#path_element.classList.add(current_button_value)
                } else if (this.#current_value === current_button_value) {
                    this.#current_value = ''
                    this.#path_element.classList.remove(current_button_value)
                } else if (this.#current_value !== current_button_value) {
                    this.#current_value = current_button_value
                    this.#path_element.classList.value = `path ${current_button_value}`
                }

                if (this.#current_value !== '') {
                    this.#DQM.filters[this.field_name] = this.#current_value
                } else {
                    delete this.#DQM.filters[this.field_name]
                }

                console.log(this.#DQM.filters)
            })

        }
        return this
    }
}

if (!customElements.get('binary-filter-widget')) {
    customElements.define('binary-filter-widget', BinaryFilterWidgetComponent);
}

export {
    BinaryFilterWidgetComponent
}
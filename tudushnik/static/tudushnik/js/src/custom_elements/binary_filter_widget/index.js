import template from './template.html'
import compiledCssString from './styles.less';
import {
    get_dict_from_list_by_key_val,
    get_dict_n_index_from_list_by_key_val, remove_dict_from_list_by_key_val_if_exists
} from "../../utils/utils";

class BinaryFilterWidgetComponent extends HTMLElement {
    #DQM;
    #hand_element;
    #path_element;
    #buttons;
    #current_value;
    #field_name;

    constructor() {
        super();
        this.#current_value = ''
        this.#field_name = ''

    }

    get DQM() {
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

        this.#field_name = this.getAttribute('data-field-name')
        this.#buttons = {
            '0': this.shadowRootMy.querySelector('.place.no'),
            '1': this.shadowRootMy.querySelector('.place.yes'),
        }
        this.#hand_element = this.shadowRootMy.querySelector('.hand')
        this.#path_element = this.shadowRootMy.querySelector('.path')

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
        let filter_section = get_dict_from_list_by_key_val(this.#DQM.filters, 'n', this.#field_name)
        if (filter_section !== false) {
            this.#current_value = filter_section['v']
            let class_value = (this.#current_value === '1') ? 'yes':'no';
            this.#path_element.classList.add(class_value)
        }

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
                    let it = get_dict_from_list_by_key_val(this.#DQM.filters, 'n', this.#field_name)
                    if (it !== false) {
                        it['v'] = this.#current_value
                    } else {
                        this.#DQM.filters.push({
                            'n': this.#field_name, 'v': this.#current_value
                        })
                    }
                } else {
                    remove_dict_from_list_by_key_val_if_exists(this.#DQM.filters, 'n', this.#field_name)
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
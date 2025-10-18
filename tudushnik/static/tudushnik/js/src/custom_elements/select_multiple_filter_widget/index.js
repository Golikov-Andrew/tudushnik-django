import template from './template.html'
import compiledCssString from './styles.less';

class SelectMultipleWidgetComponent extends HTMLElement {
    #DQM;
    #operands;
    #chips;
    #field_name;

    constructor() {
        super();
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
        this.#operands = {
            and: this.shadowRootMy.querySelector('#id_and'),
            or: this.shadowRootMy.querySelector('#id_or'),
            not: this.shadowRootMy.querySelector('#id_not'),
        }
        this.#chips = this.shadowRootMy.querySelectorAll('chips-widget')
    }

    add_listeners(listeners) {
        // additional listeners TODO: ниже - чушь временная, переделать

        listeners.forEach((item) => {
            for (const key in this.#operands) {
                debugger;
                this.#operands[key].addEventListener(item[0], item[1])
            }
        })
    }

    init() {

        // if (this.#DQM.filters.hasOwnProperty(this.field_name)) {
        //     this.#current_value = this.#DQM.filters[this.field_name]
        // }

        // default listener
        // for (const key in this.#buttons) {
        //     let current_button_value = this.#buttons[key].getAttribute('data-value')
        //
        //     this.#buttons[key].addEventListener('click', () => {
        //         if (this.#current_value === '') {
        //             this.#current_value = current_button_value
        //             this.#path_element.classList.add(current_button_value)
        //         } else if (this.#current_value === current_button_value) {
        //             this.#current_value = ''
        //             this.#path_element.classList.remove(current_button_value)
        //         } else if (this.#current_value !== current_button_value) {
        //             this.#current_value = current_button_value
        //             this.#path_element.classList.value = `path ${current_button_value}`
        //         }
        //
        //         if (this.#current_value !== '') {
        //             this.#DQM.filters[this.field_name] = this.#current_value
        //         } else {
        //             delete this.#DQM.filters[this.field_name]
        //         }
        //
        //         console.log(this.#DQM.filters)
        //     })
        //
        // }
        return this
    }
}

if (!customElements.get('select-multiple-widget')) {
    customElements.define('select-multiple-widget', SelectMultipleWidgetComponent);
}

export {
    SelectMultipleWidgetComponent
}
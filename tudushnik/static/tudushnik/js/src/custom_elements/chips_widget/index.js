import template from './template.html'
import compiledCssString from './styles.less';

class ChipsWidgetComponent extends HTMLElement {
    #DQM;
    // #hand_element;
    // #path_element;
    // #buttons;
    // #current_value;
    #field_name;
    #value;
    #id;
    #label;
    #color;
    #wrapper;

    constructor() {
        super();
        // this.#current_value = ''

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

        this.#field_name = this.getAttribute('data-field-name')
        this.#value = this.getAttribute('data-value')
        this.#id = this.getAttribute('data-id')
        this.#color = this.getAttribute('data-color')
        this.#wrapper = this.shadowRootMy.querySelector('.wrapper')
        this.#label = this.shadowRootMy.querySelector('label')
        this.#label.innerHTML = this.#value
        this.#wrapper.style.backgroundColor = this.#color


    }

    add_listeners(listeners) {
        // additional listeners
        listeners.forEach((item) => {
            this.addEventListener(item[0], item[1])
        })
    }

    init() {
        // // if (this.#DQM.filters.hasOwnProperty(this.field_name)) {
        // //     this.#value = this.#DQM.filters[this.field_name]
        // //     this.#path_element.classList.add(this.#current_value)
        // // }
        // //
        // // // default listener
        // // for (const key in this.#buttons) {
        // //     let current_button_value = this.#buttons[key].getAttribute('data-value')
        // //
        // //     this.#buttons[key].addEventListener('click', () => {
        // //         if (this.#current_value === '') {
        // //             this.#current_value = current_button_value
        // //             this.#path_element.classList.add(current_button_value)
        // //         } else if (this.#current_value === current_button_value) {
        // //             this.#current_value = ''
        // //             this.#path_element.classList.remove(current_button_value)
        // //         } else if (this.#current_value !== current_button_value) {
        // //             this.#current_value = current_button_value
        // //             this.#path_element.classList.value = `path ${current_button_value}`
        // //         }
        // //
        // //         if (this.#current_value !== '') {
        // //             this.#DQM.filters[this.field_name] = this.#current_value
        // //         } else {
        // //             delete this.#DQM.filters[this.field_name]
        // //         }
        // //
        // //         console.log(this.#DQM.filters)
        // //     })
        //
        // }
        // return this
    }
}

if (!customElements.get('chips-widget')) {
    customElements.define('chips-widget', ChipsWidgetComponent);
}

export {
    ChipsWidgetComponent
}
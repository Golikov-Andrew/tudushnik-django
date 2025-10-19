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
    #input_checkbox;
    #is_checked;

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

    get is_checked() {
        return this.#is_checked;
    }

    get checked() {
        return this.#input_checkbox.checked
    }

    get value() {
        return this.#value;
    }

    get id() {
        return this.#id;
    }

    connectedCallback() {
        if (this.shadowRootMy) {
            return
        }
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
        this.#input_checkbox = this.shadowRootMy.querySelector('input')
        this.#label.innerHTML = this.#value
        this.#wrapper.style.backgroundColor = this.#color

        let checked_val = this.getAttribute('checked')
        this.set_check(checked_val === 'true');

        this.#input_checkbox.addEventListener('change', ()=>{
            this.set_check(this.#input_checkbox.checked)
        })

    }

    add_listeners(listeners) {
        // additional listeners
        listeners.forEach((item) => {
            this.addEventListener(item[0], item[1])
        })
    }

    init() {

    }

    set_check(val = true) {
        if (val) {
            this.#is_checked = true
            this.setAttribute('checked', `${val}`)
            this.#input_checkbox.setAttribute('checked', `${val}`)
        } else {
            this.#is_checked = false
            this.removeAttribute('checked')
            this.#input_checkbox.removeAttribute('checked')
        }

    }
}

if (!customElements.get('chips-widget')) {
    customElements.define('chips-widget', ChipsWidgetComponent);
}

export {
    ChipsWidgetComponent
}
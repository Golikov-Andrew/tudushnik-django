import template from './template.html'
import compiledCssString from './styles.less';
import {get_dict_from_list_by_key_val} from "../../utils/utils";

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
        this.#operands = {
            and: this.shadowRootMy.querySelector('#id_and'),
            or: this.shadowRootMy.querySelector('#id_or'),
            not: this.shadowRootMy.querySelector('#id_not'),
        }
        this.#chips = this.shadowRootMy.querySelector('.chips')
    }

    add_listeners(listeners) {
        // additional listeners
        // тут слушателей лучше добавить на кнопку ОК модального окна (или переопределить perform_ok())
    }

    init() {
        let filter_section = get_dict_from_list_by_key_val(this.#DQM.filters, 'n', this.#field_name)
        if (filter_section !== false) {
            const initial_values = filter_section['v'].split(',')
            for (let i = 0, chips_widget; i < initial_values.length; i++) {
                chips_widget = this.querySelector(`chips-widget[data-id="${initial_values[i]}"]`)
                chips_widget.set_check(true)
            }
        }

        if(filter_section.hasOwnProperty('o')){
            let val = filter_section['o']
            let operand = this.shadowRootMy.querySelector(`input[name='operand'][value='${val}']`)
            operand.checked = true
        }
        if(filter_section.hasOwnProperty('e')){
            let val = filter_section['e']
            if(val === '1'){
                this.#operands.not.checked = true
            }
        }

        return this
    }

    create_filter_section() {
        let checked_operand = this.shadowRootMy.querySelector(`input[name='operand']:checked`)
        let is_to_exclude = this.#operands.not.checked
        let chips = this.querySelectorAll("chips-widget[checked='true']")
        let values = []
        for (let i = 0; i < chips.length; i++) {
            values.push(chips[i].id)
        }

        let result = {
            'm': '1',
            'n': this.#field_name,
            'v': values.join(',')
        }
        if (checked_operand.value === 'a') {
            result['o'] = 'a'
        }
        if (is_to_exclude) {
            result['e'] = '1'
        }
        return result

    }

}

if (!customElements.get('select-multiple-widget')) {
    customElements.define('select-multiple-widget', SelectMultipleWidgetComponent);
}

export {
    SelectMultipleWidgetComponent
}
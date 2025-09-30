import template from './template.html'
import compiledCssString from './styles.less';
import {
    get_dict_from_list_by_key_val,
    get_dict_n_index_from_list_by_key_val
} from "../../utils/utils";

class SortingWidgetComponent extends HTMLElement {
    #DQM;
    #buttons;

    constructor() {
        super();
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
            asc: this.shadowRootMy.querySelector('button[value=""]'),
            desc: this.shadowRootMy.querySelector('button[value="-"]'),
        }
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
        let it = get_dict_n_index_from_list_by_key_val(this.#DQM.sorting, 'n', this.field_name)
        if (it !== false) {
            for (const key in this.#buttons) {
                if (it.obj.n === this.field_name && it.obj.v === this.#buttons[key].value) {
                    this.#buttons[key].innerHTML += it.index
                    this.#buttons[key].classList.add('active')
                    break;
                }
            }
        }

        // default listener
        for (const key in this.#buttons) {
            this.#buttons[key].addEventListener('click', () => {
                if (this.#buttons[key].classList.contains('active')) {
                    for (let j = 0; j < this.#DQM.sorting.length; j++) {
                        if (this.#DQM.sorting[j].n === this.field_name) {
                            this.#DQM.sorting.splice(j, 1)
                        }
                    }
                } else {
                    let it = get_dict_from_list_by_key_val(this.#DQM.sorting, 'n', this.field_name)
                    if (it !== false) {
                        it['v'] = this.#buttons[key].value
                    } else {
                        this.#DQM.sorting.push({
                            'n': this.field_name, 'v': this.#buttons[key].value
                        })
                    }
                }
                console.log(this.#DQM.sorting)
            })

        }
        return this
    }
}

if (!customElements.get('sorting-widget')) {
    customElements.define('sorting-widget', SortingWidgetComponent);
}

export {
    SortingWidgetComponent
}
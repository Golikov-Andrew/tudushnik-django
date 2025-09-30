import template from './template.html'
import compiledCssString from './styles.less';

class SearchWidgetComponent extends HTMLElement {
    #DQM;
    #input_element;

    constructor(DQM) {
        super();
        // this.#DQM = DQM
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
        const size = this.getAttribute('size')
        // const search_widget = this.shadowRootMy.querySelector('.search_widget')
        this.#input_element = this.shadowRootMy.querySelector('input')

        // search_widget.setAttribute('data-field-name', this.field_name)
        this.#input_element.setAttribute('data-field-name', this.field_name)
        this.#input_element.setAttribute('size', size)
    }

    add_listeners(listeners) {
        // additional listeners
        listeners.forEach((item) => {
            this.#input_element.addEventListener(item[0], item[1])
        })
    }

    init() {
        if (this.#DQM.search.hasOwnProperty(this.field_name)) {
            this.#input_element.value = this.#DQM.search[this.field_name]
        }
        // default listener
        this.#input_element.addEventListener('change', () => {
            if (this.#input_element.value !== '') {
                this.#DQM.search[this.field_name] = this.#input_element.value
            } else {
                delete this.#DQM.search[this.field_name]
            }
        })
        return this
    }
}

if (!customElements.get('search-widget-component')) {
    customElements.define('search-widget-component', SearchWidgetComponent);
}

export {
    SearchWidgetComponent
}
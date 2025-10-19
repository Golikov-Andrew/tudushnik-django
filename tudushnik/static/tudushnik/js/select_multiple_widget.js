class SelectMultipleWidget {
    #src_input_element;
    #parent_element;
    #container;

    constructor(src_input_element_selector) {
        this.#src_input_element = document.querySelector(src_input_element_selector)
        this.#parent_element = this.#src_input_element.parentElement

        this.#container = document.createElement('div')
        this.#container.classList.add('select_multiple_widget')
        this.#parent_element.appendChild(this.#container)

    }



    init() {
        console.log(this.#src_input_element.options)
        console.log(this.#src_input_element.selectedOptions)
    }
}

export {
    SelectMultipleWidget
}








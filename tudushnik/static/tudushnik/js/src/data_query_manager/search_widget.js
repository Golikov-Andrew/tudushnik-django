class SearchWidget {
    #DQM;
    #root_element;

    constructor(DQM, root_element) {
        this.#DQM = DQM
        this.#root_element = root_element
        const field_name = this.#root_element.getAttribute('data-field-name')
        // init widget by value
        if (this.#DQM.search.hasOwnProperty(field_name)) {
            this.#root_element.value = this.#DQM.search[field_name]
        }
        // default listener
        this.#root_element.addEventListener('change', () => {
            if (this.#root_element.value !== '') {
                this.#DQM.search[field_name] = this.#root_element.value
            } else {
                delete this.#DQM.search[field_name]
            }
        })
    }
    add_listeners(listeners){
        // additional listeners
        listeners.forEach((item) => {
            this.#root_element.addEventListener(item[0], item[1])
        })
    }
}

// export {
//     SearchWidget
// }
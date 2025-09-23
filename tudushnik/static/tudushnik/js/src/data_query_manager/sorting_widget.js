import {
    get_dict_from_list_by_key_val,
    get_dict_n_index_from_list_by_key_val
} from "../utils/utils.js";

class SortingWidget {
    #DQM;
    #root_element;

    constructor(DQM, root_element) {
        this.#DQM = DQM
        this.#root_element = root_element
        const field_name = this.#root_element.getAttribute('data-field-name')
        const sort_value = this.#root_element.value
        // init widget by value
        let it = get_dict_n_index_from_list_by_key_val(this.#DQM.sorting, 'n', field_name)
        if (it !== false) {
            if (it.obj.n === field_name && it.obj.v === sort_value) {
                this.#root_element.innerHTML += it.index
                this.#root_element.classList.add('active')
            }
        }

        // default listener
        this.#root_element.addEventListener('click', () => {
            if (this.#root_element.classList.contains('active')) {
                for (let j = 0; j < this.#DQM.sorting.length; j++) {
                    if (this.#DQM.sorting[j].n === field_name) {
                        this.#DQM.sorting.splice(j, 1)
                    }
                }
            } else {
                let it = get_dict_from_list_by_key_val(this.#DQM.sorting, 'n', field_name)
                if (it !== false) {
                    it['v'] = sort_value
                } else {
                    this.#DQM.sorting.push({
                        'n': field_name, 'v': sort_value
                    })
                }
            }
            console.log(this.#DQM.sorting)
        })
    }

    add_listeners(listeners) {
        // additional listeners
        listeners.forEach((item) => {
            this.#root_element.addEventListener(item[0], item[1])
        })
    }
}

export {
    SortingWidget
}
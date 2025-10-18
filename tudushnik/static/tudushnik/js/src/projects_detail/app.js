import {pop_from_list} from "../utils/utils";
import {ModalWindow} from "../my_utils/modal_window";
import {SelectMultipleModalWindow} from "./modal_tasks_tags";

class App {
    #element;
    #DQM;
    #project;
    #query_params;
    #btns_show_modal;
    #tasks_tags_modal;
    #tasks_tags_current;
    #filter_modals = {
        tags: {
            button: null,
            modal: null,
        },
        status: {
            button: null,
            modal: null,
        },
    };

    constructor(root_element_selector, project, tags, status, data_query_manager) {
        this.#DQM = data_query_manager
        this.#element = document.querySelector(root_element_selector)
        this.#project = project
        this.#query_params = {
            tags: tags,
            status: status,
        }
        this.#btns_show_modal = document.querySelectorAll('.button_open_modal')
        for (let i = 0, button, field_name; i < this.#btns_show_modal.length; i++) {
            button = this.#btns_show_modal[i]
            field_name = button.getAttribute('data-field-name')
            this.#filter_modals[field_name].button = button
            //TODO: сделать универсальным, не только для тегов
            this.#filter_modals[field_name].modal = new SelectMultipleModalWindow({
                app: this,
                unique_id: `tasks_${field_name}_modal_buffer`,
                buttons: ['ok', 'cancel'],
                field_name: field_name
            });
            // this.#filter_modals[field_name].modal.append_content(button.nextElementSibling.firstElementChild)
            this.#filter_modals[field_name].modal.hide()
            document.body.appendChild(this.#filter_modals[field_name].modal.element)

        }

        // this.#tasks_tags_modal.hide()

        // this.#tasks_tags_current = document.querySelector('#tasks_tags_modal')
    }

    get project() {
        return this.#project
    }

    get tags() {
        return this.#query_params.tags
    }

    get status() {
        return this.#query_params.status
    }

    get tasks_tags_current_elements() {
        return this.#tasks_tags_current
    }

    init_query_params(urlSearchParams, query_param_key) {
        let values = urlSearchParams.get(query_param_key)
        if (values !== null) values = values.split(',')

        console.log(values)
        for (let i = 0, obj, inputs, pk_str; i < this.#query_params[query_param_key].length; i++) {
            obj = this.#query_params[query_param_key][i]
            pk_str = '' + obj.pk
            inputs = document.querySelectorAll(`object_${query_param_key} .object_pk_${obj.pk}`)
            for (let j = 0, input; j < inputs.length; j++) {
                input = inputs[j]
                if (values !== null && values.indexOf(pk_str) !== -1) {
                    input.setAttribute('checked', 'checked')
                }
                input.addEventListener('change', (evt) => {
                    console.log(input.checked)
                    let urlSearchParams = new URLSearchParams(window.location.search);

                    if (values !== null) {
                        if (input.checked) {
                            values.push(pk_str)
                            urlSearchParams.set(query_param_key, values.join(','))
                        } else {
                            pop_from_list(values, pk_str)
                            if (values.length !== 0) {
                                urlSearchParams.set(query_param_key, values.join(','))
                            } else {
                                urlSearchParams.delete(query_param_key)
                            }
                        }
                    } else {
                        urlSearchParams.set(query_param_key, tag.pk)
                    }

                    window.location.href = window.location.origin +
                        window.location.pathname + '?' + urlSearchParams.toString()

                })
            }


        }
    }

    init() {
        let urlSearchParams = new URLSearchParams(window.location.search);
        this.init_query_params(urlSearchParams, 'tags')
        this.init_query_params(urlSearchParams, 'status')

        this.#btns_show_modal.forEach((item) => {
            item.addEventListener('click', () => {
                const field_name = item.getAttribute('data-field-name')

                let cloned = item.nextElementSibling.firstElementChild.cloneNode(true)

                this.#filter_modals[field_name].modal.append_content(
                    cloned
                )
                this.#filter_modals[field_name].modal.show()
            })
        })
    }
}

export {
    App
}
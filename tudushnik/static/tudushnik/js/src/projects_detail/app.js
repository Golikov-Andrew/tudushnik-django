import {pop_from_list} from "../utils/utils";
import {ModalWindow} from "../my_utils/modal_window";
import {TasksTagsModalWindow} from "./modal_tasks_tags";

class App {
    #element;
    #project;
    #tags;
    #btn_show_tasks_tags_modal;
    #tasks_tags_modal;
    #tasks_tags_current;

    constructor(root_element_selector, project, tags) {
        this.#element = document.querySelector(root_element_selector)
        this.#project = project
        this.#tags = tags
        this.#btn_show_tasks_tags_modal = document.querySelector('.btn_show_tasks_tags_modal')
        this.#tasks_tags_modal = new TasksTagsModalWindow({
            app: this,
            unique_id: 'tasks_tags_modal_buffer',
            buttons: ['ok', 'cancel']
        });
        this.#tasks_tags_modal.hide()
        document.body.appendChild(this.#tasks_tags_modal.element)
        this.#tasks_tags_current = document.querySelector('#tasks_tags_modal')
    }

    get project() {
        return this.#project
    }

    get tags() {
        return this.#tags
    }

    get tasks_tags_current_elements(){
        return this.#tasks_tags_current
    }

    init() {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let tags_values = urlSearchParams.get('tags')
        if (tags_values !== null) tags_values = tags_values.split(',')

        console.log(tags_values)
        for (let i = 0, tag, inputs, pk_str; i < this.#tags.length; i++) {
            tag = this.#tags[i]
            pk_str = '' + tag.pk
            inputs = document.querySelectorAll(`.object_pk_${tag.pk}`)
            for (let j = 0, input; j < inputs.length; j++) {
                input = inputs[j]
                if (tags_values !== null && tags_values.indexOf(pk_str) !== -1) {
                    input.setAttribute('checked','checked')
                }
                input.addEventListener('change', (evt) => {
                    console.log(input.checked)
                    let urlSearchParams = new URLSearchParams(window.location.search);

                    if (tags_values !== null) {
                        if (input.checked) {
                            tags_values.push(pk_str)
                            urlSearchParams.set('tags', tags_values.join(','))
                        } else {
                            pop_from_list(tags_values, pk_str)
                            if (tags_values.length !== 0) {
                                urlSearchParams.set('tags', tags_values.join(','))
                            } else {
                                urlSearchParams.delete('tags')
                            }
                        }
                    } else {
                        urlSearchParams.set('tags', tag.pk)
                    }

                    window.location.href = window.location.origin +
                        window.location.pathname + '?' + urlSearchParams.toString()

                })
            }


        }

        this.#btn_show_tasks_tags_modal.addEventListener('click', () => {
            let cloned = document.querySelector('#tasks_tags_modal').cloneNode(true)
            this.#tasks_tags_modal.set_content(
                cloned.innerHTML
            )
            this.#tasks_tags_modal.show()
        })
    }
}

export {
    App
}
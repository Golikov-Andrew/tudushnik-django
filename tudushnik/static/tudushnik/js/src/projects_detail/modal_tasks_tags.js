import {ModalWindow} from "../my_utils/modal_window";
import {pop_from_list} from "../utils/utils";

class TasksTagsModalWindow extends ModalWindow {
    constructor(options) {
        super(options);
    }

    perform_ok() {
        console.log('OK')

        let urlSearchParams = new URLSearchParams(window.location.search);
        let tags_values = urlSearchParams.get('tags')
        if (tags_values !== null) tags_values = tags_values.split(',')
        let changes = 0;

        for (let i = 0, tag, input_new, input_current, pk_str; i < this.app.tags.length; i++) {
            tag = this.app.tags[i]
            pk_str = '' + tag.pk
            input_current = this.app.tasks_tags_current_elements.querySelector(`.object_pk_${pk_str}`)
            input_new = this.element.querySelector(`.object_pk_${pk_str}`)
            if (input_new.checked === input_current.checked) {
                continue;
            } else {
                changes++;
                if (tags_values !== null) {
                    if (input_new.checked) {
                        tags_values.push(pk_str)
                    } else {
                        pop_from_list(tags_values, pk_str)
                    }
                } else {
                    tags_values = []
                    tags_values.push(tag.pk)
                }
            }
            if (changes > 0) {
                if (tags_values !== null && tags_values.length > 0) {
                    urlSearchParams.set('tags', tags_values.join(','))
                } else {
                    urlSearchParams.delete('tags')
                }
                window.location.href = window.location.origin +
                    window.location.pathname + '?' + urlSearchParams.toString()
            }
        }
    }

    perform_cancel() {
        console.log('Cancel')
    }

    validate() {
        return true;
    }

    show_errors() {
        throw new Error('show_errors is not implemented!!!')
    }

}

export {
    TasksTagsModalWindow
}
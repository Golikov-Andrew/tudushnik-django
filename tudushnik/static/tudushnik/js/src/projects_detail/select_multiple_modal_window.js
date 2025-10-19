import {ModalWindow} from "../my_utils/modal_window";
import {remove_dict_from_list_by_key_val_if_exists} from "../utils/utils";

class SelectMultipleModalWindow extends ModalWindow {
    #field_name;

    constructor(options) {
        super(options);
        if (options.hasOwnProperty('field_name')) {
            this.#field_name = options.field_name
        }
    }

    perform_ok() {
        console.log('OK')

        let filters = this.app.DQM.filters;
        let widget = this.content.element.querySelector('select-multiple-widget')
        let new_filter_section = widget.create_filter_section()
        let prev_filter_section = get_dict_from_list_by_key_val(filters, 'n', this.#field_name)

        const change_filter_section = () => {
            remove_dict_from_list_by_key_val_if_exists(this.app.DQM.filters, 'n', this.#field_name)
            if (new_filter_section['v'] !== '') {
                this.app.DQM.filters.push(new_filter_section)
            }

        }

        if (prev_filter_section !== false) {
            const prev_filter_section_keys = Object.keys(prev_filter_section)
            const new_filter_section_keys = Object.keys(new_filter_section)
            if (prev_filter_section_keys.length !== new_filter_section_keys.length) {
                change_filter_section()
                this.app.DQM.apply_params()
                return
            }

            for (const k in new_filter_section) {
                if (prev_filter_section_keys.indexOf(k) === -1) {
                    change_filter_section()
                    this.app.DQM.apply_params()
                    return
                } else {
                    if (new_filter_section[k] !== prev_filter_section[k]) {
                        change_filter_section()
                        this.app.DQM.apply_params()
                        return
                    }
                }
            }

        } else {
            if (new_filter_section['v'] !== '') {
                filters.push(new_filter_section)
                this.app.DQM.apply_params()
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
    SelectMultipleModalWindow
}
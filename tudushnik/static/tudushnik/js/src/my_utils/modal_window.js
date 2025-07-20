import {DOMElem} from "../../dom_utils";

class ModalWindow {
    #unique_id;
    #app;

    constructor(options) {
        this.buttons = new DOMElem('div', {classes: ['buttons'], html: ''})
        this.content = new DOMElem('div', {classes: ['content'], html: ''})
        this.element = new DOMElem('div', {
            classes: ['modal'],
            children: [
                new DOMElem('div', {
                    classes: ['overlay'],
                    listeners: [
                        ['click', () => {
                            this.perform_cancel()
                            this.hide()
                        }]
                    ]
                }),
                new DOMElem('div', {
                    classes: ['window'], children: [
                        new DOMElem('div', {
                            classes: ['btn_close'], html: 'X', listeners: [
                                ['click', () => {
                                    this.perform_cancel()
                                    this.hide()
                                }]
                            ]
                        }),
                        this.content,
                        this.buttons,
                    ]
                })
            ]
        }).element;

        if (options !== undefined) {
            if (options.hasOwnProperty('app')) {
                this.#app = options.app
            }
            if (options.hasOwnProperty('unique_id')) {
                this.#unique_id = options.unique_id
                this.element.setAttribute('id', options.unique_id)
            }
            if (options.hasOwnProperty('buttons')) {
                if (options.buttons.indexOf('ok') !== -1)
                    this.buttons.element.appendChild(
                        new DOMElem('button', {
                            html: 'OK',
                            listeners: [
                                ['click', () => {
                                    if (this.validate()) {
                                        this.perform_ok()
                                        this.hide()
                                    } else {
                                        this.show_errors()
                                    }

                                }]
                            ]
                        }).element
                    );
                if (options.buttons.indexOf('cancel') !== -1)
                    this.buttons.element.appendChild(
                        new DOMElem('button', {
                            html: 'Отмена',
                            listeners: [
                                ['click', () => {
                                    this.perform_cancel()
                                    this.hide()
                                }]
                            ]
                        }).element
                    );
            }
        }

    }

    get app(){
        return this.#app;
    }

    hide() {
        hideElem(this.element)
    }

    show() {
        showElem(this.element)
    }

    remove_from(parent) {
        parent.removeChild(this.element)
        delete this
    }

    set_content(html) {
        this.content.element.innerHTML = html
    }

    perform_ok() {

    }

    perform_cancel() {

    }

    validate() {
        return true;
    }

    show_errors() {
        throw new Error('show_errors is not implemented!!!')
    }
}

export {
    ModalWindow
}
import {DOMElem} from "../../dom_utils";

class ModalWindow {
    constructor() {
        this.content = new DOMElem('div', {classes: ['content'], html: ''})
        this.element = new DOMElem('div', {
            classes: ['modal'], children: [
                new DOMElem('div', {
                    classes: ['overlay'], listeners: [
                        ['click', () => {
                            this.hide()
                        }]
                    ]
                }),
                new DOMElem('div', {
                    classes: ['window'], children: [
                        new DOMElem('div', {
                            classes: ['btn_close'], html: 'X', listeners: [
                                ['click', () => {
                                    this.hide()
                                }]
                            ]
                        }),
                        this.content,
                    ]
                })
            ]
        }).element
    }

    hide() {
        hideElem(this.element)
    }

    show() {
        showElem(this.element)
    }
    remove_from(parent){
        parent.removeChild(this.element)
        delete this
    }
    set_content(html){
        this.content.element.innerHTML = html
    }
}

export {
    ModalWindow
}
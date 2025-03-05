import {DOMElem} from "../../dom_utils";

class ModalWindow {
    constructor() {
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
                        new DOMElem('div', {classes: ['content'], html: 'test test test'}),
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
}

export {
    ModalWindow
}
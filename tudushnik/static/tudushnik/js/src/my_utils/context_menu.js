import {DOMElem} from "../../dom_utils";

class ContextMenuAction {
    #menu;
    #text;
    #element;

    constructor(text, onclick_function, onhover_function) {
        this.#text = text
        this.#element = new DOMElem('div', {
            html: this.#text,
            classes: ['btn_context_menu_action'],
            listeners: [
                ['click', onclick_function]
            ]
        }).element
        if (onhover_function !== undefined) this.#element.addEventListener('mouseover', onhover_function)
    }

    attach_menu(menu) {
        this.#menu = menu
    }

    get_element() {
        return this.#element
    }

    get menu() {
        return this.#menu;
    }
}

class ContextMenu {
    #app;
    #data;
    #event;
    #element;
    #overlay;
    #modal;
    #actions_list;


    constructor(options) {
        this.#actions_list = new DOMElem('div', {
            classes: ['actions_list']
        })
        this.#modal = new DOMElem('div', {
            classes: ['window'],
            children: [
                this.#actions_list
            ]
        }).element

        this.#overlay = new DOMElem('div', {
            classes: ['overlay'],
            listeners: [
                ['click', this.destroy.bind(this)]
            ]
        })

        this.#element = new DOMElem('div', {
            classes: ['context_menu', 'modal'],
            children: [
                this.#overlay,
                this.#modal
            ]
        }).element

        if (options !== undefined) {
            if (options.hasOwnProperty('app')) {
                this.#app = options.app
            }
            if (options.hasOwnProperty('data')) {
                this.#data = options.data
            }
            if (options.hasOwnProperty('event')) {
                this.#event = options.event
                this.#modal.style.top = `${this.#event.clientY}px`
                this.#modal.style.left = `${this.#event.clientX}px`
            }
            if (options.hasOwnProperty('actions')) {
                for (let i = 0; i < options.actions.length; i++) {
                    this.add_action(options.actions[i])
                }
            }
        }
    }

    add_action(action) {
        this.#actions_list.element.appendChild(action.get_element())
        action.attach_menu(this)
    }

    create() {
        document.body.appendChild(this.#element)
    }

    destroy() {
        document.body.removeChild(this.#element)
        delete this
    }
}

export {
    ContextMenu, ContextMenuAction
}
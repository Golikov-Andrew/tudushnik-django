class DOMElem {
    constructor(tag_name, options) {
        this.element = document.createElement(tag_name)
        if (options !== undefined) {
            if (options.hasOwnProperty('classes')) {
                for (let i = 0; i < options.classes.length; i++) {
                    this.element.classList.add(options.classes[i])
                }
            }
            if (options.hasOwnProperty('attrs')) { // id, data, e.t.c
                for (const attr in options.attrs) {
                    this.element.setAttribute(attr, options.attrs.attr)
                }
            }
            if (options.hasOwnProperty('children')) {
                for (let i = 0; i < options.children.length; i++) {
                    if(options.children[i] instanceof DOMElem){
                        this.element.appendChild(options.children[i].element)
                    }else{
                        this.element.appendChild(options.children[i])
                    }
                }
            }
            if (options.hasOwnProperty('html')) {
                this.element.innerHTML = options.html
            }
            if (options.hasOwnProperty('listeners')) {
                for (let i = 0, event_type, listener; i < options.listeners.length; i++) {
                    event_type = options.listeners[i][0]
                    listener = options.listeners[i][1]
                    this.element.addEventListener(event_type, listener)
                }
            }
        }
    }
}

export {
    DOMElem
}
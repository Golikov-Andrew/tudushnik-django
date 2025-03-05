import {DOMElem} from "../../dom_utils";

class Viewport {
    constructor(calendar) {
        this.calendar = calendar
        this.timeline_label = new DOMElem('div', {
            classes: ['timeline_label']
        })
        this.cols_labels = new DOMElem('div', {
            classes: ['cols_labels']
        })
        this.head = new DOMElem('div', {
            classes: ['head'], children: [
                this.timeline_label, this.cols_labels
            ]
        })
        this.timeline = new DOMElem('div', {
            classes: ['timeline']
        })
        this.calendar_grid = new DOMElem('div', {
            classes: ['calendar_grid']
        })
        this.body = new DOMElem('div', {
            classes: ['body'], children: [
                this.timeline, this.calendar_grid
            ]
        })
        this.element = new DOMElem('div', {
            classes: ['viewport'],
            children: [
                this.head, this.body
            ]
        }).element
    }
}

export{
    Viewport
}
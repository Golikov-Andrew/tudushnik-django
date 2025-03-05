import {DOMElem} from "../../dom_utils";

class ViewAbstract {
    constructor(view_type, label_text) {
        this.view_type = view_type
        this.value = ''
        this.label_element = new DOMElem('div', {
                classes: ['label'], listeners: [
                    ['click', (evt) => {
                        console.log(this.view_type)
                    }]
                ], html: label_text
            }
        ).element
        this.value_element = new DOMElem('div', {
            classes: ['value'], listeners: [
                ['click', (evt) => {
                    console.log(this.value)
                }]
            ], html: this.value
        }).element
        this.element = new DOMElem('div', {
            classes: ['view_type'], children: [
                this.label_element, this.value_element
            ]
        }).element
    }
    redraw(){

    }
    create_values_list(){

    }
}

class ViewYear extends ViewAbstract {
    constructor() {
        super('year', 'Год');
    }
}

class ViewMonth extends ViewAbstract {
    constructor() {
        super('month', 'Месяц');
    }
}

class ViewWeek extends ViewAbstract {
    constructor() {
        super('week', 'Неделя');
    }
}

class ViewDay extends ViewAbstract {
    constructor() {
        super('day', 'День');
    }
}

class SelectedView {
    constructor() {
        this.views = {
            year: new ViewYear(),
            month: new ViewMonth(),
            week: new ViewWeek(),
            day: new ViewDay(),
        }
        this.selected_view = this.views.year
        this.element = new DOMElem('div', {
            classes: ['selected_view'], children: [
                this.views.year.element,
                this.views.month.element,
                this.views.week.element,
                this.views.day.element,
            ]
        }).element
    }

    redraw() {

    }
}

export {
    SelectedView
}
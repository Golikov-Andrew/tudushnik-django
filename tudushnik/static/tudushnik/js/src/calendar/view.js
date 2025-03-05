import {DOMElem} from "../../dom_utils";
import {ModalWindow} from "../my_utils/modal_window";

class ViewAbstract {
    constructor(selected_view, view_type, label_text) {
        this.selected_view = selected_view
        this.view_type = view_type
        this.value = ''
        this.modal_window = null
        this.label_element = new DOMElem('div', {
                classes: ['label'], listeners: [
                    ['click', (evt) => {
                        this.selected_view.select_view(this.view_type)
                    }]
                ], html: label_text
            }
        ).element
        this.value_element = new DOMElem('div', {
            classes: ['value'], listeners: [
                ['click', (evt) => {
                    this.modal_window = new ModalWindow()
                    document.body.appendChild(this.modal_window.element)
                    this.modal_window.show()
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
    set_value(value){
        this.value = value
        this.value_element.innerHTML = value
    }
}

class ViewYear extends ViewAbstract {
    constructor(calendar) {
        super(calendar, 'year', 'Год');
    }
}

class ViewMonth extends ViewAbstract {
    constructor(calendar) {
        super(calendar, 'month', 'Месяц');
    }
}

class ViewWeek extends ViewAbstract {
    constructor(calendar) {
        super(calendar, 'week', 'Неделя');
    }
}

class ViewDay extends ViewAbstract {
    constructor(calendar) {
        super(calendar, 'day', 'Дата');
    }
}

class SelectedView {
    constructor() {
        this.views = {
            year: new ViewYear(this),
            month: new ViewMonth(this),
            week: new ViewWeek(this),
            day: new ViewDay(this),
        }
        this.selected_view = null
        this.element = new DOMElem('div', {
            classes: ['selected_view'], children: [
                this.views.year.element,
                this.views.month.element,
                this.views.week.element,
                this.views.day.element,
            ]
        }).element
    }
    set_value(view, value){
        this.views[view].set_value(value)
    }
    select_view(view_type){
        if(this.selected_view !== null){
            this.selected_view.element.classList.remove('selected')
        }
        this.selected_view = this.views[view_type]
        this.selected_view.element.classList.add('selected')
        console.log('view selected ->', this.selected_view.view_type)
    }

    redraw() {

    }
}

export {
    SelectedView
}
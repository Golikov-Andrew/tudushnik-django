import {DOMElem} from "../../dom_utils";
import {ModalWindow} from "../my_utils/modal_window";
import Moment from 'moment';
import {extendMoment} from 'moment-range';

const moment = extendMoment(Moment);

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
                    this.modal_window.hide = () => {
                        hideElem(this.modal_window.element)
                        this.modal_window.remove_from(document.body)
                    }
                    this.modal_window.set_content(this.create_values_list(this.value).outerHTML)
                    let elems = this.modal_window.element.querySelectorAll('.option_element')
                    for (let i = 0; i <elems.length; i++) {
                        elems[i].addEventListener('click',(evt)=>{
                            this.set_value(evt.target.innerHTML.trim())
                            this.modal_window.hide()
                        })
                    }
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

    redraw() {

    }

    create_values_list() {
        return ''
    }

    set_value(value) {
        this.value = value
        this.value_element.innerHTML = value
    }
}

class ViewYear extends ViewAbstract {
    constructor(calendar) {
        super(calendar, 'year', 'Год');
    }

    create_values_list(old_value) {
        let old_year = moment(old_value, 'YYYY')
        let start = old_year.clone().subtract(5, 'years')
        let end = old_year.clone().add(5, 'years')
        let range = moment.range(start, end)
        // let values_elems = []
        let select_element = new DOMElem('div', {classes: ['select_element']}).element
        let new_elem = null
        for (let y of range.by('year')) {
            new_elem = new DOMElem('div', {
                classes: ['option_element'], html: y.format('YYYY')
            }).element
            select_element.appendChild(new_elem)
            // new_elem.addEventListener('click', (evt)=>{
            //     console.log(456)
            //     // this.modal_window.hide()
            // })
            // values_elems.push();
        }
        return select_element
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

    set_value(view, value) {
        this.views[view].set_value(value)
    }

    select_view(view_type) {
        if (this.selected_view !== null) {
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
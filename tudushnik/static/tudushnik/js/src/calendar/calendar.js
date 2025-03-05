import {SelectedView} from "./view";
import {CurrentDate} from "./current_date";

class Calendar {
    constructor(element) {
        this.element = element
        this.selected_interval = {
            year: '2025',
            month: '03',
            week: '10',
            day: '05',
        }
        this.selected_view = new SelectedView()
        this.current_date = new CurrentDate(moment())

    }

    init(options) {
        this.create_gui()
        this.redraw_now()
        // this.fetch_tasks()
        this.redraw_view()

    }

    create_gui() {
        this.element.appendChild(this.current_date.element)
        this.element.appendChild(this.selected_view.element)
    }

    redraw_now() {

    }

    fetch_tasks() {

    }

    redraw_view() {

    }
}

export {
    Calendar
}
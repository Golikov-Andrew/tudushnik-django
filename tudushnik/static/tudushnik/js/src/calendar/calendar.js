import {SelectedView} from "./view";
import {CurrentDate} from "./current_date";
import {Viewport} from "./viewport";


class Calendar {
    constructor(element) {
        this.element = element
        this.selected_view = new SelectedView()
        this.current_date = new CurrentDate(moment())
        this.viewport = new Viewport(this)
        this.selected_interval = {
            year: this.current_date.get('year'),
            month: this.current_date.get('month'),
            week: this.current_date.get('week'),
            day: this.current_date.get('day'),
        }

    }

    init(options) {
        this.create_gui()
        // this.redraw_now()
        // this.fetch_tasks()
        this.redraw_view()

    }

    create_gui() {
        this.element.appendChild(this.current_date.element)
        this.element.appendChild(this.selected_view.element)
        this.selected_view.set_value('year', this.selected_interval.year)
        this.selected_view.set_value('month', this.selected_interval.month)
        this.selected_view.set_value('week', this.selected_interval.week)
        this.selected_view.set_value('day', this.selected_interval.day)
        this.select_view('year')
        this.element.appendChild(this.viewport.element)
    }

    select_view(view_type){
        this.selected_view.select_view(view_type)
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
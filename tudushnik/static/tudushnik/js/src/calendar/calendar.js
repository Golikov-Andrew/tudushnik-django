import {SelectedView} from "./view";
import {CurrentDate} from "./current_date";
import {Viewport} from "./viewport";
import moment from "moment/moment";


class Calendar {
    constructor(element) {
        this.element = element
        this.selected_view = new SelectedView(this)
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

    select_view(view_type) {
        this.selected_view.select_view(view_type)
    }

    redraw_now() {

    }

    fetch_tasks() {

    }

    redraw_view() {
        this.selected_view.selected_view.redraw()
    }

    validate_date(view_type) {
        let moment_to_check = moment(`${this.selected_interval.year}-${this.selected_interval.month}-${this.selected_interval.week}-${this.selected_interval.day}`,
            'YYYY-MM-WW-DD')
        moment_to_check.locale('ru')
        // console.log(moment_to_check)
        // console.log(view_type)
        // console.log('is valid? : ', moment_to_check.isValid())
        if (view_type !== 'week') {
            // console.log('NOT WEEK')
            if (!moment_to_check.isValid()) {
                this.selected_interval.day = '01'
                this.selected_view.set_value('day', '01')
                // console.log('day changed')
            }
            let new_week_value = moment(`${this.selected_interval.year}-${this.selected_interval.month}-${this.selected_interval.day}`,
            'YYYY-MM-DD').format('WW')
            this.selected_view.set_value('week', new_week_value)
        }else{
            // console.log('WEEK')
            let check_moment = moment(`${this.selected_interval.year}-${this.selected_interval.month}-${this.selected_interval.day}`,'YYYY-MM-DD')
            check_moment.locale('ru')
            let check_week_value = check_moment.format('WW')
            if (check_week_value !== this.selected_interval.week) {
                let new_moment = moment(`${this.selected_interval.year}-${this.selected_interval.week}`,'YYYY-WW')
                new_moment.locale('ru')
                let start = moment(new_moment).startOf('week')
                this.selected_interval.day = start.format('DD')
                this.selected_view.set_value('day', start.format('DD'))
                this.selected_interval.month = start.format('MM')
                this.selected_view.set_value('month', start.format('MM'))
                // console.log('day changed', start.format('DD'))
            }
        }
    }
}

export {
    Calendar
}
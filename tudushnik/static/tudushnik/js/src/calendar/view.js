import {DOMElem} from "../../dom_utils";
import {ModalWindow} from "../my_utils/modal_window";

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

class ViewAbstract {
    constructor(calendar, selected_view, view_type, label_text) {
        this.calendar = calendar
        this.selected_view = selected_view
        this.view_type = view_type
        this.value = ''
        this.modal_window = null
        this.weekdays_labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        this.label_element = new DOMElem('div', {
                classes: ['label'], listeners: [
                    ['click', (evt) => {
                        this.selected_view.select_view(this.view_type)
                        this.selected_view.selected_view.redraw()
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
                    for (let i = 0; i < elems.length; i++) {
                        elems[i].addEventListener('click', (evt) => {
                            this.set_value(evt.target.innerHTML.trim())
                            this.modal_window.hide()
                            this.calendar.validate_date(this.view_type)
                            this.selected_view.selected_view.redraw()
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
        console.log(this.calendar)
    }

    create_values_list() {
        return ''
    }

    set_value(value) {
        this.value = value
        this.value_element.innerHTML = value
        this.calendar.selected_interval[this.view_type] = value
    }

    create_row_label(month_val, week_val, year_val) {
        let elem = new DOMElem('div', {
            attrs: {
                data_week: week_val, data_month: month_val, data_year: year_val
            }, classes: ['row_label_content'], html: `${month_val} - ${week_val}`
        }).element
        if (this.calendar.current_date.get('month') === month_val &&
            this.calendar.current_date.get('week') === week_val &&
            this.calendar.current_date.get('year') === year_val
        ) {
            elem.classList.add('current_interval')
        }
        return elem;
    }

    create_cell(moment_day) {
        let elem = new DOMElem('div', {
            attrs: {
                data_week: moment_day.format('WW'),
                data_month: moment_day.format('MM'),
                data_year: moment_day.format('YYYY'),
                data_date: moment_day.format('DD')
            }, classes: ['cell_content'], children:[
                new DOMElem('div',{html: moment_day.format('DD')}),
                new DOMElem('div',{classes: ['calendar_tasks_container']})
            ]
        }).element
        if (this.calendar.current_date.get('month') === moment_day.format('MM') &&
            this.calendar.current_date.get('week') === moment_day.format('WW') &&
            this.calendar.current_date.get('year') === moment_day.format('YYYY') &&
            this.calendar.current_date.get('day') === moment_day.format('DD')
        ) {
            elem.classList.add('current_interval')
        }
        if (this.calendar.selected_interval.month === moment_day.format('MM') &&
            this.calendar.selected_interval.week === moment_day.format('WW') &&
            this.calendar.selected_interval.year === moment_day.format('YYYY') &&
            this.calendar.selected_interval.day === moment_day.format('DD')
        ) {
            elem.classList.add('selected_interval')
        }
        return elem;
    }
}

class ViewYear extends ViewAbstract {
    constructor(calendar, selected_view) {
        super(calendar, selected_view, 'year', 'Год');
    }

    create_values_list(old_value) {
        let old_year = moment(old_value, 'YYYY')
        let start = old_year.clone().subtract(5, 'years')
        let end = old_year.clone().add(5, 'years')
        let range = moment.range(start, end)
        let select_element = new DOMElem('div', {classes: ['select_element']}).element
        let new_elem = null
        for (let y of range.by('year')) {
            new_elem = new DOMElem('div', {
                classes: ['option_element'], html: y.format('YYYY')
            }).element
            select_element.appendChild(new_elem)
        }
        return select_element
    }

    redraw() {
        console.log('ViewYear.redraw()')
        this.calendar.viewport.redraw_timeline_label('Месяц - Неделя')
        this.calendar.viewport.redraw_cols_labels(this.weekdays_labels)

        let rows_labels_list = []
        let cell_list = [] // 2d array
        let moment_selected_year = moment([this.calendar.selected_interval.year, '01'])
        moment_selected_year.locale('ru')
        let start = moment(moment_selected_year).startOf('year')
        let end = moment(moment_selected_year).endOf('year')
        let my_range = moment.range(start, end);
        let new_row;
        let week_range;
        for (let rangeKey of my_range.by('weeks')) {
            rows_labels_list.push(this.create_row_label(rangeKey.format('MM'), rangeKey.format('WW'), rangeKey.format('YYYY')))
            new_row = []
            week_range = moment.range(
                moment(rangeKey).startOf('week'),
                moment(rangeKey).endOf('week')
            );
            for (let day of week_range.by('days')) {
                new_row.push(this.create_cell(day))
            }
            cell_list.push(new_row)
        }
        this.calendar.viewport.redraw_timeline(rows_labels_list)
        this.calendar.viewport.redraw_cells(cell_list)
    }


}

class ViewMonth extends ViewAbstract {
    constructor(calendar, selected_view) {
        super(calendar, selected_view, 'month', 'Месяц');
    }

    create_values_list(old_value) {
        let options_elems = []
        for (let i = 1; i <= 12; i++) {
            options_elems.push(new DOMElem('div', {
                classes: ['option_element'], html: ('' + i).padStart(2, '0')
            }))
        }
        return new DOMElem('div', {classes: ['select_element'], children: options_elems}).element
    }

    redraw() {
        console.log('ViewMonth.redraw()')

        this.calendar.viewport.redraw_cols_labels(this.weekdays_labels)

        let rows_labels_list = []
        let cell_list = [] // 2d array
        let moment_selected = moment([this.calendar.selected_interval.year, this.calendar.selected_interval.month - 1])
        moment_selected.locale('ru')
        this.calendar.viewport.redraw_timeline_label(`${moment_selected.format('MMM')} - Неделя`)
        let my_range = moment.range(
            moment(moment_selected).startOf('month'),
            moment(moment_selected).endOf('month')
        );
        let new_row;
        let week_range;
        for (let rangeKey of my_range.by('weeks')) {
            rows_labels_list.push(this.create_row_label(rangeKey.format('MM'), rangeKey.format('WW'), rangeKey.format('YYYY')))
            new_row = []
            week_range = moment.range(
                moment(rangeKey).startOf('week'),
                moment(rangeKey).endOf('week')
            );
            for (let day of week_range.by('days')) {
                new_row.push(this.create_cell(day))
            }
            cell_list.push(new_row)
        }
        this.calendar.viewport.redraw_timeline(rows_labels_list)
        this.calendar.viewport.redraw_cells(cell_list)
    }

}

class ViewWeek extends ViewAbstract {
    constructor(calendar, selected_view) {
        super(calendar, selected_view, 'week', 'Неделя');
    }

    create_values_list(old_value) {
        let old_moment = moment([this.calendar.selected_interval.year, this.calendar.selected_interval.month - 1])
        let start = moment(old_moment).startOf('month')
        let end = moment(old_moment).endOf('month')
        let range = moment.range(start, end)
        let select_element = new DOMElem('div', {classes: ['select_element']}).element
        let new_elem = null
        for (let week of range.by('weeks')) {
            new_elem = new DOMElem('div', {
                classes: ['option_element'], html: week.format('WW')
            }).element
            select_element.appendChild(new_elem)
        }
        return select_element
    }

    redraw() {
        console.log('ViewWeek.redraw()')
        this.calendar.viewport.redraw_cols_labels(this.weekdays_labels)

        let rows_labels_list = []
        let cell_list = [] // 2d array
        let moment_selected = moment([this.calendar.selected_interval.year, this.calendar.selected_interval.month - 1])
        moment_selected.locale('ru')
        this.calendar.viewport.redraw_timeline_label(`${moment_selected.format('MMM')} - Неделя`)
        let my_range = moment.range(
            moment(moment_selected).startOf('month'),
            moment(moment_selected).endOf('month')
        );
        let new_row;
        let week_range;
        for (let week of my_range.by('weeks')) {
            // console.log(week.format('WW'))
            if (week.format('WW') === this.calendar.selected_interval.week) {
                rows_labels_list.push(this.create_row_label(week.format('MM'), week.format('WW'), week.format('YYYY')))
                new_row = []
                week_range = moment.range(
                    moment(week).startOf('week'),
                    moment(week).endOf('week')
                );
                for (let day of week_range.by('days')) {
                    new_row.push(this.create_cell(day))
                }
                cell_list.push(new_row)
            }
        }
        this.calendar.viewport.redraw_timeline(rows_labels_list)
        this.calendar.viewport.redraw_cells(cell_list)
    }

}

class ViewDay extends ViewAbstract {
    constructor(calendar, selected_view) {
        super(calendar, selected_view, 'day', 'Дата');
    }

    create_values_list(old_value) {
        let old_moment = moment([this.calendar.selected_interval.year, this.calendar.selected_interval.month - 1])
        let range = moment.range(moment(old_moment).startOf('month'), moment(old_moment).endOf('month'))
        let select_element = new DOMElem('div', {classes: ['select_element']}).element
        let new_elem = null
        for (let day of range.by('days')) {
            new_elem = new DOMElem('div', {
                classes: ['option_element'], html: day.format('DD')
            }).element
            select_element.appendChild(new_elem)
        }
        return select_element
    }

    redraw() {
        console.log('ViewDay.redraw()')

        let rows_labels_list = []
        let cell_list = [] // 2d array
        let moment_selected = moment([this.calendar.selected_interval.year, this.calendar.selected_interval.month - 1, this.calendar.selected_interval.day])
        moment_selected.locale('ru')
        this.calendar.viewport.redraw_cols_labels([`${moment_selected.format('DD')} ${moment_selected.format('MMM')}, ${moment_selected.format('ddd')}`])
        this.calendar.viewport.redraw_timeline_label(`Время`)
        let my_range = moment.range(
            moment(moment_selected).startOf('day'),
            moment(moment_selected).endOf('day')
        );
        let new_row;
        for (let hour of my_range.by('hours')) {
            rows_labels_list.push(this.create_row_label(hour))
            new_row = []
            new_row.push(this.create_cell(hour))
            cell_list.push(new_row)
        }
        this.calendar.viewport.redraw_timeline(rows_labels_list)
        this.calendar.viewport.redraw_cells(cell_list)
    }

    create_row_label(hour) {
        return new DOMElem('div', {
            attrs: {
                data_week: hour.format('WW'), data_month: hour.format('MM'),
                data_year: hour.format('YYYY'), data_hour: hour.format('HH')
            }, classes: ['row_label_content'], html: hour.format('HH:mm')
        }).element;
    }

    create_cell(moment_hour) {
        return new DOMElem('div', {
            attrs: {
                data_week: moment_hour.format('WW'),
                data_month: moment_hour.format('MM'),
                data_year: moment_hour.format('YYYY'),
                data_date: moment_hour.format('DD'),
                data_hour: moment_hour.format('HH')
            }, classes: ['cell_content'], html: moment_hour.format('HH:mm')
        }).element
    }
}

class SelectedView {
    constructor(calendar) {
        this.calendar = calendar
        this.views = {
            year: new ViewYear(this.calendar, this),
            month: new ViewMonth(this.calendar, this),
            week: new ViewWeek(this.calendar, this),
            day: new ViewDay(this.calendar, this),
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
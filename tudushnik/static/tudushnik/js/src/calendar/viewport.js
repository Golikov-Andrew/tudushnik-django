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
    redraw_timeline_label(label_text) {
        this.timeline_label.element.innerHTML = label_text
    }
    redraw_cols_labels(labels_list) {
        this.cols_labels.element.innerHTML = ''
        for (let i = 0; i < labels_list.length; i++) {
            this.cols_labels.element.appendChild(this.create_cols_label(labels_list[i]))
        }
    }
    redraw_timeline(labels_list) {
        this.timeline.element.innerHTML = ''
        for (let i = 0; i < labels_list.length; i++) {
            this.timeline.element.appendChild(this.create_rows_label(labels_list[i]))
        }
    }
    redraw_cells(rows_list) {
        this.calendar_grid.element.innerHTML = ''
        for (let i = 0, new_row, cur_row; i < rows_list.length; i++) {
            cur_row = rows_list[i]
            new_row = this.create_row()
            this.calendar_grid.element.appendChild(new_row)
            for (let j = 0; j < cur_row.length; j++) {
                new_row.appendChild(this.create_cell(cur_row[j]))
            }
        }
    }

    create_cols_label(text) {
        return new DOMElem('div', {classes: ['col_label'], html: text}).element
    }

    create_rows_label(content) {
        return new DOMElem('div', {classes: ['row_label'], children: [content]}).element
    }

    create_row() {
        return new DOMElem('div', {classes: ['row']}).element
    }

    create_cell(content) {
        return new DOMElem('div', {classes: ['cell'], children: [content]}).element
    }

    redraw_task(task) {
        let task_begin_at_moment = moment(task.begin_at)
        let year = task_begin_at_moment.format('YYYY')
        let month = task_begin_at_moment.format('MM')
        let date = task_begin_at_moment.format('DD')
        let hour = task_begin_at_moment.format('HH')
        let cell_content = null;
        if (this.calendar.selected_view.selected_view === this.calendar.selected_view.views.day) {
            cell_content = this.calendar_grid.element.querySelector(`.cell_content[data_year="${year}"][data_month="${month}"][data_date="${date}"][data_hour="${hour}"] .calendar_tasks_container`)
        } else {
            cell_content = this.calendar_grid.element.querySelector(`.cell_content[data_year="${year}"][data_month="${month}"][data_date="${date}"] .calendar_tasks_container`)
        }

        if (cell_content !== null) {
            console.log('task', task)
            let new_task_widget_element = new DOMElem('div', {
                classes: ['task_widget'],
                html: `${task.title} - ${task.content}`,
                // attrs: {'style':''}
            }).element
            new_task_widget_element.style.backgroundColor = `${this.calendar.projects[task.project_id].color}`;
            cell_content.appendChild(new_task_widget_element)
            if (this.calendar.selected_view.selected_view === this.calendar.selected_view.views.day) {
                new_task_widget_element.addEventListener('click', () => {
                    window.location.href = `/tasks/detail/${task.id}/`

                })
            }
        }


    }
}

export {
    Viewport
}
import "jquery";
import moment from "moment";

class Task {
    constructor(task_obj, viewport_dt_line, tasks_container_elem) {
        Object.assign(this, task_obj)
        this.viewport_dt_line = viewport_dt_line
        this.tasks_container_elem = tasks_container_elem
        this.elem = document.createElement('div')
        this.elem.classList.add('task_elem')
        this.dropTaskHandler;
        this.stopEditWidthHandler;
        this.moveTaskHandler;
        this.editWidthHandler;
        let anchor_elem = document.createElement('div')
        anchor_elem.innerHTML = '&#8226;'
        anchor_elem.classList.add('task_tool')
        anchor_elem.classList.add('to_move_x')
        anchor_elem.addEventListener('mousedown', (evt) => {
            if (evt.button === 0) {

                this.create_task_avatar(evt, `x: ${this.diagram_offset_x}\nbegin_at: ${this.begin_at}`)
                this.dropTaskHandler = this.dropTask.bind(this)
                this.moveTaskHandler = this.moveTask.bind(this)
                window.addEventListener('mouseup', this.dropTaskHandler)
                window.addEventListener('mousemove', this.moveTaskHandler)
            }
        })

        let width_ctrl_elem = document.createElement('div')
        width_ctrl_elem.innerHTML = '&#8660;'
        width_ctrl_elem.classList.add('task_tool')
        width_ctrl_elem.classList.add('to_edit_width')
        width_ctrl_elem.addEventListener('mousedown', (evt) => {
            if (evt.button === 0) {
                this.create_task_avatar(evt, `width: ${this.width}`)
                this.hide_task_elem()
                this.stopEditWidthHandler = this.stopEditWidthTask.bind(this)
                this.editWidthHandler = this.editWidthTask.bind(this)
                window.addEventListener('mouseup', this.stopEditWidthHandler)
                window.addEventListener('mousemove', this.editWidthHandler)
            }
        })

        let duration_ctrl_elem = document.createElement('div')
        duration_ctrl_elem.innerHTML = '&#8661;'
        duration_ctrl_elem.classList.add('task_tool')
        duration_ctrl_elem.classList.add('to_edit_duration')
        duration_ctrl_elem.addEventListener('mousedown', (evt) => {
            if (evt.button === 0) {
                this.create_task_avatar(evt, `duration: ${moment.duration(this.duration, 'seconds').format('h [hours] :mm [minutes]')}`)
                this.hide_task_elem()
                this.stopEditDurationHandler = this.stopEditDurationTask.bind(this)
                this.editDurationHandler = this.editDurationTask.bind(this)
                window.addEventListener('mouseup', this.stopEditDurationHandler)
                window.addEventListener('mousemove', this.editDurationHandler)
            }
        })

        let title_elem = document.createElement('div')
        title_elem.innerText = this.title
        title_elem.style.display = 'inline-block'
        this.description_elem = document.createElement('div')
        this.begin_at_elem = document.createElement('div')
        this.duration_elem = document.createElement('div')
        this.description_elem.classList.add('task_content')
        this.begin_at_elem.classList.add('task_begin_at')
        this.duration_elem.classList.add('task_duration')
        this.begin_at_elem.style.display = 'inline-block'
        this.duration_elem.style.display = 'inline-block'
        this.description_elem.style.display = 'inline-block'
        this.elem.append(anchor_elem)
        this.elem.append(title_elem)
        this.elem.append(this.begin_at_elem)
        this.elem.append(this.description_elem)
        this.elem.append(width_ctrl_elem)
        this.elem.append(this.duration_elem)
        this.elem.append(duration_ctrl_elem)
        this.elem.height = 20
        this.current_task_avatar = undefined
        this.tooltip = undefined
    }

    hide_task_elem() {
        this.elem.classList.add('hidden')
    }

    show_task_elem() {
        this.elem.classList.remove('hidden')
    }

    calc_new_begin_at(current_moment_line_top_val, new_top, height_of_task_elem) {
        let pixel_offset = current_moment_line_top_val - (new_top + height_of_task_elem)
        let min_difference = this.viewport_dt_line.scale.get_y_min_per_px() * pixel_offset
        return moment(this.viewport_dt_line.now_moment + moment.duration(min_difference, 'minutes')).format('Y-MM-DDTHH:mm:ss')
    }

    calc_new_duration(new_height_of_task_elem) {
        return new_height_of_task_elem * this.viewport_dt_line.scale.get_y_min_per_px() * 60
    }

    create_tooltip(evt, initial_tooltip_text) {
        this.tooltip = document.createElement('div')
        this.tooltip.innerText = initial_tooltip_text
        this.tooltip.classList.add('task_tooltip')
        this.tasks_container_elem.append(this.tooltip)
        this.tooltip.style.top = evt.clientY - 50 + 'px'
        this.tooltip.style.left = evt.clientX - 50 + 'px'

    }

    remove_tooltip() {
        this.tasks_container_elem.removeChild(this.tooltip)
        this.tooltip = undefined
    }

    create_task_avatar(evt, initial_tooltip_text) {
        this.current_task_avatar = this.elem.cloneNode(true)
        this.create_tooltip(evt, initial_tooltip_text)
        this.tasks_container_elem.append(this.current_task_avatar)
    }

    remove_task_avatar() {
        this.remove_tooltip()
        this.tasks_container_elem.removeChild(this.current_task_avatar)
        this.current_task_avatar = undefined
    }

    dropTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let diagram_offset_x = parseInt(this.current_task_avatar.style.left)
        let new_top = parseInt(this.current_task_avatar.style.top)
        let new_begin_at = this.calc_new_begin_at(
            this.viewport_dt_line.current_moment_line.top_val,
            new_top,
            parseFloat(this.current_task_avatar.style.height)
        )
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/update_attrs',
            data: JSON.stringify({
                'task_id': this.pk,
                'diagram_offset_x': diagram_offset_x,
                'begin_at': new_begin_at,
            }),
            success: (data) => {
                if (data.success === true) {
                    let cur_task_obj = this.viewport_dt_line.tasks[data.task_id]
                    cur_task_obj = Object.assign(cur_task_obj, data)
                    console.log(data, cur_task_obj)
                    this.remove_task_avatar()
                    window.removeEventListener('mouseup', this.dropTaskHandler)
                    window.removeEventListener('mousemove', this.moveTaskHandler)
                    this.viewport_dt_line.draw_task(cur_task_obj)
                } else {
                    alert(data.error_message);
                    this.remove_task_avatar()
                    window.removeEventListener('mouseup', this.dropTaskHandler)
                    window.removeEventListener('mousemove', this.moveTaskHandler)
                }
            },
            dataType: 'json'
        });
    }

    stopEditWidthTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let new_width = parseInt(this.current_task_avatar.style.width)
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/update_attrs',
            data: JSON.stringify({
                'task_id': this.pk,
                'width': new_width
            }),
            success: (data) => {
                if (data.success === true) {
                    let cur_task_obj = this.viewport_dt_line.tasks[data.task_id]
                    cur_task_obj = Object.assign(cur_task_obj, data)
                    console.log(data, cur_task_obj)
                    this.remove_task_avatar()
                    this.show_task_elem()
                    window.removeEventListener('mouseup', this.stopEditWidthHandler)
                    window.removeEventListener('mousemove', this.editWidthHandler)
                    this.viewport_dt_line.draw_task(cur_task_obj)
                } else {
                    alert(data.error_message);
                    this.remove_task_avatar()
                    this.show_task_elem()
                    window.removeEventListener('mouseup', this.stopEditWidthHandler)
                    window.removeEventListener('mousemove', this.editWidthHandler)
                }
            },
            dataType: 'json'
        });
    }

    stopEditDurationTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let new_height = parseFloat(this.current_task_avatar.style.height)
        // let new_top = parseInt(this.current_task_avatar.style.top)
        let new_duration = this.calc_new_duration(new_height)
        console.log(new_duration)
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/update_attrs',
            data: JSON.stringify({
                'task_id': this.pk,
                'duration': new_duration
            }),
            success: (data) => {
                if (data.success === true) {
                    let cur_task_obj = this.viewport_dt_line.tasks[data.task_id]
                    cur_task_obj = Object.assign(cur_task_obj, data)
                    console.log(data, cur_task_obj)
                    this.remove_task_avatar()
                    this.show_task_elem()
                    window.removeEventListener('mouseup', this.stopEditDurationHandler)
                    window.removeEventListener('mousemove', this.editDurationHandler)
                    this.viewport_dt_line.draw_task(cur_task_obj)
                } else {
                    alert(data.error_message);
                    this.remove_task_avatar()
                    this.show_task_elem()
                    window.removeEventListener('mouseup', this.stopEditDurationHandler)
                    window.removeEventListener('mousemove', this.editDurationHandler)
                }
            },
            dataType: 'json'
        });
    }

    editDurationTask(evt){
        evt.preventDefault();
        evt.stopPropagation();
        let cur_top = parseInt(this.current_task_avatar.style.top)
        let new_top = cur_top + evt.movementY
        let height_of_task_elem = parseFloat(this.current_task_avatar.style.height)
        let new_height = height_of_task_elem - evt.movementY
        this.current_task_avatar.style.top = new_top + 'px'
        this.current_task_avatar.style.height = new_height + 'px'
        this.tooltip.style.top = evt.clientY - 50 + 'px'
        this.tooltip.style.left = evt.clientX - 50 + 'px'
        let new_dur = this.calc_new_duration(new_height)
        this.tooltip.innerText = `duration: ${moment.duration(new_dur, 'seconds').format('h [hours] :mm [minutes]')}`
    }

    moveTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let cur_top = parseInt(this.current_task_avatar.style.top)
        let cur_left = parseInt(this.current_task_avatar.style.left)
        let new_top = cur_top + evt.movementY
        let height_of_task_elem = parseFloat(this.current_task_avatar.style.height)
        let new_left = cur_left + evt.movementX
        this.current_task_avatar.style.top = new_top + 'px'
        this.tooltip.style.top = evt.clientY - 50 + 'px'
        this.current_task_avatar.style.left = new_left + 'px'
        this.tooltip.style.left = evt.clientX - 50 + 'px'
        let new_begin_at = this.calc_new_begin_at(this.viewport_dt_line.current_moment_line.top_val, new_top, height_of_task_elem)
        this.tooltip.innerText = `x: ${new_left}\nbegin_at: ${new_begin_at}`
    }

    editWidthTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        console.log()
        let cur_width = parseInt(this.current_task_avatar.style.width)
        let new_width = cur_width + evt.movementX
        this.current_task_avatar.style.width = new_width + 'px'
        this.tooltip.style.top = evt.clientY - 50 + 'px'
        this.tooltip.style.left = evt.clientX - 50 + 'px'
        this.tooltip.innerText = `width: ${new_width}`
    }
}

export {
    Task
}
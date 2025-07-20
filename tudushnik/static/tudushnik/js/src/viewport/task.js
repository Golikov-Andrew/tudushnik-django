import "jquery";
import moment from "moment";
import {createSVGElem} from "../svg";

let parent_task_for_binding_chosen = null;

class Task {
    constructor(task_obj, viewport_dt_line, tasks_container_elem, svg_container, project_color) {
        Object.assign(this, task_obj)
        this.viewport_dt_line = viewport_dt_line
        this.tasks_container_elem = tasks_container_elem
        this.svg_container = svg_container
        this.project_color = project_color
        this.elem = document.createElement('div')
        this.elem.classList.add('task_elem')
        this.elem.style.outline = `5px solid ${this.project_color}`;
        this.dropTaskHandler;
        this.stopEditWidthHandler;
        this.moveTaskHandler;
        this.editWidthHandler;
        this.lastX = 0;
        this.lastY = 0;
        let anchor_elem = document.createElement('div')
        anchor_elem.innerHTML = '&#8226;'
        anchor_elem.classList.add('task_tool')
        anchor_elem.classList.add('to_move_x')
        anchor_elem.addEventListener('mousedown', (evt) => {
            if (evt.button === 0)  this.start_move_task(evt);
        })
        anchor_elem.addEventListener('touchstart', (evt) => {
            this.start_move_task(evt, true)
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

        let edit_ctrl_elem = document.createElement('div')
        let task_link_elem = document.createElement('a')
        task_link_elem.href = `/tasks/edit/${this.pk}/`
        task_link_elem.innerHTML = '&#9998;'
        edit_ctrl_elem.classList.add('task_tool')
        edit_ctrl_elem.classList.add('to_edit_task')
        edit_ctrl_elem.appendChild(task_link_elem)

        let input_done_ctrl_elem_container = document.createElement('div')
        let input_done_ctrl_elem_label_container = document.createElement('label')
        let input_done_ctrl_checkmark = document.createElement('span')
        input_done_ctrl_checkmark.classList.add('checkmark')
        input_done_ctrl_elem_label_container.classList.add('checkbox_container')
        let input_done_ctrl_elem = document.createElement('input')
        input_done_ctrl_elem.setAttribute('type', 'checkbox')
        input_done_ctrl_elem.checked = this.is_done;
        input_done_ctrl_elem_container.classList.add('task_tool')
        input_done_ctrl_elem_container.classList.add('is_done')
        input_done_ctrl_elem_label_container.appendChild(input_done_ctrl_elem)
        input_done_ctrl_elem_label_container.appendChild(input_done_ctrl_checkmark)
        input_done_ctrl_elem_container.appendChild(input_done_ctrl_elem_label_container)
        input_done_ctrl_elem.addEventListener('change', () => {
            $.ajax({
                type: "POST",
                headers: {
                    'X-CSRFToken': csrfToken
                },
                url: '/tasks/update_attrs',
                data: JSON.stringify({
                    'task_id': this.pk,
                    'is_done': input_done_ctrl_elem.checked,
                }),
                success: (data) => {
                    // console.log(data)
                    if (data.success === true) {
                        input_done_ctrl_elem.checked = data.is_done;
                    } else {
                        alert(data.error_message);
                        input_done_ctrl_elem.checked = !data.is_done;
                    }
                },
                dataType: 'json'
            });
        });

        let delete_task_btn = document.createElement('div')
        delete_task_btn.innerHTML = '✕'
        delete_task_btn.classList.add('task_tool')
        delete_task_btn.classList.add('to_delete_task')
        delete_task_btn.addEventListener('click', (evt) => {
            let ans = confirm(`Вы действительно хотите удалить задачу '${this.title}'`)
            if (ans === true) {
                send_post_json(evt, `/tasks/delete/${this.pk}/`, {}, (resp) => {
                    let json_obj = JSON.parse(resp)
                    if ('success' in json_obj) {
                        if (json_obj['success'] === true) {
                            this.viewport_dt_line.remove_task(this)
                        }
                    }
                }, csrfToken)
            }
        })

        this.bind_child_btn = document.createElement('div')
        this.bind_child_btn.innerHTML = '&#43612;'
        this.bind_child_btn.setAttribute('data-task-id', this.pk)
        this.bind_child_btn.classList.add('task_tool')
        this.bind_child_btn.classList.add('bind_child_btn')
        this.bind_child_btn.addEventListener('click', (evt) => {
            let all_bind_child_btn = document.querySelectorAll('.bind_child_btn')
            if (parent_task_for_binding_chosen === null) {
                parent_task_for_binding_chosen = this
                this.bind_child_btn.classList.add('chosen-parent')
                for (let i = 0; i < all_bind_child_btn.length; i++) {
                    if (this.bind_child_btn !== all_bind_child_btn[i])
                        all_bind_child_btn[i].classList.add('potential-child');
                }
            } else {
                if (parent_task_for_binding_chosen !== this) {
                    let child_task_id = evt.target.getAttribute('data-task-id')
                    parent_task_for_binding_chosen.add_child_task(child_task_id)
                }
                parent_task_for_binding_chosen.bind_child_btn.classList.remove('chosen-parent')
                parent_task_for_binding_chosen = null
                for (let i = 0; i < all_bind_child_btn.length; i++) {
                    all_bind_child_btn[i].classList.remove('potential-child');
                }
            }

        })

        let relations_elem_container = document.createElement('div')
        let relations_elem = document.createElement('svg')
        relations_elem_container.classList.add('relations_elem_container')
        relations_elem_container.appendChild(relations_elem)

        let title_elem = document.createElement('div')
        title_elem.innerText = this.title
        title_elem.style.display = 'inline-block'
        let tags_container_elem = document.createElement('div')
        tags_container_elem.style.display = 'inline-block'

        for (let i = 0, current_tag, tag_elem; i < this.tags.length; i++) {
            current_tag = this.tags[i]
            tag_elem = document.createElement('div')
            tag_elem.classList.add('task_tag')
            tag_elem.innerText = current_tag.title
            tag_elem.style.backgroundColor = current_tag.color
            tags_container_elem.appendChild(tag_elem)
        }
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
        this.elem.append(tags_container_elem)
        this.elem.append(this.begin_at_elem)
        this.elem.append(this.description_elem)
        this.elem.append(width_ctrl_elem)
        this.elem.append(this.duration_elem)
        this.elem.append(duration_ctrl_elem)
        this.elem.append(edit_ctrl_elem)
        this.elem.append(input_done_ctrl_elem_container)
        this.elem.append(delete_task_btn)
        this.elem.append(this.bind_child_btn)
        this.elem.height = 20
        this.current_task_avatar = undefined
        this.tooltip = undefined
        this.children_relations_svg_elems = {}
        for (let i = 0; i < this.children.length; i++) {
            this.create_child_relation_svg_elem(this.children[i])
        }
    }

    static moveTask(task_obj, move_settings) {
        task_obj.update_offset_x_n_begin_at(
            task_obj.calc_new_offset_x(move_settings.x_delta),
            task_obj.calc_new_begin_at(
                task_obj.viewport_dt_line.current_moment_line.top_val,
                task_obj.calc_new_top(move_settings.y_delta),
                parseFloat(task_obj.elem.style.height)
            )
        )
        if (move_settings.recursive) {
            for (let j = 0, current_child; j < task_obj.children.length; j++) {
                current_child = task_obj.viewport_dt_line.tasks[task_obj.children[j].pk]
                Task.moveTask(current_child, {
                    recursive: true,
                    x_delta: move_settings.x_delta,
                    y_delta: move_settings.y_delta
                })
            }
        }
    }

    create_child_relation_svg_elem(child_obj) {
        let new_svg = createSVGElem('svg');
        new_svg.classList.add('task_relation_svg_elem')
        this.children_relations_svg_elems[child_obj.pk] = new_svg
        return new_svg;
    }

    add_child_task(child_task_id) {
        console.log('parent -> child_task', this, this.viewport_dt_line.tasks[child_task_id])
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/update_attrs',
            data: JSON.stringify({
                'task_id': this.pk,
                'new_child_id': parseInt(child_task_id),
            }),
            success: (data) => {
                if (data.success === true) {
                    let new_child_task = this.viewport_dt_line.tasks["" + child_task_id]
                    let cur_task_obj = this.viewport_dt_line.tasks[data.task_id]
                    cur_task_obj = Object.assign(cur_task_obj, data)
                    this.children.push(new_child_task)
                    new_child_task.parents.push(data.task_id)
                    this.viewport_dt_line.draw_task(cur_task_obj)
                    this.viewport_dt_line.draw_task_relations(cur_task_obj)
                } else {
                    console.error(data.error_message);
                }
            },
            dataType: 'json'
        });
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

    create_tooltip(evt, initial_tooltip_text, is_touch) {
        let is_touched = (is_touch !== undefined) ? is_touch : false;
        this.tooltip = document.createElement('div')
        this.tooltip.innerText = initial_tooltip_text
        this.tooltip.classList.add('task_tooltip')
        this.tasks_container_elem.append(this.tooltip)
        if (!is_touched) {
            this.tooltip.style.top = evt.clientY - 50 + 'px'
            this.tooltip.style.left = evt.clientX - 50 + 'px'
        } else {
            this.tooltip.style.top = evt.touches[0].clientY - 50 + 'px'
            this.tooltip.style.left = evt.touches[0].clientX - 50 + 'px'
        }

    }

    remove_tooltip() {
        this.tasks_container_elem.removeChild(this.tooltip)
        this.tooltip = undefined
    }

    create_task_avatar(evt, initial_tooltip_text, is_touch) {
        let is_touched = (is_touch !== undefined) ? is_touch : false;
        this.current_task_avatar = this.elem.cloneNode(true)
        this.create_tooltip(evt, initial_tooltip_text, is_touched)
        this.tasks_container_elem.append(this.current_task_avatar)
    }

    start_move_task(evt, is_touch) {
        let is_touched = (is_touch !== undefined) ? is_touch : false;
        if (is_touched) {
            this.lastX = evt.touches[0].clientX
            this.lastY = evt.touches[0].clientY
        }
        this.create_task_avatar(evt, `x: ${this.diagram_offset_x}\nbegin_at: ${this.begin_at}`, is_touched)
        evt.preventDefault()
        this.dropTaskHandler = this.dropTask.bind(this)
        if (is_touched) {
            this.moveTaskHandler = this.moveTaskTouch.bind(this)
            window.addEventListener('touchend', this.dropTaskHandler)
            window.addEventListener('touchmove', this.moveTaskHandler)
        } else {
            this.moveTaskHandler = this.moveTask.bind(this)
            window.addEventListener('mouseup', this.dropTaskHandler)
            window.addEventListener('mousemove', this.moveTaskHandler)
        }

    }

    remove_task_avatar() {
        this.remove_tooltip()
        this.tasks_container_elem.removeChild(this.current_task_avatar)
        this.current_task_avatar = undefined
    }

    update_offset_x_n_begin_at(diagram_offset_x, new_begin_at, evt) {
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
                    this.viewport_dt_line.draw_task(cur_task_obj)
                    this.viewport_dt_line.draw_task_relations(cur_task_obj)
                } else {
                    console.error(data.error_message);
                }
                if (evt !== undefined) {
                    this.remove_task_avatar()
                    window.removeEventListener('mouseup', this.dropTaskHandler)
                    window.removeEventListener('mousemove', this.moveTaskHandler)
                    window.removeEventListener('touchend', this.dropTaskHandler)
                    window.removeEventListener('touchmove', this.moveTaskHandler)
                }
            },
            dataType: 'json'
        });
    }

    calc_new_offset_x(x_delta) {
        return parseInt(this.elem.style.left) + x_delta
    }

    calc_new_top(y_delta) {
        return parseInt(this.elem.style.top) + y_delta
    }

    dropTask(evt) {
        // evt.preventDefault();
        evt.stopPropagation();

        let is_move_with_children = document.querySelector('#inp_is_move_with_children').checked
        let is_move_with_children_recursive = document.querySelector('#inp_is_move_with_children_recursive').checked

        let diagram_offset_x = parseInt(this.current_task_avatar.style.left)
        let x_delta = diagram_offset_x - parseInt(this.elem.style.left)
        let new_top = parseInt(this.current_task_avatar.style.top)
        let y_delta = new_top - parseInt(this.elem.style.top)
        let new_begin_at = this.calc_new_begin_at(
            this.viewport_dt_line.current_moment_line.top_val,
            new_top, parseFloat(this.current_task_avatar.style.height)
        )
        this.update_offset_x_n_begin_at(diagram_offset_x, new_begin_at, evt)

        if (is_move_with_children) {
            for (let i = 0, cur_child_obj; i < this.children.length; i++) {
                cur_child_obj = this.viewport_dt_line.tasks[this.children[i].pk]
                if (cur_child_obj !== undefined) {
                    Task.moveTask(cur_child_obj, {
                        recursive: is_move_with_children_recursive,
                        x_delta: x_delta,
                        y_delta: y_delta
                    })
                }
            }
        }
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

    editDurationTask(evt) {
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
        // evt.preventDefault();
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

    moveTaskTouch(evt) {
        // evt.preventDefault();
        evt.stopPropagation();
        let cur_top = parseInt(this.current_task_avatar.style.top)
        let cur_left = parseInt(this.current_task_avatar.style.left)
        let new_top = cur_top + evt.touches[0].clientY - this.lastY;
        let height_of_task_elem = parseFloat(this.current_task_avatar.style.height)
        let new_left = cur_left + evt.touches[0].clientX - this.lastX;

        this.current_task_avatar.style.top = new_top + 'px'
        this.tooltip.style.top = evt.touches[0].clientY - 50 + 'px'
        this.current_task_avatar.style.left = new_left + 'px'
        this.tooltip.style.left = evt.touches[0].clientX - 50 + 'px'
        let new_begin_at = this.calc_new_begin_at(this.viewport_dt_line.current_moment_line.top_val, new_top, height_of_task_elem)
        this.tooltip.innerText = `x: ${new_left}\nbegin_at: ${new_begin_at}`
        this.lastY = evt.touches[0].clientY
        this.lastX = evt.touches[0].clientX
    }

    editWidthTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
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
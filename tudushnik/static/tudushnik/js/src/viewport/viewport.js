import "jquery";
import {Ruler} from "./ruler";
import {DatetimelineCanvas} from "./dtl_canvas";
import {MomentLine} from "./moment_line";
import {Task} from "./task";
import {ViewportScale} from "./viewport_scale";
import {createSVGElem, modifySVGElemArrowMiddle} from "../svg";


class Viewport {

    static init(viewport_dtl) {
        let viewport_type_select = document.getElementById('viewport_type_select')
        let btn_diagram_refresh = document.querySelector('.btn_diagram_refresh')
        let viewport_datetimeline = document.querySelector('.viewport_datetimeline')
        let viewport_type = user_settings.get('viewport_type');
        if (viewport_type === 'table') {
            viewport_type_select.value = 'table'
            this.show_table()
        } else if (viewport_type === 'datetimeline') {
            viewport_type_select.value = 'datetimeline'
            this.show_datetimeline(viewport_dtl)
        }
        viewport_type_select.addEventListener('change', () => {
            let new_val = viewport_type_select.value
            if (new_val === 'datetimeline') {
                this.show_datetimeline(viewport_dtl)
                user_settings.set('viewport_type', 'datetimeline');

            } else {
                this.show_table()
                user_settings.set('viewport_type', 'table');
            }
        })
        btn_diagram_refresh.addEventListener('click', () => {
            for (const pk_task_key in viewport_dtl.tasks) {
                viewport_dtl.draw_task_relations(viewport_dtl.tasks[pk_task_key])
            }
        })
        viewport_datetimeline.addEventListener('scroll', (evt) => {
            if (user_settings.datetimeline_scroll_top_timeout !== null) clearTimeout(user_settings.datetimeline_scroll_top_timeout);
            user_settings.datetimeline_scroll_top_timeout = setTimeout(() => {
                user_settings.set('datetimeline_scroll_top', viewport_datetimeline.scrollTop)
            }, 1000)
        })
    }

    constructor() {
    }

    static show_datetimeline(viewport_dtl) {
        document.querySelector('.pagination').classList.add('hidden')
        document.querySelector('.tasks_table').classList.add('hidden')
        document.querySelector('.viewport_datetimeline').classList.remove('hidden')
        document.querySelector('#viewport_dt_line_scale').parentElement.classList.remove('hidden')
        document.querySelector('.btn_diagram_refresh').classList.remove('hidden')
        viewport_dtl.fetch_tasks();
    }

    static show_table() {
        document.querySelector('.pagination').classList.remove('hidden')
        document.querySelector('.tasks_table').classList.remove('hidden')
        document.querySelector('.viewport_datetimeline').classList.add('hidden')
        document.querySelector('#viewport_dt_line_scale').parentElement.classList.add('hidden')
        document.querySelector('.btn_diagram_refresh').classList.add('hidden')
    }
}

class ViewportDateTimeLine {
    constructor() {
        this.viewport_datetimeline = document.getElementById('viewport_type_select')
        this.elem = document.querySelector('.viewport_datetimeline');
        this.tasks_container_elem = document.querySelector('.tasks_container');
        this.svg_container = document.querySelector('.svg_container');
        this.scale = new ViewportScale(this)
        this.tasks = {}
        this.viewport_canvas = new DatetimelineCanvas(this)
        this.ruler = new Ruler(this)
        this.current_moment_line = new MomentLine(this)
        this.now_moment = null
        // this.viewport_canvas.elem.addEventListener('contextmenu',(evt)=>{
        //     evt.preventDefault();
        //     console.log('context')
        // })

    }

    fetch_tasks() {
        this.now_moment = moment()
        let delta_one_day_in_ms = 1000 * 60 * 60 * 24
        this.day_forward = moment(this.now_moment + delta_one_day_in_ms)
        this.day_backward = moment(this.now_moment - delta_one_day_in_ms)

        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/fetch',
            data: {
                'date_from': this.day_backward.format(),
                'date_to': this.day_forward.format(),
                'project_id': +document.querySelector('.object_pk').innerHTML.trim(),
            },
            success: (data) => {
                let tasks = data.tasks
                this.tasks_container_elem.innerHTML = ''
                for (let i = 0, t; i < tasks.length; i++) {
                    t = tasks[i];
                    this.tasks[t.pk] = new Task(t, this, this.tasks_container_elem, this.svg_container)
                    this.tasks_container_elem.append(this.tasks[t.pk].elem)
                }
                console.log(data)
                this.draw()
            },
            dataType: 'json'
        });
    }

    checkfix_duration_height_px(task_obj, duration_height_px) {
        task_obj.elem.style.height = `${duration_height_px}px`
        let val = this.scale.get_y_task_elem_min_height_px()
        if (duration_height_px < val) {
            task_obj.elem.style.height = `${val}px`
        }
    }

    draw_task(task_obj) {  // scale_y : 1px = 3 min
        task_obj.elem.style.width = `${task_obj.width}px`
        let min_difference = moment.duration(moment(task_obj.begin_at).diff(this.now_moment))
        let px_diff = min_difference.asMinutes() / this.scale.get_y_min_per_px()  // px
        let duration_height_px = task_obj.duration / (this.scale.get_y_min_per_px() * 60)  //  sec / (3min/1px * 60sec/1min)
        task_obj.elem.style.height = `${duration_height_px}px`
        this.checkfix_duration_height_px(task_obj, duration_height_px);
        let task_el_height = parseFloat(window.getComputedStyle(task_obj.elem).getPropertyValue("height"))
        let top = this.current_moment_line.top_val - task_el_height - px_diff
        console.log('top', top)
        task_obj.elem.style.top = `${top}px`
        task_obj.elem.style.left = `${task_obj.diagram_offset_x}px`
        task_obj.description_elem.innerText = task_obj.content
        task_obj.begin_at_elem.innerText = moment(task_obj.begin_at).format('Y-MM-DD HH:mm')
        task_obj.duration_elem.innerText = moment.duration(task_obj.duration, 'seconds').format('h [hours] :mm [minutes]')
    }

    draw() {
        let end_dt_ceiled = this.ruler.draw(this.day_backward, this.day_forward)
        this.current_moment_line.draw(this.now_moment, end_dt_ceiled)
        for (const pk_task_key in this.tasks) {
            this.draw_task(this.tasks[pk_task_key])
        }
        for (const pk_task_key in this.tasks) {
            this.draw_task_relations(this.tasks[pk_task_key])
        }
    }

    draw_parent_child_relation(parent, child, current_child_pk) {
        let task_cx = parseInt(parent.elem.style.width) / 2 + parseInt(parent.elem.style.left);
        let task_cy = parseInt(parent.elem.style.height) / 2 + parseInt(parent.elem.style.top);
        let child_cx = parseInt(child.elem.style.width) / 2 + parseInt(child.elem.style.left);
        let child_cy = parseInt(child.elem.style.height) / 2 + parseInt(child.elem.style.top);

        let rel_elem = parent.children_relations_svg_elems[current_child_pk]
        let delta_width = child_cx - task_cx
        let height = Math.abs(child_cy - task_cy)
        if (!this.svg_container.contains(rel_elem)) {
            this.svg_container.appendChild(rel_elem)
        }
        modifySVGElemArrowMiddle(rel_elem, delta_width, height)
        rel_elem.style.width = `${Math.abs(delta_width)}px`
        rel_elem.style.height = `${height}px`
        rel_elem.style.left = delta_width >= 0 ? `${task_cx}px` : `${child_cx}px`;
        rel_elem.style.top = `${child_cy}px`
    }

    draw_task_relations(task) {
        console.log('draw_task_relations', this, task)
        // перерисовка отношений к children
        for (let i = 0, current_child_task, rel_elem, current_child_pk, task_cx, task_cy, child_cx, child_cy; i < task.children.length; i++) {
            current_child_pk = task.children[i].pk
            current_child_task = this.tasks[current_child_pk];
            if (current_child_task === undefined) continue;
            this.draw_parent_child_relation(task, current_child_task, current_child_pk)
        }
        for (let i = 0, current_parent; i < task.parents.length; i++) {
            current_parent = this.tasks[task.parents[i]];
            this.draw_parent_child_relation(current_parent, task, task.pk)
        }

    }
}

export {
    Viewport,
    ViewportDateTimeLine
}
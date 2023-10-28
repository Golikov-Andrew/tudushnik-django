import {Ruler} from "./ruler";
import {DatetimelineCanvas} from "./dtl_canvas";
import {MomentLine} from "./moment_line";
import {Task} from "./task";
let moment = require("moment")
require("moment-duration-format");

class Viewport {

    static init(viewport_dtl) {
        let viewport_type_select = document.getElementById('viewport_type_select')
        viewport_type_select.addEventListener('change', () => {
            let new_val = viewport_type_select.value
            if (new_val === 'datetimeline') {
                document.querySelector('.pagination').classList.add('hidden')
                document.querySelector('.tasks_table').classList.add('hidden')
                document.querySelector('.viewport_datetimeline').classList.remove('hidden')
                viewport_dtl.fetch_tasks();
            } else {
                document.querySelector('.pagination').classList.remove('hidden')
                document.querySelector('.tasks_table').classList.remove('hidden')
                document.querySelector('.viewport_datetimeline').classList.add('hidden')
            }
        })
    }
    constructor() {
    }
}

class ViewportDateTimeLine {
    constructor() {
        this.viewport_datetimeline = document.getElementById('viewport_type_select')
        this.elem = document.querySelector('.viewport_datetimeline');
        this.tasks_container_elem = document.querySelector('.tasks_container');
        this.scale_y = 1
        this.scale_x = 1
        this.tasks = {}
        this.viewport_canvas = new DatetimelineCanvas(this)
        this.ruler = new Ruler(this)
        this.current_moment_line = new MomentLine(this)
        this.now_moment = null

    }

    fetch_tasks() {
        this.now_moment = moment()
        let day_forward = moment(this.now_moment + 1000 * 60 * 60 * 24)
        let day_backward = moment(this.now_moment - 1000 * 60 * 60 * 24)

        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/fetch',
            data: {
                'date_from': day_backward.format(),
                'date_to': day_forward.format(),
            },
            success: (data) => {
                let tasks = data.tasks
                for (let i = 0, t; i < tasks.length; i++) {
                    t = tasks[i];
                    this.tasks[t.pk] = new Task(t, this, this.tasks_container_elem)
                    this.tasks_container_elem.append(this.tasks[t.pk].elem)
                }
                console.log(data)
                this.draw(day_backward, day_forward, this.now_moment, data.offset)
            },
            dataType: 'json'
        });
    }

    draw_task(task_obj) {  // scale_y : 1px = 3 min
        task_obj.elem.style.width = `${task_obj.width}px`
        let min_difference = moment.duration(moment(task_obj.begin_at).diff(this.now_moment))
        let px_diff = min_difference.asMinutes() / 3  // px
        let duration_height_px = task_obj.duration / (3 * 60)  //  sec / (3min/1px * 60sec/1min)
        task_obj.elem.style.height = `${duration_height_px}px`
        if (duration_height_px < 9.6) {
            task_obj.elem.style.height = '9.6px'
        }
        let task_el_height = parseFloat(window.getComputedStyle(task_obj.elem).getPropertyValue("height"))
        let top = (this.scale_y * this.current_moment_line.top_val - task_el_height) - px_diff
        console.log('top', top)
        task_obj.elem.style.top = `${top}px`
        task_obj.elem.style.left = `${task_obj.diagram_offset_x}px`
        task_obj.description_elem.innerText = task_obj.content
        task_obj.begin_at_elem.innerText = moment(task_obj.begin_at).format('Y-MM-DD HH:mm')
        task_obj.duration_elem.innerText = moment.duration(task_obj.duration, 'seconds').format('h [hours] :mm [minutes]')
    }

    draw(day_backward, day_forward, now_moment, tz_offset) {
        let dur = moment.duration(tz_offset)
        this.ruler.draw(day_backward, day_forward)
        this.current_moment_line.draw(now_moment)
        for (const pk_task_key in this.tasks) {
            if (this.scale_y === 1) {
                this.draw_task(this.tasks[pk_task_key])
            }
        }

    }
}

export {
    Viewport,
    ViewportDateTimeLine
}
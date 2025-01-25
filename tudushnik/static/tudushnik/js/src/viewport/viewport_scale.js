import "jquery";
import {Task} from "./task";

class ViewportScale {
    constructor(viewport_dt_line) {
        this.viewport_dt_line = viewport_dt_line
        this.x = 1
        this.y = 1
        this.x_options = {
            1: {}
        }
        this.y_options = {
            1: {
                step_height_px: 20,
                padding: 6,
                font_size: 12,
                min_per_step: 60, // 3 min/1 px
                task_elem_min_height: 9.6, // 3 min/1 px
            },
            2: {
                step_height_px: 60,
                padding: 28,
                font_size: 14,
                min_per_step: 60, // 1 min/1 px
                task_elem_min_height: 9.6,
            }
        }
        this.scale_y_select_elem = document.getElementById('viewport_dt_line_scale');
        let opt;
        for (const k in this.y_options) {
            opt = document.createElement('option');
            opt.value = k
            opt.innerText = k
            this.scale_y_select_elem.append(opt)
        }
        this.scale_y_select_elem.value = user_settings.get('datetimeline_scale')
        if (user_settings.get('viewport_type') === 'datetimeline') {
            setTimeout(() => {
                this.redraw()
                this.viewport_dt_line.elem.scrollTop = +user_settings.get('datetimeline_scroll_top')
            }, 2000);
        }

        this.scale_y_select_elem.addEventListener('change', () => {
            this.redraw();
            user_settings.set('datetimeline_scale', this.scale_y_select_elem.value)
        })

    }

    redraw() {
        this.y = +this.scale_y_select_elem.value
        this.viewport_dt_line.tasks_container_elem.innerHTML = ''
        for (const pk in this.viewport_dt_line.tasks) {
            this.viewport_dt_line.tasks_container_elem.append(this.viewport_dt_line.tasks[pk].elem)
        }
        this.viewport_dt_line.draw()
    }

    get_y_step_height_px() {
        return this.y_options[this.y].step_height_px
    }

    get_y_task_elem_min_height_px() {
        return this.y_options[this.y].task_elem_min_height
    }

    get_y_padding_px() {
        return this.y_options[this.y].padding
    }

    get_y_font_size_px() {
        return this.y_options[this.y].font_size
    }

    get_y_min_per_step() {
        return this.y_options[this.y].min_per_step
    }

    get_y_min_per_px() {
        return this.get_y_min_per_step() / this.get_y_step_height_px()
    }
}

export {
    ViewportScale
}
import "jquery";
import moment from "moment/moment";

class DatetimelineCanvas {
    constructor(viewport_dt_line) {
        this.viewport = viewport_dt_line;
        this.elem = this.viewport.elem.querySelector('.viewport_datetimeline_canvas')
        this.context_menu_elem = this.elem.querySelector('.context_menu')
        this.context_menu_modal_window_elem = this.elem.querySelector('.modal_window')
        this.context_menu_info_elem = this.elem.querySelector('.context_menu_info')
        this.context_menu_overlay_elem = this.elem.querySelector('.overlay')
        this.context_menu_btn_close_elem = this.elem.querySelector('.btn_close')
        this.elem.addEventListener('contextmenu',
            (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                console.log('contextmenu', evt.target, this.elem);
                if (evt.target === this.elem) {
                    this.show_context_menu(evt.offsetX, evt.offsetY, this.calc_datetime_at_point(evt.offsetX, evt.offsetY))
                    return;
                }
                let parent_elem = evt.target.closest('.task_relation_svg_elem')
                if (parent_elem === null) {
                    parent_elem = evt.target.closest('.task_elem')
                    if (parent_elem === null) {
                        return;
                    }
                }
                let x = parseFloat(parent_elem.style.left)
                let y = parseFloat(parent_elem.style.top)
                this.show_context_menu(evt.offsetX + x, evt.offsetY + y)

            }
            , true)
        this.context_menu_overlay_elem.addEventListener('click', (evt) => {
            evt.preventDefault()
            this.hide_context_menu()
        })
        this.context_menu_btn_close_elem.addEventListener('click', (evt) => {
            evt.preventDefault()
            this.hide_context_menu()
        })
    }

    calc_datetime_at_point(x, y) {
        console.log('calc_datetime_at_point', x, y)
        let pixel_offset = this.viewport.current_moment_line.top_val - y
        let min_difference = this.viewport.scale.get_y_min_per_px() * pixel_offset
        return moment(this.viewport.now_moment + moment.duration(min_difference, 'minutes')).format('Y-MM-DDTHH:mm:ss')
    }

    show_context_menu(x, y, calced_dt) {
        this.context_menu_elem.classList.remove('hidden')
        this.context_menu_modal_window_elem.style.left = `${x}px`
        this.context_menu_modal_window_elem.style.top = `${y}px`
        this.context_menu_info_elem.innerText = `${x} ${y} ${calced_dt}`
    }

    hide_context_menu() {
        this.context_menu_elem.classList.add('hidden')
    }
}

export {
    DatetimelineCanvas
}
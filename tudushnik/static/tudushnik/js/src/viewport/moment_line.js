import "jquery";
import moment from "moment";

class MomentLine {
    constructor(viewport_dt_line) {
        this.viewport = viewport_dt_line;
        this.elem = this.viewport.elem.querySelector('.current_timeline')
        this.top_val = 0
    }

    draw(now_moment, end_dt_ceiled) {
        let diff_seconds = moment.duration(moment(end_dt_ceiled).diff(now_moment)).asSeconds()
        this.top_val = diff_seconds / (this.viewport.scale.get_y_min_per_px() * 60)
        this.elem.style.top = `${this.top_val}px`
    }
}

export {
    MomentLine
}
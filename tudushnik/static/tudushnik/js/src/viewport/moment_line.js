class MomentLine {
    constructor(viewport_dt_line) {
        this.viewport = viewport_dt_line;
        this.elem = this.viewport.elem.querySelector('.current_timeline')
        this.top_val = 0
    }

    draw(now_moment) {
        let delta_height = 20; //   scale_y === 1  : 60 min
        if (this.viewport.scale_y === 2) {
            delta_height = 60;
        }
        this.top_val = 24 * delta_height
        this.elem.style.top = `${this.top_val}px`
    }
}

export {
    MomentLine
}
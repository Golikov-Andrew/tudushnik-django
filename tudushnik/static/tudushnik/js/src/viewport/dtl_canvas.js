import "jquery";

class DatetimelineCanvas {
    constructor(viewport_dt_line) {
        this.viewport = viewport_dt_line;
        this.elem = this.viewport.elem.querySelector('.viewport_datetimeline_canvas')
    }
}

export {
    DatetimelineCanvas
}
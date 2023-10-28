import "jquery";
require('moment');

class RulerRow {
    constructor(datetime_value) {
        this.elem = document.createElement('div')
        this.elem.innerText = datetime_value
        this.elem.classList.add('ruler_row')
    }
}

class Ruler {
    constructor(viewport_dt_line) {
        this.viewport = viewport_dt_line;
        this.elem = this.viewport.elem.querySelector('.ruler')
    }

    draw(start_dt, end_dt) {
        let m = start_dt
        let roundUp = m.minute() || m.second() || m.millisecond() ? m.add(2, 'hour').startOf('hour') : m.startOf('hour');
        this.start_dt = roundUp
        m = end_dt
        roundUp = m.minute() || m.second() || m.millisecond() ? m.add(2, 'hour').startOf('hour') : m.startOf('hour');
        this.end_dt = roundUp
        console.log('scale_y', this.viewport.scale.y)
        let delta_height = this.viewport.scale.get_y_step_height_px();
        this.elem.style.fontSize = `${this.viewport.scale.get_y_font_size_px()}px`
        this.elem.innerHTML = ''
        let copy_end_dt = this.end_dt.clone()
        let total_height = 0;
        for (let i = 0, current_hour, new_elem; i < 48; i++) {
            current_hour = copy_end_dt.subtract({hours: 1})
            new_elem = new RulerRow(copy_end_dt.format('Y-MM-DD HH:mm')).elem
            new_elem.style.height = `${delta_height}px`
            total_height += delta_height
            new_elem.style.padding = `${this.viewport.scale.get_y_padding_px()}px 0 0 0`
            this.elem.append(new_elem)
        }
        this.viewport.viewport_canvas.elem.style.height = `${total_height}px`
        this.elem.style.height = `${total_height}px`
        return this.end_dt;
    }
}

export {
    Ruler
}
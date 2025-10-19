class DayLine {
    constructor(datetime_value) {
        this.elem = document.createElement('div')
        this.elem.innerText = datetime_value.slice(0, 10)
        this.elem.classList.add('day_line')
    }
}

class DayHelpersContainer {
    constructor(viewport_dt_line) {
        this.viewport = viewport_dt_line;
        this.elem = this.viewport.elem.querySelector('.days_helpers_container')
    }

    draw(start_dt, end_dt) {
        let m = start_dt
        let roundUp = m.minute() || m.second() || m.millisecond() ? m.add(2, 'hour').startOf('hour') : m.startOf('hour');
        this.start_dt = roundUp
        m = end_dt
        roundUp = m.minute() || m.second() || m.millisecond() ? m.add(2, 'hour').startOf('hour') : m.startOf('hour');
        this.end_dt = roundUp
        let delta_days = (end_dt - start_dt) / 1000 / 60 / 60 / 24
        let delta_height = this.viewport.scale.get_y_step_height_px();
        this.elem.style.fontSize = `${this.viewport.scale.get_y_font_size_px()}px`
        this.elem.innerHTML = ''
        let copy_end_dt = this.end_dt.clone()
        let total_height = 0;
        for (let i = 0, current_hour, new_elem, dt_val; i < delta_days * 24; i++) {
            copy_end_dt.subtract({hours: 1})
            dt_val = copy_end_dt.format('Y-MM-DD')
            if (copy_end_dt.format('HH:mm') === '01:00') {
                console.log(dt_val)
                new_elem = new DayLine(dt_val).elem
                new_elem.style.top = `${total_height + delta_height}px`
                new_elem.style.height = `${delta_height}px`;
                new_elem.style.padding = `${this.viewport.scale.get_y_padding_px()}px 0 0 0`;
                this.elem.append(new_elem)
            }
            total_height += delta_height
        }
    }
}

export {
    DayHelpersContainer
}
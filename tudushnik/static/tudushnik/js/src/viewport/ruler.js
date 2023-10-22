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
        console.log('scale_y', this.viewport.scale_y)
        let delta_height = 20; //   scale_y === 1  : 60 min
        let padding = 6; //   scale_y === 1  : 60 min
        let fontSize = 12; //   scale_y === 1  : 60 min
        if (this.viewport.scale_y === 1) {
            this.elem.style.fontSize = `${fontSize}px`
        } else if (this.viewport.scale_y === 2) {
            this.elem.style.fontSize = `${fontSize + 2}px`
            padding = 14;
            delta_height = 60;
        }
        this.elem.innerHTML = ''
        let copy_end_dt = end_dt.clone()
        let total_height = 0;
        for (let i = 0, current_hour, new_elem; i < 48; i++) {
            current_hour = copy_end_dt.subtract({hours: 1})
            new_elem = new RulerRow(copy_end_dt.format('Y-MM-DD HH:mm')).elem
            new_elem.style.height = `${delta_height}px`
            total_height += delta_height
            new_elem.style.padding = `${padding}px 0 0 0`
            this.elem.append(new_elem)
        }
        this.viewport.viewport_canvas.elem.style.height = `${total_height}px`
        this.elem.style.height = `${total_height}px`


    }

}

export {
    Ruler
}
class Corner {
    #element;
    #width;

    constructor(width, side_1, side_2, css_resize_type) {
        this.#width = width
        this.#element = document.createElement('div');
        this.#element.style.display = 'inline-block';
        this.#element.style.position = 'absolute';
        this.#element.style.backgroundColor = '#777777';
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.height = `${this.#width}px`;
        this.#element.style[side_1] = `-${this.#width}px`;
        this.#element.style[side_2] = `-${this.#width}px`;
        this.#element.style.cursor = `${css_resize_type}-resize`;
        this.#element.classList.add('hidden');
    }

    get element() {
        return this.#element;
    }
}

class Side {
    _element;
    _width;

    constructor(width) {
        this._width = width
        this._element = document.createElement('div');
        this._element.style.display = 'inline-block';
        this._element.style.position = 'absolute';
        this._element.style.backgroundColor = '#999999';
        this._element.style.cursor = 'pointer';
        this._element.classList.add('hidden');

    }

    get element() {
        return this._element;
    }
}

class HorizontalSide extends Side {
    constructor(width, side) {
        super(width);
        this._element.style.width = `100%`;
        this._element.style.height = `${this._width}px`;
        this._element.style[side] = `-${this._width}px`;
        this._element.style.cursor = 'row-resize';
    }
}


class VerticalSide extends Side {
    constructor(width, side) {
        super(width);
        this._element.style.height = `100%`;
        this._element.style.width = `${this._width}px`;
        this._element.style[side] = `-${this._width}px`;
        this._element.style.cursor = 'col-resize';
    }
}

class Card {
    // #app;
    #canvas;
    #element;
    #data;
    #anchore;
    #wrapper;
    #title;
    #x;
    #y;
    #corners;
    #sides;
    #width;
    #height;
    #pk;
    #previous_data;

    constructor(canvas, card_data) {
        // this.#app = app;
        this.#previous_data = {};
        this.#canvas = canvas;
        this.#data = card_data;
        this.#x = card_data.x;
        this.#y = card_data.y;
        this.#pk = card_data.pk;
        this.#width = card_data.width;
        this.#height = card_data.height;
        this.#element = document.createElement('div');
        this.#element.classList.add('card');
        this.#element.style.position = 'absolute';
        this.#element.style.display = 'inline-block';
        this.#element.style.outline = '1px solid black';
        this.#element.style.top = `${card_data.y}px`;
        this.#element.style.left = `${card_data.x}px`;
        this.#element.style.width = `${card_data.width}px`;
        this.#element.style.height = `${card_data.height}px`;

        this.#wrapper = document.createElement('div');
        this.#wrapper.classList.add('wrapper');
        this.#wrapper.style.position = 'relative';
        this.#wrapper.style.width = '100%';
        this.#wrapper.style.height = '100%';

        this.#title = document.createElement('input');
        this.#title.classList.add('title');
        this.#title.value = card_data.task.title;

        this.#anchore = document.createElement('div');
        this.#anchore.classList.add('anchore');
        this.#anchore.innerHTML = 'a';
        this.startTime = null;
        this.isPressed = false;

        let handler_width = 10;

        this.#corners = {
            left: {
                top: new Corner(handler_width, 'left', 'top', 'nwse'),
                bottom: new Corner(handler_width, 'left', 'bottom', 'nesw'),
            },
            right: {
                top: new Corner(handler_width, 'right', 'top', 'nesw'),
                bottom: new Corner(handler_width, 'right', 'bottom', 'nwse'),
            },
        }

        this.#sides = {
            left: new VerticalSide(handler_width, 'left'),
            right: new VerticalSide(handler_width, 'right'),
            top: new HorizontalSide(handler_width, 'top'),
            bottom: new HorizontalSide(handler_width, 'bottom'),

        }

        this.#wrapper.appendChild(this.#corners.left.top.element);
        this.#wrapper.appendChild(this.#corners.left.bottom.element);
        this.#wrapper.appendChild(this.#corners.right.top.element);
        this.#wrapper.appendChild(this.#corners.right.bottom.element);

        this.#wrapper.appendChild(this.#sides.left.element);
        this.#wrapper.appendChild(this.#sides.right.element);
        this.#wrapper.appendChild(this.#sides.top.element);
        this.#wrapper.appendChild(this.#sides.bottom.element);

        this.#wrapper.appendChild(this.#anchore);
        this.#wrapper.appendChild(this.#title);
        this.#element.appendChild(this.#wrapper);
        //

        this.#anchore.addEventListener('mousedown', () => {
            this.#canvas.app.take_card(this)
        })
        this.#anchore.addEventListener('mouseup', () => {
            this.#canvas.app.drop_card()
        })


        this.#sides.right.element.addEventListener('mousedown', () => {
            this.#canvas.app.take_right_side(this)
        })
        this.#sides.right.element.addEventListener('mouseup', () => {
            this.#canvas.app.drop_right_side()
        })

        this.#sides.left.element.addEventListener('mousedown', () => {
            this.#canvas.app.take_left_side(this)
        })
        this.#sides.left.element.addEventListener('mouseup', () => {
            console.log('drop_left_side')
            this.#canvas.app.drop_left_side()
        })

        this.#sides.top.element.addEventListener('mousedown', () => {
            this.#canvas.app.take_top_side(this)
        })
        this.#sides.top.element.addEventListener('mouseup', () => {
            console.log('drop_top_side')
            this.#canvas.app.drop_top_side()
        })
        
        this.#sides.bottom.element.addEventListener('mousedown', () => {
            this.#canvas.app.take_bottom_side(this)
        })
        this.#sides.bottom.element.addEventListener('mouseup', () => {
            console.log('drop_bottom_side')
            this.#canvas.app.drop_bottom_side()
        })

        ////////////////////////

        this.#corners.left.top.element.addEventListener('mousedown', this.take_left_top_corner.bind(this))
        this.#corners.left.top.element.addEventListener('mouseup', this.drop_left_top_corner.bind(this))
        this.#corners.left.top.element.addEventListener('mouseleave', this.drop_left_top_corner.bind(this))

        this.#corners.right.top.element.addEventListener('mousedown', this.take_right_top_corner.bind(this))
        this.#corners.right.top.element.addEventListener('mouseup', this.drop_right_top_corner.bind(this))
        this.#corners.right.top.element.addEventListener('mouseleave', this.drop_right_top_corner.bind(this))

        this.#corners.right.bottom.element.addEventListener('mousedown', this.take_right_bottom_corner.bind(this))
        this.#corners.right.bottom.element.addEventListener('mouseup', this.drop_right_bottom_corner.bind(this))
        this.#corners.right.bottom.element.addEventListener('mouseleave', this.drop_right_bottom_corner.bind(this))

        this.#corners.left.bottom.element.addEventListener('mousedown', this.take_left_bottom_corner.bind(this))
        this.#corners.left.bottom.element.addEventListener('mouseup', this.drop_left_bottom_corner.bind(this))
        this.#corners.left.bottom.element.addEventListener('mouseleave', this.drop_left_bottom_corner.bind(this))


        // this._move_card = this.move_card.bind(this);


        // this._move_left_side = this.move_left_side.bind(this);
        // this._move_top_side = this.move_top_side.bind(this);
        // this._move_bottom_side = this.move_bottom_side.bind(this);

        this._move_left_top_corner = this.move_left_top_corner.bind(this);
        this._move_right_top_corner = this.move_right_top_corner.bind(this);
        this._move_right_bottom_corner = this.move_right_bottom_corner.bind(this);
        this._move_left_bottom_corner = this.move_left_bottom_corner.bind(this);

        this._move_card_in_viewport = this.move_card_in_viewport.bind(this);
    }

    get element() {
        return this.#element;
    }

    get pk() {
        return this.#pk;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    set x(value) {
        this.#x = value;
    }

    set_x(value) {
        this.#x = value;
        this.#element.style.left = `${this.#x}px`;
    }

    set y(value) {
        this.#y = value;
    }

    set_y(value) {
        this.#y = value;
        this.#element.style.top = `${this.#y}px`;
    }

    set_x_y(x, y){
        this.set_x(x);
        this.set_y(y);
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }

    set width(value) {
        this.#width = value;
    }

    set_width(width) {
        this.#width = width;
        this.#element.style.width = `${this.#width}px`;
    }

    set height(value) {
        this.#height = value;
    }

    set_height(value) {
        this.#height = value;
        this.#element.style.height = `${this.#height}px`;
    }

    toggle_helpers() {
        for (const lr in this.#corners) {
            for (const tb in this.#corners[lr]) {
                this.#corners[lr][tb].element.classList.toggle('hidden');
            }
        }
        for (const s in this.#sides) {
            this.#sides[s].element.classList.toggle('hidden');
        }
    }

    redraw() {
        // console.log('redraw', this.#width)
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.left = `${this.#x}px`;
        this.#element.style.height = `${this.#height}px`;
        this.#element.style.top = `${this.#y}px`;
    }

    snap_previous_data(...attrs) {
        console.log('snap_previous_data')
        attrs.map(attr => this.#previous_data[attr] = this[attr]);
    }

    get_previous_data() {
        return this.#previous_data;
    }

    get_data(...attrs) {
        let result = {}
        attrs.map(attr => result[attr] = this[attr]);
        return result;
    }

    reset_previous_data() {
        console.log('reset_previous_data')
        this.#previous_data = {};
    }

    rollback_previous_data() {
        console.log('rollback_previous_data');
        for (const attr in this.#previous_data) {
            this[attr] = this.#previous_data[attr]
        }
        this.redraw();
    }

    ////


    /////


    take_top_side(evt) {
        this.element.addEventListener('mousemove', this._move_top_side);
    }

    drop_top_side(evt) {
        this.element.removeEventListener('mousemove', this._move_top_side);
    }

    take_bottom_side(evt) {
        this.element.addEventListener('mousemove', this._move_bottom_side);
    }

    drop_bottom_side(evt) {
        this.element.removeEventListener('mousemove', this._move_bottom_side);
    }


    stopEditWidthTask(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        let new_width = parseInt(this.current_task_avatar.style.width)
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/update_attrs',
            data: JSON.stringify({
                'task_id': this.pk,
                'width': new_width
            }),
            success: (data) => {
                const func = () => {
                    this.remove_task_avatar()
                    this.show_task_elem()
                    window.removeEventListener('mouseup', this.stopEditWidthHandler)
                    window.removeEventListener('mousemove', this.editWidthHandler)
                    window.removeEventListener('touchend', this.stopEditWidthHandler)
                    window.removeEventListener('touchmove', this.editWidthHandler)
                }
                if (data.success === true) {
                    let cur_task_obj = this.viewport_dt_line.tasks[data.task_id]
                    cur_task_obj = Object.assign(cur_task_obj, data)
                    func();
                    this.viewport_dt_line.draw_task(cur_task_obj)
                } else {
                    alert(data.error_message);
                    func();
                }
            },
            dataType: 'json'
        });
    }

    move_left_side(evt) {
        this.#width -= evt.movementX;
        this.#x += evt.movementX;
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.left = `${this.#x}px`;
    }

    move_top_side(evt) {
        this.#height -= evt.movementY;
        this.#y += evt.movementY;
        this.#element.style.height = `${this.#height}px`;
        this.#element.style.top = `${this.#y}px`;
    }

    move_bottom_side(evt) {
        this.#height += evt.movementY;
        this.#element.style.height = `${this.#height}px`;
    }

    /////


    take_left_top_corner(evt) {
        this.element.addEventListener('mousemove', this._move_left_top_corner);
    }

    drop_left_top_corner(evt) {
        this.element.removeEventListener('mousemove', this._move_left_top_corner);
    }

    take_right_top_corner(evt) {
        this.element.addEventListener('mousemove', this._move_right_top_corner);
    }

    drop_right_top_corner(evt) {
        this.element.removeEventListener('mousemove', this._move_right_top_corner);
    }

    take_right_bottom_corner(evt) {
        this.element.addEventListener('mousemove', this._move_right_bottom_corner);
    }

    drop_right_bottom_corner(evt) {
        this.element.removeEventListener('mousemove', this._move_right_bottom_corner);
    }

    take_left_bottom_corner(evt) {
        this.element.addEventListener('mousemove', this._move_left_bottom_corner);
    }

    drop_left_bottom_corner(evt) {
        this.element.removeEventListener('mousemove', this._move_left_bottom_corner);
    }

    move_left_top_corner(evt) {
        this.move_left_side(evt);
        this.move_top_side(evt);
    }

    move_right_top_corner(evt) {
        this.move_right_side(evt);
        this.move_top_side(evt);
    }

    move_right_bottom_corner(evt) {
        this.move_right_side(evt);
        this.move_bottom_side(evt);
    }

    move_left_bottom_corner(evt) {
        this.move_left_side(evt);
        this.move_bottom_side(evt);
    }

    /////

    move_card_in_viewport(evt) {
        // console.log(this.#app.element)
        // console.log('move_card_in_viewport', evt.offsetX, evt.offsetY);
    }


}

export {
    Card
}
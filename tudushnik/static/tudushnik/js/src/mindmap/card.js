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
    #is_done;
    #child_btn;
    #status;
    #wrapper;
    #title;
    #content;
    #tags;
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
        this.#element.dataset.taskMindMapId = this.#pk;
        this.#element.dataset.taskId = this.#data.task.pk;

        this.#wrapper = document.createElement('div');
        this.#wrapper.classList.add('wrapper');
        this.#wrapper.style.position = 'relative';
        this.#wrapper.style.display = 'grid';
        this.#wrapper.style.width = '100%';
        this.#wrapper.style.height = '100%';

        this.#title = document.createElement('div');
        this.#title.classList.add('title');
        this.#title.innerHTML = card_data.task.title;

        this.#content = document.createElement('div');
        this.#content.classList.add('content');
        this.#content.innerHTML = card_data.task.content;

        this.#tags = document.createElement('div');
        this.#tags.classList.add('tags');
        this.#data.task.tags.forEach(t => {
            this.#tags.appendChild(this.__create_tag(t))
        })

        this.#anchore = document.createElement('div');
        this.#anchore.classList.add('anchore');
        this.#anchore.innerHTML = '&#8226;';

        this.#is_done = document.createElement('input');
        this.#is_done.setAttribute('type', 'checkbox')
        this.#is_done.setAttribute('disabled', 'disabled')
        this.#is_done.classList.add('is_done');
        this.#is_done.checked = this.#data.task.is_done

        this.#child_btn = document.createElement('div');
        this.#child_btn.classList.add('child_btn');
        this.#child_btn.innerHTML = '&#43612;';

        this.#status = document.createElement('div');
        this.#status.classList.add('status');
        this.#status.innerHTML = card_data.task.status;

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

        this.#wrapper.appendChild(this.__create_row([
            this.#anchore, this.#is_done, this.#child_btn, this.#status
        ]));
        this.#wrapper.appendChild(this.__create_row([
            this.#title
        ]));

        const row_content = this.__create_row([
            this.#content
        ])
        row_content.style.overflow = 'auto';
        this.#wrapper.appendChild(row_content);

        this.#wrapper.appendChild(this.__create_row([
            this.#tags
        ]));

        this.#element.appendChild(this.#wrapper);

        this.#element.addEventListener('mouseenter', () => {
            this.#element.classList.add('on_front');
        });
        this.#element.addEventListener('mouseleave', () => {
            this.#element.classList.remove('on_front');
        });

        this.#anchore.addEventListener('mousedown', () => {
            this.#canvas.app.take_card(this)
        })
        this.#anchore.addEventListener('mouseup', () => {
            this.#canvas.app.drop_card()
        })

        for (const side in this.#sides) {
            this.#sides[side].element.addEventListener('mousedown', () => {
                this.#canvas.app.take_side(this, side)
            })
            this.#sides[side].element.addEventListener('mouseup', () => {
                this.#canvas.app.drop_side(side)
            })
        }

        for (const horizont_side in this.#corners) {
            for (const vertical_side in this.#corners[horizont_side]) {
                this.#corners[horizont_side][vertical_side].element.addEventListener(
                    'mousedown', () => {
                        this.#canvas.app.take_corner(this, horizont_side, vertical_side)
                    })
                this.#corners[horizont_side][vertical_side].element.addEventListener(
                    'mouseup', () => {
                        this.#canvas.app.drop_corner(horizont_side, vertical_side)
                    })
            }
        }

        this.#child_btn.addEventListener('click', (evt) => {
            let all_bind_child_btn = document.querySelectorAll('.child_btn')


            if (this.#canvas.parent_task_for_binding_chosen === null) {
                this.#canvas.parent_task_for_binding_chosen = this
                this.#child_btn.classList.add('chosen-parent')
                for (let i = 0; i < all_bind_child_btn.length; i++) {
                    if (this.#child_btn !== all_bind_child_btn[i])
                        all_bind_child_btn[i].classList.add('potential-child');
                }
            } else {
                if (this.#canvas.parent_task_for_binding_chosen !== this) {
                    let target_card = evt.target.closest('.card');
                    let child_task_id = target_card.dataset.taskId;
                    let child_task_mindmap_id = target_card.dataset.taskMindMapId;
                    this.#canvas.parent_task_for_binding_chosen.add_child_task(child_task_id, child_task_mindmap_id)
                }
                this.#canvas.parent_task_for_binding_chosen.child_btn.classList.remove('chosen-parent')
                this.#canvas.parent_task_for_binding_chosen = null
                for (let i = 0; i < all_bind_child_btn.length; i++) {
                    all_bind_child_btn[i].classList.remove('potential-child');
                }
            }

        })

    }

    add_child_task(child_task_id, child_task_mindmap_id) {
        console.log('parent -> child_task', this.data.task.title, this.#canvas.cards[+child_task_mindmap_id].data.task.title)
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/tasks/update_attrs',
            data: JSON.stringify({
                'task_id': this.#data.task.pk,
                'new_child_id': +child_task_id,
            }),
            success: (data) => {
                if (data.success === true) {
                    console.log('task_id', data.task_id);
                    this.#canvas.add_relation(this, this.#canvas.cards[+child_task_mindmap_id], {});
                } else {
                    console.error(data.error_message);
                }
            },
            dataType: 'json'
        });
    }

    __create_row(children) {
        const new_row = document.createElement('div');
        new_row.classList.add('row')
        children.forEach(c => new_row.appendChild(c))
        return new_row
    }

    __create_tag(tag) {
        const new_elem = document.createElement('div');
        new_elem.classList.add('tag');
        new_elem.dataset.tagId = tag.pk;
        new_elem.innerHTML = tag.title;
        new_elem.style.backgroundColor = tag.color;
        new_elem.style.color = tag.text_color;
        return new_elem
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

    set_x_y(x, y) {
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

    get center() {
        let x = this.#x + this.#width / 2;
        let y = this.#y + this.#height / 2;
        return {x, y}
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
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.left = `${this.#x}px`;
        this.#element.style.height = `${this.#height}px`;
        this.#element.style.top = `${this.#y}px`;
    }

    snap_previous_data(...attrs) {
        attrs.map(attr => this.#previous_data[attr] = this[attr]);
    }

    get previous_data_keys() {
        return Object.keys(this.#previous_data);
    }

    get data() {
        return this.#data;
    }

    get_data(...attrs) {
        let result = {}
        attrs.map(attr => result[attr] = this[attr]);
        return result;
    }

    reset_previous_data() {
        this.#previous_data = {};
    }

    rollback_previous_data() {
        for (const attr in this.#previous_data) {
            this[attr] = this.#previous_data[attr]
        }
        this.redraw();
    }

    get child_btn() {
        return this.#child_btn;
    }

    get canvas() {
        return this.#canvas;
    }

    delete_tag(tag_id, tag_elem){
        debugger;
        const tags = this.#data.tags
        const tag = this.#tags.querySelector('')
        this.#tags.removeChild(tag_elem)
    }

}

export {
    Card
}
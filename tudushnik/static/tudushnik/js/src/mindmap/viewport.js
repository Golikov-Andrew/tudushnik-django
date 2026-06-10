import {Canvas} from "./canvas";

class MindMapViewport {
    #element;
    #canvas;
    #taken_card;
    #safe_border_width;
    #start_mousedown_time;
    #is_mouse_pressed;
    #cards_sides;
    #cards_corners;
    #move_sides_functions;

    constructor(root_selector) {
        this.#element = document.querySelector(root_selector)
        this.#element.style.overflow = 'auto';
        this.#element.style.position = 'relative';

        this.#canvas = new Canvas(this);

        this.#taken_card = null;
        this.#safe_border_width = 50;
        this.#start_mousedown_time = 0;
        this.#is_mouse_pressed = false;

        this._drop_card = this.drop_card.bind(this)
        this._move_card = this.move_card.bind(this)

        this.#cards_sides = {
            'top': ['y', 'height'],
            'right': ['width'],
            'bottom': ['height'],
            'left': ['x', 'width']
        }
        this.#cards_corners = {
            'left': {
                'top': ['y', 'height', 'x', 'width'],
                'bottom': ['height', 'x', 'width']
            },
            'right': {
                'top': ['y', 'height', 'width'],
                'bottom': ['height', 'width'],
            },
        }
        this.#move_sides_functions = {
            'top': (evt) => {
                const cursor_y = evt.clientY - this.cards_container_rect.top + 10;
                let new_height = (this.#taken_card.y + this.#taken_card.height) - cursor_y;
                this.#taken_card.set_y(cursor_y);
                this.#taken_card.set_height(new_height);
            },
            'right': (evt) => {
                const cursor_x = evt.clientX - this.cards_container_rect.left;
                this.#taken_card.set_width(cursor_x - this.#taken_card.x);
            },
            'bottom': (evt) => {
                const cursor_y = evt.clientY - this.cards_container_rect.top;
                this.#taken_card.set_height(cursor_y - this.#taken_card.y);
            },
            'left': (evt) => {
                const cursor_x = evt.clientX - this.cards_container_rect.left + 10;
                let new_width = (this.#taken_card.x + this.#taken_card.width) - cursor_x;
                this.#taken_card.set_x(cursor_x);
                this.#taken_card.set_width(new_width);
            }
        }
        for (const side in this.#cards_sides) {
            this[`_move_side_${side}`] = this.move_side.bind(this, side)
        }
        for (const h_side in this.#cards_corners) {
            for (const v_side in this.#cards_corners[h_side]) {
                this[`_move_corner_${h_side}_${v_side}`] = this.move_corner.bind(this, h_side, v_side)
            }
        }

        this.#element.addEventListener('scroll',(evt)=>{
            this.#canvas.rulers.h._element.style.top = `${this.#element.scrollTop - 50}px`
            this.#canvas.rulers.v._element.style.left = `${this.#element.scrollLeft - 50}px`
        })

    }

    get canvas() {
        return this.#canvas;
    }

    get element() {
        return this.#element;
    }

    init(cards_list) {
        this.#element.appendChild(this.#canvas.element);
        this.#canvas.load_cards(cards_list);
    }

    scroll_if_in_safe_zone(clientX, movementX, clientY, movementY) {
        let viewportBoundingRect = this.#element.getBoundingClientRect()
        let canvasBoundingRect = this.#canvas.element.getBoundingClientRect()

        if (clientX - viewportBoundingRect.left < this.#safe_border_width && movementX < 0) {
            let width_diff = clientX - canvasBoundingRect.left;
            if (width_diff < 0) {
                this.#canvas.increase_margin_left(-width_diff)
            }
            this.#element.scrollLeft -= 10
        }
        if (clientX > viewportBoundingRect.right - this.#safe_border_width && movementX > 0) {
            this.#element.scrollLeft += 10
        }

        if (clientY - viewportBoundingRect.top < this.#safe_border_width && movementY < 0) {
            let height_diff = clientY - canvasBoundingRect.top;
            if (height_diff < 0) {
                this.#canvas.increase_margin_top(-height_diff)
            }
            this.#element.scrollTop -= 10
        }
        if (clientY > viewportBoundingRect.bottom - this.#safe_border_width && movementY > 0) {
            this.#element.scrollTop += 10
        }
    }

    update_card(...attrs) {
        const d = {
            'task_mindmap_id': this.#taken_card.pk,
            ...this.#taken_card.get_data(...attrs)
        }
        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/mindmaps/update_card_attrs',
            data: JSON.stringify(d),
            success: (data) => {
                if (data.success === true) {
                    console.log('success true');
                    this.#canvas.refresh_view();
                } else {
                    console.log('success false')
                    this.#taken_card.rollback_previous_data();
                }
                this.#taken_card.reset_previous_data();
                this.#taken_card = null;
            },
            error: (data) => {
                console.error(data);
                this.#taken_card.rollback_previous_data();
                this.#taken_card.reset_previous_data();
                this.#taken_card = null;
            },
            dataType: 'json'
        });
    }

    get cards_container_rect() {
        return this.#canvas.origin.cards_container.getBoundingClientRect();
    }

    take_card(card) {
        this.#taken_card = card;
        this.#start_mousedown_time = Date.now();
        this.#is_mouse_pressed = true;
        this.#taken_card.snap_previous_data('x', 'y')
        this.element.addEventListener('mousemove', this._move_card, {capture: true});
        this.element.addEventListener('mouseleave', this._drop_card);
    }

    drop_card() {
        this.#is_mouse_pressed = false;
        this.element.removeEventListener('mousemove', this._move_card, {capture: true});
        this.element.removeEventListener('mouseleave', this._drop_card);

        const endTime = Date.now();
        const duration = endTime - this.#start_mousedown_time;
        if (duration < 200) {
            this.#taken_card.toggle_helpers()
            this.#taken_card.rollback_previous_data();
            this.#taken_card.reset_previous_data();
            this.#taken_card = null;
            return;
        }

        this.update_card('x', 'y')
    }

    move_card(evt) {
        const container = this.cards_container_rect;
        this.#taken_card.set_x_y(
            evt.clientX - container.left - 10,
            evt.clientY - container.top - 10
        )
        this.scroll_if_in_safe_zone(evt.clientX, evt.movementX, evt.clientY, evt.movementY)
    }

    ///////////////

    take_side(card, side) {
        this.#taken_card = card;
        this.#taken_card.snap_previous_data(...this.#cards_sides[side])
        this.element.addEventListener('mousemove', this[`_move_side_${side}`]);
    }

    drop_side(side) {
        this.element.removeEventListener('mousemove', this[`_move_side_${side}`]);
        this.update_card(...this.#taken_card.previous_data_keys);
    }

    move_side(side, evt) {
        this.#move_sides_functions[side](evt);
    }

    ///////////

    take_corner(card, h_side, v_side) {
        this.#taken_card = card;
        this.#taken_card.snap_previous_data(...this.#cards_corners[h_side][v_side])
        this.element.addEventListener('mousemove', this[`_move_corner_${h_side}_${v_side}`]);
    }

    drop_corner(h_side, v_side) {
        this.element.removeEventListener('mousemove', this[`_move_corner_${h_side}_${v_side}`]);
        this.update_card(...this.#taken_card.previous_data_keys);
    }

    move_corner(h_side, v_side, evt) {
        this.#move_sides_functions[h_side](evt);
        this.#move_sides_functions[v_side](evt);
    }

}

export {
    MindMapViewport
}
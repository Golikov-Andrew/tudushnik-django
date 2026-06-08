import {Canvas} from "./canvas";
import {Card} from "./card";

class MindMapViewport {
    #element;
    #canvas;
    #taken_card;
    #safe_border_width;
    #start_mousedown_time;
    #is_mouse_pressed;

    constructor(root_selector) {
        this.#element = document.querySelector(root_selector)
        this.#element.style.overflow = 'auto';

        this.#canvas = new Canvas(this);

        this.#taken_card = null;
        this.#safe_border_width = 50;
        this.#start_mousedown_time = 0;
        this.#is_mouse_pressed = false;

        this._drop_card = this.drop_card.bind(this)

        this._move_card = this.move_card.bind(this)
        this._move_right_side = this.move_right_side.bind(this);
        this._move_left_side = this.move_left_side.bind(this);
        this._move_top_side = this.move_top_side.bind(this);
        this._move_bottom_side = this.move_bottom_side.bind(this);
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
        console.log('take_card')
        this.#taken_card = card;
        this.#start_mousedown_time = Date.now();
        this.#is_mouse_pressed = true;
        this.#taken_card.snap_previous_data('x', 'y')
        this.element.addEventListener('mousemove', this._move_card, {capture: true});
        this.element.addEventListener('mouseleave', this._drop_card);
    }

    drop_card() {
        console.log('drop_card')
        this.#is_mouse_pressed = false;
        this.element.removeEventListener('mousemove', this._move_card, {capture: true});
        this.element.removeEventListener('mouseleave', this._drop_card);

        const endTime = Date.now();
        const duration = endTime - this.#start_mousedown_time;
        if (duration < 200) {
            console.log('was click')
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

    take_right_side(card) {
        console.log('take_right_side');
        this.#taken_card = card;
        this.#taken_card.snap_previous_data('width')
        this.element.addEventListener('mousemove', this._move_right_side);
    }

    drop_right_side() {
        console.log('drop_right_side')
        this.element.removeEventListener('mousemove', this._move_right_side);
        this.update_card('width');
    }

    move_right_side(evt) {
        console.log('move_right_side')
        const cursor_x = evt.clientX - this.cards_container_rect.left;
        this.#taken_card.set_width(cursor_x - this.#taken_card.x);
    }

    //

    take_left_side(card) {
        console.log('take_left_side');
        this.#taken_card = card;
        this.#taken_card.snap_previous_data('x', 'width')
        this.element.addEventListener('mousemove', this._move_left_side);
    }

    drop_left_side() {
        console.log('drop_left_side')
        this.element.removeEventListener('mousemove', this._move_left_side);
        this.update_card('x', 'width');
    }

    move_left_side(evt) {
        console.log('move_left_side')
        const cursor_x = evt.clientX - this.cards_container_rect.left + 10;
        let new_width = (this.#taken_card.x + this.#taken_card.width) - cursor_x;
        this.#taken_card.set_x(cursor_x);
        this.#taken_card.set_width(new_width);
    }
    
    take_top_side(card) {
        console.log('take_top_side');
        this.#taken_card = card;
        this.#taken_card.snap_previous_data('y', 'height')
        this.element.addEventListener('mousemove', this._move_top_side);
    }

    drop_top_side() {
        console.log('drop_top_side')
        this.element.removeEventListener('mousemove', this._move_top_side);
        this.update_card('y', 'height');
    }

    move_top_side(evt) {
        console.log('move_top_side')
        const cursor_y = evt.clientY - this.cards_container_rect.top + 10;
        let new_height = (this.#taken_card.y + this.#taken_card.height) - cursor_y;
        this.#taken_card.set_y(cursor_y);
        this.#taken_card.set_height(new_height);
    }
    
    take_bottom_side(card) {
        console.log('take_bottom_side');
        this.#taken_card = card;
        this.#taken_card.snap_previous_data('height')
        this.element.addEventListener('mousemove', this._move_bottom_side);
    }

    drop_bottom_side() {
        console.log('drop_bottom_side')
        this.element.removeEventListener('mousemove', this._move_bottom_side);
        this.update_card('height');
    }

    move_bottom_side(evt) {
        console.log('move_bottom_side')
        const cursor_y = evt.clientY - this.cards_container_rect.top;
        this.#taken_card.set_height(cursor_y - this.#taken_card.y);
    }


}

export {
    MindMapViewport
}
import {Card} from "./card";

class Origin {
    #element;
    #cards_container;
    #left_offset;
    #top_offset;

    constructor() {
        this.#element = document.createElement('div');
        this.#element.classList.add('origin');
        this.#element.style.position = 'absolute';
        this.set_offsets(500, 500);
        this.#element.style.width = '1px';
        this.#element.style.height = '1px';
        this.#element.style.outline = '1px solid black';

        this.#cards_container = document.createElement('div');
        this.#cards_container.classList.add('cards_container');
        this.#cards_container.style.position = 'relative';

        this.#element.appendChild(this.#cards_container);
    }

    get cards_container() {
        return this.#cards_container;
    }

    get element() {
        return this.#element;
    }

    set_offsets(left, top) {
        this.#left_offset = left;
        this.#top_offset = top;
        this.#element.style.left = `${this.#left_offset}px`;
        this.#element.style.top = `${this.#top_offset}px`;
    }
}

class Canvas {
    #app;
    #element;
    #origin;
    #cards;

    #width;
    #height;
    // #canvas_wrapper;
    #margin;

    constructor(app) {
        this.#app = app;
        this.#element = document.createElement('div');
        this.#element.classList.add('canvas');
        this.#element.style.position = 'relative';
        this.#width = 1000;
        this.#height = 1000;
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.height = `${this.#width}px`;

        this.#element.style.backgroundColor = '#CCCCCC';
        this.#margin = 50;
        this.#element.style.marginRight = `${this.#margin}px`;
        this.#element.style.marginBottom = `${this.#margin}px`;
        this.#element.style.marginTop = `${this.#margin}px`;
        this.#element.style.marginLeft = `${this.#margin}px`;

        // this.#canvas_wrapper = document.createElement('div');
        // this.#canvas_wrapper.classList.add('canvas_wrapper');
        // this.#canvas_wrapper.style.absolute = 'absolute';
        // this.#canvas_wrapper.style.left = '0px';
        // this.#canvas_wrapper.style.top = '0px';
        // this.#canvas_wrapper.appendChild(this.#element);

        this.#cards = {};

        this.#origin = new Origin();
        this.#element.appendChild(this.#origin.element);


    }


    get element() {
        return this.#element;
    }

    get app() {
        return this.#app;
    }

    get origin() {
        return this.#origin;
    }

    add_card(card) {
        this.#origin.cards_container.appendChild(card.element)
    }

    load_cards(cards_list) {
        for (let i = 0, c, new_card; i < cards_list.length; i++) {
            c = cards_list[i];
            new_card = new Card(this, c);
            this.#cards[c.pk] = new_card;
            this.add_card(new_card);
        }
        this.refresh_view();
    }

    refresh_view() {
        let top_border = -500;
        let right_border = 500;
        let bottom_border = 500;
        let left_border = -500;

        for (const pk in this.#cards) {
            const card = this.#cards[pk];
            if (card.y < top_border) top_border = card.y;
            if (card.x + card.width > right_border) right_border = card.x + card.width;
            if (card.y + card.height > bottom_border) bottom_border = card.y + card.height;
            if (card.x < left_border) left_border = card.x;
        }

        this.set_dimensions(right_border - left_border, bottom_border - top_border);
        this.#origin.set_offsets(-left_border, -top_border);

    }

    increase_margin_top(value) {
        this.#element.style.marginTop = `${this.#margin + value}px`;
    }

    increase_margin_left(value) {
        this.#element.style.marginLeft = `${this.#margin + value}px`;
    }

    set_dimensions(width, height) {
        this.#width = width;
        this.#height = height;
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.height = `${this.#height}px`;
        this.#element.style.marginLeft = `${this.#margin}px`;
        this.#element.style.marginTop = `${this.#margin}px`;
    }


}

export {
    Canvas
}
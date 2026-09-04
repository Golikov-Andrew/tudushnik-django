import {createSVGElem} from "../svg";

function getTangentAtLength(path, length) {
    const p1 = path.getPointAtLength(length);
    const p2 = path.getPointAtLength(length + 0.1);
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return {angle};
}

class RelationHand {
    #key;
    #element;
    #cx;
    #cy;
    #r;
    #relation;

    constructor(relation, key, x, y) {
        this.#relation = relation
        this.#key = key
        this.#element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.#cx = x;
        this.#cy = y;
        this.#r = 10;
        this.#element.setAttribute('r', this.#r);
        this.#element.classList.add('hand');
        this.#element.addEventListener('mousedown', (evt) => {
            relation.takeHand(this);
        })
        this.#element.addEventListener('mouseup', (evt) => {
            relation.dropHand();
        })
    }

    get element() {
        return this.#element;
    }

    get key() {
        return this.#key;
    }

    get x() {
        return this.#cx;
    }

    get y() {
        return this.#cy;
    }

    set_xy(x, y) {
        this.#cx = x;
        this.#cy = y;
        this.#relation
    }

    redraw() {
        this.#element.setAttribute('cx', this.#cx);
        this.#element.setAttribute('cy', this.#cy);
    }
}

class CardsRelation {
    #parent_card;
    #child_card;
    #element;
    #top;
    #left;
    #width;
    #height;
    #path;
    #d;
    #hands;
    #arrow;
    #arrow_position;
    #delete_button_position;
    #taken_hand;
    #curve;
    #delete_button;

    constructor(parent_card, child_card, curve) {
        this.#parent_card = parent_card;
        this.#child_card = child_card;
        this.#element = createSVGElem('svg');
        this.#element.style.position = 'absolute';
        this.#element.style.overflow = 'visible';

        this.#curve = curve;

        this.#path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.#d = `M0,0 C0,0 1,1 1,1`;
        this.#path.setAttribute('stroke', 'green');
        this.#path.setAttribute('fill', 'transparent');
        this.#path.setAttribute('stroke-width', 6);
        this.#element.appendChild(this.#path);

        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('id', 'arrow-template')
        arrow.setAttribute('d', 'M 10,0 L 0,5 L 10,10 Z');
        arrow.setAttribute('stroke', 'green');
        arrow.setAttribute('stroke-width', 6);
        defs.appendChild(arrow);

        const close_icon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        close_icon.setAttribute('id', 'close_button_template')
        close_icon.setAttribute('d', 'M0,0 L10,10 M0,10 L10,0');
        close_icon.setAttribute('stroke', 'red');
        close_icon.setAttribute('stroke-width', 6);
        defs.appendChild(close_icon);

        this.#element.appendChild(defs);

        if (this.#curve.cx !== undefined) {
            this.#hands = {
                child: new RelationHand(this, 'child', this.#curve.cx, this.#curve.cy),
                parent: new RelationHand(this, 'parent', this.#curve.px, this.#curve.py),
            }
        } else {
            this.#hands = {
                child: new RelationHand(this, 'child', 200, 200),
                parent: new RelationHand(this, 'parent', 0, 0),
            }
        }

        this.#arrow = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        this.#arrow.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#arrow-template");
        this.#arrow.classList.add('arrow');
        this.#element.appendChild(this.#arrow);

        this.#element.appendChild(this.#hands.child.element);
        this.#element.appendChild(this.#hands.parent.element);

        this.#arrow_position = 0.5;
        this.#delete_button_position = 0.6;

        this.#delete_button = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        this.#delete_button.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#close_button_template");
        this.#delete_button.classList.add('relation-delete-btn');
        this.#element.appendChild(this.#delete_button);

        this.#delete_button.addEventListener('click', () => {
            console.log('delete');
            const d = {
                'parent_id': this.#parent_card.data.task.pk,
                'child_id': this.#child_card.data.task.pk
            }

            $.ajax({
                type: "POST",
                headers: {
                    'X-CSRFToken': csrfToken
                },
                url: '/mindmaps/delete_cards_relation',
                data: JSON.stringify(d),
                success: (data) => {
                    if (data.success === true) {
                        console.log('success true');
                        this.#parent_card.canvas.remove_relation(this.#parent_card, this.#child_card)
                    } else {
                        console.log('success false')
                    }
                },
                error: (data) => {
                    console.error(data);
                },
                dataType: 'json'
            });
        })

        this.#path.addEventListener('click', (e) => {
            if (this.#element.classList.contains('active')) {
                this.#element.classList.remove('active')
            } else {
                this.#element.classList.add('active')
            }

        });
        this._move_hand = this.moveHand.bind(this)
        this._drop_hand = this.dropHand.bind(this)

        this.redraw();
    }

    get element() {
        return this.#element;
    }

    redraw() {
        const parent_center = this.#parent_card.center;
        const child_center = this.#child_card.center;

        this.#top = Math.min(parent_center.y, child_center.y)
        this.#left = Math.min(parent_center.x, child_center.x)
        this.#width = Math.abs(parent_center.x - child_center.x)
        this.#height = Math.abs(parent_center.y - child_center.y)

        this.#element.style.top = `${this.#top}px`;
        this.#element.style.left = `${this.#left}px`;
        this.#element.style.width = `${this.#width}px`;
        this.#element.style.height = `${this.#height}px`;

        let x1, y1, x2, y2;
        if (parent_center.y > child_center.y) {
            y1 = 0;
            y2 = this.#height;
        } else {
            y1 = this.#height;
            y2 = 0;
        }

        if (parent_center.x > child_center.x) {
            x1 = 0;
            x2 = this.#width;
        } else {
            x1 = this.#width;
            x2 = 0;
        }
        this.#d = `M${x1},${y1} C${this.#hands.parent.x},${this.#hands.parent.y} ${this.#hands.child.x},${this.#hands.child.y} ${x2},${y2}`;

        // this.#hands.parent.set_xy(x1, y1)
        this.#hands.parent.redraw()
        // this.#hands.child.set_xy(x2, y2)
        this.#hands.child.redraw()

        this.#path.setAttribute('d', this.#d);

        const totalLength = this.#path.getTotalLength();
        let length = totalLength * this.#arrow_position;
        let length_delete_button = totalLength * this.#delete_button_position;

        const point = this.#path.getPointAtLength(length);
        const tangent = getTangentAtLength(this.#path, length);

        this.#arrow.setAttribute('x', point.x - 5);
        this.#arrow.setAttribute('y', point.y - 5); // 5 это половина высоты (10/2)
        this.#arrow.setAttribute('transform', `rotate(${tangent.angle}, ${point.x}, ${point.y})`);

        const point_delete_button = this.#path.getPointAtLength(length_delete_button);
        const tangent_delete_button = getTangentAtLength(this.#path, length_delete_button);
        this.#delete_button.setAttribute('x', point_delete_button.x - 5);
        this.#delete_button.setAttribute('y', point_delete_button.y - 5);
        // this.#delete_button.setAttribute('transform', `rotate(${tangent_delete_button.angle}, ${point_delete_button.x}, ${point_delete_button.y})`);
        // this.#delete_button.setAttribute('y', point.y - 20);
        // this.#delete_button.setAttribute('transform', `rotate(${tangent.angle}, ${point.x - 15}, ${point.y - 15})`);
    }

    // redraw_path_d() {
    //     // console.log(this.#d)
    //     let arr = this.#d.split(' ')
    //     if (this.#taken_hand.key === 'parent') {
    //         console.log('parent')
    //         arr[1] = `C${this.#taken_hand.x},${this.#taken_hand.y}`
    //     } else if (this.#taken_hand.key === 'child') {
    //         console.log('child')
    //         arr[2] = `${this.#taken_hand.x},${this.#taken_hand.y}`
    //     }
    //     console.log(arr.join(' '))
    //     this.#d = arr.join(' ')
    //     console.log(this.#d)
    //     this.#path.setAttribute('d', this.#d)
    //
    // }

    takeHand(hand) {
        this.#taken_hand = hand;
        // takenHandPointKey = pointKey;
        this.#taken_hand.element.addEventListener('mousemove', this._move_hand);
        this.#taken_hand.element.addEventListener('mouseleave', this._drop_hand);
        // takeArrow(useArrow)
    }

    dropHand() {
        this.#taken_hand.element.removeEventListener('mousemove', this._move_hand);
        this.#taken_hand.element.removeEventListener('mouseleave', this._drop_hand);
        this.#taken_hand = null;
        // takenHandPointKey = null;
        // this.dropArrow()
        this.update()

    }

    moveHand(evt) {
        const currentCx = this.#taken_hand.x;
        const currentCy = this.#taken_hand.y;
        const newCx = currentCx + evt.movementX;
        const newCy = currentCy + evt.movementY;
        this.#taken_hand.set_xy(newCx, newCy)
        // this.#taken_hand.redraw()
        this.redraw()

        // let newDValueArray = controlPath.getAttribute('d').split(' ');
        // newDValueArray[+takenHandPointKey] = `${newCx},${newCy}`;
        // if (takenHandPointKey === '1') newDValueArray[1] = 'C' + newDValueArray[1];
        // controlPath.setAttribute('d', newDValueArray.join(' '))

        // moveArrow(evt)
    }

    update() {

        const d = {
            'parent_id': this.#parent_card.data.task.pk,
            'child_id': this.#child_card.data.task.pk,
            'curve': {
                px: this.#hands.parent.x,
                py: this.#hands.parent.y,
                cx: this.#hands.child.x,
                cy: this.#hands.child.y,
            }
        }

        $.ajax({
            type: "POST",
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/mindmaps/update_cards_relation',
            data: JSON.stringify(d),
            success: (data) => {
                if (data.success === true) {
                    console.log('success true');
                    // this.#canvas.refresh_view();
                } else {
                    console.log('success false')
                    // this.#taken_card.rollback_previous_data();
                }
                // this.#taken_card.reset_previous_data();
                // this.#taken_card = null;
                // this.#canvas.redraw_relations()
            },
            error: (data) => {
                console.error(data);
                // this.#taken_card.rollback_previous_data();
                // this.#taken_card.reset_previous_data();
                // this.#taken_card = null;
            },
            dataType: 'json'
        });
    }

}

export {
    CardsRelation
}
import {shuffle} from "./utils";

class Deck {
    constructor(game) {
        this.game = game
        this.deck = []
    }

    pop() {
        return this.deck.pop()
    }

    push(elem) {
        return this.deck.push(elem)
    }

    shuffle() {
        shuffle(this.deck)
    }

    length() {
        return this.deck.length
    }

    item(i) {
        return this.deck[i]
    }
}

class Card {
    constructor(suit, color, html_entity, title, val) {
        this.color = color;
        this.html_entity = html_entity;
        this.title = title;
        this.suit = suit;
        this.val = val;
        this.elem = document.createElement('div')
        this.elem.setAttribute('title', `${this.suit} ${this.val}`)
        this.elem.classList.add('playing_card')
        this.elem.addEventListener('click', () => {
            if (this.elem.classList.contains('selected')) {
                this.elem.classList.remove('selected')
            } else {
                this.elem.classList.add('selected')
            }
        })

    }

    show_face() {
        this.elem.setAttribute('data-suit', this.suit)
        this.elem.setAttribute('data-val', this.val)
        this.elem.innerHTML = `<span style="color: ${this.color}">${this.html_entity}</span>` +
            `<span>${this.title}</span>`
    }

    show_back() {
        this.elem.removeAttribute('data-suit')
        this.elem.removeAttribute('data-val')
        // this.elem.innerHTML = `<span>X</span>`
        this.elem.innerHTML = `<span style="color: ${this.color}">${this.html_entity}</span>` +
            `<span>${this.title}</span>`
    }
}

export {
    Deck, Card
}
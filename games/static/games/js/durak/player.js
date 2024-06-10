import {DEFENDED, TAKE_CARDS} from "./variables";

class Player {
    constructor(title, game) {
        this.game = game
        this.title = title
        let temp = title.split('_')
        this.player_type = temp[0]
        this.player_id = temp[1]
        this.player_widget = null
        this.cards_container = null
        this.status_elem = null
        this.cards = []
        this.card_position = 0
        this.selected_cards = []
    }

    attack_behavior() {
        console.log('Поведение атакующего', this.title)
        let min_nominal = 100
        let target_card = null
        for (let i = 0, cc; i < this.cards.length; i++) {
            cc = this.cards[i]
            if (cc.val < min_nominal) {
                target_card = cc
                min_nominal = cc.val
            }
        }
        if (target_card === null) {
            target_card = this.cards[0]
        }
        this.select(target_card)
        this.attack()
        let this_game = this.game
        if (this.game.defender_player.player_type === 'bot') {
            console.log('Защищается бот', this.game.defender_player.title)
            let prom = new Promise((resolve, reject) => {
                let result = this_game.defender_player.defender_behavior()
                resolve(result)
            })
            prom.then(
                (result) => {
                    console.log(this_game.defender_player.player_id, result)
                    if (result === TAKE_CARDS) {
                        console.log('Бот забирает карты', this.game.defender_player.title)
                        for (let i = 0; i < this.game.attack_cards.length; i++) {
                            this.game.defender_player.take_card(this.game.attack_cards[i])
                        }
                        for (let i = 0; i < this.game.defend_cards.length; i++) {
                            this.game.defender_player.take_card(this.game.defend_cards[i])
                        }
                        this.game.defender_player.redraw_cards()
                        this.game.next_player()
                        this.game.next_player()
                        this.game.defender_player = this.game.get_next_player(this.game.active_player)
                        this.game.run_game()
                    }else{
                        console.log('Скидываем карты в утиль')
                        for (let i = 0; i < this.game.attack_cards.length; i++) {
                            this.game.remove_card_from_the_game(this.game.attack_cards[i])
                        }
                        for (let i = 0; i < this.game.defend_cards.length; i++) {
                            this.game.remove_card_from_the_game(this.game.defend_cards[i])
                        }
                        this.game.next_player()
                        this.game.defender_player = this.game.get_next_player(this.game.active_player)
                        this.game.run_game()
                    }

                },
                () => {

                }
            )
        }
    }

    defend_from(card, target_card) {
        console.log('Картой защищаемся от другой карты', card, target_card)
        let idx = Array.from(target_card.elem.parentNode.children).indexOf(target_card.elem)
        let card_elem = this.cards_container.removeChild(card.elem)
        card.show_face()
        this.game.defend_cards.push(card)
        this.game.defend_cards_area.appendChild(card_elem)
        card_elem.style.left = `${idx * 60}px`

    }

    defend() {
        if (this.game.attack_cards.length > this.game.defend_cards.length) {
            return TAKE_CARDS
        } else {
            return DEFENDED
        }
    }

    defender_behavior() {
        console.log('Поведение защищающегося', this.title)
        for (let i = 0, cc, s; i < this.game.attack_cards.length; i++) {
            cc = this.game.attack_cards[i]
            s = cc.suit
            for (let j = this.cards.length - 1, ccc; j >= 0; j--) {
                ccc = this.cards[j]
                if (ccc.suit === s && ccc.val > cc.val) {
                    this.defend_from(ccc, cc)
                    break
                }
            }
        }
        return this.defend()
    }

    select(card) {
        this.selected_cards.push(card)
    }

    deselect(card) {
        let idx = this.selected_cards.indexOf(card)
        card.elem.classList.remove('selected')
        return this.selected_cards.splice(idx, 1)
    }

    attack() {
        console.log(`${this.title} атакует`)
        for (let i = this.selected_cards.length - 1, cc; i >= 0; i--) {
            cc = this.selected_cards[i]
            this.deselect(cc)
            cc.show_face()
            this.game.attack_cards_area.appendChild(cc.elem)
            this.game.attack_cards.push(cc)
            let idx = this.cards.indexOf(cc)
            this.cards.splice(idx,1)
        }
    }

    reset_card_positions() {
        this.card_position = 0
    }

    redraw_cards() {
        console.log('Перерисовка карт', this.title)
        this.reset_card_positions()
        for (let i = 0, cc; i < this.cards.length; i++) {
            cc = this.cards[i]
            cc.elem.style.left = `${this.card_position * 30}px`
            this.card_position++
        }
    }

    toString() {
        return `${this.player_type}_${this.player_id}`
    }

    take_card(card) {
        if (this.cards.indexOf(card) === -1) {
            this.cards.push(card)
        }
        this.cards_container.appendChild(card.elem)
    }

    set_status(status) {
        this.status_elem.innerText = status
        console.log(this.title, 'статус ->', this.status_elem.innerText)
    }
}

export {
    Player
}
import {Player} from "./player";
import {Card, Deck} from "./deck";
import {ATTACK, DEFEND, DEFENDED, WAITING, SUITS, CARD_VALUES, TAKE_CARDS} from "./variables";
import {wait} from "./utils";


class DurakGame {
    constructor(game_state, client_id, status) {
        this.initial_game_state = game_state
        this.client_id = client_id
        this.status = status
        this.opponents_container = document.getElementById('opponents')
        this.window_owner_container = document.getElementById('window_owner_container')
        this.attack_cards_area = document.getElementById('attack_cards_area')
        this.defend_cards_area = document.getElementById('defend_cards_area')
        // this.own_panel_info_panel = document.querySelector('#own_panel .info_panel')
        // this.own_panel_control_panel = document.querySelector('#playground .cards_area')
        // this.own_panel_cards_area = document.querySelector('#own_panel .cards_area')
        this.deck_container = document.getElementById('deck')
        this.cards_removed_from_the_game = []
        this.cards_removed_from_the_game_container = document.getElementById('cards_removed_from_the_game')
        this.btn_start_game = document.getElementById('btn_start_game')
        this.btn_attack = document.getElementById('btn_attack')
        this.btn_defend = document.getElementById('btn_defend')
        this.players = []
        this.defend_addition_layer = {}

        this.active_player = null
        this.defender_player = null
        this.window_owner_player = null

        this.deck = new Deck(this)
        this.attack_cards = []
        this.defend_cards = []
        this.trump = null
        this.all_cards_dict = {}
    }

    redraw_players_cards() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].redraw_cards();
        }
    }

    all_players_take_more_cards() {
        let cur_player = this.active_player
        let counter = 0
        while (this.deck.length > 0) {
            if (cur_player.cards.length < 6) {
                let card = this.deck.pop()
                cur_player.take_card(card)
            } else {
                counter++
            }
            if (counter === this.players.length) {
                break;
            }
            cur_player = this.get_next_player(cur_player)
        }
        this.run_game()
    }

    select_handle_for_attack() {
        let suit = this.getAttribute('data-suit')
        let val = +this.getAttribute('data-val')
        let idx = Array.from(this.parentNode.children).indexOf(this)
        let game = window.game
        let cc = game.active_player.cards[idx]
        if (game.active_player.selected_cards.indexOf(cc) !== -1) {
            game.active_player.deselect(cc)
        } else if (game.active_player.selected_cards.length === 0) {
            game.active_player.selected_cards.push(cc)
        } else {
            for (let i = 0, ccc; i < game.active_player.selected_cards.length; i++) {
                ccc = game.active_player.selected_cards[i]
                if (ccc.val === val) {
                    game.active_player.select(cc)
                    return
                }
            }
            cc.elem.classList.remove('selected')
        }
    }

    select_handle_for_defend_1() {
        let game = window.game
        let suit = this.getAttribute('data-suit')
        let val = +this.getAttribute('data-val')
        let idx = Array.from(this.parentNode.children).indexOf(this)
        let cc = game.defender_player.cards[idx]

        if (game.defender_player.selected_cards.length === 0) {
            let ac;
            let selected = false
            for (const key in game.defend_addition_layer) {
                ac = game.defend_addition_layer[key]
                if (ac.suit === suit && ac.val < val) {
                    game.defender_player.select(cc)
                    console.log('карта выбрана')
                    selected = true
                    break
                }
                if (ac.suit !== game.trump && suit === game.trump) {
                    game.defender_player.select(cc)
                    console.log('карта выбрана')
                    selected = true
                    break
                }
                if (ac.suit === game.trump && suit === game.trump && ac.val < val) {
                    game.defender_player.select(cc)
                    console.log('карта выбрана')
                    selected = true
                    break
                }
            }
            if (selected !== true) {
                console.log('невозможно выбрать карту')

                this.classList.remove('selected')
            }

            // game.active_player.selected_cards.push(cc)
        } else if (game.defender_player.selected_cards.indexOf(cc) !== -1) {
            game.defender_player.deselect(cc)
            console.log('карта развыбрана')
        }
    }

    select_handle_for_defend_2() {
        // TODO: realize
        let game = window.game
        let suit = this.getAttribute('data-suit')
        let val = +this.getAttribute('data-val')
        let idx = Array.from(this.parentNode.children).indexOf(this)
        let cc = game.attack_cards[idx]
        let ck = `${suit} + ${val}`

        if (game.defender_player.selected_cards.length === 1) {

            let selected_card = game.defender_player.selected_cards[0]
            if (cc.suit === selected_card.suit && cc.val < selected_card.val) {
                game.defender_player.defend_from(selected_card, cc)
                selected_card.elem.classList.remove('selected')
            } else if (cc.suit === game.trump && selected_card.suit === game.trump && cc.val < selected_card.val) {
                game.defender_player.defend_from(selected_card, cc)
                selected_card.elem.classList.remove('selected')
            } else if (cc.suit !== game.trump && selected_card.suit === game.trump) {
                game.defender_player.defend_from(selected_card, cc)
                selected_card.elem.classList.remove('selected')
            }
        }
        this.classList.remove('selected')
    }

    player_attack() {
        let game = window.game
        game.active_player.attack()
        let result;
        if (game.defender_player.player_type === 'bot') {
            result = game.defender_player.defender_behavior()
        }
        console.log(game.defender_player.title, result)
        if (result === DEFENDED) {
            for (let i = 0; i < game.attack_cards.length; i++) {
                game.remove_card_from_the_game(game.attack_cards[i])
            }
            for (let i = 0; i < game.defend_cards.length; i++) {
                game.remove_card_from_the_game(game.defend_cards[i])
            }
            game.active_player = game.defender_player
            setTimeout(() => {
                game.run_game()
            }, 1000)
        } else {
            for (let i = 0; i < game.attack_cards.length; i++) {
                game.defender_player.take_card(game.attack_cards[i])
            }
            for (let i = 0; i < game.defend_cards.length; i++) {
                game.defender_player.take_card(game.defend_cards[i])
            }

            let cur_player = game.active_player
            game.next_player()
            game.defender_player = game.get_next_player(cur_player)
            setTimeout(() => {
                game.run_game()
            }, 1000)
        }

    }

    player_defend() {
        let game = window.game
        let prom = new Promise((resolve, reject) => {
            let result = game.defender_player.defend()
            this.removeEventListener('click', game.player_defend)
            for (let i = 0, cc; i < game.defender_player.cards.length; i++) {
                cc = game.defender_player.cards[i]
                cc.elem.removeEventListener('click', game.select_handle_for_defend_1)
            }
            for (let i = 0, cc; i < game.attack_cards.length; i++) {
                cc = game.attack_cards[i]
                cc.elem.removeEventListener('click', game.select_handle_for_defend_2)
            }
            resolve(result)
        })
        prom.then(
            (result) => {
                console.log(result)
                if (result === DEFENDED) {
                    console.log('Сбросить все карты в утиль и запустить игру, переключив активного игрока на себя и защищающегося')
                    for (let i = 0; i < game.attack_cards.length; i++) {
                        game.remove_card_from_the_game(game.attack_cards[i])
                    }
                    for (let i = 0; i < game.defend_cards.length; i++) {
                        game.remove_card_from_the_game(game.defend_cards[i])
                    }
                    game.active_player = game.defender_player
                    setTimeout(() => {
                        game.run_game()
                    }, 1000)

                } else {
                    console.log('Мы берём карты и запускаем игру, переключив активного игрока и защищающегося')
                    for (let i = 0; i < game.attack_cards.length; i++) {
                        game.defender_player.take_card(game.attack_cards[i])
                    }
                    for (let i = 0; i < game.defend_cards.length; i++) {
                        game.defender_player.take_card(game.defend_cards[i])
                    }
                    let cur_player = game.active_player
                    game.defender_player.redraw_cards()
                    game.next_player()
                    game.defender_player = game.get_next_player(cur_player)
                    game.run_game()
                }
            },
            () => {
            }
        )
    }

    run_game() {
        this.redraw_players_cards()
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].set_status(WAITING)
        }
        this.active_player.set_status(ATTACK)
        this.defender_player = this.get_next_player(this.active_player)
        this.defender_player.set_status(DEFEND)
        // донабрать карты
        this.all_players_take_more_cards()
        if (this.active_player.player_type === 'bot') {
            // this.active_player.set_status(ATTACK)
            this.active_player.attack_behavior()
        } else if (this.active_player === this.window_owner_player) {
            for (let i = 0, cc; i < this.active_player.cards.length; i++) {
                cc = this.active_player.cards[i]
                cc.elem.addEventListener('click', this.select_handle_for_attack)
            }
            debugger
            this.btn_attack.addEventListener('click', this.player_attack)
        }
        if (this.defender_player.player_type === 'bot') {
            this.defender_player.set_status(DEFEND)
            // this.defender_player.defender_behavior()
        } else if (this.defender_player === this.window_owner_player) {
            console.log('Мы защищаемся')
            this.defend_addition_layer = {}
            for (let i = 0, cc; i < this.defender_player.cards.length; i++) {
                cc = this.defender_player.cards[i]
                cc.elem.addEventListener('click', this.select_handle_for_defend_1)
            }
            for (let i = 0, cc; i < this.attack_cards.length; i++) {
                cc = this.attack_cards[i]
                this.defend_addition_layer[cc.suit + cc.val] = {
                    suit: cc.suit,
                    val: cc.val,
                    repel: null,
                };
                cc.elem.addEventListener('click', this.select_handle_for_defend_2)
            }
            this.btn_defend.addEventListener('click', this.player_defend)
        }
    }

    set_first_player() {
        let min_trump_val = 100
        let min_trump_card = null
        for (let i = 0, cp; i < this.players.length; i++) {
            cp = this.players[i]
            for (let j = 0, cc; j < cp.cards.length; j++) {
                cc = cp.cards[j]
                if (cc.suit === this.trump && cc.val < min_trump_val) {
                    min_trump_val = cc.val
                    min_trump_card = cc
                    this.active_player = cp
                }
            }
        }
        if (min_trump_val === 100) {
            this.active_player = this.players[0]
        }
        console.log('Первый игрок определён ->', this.active_player)
        min_trump_card.show_face()
        setTimeout(() => {
            if (min_trump_card.elem.closest('#playground') === null || min_trump_card.elem.closest('#playground') === undefined) {
                if (min_trump_card.elem.closest('#control_panel') === null || min_trump_card.elem.closest('#control_panel') === undefined) {
                    min_trump_card.show_back()
                }
            }
        }, 3000)
    }

    deal_card(this_game, counter, sum_deal_card_invoke) {
        // let counter = 0
        let promise = new Promise((resolve, reject) => {
            this_game.next_player()
            let card = this.deck.pop()
            this_game.deck_container.removeChild(card.elem)
            this_game.active_player.take_card(card)
            card.elem.style.left = `${this_game.active_player.card_position}px`
            this_game.active_player.card_position += 20
            this_game.active_player.cards_container.appendChild(card.elem)
            if (this_game.active_player === this_game.window_owner_player) {
                card.show_face()
            }
            counter++
            if (counter < sum_deal_card_invoke) {
                setTimeout(() => {
                    resolve();
                }, 100);
            } else {
                reject();
            }

        })
        promise.then(
            () => {
                this_game.deal_card(this_game, counter, sum_deal_card_invoke)
            },
            () => {
                let prom = new Promise((resolve, reject) => {
                    this_game.set_first_player()
                    resolve()
                })
                prom.then(() => {
                        this_game.run_game()
                    }, () => {

                    }
                )

            }
        )
    }

    init() {
        for (let i = 0, current_player; i < this.initial_game_state.players.length; i++) {
            current_player = new Player(this.initial_game_state.players[i], this)
            if (client_id === current_player.player_id && current_player.player_type !== 'bot') {
                this.window_owner_player = current_player
                this.window_owner_container.appendChild(this.create_player_widget(current_player))
                // this.init_own_panel()

            } else {
                this.opponents_container.appendChild(this.create_player_widget(current_player))
            }
            this.players.push(current_player)
        }
        this.init_deck()
        this.btn_start_game.addEventListener('click', () => {
            this.btn_start_game.classList.add('hidden')
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].reset_card_positions()
            }

            let this_game = this
            let sum_deal_card_invoke = this_game.players.length * 6
            let counter = 0
            this.deal_card(this_game, counter, sum_deal_card_invoke)
        })
    }

    next_player() {
        if (this.active_player === null) {
            this.active_player = this.players[0]
        } else {
            this.active_player = this.get_next_player(this.active_player)
        }
        console.log('Активный игрок ->', this.active_player.title)
    }

    get_next_player(player) {
        let idx = this.players.indexOf(player)
        idx++
        if (idx === this.players.length) {
            return this.players[0]
        } else {
            return this.players[idx]
        }
    }

    card_key(suit_key, val) {
        return `${suit_key}_${val}`
    }

    init_own_panel() {
        this.own_panel_info_panel.innerHTML = `Я - ${WAITING}`
    }

    init_deck() {
        let new_card;
        for (const suit_key in SUITS) {
            for (const val in CARD_VALUES) {
                new_card = new Card(
                    suit_key,
                    SUITS[suit_key].color,
                    SUITS[suit_key].html_entity,
                    val,
                    CARD_VALUES[val]
                )
                this.all_cards_dict[this.card_key(suit_key, val)] = new_card
                this.deck.push(new_card)
            }
        }
        this.deck.shuffle()
        for (let i = 0, cur_left_value = 0, cc; i < this.deck.length(); i++) {
            cc = this.deck.item(i)
            if (i === 0) {
                cc.show_face()
                cur_left_value += 10
                this.trump = cc.suit
                console.log('trump', this.trump)
            } else {
                cc.show_back()
                cc.elem.style.left = `${cur_left_value}px`
                cur_left_value += 2
            }
            this.deck_container.appendChild(cc.elem)
        }
    }

    create_player_widget(player) {
        let new_widget = document.createElement('div')
        new_widget.classList.add('player_widget')
        let opponents_title = document.createElement('div')
        opponents_title.classList.add('opponent_title')
        let opponents_name = document.createElement('span')
        opponents_name.classList.add('opponent_name')
        opponents_name.innerHTML = player.toString() + ' -&nbsp;'
        opponents_title.appendChild(opponents_name)
        let opponents_status = document.createElement('span')
        opponents_status.classList.add('opponents_status')
        opponents_status.innerText = WAITING
        opponents_title.appendChild(opponents_status)
        new_widget.append(opponents_title)
        let opponents_cards = document.createElement('div')
        opponents_cards.classList.add('opponents_cards')
        new_widget.append(opponents_cards)
        player.player_widget = new_widget
        player.status_elem = opponents_status
        player.cards_container = opponents_cards
        return new_widget
    }

    remove_card_from_the_game(card) {
        this.cards_removed_from_the_game_container.appendChild(card.elem)
        this.cards_removed_from_the_game.push(card)
        let idx = this.cards_removed_from_the_game.indexOf(card)
        card.elem.style.left = `${idx * 2}px`
        console.log('Скинута карта', card.suit, card.val)
    }
}

const durak_game = new DurakGame(game_state, client_id);
durak_game.init()
window.game = durak_game


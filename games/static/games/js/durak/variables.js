const WAITING = 'Ожидание'
const ATTACK = 'Нападение'
const DEFEND = 'Защита'
const TAKE_CARDS = 'Забирает карты'
const DEFENDED = 'Отбился'
const SUITS = {
    'Bu': {color: 'red', html_entity: '&diams;'},
    'Ch': {color: 'red', html_entity: '&hearts;'},
    'Tr': {color: 'black', html_entity: '&clubs;'},
    'Pi': {color: 'black', html_entity: '&spades;'}
}
const CARD_VALUES = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14,
}

export {
    WAITING, ATTACK, DEFEND, TAKE_CARDS, DEFENDED, SUITS, CARD_VALUES
}
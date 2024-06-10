const chat_messages_container = document.getElementById('chat_messages_container'),
    input_new_message = document.getElementById('input_new_message');


function show_message(username, message) {
    let new_message_element = document.createElement('div');
    new_message_element.innerText = `${(new Date()).toISOString()} - ${username}: ${message}`
    chat_messages_container.append(new_message_element)
    chat_messages_container.scrollTop = chat_messages_container.scrollHeight;
    input_new_message.value = '';
}

const form_send_message = document.getElementById('form_send_message');
form_send_message.addEventListener('submit', (evt) => {
    evt.preventDefault()
    show_message(client_username, input_new_message.value)
})


////////////////

// document.querySelector('#room-name-input').focus();
document.querySelector('#room-name-input').onkeyup = function (e) {
    if (e.key === 'Enter') {  // enter, return
        document.querySelector('#room-name-submit').click();
    }
};

document.querySelector('#room-name-submit').onclick = function (e) {
    let roomName = document.querySelector('#room-name-input').value;
    window.location.pathname = '/chat/' + roomName + '/';
};

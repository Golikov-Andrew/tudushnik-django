/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./tudushnik/static/tudushnik/js/src/chat/index.js":
/*!*********************************************************!*\
  !*** ./tudushnik/static/tudushnik/js/src/chat/index.js ***!
  \*********************************************************/
/***/ (() => {

eval("const chat_messages_container = document.getElementById('chat_messages_container'),\n    input_new_message = document.getElementById('input_new_message');\n\n\nfunction show_message(username, message) {\n    let new_message_element = document.createElement('div');\n    new_message_element.innerText = `${(new Date()).toISOString()} - ${username}: ${message}`\n    chat_messages_container.append(new_message_element)\n    chat_messages_container.scrollTop = chat_messages_container.scrollHeight;\n    input_new_message.value = '';\n}\n\nconst form_send_message = document.getElementById('form_send_message');\nform_send_message.addEventListener('submit', (evt) => {\n    evt.preventDefault()\n    show_message(client_username, input_new_message.value)\n})\n\n\n////////////////\n\n// document.querySelector('#room-name-input').focus();\ndocument.querySelector('#room-name-input').onkeyup = function (e) {\n    if (e.key === 'Enter') {  // enter, return\n        document.querySelector('#room-name-submit').click();\n    }\n};\n\ndocument.querySelector('#room-name-submit').onclick = function (e) {\n    let roomName = document.querySelector('#room-name-input').value;\n    window.location.pathname = '/chat/' + roomName + '/';\n};\n\n\n//# sourceURL=webpack://tudushnik-pack/./tudushnik/static/tudushnik/js/src/chat/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./tudushnik/static/tudushnik/js/src/chat/index.js"]();
/******/ 	
/******/ })()
;
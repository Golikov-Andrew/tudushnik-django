/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dom_utils.js":
/*!**********************!*\
  !*** ./dom_utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DOMElem: () => (/* binding */ DOMElem)\n/* harmony export */ });\nclass DOMElem {\n    constructor(tag_name, options) {\n        this.element = document.createElement(tag_name)\n        if (options !== undefined) {\n            if (options.hasOwnProperty('classes')) {\n                for (let i = 0; i < options.classes.length; i++) {\n                    this.element.classList.add(options.classes[i])\n                }\n            }\n            if (options.hasOwnProperty('attrs')) { // id, data, e.t.c\n                for (const attr in options.attrs) {\n                    this.element.setAttribute(attr, options.attrs[attr])\n                }\n            }\n            if (options.hasOwnProperty('children')) {\n                for (let i = 0; i < options.children.length; i++) {\n                    if(options.children[i] instanceof DOMElem){\n                        this.element.appendChild(options.children[i].element)\n                    }else{\n                        this.element.appendChild(options.children[i])\n                    }\n                }\n            }\n            if (options.hasOwnProperty('html')) {\n                this.element.innerHTML = options.html\n            }\n            if (options.hasOwnProperty('listeners')) {\n                for (let i = 0, event_type, listener; i < options.listeners.length; i++) {\n                    event_type = options.listeners[i][0]\n                    listener = options.listeners[i][1]\n                    this.element.addEventListener(event_type, listener)\n                }\n            }\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./dom_utils.js?");

/***/ }),

/***/ "./src/my_utils/modal_window.js":
/*!**************************************!*\
  !*** ./src/my_utils/modal_window.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ModalWindow: () => (/* binding */ ModalWindow)\n/* harmony export */ });\n/* harmony import */ var _dom_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../dom_utils */ \"./dom_utils.js\");\n\n\nclass ModalWindow {\n    #unique_id;\n    #app;\n\n    constructor(options) {\n        this.buttons = new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('div', {classes: ['buttons'], html: ''})\n        this.content = new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('div', {classes: ['content'], html: ''})\n        this.element = new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('div', {\n            classes: ['modal'],\n            children: [\n                new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('div', {\n                    classes: ['overlay'],\n                    listeners: [\n                        ['click', () => {\n                            this.perform_cancel()\n                            this.hide()\n                        }]\n                    ]\n                }),\n                new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('div', {\n                    classes: ['window'], children: [\n                        new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('div', {\n                            classes: ['btn_close'], html: '&#x2715;', listeners: [\n                                ['click', () => {\n                                    this.perform_cancel()\n                                    this.hide()\n                                }]\n                            ]\n                        }),\n                        this.content,\n                        this.buttons,\n                    ]\n                })\n            ]\n        }).element;\n\n        if (options !== undefined) {\n            if (options.hasOwnProperty('app')) {\n                this.#app = options.app\n            }\n            if (options.hasOwnProperty('unique_id')) {\n                this.#unique_id = options.unique_id\n                this.element.setAttribute('id', options.unique_id)\n            }\n            if (options.hasOwnProperty('buttons')) {\n                if (options.buttons.indexOf('ok') !== -1)\n                    this.buttons.element.appendChild(\n                        new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('button', {\n                            classes: ['btn_ok'],\n                            html: 'OK',\n                            listeners: [\n                                ['click', () => {\n                                    if (this.validate()) {\n                                        this.perform_ok()\n                                        this.hide()\n                                    } else {\n                                        this.show_errors()\n                                    }\n\n                                }]\n                            ]\n                        }).element\n                    );\n                if (options.buttons.indexOf('cancel') !== -1)\n                    this.buttons.element.appendChild(\n                        new _dom_utils__WEBPACK_IMPORTED_MODULE_0__.DOMElem('button', {\n                            classes: ['btn_cancel'],\n                            html: 'Отмена',\n                            listeners: [\n                                ['click', () => {\n                                    this.perform_cancel()\n                                    this.hide()\n                                }]\n                            ]\n                        }).element\n                    );\n            }\n        }\n\n    }\n\n    get app(){\n        return this.#app;\n    }\n\n    hide() {\n        hideElem(this.element)\n    }\n\n    show() {\n        showElem(this.element)\n    }\n\n    remove_from(parent) {\n        parent.removeChild(this.element)\n        delete this\n    }\n\n    set_content(html) {\n        this.content.element.innerHTML = html\n    }\n\n    perform_ok() {\n\n    }\n\n    perform_cancel() {\n\n    }\n\n    validate() {\n        return true;\n    }\n\n    show_errors() {\n        throw new Error('show_errors is not implemented!!!')\n    }\n    init(){\n        this.hide()\n        document.body.appendChild(this.element)\n    }\n\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/my_utils/modal_window.js?");

/***/ }),

/***/ "./src/user_profile/avatar.js":
/*!************************************!*\
  !*** ./src/user_profile/avatar.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Avatar: () => (/* binding */ Avatar)\n/* harmony export */ });\n/* harmony import */ var _my_utils_modal_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../my_utils/modal_window */ \"./src/my_utils/modal_window.js\");\n/* harmony import */ var _dom_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../dom_utils */ \"./dom_utils.js\");\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n\n\n\n\nclass Avatar {\n    constructor(root_element_selector) {\n        this.element = document.querySelector(root_element_selector)\n        this.modal = new _my_utils_modal_window__WEBPACK_IMPORTED_MODULE_0__.ModalWindow({\n            unique_id: 'modal_upload_avatar', buttons: ['ok', 'cancel']\n        })\n\n        this.validation_errors = []\n        this.is_new_image_chosen = false\n        this.modal.init()\n\n        this.element.addEventListener('click', (evt) => {\n            let image_element = new _dom_utils__WEBPACK_IMPORTED_MODULE_1__.DOMElem('img', {\n                classes: ['modal_avatar_img'],\n                attrs: {\n                    src: this.element.src, alt: 'preview'\n                }\n            }).element\n            let input_file_element = new _dom_utils__WEBPACK_IMPORTED_MODULE_1__.DOMElem('input', {\n                attrs: {\n                    type: 'file',\n                    accept: '.jpg, .jpeg'\n                }\n            }).element\n            let validation_errors_element = new _dom_utils__WEBPACK_IMPORTED_MODULE_1__.DOMElem('div', {\n                classes: ['validation_errors'],\n                children:[\n                    new _dom_utils__WEBPACK_IMPORTED_MODULE_1__.DOMElem('div',{\n                        classes:['hint'],\n                        html:'Загружаемое изображение должно быть формата jpg, квадратным, иметь стороны не менее 50 и не более 300 пикселов.'\n                    })\n                ]\n            }).element\n            this.modal.set_content(\n                new _dom_utils__WEBPACK_IMPORTED_MODULE_1__.DOMElem('div', {\n                    children: [\n                        image_element,\n                        input_file_element,\n                        validation_errors_element\n                    ]\n                }).element.innerHTML\n            )\n            this.modal.element.querySelector('input[type=\"file\"]').addEventListener('change', (evt) => {\n                let reader = new FileReader();\n                this.validation_errors = []\n                reader.onload = (e) => {\n                    let img = new Image();\n                    img.onload = () => {\n                        let width = img.naturalWidth;\n                        let height = img.naturalHeight;\n                        if (width !== height) {\n                            this.validation_errors.push(`Ошибка! Изображение должно быть квадратным! Ваше изображение ${width}x${height}}`)\n                        }\n                        if (width < 50 || height < 50) {\n                            this.validation_errors.push(`Ошибка! Стороны изображения не должны быть меньше 50 пикселей!}`)\n                        }\n                        if (width > 300 || height > 300) {\n                            this.validation_errors.push(`Ошибка! Стороны изображения не должны быть больше 300 пикселей!}`)\n                        }\n                        if (this.validation_errors.length === 0) {\n                            this.modal.element.querySelector('.validation_errors').innerHTML = ''\n                            this.modal.element.querySelector('img').src = reader.result;\n                            this.is_new_image_chosen = true\n                        } else {\n                            this.modal.show_errors()\n                        }\n                    }\n                    img.src = e.target.result;\n                }\n                reader.readAsDataURL(evt.target.files[0])\n            })\n            this.modal.show()\n        })\n\n        this.modal.show = () => {\n            this.is_new_image_chosen = false\n            this.validation_errors = []\n            showElem(this.modal.element)\n        }\n\n        this.modal.show_errors = () => {\n            this.modal.element.querySelector('.validation_errors').innerHTML = this.validation_errors.join('<br>')\n        }\n\n        this.modal.validate = () => {\n            console.log('this.is_new_image_chosen', this.is_new_image_chosen)\n            if (!this.is_new_image_chosen) {\n                this.validation_errors.push('Сперва загрузите картинку')\n                return false\n            }\n            if (this.validation_errors.length !== 0) {\n                this.validation_errors.push('Загрузите картинку требуемых параметров')\n                return false\n            }\n            return true\n        }\n\n        this.modal.perform_ok = () => {\n            let form_data = new FormData()\n            form_data.append('image', this.modal.element.querySelector('input[type=\"file\"]').files[0])\n            ;(0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.send_post_formdata)(undefined, csrfToken, '/user/avatar', form_data, (data) => {\n                let json_obj = JSON.parse(data)\n                if (json_obj.success === true) {\n                    this.element.src = json_obj.path_to_avatar\n                }\n            })\n        }\n    }\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/user_profile/avatar.js?");

/***/ }),

/***/ "./src/user_profile/index.js":
/*!***********************************!*\
  !*** ./src/user_profile/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _avatar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./avatar */ \"./src/user_profile/avatar.js\");\n\n\nconst avatar = new _avatar__WEBPACK_IMPORTED_MODULE_0__.Avatar('.user_avatar')\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/user_profile/index.js?");

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pop_from_list: () => (/* binding */ pop_from_list),\n/* harmony export */   send_post_formdata: () => (/* binding */ send_post_formdata)\n/* harmony export */ });\nfunction pop_from_list(list, value) {\n    const index = list.indexOf(value)\n    if (index !== -1) {\n        return list.splice(index, 1)[0]\n    }\n    return null\n}\n\nfunction send_post_formdata(e, csrftoken, url, formdata, func_on_success, func_on_error) {\n    let xhr = new XMLHttpRequest();\n    xhr.open('POST', url, true);\n\n    xhr.onerror = function () {\n        if(func_on_error !== undefined){\n            func_on_error(xhr.response);\n        }else{\n            console.error(xhr.response)\n        }\n    }\n    xhr.onload = function () {\n        func_on_success(xhr.response);\n    }\n    if (csrftoken !== undefined) {\n        xhr.setRequestHeader(\"X-CSRFToken\", csrftoken);\n    }\n    xhr.send(formdata);\n    if (e !== undefined) e.preventDefault();\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/utils/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/user_profile/index.js");
/******/ 	
/******/ })()
;
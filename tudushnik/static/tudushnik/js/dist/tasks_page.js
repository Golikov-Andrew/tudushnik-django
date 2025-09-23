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

/***/ "./src/projects_detail/app.js":
/*!************************************!*\
  !*** ./src/projects_detail/app.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   App: () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n/* harmony import */ var _my_utils_modal_window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../my_utils/modal_window */ \"./src/my_utils/modal_window.js\");\n/* harmony import */ var _modal_tasks_tags__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal_tasks_tags */ \"./src/projects_detail/modal_tasks_tags.js\");\n\n\n\n\nclass App {\n    #element;\n    #project;\n    #tags;\n    #btn_show_tasks_tags_modal;\n    #tasks_tags_modal;\n    #tasks_tags_current;\n\n    constructor(root_element_selector, project, tags) {\n        this.#element = document.querySelector(root_element_selector)\n        this.#project = project\n        this.#tags = tags\n        this.#btn_show_tasks_tags_modal = document.querySelector('.btn_show_tasks_tags_modal')\n        this.#tasks_tags_modal = new _modal_tasks_tags__WEBPACK_IMPORTED_MODULE_2__.TasksTagsModalWindow({\n            app: this,\n            unique_id: 'tasks_tags_modal_buffer',\n            buttons: ['ok', 'cancel']\n        });\n        this.#tasks_tags_modal.hide()\n        document.body.appendChild(this.#tasks_tags_modal.element)\n        this.#tasks_tags_current = document.querySelector('#tasks_tags_modal')\n    }\n\n    get project() {\n        return this.#project\n    }\n\n    get tags() {\n        return this.#tags\n    }\n\n    get tasks_tags_current_elements(){\n        return this.#tasks_tags_current\n    }\n\n    init() {\n        let urlSearchParams = new URLSearchParams(window.location.search);\n        let tags_values = urlSearchParams.get('tags')\n        if (tags_values !== null) tags_values = tags_values.split(',')\n\n        console.log(tags_values)\n        for (let i = 0, tag, inputs, pk_str; i < this.#tags.length; i++) {\n            tag = this.#tags[i]\n            pk_str = '' + tag.pk\n            inputs = document.querySelectorAll(`.object_pk_${tag.pk}`)\n            for (let j = 0, input; j < inputs.length; j++) {\n                input = inputs[j]\n                if (tags_values !== null && tags_values.indexOf(pk_str) !== -1) {\n                    input.setAttribute('checked','checked')\n                }\n                input.addEventListener('change', (evt) => {\n                    console.log(input.checked)\n                    let urlSearchParams = new URLSearchParams(window.location.search);\n\n                    if (tags_values !== null) {\n                        if (input.checked) {\n                            tags_values.push(pk_str)\n                            urlSearchParams.set('tags', tags_values.join(','))\n                        } else {\n                            (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.pop_from_list)(tags_values, pk_str)\n                            if (tags_values.length !== 0) {\n                                urlSearchParams.set('tags', tags_values.join(','))\n                            } else {\n                                urlSearchParams.delete('tags')\n                            }\n                        }\n                    } else {\n                        urlSearchParams.set('tags', tag.pk)\n                    }\n\n                    window.location.href = window.location.origin +\n                        window.location.pathname + '?' + urlSearchParams.toString()\n\n                })\n            }\n\n\n        }\n\n        this.#btn_show_tasks_tags_modal.addEventListener('click', () => {\n            let cloned = document.querySelector('#tasks_tags_modal').cloneNode(true)\n            this.#tasks_tags_modal.set_content(\n                cloned.innerHTML\n            )\n            this.#tasks_tags_modal.show()\n        })\n    }\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/projects_detail/app.js?");

/***/ }),

/***/ "./src/projects_detail/modal_tasks_tags.js":
/*!*************************************************!*\
  !*** ./src/projects_detail/modal_tasks_tags.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TasksTagsModalWindow: () => (/* binding */ TasksTagsModalWindow)\n/* harmony export */ });\n/* harmony import */ var _my_utils_modal_window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../my_utils/modal_window */ \"./src/my_utils/modal_window.js\");\n/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/utils */ \"./src/utils/utils.js\");\n\n\n\nclass TasksTagsModalWindow extends _my_utils_modal_window__WEBPACK_IMPORTED_MODULE_0__.ModalWindow {\n    constructor(options) {\n        super(options);\n    }\n\n    perform_ok() {\n        console.log('OK')\n\n        let urlSearchParams = new URLSearchParams(window.location.search);\n        let tags_values = urlSearchParams.get('tags')\n        if (tags_values !== null) tags_values = tags_values.split(',')\n        let changes = 0;\n\n        for (let i = 0, tag, input_new, input_current, pk_str; i < this.app.tags.length; i++) {\n            tag = this.app.tags[i]\n            pk_str = '' + tag.pk\n            input_current = this.app.tasks_tags_current_elements.querySelector(`.object_pk_${pk_str}`)\n            input_new = this.element.querySelector(`.object_pk_${pk_str}`)\n            if (input_new.checked === input_current.checked) {\n                continue;\n            } else {\n                changes++;\n                if (tags_values !== null) {\n                    if (input_new.checked) {\n                        tags_values.push(pk_str)\n                    } else {\n                        (0,_utils_utils__WEBPACK_IMPORTED_MODULE_1__.pop_from_list)(tags_values, pk_str)\n                    }\n                } else {\n                    tags_values = []\n                    tags_values.push(tag.pk)\n                }\n            }\n            if (changes > 0) {\n                if (tags_values !== null && tags_values.length > 0) {\n                    urlSearchParams.set('tags', tags_values.join(','))\n                } else {\n                    urlSearchParams.delete('tags')\n                }\n                window.location.href = window.location.origin +\n                    window.location.pathname + '?' + urlSearchParams.toString()\n            }\n        }\n    }\n\n    perform_cancel() {\n        console.log('Cancel')\n    }\n\n    validate() {\n        return true;\n    }\n\n    show_errors() {\n        throw new Error('show_errors is not implemented!!!')\n    }\n\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/projects_detail/modal_tasks_tags.js?");

/***/ }),

/***/ "./src/tasks_page/index.js":
/*!*********************************!*\
  !*** ./src/tasks_page/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _projects_detail_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../projects_detail/app */ \"./src/projects_detail/app.js\");\n\n\n\n// init_btns_item_delete()\n//\n// const selected_projects = document.getElementById('selected_projects')\n// if (selected_projects !== null &&\n//     !selected_projects.hasAttribute('multiple')\n// ) {\n//     selected_projects.addEventListener('change', (evt) => {\n//         window.location.href = `/projects/detail/${selected_projects.value}/`\n//     })\n// }\n\n\nconst jsonDataElement = document.getElementById('my-json-data');\nif (!jsonDataElement) {\n    throw Error('ОШИБКА!!! my-json-data не подгрузился')\n}\nconst data = JSON.parse(jsonDataElement.textContent);\nlet app = new _projects_detail_app__WEBPACK_IMPORTED_MODULE_0__.App(\n    '#content-container',\n    undefined, data.tags\n)\napp.init()\n\nconsole.log(app);\n\n\n\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/tasks_page/index.js?");

/***/ }),

/***/ "./src/utils/utils.js":
/*!****************************!*\
  !*** ./src/utils/utils.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   get_dict_from_list_by_key_val: () => (/* binding */ get_dict_from_list_by_key_val),\n/* harmony export */   get_dict_n_index_from_list_by_key_val: () => (/* binding */ get_dict_n_index_from_list_by_key_val),\n/* harmony export */   pop_from_list: () => (/* binding */ pop_from_list),\n/* harmony export */   send_post_formdata: () => (/* binding */ send_post_formdata)\n/* harmony export */ });\nfunction pop_from_list(list, value) {\n    const index = list.indexOf(value)\n    if (index !== -1) {\n        return list.splice(index, 1)[0]\n    }\n    return null\n}\n\nfunction send_post_formdata(e, csrftoken, url, formdata, func_on_success, func_on_error) {\n    let xhr = new XMLHttpRequest();\n    xhr.open('POST', url, true);\n\n    xhr.onerror = function () {\n        if(func_on_error !== undefined){\n            func_on_error(xhr.response);\n        }else{\n            console.error(xhr.response)\n        }\n    }\n    xhr.onload = function () {\n        func_on_success(xhr.response);\n    }\n    if (csrftoken !== undefined) {\n        xhr.setRequestHeader(\"X-CSRFToken\", csrftoken);\n    }\n    xhr.send(formdata);\n    if (e !== undefined) e.preventDefault();\n}\n\nfunction get_dict_from_list_by_key_val(list, key, val, def = false) {\n    for (let i = 0, c; i < list.length; i++) {\n        c = list[i]\n        if (c[key] === val) {\n            return c\n        }\n    }\n    return def\n}\nfunction get_dict_n_index_from_list_by_key_val(list, key, val, def = false) {\n    for (let i = 0, c; i < list.length; i++) {\n        c = list[i]\n        if (c[key] === val) {\n            return {\n                obj: c,\n                index: i\n            }\n        }\n    }\n    return def\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/utils/utils.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/tasks_page/index.js");
/******/ 	
/******/ })()
;
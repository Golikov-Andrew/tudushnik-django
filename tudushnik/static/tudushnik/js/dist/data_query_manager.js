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

/***/ "./src/data_query_manager/data_query_manager.js":
/*!******************************************************!*\
  !*** ./src/data_query_manager/data_query_manager.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DataQueryManager: () => (/* binding */ DataQueryManager)\n/* harmony export */ });\n/* harmony import */ var _search_widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./search_widget */ \"./src/data_query_manager/search_widget.js\");\n/* harmony import */ var _sorting_widget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sorting_widget */ \"./src/data_query_manager/sorting_widget.js\");\n\n\n\nclass DataQueryManager {\n\n    #query_params;\n    #search;\n    #sorting;\n\n    constructor() {\n        this.#query_params = new URLSearchParams(window.location.search);\n\n    }\n\n    get search() {\n        return this.#search;\n    }\n    get sorting() {\n        return this.#sorting;\n    }\n\n    load_query() {\n        this.#search = this.#query_params.get('search');\n        if (this.#search !== null) {\n            this.#search = JSON.parse(this.#search)\n        } else {\n            this.#search = {}\n        }\n\n        this.#sorting = this.#query_params.get('sorting');\n        if (this.#sorting !== null) {\n            this.#sorting = JSON.parse(this.#sorting)\n        } else {\n            this.#sorting = []\n        }\n\n    }\n\n    init_GUI(options) {\n        if (options === undefined) return;\n        options.search?.forEach((item) => {\n            document.querySelectorAll(item.selector).forEach((widget) => {\n                new _search_widget__WEBPACK_IMPORTED_MODULE_0__.SearchWidget(this, widget).add_listeners(item.listeners)\n            })\n        })\n        options.sorting?.forEach((item) => {\n            document.querySelectorAll(item.selector).forEach((widget) => {\n                new _sorting_widget__WEBPACK_IMPORTED_MODULE_1__.SortingWidget(this, widget).add_listeners(item.listeners)\n            })\n        })\n\n    }\n\n    apply_params() {\n        let changed_search = JSON.stringify(this.#search)\n        if (changed_search !== '{}') {\n            this.#query_params.set('search', changed_search)\n        } else {\n            this.#query_params.delete('search')\n        }\n        let changed_sorting = JSON.stringify(this.#sorting)\n        if (changed_sorting !== '[]') {\n            this.#query_params.set('sorting', changed_sorting)\n        } else {\n            this.#query_params.delete('sorting')\n        }\n\n        window.location.href = window.location.origin +\n            window.location.pathname + '?' + this.#query_params.toString()\n    }\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/data_query_manager/data_query_manager.js?");

/***/ }),

/***/ "./src/data_query_manager/index.js":
/*!*****************************************!*\
  !*** ./src/data_query_manager/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _data_query_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data_query_manager */ \"./src/data_query_manager/data_query_manager.js\");\n\n\nconst DQM = new _data_query_manager__WEBPACK_IMPORTED_MODULE_0__.DataQueryManager();\nDQM.load_query()\nDQM.init_GUI({\n    search: [\n        {\n            selector: '.inp_table_column_search',\n            listeners: [\n                ['change', () => {\n                    DQM.apply_params()\n                }],\n                ['keydown', (evt) => {\n                    if(evt.key === 'Enter'){\n                        DQM.apply_params()\n                    }\n                }],\n            ],\n        }\n    ],\n    sorting:[\n        {\n            selector: '.table_column_sorting',\n            listeners: [\n                ['click', () => {\n                    DQM.apply_params()\n                }]\n            ],\n        }\n    ]\n})\n\nconsole.log('DQM', DQM)\n\n//# sourceURL=webpack://tudushnik-pack/./src/data_query_manager/index.js?");

/***/ }),

/***/ "./src/data_query_manager/search_widget.js":
/*!*************************************************!*\
  !*** ./src/data_query_manager/search_widget.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SearchWidget: () => (/* binding */ SearchWidget)\n/* harmony export */ });\nclass SearchWidget {\n    #DQM;\n    #root_element;\n\n    constructor(DQM, root_element) {\n        this.#DQM = DQM\n        this.#root_element = root_element\n        const field_name = this.#root_element.getAttribute('data-field-name')\n        // init widget by value\n        if (this.#DQM.search.hasOwnProperty(field_name)) {\n            this.#root_element.value = this.#DQM.search[field_name]\n        }\n        // default listener\n        this.#root_element.addEventListener('change', () => {\n            if (this.#root_element.value !== '') {\n                this.#DQM.search[field_name] = this.#root_element.value\n            } else {\n                delete this.#DQM.search[field_name]\n            }\n        })\n    }\n    add_listeners(listeners){\n        // additional listeners\n        listeners.forEach((item) => {\n            this.#root_element.addEventListener(item[0], item[1])\n        })\n    }\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/data_query_manager/search_widget.js?");

/***/ }),

/***/ "./src/data_query_manager/sorting_widget.js":
/*!**************************************************!*\
  !*** ./src/data_query_manager/sorting_widget.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SortingWidget: () => (/* binding */ SortingWidget)\n/* harmony export */ });\n/* harmony import */ var _utils_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils.js */ \"./src/utils/utils.js\");\n\n\nclass SortingWidget {\n    #DQM;\n    #root_element;\n\n    constructor(DQM, root_element) {\n        this.#DQM = DQM\n        this.#root_element = root_element\n        const field_name = this.#root_element.getAttribute('data-field-name')\n        const sort_value = this.#root_element.value\n        // init widget by value\n        let it = (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_0__.get_dict_n_index_from_list_by_key_val)(this.#DQM.sorting, 'n', field_name)\n        if (it !== false) {\n            if (it.obj.n === field_name && it.obj.v === sort_value) {\n                this.#root_element.innerHTML += it.index\n                this.#root_element.classList.add('active')\n            }\n        }\n\n        // default listener\n        this.#root_element.addEventListener('click', () => {\n            if (this.#root_element.classList.contains('active')) {\n                for (let j = 0; j < this.#DQM.sorting.length; j++) {\n                    if (this.#DQM.sorting[j].n === field_name) {\n                        this.#DQM.sorting.splice(j, 1)\n                    }\n                }\n            } else {\n                let it = (0,_utils_utils_js__WEBPACK_IMPORTED_MODULE_0__.get_dict_from_list_by_key_val)(this.#DQM.sorting, 'n', field_name)\n                if (it !== false) {\n                    it['v'] = sort_value\n                } else {\n                    this.#DQM.sorting.push({\n                        'n': field_name, 'v': sort_value\n                    })\n                }\n            }\n            console.log(this.#DQM.sorting)\n        })\n    }\n\n    add_listeners(listeners) {\n        // additional listeners\n        listeners.forEach((item) => {\n            this.#root_element.addEventListener(item[0], item[1])\n        })\n    }\n}\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/data_query_manager/sorting_widget.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/data_query_manager/index.js");
/******/ 	
/******/ })()
;
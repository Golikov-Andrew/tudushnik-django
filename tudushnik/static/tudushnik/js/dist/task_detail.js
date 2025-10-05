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

/***/ "./duration_annotation.js":
/*!********************************!*\
  !*** ./duration_annotation.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DurationWidget: () => (/* binding */ DurationWidget)\n/* harmony export */ });\nclass DurationWidget {\n    #src_input_element;\n    #parent_element;\n    #container;\n    #is_disabled;\n    #input_duration_controllers = {}\n\n    constructor(src_input_element_selector, options) {\n        this.#src_input_element = document.querySelector(src_input_element_selector)\n        this.#parent_element = this.#src_input_element.parentElement\n\n        this.#container = document.createElement('div')\n        this.#container.classList.add('duration_widget')\n        this.#parent_element.appendChild(this.#container)\n\n        this.#is_disabled = false;\n        if (options !== undefined){\n            if(options.hasOwnProperty('disabled')){\n                if(options.disabled === true){\n                    this.#is_disabled = true;\n                }\n            }\n        }\n\n        this.#input_duration_controllers = {\n            hours: this.#create_input_number_element('Час.', 60 * 60),\n            minutes: this.#create_input_number_element('Мин.', 60, 59)\n        }\n    }\n\n    #create_input_number_element(label_text, data_seconds, max_value) {\n        const container = document.createElement('div')\n        this.#container.append(container)\n\n        let label = document.createElement('label')\n        label.innerText = `${label_text}: `\n        container.appendChild(label)\n\n        let elem = document.createElement('input')\n        if(this.#is_disabled) elem.disabled = true;\n        elem.classList.add('duration_controller')\n        elem.setAttribute('type', 'number')\n        elem.setAttribute('min', '0')\n        if (max_value !== undefined)\n            elem.setAttribute('max', max_value);\n        elem.setAttribute('data-seconds', data_seconds)\n\n        container.appendChild(elem)\n\n        elem.addEventListener('change', () => {\n            this.#calc_duration_in_sec()\n        })\n        return elem\n    }\n\n    #calc_duration_in_sec() {\n        let result = 0\n        for (const key in this.#input_duration_controllers) {\n            const c = this.#input_duration_controllers[key]\n            result += Math.floor((+c.value * (+c.getAttribute('data-seconds'))) / 60) * 60;\n        }\n        this.#src_input_element.value = result\n    }\n\n    init() {\n        const new_val = +this.#src_input_element.value;\n        let hours = div(new_val, 60 * 60)\n        let minutes = div(new_val - (hours * 60 * 60), 60)\n        // let seconds = new_val - ((hours * 60 * 60) + (minutes * 60))\n        this.#input_duration_controllers.hours.value = hours\n        this.#input_duration_controllers.minutes.value = minutes\n        // inp_duration_seconds_ctrl.value = seconds\n        this.#calc_duration_in_sec();\n    }\n}\n\n\n\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./duration_annotation.js?");

/***/ }),

/***/ "./src/my_utils/form.js":
/*!******************************!*\
  !*** ./src/my_utils/form.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Form: () => (/* binding */ Form)\n/* harmony export */ });\nclass Form {\n    #element;\n    #fieldsets;\n\n    constructor(form_selector) {\n        this.#element = document.querySelector(form_selector)\n        this.#fieldsets = this.#element.querySelectorAll('.fieldset.openable')\n        this.#fieldsets.forEach(fieldset => {\n            const label = fieldset.querySelector('.label')\n            label.addEventListener('click', () => {\n                fieldset.classList.toggle('opened')\n            })\n        })\n    }\n\n    expand_fieldset(field_selector) {\n        const target_element = this.#element.querySelector(field_selector)\n        if (target_element) {\n            const fieldset = target_element.closest('.fieldset.openable');\n            if (fieldset) {\n                fieldset.classList.add('opened');\n            }\n        }\n    }\n}\n\n\n\n\n//# sourceURL=webpack://tudushnik-pack/./src/my_utils/form.js?");

/***/ }),

/***/ "./src/tasks_page/details.js":
/*!***********************************!*\
  !*** ./src/tasks_page/details.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _my_utils_form__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../my_utils/form */ \"./src/my_utils/form.js\");\n/* harmony import */ var _duration_annotation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../duration_annotation */ \"./duration_annotation.js\");\n\n\n\nnew _my_utils_form__WEBPACK_IMPORTED_MODULE_0__.Form('form.form')\n\nconst durationWidget = new _duration_annotation__WEBPACK_IMPORTED_MODULE_1__.DurationWidget(\n    '#id_duration', {disabled: true}\n)\ndurationWidget.init()\n\n//# sourceURL=webpack://tudushnik-pack/./src/tasks_page/details.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/tasks_page/details.js");
/******/ 	
/******/ })()
;
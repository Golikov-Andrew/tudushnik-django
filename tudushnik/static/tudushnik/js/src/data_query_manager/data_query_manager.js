import {SearchWidgetComponent} from "../custom_elements/search_widget";
import {SortingWidgetComponent} from "../custom_elements/sorting_widget";
import {BinaryFilterWidgetComponent} from "../custom_elements/binary_filter_widget";

class DataQueryManager {

    #query_params;
    #search;
    #sorting;
    #filters;

    constructor() {
        this.#query_params = new URLSearchParams(window.location.search);

    }

    get search() {
        return this.#search;
    }

    get sorting() {
        return this.#sorting;
    }

    get filters() {
        return this.#filters;
    }

    load_query() {
        this.#search = this.#query_params.get('search');
        if (this.#search !== null) {
            this.#search = JSON.parse(this.#search)
        } else {
            this.#search = {}
        }

        this.#sorting = this.#query_params.get('sorting');
        if (this.#sorting !== null) {
            this.#sorting = JSON.parse(this.#sorting)
        } else {
            this.#sorting = []
        }

        this.#filters = this.#query_params.get('filter');
        if (this.#filters !== null) {
            this.#filters = JSON.parse(this.#filters)
        } else {
            this.#filters = {}
        }

    }

    attach_widget(widget) {
        widget.DQM = this
        return widget
    }

    init_GUI(options) {
        if (options === undefined) return;
        options.search?.forEach((item) => {
            document.querySelectorAll(item.selector).forEach((widget) => {
                if (widget instanceof SearchWidgetComponent) {
                    this.attach_widget(widget).init().add_listeners(item.listeners)
                }
            })
        })
        options.sorting?.forEach((item) => {
            document.querySelectorAll(item.selector).forEach((widget) => {
                if (widget instanceof SortingWidgetComponent) {
                    this.attach_widget(widget).init().add_listeners(item.listeners)
                }
            })
        })
        options.filters?.forEach((item) => {
            document.querySelectorAll(item.selector).forEach((widget) => {
                if (widget instanceof BinaryFilterWidgetComponent) {
                    this.attach_widget(widget).init().add_listeners(item.listeners)
                }
            })
        })

    }

    apply_params() {
        let changed_search = JSON.stringify(this.#search)
        if (changed_search !== '{}') {
            this.#query_params.set('search', changed_search)
        } else {
            this.#query_params.delete('search')
        }
        let changed_sorting = JSON.stringify(this.#sorting)
        if (changed_sorting !== '[]') {
            this.#query_params.set('sorting', changed_sorting)
        } else {
            this.#query_params.delete('sorting')
        }
        let changed_filters = JSON.stringify(this.#filters)
        if (changed_filters !== '{}') {
            this.#query_params.set('filter', changed_filters)
        } else {
            this.#query_params.delete('filter')
        }

        window.location.href = window.location.origin +
            window.location.pathname + '?' + this.#query_params.toString()
    }
}

export {
    DataQueryManager
}
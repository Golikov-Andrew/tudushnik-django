import {SearchWidget} from "./search_widget";
import {SortingWidget} from "./sorting_widget";

class DataQueryManager {

    #query_params;
    #search;
    #sorting;

    constructor() {
        this.#query_params = new URLSearchParams(window.location.search);

    }

    get search() {
        return this.#search;
    }
    get sorting() {
        return this.#sorting;
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

    }

    init_GUI(options) {
        if (options === undefined) return;
        options.search?.forEach((item) => {
            document.querySelectorAll(item.selector).forEach((widget) => {
                new SearchWidget(this, widget).add_listeners(item.listeners)
            })
        })
        options.sorting?.forEach((item) => {
            document.querySelectorAll(item.selector).forEach((widget) => {
                new SortingWidget(this, widget).add_listeners(item.listeners)
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

        window.location.href = window.location.origin +
            window.location.pathname + '?' + this.#query_params.toString()
    }
}

export {
    DataQueryManager
}
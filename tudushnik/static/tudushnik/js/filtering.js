let inps_table_column_search = document.getElementsByClassName('inp_table_column_search')
for (let i = 0, c; i < inps_table_column_search.length; i++) {
    c = inps_table_column_search[i]
    c.addEventListener('change', (ev) => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let current_search = urlSearchParams.get('search')
        let search_attribute = c.closest('div.search_and_sorting_widget').getAttribute('data-field-name')
        if (current_search !== null) {
            current_search = JSON.parse(current_search)
            if (c.value !== '') {
                current_search[search_attribute] = c.value
            } else {
                delete current_search[search_attribute]
            }

        } else {
            current_search = {}
            current_search[search_attribute] = c.value
        }
        let changed_search = JSON.stringify(current_search)
        if (changed_search !== '{}') {
            urlSearchParams.set('search', changed_search)
        } else {
            urlSearchParams.delete('search')
        }


        window.location.href = window.location.origin +
            window.location.pathname + '?' + urlSearchParams.toString()
    })
}

function init_inps_table_column_search() {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let current_search = urlSearchParams.get('search')
    if (current_search !== null) {
        current_search = JSON.parse(current_search)
        let search_value;
        let target_elem;
        for (let k in current_search) {
            search_value = current_search[k]
            target_elem = document.querySelector(
                `div.search_and_sorting_widget[data-field-name="${k}"] > input.inp_table_column_search`
            )
            target_elem.value = search_value
        }
    }
}

init_inps_table_column_search()
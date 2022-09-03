let slcts_table_column_multi_filter = document.getElementsByClassName('slct_table_column_multi_filter')
for (let i = 0, c, selected_options; i < slcts_table_column_multi_filter.length; i++) {
    c = slcts_table_column_multi_filter[i]
    c.addEventListener('focusout', (ev) => {
        let urlSearchParams = new URLSearchParams(window.location.search);
        let current_filter = urlSearchParams.get('filter')
        let filter_attribute = c.closest('div.multi_filter_widget').getAttribute('data-field-name')
        if (current_filter !== null) {
            current_filter = JSON.parse(current_filter)
            if (c.selectedOptions.length !== 0) {
                current_filter[filter_attribute] = []
                selected_options = c.selectedOptions
                for (let j = 0; j < selected_options.length; j++) {
                    current_filter[filter_attribute].push(selected_options[j].value)
                }
            } else {
                delete current_filter[filter_attribute]
            }

        } else {
            current_filter = {}
            current_filter[filter_attribute] = []
            selected_options = c.selectedOptions
            for (let j = 0; j < selected_options.length; j++) {
                current_filter[filter_attribute].push(selected_options[j].value)
            }
        }
        let changed_filter = JSON.stringify(current_filter)
        if (changed_filter !== '{}') {
            urlSearchParams.set('filter', changed_filter)
        } else {
            urlSearchParams.delete('filter')
        }


        let target_href = window.location.origin +
            window.location.pathname + '?' + urlSearchParams.toString()
        console.log(decodeURI(target_href))
        window.location.href = target_href
    })
}

function init_slcts_table_column_multi_filter() {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let current_filter = urlSearchParams.get('filter')
    if (current_filter !== null) {
        current_filter = JSON.parse(current_filter)
        let filter_value;
        let target_elems;
        let selected_options;
        for (let k in current_filter) {
            filter_value = current_filter[k]
            target_elems = document.querySelectorAll(
                `div.multi_filter_widget[data-field-name="${k}"] > select.slct_table_column_multi_filter > option`
            )
            for (let j = 0, cur_opt; j < target_elems.length; j++) {
                cur_opt = target_elems[j]
                for (let i = 0; i < filter_value.length; i++) {
                    if(cur_opt.value===filter_value[i]){
                        cur_opt.setAttribute('selected', 'selected')
                    }
                }
            }


            // selected_options = target_elem.querySelectorAll('option')
            // debugger;
            // target_elem.selectedOptions = selected_options
        }
    }
}

init_slcts_table_column_multi_filter()
let btns_table_column_sorting = document.getElementsByClassName('table_column_sorting')

for (let i = 0, c; i < btns_table_column_sorting.length; i++) {
    c = btns_table_column_sorting[i]
    c.addEventListener('click', (ev) => {
        let btn = ev.target
        let urlSearchParams = new URLSearchParams(window.location.search);
        let current_sorting = urlSearchParams.get('sorting')
        let sorting_attribute = btn.closest('div.search_and_sorting_widget').getAttribute('data-field-name')
        if (current_sorting !== null) {
            current_sorting = JSON.parse(current_sorting)
            if (btn.classList.contains('active')) {
                for (let j = 0; j < current_sorting.length; j++) {
                    if (current_sorting[j].n === sorting_attribute) {
                        current_sorting.splice(j, 1)
                    }
                }
            } else {
                let it = get_dict_from_list_by_key_val(current_sorting, 'n', sorting_attribute)
                if (it !== false) {
                    it['v'] = btn.value
                } else {
                    current_sorting.push({
                        'n': sorting_attribute, 'v': btn.value
                    })
                }
            }
        } else {
            current_sorting = []
            current_sorting.push({
                'n': sorting_attribute, 'v': btn.value
            })
        }
        let changed_sorting = JSON.stringify(current_sorting)
        if (changed_sorting !== '[]') {
            urlSearchParams.set('sorting', changed_sorting)
        } else {
            urlSearchParams.delete('sorting')
        }

        window.location.href = window.location.origin +
            window.location.pathname + '?' + urlSearchParams.toString()
    })
}


function init_btns_sort_order() {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let sorting_section = urlSearchParams.get('sorting')
    if (sorting_section !== null) {
        let sorting_list = JSON.parse(sorting_section)
        for (let i = 0, item, b; i < sorting_list.length; i++) {
            item = sorting_list[i]
            b = document.querySelector(
                `div.search_and_sorting_widget[data-field-name="${item.n}"] > div > button[value="${item.v}"]`
            )
            b.classList.add('active')
            b.innerHTML = b.innerHTML + i
        }
    }
}

init_btns_sort_order()



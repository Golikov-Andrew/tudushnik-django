let inps_table_column_search = document.getElementsByClassName('inp_table_column_search')
for (let i = 0, c; i < inps_table_column_search.length; i++) {
    c = inps_table_column_search[i]
    c.addEventListener('change', (ev) => {
        let params = get_query_string_dictionary()
        params['search_value'] = c.value
        params['search_attribute'] = c.closest('div.search_and_sorting_widget').getAttribute('data-field-name')
        window.location.href = window.location.origin + window.location.pathname + build_query_string(params)
    })
}
function init_inps_table_column_search(){
    let params = get_query_string_dictionary()


}
init_inps_table_column_search()
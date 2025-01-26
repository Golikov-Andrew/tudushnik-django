init_btns_item_delete()

const selected_projects = document.getElementById('selected_projects')
if (selected_projects !== null &&
    !selected_projects.hasAttribute('multiple')
) {
    selected_projects.addEventListener('change', (evt) => {
        window.location.href = `/projects/detail/${selected_projects.value}/`
    })
}



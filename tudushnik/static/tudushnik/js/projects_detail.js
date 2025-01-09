init_btns_item_delete()

const select_project = document.getElementById('select_project')
if(select_project !== null){
    select_project.addEventListener('change',(evt)=>{
        window.location.href = `/projects/detail/${select_project.value}/`
    })
}



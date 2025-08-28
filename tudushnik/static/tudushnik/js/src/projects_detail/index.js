import {Project} from "../project/project";
import {App} from "./app";

init_btns_item_delete()

const selected_projects = document.getElementById('selected_projects')
if (selected_projects !== null &&
    !selected_projects.hasAttribute('multiple')
) {
    selected_projects.addEventListener('change', (evt) => {
        window.location.href = `/projects/detail/${selected_projects.value}/`
    })
}


const jsonDataElement = document.getElementById('my-json-data');
if (!jsonDataElement) {
    throw Error('ОШИБКА!!! Проект не подгрузился')
}
const data = JSON.parse(jsonDataElement.textContent);
let app = new App(
    '#content-container',
    new Project(
        data.project.pk,
        data.project.title,
        data.project.description,
        data.project.color,
        data.project.tags,
    ), data.tags
)
app.init()

console.log(app);





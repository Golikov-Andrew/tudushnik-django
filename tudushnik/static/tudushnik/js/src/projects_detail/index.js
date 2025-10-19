import {Project} from "../project/project";
import {App} from "./app";
import {DataQueryManager} from "../data_query_manager/data_query_manager";

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

const DQM = new DataQueryManager();
DQM.load_query()
DQM.init_GUI({
    search: [
        {
            selector: 'search-widget-component',
            listeners: [
                ['change', () => {
                    DQM.apply_params()
                }],
                ['keydown', (evt) => {
                    if (evt.key === 'Enter') {
                        DQM.apply_params()
                    }
                }],
            ],
        }
    ],
    sorting: [
        {
            selector: 'sorting-widget',
            listeners: [
                ['click', (evt) => {
                    DQM.apply_params()
                }]
            ],
        }
    ],
    filters: [
        {
            selector: 'binary-filter-widget',
            listeners: [
                ['click', (evt) => {
                    DQM.apply_params(evt)
                }]
            ],
        },
        {
            selector: 'select-multiple-widget',
            listeners: [
                ['click', (evt) => {
                    console.log('select-multiple-widget click')
                    console.log(evt)
                    // DQM.apply_params(evt)
                }]
            ],
        },

    ]
})
console.log('DQM', DQM)

const data = JSON.parse(jsonDataElement.textContent);
let app = new App(
    '#content-container',
    new Project(
        data.project.pk,
        data.project.title,
        data.project.description,
        data.project.color,
        data.project.tags,
    ), data.tags, data.statuses,
    DQM
)
app.init()

console.log(app);





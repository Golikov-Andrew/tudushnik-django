import {DataQueryManager} from "./src/data_query_manager/data_query_manager";
import {App} from "./src/projects_detail/app";
import {Project} from "./src/project/project";

init_btns_item_delete()


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



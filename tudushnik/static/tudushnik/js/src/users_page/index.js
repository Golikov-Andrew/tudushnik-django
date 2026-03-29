import {App} from "../projects_detail/app";
import {DataQueryManager} from "../data_query_manager/data_query_manager";


const jsonDataElement = document.getElementById('my-json-data');
if (!jsonDataElement) {
    throw Error('ОШИБКА!!! my-json-data не подгрузился')
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


const data = JSON.parse(jsonDataElement.textContent);
let app = new App(
    '#content-container',
    undefined, data.tags, data.statuses,
    DQM
)
app.init()


import {DataQueryManager} from "./data_query_manager";

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
                    if(evt.key === 'Enter'){
                        DQM.apply_params()
                    }
                }],
            ],
        }
    ],
    sorting:[
        {
            selector: 'sorting-widget',
            listeners: [
                ['click', (evt) => {
                    DQM.apply_params()
                }]
            ],
        }
    ],
    filters:[
        {
            selector: 'binary-filter-widget',
            listeners: [
                ['click', (evt) => {
                    DQM.apply_params(evt)
                }]
            ],
        }
    ]
})

console.log('DQM', DQM)
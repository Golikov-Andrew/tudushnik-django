import {DataQueryManager} from "./data_query_manager";

const DQM = new DataQueryManager();
DQM.load_query()
DQM.init_GUI({
    search: [
        {
            selector: '.inp_table_column_search',
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
            selector: '.table_column_sorting',
            listeners: [
                ['click', () => {
                    DQM.apply_params()
                }]
            ],
        }
    ]
})

console.log('DQM', DQM)
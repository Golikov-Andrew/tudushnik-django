const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: {
        task: ['./src/task/index.js'],
        viewport: ['./src/viewport/index.js'],
        calendar: ['./src/calendar/index.js'],
        projects_detail: ['./src/projects_detail/index.js'],
        tasks_page: ['./src/tasks_page/index.js'],
        user_profile: ['./src/user_profile/index.js'],
        data_query_manager: ['./src/data_query_manager/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            moment: "moment",
            moment_range: "moment-range"
        })
    ]
};

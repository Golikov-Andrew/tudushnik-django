const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    entry: {
        task: ['./src/task/index.js'],
        viewport: ['./src/viewport/index.js'],
        calendar: ['./src/calendar/index.js'],
        projects_detail: ['./src/projects_detail/index.js'],
        tasks_page: ['./src/tasks_page/index.js'],
        user_profile: ['./src/user_profile/index.js'],
        data_query_manager: ['./src/data_query_manager/index.js'],
        // custom_elements: ['./src/custom_elements/index.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new BundleTracker({filename: 'webpack-stats.json'}),
        new MiniCssExtractPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            moment: "moment",
            moment_range: "moment-range"
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                exclude: /node_modules/,
                use: [
                    'html-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // "style-loader",
                    // MiniCssExtractPlugin.loader,
                    'raw-loader',

                    // {
                    //     loader: "css-loader",
                    //     options: {
                    //         importLoaders: 1
                    //     }
                    // },
                    "sass-loader",

                ],
            },
            {
                test: /\.less$/i,
                use: [
                    'raw-loader',
                    "less-loader",
                ],
            },
        ]
    }
};

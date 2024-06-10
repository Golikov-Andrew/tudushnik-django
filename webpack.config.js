const path = require('path');
const webpack = require('webpack');


module.exports = {
    entry: {
        task: ['./tudushnik/static/tudushnik/js/src/task/index.js'],
        chat: ['./tudushnik/static/tudushnik/js/src/chat/index.js'],
        durak: ['./games/static/games/js/durak/index.js'],
        viewport: ['./tudushnik/static/tudushnik/js/src/viewport/index.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            moment: "moment"
        })
    ]
};

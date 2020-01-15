module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'online-conference'
        : '',

    devServer: {
        proxy: {
            '': {
                target: process.env.NODE_ENV === 'production'
                ? 'https://online-conference-heroku.herokuapp.com/'
                : 'http://localhost:4000/',
                secure: false,
                changeOrigin: true,
            },
        },
    },
};

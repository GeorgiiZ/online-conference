module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'online-conference'
        : '',

    devServer: {
        proxy: {
            '': {
                target: 'https://online-conference-heroku.herokuapp.com/',
                secure: false,
                changeOrigin: true,
            },
        },
    },
};

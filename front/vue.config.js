module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'online-conference'
        : '',

    devServer: {
        proxy: {
            '': {
                target: 'http://localhost:4001/',
                secure: false,
                changeOrigin: true,
            },
        },
    },
};

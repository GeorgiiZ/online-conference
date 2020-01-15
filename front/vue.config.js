module.exports = {
    devServer: {
        proxy: {
            '': {
                target: 'http://localhost:4000',
                secure: false,
                changeOrigin: true,
            },
        },
    },
};

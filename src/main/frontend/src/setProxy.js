const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/login',
        createProxyMiddleware({
            target: 'https://allinone-spring.com',
            changeOrigin: true,
        })
    );

    app.use(
        '/create',
        createProxyMiddleware({
            target: 'https://allinone-flask.com',
            changeOrigin: true,
        })
    );

    app.use(
        '/video',
         createProxyMiddleware({
             target: 'https://allinone-flask.com',
             changeOrigin: true,
         })
     );
};
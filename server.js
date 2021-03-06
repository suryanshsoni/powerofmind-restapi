'use strict'

/**
 * Module Dependencies
 */
const config        = require('./config'),
      restify       = require('restify'),
      bunyan        = require('bunyan'),
      winston       = require('winston'),
      bunyanWinston = require('bunyan-winston-adapter'),
      mongoose      = require('mongoose')
	  
mongoose.Promise=require('bluebird')  

/**
 * Logging
 */
global.log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            timestamp: function() {
                return new Date().toString()
            },
            json: true
        }),
    ]
})

/**
 * Initialize Server
 */
global.server = restify.createServer({
    name    : config.name,
    version : config.version,
    log     : bunyanWinston.createAdapter(log),
})

/**
 * Middleware
 */
server.use(restify.jsonBodyParser({ mapParams: true }))
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser({ mapParams: true }))
server.use(restify.fullResponse())
server.use(restify.CORS({
    origins: ['*'],
    headers: ['application/json','application/x-www-form-urlencoded','multipart/form-data','text/html']                 // sets expose-headers
}));
server.use(restify.authorizationParser());

/**
 * Error Handling
 */
server.on('uncaughtException', function(req, res, route, err) {
    log.error(err.stack)
    res.send(err)
});
/**
 * Lift Server, Connect to DB & Bind Routes
 */
 server.get('/proxy', restify.serveStatic({
    directory: __dirname,
	file : 'proxy.html'
}));
server.get(/\/admin\/?.*/, restify.serveStatic({
     directory: __dirname,
	 default:'index.html'
 }));
server.get(/\/uploads\/?.*/, restify.serveStatic({
     directory: __dirname
 }));
 require('./routes')
server.listen(config.port, function() {

    mongoose.connection.on('error', function(err) {
        log.error('Mongoose default connection error: ' + err)
        process.exit(1)
    })

    mongoose.connection.on('open', function(err) {

        if (err) {
            log.error('Mongoose default connection error: ' + err)
            process.exit(1)
        }

        log.info(
            '%s v%s ready to accept connections on port %s in %s environment.',
            server.name,
            config.version,
            config.port,
            config.env
        )

        

    })

    global.db = mongoose.connect(config.db.uri)

})
console.log("directory is:"+__dirname)


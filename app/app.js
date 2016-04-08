/**
 * Main Application File for Dillinger.
 */

'use strict'

var config = require('./config')()
  , connect = require('connect')
  , methodOverride = require('method-override')
  , logger = require('morgan')
  , favicon = require('serve-favicon')
  , compress = require('compression')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , cookieSession = require('cookie-session')
  , express = require('express')
  , routes = require('./routes')
  , serveStatic = require('serve-static')
  , errorHandler = require('errorhandler')
  , path = require('path')
  , fs = require('fs')
  , expressApp = express()
  , core = require('./plugins/core/server.js')
  , dropbox = require('./plugins/dropbox/server.js')
  , github = require('./plugins/github/server.js')
  , googledrive = require('./plugins/googledrive/server.js')
  , onedrive = require('./plugins/onedrive/server.js')
  , env = process.env.NODE_ENV || 'development';

expressApp.set('port', process.env.PORT || 8080)
expressApp.set('views', __dirname + '/views')
expressApp.set('view engine', 'ejs')

// May not need to use favicon if using nginx for serving
// static assets. Just comment it out below.
expressApp.use(favicon(path.join(__dirname, 'public/favicon.ico')))

if(env === 'development'){
  expressApp.use(logger('dev'))
}
else{
  expressApp.use(logger('short'))
}

expressApp.use(compress())
expressApp.use(bodyParser.urlencoded({extended: false}))
expressApp.use(bodyParser.json())
expressApp.use(methodOverride())
expressApp.use(cookieParser('your secret here'))
expressApp.use(cookieSession({
  name: 'dillinger-session',
  keys: ['open', 'source']
}))

// May not need to use serveStatic if using nginx for serving
// static assets. Just comment it out below.
expressApp.use(serveStatic(__dirname + '/public'))

// Setup local variables to be available in the views.
expressApp.locals.title = config.title || 'Dillinger.'
expressApp.locals.description = config.description || 'Dillinger, the last Markdown Editor, ever.'

if (config.googleWebmasterMeta) {
  expressApp.locals.googleWebmasterMeta = config.googleWebmasterMeta
}

if (config.keywords) {
  expressApp.locals.keywords = config.keywords
}

if (config.author) {
  expressApp.locals.author = config.author
}

expressApp.locals.node_version = process.version.replace('v', '')
expressApp.locals.app_version = require('./package.json').version
expressApp.locals.env = process.env.NODE_ENV

// At startup time so sync is ok.
expressApp.locals.readme = fs.readFileSync(path.resolve(__dirname, './README.md'), 'utf-8')

if ('development' == env) {
  expressApp.use(errorHandler())
}

expressApp.get('/', routes.index)
expressApp.get('/not-implemented', routes.not_implemented)

expressApp.use(core)
expressApp.use(dropbox)
expressApp.use(github)
expressApp.use(googledrive)
expressApp.use(onedrive)

expressApp.listen(expressApp.get('port'), function() {
    console.log('Express server listening on port ' + expressApp.get('port'))
    console.log('\nhttp://localhost:' + expressApp.get('port') + '\n')
})

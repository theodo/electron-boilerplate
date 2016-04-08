'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
  // Module to create native browser window.
var ipc = electron.ipcMain;
var fs = require('fs');
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
  , debug = require('debug')('express-test:server')
  , http = require('http')
  , core = require('./plugins/core/server.js')
  , dropbox = require('./plugins/dropbox/server.js')
  , github = require('./plugins/github/server.js')
  , googledrive = require('./plugins/googledrive/server.js')
  , onedrive = require('./plugins/onedrive/server.js')
  , env = process.env.NODE_ENV || 'development';
var server;

// Report crashes to our server.
// require('crash-reporter').start({companyName: 'toto'});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL('file://' + __dirname + '/index.html');

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

  server = http.createServer(expressApp);
  server.listen(expressApp.get('port'));
  server.on('error', onError);
  server.on('listening', onListening);

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
    server.close();
  });
});


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);

  mainWindow.loadURL('http://127.0.0.1:8080');
  // mainWindow.toggleDevTools();
}

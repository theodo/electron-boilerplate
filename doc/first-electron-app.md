# Write your First Electron App (source : [Electron Quickstart Guide](http://electron.atom.io/docs/v0.34.0/tutorial/quick-start/))

Electron bundles a NodeJs backend with a Chromium instance to allow to serve web contents through a desktop app. 

The usual minimal working Electron app is built like this : 

```text
app/
├── package.json
├── main.js
└── index.html
```

The format of `package.json` is exactly the same as that of Node's modules. An example of a minimal `package.json` could be :

```json
{
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js"
}
```

The script specified in the `main` field is the startup script of your app, which will run Electron's main process. This proces is the core of your app. It creates windows, handles system events, communicates with the user's computer. A typical example is :

```javascript
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start();

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

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
```

Finally, `index.html` is the entry point of Electron in your app. A basic example is :

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node <script>document.write(process.versions.node)</script>,
    Chrome <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
  </body>
</html>
```

All that is left for you to do is then to run ` $ electron ./app ` (from the root of the repository) to see your app launching.

Congratulations, you made your first Electron app!
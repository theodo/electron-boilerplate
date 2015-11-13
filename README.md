# How to create a desktop app for Windows and OSX in less than 10 minutes with Electron

This repository's goal is to present to you [Electron](http://electron.atom.io) and how we used this awesome technology to develop a desktop app for one of our clients.

More details about our adventure are present on the blog article we published, available [here](http://www.theodo.fr/blog/).

## Table of contents

1. [Write your first Electron app](doc/first-electron-app.md)
2. [Package your app to serve it to any platform](doc/packaging-your-app.md)



## How does this boilerplate works ?

We created this boilerplate using :
+ [Electron](https://github.com/atom/electron)
+ [Electron packager](https://github.com/maxogden/electron-packager)
+ [Electron builder](https://github.com/loopline-systems/electron-builder)

We then configured custom npm tasks to help you get up and running as fast as possible. Here is the `"scripts"` section of our [`package.json`](package.json) file:


package.json
```json
"scripts" : {
  "start": "electron ./app",
  "clean": "rm -rf ./dist",
  "pack": "npm run pack:linux32 && npm run pack:linux64 && npm run pack:osx && npm run pack:win32 && npm run pack:win64",
  "pack:linux32": "electron-packager ./app $npm_package_name --out=dist/ --platform=linux --arch=ia32 --version=0.34.1 --overwrite",
  "pack:linux64": "electron-packager ./app $npm_package_name --out=dist/ --platform=linux --arch=x64 --version=0.34.1 --overwrite",
  "pack:osx": "electron-packager ./app $npm_package_name --out=dist/ --platform=darwin --arch=x64 --version=0.34.1 --icon=assets/osx/icon.icns --overwrite",
  "pack:win32": "electron-packager ./app $npm_package_name --out=dist/ --platform=win32 --arch=ia32 --version=0.34.1 --icon=assets/win/icon.ico --overwrite",
  "pack:win64": "electron-packager ./app $npm_package_name --out=dist/ --platform=win32 --arch=x64 --version=0.34.1 --icon=assets/win/icon.ico --overwrite",
  "build": "npm run clean && build:osx && build:win32 && build:win64",
  "build:osx": "npm run pack:osx && electron-builder dist/$npm_package_name-darwin-x64 --platform=osx --out=dist/$npm_package_name-darwin-x64 --config=build-config.json",
  "build:win32": "npm run pack:win32 && electron-builder dist/$npm_package_name-win32-ia32 --platform=win --out=dist/$npm_package_name-win32-ia32  --config=build-config.json",
  "build:win64": "npm run pack:win64 && electron-builder dist/$npm_package_name-win32-x64 --platform=win --out=dist/$npm_package_name-win32-x64 --config=build-config.json"
}
```

## Launch the app

To start the app locally, you simply have to run

```
$ npm start
```
This will go to the `app` folder and launch the Electron main process defined in the `app/main.js` script.


To package your app for the different platforms, you have at your disposal the following commands :
+ `$ npm run pack:linux32` : Packs the application for 32-bits Linux distributions
+ `$ npm run pack:linux64` : Packs the application for 64-bits Linux distributions
+ `$ npm run pack:osx`: Packs the application for 64-bits Mac OSX
+ `$ npm run pack:win32` : Packs the application for 32-bits Windows
+ `$ npm run pack:win64` : Packs the application for 64-bits Windows
+ `$ npm run pack` : Packs your app for all of the above operating systems

If you want to build installers for your app, you can use the following commands:
+ `$ npm run build:osx` : Creates a `.dmg` file to install your app on Mac OSX computers, using the images you defined in the corresponding section of the [`build-config.json`](build-config.json) file.
+ `$ npm run build:win32` : Creates a `.exe` file to install your app on Windows computers, using the images you defined in the corresponding section of the [`build-config.json`](build-config.json) file.
+ `$ npm run build:win64` :Creates a `.exe` file to install your app on Windows computers, using the images you defined in the corresponding section of the [`build-config.json`](build-config.json) file.
+ `$ npm run build`: Builds your app for all of the above platforms

```txt
dist
├── your-app-name-darwin-x64
│   └── my-awesome-app.app
│   └── my-awesome-app.dmg
└── your-app-name-win32-ia32
    └── my-awesome-app Setup.exe
```

Here is the result under Windows!

![Alt text](/doc/images/screenshot-win.png)


## Team

  * Tristan Pouliquen (Developer - tristanp@theodo.fr)
  * Vincent Quagliaro (Developer - vincentq@theodo.fr)

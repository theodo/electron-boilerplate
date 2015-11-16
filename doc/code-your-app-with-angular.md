# Unleash the power of AngularJS for your desktop app

> To see this part of our tutorial in action, checkout the [`electron-with-angular`](https://github.com/theodo/electron-boilerplate/tree/electron-with-angular) branch of this repository.
>
>We dwelve in more detail on this subject in our corresponding blog article available [here](http://www.theodo.fr/blog).

In order to develop our app, we chose to use the famous [AngularJS framework](https://angularjs.org/) as it interfaces really seamlessly with Electron.

As you will have seen with the first step of our tutorial, Electron needs a single entry point to your app. AngularJS provides just that as everything starts from the `index.html` of your code.

In order to run your Angular app with Electron, all you need to do is to put your code in the app folder and tell Electron where to look for your `index.html`.

If you start from our example, you only need to replace the `app/client` folder with your personal code. In fact, the code that is already in this folder is a simple copy/paste of a drivers championship standings app that we found on GitHub and that you can check out [here](https://github.com/raonibr/f1feeder-part1).

Concretely, after having added out code in the `app/client` folder, the only change we made to Electron's default config was to tell the main process where to look for the `index.html` file, by changing one single line of the [`main.js` file](app/main.js#L27) from :
```
mainWindow.loadUrl('file://' + __dirname + '/index.html');
```
to
```
mainWindow.loadUrl('file://' + __dirname + '/client/index.html');
```

Easy isn't it ?
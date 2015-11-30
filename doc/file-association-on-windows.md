# How to set file associations in Windows

## Define our custom NSI installation file

Our NSI installation file is based on electron builder's 
[`installer.nsi.tpl`](https://github.com/loopline-systems/electron-builder/blob/master/templates/installer.nsi.tpl)
and we include a [`file association script`](http://nsis.sourceforge.net/File_Association)
from [http://nsis.sourceforge.net](http://nsis.sourceforge.net)

Here is the folder tree!
```txt
nsi-template
├── include
│   └── FileAssociation.nsh
└── installer.nsi.tpl
```

Then, you modify the default electron  electron builder's `installer.nsi.tpl` and we add lines below:
```
# modification: add file association script
# projectIncludeDir is replaced by a gulp task: nsi-template
########
!addincludedir "@projectIncludeDir"
!include "FileAssociation.nsh"
########

...
# default section start
Section

  # modification: define file association
  ########
  ${registerExtension} "$INSTDIR\${APP_NAME}.exe" "@projectExtension" "@projectFileType"
  ########
...
```

## Generate a nsi template

Find below the gulp task to generate a nsi template:
```javascript
var constant = {
    cwd: process.env.INIT_CWD || '',
    nsiTemplate: './nsi-template/include/',
    fileAssociation: {
        extension: '.myapp',
        fileType: 'My Awesome App File'
    }
};

// task to generate nsi-template for windows
gulp.task('nsi-template', function () {
    var projectIncludeDir = path.join(constant.cwd, constant.nsiTemplate);
    return gulp.src('nsi-template/installer.nsi.tpl')
        .pipe(replace('@projectIncludeDir', projectIncludeDir))
        .pipe(replace('@projectExtension', constant.fileAssociation.extension))
        .pipe(replace('@projectFileType', constant.fileAssociation.fileType))
        .pipe(gulp.dest('dist/nsi-template/win'));
});
```

and update the electron builder config:
```json
  "win" : {
    "title" : "my-awesome-app",
    "icon" : "assets/win/icon.ico",
    "nsiTemplate" : "dist/nsi-template/win/installer.nsi.tpl"
  }
```

## Here is the result

![file association in windows](/doc/images/file-association-in-windows.gif)

# How to open file on click in windows

On Windows, you have to parse `process.argv` to get the filepath.
Then, you can use ipc module to handle message from the render process (web page) and send data from data.
Find the code below:

In the main process:
```javascript
var ipc = require('ipc');
var fs = require('fs');

// read the file and send data to the render process
ipc.on('get-file-data', function(event) {
  var data = null;
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1];
    data = fs.readFileSync(openFilePath, 'utf-8');
  }
  event.returnValue = data;
});
```

In the render process:
```javascript
<script>
  // we use ipc to communicate with the main process
  var ipc = require('ipc');
  var data = ipc.sendSync('get-file-data');
  if (data ===  null) {
    document.write("There is no file");
  } else {
    document.write(data);
  }
</script>
```

Here is the result:

![open file in windows](/doc/images/open-file-in-windows.gif)

const http = require('http');
const fs = require('fs');

// const hostname = '127.0.0.1';
// const port = 3000;

// fs.readFile("./add-item.html", function (err, html) {
//   if (err) {
//     throw err;
//   }
//   const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     res.write(html);
//     res.end();
//   });
//
//   server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
//   });
// });

const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadFile('add-item.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
})

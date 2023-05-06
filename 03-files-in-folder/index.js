const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach((file) => {
      fs.stat(path.join(dirPath, file), (err, stats) => {
        if (!stats.isFile()) return;
        const name = path.parse(dirPath + `/${file}`).name;
        const extension = (path.parse(dirPath + `/${file}`).ext.slice(1));
        const size = stats.size / 1000 + ' kb';
        console.log(`${name} - ${extension} - ${size}`);
      });
    });
  }
});

const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const source = path.join(__dirname, 'files');
const destination = path.join(__dirname, 'files-copy');

const deleteFile = () => {
  console.log(`Folder ${path.parse(destination).name} is deleted`);
  return fsPromise.rm(destination, { force: true, recursive: true });
}

const createFolder = () => {
  console.log(`Folder ${path.parse(destination).name} is created`);
   return fsPromise.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
}

const copyFiles = () => {
  fs.readdir(source, (err, files) => {
      files.forEach((file) => {
        fs.copyFile(path.join(source, file), path.join(destination, file), () => {
          if (err) throw err;
          console.log(`Copy of ${file} was created`);
        });
      });
  });
}

deleteFile()
  .then(createFolder)
  .then(copyFiles)
  .catch(err => { console.log(err) });
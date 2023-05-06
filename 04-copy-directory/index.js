// const fs = require('fs');
// const fsPromises = require('fs/promises')
// const path = require('path');

// const source = path.join(__dirname, 'files')
// const destination = path.join(__dirname, 'files-copy')


// const deleteFolder = () => {
//     fs.rm(destination, { force: true, recursive: true }, (err) => {
//     if (err) throw err;
//     console.log('dir deleted')
//   })
// }

// const createFolder = () => {
//   fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
//     if (err) {
//       throw err;
//     }
//     console.log('file created')
//   })
// }

// const copyFiles = () => {
//   fs.readdir(source, (err, files) => {
//     if (err) {
//       throw err;
//     } else {
//       files.forEach((file) => {
//         fs.copyFile(path.join(source, file), path.join(destination, file), () => {
//           if (err) {
//             throw err
//           } else {
//             console.log('Copy was created')
//           }
//         })
//       });
//     }
//   });
// }

// deleteFolder().then(createFolder()).then(copyFiles())

////////////////////////////////////////////////////////////////////

// const fsPromises = require('fs/promises')
// const path = require('path');

// const source = path.join(__dirname, 'files')
// const destination = path.join(__dirname, 'files-copy')

// const main = async () => {
//   try {
//     await fsPromises.rm(destination, { force: true, recursive: true });
//     console.log('dir deleted');
//     await fsPromises.mkdir(destination, { recursive: true });
//     console.log('file created');
//     const files = await fsPromises.readdir(source);
//     for (const file of files) {
//       await fsPromises.copyFile(path.join(source, file), path.join(destination, file));
//       console.log('Copy was created');
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }

// main();

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
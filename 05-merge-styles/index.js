const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const source = path.join(__dirname, 'styles');
const destination = path.join(__dirname, 'project-dist');

const createCssFile = () => {
  console.log('bundle.css created')
  return fsPromise.writeFile(path.join(destination, 'bundle.css'), '')
}

const readFiles = () => {
  return fsPromise.readdir(source)
}

const filterCss = (files) => {
  const cssOnly = files.filter((file) => path.extname(file) == '.css')
  console.log(`CSS filtered: ${cssOnly}`)
  return cssOnly
}

const mergeCss = async (cssFiles) => {
  const filePromises = cssFiles.map(file => {
    return fsPromise.readFile(path.join(source, file), 'utf-8');
  });
  const filesData = await Promise.all(filePromises);
  const stringData = filesData.join('');
  return stringData;
};

const insertCss = (css) => {
  return fs.appendFile(path.join(destination, 'bundle.css'), css, (err) => {
    if (err) throw err;
    console.log('CSS inserted');
  });
}


createCssFile().then(readFiles).then(files => filterCss(files)).then(cssFiles => mergeCss(cssFiles)).then(cssString => insertCss(cssString))
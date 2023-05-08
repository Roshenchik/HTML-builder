const fs = require('fs');
const fsPromise = require('fs/promises');
const path = require('path');

const assets = path.join(__dirname, 'assets');
const htmlTemplate = path.join(__dirname, 'template.html');
const styles = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');
const projectDir = path.join(__dirname, 'project-dist');

const createFolder = () => {
  console.log(`Folder ${path.parse(projectDir).name} is created\n`);
   return fsPromise.mkdir(projectDir, { recursive: true });
}

const readHtmlFolder = () => {
  return fsPromise.readdir(components)
}

const filterHtml = (files) => {
  const htmlOnly = files.filter((file) => path.extname(file) == '.html')
  console.log(`html filtered: ${htmlOnly}\n`)
  return htmlOnly
}

const readHtmlTemplate = () => {
  return fsPromise.readFile(htmlTemplate, 'utf-8');
}

const mergeHtmlContent = async (htmlFiles) => {
  const filePromises = htmlFiles.map(file => {
    return [path.parse(file).name, fsPromise.readFile(path.join(components, file), 'utf-8')];
  });
  const htmlCompomemtsData = await Promise.all(filePromises.map(arr => Promise.all(arr)));
  const htmlTemplateData = await readHtmlTemplate();

  let newHtml = htmlTemplateData
  htmlCompomemtsData.forEach(([section, content]) => {
    const TagFlag = `{{${section}}}`
    if (newHtml.indexOf(TagFlag)) {
      const replace = newHtml.indexOf(TagFlag)
      newHtml = newHtml.slice(0, replace) + content + newHtml.slice(replace + TagFlag.length)
    }
  })
  return newHtml
};

const createHtmlFile = (htmlContent) => {
  console.log('index.html created, content inserted\n')
  return fsPromise.writeFile(path.join(projectDir, 'index.html'), htmlContent)
}

createFolder()
  .then(readHtmlFolder)
  .then(files => filterHtml(files))
  .then(htmlFiles => mergeHtmlContent(htmlFiles))
  .then(html => createHtmlFile(html));



const createCssFile = () => {
console.log('style.css created\n')
return fsPromise.writeFile(path.join(projectDir, 'style.css'), '')
}

const readCssFiles = () => {
  return fsPromise.readdir(styles)
}

const filterCss = (files) => {
  const cssOnly = files.filter((file) => path.extname(file) == '.css')
  console.log(`CSS filtered: ${cssOnly}\n`)
  return cssOnly
}

const mergeCss = async (cssFiles) => {
  const filePromises = cssFiles.map(file => {
    return fsPromise.readFile(path.join(styles, file), 'utf-8');
  });
  const filesData = await Promise.all(filePromises);
  const stringData = filesData.join('');
  return stringData;
};

const insertCss = (css) => {
  return fs.appendFile(path.join(projectDir, 'style.css'), css, (err) => {
    if (err) throw err;
    console.log('CSS inserted\n');
  });
}

createCssFile()
  .then(readCssFiles)
  .then(files => filterCss(files))
  .then(cssFiles => mergeCss(cssFiles))
  .then(cssString => insertCss(cssString))



const deleteFolder = () => {
  console.log(`Folder assets is deleted\n`);
  return fsPromise.rm(path.join(projectDir, 'assets'), { force: true, recursive: true });
}

const createAssetsFolder = () => {
  console.log(`Folder assets is created\n`);
    return fsPromise.mkdir(path.join(projectDir, 'assets'), { recursive: true });
}

const copyFiles = async () => {
  const subDirs = await fsPromise.readdir(assets);
  const subDirsFilesPromises = subDirs.map(dir => {
    return [dir, fsPromise.readdir(path.join(assets, dir))]
  })
  const subDirsFiles = await Promise.all(subDirsFilesPromises.map(arr => Promise.all(arr)))

  await Promise.all(subDirsFiles.map(([folder, files]) => { //       cretate sub-folders
    fsPromise.mkdir(path.join(projectDir, 'assets', folder))
    console.log(`\nsub-folder ${folder} created`)

    const unpackFiles = files.map(file => {
      console.log(` >file ${file} inserted`)
      return fsPromise.copyFile(path.join(assets, folder, file), path.join(projectDir, 'assets', folder, file))
    })
    Promise.all(unpackFiles)
  }))

  // await Promise.all(subDirsFiles.map(([folder, files]) => { //         isert files
  //   const unpackFiles = files.map(file => {
  //     return fsPromise.copyFile(path.join(assets, folder, file), path.join(projectDir, 'assets', folder, file))
  //   })
  //   Promise.all(unpackFiles)
  // }))
};

deleteFolder()
  .then(createAssetsFolder)
  .then(copyFiles)
  .catch(err => { console.log(err) });
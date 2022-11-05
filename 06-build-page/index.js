const {readdir, mkdir, copyFile, rm, appendFile, writeFile} = require('fs/promises');
const path = require('path');
const fs = require("fs");

const SOURCE_DIRECTORY_PATH = path.resolve(__dirname);
const SOURCE_DIRECTORY_ASSETS_PATH = path.resolve(__dirname, 'assets');
const SOURCE_DIRECTORY_COMPONENTS_PATH = path.resolve(__dirname, 'components');
const SOURCE_DIRECTORY_STYLES_PATH = path.resolve(__dirname, 'styles');

const TARGET_DIRECTORY_PATH = path.resolve(__dirname, 'project-dist');

const cleanTargetDir = async (target = TARGET_DIRECTORY_PATH) => {
  await rm(target, {force: true, recursive: true});
  await mkdir(target);
  return target;
};

const getFileContent = async (filePath) => {
  const stream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    let content = '';
    stream.on('data', (data) => content += data);
    stream.on('end', () => {
      stream.close();
      resolve(content);
    });
  });
};

const mergeStyles = async () => {
  const files = await readdir(SOURCE_DIRECTORY_STYLES_PATH, {withFileTypes: true});
  for (const file of files) {
    if (file.name.indexOf('css') > 1) { //1 symbol as min filename and 1 symbol for dot
      const content = await getFileContent(path.resolve(SOURCE_DIRECTORY_STYLES_PATH, file.name));
      const result = appendFile(path.resolve(TARGET_DIRECTORY_PATH, 'style.css'), content);
    }
  }
};

const copyAssets = async (sourceDirectoryPath, targetDirectoryPath) => {
  const dirName = await cleanTargetDir(targetDirectoryPath);
  const items = await readdir(sourceDirectoryPath, {withFileTypes: true});
  for (const item of items) {
    if (item.isDirectory()) {
      await copyAssets(path.resolve(sourceDirectoryPath, item.name), path.resolve(targetDirectoryPath, item.name));
    }
    if (item.isFile()) {
      const sourcePath = path.resolve(__dirname, sourceDirectoryPath, item.name);
      const targetPath = path.resolve(__dirname, targetDirectoryPath, item.name);
      const copy = await copyFile(sourcePath, targetPath);
    }
  }
};

(async () => {
  await cleanTargetDir();
  await mergeStyles();
  await copyAssets(path.resolve(__dirname, SOURCE_DIRECTORY_ASSETS_PATH), path.resolve(TARGET_DIRECTORY_PATH, 'assets'));

  const templatePath = path.resolve(SOURCE_DIRECTORY_PATH, 'template.html');
  let templateContent = await getFileContent(templatePath);
  const components = await readdir(SOURCE_DIRECTORY_COMPONENTS_PATH, {withFileTypes: true});
  for (const component of components) {
    const componentPath = path.resolve(SOURCE_DIRECTORY_COMPONENTS_PATH, component.name);
    const componentName = path.parse(componentPath).name;
    const componentContent = await getFileContent(componentPath);
    templateContent = templateContent.replace(`{{${componentName}}}`, componentContent);
  }
  templateContent = templateContent.replaceAll(/({{)(\w*)(}})/gi, '');
  await writeFile(path.resolve(TARGET_DIRECTORY_PATH, 'index.html'), templateContent);
})();
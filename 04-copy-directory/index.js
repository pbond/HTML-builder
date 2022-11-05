const {readdir, mkdir, copyFile, rm} = require('fs/promises');
const path = require('path');

const SOURCE_DIRECTORY_NAME = 'files';
const TARGET_DIRECTORY_NAME = 'files-copy';

const cleanOrCreateTargetDir = async () => {
  const dirPath = path.resolve(__dirname, TARGET_DIRECTORY_NAME);
  const targetDir = await readdir(dirPath, {withFileTypes: true})
    .then(files => {
      const tasks = [];
      for (const file of files) {
        const filePath = path.resolve(__dirname, TARGET_DIRECTORY_NAME, file.name);
        tasks.push(rm(filePath));
      }
      return Promise.all(tasks);
    }, error => {
      return mkdir(dirPath, {recursive: true});
    });
  return dirPath;
};

(async () => {
  const targetDir = await cleanOrCreateTargetDir();
  const files = await readdir(path.resolve(__dirname, SOURCE_DIRECTORY_NAME), {withFileTypes: true });
  for (const file of files) {
    const sourcePath = path.resolve(__dirname, SOURCE_DIRECTORY_NAME, file.name);
    const targetPath = path.resolve(__dirname, TARGET_DIRECTORY_NAME, file.name);
    const copy = await copyFile(sourcePath, targetPath);
  }
})();

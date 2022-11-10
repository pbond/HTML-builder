const {readdir, appendFile, rm, mkdir} = require('fs/promises');
const path = require('path');
const fs = require("fs");

const SOURCE_DIRECTORY_PATH = path.resolve(__dirname, 'styles');
const TARGET_DIRECTORY_PATH = path.resolve(__dirname, 'project-dist');

const getFileContent = async (file) => {
  const stream = fs.createReadStream(path.resolve(SOURCE_DIRECTORY_PATH, file.name));
  return new Promise((resolve, reject) => {
    let content = '';
    stream.on('data', (data) => content += data);
    stream.on('end', () => {
      stream.close();
      resolve(content);
    });
  });
};

(async () => {
  const targetFilePath = path.resolve(TARGET_DIRECTORY_PATH, 'bundle.css');
  await rm(targetFilePath, {force: true});
  const files = await readdir(SOURCE_DIRECTORY_PATH, {withFileTypes: true});
  for (const file of files) {
    if (file.name.split('.').at(-1) === 'css') { //1 symbol as min filename and 1 symbol for dot
      const content = await getFileContent(file);
      const result = await appendFile(targetFilePath, content + '\n');
    }
  }
})();
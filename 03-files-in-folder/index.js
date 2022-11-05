const { readdir, stat } = require('fs/promises');
const path = require('path');

(async () => {
  const dirPath = path.resolve(__dirname, 'secret-folder');
  const files = await readdir(dirPath, {withFileTypes: true});
  for (const item of files) {
    if (item.isDirectory()) {
      continue;
    }
    const file = path.resolve(__dirname, 'secret-folder', item.name);
    const name = path.parse(file).name;
    const ext = path.parse(file).ext.slice(1);
    const size = (await stat(file)).size;
    console.log(`${name}-${ext}-${size}`);
  }
})();

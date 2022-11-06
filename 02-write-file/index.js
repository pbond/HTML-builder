const fs = require('fs');
const path = require("path");

const stream = fs.createWriteStream(path.resolve(__dirname, 'input.txt'));

process.stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    streamClose();
    return;
  }
  stream.write(data);
});

const streamClose = () => {
  console.log('The file has been saved!');
  process.exit();
};

process.on('SIGINT', streamClose);
console.log('Hello! Please, input something in the console:');
const fs = require('fs');
const path = require("path");
const readline = require('node:readline');

// const stream = fs.createWriteStream(path.resolve(__dirname, 'input.txt'));
let content = '';

const reader = readline.createInterface(process.stdin);
reader.on('line', (data) => {
  if (data === 'exit') {
    streamClose();
    return;
  }
  content += data;
});

const streamClose = () => {
  fs.writeFile(path.resolve(__dirname, 'input.txt'), content, (err) => {
    console.log('The file has been saved!');
    process.exit();
  });
};

process.on('SIGINT', streamClose);
console.log('Hello! Please, input something in the console:')
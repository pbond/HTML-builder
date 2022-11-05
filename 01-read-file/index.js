const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

let content = '';
stream.on('data', (data) => {
  content += data;
});
stream.on('end', () => console.log(content));
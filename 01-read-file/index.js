const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

let content = '';
stream.on('data', (data) => {
  content += data;
});
stream.on('end', () => console.log(content));



// fs.readFile(path.resolve(__dirname, 'text.txt'), (err, data) => {
//   if (err) throw err;
//   const content = data.toString();
//   console.log(content);
// });


// // const data = new Promise((res, rej) => {
// //   fs.readFile('./text.txt', (err, buffer) => {
// //     res(buffer.toString());
// //   })
// // });
//
// (async function(){
//   const data =  await fs.promises.readFile('./text.txt');
//   console.log(data.toString());
// })();
const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const pathToFile = path.join(__dirname, 'input.txt');

const inputText = () => {
  stdout.write('Type some text\n');
  stdin.on('data', data => {

    if (data.toString().trim() === 'exit') {
      process.exit();
    }

    fs.appendFile(pathToFile, data, (err) => {
      if (err) throw err;
    })

  });
}

fs.writeFile(pathToFile, '', (err) => {
  if (err) {
    console.log('File already has been created');
  } else {
    inputText();
  }
});

process.on('SIGINT', function () {
  process.exit();
});
process.on('exit', () => {
  stdout.write('Goddamn, great input bro!');
});


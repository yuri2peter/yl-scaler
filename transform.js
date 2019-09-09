const Babel = require('babel-standalone');
const fs = require('fs-extra');

function walk(path, callback) {
  const files = fs.readdirSync(path); //返回目录名和文件名的字符串数组

  files.forEach(function(file) {
    if (fs.statSync(path + '/' + file).isFile()) {
      callback(path, file);
    } else {
      walk(path + '/' + file, callback); //判断文件夹，继续递归
    }
  });
}

(async function() {
  await fs.emptyDir('./lib');
  await fs.copy('./src/', './lib/');
  console.log('Go https://babeljs.io/repl to get more tools.');
  walk('./lib', async (path, fileName) => {
    const filePath = path + '/' + fileName;
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      const input = await fs.readFile(filePath,'utf-8');
      const output = Babel.transform(input, { presets: ['es2015', 'es2017', 'es2017', 'stage-0', 'react'] }).code;
      await fs.writeFile(filePath, output);
      const { size } = await fs.stat(filePath);
      console.log(`${filePath} ${size / 1000}kb`);
    }
  });
})();

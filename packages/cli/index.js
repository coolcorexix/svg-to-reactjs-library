const path = require('path');
const fs = require('fs');
const transform = require('@svg2jsx/transform');
const { cac } = require('cac');

const cli = cac('svg2jsx');

cli.command('convert-svg-bulk <folderPath>', 'Convert all SVG files in a folder to PNG').action((folderPath) => {
  folderPath = path.resolve(folderPath);
  console.log(`Listing all SVG files in folder: ${folderPath}`);
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error occurred while reading the folder:', err);
      return;
    }

    const svgFileNames = files.filter((file) => path.extname(file) === '.svg');

    if (svgFileNames.length === 0) {
      console.log('No SVG files found in the folder.');
      return;
    }

    console.log('Found SVG files:');
    svgFileNames.forEach(async (fileName) => {
      const svgContent = fs.readFileSync(path.join(folderPath, fileName), 'utf8');
      const jsx = await transform(svgContent);
      console.log('🚀 ~ file: index.js:27 ~ svgFiles.forEach ~ jsx:', jsx);
    });
  });
});

cli.parse();

const path = require('path');
const fs = require('fs');
const transform = require('@svg2jsx/transform');
const { cac } = require('cac');

const cli = cac('svg2jsx');

function toTitleCase(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase()).replace(/[-\s]/g, '');
}

cli
  .command('convert-svg-bulk <folderPath>', 'Convert all SVG files in a folder to PNG')
  .option('--outDir <outputFolder>', 'Specify the output folder path')
  .action(async (folderPath, options) => {
    folderPath = path.resolve(folderPath);
    console.log(`Listing all SVG files in folder: ${folderPath}`);

    const outputFolder = options.output ? path.resolve(options.output) : path.join(process.cwd(), 'svg2jsx-icons');

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    fs.readdir(folderPath, async (err, files) => {
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
      const plainTextSourceCode = {};
      const iconComponents = [];
      for (const fileName of svgFileNames) {
        const svgContent = fs.readFileSync(path.join(folderPath, fileName), 'utf8');
        const jsx = await transform(svgContent);
        const baseNameWithoutExtension = path.basename(fileName, '.svg');
        const titleCaseFileName = toTitleCase(baseNameWithoutExtension);

        const outputFileName = path.join(outputFolder, `${titleCaseFileName}.jsx`);
        fs.writeFileSync(outputFileName, jsx);
        console.log(`Converted and saved to: ${outputFileName}`);

        plainTextSourceCode[titleCaseFileName] = jsx;

        // Store the icon component name in the barrel file
        iconComponents.push(titleCaseFileName);
      }

      // Generate the index file (barrel file) with lazy imports
      const indexFileContent = iconComponents
        .map((componentName) => `export { default as ${componentName} } from './${componentName}';`)
        .join('\n');

      const indexFilePath = path.join(outputFolder, 'index.js');
      const plainTextSourceCodeFilePath = path.join(outputFolder, 'plain-text.json');
      fs.writeFileSync(indexFilePath, indexFileContent);
      fs.writeFileSync(plainTextSourceCodeFilePath, JSON.stringify(plainTextSourceCode, null, 2));
      console.log(`Barrel file (index.js) created in: ${indexFilePath}`);
    });
  });

cli.parse();

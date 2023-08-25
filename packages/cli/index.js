const path = require('path');
const fs = require('fs');
const transform = require('@svg2jsx/transform');
const chalk = require('chalk');
const { cac } = require('cac');

const cli = cac('svg2jsx');

function logMessage(message, type = 'info') {
  const logStyles = {
    info: chalk.blue,
    error: chalk.red,
    success: chalk.green,
    warning: chalk.orange,
  };

  const style = logStyles[type] || chalk.white.bold;

  console.log(style(message));
}

function toTitleCase(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase()).replace(/[-\s]/g, '');
}

cli
  .command('convert-svg-bulk <folderPath>', 'Convert all SVG files in a folder to PNG')
  .option('--outDir <outputFolder>', 'Specify the output folder path')
  .action(async (folderPath, options) => {
    folderPath = path.resolve(folderPath);

    const outputFolder = options.outDir ? path.resolve(options.outDir) : path.join(process.cwd(), 'svg2jsx-icons');

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    fs.readdir(folderPath, async (err, files) => {
      if (err) {
        logMessage('Error occurred while reading the folder:' + err, 'error');
        return;
      }

      const svgFileNames = files.filter((file) => path.extname(file) === '.svg');

      if (svgFileNames.length === 0) {
        logMessage('No SVG files found in the folder.', 'error');
        return;
      }
      
      const iconComponents = [];
      for (const fileName of svgFileNames) {
        const svgContent = fs.readFileSync(path.join(folderPath, fileName), 'utf8');
        const jsx = await transform(svgContent);
        const baseNameWithoutExtension = path.basename(fileName, '.svg');
        const titleCaseFileName = toTitleCase(baseNameWithoutExtension);

        const outputFileName = path.join(outputFolder, `${titleCaseFileName}.jsx`);
        fs.writeFileSync(outputFileName, jsx);
        logMessage(`Converted and saved to: ${outputFileName}`, 'info');

        // Store the icon component name in the barrel file
        iconComponents.push(titleCaseFileName);
      }

      // Generate the index file (barrel file) with lazy imports
      const indexFileContent = iconComponents
        .map((componentName) => `export { default as ${componentName} } from './${componentName}';`)
        .join('\n');

      const indexFilePath = path.join(outputFolder, 'index.js');
      fs.writeFileSync(indexFilePath, indexFileContent);
      logMessage(`Barrel file (index.js) created in: ${indexFilePath}`, 'success');
    });
  });

cli.parse();

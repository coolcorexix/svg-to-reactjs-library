const clean = require('./lib/cleaner');
const parse = require('./lib/parser');
const transform = require('./lib/transformer');
const stringify = require('./lib/stringifier');
const format = require('./lib/formatter');

/**
 * Clean-up and transform SVG into valid JSX.
 * @param {string} svg SVG string
 * @param {Object} config Output component type and Prettier options.
 * @returns {string}
 */
async function transformer(svg, config = {}) {
  const cleaned = await clean(svg, config);
  const parsed = parse(cleaned.data);
  const transformed = transform(parsed);
  const {
    attributes: { width, height },
    defaultFillColor,
  } = transformed;
  const morphed = stringify(transformed);
  const formatted = format(morphed, config, {
    defaultFillColor,
    defaultSize: {
      width,
      height,
    },
  });

  return formatted;
}

module.exports = transformer;

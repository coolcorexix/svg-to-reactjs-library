const isPlainObject = require('lodash.isplainobject');
const isString = require('lodash.isstring');

/**
 * Stringify style.
 * @param {Object=} style Node style.
 * @returns {string}
 */
function stringifyStyle(style = {}) {
  const proprietyNames = Object.keys(style);

  return proprietyNames.reduce((accumulator, proprietyName) => {
    const propriety = style[proprietyName];
    const isStringPropriety = isString(propriety);

    if (isStringPropriety) {
      return accumulator + `${proprietyName}: "${propriety}", `;
    }

    return accumulator + `${proprietyName}: ${propriety}, `;
  }, String());
}

/**
 * Stringify attributes.
 * @param {Object=} attributes Node attributes.
 * @returns {string}
 */
function stringifyAttributes(attributes = {}, nodeName = '') {
  const attributeNames = Object.keys(attributes);

  return attributeNames.reduce((accumulator, attributeName) => {
    const attribute = attributes[attributeName];
    const isStyleAttribute = isPlainObject(attribute);
    if (attributeName === 'fill') {
      return accumulator + ` fill={color}`;
    }
    
    if (attributeName === 'width' &&  nodeName === 'svg' ) {
      return accumulator + ` width={width}`;
    }

    if (attributeName === 'height'  &&  nodeName === 'svg') {
      return accumulator + ` height={height}`;
    }

    if (isStyleAttribute) {
      return accumulator + ` ${attributeName}={{ ${stringifyStyle(attribute)} }}`;
    }

    return accumulator + ` ${attributeName}="${attribute}"`;
  }, String());
}

/**
 * Stringify SVG tree.
 * @param {Object} node Root node.
 * @returns {string}
 */
function stringify(node) {
  if (isString(node)) {
    return node;
  }

  const attributes = stringifyAttributes(node.attributes, node.name);
  const buffer = `<${node.name}${attributes}>`;

  const childrensBuffer = node.children.reduce((accumulator, childrenNode) => {
    return accumulator + stringify(childrenNode);
  }, buffer);

  return childrensBuffer + `</${node.name}>`;
}

module.exports = stringify;

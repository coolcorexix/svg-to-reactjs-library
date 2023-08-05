const isString = require('lodash.isstring');
const camelCase = require('lodash.camelcase');
const nativeCSS = require('css-to-object');

/**
 * Custom attributes.
 * @readonly
 * @type {Map<string, string>}
 */
const CUSTOM_ATTRIBUTES = {
  class: 'className',
};

/**
 * Apply transforms to styles.
 * @param {string} style Style string.
 * @returns {string}
 */
function transformStyle(style) {
  const transformed = nativeCSS(style, {
    numbers: true,
    camelCase: true,
  });

  return transformed;
}
const hexColorRegex = /^#([0-9a-fA-F]{3}){1,2}$/;

function outmostTransform(node) {
  const transformedNode = transform(node);
  console.log('in the outmost: ', transformedNode.defaultFillColor);
  // console.log('in the outmost 2: ', transformedNode.defaultFillColor);
  return transformedNode;
}

/**
 * Apply transforms to SVG tree.
 * @param {Object} node Root node.
 * @returns {string}
 */
function transform(node) {
  let defaultFillColor;
  if (isString(node)) {
    return node;
  }

  const attributeNames = Object.keys(node.attributes);

  const attributes = attributeNames.reduce((accumulator, attributeName) => {
    const attribute = node.attributes[attributeName];

    if (!defaultFillColor && attributeName === 'fill' && hexColorRegex.test(attribute)) {
      defaultFillColor = attribute;
    }

    const isStyleAttribute = attributeName === 'style';
    const isDataAttribute = attributeName.startsWith('data-');

    if (isDataAttribute) {
      return {
        ...accumulator,
        [attributeName]: attribute,
      };
    }
    if (isStyleAttribute) {
      return {
        ...accumulator,
        [attributeName]: transformStyle(attribute),
      };
    }
    if (CUSTOM_ATTRIBUTES[attributeName]) {
      return {
        ...accumulator,
        [CUSTOM_ATTRIBUTES[attributeName]]: attribute,
      };
    }
    return {
      ...accumulator,
      [camelCase(attributeName)]: attribute,
    };
  }, {});

  const children = node.children.map((childNode) => {
    const childNodeTransformed = transform(childNode);
    if (!defaultFillColor && childNodeTransformed.defaultFillColor) {
      defaultFillColor = childNodeTransformed.defaultFillColor;
    }
    return childNodeTransformed;
  });
  // console.log("🚀 ~ file: transformer.js:89 ~ transform ~ defaultFillColor:", node.name, defaultFillColor)
  return {
    ...node,
    children,
    attributes,
    defaultFillColor,
  };
}

module.exports = outmostTransform;

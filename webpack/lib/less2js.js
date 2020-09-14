/**
 * @module less2js
 * @listens MIT
 * @author nuintun
 * @description Get js from less vars.
 * @see https://github.com/michaeltaranto/less-vars-to-js
 */

const stripComments = require('strip-json-comments');

const varRgx = /^[@$]/;

/**
 * @function followVar
 * @description 递归解析 var
 * @param {string} value
 * @param {object} vars
 * @param {object} dictionary
 * @returns {string}
 */
const followVar = (value, vars, dictionary) => {
  if (varRgx.test(value)) {
    // value is a variable
    return followVar(vars[value] || dictionary[value.replace(varRgx, '')]);
  }

  return value;
};

/**
 * @function less2js
 * @description 将 Less 变量转换 js 对象
 * @param {string} sheet
 * @param {object} [options]
 * @param {object} [options.dictionary]
 * @param {boolean} [options.stripPrefix]
 * @param {boolean} [options.resolveVariables]
 * @returns {object}
 */
module.exports = (sheet, options = {}) => {
  const { dictionary = {}, resolveVariables = false, stripPrefix = false } = options;
  const matches = stripComments(sheet, { whitespace: false }).match(/[@$](.*:[^;]*)/g) || [];

  let vars = {};

  matches.forEach(variable => {
    const definition = variable.split(/:\s*/);

    let value = definition.splice(1).join(':');

    value = value.trim().replace(/^["'](.*)["']$/, '$1');

    vars[definition[0].replace(/['"]+/g, '').trim()] = value;
  });

  if (resolveVariables) {
    Object.keys(vars).forEach(key => {
      vars[key] = followVar(vars[key], vars, dictionary);
    });
  }

  if (stripPrefix) {
    const transformKey = key => key.replace(varRgx, '');

    vars = Object.keys(vars).reduce((prev, key) => {
      prev[transformKey(key)] = vars[key];

      return prev;
    }, {});
  }

  return vars;
};

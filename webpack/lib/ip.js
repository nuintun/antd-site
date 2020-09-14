/**
 * @module ip
 * @listens MIT
 * @author nuintun
 * @description Get local external ip.
 */

'use strict';

const os = require('os');

/**
 * @function getLocalExternalIP
 * @param {string} family
 * @returns {string}
 */
module.exports = (family = 'IPv4') => {
  const networkInterfaces = os.networkInterfaces();
  const interfaces = Object.keys(networkInterfaces);

  for (const face of interfaces) {
    const networkInterface = networkInterfaces[face];

    for (const network of networkInterface) {
      if (!network.internal && network.family === family) {
        return network.address;
      }
    }
  }

  return '127.0.0.1';
};

/** @type {import('next').NextConfig} */


// next.config.js
module.exports = {
    serverRuntimeConfig: {
      // Increase the maximum request body size to 10MB
      bodySizeLimit: '100mb',
    },
  };
  

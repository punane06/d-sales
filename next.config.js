const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = function createNextConfig(phase) {
  return {
    output: 'export',
    // Keep development cache isolated so dev and build processes cannot corrupt each other.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    images: {
      unoptimized: true,
    },
  };
};

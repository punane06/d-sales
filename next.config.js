const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

function parseAllowedDevOrigins(value) {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = function createNextConfig(phase) {
  const allowedDevOriginsFromEnv = parseAllowedDevOrigins(process.env.NEXT_ALLOWED_DEV_ORIGINS);
  const allowedDevOrigins = allowedDevOriginsFromEnv.length > 0 ? allowedDevOriginsFromEnv : ['192.168.1.11'];

  return {
    output: 'export',
    // Keep development cache isolated so dev and build processes cannot corrupt each other.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    allowedDevOrigins,
    images: {
      unoptimized: true,
    },
  };
};

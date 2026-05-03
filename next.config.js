const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

function parseAllowedDevOrigins(value) {
  if (!value) {
    return [];
  }

  const rawOrigins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return rawOrigins.flatMap((origin) => {
    if (!origin.includes('://')) {
      // Next.js may validate using plain host values for LAN requests.
      return [origin, `http://${origin}:3000`, `https://${origin}:3000`, `http://${origin}:3001`, `https://${origin}:3001`];
    }

    if (origin.startsWith('http://') || origin.startsWith('https://')) {
      try {
        const hostname = new URL(origin).hostname;
        return [origin, hostname];
      } catch {
        return [origin];
      }
    }

    return [origin];
  });
}

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = function createNextConfig(phase) {
  const allowedDevOriginsFromEnv = parseAllowedDevOrigins(process.env.NEXT_ALLOWED_DEV_ORIGINS);
  const allowedDevOrigins =
    allowedDevOriginsFromEnv.length > 0
      ? allowedDevOriginsFromEnv
      : [
          '192.168.1.11',
          'http://192.168.1.11:3000',
          'http://192.168.1.11:3001',
          'localhost',
          'http://localhost:3000',
          'http://localhost:3001',
          '192.168.1.2',
          'http://192.168.1.2:3000',
          'http://192.168.1.2:3001'
        ];

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

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['node_modules/**', '.next/**', '.next-dev/**', 'out/**'],
  },
  ...nextCoreWebVitals,
];
export default config;

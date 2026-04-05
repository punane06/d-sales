import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [
  {
    ignores: ['node_modules/**', '.next/**', '.next-dev/**', 'out/**'],
  },
  ...nextCoreWebVitals,
];

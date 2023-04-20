import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/FormAPIEx.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
    plugins: [json(), typescript()],
  },
  {
    input: 'lib/src/index.d.ts',
    output: [
      {
        file: 'lib/FormAPIEx.d.ts',
        format: 'es',
      },
    ],
    plugins: [dts()],
  },
];

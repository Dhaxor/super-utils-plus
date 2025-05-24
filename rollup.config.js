import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json' assert { type: 'json' };

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.min.js',
        format: 'umd',
        name: 'SuperUtilsPlus',
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ],
  },
  {
    input: 'dist/dts/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
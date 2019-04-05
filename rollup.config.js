import typescript from 'rollup-plugin-typescript3';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  external: ['react'],
  input: 'src/webComponents/Catalog.tsx',
  output: {
    file: 'bundle.js',
    format: 'es',
    name: 'Catalog'
  },
  plugins: [
    typescript(),
    resolve(),
    commonJS({
      include: 'node_modules/**'
    }),
    babel({
      presets: ['@babel/react']
    })
  ]
};

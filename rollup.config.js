import typescript from 'rollup-plugin-typescript3';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';

export default {
  external: ['react'],
  input: 'src/webComponents/Catalog.tsx',
  output: {
    file: 'bundle.js',
    format: 'es',
    name: 'Catalog',
    globals: {
      react: 'React'
    },
  },
  plugins: [
    typescript(),
    resolve(),
    commonJS({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/react.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    babel({
      presets: ['@babel/react']
    }),
    minify()
  ]
};

/* eslint-disable prettier/prettier */
//import typescript from '@rollup/plugin-typescript';
import typescript from './lib/index.es';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import rimraf from "rimraf";
import { terser } from "rollup-plugin-terser";

// Delete 'dist'
//rimraf.sync("dist");
rimraf.sync(".rpt2_cache");

const build = process.env.NODE_ENV || 'production';

const babelOptions = babel({
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  plugins: [
    ["@babel/transform-react-jsx", { pragma: "h" }],
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
  ],
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
});

const clientOptions = {
  watch: { clearScreen: false },
  plugins: [
    copy({
      targets: [
        { src: 'src/views', dest: 'dist/server/' },
      ]
    }),
    typescript({
      tsconfig: "./src/client/tsconfig.json"
    }),
    resolve(),
    commonjs(),
    babelOptions,
    terser(),
  ].filter(item => item),
};

function buildClient({ watch } = {}) {
  return {
    input: 'src/client/index.tsx',
    output: {
      dir: './dist/public',
      format: 'umd',
      sourcemap: build !== 'production',
    },
    ...clientOptions
  }
}

function buildServiceWorker({ watch } = {}) {
  return {
    input: 'src/service-worker/index.tsx',
    output: {
      file: './dist/public/sw.js',
        format: 'umd',
    },
    ...clientOptions
  };
}

export default function({ watch }) {
  return [buildClient({ watch }), buildServiceWorker({ watch })];
}
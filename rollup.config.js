import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: './source/main.js',
    plugins: [json(), resolve(), commonjs(), babel({
        exclude: 'node_modules/**'
    })],
    // globals: {
    //     jquery: '$'
    // },
    // banner: '/* my-library version ' + 1.00 + ' */',
    // footer: '/* follow me on Twitter! @rich_harris */',
    // intro: 'var ENVIRONMENT = "production";',
    // outro: 'var asdasdsa="123"',
    // cache:true,
    output: {
        file: './bundle/ObserverData.js',
        format: 'umd',
        name: 'ObserverData',
        // paths: {
        //     d3: 'https://d3js.org/d3.v4.min'
        // }
        sourceMap: false,
    }
};
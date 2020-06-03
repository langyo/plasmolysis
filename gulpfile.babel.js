import { src, dest, parallel } from "gulp";
import babel from "gulp-babel";

export const build = parallel(() => {
  return src([
    './packages/**/*.js',
    '!./packages/**/node_modules/**/*',
    '!./packages/create-app/templates/**/*'
  ])
    .pipe(babel({
      "presets": [
        [
          "@babel/preset-env"
        ],
        [
          "@babel/preset-react"
        ]
      ],
      "plugins": [
        [
          "@babel/plugin-proposal-class-properties",
          {
            "loose": true
          }
        ],
        [
          "@babel/plugin-transform-runtime"
        ]
      ]
    }))
    .pipe(dest('./dist/'));
}, () => {
  return src([
    './packages/**/package.json',
    '!./packages/**/node_modules/**/package.json'
  ]).pipe(dest('./dist/'));
});

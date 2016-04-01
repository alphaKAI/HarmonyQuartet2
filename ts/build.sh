#!/usr/bin/env zsh

tsc *.ts ui/*.ts timeline/*.ts socket/*.ts twitter/*.ts
mv ui/*.js ../js/ui
mv *.js ../js
mv timeline/*.js ../js/timeline
mv socket/*.js ../js/socket
mv twitter/*.js ../js/twitter
cd ../js
browserify main.js > bundle.js

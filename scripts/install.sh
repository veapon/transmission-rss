#!/bin/bash
root=$(dirname $(pwd))

npm install -g pm2
cd $root
cp $root/config.js.sample $root/config.js 
npm install

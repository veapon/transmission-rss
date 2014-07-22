#!/bin/bash
root=$(dirname $(pwd))

npm install -g pm2
cd $root
npm install

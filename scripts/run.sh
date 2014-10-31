#!/bin/bash
root=$(dirname $(pwd))
pm2 start $root/rss.js -n transmission-rss -e $root/logs/rss-err.log -o $root/logs/rss.log


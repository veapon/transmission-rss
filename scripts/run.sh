#!/bin/bash
root=$(dirname $(cd `dirname $0`; pwd))
cd $root
pm2 start $root/rss.js -n transmission-rss -e $root/logs/err.txt -o $root/logs/log.txt


transmission-rss
=================

### Installation
1. Enable transmission watch-dir: [See how](https://trac.transmissionbt.com/wiki/EditConfigFiles#FilesandLocations)
2. Run the following commands: 
```bash
git clone https://github.com/veapon/transmission-rss.git
cd transmission-rss

# change the transmission's watch-dir and your rss urls
vim config.js

cd scripts
./install
./run
```
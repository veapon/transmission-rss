// transmission's watch_dir
var torrent_dir = '/share/torrents/';

// RSS url
var rss_url = 'http://pt.hd4fans.org/torrentrss.php?rows=10&cat401=1';


// make this script excute every hour
setInterval(function(){
    var FP = require('feedparser');
    var request = require('request');
    var fs = require('fs');

    var req = request(rss_url);
    var feedparser = new FP({});

    req.on('error', function (error) {
        die('Error occurred while loading RSS, please check your rss_url.');
    });

    req.on('response', function (res) {
        var stream = this;
        if (res.statusCode != 200) {
           die('Error occurred while loading RSS, please check your rss_url.');
            return false;
        }
        stream.pipe(feedparser);
    });

    feedparser.on('readable', function() {
        var stream = this;
        var meta = this.meta;
        var item;

        while (item = stream.read()) {
            console.log('['+new Date().toLocaleString()+']Downloading torrent: '+item.enclosures[0].url);

            // destination file, replace space with dot(.)
            var dest = torrent_dir + item.title.replace(/\s/g, '.') + '.torrent';

            // the torrent url
            var torrent_url = item.enclosures[0].url;

            require('http').get(torrent_url, function(res){

                res.on('error', function(err){
                    die(err);
                })

                // create and download torrent file
                var file = fs.createWriteStream(dest);
                res.pipe(file);

                file.on('finish', function(){
                    console.log('['+new Date().toLocaleString()+']Download success: '+dest);
                    file.close();
                })

                file.on('error', function(err){
                    file.close();
                    die('['+new Date().toLocaleString()+']Download failed: torrent_url, '+err);
                })
            });
        }

    });

    function die(msg) {
        console.log(msg);
    }

}, 3600000)

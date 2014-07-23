var FP = require('feedparser');
var request = require('request');
var fs = require('fs');

var torrent_dir = '/share/veapon/Downloads/tmp/';
var rss_url = 'http://pt.hd4fans.org/torrentrss.php?rows=10&linktype=dl&passkey=47bc1ed13feef5ea2baf68584f8b3a3a&inclbookmarked=1';
var file_added = './torrents_added';
var req = request(rss_url);
var feedparser = new FP({});
var added_torrents = JSON.parse(fs.readFileSync(file_added));

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

feedparser.on('error', function(error) {
    die('The specified rss_url seem to be an invalid rss feed.');
});

feedparser.on('readable', function() {
    var stream = this;
    var meta = this.meta;
    var item;

    while (item = stream.read()) {
        console.log("Downloading torrent: "+item.enclosures[0].url);
        
        if (typeof added_torrents == 'object' && added_torrents.indexOf(item.enclosures[0].url) > -1) {
            die('Torrent exists, skipped.');
            break;
        }

        // destination file, replace space with dot(.)
        var dest = torrent_dir + item.title.replace(/\s/g, '.') + '.torrent';

        // the torrent url
        var torrent_url = item.enclosures[0].url;

        require('http').get(torrent_url, function(res){

            // create and download torrent file
            var file = fs.createWriteStream(dest);
            res.pipe(file);

            file.on('finish', function(){
                console.log('Download success: '+dest);

                // download success, mark the url as added
                added_torrents.push(torrent_url)
                file.close();
            })
            file.on('error', function(err){
                file.close();
                die(err);
            })

        });
    }

});

console.log('end');

//fs.writeFileSync(file_added, JSON.stringify(added_torrents));

function die(msg) {
    console.log(msg);
}
// transmission's watch_dir
var torrent_dir = 'torrents/';

// RSS url
var rss_url = [
	'http://pt.hd4fans.org/torrentrss.php?rows=10&linktype=dl&passkey=xxx&inclbookmarked=1'
	,'https://hdcmct.org/torrentrss.php?rows=10&linktype=dl&passkey=xxx&inclbookmarked=1'
	];

rss();


// retrieve rss feed every 30 mins
setInterval(function(){
	rss(); 
}, 1800000)

function die(msg) {
	console.log(msg);
}

function rss()
{
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
			//console.log('['+new Date().toLocaleString()+']Downloading torrent: '+item.enclosures[0].url);

			// destination file, replace space with dot(.)
			var dest = torrent_dir + item.title.replace(/\s/g, '.') + '.torrent';

			// the torrent url
			var torrent_url = item.enclosures[0].url;

			// break if the url is exists
			var logs = get_log();
			if (typeof logs != 'undefined' && logs.indexOf(torrent_url) > -1) {
				continue;
			}

			require('http').get(torrent_url, function(res){

				res.on('error', function(err){
					die(err);
				})

				// create and download torrent file
				var file = fs.createWriteStream(dest);
				res.pipe(file);

				file.on('finish', function(){
					var logs = get_log();
					console.log(torrent_url);
					if (typeof logs != 'undefined' && /\S/.test(logs)) {
						set_log(',' + torrent_url);
					} else {
						set_log(torrent_url);
					}
					console.log('['+new Date().toLocaleString()+']Download success: '+torrent_url);
					file.close();
				})

				file.on('error', function(err){
					file.close();
					die('['+new Date().toLocaleString()+']Download failed: torrent_url, '+err);
				})
			});
			// http.get() end

		}
		// stream.read() end

	});
}

function set_log(str)
{
	var fs = require('fs');
	var log_path = './logs/rss.log';

	fs.writeFileSync(log_path, str, {flag: 'a+'});
	return true;
}

function get_log()
{
	var fs = require('fs');
	var log_path = './logs/rss.log';

	return fs.readFileSync(log_path, {encoding: 'utf-8', flag: 'a+'});
}

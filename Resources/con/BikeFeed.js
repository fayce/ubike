/**
 * @author fayce
 * @todo: add multiple feeds
 */
var osname = Ti.Platform.osname;
var FEED_URLS = ['http://api.ubikeapp.com/v1/feed.xml', 
				'http://s3-ap-southeast-1.amazonaws.com/api.ubikeapp.com/v1/feed.xml'];

exports.loadFeed = function(o, tries, idx) {
	Ti.API.info('entering loadFeed');
	var xhr = Titanium.Network.createHTTPClient();
	xhr.setTimeout(10000);
	tries = tries || 0;
	idx = idx || 0;
	xhr.open('GET', FEED_URLS[idx]);

	xhr.onload = function(e) {
		Ti.API.info('onload()');
		var xml = this.responseXML;

		if (xml === null || xml.documentElement === null) {
			if (tries < 3) {
				Ti.API.info('trying again');
				Ti.API.info(tries);
				tries++
				exports.loadFeed(o, tries);
				return;
			} else {
				Ti.API.info('finished trying');

				Ti.UI.createAlertDialog({
					title : L('empty_feed_title'),
					message : L('empty_feed_msg')
				}).show();
				return;
			}
		}

		var items = xml.documentElement.getElementsByTagName("marker");
		var data = [];
		//Titanium.API.info('loading feed');
		//Titanium.API.info(items);
		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			sb = parseFloat(item.getAttribute("sus"));
			tb = parseFloat(item.getAttribute("tot"));
			percent = 100 * (sb / tb);
			data.push({
				lat : item.getAttribute("lat"),
				lng : item.getAttribute("lng"),
				name_en : item.getAttribute("nameen"),
				title : item.getAttribute("nameen"),
				name_zh : item.getAttribute("name"),
				address_en : item.getAttribute("addressen"),
				address_zh : item.getAttribute("address"),
				sus_bike : item.getAttribute("sus"),
				tot_bike : item.getAttribute("tot"),
				percent : percent,
				id : i
			});
		}
		if (o.success) {
			Ti.API.info('in o.success');
			o.success(data);
		}
	};
	xhr.onerror = function(e) {
		if (tries < 3) {
			Ti.API.info('trying again');
			Ti.API.info(tries);
			tries += 1;
			exports.loadFeed(o, tries, idx);
			//return;
		} else {
			if (idx < FEED_URLS.length) {
				//let's try the other available data sources
				idx += 1;
				tries = 0;
				exports.loadFeed(o, tries, idx);
			} else {
				// here we tried 3 times each datasource with no success :(
				Ti.API.info('in o.error');
				o.error();
				Ti.UI.createAlertDialog({
					title : L("conn_err_title"),
					message : L("conn_err_msg")
				}).show();
			}
		}
	};

	if (o.start) {
		Ti.API.info('in o.start');
		o.start();
	}
	xhr.send();
};

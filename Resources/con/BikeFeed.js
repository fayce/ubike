/**
 * @author fayce
 * @todo: add multiple feeds
 */
var osname = Ti.Platform.osname;
var FEED_URL = 'http://fayce.net/ubike/feed.xml';


exports.loadFeed = function(o, tries) {
	var xhr = Titanium.Network.createHTTPClient();	
	tries = tries || 0;
	xhr.open('GET', FEED_URL);
	xhr.onload = function(e) {
		var xml = this.responseXML;
		
		if (xml === null || xml.documentElement === null) { 
			if (tries < 3) {
				tries++
				exports.loadRssFeed(o, tries);
				return;
			} else {
				Titanium.UI.createAlertDialog({title:'Connexion Error', message:'Make sure you are connected'}).show();
				if (o.error) { o.error(); }
				return;	
			}	
		}
		
		var items = xml.documentElement.getElementsByTagName("marker");
		var data = [];
		//Titanium.API.info('loading feed');
		//Titanium.API.info(items);
		for (var i = 0; i < items.length; i++) {
			var item = items.item(i);
			
			data.push({
				lat : item.getAttribute("lat"),
				lng : item.getAttribute("lng"),
				name_en : item.getAttribute("nameen"),
				title: item.getAttribute("nameen"),
				name_zh : item.getAttribute("name"),
				address_en: item.getAttribute("addressen"),
				address_zh: item.getAttribute("address"),
				sus_bike: item.getAttribute("sus"),
				tot_bike: item.getAttribute("tot"),
				id: i
			});
		}
		if (o.success) { o.success(data); }
	};
	xhr.onerror = function(e) {
		if (o.error) { o.error(); }
	};

	if (o.start) { o.start(); }
	xhr.send();	
};
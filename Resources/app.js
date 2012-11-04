if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
} else {

	//create a private scope to prevent further polluting the global object
	(function() {
		var BikeFeed = require('con/BikeFeed'), MapWin = require('ui/MapWin'), ListWin = require('ui/ListWin'), DetailsWin = require('ui/DetailsWin');

		mapWin = new MapWin();
		listWin = new ListWin();
		detailsWin = new DetailsWin();
		
		var activeWin = 'mapwin';

		//funcs
		function refreshData() {
			BikeFeed.loadFeed({
				success : function(data) {
					mapWin.refreshPins(data);
					listWin.refreshTable(data);
				}
			});
		}

		//events listeners
		//refresh button
		mapWin.addEventListener('app:refresh', function(e) {
			Ti.API.info('mapwin refresh');
			refreshData();
		});
		listWin.addEventListener('app:refresh', function(e) {
			Ti.API.info('listwin refresh');
			refreshData();
		});

		//window to list
		mapWin.addEventListener('app:list', function(e) {
			Ti.API.info('app:list');
			listWin.open({
				view : mapWin,
				transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
			});
		});
		
		//bike details
		mapWin.addEventListener('app:details', function(e) {
			Ti.API.info('app:details');
			//Ti.API.info(e);
			detailsWin.fill(e['data']);
			detailsWin.open();
		});
		listWin.addEventListener('app:details', function(e) {
			Ti.API.info('app:details');
			//Ti.API.info(e);
			detailsWin.fill(e['data']);
			detailsWin.open();
		});

		//window to map
		listWin.addEventListener('app:map', function(e) {
			Ti.API.info('app:map');
			activeWin = 'mapWin';
			listWin.close({
				view : listWin,
				transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
			});
		});

		// load initial rss feed
		refreshData();

		//open the map window
		mapWin.open();
		//detailsWin.open();
	})();
}
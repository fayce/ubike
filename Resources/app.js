/*
 *  uBike Taipei Mobile app
 *  Faycal Guennar <me@ayce.net>
 *  Nov 2012
 *
 *
 * *****************************************
 *  CI color:
 * #b0c81c lime green
 * #4cbfde light blue
 * #dd3d2d red
 * #eead1d orange
 * #1d79a8 dark blue
 * #4d4d4f dark grey
 * ****************************************
 *
 * */

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
		var language = Ti.Locale.currentLanguage;
		Ti.API.info(language);
		/*
		Ti.UI.createAlertDialog({
		title : L("conn_err_title"),
		message : L("conn_err_msg")
		}).show();
		*/

		//funcs
		var loader = Ti.UI.createLabel({
			color : '#FFFFFF',
			backgroundColor : 'black',
			borderRadius : 11,
			opacity : 0.8,
			text : L('loading'),
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : 'Arial',
				fontSize : 25,
				fontWeight : 'bold'
			},
			width : '150dip',
			height : '150dip'
		});

		function refreshData() {
			mapWin.add(loader);
			listWin.add(loader);
			Ti.API.info('loading...');
			BikeFeed.loadFeed({
				success : function(data) {
					Ti.API.info('finished loading!!!');
					mapWin.refreshPins(data);
					listWin.refreshTable(data);
					mapWin.remove(loader);
					listWin.remove(loader);
				},
				error : function(e) {
					Ti.API.info('finished loading..but failed');
					mapWin.remove(loader);
					listWin.remove(loader);
				}
			});
		}

		//events listeners
		//refresh button
		mapWin.addEventListener('app:refresh', function(e) {
			Ti.API.info('mapwin refresh');
			mapWin.clearRoute();
			refreshData();
		});
		listWin.addEventListener('app:refresh', function(e) {
			Ti.API.info('listwin refresh');
			refreshData();
		});

		//window to list
		mapWin.addEventListener('app:list', function(e) {
			Ti.API.info('app:list');
			activeWin = 'listwin';
			listWin.open({
				view : mapWin,
				//transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
				transition : Ti.UI.iPhone.AnimationStyle.CURL_UP
			});
		});

		//bike details
		mapWin.addEventListener('app:details', function(e) {
			Ti.API.info('app:details');
			//Ti.API.info(e);
			mapWin.clearRoute();
			detailsWin.fill(e['data']);
			detailsWin.open();
		});
		listWin.addEventListener('app:details', function(e) {
			Ti.API.info('app:details');
			//Ti.API.info(e);
			detailsWin.fill(e['data']);
			detailsWin.open();
		});
		detailsWin.addEventListener('app:routeme', function(e) {
			Ti.API.info('app:routeme');
			//Ti.API.info(e);

			//detailsWin.fill(e['data']);
			detailsWin.close();

			if (activeWin == 'listwin') {
				listWin.close();
			}
			mapWin.drawRoute(e);
		});

		//window to map
		listWin.addEventListener('app:map', function(e) {
			Ti.API.info('app:map');
			activeWin = 'mapWin';
			listWin.close({
				view : listWin,
				//transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
				transition : Ti.UI.iPhone.AnimationStyle.CURL_DOWN
			});
		});

		// load initial rss feed
		refreshData();

		//open the map window
		mapWin.open();
		//detailsWin.open();
	})();
}
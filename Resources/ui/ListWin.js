//Master View Component Constructor
function ListWin() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createWindow({
	});

	var gdata;
	var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;
	//searchbar
	var searchbar = Titanium.UI.createSearchBar({
		showCancel : false,
		barColor : '#F0F0F0'
	});

	//table
	var tableView = Ti.UI.createTableView({
		//data : tableData
		top : '43dip',
		search : searchbar,
		hideSearchOnSelection : true
	});
	self.add(tableView);

	//toolbar
	var refresh = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	//Create the toolbar
	var refresh = Titanium.UI.createButton({
		backgroundImage : '/images/reload_n.png',
		backgroundSelectedImage : '/images/reload_p.png',
		width : '30dip',
		height : '30dip'
	});

	var logo = Ti.UI.createImageView({
		image : '/images/logo.png',
		height : '38dip'
	})

	var switchwin = Titanium.UI.createButton({
		backgroundImage : '/images/map_n.png',
		backgroundSelectedImage : '/images/map_p.png',
		width : '30dip',
		height : '30dip'
	});

	flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar = Titanium.UI.iOS.createToolbar({
		items : [refresh, flexSpace, logo, flexSpace, switchwin],
		top : 0,
		borderTop : false,
		borderBottom : false,
		barColor : '#F0F0F0'
	});

	self.add(toolbar);

	//events/
	tableView.addEventListener('click', function(e) {
		Titanium.API.info(e);
		self.fireEvent('app:details', {
			data : gdata[e['index']]
		});

	});
	refresh.addEventListener('click', function(e) {
		self.fireEvent('app:refresh')
	});
	switchwin.addEventListener('click', function(e) {
		self.fireEvent('app:map');
	});
	self.addEventListener('swipe', function(e) {
		self.fireEvent('app:map');
	});

	//methods
	self.refreshTable = function(data) {
		if (Object.prototype.toString.apply(data) === '[object Array]') {
			var bikes = [];
			gdata = data;

			for (var i = 0; i < data.length; i++) {

				/*
				 bikes.push({
				 title : data[i]['title'],
				 hasDetail : true
				 });
				 */
				var row = Ti.UI.createTableViewRow({
					//className:'forumEvent', // used to improve table performance
					selectedBackgroundColor : 'white',
					rowIndex : i, // custom property, useful for determining the row during events
					height : 75
				});
				bgcolor = "";
				percent = data[i]['percent'];
				if (percent < 33) {
					bgcolor = "#b0c81c";
				} else if (percent > 33 && percent < 66) {
					bgcolor = "#eead1d";
				} else {
					bgcolor = "#dd3d2d";
				}
				var countBox = Ti.UI.createLabel({
					color : '#FFFFFF',
					backgroundColor : bgcolor,
					borderRadius : 11,
					text : data[i]['sus_bike'],
					textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
					font : {
						fontFamily : 'Arial',
						fontSize : defaultFontSize + 6,
						fontWeight : 'bold'
					},
					left : 10,
					top : 10,
					width : 50,
					height : 50
				});
				row.add(countBox);

				var labelStationName = Ti.UI.createLabel({
					color : '#1d79a8', //dark blue
					font : {
						fontFamily : 'Arial',
						fontSize : defaultFontSize + 3,
						fontWeight : 'bold'
					},
					text : (Ti.Locale.currentLanguage === 'zh-Hant') || (Ti.Locale.currentLanguage === 'zh-Hans') ? data[i]['name_zh'] : data[i]['name_en'],
					left : 70,
					top : 6,
					width : 200,
					height : 30
				});
				row.add(labelStationName);

				var labelAddress = Ti.UI.createLabel({
					color : '#4d4d4f',
					font : {
						fontFamily : 'Arial',
						fontSize : defaultFontSize + 2,
						fontWeight : 'normal'
					},
					text : data[i]['address_zh'],
					//text : (Ti.Locale.currentLanguage === 'zh-Hant') || (Ti.Locale.currentLanguage === 'zh-Hanz') ? data[i]['address_zh'] : data[i]['address_en'],
					
					left : 70,
					top : 44,
					width : 360
				});
				row.add(labelAddress);

				bikes.push(row);
			}
			tableView.setData(bikes);
		}
	};

	self.add(toolbar);
	return self;
};

module.exports = ListWin;

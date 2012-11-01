//Master View Component Constructor
function ListWin() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createWindow({
		backgroundColor : 'red',
	});

	var gdata;
	//searchbar
	var searchbar = Titanium.UI.createSearchBar({
		showCancel : false,
		barColor : '#385292',
	});
	//table
	var tableView = Ti.UI.createTableView({
		//data : tableData
		top : '43px',
		search : searchbar,
		hideSearchOnSelection : true
	});
	self.add(tableView);

	//toolbar
	var refresh = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	var logo = Titanium.UI.createButton({
		image : '/images/header.png',
	});

	var switchwin = Titanium.UI.createButton({
		title : 'Map',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar = Titanium.UI.iOS.createToolbar({
		items : [refresh, flexSpace, logo, flexSpace, switchwin],
		top : 0,
		borderTop : false,
		borderBottom : true
	});

	//events/
	tableView.addEventListener('click', function(e) {
		Titanium.API.info(e);
		self.fireEvent('app:details', {
			data : gdata[e['index']]
		});

	});
	refresh.addEventListener('click', function(e) {
		self.fireEvent('app:refresh', {
			source : e.clicksource,
			data : e
		})
	});
	switchwin.addEventListener('click', function(e) {
		self.fireEvent('app:map', {
			source : e.clicksource,
			data : e
		});
	});

	//methods
	self.refreshTable = function(data) {
		if (Object.prototype.toString.apply(data) === '[object Array]') {
			var bikes = [];
			gdata = data;
			for (var i = 0; i < data.length; i++) {
				bikes.push({
					title : data[i]['title'],
					hasDetail : true
				});
			}
			tableView.setData(bikes);
		}
	};
	self.add(toolbar);
	return self;
};

module.exports = ListWin;

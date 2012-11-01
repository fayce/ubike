//Master View Component Constructor
function ListWin() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createWindow({
	});

	var gdata;
	//searchbar
	var searchbar = Titanium.UI.createSearchBar({
		showCancel : false,
		barColor: '#F0F0F0'
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

	
	//Create the toolbar
	var refresh = Titanium.UI.createImageView({
		image : '/images/reload.png'
	});

	var logo = Ti.UI.createImageView({
		image : '/images/logo.png',
	})

	var switchwin = Titanium.UI.createImageView({
		image : '/images/map.png'
	});

	flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	var toolbar = Titanium.UI.iOS.createToolbar({
		items : [refresh, flexSpace, logo, flexSpace, switchwin],
		top : 0,
		borderTop : false,
		borderBottom : false,
		barColor: '#F0F0F0'
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

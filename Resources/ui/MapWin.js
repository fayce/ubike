//Master View Component Constructor
function MapWin() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createWindow({
		backgroundColor : 'blue',
	});

	var gdata; //container for the data
	//Create the map view
	var mapView = Ti.Map.createView({
		mapType : Ti.Map.STANDARD_TYPE,
		region : {
			latitude : 25.046881,
			longitude : 121.545225,
			latitudeDelta : 0.05,
			longitudeDelta : 0.05
		},
		animate : true,
		regionFit : true,
		userLocation : true,
		//annotations : data
	});
	self.add(mapView);

	//Annotation creation methods
	self.createAnnotation = function(point) {
		//Titanium.API.info(point);
		var annotation = Ti.Map.createAnnotation({
			latitude : point["lat"],
			longitude : point["lng"],
			title : point["name_en"],
			subtitle : String.format("%s/%s", point["sus_bike"], point["tot_bike"]),
			pincolor : Titanium.Map.ANNOTATION_GREEN,
			animate : true,
			rightButton : Titanium.UI.iPhone.SystemButton.INFO_LIGHT,
			myid : point["id"]
		});
		//Titanium.API.info(annotation);
		return annotation;
	};

	self.refreshPins = function(data) {
		if (Object.prototype.toString.apply(data) === '[object Array]') {
			var bikes = [];
			gdata = data;
			for (var i = 0; i < data.length; i++) {
				bikes.push(self.createAnnotation(data[i]));
			}
			mapView.setAnnotations(bikes);
			//Here we should auto select the closest one to the user
			//mapView.selectAnnotation(mapView.annotations[i].title,true);
		}
	};

	//Create the toolbar
	var refresh = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.REFRESH
	});

	var logo = Titanium.UI.createButton({
		image : '/images/header.png',
	});

	var switchwin = Titanium.UI.createButton({
		title : 'List',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});

	//events/
	mapView.addEventListener('click', function(e) {
		//Titanium.API.info('need a bike bro?');
		if (e.clicksource == 'rightButton') {
			self.fireEvent('app:details', {
				data : gdata[e['index']]
			});
		}
	});
	
	refresh.addEventListener('click', function(e) {
		self.fireEvent('app:refresh', {
			source : e.clicksource,
			data : e
		})
	});
	switchwin.addEventListener('click', function(e) {
		self.fireEvent('app:list', {
			source : e.clicksource,
			data : e
		});
	});

	var toolbar = Titanium.UI.iOS.createToolbar({
		items : [refresh, flexSpace, logo, flexSpace, switchwin],
		top : 0,
		borderTop : false,
		borderBottom : true
	});

	self.add(toolbar);

	return self;
};

module.exports = MapWin;

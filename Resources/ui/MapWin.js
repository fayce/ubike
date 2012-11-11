//Master View Component Constructor
function MapWin() {
	//create object instance, parasitic subclass of Observable
	var self = Ti.UI.createWindow({
		backgroundColor : 'blue',
		title : 'test title'
	});

	var gdata;
	var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;
	self.hasroute = false;

	Ti.Geolocation.preferredProvider = "gps";
	Ti.Geolocation.purpose = "uBike request";
	//container for the data
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
	self.createPin = function(text, percent) {
		/* #b0c81c lime green
		* #4cbfde light blue
		* #dd3d2d red
		* #eead1d orange
		* */
		//Ti.API.info(percent);
		bgcolor = "";
		if (percent < 33) {
			bgcolor = "#b0c81c";
		} else if (percent > 33 && percent < 66) {
			bgcolor = "#eead1d";
		} else {
			bgcolor = "#dd3d2d";
		}

		var labelpin = Ti.UI.createLabel({
			//backgroundImage : '/images/pin.png',
			color : '#FFFFFF',
			backgroundColor : bgcolor,
			borderRadius : 6,
			text : text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : 'Arial',
				fontSize : 16
			},
			height : '30dip',
			width : '30dip',
			opacity : 0.9
		});

		return labelpin.toImage(null, true);
	};

	self.createAnnotation = function(point, pinblob) {
		//Titanium.API.info(point);
		var annotation = Ti.Map.createAnnotation({
			latitude : point["lat"],
			longitude : point["lng"],
			title : point["name_en"],
			subtitle : String.format("%s bikes", point["sus_bike"]),
			//pincolor : Titanium.Map.ANNOTATION_RED,
			image : pinblob,
			animate : false,
			rightButton : Titanium.UI.iPhone.SystemButton.INFO_LIGHT,
			//myid : point["id"]
		});
		return annotation;
	};

	self.refreshPins = function(data) {
		if (Object.prototype.toString.apply(data) === '[object Array]') {
			var bikes = [];
			gdata = data;
			for (var i = 0; i < data.length; i++) {

				pinblob = self.createPin(data[i]['sus_bike'], data[i]['percent']);
				bikes.push(self.createAnnotation(data[i], pinblob));
				//bikes.push(self.createAnnotation(data[i]));
			}

			mapView.setAnnotations(bikes);
			//Here we should auto select the closest one to the user
			//mapView.selectAnnotation(mapView.annotations[i].title,true);
		}
	};

	///////////////////////////// Location related functions ////////////////////////////////
	self.translateErrorCode = function(code) {
		if (code == null) {
			return null;
		}
		switch (code) {
			case Ti.Geolocation.ERROR_LOCATION_UNKNOWN:
				return "Location unknown";
			case Ti.Geolocation.ERROR_DENIED:
				return "Access denied";
			case Ti.Geolocation.ERROR_NETWORK:
				return "Network error";
			case Ti.Geolocation.ERROR_HEADING_FAILURE:
				return "Failure to detect heading";
			case Ti.Geolocation.ERROR_REGION_MONITORING_DENIED:
				return "Region monitoring access denied";
			case Ti.Geolocation.ERROR_REGION_MONITORING_FAILURE:
				return "Region monitoring access failure";
			case Ti.Geolocation.ERROR_REGION_MONITORING_DELAYED:
				return "Region monitoring setup delayed";
		}
	};

	self.clearRoute = function() {
		if (self.hasroute) {
			Ti.API.info('cleaning up route');
			mapView.removeRoute(self.route);
			self.hasroute = false;
		}
	};

	self.drawRoute = function(point) {
		self.clearRoute();
		//origin = point['lat'] + 0.27 + "," + (point['lng'] + 0.34);

		Ti.API.info("Getting current GPS coords");
		var lng, lat, acc, ts;
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: " + self.translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}

			lng = e.coords.longitude;
			lat = e.coords.latitude;
			acc = e.coords.accuracy;
			ts = e.coords.timestamp;

			Titanium.API.info('geo - current location: ' + new Date(ts) + ' long ' + lng + ' lat ' + lat + ' accuracy ' + acc);
			orig = lat + "," + lng;
			dest = point['lat'] + "," + point['lng'];
			//origin = self.getLocation();

			data = [];
			//var url = "http://maps.googleapis.com/maps/api/directions/xml?origin=25.046881,121.545225&destination=25.049881,121.555225&sensor=false"
			var url = "http://maps.googleapis.com/maps/api/directions/xml?origin=" + orig + "&destination=" + dest + "&sensor=false";
			xhr = Titanium.Network.createHTTPClient();
			xhr.open('GET', url);
			Ti.API.info('URL: ' + url);
			xhr.onload = function() {

				// Now parse the XML
				var xml = this.responseXML;

				// Find the steps in response
				var itemList = xml.documentElement.getElementsByTagName("start_location");
				Ti.API.info('found ' + itemList.length + ' items in the step xml');
				//Ti.API.info(itemlist);
				if (itemList.length) {
					for (var i = 0; i < itemList.length - 1; i++) {
						var item = itemList.item(i);

						data.push({
							latitude : item.getElementsByTagName("lat").item(0).text,
							longitude : item.getElementsByTagName("lng").item(0).text,
						});
					}
					//Ti.API.info(data);
					self.route = {
						color : '#4cbfde',
						name : 'testroute',
						points : data,
						width : 7,
					}
					mapView.addRoute(self.route);
					self.hasroute = true;
				} else {
					alert("can't draw route, please try again later");
				}
			};
			xhr.send();
		});

	}
	//Create the toolbar
	var refresh = Titanium.UI.createImageView({
		image : '/images/reload.png',
		left : 0
	});

	var logo = Ti.UI.createImageView({
		image : '/images/logo.png',
		height : '43dip'
	})

	var switchwin = Titanium.UI.createImageView({
		image : '/images/list.png',
		right : 0
	});

	flexSpace = Titanium.UI.createButton({
		systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
	var toolbar = Titanium.UI.iOS.createToolbar({
		items : [refresh, flexSpace, logo, flexSpace, switchwin],
		top : 0,
		borderTop : false,
		borderBottom : true,
		opacity : 0.9,
		borderBottomColor : '#D1D1D1',
		barColor : '#F0F0F0'
	});

	self.add(toolbar);

	//events/
	mapView.addEventListener('click', function(e) {
		//Titanium.API.info('need a bike bro?');
		//if (e.clicksource == 'pin') {
		Ti.API.info(e['index']);
		if (e.clicksource == 'rightButton') {
			self.fireEvent('app:details', {
				data : gdata[e['index']]
			});
		}
	});

	refresh.addEventListener('click', function(e) {
		self.fireEvent('app:refresh')
	});
	switchwin.addEventListener('click', function(e) {
		self.fireEvent('app:list');
	});

	return self;
};

module.exports = MapWin;

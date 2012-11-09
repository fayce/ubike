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
	self.createPin = function(text) {
		var labelpin = Ti.UI.createLabel({
			backgroundImage : '/images/pin.png',
			text : text,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
			font : {
				fontFamily : 'Arial',
				fontSize : 10,
				fontWeight : 'bold'
			},
			height : 30,
			width : 30,
		});

		return labelpin.toImage();
	};

	self.createAnnotation = function(point, pinblob) {
		//Titanium.API.info(point);
		var annotation = Ti.Map.createAnnotation({
			latitude : point["lat"],
			longitude : point["lng"],
			title : point["name_en"],
			//subtitle : String.format("%s/%s", point["sus_bike"], point["tot_bike"]),
			//pincolor : Titanium.Map.ANNOTATION_RED,
			image : pinblob,
			animate : false,
			rightButton : Titanium.UI.iPhone.SystemButton.INFO_LIGHT,
			//myid : point["id"]
		});
		//Titanium.API.info(annotation);
		return annotation;
	};

	self.refreshPins = function(data) {
		if (Object.prototype.toString.apply(data) === '[object Array]') {
			var bikes = [];
			gdata = data;
			for (var i = 0; i < data.length; i++) {
				pinblob = self.createPin(data[i]['sus_bike']);
				bikes.push(self.createAnnotation(data[i], pinblob));
				//bikes.push(self.createAnnotation(data[i]));
			}

			mapView.setAnnotations(bikes);
			//Here we should auto select the closest one to the user
			//mapView.selectAnnotation(mapView.annotations[i].title,true);
		}
	};
	self.getLocation = function() {
		Ti.Geolocation.purpose = "What's your location?";
		Titanium.Geolocation.getCurrentPosition(function(e) {
			var currentLocation = '';
			if (!e.success || e.error) {
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				alert('error ' + JSON.stringify(e.error));
				return;
			}

			var longitude = e.coords.longitude;
			var latitude = e.coords.latitude;

			//currentLocation.text = 'long:' + longitude + ' lat: ' + latitude;

			//Titanium.API.info('geo - current location: long: ' + longitude + ' lat: ' + latitude );

			return {
				lat : latitude,
				lng : longitude
			};
		});
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
		destination = point['lat'] + "," + point['lng'];
		//origin = self.getLocation();

		data = [];
		var url = "http://maps.googleapis.com/maps/api/directions/xml?origin=25.046881,121.545225&destination=25.049881,121.555225&sensor=false"
		//var url = "http://maps.googleapis.com/maps/api/directions/xml?origin=" + origin + "&destination=" + destination + "&sensor=true";
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
			for (var i = 0; i < itemList.length; i++) {
				var item = itemList.item(i);

				data.push({
					latitude : item.getElementsByTagName("lat").item(0).text,
					longitude : item.getElementsByTagName("lng").item(0).text,
				});
			}
			Ti.API.info(data);
			self.route = {
				color : 'blue',
				name : 'testroute',
				points : data,
				width : 7,
			}
			mapView.addRoute(self.route);
			self.hasroute = true;
		};
		xhr.send();

	}
	//Create the toolbar
	var refresh = Titanium.UI.createImageView({
		image : '/images/reload.png',
		left : 0
	});

	var logo = Ti.UI.createImageView({
		image : '/images/logo.png',
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
		if (e.clicksource == 'pin') {
		//if (e.clicksource == 'rightButton') {
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

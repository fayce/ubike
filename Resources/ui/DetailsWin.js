//Master View Component Constructor
function DetailsWin() {
	//create object instance, parasitic subclass of Observable
	var gdata;
	var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var self = Titanium.UI.createWindow({
		backgroundColor : '#F0F0F0',
		//borderWidth : 8,
		borderColor : '#999',
		height : 400,
		width : 300,
		borderRadius : 10,
		opacity : 0.95,
	});

	var close = Titanium.UI.createImageView({
		image : '/images/close.png',
		right : 10,
		top : 10,
	});

	self.add(close)

	var labelSus = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#E01B6A",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 50,
			fontWeight : 'bold'
		},
		left : 0,
		top : 150,
		width : '50%',
		height : 'auto'
	});
	var labelSusLegend = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#E01B6A",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : 'Available',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 5,
			fontWeight : 'bold'
		},
		left : 0,
		top : 210,
		width : '50%',
		height : 'auto'
	});

	var labelTot = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#1DDE37",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 50,
			fontWeight : 'bold'
		},
		right : 0,
		top : 150,
		width : '50%',
		height : 'auto'
	});
	var labelTotLegend = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#1DDE37",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : 'Total',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 5,
			fontWeight : 'bold'
		},
		right : 0,
		top : 210,
		width : '50%',
		height : 'auto'
	});

	var labelStation = Ti.UI.createLabel({
		color : '#A6A6A6',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 20,
			fontWeight : 'bold'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		top : 30,
		width : 'auto',
		height : 'auto',
	});

	var labelAddress = Ti.UI.createLabel({
		color : '#CCCCCC',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 10
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		top : 120,
		width : 'auto',
		height : 'auto',
	});

	var buttonRouteMe = Titanium.UI.createButton({
		title : 'Route Me !',
		top : 250,
		width : '50%',
		height : 50,
		borderRadius : 0,
	});

	self.add(labelStation);
	self.add(labelAddress);
	self.add(labelSus);
	self.add(labelTot);
	self.add(labelSusLegend);
	self.add(labelTotLegend);
	self.add(buttonRouteMe);
	//events
	close.addEventListener('click', function(e) {
		self.close();
	});

	buttonRouteMe.addEventListener('click', function(e) {
		//Titanium.API.info(gdata);
		self.fireEvent('app:routeme', {
			lat : parseFloat(gdata['lat']),
			lng : parseFloat(gdata['lng'])
		});

	});

	//methods
	self.fill = function(data) {
		gdata = data;
		labelStation.setText(gdata['name_zh']);
		labelAddress.setText(gdata['address_zh']);
		labelSus.setText(gdata['sus_bike']);
		labelTot.setText(gdata['tot_bike']);
		Ti.API.info(gdata);
	};

	return self;
};

module.exports = DetailsWin;

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
		opacity : 0.92,
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

	var labelStation = Ti.UI.createLabel({
		color : '#A6A6A6',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 30,
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
		//top : 30,
		width : 'auto',
		height : 'auto',
	});

	self.add(labelStation);
	self.add(labelAddress);
	self.add(labelSus);
	self.add(labelTot);

	//events
	close.addEventListener('click', function(e) {
		self.close();
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

//Master View Component Constructor
function DetailsWin() {
	//create object instance, parasitic subclass of Observable
	var gdata;
	var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;
	var t = Titanium.UI.create2DMatrix();
	t = t.scale(0);

	var self = Titanium.UI.createWindow({
		backgroundColor : '#F0F0F0',
		borderWidth : 1,
		borderColor : '#4d4d4f',
		height : 350,
		width : 300,
		borderRadius : 10,
		opacity : 0.95,
	});

	var close = Titanium.UI.createButton({
		right : 10,
		top : 10,
		backgroundImage : '/images/close_n.png',
		backgroundSelectedImage : '/images/close_p.png',
		width : '25dip',
		height : '25dip'

	});

	self.add(close)

	var labelSus = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#dd3d2d",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 50,
			fontWeight : 'bold'
		},
		left : 0,
		top : 170,
		width : '50%',
		height : 'auto'
	});
	var labelSusLegend = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#aa3023",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : 'Available',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 5,
			fontWeight : 'bold'
		},
		left : 0,
		top : 230,
		width : '50%',
		height : 'auto'
	});

	var labelTot = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#4cbfde",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 50,
			fontWeight : 'bold'
		},
		right : 0,
		top : 170,
		width : '50%',
		height : 'auto'
	});
	var labelTotLegend = Ti.UI.createLabel({
		color : '#FFFFFF',
		backgroundColor : "#3e97af",
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		text : 'Total',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 5,
			fontWeight : 'bold'
		},
		right : 0,
		top : 230,
		width : '50%',
		height : 'auto'
	});

	var labelStation_zh = Ti.UI.createLabel({
		color : '#b0c81c',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 17,
			fontWeight : 'bold'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		top : 35,
		width : 'auto',
		height : 'auto',
	});
	var labelStation_en = Ti.UI.createLabel({
		color : '#b0c81c',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize,
			fontWeight : 'bold'
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		top : 64,
		width : 'auto',
		height : 'auto',
	});

	var labelAddress = Ti.UI.createLabel({
		color : '#eead1d',
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize + 5
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		top : 100,
		width : 'auto',
		height : 'auto',
	});

/*
	var buttonRouteMe = Titanium.UI.createButton({
		title : "Route me",
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		font : {
			fontFamily : 'Arial',
			fontSize : defaultFontSize
		},
		backgroundImage : '/images/LetsGo.png',
		backgroundSelectedImage : '/images/LetsGo.png',
		//image : '/images/LetsGo.png',
		top : 270,
		width : '115dip',
		height : '33dip',
		//borderRadius : 0,
	});*/
	var buttonRouteMe = Titanium.UI.createButton({
		backgroundImage : '/images/map_p.png',
		backgroundSelectedImage : '/images/map_n.png',
		width : '30dip',
		height : '30dip',
		top : 280
	});


	self.add(labelStation_zh);
	self.add(labelStation_en);
	self.add(labelAddress);
	self.add(labelSus);
	self.add(labelTot);
	self.add(labelSusLegend);
	self.add(labelTotLegend);
	self.add(buttonRouteMe);
	//self.add(buttonClose);
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
		labelStation_zh.setText(gdata['name_zh']);
		labelStation_en.setText(gdata['name_en']);
		labelAddress.setText(gdata['address_zh']);
		labelSus.setText(gdata['sus_bike']);
		labelTot.setText(gdata['tot_bike']);
		Ti.API.info(gdata);
	};

	return self;
};

module.exports = DetailsWin;

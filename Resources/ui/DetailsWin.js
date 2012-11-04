//Master View Component Constructor
function DetailsWin() {
	//create object instance, parasitic subclass of Observable
	var gdata;

	var self = Ti.UI.createWindow({
		backgroundColor : 'white',
		exitOnClose : true,
		fullscreen : false,
		modal : true,
		layout : 'vertical',
		
	});

	var close = Titanium.UI.createButton({
		title : 'Close',
		style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
	});

	self.setLeftNavButton(close);

	var label1 = Ti.UI.createLabel({
		color : 'white',
		font : {
			fontSize : 48
		},
		textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
		top : 30,
		width : 'auto',
		height : 'auto',
		backgroundColor: "#E01B6A",
		borderRadius: "10"
	});

	var label2 = Ti.UI.createLabel({
		color : 'black',
		font : {
			fontSize : 48
		},

		//text : gdata['tot_bike'],
		//textAlign : Ti.UI.TEXT_ALIGNMENT_RIGHT,
		top : 30,
		width : 'auto',
		height : 'auto'
	});

	self.add(label1);
	//self.add(label2);

	//events

	close.addEventListener('click', function(e) {
		self.close();
	});
	
	//methods
	self.fill = function(data) {
		gdata = data;
		label1.setText(gdata['sus_bike']+'/'+gdata['tot_bike'])
		//label2.setText(gdata['tot_bike'])
		self.setTitle(gdata['title'])
		Ti.API.info(gdata);
	};

	return self;
};

module.exports = DetailsWin;

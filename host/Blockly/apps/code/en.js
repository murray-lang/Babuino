var MSG = {
	// Tooltips.
	trashTooltip: 'Discard all blocks',
	linkTooltip: 'Save and link to blocks',
	runTooltip: 'Program Babuino',
	openTooltip: 'Open blocks',
	saveTooltip: 'Save blocks',
	saveAsTooltip: 'Save blocks As...',
	// Toolbox categories.
	catControl: 'Control',
	catLogic: 'Logic',
	catMath: 'Math',
	catText: 'Text',
	catLists: 'Lists',
	catColour: 'Colour',
	catVariables: 'Variables',
	catProcedures: 'Procedures',
	catBabuino: 'Babuino',
	catMotor: 'Motor Control',
	catIO: 'Input/Output',
	catComms: 'Communications',
	// Misc text.
	blocks: 'Blocks',
	badXml: 'Error parsing XML:\n%1\n\nAbandon changes?',
	badCode: 'Program error:\n%1',
	timeout: 'Maximum execution iterations exceeded.',
	discard: 'Delete all "%1" blocks?',
	title: 'Code',
	serialPort: 'Serial port',
	noSerialPort: 'No serial ports found'
};
if ('BlocklyStorage' in window) {
	BlocklyStorage.HTTPREQUEST_ERROR = 'There was a problem with the request.\n';
	BlocklyStorage.LINK_ALERT = 'Share your blocks with this link:\n\n';
	BlocklyStorage.HASH_ERROR = 'Sorry, "%1" doesn\'t correspond with any saved Blockly file.';
	BlocklyStorage.XML_ERROR = 'Could not load your saved file.\n'+
	  'Perhaps it was created with a different version of Blockly?\nXML: ';
}
var frameSrc = ['en/_messages.js',
	'common/control.js',
	'common/logic.js',
	'common/math.js',
	'common/text.js',
	'common/lists.js',
	'common/colour.js',
	'common/variables.js',
	'common/procedures.js',
	'common/babuino.js'];
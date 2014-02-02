/**
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly code demo (language-neutral).
 * @author fraser@google.com (Neil Fraser)
 */
 
 var cricketComms = new CricketProgrammer("COM9", commsNormalCallback, commsErrorCallback);
 
(	function()
	{
		document.getElementById("code_body").innerHTML = codepage.start(
			{}, 
			null,
			{MSG: MSG, frameSrc: frameSrc.join('&')}
		);
		
			// Chrome packaged applications have very strict security policies
			// that disallow in line JavaScript. For example 
			// onclick="tabClick(this.id)" causes an error. the following code
			// is to replace instances of this with DOM manipulation.
		var tabs = document.getElementById("tabRow");
		var tabons = tabs.getElementsByClassName("tabon");
		for (var i = 0; i < tabons.length; i++)
		{
			tabons[i].onclick = 
				function ()
				{
					tabClick(this.id);
				};
		}
		var taboffs = tabs.getElementsByClassName("taboff");
		for (var i = 0; i < taboffs.length; i++)
		{
			taboffs[i].onclick = 
				function ()
				{
					tabClick(this.id);
				};
		}
		
			// Now add handlers for the buttons
		var openButtons = tabs.getElementsByClassName("open");
		openButtons[0].onclick = onClickOpen;
			
		var saveButtons = tabs.getElementsByClassName("save");
		saveButtons[0].onclick = onClickSave;
		
		var saveAsButtons = tabs.getElementsByClassName("saveas");
		saveAsButtons[0].onclick = onClickSaveAs;
			
		var trashButtons = tabs.getElementsByClassName("discard");
		trashButtons[0].onclick =
			function()
			{
				discard(); 
				renderContent();
			};
			
		var runButtons = tabs.getElementsByClassName("launch");
		runButtons[0].onclick = onClickLaunch;
		
		var portsList = document.getElementById("serialports");
		portsList.onchange = onSerialPortChange;
		
		chrome.serial.getPorts(populateSerialPortList);
	}
)();

function populateSerialPortList(availablePorts)
{
	var portsList = document.getElementById("serialports");
		// Clear the list
	while (portsList.length > 0)
		portsList.remove(0);
	
	if	(availablePorts.length == 0)
	{
		var option = document.createElement("option");
		option.text = MSG.noSerialPort;
		portsList.add(option);
		return;
	}
	
	for (var i = 0; i < availablePorts.length; i++)
	{
		var option = document.createElement("option");
		option.text = availablePorts[i];
		option.value = availablePorts[i];
		portsList.add(option);
	}
};

function onSerialPortChange()
{
	var portsList = document.getElementById("serialports");
	var selectedPort = portsList.options[portsList.selectedIndex].value;
	cricketComms.setDevice(selectedPort);
}

/*
document.write(
	codepage.start(
		{}, 
		null,
		{MSG: MSG, frameSrc: frameSrc.join('&')}
	)
);
*/
/**
 * List of tab names.
 * @private
 */
//var TABS_ = ["blocks", "javascript", "python", "logo", "basm", "out", "xml", "console"];
var TABS_ = ["blocks", "logo", "basm", "out", "xml", "console"];

var selected = "blocks";
var currentBlockFile = null;
var consoleTextarea = document.getElementById("textarea_console");

function logToConsole(msg)
{
	consoleTextarea.value += msg + "\n";
}

/**
 * Switch the visible pane when a tab is clicked.
 * @param {string} id ID of tab clicked.
 */
function tabClick(id) {
  // If the XML tab was open, save and render the content.
  
  if (document.getElementById('tab_xml').className == 'tabon') {
    var xmlTextarea = document.getElementById('textarea_xml');
    var xmlText = xmlTextarea.value;
    var xmlDom = null;
    try {
      xmlDom = Blockly.Xml.textToDom(xmlText);
    } catch (e) {
      var q =
          window.confirm(MSG.badXml.replace('%1', e));
      if (!q) {
        // Leave the user on the XML tab.
        return;
      }
    }
    if (xmlDom) {
      Blockly.mainWorkspace.clear();
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDom);
    }
  }
  
  // Deselect all tabs and hide all panes.
  for (var x in TABS_) {
    document.getElementById('tab_' + TABS_[x]).className = 'taboff';
    document.getElementById('content_' + TABS_[x]).style.display = 'none';
  }

  // Select the active tab.
  selected = id.replace('tab_', '');
  document.getElementById(id).className = "tabon";
  // Show the selected pane.
  var content = document.getElementById('content_' + selected);
  content.style.display = 'block';
  renderContent();
}

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
function renderContent() {
  var content = document.getElementById('content_' + selected);
  // Initialize the pane.
  if (content.id == 'content_blocks') {
    // If the workspace was changed by the XML tab, Firefox will have performed
    // an incomplete rendering due to Blockly being invisible.  Rerender.
    Blockly.mainWorkspace.renderBlocks();
  } 
  
  else if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('textarea_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  }
  
  /*
  else if (content.id == 'content_javascript') {
    content.innerHTML = Blockly.Generator.workspaceToCode('JavaScript');
  } else if (content.id == 'content_python') {
    content.innerHTML = Blockly.Generator.workspaceToCode('Python');
  } 
  */
  else if (content.id == 'content_logo') {
    //content.innerHTML = Blockly.Generator.workspaceToCode('Logo');
	var logoTextarea = document.getElementById('textarea_logo');
    logoTextarea.value = Blockly.Generator.workspaceToCode('Logo');
    logoTextarea.focus();
  }
  else if (content.id == 'content_basm') {
		// Get Logo code first
	var code = Blockly.Generator.workspaceToCode('Logo');
    //content.innerHTML = compileLogo(code);
	var basmTextarea = document.getElementById('textarea_basm');
	try
	{
		basmTextarea.value = compileLogo(code);
	}
	catch (err)
	{
		basmTextarea.value = err.message;
	}
	basmTextarea.focus();
  }
  else if (content.id == 'content_out') 
  {
		// Get Logo code first
	var code = Blockly.Generator.workspaceToCode('Logo');
	var outTextarea = document.getElementById('textarea_out');
		// Then compile it to assembly
	var basm;
	try
	{
		basm = compileLogo(code);
	}
	catch (logoerr)
	{
		outTextarea.value = logoerr.message;
		consoleTextarea.focus();
		return;
	}
		// then assemble to cricket codes
	try
	{
		var cricket = assembleBasm(basm);
		//content.innerHTML = cricket;
		outTextarea.value = cricket;
	}
	catch (basmerr)
	{
		outTextarea.value = basmerr.message;
	}
	outTextarea.focus();
  }
  else if (content.id == 'content_console') {
	var consoleTextarea = document.getElementById('textarea_console');
    consoleTextarea.focus();
  }
}

/**
 * Initialize Blockly.  Called on page load.
 * @param {!Blockly} blockly Instance of Blockly from iframe.
 */
function init(blockly) {
  window.Blockly = blockly;
  
  //window.BlocklyStorage = blocklyStorage; // Murray Lang

  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  // Removed because JavaScript code generation removed
  //Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  // Make the 'Blocks' tab line up with the toolbox.
  if (Blockly.Toolbox) {
    window.setTimeout(function() {
        document.getElementById('tab_blocks').style.minWidth =
            (Blockly.Toolbox.width - 38) + 'px';
            // Account for the 19 pixel margin and on each side.
    }, 1);
  }

  if ('BlocklyStorage' in window) {
    // An href with #key triggers an AJAX call to retrieve saved blocks.
    if (window.location.hash.length > 1) {
      BlocklyStorage.retrieveXml(window.location.hash.substring(1));
    } else {
      // Restore saved blocks in a separate thread so that subsequent
      // initialization is not affected from a failed load.
      window.setTimeout(BlocklyStorage.restoreBlocks, 0);
    }
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload();
  } else {
    document.getElementById('linkButton').className = 'disabled';
  }

  tabClick('tab_' + selected);
}

/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
/*
function runJS() {
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG.timeout;
    }
  };
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval(code);
  } catch (e) {
    alert(MSG.badCode.replace('%1', e));
  }
}
*/
/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  // To Do: Implement confirmation dialogs using goog.ui.prompt
  //if (count < 2 ||
  //    window.confirm(MSG.discard.replace('%1', count))) {
    Blockly.mainWorkspace.clear();
    window.location.hash = '';
  //}
}

function compileLogo(code)
{
	var bsm = "";
	var err = "";
	var output = 
		function (str)
		{
			bsm += str;
		};
	var errorOutput = 
		function (str)
		{
			err += str;
		};
	var bl = new BabuinoLogo();
	var err_count = bl.compile(code, output, errorOutput);
	if (err_count >0)
		throw new Error(err);
	return bsm;	
}

function assembleBasm(code)
{
	var cricket = "";
	var err = "";
	var output = 
		function (str)
		{
			cricket += str + "\n";
		};
	var errorOutput = 
		function (str)
		{
			err += str;
		};
	var err_count = as.parse(code, output, errorOutput);
	if (err_count >0)
		throw new Error(err);
	return cricket;	
}

function onOpenSuccess(blockFile)
{
	currentBlockFile = blockFile;
	var xml = Blockly.Xml.textToDom(blockFile.text);
	Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}

function onOpenFailure(msg)
{
}

function onClickOpen()
{
	var blockFile = new BlockFile();
	blockFile.open(onOpenSuccess, onOpenFailure);
}

function onSaveSuccess(blockFile)
{
	currentBlockFile = blockFile;
}

function onSaveFailure(msg)
{
	logToConsole(msg);
}

function onClickSave()
{
	if (currentBlockFile != null)
	{
		var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
		var text = Blockly.Xml.domToText(xml);
		currentBlockFile.save(text, onSaveSuccess, onSaveFailure);
	}
	else
	{
		onClickSaveAs();
	}
}

function onClickSaveAs()
{
	var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
	var text = Blockly.Xml.domToText(xml);
	var blockFile = new BlockFile();
	blockFile.saveAs(text, onSaveSuccess, onSaveFailure);
}

function commsNormalCallback(msg)
{
	logToConsole(msg);
}

function commsErrorCallback(msg)
{
	logToConsole(msg);
}

function onClickLaunch()
{
	tabClick("tab_console");
		// Get Logo code first
	var code = Blockly.Generator.workspaceToCode('Logo');
	
		// Then compile it to assembly
	var basm;
	try
	{
		basm = compileLogo(code);
	}
	catch (logoerr)
	{
		var consoleTextarea = document.getElementById('textarea_console');
		consoleTextarea.value = logoerr.message;
		consoleTextarea.focus();
		return;
	}
		// then assemble to cricket codes
	var cricket;
	try
	{
		cricket = assembleBasm(basm);
	}
	catch (basmerr)
	{
		var consoleTextarea = document.getElementById('textarea_console');
		consoleTextarea.value = basmerr.message;
		consoleTextarea.focus();
		return;
	}
	cricketComms.setData(cricket);
	cricketComms.run();
}


function BlockFile()
{
	this.fileEntry     = null;
	this.openCallback  = null;
	this.saveCallback  = null;
	this.errorCallback = null;
	this.fullPath      = null;
	this.text          = null;
}

BlockFile.prototype.open =
	function (openCallback, errorCallback)
	{
		this.openCallback  = openCallback;
		this.errorCallback = errorCallback;
		
		chrome.fileSystem.chooseEntry({ type: 'openWritableFile' }, this.onOpen.bind(this));
	};

BlockFile.prototype.onOpen =
	function (fileEntry)
	{
		this.fileEntry = fileEntry;
		this.read();
	};

BlockFile.prototype.onLoad =
	function(e)
	{
		this.fullPath = this.fileEntry.fullPath;
		this.text = e.target.result;
		this.openCallback(this);
	};

BlockFile.prototype.onReadError =
	function(e)
	{
		this.errorCallback("Read failed: " + e.toString());
	};

BlockFile.prototype.file =
	function (f)
	{
		var fileReader = new FileReader();
		fileReader.onload = this.onLoad.bind(this);
		fileReader.onerror = this.onReadError.bind(this);
		fileReader.readAsText(f);
	};
	
BlockFile.prototype.read =
	function ()
	{
		if (this.fileEntry !== undefined)
		{
			this.fileEntry.file(this.file.bind(this), this.errorHandler.bind(this));
		}
		else
		{
			this.errorCallback("Internal error: Invalid file entry!");
		}
	};

BlockFile.prototype.onSave =
	function (fileEntry)
	{
		this.fileEntry = fileEntry;
		this.write();
	};
	
BlockFile.prototype.save =
	function (text, saveCallback, errorCallback)
	{
		if (this.fileEntry == null || this.fileEntry === undefined)
		{
			this.saveAs(text, saveCallback, errorCallback);
			return;
		}
		this.text = text;
		this.saveCallback  = saveCallback;
		this.errorCallback = errorCallback;
		this.write();
	};

BlockFile.prototype.saveAs =
	function (text, saveCallback, errorCallback)
	{
		this.text = text;
		this.saveCallback  = saveCallback;
		this.errorCallback = errorCallback;
		chrome.fileSystem.chooseEntry({ type: 'saveFile' }, this.onSave.bind(this));
	};

BlockFile.prototype.onWriteEnd =
	function (e)
	{
		this.fullPath = this.fileEntry.fullPath;
		this.saveCallback(this);
	};	

BlockFile.prototype.onWriteError = 
	function (e)
	{
		this.errorCallback("Write failed: " + e.toString());
	};

BlockFile.prototype.writer =
	function (fileWriter)
	{
		fileWriter.onerror = this.onWriteError.bind(this);
		var blob = new Blob([this.text], {type : 'text/html'});
		//fileWriter.truncate(0);
		//fileWriter.truncate(blob.size);
		fileWriter.onwriteend = this.onWriteEnd.bind(this);
		fileWriter.write(blob);
	};
	
BlockFile.prototype.write =
	function ()
	{
		this.fileEntry.createWriter(this.writer.bind(this), this.errorHandler.bind(this)); 
	};	
	
BlockFile.prototype.errorHandler =
	function (e)
	{
		var msg = asErrorString(e);
		if (this.errorCallback)
			this.errorCallback(msg);
	};	
	
function errorString(e) 
{
	switch (e.code) 
	{
	case FileError.QUOTA_EXCEEDED_ERR:
		return "QUOTA_EXCEEDED_ERR";
	case FileError.NOT_FOUND_ERR:
		return "NOT_FOUND_ERR";
	case FileError.SECURITY_ERR:
		return "SECURITY_ERR";
	case FileError.INVALID_MODIFICATION_ERR:
		return "INVALID_MODIFICATION_ERR";
	case FileError.INVALID_STATE_ERR:
		return "INVALID_STATE_ERR";
	};
	return "Unknown Error";
}

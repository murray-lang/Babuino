chrome.app.runtime.onLaunched.addListener(
	function() 
	{
		chrome.app.window.create(
			'apps/code/en.html', 
			{
				bounds: 
				{
					width: 1000,
					height: 800
				}
			}
		);
	}
);

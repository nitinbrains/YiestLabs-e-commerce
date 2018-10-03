'use strict';

import ErrorMod from './Error';

var State = (function()
{
	/*********************
	 * Structure Methods *
	 *********************/
	var mainCache = {};

	function getState(keyword)
	{
		if(keyword instanceof Array)
		{
			var response = [];
			for(var i = 0; i < keyword.length; i++)
			{
				try
				{
					if(mainCache[keyword[i]])
					{
						response.push(mainCache[keyword[i]]);
					}
					else
					{
						response.push(null);
					}
				}
				catch(err)
				{
					response.push(null);
				}
			}
			return response;
		}
		else if(typeof(keyword) == "string")
		{
			if(mainCache[keyword] != null)
			{
				return mainCache[keyword];
			}
			else
			{
				return null;
			}
		}
		else
		{
			throw {message: "invalid type must be string or array of strings", code: -1};
		}
	}

	function setState(keyValue, cb=null)
	{
		if(keyValue instanceof Object)
		{
			try
			{
				var keys = Object.keys(keyValue);
				for(var i = 0; i < keys.length; i++)
				{
					mainCache[keys[i]] = keyValue[keys[i]];
				}

				if(cb && typeof cb == 'function')
				{
					cb();
				}
			}
			catch(err)
			{
				throw err;
			}
		}
		else
		{
			throw {message: "invalid type must be object", code: -1}
		}
	}

	return {
		getState: getState,
		setState: setState,
	}

})();

export default State;
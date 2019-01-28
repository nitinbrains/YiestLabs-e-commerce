'use strict';

const SalesLib = require('./SalesLib');

var Utils = (function()
{
	function round(value, step) {
	    step || (step = 1.0);
	    var inv = 1.0 / step;
	    return Math.round(value * inv) / inv;
	}

	function passwordChecker(password)
	{
		if(password.length < 6)
		{
			throw { message: 'Password must be at least 6 characters long', code: 0};
		}
	}


	function sendEmail(data)
	{
		try
		{
			const { to, subject, body } = data;
			Communications.email(to, null, null, subject, body);
		}
		catch(error)
		{
			throw error;
		}

	}

	function callPhone(phoneNumber)
	{
		try
		{
			Communications.phonecall(phoneNumber, true);
		}
		catch(error)
		{
			throw error;
		}
	}

	function stripChars(v) //used to remove non numbers from a phone number
	{
		try
		{
			var result = "";
			for (var i = 0; i < v.length; i++)
			{
				if(!isNaN(parseInt(v[i])))
				{
					result += v[i];
				}
			}
			return result;
		}
		catch(error)
		{
			throw error;
		}
	}

	function ValidateEmail(v)
	{
		try
		{
			if (v == null || v.length == 0) return false;
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(v);
		}
		catch(error)
		{
			throw error;
		}
	}

	function nextInterval(num)
	{

		return num*(num+1)/2;
	}

	function getRandomInt(min, max)
	{

		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomFloat(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	// Finds a float in the specified interval for that try
	function getWaitTime(tries)
	{
		// tries:		   1		 2			   3		         4
		// interval:	(1, 2)   (3, 4, 5)   (6, 7, 8, 9)   (10, 11, 12, 13, 14)

		let min = nextInterval(tries);
		let max = min + tries;
		return getRandomFloat(min, max);
	}

	function daysBetween(date1, date2)
	{

		var one_day=1000*60*60*24;
		var date1_ms = date1.getTime();
		var date2_ms = date2.getTime();
		var difference_ms = date2_ms - date1_ms;
		return Math.round(difference_ms/one_day);
	}

	function compareDates(date1, date2)
	{

		date1 = new Date(date1);
		date2 = new Date(date2);

		try
		{
			if(date1.getFullYear() != date2.getFullYear())
			{
		        if(date1.getFullYear() < date2.getFullYear())
				{
		            return 1;
		        }
				else
				{
		            return -1;
		        }
		    }
			else if(date1.getMonth() != date2.getMonth())
			{
		        if(date1.getMonth() < date2.getMonth())
				{
		            return 1;
		        }
				else
				{
		            return -1;
		        }
		    }
			else if(date1.getDate() != date2.getDate())
			{
		        if(date1.getDate() < date2.getDate())
				{
		            return 1;
		        }
				else
				{
		            return -1;
		        }
		    }

		    return 0;
		}
		catch(error)
		{
			throw error;
		}
	}

	function checkAllEqual(dates)
	{
		try
		{
			if(dates.length <= 1)
			{
		        return true;
		    }

		    var currentDay = dates[0];

		    for(var i = 1; i < dates.length; i++)
			{
		        if(compareDates(currentDay, dates[i]) != 0)
				{
		            return false;
		        }
		    }

		    return true;
		}
		catch(error)
		{
			throw error;
		}
	}

	function findMaxDateIndex(dates)
	{
		try
		{
			var max = new Date();
		    var index = 0;

		    for(var i = 0; i < dates.length; i++)
		    {
		        if(compareDates(dates[i], max) == -1)
		        {
		            max = dates[i];
		            index = i;
		        }
		    }

		    return index;
		}
		catch(error)
		{
			throw error;
		}
	}


	function getCardType(cardNumber)
	{
		try
		{
			for(var i = 0; i < SalesLib.CCTYPE_MAP.length; i++)
			{
				var startPrefix = 0, endPrefix = 0;
				var tokenPos = SalesLib.CCTYPE_MAP[i].Prefix.indexOf('-');
				if(tokenPos > 0)
				{
					startPrefix = parseInt(SalesLib.CCTYPE_MAP[i].Prefix);
					endPrefix = parseInt(SalesLib.CCTYPE_MAP[i].Prefix.substring(tokenPos+1, SalesLib.CCTYPE_MAP[i].Prefix.length));
					for(;startPrefix <= endPrefix; startPrefix++)
					{
						if(cardNumber.indexOf(startPrefix) == 0)
						{
							return SalesLib.CCTYPE_MAP[i].TypeID;
						}
					}
				}
				else
				{
					if(cardNumber.indexOf(SalesLib.CCTYPE_MAP[i].Prefix) == 0)
					{
						return SalesLib.CCTYPE_MAP[i].TypeID;
					}
				}
			}
			throw {message: 'Credit Card type could not be inferred', code: -1};
		}
		catch(error)
		{
			throw error;
		}
	}

	function currencyLookup(currency)
	{
		try
		{
			var currency = SalesLib.CURRENCY_MAP.find(x => x.id == currency);
			if(!currency)
			{
				throw {message: 'Invalid Currency', code: -1};
			}
			else
			{
				return currency.symbol;
			}
		}
		catch(error)
		{
			throw error;
		}
	}

	function formatDate(value)
	{
		try
		{
			value = new Date(value);
	  		return dayOfWeek(value.getDay()) + " " + (value.getMonth() + 1) + "/" +  value.getDate() +"/" +  value.getFullYear();
		}
		catch(error)
		{
			throw error;
		}

	}

function checkHoliday(date, subsidiary)
	{
	    var HOLIDAYS;
	    if(subsidiary == 7)
	    {
	        HOLIDAYS = SalesLib.CPHHOLIDAYS;
	    }
	    else if(subsidiary == 5)
	    {
	        HOLIDAYS = SalesLib.HKHOLIDAYS;
	    }
	    else
	    {
	        HOLIDAYS = SalesLib.USHOLIDAYS;
	    }

	    var dateToCheck = new Date(date);

	    if((dateToCheck.getDay() < 1 || dateToCheck.getDay() > 3 ) && subsidiary != 2)
	    {
	        return true
	    }
	    else
	    {
	        for (var i = HOLIDAYS.length - 1; i >= 0; i--)
	        {
	            if(HOLIDAYS[i].month - 1 == dateToCheck.getMonth())
	            {

	                if(HOLIDAYS[i].day == -1)
	                {
	                    //using day of week
	                    if(HOLIDAYS[i].dayofweek == dateToCheck.getDay())
	                    {
	                        if(HOLIDAYS[i].week < 0)
	                        {
	                            //counting to end
	                            var nextMonth = HOLIDAYS[i].month % 12;
	                            var testDate = new Date(dateToCheck);
	                            testDate.setDate(testDate.getDate() - (HOLIDAYS[i].week * 7));
	                            if(testDate.getMonth() == nextMonth)
	                            {
	                                return true;
	                            }
	                        }
	                        else
	                        {
	                            //counting from start
	                            var prevMonth = (HOLIDAYS[i].month - 2) % 12;
	                            var testDate = new Date(dateToCheck);
	                            var testDate2= new Date(dateToCheck);
	                            testDate.setDate(testDate.getDate() - (HOLIDAYS[i].week * 7));
	                            testDate2.setDate(testDate2.getDate() - ((HOLIDAYS[i].week-1) * 7));
	                            if(testDate.getMonth() == prevMonth && testDate2.getMonth() == prevMonth+1)
	                            {
	                                return true;
	                            }
	                        }
	                    }

	                }
	                else
	                {
	                    //using date
	                    if(HOLIDAYS[i].day == dateToCheck.getDate())
	                    {
	                        return true;
	                    }
	                }
	            }
	        }
	    }

	    return false;
	}


	function getDateRange(startDate)
	{
		try
		{
			var endDate = new Date(startDate);
			var offset = 2;

			endDate.setDate(startDate.getDate() + offset);

			// Saturday - set to Monday
			if(endDate.getDay() == 6)
			{
				endDate.setDate(endDate.getDate() + 2);
			}
			// Sunday - set to Monday
			else if(endDate.getDay() == 0)
			{
				endDate.setDate(endDate.getDate() + 1);
			}

			return endDate;
		}
		catch(error)
		{
			throw error;
		}
	}

	function dayOfWeek(day)
	{
		try
		{
			return SalesLib.DAYOFWEEK[day];
		}
		catch(error)
		{
			throw error;
		}
	}

	function showErrorToUser(error)
	{
		if(error.code != undefined && parseInt(error.code) == 0)
		{
			return true;
		}
		return false;
	}

	function uuid()
	{
		try
		{
			var uuid = "", i, random;
			for (i = 0; i < 32; i++)
			{
			    random = Math.random() * 16 | 0;

			    if(i == 8 || i == 12 || i == 16 || i == 20)
			    {
			      	uuid += "-"
			    }
			    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
			}
			return uuid;
		}
		catch(error)
		{
			throw error;
		}

	}

	function parseError(error)
	{
		try
		{
			if(error.message)
			{
				return JSON.stringify(error);
			}
			else
			{
				return error.toString();
			}
		}
		catch(error)
		{
			throw error;
		}
	}

	function getExpirationDates()
	{
		var today = new Date();

		var getExpirationDates = [
			{year: today.getFullYear().toString()},
			{year: (today.getFullYear() + 1).toString()},
			{year: (today.getFullYear() + 2).toString()},
			{year: (today.getFullYear() + 3).toString()},
			{year: (today.getFullYear() + 4).toString()},
			{year: (today.getFullYear() + 5).toString()},
			{year: (today.getFullYear() + 6).toString()},
			{year: (today.getFullYear() + 7).toString()},
			{year: (today.getFullYear() + 8).toString()},
			{year: (today.getFullYear() + 9).toString()},
			{year: (today.getFullYear() + 10).toString()}
		];

		return getExpirationDates;
	}

	/*
	 * Get default card or first card on user information
	 */
	function getDefaultCard(UserInfo)
	{
        if(UserInfo.cards.length > 0)
        {
            var defaultCard = UserInfo.cards.find(c => c.default);
            if(defaultCard)
            {
            	return defaultCard;
            }
            else
            {
                return UserInfo.cards[0];
            }
        }
        return null;
	}

	return {
		round,
		passwordChecker,
		sendEmail,
		callPhone,
		stripChars,
		ValidateEmail,
		compareDates,
		checkAllEqual,
		findMaxDateIndex,
		getCardType,
		currencyLookup,
		checkHoliday,
		daysBetween,
		formatDate,
		getDateRange,
		dayOfWeek,
		
		getWaitTime,
		showErrorToUser,
		uuid,
		parseError,
		getExpirationDates,
		getDefaultCard
	}

})();

module.exports = Utils;

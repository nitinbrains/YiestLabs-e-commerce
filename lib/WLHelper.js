'use strict';

import { parse } from 'url';

const SalesLib = require('./SalesLib');
const Utils = require('./Utils');
const CryptoJS = require('./CryptoJS');
const _isEmpty = require('lodash/isEmpty')

var WLHelper = (function ()
{
	function getIcon(salesCategory) {
		try {
			return SalesLib.CATEGORIES[parseInt(salesCategory)].icon;
		}
		catch(error) {
			console.log(error);
			throw error;
		}
	}

	function getColor(salesCategory) {
		try {
			return SalesLib.CATEGORIES[parseInt(salesCategory)].color;
		}
		catch(error) {
			console.log(error);
			throw error;
		}
	}

	function getImage(salesCategory) {
		try {
			return SalesLib.CATEGORIES[parseInt(salesCategory)].img;
		}
		catch(error) {
			console.log(error);
			throw error;
		}
	}

	function generateCreditToken(card)
	{
		try
		{
			card.type = Utils.getCardType(card.ccnumber);

			return CryptoJS.AES.encrypt(JSON.stringify(card), 'AWJeBmcD9uEy27L2Zla0ZKTKUbgjRJKwxr6CaKBqKDNbHSKsISC6BH2EhUvNm9s', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: "A216T8JtJANg7F7C" }).toString();
		}
		catch(error)
		{
			throw error;
		}
	}

	function getWarehouse(Warehouse)
	{
		switch(Warehouse)
		{
			case 9:
				return 'San Diego';
			case 11:
				return 'Asheville';
			case 30:
				return 'Copenhagen';
			case 31:
				return 'Hong Kong';
			default:
				console.log('checkout', 'error in warehouseSelection', "Warehouse choice: " + Warehouse, true);
				return 'Error!';
		}
	}

	function getPaymentTerm(term)
	{
		switch(term)
		{
			case '1':
			case 1:
				return "Net15";
			case '2':
			case 2:
				return "Net30";
			case '3':
			case 3:
				return "Pay on Pickup";
			case '7':
			case 7:
				return "C.O.D";
			case '10':
			case 10:
				return "Credit Card";
			case '11':
			case 11:
				return "Wire Transfer to WL";
			case '12':
			case 12:
				return "Prepay";
            case '13':
            case 13:
                return "Bank Transfer";
            case '14':
            case 14:
                return "PayPal";
			default:
				return "None";
		}
	}

	function getSubsidiaryLabel(id)
    {
        switch(parseInt(id))
        {
			case -2:
				return "Create WL USA Account";
			case -5:
				return "Create WL Hong Kong Account";
			case -7:
				return "Create WL Copenhagen Account";
            case 2:
                return 'WL USA';
            case 5:
                return 'WL Hong Kong';
            case 7:
                return 'WL Copenhagen';
            default:
                return "Error! Invalid Id";
        }
	}

	function shipMethodGroup(subsidiary, defaultShipMethodID, shipCountryCode) //retrieves ship method choices for user
	{
		try
		{
			var USinternational;

			if(subsidiary == 7)
		    {
		        USinternational = shipCountryCode != 'DK';
		    }
		    else if(subsidiary == 5 && shipCountryCode == 'CN')
		    {
		        return [SalesLib.SHIPMETHOD_MAP[29]];
		    }
		    else if(subsidiary == 5)
		    {
		    	USinternational = shipCountryCode != 'HK';
		    }
		    else
		    {
		        USinternational = shipCountryCode != 'US';
		    }

			var result = [];
			for(var i = 0; i < SalesLib.SHIPMETHOD_MAP.length; i++)
			{
				if(subsidiary == SalesLib.SHIPMETHOD_MAP[i].SubsidiaryID)
				{
					try
					{
						if((USinternational && SalesLib.SHIPMETHOD_MAP[i].USinternational) || (!USinternational && SalesLib.SHIPMETHOD_MAP[i].CustomerVisible) || parseInt(defaultShipMethodID) == SalesLib.SHIPMETHOD_MAP[i].NSID)
						{
							result.push(SalesLib.SHIPMETHOD_MAP[i]);
						}
					}
					catch(error)
					{
						if(SalesLib.SHIPMETHOD_MAP[i].CustomerVisible)
						{
							result.push(SalesLib.SHIPMETHOD_MAP[i]);
						}
					}

				}
			}
			return result;
		}
		catch(error)
		{
			throw error;
		}
	}

	function shipMethodNameFromId(Id)
	{
		try
		{
			var shipMethodEntry = SalesLib.SHIPMETHOD_MAP.find(x => x.NSID == Id);
			if(shipMethodEntry)
			{
				return shipMethodEntry.Name;
			}
			else
			{
				throw {message: 'INVALID NSID FOR SHIP METHOD!', code: -1};
			}
		}
		catch(error)
		{
			throw error;
		}
	}

	function validateZipCode(CountryCode, ZipCode)
	{
		try
		{
			var countryEntry = SalesLib.COUNTRY_MAP.find(x => x.CountryCode == CountryCode);
			if(countryEntry)
			{
				if(countryEntry.Regex)
				{
					if(ZipCode)
					{
						try
						{
							var zipStr = ZipCode.toString();
							if(zipStr.length == 0)
							{
								return false;
							}
							else if(countryEntry.Regex.exec(zipStr))
							{
								return true;
							}
							else
							{
								return false;
							}
						}
						catch(error)
						{
							return false;
						}
					}
					else
					{
						return false;
					}
				}
				else
				{
					return true;
				}
			}
			else
			{
				return false;
			}
		}
		catch(error)
		{
			throw error;
		}
	}

	/*
	* checkHoliday()
	*
	* Summary: checks against holidays defined in SalesLib.js
	*/
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

	function warehouseMatch(warehouses, subsidiary)
	{
		try
		{
			var test = 0;

			switch(parseInt(subsidiary))
			{
				case 2: //USA
					test = 9; // ASH - 11
					break;
				case 5: //CPH
					test = 31;
					break;
				case 7: //HK
					test = 30;
					break;
			}

			try
			{
				if(warehouses.length > 0)
				{
					if(warehouses.indexOf(test) > -1)
					{
						return true;
					}
					else if(subsidiary == 2 && warehouses.indexOf(11) > -1)
					{
						return true;
					}
				}
				return false;
			}
			catch(error)
			{
				return parseInt(warehouses) == test;
			}
		}
		catch(error)
		{
			throw error;
		}
	}
	
	return {
		getColor,
		getIcon,
		getImage,
		generateCreditToken,
		getWarehouse,
		getPaymentTerm,
		getSubsidiaryLabel,
		shipMethodGroup,
		shipMethodNameFromId,
		validateZipCode,
		checkHoliday,
		warehouseMatch,
	}

})();

export default WLHelper;

function versionUpToDate(clientVersion)
{

	const serverVersion = "2.3.7";

	if(clientVersion)
	{
		return clientVersion >= serverVersion;
	}
	else
	{
		return serverVersion;
	}
}

function AES(encrypt, key, value)
{
	if(encrypt)
	{
		return CryptoJS.AES.encrypt(value, key);
	}
	else
	{
		return CryptoJS.AES.decrypt(value, key);
	}
}

function ReceiveMessage(input)
{
	return JSON.parse(CryptoJS.AES.decrypt(input.data, '5TVDpAHPqLZSNY7EuLWJWDhLVaGBi862qlNp48ULcgaR6oDDH2hCLKdY92MA0pG', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: "ocbEMVHyax6MTNxD" }).toString(CryptoJS.enc.Utf8));
}

function SendMessage(input)
{
	var message = {data: CryptoJS.AES.encrypt(JSON.stringify(input), 'DHA5ZsROSYuY1jJXxOcHS4dKNODjgzJPnsMFIEumUpOizL6dj9GnU8QC2Ctd2x8', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: "8vr5BxmawvE5mZo7" }).toString()};
	return message;
}

function decryptCard(cardToken)
{
	if(!cardToken)
	{
		throw {message: 'no card provided', code: -1};
	}

	try
	{
		return JSON.parse(CryptoJS.AES.decrypt(cardToken, 'AWJeBmcD9uEy27L2Zla0ZKTKUbgjRJKwxr6CaKBqKDNbHSKsISC6BH2EhUvNm9s', { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: "A216T8JtJANg7F7C" }).toString(CryptoJS.enc.Utf8));
	}
	catch(err)
	{
		throw {message: 'couldn\'t decrypt card', code: -1};
	}
}

function getTermsFromSub(subsidiaryID)
{
	switch(subsidiaryID)
	{
		// US, CPH
		case 2:
        case 7:
			return 10; // Credit Card

		// HK
		case 5:
			return 13; // Bank Transfer
	}
}

function getCurrencyFromSub(subsidiaryID, cphDomestic)
{
	switch(subsidiaryID)
	{
		// US
		case 2:
			return 1; // Dollar

		// HK
		case 5:
			return 5; // HK Dollar

		// CPH
		case 7:
			if(cphDomestic)
			{
				return 6; // DKK
			}
			else
			{
				return 4; // EUR
			}
	}
}

function getShipMethodFromSub(subsidiaryID, cphDomestic)
{
	switch(subsidiaryID)
	{
		// US
		case 2:
			return '2787'; // Fedex Priority Overnight

		// HK
		case 5:
			return '13301'; // Will Call

		//CPH
		case 7:
			if(cphDomestic)
			{
				return '13299'; // CPH Domestic
			}
			else
			{
				return '13300'; // CPH Non-Domestic
			}
	}
}

function warehouseMap(subsidiaryID)
{
    switch(subsidiaryID)
    {
		// US
        case 2:
            return '9'; // San Diego

		// HK
        case 5:
            return '31';

		// CPH
        case 7:
            return '30';

        default:
            return '9';
    }
}

function taxCodeLookup(countryID)
{
	var EUCountries = "ATBEBGHRCZEEFIFRDEGRHUIEITLVLTLUMTNLPLPTROSKSIESSEGB";
	if(countryID == "DK")
	{
		return 13322;
	}
	else if(EUCountries.indexOf(countryID) % 2 == 0)
	{
		return 13324;
	}
	else
	{
		return 13323;
	}
}

function priceLevelDetermination(category)
{
    if(category == 2) //retailer customer
    {
        return 7; //retailer price level
    }
    else
    {
        return 1; //msrp
    }
}

const USHOLIDAYS = [{day: 1, month: 1}, //new years day
				 {day: 25, month: 12}, //christmas
				 {day: 4, month: 7}, //4th of july
				 {day: -1, month: 5, week: -1, dayofweek: 1 }, //memorial day
				 {day: -1, month: 11, week: 4, dayofweek: 4}, //thanksgiving
				 {day: -1, month: 9, week: 1, dayofweek: 1}]; //labor day

const HKHOLIDAYS = [{day: 30, month: 3},
					{day: 31, month: 3},
					{day: 2, month: 4},
					{day: 5, month: 4}];

const CPHHOLIDAYS = [{day: 1, month: 1},
					{day: 29, month: 3},
					{day: 30, month: 3},
					{day: 2, month: 4},
					{day: 27, month: 4},
					{day: 10, month: 5},
					{day: 21, month: 5},
					{day: 24, month: 12},
					{day: 25, month: 12},
					{day: 26, month: 12}];

/*
* checkHoliday()
*
* Summary: checks against holidays defined at the top of SalesIntegration.js
*/
function checkHoliday(date, subsidiary)
{
    var HOLIDAYS;
    if(subsidiary == 7)
    {
        HOLIDAYS = CPHHOLIDAYS;
    }
    else if(subsidiary == 5)
    {
        HOLIDAYS = HKHOLIDAYS;
    }
    else
    {
        HOLIDAYS = USHOLIDAYS;
    }

    var dateToCheck = new Date(date);

    if((dateToCheck.getDay() < 1 || dateToCheck.getDay() > 3 ) && subsidiary != 2)
    {
        return false
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
                                return false;
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
                                return false;
                            }
                        }
                    }

                }
                else
                {
                    //using date
                    if(HOLIDAYS[i].day == dateToCheck.getDate())
                    {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function valiDate(date, isPurepitch, subsidiary, addTravelTime, travelOnMonday, isAsheville)
{
    var finalDate = new Date(date);
    var today = getLocalTime(subsidiary, isAsheville);

    if((today.getHours() > 14 && subsidiary == 2) || (today.getHours() > 12 && subsidiary != 2))
    {
        today.setDate(today.getDate() + 2);
    }
    else
    {
        today.setDate(today.getDate() + 1);
    }

    if(compareDates(today, finalDate) == -1)
    {
        finalDate = new Date(today);
    }

    if(addTravelTime)
    {
        if(travelOnMonday)
        {
            if(finalDate.getDay() == 1)
            {
                finalDate.setDate(finalDate.getDate() + 7);
            }
            else if(finalDate.getDay() == 0)
            {
                finalDate.setDate(finalDate.getDate() + 8);
            }
            else
            {
                finalDate.setDate(finalDate.getDate() + (8 - finalDate.getDay() ) + 7);
            }
        }
        else
        {
            if(finalDate.getDay() == 5)
            {
                finalDate.setDate(finalDate.getDate() + 7);
            }
            else if(finalDate.getDay() == 6)
            {
                finalDate.setDate(finalDate.getDate() + 13);
            }
            else
            {
                finalDate.setDate(finalDate.getDate() + (5 - finalDate.getDay()) + 7);
            }
        }
    }

    if(finalDate.getDay() == 0)
    {
        finalDate.setDate(finalDate.getDate() + 1);
    }
    else if(finalDate.getDay() == 6)
    {
        finalDate.setDate(finalDate.getDate() + 2);
    }

    if(!isPurepitch)
    {
        if(checkHoliday(finalDate, subsidiary))
        {
            finalDate.setDate(finalDate.getDate()+1);
        }
        else
        {
            finalDate.setDate(finalDate.getDate()+2);
        }
    }

    if(finalDate.getDay() == 0)
    {
        finalDate.setDate(finalDate.getDate() + 1);
    }
    else if(finalDate.getDay() == 6)
    {
        finalDate.setDate(finalDate.getDate() + 2);
    }

    if(checkHoliday(finalDate, subsidiary))
    {
        if(subsidiary == 5)
        {
            if(finalDate.getDay() == 5)
            {
                finalDate.setDate(finalDate.getDate()+3);
            }
            else
            {
                finalDate.setDate(finalDate.getDate()+1);
            }
        }

        return new Date(finalDate);
    }
    else
    {
        return valiDate(finalDate.setDate(finalDate.getDate()+1), isPurepitch, subsidiary, false, false, isAsheville);
    }
}

function getLocalTime(subsidiary, isAsheville)
{
    var now = new Date();
    var date = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

    switch(subsidiary)
    {
        case 2: //US
            if(isAsheville)
            {
                date.setHours(date.getHours()-4);
            }
            else
            {
                date.setHours(date.getHours()-7);
            }
        break;

        case 5: //HK
            date.setHours(date.getHours()+8);
        break;

        case 7: //CPH
            date.setHours(date.getHours()+2);
        break;
    }

    return date;
}

function compareDates(date1, date2)
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

function searchAvailabilityResults(Availability, location)
{
    for(var i = 0, totalLength = Availability.length; i < totalLength; i++)
    {
        if(Availability[i].inventoryLocation == String(location) && Availability[i].type == 'Avail Qty')
        {
            return Availability[i];
        }
    }

    // item not available
    return [{
        "type": "Avail Qty",
        "action": "Add",
        "qty": "0",
        "availQty": 0,
        "availQtyToShip": 0,
        "dateValue": null,
        "inventoryLocation": null,
        "volume": 1,
        "item": null
    }]

}

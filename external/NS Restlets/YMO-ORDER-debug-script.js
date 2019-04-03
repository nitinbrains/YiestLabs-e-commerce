require(["N/record", "N/log", "N/search", "N/format"], function( record, log, search, format, itemAvailability) {
    function post(input) {
        try {
            var response = input;

            const userRecord = record.load({ type: record.Type.CUSTOMER, id: response.user.id });
            const userLocation = parseInt(userRecord.getValue({ fieldId: "subsidiary" }));
            const territory = userRecord.getValue({ fieldId: "territory" });

            const SDLocalTime = getLocalTime(2, false);
            const shipCountry = userRecord.getValue({ fieldId: "shipcountry" });
            const splitOrder = userLocation == 2 && shipCountry != "US" ? false : true; // no split orders for internationals
            const hasPlates = orderContainsPlates(response.items);

            //Ship Date for hb items
            const hbDate = HomebrewShipDate();

            //Populate Ship dates
            for (var i = 0; i <= response.items.length; i++) {

                var item = response.items[i];

                var ASHAvailability = getavailablequantity([String(item.MerchandiseID)], ["11"], true);
                var SDAvailability = getavailablequantity([String(item.MerchandiseID)], ["9"], true);

                // Service items
                if (item.type == 4) {
                    var ServiceRecord = loadItem(item.type, item.MerchandiseID);

                    if (ServiceRecord.getValue({ fieldId: "class" }) == 28) {
                        var seatsLeft = parseInt(ServiceRecord.getValue({ fieldId: "custitem_class_seats_remaining" }));
                        if (!isNaN(seatsLeft)) {
                            if (seatsLeft <= item.OrderDetailQty) {
                                //no seats left
                                response.items.splice(i, 1);
                                continue;
                            }
                        }
                    }

                    var warehouses = ServiceRecord.getValue({ fieldId: "custitemwarehouse" });
                    if (warehouses.indexOf("9") >= 0) {
                        //sd
                        item.Warehouse = 9;
                    } else if (warehouses.indexOf("30") >= 0) {
                        //cph
                        item.Warehouse = 30;
                    } else {
                        response.items.splice(i, 1);
                        continue;
                    }
                    item.shipDate = new Date(hbDate);
                }

                // Homebrew
                else if (item.type == 2) {
                    if (userLocation != 2) {
                        response.items.splice(i, 1);

                        continue;
                    } else {
                        item.shipDate = new Date(hbDate);
                        item.Warehouse = 9;
                    }
                }

                // Nonyeast
                else if (item.type == 3) {
                    var itemRecord = loadItem(item.type, item.MerchandiseID);
                    var warehouses = itemRecord.getValue({ fieldId: "custitemwarehouse" });

                    if (warehouses.indexOf(warehouseMap(userLocation)) >= 0) {
                        var shipDate = new Date(SDLocalTime);
                        var leadTime = parseInt(itemRecord.getValue({ fieldId: "custitem_wl_order_lead_time" }));

                        var ASHAvail = searchAvailabilityResults(ASHAvailability, "11");
                        var SDAvail = searchAvailabilityResults(SDAvailability, "9");

                        // Always check Asheville for plates orders
                        if (hasPlates) {
                            item.shipDate = getShipDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                            item.Warehouse = 11;
                        } else {
                            if (territory >= 3) {
                                if (item.OrderDetailQty <= parseInt(ASHAvail.availQtyToShip)) {
                                    item.shipDate = getShipDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                                    item.Warehouse = 11;
                                } else if (item.OrderDetailQty <= parseInt(SDAvail.availQtyToShip)) {
                                    item.shipDate = getShipDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                                    item.Warehouse = 9;
                                } else if (leadTime) {
                                    item.shipDate = getShipDate(
                                        shipDate.setDate(SDLocalTime.getDate() + leadTime),
                                        false,
                                        userLocation,
                                        userLocation != 2,
                                        userLocation == 7,
                                        false
                                    );
                                    item.Warehouse = parseInt(warehouseMap(userLocation));
                                } else {
                                    response.items.splice(i, 1);
                                    continue;
                                }
                            } else {
                                if (item.OrderDetailQty <= parseInt(SDAvail.availQtyToShip)) {
                                    item.shipDate = getShipDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                                    item.Warehouse = 9;
                                } else if (item.OrderDetailQty <= parseInt(ASHAvail.availQtyToShip)) {
                                    item.shipDate = getShipDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                                    item.Warehouse = 11;
                                } else if (leadTime) {
                                    item.shipDate = getShipDate(
                                        shipDate.setDate(SDLocalTime.getDate() + leadTime),
                                        false,
                                        userLocation,
                                        userLocation != 2,
                                        userLocation == 7,
                                        false
                                    );
                                    item.Warehouse = parseInt(warehouseMap(userLocation));
                                } else {
                                    response.items.splice(i, 1);
                                    continue;
                                }
                            }
                        }
                    } else {
                        response.items.splice(i, 1);
                        continue;
                    }
                }

                // Purepitch
                else {
                    var itemRecord = loadItem(item.type, item.MerchandiseID);
                    var warehouses = itemRecord.getValue({ fieldId: "custitemwarehouse" });

                    if (warehouses.indexOf(warehouseMap(userLocation)) >= 0) {
                        var leadTime = parseInt(itemRecord.getValue({ fieldId: "custitem_wl_order_lead_time" }));

                        if (item.OrderDetailQty >= 10.0 && item.type == 5) {
                            //large bbl custom pour
                            var shipDate = new Date(SDLocalTime);
                            leadTime = leadTime ? leadTime : 21;
                            item.shipDate = getShipDate(shipDate.setDate(SDLocalTime.getDate() + leadTime), false, userLocation, userLocation != 2, userLocation == 7, false);
                            item.Warehouse = parseInt(warehouseMap(userLocation));
                            continue;
                        }

                        var checkProduction = true, isPurepitch = true;
                        var packMethods = itemRecord.getText({ fieldId: "custitem_wl_packaging_methods" });
                        if (packMethods == "Custom Pour") {
                            isPurepitch = false;
                        }

                        if (userLocation == 7) {
                            var CPHAvailability = getavailablequantity([String(item.MerchandiseID)], ["30"], true);
                            var CPHAvail = searchAvailabilityResults(CPHAvailability, "30");

                            if (parseInt(CPHAvail.availQtyToShip) >= item.OrderDetailQty) {
                                checkProduction = false;
                                item.shipDate = getShipDate(new Date(CPHAvail.dateValue), isPurepitch, userLocation, false, true, false);
                                item.Warehouse = 30;
                            }
                        } else if (userLocation == 5) {
                            var HKAvailability = getavailablequantity([String(item.MerchandiseID)], ["31"], true);
                            var HKAvail = searchAvailabilityResults(HKAvailability, "31");

                            if (parseInt(HKAvail.availQtyToShip) >= item.OrderDetailQty) {
                                checkProduction = false;
                                item.shipDate = getShipDate(new Date(HKAvail.dateValue), isPurepitch, userLocation, false, false, false);
                                item.Warehouse = 31;
                            }
                        } else if (userLocation == 2) {
                            var SDAvail = searchAvailabilityResults(SDAvailability, "9");
                            var ASHAvail = searchAvailabilityResults(ASHAvailability, "11");

                            if (territory >= 3) {
                                if (parseInt(ASHAvail.availQtyToShip) >= item.OrderDetailQty && splitOrder) {
                                    checkProduction = false;
                                    item.shipDate = getShipDate(new Date(ASHAvail.dateValue), isPurepitch, userLocation, false, false, true);
                                    item.Warehouse = 11;
                                } else if (parseInt(SDAvail.availQtyToShip) >= item.OrderDetailQty && (!hasPlates || (hasPlates && !splitOrder))) {
                                    checkProduction = false;
                                    item.shipDate = getShipDate(new Date(SDAvail.dateValue), isPurepitch, userLocation, false, false, false);
                                    item.Warehouse = 9;
                                }
                            } else {
                                if (parseInt(SDAvail.availQtyToShip) >= item.OrderDetailQty && (!hasPlates || (hasPlates && !splitOrder))) {
                                    checkProduction = false;
                                    item.shipDate = getShipDate(new Date(SDAvail.dateValue), isPurepitch, userLocation, false, false, false);
                                    item.Warehouse = 9;
                                } else if (parseInt(ASHAvail.availQtyToShip) >= item.OrderDetailQty && splitOrder) {
                                    checkProduction = false;
                                    item.shipDate = getShipDate(new Date(ASHAvail.dateValue), isPurepitch, userLocation, false, false, true);
                                    item.Warehouse = 11;
                                }
                            }
                        } else {
                            response.items = null;
                            throw { message: "Invalid User Location", code: -1 };
                        }

                        // Check San Diego / Asheville Production warehouses for Packaging WOs
                        if (checkProduction) {
                            var packagingWOs = [];

                            // If on East coast, check Asheville first
                            if (territory > 3) {
                                putShipDatesIntoOrder(ASHAvailability, "10", packagingWOs); // Asheville Production warehouse
                                putShipDatesIntoOrder(SDAvailability, "8", packagingWOs); // San Diego Production warehouse
                            } else {
                                putShipDatesIntoOrder(SDAvailability, "8", packagingWOs); // San Diego Production warehouse
                                putShipDatesIntoOrder(ASHAvailability, "10", packagingWOs); // Asheville Production warehouse
                            }

                            for (var j = 0; j < packagingWOs.length; j++) {
                                if (item.OrderDetailQty <= parseInt(packagingWOs[j].availQtyToShip)) {
                                    item.shipDate = getShipDate(new Date(packagingWOs[j].dateValue), isPurepitch, userLocation, userLocation != 2, userLocation == 7, false);
                                    item.Warehouse = parseInt(warehouseMap(userLocation));
                                    j = packagingWOs.length;
                                }
                            }

                            if (!item.shipDate) {
                                if (leadTime) {
                                    var shipDate = new Date(SDLocalTime);
                                    item.shipDate = getShipDate(
                                        shipDate.setDate(SDLocalTime.getDate() + leadTime),
                                        isPurepitch,
                                        userLocation,
                                        userLocation != 2,
                                        userLocation == 7,
                                        false
                                    );
                                    item.Warehouse = parseInt(warehouseMap(userLocation));
                                } else {
                                    response.items.splice(i, 1);
                                }
                            }
                        }
                    } else {
                        //isn't available to ship from given location
                        response.items.splice(i, 1);
                        continue;
                    }
                }
            }

            //PRICING
            response.itemSubtotal = 0;
            response.shippingSubtotal = 0;
            response.orderSubtotal = 0;
            var done = [false];

            //Transit Times
            response.transitTimes = addTransitTimesAndRanges();

            var fakeOrder = record.create({ type: "salesorder", isDynamic: true });
            fakeOrder.setValue("entity", response.user.id);

            if (response.user.shipmethod && response.user.shipmethod != -3) {
                fakeOrder.setValue({ fieldId: "shipmethod", value: response.user.shipmethod });
            }

            if (response.couponCode) {
                fakeOrder.setText({ fieldId: "couponcode", text: response.couponCode.toUpperCase() });
            }

            // Add items to fake order
            for (var i = 0; i < response.items.length; i++) {
                fakeOrder.selectNewLine({ sublistId: "item" });
                fakeOrder.setCurrentSublistValue({ sublistId: "item", fieldId: "item", value: response.items[i].MerchandiseID });
                fakeOrder.setCurrentSublistValue({ sublistId: "item", fieldId: "quantity", value: response.items[i].OrderDetailQty });
                fakeOrder.setCurrentSublistValue({ sublistId: "item", fieldId: "location", value: response.items[i].Warehouse });
                fakeOrder.commitLine({ sublistId: "item" });
            }

            // Get item prices
            for (var i = 0; i < response.items.length; i++) {
                fakeOrder.selectLine({ sublistId: "item", line: i });
                response.items[i].pricePerUnit = fakeOrder.getCurrentSublistValue({ sublistId: "item", fieldId: "rate" });
            }

            response.itemSubtotal += fakeOrder.getValue({ fieldId: "subtotal" });
            if (response.user.shipmethod && response.user.shipmethod != -3) {
                response.shippingSubtotal += fakeOrder.getValue({ fieldId: "shippingcost" });
                response.orderSubtotal += fakeOrder.getValue({ fieldId: "total" });
            } else {
                response.shippingSubtotal = 0.0;
                response.orderSubtotal = response.itemSubtotal;
            }

            log.debug('response', response);

        } catch (error) {
            logError("put, cust:" + response.id, error);
            return { error: error };
        }
    }

    function orderContainsPlates(items) {
        var dryMedia = [
            // 1538, //TK2200
            // 1540, //TK2205
            // 1541, //TK2300
            // 1542, //TK3010
            // 1543,  //TK3100
            // 16224, //TK3101
            3068, //TK3300
            // 1059, //TK3305
            // 5209, //TK3310
            16225, //TK3410
            // 16226, //TK3415
            16227, //TK3420
            // 5211, //TK3450
            // 5212, //TK3455
            // 5214, //TK3495
            16228, //TK3500
            16229, //TK3501
            // 5215, //TK3505
            // 5216, //TK3507
            16230 //TK3600
            // 1077, //TK3602
            // 3910, //TK3701
            // 1053, //TK3710
            // 5218 //TK3800
        ];
        for (var i = items.length - 1; i >= 0; i--) {
            if (dryMedia.indexOf(items[i].MerchandiseID) >= 0) {
                return true;
            }
        }
        return false;
    }

    function putShipDatesIntoOrder(availability, inventoryLocation, packagingWOs) {
        for (var j = 0; j < availability.length; j++) {
            if (availability[j].inventoryLocation == inventoryLocation && availability[j].type == "Packaging WO") {
                var k;
                for (k = 0; k < packagingWOs.length; k++) {
                    var date = new Date(packagingWOs[k].dateValue);
                    var insertDate = new Date(availability[j].dateValue);
                    if (insertDate < date) break;
                }

                packagingWOs.splice(k, 0, availability[j]);
            }
        }
    }

    function HomebrewShipDate() {
        var hbDate = getLocalTime(2, false);

        hbDate.setDate(hbDate.getDate() + 1);

        // 2pm cutoff for next-day shipping
        if (hbDate.getHours() >= 14) {
            hbDate.setDate(hbDate.getDate() + 1);
        }

        return valiDate(hbDate);
    }

    function addTransitTimes() {
        var transittimes = {};
        var resultSet = search.load({ id: 2041 }).run();

        resultSet.each(function(result) {
            transittimes[result.getValue("custrecord_shipping_method")] = result.getValue("custrecord_days_in_transit");
            return true;
        });

        return transittimes;
    }

    function addTransitTimesAndRanges() {
        var transitTimes = {};

        var delay = search.load({ id: 2041 }).run();

        delay.each(function(result) {
            var transitTime = {};
            transitTime.daysInTransit = parseInt(result.getValue("custrecord_days_in_transit"));
            transitTimes[result.getValue("custrecord_shipping_method")] = transitTime;
            return true;
        });

        var ranges = search.load({ id: 1939 }).run();

        ranges.each(function(result) {
            transitTimes[result.getValue("custrecord_shipping_method")].daysInTransitRange = parseInt(result.getValue("custrecord_days_in_transit_range"));
            return true;
        });

        return transitTimes;
    }

    function setWillCallAddress(shipmethod, salesOrderRecord, customerName) {
        switch (shipmethod) {
            case 3470: //Boulder
                salesOrderRecord.setValue({ fieldId: "shipaddresslist", value: null });
                salesOrderRecord.setValue({ fieldId: "shipaddress", value: "Attn To: " + customerName + "\nBoulder Will-Call\n1898 S. Flatiron Ct. Suite 213\nBoulder, CO 80301 US" });
                break;
            case 3472: //Asheville
            case 13332: //Go Green
                salesOrderRecord.setValue({ fieldId: "shipaddresslist", value: null });
                salesOrderRecord.setValue({ fieldId: "shipaddress", value: "Attn To: " + customerName + "\nAsheville Will-Call\n172 South Charlotte Street\nAsheville, NC 28801 US" });
                break;
            case 3469: //SD
            case 3511: //Go Green
                salesOrderRecord.setValue({ fieldId: "shipaddresslist", value: null });
                salesOrderRecord.setValue({ fieldId: "shipaddress", value: "Attn To: " + customerName + "\nSan Diego Will-Call\n9495 Candida StreetSan Diego, CA 92126 US" });
                break;
        }
    }

    function loadItem(type, NSID) {
        switch (type) {
            case 1:
            case 2:
            case 5:
                return record.load({ type: record.Type.ASSEMBLY_ITEM, id: NSID });
            case 3:
                try {
                    return record.load({ type: record.Type.INVENTORY_ITEM, id: NSID });
                } catch (error) {
                    return record.load({ type: record.Type.ASSEMBLY_ITEM, id: NSID });
                }
            case 4:
                try {
                    return record.load({ type: record.Type.SERVICE_ITEM, id: NSID });
                } catch (error) {
                    return record.load({ type: record.Type.ASSEMBLY_ITEM, id: NSID });
                }
        }
    }


    function warehouseMap(subsidiaryID)
    {
        switch(subsidiaryID)
        {
            // USA
            case 2:
                return '9'; //SD Shipping
                //  return 11; //Ash Shipping
                break;
            // HK
            case 5:
                return '31'; //HK Shipping
                break;
            // CPH
            case 7:
                return '30'; //CPH Shipping
                break;
            default:
                return '9';
        }
    }

    const USHOLIDAYS = [{day: 1, month: 1}, //new years day
                        {day: 25, month: 12}, //christmas
                        {day: 4, month: 7}, //4th of july
                        {day: -1, month: 5, week: -1, dayofweek: 1 }, //memorial day
                        {day: -1, month: 11, week: 4, dayofweek: 4}, //thanksgiving
                        {day: -1, month: 9, week: 1, dayofweek: 1}, //labor day

                        //custom
                        {day: 22, month: 11},
                        {day: 25, month: 12}];


    const HKHOLIDAYS = [{day: 30, month: 3},
                        {day: 31, month: 3},
                        {day: 2, month: 4},
                        {day: 5, month: 4},

                        //custom
                        {day: 22, month: 11},
                        {day: 25, month: 12}];

    const CPHHOLIDAYS = [{day: 1, month: 1},
                        {day: 29, month: 3},
                        {day: 30, month: 3},
                        {day: 2, month: 4},
                        {day: 27, month: 4},
                        {day: 10, month: 5},
                        {day: 21, month: 5},
                        {day: 24, month: 12},
                        {day: 25, month: 12},
                        {day: 26, month: 12},

                        //custom
                        {day: 22, month: 11},
                        {day: 25, month: 12}];

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
            return true;
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

    function getShipDate(date, isPurepitch, subsidiary, addTravelTime, travelOnMonday, isAsheville)
    {
        var finalDate = new Date(date);
        var today = getLocalTime(subsidiary, isAsheville);

        // 2pm shipping cutoff
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
                if(finalDate.getDay() == 1)			// Monday
                {
                    finalDate.setDate(finalDate.getDate() + 7);
                }
                else if(finalDate.getDay() == 0)	// Sunday
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
                if(finalDate.getDay() == 5)			// Friday
                {
                    finalDate.setDate(finalDate.getDate() + 7);
                }
                else if(finalDate.getDay() == 6)	// Saturday
                {
                    finalDate.setDate(finalDate.getDate() + 13);
                }
                else
                {
                    finalDate.setDate(finalDate.getDate() + (5 - finalDate.getDay()) + 7);
                }
            }
        }

        // HK
        if(subsidiary == 5)
        {
            if(finalDate.getDay() == 5)			// Friday
            {
                finalDate.setDate(finalDate.getDate() + 3);
            }
            else
            {
                finalDate.setDate(finalDate.getDate() + 1);
            }
        }

        return valiDate(finalDate, subsidiary);

    }

    function valiDate(date, subsidiary)
    {
        date = new Date(date);
        var sunday = date.getDay() == 0;
        var saturday = date.getDay() == 6;
        var holiday = checkHoliday(date, subsidiary);

        if(saturday || sunday || holiday)
        {
            return valiDate(date.setDate(date.getDate() + 1), subsidiary);
        }
        else
        {
            return date;
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
                    date.setHours(date.getHours() - 4);
                }
                else
                {
                    date.setHours(date.getHours() - 7);
                }
                break;

            case 5: //HK
                date.setHours(date.getHours() + 8);
                break;

            case 7: //CPH
                date.setHours(date.getHours() + 2);
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

    /**** MOCKED FUNCTION - Return placeholder values */
    function searchAvailabilityResults(Availability, location)
    {
        // for(var i = 0, totalLength = Availability.length; i < totalLength; i++)
        // {
        //     if(Availability[i].inventoryLocation == String(location) && Availability[i].type == 'Avail Qty')
        //     {
        //         return Availability[i];
        //     }
        // }

        return {
            "type": "Avail Qty",
            "action": "Add",
            "qty": "0",
            "availQty": 5,
            "availQtyToShip": 5,
            "dateValue": null,
            "inventoryLocation": null,
            "volume": 1,
            "item": null
        };

    }

    function getavailablequantity(MerchandiseID, locations, someflat){
        return 10;
    }

    function logError(func, error) {
        var errorText = error.code ? JSON.stringify(error.code) : error.toString();
        log.error({
            title: "ORDER - " + func,
            details: errorText
        });
    }
    /***************************************************/


    const input = {
        user: {
            id: 43148,
            shipmethod: "2789"
        },
        items: [
            {
                MerchandiseID: 10189,
                Name: "WLP001 California Ale Yeast",
                OrderDetailQty: 1,
                details: "1L Custom Pour",
                dispQuantity: 1,
                salesCategory: 3,
                size: 1,
                type: 5
            },
            {

                MerchandiseID: 2425,
                Name: "WLP001 California Ale Yeast",
                OrderDetailQty: 1,
                details: "PurePitch® Nano",
                dispQuantity: 1,
                salesCategory: 3,
                type: 1
            }
        ]
    }

    post(input);
});
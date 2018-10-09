 /**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *Author: Dominik Konecny
 */

 /* ***************
    * Description *
    ***************
    This endpoint was established to perform the following tasks for the White Labs App:
    1 - get | Get Past Order/Order History
    2 - put | Get Order Dates/Pricing
    3 - post| Place Order
  */

define(['N/record', 'N/log', 'N/search', 'N/format', './wl_ba_cs_item_availability.js', '../Dom\ Dev\ Library/aes', '../Dom\ Dev\ Library/enc-base64-min.js', './YMO-LIB'],
function(record, log, search, format, itemAvailability)
{
    //Get Past Order/Order History
    function get(input)
    {
        
    }

    //Get Order Dates/Pricing
    function put(input)
    {
        try
        {
            var response = ReceiveMessage(input);

            if(!(response.version && versionUpToDate(response.version)))
            {
                return { error: {message: 'App version is out of date. Please download new version.', code: 0}}; 
            }

            const userRecord = record.load({type: record.Type.CUSTOMER, id: response.userId});
            const userLocation = parseInt(userRecord.getValue({fieldId: 'subsidiary'}));

            if(response.calcShip)
            {
                const SDLocalTime = getLocalTime(2, false);
                const shipCountry = userRecord.getValue({fieldId: 'shipcountry'});
                const splitOrder = (userLocation == 2 && shipCountry != 'US' ? false : true);
                const hasPlates = orderContainsPlates(response.items);

                //Ship Date for hb items
                const hbDate = hbShipDate();

                //Populate Ship dates
                for (var i = response.items.length - 1; i >= 0; i--) 
                {
                    try
                    {
                        if(response.items[i].type == 4) //service items
                        {
                            var ServiceRecord = loadItem(response.items[i].type, response.items[i].MerchandiseID);
                            
                            if(ServiceRecord.getValue({fieldId: 'class'}) == 28)
                            {
                                var seatsLeft = parseInt(ServiceRecord.getValue({fieldId: 'custitem_class_seats_remaining'}));
                                if(!isNaN(seatsLeft))
                                {
                                    if(seatsLeft <= response.items[i].OrderDetailQty)
                                    {
                                        //no seats left
                                        response.items.splice(i, 1);
                                        log.debug({title: 'remove service item', details: response.items[i]});
                                        continue;
                                    }
                                }
                            }

                            var warehouses = ServiceRecord.getValue({fieldId: 'custitemwarehouse'});
                            if(warehouses.indexOf('9') >= 0) //sd
                            {
                                response.items[i].Warehouse = 9;
                            }
                            else if(warehouses.indexOf('30') >= 0) //cph
                            {
                                response.items[i].Warehouse = 30;
                            }
                            else
                            {
                                response.items.splice(i, 1);
                                log.debug({title: 'couldn\'t find warehouse for service item', details: response.items[i]});
                                continue;
                            }

                            response.items[i].shipDate = new Date(hbDate);
                        }
                        else if(response.items[i].type == 2) //hb
                        {
                            if(userLocation != 2)
                            {
                                response.items.splice(i, 1);
                                log.debug({title: 'remove HB item', details: response.items[i]});
                                continue;
                            }
                            else
                            {
                                response.items[i].shipDate = new Date(hbDate);
                                response.items[i].Warehouse = 9;
                            }
                        }
                        else if(response.items[i].type == 3) //nonyeast
                        {
                            var itemRecord = loadItem(response.items[i].type, response.items[i].MerchandiseID);
                            var warehouses = itemRecord.getValue({fieldId: 'custitemwarehouse'});

                            if(warehouses.indexOf(warehouseMap(userLocation)) >= 0)
                            {
                                var shipDate = new Date(SDLocalTime);
                                var leadTime = parseInt(itemRecord.getValue({fieldId: 'custitem_wl_order_lead_time'}));
                                var Availability = itemAvailability.GetItemAvailability([response.items[i].MerchandiseID], [9, 11]);

                                var ASHAvail = searchAvailabilityResults(Availability, "11", "Avail Qty");
                                var SDAvail = searchAvailabilityResults(Availability, "9", "Avail Qty");

                                log.debug({title: 'SDAvail', details: SDAvail});
                                log.debug({title: 'ASHAvail', details: ASHAvail});

                                if(hasPlates && splitOrder && orderContainsPlates(response.items.splice(i,1)))
                                {
                                    if(response.items[i].OrderDetailQty <= parseInt(ASHAvail.qty))
                                    {
                                        response.items[i].shipDate = valiDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                                        response.items[i].Warehouse = 11;
                                    }
                                    else if(leadTime)
                                    {
                                        response.items[i].shipDate = valiDate(shipDate.setDate(SDLocalTime.getDate() + leadTime), false, userLocation, userLocation != 2, userLocation == 7, false);
                                        response.items[i].Warehouse = 11;
                                    }
                                    else
                                    {
                                        response.items.splice(i, 1);
                                        log.debug({title: 'remove nonyeast item hasPlates && splitOrder', details: response.items[i]});
                                        continue;
                                    } 
                                }
                                else
                                { 
                                    if(response.items[i].OrderDetailQty <= parseInt(SDAvail.qty))
                                    {
                                        response.items[i].shipDate = valiDate(shipDate, false, userLocation, userLocation != 2, userLocation == 7, false);
                                        response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                    }
                                    else if(leadTime)
                                    {
                                        response.items[i].shipDate = valiDate(shipDate.setDate(SDLocalTime.getDate() + leadTime), false, userLocation, userLocation != 2, userLocation == 7, false);
                                        response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                    }
                                    else
                                    {
                                        response.items.splice(i, 1);
                                        log.debug({title: 'remove nonyeast item', details: response.items[i]});
                                        continue;
                                    } 
                                }                            
                            }
                            else
                            {
                                response.items.splice(i, 1);
                                continue;
                            }
                        }
                        else //purepitch
                        {
                            var itemRecord = loadItem(response.items[i].type, response.items[i].MerchandiseID);
                            var warehouses = itemRecord.getValue({fieldId: 'custitemwarehouse'});

                            if(warehouses.indexOf(warehouseMap(userLocation)) >= 0)
                            {
                                var leadTime = parseInt(itemRecord.getValue({fieldId: 'custitem_wl_order_lead_time'}));

                                if(response.items[i].OrderDetailQty >= 10.0 && response.items[i].type == 5) //large bbl custom pour
                                {
                                    var shipDate = new Date(SDLocalTime);
                                    leadTime = leadTime ? leadTime : 21;
                                    response.items[i].shipDate = valiDate(shipDate.setDate(SDLocalTime.getDate() + leadTime), false, userLocation, userLocation != 2, userLocation == 7, false);
                                    response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                    continue;
                                }
                                
                                var Availability, checkProduction = true, isPurepitch = true;
                                var packMethods = itemRecord.getText({fieldId: 'custitem_wl_packaging_methods'});
                                if(packMethods)
                                {
                                    if(packMethods == "Custom Pour")
                                    {
                                        isPurepitch = false;
                                    }
                                }

                                if(userLocation == 7)
                                {
                                    Availability = itemAvailability.GetItemAvailability([response.items[i].MerchandiseID], [9, 30]);
                                    var CPHAvail = searchAvailabilityResults(Availability, "30", "Avail Qty");
                                    
                                    if(parseInt(CPHAvail.qty) >= response.items[i].OrderDetailQty)
                                    {
                                        checkProduction = false;
                                        response.items[i].shipDate = valiDate(new Date(CPHAvail.dateValue), isPurepitch, userLocation, false, true, false);
                                        response.items[i].Warehouse = 30;
                                    }
                                }
                                else if(userLocation == 5)
                                {
                                    Availability = itemAvailability.GetItemAvailability([response.items[i].MerchandiseID], [9, 31]);
                                    var HKAvail = searchAvailabilityResults(Availability, "31", "Avail Qty");
                                    
                                    if(parseInt(HKAvail.qty) >= response.items[i].OrderDetailQty)
                                    {
                                        checkProduction = false;
                                        response.items[i].shipDate = valiDate(new Date(HKAvail.dateValue), isPurepitch, userLocation, false, false, false);
                                        response.items[i].Warehouse = 31;
                                    }
                                }
                                else if(userLocation == 2)
                                {
                                    Availability = itemAvailability.GetItemAvailability([response.items[i].MerchandiseID], [9, 11]);
                                    var SDAvail = searchAvailabilityResults(Availability, "9", "Avail Qty");
                                    var ASHAvail = searchAvailabilityResults(Availability, "11", "Avail Qty");

                                    if(parseInt(userRecord.getValue({fieldId: 'territory'})) >= 3)
                                    {
                                        if(parseInt(ASHAvail.qty) >= response.items[i].OrderDetailQty && splitOrder)
                                        {
                                            checkProduction = false;
                                            response.items[i].shipDate = valiDate(new Date(ASHAvail.dateValue), isPurepitch, userLocation, false, false, true);
                                            response.items[i].Warehouse = 11;
                                        }
                                        else if(parseInt(SDAvail.qty) >= response.items[i].OrderDetailQty && (!hasPlates || (hasPlates && !splitOrder)))
                                        {
                                            checkProduction = false;
                                            response.items[i].shipDate = valiDate(new Date(SDAvail.dateValue), isPurepitch, userLocation, false, false, false);
                                            response.items[i].Warehouse = 9;
                                        }
                                    }
                                    else
                                    {
                                        if(parseInt(SDAvail.qty) >= response.items[i].OrderDetailQty && (!hasPlates || (hasPlates && !splitOrder)))
                                        {
                                            checkProduction = false;
                                            response.items[i].shipDate = valiDate(new Date(SDAvail.dateValue), isPurepitch, userLocation, false, false, false);
                                            response.items[i].Warehouse = 9;
                                        }
                                        else if(parseInt(ASHAvail.qty) >= response.items[i].OrderDetailQty && splitOrder)
                                        {
                                            checkProduction = false;
                                            response.items[i].shipDate = valiDate(new Date(ASHAvail.dateValue), isPurepitch, userLocation, false, false, true);
                                            response.items[i].Warehouse = 11;
                                        }
                                    }
                                }
                                else
                                {
                                    response.items = null;
                                    throw {message: 'Invalid User Location', code: -1};
                                }

                                if(checkProduction)
                                {
                                    for (var j = 0, totalLength = Availability.length; j < totalLength; j++) 
                                    {
                                        if(parseInt(Availability[j].inventoryLocation) == 8 && Availability[j].type == "Packaging WO" && (response.items[i].OrderDetailQty <= parseInt(Availability[j].availQtyToShip)))
                                        {
                                            response.items[i].shipDate = valiDate(new Date(Availability[j].dateValue), isPurepitch, userLocation, userLocation != 2, userLocation == 7, false);
                                            response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                            j = totalLength;
                                        }
                                    }

                                    if(!response.items[i].shipDate)
                                    {
                                        if(leadTime)
                                        {
                                            var shipDate = new Date(SDLocalTime);
                                            response.items[i].shipDate = valiDate(shipDate.setDate(SDLocalTime.getDate() + leadTime), isPurepitch, userLocation, userLocation != 2, userLocation == 7, false);
                                            response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                        }
                                        else
                                        {
                                            response.items.splice(i, 1);
                                            log.debug({title: 'no earliest ship date', details: response.items[i]});
                                        }   
                                    }
                                }
                            }
                            else
                            {
                                //isn't available to ship from given location
                                response.items.splice(i, 1);
                                log.debug({title: 'not available from given location', details: response.items[i]});
                                continue;
                            }
                        }

                        response.items[i].earliestShipDate = response.items[i].shipDate;
                    }
                    catch(err)
                    {
                        log.error({
                            title: 'Order Shipping - Error', 
                            details: err.toString() + JSON.stringify(response.items[i])
                        });
                        response.items.splice(i, 1);
                        continue;
                    }
                }

                //Transit Times
                response.transitTimes = addTransitTimesAndRanges();
            }


            //PRICING
            response.itemSubtotal = 0;
            response.shippingSubtotal = 0;
            response.orderSubtotal = 0;
            var done = [false];

            var fakeOrder = record.create({type: 'salesorder', isDynamic: true});
            fakeOrder.setValue('entity', response.userId);

            if(response.shipMethod && response.shipMethod != -3)
            {
                fakeOrder.setValue({fieldId: 'shipmethod', value: response.shipMethod});
            }

            if(response.couponCode)
            {
                fakeOrder.setText({fieldId: 'couponcode', text: response.couponCode.toUpperCase()});
            }

            // Add items to fake order
            for (var i = 0; i < response.items.length; i++) 
            {
                fakeOrder.selectNewLine({sublistId: 'item'});
                fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: response.items[i].MerchandiseID});
                fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: response.items[i].OrderDetailQty});
                fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'location', value: response.items[i].Warehouse});
                fakeOrder.commitLine({sublistId: 'item'});
            }

            // Get item prices 
            for(var i = 0; i < response.items.length; i++)
            {
                fakeOrder.selectLine({sublistId: 'item', line: i});
                response.items[i].pricePerUnit = fakeOrder.getCurrentSublistValue({sublistId: 'item', fieldId: 'rate'});

            }

            response.itemSubtotal += fakeOrder.getValue({fieldId: 'subtotal'});
            if(response.shipMethod && response.shipMethod != -3)
            {
                response.shippingSubtotal += fakeOrder.getValue({fieldId: 'shippingcost'});
                response.orderSubtotal += fakeOrder.getValue({fieldId: 'total'});
            }
            else
            {
                response.shippingSubtotal = 0.0;
                response.orderSubtotal = response.itemSubtotal;
            }

            return SendMessage(response);
        }
        catch(err)
        {
            logError('put, cust:' + response.id, err);
            return {error: err};
        }
    }

    //Place Order
    function post(input)
    {
        var message = ReceiveMessage(input);

        if(!(message.version && versionUpToDate(message.version)))
        {
            return { error: {message: 'App version is out of date. Please download new version.', code: 0}};
        }

        if(message.get)
        {
            try
            {
                if(message.admin) //CSR Order History
                {
                    message.orders = [];

                    var filters = [];
                    filters.push(search.createFilter({name: 'salesrep', operator: search.Operator.ANYOF, values: message.id}));
                    filters.push(search.createFilter({name: 'type', operator: search.Operator.ANYOF, values: 'SalesOrd'}));
                    filters.push(search.createFilter({name: 'mainline', operator: search.Operator.IS, values: true}));
                    filters.push(search.createFilter({name: 'datecreated', operator: search.Operator.NOTBEFORE, values: 'startOfLastMonth'}));

                    var columns = [];
                    columns.push(search.createColumn({name:'total'}));
                    columns.push(search.createColumn({name:'tranid'}));
                    columns.push(search.createColumn({name:'shipdate'}));
                    columns.push(search.createColumn({name:'custbody_expected_delivery_date'}));
                    columns.push(search.createColumn({name:'datecreated'}));
                    columns.push(search.createColumn({name:'statusref'}));
                    columns.push(search.createColumn({name:'entity'}));
                    columns.push(search.createColumn({name:'currency'}));

                    search.create({type: 'transaction', filters: filters, columns: columns}).run().each(function(result)
                    {
                        var order = {};
                        order.id = parseInt(result.id);
                        order.orderNum = result.getValue({name: 'tranid'});
                        order.totalPrice = result.getValue({name: 'total'});
                        order.orderDate = result.getValue({name: 'datecreated'});
                        order.status = result.getText({name: 'statusref'});
                        order.companyName = result.getText({name: 'entity'});
                        order.deliverydate = result.getValue({name: 'custbody_expected_delivery_date'});
                        order.shipdate = result.getValue({name: 'shipdate'});
                        order.currency = result.getValue({name: 'currency'});
                        
                        message.orders.unshift(order);
                        return true;
                    });
                }
                else if(message.admin == false) //Regular User Order History
                {
                    message.orders = [];

                    var filters = [];

                    filters.push(search.createFilter({name: 'entity', operator: search.Operator.ANYOF, values: message.id}));
                    filters.push(search.createFilter({name: 'type', operator: search.Operator.ANYOF, values: 'SalesOrd'}));
                    filters.push(search.createFilter({name: 'custitem_include_in_ymo_website', join: 'item', operator: search.Operator.IS, values: true}));

                    var columns = [];
                    columns.push(search.createColumn({name:'entity'}));
                    columns.push(search.createColumn({name:'total'}));
                    columns.push(search.createColumn({name:'item'}));
                    columns.push(search.createColumn({name:'quantity'}));
                    columns.push(search.createColumn({name:'rate'}));
                    columns.push(search.createColumn({name:'tranid'}));
                    columns.push(search.createColumn({name:'billaddress'}));
                    columns.push(search.createColumn({name:'shipaddress'}));
                    columns.push(search.createColumn({name:'shipdate'}));
                    columns.push(search.createColumn({name:'custbody_expected_delivery_date'}));
                    columns.push(search.createColumn({name:'datecreated'}));
                    columns.push(search.createColumn({name:'statusref'}));
                    columns.push(search.createColumn({name:'subsidiary'}));
                    columns.push(search.createColumn({name:'shipmethod'}));
                    columns.push(search.createColumn({name:'shippingamount'}));
                    columns.push(search.createColumn({name:'trackingnumbers'}));
                    columns.push(search.createColumn({name:'currency'}));

                    var orders = {};
                    search.create({type: 'transaction', filters: filters, columns: columns}).run().each(function(result)
                    {
                        var orderID = parseInt(result.id);

                        if(!orders[orderID])
                        {
                            orders[orderID] = {};
                            orders[orderID].id = parseInt(orderID);
                            orders[orderID].companyName = result.getText({name: 'entity'});
                            orders[orderID].items = [];
                            orders[orderID].shipdate = result.getValue({name: 'shipdate'});
                            orders[orderID].totalPrice = result.getValue({name: 'total'});
                            orders[orderID].billaddress = result.getValue({name: 'billaddress'});
                            orders[orderID].shipaddress = result.getValue({name: 'shipaddress'});
                            orders[orderID].orderNum = result.getValue({name: 'tranid'});
                            orders[orderID].deliverydate = result.getValue({name: 'custbody_expected_delivery_date'});
                            orders[orderID].orderDate = result.getValue({name: 'datecreated'});
                            orders[orderID].status = result.getText({name: 'statusref'});
                            orders[orderID].trackingNumber = (result.getValue({name: 'trackingnumbers'}) ? result.getValue({name: 'trackingnumbers'}) : "N/A");
                            orders[orderID].currency = result.getValue({name: 'currency'});

                            orders[orderID].subsidiary = result.getText({name: 'subsidiary'});
                            orders[orderID].subsidiary = orders[orderID].subsidiary.substring(orders[orderID].subsidiary.indexOf(':') + 2); //Remove extraneous text

                            orders[orderID].shipmethod = result.getText({name: 'shipmethod'});
                            orders[orderID].shipTotal = result.getValue({name: 'shippingamount'});
                        }

                        var item = {};

                        item.id = result.getValue({name: 'item'});
                        item.name = result.getText({name: 'item'});
                        item.quantity = parseFloat(result.getValue({name: 'quantity'}));
                        item.price = parseFloat(result.getValue({name: 'rate'}));

                        orders[orderID].items.push(item);
                        return true;
                    });

                    var keys = Object.keys(orders);

                    for(var i = keys.length-1; i >= 0; i--)
                    {
                        message.orders.push(orders[keys[i]]);
                    }
                }
                else //Get Past Order
                {
                    var salesOrderRecord = record.load({type: record.Type.SALES_ORDER, id: message.id});

                    message.items = [];
                    message.companyName = salesOrderRecord.getText({fieldId: 'entity'});
                    message.shipdate = salesOrderRecord.getValue({fieldId: 'shipdate'});
                    message.totalPrice = salesOrderRecord.getValue({fieldId: 'total'});
                    message.billaddress = salesOrderRecord.getValue({fieldId: 'billaddress'});
                    message.shipaddress = salesOrderRecord.getValue({fieldId: 'shipaddress'});
                    message.orderNum = salesOrderRecord.getValue({fieldId: 'tranid'});
                    message.deliverydate = salesOrderRecord.getValue({fieldId: 'custbody_expected_delivery_date'});
                    message.orderDate = salesOrderRecord.getValue({fieldId: 'createddate'});
                    message.status = salesOrderRecord.getValue({fieldId: 'status'});

                    message.subsidiary = salesOrderRecord.getText({fieldId: 'subsidiary'});
                    message.subsidiary = message.subsidiary.substring(message.subsidiary.indexOf(':')+1);

                    message.shipmethod = salesOrderRecord.getText({fieldId: 'shipmethod'});
                    message.shipTotal = salesOrderRecord.getValue({fieldId: 'shippingcost'});

                    message.currency = salesOrderRecord.getValue({fieldId: 'currency'});

                    var trackingNumber = salesOrderRecord.getValue({fieldId: 'linkedtrackingnumbers'});
                    if(trackingNumber)
                    {
                        message.trackingNumber = trackingNumber;
                    }
                    else
                    {
                        message.trackingNumber = "N/A";
                    }

                    for (var i = 0; i < salesOrderRecord.getLineCount({sublistId: 'item'}); i++) 
                    {
                        var item = {};
                        item.id = salesOrderRecord.getSublistValue({sublistId: 'item', fieldId: 'item', line: i});
                        item.name = salesOrderRecord.getSublistText({sublistId: 'item', fieldId: 'item', line: i});
                        item.quantity = salesOrderRecord.getSublistValue({sublistId: 'item', fieldId: 'quantity', line: i});
                        item.price = salesOrderRecord.getSublistValue({sublistId: 'item', fieldId: 'rate', line: i});
                        message.items.push(item);
                    }
                }

                return SendMessage(message);
            }
            catch(err)
            {
                logError('get cust:' + response.id, err);
                return {error: err};
            }
        }
        else  // Create new Sales Order
        {
            try
            {
                var response = {orderNum: []};
                var customerid = parseInt(message.CustomerID);

                var billaddressindex;
                var shipaddressindex;
                var today = new Date();

                var customerRecord = record.load({type: record.Type.CUSTOMER, id: customerid});
                var userLocation = parseInt(customerRecord.getValue({fieldId: 'subsidiary'}));

                var WillCall = null;
                if([3470, 3472, 13332, 3469, 3511].indexOf(parseInt(message.shipMethod)) >= 0 || (!message.shipMethod && [3470, 3472, 13332, 3469, 3511].indexOf(parseInt(customerRecord.getValue({fieldId: 'shippingitem'}))) >= 0))
                {
                    if(message.shipMethod)
                    {
                        WillCall = parseInt(message.shipMethod);
                    }
                    else
                    {
                        WillCall = parseInt(customerRecord.getValue({fieldId: 'shippingitem'}));
                    }
                }
                else if(message.shipaddress)
                {
                    var found = false;
                    for(var i = customerRecord.getLineCount({sublistId: 'addressbook'}) - 1; i >= 0; i--)
                    {
                        var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: i});
                        if(message.shipattn == addressSubrecord.getValue({fieldId:'attention'})
                        && message.shipaddressee == addressSubrecord.getValue({fieldId:'addressee'})
                        && message.shipaddress1 == addressSubrecord.getValue({fieldId:'addr1'})
                        && message.shipaddress2 == addressSubrecord.getValue({fieldId:'addr2'})
                        && message.shipaddress3 == addressSubrecord.getValue({fieldId:'addr3'})
                        && message.shipcity == addressSubrecord.getValue({fieldId:'city'})
                        && message.shipzip == addressSubrecord.getValue({fieldId:'zip'})
                        && message.shipcountryid == addressSubrecord.getValue({fieldId:'country'}))
                        {
                            found = true;
                            customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', value: true, line: i});
                            break;
                        }
                    }

                    if(!found)
                    {
                        var line = parseInt(customerRecord.getLineCount({sublistId: 'addressbook'}));
                        customerRecord.insertLine({sublistId: 'addressbook', line: line});
                        customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultshipping', value: true, line: line});
                        var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: line});
                        addressSubrecord.setValue({fieldId:'country', value: message.shipcountryid});
                        addressSubrecord.setValue({fieldId:'attention', value: message.shipattn});
                        addressSubrecord.setValue({fieldId:'addressee', value: message.shipaddressee});
                        addressSubrecord.setValue({fieldId:'addr1', value: message.shipaddress1});
                        addressSubrecord.setValue({fieldId:'addr2', value: message.shipaddress2});
                        addressSubrecord.setValue({fieldId:'add3', value: message.shipaddress3});
                        addressSubrecord.setValue({fieldId:'city', value: message.shipcity});
                        addressSubrecord.setValue({fieldId:'zip', value: message.shipzip});
                    }
                }

                if(record.billaddress)
                {
                    var found = false;
                    for(var i = customerRecord.getLineCount({sublistId: 'addressbook'}) - 1; i >= 0; i--)
                    {
                        var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: i});
                        if(message.billattn == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'attention', line: i})
                        && message.billaddressee == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'addressee', line: i})
                        && message.billaddress1 == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'addr1', line: i})
                        && message.billaddress2 == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'addr2', line: i})
                        && message.billaddress3 == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'addr3', line: i})
                        && message.billcity == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'city', line: i})
                        && message.billzip == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'zip', line: i})
                        && message.billcountryid == customerRecord.getSublistValue({sublistId:'addressbook', fieldId:'country', line: i}))
                        {
                            found = true;
                            customer.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', value: true, line: i});
                            break;
                        }
                    }

                    if(!found)
                    {
                        var line = parseInt(customerRecord.getLineCount({sublistId: 'addressbook'}));
                        customerRecord.insertLine({sublistId: 'addressbook', line: line});
                        customerRecord.setSublistValue({sublistId: 'addressbook', fieldId: 'defaultbilling', value: true, line: line});
                        var addressSubrecord = customerRecord.getSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress', line: line});
                        addressSubrecord.setValue({fieldId:'country', value: message.billcountryid});
                        addressSubrecord.setValue({fieldId:'attention', value: message.billattn});
                        addressSubrecord.setValue({fieldId:'addressee', value: message.billaddressee});
                        addressSubrecord.setValue({fieldId:'addr1', value: message.billaddress1});
                        addressSubrecord.setValue({fieldId:'addr2', value: message.billaddress2});
                        addressSubrecord.setValue({fieldId:'add3', value: message.billaddress3});
                        addressSubrecord.setValue({fieldId:'city', value: message.billcity});
                        addressSubrecord.setValue({fieldId:'zip', value: message.billzip});
                    }
                }

                var lineItem = 0;
                for(var i = 0; i < message.SaleItems.length; i++)
                {
                    if(!message.SaleItems[i].done)
                    {
                       // Initialize new sales order object
                        var salesOrderRecord = record.create({type: record.Type.SALES_ORDER, isDynamic: true});

                        if(message.creditID)
                        {
                            salesOrderRecord.setValue({fieldId:'customform', value: 102});
                            salesOrderRecord.setValue({fieldId: 'entity', value: customerid});
                            salesOrderRecord.setValue({fieldId:'creditcard', value: message.creditID});
                        }
                        else
                        {
                            salesOrderRecord.setValue({fieldId:'customform', value: 101});
                            salesOrderRecord.setValue({fieldId: 'entity', value: customerid});
                            if(customerRecord.getValue({fieldId: 'subsidiary'}) != 2 && (!customerRecord.getValue({fieldId: 'terms'}) || customerRecord.getValue({fieldId: 'terms'}) == 10))
                            {
                                salesOrderRecord.setValue({fieldId:'terms', value: 13}); //Bank transfer required for non US
                            }
                        }

                        salesOrderRecord.setValue({fieldId: 'trandate', value: today});

                        if(message.billaddress)
                        {
                            salesOrderRecord.setValue({fieldId: 'billaddresslist', value: billaddressindex});
                        }

                        salesOrderRecord.setValue({fieldId: 'custbody_wl_ymo_synced', value: true});
                        
                        if(message.OrderComment)
                        {
                            salesOrderRecord.setValue({fieldId: 'memo', value: message.OrderComment.substring(0,997)});
                        }

                        if(message.PONum)
                        {
                            salesOrderRecord.setValue({fieldId: 'otherrefnum', value: message.PONum});
                        }

                        if(message.shipMethod != -3)
                        {
     
                            salesOrderRecord.setValue({fieldId: 'shipmethod', value: message.shipMethod});
                            
                        }
                        

                        salesOrderRecord.setValue({fieldId: 'shipdate', value: new Date(message.SaleItems[i].shipDate)});

                        if(WillCall)
                        {
                            setWillCallAddress(WillCall, salesOrderRecord, salesOrderRecord.getText({fieldId: 'entity'}));
                        }
                        else if(message.shipaddress)
                        {
                           salesOrderRecord.setValue({fieldId: 'shipaddresslist', value: shipaddressindex});
                        }

                        salesOrderRecord.selectNewLine({sublistId: 'item'});
                        salesOrderRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: message.SaleItems[i].MerchandiseID});
                        salesOrderRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: message.SaleItems[i].OrderDetailQty});
                        salesOrderRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'location', value: message.SaleItems[i].Warehouse});
                        salesOrderRecord.commitLine({sublistId: 'item'});
                        
                        for(var j = i+1; j < message.SaleItems.length; j++)
                        {
                            if(compareDates(new Date(message.SaleItems[i].shipDate), new Date(message.SaleItems[j].shipDate)) == 0)
                            {
                                salesOrderRecord.selectNewLine({sublistId: 'item'});
                                salesOrderRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: message.SaleItems[j].MerchandiseID});
                                salesOrderRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: message.SaleItems[j].OrderDetailQty});
                                salesOrderRecord.setCurrentSublistValue({sublistId: 'item', fieldId: 'location', value: message.SaleItems[j].Warehouse});
                                salesOrderRecord.commitLine({sublistId: 'item'});
                                message.SaleItems[j].done = true;
                            }
                        }
                        
                        var id = salesOrderRecord.save({enableSourcing: true});

                        if(message.salesrep && message.salesrep != 43148) //CSR orders
                        {
                            var updatedRecord = record.load({type: record.Type.SALES_ORDER, id: id});
                            updatedRecord.setValue({fieldId: 'salesrep', value: message.salesrep});
                            updatedRecord.save();
                        }
                        
                        if (id != null && id != 0) 
                        {
                            response.orderNum.push(parseInt(id));
                        }
                        else 
                        {
                            throw {message: 'failed to submit order', code: -1};
                        }    
                    }
                }
                return SendMessage(response);
            } 
            catch(err)
            {
                logError('post cust:' + message.CustomerID, err);
                return {error: err};
            }
        }
    }

    function orderContainsPlates(items)
    {
        var illegalValues = [1059, 1570, 1571, 1574, 3908, 4554, 4557]; //TK3310, TK3410, TK3420, TK3600, TK3300, TK3501, TK3500
        for (var i = items.length - 1; i >= 0; i--) 
        {
            if(illegalValues.indexOf(items[i].MerchandiseID) >= 0)
            {
                return true;
            }
        }
        return false;
    }

    function hbShipDate()
    {
        var hbDate = getLocalTime(2, false);
        
        hbDate.setDate(hbDate.getDate()+1);

        // 2pm cutoff for next-day shipping
        if(hbDate.getHours() >= 14)
        {
            hbDate.setDate(hbDate.getDate()+1);
        }

        while(hbDate.getDay() == 0 || hbDate.getDay() == 6 || !checkHoliday(hbDate, 2))
        {
            hbDate.setDate(hbDate.getDate()+1);
        }

        return hbDate;
    }

    function addTransitTimes()
    {
        var transittimes = {};
        var resultSet = search.load({id: 2041}).run();

        resultSet.each(function(result)
        {
            transittimes[result.getValue('custrecord_shipping_method')] = result.getValue('custrecord_days_in_transit');
            return true;
        });

        return transittimes;
    }

    function addTransitTimesAndRanges()
    {
        var transitTimes = {};
        
        var delay = search.load({id: 2041}).run();

        delay.each(function(result)
        {
            var transitTime = {};
            transitTime.daysInTransit = parseInt(result.getValue('custrecord_days_in_transit'));
            transitTimes[result.getValue('custrecord_shipping_method')] = transitTime;
            return true;
        });

        var ranges = search.load({id: 1939}).run();

        ranges.each(function(result)
        {
            transitTimes[result.getValue('custrecord_shipping_method')].daysInTransitRange = parseInt(result.getValue('custrecord_days_in_transit_range'));
            return true;
        });

        return transitTimes;
    }

    function setWillCallAddress(shipMethod, salesOrderRecord, customerName)
    {
        switch(shipMethod)
        {
            case 3470:  //Boulder
                salesOrderRecord.setValue({fieldId: 'shipaddresslist', value: null});
                salesOrderRecord.setValue({fieldId: 'shipaddress', value: 'Attn To: ' + customerName + '\nBoulder Will-Call\n1898 S. Flatiron Ct. Suite 213\nBoulder, CO 80301 US'});
                break;
            case 3472: //Asheville
            case 13332: //Go Green
                salesOrderRecord.setValue({fieldId: 'shipaddresslist', value: null});
                salesOrderRecord.setValue({fieldId: 'shipaddress', value: 'Attn To: ' + customerName + '\nAsheville Will-Call\n172 South Charlotte Street\nAsheville, NC 28801 US'});
                break;
            case 3469: //SD
            case 3511: //Go Green
                salesOrderRecord.setValue({fieldId: 'shipaddresslist', value: null});
                salesOrderRecord.setValue({fieldId: 'shipaddress', value: 'Attn To: ' + customerName + '\nSan Diego Will-Call\n9495 Candida Street\San Diego, CA 92126 US'});
                break;
        }
    }

    function searchAvailabilityResults(Availability, location, type)
    {
        for(var i = 0, totalLength = Availability.length; i < totalLength; i++)
        {
            if(Availability[i].inventoryLocation == location && Availability[i].type == type)
            {
                return Availability[i];
            }
        }

        return {qty: 0};
    }

    function loadItem(type, NSID)
    {
        switch(type)
        {
            case 1:
            case 2:
            case 5:
                return record.load({type: record.Type.ASSEMBLY_ITEM, id: NSID});
            case 3:
                try 
                {
                    return record.load({type: record.Type.INVENTORY_ITEM, id: NSID});
                }
                catch(err)
                {
                    return record.load({type: record.Type.ASSEMBLY_ITEM, id: NSID});
                } 
            case 4:
                try 
                {
                    return record.load({type: record.Type.SERVICE_ITEM, id: NSID});
                }
                catch(err)
                {
                    return record.load({type: record.Type.ASSEMBLY_ITEM, id: NSID});
                }
        }
    }

    function findAvailableQuantity(itemRecord, Warehouse)
    {
        return itemRecord.getSublistValue({sublistId: 'locations', fieldId: 'quantityavailable', line: itemRecord.findSublistLineWithValue({sublistId: 'locations', fieldId: 'locationid', value: String(Warehouse)})});
    }

    function logError(func, err)
    {
        var errorText = err.code ? JSON.stringify(err.code) : err.toString();
        log.error({
            title: 'ORDER - ' + func, 
            details: errorText
        });
    }

    return {
        get: get,
        put: put,
        post: post
    };
});
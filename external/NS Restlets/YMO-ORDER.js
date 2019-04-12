/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 *Author: Dimitri Vasilev
 */

/* ***************
   * Description *
   ***************
   This endpoint was established to perform the following tasks for the White Labs App:
   1 - get | Get Past Order/Order History
   2 - put | Get Order Dates/Pricing
   3 - post| Place Order
 */

define(["N/record", "N/log", "N/search", "N/format", "./item-availability.js", "../Dom Dev Library/aes", "../Dom Dev Library/enc-base64-min.js", "./YMO-LIB"], function(
    record,
    log,
    search,
    format,
    itemAvailability
) {
    //Get Past Order/Order History
    function get(input) {}

    //Get Order Dates/Pricing
    function put(input) {
        try {
            var response = ReceiveMessage(input);

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
            for (var i = response.items.length - 1; i >= 0; i--) {
                var ASHAvailability = itemAvailability.GetItemAvailability([String(response.items[i].MerchandiseID)], ["11"], true);
                var SDAvailability = itemAvailability.GetItemAvailability([String(response.items[i].MerchandiseID)], ["9"], true);

                // Service items
                if (response.items[i].type == 4) {
                    var ServiceRecord = loadItem(response.items[i].type, response.items[i].MerchandiseID);

                    if (ServiceRecord.getValue({ fieldId: "class" }) == 28) {
                        var seatsLeft = parseInt(ServiceRecord.getValue({ fieldId: "custitem_class_seats_remaining" }));
                        if (!isNaN(seatsLeft)) {
                            if (seatsLeft <= response.items[i].OrderDetailQty) {
                                //no seats left
                                response.items.splice(i, 1);
                                continue;
                            }
                        }
                    }

                    var warehouses = ServiceRecord.getValue({ fieldId: "custitemwarehouse" });
                    if (warehouses.indexOf("9") >= 0) {
                        //sd
                        response.items[i].Warehouse = 9;
                    } else if (warehouses.indexOf("30") >= 0) {
                        //cph
                        response.items[i].Warehouse = 30;
                    } else {
                        response.items.splice(i, 1);
                        continue;
                    }
                    response.items[i].shipDate = new Date(hbDate);
                }

                // Homebrew
                else if(response.items[i].type == 2)
                {
                    if(userLocation != 2)
                    {
                        response.items.splice(i, 1);
                        continue;
                    }

                    var SDAvailability = itemAvailability.GetItemAvailability([String(response.items[i].MerchandiseID)], ['9'], true)
                    var SDAvail = searchAvailabilityResults(SDAvailability, "9");

                    if(SDAvail.availQtyToShip > 0)
                    {
                        response.items[i].shipDate = new Date(hbDate);
                        response.items[i].Warehouse = 9;
                    }
                    else
                    {
                        response.items.splice(i, 1);
                    }
                }

                // Nonyeast
                else if (response.items[i].type == 3) {
                    var itemRecord = loadItem(response.items[i].type, response.items[i].MerchandiseID);
                    var warehouses = itemRecord.getValue({ fieldId: "custitemwarehouse" });

                    if (warehouses.indexOf(warehouseMap(userLocation)) >= 0) {
                        var shipDate = new Date(SDLocalTime);
                        var leadTime = parseInt(itemRecord.getValue({ fieldId: "custitem_wl_order_lead_time" }));

                        var ASHAvail = searchAvailabilityResults(ASHAvailability, "11");
                        var SDAvail = searchAvailabilityResults(SDAvailability, "9");

                        // Always check Asheville for plates orders
                        if (hasPlates) {
                            response.items[i].shipDate = getShipDate(shipDate, userLocation, userLocation != 2, userLocation == 7, false, false);
                            response.items[i].Warehouse = 11;
                        } else {
                            if (territory >= 3) {
                                if (response.items[i].OrderDetailQty <= parseInt(ASHAvail.availQtyToShip)) {
                                    response.items[i].shipDate = getShipDate(shipDate, userLocation, userLocation != 2, userLocation == 7, false, false);
                                    response.items[i].Warehouse = 11;
                                } else if (response.items[i].OrderDetailQty <= parseInt(SDAvail.availQtyToShip)) {
                                    response.items[i].shipDate = getShipDate(shipDate, userLocation, userLocation != 2, userLocation == 7, false, false);
                                    response.items[i].Warehouse = 9;
                                } else if (leadTime) {
                                    response.items[i].shipDate = getShipDate(
                                        shipDate.setDate(SDLocalTime.getDate() + leadTime),
                                        userLocation,
                                        userLocation != 2,
                                        userLocation == 7,
                                        false,
                                        false
                                    );
                                    response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                } else {
                                    response.items.splice(i, 1);
                                    continue;
                                }
                            } else {
                                if (response.items[i].OrderDetailQty <= parseInt(SDAvail.availQtyToShip)) {
                                    response.items[i].shipDate = getShipDate(shipDate, userLocation, userLocation != 2, userLocation == 7, false, false);
                                    response.items[i].Warehouse = 9;
                                } else if (response.items[i].OrderDetailQty <= parseInt(ASHAvail.availQtyToShip)) {
                                    response.items[i].shipDate = getShipDate(shipDate, userLocation, userLocation != 2, userLocation == 7, false, false);
                                    response.items[i].Warehouse = 11;
                                } else if (leadTime) {
                                    response.items[i].shipDate = getShipDate(
                                        shipDate.setDate(SDLocalTime.getDate() + leadTime),
                                        userLocation,
                                        userLocation != 2,
                                        userLocation == 7,
                                        false,
                                        false
                                    );
                                    response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
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
                    var itemRecord = loadItem(response.items[i].type, response.items[i].MerchandiseID);
                    var warehouses = itemRecord.getValue({ fieldId: "custitemwarehouse" });

                    if (warehouses.indexOf(warehouseMap(userLocation)) >= 0) {
                        var leadTime = parseInt(itemRecord.getValue({ fieldId: "custitem_wl_order_lead_time" }));

                        if (response.items[i].OrderDetailQty >= 10.0 && response.items[i].type == 5) {
                            //large bbl custom pour
                            var shipDate = new Date(SDLocalTime);
                            leadTime = leadTime ? leadTime : 21;
                            response.items[i].shipDate = getShipDate(shipDate.setDate(SDLocalTime.getDate() + leadTime), userLocation, userLocation != 2, userLocation == 7, false, false);
                            response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                            continue;
                        }

                        var checkProduction = true, isPurepitch = true;
                        var packMethods = itemRecord.getText({ fieldId: "custitem_wl_packaging_methods" });
                        if (packMethods == "Custom Pour") {
                            isPurepitch = false;
                        }

                        if (userLocation == 7) {
                            var CPHAvailability = itemAvailability.GetItemAvailability([String(response.items[i].MerchandiseID)], ["30"], true);
                            var CPHAvail = searchAvailabilityResults(CPHAvailability, "30");

                            if (parseInt(CPHAvail.availQtyToShip) >= response.items[i].OrderDetailQty) {
                                checkProduction = false;
                                response.items[i].shipDate = getShipDate(new Date(CPHAvail.dateValue), userLocation, false, true, false, !isPurepitch);
                                response.items[i].Warehouse = 30;
                            }
                        } else if (userLocation == 5) {
                            var HKAvailability = itemAvailability.GetItemAvailability([String(response.items[i].MerchandiseID)], ["31"], true);
                            var HKAvail = searchAvailabilityResults(HKAvailability, "31");

                            if (parseInt(HKAvail.availQtyToShip) >= response.items[i].OrderDetailQty) {
                                checkProduction = false;
                                response.items[i].shipDate = getShipDate(new Date(HKAvail.dateValue), userLocation, false, false, false, !isPurepitch);
                                response.items[i].Warehouse = 31;
                            }
                        } else if (userLocation == 2) {
                            var SDAvail = searchAvailabilityResults(SDAvailability, "9");
                            var ASHAvail = searchAvailabilityResults(ASHAvailability, "11");

                            if (territory >= 3) {
                                if (parseInt(ASHAvail.availQtyToShip) >= response.items[i].OrderDetailQty && splitOrder) {
                                    checkProduction = false;
                                    response.items[i].shipDate = getShipDate(new Date(ASHAvail.dateValue), userLocation, false, false, true, !isPurepitch);
                                    response.items[i].Warehouse = 11;
                                } else if (parseInt(SDAvail.availQtyToShip) >= response.items[i].OrderDetailQty && (!hasPlates || (hasPlates && !splitOrder))) {
                                    checkProduction = false;
                                    response.items[i].shipDate = getShipDate(new Date(SDAvail.dateValue), userLocation, false, false, false, !isPurepitch);
                                    response.items[i].Warehouse = 9;
                                }
                            } else {
                                if (parseInt(SDAvail.availQtyToShip) >= response.items[i].OrderDetailQty && (!hasPlates || (hasPlates && !splitOrder))) {
                                    checkProduction = false;
                                    response.items[i].shipDate = getShipDate(new Date(SDAvail.dateValue), userLocation, false, false, false, !isPurepitch);
                                    response.items[i].Warehouse = 9;
                                } else if (parseInt(ASHAvail.availQtyToShip) >= response.items[i].OrderDetailQty && splitOrder) {
                                    checkProduction = false;
                                    response.items[i].shipDate = getShipDate(new Date(ASHAvail.dateValue), userLocation, false, false, true, !isPurepitch);
                                    response.items[i].Warehouse = 11;
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
                                if (response.items[i].OrderDetailQty <= parseInt(packagingWOs[j].availQtyToShip)) {
                                    response.items[i].shipDate = getShipDate(new Date(packagingWOs[j].dateValue), userLocation, userLocation != 2, userLocation == 7, false, !isPurepitch);
                                    response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
                                    j = packagingWOs.length;
                                }
                            }

                            if (!response.items[i].shipDate) {
                                if (leadTime) {
                                    var shipDate = new Date(SDLocalTime);
                                    response.items[i].shipDate = getShipDate(
                                        shipDate.setDate(SDLocalTime.getDate() + leadTime),
                                        userLocation,
                                        userLocation != 2,
                                        userLocation == 7,
                                        false,
                                        !isPurepitch
                                    );
                                    response.items[i].Warehouse = parseInt(warehouseMap(userLocation));
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
              	var couponId = getCouponId(response.couponCode.toUpperCase());
              	if (couponId != 0) {
                	fakeOrder.setValue({ fieldId: "promocode", text: couponId });
                }
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

            return SendMessage(response);
        } catch (error) {
            logError("put, cust:" + response.id, error);
            return { error: error };
        }
    }

    //Place Order
    function post(input) {
        var message = ReceiveMessage(input);

        if (message.get) {
            try {
                if (message.admin) {
                    //CSR Order History
                    message.orderHistory = [];

                    var filters = [];
                    filters.push(search.createFilter({ name: "salesrep", operator: search.Operator.ANYOF, values: message.id }));
                    filters.push(search.createFilter({ name: "type", operator: search.Operator.ANYOF, values: "SalesOrd" }));
                    filters.push(search.createFilter({ name: "mainline", operator: search.Operator.IS, values: true }));
                    filters.push(search.createFilter({ name: "datecreated", operator: search.Operator.NOTBEFORE, values: "startOfLastMonth" }));

                    var columns = [];
                    columns.push(search.createColumn({ name: "total" }));
                    columns.push(search.createColumn({ name: "tranid" }));
                    columns.push(search.createColumn({ name: "shipdate" }));
                    columns.push(search.createColumn({ name: "custbody_expected_delivery_date" }));
                    columns.push(search.createColumn({ name: "datecreated" }));
                    columns.push(search.createColumn({ name: "statusref" }));
                    columns.push(search.createColumn({ name: "entity" }));
                    columns.push(search.createColumn({ name: "currency" }));

                    search
                        .create({ type: "transaction", filters: filters, columns: columns })
                        .run()
                        .each(function(result) {
                            var order = {};
                            order.id = parseInt(result.id);
                            order.orderNum = result.getValue({ name: "tranid" });
                            order.totalPrice = result.getValue({ name: "total" });
                            order.orderDate = result.getValue({ name: "datecreated" });
                            order.status = result.getText({ name: "statusref" });
                            order.companyName = result.getText({ name: "entity" });
                            order.deliverydate = result.getValue({ name: "custbody_expected_delivery_date" });
                            order.shipdate = result.getValue({ name: "shipdate" });
                            order.currency = result.getValue({ name: "currency" });

                            message.orderHistory.unshift(order);
                            return true;
                        });
                } else if (message.admin == false) {
                    //Regular User Order History
                    message.orderHistory = [];

                    var filters = [];

                    filters.push(search.createFilter({ name: "entity", operator: search.Operator.ANYOF, values: message.id }));
                    filters.push(search.createFilter({ name: "type", operator: search.Operator.ANYOF, values: "SalesOrd" }));
                    filters.push(search.createFilter({ name: "custitem_include_in_ymo_website", join: "item", operator: search.Operator.IS, values: true }));

                    var columns = [];
                    columns.push(search.createColumn({ name: "entity" }));
                    columns.push(search.createColumn({ name: "total" }));
                    columns.push(search.createColumn({ name: "item" }));
                    columns.push(search.createColumn({ name: "quantity" }));
                    columns.push(search.createColumn({ name: "rate" }));
                    columns.push(search.createColumn({ name: "tranid" }));
                    columns.push(search.createColumn({ name: "billaddress" }));
                    columns.push(search.createColumn({ name: "shipaddress" }));
                    columns.push(search.createColumn({ name: "shipdate" }));
                    columns.push(search.createColumn({ name: "custbody_expected_delivery_date" }));
                    columns.push(search.createColumn({ name: "datecreated" }));
                    columns.push(search.createColumn({ name: "statusref" }));
                    columns.push(search.createColumn({ name: "subsidiary" }));
                    columns.push(search.createColumn({ name: "shipmethod" }));
                    columns.push(search.createColumn({ name: "shippingamount" }));
                    columns.push(search.createColumn({ name: "trackingnumbers" }));
                    columns.push(search.createColumn({ name: "currency" }));

                    var orders = {};
                    search
                        .create({ type: "transaction", filters: filters, columns: columns })
                        .run()
                        .each(function(result) {
                            var orderID = parseInt(result.id);

                            if (!orders[orderID]) {
                                orders[orderID] = {};
                                orders[orderID].id = parseInt(orderID);
                                orders[orderID].companyName = result.getText({ name: "entity" });
                                orders[orderID].items = [];
                                orders[orderID].shipdate = result.getValue({ name: "shipdate" });
                                orders[orderID].totalPrice = result.getValue({ name: "total" });
                                orders[orderID].billaddress = result.getValue({ name: "billaddress" });
                                orders[orderID].shipaddress = result.getValue({ name: "shipaddress" });
                                orders[orderID].orderNum = result.getValue({ name: "tranid" });
                                orders[orderID].deliverydate = result.getValue({ name: "custbody_expected_delivery_date" });
                                orders[orderID].orderDate = result.getValue({ name: "datecreated" });
                                orders[orderID].status = result.getText({ name: "statusref" });
                                orders[orderID].trackingNumber = result.getValue({ name: "trackingnumbers" }) ? result.getValue({ name: "trackingnumbers" }) : "N/A";
                                orders[orderID].currency = result.getValue({ name: "currency" });

                                orders[orderID].subsidiary = result.getValue({ name: "subsidiary" });

                                orders[orderID].shipmethod = result.getText({ name: "shipmethod" });
                                orders[orderID].shipTotal = result.getValue({ name: "shippingamount" });
                            }

                            var item = {};

                            item.id = result.getValue({ name: "item" });
                            item.name = result.getText({ name: "item" });
                            item.quantity = parseFloat(result.getValue({ name: "quantity" }));
                            item.price = parseFloat(result.getValue({ name: "rate" }));

                            orders[orderID].items.push(item);
                            return true;
                        });

                    var keys = Object.keys(orders);

                    for (var i = keys.length - 1; i >= 0; i--) {
                        message.orderHistory.push(orders[keys[i]]);
                    }
                } //Get Past Order
                else {
                    var salesOrderRecord = record.load({ type: record.Type.SALES_ORDER, id: message.id });

                    message.items = [];
                    message.companyName = salesOrderRecord.getText({ fieldId: "entity" });
                    message.shipdate = salesOrderRecord.getValue({ fieldId: "shipdate" });
                    message.totalPrice = salesOrderRecord.getValue({ fieldId: "total" });
                    message.billaddress = salesOrderRecord.getValue({ fieldId: "billaddress" });
                    message.shipaddress = salesOrderRecord.getValue({ fieldId: "shipaddress" });
                    message.orderNum = salesOrderRecord.getValue({ fieldId: "tranid" });
                    message.deliverydate = salesOrderRecord.getValue({ fieldId: "custbody_expected_delivery_date" });
                    message.orderDate = salesOrderRecord.getValue({ fieldId: "createddate" });
                    message.status = salesOrderRecord.getValue({ fieldId: "status" });

                    message.subsidiary = parseInt(salesOrderRecord.getValue({ fieldId: "subsidiary" }));

                    message.shipmethod = salesOrderRecord.getText({ fieldId: "shipmethod" });
                    message.shipTotal = salesOrderRecord.getValue({ fieldId: "shippingcost" });

                    message.currency = salesOrderRecord.getValue({ fieldId: "currency" });

                    var trackingNumber = salesOrderRecord.getValue({ fieldId: "linkedtrackingnumbers" });
                    if (trackingNumber) {
                        message.trackingNumber = trackingNumber;
                    } else {
                        message.trackingNumber = "N/A";
                    }

                    for (var i = 0; i < salesOrderRecord.getLineCount({ sublistId: "item" }); i++) {
                        var item = {};
                        item.id = salesOrderRecord.getSublistValue({ sublistId: "item", fieldId: "item", line: i });
                        item.name = salesOrderRecord.getSublistText({ sublistId: "item", fieldId: "item", line: i });
                        item.quantity = salesOrderRecord.getSublistValue({ sublistId: "item", fieldId: "quantity", line: i });
                        item.price = salesOrderRecord.getSublistValue({ sublistId: "item", fieldId: "rate", line: i });
                        message.items.push(item);
                    }
                }

                return SendMessage(message);
            } catch (error) {
                logError("get cust:" + message.id, error);
                return { error: error };
            }
        } // Create new Sales Order
        else {
            try {
                var response = { orderNum: [] };

                var billaddressindex;
                var shipaddressindex;
                var today = new Date();

                var customerRecord = record.load({ type: record.Type.CUSTOMER, id: message.user.id });
                var userLocation = parseInt(customerRecord.getValue({ fieldId: "subsidiary" }));

                var WillCall = null;
                if (
                    [3470, 3472, 13332, 3469, 3511].indexOf(parseInt(message.user.shipmethod)) >= 0 ||
                    (!message.user.shipmethod && [3470, 3472, 13332, 3469, 3511].indexOf(parseInt(customerRecord.getValue({ fieldId: "shippingitem" }))) >= 0)
                ) {
                    if (message.user.shipmethod) {
                        WillCall = parseInt(message.user.shipmethod);
                    } else {
                        WillCall = parseInt(customerRecord.getValue({ fieldId: "shippingitem" }));
                    }
                }

                var shipAddressIndex = customerRecord.findSublistLineWithValue({ sublistId: "addressbook", fieldId: "id", value: String(message.user.shipping.id) });
                var billAddressIndex = customerRecord.findSublistLineWithValue({ sublistId: "addressbook", fieldId: "id", value: String(message.user.billing.id) });

                for (var i = 0; i < message.order.items.length; i++) {
                    if (!message.order.items[i].done) {
                        // Initialize new sales order object
                        var salesOrderRecord = record.create({ type: record.Type.SALES_ORDER, isDynamic: true });

                        if (message.creditID) {
                            salesOrderRecord.setValue({ fieldId: "customform", value: 102 });
                            salesOrderRecord.setValue({ fieldId: "entity", value: message.user.id });
                            salesOrderRecord.setValue({ fieldId: "creditcard", value: message.user.card.id });
                        } else {
                            salesOrderRecord.setValue({ fieldId: "customform", value: 101 });
                            salesOrderRecord.setValue({ fieldId: "entity", value: message.user.id });
                            if (
                                parseInt(customerRecord.getValue({ fieldId: "subsidiary" })) != 2 &&
                                (!customerRecord.getValue({ fieldId: "terms" }) || customerRecord.getValue({ fieldId: "terms" }) == 10)
                            ) {
                                salesOrderRecord.setValue({ fieldId: "terms", value: 13 }); //Bank transfer required for non US
                            }
                        }

                        salesOrderRecord.setValue({ fieldId: "trandate", value: today });

                        if (shipAddressIndex >= 0) {
                            salesOrderRecord.setValue({ fieldId: "shipaddresslist", value: String(message.user.shipping.id) });
                        } else {
                            throw { message: "No shipping address provided. Cannot place order", code: 0 };
                        }

                        if (billAddressIndex >= 0) {
                            salesOrderRecord.setValue({ fieldId: "billaddresslist", value: String(message.user.billing.id) });
                        } else {
                            throw { message: "No billing address provided. Cannot place order", code: 0 };
                        }

                        salesOrderRecord.setValue({ fieldId: "custbody_wl_ymo_synced", value: true });

                        if (message.comment) {
                            salesOrderRecord.setValue({ fieldId: "memo", value: message.comment.substring(0, 997) });
                        }

                        if (message.order.PONum) {
                            salesOrderRecord.setValue({ fieldId: "otherrefnum", value: message.order.PONum });
                        }

                        if (message.user.shipmethod != -3) {
                            salesOrderRecord.setValue({ fieldId: "shipmethod", value: message.user.shipmethod });
                        }

                        salesOrderRecord.setValue({ fieldId: "shipdate", value: new Date(message.order.items[i].shipDate) });

                        if (WillCall) {
                            setWillCallAddress(WillCall, salesOrderRecord, salesOrderRecord.getText({ fieldId: "entity" }));
                        } else if (shipaddressindex >= 0) {
                            salesOrderRecord.setValue({ fieldId: "shipaddresslist", value: shipaddressindex });
                        }

                      	var couponId = 0;
                        if (message.order.couponCode) {
                          	try {
                            	couponId = getCouponId(message.order.couponCode.toUpperCase());
                            	if (couponId != 0) {
                                  	//line below is for non-SuitePromotions environment
                                	//salesOrderRecord.setValue({ fieldId: "promocode", value: couponId });

                                  	//These lines are for SuitePromotions environment
                                	salesOrderRecord.selectNewLine({ sublistId: "promotions" });
                                   	salesOrderRecord.setCurrentSublistValue({ sublistId: "promotions", fieldId: "promocode", value: couponId });
                                  	salesOrderRecord.commitLine({ sublistId: "promotions" });
                            	}
                            } catch (err) {
                              	logError('place-order', err);
                              	if (!message.comment) {
                                	message.comment = "Coupon " + message.order.couponCode + " used but could not be applied";
                                } else {
                                  	message.comment += "|Coupon " + message.order.couponCode + " used but could not be applied";
                                }
                            }
                        }

                        salesOrderRecord.selectNewLine({ sublistId: "item" });
                        salesOrderRecord.setCurrentSublistValue({ sublistId: "item", fieldId: "item", value: message.order.items[i].MerchandiseID });
                        salesOrderRecord.setCurrentSublistValue({ sublistId: "item", fieldId: "quantity", value: message.order.items[i].OrderDetailQty });
                        salesOrderRecord.setCurrentSublistValue({ sublistId: "item", fieldId: "location", value: message.order.items[i].Warehouse });
                        salesOrderRecord.commitLine({ sublistId: "item" });

                        for (var j = i + 1; j < message.order.items.length; j++) {
                            if (compareDates(new Date(message.order.items[i].shipDate), new Date(message.order.items[j].shipDate)) == 0) {
                                salesOrderRecord.selectNewLine({ sublistId: "item" });
                                salesOrderRecord.setCurrentSublistValue({ sublistId: "item", fieldId: "item", value: message.order.items[j].MerchandiseID });
                                salesOrderRecord.setCurrentSublistValue({ sublistId: "item", fieldId: "quantity", value: message.order.items[j].OrderDetailQty });
                                salesOrderRecord.setCurrentSublistValue({ sublistId: "item", fieldId: "location", value: message.order.items[j].Warehouse });
                                salesOrderRecord.commitLine({ sublistId: "item" });
                                message.order.items[j].done = true;
                            }
                        }

                        var id = salesOrderRecord.save({ enableSourcing: true });

                        if (message.salesrep && message.salesrep != 43148) {
                            //CSR orders
                            var updatedRecord = record.load({ type: record.Type.SALES_ORDER, id: id });
                            updatedRecord.setValue({ fieldId: "salesrep", value: message.salesrep });
                            updatedRecord.save();
                        }

                        if (id != null && id != 0) {
                            response.orderNum.push(parseInt(id));
                        } else {
                            throw { message: "failed to submit order", code: -1 };
                        }
                    }
                }
                return SendMessage(response);
            } catch (error) {
                logError("post cust:" + message.user.id, error);
                return { error: error };
            }
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
                try {
                    return record.load({ type: record.Type.ASSEMBLY_ITEM, id: NSID });
                } catch (error) {
                    return record.load({ type: record.Type.INVENTORY_ITEM, id: NSID });
                }
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
                    try {
                        return record.load({ type: record.Type.ASSEMBLY_ITEM, id: NSID });
                    } catch (error) {
                        return record.load({ type: record.Type.INVENTORY_ITEM, id: NSID });
                    }
                }
        }
    }

    function getCouponId(couponCode) {
      	var filters = [];
      	filters.push(search.createFilter({name: 'code', operator: search.Operator.IS, values: couponCode}));

      	var columns = [];
      	columns.push(search.createColumn({name: 'internalid'}));

      	var couponIds = [];

      	try {
          search.create({type: 'promotionCode', filters: filters, columns: columns}).run().each(function(result) {
              var couponId = parseInt(result.getValue({ name: "internalid" }));
              couponIds.unshift(couponId);
          });
        } catch (err) {
          logError('getCouponId', err);
        }

	      if (couponIds.length > 0) {
          	return couponIds[0];
        } else {
          	return 0;
        }
    }

    function logError(func, error) {
        var errorText = error.code ? JSON.stringify(error.code) : error.toString();
        log.error({
            title: "ORDER - " + func,
            details: errorText
        });
    }

    return {
        get: get,
        put: put,
        post: post
    };
});

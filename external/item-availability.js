/**
 * author badams@whitelabs.com
 * custom module
 * wl_ba_cs_item_availability.js
 * @NApiVersion 2.x
 * last modified: 07/05/2018 BA
 */

var PACKAGINGMETHOD = {};
    PACKAGINGMETHOD.PurePitch = 1;
    PACKAGINGMETHOD.CustomPour = 2;
var ITEMDATA = {}; // property is set in GetAvailInv() for use in all other functions
    ITEMDATA.Volume = 1;
    ITEMDATA.ItemInternalId = 0;
var YEASTEXPCUSTCAT = {}; //custom customer category ids from customlist_wl_yeast_exp_date_cust_type
    YEASTEXPCUSTCAT.NonWholesale = 1;
    YEASTEXPCUSTCAT.Wholesale = 2;
const EXPDAYSNONWHOLESALE = 30; //number of days to subtract from yeast expire date if non-wholesale customer
const EXPDAYSWHOLESALE = 90; //number of days to subtract from yeast expire date if wholesale customer
        
define(['N/record','N/search','N/format', 'N/redirect'],
    function(record,search,format,redirect) {
        const ADD = 'Add';
        const SUBTRACT = 'Subtract';
        const BACKORDER = 'BackOrder/Unfulfilled';
        const PRODUCTION = 'Production';
        const SHIPPING = 'Shipping';
        
    /**
     * The following function processes and returns all yeast availability data
     * @author badams@whitelabs.com
     * @param itemId, locationId[]
     * @return allData[], an array of objects
     * @governance ? 
     * @lastupdated 07/05/2018 BA
     */
    function GetItemAvailability(itemId,locationId, custCatId) {
        custCatId = custCatId || YEASTEXPCUSTCAT.NonWholesale; //optional parameter set default
        var expDays = GetYeastExpDays(custCatId);
        var allData = [];
        var packagingMethod = 0;
        var nonYeastAvailInv = GetNonYeastAvailInv(itemId,locationId);
        //// log.debug({title: 'Non Yeast Data', details: nonYeastAvailInv});
        
        if (nonYeastAvailInv.length > 0) {
            allData = nonYeastAvailInv; // do not push array, creates an array inside of an array[[]], YeastAvailAddRecords cannot read
        }
        else{
            packagingMethod = GetPackagingMethod(itemId);
            var itemData = GetItemData(itemId,locationId,packagingMethod,expDays);
            itemData.forEach(function(result) {
                allData.push(result);
            });
        }
        
        // sort array asc by date and then action
        allData.sort(function(a, b) {return new Date(a.dateValue) - new Date(b.dateValue) || a.action - b.action});
        
        //add or subtract qty value from previous availQty value, set availQty value
        var prevObjAvailQty = parseFloat(0);
        var prevObjDate = new Date();
        
        for (var i = 0; i < allData.length; i++) {
            var qtyMultiplier = 1;
            var thisObjQty = parseFloat(allData[i].qty);
            var thisObjAvailQty = parseFloat(0);
            if (packagingMethod == PACKAGINGMETHOD.CustomPour){qtyMultiplier = parseFloat(allData[i].volume)};
            
            if (allData[i].action == ADD){
                thisObjAvailQty = prevObjAvailQty + (thisObjQty * qtyMultiplier);
            }
            else if (allData[i].action == SUBTRACT) {
                thisObjAvailQty = prevObjAvailQty - (thisObjQty * qtyMultiplier);
            }
            
            allData[i].availQty = thisObjAvailQty;
            prevObjAvailQty = thisObjAvailQty;
        };
            
        //set availQtyToShip value
        allData.reverse();
        prevObjDate = new Date();
        var prevObjAction = ADD;
        var prevObjAvailQtyToShip = parseFloat(0);
        var prevObjType = '';
        
        for (var i = 0; i < allData.length; i++) {
            var thisObjDate = allData[i].dateValue;
            var thisObjAvailQty = parseFloat(allData[i].availQty);
            var thisObjAvailQtyToShip = parseFloat(0); 
            var thisObjAction = allData[i].action;
            var thisObjType = allData[i].type; //12/26
            
            if(thisObjDate != prevObjDate && prevObjAction == SUBTRACT && thisObjAvailQty > prevObjAvailQtyToShip 
                    && prevObjType == BACKORDER){
                thisObjAvailQtyToShip = prevObjAvailQtyToShip; // 12/26
            }
            else if (new Date(thisObjDate).getTime() == new Date(prevObjDate).getTime()) {
                thisObjAvailQtyToShip = prevObjAvailQtyToShip;
            }
            else {
                thisObjAvailQtyToShip = thisObjAvailQty;
            }
            
            allData[i].availQtyToShip = thisObjAvailQtyToShip;
            prevObjAction = thisObjAction;
            prevObjDate = thisObjDate;
            prevObjAvailQtyToShip = thisObjAvailQtyToShip;
            prevObjType = thisObjType;
        };
        
        allData.reverse();
        return allData; 
    };
    
    /**
     * The following function retrieves all the data associated with the Yeast Avail Request
     * @author badams@whitelabs.com
     * @param itemId, locationid, packagingMethod
     * @return array of items containing all the data
     * @governance ? units 
     * @lastModified 4/4/2018
     */
    function GetItemData(itemId,locationId, packagingMethod,expDays) {
        var allData = [];
        var purePitchItems = [];
        
        if (packagingMethod == PACKAGINGMETHOD.CustomPour){
            var itemParent = GetItemParent(itemId);
            // log.debug ({title: 'itemParent', details: itemParent});
            
            var ppItem = GetPurePitchItems(itemParent);
            ppItem.forEach(function(result) {
                purePitchItems.push(result);
            });
        }
            else if (packagingMethod == PACKAGINGMETHOD.PurePitch){
                purePitchItems = [itemId];
            }
            
        for (var i = 0; i < purePitchItems.length; i++) {
            // log.debug ({title: 'purePitchItems', details: purePitchItems[i]});
            
            var availInvData = GetAvailInv(purePitchItems[i],locationId); // get item Available Qty
            availInvData.forEach(function(result){
                allData.push(result);
            });
            
            if (packagingMethod == PACKAGINGMETHOD.PurePitch){
                var itemLocationProdId = GetRelatedLocationCriteria(locationId,PRODUCTION);
                var packWOData = GetPackagingWOs(purePitchItems[i],itemLocationProdId); // get finished goods packaging work orders
                packWOData.forEach(function(result){
                    allData.push(result);
                });
            };
            
            var backOrderData = GetBackOrdersUnfulfilled(purePitchItems[i],locationId); // get uncommitted orders
            backOrderData.forEach(function(result){
                allData.push(result);
            });
            
            var yeastExpireData = GetYeastExpiration(purePitchItems[i],locationId,expDays); // get yeast expiring in the next three weeks
            yeastExpireData.forEach(function(result){
                allData.push(result);
            });
            
            var transferOrderSanToAvl = GetSanToAvlTransferOrder(purePitchItems[i],locationId);  // get SAN to AVL Transfer Order items
            transferOrderSanToAvl.forEach(function(result){
                allData.push(result);
            });
        
        };
        return allData;
    };
    
    /**
     * The following function returns an item's Available Qty
     * @author badams@whitelabs.com
     * @param itemId, locationId
     * @return availQty object
     * @governance ? 
     */
    function GetAvailInv(itemInternalId,itemLocationId) {
        var mySearch = search.load({id: 'customsearch_wl_ba_inv_avail_by_loc_item' });
        var myFilters = mySearch.filters; //retrieve saved search filters
        var availInvData = [];
        
        myFilters.push(search.createFilter({
            name: 'internalid',
            operator: 'ANYOF',
            values: itemInternalId
        }));
        
        myFilters.push(search.createFilter({
            name: 'inventorylocation',
            operator: 'ANYOF',
            values: itemLocationId
        })); 
        
        mySearch.filters = myFilters; // add new myFilters to existing saved search filters
        //// log.debug ({title: 'filter expression',details: mySearch.filterExpression});
        
        var searchResult = mySearch.run();
        searchResult.each(function(result){      
            var availQty = result.getValue({name: 'formulanumeric'});// nvl({locationquantityavailable},0)
            var invLoc = result.getValue({name: 'inventoryLocation'});
            ITEMDATA.Volume = result.getValue({name: 'memberquantity'}); //set volume for entire file use
            ITEMDATA.ItemInternalId = result.id //result.getValue({name: 'internalid'}); //set item internalId for entire file use
            var todaysDate = new Date();
            var dateString = format.format({value:todaysDate,type:format.Type.DATE});
            var availQtyTxt = 'Avail Qty';
        
            var data = {type: availQtyTxt,
                        action: ADD,
                        qty: availQty,
                        availQty: 0,
                        availQtyToShip: 0,
                        dateValue: dateString,
                        inventoryLocation: invLoc,
                        volume: ITEMDATA.Volume,
                        item: ITEMDATA.ItemInternalId};
        
            availInvData.push(data);
        
            return true; //must use with .each  
        });
        
        return availInvData;
    };
    
    /**
     * The following function gets packaging work orders
     * @author badams@whitelabs.com
     * @param itemId, itemlocationProdId
     * @return packWOData[], an array of objects
     * @governance ? 
     */
    function GetPackagingWOs(itemInternalId,itemLocationProdId) {
        var mySearch = search.load({id: 'customsearch_wl_ba_packaging_work_orders'});   
        var myFilters = mySearch.filters;
        var packWOData = [];
            
        myFilters.push(search.createFilter({
            name: 'item',
            operator: 'ANYOF',
            values: itemInternalId
        }));

        myFilters.push(search.createFilter({
            name: 'location',
            operator: 'ANYOF',
            values: itemLocationProdId
        }));
            
            mySearch.filters = myFilters;
               
            var searchResult = mySearch.run().getRange({
            start: 0,
            end: 100
            });
                    
        for (var i = 0; i < searchResult.length; i++) {
            var deliveryDate = new Date(searchResult[i].getValue({name: 'custbodyiqfwodeliverydate', summary: 'GROUP'}));
            var dateString = format.format({value:deliveryDate,type:format.Type.DATE});
            var estQty = searchResult[i].getValue({name: 'quantity', summary: 'SUM'});
            var invLoc = searchResult[i].getValue({name: 'location', summary: 'GROUP'});
            const PACKWO = 'Packaging WO';

            var data = {type: PACKWO,
                        action: ADD,
                        qty: estQty,
                        availQty: 0,
                        availQtyToShip: 0,
                        dateValue: dateString,
                        inventoryLocation: invLoc,
                        volume: ITEMDATA.Volume,
                        item: ITEMDATA.ItemInternalId};
            
            packWOData.push(data);
        }; 
        return packWOData;
    };
    
    /**
     * The following function returns yeast finished goods expiration dates
     * @author badams@whitelabs.com
     * @param itemId, locationId, expDays
     * @return yeastExpiration[], an array of objects
     * @governance ?
     * @lastupdated 05/04/2018 BA 
     */
    function GetYeastExpiration(itemInternalId,itemLocationId,expDays){
        // start: get when yeast will expire by item and location for the next 3 weeks
        var mySearch = search.load({id: 'customsearchwl_ba_item_inv_lot_num_exp_3'});//WL BA Item Inventory Lot Num Exp Date
        var myFilters = mySearch.filters;
        var yeastExpiration = [];
    
        myFilters.push(search.createFilter({
            name: 'internalidnumber',
            operator: 'EQUALTO',
            values: itemInternalId
        }));
    
        myFilters.push(search.createFilter({
            name: 'location',
            join: 'inventorynumber',
            operator: 'ANYOF',
            values: itemLocationId
        }));
    
        mySearch.filters = myFilters;
       
        var searchResult = mySearch.run();        
        searchResult.each(function(result){
            var expireDate = new Date(result.getValue({name: 'expirationdate', join: 'inventorynumber'}));
            expireDate.setDate(expireDate.getDate()-expDays); //subtract expiration days from expiration date
            var dateString = format.format({value: expireDate,type: format.Type.DATE});
            var qty = result.getValue({name: 'quantityavailable', join: 'inventorynumber'});
            var invLoc = result.getValue({name: 'location', join: 'inventorynumber'});
            //var item = result.getValue({name: 'internalid'});
            const TYPE = 'Expiration';
        
            var data = {type: TYPE,
                        action: SUBTRACT,
                        qty: qty,
                        availQty: 0,
                        availQtyToShip: 0,
                        dateValue: dateString,
                        inventoryLocation: invLoc,
                        volume: ITEMDATA.Volume,
                        item: ITEMDATA.ItemInternalId};
        
            yeastExpiration.push(data);
            
            return true; //must use with .each  
        });
    
        return yeastExpiration;
    };
    
    /**
     * The following function gets backorders and unfulfilled orders data
     * @author badams@whitelabs.com
     * @param itemId, locationId
     * @return backOrderUnfulfilled[], an array of objects
     * @governance ? 
     */
    function GetBackOrdersUnfulfilled(itemInternalId,itemLocationId){
        // start: get backordered quantity by item and location
        var mySearch = search.load({id: 'customsearch_wl_ba_ymo_futureavail_ns'});
        var myFilters = mySearch.filters;
        var backOrderUnfulfilled = [];
        
        myFilters.push(search.createFilter({
            name: 'item',
            operator: 'ANYOF',
            values: itemInternalId
        }));
        
        myFilters.push(search.createFilter({
            name: 'location',
            operator: 'ANYOF',
            values: itemLocationId
        }));
        
        mySearch.filters = myFilters;
           
        var searchResult = mySearch.run();        
        searchResult.each(function(result){
            var expShipDate = new Date(result.getValue({name: 'custcol_wl_ymo_exp_ship_date', summary: 'GROUP'}));
            var dateString = format.format({value:expShipDate,type:format.Type.DATE});
            var unCommittedQty = result.getValue({name: 'formulanumeric', summary: 'SUM'}); // ({quantity}-(nvl({quantitycommitted},0) + nvl({quantityshiprecv},0)))
            var invLoc = result.getValue({name: 'location', summary: 'GROUP'});
            
            var data = {type: BACKORDER,
                        action: SUBTRACT,
                        qty: unCommittedQty,
                        availQty: 0,
                        availQtyToShip: 0,
                        dateValue: dateString,
                        inventoryLocation: invLoc,
                        volume: ITEMDATA.Volume,
                        item: ITEMDATA.ItemInternalId};
            
            backOrderUnfulfilled.push(data); 
                
            return true; //must use with .each  
        });
        
        return backOrderUnfulfilled;
    };
    
    /**
     * The following function gets SAN to AVL Transfer Orders
     * @author badams@whitelabs.com
     * @param itemId, locationId
     * @return transferOrders[], an array of objects
     * @governance ? 
     */
    function GetSanToAvlTransferOrder(itemInternalId,itemLocationId){
        // start: get backordered quantity by item and location
        var mySearch = search.load({id: 'customsearchwl_ba_trans_order_san_avl'});
        var myFilters = mySearch.filters;
        var transferOrders = [];
        
        myFilters.push(search.createFilter({
            name: 'item',
            operator: 'ANYOF',
            values: itemInternalId
        }));
        
        myFilters.push(search.createFilter({
            name: 'transferlocation',
            operator: 'ANYOF',
            values: itemLocationId
        }));
        
        mySearch.filters = myFilters;
           
        var searchResult = mySearch.run();        
        searchResult.each(function(result){
            var expRecDate = new Date(result.getValue({name: 'expectedreceiptdate'}));
            var dateString = format.format({value:expRecDate,type:format.Type.DATE});
            var qty = result.getValue({name: 'quantity'});
            var invLoc = result.getValue({name: 'transferlocation'});
            const TYPE = 'Transfer Order SAN to AVL';
            
            var data = {type: TYPE,
                        action: ADD,
                        qty: Math.abs(qty), //change negative number to positive number
                        availQty: 0,
                        availQtyToShip: 0,
                        dateValue: dateString,
                        inventoryLocation: invLoc,
                        volume: ITEMDATA.Volume,
                        item: ITEMDATA.ItemInternalId};
            
            transferOrders.push(data);
                
            return true; //must use with .each  
        });
        
        return transferOrders;
    };
    
    /**
     * The following function finds the locationId of a related location based upon a locationId and type
     * ex: input SAN Shipping locationid and return SAN Production Warehouse Id
     * @author badams@whitelabs.com
     * @param locationId, locationType = ex: 'Production'
     * @return locationId: string?
     * @governance 2 units 
     */
    function GetRelatedLocationId(locationId,locationType) {
        // log.debug({title: 'Location Id, Location Type',details: locationId + ', ' + locationType});
        var relatedLocationId = 0;
        if (locationId == null || locationId.length == 0) return false;
        var locationRec = record.load({
            type: record.Type.LOCATION, 
            id: locationId});
        var location = locationRec.getText({fieldId: 'name'}).substring(0,2); //return first 3 chars. of location
        
        var mySearch = search.create({
            type: "location",
            filters: [
                  ["name","contains", location], 
                  "AND", 
                  ["name","contains", locationType]
               ],
            columns: [
                  "internalid",
                  search.createColumn({name: "name",})
               ]
        });
            
        mySearch.run().each(function(result){
              relatedLocationId = result.getValue({name: 'internalId'});
        });
        return relatedLocationId;
    };
    
    /**
     * The following function receives an array of locationId's and a location type
     * @author badams@whitelabs.com
     * @param locationId[], locationType ex: Production, Shipping
     * @return allData[], an array of related location id's
     * @governance ? 
     * @lastModified 01/12/2018 BA
     */
    function GetRelatedLocationCriteria(locationId, locationType) {
        // log.debug({title: 'Location Id, Location Type, GetRelatedLocationCriteria',details: locationId + ', ' + locationType});
        var data =[];

        if (locationId == null || locationId.length == 0) return false;
        // log.debug({title: 'Did Not make it to here', details: 'bummer'});
        for (var i = 0; i < locationId.length; i++) {
            var id = GetRelatedLocationId(locationId[i],locationType);
            // log.debug({title:'LocationId(i)', details: locationId[i]})
            data.push(id);
        };
        // log.debug({title: 'data', details: data});
        return data;
    };
    
    /**
     * The following function receives a string YeastAvail custom list value and location type
     * @author badams@whitelabs.com
     * @param yeastAvailLoc, locationType ex: Production, Shipping
     * @return locationId
     * @governance ? 
     * @lastModified 01/12/2018 BA
     */
    function GetLocIdByYeastAvailLoc(yeastAvailLoc, locationType) {
        var locationId = 0;
        if (yeastAvailLoc == null || yeastAvailLoc.length == 0) return false;
        
        var mySearch = search.create({
            type: "location",
            filters: [
                  ["name","contains", yeastAvailLoc], 
                  "AND", 
                  ["name","contains", locationType]
               ],
            columns: [
                  "internalid",
                  search.createColumn({name: "name",})
               ]
        });
            
        mySearch.run().each(function(result){
              locationId = result.getValue({name: 'internalId'});
        });
        
        return locationId;
    };
    
    /**
     * The following function receives a locationId and returns the Location Name
     * @author badams@whitelabs.com
     * @param locationId
     * @return location name
     * @governance ? 
     * @lastModified
     */
    function GetLocationTextFromId(locationId) {
        if (locationId == null || locationId.length == 0) return false;
        var locRec = record.load({
            type: record.Type.LOCATION,
            id: locationId
        });
        
        var locName = locRec.getValue({fieldId: 'name'});
        return locName;
    };
    
    /**
     * The following function receives an itemId and returns the Item's Packaging Method
     * @author badams@whitelabs.com
     * @param itemId
     * @return Packaging Method [custitem_wl_packaging_methods]
     * @governance 5 units 
     * @lastModified 4/4/2018
     */
    function GetPackagingMethod(itemId) {
        if (itemId == null || itemId.length == 0) return false;
        var itemRec = record.load({
            type: record.Type.LOT_NUMBERED_ASSEMBLY_ITEM,
            id: itemId
        });
        
        var packagingMethod = itemRec.getValue({fieldId: 'custitem_wl_packaging_methods'});
        return packagingMethod;
    };
    
    /**
     * The following function receives an itemId and returns the Item's Parent
     * @author badams@whitelabs.com
     * @param itemId
     * @return parent
     * @governance 5 units 
     * @lastModified 4/4/2018
     */
    function GetItemParent(itemId) {
        if (itemId == null || itemId.length == 0) return false;
        var itemRec = record.load({
            type: record.Type.LOT_NUMBERED_ASSEMBLY_ITEM,
            id: itemId
        });
        
        var itemParent = itemRec.getValue({fieldId: 'parent'});
        return itemParent;
    };
    
    /**
     * The following function receives an itemParentId and returns the Item's PurePitch child Items (nano, 1.5L, 2L)
     * @author badams@whitelabs.com
     * @param itemParentId
     * @return Array [item internalids]
     * @governance ? units 
     * @lastModified 4/4/2018
     */
    function GetPurePitchItems(itemParent) {
        if (itemParent == null || itemParent.length == 0) return false;
        // log.debug ({title: 'itemParent From GetPurePitchItems', details: itemParent});
        var mySearch = search.load({id: 'customsearch_wl_ba_pp_exclude_hb'});
        var myFilters = mySearch.filters;
        var purePitchItems = [];
        
        myFilters.push(search.createFilter({
            name: 'parent',
            operator: 'ANYOF',
            values: itemParent
        }));
        
        mySearch.filters = myFilters;
           
        var searchResult = mySearch.run();        
        searchResult.each(function(result){
            //var ppItem = result.getValue({name: 'internalid'});
            var ppItem = result.id;
            // log.debug ({title: 'ppitem',details: ppItem});
            purePitchItems.push(ppItem); 
            return true; //must use with .each  
        });
        return purePitchItems;
    };
    
    /**
     * The following function receives a custom customer category id and returns number of days to subtract from yeast expire date 
     * @author badams@whitelabs.com
     * @param custCatId value from customlist_wl_yeast_exp_date_cust_type
     * @return number of days to subtract from expiration date
     * @governance 0 units 
     * @lastModified BA 5/4/2018
     */
    function GetYeastExpDays(custCatId) {
        if (custCatId == null || custCatId.length == 0) return EXPDAYSNONWHOLESALE;
        
        if (custCatId == YEASTEXPCUSTCAT.Wholesale){
            return EXPDAYSWHOLESALE;
        }
        else{
            return EXPDAYSNONWHOLESALE;
        }
        
    };
    
    /**
     * The following function returns a non yeast item's Available Qty
     * @author badams@whitelabs.com
     * @param itemId, locationId
     * @return availQty object
     * @governance ? 
     * @lastModified BA 7/5/2018
     */
    function GetNonYeastAvailInv(itemInternalId,itemLocationId) {
        var mySearch = search.load({id: 'customsearch_wl_ba_inv_avail_by_loc_it_3' }); //WL BA Inventory Available by Location and Item Non Yeast Items
        var myFilters = mySearch.filters; //retrieve saved search filters
        var availInvData = [];
        const YEASTDESGPRO = 2; // yeast desg pro id
        const PRODMETHPROPWP = 1; //prod method Propagation - WP Id
        
        myFilters.push(search.createFilter({
            name: 'internalid',
            operator: 'ANYOF',
            values: itemInternalId
        }));
        
        myFilters.push(search.createFilter({
            name: 'inventorylocation',
            operator: 'ANYOF',
            values: itemLocationId
        })); 
        
        mySearch.filters = myFilters; // add new myFilters to existing saved search filters
        //// log.debug ({title: 'filter expression',details: mySearch.filterExpression});
        
        var searchResult = mySearch.run();
        searchResult.each(function(result){      
            var availQty = result.getValue({name: 'formulanumeric'});// nvl({locationquantityavailable},0)
            var invLoc = result.getValue({name: 'inventoryLocation'});
            var yeastDesg = result.getValue({name: 'custitem_wl_yeast_designation'});
            var yeastProdMethod = result.getValue({name: 'custitem_wl_yeast_production_method'});
            //ITEMDATA.Volume = result.getValue({name: 'memberquantity'}); //set volume for entire file use
            ITEMDATA.ItemInternalId  = result.id;
            var todaysDate = new Date();
            var dateString = format.format({value:todaysDate,type:format.Type.DATE});
            var availQtyTxt = 'Avail Qty';
            
            if (yeastDesg == YEASTDESGPRO && yeastProdMethod == PRODMETHPROPWP) return availInvData; 
            
            var data = {type: availQtyTxt,
                        action: ADD,
                        qty: availQty,
                        availQty: 0,
                        availQtyToShip: 0,
                        dateValue: dateString,
                        inventoryLocation: invLoc,
                        volume: ITEMDATA.Volume,
                        item: ITEMDATA.ItemInternalId};
        
            availInvData.push(data);
        
            return true; //must use with .each  
        });
        
        return availInvData;
    };
    
    return {
        GetItemAvailability: GetItemAvailability,
        GetAvailInv: GetAvailInv,
        GetPackagingWOs: GetPackagingWOs,
        GetYeastExpiration: GetYeastExpiration,
        GetBackOrdersUnfulfilled: GetBackOrdersUnfulfilled,
        GetRelatedLocationId: GetRelatedLocationId,
        GetLocIdByYeastAvailLoc: GetLocIdByYeastAvailLoc,
        GetLocationTextFromId: GetLocationTextFromId
    };
});
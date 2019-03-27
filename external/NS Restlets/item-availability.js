/**
 * author badams@whitelabs.com
 * custom module
 * wl_ba_cs_item_availability.js
 * @NApiVersion 2.x
 * last modified: 01/23/2019 badams@whitelabs.com
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
var startTime = '';
const ADD = 'Add';
const SUBTRACT = 'Subtract';
const BACKORDER = 'BackOrder/Unfulfilled';
const PRODUCTION = 'Production';
const SHIPPING = 'Shipping';
	
define(['N/record','N/search','N/format', 'N/redirect','N/runtime','N/util'],
	function(record,search,format,redirect,runtime,util) {
		
		/**
		* The following function processes and returns all item availability data
		* The returned string is compiled as either isCombined = true: 1 item at 1 or more locations combined in one array(NSUI) or
		* isCombined = false: 1 or more items with 1 or more locations with each location and item in an array and compiled in serial
		* @author badams@whitelabs.com
		* @param itemId, locationId[], isCombined(optional), custCatId(optional)
		* @return allData[], an array of objects
		* @governance ? 
		* @lastupdated 01/17/2019 BA
		*/		
		function GetItemAvailability(itemId,locationId,isCombined,custCatId) {
			var startTime = util.nanoTime();
			custCatId = custCatId || YEASTEXPCUSTCAT.NonWholesale; //optional parameter set default
			isCombined = isCombined || false; //optional parameter set default to false, checks if to combine data = true
			//log.debug({title: 'isCombined2', details: isCombined});
			var expDays = GetYeastExpDays(custCatId);
			var allData = [];
			var serialData = [];
			var finalData = [];
			var packagingMethod = 0;
			var nonYeastAvailInv = {};
			
			//loop through each location and item
			locationId.forEach(function(resultLocation) {
				resultLocation = resultLocation.toString();
				var i = 0;
				itemId.forEach(function(resultItem){
					var scriptObj = runtime.getCurrentScript();
					i++;
					log.debug("Remaining governance units: " + scriptObj.getRemainingUsage());
					//log.debug({title: 'Item', details: resultItem});
					log.debug({title: 'No. Of items', details: i});
					resultItem = resultItem.toString();
					//nonYeastAvailInv = GetNonYeastAvailInv(resultItem,resultLocation);
					//wildYeastBacteria = GetWildYeastBacteriaAvailInv(resultItem,resultLocation);
					
					var isInventoryOnlyItem = GetIsInventoryOnlyItem(resultItem);

					if (isInventoryOnlyItem == true) {
						nonYeastAvailInv = GetInventoryOnlyItemData(resultItem,resultLocation);
						allData.push(nonYeastAvailInv);
						if (isCombined == false){
							finalData.push(allData);
							allData = [];
						}
					}
					
					else {
						packagingMethod = GetPackagingMethod(resultItem);
						//log.debug('Packaging Method ' + packagingMethod);
						var itemData = GetItemData(resultItem,resultLocation,packagingMethod,expDays);
						itemData.forEach(function(result) {
							allData.push(result);
							return true;
						})
					}
					
					if (isCombined == false && allData.length > 0) {
						serialData = CalculateItemAvailability(allData,packagingMethod);
						finalData.push(serialData);
						serialData = [];
						allData = [];
					}
						return true
				}) //itemId foreach
				
				if (isCombined == false && allData.length > 0) {
					serialData = CalculateItemAvailability(allData,packagingMethod);
					finalData.push(serialData);
					serialData = [];
					allData = [];
				}
				return true;
			}) //locationId foreach
			
			//log.debug({title: 'Final Data', details: finalData});
			var elapsedTime = (util.nanoTime() - startTime) / 1000000000;
			log.audit('Elapsed Time: ' + elapsedTime);
			if (finalData.length > 0) return finalData;
			
			return CalculateItemAvailability(allData,packagingMethod);

		}
		
		/**
	     * The following function performs the calculations on the returned data
	     * @author badams@whitelabs.com
	     * @param allData[], packaginMethod
	     * @return allData[], an array of objects
	     * @governance ? 
	     * @lastupdated 10/04/2018 BA
	     */
		function CalculateItemAvailability(allData,packagingMethod) {
			//log.debug({title: 'Calculate Item Avail', details: allData});
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
	    	var elapsedTime = (util.nanoTime() - startTime) / 1000000000;
	    	log.audit('Elapsed Time: ' + elapsedTime);
	    	return allData;	
		}
		
		/**
	     * The following function retrieves all data associated with the Yeast Avail Request
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
				log.debug ({title: 'itemParent', details: itemParent});
				
				var ppItem = GetPurePitchItems(itemParent);
		    	ppItem.forEach(function(result) {
					purePitchItems.push(result);
				});
			}

		    	else {
		    		purePitchItems = [itemId];
		    	}
				
			for (var i = 0; i < purePitchItems.length; i++) {
				log.debug ({title: 'purePitchItems', details: purePitchItems[i]});
				
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
			ITEMDATA.Volume = 1; //reset to 1 for next item
	    	return allData;
		};
		
		/**
	     * The following function returns an item's Available Qty
	     * @author badams@whitelabs.com
	     * @param itemId, locationId
	     * @return availQty object
	     * @governance 15 total, 5 search.load, 10 resultSet.each 
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
			//log.debug ({title: 'filter expression',details: mySearch.filterExpression});
			
			var searchResult = mySearch.run();
			searchResult.each(function(result){		 
				var availQty = result.getValue({name: 'formulanumeric'});// nvl({locationquantityavailable},0)
				var invLoc = result.getValue({name: 'inventoryLocation'});
				ITEMDATA.Volume = result.getValue({name: 'memberquantity'}); //set volume for entire file use
				ITEMDATA.ItemInternalId = result.id; //set item internalId for entire file use
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
	     * @governance 5 search.load 
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
	     * @governance 15 total, 5 search.load, 10 .each
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
	     * @governance 15 total, 5 search.load, 10 .each
	     */
	    function GetBackOrdersUnfulfilled(itemInternalId,itemLocationId){
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
	     * @governance 15 total, search.load = 5, .each = 10
	     */
	    function GetSanToAvlTransferOrder(itemInternalId,itemLocationId){
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
			log.audit ({title: 'filter expression TO',details: mySearch.filterExpression});
			
			var searchResultCount = mySearch.runPaged().count;
    		log.audit("transferorderSearchObj result count",searchResultCount);
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
	            
	            log.audit ({title: 'DataVarArray',details: data});
	            
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
	     * @governance 11 total, 1 search.lookupFields, 10 .each
	     * Last Modified: 11/27/2018 badams@whitelabs.com
	     */
		function GetRelatedLocationId(locationId,locationType) {
	    	var relatedLocationId = 0;
	    	if (locationId == null || locationId.length == 0) return false;
	    	var locationRecord = search.lookupFields({
		        type: search.Type.LOCATION,
		        id: locationId,
		        columns: ['name']
			});
	    	var location = locationRecord.name.substring(0,2); //return first 3 chars. of location
	    	
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
	     * @governance 0
	     * @lastModified 10/15/2018 BA
	     */
		function GetRelatedLocationCriteria(locationId, locationType) {
			//log.debug({title: 'Location Id, Location Type, GetRelatedLocationCriteria',details: locationId + ', ' + locationType});
			
			var data =[];

			if (locationId == null || locationId.length == 0) return false;
				var id = GetRelatedLocationId(locationId,locationType);
				//log.debug({title:'LocationId', details: id})
				data.push(id);
			//log.debug({title: 'Related Location', details: data});
			return data;
		};
		
		/**
	     * The following function receives a locationId and returns the Location Name, called externally
	     * @author badams@whitelabs.com
	     * @param locationId
	     * @return location name
	     * @governance 1 unit
	     * @lastModified
	     */
		function GetLocationTextFromId(locationId) {
			if (locationId == null || locationId.length == 0) return false;
			
			var locRec = search.lookupFields({
    	        type: search.Type.LOCATION,
    	        id: locationId,
    	        columns: ['name']
    		});
			
			var locName = locRec.name;
			return locName;
		};
		
		/**
	     * The following function receives an itemId and returns the Item's Packaging Method
	     * @author badams@whitelabs.com
	     * @param itemId
	     * @return Packaging Method [custitem_wl_packaging_methods]
	     * @governance 1 unit
	     * @lastModified 01/23/2019
	     */
		function GetPackagingMethod(itemId) {
			var packagingMethod = '';
			if (itemId == null || itemId.length == 0) return false;
			
			var itemRec = search.lookupFields({
    	        type: search.Type.LOT_NUMBERED_ASSEMBLY_ITEM,
    	        id: itemId,
    	        columns: ['custitem_wl_packaging_methods']
    		});
			
			if (itemRec.custitem_wl_packaging_methods[0]){
				packagingMethod = itemRec.custitem_wl_packaging_methods[0].value; //use [0].value for select fields to return id
			}
			return packagingMethod;
		};
		
		/**
	     * The following function receives an itemId and returns the Item's Parent
	     * @author badams@whitelabs.com
	     * @param itemId
	     * @return parent
	     * @governance 1 unit
	     * @lastModified 11/28/2018
	     */
		function GetItemParent(itemId) {
			if (itemId == null || itemId.length == 0) return false;
			
			var itemRec = search.lookupFields({
    	        type: search.Type.LOT_NUMBERED_ASSEMBLY_ITEM,
    	        id: itemId,
    	        columns: ['parent']
    		});
			
			var itemParent = itemRec.parent[0].value;
			return itemParent;
		};
		
		/**
	     * The following function receives an itemParentId and returns the Item's PurePitch child Items (nano, 1.5L, 2L)
	     * @author badams@whitelabs.com
	     * @param itemParentId
	     * @return Array [item internalids]
	     * @governance 15, 5 serach.load, 10 searchResult.each 
	     * @lastModified 4/4/2018
	     */
		function GetPurePitchItems(itemParent) {
			if (itemParent == null || itemParent.length == 0) return false;
			//log.debug ({title: 'itemParent From GetPurePitchItems', details: itemParent});
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
	            var ppItem = result.id;
	            //log.debug ({title: 'ppitem',details: ppItem});
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
	     * The following function receives an object and returns true if object is empty or false if it is not empty
	    * @author badams@whitelabs.com
	    * @param obj, object
	    * @return boolean, true if empty false if not empty
	    * @governance 0
	    * @lastModified BA 11/20/2018
	    */
	    function isEmptyObject(obj) { 
	    	for (var x in obj) return false;
	    		return true;
	    }
	    
	    /**
	     * The following looks up an item and determines if only the Avail Qty value is required. Not future availability
	     * Purpose is to speed up the process.
	     * @author badams@whitelabs.com
	     * @param itemId
	     * @return boolean true if only inventory, false if include future availability
	     * @governance 1 unit
	     * @lastModified 01/17/2019 badams@whitelabs.com
	     */
		function GetIsInventoryOnlyItem(itemId) {
			const WILD_YEAST_BACTERIA_CLASS = '4'; // Wild Yeast/Bateria class Id
			const PROPAGATION_WP = '1'; // Yeast Production Method List 'Propagation - WP' ID
			const BLENDING = '2'; // Yeast Production Method List 'Blending' ID
			
			if (itemId == null || itemId.length == 0) return false;
			var isInventoryOnlyItem = '';
			var itemClass = '';
			var itemProdMethod = '';
			var itemRec = search.lookupFields({
    	        type: search.Type.ITEM,
    	        id: itemId,
    	        columns: ['type','class','custitem_wl_yeast_production_method']
    		});

			if (itemRec.class[0]) itemClass = itemRec.class[0].value;
			
			if (itemRec.custitem_wl_yeast_production_method[0]){
				itemProdMethod = itemRec.custitem_wl_yeast_production_method[0].value};
			
			log.debug(itemClass + ' / ' + itemProdMethod);
			
			if (itemProdMethod == PROPAGATION_WP || itemProdMethod == BLENDING || itemClass == WILD_YEAST_BACTERIA_CLASS) {
				isInventoryOnlyItem = false;
			}
			else isInventoryOnlyItem = true;
				
			
			return isInventoryOnlyItem
		};
		
		 /**
	     * The following function returns a Inventory only item's data
	     * Functionality for only one line per location for the item the AvailQty value
	     * @author badams@whitelabs.com
	     * @param itemId, locationId
	     * @return availQty object
	     * @governance 10 resultSet.each
	     * @lastModified BA 12/26/2018
	     */
		function GetInventoryOnlyItemData(itemInternalId,itemLocationId) {
	    	var data = {};
			
	    	var itemSearchObj = search.create({
	    		   type: "item",
	    		   filters:
	    		   [
	    		      ["isinactive","is","F"], 
	    		      "AND", 
	    		      ["custitem_include_in_ymo_website","is","T"], 
	    		      "AND",  
	    		      ["internalid","anyof",itemInternalId], 
	    		      "AND", 
	    		      ["inventorylocation","anyof",itemLocationId]
	    		   ],
	    		   columns:
	    		   [
	    		      search.createColumn({
	    		         name: "itemid"
	    		      }),
	    		      search.createColumn({
	    		         name: "inventorylocation"
	    		      }),
	    		      search.createColumn({
	    		         name: "formulanumeric",
	    		         formula: "nvl({locationquantityavailable},0)"
	    		      })
	    		   ]
	    		});
	    	
	    		log.debug ({title: 'filter expression',details: itemSearchObj.filterExpression});
	    		itemSearchObj.run().each(function(result){
	    			var availQty = result.getValue({name: 'formulanumeric'});// nvl({locationquantityavailable},0)
	    			var invLoc = result.getValue({name: 'inventoryLocation'});
	    			ITEMDATA.ItemInternalId  = result.id;
	    			var todaysDate = new Date();
	    			var dateString = format.format({value:todaysDate,type:format.Type.DATE});
	    			var availQtyTxt = 'Avail Qty';
	    			
	    			data = {type: availQtyTxt,
	        				action: ADD,
	        				qty: availQty,
	        				availQty: 0,
	        				availQtyToShip: availQty,
	        				dateValue: dateString,
	        				inventoryLocation: invLoc,
	        				volume: ITEMDATA.Volume,
	        				item: ITEMDATA.ItemInternalId};
	        
	    			return true; //must use with .each	
	    		});
	        
	    		return data;
	    	};
    
    return {
    	GetItemAvailability: GetItemAvailability,
    	GetLocationTextFromId: GetLocationTextFromId,
    	GetSanToAvlTransferOrder: GetSanToAvlTransferOrder
    };
});
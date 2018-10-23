/**
*@NApiVersion 2.x
*@NScriptType Restlet
*Author: Dimitri Vasilev
*Date Modified: 10/23/18
*/

/* ***************
   * Description *
   ***************
   This endpoint was established to perform the following tasks for the White Labs App:
   1 - get | Get Inventory marked for sale
   2 - put | Get Alternate Sizes and Similar Strain Suggestions
 */

define(['N/record', 'N/log', 'N/search', 'N/cache', 'N/crypto', 'N/encode', './item-availability.js', '../Dom\ Dev\ Library/aes', '../Dom\ Dev\ Library/enc-base64-min.js', './YMO-LIB'],
function(record, log, search, cache, crypto, encode, itemAvailability)
{
   function put(input)
   {
       try
       {
           var message = ReceiveMessage(input);

           if(!(message.version && versionUpToDate(message.version)))
           {
               return { error: {message: 'App version is out of date. Please download new version.', code: 0}};
           }

           var response = {};

           if(message.alternateSizes)
           {
               response.alternateSizes = [];

               if(message.SaleItem.type == 1 && message.SaleItem.class != 32) //must be purepitch
               {
                   var sizeIndex = -1;
                   for (var i = message.ItemGroup.length - 1; i >= 0; i--)
                   {
                       if(message.ItemGroup[i] == message.SaleItem.MerchandiseID)
                       {
                           sizeIndex = parseInt(i);
                           break;
                       }
                   }

                   if(sizeIndex == -1)
                   {
                       throw {message: 'Sale Item isn\'t a sub item of ItemGroup', code: -1};
                   }

                   var quantity = message.SaleItem.OrderDetailQty * indexMultiplier(sizeIndex);
                   var possibleSizeConfigurations = calculateSizeAlternatives(quantity);

                   // US
                   if(message.subsidiary == 2)
                   {

                       var SDcurrentlyAvailable = [], ASHcurrentlyAvailable = [];
                       for (var i = 0; i < 3; i++)
                       {
                           var itemRecord = loadItem(message.ItemGroup[i]);
                           var SDAvailable = parseInt(findAvailableQuantity(itemRecord, 9));
                           var ASHAvailable = parseInt(findAvailableQuantity(itemRecord, 11));

                           SDcurrentlyAvailable.push(parseInt(SDAvailable));
                           ASHcurrentlyAvailable.push(parseInt(ASHAvailable));
                       }

                       var SDpossibleSizeConfigurations = [];
                       var ASHpossibleSizeConfigurations = [];
                       SDpossibleSizeConfigurations = SDpossibleSizeConfigurations.concat(possibleSizeConfigurations);
                       ASHpossibleSizeConfigurations = ASHpossibleSizeConfigurations.concat(possibleSizeConfigurations);
                       for (var i = 0; i < 3; i++)
                       {
                           SDpossibleSizeConfigurations = SDpossibleSizeConfigurations.filter(function(x) { return (x[i] <= SDcurrentlyAvailable[i]) });
                           ASHpossibleSizeConfigurations = ASHpossibleSizeConfigurations.filter(function(x) { return (x[i] <= ASHcurrentlyAvailable[i]) });
                       }

                       response.alternateSizes = prepareItems(message.id, SDpossibleSizeConfigurations, message.ItemGroup, 9);
                       response.alternateSizes = response.alternateSizes.concat(prepareItems(message.id, ASHpossibleSizeConfigurations, message.ItemGroup, 11));
                   }
                   // HK
                   else if(message.subsidiary == 5)
                   {
                       var HKcurrentlyAvailable = []
                       for (var i = 0; i < 3; i++)
                       {
                           var itemRecord = loadItem(message.ItemGroup[i]);
                           var HKAvailable = parseInt(findAvailableQuantity(itemRecord, 31));

                           HKcurrentlyAvailable.push(parseInt(SDAvailable));
                       }

                       var HKpossibleSizeConfigurations = [];
                       HKpossibleSizeConfigurations = HKpossibleSizeConfigurations.concat(possibleSizeConfigurations);
                       for (var i = 0; i < 3; i++)
                       {
                           HKpossibleSizeConfigurations = HKpossibleSizeConfigurations.filter(function(x) { return (x[i] <= HKcurrentlyAvailable[i]) });
                       }

                       response.alternateSizes = prepareItems(message.id, HKpossibleSizeConfigurations, message.ItemGroup, 31);
                   }
                   // CPH
                   else if(message.subsidiary == 7)
                   {
                       var CPcurrentlyAvailable = []
                       for (var i = 0; i < 3; i++)
                       {
                           var itemRecord = loadItem(message.ItemGroup[i]);
                           var CPAvailable = parseInt(findAvailableQuantity(itemRecord, 30));

                           CPcurrentlyAvailable.push(parseInt(SDAvailable));
                       }

                       var CPpossibleSizeConfigurations = [];
                       CPpossibleSizeConfigurations = CPpossibleSizeConfigurations.concat(possibleSizeConfigurations);
                       for (var i = 0; i < 3; i++)
                       {
                           CPpossibleSizeConfigurations = CPpossibleSizeConfigurations.filter(function(x) { return (x[i] <= CPcurrentlyAvailable[i]) });
                       }

                       response.alternateSizes = prepareItems(message.id, CPpossibleSizeConfigurations, message.ItemGroup, 30);
                   }



               }
               else
               {
                   throw {message: 'Invalid Item', code: -1};
               }
           }
           else
           {
               response.alternateStrains = [];
               if(message.SaleItem.type == 1 && message.SaleItem.class != 32) //must be purepitch
               {
                   var sizeIndex = -1;
                   for (var i = message.ItemGroup.length - 1; i >= 0; i--)
                   {
                       if(message.ItemGroup[i] == message.SaleItem.MerchandiseID)
                       {
                           sizeIndex = parseInt(i);
                           break;
                       }
                   }

                   if(sizeIndex == -1)
                   {
                       log.error({
                           title: 'SimilarStrain',
                           details: 'Sale Item isn\'t a sub item of ItemGroup'
                       });
                       throw {message: 'Sale Item isn\'t a sub item of ItemGroup', code: -1};
                   }

                   //find strains that are same size and quantity and contain beer styles
                   response.alternateStrains = findSimilarAvailableStrains(sizeIndex, message.SaleItem.OrderDetailQty, message.SaleItem.Warehouse, message.selectedStyles);

                   if(response.alternateStrains.length == 0)
                   {
                       throw {error: 'No Alternatives Found', code: -1};
                   }

                   response.alternateStrains = prepareItemsAltStrains(message.id, response.alternateStrains, message.SaleItem.Warehouse);
               }
               else
               {
                   throw {message: 'Invalid Item', code: -1};
               }
           }

           return SendMessage(response);
       }
       catch(err)
       {
           logError('get cust:' + response.id, err);
           return {error: err};
       }
   }

   function post(input)
   {
       try
       {
           var response = {version: versionUpToDate(), items: []};
           var message = ReceiveMessage(input);

           // var Inventory = cache.getCache({name: 'SaleInventory', scope: cache.Scope.PUBLIC});
           // try
           // {

           //     if(Inventory.get({key: 'active'}) && Inventory.get({key: 'InventoryHash'}) && message.InventoryHash && message.InventoryHash == Inventory.get({key: 'InventoryHash'}))
           //     {
           //         response.InventoryHash = true;
           //         return SendMessage(response);
           //     }
           // }
           // catch(err)
           // {
           //     //swallow error
           // }

           // Search for items ready to sync.
           var filters = [];
           filters.push(search.createFilter({name: 'type', operator: search.Operator.ANYOF, values: ['Assembly', 'InvtPart', 'Service']}));
           filters.push(search.createFilter({name: 'custitem_include_in_ymo_website', operator: search.Operator.IS, values: true}));
           filters.push(search.createFilter({name: 'isinactive', operator: search.Operator.IS, values: false}));
           filters.push(search.createFilter({name: 'pricinggroup', operator: search.Operator.IS, values: 'MSRP'}));
           filters.push(search.createFilter({name: 'internalid', join: 'inventorylocation', operator: search.Operator.IS, values: warehouseMap(message.subsidiary)})); //Filter by warehouse


           if(message.classFilters){
               filters.push(search.createFilter({name: 'class', operator: search.Operator.ANYOF, values: message.classFilters}));
           }

           var columns = [];
           columns.push(search.createColumn('parent'));
           columns.push(search.createColumn('itemid'));
           columns.push(search.createColumn('class'));
           columns.push(search.createColumn('displayname'));
           columns.push(search.createColumn('custitemauth_purchaser'));
           columns.push(search.createColumn('storedescription'));
           columns.push(search.createColumn('custitem_ymo_new_image_url'));
           columns.push(search.createColumn('custitem_ymo_is_private'));
           columns.push(search.createColumn('custitem_wl_attenuation_low'));
           columns.push(search.createColumn('custitem_wl_attenuation_high'));
           columns.push(search.createColumn('custitem_wl_flocculation'));
           columns.push(search.createColumn('custitem_wl_alcohol_tolerance'));
           columns.push(search.createColumn('custitem_wl_opt_ferm_faren_low'));
           columns.push(search.createColumn('custitem_opt_ferm_temp_high_faren'));
           columns.push(search.createColumn('custitem_wl_opt_ferm_celsius_low'));
           columns.push(search.createColumn('custitem_wl_opt_ferm_celsius_high'));
           columns.push(search.createColumn('custitem_wl_style_recommend'));
           columns.push(search.createColumn('custitem_wl_packaging_methods'));
           columns.push(search.createColumn('custitemsearchtags'));
           columns.push(search.createColumn('custitemwarehouse'));
           columns.push(search.createColumn('custitem_wl_yeast_strain_category'));
           columns.push(search.createColumn('custitembeerstyles'));
           columns.push(search.createColumn('custitem_wl_classlocation'));
           columns.push(search.createColumn('custitem_wl_classdates'));
           columns.push(search.createColumn('price'));
           columns.push(search.createColumn('custitem_wl_yeast_designation'));
           columns.push(search.createColumn('locationquantityavailable'));


           var inventory = search.create({type: 'item', filters: filters, columns: columns}).run();

           //initializations
           var index = 0, results, parentIDs = [], slantRetries = [];
           var  yeastMap = {}; //is a map such indexOfItemInResponse = yeastMap[parentName] => response[indexOfItemInResponse]

           do
           {
               results = inventory.getRange({start: index, end: index + 1000});
               index += 1000;

               for (var i = 0; i < results.length; i++)
               {
                   var slantExceptionStr = results[i].getValue({name: 'itemid'}).toLowerCase();
                   var itemName = String(results[i].getValue({name: 'itemid'}));
                   var displayName = String(results[i].getValue({name: 'displayname'}));
                   var parentName = results[i].getText({name: 'parent'});

                   if(parentName)
                   {

                       //retrieve yeast size/vol from name
                       var splitIndex = slantExceptionStr.indexOf('-');
                       var vol = slantExceptionStr.substring(splitIndex+1, slantExceptionStr.length);

                       //check if sibling item has been encountered before
                       if(yeastMap[parentName])
                       {
                           additionalYInfo(response.items[yeastMap[parentName]], results[i], vol);
                       }
                       else
                       {
                           addItem(response.items, results[i], parentName, vol);
                           yeastMap[parentName] = response.items.length - 1;
                           parentIDs.push(results[i].getValue({name: 'parent'}));
                       }
                   }
                   else if(slantExceptionStr.indexOf('slant') >= 0) //slants don't have parents and must be checked differently
                   {
                       //obtain the parent items name from item name
                       var splitIndex = slantExceptionStr.indexOf('-');
                       var parentName = results[i].getValue({name: 'itemid'});
                       parentName = parentName.substring(0,splitIndex);

                       //vol should be 'slant' see addVolId() for details
                       var vol = slantExceptionStr.substring(splitIndex+1, slantExceptionStr.length);

                       if(yeastMap[parentName])
                       {
                           //update item with slant item id
                           additionalYInfo(response.items[yeastMap[parentName]], results[i], vol);
                       }
                       else
                       {
                           slantRetries.push(results[i]); //Slant should never be the first item as they generally don't have the correct yeast attributes
                       }
                   }
                   else //Non Yeast Item
                   {
                       var itemClass = parseInt(results[i].getValue({name: 'class'}));

                       if([28, 27, 10].indexOf(itemClass) >= 0) //Education and Gift Shop Merchandise
                       {
                           if(itemClass == 28 && String(itemName.slice(-3)).toLowerCase() == "web")
                           {
                               var partSlice = itemName.slice(0, -3);
                               if(yeastMap[partSlice])
                               {
                                   additionalNYInfo(response.items[yeastMap[partSlice]], results[i], 1);
                               }
                               else
                               {
                                   addItem(response.items, results[i], null, 1);
                                   yeastMap[partSlice] = response.items.length - 1;
                               }
                           }
                           else if([27, 10].indexOf(itemClass) >= 0)
                           {

                               if(displayName.indexOf('DO NOT USE') < 0)
                               {
                                   var splitString = itemName.split('-');

                                   var volIDIndex = itemSizeToIndex(splitString[splitString.length-1]);

                                   if(volIDIndex == -1)
                                   {
                                       addItem(response.items, results[i], null, 0);
                                       yeastMap[itemName] = response.items.length - 1;
                                   }
                                   else
                                   {
                                       var partSlice = itemName.slice(0, itemName.lastIndexOf('-'));

                                       if(yeastMap[partSlice])
                                       {
                                           additionalNYInfo(response.items[yeastMap[partSlice]], results[i], volIDIndex);
                                       }
                                       else
                                       {
                                           addItem(response.items, results[i], null, volIDIndex);
                                           yeastMap[partSlice] = response.items.length - 1;

                                       }
                                   }
                               }
                           }
                           else if(yeastMap[itemName])
                           {
                               additionalNYInfo(response.items[yeastMap[itemName]], results[i], 0);
                           }
                           else if(!yeastMap[itemName])
                           {
                               addItem(response.items, results[i], null, 0);
                               yeastMap[itemName] = response.items.length - 1;
                           }
                       }
                       else //lab services & nutrients and enzymes
                       {
                           if(!yeastMap[itemName])
                           {
                               addItem(response.items, results[i], null, null);
                               yeastMap[itemName] = response.items.length - 1;
                           }
                       }
                   }
               }
           }
           while(results.length == 1000)

           for (var i = 0; i < slantRetries.length; i++)
           {
               var slantExceptionStr = slantRetries[i].getValue({name: 'itemid'}).toLowerCase();

               if(slantExceptionStr.indexOf('slant') >= 0)
               {
                   //obtain the parent items name from item name
                   var splitIndex = slantExceptionStr.indexOf('-');
                   var parentName = slantRetries[i].getValue({name: 'itemid'});
                   parentName = parentName.substring(0,splitIndex);

                   //vol should be 'slant' see addVolId() for details
                   var vol = slantExceptionStr.substring(splitIndex+1, slantExceptionStr.length);
                   if(yeastMap[parentName])
                   {
                       additionalYInfo(response.items[yeastMap[parentName]], slantRetries[i], vol);
                   }
               }
               else
               {
                   //Item is thrown out if it doesn't pass, may lead to possible missing slants
                   //nlapiLogExecution('ERROR', 'Failed to add slant, first item', 'Item: '+ slantRetries[i].getId());
               }
           }

           if(parentIDs.length > 0)
           {
               fixNames(response.items, yeastMap, parentIDs);
           }

           // var SHA256Hash = crypto.createHash({algorithm: crypto.HashAlg.SHA256});
           // SHA256Hash.update({input: JSON.stringify(response.items)});
           // var InventoryHash = SHA256Hash.digest({outputEncoding: encode.Encoding.UTF_8});
           // Inventory.put({key: 'InventoryHash', value: InventoryHash});
           // Inventory.put({key: 'active', value: true, ttl: 3600});
           // response.InventoryHash = InventoryHash;

           return SendMessage(response);
       }
       catch(err)
       {
           logError('get', err);
           return {error: err};
       }
   }

   //Helpers
   function indexMultiplier(index)
   {
       switch(index)
       {
           case 0:
               return 0.5;
           case 1:
               return 1.5;
           case 2:
               return 2;
       }
   }

   function indexToText(index)
   {
       switch(index)
       {
           case 0:
               return "Nano";
           case 1:
               return "1.5l";
           case 2:
               return "2l";
       }
   }

   function calculateSizeAlternatives(yeastQuantity)
   {
       var ref = {};
       return alternative(ref, parseFloat(yeastQuantity));
   }

   function alternative(ref, query)
   {
       if(ref[query])
       {
           return ref[query];
       }
       else
       {
           if(query == 0.5)
           {
               ref[query] = [[1, 0, 0]];
               return [[1, 0, 0]];
           }
           else if(query == 0)
           {
               ref[query] = [[0, 0, 0]];
               return [[0, 0, 0]]
           }
           else if(query < 0.5)
           {
               ref[query] = null;
               return null;
           }
           else
           {
               var solutions = [];
               var min = alternative(ref, query-0.5);
               if(min)
               {
                   solutions = solutions.concat(mapArray([1,0,0], min));
               }

               var middle = alternative(ref, query-1.5);
               if(middle)
               {
                   middle = mapArray([0,1,0], middle);

                   for(var i = 0, totalLength = solutions.length; i < totalLength; i++)
                   {
                       for(var j = 0; j < middle.length; j++)
                       {
                           if(compareArray(solutions[i], middle[j]))
                           {
                               middle.splice(j,1);
                           }
                       }
                   }

                   solutions = solutions.concat(middle);
               }

               var high = alternative(ref, query-2.0);
               if(high)
               {
                   high = mapArray([0,0,1], high);
                   for(var i = 0, totalLength = solutions.length; i < totalLength; i++)
                   {
                       for(var j = 0; j < high.length; j++)
                       {
                           if(compareArray(solutions[i], high[j]))
                           {
                               high.splice(j,1);
                           }
                       }
                   }

                   solutions = solutions.concat(high);
               }

               ref[query] = solutions;
               return solutions;
           }
       }
   }

   function compareArray(arr1, arr2)
   {
       return (arr1[0] == arr2[0] && arr1[1] == arr2[1] && arr1[2] == arr2[2]);
   }

   function mapArray(arr1, arr2)
   {
       var newArr = [];
       arr2.forEach(function(x)
       {
           var y = [];
           y[0] = x[0] + arr1[0];
           y[1] = x[1] + arr1[1];
           y[2] = x[2] + arr1[2];
           newArr.push(y);
       });
       return newArr;
   }

   function findAvailableQuantity(itemRecord, Warehouse)
   {
       return itemRecord.getSublistValue({sublistId: 'locations', fieldId: 'quantityavailable', line: itemRecord.findSublistLineWithValue({sublistId: 'locations', fieldId: 'locationid', value: String(Warehouse)})});
   }

   function loadItem(itemID)
   {
       try
       {
           return record.load({type: record.Type.ASSEMBLY_ITEM, id: itemID});
       }
       catch(err)
       {
           return record.load({type: record.Type.INVENTORY_ITEM, id: itemID});
       }
   }

   function findSimilarAvailableStrains(sizeIndex, quantity, Warehouse, beerStyles)
   {

       var items = [], SimilarStrainsSearch = search.create({type: 'item', filters: [], columns: []});
       SimilarStrainsSearch.filters.push(search.createFilter({name: 'internalid', join: 'inventorylocation', operator: search.Operator.IS, values: Warehouse})); //Filter by warehouse
       SimilarStrainsSearch.filters.push(search.createFilter({name: 'locationquantityavailable', operator: search.Operator.GREATERTHANOREQUALTO, values: quantity}));
       SimilarStrainsSearch.filters.push(search.createFilter({name: 'itemid', operator: search.Operator.CONTAINS, values: indexToText(sizeIndex)}));
       SimilarStrainsSearch.filters.push(search.createFilter({name: 'custitembeerstyles', operator: search.Operator.ANYOF, values: beerStyles}));
       SimilarStrainsSearch.columns.push(search.createColumn({name: 'locationquantityavailable'}));
       SimilarStrainsSearch.columns.push(search.createColumn({name: 'displayname'}));
       SimilarStrainsSearch.columns.push(search.createColumn({name: 'itemid'}));

       var resultSet = SimilarStrainsSearch.run();
       var results = resultSet.getRange({start: 0, end: 1000});

       results.forEach(function(result) {
           var item = {};
           item.Name = String(result.getValue({name: 'itemid'}));
           item.Name = item.Name.slice(0, item.Name.indexOf(':')) + result.getValue({name: 'displayname'});
           item.MerchandiseID = result.id;
           item.OrderDetailQty = parseInt(quantity);
           items.push(item);
       });

       return items;
   }

   function prepareItems(userID, possibleSizeConfigurations, itemIDs, Warehouse)
   {
       var itemList = [];

       //Obtain Pricing
       var fakeOrder = record.create({type: 'salesorder', isDynamic: true});
       fakeOrder.setValue('entity', userID);

       possibleSizeConfigurations.forEach(function(x)
       {
           var items = [];
           for (var i = 0, totalLength = itemIDs.length; i < totalLength; i++)
           {
               if(x[i] && x[i] > 0)
               {
                   var item = {};
                   item.MerchandiseID = itemIDs[i];
                   item.OrderDetailQty = x[i];
                   item.earliestShipDate = valiDate(new Date(), true, 2, false, false, Warehouse == 11);
                   item.chosenShipDate = new Date(item.earliestShipDate);
                   item.Warehouse = Warehouse;

                   fakeOrder.selectNewLine({sublistId: 'item'});
                   fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: item.MerchandiseID});
                   fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: item.OrderDetailQty});
                   fakeOrder.commitLine({sublistId: 'item'});
                   fakeOrder.selectLine({sublistId: 'item', line: 0});
                   item.pricePerUnit = fakeOrder.getCurrentSublistValue({sublistId: 'item', fieldId: 'rate'});
                   fakeOrder.removeLine({sublistId: 'item', line: 0});
                   items.push(item);
               }
               else
               {
                   items.push(null);
               }
           }
           itemList.push(items);
       });

       return itemList;
   }

   function prepareItemsAltStrains(userID, possibleConfigurations, Warehouse)
   {
       //Obtain Pricing
       var fakeOrder = record.create({type: 'salesorder', isDynamic: true});
       fakeOrder.setValue('entity', userID);

       possibleConfigurations.forEach(function(x)
       {
           fakeOrder.selectNewLine({sublistId: 'item'});
           fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'item', value: x.MerchandiseID});
           fakeOrder.setCurrentSublistValue({sublistId: 'item', fieldId: 'quantity', value: x.OrderDetailQty});
           fakeOrder.commitLine({sublistId: 'item'});
           fakeOrder.selectLine({sublistId: 'item', line: 0});
           x.pricePerUnit = fakeOrder.getCurrentSublistValue({sublistId: 'item', fieldId: 'rate'});
           fakeOrder.removeLine({sublistId: 'item', line: 0});

           x.earliestShipDate = valiDate(new Date(), true, 2, false, false, Warehouse == 11);
           x.chosenShipDate = new Date(x.earliestShipDate);
           x.Warehouse = Warehouse;
       });

       return possibleConfigurations;
   }

   function itemSizeToIndex(itemSize)
   {
       var giftItemSize = String(itemSize).toLowerCase();

       if(giftItemSize == "xs")
       {
           return 1;
       }
       else if(giftItemSize == "s")
       {
           return 2;
       }
       else if(giftItemSize == "m")
       {
           return 0;
       }
       else if(giftItemSize == "l")
       {
           return 3;
       }
       else if(giftItemSize == "xl")
       {
           return 4;
       }
       else if(giftItemSize == "2xl" || giftItemSize == "xxl")
       {
           return 5;
       }
       else if(giftItemSize == "3xl")
       {
           return 6;
       }
       else
       {
           return -1;
       }
   }

   function additionalNYInfo(item, result, vol)
   {
       item.volID[vol] = parseInt(result.id);

       if(!item.Description)
       {
           item.Description = result.getValue('storedescription');
       }

       if(!item.ImageURL)
       {
           item.ImageURL = result.getValue('custitem_ymo_new_image_url');
       }

       if(!item.searchTags)
       {
           item.searchTags = result.getValue('custitemsearchtags');
       }
   }


   function additionalYInfo(item, result, vol)
   {
       var index = getVolIdIndex(vol);
       item.volID[index] = parseInt(result.id);
       item.availability[index] = getAvailability(result);

       if(vol == 'nano' || vol == '1.5' || vol == '2l')
       {
           item.purePitch = result.getText('custitem_wl_packaging_methods') == 'PurePitch' ? true : false
       }

       if(!item.Description)
       {
           item.Description = result.getValue('storedescription');
       }

       var strainCategory = parseInt(result.getValue('custitem_wl_yeast_strain_category'));

       // season vault HB items
       if(item.strainCategory == 31)
       {
           var designation = result.getText('custitem_wl_yeast_designation');
           if( designation == 'HB')
           {
               item.seasonalHBVault = true;
           }
       }

       if(!item.ImageURL)
       {
           item.ImageURL = result.getValue('custitem_ymo_new_image_url');
       }

       if(!item.IsPrivate)
       {
           if(result.getValue('custitem_ymo_is_private'))
           {
               if(result.getValue('custitem_ymo_is_private'))
               {
                   item.IsPrivate = [ true ];
                   if(result.getValue('custitemauth_purchaser'))
                   {
                       item.IsPrivate = result.getValue('custitemauth_purchaser');
                   }
               }
               else
               {
                   item.IsPrivate = [false];
               }
           }
           else
           {
               item.IsPrivate = [false];
           }
       }

       if(!item.attenuation)
       {
           item.attenuation = result.getValue('custitem_wl_attenuation_low') + ' - ' + result.getValue('custitem_wl_attenuation_high');
       }

       if(!item.flocculation)
       {
           item.flocculation = result.getValue('custitem_wl_flocculation');
       }

       if(!item.alcoholTol)
       {
           item.alcoholTol = result.getValue('custitem_wl_alcohol_tolerance');
       }

       if(!item.optFermentTempF)
       {
           item.optFermentTempF = result.getValue('custitem_wl_opt_ferm_faren_low') + 'F - ' + result.getValue('custitem_opt_ferm_temp_high_faren') + 'F';

       }

       if(!item.optFermentTempC)
       {
           item.optFermentTempC = result.getValue('custitem_wl_opt_ferm_celsius_low') + 'C - ' + result.getValue('custitem_wl_opt_ferm_celsius_high') + 'C';
       }

       if(!item.styleRec)
       {
           item.styleRec = result.getValue('custitem_wl_style_recommend');
       }

       if(!item.searchTags)
       {
           item.searchTags = result.getValue('custitemsearchtags');
       }

       var tags = result.getValue('custitem_wl_style_recommend');
       if(!item.custitemsearchtags && tags)
       {
           if(tags.length > item.custitemsearchtags)
           {
               item.custitemsearchtags = tags;
           }
       }
   }

   function addItem(response, result, parentName, vol)
   {
       var index = 0;
       var item = {};
       item.volID = [];
       item.availability = [];

       if(parentName)
       {
           var index = getVolIdIndex(vol);
           item.volID[index] = parseInt(result.id);
           if(vol == 'nano' || vol == '1.5' || vol == '2l')
           {
               item.purePitch = result.getText('custitem_wl_packaging_methods') == 'PurePitch' ? true : false
           }

           item.availability[index] = getAvailability(result);

           //Yeast Item
           item.partNum = String(parentName);
           item.Name = parentName + " ";
           item.isYeast = true;
           item.strainCategory = parseInt(result.getValue('custitem_wl_yeast_strain_category'));


           // season vault HB items
           if(item.strainCategory == 31)
           {
               var designation = result.getText('custitem_wl_yeast_designation');
               if( designation == 'HB')
               {
                   item.seasonalHBVault = true;
               }
           }

           if(result.getValue('custitem_ymo_is_private'))
           {
               if(result.getValue('custitem_ymo_is_private'))
               {
                   item.IsPrivate = [ true ];
                   if(result.getValue('custitemauth_purchaser'))
                   {
                       item.IsPrivate = result.getValue('custitemauth_purchaser');
                   }
               }
               else
               {
                   item.IsPrivate = [false];
               }
           }
           else
           {
               item.IsPrivate = [false];
           }

           item.attenuation = result.getValue('custitem_wl_attenuation_low') + ' - ' + result.getValue('custitem_wl_attenuation_high');
           item.flocculation = result.getValue('custitem_wl_flocculation');
           item.alcoholTol = result.getValue('custitem_wl_alcohol_tolerance');
           item.optFermentTempF = result.getValue('custitem_wl_opt_ferm_faren_low') + 'F - ' + result.getValue('custitem_opt_ferm_temp_high_faren') + 'F';
           item.optFermentTempC = result.getValue('custitem_wl_opt_ferm_celsius_low') + 'C - ' + result.getValue('custitem_wl_opt_ferm_celsius_high') + 'C';
           item.styleRec = result.getValue('custitem_wl_style_recommend');
           var beerStyles = result.getText('custitembeerstyles'), beerStylesID = result.getValue('custitembeerstyles');
           if(beerStyles)
           {
               item.beerStylesSearch = String(beerStyles);
               beerStyles = beerStyles.split(','), beerStylesID = beerStylesID.split(',');
               item.beerStyles = [];
               for (var i = 0, totalLength = beerStyles.length - 1; i < totalLength; i++)
               {
                   item.beerStyles.push({name: beerStyles[i], id: beerStylesID[i]});

               }
           }
       }
       else
       {

           item.volID[index] = parseInt(result.id);
           item.availability[index] = getAvailability(result);

           //Non Yeast Item
           item.partNum = result.getValue('itemid');
           item.designation = result.getValue('custitem_wl_yeast_designation');

           if(parseInt(result.getValue('class')) == 28) //education
           {
               item.Name = result.getValue('displayname').split(";")[0];
               item.TagLocation = result.getValue('custitem_wl_classlocation');
               item.TagDate = result.getValue('custitem_wl_classdates');
           }
           else if([27, 10].indexOf(parseInt(result.getValue('class'))) >= 0)
           {
               item.Name = result.getValue('displayname');
               item.Price = result.getValue('price');
           }
           else
           {
               item.Name = result.getValue('itemid') + ': ' + result.getValue('displayname');
           }


           item.isYeast = false;
           item.IsPrivate = [ false ];
       }

       item.warehouse = result.getValue('custitemwarehouse');
       item.salesCategory = parseInt(result.getValue('class'));
       item.Description = result.getValue('storedescription');
       item.ImageURL = result.getValue('custitem_ymo_new_image_url');
       item.searchTags = result.getValue('custitemsearchtags');

       response.push(item);
   }

   function getAvailability(result)
   {
       return parseInt(result.getValue('locationquantityavailable')) || 0;
   }

   function getVolIdIndex(volume)
   {
       switch(volume)
       {
           case 'nano':
               return 0;
           case '1.5':
               return 1;
           case '2l':
               return 2;
           case 'custom pour':
               return 3;
           case 'hb':
               return 4;
           case 'slant':
               return 5;
           default:
               return 6;
       }
   }

   function fixNames(response, yeastMap, parentIDs)
   {
       var filters = [];
       filters.push(search.createFilter({name: 'internalid', operator: search.Operator.ANYOF, values: parentIDs}));

       var columns = [];
       columns.push(search.createColumn({name:'itemid'}));
       columns.push(search.createColumn({name:'displayname'}));

       var results;
       try
       {
           results = search.create({type: 'item', filters: filters, columns: columns}).run().getRange({start: 0, end: 1000});
       }
       catch (error)
       {
           log.error({title: 'ERROR', details: error});
           throw {message: 'Failed to load search, Names could not be fixed', code: -1};
       }
       if (results == null || results.length == 0)
       {
           throw {message: 'No results returned in name fixing, Names could not be fixed', code: -1};
       }

       for (var i = 0; i < results.length; i++)
       {
           response[yeastMap[results[i].getValue('itemid')]].Name += results[i].getValue('displayname');
       }
   }

   function logError(func, err)
   {
       var errorText = err.code ? JSON.stringify(err.code) : err.toString();
       log.error({
           title: 'ITEM - ' + func,
           details: errorText
       });
   }

   return {
       post: post,
       put: put
   };
});

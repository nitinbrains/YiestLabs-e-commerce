/**
*@NApiVersion 2.x
*@NScriptType Restlet
*Author: Dimitri Vasilev
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
        catch(error)
        {
            logError('get cust:' + response.id, error);
            return {error: error};
        }
    }

    function get()
    {
        try
        {
            var response = {version: versionUpToDate(), items: []};
            var Inventory = cache.getCache({name: 'Inventory', scope: cache.Scope.PUBLIC});
            response.items = JSON.parse(Inventory.get({key: 'items'}));
            return SendMessage(response);

        }
        catch(error)
        {
            logError('get', error);
            return {error: error};
        }
    }

    function post(input) 
    {
        try 
        {
            var message = ReceiveMessage(input);
            var response = {};
            const itemID = message.itemID;

            var SDAvailability = itemAvailability.GetItemAvailability([itemID], ["9"], true);
            var ASHAvailability = itemAvailability.GetItemAvailability([itemID], ["11"], true);
            var CPHAvailability = itemAvailability.GetItemAvailability([itemID], ["30"], true);
            var HKAvailability = itemAvailability.GetItemAvailability([itemID], ["31"], true);

            var SDAvail = searchAvailabilityResults(SDAvailability, "9");
            var ASHAvail = searchAvailabilityResults(ASHAvailability, "11");
            var CPHAvail = searchAvailabilityResults(CPHAvailability, "30");
            var HKAvail = searchAvailabilityResults(HKAvailability, "31");

            response.availability = {
                9: SDAvail.availQtyToShip,
                11: ASHAvail.availQtyToShip,
                30: CPHAvail.availQtyToShip,
                31: HKAvail.availQtyToShip
            }

            return SendMessage(response);

        }
        catch(error)
        {
            logError('post', error);
            return {error: error};
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
        catch(error)
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
                    item.earliestShipDate = getShipDate(new Date(), true, 2, false, false, Warehouse == 11);
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

            x.earliestShipDate = getShipDate(new Date(), true, 2, false, false, Warehouse == 11);
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
            item.Description = result.getValue({name: 'storedescription'});
        }

        if(!item.ImageURL)
        {
            item.ImageURL = result.getValue({name: 'custitem_ymo_new_image_url'});
        }

        if(!item.searchTags)
        {
            item.searchTags = result.getValue({name: 'custitemsearchtags'});
        }
    }


    function additionalYInfo(item, result, vol)
    {
        addVolId(item, result, vol);

        if(!item.Description)
        {
            item.Description = result.getValue({name: 'storedescription'});
        }

        var strainCategory = parseInt(result.getValue({name: 'custitem_wl_yeast_strain_category'}));

        // season vault HB items
        if(item.strainCategory == 31)
        {
            var designation = result.getText({name: 'custitem_wl_yeast_designation'});
            if( designation == 'HB')
            {
                item.seasonalHBVault = true;
            }
        }

        if(!item.ImageURL)
        {
            item.ImageURL = result.getValue({name: 'custitem_ymo_new_image_url'});
        }

        if(!item.IsPrivate)
        {
            if(result.getValue({name: 'custitem_ymo_is_private'}))
            {
                if(result.getValue({name: 'custitem_ymo_is_private'}))
                {
                    item.IsPrivate = [ true ];
                    if(result.getValue({name: 'custitemauth_purchaser'}))
                    {
                        item.IsPrivate = result.getValue({name: 'custitemauth_purchaser'});
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
            item.attenuation = result.getValue({name: 'custitem_wl_attenuation_low'}) + ' - ' + result.getValue({name: 'custitem_wl_attenuation_high'});
        }

        if(!item.flocculation)
        {
            item.flocculation = result.getValue({name: 'custitem_wl_flocculation'});
        }

        if(!item.alcoholTol)
        {
            item.alcoholTol = result.getValue({name: 'custitem_wl_alcohol_tolerance'});
        }

        if(!item.optFermentTempF)
        {
            item.optFermentTempF = result.getValue({name: 'custitem_wl_opt_ferm_faren_low'}) + 'F - ' + result.getValue({name: 'custitem_opt_ferm_temp_high_faren'}) + 'F';

        }

        if(!item.optFermentTempC)
        {
            item.optFermentTempC = result.getValue({name: 'custitem_wl_opt_ferm_celsius_low'}) + 'C - ' + result.getValue({name: 'custitem_wl_opt_ferm_celsius_high'}) + 'C';
        }

        if(!item.styleRec)
        {
            item.styleRec = result.getValue({name: 'custitem_wl_style_recommend'});
        }

        if(!item.searchTags)
        {
            item.searchTags = result.getValue({name: 'custitemsearchtags'});
        }

        var tags = result.getValue({name: 'custitem_wl_style_recommend'});
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
        var item = {};
        item.volID = [];

        if(parentName)
        {
            //Yeast Item
            item.partNum = String(parentName);
            item.Name = parentName + " ";
            addVolId(item, result, vol);
            item.isYeast = true;
            item.strainCategory = parseInt(result.getValue({name: 'custitem_wl_yeast_strain_category'}));


            // season vault HB items
            if(item.strainCategory == 31)
            {
                var designation = result.getText({name: 'custitem_wl_yeast_designation'});
                if( designation == 'HB')
                {
                    item.seasonalHBVault = true;
                }
            }

            if(result.getValue({name: 'custitem_ymo_is_private'}))
            {
                if(result.getValue({name: 'custitem_ymo_is_private'}))
                {
                    item.IsPrivate = [ true ];
                    if(result.getValue({name: 'custitemauth_purchaser'}))
                    {
                        item.IsPrivate = result.getValue({name: 'custitemauth_purchaser'});
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

            item.attenuation = result.getValue({name: 'custitem_wl_attenuation_low'}) + ' - ' + result.getValue({name: 'custitem_wl_attenuation_high'});
            item.flocculation = result.getValue({name: 'custitem_wl_flocculation'});
            item.alcoholTol = result.getValue({name: 'custitem_wl_alcohol_tolerance'});
            item.optFermentTempF = result.getValue({name: 'custitem_wl_opt_ferm_faren_low'}) + 'F - ' + result.getValue({name: 'custitem_opt_ferm_temp_high_faren'}) + 'F';
            item.optFermentTempC = result.getValue({name: 'custitem_wl_opt_ferm_celsius_low'}) + 'C - ' + result.getValue({name: 'custitem_wl_opt_ferm_celsius_high'}) + 'C';
            item.styleRec = result.getValue({name: 'custitem_wl_style_recommend'});
            var beerStyles = result.getText({name: 'custitembeerstyles'}), beerStylesID = result.getValue({name: 'custitembeerstyles'});
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
            if(!vol)
            {
                vol = 0;
            }

            //Non Yeast Item
            item.partNum = result.getValue({name: 'itemid'});
            item.designation = result.getValue({name: 'custitem_wl_yeast_designation'});

            if(parseInt(result.getValue({name: 'class'})) == 28) //education
            {
                item.Name = result.getValue({name: 'displayname'}).split(";")[0];
                item.TagLocation = result.getValue({name: 'custitem_wl_classlocation'});
                item.TagDate = result.getValue({name: 'custitem_wl_classdates'});
            }
            else if([27, 10].indexOf(parseInt(result.getValue({name: 'class'}))) >= 0)
            {
                item.Name = result.getValue({name: 'displayname'});
                item.Price = result.getValue({name: 'price'});
            }
            else
            {
                item.Name = result.getValue({name: 'itemid'}) + ': ' + result.getValue({name: 'displayname'});
            }

            item.volID[vol] = parseInt(result.id);
            item.isYeast = false;
            item.IsPrivate = [ false ];
        }

        item.warehouse = result.getValue({name: 'custitemwarehouse'});
        item.salesCategory = parseInt(result.getValue({name: 'class'}));
        item.Description = result.getValue({name: 'storedescription'});
        item.ImageURL = result.getValue({name: 'custitem_ymo_new_image_url'});
        item.searchTags = result.getValue({name: 'custitemsearchtags'});

        response.push(item);
    }

    function addVolId(item, result, volume)
    {
        if(volume == 'nano')
        {
            item.volID[0] = parseInt(result.id);
            item.purePitch = (result.getText({name: 'custitem_wl_packaging_methods'}) == 'PurePitch') ? true : false;
        }
        else if(parseFloat(volume) == '1.5')
        {
            item.volID[1] = parseInt(result.id);
            item.purePitch = (result.getText({name: 'custitem_wl_packaging_methods'}) == 'PurePitch') ? true : false;
        }
        else if(volume == '2l')
        {
            item.volID[2] = parseInt(result.id);
            item.purePitch = (result.getText({name: 'custitem_wl_packaging_methods'}) == 'PurePitch') ? true : false;
        }
        else if(volume == 'custom pour')
        {
            item.volID[3] = parseInt(result.id);
        }
        else if(volume == 'hb')
        {
            item.volID[4] = parseInt(result.id);
        }
        else if(volume == 'slant')
        {
            item.volID[5] = parseInt(result.id);
        }
        else if(parseInt(volume) == '1')
        {
            item.volID[6] = parseInt(result.id);
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
            response[yeastMap[results[i].getValue({name: 'itemid'})]].Name += results[i].getValue({name: 'displayname'});
        }
    }

    function logError(func, error)
    {
        var errorText = error.code ? JSON.stringify(error.code) : error.toString();
        log.error({
            title: 'ITEM - ' + func,
            details: errorText
        });
    }

    return {
        get: get,
        put: put,
        post: post
    };
});

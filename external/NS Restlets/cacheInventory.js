/**
*@NApiVersion 2.x
*@NScriptType ScheduledScript
* Author: dvasilev@whitelabs.com
* Last Update: 11/7/2018 dvasilev@whitelabs.com
* Purpose: Get and cache inventory for app and website. This scheduled script runs every 10 minutes and caches
*       inventory to be retrieved by app/YMO 2.0
* File: cacheInventory.js
*/


define(['N/record', 'N/log', 'N/search', 'N/email', 'N/runtime', 'N/task', 'N/cache'],
function(record, log, search, email, runtime, task, cache)
{
    /**
    * The following function creates a saved search to find inventory/assembly/service items to be included in the app/website
    * and groups associated items together
    *
    * @return {items[]}, an object with one key - an array of items
    */
    function execute(scriptContext)
    {
        try
        {
            var response = {items: []};
            var currentContext = runtime.getCurrentScript();

            var inventory = searchForItems();
            var index = parseInt(currentContext.getParameter({name: 'count'})) || 0;

            //initializations
            var results, parentIDs = [], slantRetries = [];
            var yeastMap = {}; //is a map such indexOfItemInResponse = yeastMap[parentName] => response[indexOfItemInResponse]

            do
            {
                // rescheduled script task if governance has fallen to less than 50 units
                if(currentContext.getRemainingUsage() <= 50)
                {
                    scriptTask.scriptId = 917;
                    scriptTask.deploymentId = 'customdeploy1';
                    scriptTask.params = {count: index};
                    var scriptTaskId = scriptTask.submit();
                    return;
                }
                else
                {
                    results = inventory.getRange({start: index, end: index + 1000});
                    index += 1000;

                    for (var i = 0; i < results.length; i++)
                    {
                        var slantExceptionStr = results[i].getValue({name: 'itemid'}).toLowerCase();
                        var itemName = String(results[i].getValue({name: 'itemid'}));
                        var displayName = String(results[i].getValue({name: 'displayname'}));

                        if(results[i].getText({name: 'parent'}))
                        {

                            //retrieve yeast size/vol from name
                            var splitIndex = slantExceptionStr.indexOf('-');
                            var vol = slantExceptionStr.substring(splitIndex+1, slantExceptionStr.length);

                            //check if sibling item has been encountered before
                            if(yeastMap[results[i].getText({name: 'parent'})])
                            {
                                additionalYInfo(response.items[yeastMap[results[i].getText({name: 'parent'})]], results[i], vol);
                            }
                            else
                            {
                                yeastMap[results[i].getText({name: 'parent'})] = response.items.length;
                                parentIDs.push(results[i].getValue({name: 'parent'}));
                                addItem(response.items, results[i], results[i].getText({name: 'parent'}), vol);
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
                                        yeastMap[partSlice] = response.items.length;
                                        addItem(response.items, results[i], null, 1);
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
                                            yeastMap[itemName] = response.items.length;
                                            addItem(response.items, results[i], null, 0);
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
                                                yeastMap[partSlice] = response.items.length;
                                                addItem(response.items, results[i], null, volIDIndex);
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
                                    yeastMap[itemName] = response.items.length;
                                    addItem(response.items, results[i], null, 0);
                                }
                            }
                            else //lab services & nutrients and enzymes
                            {
                                if(!yeastMap[itemName])
                                {
                                    yeastMap[itemName] = response.items.length;
                                    addItem(response.items, results[i], null, null);
                                }
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
                    log.debug('ERROR', 'Failed to add slant, first item', 'Item: ' + slantRetries[i].getId());
                }
            }

            if(parentIDs.length > 0)
            {
                fixNames(response.items, yeastMap, parentIDs);
            }

            var Inventory = cache.getCache({name: 'Inventory', scope: cache.Scope.PUBLIC});
            Inventory.put({key: 'items', value: response.items});

            log.debug('cacheInventory completed successfully');

        }
        catch(error)
        {
            log.error({
                title: 'error',
                details: error
            });
        }
    }


    function searchForItems()
    {
        // Search for items ready to sync.
        var filters = [];
        filters.push(search.createFilter({name: 'type', operator: search.Operator.ANYOF, values: ['Assembly', 'InvtPart', 'Service']}));
        filters.push(search.createFilter({name: 'custitem_include_in_ymo_website', operator: search.Operator.IS, values: true}));
        filters.push(search.createFilter({name: 'isinactive', operator: search.Operator.IS, values: false}));
        filters.push(search.createFilter({name: 'pricinggroup', operator: search.Operator.IS, values: 'MSRP'}));

        var columns = [];
        columns.push(search.createColumn({name:'parent'}));
        columns.push(search.createColumn({name:'itemid'}));
        columns.push(search.createColumn({name:'class'}));
        columns.push(search.createColumn({name:'displayname'}));
        columns.push(search.createColumn({name:'custitemauth_purchaser'}));
        columns.push(search.createColumn({name:'storedescription'}));
        columns.push(search.createColumn({name:'custitem_ymo_new_image_url'}));
        columns.push(search.createColumn({name:'custitem_ymo_is_private'}));
        columns.push(search.createColumn({name:'custitem_wl_attenuation_low'}));
        columns.push(search.createColumn({name:'custitem_wl_attenuation_high'}));
        columns.push(search.createColumn({name:'custitem_wl_flocculation'}));
        columns.push(search.createColumn({name:'custitem_wl_alcohol_tolerance'}));
        columns.push(search.createColumn({name:'custitem_wl_opt_ferm_faren_low'}));
        columns.push(search.createColumn({name:'custitem_opt_ferm_temp_high_faren'}));
        columns.push(search.createColumn({name:'custitem_wl_opt_ferm_celsius_low'}));
        columns.push(search.createColumn({name:'custitem_wl_opt_ferm_celsius_high'}));
        columns.push(search.createColumn({name:'custitem_wl_style_recommend'}));
        columns.push(search.createColumn({name:'custitem_wl_packaging_methods'}));
        columns.push(search.createColumn({name:'custitemsearchtags'}));
        columns.push(search.createColumn({name:'custitemwarehouse'}));
        columns.push(search.createColumn({name:'custitem_wl_yeast_strain_category'}));
        columns.push(search.createColumn({name:'custitembeerstyles'}));
        columns.push(search.createColumn({name:'custitem_wl_classlocation'}));
        columns.push(search.createColumn({name:'custitem_wl_classdates'}));
        columns.push(search.createColumn({name:'price'}));
        columns.push(search.createColumn({name:'custitem_wl_yeast_designation'}));

        var inventory = search.create({type: 'item', filters: filters, columns: columns}).run();

        return inventory;
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

    return {
        execute: execute
    };
});

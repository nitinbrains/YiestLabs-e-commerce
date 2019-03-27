import _filter from 'lodash/filter';

import SalesLib from './SalesLib';
import WLHelper from './WLHelper';
import { IN_STOCK, OUT_OF_STOCK } from './Constants';

export function parseAvailabilityResults(availability) {
    for(const key in availability) {
        if(availability[key] > 0) {
            return IN_STOCK;
        }
    }

    return OUT_OF_STOCK;
}



export function filterItems(
    items,
    type=null,
    search=null,
    userInfo=null,
    homebrew=false
) {
    var subsidiary,
        userID,
        userIsRetailer = false,
        category = parseInt(type);

    if(userInfo) {
        subsidiary = parseInt(userInfo.subsidiary);
        userIsRetailer = [2, 1, 7].includes(parseInt(userInfo.category));
        userID = userInfo.id;
    }
    else {
        subsidiary = 2;
        userIsRetailer = false;
    }

    if(search) {
        search = search.toLowerCase();
    }

    var itemsToShow = items.filter(function(item){
        var name = item.Name ? item.Name : '';
        var styleRec = item.styleRec ? item.styleRec : '';
        var searchTags = item.searchTags ? item.searchTags : '';
        var description = item.Description ? item.Description : '';
        var partNum = item.partNum ? item.partNum : '';
        var beerStyles = item.beerStylesSearch ? item.beerStylesSearch : '';
        const salesCategory = parseInt(item.salesCategory);


        if(homebrew)
        {
            if(!item.IsPrivate[0] || item.IsPrivate.indexOf(userID) >= 0)
            {
                if(item.volID[4] && SalesLib.SALESCATEGORY[16].includes(item.salesCategory))
                {
                    //itemsToShow.push(Inventory[i]);
                    return true;
                }
            }
        }
        else if(WLHelper.warehouseMatch(item.warehouse, subsidiary) && (!SalesLib.POSItems.includes(item.volID[0]) || (SalesLib.POSItems.includes(item.volID[0]) && userIsRetailer)))
        {
            if(item.IsPrivate.indexOf(userID) >= 0 || !item.IsPrivate[0])
            {
                if(search)
                {
                    if(name.toLowerCase().includes(search))
                    {
                        return true;
                    }
                    else if(styleRec.toLowerCase().includes(search))
                    {
                        return true;
                    }
                    else if(searchTags.toLowerCase().includes(search))
                    {
                        return true;
                    }
                    else if(description.toLowerCase().includes(search))
                    {
                        return true;
                    }
                    else if(partNum.toLowerCase().includes(search))
                    {
                        return true;
                    }
                    else if(beerStyles.toLowerCase().includes(search))
                    {
                        return true;
                    }
                }
                else if(!isNaN(category) && SalesLib.SALESCATEGORY[category].indexOf(salesCategory) >= 0 && !(homebrew && !item.volID[4]))
                {
                    return true;
                }
            }
        }

        return false;
    });

    itemsToShow.sort(compareFunction);

    return itemsToShow;
}

function compareFunction(item1, item2) {
    if(item1.Name.includes("WLP") && item2.Name.includes("WLP"))
    {
        return item1.Name.slice(3).localeCompare(item2.Name.slice(3));
    }
    else if(item1.Name.includes("WLP"))
    {
        return -1;
    }
    else if(item2.Name.includes("WLP"))
    {
        return 1;
    }
    else
    {
        return item1.Name.localeCompare(item2.Name);
    }
}

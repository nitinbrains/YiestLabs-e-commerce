import SalesLib from './SalesLib';
import WLHelper from './WLHelper';

export function filterItems(items, type=null, search=null, userInfo=null, retail=false, homebrew=false) {
    try {
        var itemsToShow = [],
            similarItems = [],
            subsidiary,
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

        if(retail) {
            category = 0;
        }


        for (var i = 0, length = items.length; i < length; i++)
        {
            var containsSearchTerm = false;
            var name = items[i].Name ? items[i].Name : '';
            var styleRec = items[i].styleRec ? items[i].styleRec : '';
            var searchTags = items[i].searchTags ? items[i].searchTags : '';
            var description = items[i].Description ? items[i].Description : '';
            var partNum = items[i].partNum ? items[i].partNum : '';
            var beerStyles = items[i].beerStylesSearch ? items[i].beerStylesSearch : '';
            const salesCategory = parseInt(items[i].salesCategory);


            if(homebrew)
            {
                if(!items[i].IsPrivate[0] || items[i].IsPrivate.indexOf(UserID) >= 0)
                {
                    if(items[i].volID[4] && SalesLib.SALESCATEGORY[16].includes(items[i].salesCategory))
                    {
                        itemsToShow.push(Inventory[i]);
                    }
                }
            }
            else if(WLHelper.warehouseMatch(items[i].warehouse, subsidiary) && (!SalesLib.POSItems.includes(items[i].volID[0]) || (SalesLib.POSItems.includes(items[i].volID[0]) && userIsRetailer)))
            {
                if(userID)
                {
                    if(!items[i].IsPrivate[0] || items[i].IsPrivate.indexOf(userID) >= 0)
                    {
                        if(search)
                        {
                            if(name.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(styleRec.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(searchTags.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(description.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(partNum.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }
                            else if(beerStyles.toLowerCase().includes(search))
                            {
                                containsSearchTerm = true;
                            }


                            if(containsSearchTerm)
                            {
                                if(SalesLib.SALESCATEGORY[category].indexOf(salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                                {
                                    itemsToShow.push(items[i]);
                                }
                                else if(!retail)
                                {
                                    similarItems.push(items[i]);
                                }
                            }
                        }
                        else if(SalesLib.SALESCATEGORY[category].indexOf(salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                        {
                            itemsToShow.push(items[i]);
                        }
                    }
                }
                else if(!items[i].IsPrivate[0])
                {
                    if(search)
                    {
                        if(name.toLowerCase().includes(search))
                        {
                            containsSearchTerm = true;
                        }
                        else if(styleRec.toLowerCase().includes(search))
                        {
                            containsSearchTerm = true;
                        }
                        else if(searchTags.toLowerCase().includes(search))
                        {
                            containsSearchTerm = true;
                        }
                        else if(description.toLowerCase().includes(search))
                        {
                            containsSearchTerm = true;
                        }
                        else if(partNum.toLowerCase().includes(search))
                        {
                            containsSearchTerm = true;
                        }
                        else if(beerStyles.toLowerCase().includes(search))
                        {
                            containsSearchTerm = true;
                        }

                        if(containsSearchTerm)
                        {
                            if(SalesLib.SALESCATEGORY[category].indexOf(salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                            {
                                itemsToShow.push(items[i]);
                            }
                            else if(!retail)
                            {
                                similarItems.push(items[i]);
                            }
                        }
                    }
                    else if(SalesLib.SALESCATEGORY[category].indexOf(salesCategory) >= 0 && !(retail && !items[i].volID[4]))
                    {
                        itemsToShow.push(items[i]);
                    }
                }
            }
        }

        var finalResult = sortItems(itemsToShow);

        if(similarItems.length > 0)
        {
            finalResult.push('altresult');
            finalResult = finalResult.concat(similarItems);
        }

        return finalResult;
    }
    catch(error)
    {
      
    }
}

export function sortItems(items)
{
    try
    {
        return items.sort(function(item1, item2)
        {
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
        });
    }
    catch(error)
    {
        
    }
}

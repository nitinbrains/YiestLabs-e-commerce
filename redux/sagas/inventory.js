import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';
import { inventoryActions } from '../actions/inventoryActions';

import WLHelper from '../../lib/WLHelper';
import SalesLib from '../../lib/SalesLib';

import * as api from '../../services/inventory';

export function * getInventory (action) {
    const { responseSuccess, responseFailure, data: { search } } = action;
    try {
        yield put(messageActions.hideNetworkError({}))
        const { res, err } = yield call(api.getInventory);        
        if( err ) {
            throw err
        } else {
            if( res && res.items ){
                const items = res.items;
                var category = 1;
                const itemsToShow = filterItems(items, category, null, false)
                yield put(responseSuccess({ items, itemsToShow, category })); 
                yield put(messageActions.hideNetworkError())   
            }
        }
    } catch (error) {
        yield put(responseFailure(error));
        // yield put(messageActions.displayMessage({ title: 'Error', error: error }));
        yield put(messageActions.showNetworkError(error))
    }
};

export function * changeCategory(action) {
    const { responseSuccess, responseFailure, data: { category } } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, category, null, false, false);
        yield put(responseSuccess({ itemsToShow, category }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * searchForStrain(action) {
    const { responseSuccess, responseFailure, data: { searchTerm } } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, null, searchTerm, false, false);
        yield put(responseSuccess({ itemsToShow }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * switchToHomebrew(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const itemsToShow = filterItems(inventory.items, null, null, false, true);
        yield put(responseSuccess({ itemsToShow }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}

export function * switchToProfessional(action) {
    const { responseSuccess, responseFailure } = action;
    try {
        const inventory = yield select(state => state.inventory);
        const category = inventory.category;
        const itemsToShow = filterItems(inventory.items, category, null, false, true);
        yield put(inventoryActions.changeCategory({
            category: category
        }));
    } catch(error) {
        yield put(responseFailure(error));
    }
}


/***** Business Logic *****/

function filterItems(items, type=null, search=null, userInfo=null, retail=false, homebrew=false) {
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
        console.log('error', error);
    }
}

function sortItems(items)
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
    catch(err)
    {
        console.log('error', error);
    }
}

import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios';
import { host } from '../../config.server'


import SalesLib from '../../modules/SalesLib';

var mainCategories = [0, 7, 8, 12, 13, 14, 15];

function fetchInventoryAPI(classFilters)
{
    return axios.get(`${host}/get-inventory?classFilters=${JSON.stringify(classFilters)}`)
    .then(result => {
        return {items: result.data.items}
    })
    .catch(error => {
        return {error};
    });
}

function getClassFilters(categoriesLoaded, category, getAll=false)
{
    try
    {
        category = parseInt(category);
        var classFilters = [];
        var remainingCategories;
        var loadCategories;

        // get all inventory
        if(getAll)
        {

            // get remaining categories that need to be fetched
            if(categoriesLoaded)
            {
                remainingCategories = mainCategories.filter(category => categoriesLoaded.indexOf(category) < 0);
            }
            else
            {
                remainingCategories = mainCategories;
            }

            if(remainingCategories.length > 0)
            {

                for(var i = 0; i < remainingCategories.length; i++)
                {

                    category = remainingCategories[i];

                    if(!categoriesLoaded || categoriesLoaded.indexOf(category) < 0)
                    {
                        classFilters.push(...SalesLib.SALESCATEGORY[category]);
                    }
                }

                loadCategories = remainingCategories;

            }
        }
        else if(!categoriesLoaded || categoriesLoaded.indexOf(parseInt(category)) < 0)
        {
            classFilters = SalesLib.SALESCATEGORY[category];
            loadCategories = [category];
        }

        return {classFilters, loadCategories};    

    }
    catch(err){
        throw err;
    }

}


function *getInventory(action){

    const { category, getAll } = action;
    const alreadyLoaded = yield select(state => state.inventory.categoriesLoaded);
    const { classFilters, loadCategories } = getClassFilters(alreadyLoaded, category, getAll);

    const { items, error } = yield call(fetchInventoryAPI, classFilters)

    if (items)
        yield put({ type: "STORE_SUCCESS", items, loadCategories })
    else
        yield put({ type: "THROW_ERROR", error })
    
}


export function* inventoryWatcher(){
	yield takeEvery("STORE_REQUEST", getInventory)
}

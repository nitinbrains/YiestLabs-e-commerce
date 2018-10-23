import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';
import SalesLib from '../../modules/SalesLib';
import * as api from '../../services/inventory';

const getClassFilters = (categoriesLoaded, category, getAll=false) => {
    category = parseInt(category);
    let classFilters = [];
    const mainCategories = [0, 7, 8, 12, 13, 14, 15];
    let loadCategories;

    // get all inventory
    if (getAll) {
        // get remaining categories that need to be fetched
        const remainingCategories = categoriesLoaded ?
            mainCategories.filter(category => categoriesLoaded.indexOf(category) !== -1) :
            mainCategories;

        if (remainingCategories.length > 0) {
            for(let i = 0; i < remainingCategories.length; i++) {
                const remainingCategorie = remainingCategories[i];
                if (!categoriesLoaded || categoriesLoaded.indexOf(remainingCategorie) === -1) {
                    classFilters.push(...SalesLib.SALESCATEGORY[remainingCategorie]);
                }
            }
            loadCategories = remainingCategories;
        }
    } else if (!categoriesLoaded || categoriesLoaded.indexOf(parseInt(category)) < 0) {
        classFilters = SalesLib.SALESCATEGORY[category];
        loadCategories = [category];
    }

    return { classFilters, loadCategories };
}

export function * getInventory (action) {
    const { responseSuccess, responseFailure, data: { category = 0, getAll } } = action;
    try {
        const alreadyLoaded = yield select(state => state.inventory.categoriesLoaded);
        const { classFilters, loadCategories } = getClassFilters(alreadyLoaded, category, getAll);
        const { items, error } = yield call(api.getInventory, classFilters);
        yield put(responseSuccess({ items, loadCategories }));
    } catch (error) {
        yield put(responseFailure(error));
        yield put(messageActions.dispayMessage({ title: 'Error', error: error.message }));
    }
};

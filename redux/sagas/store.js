import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects'
import axios from 'axios'

// custom
import { host } from '../../config.server'
import Store from '../../lib/Store'
import User from '../../lib/User';

function fetchInventoryAPI(classFilters) {
    return axios.get(`${host}/get-inventory?classFilters=${JSON.stringify(classFilters)}`)
    .then(result => {
        if(result.data.error) throw result.data.error;
        return {newItems: result.data.items}
    })
    .catch(error => {
        console.log('error', error);
        return {error};
    });
}


function* getInventory(action) {

    const search = action && action.search;
    const user = User.getUser();


    const selectedCategory = Store.getSelectedCategory();
    const classFilters = Store.getClassFilters(selectedCategory, search);


    if(classFilters) {
        const { newItems, error } = yield call(fetchInventoryAPI, classFilters);
        if (newItems) {
            Store.addCategoriesLoaded();
            Store.addItems(newItems);
        }
        else
            yield put({ type: "THROW_ERROR", error })
    }

    const itemsToShow = Store.filterItems(selectedCategory, search, user);
    yield put({ type: "STORE_SUCCESS", itemsToShow})
    
}

function* changeMainCategory(action) {
    const { mainIndex, category } = action;
    const existingCategories = yield select(state => state.store.categories);
    var categories = Store.selectMainCategory(existingCategories, mainIndex, category);

    if(categories) {
        yield put({type: "SET_CATEGORIES", categories});
        yield call(getInventory);
    }
}

function* changeSubCategory(action) {
    const { mainIndex, subIndex, category } = action;
    const existingCategories = yield select(state => state.store.categories);
    var categories = Store.selectSubCategory(existingCategories, mainIndex, subIndex, category);
    
    if(categories) {
        yield put({type: "SET_CATEGORIES", categories});
        yield call(getInventory);
    }
}

function* mainCategoryWatcher() {
    yield takeEvery("MAIN_CATEGORY_CHANGE", changeMainCategory)
}

function* subCategoryWatcher() {
    yield takeEvery("SUB_CATEGORY_CHANGE", changeSubCategory)
}

function* inventoryWatcher() {
    yield takeEvery("STORE_REQUEST", getInventory)
}

export function* storeWatcher() {
    yield all([
        inventoryWatcher(),
        mainCategoryWatcher(),
        subCategoryWatcher()
	])
}

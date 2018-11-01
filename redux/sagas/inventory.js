import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';
import { inventoryActions } from '../actions/inventoryActions';
import Store from '../../lib/Store'
import User from '../../lib/User';

import * as api from '../../services/inventory';

export function * getInventory (action) {
    const { responseSuccess, responseFailure, data: { search } } = action;
    try {
        const user = User.getUser();
        const selectedCategory = Store.getSelectedCategory();
        const classFilters = Store.getClassFilters(selectedCategory, search);

        if (classFilters) {
            const { res: { items }, error } = yield call(api.getInventory, classFilters);
            if (items) {
                Store.addCategoriesLoaded();
                Store.addItems(items);
                const itemsToShow = Store.filterItems(selectedCategory, search, user);
                yield put(responseSuccess({ itemsToShow }));
            } else if (error) {
                throw error;
            }
        }
    } catch (error) {
        yield put(responseFailure(error));
        yield put(messageActions.displayMessage({ title: 'Error', error: error }));
    }
};

export function * changeCategory(action) {
    const { responseSuccess, responseFailure, data: { mainIndex, category, subIndex } } = action;
    try {
        const existingCategories = yield select(state => state.store.categories);
        const categories = subIndex ?
            Store.selectSubCategory(existingCategories, mainIndex, subIndex, category) :
            Store.selectMainCategory(existingCategories, mainIndex, category);
        yield put(responseSuccess({ categories }));
        yield put(inventoryActions.getInventory());
    } catch (error) {
        yield put(responseFailure(error));
    }
}
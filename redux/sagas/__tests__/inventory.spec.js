import { runSaga, storeIO } from 'redux-saga';
import { put, select, delay } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import fetchMock from 'fetch-mock';

import {
    getInventory,
    changeCategory,
    switchToHomebrew,
    switchToProfessional
} from '../inventory';
import { inventoryActions } from '../../actions/inventoryActions';
import { inventory, inventoryFetch } from '../../mocks';

describe('testing of inventory sagas',() => {
    it('get inventory', () => {
        const cartItem = {
            MerchandiseID: 2425,
            Name: "WLP001 California Ale Yeast",
            OrderDetailQty: 1,
            details: "PurePitch® Nano",
            dispQuantity: 1,
            salesCategory: 3,
            type: 1,
        };
        fetchMock.get('http://localhost:3000/get-inventory', inventoryFetch);

        const action = inventoryActions.getInventory();
        return expectSaga(
            getInventory, action
        ).withState({
            inventory
        }).put(
            action.responseSuccess({
                items: inventoryFetch.items,
                itemsToShow: [],
                category: 1
            })
        ).run();
    });

    it('change category of inventory', () => {
        const action = inventoryActions.changeCategory({ category: 11 });
        return expectSaga(
            changeCategory, action
        ).withState({
            inventory: {
                items: inventoryFetch.items,
                itemsToShow: [],
                category: 1
            }
        }).put(
            action.responseSuccess({
                itemsToShow: [],
                category: 11
            })
        ).run();
    });

    it('switch to homebrew', () => {
        const action = inventoryActions.switchToHomebrew();
        return expectSaga(
            switchToHomebrew, action
        ).withState({
            inventory: {
                items: inventoryFetch.items,
                itemsToShow: [],
                category: 1
            }
        }).put(
            action.responseSuccess({ itemsToShow: [] })
        ).run();
    })
})

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
import { inventory } from '../../mocks';

const inventoryFetch = {
    version:"2.3.7",
    items: [
        {
            "volID": [1735],
            "partNum": "GS100",
            "designation": "3",
            "Name": "BrewMaster: The Craft Brewing Game",
            "Price": "19.95",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "Using mechanics similar to rummy, players combine cards to brew six beer styles including ale, stout and Belgian.",
            "ImageURL": "https://www.whitelabs.com/other-products/brewmaster-craft-beer-game",
            "searchTags": ""
        },
        {
            "volID": [13683],
            "partNum": "GS32GrowlerBLK",
            "designation": "3",
            "Name": "Double Walled Black 32oz Growler",
            "Price": "30.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13682],
            "partNum": "GS32GrowlerSS",
            "designation": "3",
            "Name": "Double-Walled Stainless Steel 32oz Growler",
            "Price": "30.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [3253],
            "partNum": "GSAMBER",
            "designation": "3",
            "Name": "Growler- 64oz",
            "Price": "",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13819],
            "partNum": "GSAVLPATCHHAT",
            "designation": "3",
            "Name": "White Labs Asheville Patch Hat- Charcoal",
            "Price": "18.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13820],
            "partNum": "GSBEANIEOLIVE",
            "designation": "3",
            "Name": "White Labs Beanie- Olive",
            "Price": "15.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13073],
            "partNum": "GSBLACKSUNGLASSES",
            "designation": "3",
            "Name": "Black sunglasses with custom arm pattern and logo",
            "Price": "10.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13361],
            "partNum": "GSBLKSNAPBACK",
            "designation": "3",
            "Name": "Black Snapback",
            "Price": "18.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [1740],
            "partNum": "GSBOSTON",
            "designation": "3",
            "Name": "White Labs 32oz Boston Round Growler",
            "Price": "5.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "https://www.whitelabs.com/other-products/glassware-white-labs-growler",
            "searchTags": ""
        }, {
            "volID": [1742],
            "partNum": "GSBURNOUTTANKW-2X",
            "designation": "3",
            "Name": "Women&apos;s Black Burnout Tank",
            "Price": "0.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        },
    ],
};


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

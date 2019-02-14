import inventoryReducer from '../inventoryReducer';
import { inventoryTypes } from 'appRedux/actions/inventoryActions';
import { inventory, inventoryFetch } from '../../mocks';

const cartItem = {
    MerchandiseID: 2425,
    Name: "WLP001 California Ale Yeast",
    OrderDetailQty: 1,
    details: "PurePitch® Nano",
    dispQuantity: 1,
    salesCategory: 3,
    type: 1,
};

describe('testing of inventory reducer',() => {

    it('get inventory attempt set isLoading to true', () => {
        return expect(inventoryReducer(inventory, {
            type: inventoryTypes.GET_INVENTORY_ATTEMPT
        })).toEqual({
            ...inventory,
            isLoading: true
        });
    });

    it('get inventory success set isLoading to false and set itemsToShow, items, category to state', () => {
        return expect(inventoryReducer(inventory, {
            type: inventoryTypes.GET_INVENTORY_SUCCESS,
            data: {
                items: inventoryFetch.items,
                itemsToShow: [],
                category: 1
            }
        })).toEqual({
            ...inventory,
            items: inventoryFetch.items,
            itemsToShow: [],
            category: 1,
            isLoading: false
        });
    });

    it('get inventory failure set isLoading to false', () => {
        return expect(inventoryReducer(inventory, {
            type: inventoryTypes.GET_INVENTORY_FAILURE
        })).toEqual({
            ...inventory,
            isLoading: false
        });
    });

    it('change category success set itemsToShow, category to state and isHomebrew to false', () => {
        return expect(inventoryReducer(inventory, {
            type: inventoryTypes.CHANGE_CATEGORY_SUCCESS,
            data: {
                itemsToShow: [],
                category: 1
            }
        })).toEqual({
            ...inventory,
            itemsToShow: [],
            category: 1,
            isHomebrew: false
        });
    });

    it('search strain success set itemsToShow to state', () => {
        return expect(inventoryReducer(inventory, {
            type: inventoryTypes.SEARCH_STRAIN_SUCCESS,
            data: {
                itemsToShow: []
            }
        })).toEqual({
            ...inventory,
            itemsToShow: []
        });
    });

    it('switch to homebrew success set itemsToShow to state and isHomebrew to true', () => {
        return expect(inventoryReducer(inventory, {
            type: inventoryTypes.SWITCH_TO_HOMEBREW_SUCCESS,
            data: {
                itemsToShow: []
            }
        })).toEqual({
            ...inventory,
            itemsToShow: [],
            isHomebrew: true
        });
    });
});

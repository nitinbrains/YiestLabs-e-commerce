import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
}


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { items, itemsToShow } }) => ({
        itemsToShow, items,
    }),
    [inventoryTypes.CHANGE_CATEGORY_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
    }),
    [inventoryTypes.SEARCH_STRAIN_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
    })
});

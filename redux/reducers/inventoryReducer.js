import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    categoriesLoaded: [],
    error: null
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_SUCCESS]: ({ categoriesLoaded }, { data: { items, loadCategories } }) => ({
        items: [...items],
        categoriesLoaded: [
            ...categoriesLoaded,
            ...loadCategories
        ]
    })
});

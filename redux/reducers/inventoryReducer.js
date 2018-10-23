import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    categoriesLoaded: [],
    error: null
};


export default createReducer(initialState, {
    [messageTypes.GET_INVENTORY_ATTEMPT]: ({ categoriesLoaded }, { data: { items, loadCategories } }) => ({
        items,
        categoriesLoaded: [
            ...categoriesLoaded,
            ...loadCategories
        ]
    })
});

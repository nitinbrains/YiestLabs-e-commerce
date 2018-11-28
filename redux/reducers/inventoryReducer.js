import { createReducer } from '../../helpers/reduxHelpers';
import { inventoryTypes } from '../actions/inventoryActions';

const initialState = {
    items: [],
    itemsToShow: [],
    error: null,
    categories: [{
        label: "Yeast",
        value: 0,
        checked: true,
        subCategories: [{
            label: "Ale Strains",
            value: 1,
            checked: false
        }, {
            label: "Lager Strains",
            value: 2,
            checked: false
        }, {
            label: "Wine/Mead/Cider Strains",
            value: 3,
            checked: false
        }, {
            label: "Distilling Strains",
            value: 4,
            checked: false
        }, {
            label: "Specialty/Belgian Strains",
            value: 5,
            checked: false
        }, {
            label: "Wild Yeast & Bacteria Strains",
            value: 6,
            checked: false
        }, {
            label: "Vault Strains",
            value: 7,
            checked: false
        }]
    }, {
        label: "Enzymes & Nutrients",
        value: 8,
        checked: false,
        subCategories: [{
            label: "Enzymes",
            value: 9,
            checked: false
        }, {
            label: "Nutrients",
            value: 10,
            checked: false
        }]
    }, {
        label: "Analytical Lab Services",
        value: 12,
        checked: false
    }, {
        label: "Lab Supplies",
        value: 13,
        checked: false
    }, {
        label: "Education",
        value: 14,
        checked: false
    }, {
        label: "Gift Shop",
        value: 15,
        checked: false
    }],
    isLoading: false
};


export default createReducer(initialState, {
    [inventoryTypes.GET_INVENTORY_ATTEMPT]: (state, { data }) => ({
        isLoading: true,
    }),
    [inventoryTypes.GET_INVENTORY_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
        isLoading: false
    }),
    [inventoryTypes.GET_INVENTORY_FAILURE]: (state, { data }) => ({
        isLoading: false,
    }),
    [inventoryTypes.SEARCH_STRAIN_SUCCESS]: (state, { data: { itemsToShow } }) => ({
        itemsToShow,
    })
});

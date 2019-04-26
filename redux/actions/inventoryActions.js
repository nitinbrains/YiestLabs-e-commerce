import { createActionsStructure } from 'helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { inventoryTypes, inventoryActions } = createActionsStructure('inventory', [
    { name: 'GET_INVENTORY', async: true },
    { name: 'GET_ITEM_AVAILABILITY', async: true},
    { name: "TOGGLE_HOMEBREW", async: true },
    { name: "SET_PAGE_DATA", async: false },
    { name: "GET_SIMILAR_STRAINS", async: false },
    { name: "GET_ALTERNATE_SIZES", async: false },
]);

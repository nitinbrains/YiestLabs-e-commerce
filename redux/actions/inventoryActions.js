import { createActionsStructure } from 'helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { inventoryTypes, inventoryActions } = createActionsStructure('inventory', [
    { name: 'GET_INVENTORY', async: true },
    { name: 'GET_ITEM_AVAILABILITY', async: true},
    { name: 'CHANGE_CATEGORY', async: true },
    { name: 'SWITCH_TO_HOMEBREW', async: true },
    { name: 'SEARCH_INVENTORY', async: true },
    { name: 'SWITCH_TO_PROFESSIONAL', async: true },
]);

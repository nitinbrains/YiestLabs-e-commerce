import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { inventoryTypes, inventoryActions } = createActionsStructure('inventory', [
  { name: 'GET_INVENTORY', async: true },
  { name: 'CHANGE_CATEGORY', async: true }
]);

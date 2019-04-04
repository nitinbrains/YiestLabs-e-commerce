import { createActionsStructure } from 'helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { loadingTypes, loadingActions } = createActionsStructure('loading', [
    { name: 'START_LOADING', async: true },
    { name: 'STOP_LOADING', async: true},
]);

import { createActionsStructure } from '../../helpers/reduxHelpers';

/* ------------- Action Creators ------------- */

export const { calculatorTypes, calculatorActions } = createActionsStructure('calculator', [
  { name: 'START_CALCULATE', async: true },
  { name: 'CLOSE_DIALOG', async: true },
]);

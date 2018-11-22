import { requestWrapper } from './base';

export const getInventory = () => requestWrapper(`/get-inventory`);

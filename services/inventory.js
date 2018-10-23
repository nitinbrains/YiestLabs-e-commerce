import { requestWrapper } from './base';

export const getInventory = (classFilters) => requestWrapper(`/get-inventory`, {
    query: {
        classFilters: JSON.stringify(classFilters)
    }
});

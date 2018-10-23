import { requestWrapper } from './base';

export const getInventory = (classFilters) => requestWrapper(`/get-user-info`, {
    query: {
        classFilters: JSON.stringify(classFilters)
    }
});

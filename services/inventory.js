import { requestWrapper } from './base';

export const getInventory = () => requestWrapper(`/inventory`);

export const getItemAvailability = (params) => requestWrapper(`/item-availability`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const getSimilarStrains = (params) => requestWrapper(`/similar-strains`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const getAlternateSizes = (params) => requestWrapper(`/alternate-sizes`, {
    method: "POST",
    body: JSON.stringify(params)
});


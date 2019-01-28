import { requestWrapper } from './base';

export const prepareOrder = (params) => requestWrapper(`/prepare-order`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const placeOrder = (params) => requestWrapper(`/place-order`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const getAlternateSizes = (params) => requestWrapper(`/alternate-sizes`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const similarStrains = (params) => requestWrapper(`/similar-strains`, {
    method: "POST",
    body: JSON.stringify(params)
});
import { requestWrapper } from './base';

export const getUserInfo = (params) => requestWrapper(`/get-user-info`, {
    method: "POST",
    body: JSON.stringify(params)
});

export const login = (username, password) => requestWrapper(`/get-user-id`, {
    method: "POST",
    body: JSON.stringify({username, password})
});

export const updateUserInfo = (params) => requestWrapper('/update-user-info', {
    method: "POST",
    body: JSON.stringify(params)
});

export const getOrderHistory = (params) => requestWrapper('/get-order-history', {
    method: "POST",
    body: JSON.stringify(params)
});

export const createNetSuiteAccount = (params) => requestWrapper('/create-netsuite-account', {
    method: "POST",
    body: JSON.stringify(params)
});

export const createYeastmanAccount = (params) => requestWrapper('/create-yeastman-account', {
    method: "POST",
    body: JSON.stringify(params)
});

export const addSubsidiary = (params) => requestWrapper('/add-subsidiary', {
    method: "POST",
    body: JSON.stringify(params)
})
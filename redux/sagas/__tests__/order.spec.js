import { runSaga, storeIO } from 'redux-saga';
import { put, select, delay } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import fetchMock from 'fetch-mock';

import {
    prepareOrder,
    setShippingOption,
    incrementShipDate,
    decrementShipDate
} from '../order';
import {
    initOrder,
    shipAllTogether,
    incrementItemDate
} from '../orderUtils';
// import cartSelectors from '../../selectors/cart.js';
import { orderActions } from '../../actions/orderActions';
import { order, user, today, twoDaysLate, fetchOrderMock } from '../../mocks';


const prepareUserOrder = (order) => initOrder({ ...order }, user);


describe('testing of oder sagas',() => {
    it('prepare order', () => {
        const cartItem = {
            MerchandiseID: 2425,
            Name: "WLP001 California Ale Yeast",
            OrderDetailQty: 1,
            details: "PurePitch® Nano",
            dispQuantity: 1,
            salesCategory: 3,
            type: 1,
        };
        fetchMock.post('http://localhost:3000/prepare-order', fetchOrderMock);
        const action = orderActions.prepareOrder();
        const userOrder = prepareUserOrder(fetchOrderMock);
        return expectSaga(
            prepareOrder, action
        ).withState({
            order,
            user,
            cart: {
                items: [ cartItem ]
            }
        }).put(
            action.responseSuccess({ ...userOrder })
        ).run();
    });

    it('set shipping option', () => {
        const userOrder = prepareUserOrder(fetchOrderMock);
        const items = shipAllTogether(userOrder, user);
        const shippingOption = 'Ship All Together';
        const action = orderActions.setShippingOption(shippingOption);
        const successResponse = orderActions.setItems({ items });
        return expectSaga(
            setShippingOption, action
        ).withState({
            checkout: userOrder,
            user
        }).put(
            action.responseSuccess(shippingOption),
        ).put(successResponse).run();
    });

    it('increment ship date', () => {
        const userOrder = prepareUserOrder(fetchOrderMock);
        const item = incrementItemDate(userOrder, user, userOrder.items[0]);
        const action = orderActions.incrementShipDate(userOrder.items[0]);
        const successResponse = orderActions.setItems({ items: [ item ] });
        return expectSaga(
            incrementShipDate, action
        ).withState({
            checkout: userOrder,
            user
        }).put(
            successResponse
        ).run();
    });

    it('decrement ship date', () => {
        const userOrder = prepareUserOrder(fetchOrderMock);
        const item = userOrder.items[0];
        const action = orderActions.decrementShipDate(userOrder.items[0]);
        const deliveryDate = new Date(twoDaysLate);
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        const shipDate = new Date(today);
        shipDate.setDate(shipDate.getDate() + 1);
        userOrder.items = [{
            ...item,
            shipDate,
            deliveryDate
        }]
        
        shipDate.setDate(shipDate.getDate() - 1);
        deliveryDate.setDate(deliveryDate.getDate() - 1); 
        const successResponse = orderActions.setItems({ items: [ { ...item, shipDate, deliveryDate } ] });
        return expectSaga(
            decrementShipDate, action
        ).withState({
            checkout: userOrder,
            user
        }).put(
            successResponse
        ).run();
    })
})

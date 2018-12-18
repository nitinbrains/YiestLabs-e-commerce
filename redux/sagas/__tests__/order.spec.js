import { runSaga, storeIO } from 'redux-saga';
import { put, select, delay } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import fetchMock from 'fetch-mock';

import {
    prepareOrder,
    setShippingOption,
    incrementShipDate,
    decrementShipDate,
    initOrder
} from '../order';
// import cartSelectors from '../../selectors/cart.js';
import { orderActions } from '../../actions/orderActions';
import { order, user } from '../../mocks';

const today = new Date();
const twoDaysLate = new Date()
twoDaysLate.setDate(today.getDate() + 2);

const fetchOrderMock = {
    calcShip: true,
    userID: 43148,
    shipMethod: "2789",
    items: [{
        "Name":"WLP001 California Ale Yeast",
        "salesCategory": 3,
        "dispQuantity": 1,
        "OrderDetailQty": 1,
        "MerchandiseID": 2425,
        "deliveryDate": twoDaysLate,
        "details": "PurePitch® Nano",
        "type": 1,
        "shipDate": today,
        "Warehouse": 9,
        "pricePerUnit": 85.17
    }],
    transitTimes: {
        "4": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2787": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "2788": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "2789": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        },
        "2790": {
            "daysInTransit": 3,
            "daysInTransitRange": 0
        },
        "2791": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2792": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2794": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        },
        "2841": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "2842": {
            "daysInTransit": 3,
            "daysInTransitRange": 3
        },
        "2843": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "2844": {
            "daysInTransit": 3,
            "daysInTransitRange": 3 
        },
        "2845": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2846": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "2847": {
            "daysInTransit": 4,
            "daysInTransitRange": 3
        },
        "2848": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "2849": {
            "daysInTransit": 3,
            "daysInTransitRange": 3
        },
        "2850": {
            "daysInTransit": 3,
            "daysInTransitRange": 0
        },
        "3469": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3470": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3471": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3472": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        },
        "3475": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "3511": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3609": {
            "daysInTransit": 0,
            "daysInTransitRange": 3
        },
        "13300": {
            "daysInTransit": 3,
            "daysInTransitRange": 3
        },
        "13320": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "13332": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        }
    },
    "itemSubtotal": 85.17,
    "shippingSubtotal": 17,
    "orderSubtotal": 102.17
};


const prepareUserOrder = (order) => {
    const userOrder = Object.assign({}, order);
    initOrder(userOrder, user);
    return userOrder;
}


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
        const shippingOption = 'Ship All Together';
        const action = orderActions.setShippingOption(shippingOption);
        const successResponse = orderActions.setItems({ items: userOrder.items });
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
        const item = userOrder.items[0];
        const action = orderActions.incrementShipDate(userOrder.items[0]);
        const shipDate = new Date(item.shipDate);
        const deliveryDate = new Date(item.deliveryDate);
        shipDate.setDate(shipDate.getDate() + 1);
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        const successResponse = orderActions.setItems({ items: [ { ...item, shipDate, deliveryDate } ] });
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

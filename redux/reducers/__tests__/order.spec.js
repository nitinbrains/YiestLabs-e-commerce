import orderReducer from '../orderReducer';
import { orderTypes } from 'appRedux/actions/orderActions';
import { order, fetchOrderMock } from '../../mocks';

describe('testing of order reducer',() => {

    it('prepare order attempt set isLoading to true', () => {
        return expect(orderReducer(order, {
            type: orderTypes.PREPARE_ORDER_ATTEMPT
        })).toEqual({
            ...order,
            isLoading: true
        });
    });

    it('prepare order failure return initialState', () => {
        return expect(orderReducer(order, {
            type: orderTypes.PREPARE_ORDER_FAILURE,
        })).toEqual({
            ...order,
            isLoading: false
        });
    });

    it('prepare order success add new order properties to initialState', () => {
        return expect(orderReducer(order, {
            type: orderTypes.PREPARE_ORDER_SUCCESS,
            data: fetchOrderMock
        })).toEqual({
            ...order,
            ...fetchOrderMock,
            isLoading: false
        });
    });

    it('set items attempt set items to order state', () => {
        return expect(orderReducer(order, {
            type: orderTypes.SET_ITEMS_ATTEMPT,
            data: {
                items: fetchOrderMock.items
            }
        })).toEqual({
            ...order,
            items: fetchOrderMock.items
        });
    });

    it('set shipping option success set to order state selectedShippingOption', () => {
        return expect(orderReducer(order, {
            type: orderTypes.SET_SHIPPING_OPTION_SUCCESS,
            data: 'Earliest For Each'
        })).toEqual({
            ...order,
            selectedShippingOption: 'Earliest For Each'
        });
    });
});

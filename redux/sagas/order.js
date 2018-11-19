import { take, call, put, cancelled, takeEvery, all, fork, select  } from 'redux-saga/effects';
import * as api from '../../services/order';
import { orderActions } from '../actions/orderActions';

import Utils from '../../lib/Utils';

export function * prepareOrder(action) {
    const { responseSuccess, responseFailure } = action;

    try {
        const cart = yield select(state => state.cart);
        const user = yield select(state => state.user);

        var { res: order, error } = yield call(api.prepareOrder, {
            calcShip: true,
            userId: user.id,
            shipMethod: user.shipmethod,
            items: cart.items
        });

        if (error) {
            yield put(responseFailure(error));
        } else {
            initOrder(order, user);
            yield put(responseSuccess(order));
        }
    } catch (error) {
        yield put(responseFailure(error));
    }
};


export function * setShippingOption(action) {
    const { responseSuccess, responseFailure, data: option } = action;
    try {
        var checkout = yield select(state => state.checkout);
        const user = yield select(state => state.user);

        changeShippingOption(checkout, user, option);
        yield put(responseSuccess(option));
        yield put(order.setItems(checkout.items ));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function * incrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        var checkout = yield select(state => state.checkout);
        const user = yield select(state => state.user);

        incrementItemDate(checkout, user, item);
        yield put(order.setItems(checkout.items ));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

export function * decrementShipDate(action) {
    const { responseSuccess, responseFailure, data: item } = action;
    try {
        var checkout = yield select(state => state.checkout);
        const user = yield select(state => state.user);

        decrementItemDate(checkout, user, item);
        yield put(order.setItems(checkout.items ));
    } catch (error) {
        yield put(responseFailure(error));
    }
}

/****** Business logic ********/

function initOrder(order, user) {

    // initialize order
    initDates(order);
    setShippingOption("Ship All Together");
}

/*
 * Initialize items with valid ship and delivery dates
 */
 function initDates(order, user) {
     for(var i = 0; i < order.items.length; i++)
     {
         var item = order.items[i];

         var shipDate = new Date(item.shipDate);
         var deliveryDate = getDeliveryDate(order, shipDate);

         while(!checkDeliveryDate(user, deliveryDate) || !checkShipDate(user, shipDate))
         {
             deliveryDate.setDate(deliveryDate.getDate() + 1);
             shipDate.setDate(shipDate.getDate() + 1);
         }

         item.deliveryDate = deliveryDate;
         item.shipDate = shipDate;
         item.earliestShipDate = new Date(shipDate);
     }
 }

/*
 * Find next closest ship and delivery dates for item
 */
 function incrementItemDate(order, user, item)
 {
     var shipDate = new Date(item.shipDate);
     var deliveryDate = getDeliveryDate(order, user, shipDate);
     var foundDate;

     while(!foundDate)
     {
         deliveryDate.setDate(deliveryDate.getDate() + 1);
         shipDate.setDate(shipDate.getDate() + 1);

         if(checkDeliveryDate(user, deliveryDate) && checkShipDate(user, shipDate))
         {
             foundDate = true;
         }
     }

     item.deliveryDate = deliveryDate;
     item.shipDate = shipDate;
 }

/*
 * Find previous closest ship and delivery dates for item
 */
 function decrementItemDate(order, user, item)
 {

     var shipDate = new Date(item.shipDate);
     var deliveryDate = getDeliveryDate(order, user, shipDate);
     var foundDate;

     while(!foundDate&& Utils.compareDates(shipDate, item.earliestShipDate) < 0)
     {
         deliveryDate.setDate(deliveryDate.getDate() - 1);
         shipDate.setDate(shipDate.getDate() - 1);

         if(checkDeliveryDate(user, deliveryDate) && checkShipDate(user, shipDate))
         {
             foundDate = true;
         }
     }

     item.deliveryDate = deliveryDate;
     item.shipDate = shipDate;

 }

 function getDeliveryDate(order, user, shipDate)
 {
     var deliveryDate = new Date(shipDate);
     var transitDelay = order.transitTimes[user.shipmethod];
     if(!transitDelay || !transitDelay.daysInTransit)
     {
         transitDelay = 1;
     }
     else
     {
         transitDelay = transitDelay.daysInTransit;
     }

     deliveryDate.setDate(deliveryDate.getDate() + transitDelay);
     return deliveryDate;
 }

 /*
  * Compute the delivery date range based on ship method
  */
 function getDeliveryDateRange(order, user, date) {

     date = new Date(date);
     var transitTime = order.transitTimes[user.shipmethod];
     var range = 0;
     if(transitTime)
     {
         var range = transitTime.daysInTransitRange;
     }

     date.setDate(date.getDate() + range);
     return date;
 }


 function changeShippingOption(order, user, option) {

     switch(option) {
         case "Custom":
         case "Earliest For Each":
            earliestForAll(order, user)
            break;
        case "Ship All Together":
        default:
           shipAllTogether(order, user);
           break;
     }

 }


/*
 * Find earliest ship dates for each item
 */
function earliestForAll(order, user) {
    for(var i = 0; i < order.items.length; i++)
    {
        order.items[i].shipDate = order.items[i].earliestShipDate;
        order.items[i].deliveryDate = getDeliveryDate(order, user, items[i].shipDate)
    }
}


/*
 * Find item with longest ship date interval and set all items' ship
 * dates to that item's ship date
 */
function shipAllTogether(order, user) {

    var shipDates = [];

    order.items.forEach(function(item) {
        shipDates.push(item.shipDate);
    })

    // Find item with farthest ship date
    var index = Utils.findMaxDateIndex(shipDates);

    for(var i = 0; i < items.length; i++)
    {
        if(i != index)
        {
            order.items[i].shipDate = new Date(order.items[index].shipDate);
            order.items[i].deliveryDate = getDeliveryDate(order, user, items[i].shipDate)
        }
    }
}

/*
 * Utility function to check for valid delivery date
 */
function checkDeliveryDate(user, deliveryDate) {

    var subsidiary = user.subsidiary;
    var saturday = deliveryDate.getDay() == 0;
    var sunday = deliveryDate.getDay() == 6;
    var holiday = Utils.checkHoliday(deliveryDate, subsidiary);

    if(saturday || sunday || holiday)
    {
        return false;
    }
    else
    {
        return true;
    }
}

/*
 * Utility function to check for valid ship date
 */
 function checkShipDate(user, shipDate) {

     var subsidiary = user.subsidiary;
     var saturday = shipDate.getDay() == 0;
     var sunday = shipDate.getDay() == 6;
     var holiday = Utils.checkHoliday(shipDate, user.subsidiary);

     if(user.shipmethod == 3470 && shipDate.getDay() != 3)
     {
         return false;
     }
     else if((shipDate.getDay() < 1 || shipDate.getDay() > 3 ) && subsidiary == 7) //International only monday tuesday
     {
         return false;
     }
     else if(saturday || sunday || holiday)
     {
         return false;
     }
     else
     {
         return true;
     }
 }

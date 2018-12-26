import Utils from '../../lib/Utils';

/*
 * Utility function to check for valid delivery date
 */
const checkDeliveryDate = (user, deliveryDate) => {
    const subsidiary = user.subsidiary;
    const saturday = deliveryDate.getDay() == 0;
    const sunday = deliveryDate.getDay() == 6;
    const holiday = Utils.checkHoliday(deliveryDate, subsidiary);

    return !(saturday || sunday || holiday);
};

/*
 * Utility function to check for valid ship date
 */
const checkShipDate = (user, shipDate) => {
    const subsidiary = user.subsidiary;
    const saturday = shipDate.getDay() == 0;
    const sunday = shipDate.getDay() == 6;
    const holiday = Utils.checkHoliday(shipDate, user.subsidiary);

    if (user.shipmethod == 3470 && shipDate.getDay() != 3) {
        return false;
    } else if ((shipDate.getDay() < 1 || shipDate.getDay() > 3) && subsidiary == 7) { //International only monday tuesday
        return false;
    } else if(saturday || sunday || holiday) {
        return false;
    }
    return true;
};

const getDeliveryDate = (order, user, shipDate) => {
    const deliveryDate = new Date(shipDate);
    let transitDelay = order.transitTimes[user.shipmethod];
    if(!transitDelay || !transitDelay.daysInTransit) {
        transitDelay = 1;
    } else {
        transitDelay = parseInt(transitDelay.daysInTransit);
    }

    deliveryDate.setDate(deliveryDate.getDate() + transitDelay);
    return deliveryDate;
};

/*
* Compute the delivery date range based on ship method
*/
const getDeliveryDateRange = (order, user, date) => {

    const deliveryDate = new Date(date);
    const transitTime = order.transitTimes[user.shipmethod];
    const range = transitTime ? parseInt(transitTime.daysInTransitRange) : 0;
    deliveryDate.setDate(deliveryDate.getDate() + range);
    return deliveryDate;
};

/*
 * Initialize items with valid ship and delivery dates
 */
const initDates = (order, user) => ({
    ...order,
    items: order.items.map(item => {
        const shipDate = new Date(item.shipDate);
        const deliveryDate = getDeliveryDate(order, user, shipDate);
        while(!checkDeliveryDate(user, deliveryDate) || !checkShipDate(user, shipDate)) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            shipDate.setDate(shipDate.getDate() + 1);
        }
        return {
            ...item,
            deliveryDate,
            shipDate,
            earliestShipDate: new Date(shipDate)
        }
    })
});

/*
 * Find earliest ship dates for each item
 */
export const earliestForAll = (order, user) => order.items.map(item => ({
    ...item,
    shipDate: item.earliestShipDate,
    deliveryDate: getDeliveryDate(order, user, item.shipDate)
}));

/*
 * Find item with longest ship date interval and set all items' ship
 * dates to that item's ship date
 */
export const shipAllTogether = (order, user) => {

    const shipDates = order.items.map((item) => item.shipDate)

    // Find item with farthest ship date
    const index = Utils.findMaxDateIndex(shipDates);

    return order.items.map((item) => ({
            ...item,
            shipDate: new Date(item.shipDate),
            shipDate: getDeliveryDate(order, user, new Date(item.shipDate)),
    }))
};

export const changeShippingOption = (order, user, option) => {
    switch(option) {
        case "Custom":
        case "Earliest For Each":
            return earliestForAll(order, user)
        case "Ship All Together":
        default:
           return shipAllTogether(order, user);
    }

};

export const initOrder = (order, user) => ({
    ...order,
    items: changeShippingOption(initDates(order, user), user, "Ship All Together")
});


/*
 * Find next closest ship and delivery dates for item
 */
export const incrementItemDate = (order, user, item) => {
    const shipDate = new Date(item.shipDate);
    const deliveryDate = getDeliveryDate(order, user, shipDate);
    let foundDate;
    while(!foundDate) {
        deliveryDate.setDate(deliveryDate.getDate() + 1);
        shipDate.setDate(shipDate.getDate() + 1);

        if (checkDeliveryDate(user, deliveryDate) && checkShipDate(user, shipDate)) {
            foundDate = true;
        }
    }
    return {
        ...item,
        deliveryDate,
        shipDate
    }
 }

/*
 * Find previous closest ship and delivery dates for item
 */
export const decrementItemDate = (order, user, item) => {
    const shipDate = new Date(item.shipDate);
    const deliveryDate = getDeliveryDate(order, user, shipDate);
    let foundDate;

    while(!foundDate&& Utils.compareDates(shipDate, item.earliestShipDate) < 0)
    {
        deliveryDate.setDate(deliveryDate.getDate() - 1);
        shipDate.setDate(shipDate.getDate() - 1);

        if(checkDeliveryDate(user, deliveryDate) && checkShipDate(user, shipDate)) {
            foundDate = true;
        }
    }
    return {
        ...item,
        deliveryDate,
        shipDate
    }
}

'use strict'

import Utils from './Utils';

var Checkout = (function() {

    // global variables
    var items;
    var transitTimes;
    var subsidiary;
    var shipMethod;

    /*
     * Prepare order for Checkout screen
     */
    function initOrder(order, user){

        // initialize Checkout
        transitTimes = order.transitTimes
        shipMethod = parseInt(user.shipmethod);
        subsidiary = parseInt(user.subsidiary)
        items = order.items;


        // initialize order
        order.subsidiary = subsidiary;
        order.shipMethod = shipMethod;
        initDates(order);
    }

    /*
     * Initialize items with valid ship and delivery dates
     */
    function initDates(order)
    {
        for(var i = 0; i < order.items.length; i++)
        {
            order.items[i].earliestShipDate = new Date(order.items[i].earliestShipDate);
            incrementItemDate(order.items[i]);
        }
    }

    /*
     * Find next closest ship and delivery dates for item
     */
    function incrementItemDate(item)
    {
        try {
            if(!transitTimes || !shipMethod) {
                throw { message: 'transitTimes or shipMethod is undefined', code: -1};
            }

            var shipDate = new Date(item.shipDate);
            var deliveryDate = new Date(shipDate);
            var transitDelay = transitTimes[shipMethod];
            var foundDate;

            if(isNaN(transitDelay.daysInTransit))
            {
                transitDelay = 1;
            }
            else
            {
                transitDelay = transitDelay.daysInTransit;
            }

            deliveryDate.setDate(deliveryDate.getDate() + transitDelay);

            while(!foundDate)
            {
                deliveryDate.setDate(deliveryDate.getDate()+1);
                shipDate.setDate(shipDate.getDate()+1);

                if(checkDeliveryDate(deliveryDate) && checkShipDate(shipDate))
                {
                    foundDate = true;
                }
            }

            item.deliveryDate = deliveryDate;
            item.shipDate = shipDate;
        }
        catch(error) {
            console.log('incrementItemDate', error);
            throw error;
        }
    }

    /*
     * Find previous closest ship and delivery dates for item
     */
    function decrementItemDate(item )
    {
        try {
            if(!transitTimes || !shipMethod) {
                throw { message: 'transitTimes or shipMethod is undefined', code: -1};;
            }

            var shipDate = new Date(item.shipDate);
            var deliveryDate = new Date(shipDate);
            var transitDelay = transitTimes[shipMethod];
            var foundDate;

            if(isNaN(transitDelay.daysInTransit))
            {
                transitDelay = 1;
            }
            else
            {
                transitDelay = transitDelay.daysInTransit;
            }

            deliveryDate.setDate(deliveryDate.getDate() + transitDelay);

            while(!foundDate && Utils.compareDates(shipDate, item.earliestShipDate) < 0)
            {
                deliveryDate.setDate(deliveryDate.getDate() - 1);
                shipDate.setDate(shipDate.getDate() - 1);

                if(checkDeliveryDate(deliveryDate) && checkShipDate(shipDate))
                {
                    foundDate = true;
                }
            }

            item.deliveryDate = deliveryDate;
            item.shipDate = shipDate;

        }
        catch (error) {
            console.log('decrementItemDate', error);
            throw error;
        }
    }


    /*
     * Find earliest ship dates for each item
     */
    function earliestForAll()
    {
        for(var i = 0; i < items.length; i++)
        {
            items[i].shipDate = items[i].earliestShipDate;
            incrementItemDate(items[i]);
        }
    }


    /*
     * Find item with longest ship date interval and set all items' ship
     * dates to that item's ship date
     */
    function shipAllTogether()
    {

        var shipDates = [];

        items.forEach(function(item) {
            shipDates.push(item.shipDate);
        })

        // Find item with farthest ship date
        var index = Utils.findMaxDateIndex(shipDates);

        for(var i = 0; i < items.length; i++)
        {
            if(i != index)
            {
                items[i].shipDate = items[i].earliestShipDate;
                incrementItemDate(items[i]);
            }
        }
    }

    /*
     * Compute the delivery date range based on ship method
     */
    function getDeliveryDateRange(date)
    {

        date = new Date(date);
        var transitTime = transitTimes[shipMethod];
        var range = 0;
        if(transitTime)
        {
            var range = transitTime.daysInTransitRange;
        }

        date.setDate(date.getDate() + range);
        return date;
    }

    /*
     * Utility function to check for valid delivery date
     */
    function checkDeliveryDate(deliveryDate)
    {
        if(deliveryDate.getDay() == 0 || deliveryDate.getDay() == 6 || !Utils.checkHoliday(deliveryDate, subsidiary))
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
    function checkShipDate(shipDate)
    {
        if(shipMethod == 3470 && shipDate.getDay() != 3)
        {
            return false;
        }
        else if((shipDate.getDay() < 1 || shipDate.getDay() > 3 ) && subsidiary == 7) //International only monday tuesday
        {
            return false;
        }
        else if(shipDate.getDay() == 0 || shipDate.getDay() == 6)
        {
            return false;
        }
        else if(Utils.checkHoliday(shipDate, subsidiary)) //need to get dates that HK won't ship
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    return {
        initOrder: initOrder,
        incrementItemDate: incrementItemDate,
        decrementItemDate: decrementItemDate
    }

})();

export default Checkout;

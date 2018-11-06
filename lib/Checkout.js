'use strict'

import Utils from './Utils';
import User from './User';

var Checkout = (function() {

    // global variables
    var items;
    var transitTimes;
    var shippingOptions = ["Ship All Together", "Earliest For Each", "Custom"];
    var selectedShippingOption;

    function getItems() {
        return items;
    }


     /*
     * Prepare order for Checkout screen
     */
    function initOrder(order) {

        // initialize order
        transitTimes = order.transitTimes
        items = order.items;
        initDates(order);
        setShippingOption("Ship All Together");
        return order;
    }

    /*
     * Initialize items with valid ship and delivery dates
     */
     function initDates() {
         for(var i = 0; i < items.length; i++)
         {
             var item = items[i];

             var shipDate = new Date(item.shipDate);
             var deliveryDate = getDeliveryDate(shipDate);

             while(!checkDeliveryDate(deliveryDate) || !checkShipDate(shipDate))
             {
                 deliveryDate.setDate(deliveryDate.getDate()+1);
                 shipDate.setDate(shipDate.getDate()+1);
             }

             item.deliveryDate = deliveryDate;
             item.shipDate = shipDate;
             item.earliestShipDate = new Date(shipDate);
         }
     }

    /*
     * Find next closest ship and delivery dates for item
     */
     function incrementItemDate(item)
     {
         var shipDate = new Date(item.shipDate);
         var deliveryDate = getDeliveryDate(shipDate);
         var foundDate;

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

    /*
     * Find previous closest ship and delivery dates for item
     */
     function decrementItemDate(item)
     {

         var shipDate = new Date(item.shipDate);
         var deliveryDate = getDeliveryDate(shipDate);
         var foundDate;

         while(!foundDate&& Utils.compareDates(shipDate, item.earliestShipDate) < 0)
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

     function getDeliveryDate(shipDate)
     {
         var deliveryDate = new Date(shipDate);
         var transitDelay = transitTimes[User.getShipMethod()];
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
     function getDeliveryDateRange(date) {

         date = new Date(date);
         var transitTime = transitTimes[User.getShipMethod()];
         var range = 0;
         if(transitTime)
         {
             var range = transitTime.daysInTransitRange;
         }

         date.setDate(date.getDate() + range);
         return date;
     }


     function setShippingOption(option) {

         switch(option) {
             case "Custom":
             case "Earliest For Each":
                earliestForAll()
                break;
            case "Ship All Together":
            default:
               shipAllTogether();
               break;
         }

         selectedShippingOption = option;

     }



    /*
     * Find earliest ship dates for each item
     */
    function earliestForAll() {
        for(var i = 0; i < items.length; i++)
        {
            items[i].shipDate = items[i].earliestShipDate;
            items[i].deliveryDate = getDeliveryDate(items[i].shipDate)
        }
    }


    /*
     * Find item with longest ship date interval and set all items' ship
     * dates to that item's ship date
     */
    function shipAllTogether() {

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
                items[i].shipDate = new Date(items[index].shipDate);
                items[i].deliveryDate = new Date(items[index].deliveryDate);
            }
        }
    }

    /*
     * Utility function to check for valid delivery date
     */
    function checkDeliveryDate(deliveryDate) {

        var subsidiary = User.getSubsidiary();
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
     function checkShipDate(shipDate) {

         var subsidiary = User.getSubsidiary();
         var saturday = shipDate.getDay() == 0;
         var sunday = shipDate.getDay() == 6;
         var holiday = Utils.checkHoliday(shipDate, User.getSubsidiary());

         if(User.getShipMethod() == 3470 && shipDate.getDay() != 3)
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

    return {
        getItems: getItems,
        initOrder: initOrder,
        incrementItemDate: incrementItemDate,
        decrementItemDate: decrementItemDate,
        getDeliveryDateRange: getDeliveryDateRange,
        setShippingOption: setShippingOption
    }

})();

export default Checkout;

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
     * Return number of SaleItems
     */
    function getLength()
    {
        return SaleItems.length;
    }

    /*
     * Initialize items with valid ship and delivery dates
     */
     function initDates()
     {
         for(var i = 0; i < SaleItems.length; i++)
         {
             var item = SaleItems[i];

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
      * Calculate delivery date based on ship date and transit time
      */
     function getDeliveryDate(shipDate)
     {
         var deliveryDate = new Date(shipDate);
         var transitDelay = TransitTimes[shipMethod];
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


    /*
     * Find earliest ship dates for each item
     */
     function earliestForAll()
     {
         for(var i = 0; i < SaleItems.length; i++)
         {
             SaleItems[i].shipDate = new Date(SaleItems[i].earliestShipDate)
             SaleItems[i].deliveryDate = getDeliveryDate(SaleItems[i].shipDate)
         }
     }


    /*
     * Find item with longest ship date interval and set all items' ship
     * dates to that item's ship date
     */
     function shipAllTogether()
     {

         var initialShipDates = [];
         for(var i = 0; i < SaleItems.length; i++)
         {
             initialShipDates.push(SaleItems[i].shipDate)
         }


         var index = Utils.findMaxDateIndex(initialShipDates);

         for(var i = 0; i < SaleItems.length; i++)
         {
             if(i != index)
             {
                 SaleItems[i].shipDate = new Date(SaleItems[index].shipDate);
                 SaleItems[i].deliveryDate = new Date(SaleItems[index].deliveryDate);
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

'use strict'

import { Alert } from 'react-native';
import { Network } from './Network';
import { SalesLib } from './SalesLib';
import { State } from './State';
import { Utils } from './Utils';
import { ErrorMod } from './Error';
import { WLCart } from './WhiteLabsCart';
import { WLHelper } from './WLHelper';

var ConfirmationModule = (function () {

    var newShip = {}, shipToggle = false, //false is default
    newBill = {}, billToggle = false, //false is default
    creditCard,
    shipMethodDefault,
    shipMethod,
    orderComment,
    orderPONum,
    shippingSubtotal = 0,
    itemSubtotal = 0,
    orderSubtotal = 0,
    CustomerID = 0,
    SaleItems = [],
    TransitTimes = {},
    inError = false,
    couponLookup, //Call back to verify coupon and get discount amount
    Coupon,
    DeliveryDates = [],
    subsidiary,
    initialDeliveryDates = [],
    initialShipDates = [];

    function init(userID, UserInfo, items, transitTimes, itemSub, shippingSub, orderSub)
    {
        inError = false;
        try
        {
            CustomerID = parseInt(userID);
            if(isNaN(CustomerID))
            {
                inError = true;
                throw {message: 'Invalid CustomerID', code: 0};
            }

            SaleItems = items;
            if(SaleItems.length == 0)
            {
                inError = true;
                throw {message: 'No Items in ConfirmationCart', code: 0};
            }

            if(!transitTimes)
            {
                inError = true;
                throw {message: 'No Transit Times Provided', code: 0};
            }
            TransitTimes = transitTimes;

            shipMethodDefault = parseInt(UserInfo.shipmethod);
            if(isNaN(shipMethodDefault))
            {
                inError = true;
                throw {message: 'Invalid Ship Method Selected', code: 0};
            }
            shipMethod = parseInt(shipMethodDefault);
            subsidiary = parseInt(UserInfo.subsidiary);

            initDates();

            itemSubtotal = parseFloat(itemSub);
            if(isNaN(itemSubtotal))
            {
                inError = true;
                throw {message: 'Invalid Item Subtotal', code: 0};
            }

            shippingSubtotal = parseFloat(shippingSub);
            if(isNaN(shippingSubtotal))
            {
                inError = true;
                throw {message: 'Invalid Shipping Subtotal', code: 0};
            }

            orderSubtotal = parseFloat(orderSub);
            if(isNaN(orderSubtotal))
            {
                inError = true;
                throw {message: 'Invalid Order Subtotal', code: 0};
            }
        }
        catch(err)
        {
            inError = true;
            throw err;
        }
    }

    function initDates()
    {
        DeliveryDates = [];
        initialDeliveryDates = [], initialShipDates = [];
        for(var i = 0; i < SaleItems.length; i++)
        {
            var earliestShipDate = new Date(SaleItems[i].earliestShipDate);
            SaleItems[i].chosenShipDate = new Date(earliestShipDate);
            SaleItems[i].earliestShipDate = new Date(earliestShipDate);

            // This sets the delivery dates and makes sure that the date 
            // passed back from NS is a valid shippable day
            incrementItemDate(i); 
            decrementItemDate(i);

            initialDeliveryDates.push(DeliveryDates[i]);
            initialShipDates.push(SaleItems[i].chosenShipDate);
        }
    }


    function getLength()
    {
        return SaleItems.length;
    }

    function getErrorState()
    {
        return inError;
    }

    function earliestForAll()
    {
        var deliverydates = initialDeliveryDates.slice();
        var shipdates = initialShipDates.slice();

        for(var i = 0; i < SaleItems.length; i++)
        {
            DeliveryDates[i] = deliverydates[i];
            SaleItems[i].chosenShipDate = shipdates[i];
        }
    }

    function deliverAllTogether()
    {

        var deliverydates = initialDeliveryDates.slice();
        var shipdates = initialShipDates.slice();


        var index = Utils.findMaxDateIndex(deliverydates);
        for(var i = 0; i < SaleItems.length; i++)
        {
            if(i != index)
            {
                deliverydates[i] = new Date(deliverydates[index]);
                shipdates[i] = new Date(shipdates[index]);
            }
        }


        if(Utils.checkAllEqual(deliverydates))
        {
            for(var j in deliverydates)
            {
                DeliveryDates[j] = new Date(deliverydates[j]);
                SaleItems[j].chosenShipDate = new Date(shipdates[j]);
            }
        }
        else
        {
            throw {message: 'Items cannot be delivered together', code: 0};
        }
    }

    function incrementItemDate(index)
    {
        var deliveryDate = new Date(SaleItems[index].chosenShipDate);
        var transitDelay = TransitTimes[shipMethod].daysInTransit;
        if(isNaN(transitDelay))
        {
            transitDelay = 1;
        }
        deliveryDate.setDate(deliveryDate.getDate() + transitDelay);
        var shipDate = new Date(SaleItems[index].chosenShipDate);
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

        DeliveryDates[index] = deliveryDate;
        SaleItems[index].chosenShipDate = shipDate;
    }

    function decrementItemDate(index)
    {
        var deliveryDate = new Date(SaleItems[index].chosenShipDate);
        var transitDelay = TransitTimes[shipMethod].daysInTransit;
        
        if(isNaN(transitDelay))
        {
            transitDelay = 1;
        }

        deliveryDate.setDate(deliveryDate.getDate() + transitDelay);
        var backupDate = new Date(deliveryDate);
        var shipDate = new Date(SaleItems[index].chosenShipDate);
        var foundDate;

        while(!foundDate&& Utils.compareDates(shipDate, SaleItems[index].earliestShipDate) < 0)
        {
            deliveryDate.setDate(deliveryDate.getDate()-1);
            shipDate.setDate(shipDate.getDate()-1);

            if(checkDeliveryDate(deliveryDate) && checkShipDate(shipDate))
            {
                foundDate = true;
            }
        }

        if(foundDate)
        {
            DeliveryDates[index] = deliveryDate;
            SaleItems[index].chosenShipDate = shipDate;
            return new Date(deliveryDate);
        }
        else
        {
            return backupDate;
        }
    }

    function getDeliveryDateRange(date)
    {

        date = new Date(date);
        date.setDate(date.getDate() + TransitTimes[shipMethod].daysInTransitRange);
        return date;
    }

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

    function restoreOrderDefaults()
    {
        shipToggle = false;
        billToggle = false;
        shipMethod = parseInt(shipMethodDefault);
        creditCard = null;
        orderComment = null;
        orderPONum = null;
    }

    function restoreDefaultShip()
    {
        shipToggle = false;
    }

    function restoreDefaultBill()
    {
        billToggle = false;
    }

    function changeShip(shipAddress) //index or {addressee, address1, address2, address3, city, zip, country}
    {
        var AddressList = State.getState('UserInfo').otherAddresses;
        var test = parseInt(shipAddress);
        if(isNaN(test))
        {
            //expect address
            shipToggle = true;
            newShip = {
                attn: shipAddress.attn,
                addressee: shipAddress.addressee,
                address1: shipAddress.address1,
                address2: shipAddress.address2,
                address3: shipAddress.address3,
                city: shipAddress.city,
                zip: shipAddress.zip,
                country: shipAddress.countryid
            };
        }
        else
        {
            //expect index
            if(AddressList[test])
            {
                if(AddressList[test].defaultShip)
                {
                    shipToggle = false;
                }
                else
                {
                    shipToggle = true;
                    newShip = {
                        attn: AddressList[test].attn,
                        addressee: AddressList[test].addressee,
                        address1: AddressList[test].address1,
                        address2: AddressList[test].address2,
                        address3: AddressList[test].address3,
                        city: AddressList[test].city,
                        zip: AddressList[test].zip,
                        country: AddressList[test].countryid
                    };
                }
            }
            else
            {
                inError = true;
                throw {message: 'Invalid index reached', code: 0};
            }
        }
    }

    function changeBill(billAddress) //index or {addressee, address1, address2, address3, city, zip, country}
    {
        var AddressList = State.getState('UserInfo').otherAddresses;
        var test = parseInt(billAddress);
        if(isNaN(test))
        {
            //expect address
            billToggle = true;
            newBill = {
                attn: billAddress.attn,
                addressee: billAddress.addressee,
                address1: billAddress.address1,
                address2: billAddress.address2,
                address3: billAddress.address3,
                city: billAddress.city,
                zip: billAddress.zip,
                country: billAddress.countryid
            };
        }
        else
        {
            //expect index
            if(AddressList[test])
            {
                if(AddressList[test].defaultBill)
                {
                    billToggle = false;
                }
                else
                {
                    billToggle = true;
                    newBill = {
                        attn: billAddress.attn,
                        addressee: AddressList[test].addressee,
                        address1: AddressList[test].address1,
                        address2: AddressList[test].address2,
                        address3: AddressList[test].address3,
                        city: AddressList[test].city,
                        zip: AddressList[test].zip,
                        country: AddressList[test].countryid
                    };
                }
            }
            else
            {
                inError = true;
                throw {message: 'Could not change Billing address', code: 0};
            }
        }
    }

    async function changeShipMethod(shipMethodID) //id if -1 then restore default
    {
        var test = parseInt(shipMethodID);
        if(isNaN(test))
        {
            inError = true;
            throw {message: 'Invalid Ship Method ID', code: 0};
        }
        else if(test == -1)
        {
            shipMethod = parseInt(shipMethodDefault);
        }
        else
        {
            shipMethod = shipMethodID;
        }

        await updatePricing(); 
    }

    function addOrderComment(comment)
    {
        if(poNum)
        {
            orderComment = String(comment);
        }
        else
        {
            orderComment = null;
        }
    }

    function addOrderPONum(poNum)
    {
        if(poNum)
        {
            orderPONum = String(poNum);
        }
        else
        {
            orderPONum = null;
        }
    }

    function changeCreditCard(creditcard) //id or {expire, ccnumber, name, type}
    {
        var test = parseInt(creditcard);
        if(isNaN(test))
        {
            //expect creditcard
            //not currently supported in RESTlet
            inError = true;
        }
        else
        {
            //expect id
            creditCard = test;
        }
    }

    async function exchangeAlternateSize(itemToRemoveIndex, items)
    {
        WLCart.removeItem(itemToRemoveIndex);
        items.forEach((item, index) => WLCart.addToCart(item, index, item.OrderDetailQty));
    }

    async function exchangeSimilarStrain(itemToRemoveIndex, item)
    {
        WLCart.removeItem(itemToRemoveIndex);
        WLCart.addToCart(item, WLHelper.getPurePitchSize(item.Name), item.OrderDetailQty);
    }

    async function addCoupon(couponCode)
    {
        Coupon = String(couponCode);
        var cache = checkForDiscount();
        await updatePricing();
        return checkForDiscount(cache);
    }

    function getOrder()
    {
        var ShipDates = [];
        SaleItems.forEach(SaleItem => ShipDates.push(new Date(SaleItem.chosenShipDate)));
        return {SaleItems: SaleItems, DeliveryDates: DeliveryDates, ShipDates: ShipDates, Totals: {itemSub: itemSubtotal.toFixed(2), shipSub: shippingSubtotal.toFixed(2), orderSub: orderSubtotal.toFixed(2)}};
    }

    function checkForDiscount(test)
    {
        if(test)
        {
            return (
                test.orderSubtotal != orderSubtotal || 
                test.shippingSubtotal != shippingSubtotal || 
                test.itemSubtotal != itemSubtotal
            );
        }
        else
        {
            return {
                orderSubtotal: parseFloat(orderSubtotal), 
                shippingSubtotal: parseFloat(shippingSubtotal), 
                itemSubtotal: parseFloat(itemSubtotal)
            };
        }
    }

    async function updatePricing()
    {
        try
        {
            var query = {items: SaleItems};
            if(Coupon)
            {
                query.couponCode = Coupon;
            }

            if(shipMethod)
            {
                query.shipMethod = shipMethod;
            }

            var result = await Network.requestOrderPrice(query);
            itemSubtotal = parseFloat(result.itemSubtotal);
            shippingSubtotal = parseFloat(result.shippingSubtotal);
            orderSubtotal = parseFloat(result.orderSubtotal);
            SaleItems = result.items;
            initDates();
        }
        catch(err)
        {
            throw err;
        }    
    }

    function finalOrder()
    {
        if(inError)
        {
            return null;
        }

        var order = {};
        order.CustomerID = CustomerID;

        if(State.getState('WLCSR'))
        {
            order.salesrep = parseInt(State.getState('WLCSR'));
        }
        else
        {
            order.salesrep = 43522;    // default sales rep to Yeastman
        }

        if(orderPONum)
        {
            order.PONum = orderPONum;
        }

        if(orderComment)
        {
            order.OrderComment = '--From the WL APP v2--' + orderComment;
        }
        else
        {
            order.OrderComment = '--From the WL APP v2--';
        }

        if(creditCard)
        {
            order.creditID = creditCard;
        }
        else
        {
            throw {message: `You must add a credit card to the order to purchase. 
                            Please go to My Account > Manage Payment to add a credit card`, code: 0};
        }

        order.SaleItems = SaleItems;

        order.shipMethod = shipMethod;

        //Need coupon code
        if(shipToggle)
        {
            order.shipaddress = true;
            order.shipattn = newShip.attn;
            order.shipaddressee = newShip.addressee;
            order.shipaddress1 = newShip.address1;
            order.shipaddress2 = newShip.address2;
            order.shipaddress3 = newShip.address3;
            order.shipcity = newShip.city;
            order.shipzip = newShip.zip;
            order.shipcountryid = newShip.country;
        }

        if(billToggle)
        {
            order.billaddress = true;
            order.billattn = newBill.attn;
            order.billaddressee = newBill.addressee;
            order.billaddress1 = newBill.address1;
            order.billaddress2 = newBill.address2;
            order.billaddress3 = newBill.address3;
            order.billcity = newBill.city;
            order.billzip = newBill.zip;
            order.billcountryid = newBill.country;
        }

        return order;
    }

  // Explicitly reveal public pointers to the private functions
  // that we want to reveal publicly
    return {
        init: init,
        finalOrder: finalOrder,
        getLength: getLength,
        getErrorState: getErrorState,
        earliestForAll: earliestForAll,
        deliverAllTogether: deliverAllTogether,
        getDeliveryDateRange: getDeliveryDateRange,
        incrementItemDate: incrementItemDate,
        decrementItemDate: decrementItemDate,
        restoreOrderDefaults: restoreOrderDefaults,
        restoreDefaultShip: restoreDefaultShip,
        restoreDefaultBill: restoreDefaultBill,
        changeShip: changeShip,
        changeBill: changeBill,
        changeShipMethod: changeShipMethod,
        addOrderComment: addOrderComment,
        addOrderPONum: addOrderPONum,
        changeCreditCard: changeCreditCard,
        addCoupon: addCoupon,
        getOrder: getOrder,
        exchangeAlternateSize: exchangeAlternateSize,
        exchangeSimilarStrain: exchangeSimilarStrain
    }
})();

export default ConfirmationCart;
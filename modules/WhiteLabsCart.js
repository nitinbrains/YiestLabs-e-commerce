'use strict'

// import dismissKeyboard from 'react-native-dismiss-keyboard';
// import { Toast } from 'native-base';
// import { Alert } from 'react-native';

import ErrorMod from './Error';
import SalesLib from './SalesLib';
import DeviceStorage from './DeviceStorage';
import State from './State';
import Network from './Network';
import WLHelper from './WLHelper';


var WLCart = (function (SALESCATEGORY) {

    // Keep this variable private inside this closure scope
    var Cart = [];

    /* item
    {
        Name
        MerchandiseID
        OrderDetailQty
        dispQuantity
        type - 1: Yeast, 2: Homebrew, 3: Non-Yeast, 4: Service, 5: Custom Pour
        details
        relatives[{ <-- for custom pour only
            id
            mult
        }]
        / Not Implemented vvv /
        BBLConversion
    }
    */

    function addToCartPR(itemRef, purchasePacks)
    {
        try
        {
            for (var i = 0; i < 3; i++)
            {
                purchasePacks[i].count = parseInt(purchasePacks[i].count);
                if(isNaN(purchasePacks[i].count))
                {
                    throw {message: 'System Error', code: -1};
                }

                if(purchasePacks[i].count > 0)
                {
                    var cartItem = {};
                    
                    cartItem.Name = String(itemRef.Name);
                    cartItem.salesCategory = parseInt(itemRef.salesCategory);
                    cartItem.dispQuantity = parseInt(purchasePacks[i].count);
                    cartItem.type = 1;

                    var packageSize;
                    switch(i)
                    {
                        case 0:
                            packageSize = "2L";
                            break;
                        case 1:
                            packageSize = "1.5L";
                            break;
                        case 2:
                            packageSize = "Nano";
                            break;
                    }

                    if(itemRef.purePitch)
                    {
                        cartItem.details = "From CC Calculator: PurePitch® " + packageSize;
                    }
                    else
                    {
                        cartItem.details = "From CC Calculator: " + packageSize;
                    }

                    cartItem.OrderDetailQty = parseInt(cartItem.dispQuantity);
                    cartItem.MerchandiseID = parseInt(itemRef.volID[2-i]);

                    if(isNaN(cartItem.MerchandiseID))
                    {
                        throw {message: 'Invalid Netsuite ID!', code: 0};
                    }

                    Cart.push(cartItem);
                }
            }

            DeviceStorage.saveCartToDevice(Cart);

            if(State.getState('UserID'))
            {
                Network.updateCart();
            }

            dismissKeyboard();

            Toast.show({
                text: 'Items added to Cart',
                position: 'bottom',
                duration: 2000,
            });

            return Cart;
        }
        catch(err)
        {
            throw err;
        }
        
    }

    function addToCart(itemRef, volIDindex, qty = 1) //addToCart(Inventory[x], 4, optional) <-- second param values are listed below in the if statements
    {

        var cartItem = {};
        try
        {
            if(itemRef.strainCategory == 32 || itemRef.strainCategory == 33)
            {
                if(qty < 1)
                {
                    throw {message: 'Vault Wild Yeast and Bacteria Strains require a minimum order of 1L', code: 0 };
                }
            }
            else if(itemRef.strainCategory == 31)
            {
                if(qty < 1.5)
                {
                    throw {message: 'Vault Sacch. Strains require a minimum order of 1.5L', code: 0 };
                }
            }
            else if(qty == 0)
            {
                throw {message: 'Quantity must be greater than 0', code: 0};
            }

            cartItem.Name = String(itemRef.Name);
            cartItem.salesCategory = parseInt(itemRef.salesCategory);
            cartItem.dispQuantity = parseInt(qty);

            if(isNaN(cartItem.dispQuantity))
            {
                throw {message: 'Invalid Quantity!', code: 0};
            }

            if(volIDindex == 6) //1L or 3xl
            {
                if(SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: 3XL";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.type = 1;
                    cartItem.details = '1L Nalgene Bottle';
                    cartItem.OrderDetailQty = parseInt(qty);
                }
            }
            else if(volIDindex == 5) //Slant 2xl
            {
                if(SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: 2XL";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.type = 3;
                    cartItem.details = 'Slants';
                    cartItem.OrderDetailQty = parseInt(qty);
                }
            }
            else if(volIDindex == 4) //Homebrew xl
            {
                if(SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: XL";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.type = 2;
                    cartItem.details = 'Homebrew Packs';
                    cartItem.OrderDetailQty = parseInt(qty);
                }
            }
            else if(volIDindex == 3) //Custom Pour l
            {
                if(SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: L";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.dispQuantity = 1;
                    cartItem.size = parseFloat(qty);
                    cartItem.type = 5;
                    cartItem.details = qty + 'L Custom Pour';
                    cartItem.OrderDetailQty = parseFloat(qty);

                    cartItem.relatives = [];
                    var multipliers = [0.5, 1.5, 2];

                    for (var i = 0; i < 3; i++)
                    {
                        if(itemRef.volID[i])
                        {
                            var relative = {};
                            relative.id = parseInt(itemRef.volID[i]);
                            if(isNaN(relative.id))
                            {
                                throw {message: 'Invalid VolID Index! in Relatives', code: 0};
                            }
                            relative.mult = multipliers[i];
                            cartItem.relatives.push(relative);
                        }
                    }
                }

            }
            else if(volIDindex == 2) //2L s
            {
                if(SALESCATEGORY[15].includes(parseInt(itemRef.salesCategory)))
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: M";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.type = 1;
                    if(itemRef.purePitch)
                    {
                        cartItem.details = "PurePitch® 2L";
                    }
                    else
                    {
                        cartItem.details = "2L";
                    }
                    cartItem.OrderDetailQty = parseInt(qty);
                }
            }
            else if(volIDindex == 1) //1.5L xs
            {
                if(SALESCATEGORY[15].includes(parseInt(itemRef.salesCategory)))
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: S";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else if(parseInt(itemRef.salesCategory) == 28)
                {
                    cartItem.type = 4;
                    cartItem.details = "Class Date(s): " + itemRef.TagDate + "\nClass Location: " + itemRef.TagLocation;
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.type = 1;
                    if(itemRef.purePitch)
                    {
                        cartItem.details = "PurePitch® 1.5L";
                    }
                    else
                    {
                        cartItem.details = "1.5L";
                    }
                    cartItem.OrderDetailQty = parseInt(qty);
                }
            }
            else if(volIDindex == 0) //Nano, Lab Service, Education, Non Yeast
            {
                if(SALESCATEGORY[0].includes(itemRef.salesCategory) != -1 && (itemRef.alternateItem || itemRef.volID[2])) //Nano
                {
                    cartItem.type = 1;
                    if(itemRef.purePitch)
                    {
                        cartItem.details = "PurePitch® Nano";
                    }
                    else
                    {
                        cartItem.details = "Nano";
                    }
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else if(SALESCATEGORY[12].indexOf(itemRef.salesCategory) != -1) //Lab Service
                {
                    cartItem.type = 4;
                    if(cartItem.Name.includes('LSQC'))
                    {
                        cartItem.details = "Save BIG on our most popular analytical tests! Participate in Big QC Day by purchasing your kit by August 6th, sending your samples in by August 20th and we’ll get you results by September 10th.";
                    }
                    else
                    {
                        cartItem.details = "Please send your samples to:\nWhite Labs\nAttn: Analytical Lab\n9450 Candida Street\nSan Diego, CA 92126\nFor information on how much to send please visit:";
                        cartItem.details_link = "https://www.whitelabs.com/other-products/analytical-lab-services)";
                    }
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else if(itemRef.salesCategory == 28) //Education
                {
                    cartItem.type = 4;
                    cartItem.details = "Class Date(s): " + itemRef.TagDate + "\nClass Location: " + itemRef.TagLocation;
                    cartItem.OrderDetailQty = parseInt(qty);
                }
                else
                {
                    cartItem.type = 3;
                    cartItem.details = "";
                    cartItem.OrderDetailQty = parseInt(qty);
                }
            }
            else
            {
                throw {message: 'Invalid VolID Index!', code: 0};
            }

            if(itemRef.MerchandiseID)
            {
                cartItem.MerchandiseID = itemRef.MerchandiseID;
            }
            else
            {
                cartItem.MerchandiseID = parseInt(itemRef.volID[volIDindex]);
            }


            if(isNaN(cartItem.MerchandiseID))
            {
                throw {message: 'Invalid Netsuite ID!', code: 0};
            }
            else if(SalesLib.YeastEssentials.includes(cartItem.MerchandiseID))
            {
                setTimeout(() => Alert.alert('Attending Yeast Essentials?', 'If you are considering or already attending Yeast Essentials 2.0, consider attending the 1 day Lab Practicum course that follows each Yeast Essentials course and allows you to apply the skills that you learn.'), 2000);
            }

            var matchIndex = Cart.findIndex(item => item.MerchandiseID === cartItem.MerchandiseID && item.details === cartItem.details);
            if(Cart[matchIndex])
            {
                Cart[matchIndex].OrderDetailQty += cartItem.OrderDetailQty;
                Cart[matchIndex].dispQuantity += cartItem.dispQuantity;
                manageBlends(itemRef, matchIndex);
            }
            else
            {
                Cart.push(cartItem);
                manageBlends(itemRef, Cart.length-1);
            }

            DeviceStorage.saveCartToDevice(Cart);

            if(cartItem.type == 2)
            {
                WLHelper.addHomebrewPacks(cartItem.OrderDetailQty);
            }

            if(State.getState('UserID'))
            {
                Network.updateCart();
            }

            dismissKeyboard();

            Toast.show({
                text: 'Item added to Cart',
                position: 'bottom',
                duration: 2000,
            });

            return Cart;
        }
        catch(err)
        {
            throw err;
        }

    }

    function getCart()
    {
        return Cart;
    }

    function clearCart()
    {
        Cart = [];
        DeviceStorage.clearCartFromDevice();
        WLHelper.setHomebrewPacks(0);
        return Cart;
    }

    function getLength()
    {
        return Cart.length;
    }

    function removeItem(i)
    {
        try
        {
            if(Cart[i].type == 2)
            {
                WLHelper.subtractHomebrewPacks(Cart[i].OrderDetailQty);
            }

            Cart.splice(i,1);
            DeviceStorage.saveCartToDevice(Cart);

            if(State.getState('UserID'))
            {
                Network.updateCart();
            }

            return Cart;
        }
        catch(err)
        {
            throw err;
        }

    }

    function changeItemQuantity(itemIndex, qty)
    {
        var value = parseInt(qty);
        if(isNaN(value))
        {
            Cart[itemIndex].dispQuantity = '';
            Cart[itemIndex].OrderDetailQty = '';
        }
        else
        {
            Cart[itemIndex].dispQuantity = value;

            if(Cart[itemIndex].type == 5)
            {
                Cart[itemIndex].OrderDetailQty = Cart[itemIndex].size * value;
            }
            else
            {
                Cart[itemIndex].OrderDetailQty = value;
            }
        }

        DeviceStorage.saveCartToDevice(Cart);
    }

    function getItem(i)
    {
        return Cart[i];
    }

    function restoreCart(cart)
    {
        for(var i in cart)
        {
            if(cart[i].type == 2)
            {
                WLHelper.addHomebrewPacks(cart[i].OrderDetailQty);
            }
            if(cart[i].dispQuantity == null || cart[i].dispQuantity == undefined)
            {
                cart[i].dispQuantity = 1;
            }
        }
        Cart = cart;
        DeviceStorage.saveCartToDevice(Cart);
    }

    function checkCart()
    {
        if(Cart.length == 0)
        {
            return false;
        }

        for (var i = Cart.length - 1; i >= 0; i--)
        {
            var value;
            if(Cart[i].type == 5)
            {
                value = parseFloat(Cart[i].OrderDetailQty);
                if(isNaN(value))
                {
                    return false;
                }
            }
            else
            {
                value = parseInt(Cart[i].OrderDetailQty);
                if(isNaN(value))
                {
                    return false;
                }
            }
        }
        return true;
    }

    function manageBlends(itemRef, cartIndex, volId)
    {
        if(parseInt(itemRef.strainCategory) == 5) //blend sacch
        {
            if(volId == 3 && Cart[cartIndex].OrderDetailQty < 10)
            {
                var qty = parseInt(Cart[cartIndex].OrderDetailQty);
                Cart.splice(cartIndex, 1);

                var purchasePacks = [
                    {'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, 
                    {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, 
                    {'count':0, 'pack':'Nano, 500 ml yeast'}, 
                    {'count':0, 'pack':'Homebrew, 40 ml yeast'}
                ];
                var amountPacks = getOptimalAmount([0.5, 1.5, 2], totalVol, {});
                purchasePacks[0].count = amountPacks["2.0"];
                purchasePacks[1].count = amountPacks["1.5"];
                purchasePacks[2].count = amountPacks["0.5"];

                addToCartPR(itemRef, purchasePacks);
            }

            var multiplier = (volId == 0 ? 0.5 : (volId == 1 ? 1.5 : 2));
            if(Cart[cartIndex].OrderDetailQty * multiplier >= 10)
            {
                Cart[cartIndex].MerchandiseID = itemRef.volID[3];
                Cart[cartIndex].OrderDetailQty = Cart[cartIndex].OrderDetailQty * multiplier;
                Cart[cartIndex].details = Cart[cartIndex].OrderDetailQty + 'L Custom Pour';
            }
        }
    }

    function getOptimalAmount(purchasePackAmounts, totalVol, knownResults)
    {
        var initialVol = totalVol;

        var amount = getExactAmount(purchasePackAmounts, totalVol, knownResults);

        // found exact amount
        if(amount.num > 0)
        {
            return amount;
        }
        // no exact amount, find nearest neighbor with exact amount
        else
        {
            // should only get here once if no match was found for initialVol at end of recursion
            // code block finds next optimal solution within 0.5 range of initialVol
            if (initialVol === totalVol)
            {
                var newVol = initialVol + 0.5;
                for(var i = initialVol + 0.1; i <= newVol; i += 0.1)
                {

                    // eliminate Javascript rounding errors
                    var float = parseFloat((i).toFixed(1));

                    var pack = getExactAmount(purchasePackAmounts, float, knownResults);

                    // if we find a pack in which we can calculate the exact amount (above initialVol)
                    // then this is the optimal amount for initialVol
                    if(pack.num != 0)
                    {
                        return pack;
                    }
                }
            }
        }
    }

    function getExactAmount(purchasePackAmounts, totalVol, knownResults)
    {

        // default pack
        var minPack = {
            "0.5" : 0,
            "1.5" : 0,
            "2.0" : 0,
            num : 0
        }

        // base case # 1: totalVol is 0
        if(totalVol === 0)
        {
            return Object.assign({}, minPack);
        }
        // base case # 2: optimal amount for totalVol has already been calculated. retrieve and return.
        else if(knownResults[totalVol])
        {
            return Object.assign({}, knownResults[totalVol]);
        }

        // base case # 3: totalVol is one of purchasePackAmounts
        else if(purchasePackAmounts.includes(totalVol))
        {
            minPack[totalVol.toFixed(1)] = 1;
            minPack.num += 1;
            knownResults[totalVol] = minPack;
            return Object.assign({}, minPack);
        }
        else
        {

            // flag to determine if no optimal solution was found for a particular totalVol
            var flag = false;

            // min will hold the current min of
            var min = Number.MAX_VALUE;

            // array keeps optimal packs for each type less than totalVol
            var subsetOptimalAmounts = [];

            // index of current min inside subsetOptimalAmounts
            var minIndexOfOptimalAmounts = 0;

            // holds the type of the pack indexed at minIndexOfOptimalAmounts needed to get to totalVol
            var minType = '';


            for(var i = 0; i < purchasePackAmounts.length; i++ )
            {
                var type = purchasePackAmounts[i];
                if(type <= totalVol)
                {
                    var pack = getExactAmount(purchasePackAmounts, totalVol - type, knownResults);
                    subsetOptimalAmounts.push(pack);

                    // found at least one pack where num > 0
                    if(pack.num > 0)
                    {
                        flag = true;
                    }

                    // found new pack with less quantity of types than the previous min
                    // make this the new min and preserve index
                    if(pack.num < min)
                    {
                        min = pack.num;
                        minType = type;
                        minIndexOfOptimalAmounts = subsetOptimalAmounts.length - 1;
                    }
                }
            }

            // if flag === true: we know there is at least one optimal solution LESS than
            // totalVol from which we can reach totalVol.
            // calculate the optimal solution of totalVol based on this type.
            if(flag)
            {
                minPack = subsetOptimalAmounts[minIndexOfOptimalAmounts];
                minPack[(minType).toFixed(1)] += 1;
                minPack.num += 1;
                knownResults[totalVol] = minPack;

            }

        }
        return Object.assign({}, minPack);
    }

// Explicitly reveal public pointers to the private functions
// that we want to reveal publicly

    return {
        getCart: getCart,
        clearCart: clearCart,
        getLength: getLength,
        changeItemQuantity: changeItemQuantity,
        removeItem: removeItem,
        addToCart: addToCart,
        addToCartPR: addToCartPR,
        getItem: getItem,
        restoreCart: restoreCart,
        checkCart: checkCart
    }
})(SalesLib.SALESCATEGORY);

export default Utils;
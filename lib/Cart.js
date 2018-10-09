import SalesLib from './SalesLib';

var Cart = (function() {

    // Global variables
    var items = [];

    function getCart() {
        return items;
    }


    function addItem(itemRef, volIdIndex, quantity = 1) {
        try {        
            var cartItem = {};
            var message;

            if(itemRef.strainCategory == 32 || itemRef.strainCategory == 33)
            {
                if(quantity < 1)
                {
                    throw { message: 'Vault Wild Yeast and Bacteria Strains require a minimum order of 1L', code: 0 };
                }
            }
            else if(itemRef.strainCategory == 31)
            {
                if(quantity < 1.5)
                {
                    throw { message: 'Vault Sacch. Strains require a minimum order of 1.5L', code: 0 };
                }
            }
            else if(quantity == 0)
            {
                throw { message: 'Quantity must be greater than 0', code: 0};
            }

            cartItem.Name = String(itemRef.Name);
            cartItem.salesCategory = parseInt(itemRef.salesCategory);
            cartItem.dispQuantity = parseInt(quantity);

            if(isNaN(cartItem.dispQuantity))
            {
                throw { message: 'Invalid Quantity!', code: 0};
            }

            if(volIdIndex == 6) //1L or 3xl
            {
                if(SalesLib.SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: 3XL";
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else
                {
                    cartItem.type = 1;
                    cartItem.details = '1L Nalgene Bottle';
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
            }
            else if(volIdIndex == 5) //Slant 2xl
            {
                if(SalesLib.SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: 2XL";
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else
                {
                    cartItem.type = 3;
                    cartItem.details = 'Slants';
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
            }
            else if(volIdIndex == 4) //Homebrew xl
            {
                if(SalesLib.SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: XL";
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else
                {
                    cartItem.type = 2;
                    cartItem.details = 'Homebrew Packs';
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
            }
            else if(volIdIndex == 3) //Custom Pour l
            {
                if(SalesLib.SALESCATEGORY[15].indexOf(parseInt(itemRef.salesCategory)) >= 0)
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: L";
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else
                {
                    cartItem.dispQuantity = 1;
                    cartItem.size = parseFloat(quantity);
                    cartItem.type = 5;
                    cartItem.details = quantity + 'L Custom Pour';
                    cartItem.OrderDetailquantity = parseFloat(quantity);

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
                                throw { message: 'Invalid VolID Index! in Relatives', code: 0};
                            }
                            relative.mult = multipliers[i];
                            cartItem.relatives.push(relative);
                        }
                    }
                }

            }
            else if(volIdIndex == 2) //2L s
            {
                if(SalesLib.SALESCATEGORY[15].includes(parseInt(itemRef.salesCategory)))
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: M";
                    cartItem.OrderDetailquantity = parseInt(quantity);
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
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
            }
            else if(volIdIndex == 1) //1.5L xs
            {
                if(SalesLib.SALESCATEGORY[15].includes(parseInt(itemRef.salesCategory)))
                {
                    cartItem.type = 3;
                    cartItem.details = "Size: S";
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else if(parseInt(itemRef.salesCategory) == 28)
                {
                    cartItem.type = 4;
                    cartItem.details = "Class Date(s): " + itemRef.TagDate + "\nClass Location: " + itemRef.TagLocation;
                    cartItem.OrderDetailquantity = parseInt(quantity);
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
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
            }
            else if(volIdIndex == 0) //Nano, Lab Service, Education, Non Yeast
            {
                if(SalesLib.SALESCATEGORY[0].includes(itemRef.salesCategory) != -1 && (itemRef.alternateItem || itemRef.volID[2])) //Nano
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
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else if(SalesLib.SALESCATEGORY[12].indexOf(itemRef.salesCategory) != -1) //Lab Service
                {
                    cartItem.type = 4;
                    if(cartItem.Name.includes('LSQC'))
                    {
                        cartItem.details = `Save BIG on our most popular analytical tests! Participate in Big QC Day 
                                            by purchasing your kit by August 6th, sending your samples in by August 20th 
                                            and we’ll get you results by September 10th.`;
                    }
                    else
                    {
                        cartItem.details = `Please send your samples to:\nWhite Labs\nAttn: Analytical Lab\n9450 Candida Street
                                    \nSan Diego, CA 92126\nFor information on how much to send please visit:`;
                        cartItem.details_link = "https://www.whitelabs.com/other-products/analytical-lab-services)";
                    }
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else if(itemRef.salesCategory == 28) //Education
                {
                    cartItem.type = 4;
                    cartItem.details = "Class Date(s): " + itemRef.TagDate + "\nClass Location: " + itemRef.TagLocation;
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
                else
                {
                    cartItem.type = 3;
                    cartItem.details = "";
                    cartItem.OrderDetailquantity = parseInt(quantity);
                }
            }
            else
            {
                throw { message: 'Invalid VolID Index!', code: 0};
            }

            if(itemRef.MerchandiseID)
            {
                cartItem.MerchandiseID = itemRef.MerchandiseID;
            }
            else
            {
                cartItem.MerchandiseID = parseInt(itemRef.volID[volIdIndex]);
            }


            if(isNaN(cartItem.MerchandiseID))
            {
                throw { message: 'Invalid Netsuite ID!', code: 0};
            }
            else if(SalesLib.YeastEssentials.includes(cartItem.MerchandiseID))
            {
                message = {
                    title: 'Attending Yeast Essentials?', 
                    message: `If you are considering or already attending Yeast Essentials 2.0, 
                            consider attending the 1 day Lab Practicum course that follows each 
                            Yeast Essentials course and allows you to apply the skills that you learn.`
                }
            }

            // Check if item already exists in Cart
            var matchIndex = items.findIndex(item => item.MerchandiseID === cartItem.MerchandiseID && item.details === cartItem.details);
            if(items[matchIndex])
            {
                items[matchIndex].OrderDetailQty += cartItem.OrderDetailQty;
                items[matchIndex].dispQuantity += cartItem.dispQuantity;
                // manageBlends(itemRef, matchIndex);
            }
            else
            {
                items.push(cartItem);
                // manageBlends(itemRef, Cart.length-1);
            }

            return { message, items };
        }
        catch(error) {
            console.log('error in prepareItems', error);
            return { error };
        }
    }

    function changeItemQuantity(index, quantity) {
        try {
            if(0 > index || index >= items.length) {
                throw { message: 'index out of bounds', code: 0}
            }
            
            quantity = parseInt(quantity);
            if(isNaN(quantity)){
                items[index].dispQuantity = '';
                items[index].OrderDetailquantity = '';
            } 
            else {
                items[index].dispQuantity = quantity;

                if(items[index].type == 5){
                    items[index].OrderDetailquantity = items[index].size * quantity;
                } else {
                    items[index].OrderDetailquantity = quantity;
                }
            }

            return items;
        }
        catch(error) {
            console.log('error in changeItemQuantity', error);
            return { error };
        }
    }

    function removeItem(index) {
        try
        {
            if(0 > index || index >= items.length) {
                throw { message: 'index out of bounds', code: 0}
            }

            items.splice(index, 1);
            
            return items;
        }
        catch(err)
        {
            throw err;
        }
    }


    // function manageBlends(itemRef, cartIndex, volId)
    // {
    //     if(parseInt(itemRef.strainCategory) == 5) //blend sacch
    //     {
    //         if(volId == 3 && items[cartIndex].OrderDetailQty < 10)
    //         {
    //             var qty = parseInt(items[cartIndex].OrderDetailQty);
    //             items.splice(cartIndex, 1);

    //             var purchasePacks = [
    //                 {'count':0, 'pack':'10Bbl / HL, 2000 ml yeast'}, 
    //                 {'count':0, 'pack':'7Bbl / HL, 1500 ml yeast'}, 
    //                 {'count':0, 'pack':'Nano, 500 ml yeast'}, 
    //                 {'count':0, 'pack':'Homebrew, 40 ml yeast'}
    //             ];
    //             var amountPacks = getOptimalAmount([0.5, 1.5, 2], totalVol, {});
    //             purchasePacks[0].count = amountPacks["2.0"];
    //             purchasePacks[1].count = amountPacks["1.5"];
    //             purchasePacks[2].count = amountPacks["0.5"];

    //             addToCartPR(itemRef, purchasePacks);
    //         }

    //         var multiplier = (volId == 0 ? 0.5 : (volId == 1 ? 1.5 : 2));
    //         if(Cart[cartIndex].OrderDetailQty * multiplier >= 10)
    //         {
    //             Cart[cartIndex].MerchandiseID = itemRef.volID[3];
    //             Cart[cartIndex].OrderDetailQty = Cart[cartIndex].OrderDetailQty * multiplier;
    //             Cart[cartIndex].details = Cart[cartIndex].OrderDetailQty + 'L Custom Pour';
    //         }
    //     }
    // }

    return {
        getCart: getCart,
        addItem: addItem,
        changeItemQuantity: changeItemQuantity,
        removeItem: removeItem
    }
})();

export default Cart;

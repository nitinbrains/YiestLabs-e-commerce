export function addToCart(items, cartItem) {
    // Check if item already exists in Cart
    const matchIndex = items.findIndex(item => item.MerchandiseID === cartItem.MerchandiseID && item.details === cartItem.details);
    if (items[matchIndex]) {
        items[matchIndex].OrderDetailQty += cartItem.OrderDetailQty;
        items[matchIndex].dispQuantity += cartItem.dispQuantity;
        // manageBlends(itemRef, matchIndex);
    } else {
        items.push(cartItem);
        // manageBlends(itemRef, Cart.length-1);
    }

}

export function changeItemQuantity(items, index, quantity) {
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
    }
    catch(error) {
        console.log('error in changeItemQuantity', error);
        return { error };
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
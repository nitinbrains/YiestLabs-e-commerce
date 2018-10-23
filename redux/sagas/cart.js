import SalesLib from '../../modules/SalesLib';
import { put, select  } from 'redux-saga/effects';
import { messageActions } from '../actions/messageActions';

class CartException extends Error {
    constructor(...args) {
        super(...args);
    }
};

const prepareItem = (items, itemRef, volIdIndex, quantity = 1) => {
    let message;
    let cartItem = {
        Name: String(itemRef.Name),
        salesCategory: parseInt(itemRef.salesCategory),
        dispQuantity: parseInt(quantity)
    };

    // validation
    switch(true) {
        case (itemRef.strainCategory == 32 || itemRef.strainCategory == 33) && quantity < 1:
            throw new CartException('Vault Wild Yeast and Bacteria Strains require a minimum order of 1L');
        case itemRef.strainCategory == 31 && quantity < 1.5:
            throw new CartException('Vault Sacch. Strains require a minimum order of 1.5L');
        case quantity == 0:
            throw new CartException('Quantity must be greater than 0');
        case isNaN(cartItem.dispQuantity):
            throw new CartException('Invalid Quantity!');
    }

    // lets check void index
    const isExist = SalesLib.SALESCATEGORY[15] && SalesLib.SALESCATEGORY[15].indexOf(cartItem.salesCategory) !== -1;
    switch (volIdIndex) {
        case 6:
            cartItem = {
                ...cartItem,
                type: 3,
                details: isExist ? 'Size: 3XL' : '1L Nalgene Bottle',
                OrderDetailquantity: parseInt(quantity)
            };
            break;
        case 5:
            cartItem = {
                ...cartItem,
                type: 3,
                details: isExist ? 'Size: 2XL' : 'Slants',
                OrderDetailquantity: parseInt(quantity)
            };
            break;
        case 4:
            cartItem = {
                ...cartItem,
                type: 3,
                details: isExist ? 'Size: XL' : 'Homebrew Packs',
                OrderDetailquantity: parseInt(quantity)
            };
            break;
        case 3:
            if (isExist) {
                cartItem = {
                    ...cartItem,
                    type: 3,
                    details: 'Size: L',
                    OrderDetailquantity: parseInt(quantity)
                };
            } else {
                const multipliers = [0.5, 1.5, 2];
                cartItem = {
                    ...cartItem,
                    size: parseFloat(quantity),
                    type: 5,
                    details: `${quantity}L Custom Pour`,
                    OrderDetailquantity: parseInt(quantity),
                    relatives: [0, 1, 2].reduce((arr, idx) => {
                        if (itemRef.volID[i]) {
                            if (isNaN(itemRef.volID[i])) {
                                throw new CartException('Invalid VolID Index! in Relatives');
                            }
                            return [
                                ...arr,
                                {
                                    id: parseInt(itemRef.volID[i]),
                                    mult: multipliers[i]
                                }
                            ];
                        }
                        return arr;
                    }, [])
                };
            }
        case 2:
            cartItem = {
                ...cartItem,
                type: isExist ? 3 : 1,
                details: isExist ? 'Size: M' : (itemRef.purePitch ? 'PurePitch® 2L' : '2L'),
                OrderDetailquantity: parseInt(quantity)
            }
            break;
        case 1:
            cartItem = {
                ...cartItem,
                type: isExist ? 3 : (itemRef.salesCategory == 28 ? 4 : 1),
                details: isExist ? 'Size: S' : (
                    itemRef.salesCategory == 28 ?
                    `Class Date(s): ${itemRef.TagDate}\nClass Location: ${itemRef.TagLocation}` :
                    (itemRef.purePitch ? 'PurePitch® 1.5L' : '1.5L')
                ),
                OrderDetailquantity: parseInt(quantity)
            }
            break;
        case 0:
            if (SalesLib.SALESCATEGORY[0].indexOf(itemRef.salesCategory) !== -1 && (itemRef.alternateItem || itemRef.volID[2])) {
                cartItem = {
                    ...cartItem,
                    type: 1,
                    details: purePitch ? 'PurePitch® Nano' : 'Nano',
                    OrderDetailquantity: parseInt(quantity)
                }
            } else if (SalesLib.SALESCATEGORY[12].indexOf(itemRef.salesCategory) !== -1) { //Lab Service
                const isLSQC = cartItem.Name.indexOf('LSQC') !== -1;
                cartItem = {
                    ...cartItem,
                    type: 4,
                    details: isLSQC ?
                        [
                            'Save BIG on our most popular analytical tests! Participate in Big QC Day',
                            'by purchasing your kit by August 6th, sending your samples in by August 20th',
                            'and we’ll get you results by September 10th.'
                        ].join(' ') : [
                            'Please send your samples to:',
                            'White Labs',
                            'Attn: Analytical Lab',
                            '9450 Candida Street',
                            'San Diego, CA 92126',
                            'For information on how much to send please visit:'
                        ].join('\n'),
                    details_link: isLSQC ? null : 'https://www.whitelabs.com/other-products/analytical-lab-services',
                    OrderDetailquantity: parseInt(quantity)
                }
            } else {
                const isEducation = itemRef.salesCategory == 28;
                cartItem = {
                    ...cartItem,
                    type: isEducation ? 4 : 3,
                    details: isEducation ? `Class Date(s): ${itemRef.TagDate}\nClass Location: ${itemRef.TagLocation}` : '',
                    OrderDetailquantity: parseInt(quantity)
                }
            }
        default:
            throw CartException('Invalid VolID Index!');
    }

    cartItem.MerchandiseID = itemRef.MerchandiseID ? itemRef.MerchandiseID : parseInt(itemRef.volID[volIdIndex]);


    if (isNaN(cartItem.MerchandiseID)) {
        throw CartException('Invalid Netsuite ID!');
    } else if (SalesLib.YeastEssentials.indexOf(cartItem.MerchandiseID) !== -1) {
        message = {
            title: 'Attending Yeast Essentials?', 
            message: `If you are considering or already attending Yeast Essentials 2.0, 
                    consider attending the 1 day Lab Practicum course that follows each 
                    Yeast Essentials course and allows you to apply the skills that you learn.`
        }
    }
    return { cartItem, message }
}


const updateItemQuantity = (cartItem, quantity) => {
    const quantityNum = parseInt(quantity);
    const isNumber = !isNaN(quantityNum);
    return {
        ...cartItem,
        dispQuantity: isNumber ? quantityNum : '',
        OrderDetailquantity: isNumber ? (item.type === 5 ? item.size * quantityNum : quantityNum) : ''
    }
}


export function * updateItem(action) {
    try {
        const { responseSuccess, responseFailure, data: { cartItem, quantity } } = action;
        const items = yield select(state => state.cart.items);
        const item = items.find(item => item.MerchandiseID === cartItem.MerchandiseID && item.details === cartItem.details);
        if (item) {
            yield put(responseSuccess({ updatedItem: updateItemQuantity(item, quantity) }));    
        } else {
            throw CartException('Item doesn\'t exist');
        }
    } catch (error) {
        if (error instanceof CartException) {
            yield put(messageActions.showMessage({ title: 'Error', error: error.message })) 
        }
        yield put(responseFailure(error));
    }
}

export function * addCartItem(action) {
    try {
        const { responseSuccess, responseFailure, data: { item, volIdIndex, quantity } } = action;
        const { message, cartItem } = prepareItem(items, item, volIdIndex, quantity);
        if (message) {
            yield put(messageActions.showMessage({ ...message })) 
        }
        yield put(responseSuccess({ item: cartItem }));
    } catch(error) {
        yield put(messageActions.showMessage({ title: 'Error', error: error.message })) 
        yield put(responseFailure(err));
    }
}

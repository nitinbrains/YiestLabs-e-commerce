export const cart = {
    items: []
};

export const message = {
    messages: []
};

export const inventory = {
    items: [],
    itemsToShow: [],
    category: 1,
    error: null,
    isLoading: false,
    isHomebrew: false
};


export const order = {
    items: [],
    transitTimes: [],
    EarliestDeliveryDates: [],
    EarliestShipDates: [],
    shipMethod: '',
    subsidiary: '',
    itemSub: 0,
    shippingSub: 0,
    orderSub: 0,
    shippingOptions: ["Ship All Together", "Earliest For Each", "Custom"],
    selectedShippingOption: 'Ship All Together',
    isLoading: false
};

export const user = {
    billing: [{
        address1: "123 My Way",
        address2: "",
        address3: "",
        addressee: "Home",
        attn: "",
        city: "Concord",
        countryid: "US",
        id: 1743060,
        zip: "94518",
    }],
    selectedBilling: {
        address1: "123 My Way",
        address2: "",
        address3: "",
        addressee: "Home",
        attn: "",
        city: "Concord",
        countryid: "US",
        id: 1743060,
        zip: "94518",
    },
    cards: [
        {ccexpire: "2022-12-01T08:00:00.000Z", ccname: "Joe Discovery", ccnumber: "************1117", default: true, id: 38421, type: "3"}
    ],
    cardsToRemove: [],
    category: "2",
    companyname: "XAbove It All YM TEST",
    connectedaccounts: [
        {internalid: 43148, subsidiary: "White Labs Inc", subsidiaryid: "2"},
        {internalid: 863039, subsidiary: "White Labs Hong Kong", subsidiaryid: "5"},
        {internalid: 1184976, subsidiary: "White Labs Copenhagen ApS", subsidiaryid: "7"}
    ],
    currency: "1",
    email: "dkonecny@whitelabs.com",
    get: true,
    id: 43148,
    otherAddresses: [
        {address1: "One way", address2: "", address3: "", addressee: "", attn: "Attn", city: "City", countryid: "US", defaultBill: false, defaultShip: true, id: 1743261, zip: "94518"}
    ],
    phone: "7142995620",
    shipping: [{
        address1: "One way",
        address2: "",
        address3: "",
        addressee: "",
        attn: "Attn",
        city: "City",
        countryid: "US",
        id: 1743261,
        zip: "94518"
    }],
    selectedShipping: {
        address1: "One way",
        address2: "",
        address3: "",
        addressee: "",
        attn: "Attn",
        city: "City",
        countryid: "US",
        id: 1743261,
        zip: "94518"
    },
    shipmethod: "2789",
    subsidiary: 2,
    terms: "10",
    vat: "",
    version: "2.3.7"
};

const getToday = () => {
    const date = new Date();
    date.setHours(0,0,0,0);
    return date;
}

const getDelayedDays = (delay) => {
    const date = getToday();
    date.setDate(today.getDate() + delay);
    return date;
}

export const today = getToday();
export const twoDaysLate = getDelayedDays(2);

export const fetchOrderMock = {
    calcShip: true,
    userID: 43148,
    shipMethod: "2789",
    items: [{
        Name:"WLP001 California Ale Yeast",
        salesCategory: 3,
        dispQuantity: 1,
        OrderDetailQty: 1,
        MerchandiseID: 2425,
        deliveryDate: twoDaysLate,
        details: "PurePitch® Nano",
        type: 1,
        shipDate: today,
        Warehouse: 9,
        pricePerUnit: 85.17
    }],
    transitTimes: {
        "4": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2787": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "2788": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "2789": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        },
        "2790": {
            "daysInTransit": 3,
            "daysInTransitRange": 0
        },
        "2791": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2792": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2794": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        },
        "2841": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "2842": {
            "daysInTransit": 3,
            "daysInTransitRange": 3
        },
        "2843": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "2844": {
            "daysInTransit": 3,
            "daysInTransitRange": 3 
        },
        "2845": {
            "daysInTransit": 5,
            "daysInTransitRange": 0
        },
        "2846": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "2847": {
            "daysInTransit": 4,
            "daysInTransitRange": 3
        },
        "2848": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "2849": {
            "daysInTransit": 3,
            "daysInTransitRange": 3
        },
        "2850": {
            "daysInTransit": 3,
            "daysInTransitRange": 0
        },
        "3469": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3470": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3471": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3472": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        },
        "3475": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "3511": {
            "daysInTransit": 1,
            "daysInTransitRange": 0
        },
        "3609": {
            "daysInTransit": 0,
            "daysInTransitRange": 3
        },
        "13300": {
            "daysInTransit": 3,
            "daysInTransitRange": 3
        },
        "13320": {
            "daysInTransit": 5,
            "daysInTransitRange": 3
        },
        "13332": {
            "daysInTransit": 2,
            "daysInTransitRange": 0
        }
    },
    "itemSubtotal": 85.17,
    "shippingSubtotal": 17,
    "orderSubtotal": 102.17
};

export const inventoryFetch = {
    version:"2.3.7",
    items: [
        {
            "volID": [1735],
            "partNum": "GS100",
            "designation": "3",
            "Name": "BrewMaster: The Craft Brewing Game",
            "Price": "19.95",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "Using mechanics similar to rummy, players combine cards to brew six beer styles including ale, stout and Belgian.",
            "ImageURL": "https://www.whitelabs.com/other-products/brewmaster-craft-beer-game",
            "searchTags": ""
        },
        {
            "volID": [13683],
            "partNum": "GS32GrowlerBLK",
            "designation": "3",
            "Name": "Double Walled Black 32oz Growler",
            "Price": "30.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13682],
            "partNum": "GS32GrowlerSS",
            "designation": "3",
            "Name": "Double-Walled Stainless Steel 32oz Growler",
            "Price": "30.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [3253],
            "partNum": "GSAMBER",
            "designation": "3",
            "Name": "Growler- 64oz",
            "Price": "",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13819],
            "partNum": "GSAVLPATCHHAT",
            "designation": "3",
            "Name": "White Labs Asheville Patch Hat- Charcoal",
            "Price": "18.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13820],
            "partNum": "GSBEANIEOLIVE",
            "designation": "3",
            "Name": "White Labs Beanie- Olive",
            "Price": "15.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13073],
            "partNum": "GSBLACKSUNGLASSES",
            "designation": "3",
            "Name": "Black sunglasses with custom arm pattern and logo",
            "Price": "10.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [13361],
            "partNum": "GSBLKSNAPBACK",
            "designation": "3",
            "Name": "Black Snapback",
            "Price": "18.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        }, {
            "volID": [1740],
            "partNum": "GSBOSTON",
            "designation": "3",
            "Name": "White Labs 32oz Boston Round Growler",
            "Price": "5.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "https://www.whitelabs.com/other-products/glassware-white-labs-growler",
            "searchTags": ""
        }, {
            "volID": [1742],
            "partNum": "GSBURNOUTTANKW-2X",
            "designation": "3",
            "Name": "Women&apos;s Black Burnout Tank",
            "Price": "0.00",
            "isYeast": false,
            "IsPrivate": [false],
            "warehouse": "9,11",
            "salesCategory": 27,
            "Description": "",
            "ImageURL": "",
            "searchTags": ""
        },
    ],
};

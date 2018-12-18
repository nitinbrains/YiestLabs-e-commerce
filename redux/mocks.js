export const cart = {
    items: []
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
    billing: {
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
    shipping: {
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

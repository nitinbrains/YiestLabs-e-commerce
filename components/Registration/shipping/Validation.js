import _isEmpty from 'lodash/isEmpty';

// export const errorBase = {
//     required: {
//         companyName: "Company name is Required",
//         email: "Email is Required",
//         phone: "Phone is Required",
//         password: "Password is Required",
//         confirmPassword: "Confirm password is Required",
//         category: "Category is Required",
//         orderFrom: "Order from is Required",
//         acContact: "Accounting contact is Required",
//         acPhone: "Accounting phone is Required",
//         shipping: {
//             attn: "Shipping attention is Required",
//             addressee: "Shipping addressee is Required",
//             address1: "Shipping address1 is Required",
//             address2: "Shipping address2 is Required",
//             address3: "Shipping address3 is Required",
//             zip: "Shipping zip is Required",
//             countryid: "Shipping country is Required",
//         },
//         billing: {
//             attn: "Billing attention is Required",
//             addressee: "Billing addressee is Required",
//             address1: "Billing address1 is Required",
//             address2: "Billing address2 is Required",
//             address3: "Billing address3 is Required",
//             zip: "Billing zip is Required",
//             countryid: "Billing country is Required",
//         },
//         ccnumber: "Credit card number is Required",
//         ccname: "Credit card name is Required",
//         ccexpire: "Credit card expiry date is Required",
//     }
// }


export const errorBase = {
    required: {
        "shipping.attn": "Shipping attention is Required",
        "shipping.addressee": "Shipping addressee is Required",
        "shipping.address1": "Shipping address1 is Required",
        "shipping.address2": "Shipping address2 is Required",
        "shipping.address3": "Shipping address3 is Required",
        "shipping.zip": "Shipping zip is Required",
        "shipping.countryid": "Shipping country is Required",
    },
    invalidZip: "Invalid zip code"
}

export const validate = (props) => {
    const { values, touched, errors, setTouched, setErrors } = props;
    const fields = Object.keys(errorBase.required);
    var err = {};
    fields.map((field)=> {
        touched[field] = true;
        // if (!values[field]) {
        //     err[field] = errorBase.required[field]
        // } else if(values[field] && errors[field]) {
        //     delete errors[field];
        // }
        if (!values[field]) {
            err[field] = errorBase.required[field]
        } else if (
            values[field] &&
            values[field] === 'shipping.zip', 
            // WLHelper.validateZipCode(country, zip)  // we do not have country info to validate zip.  So we'll have to find a different approch
            values[field].length !== 6
        ){
            err[field] = errorBase.invalidZip
        }
    })
    setTouched(touched)
    setErrors(err)
    return {errors: err, touched};
}

export const handleNext = (props) => {
    const { onNext } = props;
    let res = validate(props);
    if(_isEmpty(res.errors)) {
        onNext();
    }

}
export const handleChange = (e, props, fields) => {
    const {setValues, values, touched} = props;
    let value = e.target.value
    let name = e.target.name
    values[name] = value
    props = {...props, values}
    if(touched[name]) {
        validate(props);
    }
    setValues(values)
}



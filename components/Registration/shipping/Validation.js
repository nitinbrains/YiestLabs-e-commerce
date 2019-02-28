import _isEmpty from 'lodash/isEmpty';


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


import _isEmpty from 'lodash/isEmpty';
import WLHelper from 'lib/WLHelper';

export const errorBase = {
    required: {
        "billing.attn": "Billing attention is Required",
        "billing.addressee": "Billing addressee is Required",
        "billing.address1": "Billing address1 is Required",
        "billing.address2": "Billing address2 is Required",
        "billing.address3": "Billing address3 is Required",
        "billing.zip": "Billing zip is Required",
        "billing.countryid": "Billing country is Required",
    },
    invalidZip: "Invalid zip code"
}

export const validate = (props) => {
    const { values, touched, errors, setTouched, setErrors } = props;
    const fields = Object.keys(errorBase.required);
    console.log('fields', fields);
    
    var err = {};
    fields.map((field)=> {
        touched[field] = true;
        if (!values[field]) {
            err[field] = errorBase.required[field]
        } else if (
            values[field] &&
            values[field] === 'billing.zip', 
            // WLHelper.validateZipCode(country, zip)  // we do not have country info to validate zip.  So we'll have to find a different approch
            values[field].length !== 6
        ){
            err[field] = errorBase.invalidZip
        }
    })
    console.log('touched err', touched, err);
    
    setTouched(touched)
    setErrors(err)
    return {errors: err, touched};
}


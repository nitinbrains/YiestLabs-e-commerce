import _isEmpty from 'lodash/isEmpty';

export const companyName = (value) => {
    let error;
    if (!value) {
        error = "Company name is Required";
    };
    return error;
};

export const formFields = {
    general: ['companyName', 'email', 'phone', 'password', 'confirmPassword', 'category', 'orderFrom' ,'acContact', 'acPhone'],
    shipping: ['shipping.attn', 'shipping.addressee', 'shipping.address1', 'shipping.address2', 'shipping.address3', 'shipping.city', 'shipping.zip' ,'shipping.countryid'],
    billing: ['billing.attn', 'billing.addressee', 'billing.address1', 'billing.address2', 'billing.address3', 'billing.city', 'billing.zip' ,'billing.countryid'],
    cartInfo: ['ccnumber', 'ccname', 'ccexpire'],
    // all: [...formFields.general, ...formFields.shipping, ...formFields.billing, ...formFields.cartInfo]
}
export const errorBase = {
    required: {
        companyName: "Company name is Required",
        email: "Email is Required",
        phone: "Phone is Required",
        password: "Password is Required",
        confirmPassword: "Confirm password is Required",
        category: "Category is Required",
        orderFrom: "Order from is Required",
        acContact: "Accounting contact is Required",
        acPhone: "Accounting phone is Required",
        "shipping.attn": "shipping attention is Required",
        "shipping.addressee": "shipping addressee is Required",
        "shipping.address1": "shipping address1 is Required",
        "shipping.address2": "shipping address2 is Required",
        "shipping.address3": "shipping address3 is Required",
        "shipping.zip": "shipping zip is Required",
        "shipping.countryid": "shipping country is Required",
        "billing.attn": "billing attention is Required",
        "billing.addressee": "billing addressee is Required",
        "billing.address1": "billing address1 is Required",
        "billing.address2": "billing address2 is Required",
        "billing.address3": "billing address3 is Required",
        "billing.zip": "billing zip is Required",
        "billing.countryid": "billing country is Required",
        ccnumber: "Credit card number is Required",
        ccname: "Credit card name is Required",
        ccexpire: "Credit card expiry date is Required",
    }
}
export const validate = (props, fields) => {
    const { values, touched, errors, setTouched, setErrors } = props;
    var err = {};
    fields.map((field)=>{
        touched[field] = true
        if(!values[field]){
            err[field] = errorBase.required[field]
        }else if(values[field] && errors[field]){
            delete errors[field]
        }
    })
    setTouched(touched)
    setErrors(err)
    return {errors: err, touched};
}
export const handleNext = (props, fields) => {
    const { onNext } = props;
    let res = validate(props, formFields[fields]);
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
    if(touched[name]) validate(props, formFields[fields]);
    setValues(values)
}

export const handleSubmit = (props, fields) => {
    const { submitForm } = props;
    let res = validate(props, [...formFields.general, ...formFields.shipping, ...formFields.billing, ...formFields.cartInfo]);
    if(_isEmpty(res.errors)) {
        submitForm();
    }
}

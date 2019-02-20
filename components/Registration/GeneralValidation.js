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

export const validate = (props, fields) => {
    const { values, touched, errors, setTouched, setErrors } = props;
    var err = {};
    fields.map((field)=>{
        touched[field] = true
        if(!values[field]){
            err[field] = `${field} required`
        }else if(values[field] && errors[field]){
            delete errors[field]
        }
    })
    setTouched(touched)
    setErrors({...errors, ...err})
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
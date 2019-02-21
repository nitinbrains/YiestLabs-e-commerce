import _isEmpty from 'lodash/isEmpty';

export const errorBase = {
    required: {
        billing: {
            attn: "Billing attention is Required",
            addressee: "Billing addressee is Required",
            address1: "Billing address1 is Required",
            address2: "Billing address2 is Required",
            address3: "Billing address3 is Required",
            zip: "Billing zip is Required",
            countryid: "Billing country is Required",
        }
    }
}

export const validate = (props) => {
    const { values, touched, errors, setTouched, setErrors } = props;
    const fields = Object.keys(errorBase.required);
    var err = {};
    fields.map((field)=> {
        touched[field] = true;
        if (!values[field]) {
            err[field] = errorBase.required[field]
        } else if(values[field] && errors[field]) {
            delete errors[field];
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


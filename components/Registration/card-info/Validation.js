import _isEmpty from 'lodash/isEmpty';

export const errorBase = {
    required: {
        ccnumber: "Credit card number is Required",
        ccname: "Credit card name is Required",
        ccexpire: "Credit card expiry date is Required",
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

export const handleSubmit = (props, fields) => {
    const { submitForm } = props;
    let res = validate(props);
    if(_isEmpty(res.errors)) {
        submitForm();
    }
}

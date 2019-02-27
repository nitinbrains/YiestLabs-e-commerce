import _isEmpty from 'lodash/isEmpty';

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


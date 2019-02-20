import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import MaskedTextField from "../Form/MaskedTextField";
import Cleave from "cleave.js/react";

// import * as validation from './GeneralValidation';
import {handleChange, handleNext} from  './GeneralValidation';


function PhoneMaskedTextField(props) {
    let { options, onChange, inputRef, ...other } = props;
    options={phone: true, phoneRegionCode: 'US'};
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} />;
}

const fields = 'general'; //['companyName', 'email', 'phone', 'password', 'confirmPassword', 'category', 'orderFrom' ,'acContact', 'acPhone']
const FormikErrorMessage = ({className, touched, error}) => {
    // if (!touched) {
    //     return null;
    // }

    return (
        <div className="error">{error}</div>
    );
};
// const validateGeneral = (props) => {
//     const { validateForm, values, onNext, setTouched, validateField, setErrors } = props;
//     console.log('values, fields',values, fields);
//     var errors = {};
//     var touched = {};
//     fields.map((field)=>{
//         console.log('isEmpty(values[field])', _isEmpty(values[field]));
//         touched[field] = true
        
//         if(_isEmpty(values[field])){
//             errors[field] = `${field} required`
//         }
//     })
//     setTouched(touched)
//     setErrors(errors)
//     return {errors, touched};
// }
// const handleNext = (props) => {
//     const { validateForm, onNext, values, errors, setTouched, touched, validateField, setErrors } = props;
//     let res = validateGeneral(props);
//     if(_isEmpty(res.errors)) {
//         onNext();
//     }
//     // validateForm(values).then((res) => {
//     //     // console.log('@@@@@@@@@@@@@@@@', res, _isEmpty(res.errors));
        
//     //     if (_isEmpty(res.errors)) {
//     //         // console.log('next');
            
//     //         onNext();
//     //     }
//     // });

// }
// const handleChange1 = (e, props) => {
//     console.log('e, form', e.target.value,e.target.name, props);
//     const {setValues, values, touched} = props;
//     let value = e.target.value
//     let name = e.target.name
//     values[name] = value
//     props = {...props, values}
//     if(touched[name]) validateGeneral(props);
//     setValues(values)
// }
const General = (props) => {
    const {
        touched,
        errors,
        classes,
        onNext,
        onBack,
    } = props;
    console.log('11111', touched, errors);
    return (
        <Grid container spacing={24}>
            <Grid item xs={12}>
                <Typography variant="h6" color="textPrimary">
                    General Information
                </Typography>
                <div
                    style={{
                        borderTop: "solid 1.5px",
                        borderColor: "#CCCCCC",
                        marginBottom: 10
                    }}
                />                    
            </Grid>
            <Grid item xs={12}>
                <Field
                    // validate={validation.companyName}
                    name="companyName"
                    render={({field: {value, onChange }, 
                        // form: { touched }
                        form
                    }) => {
                        console.log('form', form, value);
                        
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'companyName')} touched={_get(touched, 'companyName')} />
                                <TextField
                                    id="companyName"
                                    name="companyName"
                                    label="Company Name"
                                    fullWidth
                                    autoComplete="company name"
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'companyName')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'email')} touched={_get(touched, 'email')} />
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    autoComplete="email"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'email')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'phone')} touched={_get(touched, 'phone')} />
                                <TextField
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    fullWidth
                                    autoComplete="phone"
                                    InputProps={{
                                        inputComponent: PhoneMaskedTextField
                                    }}
                                    onChange={(e)=>handleChange(e, form, fields)}  
                                    value={_get(value, 'phone')} 
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'password')} touched={_get(touched, 'password')} />
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    autoComplete="password"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={value.password}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'confirmPassword')} touched={_get(touched, 'confirmPassword')} />
                                <TextField
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    autoComplete="confirmPassword"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'confirmPassword')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'category')} touched={_get(touched, 'category')} />
                                <TextField
                                    id="category"
                                    name="category"
                                    label="Category"
                                    select
                                    fullWidth
                                    autoComplete="category"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'category')}
                                >
                                    <MenuItem value={1}>Retailer</MenuItem>
                                    <MenuItem value={2}>Individual</MenuItem>
                                    <MenuItem value={3}>Proffesional Brewery</MenuItem>
                                    <MenuItem value={4}>Proffesional Winery</MenuItem>
                                    <MenuItem value={5}>Proffesional Destillery</MenuItem>
                                </TextField>
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'orderFrom')} touched={_get(touched, 'orderFrom')} />
                                <TextField
                                    id="orderFrom"
                                    name="orderFrom"
                                    label="Order From"
                                    select
                                    fullWidth
                                    autoComplete="orderFrom"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'orderFrom')}
                                >
                                    <MenuItem value={1}>
                                        US Only
                                        </MenuItem>
                                    <MenuItem value={2}>
                                        US &amp; Copenhagen (For Europe, No Homebrew)
                                    </MenuItem>
                                    <MenuItem value={3}>
                                        US &amp; Hong Kong (For Asia, No Homebrew)
                                    </MenuItem>
                                    <MenuItem value={4}>
                                        US, Copenhagen, and Hong Kong
                                    </MenuItem>
                                </TextField>
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'acContact')} touched={_get(touched, 'acContact')} />
                                <TextField
                                    id="acContact"
                                    name="acContact"
                                    label="Accounting Contact"
                                    fullWidth
                                    autoComplete="acContact"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'acContact')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'acPhone')} touched={_get(touched, 'acPhone')} />
                                <TextField
                                    id="acPhone"
                                    name="acPhone"
                                    label="Accounting Phone Number"
                                    fullWidth
                                    autoComplete="acPhone"
                                    InputProps={{
                                        inputComponent: PhoneMaskedTextField
                                    }}
                                    onChange={(e)=>handleChange(e, form, fields)}
                                    value={_get(value, 'acPhone')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => handleNext(props, fields)}>
                Next
            </Button>
        </Grid>
    )
};

const styles = theme => ({
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

General.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(General);

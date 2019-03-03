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
import { Field } from "formik";
import * as Yup from "yup";
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import MaskedTextField from "../Form/MaskedTextField";
import Cleave from "cleave.js/react";

function PhoneMaskedTextField(props) {
    let { options, onChange, inputRef, ...other } = props;
    options={phone: true, phoneRegionCode: 'US'};
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} />;
}

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
}

const General = ({
    values,
    touched,
    errors,
    classes,
    onNext,
    setErrors
}) => {

    const handleNext = () => {
        let errors = validate();
        if (_isEmpty(errors)) {
            onNext();
        } else {
            setErrors(errors);
        }
    }

    const validate = () => {
        var errors = {};

        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!values.companyName) {
            errors.companyName = "Company name is required";
        }
    
        if(!values.email) {
            errors.email = "Email is required";
        }
        if (reg.test(values.email) === false) {
            errors.email = "Please Enter a Valid Email";
        }
        if (!values.phone) {
            errors.phone = "Phone is required";
        }
        
        if (!values.password) {
            errors.password = "Password is required";
        }
        else if (values.password.length < 9) {
            errors.password = "Password must contain at least 9 characters";
        }
        
        if (!values.confirmPassword) {
            errors.confirmPassword = "Please enter your password a second time";
        }
        if (values.password != values.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        if(!values.category) {
            errors.category = "Category is required";
        }

        if(!values.orderFrom) {
            errors.orderFrom = "Order from is required";
        }

        if(!values.contactName) {
            errors.contactName = "Accounting contact is required";
        }

        if(!values.contactPhone) {
            errors.contactPhone = "Accounting phone number is required";
        }

        return errors;
    }

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
                    name="companyName"
                    render={({field: {value, onChange }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'companyName')} touched={_get(touched, 'companyName')} />
                                <TextField
                                    id="companyName"
                                    name="companyName"
                                    label="Company Name"
                                    fullWidth
                                    autoComplete="companyName"
                                    onChange={onChange}
                                    value={_get(value, 'companyName')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }}) => {

                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'email')} touched={_get(touched, 'email')} />
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    autoComplete="email"
                                    onChange={onChange}
                                    value={_get(value, 'email')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }}) => {
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
                                    onChange={onChange}
                                    value={_get(value, 'phone')} 
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }}) => {
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
                                    onChange={onChange}
                                    value={_get(value, 'password')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }}) => {
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
                                    onChange={onChange}
                                    value={_get(value, 'confirmPassword')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }}) => {
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
                                    onChange={onChange}
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
                    render={({field: {value, onChange }}) => {
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
                                    onChange={onChange}
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
                    render={({field: {value, onChange }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'contactName')} touched={_get(touched, 'contactName')} />
                                <TextField
                                    id="contactName"
                                    name="contactName"
                                    label="Accounting Contact"
                                    fullWidth
                                    autoComplete="contactName"
                                    onChange={onChange}
                                    value={_get(value, 'contactName')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'contactPhone')} touched={_get(touched, 'contactPhone')} />
                                <TextField
                                    id="contactPhone"
                                    name="contactPhone"
                                    label="Accounting Phone Number"
                                    fullWidth
                                    autoComplete="contactPhone"
                                    InputProps={{
                                        inputComponent: PhoneMaskedTextField
                                    }}
                                    onChange={onChange}
                                    value={_get(value, 'contactPhone')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleNext}> 
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

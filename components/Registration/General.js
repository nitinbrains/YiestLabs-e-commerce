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

import * as validation from './GeneralValidation';

function PhoneMaskedTextField(props) {
    let { options, onChange, inputRef, ...other } = props;
    options={phone: true, phoneRegionCode: 'US'};
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} />;
}


const FormikErrorMessage = ({className, touched, error}) => {
    if (!touched) {
        return null;
    }
    return (
        <div className="error">{error}</div>
    );
};

const handleNext = (props) => {
    const { validateForm, onNext, values } = props;

    validateForm(values).then((res) => {
        if (_isEmpty(res.errors)) {
            onNext();
        }
    });

}

const General = (props) => {

    const {
        touched,
        errors,
        classes,
        onNext,
        onBack,
        validateField
    } = props;
    // console.log(touched,errors,'errorssssssssssssssssssssss')
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
                    name="companyname"
                    render={({field, form: {  }}) => {
                    console.log(field.value,'valllllllllllllllll')
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'companyname')} touched={_get(touched, 'companyname')} />
                                <TextField
                                    name='companyname'
                                    id="companyname"
                                    label="Company Name"
                                    fullWidth
                                    {...field}
                                    autoComplete="company name"
                                    onChange={field.onChange}
                                    value={_get(field.value, 'companyname')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field, form: { }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'email')} touched={_get(touched, 'email')} />
                                <TextField
                                    id="email"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    {...field}
                                    autoComplete="email"
                                    onChange={field.onChange}
                                    value={_get(field.value, 'email')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field, form: {  }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'phone')} touched={_get(touched, 'phone')} />
                                <TextField
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    fullWidth
                                    {...field}
                                    autoComplete="phone"
                                    InputProps={{
                                        inputComponent: PhoneMaskedTextField
                                    }}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field, form: {  }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'password')} touched={_get(touched, 'password')} />
                                <TextField
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type="password"
                                    fullWidth
                                    {...field}
                                    autoComplete="password"
                                    onChange={field.onChange}
                                    value={field.value.password}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field, form: { }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'confirmPassword')} touched={_get(touched, 'confirmPassword')} />
                                <TextField
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    fullWidth
                                    {...field}
                                    autoComplete="confirmPassword"
                                    onChange={field.onChange}
                                    value={_get(field.value, 'confirmPassword')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field, form: {  }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'category')} touched={_get(touched, 'category')} />
                                <TextField
                                    id="category"
                                    name="category"
                                    label="Category"
                                    select
                                    fullWidth
                                    {...field}
                                    autoComplete="category"
                                    onChange={field.onChange}
                                    value={_get(field.value, 'category')}
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
                    render={({field, form: {  }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'orderFrom')} touched={_get(touched, 'orderFrom')} />
                                <TextField
                                    id="orderFrom"
                                    name="orderFrom"
                                    label="Order From"
                                    select
                                    fullWidth
                                    {...field}
                                    autoComplete="orderFrom"
                                    onChange={field.onChange}
                                    value={_get(field.value, 'orderFrom')}
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
                    render={({field, form: { }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'acContact')} touched={_get(touched, 'acContact')} />
                                <TextField
                                    id="acContact"
                                    name="acContact"
                                    label="Accounting Contact"
                                    fullWidth
                                    {...field}
                                    autoComplete="acContact"
                                    onChange={field.onChange}
                                    value={_get(field.value, 'acContact')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field, form: {  }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'acPhone')} touched={_get(touched, 'acPhone')} />
                                <TextField
                                    id="acPhone"
                                    name="acPhone"
                                    label="Accounting Phone Number"
                                    fullWidth
                                    {...field}
                                    autoComplete="acPhone"
                                    InputProps={{
                                        inputComponent: PhoneMaskedTextField
                                    }}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => handleNext(props)}>
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

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

import Utils from "lib/Utils";

function PhoneMaskedTextField(props) {
    let { options, onChange, inputRef,value, ...other } = props;
    options={phone: true, phoneRegionCode: 'US'};
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} value={value}/>;
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

        if (!values.companyName) {
            errors.companyName = "Company name is required";
        }

        if (!values.email) {
            errors.email = "Email is required";
        } else if (!Utils.isValidEmail(values.email)) {
            errors.email = "Enter a valid email";
        }

        if(!values.orderFrom) {
            errors.orderFrom = "Order from is required";
        } else {
            if (values.orderFrom !== 1) {
                if(!values.vat) {
                    errors.vat = "Vat is required";
                } else if (!Utils.isValidVat(values.vat)) {
                   errors.vat = "Enter a valid vat";
                }
            }
        }

        if (!values.phone) {
            errors.phone = "Phone is required";
        }

        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must contain at least 6 characters";
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
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'companyName')} />
                            <TextField
                                name="companyName"
                                label="Company Name"
                                fullWidth
                                variant="outlined"
                                autoComplete="companyName"
                                onChange={onChange}
                                value={_get(value, 'companyName') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'email')} />
                            <TextField
                                name="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                autoComplete="email"
                                onChange={onChange}
                                value={_get(value, 'email') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'phone')} />
                            <TextField
                                name="phone"
                                label="Phone"
                                variant="outlined"
                                fullWidth
                                autoComplete="phone"
                                InputProps={{ inputComponent: PhoneMaskedTextField }}
                                onChange={onChange}
                                value={_get(value, 'phone') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'password')} />
                            <TextField
                                name="password"
                                variant="outlined"
                                label="Password"
                                type="password"
                                fullWidth
                                autoComplete="password"
                                onChange={onChange}
                                value={_get(value, 'password') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'confirmPassword')} />
                            <TextField
                                name="confirmPassword"
                                label="Confirm Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                autoComplete="confirmPassword"
                                onChange={onChange}
                                value={_get(value, 'confirmPassword') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'orderFrom')} />
                            <TextField
                                name="orderFrom"
                                label="Order From"
                                variant="outlined"
                                select
                                fullWidth
                                autoComplete="orderFrom"
                                onChange={onChange}
                                value={_get(value, 'orderFrom') || ''}
                            >
                                <MenuItem value={1}>
                                    White Labs USA
                                </MenuItem>
                                <MenuItem value={2}>
                                    USA &amp; Copenhagen (For Europe, No Homebrew)
                                </MenuItem>
                                <MenuItem value={3}>
                                    USA &amp; Hong Kong (For Asia, No Homebrew)
                                </MenuItem>
                                <MenuItem value={4}>
                                    USA, Copenhagen, and Hong Kong
                                </MenuItem>
                            </TextField>
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12} className={values.orderFrom == 1 && classes.hide}>
                            <FormikErrorMessage error={_get(errors, 'vat')} />
                            <TextField
                                name="vat"
                                label="Vat"
                                variant="outlined"
                                fullWidth
                                autoComplete="vat"
                                placeholder="US-123456"
                                onChange={onChange}
                                value={_get(value, 'vat') || ''}
                            >
                            </TextField>
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'category')} />
                            <TextField
                                name="category"
                                label="Category"
                                variant="outlined"
                                select
                                fullWidth
                                autoComplete="category"
                                onChange={onChange}
                                value={_get(value, 'category') || ''}
                            >
                                <MenuItem value={1}>Retailer</MenuItem>
                                <MenuItem value={2}>Individual</MenuItem>
                                <MenuItem value={3}>Professional Brewery</MenuItem>
                                <MenuItem value={4}>Professional Winery</MenuItem>
                                <MenuItem value={5}>Professional Destillery</MenuItem>
                            </TextField>
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'contactName')} />
                            <TextField
                                name="contactName"
                                label="Accounting Contact"
                                variant="outlined"
                                fullWidth
                                autoComplete="contactName"
                                onChange={onChange}
                                value={_get(value, 'contactName') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'contactPhone')} />
                            <TextField
                                name="contactPhone"
                                label="Accounting Phone Number"
                                variant="outlined"
                                fullWidth
                                autoComplete="contactPhone"
                                InputProps={{ inputComponent: PhoneMaskedTextField }}
                                onChange={onChange}
                                value={_get(value, 'contactPhone') || ''}
                            />
                        </Grid>
                    )
                }}
            />
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
    },
    hide: {
        display: "none"
    },
});

General.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(General);

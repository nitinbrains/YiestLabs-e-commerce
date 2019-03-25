import React, { useState } from "react";
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
import FormCheckbox from "components/Form/FormCheckbox";
import * as Yup from "yup";
import _get from "lodash/get";
import _set from "lodash/set";
import _isEmpty from "lodash/isEmpty";

import SalesLib from "lib/SalesLib";

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};

const Billing = ({ values, touched, errors, classes, onNext, onBack, setErrors, setValues }) => {
    const [sameAsShipping, setSameAddress] = useState(false);

    const handleSameAddress = e => {
        const checked = e.target.checked;

        if (checked) {
            setValues({ billing: _get(values, "shipping"), ...values });
        } else {
            setValues({ billing: {}, ...values });
        }

        setSameAddress(checked);
    };

    const handleNext = () => {
        let errors = validate();
        if (_isEmpty(errors)) {
            onNext();
        } else {
            setErrors(errors);
        }
    };

    const validate = () => {
        var errors = {};
       
        if(!_get(values, 'billing.attn')) {
            _set(errors, 'billing.attn', 'Attention is required');
        }

        if(!_get(values, 'billing.addressee')) {
            _set(errors, 'billing.addressee', 'Addressee is required');
        }

        if(!_get(values, 'billing.address1')) {
            _set(errors, 'billing.address1', 'Address1 is required');
        }

        if(!_get(values, 'billing.city')) {
            _set(errors, 'billing.city', 'City is required');
        }

        if(!_get(values, 'billing.zip')) {
            _set(errors, 'billing.zip', 'Zip is required');
        }

        if(!_get(values, 'billing.countryid')) {
            _set(errors, 'shipping.countryid', 'Country is required');
        }

        return errors;
    }

    return (
        <Grid container spacing={24}>
            <Grid item xs={12}>
                <Typography variant="h6" color="textPrimary">
                    Billing
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
                <FormCheckbox checked={sameAsShipping} onChange={e => handleSameAddress(e)} />
                Same As Shipping
            </Grid>

            {(!sameAsShipping || !_isEmpty(errors)) && (
                <React.Fragment>
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.attn")} touched={_get(touched, "billing.attn")} />
                                    <TextField
                                        name="billing.attn"
                                        label="Attention"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="attention"
                                        onChange={onChange}
                                        value={_get(value, "billing.attn") || ''}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.addressee")} />
                                    <TextField
                                        name="billing.addressee"
                                        label="Addressee"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="addressee"
                                        onChange={onChange}
                                        value={_get(value, "billing.addressee") || ''}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.address1")} />
                                    <TextField
                                        name="billing.address1"
                                        label="Address 1"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="address1"
                                        onChange={onChange}
                                        value={_get(value, "billing.address1") || ''}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.address2")} />
                                    <TextField
                                        name="billing.address2"
                                        label="Address 2"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="address2"
                                        onChange={onChange}
                                        value={_get(value, "billing.address2") || ''}
\                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.address3")} />
                                    <TextField
                                        name="billing.address3"
                                        label="Address3"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="address3"
                                        onChange={onChange}
                                        value={_get(value, "billing.address3") || ''}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.city")} />
                                    <TextField 
                                        name="billing.city" 
                                        label="City" 
                                        variant="outlined"
                                        fullWidth 
                                        autoComplete="city" 
                                        onChange={onChange} 
                                        value={_get(value, "billing.city") || ''}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.zip")} />
                                    <TextField 
                                        name="billing.zip" 
                                        label="Zip Code" 
                                        variant="outlined"
                                        fullWidth 
                                        autoComplete="zip" 
                                        onChange={onChange} 
                                        value={_get(value, "billing.zip") || ''}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange } }) => {
                            return (
                                <Grid item xs={12}>
                                    <FormikErrorMessage error={_get(errors, "billing.countryid")} touched={_get(touched, "billing.countryid")} />
                                    <TextField
                                        select
                                        name="billing.countryid"
                                        label="Country"
                                        variant="outlined"
                                        fullWidth
                                        autoComplete="zip"
                                        onChange={onChange}
                                        value={_get(value, "billing.countryid") || ''}
                                    >
                                        {SalesLib.COUNTRY_MAP.map(country => (
                                            <MenuItem key={country.id} value={country.id}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            );
                        }}
                    />
                </React.Fragment>
            )}

            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleNext}>
                Next
            </Button>
        </Grid>
    );
};

// export default Billing;
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

Billing.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Billing);

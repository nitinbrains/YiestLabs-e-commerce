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
        if (_isEmpty(errors.billing)) {
            onNext();
        } else {
            setErrors(errors);
        }
    };

    const validate = () => {
        let errors = { billing: {} };

        if (!_get(values, "billing.attn")) {
            errors.billing.attn = "Attention is required";
        }

        if (!_get(values, "billing.addressee")) {
            errors.billing.addressee = "Addressee is required";
        }

        if (!_get(values, "billing.address1")) {
            errors.billing.address1 = "Address1 is required";
        }

        if (!_get(values, "billing.city")) {
            errors.billing.city = "City is required";
        }

        if (!_get(values, "billing.zip")) {
            errors.billing.zip = "Zip is required";
        }

        if (!_get(values, "billing.countryid")) {
            errors.billing.countryid = "Country is required";
        }

        return errors;
    };

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
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.attn")} touched={_get(touched, "billing.attn")} />
                                        <TextField
                                            id="billing.attn"
                                            name="billing.attn"
                                            label="Attention"
                                            fullWidth
                                            autoComplete="attention"
                                            onChange={onChange}
                                            value={_get(value, "billing.attn") || ""}
                                        />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.addressee")} touched={_get(touched, "billing.addressee")} />
                                        <TextField
                                            id="billing.addressee"
                                            name="billing.addressee"
                                            label="Addressee"
                                            fullWidth
                                            autoComplete="addressee"
                                            onChange={onChange}
                                            value={_get(value, "billing.addressee") || ""}
                                        />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.address1")} touched={_get(touched, "billing.address1")} />
                                        <TextField
                                            id="billing.address1"
                                            name="billing.address1"
                                            label="Address 1"
                                            fullWidth
                                            autoComplete="address1"
                                            onChange={onChange}
                                            value={_get(value, "billing.address1") || ""}
                                        />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.address2")} touched={_get(touched, "billing.address2")} />
                                        <TextField
                                            id="billing.address2"
                                            name="billing.address2"
                                            label="Address 2"
                                            fullWidth
                                            autoComplete="address2"
                                            onChange={onChange}
                                            value={_get(value, "billing.address2") || ""}
                                        />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.address3")} touched={_get(touched, "billing.address3")} />
                                        <TextField
                                            id="billing.address3"
                                            name="billing.address3"
                                            label="Address3"
                                            fullWidth
                                            autoComplete="address3"
                                            onChange={onChange}
                                            value={_get(value, "billing.address3") || ''}
                                        />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.city")} touched={_get(touched, "billing.city")} />
                                        <TextField 
                                            id="billing.city" 
                                            name="billing.city" 
                                            label="City" 
                                            fullWidth 
                                            autoComplete="city" 
                                            onChange={onChange} 
                                            value={_get(value, "billing.city") || ''} />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.zip")} touched={_get(touched, "billing.zip")} />
                                        <TextField 
                                            id="billing.zip" 
                                            name="billing.zip" 
                                            label="Zip Code" 
                                            fullWidth 
                                            autoComplete="zip" 
                                            onChange={onChange} 
                                            value={_get(value, "billing.zip") || ''} />
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Field
                            render={({ field: { value, onChange } }) => {
                                return (
                                    <React.Fragment>
                                        <FormikErrorMessage error={_get(errors, "billing.countryid")} touched={_get(touched, "billing.countryid")} />
                                        <TextField
                                            select
                                            id="billing.countryid"
                                            name="billing.countryid"
                                            label="Country"
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
                                    </React.Fragment>
                                );
                            }}
                        />
                    </Grid>
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

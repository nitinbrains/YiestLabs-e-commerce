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
import { Formik, Form, Field } from 'formik';
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from 'lodash/isEmpty';
import SalesLib from 'lib/SalesLib';

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};

const Shipping = ({
    values,
    touched,
    errors,
    classes,
    onNext,
    onBack,
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
       
        if(!_get(values, 'shipping.attn')) {
            _set(errors, 'shipping.attn', 'Attention is required');
        }

        if(!_get(values, 'shipping.addressee')) {
            _set(errors, 'shipping.addressee', 'Addressee is required');
        }

        if(!_get(values, 'shipping.address1')) {
            _set(errors, 'shipping.address1', 'Address1 is required');
        }

        if(!_get(values, 'shipping.city')) {
            _set(errors, 'shipping.city', 'City is required');
        }

        if(!_get(values, 'shipping.zip')) {
            _set(errors, 'shipping.zip', 'Zip is required');
        }

        if(!_get(values, 'shipping.countryid')) {
            _set(errors, 'shipping.countryid', 'Country is required');
        }

        return errors;
    }
    
    return (
        <Grid container spacing={24}>
            <Grid item xs={12}>
                <Typography variant="h6" color="textPrimary">
                    Shipping
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
                            <FormikErrorMessage error={_get(errors, 'shipping.attn')}/>
                            <TextField
                                name="shipping.attn"
                                label="Attention"
                                variant="outlined"
                                fullWidth
                                autoComplete="attention"
                                onChange={onChange}
                                value={_get(value, 'shipping.attn') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.addressee')} />
                            <TextField
                                name="shipping.addressee"
                                label="Addressee"
                                variant="outlined"
                                fullWidth
                                autoComplete="addressee"
                                onChange={onChange}
                                value={_get(value, 'shipping.addressee') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.address1')} />
                            <TextField
                                name="shipping.address1"
                                label="Address 1"
                                variant="outlined"
                                fullWidth
                                autoComplete="address1"
                                onChange={onChange}
                                value={_get(value, 'shipping.address1') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.address2')} />
                            <TextField
                                name="shipping.address2"
                                label="Address 2"
                                variant="outlined"
                                fullWidth
                                autoComplete="address2"
                                onChange={onChange}
                                value={_get(value, 'shipping.address2') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.address3')} />
                            <TextField
                                name="shipping.address3"
                                label="Address3"
                                variant="outlined"
                                fullWidth
                                autoComplete="address3"
                                onChange={onChange}
                                value={_get(value, 'shipping.address3') || ''}
                            />
                        </Grid>
                    )
                }}
            />
           
            <Field
                render={({field: {value, onChange }, form}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.city')} />
                            <TextField
                                name="shipping.city"
                                label="City"
                                variant="outlined"
                                fullWidth
                                autoComplete="city"
                                onChange={onChange}
                                value={_get(value, 'shipping.city') || ''}
                            />
                        </Grid>
                    )
                }}
            />
           
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.zip')} />
                            <TextField
                                name="shipping.zip"
                                label="Zip Code"
                                variant="outlined"
                                fullWidth
                                autoComplete="zip"
                                onChange={onChange}
                                value={_get(value, 'shipping.zip') || ''}
                            />
                        </Grid>
                    )
                }}
            />
            <Field
                render={({field: {value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, 'shipping.countryid')}/>
                            <TextField
                                select
                                name="shipping.countryid"
                                label="Country"
                                variant="outlined"
                                fullWidth
                                autoComplete="zip"
                                onChange={onChange}
                                value={_get(value, 'shipping.countryid') || ''}
                            >
                                {SalesLib.COUNTRY_MAP.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    )
                }}
            />
            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleNext}>
                Next
            </Button>
        </Grid>
    );
}

// export default Shipping;
const styles = theme => ({
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
});

Shipping.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(Shipping);

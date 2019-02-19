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
import * as Yup from 'yup';
import _get from 'lodash/get';
import SalesLib from 'lib/SalesLib';

const FormikErrorMessage = ({className, touched, error}) => {
    // if (!touched) {
    //     return null;
    // }

    return (
        <div className="error">{error}</div>
    );
};

const Shipping = (props) => {

    const {
        values,
        touched,
        errors,
        classes,
        onNext,
        onBack
    } = props;
    
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
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.attn')} touched={_get(touched, 'shipping.attn')} />
                                <TextField
                                    id="shipping.attn"
                                    name="shipping.attn"
                                    label="Attention"
                                    fullWidth
                                    autoComplete="attention"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.attn')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.addressee')} touched={_get(touched, 'shipping.addressee')} />
                                <TextField
                                    id="shipping.addressee"
                                    name="shipping.addressee"
                                    label="Addressee"
                                    fullWidth
                                    autoComplete="addressee"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.addressee')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.address1')} touched={_get(touched, 'shipping.address1')} />
                                <TextField
                                    id="shipping.address1"
                                    name="shipping.address1"
                                    label="Address 1"
                                    fullWidth
                                    autoComplete="address1"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.address1')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.address2')} touched={_get(touched, 'shipping.address2')} />
                                <TextField
                                    id="shipping.address2"
                                    name="shipping.address2"
                                    label="Address 2"
                                    fullWidth
                                    autoComplete="address2"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.address2')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.address3')} touched={_get(touched, 'shipping.address3')} />
                                <TextField
                                    id="shipping.address3"
                                    name="shipping.address3"
                                    label="Address3"
                                    fullWidth
                                    autoComplete="address3"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.address3')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.city')} touched={_get(touched, 'shipping.city')} />
                                <TextField
                                    id="shipping.city"
                                    name="shipping.city"
                                    label="City"
                                    fullWidth
                                    autoComplete="city"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.city')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.zip')} touched={_get(touched, 'shipping.zip')} />
                                <TextField
                                    id="shipping.zip"
                                    name="shipping.zip"
                                    label="Zip Code"
                                    fullWidth
                                    autoComplete="zip"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.zip')}
                                />
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({field: {value, onChange }, form: { touched }}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'shipping.countryid')} touched={_get(touched, 'shipping.countryid')} />
                                <TextField
                                    select
                                    id="shipping.countryid"
                                    name="shipping.countryid"
                                    label="Country"
                                    fullWidth
                                    autoComplete="zip"
                                    onChange={onChange}
                                    value={_get(value, 'shipping.countryid')}
                                >
                                    {SalesLib.COUNTRY_MAP.map((country, index) => (
                                        <MenuItem value={country.id}>{country.name}</MenuItem>
                                    ))}
                                </TextField>

                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={onNext}>
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


export default  withStyles(styles)(Shipping);

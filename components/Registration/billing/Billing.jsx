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
import {handleChange, handleNext} from  './Validation';

const FormikErrorMessage = ({className, touched, error}) => {

    return (
        <div className="error">{error}</div>
    );
};

const Billing = (props) => {

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
                <Field
                    render={({field: {value, onChange }, form}) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, 'billing.attn')} touched={_get(touched, 'billing.attn')} />
                                <TextField
                                    id="billing.attn"
                                    name="billing.attn"
                                    label="Attention"
                                    fullWidth
                                    autoComplete="attention"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.attn')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.addressee')} touched={_get(touched, 'billing.addressee')} />
                                <TextField
                                    id="billing.addressee"
                                    name="billing.addressee"
                                    label="Addressee"
                                    fullWidth
                                    autoComplete="addressee"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.addressee')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.address1')} touched={_get(touched, 'billing.address1')} />
                                <TextField
                                    id="billing.address1"
                                    name="billing.address1"
                                    label="Address 1"
                                    fullWidth
                                    autoComplete="address1"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.address1')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.address2')} touched={_get(touched, 'billing.address2')} />
                                <TextField
                                    id="billing.address2"
                                    name="billing.address2"
                                    label="Address 2"
                                    fullWidth
                                    autoComplete="address2"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.address2')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.address3')} touched={_get(touched, 'billing.address3')} />
                                <TextField
                                    id="billing.address3"
                                    name="billing.address3"
                                    label="Address3"
                                    fullWidth
                                    autoComplete="address3"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.address3')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.city')} touched={_get(touched, 'billing.city')} />
                                <TextField
                                    id="billing.city"
                                    name="billing.city"
                                    label="City"
                                    fullWidth
                                    autoComplete="city"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.city')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.zip')} touched={_get(touched, 'billing.zip')} />
                                <TextField
                                    id="billing.zip"
                                    name="billing.zip"
                                    label="Zip Code"
                                    fullWidth
                                    autoComplete="zip"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.zip')}
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
                                <FormikErrorMessage error={_get(errors, 'billing.countryid')} touched={_get(touched, 'billing.countryid')} />
                                <TextField
                                    select
                                    id="billing.countryid"
                                    name="billing.countryid"
                                    label="Country"
                                    fullWidth
                                    autoComplete="zip"
                                    // onChange={onChange}
                                    onChange={(e)=>handleChange(e, form)}
                                    value={_get(value, 'billing.countryid')}
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
            <Button variant="contained" color="primary" className={classes.button} onClick={()=>handleNext(props)}>
                Next
            </Button>
        </Grid>
    );
}

// export default Billing;
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

Billing.propTypes = {
    classes: PropTypes.object.isRequired
};


export default  withStyles(styles)(Billing);

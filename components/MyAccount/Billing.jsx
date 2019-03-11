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
import SalesLib from 'lib/SalesLib';

const FormikErrorMessage = ({ error, touched }) => {

    if(touched && error) {
        return <div className="error">{error}</div>;
    } else {
        return null;
    } 
}

const Billing = ({
    values,
    touched,
    errors,
    classes,
    setErrors
}) => {
    return (
        <Grid item xs={12} md={5} container style={{ marginRight: 30, textAlign: "center" }}>
            <Grid item xs={12}>
                <Typography style={{ textAlign: "left" }} variant="h6" color="textPrimary">
                    BILLING INFORMATION
                </Typography>
                <div className={classes.sectionTitleDivider} />
            </Grid>
            
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.attn")} touched={_get(touched, "billing.attn")} />
                            <TextField
                                name="billing.attn"
                                fullWidth
                                value={_get(value, "billing.attn")}
                                InputLabelProps={{ shrink: _get(value, "billing.attn") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="Attention"
                                autoComplete="billing.attn"
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.addressee")} touched={_get(touched, "billing.addressee")} />
                            <TextField
                                name="billing.addressee"
                                fullWidth
                                value={_get(value, "billing.addressee")}
                                InputLabelProps={{ shrink: _get(value, "billing.addressee") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="Addressee"
                                autoComplete="billing.addressee"
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.address1")} touched={_get(touched, "billing.address1")} />
                            <TextField
                                name="billing.address1"
                                fullWidth
                                value={_get(value, "billing.address1")}
                                InputLabelProps={{ shrink: _get(value, "billing.address1") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="Address 1"
                                autoComplete="billing.address1"
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.address2")} touched={_get(touched, "billing.address2")} />
                            <TextField
                                name="billing.address2"
                                fullWidth
                                value={_get(value, "billing.address2")}
                                InputLabelProps={{ shrink: _get(value, "billing.address2") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="Address 2"
                                autoComplete="billing.address2"
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.address3")} touched={_get(touched, "billing.address3")} />
                            <TextField
                                name="billing.address3"
                                fullWidth
                                value={_get(value, "billing.address3")}
                                InputLabelProps={{ shrink: _get(value, "billing.address3") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="Address 3"
                                autoComplete="billing.address3"
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.city")} touched={_get(touched, "billing.city")} />
                            <TextField
                                name="billing.city"
                                fullWidth
                                value={_get(value, "billing.city")}
                                InputLabelProps={{ shrink: _get(value, "billing.city") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="City"
                                autoComplete="billing.city"
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "billing.zip")} touched={_get(touched, "billing.zip")} />
                            <TextField
                                name="billing.zip"
                                fullWidth
                                value={_get(value, "billing.zip")}
                                InputLabelProps={{ shrink: _get(value, "billing.zip") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="Zip"
                                autoComplete="billing.zip"
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
                                fullWidth
                                value={_get(value, "billing.countryid")}
                                InputLabelProps={{ shrink: _get(value, "billing.countryid") !== "" }}
                                onChange={onChange}
                                variant="outlined"
                                label="countryid"
                                autoComplete="billing.countryid"
                            >
                                {SalesLib.COUNTRY_MAP.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    );
                }}
            />
        </Grid>
    );
};

const styles = theme => ({
    container: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.up("md")]: {
            marginLeft: 50,
            marginRight: 50
        },
        [theme.breakpoints.up("lg")]: {
            marginLeft: 150,
            marginRight: 150
        },
        [theme.breakpoints.up("xl")]: {
            marginLeft: 250,
            marginRight: 250
        }
    },
    title: {
        backgroundColor: "#FF9933",
        padding: 5,
        marginBottom: theme.spacing.unit * 4,
        textAlign: "center",
        marginLeft: theme.spacing.unit * -4,
        marginRight: theme.spacing.unit * -4
    },
    buttonContainer: {
        display: "flex"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    }
});

Billing.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Billing);

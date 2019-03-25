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

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};

const Shipping = ({
    errors,
    classes,
}) => {
    return (
        <Grid item xs={12} md={5} container spacing={16} style={{ marginRight: 30, textAlign: "center" }}>
            <Grid item xs={12}>
                <Typography style={{ textAlign: "left" }} variant="h6" color="textPrimary">
                    SHIPPING INFORMATION
                </Typography>
                <div className={classes.sectionTitleDivider} />
            </Grid>

            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.attn")} />
                            <TextField
                                name="shipping.attn"
                                fullWidth
                                variant="outlined"
                                label="Attention"
                                autoComplete="shipping.attn"
                                onChange={onChange}
                                value={_get(value, "shipping.attn") || ''}

                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.addressee")} />
                            <TextField
                                name="shipping.addressee"
                                fullWidth
                                variant="outlined"
                                label="Addressee"
                                autoComplete="shipping.addressee"
                                onChange={onChange}
                                value={_get(value, "shipping.addressee") || ''}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.address1")} />
                            <TextField
                                name="shipping.address1"
                                fullWidth
                                variant="outlined"
                                label="Address 1"
                                autoComplete="shipping.address1"
                                onChange={onChange}
                                value={_get(value, "shipping.address1") || ''}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.address2")} />
                            <TextField
                                name="shipping.address2"
                                fullWidth
                                variant="outlined"
                                label="Address 2"
                                autoComplete="shipping.address2"
                                onChange={onChange}
                                value={_get(value, "shipping.address2") || ''}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.address3")} />
                            <TextField
                                name="shipping.address3"
                                fullWidth
                                variant="outlined"
                                label="Address 3"
                                autoComplete="shipping.address3"
                                onChange={onChange}
                                value={_get(value, "shipping.address3") || ''}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.city")} />
                            <TextField
                                name="shipping.city"
                                fullWidth
                                variant="outlined"
                                label="City"
                                autoComplete="shipping.city"
                                onChange={onChange}
                                value={_get(value, "shipping.city") || ''}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.zip")}  />
                            <TextField
                                name="shipping.zip"
                                fullWidth
                                variant="outlined"
                                label="Zip"
                                autoComplete="shipping.zip"
                                onChange={onChange}
                                value={_get(value, "shipping.zip")}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange } }) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "shipping.countryid")} />
                            <TextField
                                select
                                name="shipping.countryid"
                                fullWidth
                                InputLabelProps={{ shrink: _get(value, "shipping.countryid") !== "" }}
                                variant="outlined"
                                label="Country"
                                autoComplete="shipping.countryid"
                                onChange={onChange}
                                value={_get(value, "shipping.countryid") || ''}
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

Shipping.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Shipping);

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import { Formik, Form, Field } from "formik";
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from "lodash/isEmpty";

import SalesLib from "lib/SalesLib";

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};
class AddAddress extends Component {
    constructor(props) {
        super(props);
    }

    addAddress = (values, { setErrors }) => {
        let errors = this.validate(values);
        if(_isEmpty(errors)) {
            this.props.addAddress({ address: values });
            this.props.close();
        } else {
            setErrors(errors);
        }
    };

    validate = (values) => {

        var errors = {};

        if(!_get(values, 'attn')) {
            _set(errors, 'attn', 'Attention is required');
        }

        if(!_get(values, 'addressee')) {
            _set(errors, 'addressee', 'Addressee is required');
        }

        if(!_get(values, 'address1')) {
            _set(errors, 'address1', 'Address1 is required');
        }

        if(!_get(values, 'city')) {
            _set(errors, 'city', 'City is required');
        }

        if(!_get(values, 'zip')) {
            _set(errors, 'zip', 'Zip is required');
        }

        if(!_get(values, 'countryid')) {
            _set(errors, 'countryid', 'Country is required');
        }

        return errors;
    }

    render() {
        return (
            <React.Fragment>
                <Formik
                    onSubmit={(values, actions) => this.addAddress(values, actions)}
                    enableReinitialize
                >
                    {({ errors }) => {
                        return (
                            <Form>
                                <Grid container spacing={24}>
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'attn')} />
                                                    <TextField
                                                        name="attn"
                                                        label="Attention"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="attention"
                                                        onChange={onChange}
                                                        value={_get(value, 'attn') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'addressee')} />
                                                    <TextField
                                                        name="addressee"
                                                        label="Addressee"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="attention"
                                                        onChange={onChange}
                                                        value={_get(value, 'addressee') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'address1')} />
                                                    <TextField
                                                        name="address1"
                                                        label="Address1"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="address1"
                                                        onChange={onChange}
                                                        value={_get(value, 'address1') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'address2')} />
                                                    <TextField
                                                        name="address2"
                                                        label="Address2"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="address2"
                                                        onChange={onChange}
                                                        value={_get(value, 'address2') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'address3')} />
                                                    <TextField
                                                        name="address3"
                                                        label="Address3"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="address3"
                                                        onChange={onChange}
                                                        value={_get(value, 'address3') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'city')} />
                                                    <TextField
                                                        name="city"
                                                        label="City"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="city"
                                                        onChange={onChange}
                                                        value={_get(value, 'city') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'zip')} />
                                                    <TextField
                                                        name="zip"
                                                        label="Postal Code"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="zip"
                                                        onChange={onChange}
                                                        value={_get(value, 'zip') || ''}
                                                    />
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange }}) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, 'countryid')} />
                                                    <TextField
                                                        select
                                                        name="countryid"
                                                        label="Country"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="countryid"
                                                        onChange={onChange}
                                                        value={_get(value, 'countryid') || ''}
                                                    >
                                                        {SalesLib.COUNTRY_MAP.map((country) => (
                                                            <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                            )
                                        }}
                                    />
                                    <Grid style={{ marginTop: 10 }} container justify="flex-end">
                                        <Grid item>
                                            <Button style={{marginRight:'10px'}}variant="contained" color="primary" type="submit">
                                                Add Address
                                            </Button>
                                            <Button variant="contained" color="primary" onClick={()=>this.props.handleCancelAdd(false)} >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    addressBox: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    }
});

export default withStyles(styles)(AddAddress);

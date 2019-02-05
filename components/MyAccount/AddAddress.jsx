import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address1: "",
            address2: "",
            address3: "",
            addressee: "",
            attn: "",
            city: "",
            countryid: "",
            zip: "",
            focus: ""
        };
    }

    addAddress = () => {
        const { address } = this.state;
        this.props.addAddress({ address });
    };

    render() {
        const { classes } = this.props;
        const { address, focus } = this.state;
        const customFormValidation = Yup.object().shape({
            attn: Yup.string().required("Required"),
            address1: Yup.string().required("Required"),
            addressee: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            zip: Yup.number().required("Required"),
            countryid: Yup.string().required("Required")
        });
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        address1: address.address1,
                        address2: address.address2,
                        address3: address.address3,
                        addressee: address.addressee,
                        attn: address.attn,
                        city: address.city,
                        countryid: address.countryid,
                        zip: address.zip
                    }}
                    validationSchema={customFormValidation}
                    enableReinitialize
                    onSubmit={values => this.addAddress()}
                >
                    {({ errors, touched, isValidating }) => {
                        return (
                            <Form>
                                <Grid container spacing={24}>
                                    <Field
                                        name="attn"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="attention"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "attn",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                attn:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !== "attn"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "attn"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "attn"
                                                        }
                                                        name="attention"
                                                        label="Attention"
                                                        fullWidth
                                                        autoComplete="attention"
                                                    />
                                                    {errors.attn &&
                                                        touched.attn && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {errors.attn}
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="addressee"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="addresse"
                                                        name="addresse"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "addressee",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                addressee:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !==
                                                                "addressee"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "addressee"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "addressee"
                                                        }
                                                        label="Addresse"
                                                        fullWidth
                                                        autoComplete="addresse"
                                                    />
                                                    {errors.addressee &&
                                                        touched.addressee && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {
                                                                    errors.addressee
                                                                }
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="address1"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="address1"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "address1",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                address1:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !==
                                                                "address1"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "address1"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "address1"
                                                        }
                                                        name="address1"
                                                        label="Address line 1"
                                                        fullWidth
                                                        autoComplete="address-line1"
                                                    />
                                                    {errors.address1 &&
                                                        touched.address1 && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {
                                                                    errors.address1
                                                                }
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="address2"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="addiress2"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "address2",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                address2:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !==
                                                                "address2"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "address2"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "address2"
                                                        }
                                                        name="addiress2"
                                                        label="Address line 2"
                                                        fullWidth
                                                        autoComplete="address-line2"
                                                    />
                                                    {errors.address2 &&
                                                        touched.address2 && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {
                                                                    errors.address2
                                                                }
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="address3"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="addiress3"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "address3",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                address3:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !==
                                                                "address3"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "address3"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "address3"
                                                        }
                                                        name="addiress3"
                                                        label="Address line 3"
                                                        fullWidth
                                                        autoComplete="address-line3"
                                                    />
                                                    {errors.address3 &&
                                                        touched.address3 && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {
                                                                    errors.address3
                                                                }
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="city"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="city"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "city",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                city:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !== "city"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "city"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "city"
                                                        }
                                                        name="city"
                                                        label="City"
                                                        fullWidth
                                                        autoComplete="address-level2"
                                                    />
                                                    {errors.city &&
                                                        touched.city && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {errors.city}
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="zip"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "zip",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                zip:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (focus !== "zip")
                                                                this.setState({
                                                                    focus: "zip"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "zip"
                                                        }
                                                        id="zip"
                                                        name="zip"
                                                        label="Zip / Postal code"
                                                        fullWidth
                                                        autoComplete="postal-code"
                                                    />
                                                    {errors.zip &&
                                                        touched.zip && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {errors.zip}
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="countryid"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="country"
                                                        value={
                                                            props.field.value
                                                        }
                                                        onChange={e => {
                                                            props.form.setFieldValue(
                                                                "countryid",
                                                                e.target.value
                                                            );
                                                            this.setState({
                                                                countryid:
                                                                    e.target
                                                                        .value
                                                            });
                                                        }}
                                                        onFocus={e => {
                                                            if (
                                                                focus !==
                                                                "countryid"
                                                            )
                                                                this.setState({
                                                                    focus:
                                                                        "countryid"
                                                                });
                                                        }}
                                                        autoFocus={
                                                            focus == "countryid"
                                                        }
                                                        name="country"
                                                        label="Country"
                                                        fullWidth
                                                        autoComplete="country"
                                                    />
                                                    {errors.countryid &&
                                                        touched.countryid && (
                                                            <div
                                                                style={{
                                                                    color: "red"
                                                                }}
                                                            >
                                                                {
                                                                    errors.countryid
                                                                }
                                                            </div>
                                                        )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Grid
                                        style={{ marginTop: 10 }}
                                        container
                                        justify="flex-end"
                                    >
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                onClick={this.addAddress}
                                            >
                                                Add Address
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

AddAddress.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddAddress);

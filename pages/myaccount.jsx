import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { bindActionCreators } from "redux";
import _isEmpty from "lodash/isEmpty";

import PropTypes from "prop-types";
import Link from "next/link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import CardHeader from "components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarUserSearchDrawerLayout from "components/NavBar/NavBarUserSearchDrawerLayout";
import PageContainer from "components/UI/PageContainer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from "formik";
import _get from "lodash/get";
import _extend from "lodash/extend";

import ManageShipping from "components/MyAccount/ManageShipping";
import ManageBilling from "components/MyAccount/ManageBilling";
import ManageCards from "components/MyAccount/ManageCards";
import LoadingIndicator from "components/UI/LoadingIndicator";
import Shipping from "components/MyAccount/Shipping";
import Billing from "components/MyAccount/Billing";
import Cleave from "cleave.js/react";

import { userActions } from "appRedux/actions/userActions";
import WLHelper from "lib/WLHelper";
import isLoggedUser from "hocs/isLoggedUser";
import Utils from "lib/Utils";

const FormikErrorMessage = ({ error, touched }) => {
    if (touched && error) {
        return <div className="error">{error}</div>;
    } else {
        return null;
    }
};

function PhoneMaskedTextField(props) {
    let { options, onChange, inputRef,value, ...other } = props;
    options={phone: true, phoneRegionCode: 'US'};
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} value={value}/>;
}

class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manageShipping: false,
            manageBilling: false,
            manageCards: false,
            shipFrom: 1,
            confirmDialog: false,
            focus: ""
        };
    }

    createDialogContent = shipFrom => {
        let newAccount;
        switch (shipFrom) {
            case -2:
                newAccount = "USA";
                break;
            case -5:
                newAccount = "Hong Kong";
                break;
            case -7:
                newAccout = "Copenhagen";
                break;
            default:
                return;
        }

        return (
            <Dialog open={this.state.confirmDialog}>
                <DialogTitle id="alert-dialog-title">{`Do you wish to create a new WL ${newAccount} Account?`}</DialogTitle>
                <DialogActions>
                    <Button onClick={this.closeConfirmDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={this.closeConfirmDialog} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    selectAccount = e => {
        this.setState({
            subsidiary: e.target.value
        });
    };

    manageShipping = () => {
        this.setState({ manageShipping: true });
    };

    closeShipping = () => {
        this.setState({ manageShipping: false });
    };

    manageBilling = () => {
        this.setState({ manageBilling: true });
    };

    closeBilling = () => {
        this.setState({ manageBilling: false });
    };

    manageCards = () => {
        this.setState({ manageCards: true });
    };

    closeCards = () => {
        this.setState({ manageCards: false });
    };

    handleShipFrom = event => {
        this.setState({ shipFrom: event.target.value });
        if (event.target.value > 0) {
            this.setState({ confirmDialog: true });
        }
    };

    closeConfirmDialog = () => {
        this.setState({ confirmDialog: false });
    };

    handleSubmit = (values, { setErrors }) => {

        const errors = this.validate(values);
        if (_isEmpty(errors)) {
            const request = buildRequest(this.props.user, values);
            this.props.updateUserInfo({ request });
        } else {
            setErrors(errors);
        }
    };

    buildRequest = (oldState, newState) => {
        var request = {};

        if (newState.email !== oldState.email) {
            request.email = newState.email;
        }
        
        if (newState.phone !== oldState.phone) {
            request.phone = newState.phone;
        }

        if (newState.currency != oldState.currency) {
            request.currency = newState.currency;
        }

        if (newState.vat != oldState.vat) {
            request.vat = newState.vat;
        }

        if (newState.shipmethod != oldState.shipmethod) {
            request.shipmethod = newState.shipmethod;
        }

        if (newState.orderFrom != oldState.orderFrom) {
            request.orderFrom = newState.orderFrom;
        }

        if(!_isEqual(newState.shipping, oldState.shipping)) {
            request.shipping = {};
            request.shipChange = true;
            request.shipping = Object.assign({}, newState.shipping);
        }

        if(!_isEqual(newState.billing, oldState.billing)) {
            request.billing = {};
            request.billChange = true;
            request.billing = Object.assign({}, newState.billing);
        }

        return request;
    }

    validate = values => {
        
        var errors = {};

        if (!values.email) {
            Utils.addProps(errors, "email", "Email is required");
        } else if (reg.test(values.email) === false) {
            Utils.addProps(errors, "email", "Enter a valid email");
        }

        if (!values.phone) {
            Utils.addProps(errors, "phone", "Phone is required");
        }

        if (!values.orderFrom) {
            Utils.addProps(errors, "orderFrom", "Enter a subsidiary to order from");
        }

        if (!_get(values, "shipping.attn")) {
            Utils.addProps(errors, "shipping.attn", "Attention is required");
        }

        if (!_get(values, "shipping.addressee")) {
            Utils.addProps(errors, "shipping.addressee", "Addressee is required");
        }

        if (!_get(values, "shipping.address1")) {
            Utils.addProps(errors, "shipping.address1", "Address1 is required");
        }

        if (!_get(values, "shipping.city")) {
            Utils.addProps(errors, "shipping.city", "City is required");
        }

        if (!_get(values, "shipping.zip")) {
            Utils.addProps(errors, "shipping.zip", "Zip code is required");
        }

        if (!_get(values, "shipping.countryid")) {
            Utils.addProps(errors, "shipping.countryid", "Country is required");
        }

        if (!_get(values, "billing.attn")) {
            Utils.addProps(errors, "billing.attn", "Attention is required");
        }

        if (!_get(values, "billing.addressee")) {
            Utils.addProps(errors, "billing.addressee", "Addressee is required");
        }

        if (!_get(values, "billing.address1")) {
            Utils.addProps(errors, "billing.address1", "Address1 is required");
        }

        if (!_get(values, "billing.city")) {
            Utils.addProps(errors, "billing.city", "City is required");
        }

        if (!_get(values, "billing.zip")) {
            Utils.addProps(errors, "billing.zip", "Zip code is required");
        }

        if (!_get(values, "billing.countryid")) {
            Utils.addProps(errors, "billing.countryid", "Country is required");
        }

        return errors;
    }

    render() {
        const {
            classes,
            user: { 
                id,
                shipping, 
                billing, 
                email, 
                phone, 
                shipFrom, 
                isLoading, 
                subsidiaryOptions 
            }
        } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <PageContainer heading="MY ACCOUNT" id="cart-box">
                    <LoadingIndicator visible={isLoading} label="Updating Account Info" />
                    <Formik
                        initialValues={{
                            shipping: {
                                attn: shipping.attn,
                                addressee: shipping.addressee,
                                address1: shipping.address1,
                                address2: shipping.address2,
                                address3: shipping.address3,
                                city: shipping.city,
                                zip: shipping.zip,
                                countryid: shipping.countryid
                            },
                            billing: {
                                attn: billing.attn,
                                addressee: billing.addressee,
                                address1: billing.address1,
                                address2: billing.address2,
                                address3: billing.address3,
                                zip: billing.zip,
                                city: billing.city,
                                countryid: billing.countryid
                            },
                            email: email,
                            phone: phone,
                            shipFrom: shipFrom,
                        }}
                        enableReinitialize
                        onSubmit={(values, actions) => {
                            this.handleSubmit(values, actions);
                        }}
                    >
                        {props => {
                            const { errors, touched } = this.props;

                            return (
                                <Form>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} container justify="center" alignItems="center" spacing={24} style={{ marginBottom: 20 }}>
                                            <Grid item xs={3}>
                                                <Typography style={{ textAlign: "center" }} variant="title" gutterBottom>
                                                    Account # {id}
                                                </Typography>
                                            </Grid>
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "email")} touched={_get(touched, "email")} />
                                                            <TextField
                                                                value={value=_get(value, "email")}
                                                                InputLabelProps={{ shrink: value=_get(value, "email") !== "" }}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="email"
                                                                label="Email"
                                                                autoComplete="email"
                                                            />
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "phone")} touched={_get(touched, "phone")} />
                                                            <TextField
                                                                value={value=_get(value, "phone")}
                                                                InputLabelProps={{ shrink: _get(value, "phone") !== "" }}
                                                                InputProps={{
                                                                    inputComponent: PhoneMaskedTextField
                                                                }}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="phone"
                                                                label="Phone"
                                                                autoComplete="phone"
                                                            />
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "shipFrom")} touched={_get(touched, "shipFrom")} />
                                                            <TextField
                                                                select
                                                                value={_get(value, "shipFrom")}
                                                                InputLabelProps={{ shrink: _get(value, "shipFrom") !== "" }}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="shipFrom"
                                                                label="Ship From"
                                                                autoComplete="shipFrom"
                                                            >
                                                                {subsidiaryOptions.map((option, i) => {
                                                                    var label = WLHelper.getSubsidiaryLabel(option);
                                                                    return <MenuItem value={option}>{label}</MenuItem>;
                                                                })}
                                                            </TextField>
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "currency")} touched={_get(touched, "currency")} />
                                                            <TextField
                                                                select
                                                                value={_get(value, "currency")}
                                                                InputLabelProps={{ shrink: _get(value, "currency") !== "" }}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="currency"
                                                                label="Currency"
                                                                autoComplete="currency"
                                                            >
                                                                <MenuItem>Dollar</MenuItem>
                                                                <MenuItem>EUR</MenuItem>
                                                                <MenuItem>DDK</MenuItem>
                                                            </TextField>
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "vat")} touched={_get(touched, "vat")} />
                                                            <TextField
                                                                value={_get(value, "vat")}
                                                                InputLabelProps={{ shrink: _get(value, "vat") !== "" }}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="vat"
                                                                label="Vat"
                                                                autoComplete="vat"
                                                            />
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Grid item xs={12} container justify="center" alignItems="center" spacing={24} style={{ marginBottom: 20 }}>
                                                <Shipping {...props} />
                                                <Billing {...props} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <div className={classes.buttonContainer}>
                                        <Button variant="contained" color="primary" type="submit" className={classes.button}>
                                            Confirm Account Changes
                                        </Button>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>

                    <Dialog open={this.state.manageShipping} maxWidth={"md"} fullWidth>
                        <ManageShipping closeDialog={this.closeShipping} />
                    </Dialog>

                    <Dialog open={this.state.manageBilling} maxWidth={"md"} fullWidth>
                        <ManageBilling closeDialog={this.closeBilling} />
                    </Dialog>

                    <Dialog open={this.state.manageCards} maxWidth={"md"} fullWidth>
                        <ManageCards closeDialog={this.closeCards} />
                    </Dialog>
                    {this.createDialogContent(this.state.shipFrom)}
                </PageContainer>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

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

MyAccount.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(compose(withStyles(styles, { withTheme: true })(isLoggedUser(MyAccount))));

import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { bindActionCreators } from "redux";
import _isEmpty from "lodash/isEmpty";
import _set from "lodash/set"
import _get from "lodash/get";

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

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
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
            subsidiaryDialog: false,
            focus: ""
        };
    }

    handleYes = (action) => {
        action();
        this.setState({ subsidiaryDialog: false });
    }


    handleNo = () => {
        this.setState({ subsidiaryDialog: false });
    };

    getSubsidiaryDialog = subsidiary => {
        let account, action, question;
        switch (subsidiary) {
            case -2:
            case 2:
                account = "USA";
                break;
            case -5:
            case 5:
                account = "Hong Kong";
                break;
            case -7:
            case 7:
                account = "Copenhagen";
                break;
            default:
                return;
        }

        if (subsidiary < 0) {
            question = `Are you sure you want to create a new WL ${account} Acount?`;
            action = () => this.props.addSubsidiary({subsidiary});

        } else {
            question = `Do you want switch to WL ${account}?`;
            action = () => this.props.changeSubsidiary({subsidiary});
        }

        return (
            <Dialog open={this.state.subsidiaryDialog}>
                <DialogTitle id="alert-dialog-title">{question}</DialogTitle>
                <DialogActions>
                    <Button onClick={this.handleNo} color="primary">
                        No
                    </Button>
                    <Button onClick={() => this.handleYes(action)} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        );
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

    switchSubsidiary = e => {
        this.setState({ orderFrom: e.target.value, subsidiaryDialog: true });
    }

    handleorderFrom = event => {
        this.setState({ orderFrom: event.target.value });
        if (event.target.value > 0) {
            this.setState({ confirmDialog: true, subsidiaryDialog: true });
        }
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
            request.defaultShipAddress = true;
            request.address = Object.assign({}, newState.shipping);
        }

        if(!_isEqual(newState.billing, oldState.billing)) {
            request.billing = {};
            request.defaultBillAddress = true;
            request.address = Object.assign({}, newState.billing);
        }

        return request;
    }

    validate = values => {
        var errors = {};

        if (!values.email) {
            _set(errors, 'email', 'Email is required');
        } else if (!Utils.isValidEmail(values.email)) {
            _set(errors, 'email', 'Enter a valid email');
        }

        if(!values.vat) {
            _set(errors, 'vat', 'Vat is required');
        } else if (!Utils.isValidVat(values.vat)) {
            _set(errors, 'vat', 'Enter a valid vat');
        }

        if (!values.phone) {
            _set(errors, 'phone', 'Phone is required');
        }

        if (!values.orderFrom) {
            _set(errors, 'orderFrom', 'Enter a subsidiary to order from');
        }

        if(!values.shipmethod) {
            _set(errors, 'shipmethod', 'Ship method is required');
        }

        if (!_get(values, 'shipping.attn')) {
            _set(errors, 'shipping.attn', 'Attention is required');
        }

        if (!_get(values, 'shipping.addressee')) {
            _set(errors, 'shipping.addressee', 'Addressee is required');
        }

        if (!_get(values, 'shipping.address1')) {
            _set(errors, 'shipping.address1', 'Address1 is required');
        }

        if (!_get(values, 'shipping.city')) {
            _set(errors, 'shipping.city', 'City is required');
        }

        if (!_get(values, 'shipping.zip')) {
            _set(errors, 'shipping.zip', 'Postal code is required');
        }

        if (!_get(values, 'shipping.countryid')) {
            _set(errors, 'shipping.countryid', 'Country is required');
        }

        if (!_get(values, 'billing.attn')) {
            _set(errors, 'billing.attn', 'Attention is required');
        }

        if (!_get(values, 'billing.addressee')) {
            _set(errors, 'billing.addressee', 'Addressee is required');
        }

        if (!_get(values, 'billing.address1')) {
            _set(errors, 'billing.address1', 'Address1 is required');
        }

        if (!_get(values, 'billing.city')) {
            _set(errors, 'billing.city', 'City is required');
        }

        if (!_get(values, 'billing.zip')) {
            _set(errors, 'billing.zip', 'Postal code is required');
        }

        if (!_get(values, 'billing.countryid')) {
            _set(errors, 'billing.countryid', 'Country is required');
        }

        return errors;
    }

    render() {
        const {
            classes,
            user: {
                subsidiary,
                shipmethod,
                shipping,
                billing,
                email,
                phone,
                isLoading,
                subsidiaryOptions,
                currencyOptions
            }
        } = this.props;

        const {
            manageShipping,
            manageBilling,
            manageCards,
            orderFrom
        } = this.state;

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
                            orderFrom: subsidiary,
                            shipmethod: shipmethod
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
                                                    Account # {this.props.user.id}
                                                </Typography>
                                            </Grid>
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "email")} />
                                                            <TextField
                                                                name="email"
                                                                variant="outlined"
                                                                label="Email"
                                                                autoComplete="email"
                                                                onChange={onChange}
                                                                value={value=_get(value, "email") || ''}
                                                            />
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "phone")} />
                                                            <TextField
                                                                name="phone"
                                                                InputProps={{ inputComponent: PhoneMaskedTextField }}
                                                                variant="outlined"
                                                                label="Phone"
                                                                autoComplete="phone"
                                                                onChange={onChange}
                                                                value={value=_get(value, "phone") || ''}
                                                            />
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "orderFrom")} />
                                                            <TextField
                                                                select
                                                                name="orderFrom"
                                                                variant="outlined"
                                                                label="Order From"
                                                                autoComplete="orderFrom"
                                                                onChange={this.switchSubsidiary}
                                                                value={_get(value, "orderFrom") || ''}
                                                            >
                                                                {subsidiaryOptions.map(option => {
                                                                    var label = WLHelper.getSubsidiaryLabel(option);
                                                                    return <MenuItem value={option}>{label}</MenuItem>;
                                                                })}
                                                            </TextField>
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            {!_isEmpty(currencyOptions) && (
                                                <Field
                                                    render={({ field: { value, onChange }}) => {
                                                        return (
                                                            <Grid item xs={3}>
                                                                <FormikErrorMessage error={_get(errors, "currency")} />
                                                                <TextField
                                                                    select
                                                                    name="currency"
                                                                    variant="outlined"
                                                                    label="Currency"
                                                                    autoComplete="currency"
                                                                    onChange={onChange}
                                                                    value={_get(value, "currency") || ''}
                                                                >
                                                                    {currencyOptions.map(option => {
                                                                        <MenuItem value={option.id}>{option.name}</MenuItem>
                                                                    })}
                                                                </TextField>
                                                            </Grid>
                                                        );
                                                    }}
                                                />
                                            )}
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "vat")} />
                                                            <TextField
                                                                placeholder="US-123456"
                                                                value={_get(value, "vat")}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="vat"
                                                                variant="outlined"
                                                                label="Vat"
                                                                autoComplete="vat"
                                                                onChange={onChange}
                                                                value={_get(value, "vat") || ''}
                                                            />
                                                        </Grid>
                                                    );
                                                }}
                                            />
                                            <Field
                                                render={({ field: { value, onChange }}) => {
                                                    return (
                                                        <Grid item xs={3}>
                                                            <FormikErrorMessage error={_get(errors, "shipmethod")} />
                                                            <TextField
                                                                select
                                                                value={_get(value, "shipmethod")}
                                                                InputLabelProps={{ shrink: _get(value, "shipmethod") !== "" }}
                                                                onChange={onChange}
                                                                variant="outlined"
                                                                name="shipmethod"
                                                                variant="outlined"
                                                                label="shipmethod"
                                                                autoComplete="shipmethod"
                                                                onChange={onChange}
                                                                value={_get(value, "shipmethod") || ''}
                                                            >
                                                                {this.props.user.shipMethods.map(method => (
                                                                    <MenuItem key={method.NSID} value={method.NSID}>
                                                                        {method.Name}
                                                                    </MenuItem>
                                                                ))}
                                                            </TextField>
                                                        </Grid>
                                                    );
                                                }}
                                            />

                                            <Grid item xs={12} container justify="center" alignItems="center" spacing={24} style={{ marginBottom: 20 }}>

                                                <Shipping {...props} />
                                                <Billing {...props} />

                                                <Grid item xs={12} md={4} container justify="center" alignItems="center">
                                                    <Button
                                                        onClick={this.manageShipping}
                                                        variant="outlined" color="primary"
                                                        className={classes.modalbtn}
                                                    >
                                                        Manage Shipping Addresses
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} md={4} container justify="center" alignItems="center">
                                                    <Button
                                                        style={{ marginTop: 10 }}
                                                        variant="outlined" color="primary"
                                                        onClick={this.manageBilling}
                                                    >
                                                        Manage Billing Addresses
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} md={4} container justify="center" alignItems="center">
                                                    <Button
                                                        variant="outlined" color="primary"
                                                        className={classes.modalbtn}
                                                        onClick={this.manageCards}
                                                    >
                                                        Manage Cards
                                                    </Button>
                                                </Grid>
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

                    <Dialog open={manageShipping} maxWidth={"md"} fullWidth>
                        <ManageShipping closeDialog={this.closeShipping} />
                    </Dialog>

                    <Dialog open={manageBilling} maxWidth={"md"} fullWidth>
                        <ManageBilling closeDialog={this.closeBilling} />
                    </Dialog>

                    <Dialog open={manageCards} maxWidth={"md"} fullWidth>
                        <ManageCards closeDialog={this.closeCards} />
                    </Dialog>

                    {this.getSubsidiaryDialog(orderFrom)}

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
    modalbtn:{
        marginTop: 10, marginLeft: 16
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

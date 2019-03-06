import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { bindActionCreators } from "redux";
import _isEmpty from 'lodash/isEmpty';

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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import ManageShipping from "components/MyAccount/ManageShipping";
import ManageBilling from "components/MyAccount/ManageBilling";
import ManageCards from "components/MyAccount/ManageCards";
import LoadingIndicator from 'components/UI/LoadingIndicator';
import Util from 'lib/Utils';

import { userActions } from 'appRedux/actions/userActions';
import { changesWereMade } from 'lib/UserUtils';
import WLHelper from 'lib/WLHelper';
import isLoggedUser from "hocs/isLoggedUser";

class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manageShipping: false,
            manageBilling: false,
            manageCards: false,
            shipFrom: 1,
            confirmDialog: false,
            shipping: {},
            billing: {},
            focus:'',
        };
    }

    createDialogContent = (shipFrom) => {

        let newAccount;
        switch(shipFrom){
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
                <DialogTitle id="alert-dialog-title">
                    {`Do you wish to create a new WL ${newAccount} Account?`}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={this.closeConfirmDialog}
                        color="primary"
                    >
                        No
                    </Button>
                    <Button
                        onClick={this.closeConfirmDialog}
                        color="primary"
                        autoFocus
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    componentDidMount() {

        const { user } = this.props;
        const { id, email, phone, shipping, billing, subsidiaryOptions, subsidiary } = user;
        this.setState({
            id,
            email,
            phone,
            shipping,
            billing,
            shipFrom: subsidiaryOptions[0],
            subsidiaryOptions,
            subsidiary,
        });
    }

    componentWillUnmount() {
        const { user: { id, email, phone, shipping, billing, card, subsidiary, subsidiaryOptions }} = this.props;
        const isShippingDiff = Util.checkDifference(shipping,this.state.shipping);
        const isBillingDiff = Util.checkDifference( billing, this.state.billing);
        if( email != this.state.email || phone != this.state.phone || subsidiary != this.state.shipFrom || isShippingDiff || isBillingDiff ) {
            this.props.unsavedUserInfo()
        }
    }

    selectAccount = (e) => {
        this.setState({
            subsidiary : e.target.value
        })
    }

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

    handleSubmit = () => {
        const { user } = this.props;
        try {
            var request = changesWereMade(this.state, this.props.user);
            if(!_isEmpty(request)) {
                this.props.updateUserInfo({request});
                this.props.getUserInfo({
                    userID: user.id
                })
            }
            else {
                throw { message: 'Empty request. Cannot update user information', code: 0 };
            }
        }
        catch(error) {
            // this.props.displayError();
        }
    }

    render() {
        const { classes, user } = this.props;
        const { focus } = this.state;
        const customFormValidation = Yup.object().shape({
            shippingAttn: Yup.string()
            .required('Required'),
            shippingAddress1: Yup.string()
            .required('Required'),
            shippingAddressee: Yup.string()
            .required('Required'),
            shippingCity: Yup.string()
            .required('Required'),
            shippingZip: Yup.number()
            .required('Required'),
            shippingCountryid: Yup.string()
            .required('Required'),

            billingAttn: Yup.string()
            .required('Required'),
            billingAddress1: Yup.string()
            .required('Required'),
            billingAddressee: Yup.string()
            .required('Required'),
            billingCity: Yup.string()
            .required('Required'),
            billingZip: Yup.number()
            .required('Required'),
            billingCountryid: Yup.string()
            .required('Required'),

            phone: Yup.number()
            .required('Required'),
            email: Yup.string()
            .email('Must Be Email')
            .required('Required'),
        });
        return (
            <NavBarUserSearchDrawerLayout>
                <PageContainer heading="MY ACCOUNT" id="cart-box">
                <LoadingIndicator visible={this.props.user.isUpdating} label={"Updating Data"} />
                <LoadingIndicator visible={this.props.user.isLoading} label={"Fetching Data"} />
                <Formik
                  initialValues={{
                        //shipping
                            shippingAddress1: this.state.shipping.address1,
                            shippingAddress2: this.state.shipping.address2,
                            shippingAddress3: this.state.shipping.address3,
                            shippingAddressee: this.state.shipping.addressee,
                            shippingAttn: this.state.shipping.attn,
                            shippingCity: this.state.shipping.city,
                            shippingZip: this.state.shipping.zip,
                            shippingCountryid: this.state.shipping.countryid,

                        // Billing
                            billingAddress1: this.state.billing.address1,
                            billingAddress2: this.state.billing.address2,
                            billingAddress3: this.state.billing.address3,
                            billingAddressee: this.state.billing.addressee,
                            billingAttn: this.state.billing.attn,
                            billingZip: this.state.billing.zip,
                            billingCity: this.state.billing.city,
                            billingCountryid: this.state.billing.countryid,

                        //user
                            email:  this.state.email,
                            phone:  this.state.phone,
                            shipFrom: this.state.shipFrom,
                    }}
                    validationSchema={customFormValidation}
                    validate={( values, props) => {
                        // add more validation which will execute before submit
                        let errors={};
                        let billZipValidate = WLHelper.validateZipCode(values.billingZip,values.billingCountryid)
                        let shipZipValidate = WLHelper.validateZipCode(values.shippingZip,values.shippingCountryid)
                        // if(!billZipValidate){
                        //     errors.billingZip = 'MUST BE VALID ZIP CODE'
                        // }
                        // if(!shipZipValidate){
                        //     errors.shippingZip = "MUST BE VALID ZIP CODE"
                        // }
                        return errors
                    } }
                    enableReinitialize
                    onSubmit={ values => this.handleSubmit()}
                >
                {({ errors, touched, isValidating }) => {
                    return(
                        <Form>
                    <Grid container spacing={24}>
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    justify="center"
                                    alignItems="center"
                                    spacing={24}
                                    style={{ marginBottom: 20 }}
                                >
                                    <Grid item xs={3}>
                                        <Typography
                                            style={{ textAlign: "center" }}
                                            variant="title"
                                            gutterBottom
                                        >
                                            Account # {this.state.id}
                                        </Typography>
                                    </Grid>
                                    <Field
                                        name="email"
                                        component={(props)=>{
                                        return(
                                            <Grid item xs={3}>
                                                <TextField
                                                    value={props.field.value}
                                                    InputLabelProps={{ shrink: props.field.value !== '' }}
                                                    onChange={e => { props.form.setFieldValue('email',e.target.value); this.setState({email: e.target.value})}}
                                                    variant="outlined"
                                                    onFocus={e => {
                                                        if (focus !== 'email')
                                                        this.setState({
                                                            focus : 'email'
                                                        })
                                                    }}
                                                    autoFocus={ focus == 'email' }
                                                    id="email"
                                                    name="email"
                                                    label="Email"
                                                    autoComplete="email"
                                                />
                                            </Grid>
                                        )
                                        }}
                                    />
                                    {errors.email && touched.email && <div style={{color:'red'}} >{errors.email}</div>}
                                    <Field
                                        name="phone"
                                        component={(props)=>{
                                        return(
                                            <Grid item xs={3}>
                                                <TextField
                                                    value={props.field.value}
                                                    InputLabelProps={{ shrink: props.field.value !== '' }}
                                                    onChange={e => { props.form.setFieldValue('phone',e.target.value); this.setState({phone: e.target.value})}}
                                                    variant="outlined"
                                                    onFocus={e => {
                                                        if (focus !== 'phone')
                                                        this.setState({
                                                            focus : 'phone'
                                                        })
                                                    }}
                                                    autoFocus={ focus == 'phone' }
                                                    id="phone"
                                                    name="phone"
                                                    label="Phone"
                                                    autoComplete="phone"
                                                />
                                            </Grid>
                                        )
                                        }}
                                    />
                                    {errors.phone && touched.phone && <div style={{color:'red'}} >{errors.phone}</div>}
                                    <Field
                                        name="shipFrom"
                                        component={(props)=>{
                                        return(
                                            <Grid item xs={3}>
                                                <TextField
                                                    variant="outlined"
                                                    id="select-shipfrom"
                                                    select
                                                    onFocus={e => {
                                                        if (focus !== 'shipFrom')
                                                        this.setState({
                                                            focus : 'shipFrom'
                                                        })
                                                    }}
                                                    fullWidth
                                                    onChange={e => {props.form.setFieldValue('shipFrom',e.target.value); this.handleShipFrom(e)}}
                                                    value={props.field.value}
                                                    label="Ship From"
                                                >
                                                    {user.subsidiaryOptions.map((option, i) =>{
                                                        var label = WLHelper.getSubsidiaryLabel(option);
                                                        return (
                                                        <MenuItem value={option}>{label}</MenuItem>
                                                    )})}
                                                </TextField>
                                            </Grid>
                                        )
                                        }}
                                    />
                                    {errors.shipFrom && touched.shipFrom && <div style={{color:'red'}} >{errors.shipFrom}</div>}
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            id="select-currency"
                                            select
                                            style={{width:'71%'}}
                                            label="Currency"
                                            >
                                                <MenuItem>Dollar</MenuItem>
                                                <MenuItem>Euros</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            variant="outlined"
                                            id="vat"
                                            name="vat"
                                            label="VAT"
                                            autoComplete="vat"
                                        />
                                    </Grid>
                                </Grid>

                        <Grid item container justify="center">

                            <Grid
                                item
                                xs={12}
                                md={5}
                                container
                                style={{ marginRight: 30, textAlign: "center" }}
                            >
                                <Grid item xs={12}>
                                    <Typography
                                        style={{ textAlign: "left" }}
                                        variant="h6"
                                        color="textPrimary"
                                    >
                                        SHIPPING INFORMATION
                                    </Typography>

                                    <div
                                        className={classes.sectionTitleDivider}
                                    />
                                </Grid>
                                <Field
                                    name="shippingAttn"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                onChange={e => { props.form.setFieldValue('shippingAttn',e.target.value); this.setState({shipping: {...this.state.shipping, attn: e.target.value}})}}
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shippingAttn')
                                                    this.setState({
                                                        focus : 'shippingAttn'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingAttn' }
                                                id="attention"
                                                name="attn"
                                                label="Attention"
                                                fullWidth
                                                autoComplete="attention"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingAttn && touched.shippingAttn && <div style={{color:'red'}} >{errors.shippingAttn}</div>}
                                <Field
                                    name="shippingAddressee"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('shippingAddressee',e.target.value); this.setState({shipping: {...this.state.shipping, addressee: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'shippingAddressee')
                                                    this.setState({
                                                        focus : 'shippingAddressee'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingAddressee' }
                                                id="addressee"
                                                name="addressee"
                                                label="Addressee"
                                                fullWidth
                                                autoComplete="addressee"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingAddressee && touched.shippingAddressee && <div style={{color:'red'}} >{errors.shippingAddressee}</div>}
                                <Field
                                    name="shippingAddress1"
                                    component={(props)=>{
                                    return(
                                    <Grid item xs={12}>
                                        <TextField
                                            value={props.field.value}
                                            InputLabelProps={{ shrink: props.field.value !== '' }}
                                            onChange={e => { props.form.setFieldValue('shippingAddress1',e.target.value); this.setState({shipping: {...this.state.shipping, address1: e.target.value}})}}
                                            onFocus={e => {
                                                if (focus !== 'shippingAddress1')
                                                this.setState({
                                                    focus : 'shippingAddress1'
                                                })
                                            }}
                                            autoFocus={ focus == 'shippingAddress1' }
                                            id="address1"
                                            name="address1"
                                            label="Address line 1"
                                            fullWidth
                                            autoComplete="address-line1"
                                        />
                                    </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingAddress1 && touched.shippingAddress1 && <div style={{color:'red'}} >{errors.shippingAddress1}</div>}
                                <Field
                                    name="shippingAddress2"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('shippingAddress2',e.target.value); this.setState({shipping: {...this.state.shipping, address2: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'shippingAddress2')
                                                    this.setState({
                                                        focus : 'shippingAddress2'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingAddress2' }
                                                id="address2"
                                                name="address2"
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingAddress2 && touched.shippingAddress2 && <div style={{color:'red'}} >{errors.shippingAddress2}</div>}
                                <Field
                                    name="shippingAddress3"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('shippingAddress3',e.target.value); this.setState({shipping: {...this.state.shipping, address3: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'shippingAddress3')
                                                    this.setState({
                                                        focus : 'shippingAddress3'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingAddress3' }
                                                id="address3"
                                                name="address3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingAddress3 && touched.shippingAddress3 && <div style={{color:'red'}} >{errors.shippingAddress3}</div>}
                                <Field
                                    name="shippingCity"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('shippingCity',e.target.value); this.setState({shipping: {...this.state.shipping, city: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'shippingCity')
                                                    this.setState({
                                                        focus : 'shippingCity'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingCity' }
                                                id="city"
                                                name="city"
                                                label="City"
                                                fullWidth
                                                autoComplete="address-level2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingCity && touched.shippingCity && <div style={{color:'red'}} >{errors.shippingCity}</div>}
                                <Field
                                    name="shippingZip"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('shippingZip',e.target.value); this.setState({shipping: {...this.state.shipping, zip: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'shippingZip')
                                                    this.setState({
                                                        focus : 'shippingZip'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingZip' }
                                                id="zip"
                                                type='number'
                                                name="zip"
                                                label="Zip / Postal code"
                                                fullWidth
                                                autoComplete="postal-code"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingZip && touched.shippingZip && <div style={{color:'red'}} >{errors.shippingZip}</div>}
                                <Field
                                    name="shippingCountryid"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value != '' }}
                                                onChange={e => { props.form.setFieldValue('shippingCountryid',e.target.value); this.setState({shipping: {...this.state.shipping, countryid: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'shippingCountryid')
                                                    this.setState({
                                                        focus : 'shippingCountryid'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shippingCountryid' }
                                                id="country"
                                                name="countryid"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.shippingCountryid && touched.shippingCountryid && <div style={{color:'red'}} >{errors.shippingCountryid}</div>}
                                <Grid item xs={12}>
                                    <Button
                                        onClick={this.manageShipping}
                                        variant="outlined" color="primary"
                                        style={{ marginTop: 10 }}
                                    >
                                        Manage Shipping Addresses
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={5}
                                container
                                style={{ marginLeft: 30, textAlign: "center" }}
                            >
                                <Grid item xs={12}>
                                    <Typography
                                        style={{ textAlign: "left" }}
                                        variant="h6"
                                        color="textPrimary"
                                    >
                                        BILLING INFORMATION
                                    </Typography>

                                    <div
                                        className={classes.sectionTitleDivider}
                                    />
                                </Grid>
                                <Field
                                    name="billingAttn"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value != '' }}
                                                onChange={e => { props.form.setFieldValue('billingAttn',e.target.value); this.setState({billing: {...this.state.billing, attn: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingAttn')
                                                    this.setState({
                                                        focus : 'billingAttn'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingAttn' }
                                                id="attention"
                                                name="attn"
                                                label="Attention"
                                                fullWidth
                                                autoComplete="attention"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingAttn && touched.billingAttn && <div style={{color:'red'}} >{errors.billingAttn}</div>}
                                <Field
                                    name="billingAddressee"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('billingAddressee',e.target.value); this.setState({billing: {...this.state.billing, addressee: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingAddressee')
                                                    this.setState({
                                                        focus : 'billingAddressee'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingAddressee' }
                                                id="addressee"
                                                name="addressee"
                                                label="Addressee"
                                                fullWidth
                                                autoComplete="addressee"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingAddressee && touched.billingAddressee && <div style={{color:'red'}} >{errors.billingAddressee}</div>}
                                <Field
                                    name="billingAddress1"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('billingAddress1',e.target.value); this.setState({billing: {...this.state.billing, address1: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingAddress1')
                                                    this.setState({
                                                        focus : 'billingAddress1'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingAddress1' }
                                                id="address1"
                                                name="address1"
                                                label="Address line 1"
                                                fullWidth
                                                autoComplete="address-line1"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingAddress1 && touched.billingAddress1 && <div style={{color:'red'}} >{errors.billingAddress1}</div>}
                                <Field
                                    name="billingAddress2"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('billingAddress2',e.target.value); this.setState({billing: {...this.state.billing, address2: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingAddress2')
                                                    this.setState({
                                                        focus : 'billingAddress2'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingAddress2' }
                                                id="address2"
                                                name="address2"
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingAddress2 && touched.billingAddress2 && <div style={{color:'red'}} >{errors.billingAddress2}</div>}
                                <Field
                                    name="billingAddress3"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('billingAddress3',e.target.value); this.setState({billing: {...this.state.billing, address3: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingAddress3')
                                                    this.setState({
                                                        focus : 'billingAddress3'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingAddress3' }
                                                id="address3"
                                                name="address3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />

                                {errors.billingAddress3 && touched.billingAddress3 && <div style={{color:'red'}}>{errors.billingAddress3}</div>}
                                <Field
                                    name="billingCity"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('volVal',e.target.value); this.setState({billing: {...this.state.billing, city: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingCity')
                                                    this.setState({
                                                        focus : 'billingCity'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingCity' }
                                                id="city"
                                                name="city"
                                                label="City"
                                                fullWidth
                                                autoComplete="address-level2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingCity && touched.billingCity && <div style={{color:'red'}} >{errors.billingCity}</div>}
                                <Field
                                    name="billingZip"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('billingZip',e.target.value); this.setState({billing: {...this.state.billing, zip: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingZip')
                                                    this.setState({
                                                        focus : 'billingZip'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingZip' }
                                                id="zip"
                                                name="zip"
                                                label="Zip / Postal code"
                                                fullWidth
                                                autoComplete="postal-code"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingZip && touched.billingZip && <div style={{color:'red'}} >{errors.billingZip}</div>}
                                <Field
                                    name="billingCountryid"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                                value={props.field.value}
                                                InputLabelProps={{ shrink: props.field.value !== '' }}
                                                onChange={e => { props.form.setFieldValue('billingCountryid',e.target.value); this.setState({billing: {...this.state.billing, countryid: e.target.value}})}}
                                                onFocus={e => {
                                                    if (focus !== 'billingCountryid')
                                                    this.setState({
                                                        focus : 'billingCountryid'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billingCountryid' }
                                                id="country"
                                                name="countryid"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors.billingCountryid && touched.billingCountryid && <div style={{color:'red'}} >{errors.billingCountryid}</div>}
                                <Grid item xs={12} md={7}>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        variant="outlined" color="primary"
                                        onClick={this.manageBilling}
                                    >
                                        Manage Billing Addresses
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        variant="outlined" color="primary"
                                        onClick={this.manageCards}
                                    >
                                        Manage Cards
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className={classes.buttonContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            className={classes.button}
                            // onClick={this.handleSubmit}
                        >
                            Confirm Account Changes
                        </Button>
                    </div>
                        </Form>
                        )}}
                    </Formik>

                    <Dialog
                        open={this.state.manageShipping}
                        maxWidth={"md"}
                        fullWidth
                    >
                        <ManageShipping closeDialog={this.closeShipping} />
                    </Dialog>

                    <Dialog
                        open={this.state.manageBilling}
                        maxWidth={"md"}
                        fullWidth
                    >
                        <ManageBilling closeDialog={this.closeBilling} />
                    </Dialog>

                    <Dialog
                        open={this.state.manageCards}
                        maxWidth={"md"}
                        fullWidth
                    >
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
        display: "flex",
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    },
});

MyAccount.propTypes = {
    classes: PropTypes.object.isRequired
};


const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(compose(
    withStyles(styles, { withTheme: true })(
        isLoggedUser(MyAccount)
    )
))

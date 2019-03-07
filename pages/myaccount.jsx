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
            // shipping: {},
            // billing: {},
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
            // shipping,
            // billing,
            shipFrom: subsidiaryOptions[0],
            subsidiaryOptions,
            subsidiary,
        });
    }

    componentWillUnmount() {
        const { user: { id, email, phone, shipping, billing, card, subsidiary, subsidiaryOptions }} = this.props;
    //     const isShippingDiff = Util.checkDifference(shipping,this.state.shipping);
    //     const isBillingDiff = Util.checkDifference( billing, this.state.billing);
    //     if( email != this.state.email || phone != this.state.phone || subsidiary != this.state.shipFrom || isShippingDiff || isBillingDiff ) {
    //         this.props.unsavedUserInfo()
    //     }
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

    handleSubmit = (values) => {
        try {
            var request = changesWereMade(values, this.props.user);
           
            if(!_isEmpty(request)) {
                this.props.updateUserInfo({request});
            }
            else {
                throw { message: 'Empty request. Cannot update user information', code: 0 };
            }
        }
        catch(error) {
            // this.props.displayError();
          
        }
        // const {user}=this.props;
        // this.props.getUserInfo({
        //     userID: user.id
        // })
        
    }

    render() {
        const { classes, user } = this.props;
        const { focus } = this.state;
        const customFormValidation = Yup.object().shape({
            shipping:Yup.object().shape({
             attn: Yup.string()
            .required('Required'),
            address1: Yup.string()
            .required('Required'),
            addressee: Yup.string()
            .required('Required'),
            city: Yup.string()
            .required('Required'),
            zip: Yup.number()
            .required('Required'),
            countryid: Yup.string()
            .required('Required'),
            }),

            billing:Yup.object().shape({

            attn: Yup.string()
            .required('Required'),
            address1: Yup.string()
            .required('Required'),
            addressee: Yup.string()
            .required('Required'),
            city: Yup.string()
            .required('Required'),
            zip: Yup.number()
            .required('Required'),
            countryid: Yup.string()
            .required('Required'),
            }),

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
                            shipping:{
                            address1:this.props.user.shipping.address1,
                            address2: this.props.user.shipping.address2,
                            address3: this.props.user.shipping.address3,
                            addressee: this.props.user.shipping.addressee,
                            attn: this.props.user.shipping.attn,
                            city: this.props.user.shipping.city,
                            zip: this.props.user.shipping.zip,
                            countryid:this.props.user.shipping.countryid
                        },

                            billing:{

                            address1: this.props.user.billing.address1,
                            address2:this.props.user.billing.address2,
                            address3: this.props.user.billing.address3,
                            addressee: this.props.user.billing.addressee,
                            attn:this.props.user.billing.attn,
                            zip: this.props.user.billing.zip,
                            city: this.props.user.billing.city,
                            countryid: this.props.user.billing.countryid
                               },

                        //user
                            email:  this.props.user.email,
                            phone:  this.props.user.phone,
                            shipFrom: this.state.shipFrom,
                    }}
                    validationSchema={customFormValidation}
                    validate={( values, props) => {
                        // add more validation which will execute before submit
                        let errors={};
                        let billZipValidate = WLHelper.validateZipCode(values.billing.zip,values.billing.countryid)
                        let shipZipValidate = WLHelper.validateZipCode(values.shipping.zip,values.shipping.countryid)
                        // if(!billZipValidate){
                        //     errors.billingZip = 'MUST BE VALID ZIP CODE'
                        // }
                        // if(!shipZipValidate){
                        //     errors.shippingZip = "MUST BE VALID ZIP CODE"
                        // }
                        return errors
                    } }
                    enableReinitialize
                    onSubmit={(values, actions) => {
                        this.handleSubmit(values)
                    }}
                >
                {({ errors, touched, isValidating, values, handleChange}) => {
                    return(
                        <Form >
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
                                                   
                                                    value={values.email}
                                                    InputLabelProps={{ shrink: values.email!==''}}
                                                    onChange={handleChange}
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
                                    {errors && errors.email && <div style={{color:'red'}} >{errors.email}</div>}
                                    {/* {errors.email && touched.email && <div style={{color:'red'}} >{errors.email}</div>} */}
                                    <Field
                                        name="phone"
                                        component={(props)=>{
                                        return(
                                            <Grid item xs={3}>
                                                <TextField
                                                   
                                                    value={values.phone}
                                                    InputLabelProps={{ shrink: values.phone !==''}}
                                                    onChange={handleChange}
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
                                    {errors && errors.phone &&  <div style={{color:'red'}} >{errors.email}</div>}
                                    {/* {errors.phone && touched.phone && <div style={{color:'red'}} >{errors.phone}</div>} */}
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
                                    {errors && errors.shipFrom && <div style={{color:'red'}} >{errors.shipFrom}</div>}
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
                                    name="shipping.attn"
                                    component={(props)=>{
                                    
                                        
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                                value={values && values.shipping && values.shipping.attn}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: values.shipping.attn !== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shipping.attn')
                                                    this.setState({
                                                        focus : 'shipping.attn'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.attn' }
                                                id="shipping.attn"
                                                name="shipping.attn"
                                                label="Attention"
                                                fullWidth
                                                autoComplete="attention"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.shipping && errors.shipping.attn && <div style={{color:'red'}} >{errors.shipping.attn}</div> }
                                {/* {errors && errors.shippingAttn && touched && touched.shippingAttn && <div style={{color:'red'}} >{errors.shippingAttn}</div>} */}
                                <Field
                                    name="shippingAddressee"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                                value={values.shipping.addressee}
                                                InputLabelProps={{ shrink: values.shipping.addressee!== '' }}
                                                onChange={handleChange}
                                                onFocus={e => {
                                                    if (focus !== 'addressee')
                                                    this.setState({
                                                        focus : 'shipping.addressee'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.addressee' }
                                                id="shipping.addressee"
                                                name="shipping.addressee"
                                                label="Addressee"
                                                fullWidth
                                                autoComplete="addressee"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                 {errors && errors.shipping && errors.shipping.addressee && <div style={{color:'red'}} >{errors.shipping.addressee}</div> }
                                {/* {errors.shipping.addressee && touched.shipping.addressee && <div style={{color:'red'}} >{errors.shipping.addressee}</div>} */}
                                <Field
                                    name="shippingAddress1"
                                    component={(props)=>{
                                    return(
                                    <Grid item xs={12}>
                                        <TextField
                                           
                                            value={values.shipping.address1}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: values.shipping.address1 !== '' }}
                                            onFocus={e => {
                                                if (focus !== 'shipping.address1')
                                                this.setState({
                                                    focus : 'shipping.address1'
                                                })
                                            }}
                                            autoFocus={ focus == 'shipping.address1' }
                                            id="shipping.address1"
                                            name="shipping.address1"
                                            label="Address line 1"
                                            fullWidth
                                            autoComplete="address-line1"
                                        />
                                    </Grid>
                                    )
                                    }}
                                />
                                 {errors && errors.shipping && errors.shipping.address1 && <div style={{color:'red'}} >{errors.shipping.address1}</div> }
                                {/* {errors.shipping.address1 && touched.shipping.address1 && <div style={{color:'red'}} >{errors.shipping.address1}</div>} */}
                                <Field
                                    name="shippingAddress2"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                             
                                                value={values.shipping.address2}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: values.shipping.address2 !== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shipping.address2')
                                                    this.setState({
                                                        focus : 'shipping.address2'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.address2' }
                                                id='shipping.address2'
                                                name='shipping.address2'
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.shipping && errors.shipping.address2 && <div style={{color:'red'}} >{errors.shipping.address2}</div> }
                                {/* {errors.shipping.address2 && touched.shipping.address2 && <div style={{color:'red'}} >{errors.shipping.address2}</div>} */}
                                <Field
                                    name="shippingAddress3"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                                value={values.shipping.address3}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: values.shipping.address3 !== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shipping.address3')
                                                    this.setState({
                                                        focus : 'shipping.address3'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.address3' }
                                                id="shipping.address3"
                                                name="shipping.address3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.shipping && errors.shipping.address3 && <div style={{color:'red'}} >{errors.shipping.address3}</div> }
                                {/* {errors.shipping.address3 && touched.shipping.address3 && <div style={{color:'red'}} >{errors.shipping.address3}</div>} */}
                                <Field
                                    name="shippingCity"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                              
                                                value={values.shipping.city}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: values.shipping.city!== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shipping.city')
                                                    this.setState({
                                                        focus : 'shipping.city'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.city' }
                                                id="shipping.city"
                                                name="shipping.city"
                                                label="City"
                                                fullWidth
                                                autoComplete="address-level2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.shipping && errors.shipping.city && <div style={{color:'red'}} >{errors.shipping.city}</div> }
                                {/* {errors.shipping.city && touched.shipping.city && <div style={{color:'red'}} >{errors.shipping.city}</div>} */}
                                <Field
                                    name="shippingZip"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                             
                                                value={values.shipping.zip}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: values.shipping.zip!== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shipping.zip')
                                                    this.setState({
                                                        focus : 'shipping.zip'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.zip' }
                                                id="shipping.zip"
                                                type='number'
                                                name="shipping.zip"
                                                label="Zip / Postal code"
                                                fullWidth
                                                autoComplete="postal-code"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.shipping && errors.shipping.zip && <div style={{color:'red'}} >{errors.shipping.zip}</div> }
                                {/* {errors.shipping.zip && touched.shipping.zip && <div style={{color:'red'}} >{errors.shipping.zip}</div>} */}
                                <Field
                                    name="shippingCountryid"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                               value={values.shipping.countryid}
                                               onChange={handleChange}
                                               InputLabelProps={{ shrink: values.shipping.countryid != '' }}
                                                onFocus={e => {
                                                    if (focus !== 'shipping.countryid')
                                                    this.setState({
                                                        focus : 'shipping.countryid'
                                                    })
                                                }}
                                                autoFocus={ focus == 'shipping.countryid' }
                                                id="shipping.countryid"
                                                name="shipping.countryid"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.shipping && errors.shipping.countryid && <div style={{color:'red'}} >{errors.shipping.countryid}</div> }
                                {/* {errors.shipping.countryid && touched.shipping.countryid && <div style={{color:'red'}} >{errors.shipping.countryid}</div>} */}
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
                                                
                                                value={values.billing.attn}
                                                onChange={handleChange}
                                                InputLabelProps={{ shrink: values.billing.attn}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.attn')
                                                    this.setState({
                                                        focus : 'billing.attn'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.attn' }
                                                id="billing.attn"
                                                name="billing.attn"
                                                label="Attention"
                                                fullWidth
                                                autoComplete="attention"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                           
                                {errors && errors.billing && errors.billing.attn && <div style={{color:'red'}} >{errors.billing.attn}</div>}
                                {/* {errors && errors.billing && errors.billing.attn?<div style={{color:'red'}} >{errors.billing.attn}</div>:null} */}
                                <Field
                                    name="billingAddressee"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                               value={values.billing.addressee}
                                               onChange={handleChange}
                                               InputLabelProps={{ shrink: values.billing.addressee !== '' }}
                                                onFocus={e => {
                                                    if (focus !== 'billing.addressee')
                                                    this.setState({
                                                        focus : 'billing.addressee'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.addressee' }
                                                id="billing.addressee"
                                                name="billing.addressee"
                                                label="Addressee"
                                                fullWidth
                                                autoComplete="addressee"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                               
                               {errors && errors.billing && errors.billing.addressee && <div style={{color:'red'}} >{errors.billing.addressee}</div>}
                                {/* {errors.billing.addressee && touched.billing.addressee && <div style={{color:'red'}} >{errors.billing.addressee}</div>} */}
                                <Field
                                    name="billingAddress1"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                               value={values.billing.address1}
                                               onChange={handleChange}
                                               InputLabelProps={{shrink: values.billing.address1}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.address1')
                                                    this.setState({
                                                        focus : 'billing.address1'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.address1' }
                                                id="billing.address1"
                                                name="billing.address1"
                                                label="Address line 1"
                                                fullWidth
                                                autoComplete="address-line1"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.billing && errors.billing.address1 &&  <div style={{color:'red'}} >{errors.billing.address1}</div>}
                                {/* {errors.billing.address1 && touched.billing.address1 && <div style={{color:'red'}} >{errors.billing.address1}</div>} */}
                                <Field
                                    name="billingAddress2"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                               
                                                value={values.billing.address2}
                                                onChange={handleChange}
                                                InputLabelProps={{shrink: values.billing.address2}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.address2')
                                                    this.setState({
                                                        focus : 'billing.address2'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.address2' }
                                                id="billing.address2"
                                                name="billing.address2"
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.billing && errors.billing.address2 &&  <div style={{color:'red'}} >{errors.billing.address2}</div>}
                                {/* {errors.billing.address2 && touched.billing.address2 && <div style={{color:'red'}} >{errors.billing.address2}</div>} */}
                                <Field
                                    name="billingAddress3"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                              
                                               value={values.billing.address3}
                                               onChange={handleChange}
                                               InputLabelProps={{shrink: values.billing.address3}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.address3')
                                                    this.setState({
                                                        focus : 'billing.address3'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.address3' }
                                                id="billing.address3"
                                                name="billing.address3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {errors && errors.billing && errors.billing.address3 &&  <div style={{color:'red'}} >{errors.billing.address3}</div>}
                                {/* {errors.billing.address3 && touched.billing.address3 && <div style={{color:'red'}}>{errors.billing.address3}</div>} */}
                                <Field
                                    name="billingCity"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                             
                                               value={values.billing.city}
                                               onChange={handleChange}
                                               InputLabelProps={{ shrink: values.billing.city}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.city')
                                                    this.setState({
                                                        focus : 'billing.city'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.city' }
                                                id="billing.city"
                                                name="billing.city"
                                                label="City"
                                                fullWidth
                                                autoComplete="address-level2"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                 {errors && errors.billing && errors.billing.address1 &&  <div style={{color:'red'}} >{errors.billing.address1}</div>}
                                {/* {errors.billing.city && touched.billing.city && <div style={{color:'red'}} >{errors.billing.city}</div>} */}
                                <Field
                                    name="billingZip"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                          
                                                value={values.billing.zip}
                                                onChange={handleChange}
                                                InputLabelProps={{shrink: values.billing.zip}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.zip')
                                                    this.setState({
                                                        focus : 'billing.zip'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.zip' }
                                                id="billing.zip"
                                                name="billing.zip"
                                                label="Zip / Postal code"
                                                fullWidth
                                                autoComplete="postal-code"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                {/* {errors.billing.zip && touched.billing.zip && <div style={{color:'red'}} >{errors.billing.zip}</div>} */}
                                <Field
                                    name="billingCountryid"
                                    component={(props)=>{
                                    return(
                                        <Grid item xs={12}>
                                            <TextField
                                              
                                                value={values.billing.countryid}
                                                onChange={handleChange}
                                                InputLabelProps={{shrink: values.billing.countryid}}
                                                onFocus={e => {
                                                    if (focus !== 'billing.countryid')
                                                    this.setState({
                                                        focus : 'billing.countryid'
                                                    })
                                                }}
                                                autoFocus={ focus == 'billing.countryid' }
                                                id="billing.countryid"
                                                name="billing.countryid"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                            />
                                        </Grid>
                                    )
                                    }}
                                />
                                 {errors && errors.billing && errors.billing.countryid &&  <div style={{color:'red'}} >{errors.billing.countryid}</div>}
                                {/* {errors.billing.countryid && touched.billing.countryid && <div style={{color:'red'}} >{errors.billing.countryid}</div>} */}
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

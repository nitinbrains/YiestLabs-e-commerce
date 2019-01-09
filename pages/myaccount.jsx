import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import update from "immutability-helper";

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
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import CardHeader from "../components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import PageContainer from "../components/UI/PageContainer";
import Dialog from "@material-ui/core/Dialog";

import ManageShipping from "../components/MyAccount/ManageShipping";
import ManageBilling from "../components/MyAccount/ManageBilling";
import ManageCards from "../components/MyAccount/ManageCards";

import { userActions } from '../redux/actions/userActions';

class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manageShipping: false,
            manageBilling: false,
            manageCards: false,
            shipping: {},
            billing: {}
        };
    }

    componentDidMount() {
        const { user: { id, email, phone, shipping, billing, selectedCard, subsidiary, subsidiaryOptions }} = this.props;
        this.setState({
            id,
            email, 
            phone,
            shipping,
            billing,
            selectedCard,
            subsidiaryOptions,
            subsidiary
        });
    }

    componentWillReceiveProps(nextprops){
        const { user: { id, email, phone, shipping, billing, selectedCard, subsidiaryOptions, subsidiary }} = nextprops;
        this.setState({
            id,
            email, 
            phone,
            shipping,
            billing,
            selectedCard,
            subsidiaryOptions,
            subsidiary
        });
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

    handleChange = (e, state) => {
        let shipping = this.state.shipping;
        let billing = this.state.billing;
        if(state == 'shipping'){
            shipping[e.target.name] = e.target.value;
        } else if( state == 'billing' ){
            billing[e.target.name] = e.target.value;
        }

        this.setState({
            shipping,
            billing,
        })
    }

    handleSubmit = () => {
        let billing = this.state.billing;
        let shipping = this.state.shipping;
        if(billing.attn != ''){
            this.props.setBillAddress(billing)
        }
        if(shipping.attn != ''){
            this.props.setShipAddress(shipping)
        }
        if(this.props.user.email != this.state.email || this.props.user.phone != this.state.phone || this.props.user.subsidiary != this.state.subsidiary ){
            let data = {
                email: this.state.email,
                phone: this.state.phone,
                subsidiary: this.state.subsidiary
            }
            this.props.updateUserInfo(data);
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <PageContainer heading="MY ACCOUNT" id="cart-box">
                    <Grid container spacing={24}>
                        <Grid
                            item
                            xs={12}
                            container
                            justify="center"
                            alignItems="center"
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
                            <Grid item xs={3}>
                                <TextField required
                                    value={this.state.email}
                                    InputLabelProps={{ shrink: this.state.email != '' }}
                                    onChange={e => this.setState({email: e.target.value})}
                                    variant="outlined"
                                    id="email"
                                    name="email"
                                    label="Email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField required
                                    value={this.state.phone}
                                    InputLabelProps={{ shrink: this.state.phone != '' }}
                                    onChange={e => this.setState({phone: e.target.value})}
                                    variant="outlined"
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    autoComplete="phone"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    variant="outlined"
                                    id="select-shipfrom"
                                    select
                                    fullWidth
                                    value={this.state.subsidiary}
                                    InputLabelProps={{ shrink: this.state.subsidiary != '' }}
                                    label="Ship From"
                                    onChange={this.selectAccount}
                                >
                                    <MenuItem value={2} >WL USA</MenuItem>
                                    <MenuItem value={5} >WL Copenhagen</MenuItem>
                                    <MenuItem value={7} >WL Hong Kong</MenuItem>
                                </TextField>
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
                                <Grid item xs={12}>
                                    <TextField required
                                        onChange={e => this.handleChange(e,'shipping')}
                                        value={this.state.shipping.attn}
                                        InputLabelProps={{ shrink: this.state.shipping.attn != '' }}
                                        id="attention"
                                        name="attn"
                                        label="Attention"
                                        fullWidth
                                        autoComplete="attention"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.shipping.addressee}
                                        InputLabelProps={{ shrink: this.state.shipping.addressee != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="addressee"
                                        name="addressee"
                                        label="Addressee"
                                        fullWidth
                                        autoComplete="addressee"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.shipping.address1}
                                        InputLabelProps={{ shrink: this.state.shipping.address1 != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="address1"
                                        name="address1"
                                        label="Address line 1"
                                        fullWidth
                                        autoComplete="address-line1"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={this.state.shipping.address2}
                                        InputLabelProps={{ shrink: this.state.shipping.address2 != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="address2"
                                        name="address2"
                                        label="Address line 2"
                                        fullWidth
                                        autoComplete="address-line2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={this.state.shipping.address3}
                                        InputLabelProps={{ shrink: this.state.shipping.address3 != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="address3"
                                        name="address3"
                                        label="Address line 3"
                                        fullWidth
                                        autoComplete="address-line3"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.shipping.city}
                                        InputLabelProps={{ shrink: this.state.shipping.city != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="city"
                                        name="city"
                                        label="City"
                                        fullWidth
                                        autoComplete="address-level2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.shipping.zip}
                                        InputLabelProps={{ shrink: this.state.shipping.zip != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="zip"
                                        type='number'
                                        name="zip"
                                        label="Zip / Postal code"
                                        fullWidth
                                        autoComplete="postal-code"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.shipping.countryid}
                                        InputLabelProps={{ shrink: this.state.shipping.countryid != '' }}
                                        onChange={e =>  this.handleChange(e,'shipping') }
                                        id="country"
                                        name="countryid"
                                        label="Country"
                                        fullWidth
                                        autoComplete="country"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        onClick={this.manageShipping}
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
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.billing.attn}
                                        InputLabelProps={{ shrink: this.state.billing.attn != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }                                        
                                        id="attention"
                                        name="attn"
                                        label="Attention"
                                        fullWidth
                                        autoComplete="attention"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.billing.addressee}
                                        InputLabelProps={{ shrink: this.state.billing.addressee != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="addressee"
                                        name="addressee"
                                        label="Addressee"
                                        fullWidth
                                        autoComplete="addressee"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.billing.address1}
                                        InputLabelProps={{ shrink: this.state.billing.address1 != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="address1"
                                        name="address1"
                                        label="Address line 1"
                                        fullWidth
                                        autoComplete="address-line1"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={this.state.billing.address2}
                                        InputLabelProps={{ shrink: this.state.billing.address2 != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="address2"
                                        name="address2"
                                        label="Address line 2"
                                        fullWidth
                                        autoComplete="address-line2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        value={this.state.billing.address3}
                                        InputLabelProps={{ shrink: this.state.billing.address3 != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="address3"
                                        name="address3"
                                        label="Address line 3"
                                        fullWidth
                                        autoComplete="address-line3"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.billing.city}
                                        InputLabelProps={{ shrink: this.state.billing.city != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="city"
                                        name="city"
                                        label="City"
                                        fullWidth
                                        autoComplete="address-level2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.billing.zip}
                                        InputLabelProps={{ shrink: this.state.billing.zip != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="zip"
                                        name="zip"
                                        label="Zip / Postal code"
                                        fullWidth
                                        autoComplete="postal-code"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField required
                                        value={this.state.billing.countryid}
                                        InputLabelProps={{ shrink: this.state.billing.countryid != '' }}
                                        onChange={e =>  this.handleChange(e,'billing') }
                                        id="country"
                                        name="countryid"
                                        label="Country"
                                        fullWidth
                                        autoComplete="country"
                                    />
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Button style={{ marginTop: 10 }} onClick={this.manageBilling}>
                                        Manage Billing Addresses
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Button style={{ marginTop: 10 }} onClick={this.manageCards}>
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
                            className={classes.button}
                            onClick={this.handleSubmit}
                        >
                            Confirm Account Changes
                        </Button>
                    </div>

                    <Dialog open={this.state.manageShipping} maxWidth={'sm'} fullWidth>
                        <ManageShipping closeDialog={this.closeShipping} />
                    </Dialog>

                    <Dialog open={this.state.manageBilling} maxWidth={'sm'} fullWidth>
                        <ManageBilling closeDialog={this.closeBilling} />
                    </Dialog>

                    <Dialog open={this.state.manageCards} maxWidth={'sm'} fullWidth>
                        <ManageCards closeDialog={this.closeCards} />
                    </Dialog>
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
        justifyContent: "flex-end"
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

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(MyAccount));

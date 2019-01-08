import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import Link from "next/link";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import CartItem from "../components/Cart/CartItem";
import WantSooner from "../components/Cart/WantSooner/WantSooner";
import FormButton from "../components/Form/FormButton";

import { cartActions } from '../redux/actions/cartActions';

import PageContainer from '../components/UI/PageContainer';


class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showWantSoonerDialog: false,
            subTotal: '1234'
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        return {
            showWantSoonerDialog: nextProps.cart.showWantSooner,
        }
    }

    render() {
        const { classes } = this.props;

        console.log('user', this.props.user);

        return (
            <NavBarUserSearchDrawerLayout>                    
                <PageContainer heading="SHOPPING CART" id="cart-box">    
                    <Grid container spacing={24}>
                        {this.props.cart.items && this.props.cart.items.map((item, i) => {
                            return (                                
                                <CartItem key={i} item={item} index={i} openWantSoonerDialog={() => { this.props.showWantSooner() }} />                                
                            );
                        })}
                    </Grid>
                    {/*
                    <Grid container spacing={24} dir="rtl">
                        <Grid item >
                            SUBTOTAL ${this.state.subTotal}
                        </Grid>
                    </Grid>
                    */}
                    <Grid container spacing={24} dir="rtl" className="block-checkout-button">
                        <Grid item >
                            <Link prefetch href="/checkout">
                                <FormButton
                                    className="cart-checkout-button"
                                    text="PROCEED TO CHECKOUT"
                                />
                                {/*<Button style={{marginTop:20}} variant="contained">PROCEED TO CHECKOUT</Button>*/}
                            </Link>
                        </Grid>
                    </Grid>

                    <Dialog
                        open={this.state.showWantSoonerDialog}
                        onClose={() => {this.props.hideWantSooner()}}
                        aria-labelledby="form-dialog-title"
                        classes={{ paper: classes.dialogPaper }}
                    >
                        <WantSooner {...this.props}/>
                    </Dialog>                    
                </PageContainer>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    },
    card: {
        display: "flex"
    },
    image: {
        width: 150
    },
    quantity: {
        width: 50,
        marginRight: 20
    },
    details: {
        display: "flex",
        flexDirection: "column"
    },
    dialogPaper: {
        minWidth: '70%',
    },
});

Cart.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        cart: state.cart,
        user: state.user
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(cartActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Cart));


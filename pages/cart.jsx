import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';

import Link from "next/link";
import Router from 'next/router';
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import NavBarUserSearchDrawerLayout from "components/NavBar/NavBarUserSearchDrawerLayout";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import CartItem from "components/Cart/CartItem";
import FormButton from "components/Form/FormButton";
import PageContainer from 'components/UI/PageContainer';
import isLoggedUser from "hocs/isLoggedUser";
import { cartActions } from 'appRedux/actions/cartActions';

class Cart extends Component {

    handleProceed = () => {
        const { user } = this.props;
        if(!user.id){
            Router.push('/login')
        } else {
            sessionStorage.setItem('orderComplete', false);
            Router.push('/checkout');
        }
    }
    
    // To force the store to reload when user clicks link in header while in the store
    // See also NavBarUserSearchDrawerLayout file
    // TODO: Find a better way
    componentWillReceiveProps(nextProps) {
        if (nextProps.router && nextProps.router.route === '/cart') {
          Router.push('/cart');
        }
    }

    render() {
        const { classes, cart } = this.props;
        return (
            <NavBarUserSearchDrawerLayout>
                <PageContainer heading="SHOPPING CART" id="cart-box">
                    <Grid container spacing={24} className={classes.contentBox}>
                        {this.props.cart.items && this.props.cart.items.map((item, i) => {
                            return (
                                <CartItem key={i} item={item} index={i} />
                            );
                        })}
                    </Grid>
                    <Grid container spacing={24} dir="rtl" className="block-checkout-button">
                        <Grid item xs={12} >
                            { cart.items.length > 0 
                            ?
                                <Button variant="contained" color="primary" className={classes.button} onClick={this.handleProceed}>
                                    Proceed to Checkout
                                </Button>
                            :
                                <Typography variant="h5" color="primary" align="center">
                                    Cart is Empty
                                </Typography>
                            }
                        </Grid>
                    </Grid>
                </PageContainer>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
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
    contentBox:{
        // width: '97%',
        // margin: '8px'
    
    }
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
)(compose(
    withStyles(styles, { withTheme: true })(
        isLoggedUser(Cart)
    )
))

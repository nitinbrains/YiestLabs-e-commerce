import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";

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

import CartItem from "../components/Cart/CartItem";
import withInventory from "../hocs/inventory";

class Cart extends Component {


    render() {
        const { classes, theme, cart } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>

                {this.props.cart.items && (
                    <div>
                        <Grid container spacing={24}>
                            {this.props.cart.items.map((item, i) => {
                                return (
                                    <Grid item xs={12}>
                                        <CartItem item={item} index={i} />
                                    </Grid>
                                );
                            })}
                        </Grid>
                        <Link prefetch href="/checkout">
                            <Button style={{marginTop:20}} variant="contained">PROCEED TO CHECKOUT</Button>
                        </Link>
                    </div>
                )}

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

export default compose(
    withStyles(styles, { withTheme: true }),
    connect(mapStateToProps),
    withInventory,
)(Cart);

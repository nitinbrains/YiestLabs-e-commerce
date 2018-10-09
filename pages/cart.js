import React, { Component } from "react";
import { connect } from 'react-redux'

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


import CartItem from '../components/Cart/CartItem';

class Cart extends Component {

    render() {
        const { classes, theme, cart } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <Grid container spacing={24}>
                    <Grid item xs={12}>

                        {this.props.cart.items.map((item, i) => {
                            return (
                                <CartItem item={item} index={i}/>
                            )
                        })}
                    </Grid>
                </Grid>
                <Link prefetch href="/checkout">
                    <Button variant="contained">PROCEED TO CHECKOUT</Button>
                </Link>
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


const mapStateToProps = (state) => {
    return {
        cart: state.cart
    }
}

export default connect(mapStateToProps, null)(withStyles(styles, { withTheme: true })(Cart));

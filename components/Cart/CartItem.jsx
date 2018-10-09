import React, { Component } from 'react'
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


class CartItem extends Component {

    constructor(props){
        super(props)
        this.state = {
            quantity: this.props.item.dispQuantity
        }

    }

    incrementQuantity(item, index){
        var quantity = parseInt(item.dispQuantity);
        var newAmount = quantity + 1;
        this.props.changeQuantity(index, newAmount);
    }

    decrementQuantity(item, index){
        var quantity = parseInt(item.dispQuantity);
        var newAmount = quantity - 1 > 0 ? quantity - 1 : 1;
        this.props.changeQuantity(index, newAmount);
    }

    render(){

        const { classes, theme } = this.props;

        return (
            <Card className={classes.card}>
                <div
                    style={{ backgroundColor: "#f28411", width: 7 }}
                />
                <CardMedia
                    className={classes.image}
                    image="/static/images/yeast.jpg"
                />
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography
                            variant="display1"
                            color="textPrimary"
                        >
                            {this.props.item.Name}
                        </Typography>
                    </CardContent>
                    <CardContent className={classes.content}>
                        <TextField
                            id="quantity"
                            label="Quantity"
                            className={classes.quantity}
                            value={this.state.quantity}
                            onChange={(event) => {
                                this.props.changeItemQuantity(this.props.index, event.target.value);
                                this.setState({quantity: event.target.value});
                            }}
                            type="number"
                        />
                        <Button variant="contained" onClick={() => this.props.removeFromCart(this.props.index)}>DELETE</Button>
                    </CardContent>
                </div>
            </Card>
        )
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

CartItem.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};



const mapStateToProps = (state) => {
    return {
        user: state.user,
        inventory: state.inventory,
        cart: state.cart
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeItemQuantity: (index, quantity) => dispatch({type: "CHANGE_QUANTITY", index, quantity}),
        removeFromCart: (index) => dispatch({type: "REMOVE_FROM_CART", index})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(CartItem));
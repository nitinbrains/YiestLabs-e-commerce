import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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

import { cartActions } from 'appRedux/actions/cartActions';
import FormSelectbox from 'components/Form/FormSelectbox';
import FormTextbox from 'components/Form/FormTextbox';
import FormButton from 'components/Form/FormButton';

// import {cartItemImage} from "static/images/categories/Category-core.jpg";

class CartItem extends Component {

    constructor(props){
        super(props)
        this.state = {
            quantity: this.props.item.dispQuantity,
            options_packing: [{label:'Packing', value: 'packing'}],
            options_pack: [{label:'Pack', value: 'pack'}],
            defaulPacking: "packing",
            defaulPack:"pack"
        }

    }

    checkQuantity = (item) => {

        var quantity = parseFloat(item.OrderDetailQty);

        if(isNaN(quantity) || quantity <= 0 ) {
            console.log('Please enter a valid value for the quantity');
            return false;
        }

        //  Must be in increments of 1
        else if ((parseFloat(quantity) / parseInt(quantity) != 1.0)) {
            return false;
        }

        return true;
    }

    changeQuantity = (event) => {
        try {

            if(this.checkQuantity(cartItem)) {

                this.props.updateItem({ index: this.props.index, quantity: event.target.value });
                this.setState({ quantity: event.target.value });
            }

        }
        catch(error) {
            console.log('could not add item to cart', error);
        }

    }

    render(){

        const { classes, theme } = this.props;

        return (
            <Grid item className="cart-item">
                <Grid container spacing={24}>
                    <Grid item xs={2} className="first-block" style={{
                        backgroundImage: `url('static/images/categories/Category-ale.jpg')`
                    }}>
                        <img className="icon" src="static/images/icons/Ale-icon.svg"/>
                        <div className="code">WLP001</div>
                        <div className="name">{this.props.item.Name}</div> 
                    </Grid>
                    <Grid className="detail" item xs={8}>
                        {this.props.item.Name}
                        <br/>
                        <br/>
                        {/* <span className="sooner" onClick={this.props.openWantSoonerDialog}>Want this Strain sooner?</span> */}
                    </Grid>
                    {/*
                    <Grid className="detail" item xs={2}>
                        <span className="heading">Packing</span>
                        <FormSelectbox
                            value={this.state.defaulPacking}
                            options={this.state.options_packing}
                            onChange={() => {}}
                        />
                    </Grid>
                    <Grid className="detail" item xs={2}>
                        <span className="heading">Pack</span>
                        <FormSelectbox
                            value={this.state.defaulPack}
                            options={this.state.options_pack}
                            onChange={() => {}}
                        />
                    </Grid>
                    */}
                    <Grid className="detail" item xs={1}>
                        <span className="heading">Quantity</span>
                        <FormTextbox
                            label="Quantity"
                            value={this.props.item.OrderDetailQty}
                            onChange={() => {}}
                        />

                        {/*
                        <TextField
                            id="quantity"
                            label="Quantity"
                            className={classes.quantity}
                            value={this.state.quantity}
                            onChange={this.changeQuantity}
                            type="number"
                        />
                    */}
                    </Grid>
                    <Grid className="detail" item xs={1}>
                        {/*
                        <br/>
                        $255
                        */}
                        <br/>
                        <FormButton
                            className="delete-button"
                            text="DELETE"
                            onClick={() => this.props.removeItem(this.props.index)}
                            angleBlockRight={true}
                        />
                    </Grid>
                </Grid>
            </Grid>
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

const mapDispatchToProps = dispatch => bindActionCreators(cartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(CartItem));

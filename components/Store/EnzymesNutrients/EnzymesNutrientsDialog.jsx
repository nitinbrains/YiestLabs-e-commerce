import React, { Component } from "react";
import { connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { cartActions } from '../../../redux/actions/cartActions';

class EnzymesNutrientsDialog extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            quantity: '1',
        };

        this.item = this.props.item;
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

    addToCart = () => {

        var quantity = this.state.quantity;
        var item = this.item;

        // Create cart item
        var cartItem = {};
        cartItem.Name = String(item.Name);
        cartItem.MerchandiseID = item.volID[0];
        cartItem.salesCategory = parseInt(item.salesCategory);
        cartItem.type = 3;
        cartItem.details = "";
        cartItem.OrderDetailQty = parseFloat(quantity);
        cartItem.dispQuantity = parseInt(quantity);

        if(this.checkQuantity(cartItem)) {
            this.props.addItem({ cartItem });
            this.props.closeDialog();
        }
    }

    changeQuantity = (event) => {
        this.setState({quantity: event.target.value})
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <React.Fragment>
                <DialogTitle id="form-dialog-title">
                    {this.item.Name}
                </DialogTitle>
                <DialogContent>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        style={{ marginTop: 5 }}
                    >
                        <Grid item>
                            <Typography>
                                {this.item.Description}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs
                        container
                        spacing={24}
                        style={{ marginTop: 5 }}
                        direction={"row"}
                    >
                        <Grid
                            item
                            xs
                            container
                            spacing={24}
                            direction={"row"}
                            justify="flex-start"
                        >
                            <Grid item>
                                <TextField
                                    id="quantity"
                                    label="Quantity"
                                    className={classes.quantity}
                                    value={this.state.quantity}
                                    onChange={this.changeQuantity}
                                    type="number"
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.addToCart}
                        color="primary"
                        onChange={this.changeQuantity}
                    >
                        Add to Cart
                    </Button>
                </DialogActions>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    card: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: "100%",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    cardHover: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    info: {
        alignItems: "center",
        padding: 5,
        backgroundColor: "#e4e4e4",
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    }
});

EnzymesNutrientsDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        inventory: state.inventory
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(cartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(EnzymesNutrientsDialog));

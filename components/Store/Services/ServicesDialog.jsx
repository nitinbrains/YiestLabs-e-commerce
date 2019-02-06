import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import LoadingIndicator from '../../UI/LoadingIndicator';
import { cartActions } from "../../../redux/actions/cartActions";

const customFormValidation = Yup.object().shape({
    quantity: Yup.string()
      .required('Required'),
  });

class ServicesDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: "1",
        };

        this.item = this.props.item;
    }

    checkQuantity = item => {
        var quantity = parseFloat(item.OrderDetailQty);

        if (isNaN(quantity) || quantity <= 0) {
            console.log("Please enter a valid value for the quantity");
            return false;
        }

        //  Must be in increments of 1
        else if (parseFloat(quantity) / parseInt(quantity) != 1.0) {
            return false;
        }

        return true;
    };

    addToCart = (values) => {
        var quantity = this.state.quantity;
        var item = this.item;
        console.log('ssssssssssss', values, this.state);
        // Create cart item
        var cartItem = {};
        cartItem.Name = String(item.Name);
        cartItem.MerchandiseID = item.volID[0];
        cartItem.salesCategory = parseInt(item.salesCategory);
        cartItem.type = 4;
        if (cartItem.Name.includes("LSQC")) {
            cartItem.details =
                "Save BIG on our most popular analytical tests! Participate in Big QC Day by purchasing your kit by August 6th, sending your samples in by August 20th and we’ll get you results by September 10th.";
        } else {
            cartItem.details =
                "Please send your samples to:\nWhite Labs\nAttn: Analytical Lab\n9450 Candida Street\nSan Diego, CA 92126\nFor information on how much to send please visit:";
            cartItem.details_link =
                "https://www.whitelabs.com/other-products/analytical-lab-services";
        }
        cartItem.OrderDetailQty = parseFloat(quantity);
        cartItem.dispQuantity = parseInt(quantity);

        if (this.checkQuantity(cartItem)) {
            this.props.addItem({ cartItem });
            this.props.closeDialog();
        }
    };

    changeQuantity = event => {
        this.setState({ quantity: event.target.value });
    };

    handleDialogClose() {
        this.props.closeDialog();
    }

    render() {
        const { classes, theme, item } = this.props;

        const spaceIndex = item.Name.indexOf(" ");
        const itemID = item.Name.substr(0, spaceIndex);
        const itemName = item.Name.substr(spaceIndex + 1);

        return (
            <React.Fragment>
                <DialogContent>
                    <div className={classes.close}>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Menu"
                            onClick={() => this.handleDialogClose()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Grid
                        item
                        container
                        xs
                        style={{
                            display: "flex",
                            marginTop: -10,
                            marginBottom: 20
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item>
                            <Typography variant="h5">
                                {itemID} | {itemName}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        style={{ marginTop: 5 }}
                    >
                        <Grid item>
                            <Typography>{this.item.Description}</Typography>
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
                    <Formik
                        initialValues={this.state}
                        validationSchema={customFormValidation}
                        onSubmit={values => this.addToCart(values)}
                    >
                        {({ values, errors, touched, handleChange }) => {
                            return(
                                <Form className={classes.form}> 
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
                                            {errors.quantity && touched.quantity && <div style={{color:'red'}} >{errors.quantity}</div>}
                                        </Grid>
                                        <Grid
                                            item
                                            xs
                                            container
                                            spacing={24}
                                            direction={"row"}
                                            justify="flex-end"
                                        >
                                            <Grid item>
                                                <div className={classes.buttons}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        // onClick={this.addToCart}
                                                        className={classes.button}
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Form> 
                            )   
                        }}
                    </Formik>
                    </Grid>
                </DialogContent>
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
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit * -5
    },
    close: { position: "absolute", right: 0, top: 0 },
    form:{
        width:'100%',
    }
});

ServicesDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(cartActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ServicesDialog));

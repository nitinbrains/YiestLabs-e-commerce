import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { cartActions } from "../../../redux/actions/cartActions";

const customFormValidation = Yup.object().shape({
    size: Yup.string()
    .required('Required'),
    quantity: Yup.string()
      .required('Required'),
  });

class GiftShopDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: "1",
            sizes: [],
            size: "",
            errors: {},
        };

        this.item = this.props.item;
    }

    componentWillMount() {
        if (this.item.volID.length > 1) {
            var sizes = [],
                size,
                possibleSizes = [
                    { label: "M", value: 0 },
                    { label: "XS", value: 1 },
                    { label: "S", value: 2 },
                    { label: "L", value: 3 },
                    { label: "XL", value: 4 },
                    { label: "XXL", value: 5 },
                    { label: "XXXL", value: 6 }
                ];

            for (var i in this.item.volID) {
                if (this.item.volID[i] != null) {
                    sizes.push(possibleSizes[i]);
                }
            }

            size = sizes[0].value;
            this.setState({ sizes, size });
        }
    }
    handleErrors = (field, err) => {
        let {errors} = this.state;
        errors[field] = err
        this.setState({errors})
    }
    setSize = event => {
        this.setState({ size: event.target.value });
    };

    checkQuantity = item => {
        var quantity = parseFloat(item.OrderDetailQty);

        if (isNaN(quantity) || quantity <= 0) {
            this.handleErrors('quantity', 'Please enter a valid value for the quantity')
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

        // Create cart item
        var cartItem = {};
        cartItem.Name = String(item.Name);
        cartItem.MerchandiseID = item.volID[0];
        cartItem.salesCategory = parseInt(item.salesCategory);
        cartItem.type = 3;
        cartItem.details = "";
        cartItem.OrderDetailQty = parseFloat(quantity);
        cartItem.dispQuantity = parseInt(quantity);

        if (this.item.volID.length > 1) {
            switch (this.state.size) {
                case 0:
                    cartItem.MerchandiseID = item.volID[0];
                    cartItem.details = "Size: M";
                    break;
                case 1:
                    cartItem.MerchandiseID = item.volID[1];
                    cartItem.details = "Size: XS";
                    break;
                case 2:
                    cartItem.MerchandiseID = item.volID[2];
                    cartItem.details = "Size: S";
                    break;
                case 3:
                    cartItem.MerchandiseID = item.volID[3];
                    cartItem.details = "Size: L";
                    break;
                case 4:
                    cartItem.MerchandiseID = item.volID[4];
                    cartItem.details = "Size: XL";
                    break;
                case 5:
                    cartItem.MerchandiseID = item.volID[5];
                    cartItem.details = "Size: XXL";
                    break;
                case 6:
                    cartItem.MerchandiseID = item.volID[6];
                    cartItem.details = "Size: XXXL";
                    break;
                default:
                    break;
            }
        }

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
        const { classes, theme } = this.props;
        const { errors } = this.state;
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
                            marginBottom: 20,
                            marginRight:30
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item>
                            <Typography variant="h5">
                                {this.item.Name}
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
                            <Typography>{this.item.Price}</Typography>
                        </Grid>
                    </Grid>
                    <Formik
                        initialValues={this.state}
                        validationSchema={customFormValidation}
                        onSubmit={values => this.addToCart(values)}
                    >
                        {({ values, handleChange }) => {
                            return(
                                <Form className={classes.form}>
                                    {errors.quantity  && <div className="error" >* {errors.quantity}</div>} 
                                    <Grid
                                        item
                                        xs
                                        container
                                        spacing={24}
                                        style={{ marginTop: 5 }}
                                        direction={"row"}
                                    >
                                        {this.state.sizes.length > 0 && (
                                            <Grid item>
                                                <FormControl>
                                                    <InputLabel>Sizes</InputLabel>
                                                    <Select
                                                        value={this.state.size}
                                                        onChange={this.setSize}
                                                    >
                                                        {this.state.sizes.map((option, i) => (
                                                            <MenuItem
                                                                key={i}
                                                                value={option.value}
                                                            >
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        )}

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
                                                        // type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.addToCart}
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
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    info: {
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    },
    circle: {
        textAlign: "center",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        padding: 5,
        width: 37,
        height: 37
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

GiftShopDialog.propTypes = {
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
)(withStyles(styles, { withTheme: true })(GiftShopDialog));

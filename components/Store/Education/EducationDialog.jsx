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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import SalesLib from "../../../lib/SalesLib";
import { cartActions } from "../../../redux/actions/cartActions";

const customFormValidation = Yup.object().shape({
    quantity: Yup.string()
      .required('Required'),
  });

class EducationDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: "1",
            types: [],
            selectedType: ""
        };

        this.item = this.props.item;
    }

    componentWillMount() {
        if (this.item.volID.length > 1) {
            var types = [],
                selectedType,
                possibleTypes = [
                    { label: "In person", value: 0 },
                    { label: "Webinar", value: 1 }
                ];

            for (var i in this.item.volID) {
                if (this.item.volID[i] != null) {
                    types.push(possibleTypes[i]);
                }
            }

            selectedType = types[0].value;
            this.setState({ types, selectedType });
        }
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

        // Create cart item
        var cartItem = {};
        cartItem.Name = String(item.Name);
        cartItem.MerchandiseID = item.volID[0];
        cartItem.salesCategory = parseInt(item.salesCategory);
        cartItem.type = 4;
        cartItem.details = "";
        cartItem.OrderDetailQty = parseFloat(quantity);
        cartItem.dispQuantity = parseInt(quantity);

        if (this.item.volID.length > 1) {
            switch (this.state.selectedType) {
                case 0:
                    cartItem.MerchandiseID = item.volID[0];
                    cartItem.details = "In person | ";
                    cartItem.details +=
                        "Class Date(s): " +
                        item.TagDate +
                        "\nClass Location: " +
                        item.TagLocation;
                    break;
                case 1:
                    cartItem.MerchandiseID = item.volID[1];
                    cartItem.details = "Webinar | ";
                    cartItem.details +=
                        "Class Date(s): " +
                        item.TagDate +
                        "\nClass Location: " +
                        item.TagLocation;
                    break;
                default:
                    break;
            }
        }

        if (SalesLib.YeastEssentials.includes(cartItem.MerchandiseID)) {
            console.log(
                "Attending Yeast Essentials?",
                "If you are considering or already attending Yeast Essentials 2.0, consider attending the 1 day Lab Practicum course that follows each Yeast Essentials course and allows you to apply the skills that you learn."
            );
        }

        if (this.checkQuantity(cartItem)) {
            this.props.addItem({ cartItem });
            this.props.closeDialog();
        }
    };

    setType = event => {
        this.setState({ selectedType: event.target.value });
    };

    changeQuantity = event => {
        this.setState({ quantity: event.target.value });
    };

    handleDialogClose() {
        this.props.closeDialog();
    }

    render() {
        const { classes, theme, item } = this.props;

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
                                {item.Name}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item container direction={"row"} spacing={4}>
                        <Grid item xs>
                            <div style={{ display: "flex" }}>
                                <Typography>Class Location: </Typography>
                                &nbsp;
                                <Typography
                                    style={{
                                        color: "#66CCCC"
                                    }}
                                >
                                    {this.item.TagLocation}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div style={{ display: "flex" }}>
                                <Typography>Date: </Typography>
                                &nbsp;
                                <Typography
                                    style={{
                                        color: "#66CCCC"
                                    }}
                                >
                                    {this.item.TagDate}
                                </Typography>
                            </div>
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
                                            </Grid>
                                            {errors.quantity && touched.quantity && <div style={{color:'red'}} >{errors.quantity}</div>}
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

EducationDialog.propTypes = {
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
)(withStyles(styles, { withTheme: true })(EducationDialog));

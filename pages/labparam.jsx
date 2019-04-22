import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import axios from "axios";
import isEmpty from "lodash/isEmpty";
import Router from 'next/router';
import { withRouter } from "next/router";
import withInventory from "hocs/inventory";
import { compose } from "redux";

import NavBarLayout from "components/NavBar/NavBarLayout";
import FormButton from "components/Form/FormButton";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
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
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import LoadingIndicator from "components/UI/LoadingIndicator";
import { cartActions } from "appRedux/actions/cartActions";
import { inventoryActions } from "appRedux/actions/inventoryActions";
import { IN_STOCK } from "lib/Constants";

import { parseAvailabilityResults } from "lib/InventoryUtils";

const customFormValidation = Yup.object().shape({
    quantity: Yup.string().required("Required")
});

class labparam extends Component {

    constructor(props) {
        super(props);
        this.state = {
          quantity: "1",
          errors:{},
        };
        const {
            router: { query }
        } = this.props;
        let { item } = query;
        this.filteredItem = this.props.inventory.items.find(v => v.partNum === item)
    }
    handleErrors = (field, err) => {
        let { errors } = this.state;
        errors[field] = err;
        this.setState({ errors });
    };
    checkQuantity = item => {
        var quantity = parseFloat(item.OrderDetailQty);

        if (isNaN(quantity) || quantity <= 0) {
            this.handleErrors("quantity", "Please enter a valid value for the quantity");
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
    var item = this.filteredItem;

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
    }
}


    changeQuantity = event => {
        this.setState({ quantity: event.target.value });
    };

    handleBack =()=>{
        Router.push(`/`);
    }

  

    render() {
        const {classes}=this.props;
        const { errors } = this.state;

        return (
            <NavBarLayout>
                <Grid item xs={1} dir="ltr">
                    <FormButton className={classes.backbtn} text="Back" onClick={this.handleBack} />
                </Grid>
                 <div className={classes.container}>
                <div className={classes.dispInline}>
                     <Grid
                        item
                        container
                        xs
                        className={classes.displayMargin}
                        direction={"row"}
                    >
                        <Grid item style={{display:'flex'}}>
                        <Typography variant="h5" className={classes.titleMargin}>
                        {this.filteredItem && this.filteredItem.Name}
                            <Divider variant="middle" />
                            </Typography>
                        </Grid>
                    </Grid>
                   {/* <Grid
                    item
                    container
                    direction={"column"}
                    spacing={24}
                    className={classes.description}
                        >
                       <Grid item>
                           <Typography>{this.filteredItem && this.filteredItem.Description}</Typography>
                       </Grid>
                   </Grid> */}
                    <Grid item xs container spacing={24} style={{ marginTop: 5 }} direction={"row"}>
                        <Formik
                            initialValues={this.state}
                            validationSchema={customFormValidation}
                            onSubmit={values => this.addToCart(values)}
                        >
                            {({ values, handleChange }) => {
                                return (
                                    <Form className={classes.form}>
                                        {errors.quantity && <div className="error">{errors.quantity}</div>}
                                        <Grid item xs container spacing={24} direction={"column"} justify="center">
                                            <Grid item className="flex-center">
                                                <TextField id="quantity" label="Quantity" className="flex-center" className={classes.quantity} value={this.state.quantity} onChange={this.changeQuantity} type="number" />
                                            </Grid>
                                            <Grid item xs container spacing={24} className="flex-center">
                                                <Grid item>
                                                    <div className={classes.addButton}>
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            color="primary"
                                                            className={classes.button}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Grid>   
                    </div>
                    </div>
           </NavBarLayout>
        );
    }
}

const styles = theme => ({
    displayMargin:{
        display: "flex",
        justifyContent:'center',
        marginTop: 10,
        marginBottom: 20,
        maxWidth:'100%',
        [theme.breakpoints.down("sm")]: {
            maxWidth:'100%',
        },
    },
    backbtn:{
        minHeight: '20px !important',
        padding: '4px !important',
        fontSize: '12px !important',
        backgroundColor:'#f28411 !important',
        fontWeight:'bold !important',
        marginLeft: '37px !important',
        marginTop:'65px !important'
    
},
dispInline:{
    display:'inline'
},
container: {
    marginTop: 40,
    width:'60%',
    border: "solid 1px",
    borderColor: "#CCCCCC",
    textAlign:'center',
    display:'flex',
    justifyContent:'center',
    margin:'0 auto',


    padding: theme.spacing.unit * 4,
    [theme.breakpoints.down("sm")]: {
        width:'100%',
    },
    [theme.breakpoints.up("md")]: {
        marginLeft:"auto",
        marginRight: "auto"
    },
    [theme.breakpoints.up("lg")]: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    [theme.breakpoints.up("xl")]: {
        marginLeft: "auto",
        marginRight: "auto"
    }
},

     quantity: {
         width: 50,
     },
   
    buttons: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop:'15px',
        marginBottom:'15px'
    },
    button: {
        // marginTop: theme.spacing.unit,
      
    },
    addButton: {
        display: "flex",
        justifyContent: "center",
        marginLeft: '40px',
        marginBottom:'20px'
    },
    form: {
        width: "100%",
        display:'flex',
        justifyContent:'center'
    }
});



const mapStateToProps = state => {
    return {
        user: state.user,
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...inventoryActions, ...cartActions }, dispatch);


export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(compose(withStyles(styles, { withTheme: true })(withInventory(labparam))))
);


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


import FormButton from "components/Form/FormButton";

class OrderDetails extends Component {

    handleDialogClose() {
        this.props.closeDialog();
    }

    _renderSumamry() {
        const { classes, order } = this.props;
        
        return (
            <Grid container>
                <Grid container spacing={24}>
                    <Grid item sm={3} container alignItems="center" >
                        <img className="image" src="/static/images/yeast.png"/>
                    </Grid>
                    <Grid item sm={9} container alignItems="center">
                        <Grid item xs={12}>

                            <Typography variant="subtitle1" color="textPrimary">SUMMARY</Typography>
                            <div style={{borderTop: "solid 1.5px",borderColor: "#CCCCCC"}}/>
                        </Grid>
                        <Grid container spacing={24}>
                            <Grid item sm={6}>
                                <div className="block"> <span className="label">Company: </span> {order && order.companyName}</div>
                                <div className="block"> <span className="label">Ordered From: </span>White Labs.</div>
                                <div className="block"> <span className="label">Order Date: </span>{order.orderDate}</div>
                            </Grid>
                            <Grid item sm={6}>
                                <div className="block"> <span className="label">Order Total: </span> {order.currency}{order.totalPrice}</div>
                                <div className="block"> <span className="label">Order Status: </span> {order.status}</div>
                                <div className="block"> <span className="label">Tracking: </span> {order.trackingNumber}</div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <div style={{borderTop: "solid 1.5px",borderColor: "#CCCCCC"}}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )

    }

    _renderItems() {
        const { classes, order } = this.props;
        return (
            <Grid item container spacing={8}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="textPrimary">ITEMS</Typography>
                        <div style={{borderTop: "solid 1.5px",borderColor: "#CCCCCC"}}/>
                    </Grid>
                    <Grid item xs={12} style={{marginTop:'10px'}}>
                        <Grid container>
                            <Grid item xs={6} container>
                                <div className="label">Item</div>
                            </Grid>
                            <Grid item xs={3} container >
                                <div className="label" style={{ margin: "0 auto" }}>Quantity</div>
                            </Grid>
                            <Grid item xs={3} container>
                                <div className="label" style={{ margin: "0 auto" }}>Price</div>
                            </Grid>
                        </Grid>
                    </Grid>
                    {
                        order.items.map((item, i ) => {
                            return (
                                <Grid key={i} item xs={12}className="item-block">
                                    <Grid container>
                                        <Grid item xs={6}>
                                            {item.name}
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ textAlign: "center" }}> {item.quantity}</div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ textAlign: "center" }}> ${item.price}</div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </Grid>
        )

    }

    _renderPaymentShipping() {
        const { classes, order } = this.props;
        return (
            <Grid item container spacing={8}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" color="textPrimary">PAYMENT / SHIPPING</Typography>
                        <div style={{borderTop: "solid 1.5px",borderColor: "#CCCCCC"}}/>
                    </Grid>
                    <Grid container spacing={24}>
                       <Grid item sm={4}>
                            <div className="label block">Billing Address:</div>
                            {order.billaddress}<br/>
                        </Grid>
                        <Grid item sm={4}>
                            <div className="block"> <span className="label">Ship date: </span>{order.shipdate}</div>
                            <div className="block"> <span className="label">Delivery date: </span>{order.deliverydate}</div>
                            <div className="block"> <span className="label">Ship Method: </span>{order.shipmethod}</div>
                            <div className="block"> <span className="label">Ship Total: </span> {order.shipTotal}</div>
                        </Grid>
                        <Grid item sm={4}>
                            <div className="block label"> Ship Address:</div>
                            {order.shipaddress}<br/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    render() {
        const { classes, order } = this.props;
        return (
            <React.Fragment>
                <DialogContent id="my-order-details">
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
                    <div className="main-block">
                        <div className="order-number">Order # {order.orderNum}</div>
                        <Grid container spacing={24}>
                            <Grid item container spacing={24}>
                                {this._renderSumamry()}
                                {this._renderItems()}
                                {this._renderPaymentShipping()}
                            </Grid>

                            <Grid container item spacing={16} dir="rtl">
                                <Grid item>
                                    <div>
                                        <FormButton  className="button-resend-invoice" text="Resend Invoice" onClick={() => {}}/>
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div>
                                        <FormButton className="button-repeat-order" text="Repeat Order" onClick={() => {}}/>
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                    </div>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    close: { position: "absolute", right: 0, top: 0 }
});

OrderDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderDetails);

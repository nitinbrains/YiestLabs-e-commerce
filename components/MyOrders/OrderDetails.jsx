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

import _ from 'lodash';

import FormButton from "../Form/FormButton";

class OrderDetails extends Component {

    handleDialogClose() {
        this.props.closeDialog();
    }

    _renderSumamry() {
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
                                <div className="block"> <span className="label">Company: </span> Name</div>
                                <div className="block"> <span className="label">Ordered From: </span>White Labs.</div>
                                <div className="block"> <span className="label">Order Date: </span>02/01/2018</div>
                            </Grid>
                            <Grid item sm={6}>
                                <div className="block"> <span className="label">Order Total: </span> $0.02</div>
                                <div className="block"> <span className="label">Order Status: </span> closed</div>
                                <div className="block"> <span className="label">Tracking: </span> N/A</div>
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
        let items = [{},{},{},{}];
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
                        _.map(items, (item, i ) => {
                            return (
                                <Grid key={i} item xs={12}className="item-block">
                                    <Grid container>
                                        <Grid item xs={6}>
                                            California Yeast
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ textAlign: "center" }}> 2</div>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <div style={{ textAlign: "center" }}> $2.29</div>
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
                            line 1<br/>
                            line 2<br/>
                            <div className="block"> <span className="label">Card Holder: </span> Name</div>
                            <div className="block"> <span className="label">Card Number: </span> ************</div>
                        </Grid>
                        <Grid item sm={4}>
                            <div className="block"> <span className="label">Ship date: </span>1/1/1</div>
                            <div className="block"> <span className="label">Expected delivery date: </span>1/1/1</div>
                            <div className="block"> <span className="label">Ship Method: </span>UPS</div>
                            <div className="block"> <span className="label">Ship Total: </span> $22</div>
                        </Grid>
                        <Grid item sm={4}>
                            <div className="block label"> Ship Address:</div>
                            line 1<br/>
                            line 2<br/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        ) 
    }

    render() {
        const { classes } = this.props;
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
                        <div className="order-number">Order # 2625434</div>
                        <Grid container spacing={24}>
                            <Grid item container spacing={24}>
                                {this._renderSumamry()}
                                {this._renderItems()}
                                {this._renderPaymentShipping()}
                            </Grid>
                            
                            <Grid container dir="rtl">
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

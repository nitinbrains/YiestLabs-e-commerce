import React, { Component } from "react";
import { connect } from 'react-redux';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";

class Shipping extends Component {
    state = {
        address: true,
        newAddress: false,
        openDialog: false
    };

    handleDialogOpen = () => {
        this.setState({ openDialog: true });
    };

    handleDialogClose = () => {
        this.setState({ openDialog: false, newAddress:false });
    };

    handleNewAddress = () => {
        this.setState({ newAddress: true });
    };

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="title" gutterBottom>
                    Shipping address
                </Typography>
                {this.state.address ? (
                    <div>
                        <Typography>Address Line 1</Typography>
                        <Typography>Address Line 2</Typography>
                        <Typography>Address Line 3</Typography>
                        <Typography>City</Typography>
                        <Typography>Country, State</Typography>
                        <Typography>ZIP Code</Typography>

                        <Button style={{marginTop:10}} onClick={this.handleDialogOpen}>
                            Change Shipping Address
                        </Button>
                        <Dialog
                            open={this.state.openDialog}
                            onClose={this.handleDialogClose}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                Shipping addresses
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={24}>
                                    <Grid item xs={4}>
                                        <Paper className={classes.paper}>
                                            <Typography>
                                                Address Line 1
                                            </Typography>
                                            <Typography>
                                                Address Line 2
                                            </Typography>
                                            <Typography>
                                                Address Line 3
                                            </Typography>
                                            <Typography>City</Typography>
                                            <Typography>
                                                Country, State
                                            </Typography>
                                            <Typography>ZIP Code</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                            >
                                                Select Address
                                            </Button>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper className={classes.paper}>
                                            <Typography>
                                                Address Line 1
                                            </Typography>
                                            <Typography>
                                                Address Line 2
                                            </Typography>
                                            <Typography>
                                                Address Line 3
                                            </Typography>
                                            <Typography>City</Typography>
                                            <Typography>
                                                Country, State
                                            </Typography>
                                            <Typography>ZIP Code</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                            >
                                                Select Address
                                            </Button>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper className={classes.paper}>
                                            <Typography>
                                                Address Line 1
                                            </Typography>
                                            <Typography>
                                                Address Line 2
                                            </Typography>
                                            <Typography>
                                                Address Line 3
                                            </Typography>
                                            <Typography>City</Typography>
                                            <Typography>
                                                Country, State
                                            </Typography>
                                            <Typography>ZIP Code</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                            >
                                                Select Address
                                            </Button>
                                        </Paper>
                                    </Grid>
                                </Grid>

                                {this.state.newAddress ? (
                                    <Grid container spacing={24}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="attention"
                                                name="attention"
                                                label="Attention"
                                                fullWidth
                                                autoComplete="attention"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="addresse"
                                                name="addresse"
                                                label="Addresse"
                                                fullWidth
                                                autoComplete="addresse"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="address1"
                                                name="address1"
                                                label="Address line 1"
                                                fullWidth
                                                autoComplete="address-line1"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addiress2"
                                                name="addiress2"
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addiress3"
                                                name="addiress3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="city"
                                                name="city"
                                                label="City"
                                                fullWidth
                                                autoComplete="address-level2"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                id="zip"
                                                name="zip"
                                                label="Zip / Postal code"
                                                fullWidth
                                                autoComplete="postal-code"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                id="country"
                                                name="country"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                            />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleNewAddress}
                                        className={classes.button}
                                    >
                                        New Address
                                    </Button>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={this.handleDialogClose}
                                    color="primary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={this.handleDialogClose}
                                    color="primary"
                                >
                                    Confirm Changes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                ) : (
                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="attention"
                                name="attention"
                                label="Attention"
                                fullWidth
                                autoComplete="attention"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="addresse"
                                name="addresse"
                                label="Addresse"
                                fullWidth
                                autoComplete="addresse"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="address1"
                                name="address1"
                                label="Address line 1"
                                fullWidth
                                autoComplete="address-line1"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="addiress2"
                                name="addiress2"
                                label="Address line 2"
                                fullWidth
                                autoComplete="address-line2"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="addiress3"
                                name="addiress3"
                                label="Address line 3"
                                fullWidth
                                autoComplete="address-line3"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="city"
                                name="city"
                                label="City"
                                fullWidth
                                autoComplete="address-level2"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="zip"
                                name="zip"
                                label="Zip / Postal code"
                                fullWidth
                                autoComplete="postal-code"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="country"
                                name="country"
                                label="Country"
                                fullWidth
                                autoComplete="country"
                            />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2
    },
    button: {
        marginTop: 10
    }
});

Shipping.propTypes = {
    classes: PropTypes.object.isRequired
};



const mapStateToProps = (state) => {
	return {
		user: state.user,
		checkout: state.checkout
	}
}

const mapDispatchToProps = dispatch => {
	return {
		login: (username, password) => dispatch({ type: "LOGIN_REQUEST", username, password}),
		getInventory: (category, getAll) => dispatch({ type: "STORE_REQUEST", category, getAll}),
		addCartItem: (item, volIdIndex, quantity) => dispatch({type: "ADD_TO_CART", item, volIdIndex, quantity}),
		changeQuantity: (index, quantity) => dispatch({type: "CHANGE_QUANTITY", index, quantity}),
		deleteFromCart: (index) => dispatch({type: "DELETE_FROM_CART", index})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Shipping));

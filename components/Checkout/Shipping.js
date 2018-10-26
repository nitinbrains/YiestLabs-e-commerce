import React, { Component } from "react";
import { connect } from 'react-redux';
import SalesLib from '../../lib/SalesLib';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
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

    constructor(props) {
        super(props);
        this.state = {
            address: true,
            newAddress: false,
            openDialog: false,
            shipping: {
                attn: '',
                addresee: '',
                address2: '',
                address3: '',
                city: '',
                countryid: 'US',
                zip: ''
            }
        };
    }

    handleDialogOpen() {
        this.setState({ openDialog: true });
    };

    handleDialogClose() {
        this.setState({ openDialog: false, newAddress: false });
    };

    addNewAddress() {
        console.log('add new address', this.state.shipping)
    }

    render() {
        var { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="title" gutterBottom>
                    Shipping address
                </Typography>

                {this.props.user.shipping.id ? (
                    <div>
                        <Typography>{this.props.user.shipping.attn}</Typography>
                        <Typography>{this.props.user.shipping.addressee}</Typography>
                        <Typography>{this.props.user.shipping.address1}</Typography>
                        <Typography>{this.props.user.shipping.address2}</Typography>
                        <Typography>{this.props.user.shipping.address3}</Typography>
                        <Typography>{this.props.user.shipping.city}</Typography>
                        <Typography>{this.props.user.shipping.countryid}</Typography>
                        <Typography>{this.props.user.shipping.zip}</Typography>

                        <Button
                            style={{ marginTop: 10 }}
                            onClick={() => this.handleDialogOpen()}
                        >
                            Change Shipping Address
                        </Button>
                        <Dialog
                            open={this.state.openDialog}
                            onClose={() => this.handleDialogClose()}
                            aria-labelledby="form-dialog-title"
                        >
                            <DialogTitle id="form-dialog-title">
                                Shipping addresses
                            </DialogTitle>
                            <DialogContent>
                                <Grid container spacing={24}>
                                    {this.props.user.otherAddresses.map((address, i) =>
                                        <Grid item xs={4}>
                                            <Paper className={classes.paper}>
                                                <Typography>
                                                    {address.address1}
                                                </Typography>
                                                <Typography>
                                                    {address.address2}
                                                </Typography>
                                                <Typography>
                                                    {address.address3}
                                                </Typography>
                                                <Typography>
                                                    {address.city}
                                                </Typography>
                                                <Typography>
                                                    {address.countryid}
                                                </Typography>
                                                <Typography>
                                                    {address.zip}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.button}
                                                    onClick={() => this.props.setShipAddress(i)}
                                                >
                                                    Select Address
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    )}

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
                                                value={this.state.shipping.attn}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        attn: event.target.value
                                                    }
                                                })}
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
                                                value={this.state.shipping.addressee}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        addressee: event.target.value
                                                    }
                                                })}
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
                                                value={this.state.shipping.address1}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        address1: event.target.value
                                                    }
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addiress2"
                                                name="addiress2"
                                                label="Address line 2"
                                                fullWidth
                                                autoComplete="address-line2"
                                                value={this.state.shipping.address2}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        address2: event.target.value
                                                    }
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id="addiress3"
                                                name="addiress3"
                                                label="Address line 3"
                                                fullWidth
                                                autoComplete="address-line3"
                                                value={this.state.shipping.address3}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        address3: event.target.value
                                                    }
                                                })}
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
                                                value={this.state.shipping.city}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        city: event.target.value
                                                    }
                                                })}
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
                                                value={this.state.shipping.zip}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        zip: event.target.value
                                                    }
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                required
                                                id="country"
                                                name="country"
                                                label="Country"
                                                fullWidth
                                                autoComplete="country"
                                                value={this.state.shipping.countryid}
                                                onChange={(event) => this.setState({
                                                    shipping: {
                                                        ...this.state.shipping,
                                                        countryid: event.target.value
                                                    }
                                                })}
                                            >
                                            {
                                                SalesLib.COUNTRY_MAP.map((country, i) => {
                                                    return (
                                                        <MenuItem key={country.CountryCode} value={country.CountryCode}>{country.CountryName}</MenuItem>
                                                    )
                                                })
                                            }
                                            </TextField>
                                        </Grid>
                                        <DialogActions>
                                            <Button
                                                onClick={() => this.setState({newAddress: false})}
                                                color="primary"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => this.addNewAddress()}
                                                color="primary"
                                            >
                                                Confirm Changes
                                            </Button>
                                        </DialogActions>
                                    </Grid>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => this.setState({newAddress: true})}
                                        className={classes.button}
                                    >
                                        New Address
                                    </Button>
                                )}
                            </DialogContent>
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
                                value={this.state.shipping.attn}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        attn: event.target.value
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="addressee"
                                name="addressee"
                                label="Addressee"
                                fullWidth
                                autoComplete="addressee"
                                value={this.state.shipping.addressee}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        addressee: event.target.value
                                    }
                                })}
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
                                value={this.state.shipping.address1}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        address1: event.target.value
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="addiress2"
                                name="addiress2"
                                label="Address line 2"
                                fullWidth
                                autoComplete="address-line2"
                                value={this.state.shipping.address2}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        address2: event.target.value
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="addiress3"
                                name="addiress3"
                                label="Address line 3"
                                fullWidth
                                autoComplete="address-line3"
                                value={this.state.shipping.address3}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        address3: event.target.value
                                    }
                                })}
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
                                value={this.state.shipping.city}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        city: event.target.value
                                    }
                                })}
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
                                value={this.state.shipping.zip}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        zip: event.target.value
                                    }
                                })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                required
                                id="country"
                                name="country"
                                label="Country"
                                fullWidth
                                autoComplete="country"
                                value={this.state.shipping.countryid}
                                onChange={(event) => this.setState({
                                    shipping: {
                                        ...this.state.shipping,
                                        countryid: event.target.value
                                    }
                                })}
                            >
                                {
                                    SalesLib.COUNTRY_MAP.map((country, i) => {
                                        return (
                                            <MenuItem key={country.CountryCode} value={country.CountryCode}>{country.CountryName}</MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                    </Grid>
                )}

                <Typography variant="title" style={{marginTop:15}} gutterBottom>
                    Shipping method
                </Typography>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="select-shipping"
                            select
                            label="Select"
                            helperText="Please select your shipping method"
                            margin="normal"
                            variant="outlined"
                            value={this.props.user.shipmethod}
                            onChange={(event) => this.props.setShipMethod(event.target.value)}
                        >
                            {
                                this.props.user.shipMethods.map(method =>
                                    <MenuItem key={method.NSID} value={method.NSID}>{method.Name}</MenuItem>
                                )

                            }
                        </TextField>
                    </Grid>
                </Grid>
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
        setShipMethod: (shipmethod) => dispatch({type: "SET_SHIP_METHOD", shipmethod}),
        setShipAddress: (index) => dispatch({type: "SET_SHIP_ADDRESS", index})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Shipping));

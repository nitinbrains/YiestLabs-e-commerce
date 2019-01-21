import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address : {
                address1: "",
                address2: "",
                address3: "",
                addressee: "",
                attn: "",
                city: "",
                countryid: "",
                zip: "",
            }
        };
    }

    handleAddress = () => {
        const { user, type } = this.props;
        const { address } = this.state;
        if(type == 'shipping'){
            user.shipping.push(address);
            this.props.addAddress(address,type)
        } else if(type == 'billing'){
            user.billing.push(address);
            this.props.addAddress(address,type)            
        }
        this.props.close()

    }
    render() {
        const { classes } = this.props;
        const { address } = this.state;
        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            id="attention"
                            value={address.attn}
                            onChange={e => { this.setState({ address: { ...this.state.address, attn: e.target.value } }) }}
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
                            value={address.addressee}
                            onChange={e => { this.setState({ address: { ...this.state.address, addressee: e.target.value } }) }}                                                        
                            label="Addresse"
                            fullWidth
                            autoComplete="addresse"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="address1"
                            value={address.address1}
                            onChange={e => { this.setState({ address: { ...this.state.address, address1: e.target.value } }) }}                            
                            name="address1"
                            label="Address line 1"
                            fullWidth
                            autoComplete="address-line1"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="addiress2"
                            value={address.address2}
                            onChange={e => { this.setState({ address: { ...this.state.address, address2: e.target.value } }) }}
                            name="addiress2"
                            label="Address line 2"
                            fullWidth
                            autoComplete="address-line2"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="addiress3"
                            value={address.address3}
                            onChange={e => { this.setState({ address: { ...this.state.address, address3: e.target.value } }) }}
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
                            value={address.city}
                            onChange={e => { this.setState({ address: { ...this.state.address, city: e.target.value } }) }}
                            name="city"
                            label="City"
                            fullWidth
                            autoComplete="address-level2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            value={address.zip}
                            onChange={e => { this.setState({ address: { ...this.state.address, zip: e.target.value } }) }}
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
                            value={address.countryid}
                            onChange={e => { this.setState({ address: { ...this.state.address, countryid: e.target.value } }) }}
                            name="country"
                            label="Country"
                            fullWidth
                            autoComplete="country"
                        />
                    </Grid>
                    <Grid style={{marginTop:10}} container justify="flex-end">
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleAddress}
                            >
                                Add Address
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    addressBox: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    }
});

AddAddress.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddAddress);

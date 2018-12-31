import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

class AddAddress extends Component {
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
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

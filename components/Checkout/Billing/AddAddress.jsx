import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

// custom
import SalesLib from "../../../lib/SalesLib";
import { userActions } from "../../../redux/actions/userActions";

class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            billing: {
                attn: "",
                addresee: "",
                address1: "",
                address2: "",
                address3: "",
                city: "",
                countryid: "US",
                zip: ""
            }
        };
    }

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
                            value={this.state.billing.attn}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        attn: event.target.value
                                    }
                                })
                            }
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
                            value={this.state.billing.addressee}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        addressee: event.target.value
                                    }
                                })
                            }
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
                            value={this.state.billing.address1}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        address1: event.target.value
                                    }
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="addiress2"
                            name="addiress2"
                            label="Address line 2"
                            fullWidth
                            autoComplete="address-line2"
                            value={this.state.billing.address2}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        address2: event.target.value
                                    }
                                })
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="addiress3"
                            name="addiress3"
                            label="Address line 3"
                            fullWidth
                            autoComplete="address-line3"
                            value={this.state.billing.address3}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        address3: event.target.value
                                    }
                                })
                            }
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
                            value={this.state.billing.city}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        city: event.target.value
                                    }
                                })
                            }
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
                            value={this.state.billing.zip}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        zip: event.target.value
                                    }
                                })
                            }
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
                            value={this.state.billing.countryid}
                            onChange={event =>
                                this.setState({
                                    billing: {
                                        ...this.state.billing,
                                        countryid: event.target.value
                                    }
                                })
                            }
                        >
                            {SalesLib.COUNTRY_MAP.map((country, i) => {
                                return (
                                    <MenuItem
                                        key={country.CountryCode}
                                        value={country.CountryCode}
                                    >
                                        {country.CountryName}
                                    </MenuItem>
                                );
                            })}
                        </TextField>
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

const mapStateToProps = state => {
    return {
        user: state.user,
        checkout: state.checkout
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AddAddress));
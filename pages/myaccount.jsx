import React, { Component } from "react";

import PropTypes from "prop-types";
import Link from "next/link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import CardHeader from "../components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";

class MyAccount extends Component {
    render() {
        const { classes } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
            <div style={{width:'60%', justifyContent: "center", display: "block",marginLeft: "auto", marginRight:"auto"}}>
                <Card>
                    <CardHeader color="primary">
                        <Typography
                            color="secondary"
                            variant="display1"
                            align="center"
                        >
                            My Account
                        </Typography>
                    </CardHeader>

                    <CardBody>
                        <Typography variant="title" gutterBottom>
                            General Information
                        </Typography>
                        <Grid container spacing={24}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    disabled
                                    value="123"
                                    id="account"
                                    name="account"
                                    label="Account Number"
                                    fullWidth
                                    autoComplete="account"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="email"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    fullWidth
                                    autoComplete="phone"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    style={{ marginTop: -0.5 }}
                                    id="select-shipfrom"
                                    select
                                    fullWidth
                                    label="Ship From"
                                    margin="normal"
                                >
                                    <MenuItem>WhiteLabs USA</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Button style={{ marginTop: 10 }}>
                                    Change Password
                                </Button>
                            </Grid>
                        </Grid>

                        <Typography
                            variant="title"
                            style={{ marginTop: 30 }}
                            gutterBottom
                        >
                            Shipping Information
                        </Typography>
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
                            <Grid item xs={12}>
                                <Button style={{ marginTop: 10 }}>
                                    Manage Shipping Addresses
                                </Button>
                            </Grid>
                        </Grid>

                        <Typography
                            variant="title"
                            style={{ marginTop: 30 }}
                            gutterBottom
                        >
                            Billing Information
                        </Typography>
                        <Grid item xs={12}>
                            <Button style={{ marginTop: 10 }}>
                                Manage Credit Cards
                            </Button>
                        </Grid>
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
                            <Grid item xs={12}>
                                <Button style={{ marginTop: 10 }}>
                                    Manage Billing Addresses
                                </Button>
                            </Grid>
                        </Grid>

                        <div className={classes.buttonContainer}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                        >
                            Confirm Account Changes
                        </Button>
                        </div>
                    </CardBody>
                </Card>
                </div>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

MyAccount.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyAccount);

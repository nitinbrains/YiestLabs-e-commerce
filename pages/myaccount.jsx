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
import PageContainer from "../components/UI/PageContainer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ManageShipping from "../components/MyAccount/ManageShipping";
import ManageBilling from "../components/MyAccount/ManageBilling";
import ManageCards from "../components/MyAccount/ManageCards";

class MyAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manageShipping: false,
            manageBilling: false,
            manageCards: false,
            shipFrom: 1,
            confirmDialog: false
        };
    }

    manageShipping = () => {
        this.setState({ manageShipping: true });
    };

    closeShipping = () => {
        this.setState({ manageShipping: false });
    };

    manageBilling = () => {
        this.setState({ manageShipping: true });
    };

    closeBilling = () => {
        this.setState({ manageShipping: false });
    };

    manageCards = () => {
        this.setState({ manageCards: true });
    };

    closeCards = () => {
        this.setState({ manageCards: false });
    };

    handleShipFrom = event => {
        this.setState({ shipFrom: event.target.value });
        if (event.target.value == 4) {
            this.setState({ confirmDialog: true });
        }
    };
    closeConfirmDialog = () => {
        this.setState({ confirmDialog: false });
    };

    render() {
        const { classes } = this.props;

        return (
            <NavBarUserSearchDrawerLayout>
                <PageContainer heading="MY ACCOUNT" id="cart-box">
                    <Grid container spacing={24}>
                        <Grid
                            item
                            xs={12}
                            container
                            justify="center"
                            alignItems="center"
                            style={{ marginBottom: 20 }}
                        >
                            <Grid item xs={3}>
                                <Typography
                                    style={{ textAlign: "center" }}
                                    variant="title"
                                    gutterBottom
                                >
                                    Account # 43148
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    required
                                    variant="outlined"
                                    id="email"
                                    value={"testemail@mail.com"}
                                    name="email"
                                    label="Email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    required
                                    variant="outlined"
                                    id="phone"
                                    name="phone"
                                    label="Phone"
                                    autoComplete="phone"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    variant="outlined"
                                    id="select-shipfrom"
                                    select
                                    fullWidth
                                    onChange={this.handleShipFrom}
                                    value={this.state.shipFrom}
                                    label="Ship From"
                                >
                                    <MenuItem value={1}>
                                        WL United States
                                    </MenuItem>
                                    <MenuItem value={2}>WL Copenhagen</MenuItem>
                                    <MenuItem value={3}>WL Hong Kong</MenuItem>
                                    <MenuItem value={4}>
                                        Create WL Account
                                    </MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid item container justify="center">
                            <Grid
                                item
                                xs={12}
                                md={5}
                                container
                                style={{ marginRight: 30, textAlign: "center" }}
                            >
                                <Grid item xs={12}>
                                    <Typography
                                        style={{ textAlign: "left" }}
                                        variant="h6"
                                        color="textPrimary"
                                    >
                                        SHIPPING INFORMATION
                                    </Typography>

                                    <div
                                        className={classes.sectionTitleDivider}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="attention"
                                        name="attention"
                                        label="Attention"
                                        fullWidth
                                        autoComplete="attention"
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="city"
                                        name="city"
                                        label="City"
                                        fullWidth
                                        autoComplete="address-level2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                    <Button
                                        onClick={this.manageShipping}
                                        style={{ marginTop: 10 }}
                                    >
                                        Manage Shipping Addresses
                                    </Button>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                md={5}
                                container
                                style={{ marginLeft: 30, textAlign: "center" }}
                            >
                                <Grid item xs={12}>
                                    <Typography
                                        style={{ textAlign: "left" }}
                                        variant="h6"
                                        color="textPrimary"
                                    >
                                        BILLING INFORMATION
                                    </Typography>

                                    <div
                                        className={classes.sectionTitleDivider}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="attention"
                                        name="attention"
                                        label="Attention"
                                        fullWidth
                                        autoComplete="attention"
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="city"
                                        name="city"
                                        label="City"
                                        fullWidth
                                        autoComplete="address-level2"
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                <Grid item xs={12} md={7}>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        onClick={this.manageBilling}
                                    >
                                        Manage Billing Addresses
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Button
                                        style={{ marginTop: 10 }}
                                        onClick={this.manageCards}
                                    >
                                        Manage Cards
                                    </Button>
                                </Grid>
                            </Grid>
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

                    <Dialog
                        open={this.state.manageShipping}
                        maxWidth={"sm"}
                        fullWidth
                    >
                        <ManageShipping closeDialog={this.closeShipping} />
                    </Dialog>

                    <Dialog
                        open={this.state.manageBilling}
                        maxWidth={"sm"}
                        fullWidth
                    >
                        <ManageBilling closeDialog={this.closeBilling} />
                    </Dialog>

                    <Dialog
                        open={this.state.manageCards}
                        maxWidth={"sm"}
                        fullWidth
                    >
                        <ManageCards closeDialog={this.closeCards} />
                    </Dialog>
                    <Dialog open={this.state.confirmDialog}>
                        <DialogTitle id="alert-dialog-title">
                            {"Do you wish to create a new WL Account?"}
                        </DialogTitle>
                        <DialogActions>
                            <Button
                                onClick={this.closeConfirmDialog}
                                color="primary"
                            >
                                No
                            </Button>
                            <Button
                                onClick={this.closeConfirmDialog}
                                color="primary"
                                autoFocus
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </PageContainer>
            </NavBarUserSearchDrawerLayout>
        );
    }
}
const styles = theme => ({
    container: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.up("md")]: {
            marginLeft: 50,
            marginRight: 50
        },
        [theme.breakpoints.up("lg")]: {
            marginLeft: 150,
            marginRight: 150
        },
        [theme.breakpoints.up("xl")]: {
            marginLeft: 250,
            marginRight: 250
        }
    },
    title: {
        backgroundColor: "#FF9933",
        padding: 5,
        marginBottom: theme.spacing.unit * 4,
        textAlign: "center",
        marginLeft: theme.spacing.unit * -4,
        marginRight: theme.spacing.unit * -4
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    }
});

MyAccount.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MyAccount);

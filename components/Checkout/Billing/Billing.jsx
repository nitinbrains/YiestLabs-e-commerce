import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";

import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import WLHelper from "../../../lib/WLHelper";
import SalesLib from "../../../lib/SalesLib";
import Utils from "../../../lib/Utils";
import { userActions } from "../../../redux/actions/userActions";

import ManageAddresses from "./ManageAddresses";
import AddAddress from "./AddAddress";

import ManageCards from "./ManageCards";
import AddCard from "./AddCard";

class Billing extends Component {
    constructor(props) {
        super(props);
        this.currentMonth = new Date().getMonth().toString();
        this.currentYear = new Date().getFullYear().toString();
        this.state = {
            terms: "",
            openDialogCard: false,
            openDialogAddress: false,
            addCard: false,
            newAddress: false,
            manageAddresses: false,
            manageCards: false,
            billing: {
                attn: "",
                addresee: "",
                address1: "",
                address2: "",
                address3: "",
                city: "",
                countryid: "US",
                zip: ""
            },
            card: {
                name: "",
                number: "",
                expireMonth: this.currentMonth,
                expireYear: this.currentYear
            },
            expirationDates: Utils.getExpirationDates()
        };
    }

    manageAddresses = () => {
        this.setState({ manageAddresses: true });
    };

    closeAddresses = () => {
        this.setState({ manageAddresses: false });
    };

    handleNewCard = () => {
        this.setState({ newCard: !this.state.newCard });
    };

    handleUseCard = () => {
        this.setState({ useCard: !this.state.useCard });
    };

    handleDialogCardOpen = () => {
        this.setState({ openDialogCard: true });
    };

    handleDialogCardClose = () => {
        this.setState({ openDialogCard: false, newCard: false });
    };

    handleNewAddress = () => {
        this.setState({ newAddress: true });
    };

    handleDialogAddressOpen = () => {
        this.setState({ openDialogAddress: true });
    };

    handleDialogAddressClose = () => {
        this.setState({ openDialogAddress: false, newAddress: false });
    };

    closeAddresses = () => {
        this.setState({ manageAddresses: false });
    };

    manageCards = () => {
        this.setState({ manageCards: true });
    };

    closeCards = () => {
        this.setState({ manageCards: false });
    };

    addNewAddress() {
        this.props.addShipAddress(this.state.billing);
        this.handleDialogClose();
    }

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="textPrimary">
                            PAYMENT
                        </Typography>
                        <div className={classes.sectionTitleDivider} />

                        {WLHelper.getPaymentTerm(this.state.terms) ==
                            "Credit Card" ||
                            (WLHelper.getPaymentTerm(this.state.terms) ==
                            "None" ? (
                                this.props.user.selectedCard.id ? (
                                    <div>
                                        <Typography>
                                            {this.props.user.selectedCard.ccname}
                                        </Typography>
                                        <Typography>
                                            {
                                                this.props.user.selectedCard
                                                    .ccnumber
                                            }
                                        </Typography>
                                        <Typography>
                                            {moment(this.props.user.selectedCard.ccexpire).format("MM-YYYY")}
                                        </Typography>
                                        <Button
                                            style={{ marginTop: 10 }}
                                            onClick={this.manageCards}
                                        >
                                            Change Card
                                        </Button>
                                    </div>
                                ) : (
                                    <Grid item xs={12}>
                                        <AddCard />
                                        <Grid
                                            style={{ marginTop: 10 }}
                                            container
                                            justify="flex-end"
                                        >
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={this.addNewCard}
                                                >
                                                    Add Card
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )
                            ) : (
                                <div>
                                    <Typography variant="body2">
                                        NET10
                                    </Typography>
                                    <Typography>Your Payment</Typography>
                                    <Typography>Information</Typography>
                                    <Grid container spacing={24}>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        color="primary"
                                                        name="newCard"
                                                        onChange={
                                                            this.handleUseCard
                                                        }
                                                    />
                                                }
                                                label="Use Credit Card"
                                            />
                                        </Grid>
                                    </Grid>
                                    {this.props.user.selectedCard.id ? (
                                        <div>
                                        <Typography>
                                            {this.props.user.selectedCard.ccname}
                                        </Typography>
                                        <Typography>
                                            {
                                                this.props.user.selectedCard
                                                    .ccnumber
                                            }
                                        </Typography>
                                        <Typography>
                                            {moment(this.props.user.selectedCard.ccexpire).format("MM-YYYY")}
                                        </Typography>
                                            <Button
                                                style={{ marginTop: 10 }}
                                                onClick={this.manageCards}
                                            >
                                                Change Card
                                            </Button>
                                        </div>
                                    ) : (
                                        <Grid item xs={12}>
                                            <AddCard />
                                            <Grid
                                                style={{ marginTop: 10 }}
                                                container
                                                justify="flex-end"
                                            >
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={
                                                            this.addNewCard
                                                        }
                                                    >
                                                        Add Card
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )}
                                </div>
                            ))}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="textPrimary">
                            BILLING ADDRESS
                        </Typography>

                        <div className={classes.sectionTitleDivider} />
                        {this.props.user.selectedBilling.id ? (
                            <div>
                                <Typography>
                                    {this.props.user.selectedBilling.attn}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.addressee}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.address1}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.address2}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.address3}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.city}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.countryid}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedBilling.zip}
                                </Typography>

                                <Button
                                    style={{ marginTop: 10 }}
                                    onClick={this.manageAddresses}
                                >
                                    Change Billing Address
                                </Button>
                            </div>
                        ) : (
                            <Grid item xs={12}>
                                <AddAddress addAddress={this.addNewAddress} />
                                
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Dialog
                    open={this.state.manageAddresses}
                    maxWidth={"sm"}
                    fullWidth
                >
                    <ManageAddresses closeDialog={this.closeAddresses} />
                </Dialog>

                <Dialog open={this.state.manageCards} maxWidth={"sm"} fullWidth>
                    <ManageCards closeDialog={this.closeCards} />
                </Dialog>
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
    },
    close: { position: "absolute", right: 0, top: 0 },
    selected: {
        border: "solid 2px",
        borderColor: "#f28411"
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    }
});

Billing.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        order: state.order
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Billing));

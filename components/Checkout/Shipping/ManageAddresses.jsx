import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import AddAddress from "./AddAddress";

// custom
import SalesLib from "../../../lib/SalesLib";
import { userActions } from "../../../redux/actions/userActions";

class ManageAddresses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAddress: false,
            shipping: {
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

    handleDialogClose() {
        this.props.closeDialog();
    }

    newAddress = () => {
        this.setState({ newAddress: true });
    };

    addNewAddress() {
        this.props.addShipAddress(this.state.shipping);
        this.handleDialogClose();
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
                    <Grid style={{ padding: 10 }} container spacing={24}>
                        {this.props.user.otherAddresses.map((address, i) => (
                            <Grid item sm={4} xs={12}>
                                <div
                                    className={
                                        this.props.user.shipping.address1 ==
                                        address.address1
                                            ? classes.addressBoxSelected
                                            : classes.addressBox
                                    }
                                >
                                    <Grid item container xs spacing={8}>
                                        <Grid item>
                                            <Typography>
                                                {this.props.user.shipping.attn}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {
                                                    this.props.user.shipping
                                                        .addressee
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {
                                                    this.props.user.shipping
                                                        .address1
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {
                                                    this.props.user.shipping
                                                        .address2
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {
                                                    this.props.user.shipping
                                                        .address3
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {this.props.user.shipping.city}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {
                                                    this.props.user.shipping
                                                        .countryid
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {this.props.user.shipping.zip}
                                            </Typography>
                                        </Grid>

                                        {this.props.user.shipping.address1 !=
                                            address.address1 && (
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() =>
                                                        this.props.setBillAddress(
                                                            i
                                                        )
                                                    }
                                                >
                                                    Select Address
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </div>
                            </Grid>
                        ))}

                        {!this.state.newAddress ? (
                            <Grid item xs={12}>
                                <Button
                                    onClick={this.newAddress}
                                    color="primary"
                                >
                                    Add New Address
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <AddAddress />
                                <Grid
                                    style={{ marginTop: 10 }}
                                    container
                                    justify="flex-end"
                                >
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => this.addNewAddress()}
                                        >
                                            Add Address
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    addressBox: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    },
    addressBoxSelected: {
        border: "solid 2px",
        borderColor: "#f28411",
        padding: theme.spacing.unit * 2
    },
    close: { position: "absolute", right: 0, top: 0 }
});

ManageAddresses.propTypes = {
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
)(withStyles(styles)(ManageAddresses));

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
import CancelIcon from "@material-ui/icons/Cancel";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { userActions } from 'appRedux/actions/userActions';

import AddAddress from "./AddAddress";

class ManageBilling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAddress: false,
            boxHover: false,
            confirmation: false
        };
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    newAddress = () => {
        this.setState({ newAddress: true });
    };

    closeForm = () => {
        this.setState({ newAddress: false });
    };

    selectDefaultAddress = address => {
        this.props.setDefaultBillAddress({ address });
    };

    handleCardHover = i => {
        this.setState({ boxHover: i });
    };

    handleCardLeaveHover = () => {
        this.setState({ boxHover: null });
    };

    handleConfirmation = address => {
        this.setState({
            confirmation: true,
            deleteAddress: address
        });
    };

    handleNo = () => {
        this.setState({
            confirmation: false
        });
    };

    handleYes = () => {
        const address = this.state.deleteAddress;
        this.props.deleteAddress({ address });
        this.setState({
            confirmation: false
        });
    };

    render() {
        const { classes, user } = this.props;

        return (
            <React.Fragment>
                <DialogContent id="my-order-details">
                <div className="main-block">
                <div className="order-number">
                <Typography variant="h6" color="textPrimary">
                MANAGE BILLING ADDRESSES
                </Typography>
                </div>
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
                    <Grid
                        item
                        container
                        xs
                        style={{
                            display: "flex",
                            marginTop: -10,
                            marginBottom: 10
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item xs={12}>
                            {/* <Typography variant="h6" color="textPrimary">
                                MANAGE BILLING ADDRESSES
                            </Typography>
                            <div className={classes.sectionTitleDivider} /> */}
                        </Grid>
                    </Grid>
                    <Grid style={{ padding: 20 }} container spacing={24}>
                        {user.otherAddresses.map((address, i) => (
                            <Grid item key={address.id} sm={4} xs={12}>
                                <div
                                    className={
                                        this.props.user.billing.address1 ==
                                        address.address1
                                            ? classes.addressBoxSelected
                                            : classes.addressBox
                                    }
                                    onMouseEnter={() => this.handleCardHover(i)}
                                    onMouseLeave={this.handleCardLeaveHover}
                                >
                                    <div
                                        className={classNames(
                                            classes.deleteIcon,
                                            this.state.boxHover != i &&
                                                classes.hide
                                        )}
                                    >
                                        <IconButton
                                            color="inherit"
                                            size="small"
                                            aria-label="Menu"
                                            onClick={e => {
                                                this.handleConfirmation(
                                                    address
                                                );
                                            }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </div>
                                    <Grid
                                        item
                                        container
                                        xs
                                        spacing={8}
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <Typography>
                                                {address.address1}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {address.address2}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                {address.address3}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {address.city}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {address.zip}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                {address.countryid}
                                            </Typography>
                                        </Grid>
                                        {this.props.user.billing.address1 !=
                                            address.address1 &&
                                            !this.props.checkout && (
                                                <Grid item>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        style={{bottom:2}}
                                                        onClick={e => {
                                                            this.selectDefaultAddress(
                                                                address
                                                            );
                                                        }}
                                                        className={classNames(
                                                            this.state
                                                                .boxHover !=
                                                                i &&
                                                                classes.hide
                                                        )}
                                                    >
                                                        Set as Default
                                                    </Button>
                                                </Grid>
                                            )}
                                        {this.props.checkout && (
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    style={{bottom:2}}
                                                    color="primary"
                                                    onClick={() =>
                                                        this.props.setBillAddress(
                                                            i
                                                        )
                                                    }
                                                >
                                                    Select
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
                                    variant="outlined"
                                >
                                    Add New Address
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <AddAddress
                                    type={"billing"}
                                    {...this.props}
                                    close={this.closeForm}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Dialog open={this.state.confirmation}>
                        <DialogTitle id="alert-dialog-title">
                            Are you sure you want to delete this address?
                        </DialogTitle>
                        <DialogContent />
                        <DialogActions>
                            <Button color="primary" onClick={this.handleNo}>
                                No
                            </Button>
                            <Button
                                color="primary"
                                autoFocus
                                onClick={this.handleYes}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                    </div>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    addressBox: {
        position: "relative",
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        height: 180
    },
    addressBoxSelected: {
        position: "relative",
        border: "solid 2px",
        borderColor: "#f28411",
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        height: 180
    },
    close: { position: "absolute", right: 0, top: 0 },
    deleteIcon: { position: "absolute", right: -25, top: -25 },
    hide: {
        display: "none"
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    }
});

ManageBilling.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ManageBilling));

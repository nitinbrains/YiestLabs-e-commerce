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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { userActions } from "appRedux/actions/userActions";
import AddAddress from "./AddAddress";

import _get from "lodash/get";

class ManageBilling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAddress: false,
            boxHover: false,
            lastBoxHover: false, //This is so the "set as default" box hangs around when the user moves off the box to click it
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
        this.setState({ boxHover: i, lastBoxHover: i });
        this.setState({ lastBoxHover: i });
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

    handleCancelAddress=(data)=>{
        this.setState({
            newAddress:data
        })
    }

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

    handleClickAway = (e) => {
        if (e.target.nodeName !== "LI") {
            // Hack to not close the form if the user scrolls up in
            // the Country ID field until the mouse moves outside of
            // it, and then they click.
            var text = _get(e.target, "textContent");
            if (!text || !text.startsWith("United States")) {
              this.props.closeDialog();
            }
        }
    }

    selectAddress = (address) => {
        const { checkout, setBillAddress, setDefaultBillAddress } = this.props;

        if (checkout) {
            setBillAddress({ address });
        } else {
            setDefaultBillAddress({ address })
        }
        this.props.closeDialog();
    }

    render() {
        const { classes, user } = this.props;
        return (
            <React.Fragment>
                  <ClickAwayListener onClickAway={this.handleClickAway}>
                <DialogContent id="my-order-details">
                <div className={classes.close}>
                            <IconButton style={{padding:'4.5px'}} color="inherit" size="small" aria-label="Menu" onClick={() => this.handleDialogClose()}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    <div className="main-block">
                        <div className="order-number">
                            <Typography variant="h6" color="textPrimary">
                                MANAGE BILLING ADDRESSES
                            </Typography>
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
                            </Grid>
                        </Grid>
                        <Grid style={{ padding: 20 }} container spacing={24}>
                            {user.otherAddresses.map((address, i) => (
                                <Grid item key={address.id} sm={4} xs={12}>
                                    <div
                                        className={this.props.user.billing.address1 == address.address1 ? classes.addressBoxSelected : classes.addressBox}
                                        onMouseEnter={() => this.handleCardHover(i)}
                                        onMouseLeave={this.handleCardLeaveHover}
                                    >
                                        <div className={classNames(classes.deleteIcon, this.state.boxHover != i && classes.hide)}>
                                            <IconButton
                                                color="inherit"
                                                size="small"
                                                aria-label="Menu"
                                                onClick={e => this.handleConfirmation(address)}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </div>
                                        <Grid item container xs spacing={8} justify="center" alignItems="center">
                                            <Grid item>
                                                <Typography>
                                                    <div className="block">
                                                        <span className="label">Address line 1: </span>
                                                        {address.address1}
                                                    </div>
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography>
                                                    {address.address2 && (
                                                        <div className="block">

                                                            <span className="label">Address line 2: </span>
                                                            {address.address2}
                                                        </div>
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography>
                                                    {address.address3 && (
                                                        <div className="block">
                                                            <span className="label">Address line 3: </span>
                                                            {address.address3}
                                                        </div>
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <div className="block">
                                                        <span className="label">City: </span>
                                                        {address.city}
                                                    </div>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <div className="block">
                                                        <span className="label">Zip-Code: </span>
                                                        {address.zip}
                                                    </div>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography>
                                                    <div className="block">
                                                        <span className="label">Country: </span>
                                                        {address.countryid}
                                                    </div>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div style={{ textAlign: "center"}}>
                                        {this.props.user.billing.address1 != address.address1 && (
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    style={{ bottom: 2 }}
                                                    onClick={e => this.selectAddress(address)}
                                                    className={classNames(this.state.lastBoxHover != i && classes.hide)}
                                                >
                                                    Set as Default
                                                </Button>
                                            </Grid>
                                        )}
                                    </div>
                                </Grid>
                            ))}

                            {!this.state.newAddress ? (
                                <Grid item xs={12}>
                                    <Button onClick={this.newAddress} color="primary" variant="outlined">
                                        Add New Address
                                    </Button>
                                </Grid>
                            ) : (
                                <Grid item xs={12}>
                                    <AddAddress {...this.props} close={this.closeForm} handleCancelAdd={this.handleCancelAddress} />
                                </Grid>
                            )}
                        </Grid>
                        <Dialog open={this.state.confirmation}>
                            <DialogTitle id="alert-dialog-title">Are you sure you want to delete this address?</DialogTitle>
                            <DialogContent />
                            <DialogActions>
                                <Button color="primary" onClick={this.handleNo}>
                                    No
                                </Button>
                                <Button color="primary" autoFocus onClick={this.handleYes}>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </DialogContent>
                </ClickAwayListener>
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
        height: 300,
        overflowY: "scroll",
        overflowX: "hidden"
    },
    addressBoxSelected: {
        position: "relative",
        border: "solid 2px",
        borderColor: "#f28411",
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        height: 300,
        overflowY: "scroll",
        overflowX: "hidden"
    },
    close: { position: 'relative',display: 'flex',justifyContent: 'flex-end' },
    deleteIcon: { position: "absolute", right: -5, top: -5 },
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

const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ManageBilling));

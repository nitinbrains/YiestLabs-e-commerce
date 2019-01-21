import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import ManageAddresses from "./ManageAddresses";
import AddAddress from "./AddAddress";

// custom
import SalesLib from "../../../lib/SalesLib";
import { userActions } from "../../../redux/actions/userActions";

class Shipping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: true,
            manageAddresses: false
        };
    }

    manageAddresses = () => {
        this.setState({ manageAddresses: true });
    };

    closeAddresses = () => {
        this.setState({ manageAddresses: false });
    };

    render() {
        var { classes } = this.props;

        return (
            <React.Fragment>
                <Grid container spacing={24}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="textPrimary">
                            SHIPPING ADDRESS
                        </Typography>
                        <div className={classes.sectionTitleDivider} />

                        {this.props.user.selectedShipping.id ? (
                            <div>
                                <Typography>
                                    {this.props.user.selectedShipping.attn}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.addressee}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.address1}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.address2}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.address3}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.city}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.countryid}
                                </Typography>
                                <Typography>
                                    {this.props.user.selectedShipping.zip}
                                </Typography>

                                <Button
                                    style={{ marginTop: 10 }}
                                    onClick={this.manageAddresses}
                                >
                                    Change Shipping Address
                                </Button>
                            </div>
                        ) : (
                            <AddAddress />
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" color="textPrimary">
                            SHIPPING METHOD
                        </Typography>
                        <div className={classes.sectionTitleDivider} />
                        <TextField
                            id="select-shipping"
                            select
                            label="Select"
                            helperText="Please select your shipping method"
                            margin="normal"
                            variant="outlined"
                            value={this.props.user.shipmethod}
                            onChange={event =>
                                this.props.setShipMethod(event.target.value)
                            }
                        >
                            {this.props.user.shipMethods.map(method => (
                                <MenuItem key={method.NSID} value={method.NSID}>
                                    {method.Name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Dialog
                    open={this.state.manageAddresses}
                    maxWidth={"sm"}
                    fullWidth
                >
                    <ManageAddresses closeDialog={this.closeAddresses} />
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

Shipping.propTypes = {
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
)(withStyles(styles)(Shipping));

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

import { userActions } from '../../redux/actions/userActions';

import AddAddress from "./AddAddress";

class ManageBilling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newAddress: false
        };
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    newAddress = () => {
        this.setState({ newAddress: true });
    };

    closeForm = () => {
        this.setState({ newAddress: false})
    }

    render() {
        const { classes, user } = this.props;

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
                        {user.billing.map(address => (
                            <Grid item
                                key={address.id}
                                sm={4}
                                xs={12}
                            >
                                <div className={classes.addressBoxSelected}>
                                    <Grid item container xs spacing={8}>
                                        <Grid item>
                                            <Typography>{address.address1}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{address.address2}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography>{address.address3}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{address.city}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{address.zip}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>{address.countryid}</Typography>
                                        </Grid>
                                    {this.props.user.selectedShipping.address1 !=
                                        address.address1 && (
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
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
                                <AddAddress type={'billing'} {...this.props} close={this.closeForm} />
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

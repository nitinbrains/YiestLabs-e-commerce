import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import moment from "moment";

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
import TextField from "@material-ui/core/TextField";


import AddCard from "./AddCard";
import { userActions } from "appRedux/actions/userActions";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    render() {
        const { classes, user } = this.props;
        return (
            <React.Fragment>
                 <ClickAwayListener onClickAway={this.handleClickAway}>
                <DialogContent id="change-password">
                    <div className="main-block">
                        <div className="order-number">
                            <Typography variant="h6" color="textPrimary">
                                CHANGE PASSWORD
                            </Typography>
                        </div>
                        <div className={classes.close}>
                            <IconButton color="inherit" size="small" aria-label="Menu" onClick={() => this.handleDialogClose()}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <Grid style={{ padding: 20 }} container item spacing={24} justify="center" alignItems="center">
                            <Grid item xs={12} md={6} justify="center" alignItems="center">
                                    <TextField
                                        name="password"
                                        variant="outlined"
                                        label="Password"
                                        autoComplete="password"
                                    />
                            </Grid>
                            <Grid item xs={12} md={6}  justify="center" alignItems="center">
                                    <TextField
                                        name="cpassword"
                                        variant="outlined"
                                        label="Confirm Password"
                                    />
                            </Grid>
                        </Grid>

                        <div className={classes.buttonContainer}>
                            <Button variant="contained" color="primary" type="submit" className={classes.button}>
                                Change Password
                            </Button>
                        </div>

                    </div>
                </DialogContent>
                </ClickAwayListener>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    close: { position: "absolute", right: 0, top: 0 },
    hide: {
        display: "none"
    },
    sectionTitleDivider: {
        borderTop: "solid 1.5px",
        borderColor: "#CCCCCC",
        marginBottom: 10
    },
    buttonContainer: {
        display: "flex"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
});

ChangePassword.propTypes = {
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
)(withStyles(styles, { withTheme: true })(ChangePassword));

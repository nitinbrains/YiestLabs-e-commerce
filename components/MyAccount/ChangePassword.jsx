import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import _get from "lodash/get";
import _set from "lodash/set";
import _isEqual from "lodash/isEqual";
import _isEmpty from "lodash/isEmpty";

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
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";

import Banner from "../UI/Banner";
import SimpleSnackbar from "../Form/SimpleSnackbar";

import AddCard from "./AddCard";
import { userActions } from "appRedux/actions/userActions";
import { messageActions } from "appRedux/actions/messageActions";
import { Formik, Form, Field } from "formik";

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};
class ChangePassword extends Component {
    constructor(props) {
        super(props);
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    validate = values => {
        var errors = {};

        if (!_get(values, "password")) {
            _set(errors, "password", "Password is required");
        }

        if (!_get(values, "confirmPassword")) {
            _set(errors, "confirmPassword", "Confirm password is required");
        }

        else if (!_isEqual(_get(values, "password"), _get(values, "confirmPassword"))) {
            _set(errors, "confirmPassword", "Passwords must be equal");
        }

        return errors;
    };

    changePassword = (values, { setErrors }) => {
        let errors = this.validate(values);
        if (_isEmpty(errors)) {
            this.props.changePassword({ newPassword: _get(values, "password") });
            this.props.closeDialog();
        } else {
            setErrors(errors);
        }
    };

    render() {
        const { classes, user, messages } = this.props;
        return (
            <React.Fragment>
                 <Banner />
                <SimpleSnackbar
                    messageList={messages.snackbar || []}
                    handleClose={() => props.hideSnackbar()}
                />
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
                            <Formik 
                                onSubmit={(values, actions) => this.changePassword(values, actions)} 
                                enableReinitialize
                            >
                                {({ errors }) => {
                                    return (
                                        <Form>
                                            <Grid style={{ padding: 20 }} container item spacing={24} justify="center" alignItems="center">
                                                <Field
                                                    render={({ field: { value, onChange } }) => {
                                                        return (
                                                            <Grid item xs={12} md={6} justify="center" alignItems="center">
                                                                <FormikErrorMessage error={_get(errors, 'password')} />
                                                                <TextField
                                                                    type="password"
                                                                    name="password" 
                                                                    variant="outlined" 
                                                                    label="Password" 
                                                                    autoComplete="password"
                                                                    value={_get(value, 'password') || ''}
                                                                    onChange={onChange}
                                                                />
                                                            </Grid>
                                                        );
                                                    }}
                                                />
                                                <Field
                                                    type="password"
                                                    render={({ field: { value, onChange } }) => {
                                                        return (
                                                            <Grid item xs={12} md={6} justify="center" alignItems="center">
                                                                <FormikErrorMessage error={_get(errors, 'confirmPassword')} />
                                                                <TextField 
                                                                    type="password"
                                                                    name="confirmPassword" 
                                                                    variant="outlined" 
                                                                    label="Confirm Password"
                                                                    autoComplete="confirmPassword"
                                                                    value={_get(value, 'confirmPassword') || ''}
                                                                    onChange={onChange}
                                                                />
                                                            </Grid>
                                                        );
                                                    }}
                                                />
                                                <div className={classes.buttonContainer}>
                                                    <Button variant="contained" color="primary" type="submit" className={classes.button}>
                                                        Change Password
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </Form>
                                    );
                                }}
                            </Formik>
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
    }
});

ChangePassword.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        messages: state.messages
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({...userActions, ...messageActions }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(ChangePassword));

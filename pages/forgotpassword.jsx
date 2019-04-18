import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _get from "lodash/get";
import _set from "lodash/set";
import _isEmpty from "lodash/isEmpty";

import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import CardHeader from "components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import SimpleSnackbar from "components/Form/SimpleSnackbar";
import { Formik, Form, Field } from "formik";

import { messageActions } from "appRedux/actions/messageActions";
import { userActions } from 'appRedux/actions/userActions';

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};

function ForgotPassword(props) {
    const { classes, messages } = props;

    const validate = (values) => {
        let errors = {};

        if(!_get(values, 'email')) {
            _set(errors, 'email', 'Email is required');
        }

        return errors;
    }

    const forgotPassword = (values, { setErrors }) => {
        let errors = validate(values);
        if(_isEmpty(errors)) {
            props.forgotPassword({email: values.email});
        } else {
            setErrors(errors);
        }
    }

    return (
        <React.Fragment>
            <main className={classes.layout}>
                <SimpleSnackbar
                    messageList={messages.snackbar || []}
                    handleClose={() => this.props.hideSnackbar()}
                />
                <Card>
                    <CardHeader color="primary">
                        <div className={classes.logo}>
                            <a href="/">
                                <img
                                    src="static/images/logoHeader.png"
                                    width="100%"
                                />
                            </a>
                        </div>
                    </CardHeader>

                    <CardBody>
                        <Typography variant="headline" align="center">
                            Forgot Password
                        </Typography>
                        <Formik
                            onSubmit={(values, actions) => forgotPassword(values, actions)}
                        >
                            {({ errors }) => {
                                return (
                                    <Form>
                                        <Field
                                            render={({ field: { value, onChange }}) => {
                                                return (
                                                    <FormControl margin="normal" required fullWidth>
                                                        <TextField
                                                            label="Email Address"
                                                            margin="normal"
                                                            fullWidth
                                                            name="email"
                                                            autoFocus
                                                            value={_get(value, 'email') || ''}
                                                            onChange={onChange}
                                                        />
                                                    </FormControl>
                                                );
                                            }}
                                        />
                                        <FormikErrorMessage error={_get(errors, 'email')} />
                                        <Button type="submit" fullWidth variant="raised" color="primary" className={classes.submit}>
                                            Reset Password
                                        </Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </CardBody>
                </Card>
            </main>
        </React.Fragment>
    );
}

const styles = theme => ({
    layout: {
        width: "auto",
        display: "block",
        marginTop: theme.spacing.unit * 7,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        },
        justifyContent: "center"
    },
    logo: {
        alignContent: "center",
        padding: "10"
    },
    form: {
        width: "100%", // Fix IE11 issue.
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    },
    button: {
        margin: theme.spacing.unit
    }
});

ForgotPassword.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        messages: state.messages,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({ ...userActions, ...messageActions }, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(ForgotPassword));

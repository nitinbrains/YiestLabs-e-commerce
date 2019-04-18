import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import LockIcon from "@material-ui/icons/LockOutlined";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import CardHeader from "components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Formik, Form, Field } from 'formik';
import _get from "lodash/get";
import { userActions } from "appRedux/actions/userActions";
import * as Yup from 'yup';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { messageActions } from 'appRedux/actions/messageActions';

function ForgotPassword(props) {
    const { classes, messages } = props;
    const customFormValidation = Yup.object().shape({
        resetPassword: Yup.string()
            .email('Enter Valid Email')
            .required('Required'),
      });
    return (
        <React.Fragment>
            <main className={classes.layout}>
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


                        <form className={classes.form}>
                        <Formik
                        initialValues={{
                            resetPassword:'',
                        }}
                        validationSchema={customFormValidation}
                        
                        onSubmit={values => {
                            values.email = values.resetPassword;
                            props.forgotPassword(values);
                        }}
                        >
                        {({ errors, touched, isValidating }) => {
                            return(
                                <Form>
                                    <Field 
                                    name="resetPassword" 
                                    component={(props)=>{
                                    return(
                                        <FormControl margin="normal" required fullWidth>
                                            <TextField
                                            label="Email Address"
                                            margin='normal'
                                            fullWidth
                                            id="email"
                                            name="email"
                                            autoFocus
                                            value={props.field.value}
                                            onChange={event =>
                                                {
                                                props.form.setFieldValue('resetPassword',event.target.value);
                                            }
                                            }
                                        />  
                                        </FormControl>
                                        )
                                        }}
                                    />
                                    {errors.resetPassword && touched.resetPassword && <div style={{color:'red'}} >{errors.resetPassword}</div>}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="raised"
                                        color="primary"
                                        className={classes.submit}
                                    >
                                        Reset Password
                                    </Button>
                                </Form>
                            )
                        }}
                        </Formik>
                            {/* <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">
                                    Email Address
                                </InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="raised"
                                color="primary"
                                className={classes.submit}
                            >
                                Reset Password
                            </Button> */}
                        </form>
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

const mapDispatchToProps = dispatch =>
    bindActionCreators({ ...userActions, ...messageActions }, dispatch);

export default connect(
    null,
    mapDispatchToProps
)(withStyles(styles)(ForgotPassword));

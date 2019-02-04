import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import Link from "next/link";
import Router from 'next/router';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import CardHeader from "../components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// custom
import Alert from "../components/UI/Alert";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { userActions } from "../redux/actions/userActions";
import { messageActions } from '../redux/actions/messageActions';
import FormTextbox from "../components/Form/FormTextbox";
import SimpleSnackbar from "../components/Form/SimpleSnackbar";

const customFormValidation = Yup.object().shape({
    username: Yup.string()
      .required('Required'),
    password: Yup.string()
      .required('Required'),
  });

class Login extends Component {
    constructor(props) {
        super(props);
    }
    initialFormValue = {
        username: '',
        password: '',
    }
    componentWillMount(){
        let isUserLoggedIn = sessionStorage.getItem('isLoggedin')
        const { user } = this.props;
        if(isUserLoggedIn || (user && user.id && user.id !== null)){
            Router.push('/')
        }
    }
    componentWillReceiveProps(props){
        if(props.user.id && props.user.id !== null){
            Router.push('/')
        }
    }
    login(values) {
        if (values.username && values.password) {
            this.props.userLogin(values);            
        }
    }
    displayAlert = (messageList=[], type) => {
        let alert = []
        messageList.map((message, i) => {
            if(message.displayType === 'banner')
            alert.push(
                <Alert message={message} index={i} type={type} />
            )
        })
        return alert;
    }
    render() {
        const { classes, messages, loading:{isLoading, type} } = this.props;
        return (
            <React.Fragment>
                {this.displayAlert(messages.messages, 'message')}
                {this.displayAlert(messages.networkRequestError, 'networkError')}
                <LoadingIndicator visible={isLoading && (type === 'userLogin' || type === 'getUserInfo' || type === 'setUserInfo') } />
                <main className={classes.layout}>
                    <div className={classes.container}>
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                marginLeft: "auto",
                                marginRight: "auto",
                                width: 130,
                                top: -60
                            }}
                        >
                            <img
                                src="../../static/images/logo_circle.png"
                                height="130"
                            />
                        </div>

                        <Typography variant="headline" align="center">
                            Sign in
                        </Typography>

                    <Formik
                        initialValues={this.initialFormValue}
                        validationSchema={customFormValidation}
                        onSubmit={values => this.login(values)}
                    >
                        {({ values, errors, touched, handleChange }) => {
                        return(
                            <div className={classes.form}>
                                <Form> 
                                    <FormControl margin="normal" required fullWidth>
                                        <TextField
                                            name="username"
                                            label="Username / Email Address"
                                            variant="outlined"
                                            margin='normal'
                                            fullWidth
                                            onChange={handleChange}
                                            value={values.username}
                                        />
                                    </FormControl>
                                    {errors.username && touched.username && <div style={{color:'red'}} >{errors.username}</div>}
                                    <FormControl margin="normal" required fullWidth>
                                        <TextField
                                            name="password"
                                            label="Password"
                                            variant="outlined"
                                            type="password"
                                            margin='normal'
                                            onChange={handleChange}
                                            value={values.password}
                                        />
                                    </FormControl>
                                    {errors.password && touched.password && <div style={{color:'red'}} >{errors.password}</div>}
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="raised"
                                        color="primary"
                                        className={classes.submit}
                                        
                                    >
                                        Sign in
                                    </Button>
                                </Form>
                            </div>  
                        )   
                        }}
                    </Formik>
                       
                        <Grid container spacing={24}>
                            <Grid item xs={12} md={6}>
                                <Link prefetch href="/registration">
                                    <Button className={classes.button}>
                                        Create Account
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Link prefetch href="/forgotpassword">
                                    <Button className={classes.button}>
                                        Forgot Password
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </main>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    layout: {
        position: "relative",
        width: "auto",
        display: "block",
        marginTop: theme.spacing.unit * 15,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto"
        },
        justifyContent: "center",
        backgroundColor:"#fafafa"
    },
    container: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        paddingTop: 80,
        padding: theme.spacing.unit * 4
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

Login.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        inventory: state.inventory,
        cart: state.cart,
        messages: state.messages,
        loading: state.loading
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators({...userActions, ...messageActions}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Login));

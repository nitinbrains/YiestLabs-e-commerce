import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import Link from "next/link";
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
import FormTextbox from "../components/Form/FormTextbox";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            focus:'email'
        };
    }

    login() {
        if (this.state.username && this.state.password) {
            this.props.userLogin(this.state);
        }
    }

    handleChange = (e) => {
        if(e.target.name == 'email'){
            this.setState({
                username: e.target.value
            })
        } else {
            this.setState({
                password: e.target.value
            })
        }
    }

    render() {
        const { classes } = this.props;
        const  { username, password, focus } = this.state;
        const customFormValidation = Yup.object().shape({
            username: Yup.string()
              .required('Required'),
            password: Yup.string()
              .required('Required'),
          });
        return (
            <React.Fragment>
                {this.props.message.messages.map((message, i) => (
                    <Alert message={message} index={i} />
                ))}
                <LoadingIndicator visible={this.props.loading.isLoading && this.props.loading.type == 'userLogin' } />

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
                        initialValues={{
                            username,
                            password,
                        }}
                        validationSchema={customFormValidation}
                        
                        onSubmit={values => {
                            // same shape as initial values
                            if (this.state.username && this.state.password) {
                                this.props.userLogin(this.state);
                            }
                        }}
                        >
                            {({ errors, touched, isValidating }) => {
                            return(
                            <div className={classes.form}>
                                <Form>
                                <Field 
                                    name="username" 
                                    component={(props)=>{
                                    return(
                                        <FormControl margin="normal" required fullWidth>
                                        <TextField
                                            variant="outlined"
                                            label="Username / Email Address"
                                            margin='normal'
                                            fullWidth
                                            id="email"
                                            onFocus={e => {
                                                // if (focus !== 'email')
                                                //     this.setState({
                                                //         focus : 'email'
                                                //     })
                                            }}
                                            name="email"
                                            autoComplete="email"
                                            autoFocus={ focus === 'email' }
                                            value={props.field.value}
                                            onChange={event =>
                                                {
                                                props.form.setFieldValue('username',event.target.value);
                                                this.handleChange(event)
                                            }
                                            }
                                        />
                                      </FormControl> 
                                    
                                    )
                                    }}
                                />
                                {errors.username && touched.username && <div style={{color:'red'}} >{errors.username}</div>}
                                <Field 
                                    name="password" 
                                    component={(props)=>{
                                    return(
                                        <FormControl margin="normal" required fullWidth>
                                            <TextField
                                                label="Password"
                                                variant="outlined"
                                                name="password"
                                                type="password"
                                                margin='normal'
                                                onFocus={e => {
                                                    // if (focus !== 'password')
                                                    //     this.setState({
                                                    //         focus : 'password'
                                                    //     })
                                                }}
                                                id="password"
                                                autoComplete="current-password"
                                                autoFocus={focus === 'password'}
                                                value={props.field.value}
                                                onChange={event =>{
                                                    props.form.setFieldValue('password',event.target.value);
                                                    this.handleChange(event)
                                                }
                                                }
                                            />
                                         </FormControl>
                                    )
                                    }}
                                />
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
        message: state.messages,
        loading: state.loading
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Login));

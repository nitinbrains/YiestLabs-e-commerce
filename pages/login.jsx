import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import Link from "next/link";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import CardHeader from "../components/UI/Card/CardHeader.jsx";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

// custom
import Alert from '../components/UI/Alert';
import LoadingIndicator from '../components/UI/LoadingIndicator';
import { userActions } from '../redux/actions/userActions';

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    login(){
        if (this.state.username && this.state.password){
            this.props.userLogin(this.state);
        }
    }

    render(){

        const { classes } = this.props;

        return (
            <React.Fragment>

                {this.props.message.messages.map((message, i) => <Alert message={message} index={i}/> )}
                <LoadingIndicator visible={this.props.user.isLoading} />

                <main className={classes.layout}>
                    <Card>
                        <CardHeader color="primary">
                            <div className={classes.logo}>
                                <img
                                    src="../../static/images/logoHeader.png"
                                    width="100%"
                                />
                            </div>
                        </CardHeader>

                        <CardBody>
                            <Typography variant="headline" align="center">
                                Sign in
                            </Typography>

                            <div className={classes.form}>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="email">
                                        Username / Email Address
                                    </InputLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={this.state.username}
                                        onChange={(event) => this.setState({username: event.target.value})}
                                    />
                                </FormControl>
                                <FormControl margin="normal" required fullWidth>
                                    <InputLabel htmlFor="password">
                                        Password
                                    </InputLabel>
                                    <Input
                                        name="password"
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        value={this.state.password}
                                        onChange={(event) => this.setState({password: event.target.value})}
                                    />
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="raised"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={() => this.login()}
                                >
                                    Sign in
                                </Button>
                            </div>
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
                        </CardBody>
                    </Card>
                </main>
            </React.Fragment>
        );
    }
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

Login.propTypes = {
    classes: PropTypes.object.isRequired
};



const mapStateToProps = (state) => {
    return {
        user: state.user,
        inventory: state.inventory,
        cart: state.cart,
        message: state.messages
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login))

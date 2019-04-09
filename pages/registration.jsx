import React from "react";
import { connect } from "react-redux";
import Router from 'next/router';
import { compose } from "redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import isEmpty from 'lodash/isEmpty';
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "components/NavBar/NavBarLayout";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LoadingIndicator from "components/UI/LoadingIndicator";
import General from "components/Registration/General";
import Shipping from "components/Registration/Shipping";
import Billing from "components/Registration/Billing";
import CardInfo from "components/Registration/CardInfo";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import MobileStepper from '@material-ui/core/MobileStepper';
import { userActions } from 'appRedux/actions/userActions';

const steps = ["General Information", "Shipping Address", "Billing Address", "Credit Card Information"];

class Registration extends React.Component {
    state = {
        activeStep: 0,
        isSameAddress: false,
    };

    handleSameAddress = (e) =>{
        this.setState({ isSameAddress: e.target.checked })
    }

    handleStep = step => () => {
        this.setState( {activeStep: step });
    };

    handleReset = () => {
        this.setState({ activeStep: 0 });
    };

    onNext = () => {
        const { activeStep } = this.state;
        this.setState({activeStep: activeStep + 1});
    }

    onBack = () => {
        const { activeStep } = this.state;
        if (activeStep > 0) {
            this.setState({activeStep: activeStep - 1});
        }
    }

    onSubmit = (values) => {
        this.props.createUser(values);
    }

    renderRegistrationSuccess = () => {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="headline" gutterBottom>
                    You are now registered.
                </Typography>
                <Typography variant="subheading">Thank you for registering. You will receive an email shortly with your user information.</Typography>
            </React.Fragment>
        )
    }

    renderRegistrationFailure = () => {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Typography variant="headline" gutterBottom>
                    Registration failed.
                </Typography>
                <Button onClick={this.handleReset} variant="contained" color="primary"  className={classes.button}>
                    Try again
                </Button>
            </React.Fragment>
        )
    }

    componentDidUpdate(){        
        if(this.props.user.isSuccess){   //need to look again
        Router.push('/')
        }
    }

    render() {
        const { classes, user, loading: {isLoading, type}} = this.props;
        const { activeStep } = this.state;
        let renderBody = '';
        
        // if(activeStep < steps.length ){
        //     renderBody = this.getStepContent(activeStep)
        // } 
        // if(activeStep === steps.length && user.registrationAttempt && user.registrationStatus === 'success'){
        //     renderBody = this.renderRegistrationSuccess();
        // } 
        // else if(activeStep === steps.length && user.registrationAttempt && user.registrationStatus === 'failed'){
        //     renderBody = this.renderRegistrationFailure();
        // } 

        return (
            <NavBarLayout>
                <LoadingIndicator visible={isLoading && type === 'createUser' } />
                <div className={classes.container}>
                    <div className={classes.title}>
                        <Typography variant="h4" className="reg-typovariant" color="secondary">
                            REGISTRATION
                        </Typography>
                    </div>
                    <MobileStepper
                       variant="dots"
                        steps={4}
                         position="static"
                        activeStep={this.state.activeStep}
                       className={classes.root}
                     />
                    <Stepper nonLinear activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label, index) => {
                            const props = {};
                            const buttonProps = {};
                            return (
                                <Step key={label} {...props}  className={
                                    label === "Items" && classes.step
                                }>
                                    <StepButton onClick={this.handleStep(index)} {...buttonProps}>
                                        {label}
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Formik
                        onSubmit={(values, actions) => this.onSubmit(values, actions)}
                        render={props => {
                            let view = null;

                            var handlerProps = {
                                onBack: this.onBack,
                                onNext: this.onNext,
                                ...props
                            };

                            switch (activeStep) {
                                default:
                                case 0:
                                    view = <General {...handlerProps} />;
                                    break;
                                case 1:
                                    view = <Shipping {...handlerProps} />;
                                    break;
                                case 2:
                                    view = <Billing {...handlerProps} />;
                                    break;
                                case 3:
                                    view = <CardInfo {...handlerProps} onSubmit={this.onSubmit} />;
                                    break;
                                
                            }

                            return (
                                <Form>
                                    {view}
                                </Form>
                            )
                        }}
                    />
                </div>
            </NavBarLayout>
        );
    }
}

const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            padding: theme.spacing.unit * 3
        }
    },
    root: {
        display:'flex',
        justifyContent:'center',
        display:'flex',
        [theme.breakpoints.up('md')]: {
            display:'none'
          }
      },
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
        backgroundColor: "#fafafa",
        width: "100%",
        display:'flex',
        [theme.breakpoints.down('sm')]: {
            display:'none'
          }
    },
    step: {
        width: "98px"
    },
    container: {
        marginTop: 50,
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.down('sm')]: {
            marginTop:68, 
            marginLeft:-54
          },
        [theme.breakpoints.up("md")]: {
            marginLeft: 50,
            marginRight: 50,
        },
        [theme.breakpoints.up("lg")]: {
            marginLeft: 150,
            marginRight: 150
        },
        [theme.breakpoints.up("xl")]: {
            marginLeft: 250,
            marginRight: 250
        }
    },
    title: {
        backgroundColor: "#FF9933",
        padding: 5,
        marginBottom: theme.spacing.unit * 4,
        textAlign: "center",
        marginLeft: theme.spacing.unit * -4,
        marginRight: theme.spacing.unit * -4,
    }
});


const mapStateToProps = state => {
    return {
        user: state.user,
        loading: state.loading,
        success:state.success
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(compose(
    withStyles(styles, { withTheme: true })(
        Registration
    )
))


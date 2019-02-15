import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
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

import { userActions } from 'appRedux/actions/userActions';

const steps = ["General Information", "Shipping Address", "Billing Address", "Credit Card Information"];
const customFormValidation = Yup.object().shape({

    // General
    companyName: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    phone: Yup.number().required("Required"),
    pass: Yup.string().required("Required"),
    cPass: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    orderFrom: Yup.string().required("Required"),
    acContact: Yup.string().required("Required"),
    acPhone: Yup.string().required("Required")
});

class Registration extends React.Component {
    state = {
        activeStep: 0,
        formValues: {},
        isSameAddress: false,
    };

    handleNext = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1
        });
    };

    getStepContent(step) {
        let {formValues, isSameAddress} = this.state;
        switch (step) {
            case 0:
                return <General formValue={formValues[0]} submit={this.submit} />;
            case 1:
                return <Shipping formValue={formValues[1]} submit={this.submit} handleSameAddress={this.handleSameAddress} isSameAddress={isSameAddress}/>;
            case 2:
                return <Billing formValue={formValues[2]} submit={this.submit} />;
            case 3:
                return <CardInfo formValue={formValues[3]} submit={this.submit} />;
            default:
                throw new Error("Unknown step");
        }
    }
    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep - 1
        });
    };

    handleReset = () => {
        this.setState({
            activeStep: 0
        });
    };

    handleStep = step => () => {
        this.setState({
            activeStep: step
        });
    };
    handleSameAddress = (e) =>{
        this.setState({
            isSameAddress: e.target.checked
        })
    }
    submit = (values)=>{
        let {formValues, activeStep, isSameAddress} = this.state;
        formValues[activeStep] = values;
        if(activeStep === 1 && isSameAddress){
            formValues[activeStep + 1] = values;
        }
        this.setState({
            activeStep: activeStep + 1,
            formValues
        })
        if(activeStep === steps.length - 1 && Object.keys(formValues).length === steps.length){
            this.props.createUser(formValues);
        }
    }

    handleSameAddress = (e) =>{
        this.setState({
            isSameAddress: e.target.checked
        })
    }

    submit = (values) => {
        let {formValues, activeStep, isSameAddress} = this.state;
        formValues[activeStep] = values;
        
        if(activeStep === 1 && isSameAddress){
            formValues[activeStep + 1] = values;
        }
        this.setState({activeStep: activeStep + 1, formValues });
        
        if(activeStep === steps.length - 1 && Object.keys(formValues).length === steps.length){
            this.props.createUser(formValues);
        }
    }

    onChangeStep = (step) => {

    }

    onSubmit = (values) => {
        
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

    getStepContent(step) {
        let {formValues, isSameAddress} = this.state;

        switch (step) {
            case 0:
                return <General formValue={formValues[0]} submit={this.submit} />;
            case 1:
                return <Shipping formValue={formValues[1]} submit={this.submit} handleSameAddress={this.handleSameAddress} isSameAddress={isSameAddress}/>;
            case 2:
                return <Billing formValue={formValues[2]} submit={this.submit} />;
            case 3:
                return <CardInfo formValue={formValues[3]} submit={this.submit} />;
            default:
                throw new Error("Unknown step");
        }
    }

    render() {
        const { classes, user,  loading: {isLoading, type}} = this.props;
        const { activeStep } = this.state;
        let formBody = '';
        
        // if(activeStep < steps.length ){
        //     formBody = this.getStepContent(activeStep)
        // } 
        // else if(activeStep === steps.length && user.registrationAttempt && user.registrationStatus === 'success'){
        //     formBody = this.renderRegistrationSuccess();
        // } 
        // else if(activeStep === steps.length && user.registrationAttempt && user.registrationStatus === 'failed'){
        //     formBody = this.renderRegistrationFailure();
        // } 
        // else {
        //     formBody = t;
        // }
        return (
            <NavBarLayout>
                <LoadingIndicator visible={isLoading && type === 'createUser' } />
                <div className={classes.container}>
                    <div className={classes.title}>
                        <Typography variant="h4" color="secondary">
                            REGISTRATION
                        </Typography>
                    </div>
                    <Stepper nonLinear activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label, index) => {
                            const props = {};
                            const buttonProps = {};
                            return (
                                <Step key={label} {...props}>
                                    <StepButton onClick={this.handleStep(index)} className={classes.stepper} {...buttonProps}>
                                        {label}
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Formik
                        onSubmit={(values, actions) => console.log('submit', values)}
                        // validationSchema={customFormValidation}
                        initialValues={{companyname: user.companyname}}
                        render={props => {
                            return (
                                <Form>
                                    <General {...props}/>
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
        width: "100%"
    },
    container: {
        marginTop: 50,
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.up("md")]: {
            marginLeft: 50,
            marginRight: 50
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
        marginRight: theme.spacing.unit * -4
    }
});

Registration.propTypes = {
    classes: PropTypes.object.isRequired
};


const mapStateToProps = state => {
    return {
        user: state.user,
        loading: state.loading
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


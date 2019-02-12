import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "components/NavBar/NavBarLayout";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import CardHeader from "components/UI/Card/CardHeader.jsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import General from "components/Registration/General";
import Shipping from "components/Registration/Shipping";
import Billing from "components/Registration/Billing";
import CardInfo from "components/Registration/CardInfo";

const steps = [
    "General Information",
    "Shipping Address",
    "Billing Address",
    "Credit Card Information"
];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <General />;
        case 1:
            return <Shipping />;
        case 2:
            return <Billing />;
        case 3:
            return <CardInfo />;
        default:
            throw new Error("Unknown step");
    }
}

class Registration extends React.Component {
    state = {
        activeStep: 0
    };

    handleNext = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep + 1
        });
    };

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

    render() {
        const { classes } = this.props;
        const { activeStep } = this.state;

        return (
            <NavBarLayout>
            <div className={classes.container}>
                <div className={classes.title}>
                    <Typography variant="h4" color="secondary">
                        REGISTRATION
                    </Typography>
                </div>
                            <Stepper
                                nonLinear
                                activeStep={activeStep}
                                className={classes.stepper}
                            >
                                {steps.map((label, index) => {
                                    const props = {};
                                    const buttonProps = {};
                                    return (
                                        <Step key={label} {...props}>
                                            <StepButton
                                                onClick={this.handleStep(index)}
                                                className={classes.stepper}
                                                {...buttonProps}
                                            >
                                                {label}
                                            </StepButton>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            <React.Fragment>
                                {activeStep === steps.length ? (
                                    <React.Fragment>
                                        <Typography
                                            variant="headline"
                                            gutterBottom
                                        >
                                            You are now registered.
                                        </Typography>
                                        <Typography variant="subheading">
                                            Thank you for registering. You will receive an email shortly with your user information.
                                        </Typography>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {getStepContent(activeStep)}
                                        <div className={classes.buttons}>
                                            {activeStep !== 0 && (
                                                <Button
                                                    onClick={this.handleBack}
                                                    className={classes.button}
                                                >
                                                    Back
                                                </Button>
                                            )}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                className={classes.button}
                                            >
                                                {activeStep === steps.length - 1
                                                    ? "Register"
                                                    : "Next"}
                                            </Button>
                                        </div>
                                    </React.Fragment>
                                )}
                            </React.Fragment>
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
        width: '100%'
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
    },
});

Registration.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Registration);

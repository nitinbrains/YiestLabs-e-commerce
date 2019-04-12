import React, { Component } from "react";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { orderActions } from "appRedux/actions/orderActions";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Link from "next/link";
import NavBarLayout from "components/NavBar/NavBarLayout";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import LoadingIndicator from "components/UI/LoadingIndicator";
import CardHeader from "components/UI/Card/CardHeader.jsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import MobileStepper from "@material-ui/core/MobileStepper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import Shipping from "components/Checkout/Shipping/Shipping";
import Billing from "components/Checkout/Billing/Billing";
import Items from "components/Checkout/Items/Items";
import Review from "components/Checkout/Review/Review";
import RemovedItems from "components/Checkout/RemovedItems/RemovedItems";

import isLoggedUser from "hocs/isLoggedUser";
import cartHasItems from "hocs/cartHasItems";
import prepareOrder from "hocs/prepareOrder";
import orderFinished from "hocs/orderFinished";
import { cartActions } from "appRedux/actions/cartActions";

// custom
import Alert from "components/UI/Alert";

const steps = ["Shipping", "Billing", "Items/Ship Dates", "Review your order"];

function getStepContent(step) {
    switch (step) {
        case 0:
            return <Shipping />;
        case 1:
            return <Billing />;
        case 2:
            return <Items />;
        case 3:
            return <Review />;
        default:
            throw new Error("Unknown step");
    }
}

class Checkout extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        activeStep: 0,
        isLoading: false,
        terms: false,
        confirmation: false,
        completed: {},
        showWantSoonerDialog: false,
        couponCode: this.props.order.couponCode
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            showWantSoonerDialog: nextProps.cart.showWantSooner
        };
    }
    handleOrder = () => {
        this.setState({ terms: true });
    };

    handleTerms = () => {
        this.setState({ terms: false });
    };

    placeOrder = () => {
        this.setState({ terms: false });
        this.props.placeOrder();
    };

    handleCloseTerms = () => {
        this.setState({ terms: false });
    };

    handleComplete = () => {
        const { completed } = this.state;
        completed[this.state.activeStep] = true;
        this.setState({ completed });
        this.handleNext();
    };

    handleNext = () => {
        const { activeStep } = this.state;
        if (activeStep == steps.length - 1) {
            this.props.placeOrder();
        } else {
            this.setState({ activeStep: activeStep + 1 });
        }
    };

    handleBack = () => {
        const { activeStep } = this.state;
        this.setState({ activeStep: activeStep - 1 });
    };

    handleReset = () => {
        this.setState({ activeStep: 0 });
    };

    handleStep = step => () => {
        const { completed } = this.state;
        completed[this.state.activeStep] = true;
        this.setState({ completed, activeStep: step });
    };

    handleChangeCouponCode = event => {
        this.setState({ couponCode: event.target.value });
        this.props.order.couponCode = event.target.value;
    };

    render() {
        const { classes, order, loading } = this.props;
        let { activeStep } = this.state;

        if (loading.type === "orderComplete") {
            activeStep = steps.length;
        }

        return (
            <NavBarLayout>
                <LoadingIndicator visible={loading.isLoading && loading.type == "placeOrder"} label={"Placing Order"} />
                <div className={classes.container}>
                    <div className={classes.title}>
                        <Typography variant="h4" color="secondary">
                            CHECKOUT
                        </Typography>
                    </div>

                    <RemovedItems />

                    <MobileStepper variant="dots" steps={4} position="static" activeStep={this.state.activeStep} className={classes.root} />
                    <Stepper nonLinear activeStep={activeStep} className={classes.stepper}>
                        {steps.map((label, index) => {
                            const props = {};
                            return (
                                <Step key={label} className={label === "Items" && classes.step}>
                                    <StepButton onClick={this.handleStep(index)} completed={this.state.completed[index]}>
                                        <StepLabel>
                                            {label}
                                            {label === "Items/Ship Dates" && loading.isLoading && loading.type == "prepareOrder" && <CircularProgress size={10} />}
                                        </StepLabel>
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <React.Fragment>
                        {activeStep != steps.length && (
                            <React.Fragment>
                                {getStepContent(activeStep)}
                                <div style={activeStep === steps.length - 1 ? { visible: "true", display: "block", textAlign: "right", width: "100%" } : { visible: "false", display: "none" }}>
                                    Coupon Code: &nbsp;
                                    <input type="text" name="couponCode" value={this.state.couponCode} onChange={this.handleChangeCouponCode.bind(this)} />
                                    <p style={{ fontSize: "small" }}>
                                      Coupons will be reflected in "My Orders" and<br />email confirmation following your order.
                                    </p>
                                </div>
                                <div className={classes.buttons}>
                                    {activeStep !== 0 && (
                                        <Button onClick={this.handleBack} className={classes.button}>
                                            Back
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={activeStep == 2 && loading.isLoading && loading.type == "prepareOrder"}
                                        onClick={activeStep === steps.length - 1 ? this.handleOrder : this.handleComplete}
                                        className={classes.button}
                                    >
                                        {activeStep === 2 && loading.isLoading && loading.type == "prepareOrder" && <CircularProgress size={20} />}

                                        {activeStep === steps.length - 1 ? "Place order" : activeStep === 2 && loading.isLoading && loading.type == "prepareOrder" ? "Loading" : "Next"}
                                    </Button>
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                </div>
                <Dialog open={this.state.terms}>
                    <DialogTitle id="alert-dialog-title">
                        Do you accept the{" "}
                        <a href="https://www.whitelabs.com/resources/ordering-information" target="_blank">
                            White Labs Terms &amp; Conditions
                        </a>
                        ?
                    </DialogTitle>
                    <DialogContent />
                    <DialogActions>
                        <Button onClick={this.handleCloseTerms} color="primary">
                            Decline
                        </Button>
                        <Button onClick={this.placeOrder} color="primary" autoFocus>
                            Accept
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.confirmation}>
                    <DialogTitle id="alert-dialog-title">Your order has been confirmed</DialogTitle>
                    <DialogContent />
                    <DialogActions>
                        <Link href="/">
                            <Button color="primary" autoFocus>
                                Continue
                            </Button>
                        </Link>
                    </DialogActions>
                </Dialog>
            </NavBarLayout>
        );
    }
}

const styles = theme => ({
    container: {
        marginTop: 50,
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 4,
        [theme.breakpoints.down("sm")]: {
            marginTop: 68,
            marginLeft: -54
        },
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
    root: {
        display: "flex",
        justifyContent: "center",
        display: "flex",
        [theme.breakpoints.up("md")]: {
            display: "none"
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
    step: {
        width: "98px"
    },
    paper: {
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            padding: theme.spacing.unit * 3
        }
    },
    stepper: {
        padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`,
        backgroundColor: "#fafafa",
        display: "flex",
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

Checkout.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        cart: state.cart,
        user: state.user
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(cartActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(compose(withStyles(styles, { withTheme: true })(isLoggedUser(cartHasItems(prepareOrder(orderFinished(Checkout)))))));

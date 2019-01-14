import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { orderActions } from "../redux/actions/orderActions";

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../components/NavBar/NavBarLayout";
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import CardHeader from "../components/UI/Card/CardHeader.jsx";
import CircularProgress from '@material-ui/core/CircularProgress';
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Shipping from "../components/Checkout/Shipping/Shipping";
import Billing from "../components/Checkout/Billing/Billing";
import Items from "../components/Checkout/Items/Items";
import Review from "../components/Checkout/Review/Review";
import isLoggedUser from "../hocs/isLoggedUser";
import cartHasItems from '../hocs/cartHasItems';

// custom
import Alert from "../components/UI/Alert";

const steps = ["Shipping", "Billing", "Items", "Review your order"];

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

    componentWillMount() {
        this.props.prepareOrder();
    }

    state = {
        activeStep: 0
    };

    handleNext = () => {
        const { activeStep } = this.state;

        if(activeStep == steps.length - 1) {
            this.props.placeOrder();
        } else {
            this.setState({
                activeStep: activeStep + 1
            });
        }
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

    render() {
        const { classes, order } = this.props;
        const { activeStep } = this.state;

        return (
            <NavBarLayout>
                {this.props.message.messages.map((message, i) => (
                    <Alert message={message} index={i} />
                ))}
                <div className={classes.container}>
                    <div className={classes.title}>
                        <Typography variant="h4" color="secondary">
                            CHECKOUT
                        </Typography>
                    </div>
                    <Stepper
                        activeStep={activeStep}
                        className={classes.stepper}
                    >
                        {steps.map(label => (
                            <Step key={label} 
                            className={ label === 'Items' && classes.step}
                             >
                                <StepLabel>
                                 {label}
                                 {label === 'Items' && order.isLoading &&
                                 <CircularProgress size={10} />
                                 } 
                                 </StepLabel>
                                
                            </Step>
                        ))}
                    </Stepper>
                    <React.Fragment>
                        {activeStep === steps.length ? (
                            <React.Fragment>
                                <Typography variant="headline" gutterBottom>
                                    Thank you for your order.
                                </Typography>
                                <Typography variant="subheading">
                                    Your order number is #2001539. We have
                                    emailed your oder confirmation, and will
                                    send you an update when your order has
                                    shipped.
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
                                            ? "Place order"
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
    step:{
        width:'98px'
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
        user: state.user,
        cart: state.cart,
        message: state.messages,
        order: state.order
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(orderActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })( isLoggedUser(cartHasItems(Checkout))));

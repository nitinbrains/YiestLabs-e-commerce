import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { orderActions } from '../redux/actions/orderActions';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../components/NavBar/NavBarLayout";
import Card from "../components/UI/Card/Card.jsx";
import CardBody from "../components/UI/Card/CardBody.jsx";
import CardHeader from "../components/UI/Card/CardHeader.jsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Shipping from "../components/Checkout/Shipping/Shipping";
import Billing from "../components/Checkout/Billing/Billing";
import Items from "../components/Checkout/Items/Items";
import Review from "../components/Checkout/Review/Review";

// custom
import Alert from '../components/UI/Alert';

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

	render() {
		const { classes } = this.props;
		const { activeStep } = this.state;

		return (
			<NavBarLayout>

				{this.props.message.messages.map((message, i) => <Alert message={message} index={i}/> )}

				<div className={classes.layout}>
					<Card>
						<CardHeader color="primary">
							<Typography color="secondary" variant="display1" align="center">
								Checkout
							</Typography>
						</CardHeader>

						<CardBody>
							<Stepper activeStep={activeStep} className={classes.stepper}>
								{steps.map(label => (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
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
											Your order number is #2001539. We have emailed your oder
											confirmation, and will send you an update when your order
											has shipped.
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
						</CardBody>
					</Card>
				</div>
			</NavBarLayout>
		);
	}
}

const styles = theme => ({
	layout: {
		width: "auto",
		marginLeft: theme.spacing.unit * 2,
		marginRight: theme.spacing.unit * 2,
		[theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
			width: 600,
			marginLeft: "auto",
			marginRight: "auto"
		}
	},
	paper: {
		padding: theme.spacing.unit * 2,
		[theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
			padding: theme.spacing.unit * 3
		}
	},
	stepper: {
		padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
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

const mapStateToProps = (state) => {
    return {
    	user: state.user,
        cart: state.cart,
		message: state.message
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(orderActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Checkout));

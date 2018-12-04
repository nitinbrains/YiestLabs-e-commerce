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

import Grid from '@material-ui/core/Grid';

// custom
import Alert from '../components/UI/Alert';
import Textbox from '../components/Form/Textbox'
import Selectbox from '../components/Form/Selectbox'
import FormButton from '../components/Form/FormButton'

class Calculator extends Component {

	constructor(props) {
		super(props);
		this.state = {
      volume: "",
      liter: "",
      gravity: "",
      plato: "",
      temperature: "",
      celsius: "",
      units: "",
      labgrown: ""
    }
	}

	componentWillMount() {
	
	}

	render() {

		// console.log( this.state )

		const { classes } = this.props;
		const { activeStep } = this.state;

		return (
			<NavBarLayout>

				{this.props.message.messages.map((message, i) => <Alert message={message} index={i}/> )}

				<div className={classes.layout}>
					<Card>
						<CardHeader color="primary" className="card-header-down">
							<Typography color="secondary" variant="display1" align="center">
								CALCULATOR
							</Typography>
						</CardHeader>

						<CardBody>
							<Grid container spacing={24}>
				        <Grid item xs={3}>
				          <Textbox 
				          	label="Volume"
				          	value={this.state.volume}
				          	onChange={(e) => {
				          		// console.log('last val --- ' + e.target.value)
				          		this.setState({
				          			volume: e.target.value
				          		})
				          	}}
				          />
				        </Grid>
				        <Grid item xs={3}>
				        <Selectbox/>
				        </Grid>
				        <Grid item xs={3}>
				          <Textbox 
				          	label="Gravity"
				          	value={this.state.gravity}
				          	onChange={(e) => {
				          		this.setState({
				          			gravity: e.target.value
				          		})
				          	}}
				          />
				        </Grid>
				        <Grid item xs={3}>
				        <Selectbox/>
				        </Grid>
				      </Grid>

				      <Grid container spacing={24}>
				        <Grid item xs={3}>
				          <Textbox 
				          	label="Temperature"
				          	value={this.state.temperature}
				          	onChange={(e) => {
				          		this.setState({
				          			temperature: e.target.value
				          		})
				          	}}
				          />
				        </Grid>
				        <Grid item xs={3}>
				 					<Selectbox/>
				        </Grid>
				        <Grid item xs={3}>
				          <Textbox 
				          	label="Units"
				          	value={this.state.units}
				          	onChange={(e) => {
				          		this.setState({
				          			units: e.target.value
				          		})
				          	}}
				          />
				        </Grid>
				        <Grid item xs={3}>
				          <Selectbox/>
				        </Grid>
				      </Grid>


				      <Grid container spacing={24}>
				        <Grid item xs={6}>
				          
				        </Grid>
				        <Grid item xs={6}>
				         <FormButton
				          	text="CALCULATE"
				          />
				        </Grid>
				      </Grid>



							
						
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
			width: "70%",
			marginLeft: "auto",
			marginRight: "auto"
		}
	},
	// paper: {
	// 	padding: theme.spacing.unit * 2,
	// 	[theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
	// 		padding: theme.spacing.unit * 3
	// 	}
	// },
	// stepper: {
	// 	padding: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 5}px`
	// },
	// buttons: {
	// 	display: "flex",
	// 	justifyContent: "flex-end"
	// },
	// button: {
	// 	marginTop: theme.spacing.unit * 3,
	// 	marginLeft: theme.spacing.unit
	// }
});

Calculator.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
    	user: state.user,
        cart: state.cart,
		message: state.messages
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(orderActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Calculator));

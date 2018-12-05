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
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Shipping from "../components/Checkout/Shipping/Shipping";
import Billing from "../components/Checkout/Billing/Billing";
import Items from "../components/Checkout/Items/Items";
import Review from "../components/Checkout/Review/Review";
import Grid from '@material-ui/core/Grid';

// custom
import Alert from '../components/UI/Alert';
import FormTextbox from '../components/Form/FormTextbox'
import FormSelectbox from '../components/Form/FormSelectbox'
import FormButton from '../components/Form/FormButton'
import FormCheckbox from '../components/Form/FormCheckbox'

class Calculator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isHomebrew: false,
      volVal: "",
      volUnit: "L",
      gravVal: "",
      gravUnit: "PLA",
      tempVal: "",
      tempUnit: "F",
      unitVal: "",
      unitUnit: "Lab-grown"
    }
	}

	componentWillMount() {
	
	}

	// volume
	getVolChoices() {
		let options = [
			{label:'Liter', value:'L'},
			{label:'US Gallon', value:'SGAL'},
			{label:'UK Gallon', value:'KGAL'},
		]
		if(!this.state.isHomebrew){
			options.push( {label:'Barrel', value:'BBL'} )
			options.push( {label:'Hectoliter', value:'HL'} )
		}
		return <FormSelectbox
			value={this.state.volUnit}
			options={options}
			onChange={(e) => {
				this.setState({volUnit:e.target.value})
			}}
		/>
  }

  // gravity
	getGravChoices() {
		let options = [
			{label:'Plato', value:'PLA'},
			{label:'Specific Gravity', value:'SPE'}
		]
		return <FormSelectbox
			value={this.state.gravUnit}
			options={options}
			onChange={(e) => {
				this.setState({gravUnit:e.target.value})
			}}
		/>
  }

  // temperature
	getTempChoices() {
		let options = [
			{label:'Fahrenheit', value:'F'},
			{label:'Celsius', value:'C'}
		]
		return <FormSelectbox
			value={this.state.tempUnit}
			options={options}
			onChange={(e) => {
				this.setState({tempUnit:e.target.value})
			}}
		/>
  }

  // units
  getUnitChoices() {
		let options = [
			{label:'Lab-grown', value:'Lab-grown'},
			{label:'Custom', value:'Custom'}
		]
		return <FormSelectbox
			value={this.state.unitUnit}
			options={options}
			onChange={(e) => {
				this.setState({unitUnit:e.target.value})
			}}
		/>
  }

	render() {
		return (
			<NavBarLayout>
				<div id="calculator-box">
					<Card>
						<CardHeader color="primary" className="card-header-down">
							<Typography color="secondary" variant="display1" align="center">
								CALCULATOR
							</Typography>
						</CardHeader>
						<CardBody>
							<Grid container spacing={24}>
				        <Grid item xs={3}>
				          <FormTextbox 
				          	label="Volume"
				          	value={this.state.volVal}
				          	onChange={(e) => {this.setState({volVal: e.target.value})}}
				          />
				        </Grid>
				        <Grid item xs={3}> {this.getVolChoices()}</Grid>
				        <Grid item xs={3}>
				          <FormTextbox 
				          	label="Gravity"
				          	value={this.state.gravVal}
				          	onChange={(e) => {this.setState({gravVal: e.target.value})}}
				          />
				        </Grid>
				        <Grid item xs={3}>{this.getGravChoices()}</Grid>
				      </Grid>

				      <Grid container spacing={24}>
				        <Grid item xs={3}>
				          <FormTextbox 
				          	label="Temperature"
				          	value={this.state.tempVal}
				          	onChange={(e) => {this.setState({tempVal: e.target.value})}}
				          />
				        </Grid>
				        <Grid item xs={3}>{this.getTempChoices()}</Grid>
				        <Grid item xs={3}>
				          <FormTextbox 
				          	label="Units"
				          	value={this.state.unitVal}
				          	onChange={(e) => {this.setState({unitVal: e.target.value})}}
				          />
				        </Grid>
				        <Grid item xs={3}>{this.getUnitChoices()}</Grid>
				      </Grid>

				      <Grid container spacing={24} className="button-grid">
				        <Grid item xs={6} >
									<div className="homebrew-box">
										<FormCheckbox
			          			checked={this.state.isHomebrew}
			          			onChange={(e) => {this.setState({isHomebrew: e.target.checked})}}
			          		/>
			          		<span>HOMEBREWER</span>
			          	</div>
				        		
				        </Grid>
				        <Grid item xs={6}><FormButton text="CALCULATE"/></Grid>
				      </Grid>
						
						</CardBody>
					</Card>
				</div>
			</NavBarLayout>
		);
	}
}

const styles = theme => ({
});

Calculator.propTypes = {
};

const mapStateToProps = (state) => {
  return {
	}
}

const mapDispatchToProps = dispatch => bindActionCreators(orderActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Calculator));

import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

// custom
import Alert from '../UI/Alert';
import FormTextbox from '../Form/FormTextbox'
import FormSelectbox from '../Form/FormSelectbox'
import FormButton from '../Form/FormButton'
import FormCheckbox from '../Form/FormCheckbox'

class CalculatorForm extends Component {

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

	calculatePacks() {
		var params = {
      // type: this.state.type,
      vol: this.state.volVal,
      volUnit: this.state.volUnit,
      temp: this.state.tempVal,
      tempUnit: this.state.tempUnit,
      grav: this.state.gravVal,
      gravUnit: this.state.gravUnit,
      isHomebrew: this.state.isHomebrew
  	}
  	this.props.onSubmit(params)
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
			<Grid container spacing={24}>
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
        <Grid item xs={6}>
        	<FormButton
            className="submit-button"
        		text="CALCULATE"
        		onClick={(e) => { this.calculatePacks() }}
        	/>
        	</Grid>
      </Grid>
		</Grid>
		);
	}
}

export default CalculatorForm
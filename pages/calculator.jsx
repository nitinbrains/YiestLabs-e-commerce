import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../components/NavBar/NavBarLayout";
import Grid from '@material-ui/core/Grid';
import Dialog from "@material-ui/core/Dialog";

// custom
import CalculatorForm from '../components/Calculator/CalculatorForm';
import CalculatorResult from '../components/Calculator/CalculatorResult';

import Alert from '../components/UI/Alert';
import FormTextbox from '../components/Form/FormTextbox'
import FormSelectbox from '../components/Form/FormSelectbox'
import FormButton from '../components/Form/FormButton'
import FormCheckbox from '../components/Form/FormCheckbox'

import { calculatorActions } from '../redux/actions/calculatorActions'

import PageContainer from '../components/UI/PageContainer';
import NavBarUserSearchDrawerLayout from "../components/NavBar/NavBarUserSearchDrawerLayout";

class Calculator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showResultDialog: true,
			result: {}
    }
	}

	static getDerivedStateFromProps(nextProps, prevState){
	 	return {
			showResultDialog: nextProps.calculator.showResult,
			result: nextProps.calculator.result
	  }
	  // return null
	}

	render() {
		return (
			<PageContainer heading="CALCULATOR">
				<NavBarUserSearchDrawerLayout>
					<div id="calculator-box">
						<CalculatorForm
							onSubmit={this.props.startCalculate}
						/>

						<Dialog
	              open={this.state.showResultDialog}
	              onClose={()=> { this.props.closeDialog()}}
	              aria-labelledby="form-dialog-title"
	          >
	          <CalculatorResult
	          	summary={this.state.result.summary}
	          	items={this.state.result.items}
	          />
	          </Dialog>


					</div>
				</NavBarUserSearchDrawerLayout>
			</PageContainer>

		);
	}
}

const styles = theme => ({
});

Calculator.propTypes = {
};

const mapStateToProps = (state) => {
  return {
  	calculator: state.calculator
	}
}

const mapDispatchToProps = dispatch => bindActionCreators(calculatorActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Calculator));

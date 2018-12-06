import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../NavBar/NavBarLayout";
import Card from "../UI/Card/Card.jsx";
import CardBody from "../UI/Card/CardBody.jsx";
import CardHeader from "../UI/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

// custom
import Alert from '../UI/Alert';
import FormTextbox from '../Form/FormTextbox'
import FormSelectbox from '../Form/FormSelectbox'
import FormButton from '../Form/FormButton'
import FormCheckbox from '../Form/FormCheckbox'

import ResultSummary from './ResultSummary'
import ResultItem from './ResultItem'

class CalculatorResult extends Component {

	constructor(props) {
		super(props);
		this.state = {
    }
	}


  getResultItems = () => {
  	return this.props.items.map((item, i ) => {
  		return ( <ResultItem key={i}/>)
  	})
	}

	render() {
		return (
			<Grid container spacing={24}w id='calculator-result-box'>
				<ResultSummary/>
				{this.getResultItems()}
      </Grid>
		);
	}
}

export default CalculatorResult
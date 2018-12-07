import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// custom
import ResultSummary from './ResultSummary'
import ResultItem from './ResultItem'

class CalculatorResult extends Component {

  getResultItems = () => {
  	return this.props.items.map((item, i ) => {
  		return ( <ResultItem key={i}/>)
  	})
	}

	render() {
		return (
			<div id='calculator-result-box'>
				<ResultSummary/>
				{this.getResultItems()}
      </div>
		);
	}
}

export default CalculatorResult
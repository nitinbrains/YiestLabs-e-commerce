import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// custom
import ResultSummary from "./ResultSummary";
import ResultItem from "./ResultItem";

import { calculatorActions } from 'appRedux/actions/calculatorActions';

class CalculatorResult extends Component {
    getResultItems = () => {

    const yeastStrains = this.props.inventory.items.filter(item => {
      if([2, 3, 5, 6, 7, 8].indexOf(item.salesCategory) > -1 && !item.volID[6] && item.volID[2])
      {
        return true;
      }
      return false;
    })

        return yeastStrains.map((item, i) => {
            return <ResultItem key={i} item={item} closeDialog={this.props.closeDialogMain} />;
        });
    };

    render() {
        return (
            <div id="calculator-result-box">
                <ResultSummary />
                {this.getResultItems()}
            </div>
        );
    }
}



const mapStateToProps = (state) => {
    return {
    calculator: state.calculator,
    inventory: state.inventory
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(calculatorActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorResult);
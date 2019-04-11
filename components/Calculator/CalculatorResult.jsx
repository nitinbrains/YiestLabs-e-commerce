import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// custom
import ResultSummary from "./ResultSummary";
import ResultItem from "./ResultItem";

class CalculatorResult extends Component {

    getResultItems = () => {
        const { id, result } = this.props;
        const yeastStrains = this.props.inventory.items.filter(item => {

            if (id) {
                if (item.volID[0] == Number(id))
                {
                    return true;
                }
                return false;
            }
            else {
                if ([2, 3, 5, 6, 7, 8].indexOf(item.salesCategory) > -1 && !item.volID[6] && item.volID[2])
                {
                    if (item.partNum.replace("WLP", "").length == 4) {
                      // Private strain
                      return false;
                    } else {
                      return true;
                    }
                } else if (result.isHomebrewer && [2, 3, 5, 6, 8, 32].indexOf(item.salesCategory) > -1 && item.volID[4]) {
                    if (item.partNum.replace("WLP", "").length == 4) {
                      // Private strain
                      return false;
                    } else {
                      return true;
                    }
                }
                return false;
            }
        })

        return yeastStrains.map((item, i) => (
            <ResultItem
                key={i}
                item={item}
                closeDialog={this.props.closeDialogMain}
                result={result}
            />
        ));
    };

    render() {
        return (
            <div id="calculator-result-box">
                <ResultSummary {...this.props} />
                {this.getResultItems()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messages,
        inventory: state.inventory
    };
};

export default connect(
    mapStateToProps,
)(CalculatorResult);

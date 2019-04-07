import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _get from 'lodash/get';

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";

import CalculatorForm from "components/Calculator/CalculatorForm";
import CalculatorResult from "components/Calculator/CalculatorResult";
import NavBarUserSearchDrawerLayout from "components/NavBar/NavBarUserSearchDrawerLayout";

import { calculate } from "lib/CalculatorUtils";
class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            result: {},
        };
    }

    static async getInitialProps({query}) {
        return { query };
    }

    openDialog = () => {
        this.setState({showDialog: true});
    }

    closeDialog = () => {
        this.setState({showDialog: false});
    }

    onCalculate = (values) => {
        const { custom, isHomebrewer } = this.state;
        const result = calculate({...values, custom, isHomebrewer});
        this.setState({ result });
        this.openDialog();
    }

    render() {
        const id = _get(this.props, 'query.id');
        const { result, custom, isHomebrewer  } = this.state;
        return (
            <NavBarUserSearchDrawerLayout>
                <div id="calculator-box">
                    <CalculatorForm
                        onCalculate={this.onCalculate}
                    />

                    <Dialog
                        open={this.state.showDialog}
                        onClose={this.closeDialog}
                        aria-labelledby="form-dialog-title"
                    >
                        <CalculatorResult
                            closeDialogMain={this.closeDialog}
                            id={id}
                            result={result}
                        />
                    </Dialog>
                </div>
            </NavBarUserSearchDrawerLayout>
        );
    }
}

const styles = theme => ({});

Calculator.propTypes = {};

const mapStateToProps = state => {
    return {
        messages: state.messages
    };
};

export default connect(
    mapStateToProps,
    null
)(withStyles(styles, { withTheme: true })(Calculator));

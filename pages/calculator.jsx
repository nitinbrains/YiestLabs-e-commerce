import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../components/NavBar/NavBarLayout";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";

// custom
import CalculatorForm from "../components/Calculator/CalculatorForm";
import CalculatorResult from "../components/Calculator/CalculatorResult";

import Alert from "../components/UI/Alert";
import FormTextbox from "../components/Form/FormTextbox";
import FormSelectbox from "../components/Form/FormSelectbox";
import FormButton from "../components/Form/FormButton";
import FormCheckbox from "../components/Form/FormCheckbox";

import { calculatorActions } from "../redux/actions/calculatorActions";

class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false,
            result: {}
        };
    }

    openDialog = () => {
        this.setState({showDialog: true});
    }

    closeDialog = () => {
        this.setState({showDialog: false});
    }

    render() {
        return (
            <NavBarLayout>
                <div id="calculator-box">
                    <CalculatorForm openDialog={this.openDialog} />

                    <Dialog
                        open={this.state.showDialog}
                        onClose={this.closeDialog}
                        aria-labelledby="form-dialog-title"
                    >
                        <CalculatorResult
                            closeDialog={this.closeDialog}
                        />
                    </Dialog>
                </div>
            </NavBarLayout>
        );
    }
}

const styles = theme => ({});

Calculator.propTypes = {};

const mapStateToProps = state => {
    return {
        calculator: state.calculator
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(calculatorActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(Calculator));

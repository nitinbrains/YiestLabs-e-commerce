import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../NavBar/NavBarLayout";
import Card from "../UI/Card/Card.jsx";
import CardBody from "../UI/Card/CardBody.jsx";
import CardHeader from "../UI/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// custom
import Alert from "../UI/Alert";
import FormTextbox from "../Form/FormTextbox";
import FormSelectbox from "../Form/FormSelectbox";
import FormButton from "../Form/FormButton";
import FormCheckbox from "../Form/FormCheckbox";

import { calculatorActions } from '../../redux/actions/calculatorActions';

class CalculatorForm extends Component {

    render() {
		const  { 
            calculator: {
                volVal, volChoices, volUnit, volUnits, 
                tempVal, tempChoices, tempUnit, tempUnits,
                gravVal, gravChoices, gravUnit, gravUnits,
                isHomebrew, type, typeChoices
            }
        } = this.props;

        return (
            <Card>
                <CardHeader color="primary" className="card-header-down">
                    <Typography
                        color="secondary"
                        variant="display1"
                        align="center"
                    >
                        CALCULATOR
                    </Typography>
                </CardHeader>
                <CardBody>
                    <Grid container spacing={24}>
                        <Grid item xs={3}>
							<FormSelectbox
								label="Volume"
								value={volVal}
								options={volChoices[volUnit].map(choice => ({label: choice, value: choice}))}
                                onChange={e => this.props.changeVolValue({volVal: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3}>
							<FormSelectbox
								value={volUnit}
								options={volUnits.filter(unit => isHomebrew || !unit.forHomebrew)}
								onChange={e => this.props.changeVolUnit({volUnit: e.target.value})}
							/>
                        </Grid>
                        <Grid item xs={3}>
							<FormSelectbox
								label="Gravity"
								value={gravVal}
								options={gravChoices[gravUnit].map(choice => ({label: choice, value: choice}))}
								onChange={e => this.props.changeGravValue({gravVal: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={3}>
							<FormSelectbox
								value={gravUnit}
								options={gravUnits}
								onChange={e => this.props.changeGravUnit({gravUnit: e.target.value})}
							/>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24}>
                        <Grid item xs={3}>
                            <FormSelectbox
                                label="Temperature"
								value={tempVal}
								options={tempChoices[tempUnit].map(choice => ({label: choice, value: choice}))}
								onChange={e => this.props.changeTempValue({tempVal: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3}>
							<FormSelectbox
								value={tempUnit}
								options={tempUnits}
								onChange={e => this.props.changeTempUnit({tempUnit: e.target.value})}
							/>
                        </Grid>
                        <Grid item xs={3}>
							<FormSelectbox
								value={type}
								options={typeChoices}
								onChange={e => this.props.changeType({type: e.target.value})}
							/>
                        </Grid>
                    </Grid>

                    <Grid container spacing={24} className="button-grid">
                        <Grid item xs={6}>
                            <div className="homebrew-box">
                                <FormCheckbox
                                    checked={isHomebrew}
                                    onChange={e => this.props.toggleHomebrew({isHomebrew: e.target.checked})}
                                />
                                <span>HOMEBREWER</span>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <FormButton
                                text="CALCULATE"
                                onClick={e => {
                                    this.props.calculatePacks();
                                    this.props.openDialog();
                                }}
                            />
                        </Grid>
                    </Grid>
                </CardBody>
            </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        calculator: state.calculator
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(calculatorActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CalculatorForm);
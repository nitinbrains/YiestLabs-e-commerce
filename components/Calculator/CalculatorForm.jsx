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


    _renderLabGrownForm =  () => {
      const  { 
            calculator: {
                volVal, volChoices, volUnit, volUnits, 
                tempVal, tempChoices, tempUnit, tempUnits,
                gravVal, gravChoices, gravUnit, gravUnits,
                isHomebrew, type, typeChoices
            }
        } = this.props;
        return (
      <div>
      <fieldset className="fieldset">
                    <legend>Volume</legend>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
              <FormSelectbox
                label="Volume"
                value={volVal}
                options={volChoices[volUnit].map(choice => ({label: choice, value: choice}))}
                                onChange={e => this.props.changeVolValue({volVal: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={6}>
              <FormSelectbox
                value={volUnit}
                options={volUnits.filter(unit => isHomebrew || !unit.forHomebrew)}
                onChange={e => this.props.changeVolUnit({volUnit: e.target.value})}
              />
                        </Grid> 
                    </Grid>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend>Temperature</legend>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
                            <FormSelectbox
                                label="Temperature"
                value={tempVal}
                options={tempChoices[tempUnit].map(choice => ({label: choice, value: choice}))}
                onChange={e => this.props.changeTempValue({tempVal: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={6}>
              <FormSelectbox
                value={tempUnit}
                options={tempUnits}
                onChange={e => this.props.changeTempUnit({tempUnit: e.target.value})}
              />
                        </Grid>
                    </Grid>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend>Gravity</legend>
                    <Grid container spacing={24}>
                      <Grid item xs={6}>
              <FormSelectbox
                label="Gravity"
                value={gravVal}
                options={gravChoices[gravUnit].map(choice => ({label: choice, value: choice}))}
                onChange={e => this.props.changeGravValue({gravVal: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
              <FormSelectbox
                value={gravUnit}
                options={gravUnits}
                onChange={e => this.props.changeGravUnit({gravUnit: e.target.value})}
              />
                        </Grid>
                    </Grid>
                  </fieldset>

                  </div>
                  )
    }

     _renderCustomForm =  () => {
      const  { 
            calculator: {
                volVal, volChoices, volUnit, volUnits, 
                tempVal, tempChoices, tempUnit, tempUnits,
                gravVal, gravChoices, gravUnit, gravUnits,
                isHomebrew, type, typeChoices,

                startingGravity, targetPitchRate, volume, viability, cellCount,

            }
        } = this.props;
        return (
      <div>
      <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <FormTextbox 
                        label="Starting Gravity"
                        showLabel={true}
                        value={startingGravity}
                        onChange={e => this.props.changeStartingGravity({startingGravity: e.target.value})}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormTextbox 
                        label="Target Pitch Rate"
                        showLabel={true}
                        value={targetPitchRate}
                        onChange={e => this.props.changeTargetPitchRate({targetPitchRate: e.target.value})}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormTextbox 
                        label="Volume"
                        showLabel={true}
                        value={volume}
                        onChange={e => this.props.changeVolume({volume: e.target.value})}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormTextbox 
                        label="Viability"
                        showLabel={true}
                        value={viability}
                        onChange={e => this.props.changeViability({viability: e.target.value})}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormTextbox 
                        label="Target Cell Count"
                        showLabel={true}
                        value={cellCount}
                        onChange={e => this.props.changeCellCount({cellCount: e.target.value})}
                      />
                    </Grid>

                    
                    </Grid>

                  </div>
                  )
    }


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
                  <Grid container spacing={24} className="button-grid">
                    <Grid item xs={12}>
                      <div className="homebrew-box">
                        <FormCheckbox
                            checked={isHomebrew}
                            onChange={e => this.props.toggleHomebrew({isHomebrew: e.target.checked})}
                        />
                        <span>HOMEBREWER</span>
                      </div>
                    </Grid>
                  </Grid>

                  {
                    type == 'Lab-grown' ? this._renderLabGrownForm() : this._renderCustomForm()
                  }

                  <Grid container spacing={24} className="button-grid">
                      <Grid item xs={6}>
                          
                      </Grid>
                      <Grid item xs={6}>
                          <FormButton
                              text="CALCULATE"
                              className="calculate-button"
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
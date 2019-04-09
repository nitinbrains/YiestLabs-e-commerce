import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _isNumber from "lodash/isNumber"

import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "components/NavBar/NavBarLayout";
import Card from "components/UI/Card/Card.jsx";
import CardBody from "components/UI/Card/CardBody.jsx";
import CardHeader from "components/UI/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Formik, Form, Field } from "formik";

// custom
import Alert from "components/UI/Alert";
import FormTextbox from "components/Form/FormTextbox";
import FormSelectbox from "components/Form/FormSelectbox";
import FormButton from "components/Form/FormButton";
import FormCheckbox from "components/Form/FormCheckbox";

import SalesLib from "lib/SalesLib";

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};


class CalculatorForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            custom: false,
            isHomebrewer: false,
        };
    }

    toggleCustom = () => {
        this.setState({ custom: !this.state.custom });
    }

    toggleIsHomebrewer = ({ setFieldValue }) => {
        const isHomebrewer = !this.state.isHomebrewer;
        let volChoices, gravChoices;

        if (isHomebrewer) {
            setFieldValue('volChoices', SalesLib.homebrewVolChoices);
            setFieldValue('gravChoices', SalesLib.homebrewGravChoices);
            setFieldValue('volUnit', 'L');
            setFieldValue('volVal', '20');

        } else {
            setFieldValue('volChoices', SalesLib.volChoices);
            setFieldValue('gravChoices', SalesLib.gravChoices);
            setFieldValue('volUnit', 'BBL');
            setFieldValue('volVal', '1');
        }

        setFieldValue('gravUnit', 'PLA');
        setFieldValue('gravVal', 'less than 13.5');

        this.setState({ isHomebrewer });
    }

    calculate = (values, { setErrors }) => {
        const errors = this.validate(values);
        if (_isEmpty(errors)) {
            this.props.onCalculate({...values, ...this.state});
        } else {
            setErrors(errors);
        }
    };

    changeUnit = (e, { setFieldValue, values}, type) => {
        const choices = _get(values, `${type}Choices`)
        let unit = e.target.value;
        const options = choices[unit];
        setFieldValue(`${type}Val`, options[0]);
        setFieldValue(`${type}Unit`, unit);
    }

    validate = values => {
        var errors = {};

        if (this.state.custom) {
            if (!values.startingGravity) {
                errors.startingGravity = "Starting gravity is required";
            }
            else if(isNaN(values.startingGravity) && values.startingGravity <= 0) {
                errors.startingGravity = "Invalid value";
            }

            if (!values.targetPitchRate) {
                errors.targetPitchRate = "Target pitch rate is required";
            }
            else if(isNaN(values.targetPitchRate) && values.targetPitchRate <= 0) {
                errors.targetPitchRate = "Invalid value";
            }

            if (!values.volume) {
                errors.volume = "Volume is required";
            }
            else if(isNaN(values.volume) && values.volume <= 0) {
                errors.targetPitchRate = "Invalid value";
            }

            if (!values.viability) {
                errors.viability = "Viability is required";
            }
            else if(isNaN(values.viability) && values.viability <= 0) {
                errors.viability = "Invalid value";
            }

            if (!values.cellCount) {
                errors.cellCount = "Cell count is required";
            }
            else if(isNaN(values.cellCount) && values.cellCount <= 0) {
                errors.cellCount = "Invalid value";
            }
        } else {
            if (!values.volVal) {
                errors.volVal = "Required";
            }

            if (!values.volUnit) {
                errors.volVal = "Required";
            }

            if (!values.tempVal) {
                errors.tempUnit = "Required";
            }

            if (!values.gravVal) {
                errors.gravUnit = "Required";
            }
        }

        return errors;
    };


    _renderLabGrownForm = (formikProps) => {
        const { isHomebrewer } = this.state;

        const { values, errors } = formikProps;

        const volUnit = _get(values, 'volUnit');
        const tempUnit = _get(values, 'tempUnit');
        const gravUnit = _get(values, 'gravUnit');
        const volChoices = _get(values, 'volChoices');
        const tempChoices = _get(values, 'tempChoices');
        const gravChoices = _get(values, 'gravChoices');

        return (
            <Form>
                <Grid container spacing={24} className="button-grid" >
                    <Grid item xs={12}>
                        <div className="homebrew-box">
                            <FormCheckbox checked={isHomebrewer} onChange={() => this.toggleIsHomebrewer(formikProps)} />
                            <span>HOMEBREWER</span>
                        </div>
                    </Grid>
                </Grid>
                <fieldset className="fieldset">
                    <legend>Volume</legend>
                    <Grid container spacing={24} className="field-margin">
                        <Field
                            render={({ field: { value, onChange}}) => {
                                return (
                                    <Grid item xs={12} md={6}>
                                        <FormikErrorMessage error={_get(errors, 'volVal')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="volVal"
                                            value={_get(value, 'volVal')}
                                            options={volChoices[volUnit]}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                        <Field
                            render={({ field: { value, onChange }, form: { setFieldValue }}) => {
                                const volUnits = SalesLib.volUnits.filter(unit => (!isHomebrewer && !unit.forHomebrew) || (isHomebrewer && unit.forHomebrew));
                                return (
                                    <Grid item xs={12} md={6}>
                                        <FormikErrorMessage error={_get(errors, 'volUnit')} />
                                        <FormSelectbox
                                            select
                                            fullWidth
                                            name="volUnit"
                                            label="Unit"
                                            value={_get(value, 'volUnit')}
                                            options={Object.keys(volChoices)}
                                            onChange={(e) => this.changeUnit(e, formikProps, 'vol')}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                    </Grid>
                </fieldset>
                <fieldset className="fieldset">
                    <legend>Temperature</legend>
                    <Grid container spacing={24} className="field-margin">
                        <Field
                            render={({ field: { value, onChange }}) => {
                                return (
                                    <Grid item xs={12} md={6}>
                                        <FormikErrorMessage error={_get(errors, 'tempVal')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="tempVal"
                                            value={_get(value, 'tempVal')}
                                            options={tempChoices[tempUnit]}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                );
                            }}
                        />

                        <Field
                            render={({ field: { value, onChange }, form: { setFieldValue }}) => {
                                return (
                                    <Grid item xs={12} md={6}>
                                        <FormikErrorMessage error={_get(errors, 'tempUnit')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="tempUnit"
                                            label="Unit"
                                            value={_get(value, 'tempUnit')}
                                            options={Object.keys(tempChoices)}
                                            onChange={(e) => this.changeUnit(e, formikProps, 'temp')}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                    </Grid>
                </fieldset>
                <fieldset className="fieldset">
                    <legend>Gravity</legend>
                    <Grid container spacing={24} className="field-margin">
                        <Field
                            render={({ field: { value, onChange }}) => {
                                return (
                                    <Grid item xs={12} md={6}>
                                        <FormikErrorMessage error={_get(errors, 'gravVal')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="gravVal"
                                            value={_get(value, 'gravVal')}
                                            options={gravChoices[gravUnit]}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                        <Field
                            render={({ field: { value, onChange }, form: { setFieldValue }}) => {
                                return (
                                    <Grid item xs={12} md={6}>
                                        <FormikErrorMessage error={_get(errors, 'gravUnit')} />
                                        <FormSelectbox
                                            fullWidth
                                            label="Unit"
                                            name="gravUnit"
                                            value={_get(value, 'gravUnit')}
                                            options={Object.keys(gravChoices)}
                                            onChange={(e) => this.changeUnit(e, formikProps, 'grav')}                                                        />
                                    </Grid>
                                );
                            }}
                        />
                    </Grid>
                </fieldset>
                <Grid container spacing={24} className="button-grid">
                    <Grid item xs={12} md={6}>
                        * Advanced recommendations based on batch size, fermentation temperature and gravity.<br />
                        For brewers yeast only. If you are using White Labs yeast based on batch-size specific<br />
                        recommendations and are having success, please continue to do so.
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button className="calculate-button form-button" variant="contained" type="submit">
                            CALCULATE
                        </Button>
                    </Grid>
                </Grid>
            </Form>
       )
    };

    _renderCustomForm = (formikProps) => {
        const { errors } = formikProps;
        const {classes}=this.props;
        return (
            <Form>
                <Grid container spacing={24}>
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={12} md={6}>
                                    <FormikErrorMessage error={_get(errors, 'startingGravity')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="startingGravity"
                                        label="Starting Gravity in Plato"
                                        value={_get(value, 'startingGravity') || ''}
                                        onChange={onChange}
                                        InputProps={{
                                            className: classes.whiteSpace
                                        }}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={12} md={6}>
                                    <FormikErrorMessage error={_get(errors, 'targetPitchRate')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="targetPitchRate"
                                        label="Target Pitch Rate in Cells per mL"
                                        value={_get(value, 'targetPitchRate') || ''}
                                        onChange={onChange}
                                        InputProps={{
                                            className: classes.whiteSpace
                                        }}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={12} md={6}>
                                    <FormikErrorMessage error={_get(errors, 'volume')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="volume"
                                        label="Batch Size in mL"
                                        value={_get(value, 'volume') || ''}
                                        onChange={onChange}
                                        InputProps={{
                                            className: classes.whiteSpace
                                        }}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={12} md={6}>
                                    <FormikErrorMessage error={_get(errors, 'viability')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="viability"
                                        label="Viability %"
                                        value={_get(value, 'viability') || ''}
                                        onChange={onChange}
                                        InputProps={{
                                            className: classes.whiteSpace
                                        }}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                  <Grid item xs={12} md={6}>
                                  <FormikErrorMessage error={_get(errors, 'cellCount')} />
                                  <TextField
                                      fullWidth
                                      variant="outlined"
                                      name="cellCount"
                                      label="Yiest Cell Count in Cells per mL"
                                      value={_get(value, 'cellCount') || ''}
                                      onChange={onChange}
                                      InputProps={{
                                        className: classes.whiteSpace
                                    }}
                                  />
                              </Grid>
                            );
                        }}
                    />
                </Grid>
                <Grid container spacing={24} className="button-grid">
                    <Grid item xs={12} md={6}>
                        <h4>
                            * Re-pitching is at your own risk.
                        </h4>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button className="calculate-button form-button" variant="contained" type="submit">
                            CALCULATE
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        )
    }

    render() {
        const { custom, isHomebrewer } = this.state;
        const {classes}=this.props;

        return (
            <Card>
                <CardHeader color="primary" className="card-header-down">
                    <Typography color="secondary" variant="display1" className="calc-small-variant" align="center">
                        CALCULATOR
                    </Typography>
                </CardHeader>

                <Grid container id="professional-homebrew-switch">
                    <Grid item xs={6} dir="rtl">
                        <FormButton
                            className={`smallbtn form-button-small-size ${custom ? "form-button-active" : ""}`}
                            text="Lab-Grown"
                            onClick={this.toggleCustom}
                        />
                    </Grid>
                    <Grid item xs={6} dir="ltr">
                        <FormButton
                            className={`smallbtn form-button-small-size ${custom ? "" : "form-button-active"}`}
                            text="Re-Pitching"
                            onClick={this.toggleCustom}
                        />
                    </Grid>
                </Grid>
                <CardBody>
                    <Formik
                        initialValues={{
                            volVal: "1",
                            volUnit: "BBL",
                            gravVal: "less than 13.5",
                            gravUnit: "PLA",
                            tempVal: "less than 59",
                            tempUnit: "F",
                            startingGravity: "",
                            targetPitchRate: "",
                            volume: "",
                            viability: "",
                            cellCount: "",
                            volChoices: SalesLib.volChoices,
                            tempChoices: SalesLib.tempChoices,
                            gravChoices: SalesLib.gravChoices
                        }}
                        enableReinitialize
                        onSubmit={(values, actions) => this.calculate(values, actions)}
                    >
                        {(props) => {
                            return custom ?
                                this._renderCustomForm(props)
                            :
                                this._renderLabGrownForm(props)
                        }}
                    </Formik>
                </CardBody>
            </Card>
        );
    }
}

const styles = theme => ({
    whiteSpace: {
        whiteSpace:'normal'
    },
});

const mapStateToProps = state => {
    return {
        messages: state.messages
    };
};


export default connect(
    mapStateToProps
)(withStyles(styles, { withTheme: true })(CalculatorForm));

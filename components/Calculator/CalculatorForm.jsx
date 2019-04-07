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
            showError: false
        };
    }

    validate = values => {
        var errors = {};

        if (this.props.custom) {
            if (!values.startingGravity) {
                errors.startingGravity = "Starting gravity is required";
            }
            else if(isNaN(values.startingGravity)) {
                errors.startingGravity = "Invalid value";
            }

            if (!values.targetPitchRate) {
                errors.targetPitchRate = "Target pitch rate is required";
            }
            else if(isNaN(values.targetPitchRate)) {
                errors.targetPitchRate = "Invalid value";
            }

            if (!values.volume) {
                errors.volume = "Required";
            }
            else if(isNaN(values.volume)) {
                errors.targetPitchRate = "Invalid value";
            }

            if (!values.viability) {
                errors.viability = "Required";
            }
            else if(isNaN(values.viability)) {
                errors.viability = "Invalid value";
            }

            if (!values.cellCount) {
                errors.cellCount = "Required";
            }
            else if(isNaN(values.cellCount)) {
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

    calculate = (values, { setErrors }) => {
        const errors = this.validate(values);
        if (_isEmpty(errors)) {
            this.props.onCalculate(values);
        } else {
            setErrors(errors);
        }
    };

    changeUnit = (e, onChange, setFieldValue, type) => {
        let unit = e.target.value;
        const options = SalesLib[`${type}Choices`][unit];
        setFieldValue(`${type}Val`, options[0]);
        onChange(e)
    }

    _renderLabGrownForm = (formikProps) => {
        const { isHomebrew } = this.props;
        const { values, errors } = formikProps;

        const volUnit = _get(values, 'volUnit');
        const tempUnit = _get(values, 'tempUnit');
        const gravUnit = _get(values, 'gravUnit');

       return (
            <Form>
                <fieldset className="fieldset">
                    <legend>Volume</legend>
                    <Grid container spacing={24}>
                        <Field
                            render={({ field: { value, onChange}}) => {
                                return (
                                    <Grid item xs={6}>
                                        <FormikErrorMessage error={_get(errors, 'volVal')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="volVal"
                                            value={_get(value, 'volVal')}
                                            options={SalesLib.volChoices[volUnit]}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                        <Field
                            render={({ field: { value, onChange }, form: { setFieldValue }}) => {
                                const volUnits = SalesLib.volUnits.filter(unit => !isHomebrew || unit.forHomebrew);
                                return (
                                    <Grid item xs={6}>
                                        <FormikErrorMessage error={_get(errors, 'volUnit')} />
                                        <FormSelectbox
                                            select
                                            fullWidth
                                            name="volUnit"
                                            label="Unit"
                                            value={_get(value, 'volUnit')}
                                            options={volUnits}
                                            onChange={(e) => this.changeUnit(e, onChange, setFieldValue, 'vol')}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                    </Grid>
                </fieldset>
                <fieldset className="fieldset">
                    <legend>Temperature</legend>
                    <Grid container spacing={24}>
                        <Field
                            render={({ field: { value, onChange }}) => {
                                return (
                                    <Grid item xs={6}>
                                        <FormikErrorMessage error={_get(errors, 'tempVal')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="tempVal"
                                            value={_get(value, 'tempVal')}
                                            options={SalesLib.tempChoices[tempUnit]}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                );
                            }}
                        />

                        <Field
                            render={({ field: { value, onChange }, form: { setFieldValue }}) => {
                                return (
                                    <Grid item xs={6}>
                                        <FormikErrorMessage error={_get(errors, 'tempUnit')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="tempUnit"
                                            label="Unit"
                                            value={_get(value, 'tempUnit')}
                                            options={SalesLib.tempUnits}
                                            onChange={(e) => this.changeUnit(e, onChange, setFieldValue, 'temp')}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                    </Grid>
                </fieldset>
                <fieldset className="fieldset">
                    <legend>Gravity</legend>
                    <Grid container spacing={24}>
                        <Field
                            render={({ field: { value, onChange }}) => {
                                return (
                                    <Grid item xs={6}>
                                        <FormikErrorMessage error={_get(errors, 'gravVal')} />
                                        <FormSelectbox
                                            fullWidth
                                            name="gravVal"
                                            value={_get(value, 'gravVal')}
                                            options={SalesLib.gravChoices[gravUnit]}
                                            onChange={onChange}
                                        />
                                    </Grid>
                                );
                            }}
                        />
                        <Field
                            render={({ field: { value, onChange }, form: { setFieldValue }}) => {
                                return (
                                    <Grid item xs={6}>
                                        <FormikErrorMessage error={_get(errors, 'gravUnit')} />
                                        <FormSelectbox
                                            fullWidth
                                            label="Unit"
                                            name="gravUnit"
                                            value={_get(value, 'gravUnit')}
                                            options={SalesLib.gravUnits}
                                            onChange={(e) => this.changeUnit(e, onChange, setFieldValue, 'grav')}                                                        />
                                    </Grid>
                                );
                            }}
                        />
                    </Grid>
                </fieldset>
                <Grid container spacing={24} className="button-grid">
                    <Grid item xs={6}>
                        * Advanced recommendations based on batch size, fermentation temperature and gravity.<br />
                        For brewers yeast only. If you are using White Labs yeast based on batch-size specific<br />
                        recommendations and are having success, please continue to do so.
                    </Grid>
                    <Grid item xs={6}>
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

        return (
            <Form>
                <Grid container spacing={24}>
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={6}>
                                    <FormikErrorMessage error={_get(errors, 'startingGravity')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="startingGravity"
                                        label="Starting Gravity in Plato"
                                        value={_get(value, 'startingGravity') || ''}
                                        onChange={onChange}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={6}>
                                    <FormikErrorMessage error={_get(errors, 'targetPitchRate')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="targetPitchRate"
                                        label="Target Pitch Rate in Cells per mL"
                                        value={_get(value, 'targetPitchRate') || ''}
                                        onChange={onChange}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={6}>
                                    <FormikErrorMessage error={_get(errors, 'volume')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="volume"
                                        label="Batch Size in mL"
                                        value={_get(value, 'volume') || ''}
                                        onChange={onChange}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={6}>
                                    <FormikErrorMessage error={_get(errors, 'viability')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="viability"
                                        label="Viability %"
                                        value={_get(value, 'viability') || ''}
                                        onChange={onChange}
                                    />
                                </Grid>
                            );
                        }}
                    />
                    <Field
                        render={({ field: { value, onChange }}) => {
                            return (
                                <Grid item xs={6}>
                                    <FormikErrorMessage error={_get(errors, 'cellCount')} />
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="cellCount"
                                        label="Yeast Cell Count in Cells per mL"
                                        value={_get(value, 'cellCount') || ''}
                                        onChange={onChange}
                                    />
                                </Grid>
                            );
                        }}
                    />
                </Grid>
                <Grid container spacing={24} className="button-grid">
                    <Grid item xs={6}>
                        <h4>
                            * Re-pitching is at your own risk.
                        </h4>
                    </Grid>
                    <Grid item xs={6}>
                        <Button className="calculate-button form-button" variant="contained" type="submit">
                            CALCULATE
                        </Button>
                    </Grid>
                </Grid>
            </Form>
        )
    }

    render() {
        const { custom, toggleCustom, isHomebrewer, toggleIsHomebrewer } = this.props;

        return (
            <Card>
                <CardHeader color="primary" className="card-header-down">
                    <Typography color="secondary" variant="display1" align="center">
                        CALCULATOR
                    </Typography>
                </CardHeader>

                <Grid container id="professional-homebrew-switch" style={process.env.NODE_ENV == "production" ? { visible: "false", display: "none" } : { }}>
                    <Grid item xs={6} dir="rtl">
                        <FormButton
                            className={`form-button-small-size ${custom ? "form-button-active" : ""}`}
                            text="Lab-Grown"
                            onClick={toggleCustom}
                        />
                    </Grid>
                    <Grid item xs={6} dir="ltr">
                        <FormButton
                            className={`form-button-small-size ${custom ? "" : "form-button-active"}`}
                            text="Re-Pitching"
                            onClick={toggleCustom}
                        />
                    </Grid>
                </Grid>
                <CardBody>
                    <Grid container spacing={24} className="button-grid">
                        <Grid item xs={12}>
                            <div className="homebrew-box">
                                <FormCheckbox checked={isHomebrewer} onChange={toggleIsHomebrewer} />
                                <span>HOMEBREWER</span>
                            </div>
                        </Grid>
                    </Grid>

                    <Formik
                        initialValues={{
                            volVal: "119",
                            volUnit: "L",
                            gravVal: "less than 13.5",
                            gravUnit: "PLA",
                            tempVal: "less than 59",
                            tempUnit: "F",
                            unitVal: "",
                            startingGravity: "",
                            targetPitchRate: "",
                            volume: "",
                            viability: "",
                            cellCount: "",
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

const mapStateToProps = state => {
    return {
        messages: state.messages
    };
};

export default connect(
    mapStateToProps,
)(CalculatorForm);

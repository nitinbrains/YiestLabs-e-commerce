import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBarLayout from "../NavBar/NavBarLayout";
import Card from "../UI/Card/Card.jsx";
import CardBody from "../UI/Card/CardBody.jsx";
import CardHeader from "../UI/Card/CardHeader.jsx";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

// custom
import Alert from "../UI/Alert";
import FormTextbox from "../Form/FormTextbox";
import FormSelectbox from "../Form/FormSelectbox";
import FormButton from "../Form/FormButton";
import FormCheckbox from "../Form/FormCheckbox";

import { calculatorActions } from "../../redux/actions/calculatorActions";

class CalculatorForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showError: false
        };
    }
    _renderLabGrownForm = () => {
        const {
            calculator: { volVal, volChoices, volUnit, volUnits, tempVal, tempChoices, tempUnit, tempUnits, gravVal, gravChoices, gravUnit, gravUnits, isHomebrew, type, typeChoices }
        } = this.props;
        const labFormValidation = Yup.object().shape({
            volVal: Yup.number().required("Required"),
            volUnit: Yup.string().required("Required"),
            tempVal: Yup.string().required("Required"),
            tempUnit: Yup.string().required("Required"),
            gravVal: Yup.string().required("Required"),
            gravUnit: Yup.string().required("Required")
        });
        return (
            <div>
                <Formik
                    initialValues={{
                        volVal,
                        volUnit,
                        tempVal,
                        tempUnit,
                        gravVal,
                        gravUnit
                    }}
                    validationSchema={labFormValidation}
                    enableReinitialize
                    validate={values => {
                        let errors = {};
                    }}
                    onSubmit={values => {
                        // same shape as initial values
                        this.props.calculatePacks();
                        this.props.openDialog();
                    }}
                >
                    {({ errors, touched, isValidating }) => {
                        return (
                            <Form>
                                <fieldset className="fieldset">
                                    <legend>Volume</legend>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <Field
                                                name="volVal"
                                                component={props => {
                                                    return (
                                                        <FormSelectbox
                                                            label="Volume"
                                                            value={props.field.value}
                                                            options={volChoices[volUnit].map(choice => ({ label: choice, value: choice }))}
                                                            onChange={e => {
                                                                props.form.setFieldValue("volVal", e.target.value);
                                                                this.props.changeVolValue({ volVal: e.target.value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.volVal && touched.volVal && <div style={{ color: "red" }}>{errors.volVal}</div>}
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Field
                                                name="volUnit"
                                                component={props => {
                                                    return (
                                                        <FormSelectbox
                                                            value={props.field.value}
                                                            options={volUnits.filter(unit => isHomebrew || !unit.forHomebrew)}
                                                            onChange={e => {
                                                                props.form.setFieldValue("volUnit", e.target.value);
                                                                this.props.changeVolUnit({ volUnit: e.target.value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.volUnit && touched.volUnit && <div style={{ color: "red" }}>{errors.volUnit}</div>}
                                        </Grid>
                                    </Grid>
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend>Temperature</legend>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <Field
                                                name="tempVal"
                                                component={props => {
                                                    return (
                                                        <FormSelectbox
                                                            label="Temperature"
                                                            value={props.field.value}
                                                            options={tempChoices[tempUnit].map(choice => ({ label: choice, value: choice }))}
                                                            onChange={e => {
                                                                props.form.setFieldValue("tempVal", e.target.value);
                                                                this.props.changeTempValue({ tempVal: e.target.value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.tempVal && touched.tempVal && <div style={{ color: "red" }}>{errors.tempVal}</div>}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                name="tempUnit"
                                                component={props => {
                                                    return (
                                                        <FormSelectbox
                                                            value={props.field.value}
                                                            options={tempUnits}
                                                            onChange={e => {
                                                                props.form.setFieldValue("tempUnit", e.target.value);
                                                                this.props.changeTempUnit({ tempUnit: e.target.value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.tempUnit && touched.tempUnit && <div style={{ color: "red" }}>{errors.tempUnit}</div>}
                                        </Grid>
                                    </Grid>
                                </fieldset>

                                <fieldset className="fieldset">
                                    <legend>Gravity</legend>
                                    <Grid container spacing={24}>
                                        <Grid item xs={6}>
                                            <Field
                                                name="gravVal"
                                                component={props => {
                                                    return (
                                                        <FormSelectbox
                                                            label="Gravity"
                                                            value={props.field.value}
                                                            options={gravChoices[gravUnit].map(choice => ({ label: choice, value: choice }))}
                                                            onChange={e => {
                                                                props.form.setFieldValue("gravVal", e.target.value);
                                                                this.props.changeGravValue({ gravVal: e.target.value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.gravVal && touched.gravVal && <div style={{ color: "red" }}>{errors.gravVal}</div>}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Field
                                                name="gravUnit"
                                                component={props => {
                                                    return (
                                                        <FormSelectbox
                                                            value={props.field.value}
                                                            options={gravUnits}
                                                            onChange={e => {
                                                                props.form.setFieldValue("gravUnit", e.target.value);
                                                                this.props.changeGravUnit({ gravUnit: e.target.value });
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors.gravUnit && touched.gravUnit && <div style={{ color: "red" }}>{errors.gravUnit}</div>}
                                        </Grid>
                                    </Grid>
                                </fieldset>

                                <Grid container spacing={24} className="button-grid">
                                    <Grid item xs={6} />
                                    <Grid item xs={6}>
                                        <Button className="calculate-button form-button" variant="contained" type="submit">
                                            CALCULATE
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        );
    };

    _renderCustomForm = () => {
        const {
            calculator: {
                volVal,
                volChoices,
                volUnit,
                volUnits,
                tempVal,
                tempChoices,
                tempUnit,
                tempUnits,
                gravVal,
                gravChoices,
                gravUnit,
                gravUnits,
                isHomebrew,
                type,
                typeChoices,

                startingGravity,
                targetPitchRate,
                volume,
                viability,
                cellCount
            }
        } = this.props;
        const customFormValidation = Yup.object().shape({
            startingGravity: Yup.number().required("Required"),
            targetPitchRate: Yup.number().required("Required"),
            volume: Yup.number().required("Required"),
            viability: Yup.number().required("Required"),
            cellCount: Yup.number().required("Required")
        });
        return (
            <div>
                <Formik
                    initialValues={{
                        startingGravity,
                        targetPitchRate,
                        volume,
                        viability,
                        cellCount
                    }}
                    enableReinitialize
                    validationSchema={customFormValidation}
                    validate={values => {
                        let errors = {};
                    }}
                    onSubmit={values => {
                        // same shape as initial values
                        this.props.calculatePacks();
                        this.props.openDialog();
                    }}
                >
                    {({ errors, touched, isValidating }) => {
                        return (
                            <Form>
                                <Grid container spacing={24}>
                                    <Grid item xs={6}>
                                        <Field
                                            name="startingGravity"
                                            component={props => {
                                                return (
                                                    <FormTextbox
                                                        required={
                                                            (errors.startingGravity && touched.startingGravity) || (this.props.messages.messages.length > 0 && startingGravity == "") ? true : false
                                                        }
                                                        error={(errors.startingGravity && touched.startingGravity) || (this.props.messages.messages.length > 0 && startingGravity == "") ? true : false}
                                                        label="Starting Gravity"
                                                        showLabel={true}
                                                        value={props.field.value}
                                                        onChange={e => {
                                                            props.form.setFieldValue("startingGravity", e.target.value);
                                                            this.props.changeStartingGravity({ startingGravity: e.target.value });
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.startingGravity && touched.startingGravity && <div style={{ color: "red" }}>{errors.startingGravity}</div>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            name="targetPitchRate"
                                            component={props => {
                                                return (
                                                    <FormTextbox
                                                        required={
                                                            (errors.targetPitchRate && touched.targetPitchRate) || (this.props.messages.messages.length > 0 && targetPitchRate == "") ? true : false
                                                        }
                                                        error={(errors.targetPitchRate && touched.targetPitchRate) || (this.props.messages.messages.length > 0 && targetPitchRate == "") ? true : false}
                                                        label="Target Pitch Rate"
                                                        showLabel={true}
                                                        value={props.field.value}
                                                        onChange={e => {
                                                            props.form.setFieldValue("targetPitchRate", e.target.value);
                                                            this.props.changeTargetPitchRate({ targetPitchRate: e.target.value });
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.targetPitchRate && touched.targetPitchRate && <div style={{ color: "red" }}>{errors.targetPitchRate}</div>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            name="volume"
                                            component={props => {
                                                return (
                                                    <FormTextbox
                                                        required={(errors.volume && touched.volume) || (this.props.messages.messages.length > 0 && volume == "") ? true : false}
                                                        error={(errors.volume && touched.volume) || (this.props.messages.messages.length > 0 && volume == "") ? true : false}
                                                        label="Volume"
                                                        showLabel={true}
                                                        value={props.field.value}
                                                        onChange={e => {
                                                            props.form.setFieldValue("volume", e.target.value);
                                                            this.props.changeVolume({ volume: e.target.value });
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.volume && touched.volume && <div style={{ color: "red" }}>{errors.volume}</div>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            name="viability"
                                            component={props => {
                                                return (
                                                    <FormTextbox
                                                        required={(errors.viability && touched.viability) || (this.props.messages.messages.length > 0 && viability == "") ? true : false}
                                                        error={(errors.viability && touched.viability) || (this.props.messages.messages.length > 0 && viability == "") ? true : false}
                                                        label="Viability"
                                                        showLabel={true}
                                                        value={props.field.value}
                                                        onChange={e => {
                                                            props.form.setFieldValue("viability", e.target.value);
                                                            this.props.changeViability({ viability: e.target.value });
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.viability && touched.viability && <div style={{ color: "red" }}>{errors.viability}</div>}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Field
                                            name="cellCount"
                                            component={props => {
                                                return (
                                                    <FormTextbox
                                                        required={(errors.cellCount && touched.cellCount) || (this.props.messages.messages.length > 0 && cellCount == "") ? true : false}
                                                        error={(errors.cellCount && touched.cellCount) || (this.props.messages.messages.length > 0 && cellCount == "") ? true : false}
                                                        label="Target Cell Count"
                                                        showLabel={true}
                                                        value={props.field.value}
                                                        onChange={e => {
                                                            props.form.setFieldValue("cellCount", e.target.value);
                                                            this.props.changeCellCount({ cellCount: e.target.value });
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.cellCount && touched.cellCount && <div style={{ color: "red" }}>{errors.cellCount}</div>}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={24} className="button-grid">
                                    <Grid item xs={6} />
                                    <Grid item xs={6}>
                                        <Button className="calculate-button form-button" variant="contained" type="submit">
                                            CALCULATE
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        );
    };

    render() {
        const {
            calculator: { volVal, volChoices, volUnit, volUnits, tempVal, tempChoices, tempUnit, tempUnits, gravVal, gravChoices, gravUnit, gravUnits, isHomebrew, type, typeChoices, messages }
        } = this.props;

        return (
            <Card>
                <CardHeader color="primary" className="card-header-down">
                    <Typography color="secondary" variant="display1" align="center">
                        CALCULATOR
                    </Typography>
                </CardHeader>

                <Grid container id="professional-homebrew-switch">
                    <Grid item xs={6} dir="rtl">
                        <FormButton
                            className={`form-button-small-size ${this.props.calculator.type == "Lab-grown" ? "" : "form-button-active"}`}
                            text="Lab-Grown"
                            onClick={() => this.props.changeType({ type: "Lab-grown" })}
                        />
                    </Grid>
                    <Grid item xs={6} dir="ltr">
                        <FormButton
                            className={`form-button-small-size ${this.props.calculator.type == "Custom" ? "" : "form-button-active"}`}
                            text="Custom"
                            onClick={() => this.props.changeType({ type: "Custom" })}
                        />
                    </Grid>
                </Grid>

                <CardBody>
                    <Grid container spacing={24} className="button-grid">
                        <Grid item xs={12}>
                            <div className="homebrew-box">
                                <FormCheckbox checked={isHomebrew} onChange={e => this.props.toggleHomebrew({ isHomebrew: e.target.checked })} />
                                <span>HOMEBREWER</span>
                            </div>
                        </Grid>
                    </Grid>

                    {type == "Lab-grown" ? this._renderLabGrownForm() : this._renderCustomForm()}
                </CardBody>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {
        calculator: state.calculator,
        messages: state.messages
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(calculatorActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CalculatorForm);

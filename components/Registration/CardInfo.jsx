import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import moment from "moment";
import Cleave from "cleave.js/react";
import Utils from "lib/Utils";

function CreditCardMaskedTextField(props) {
    let { options, onChange, inputRef, ...other } = props;
    options={creditCard: true};
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} />;
}

function DateMaskedTextField(props) {
    let { options, onChange, inputRef, ...other } = props;
    options={
        date: true,
        datePattern: ['m', 'Y']
    };
    return <Cleave {...other} onChange={onChange} ref={inputRef} options={options} />;
}

const FormikErrorMessage = ({ error }) => {
    return error ? <div className="error">{error}</div> : null;
};

const CardInfo = ({
    values,
    touched, 
    errors, 
    classes, 
    onBack,
    setErrors,
    submitForm
}) => {

    const handleSubmit = () => {
        let errors = validate();
        if (_isEmpty(errors.card)) {
            submitForm();
        } else {
            setErrors(errors);
        }
    }

    const validate = () => {
        let errors = {card: {}};

        if (!_get(values, 'card.ccnumber')) {
            errors.card.ccnumber = "Credit card number is required";
        } else {
            const cardType = Utils.getCardType(values.card.ccnumber);
            if(!cardType) {
                errors.card.ccnumber = "Credit card type could not be inferred. Enter valid credit card number";
            }
        }

        if (!_get(values, 'card.ccname')) {
            errors.card.ccname = "Name is required";
        }

        if (!_get(values, 'card.ccexpire')) {
            errors.card.ccexpire = "Expiration date is required";
        } else {
            let exp = moment(values.card.ccexpire, 'MM/YYYY')
            if (!exp.isValid() || exp.isBefore(moment())) {
                errors.card.ccexpire = "Expiration date is invalid";
            }
        }
        
        return errors;
    }

    return (
        <Grid container spacing={24}>
            <Grid item xs={12}>
                <Typography variant="h6" color="textPrimary">
                    Credit Card Information
                </Typography>
                <div
                    style={{
                        borderTop: "solid 1.5px",
                        borderColor: "#CCCCCC",
                        marginBottom: 10
                    }}
                />
            </Grid>
            <Field
                render={({ field: { value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "card.ccnumber")} touched={_get(touched, "card.ccnumber")} />
                            <TextField
                                name="card.ccnumber"
                                label="Credit Card number"
                                fullWidth
                                autoComplete="ccnumber"
                                onChange={onChange}
                                value={_get(value, 'card.ccnumber') || ''}
                                InputProps={{ inputComponent: CreditCardMaskedTextField }}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "card.ccname")} touched={_get(touched, "card.ccname")} />
                            <TextField 
                            name="card.ccname" 
                            label="Name on card" 
                            fullWidth 
                            autoComplete="card.ccname" 
                            onChange={onChange} 
                            value={_get(value, "card.ccname") || ''} />

                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "card.ccexpire")} touched={_get(touched, "card.ccexpire")} />
                            <TextField
                                id="card.ccexpire"
                                name="card.ccexpire"
                                label="Expiration date"
                                placeholder="MM/YY"
                                fullWidth
                                InputProps={{ inputComponent: DateMaskedTextField }}
                                onChange={onChange}
                                value={_get(value, "card.ccexpire") || ''}    
                            />
                        </Grid>
                    );
                }}
            />
            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit
            </Button>
        </Grid>
    );
};

const styles = theme => ({
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    }
});

CardInfo.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CardInfo);


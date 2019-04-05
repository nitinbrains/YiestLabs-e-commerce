import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { Field } from "formik";
import _get from 'lodash/get';
import _set from 'lodash/set';
import _isEmpty from 'lodash/isEmpty';
import moment from "moment";
import Cleave from "cleave.js/react";

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
        if (_isEmpty(errors)) {
            submitForm();
           
        } else {
           
            setErrors(errors);
        }
    }

    const validate = () => {
        let errors = {};

        if (!_get(values, 'card.ccnumber')) {
            _set(errors, 'card.ccnumber', 'Credit card number is required');
        }

        if (!_get(values, 'card.ccname')) {
           _set(errors, 'card.ccname', 'Name is required');
        }

        if (!_get(values, 'card.ccexpire')) {
            _set(errors, 'card.ccexpire', 'Expiration date is required');
        } else {
            let exp = moment(values.card.ccexpire, 'MM/YYYY')
            if (!exp.isValid() || exp.isBefore(moment())) {
                _set(errors, 'card.ccexpire', 'Expiration date is invalid');
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
                            <FormikErrorMessage error={_get(errors, "card.ccnumber")} />
                            <TextField                                
                                name="card.ccnumber"
                                label="Credit Card number"
                                variant="outlined"
                                fullWidth
                                autoComplete="ccnumber"
                                InputProps={{ inputComponent: CreditCardMaskedTextField }}
                                onChange={onChange}
                                value={_get(value, 'card.ccnumber') || ''}
                            />
                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "card.ccname")} />
                            <TextField                             
                                name="card.ccname" 
                                label="Name on card" 
                                variant="outlined"
                                fullWidth 
                                autoComplete="card.ccname" 
                                onChange={onChange} 
                                value={_get(value, "card.ccname") || ''}
                            />

                        </Grid>
                    );
                }}
            />
            <Field
                render={({ field: { value, onChange }}) => {
                    return (
                        <Grid item xs={12}>
                            <FormikErrorMessage error={_get(errors, "card.ccexpire")} />
                            <TextField                                
                                name="card.ccexpire"
                                label="Expiration date"
                                variant="outlined"
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


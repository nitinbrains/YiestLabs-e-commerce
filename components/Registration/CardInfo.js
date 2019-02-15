import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import MaskedTextField from '../Form/MaskedTextField';
var moment = require('moment');

const initialFormValue = {
    cardName: '',
    expDate: '',
    cardNumber: ''
}

const customFormValidation = Yup.object().shape({
    cardName: Yup.string()
    .required('Required'),
    expDate: Yup.string()
    .required('Required')
    .test({
        message: 'Invalid Date',
        test:(expDate)=>{
            let exp = moment(expDate, 'MM/YYYY')
            if(exp.isValid() && !exp.isBefore(moment(), 'month')){
                return true
            }
            return false
        }
    }),
    cardNumber: Yup.string()
    .required('Required')
  });

const CardInfo = ({classes, formValue, submit, handleBack}) => {
    return (
        <React.Fragment>
            <Formik
            initialValues={formValue || initialFormValue}
            validationSchema={customFormValidation}
            onSubmit={values => submit(values)}
            >
            {({ values, errors, touched, handleChange }) => {
                return (<Form>
                    <Grid container spacing={24}>
                        <Grid item xs={12}>
                            <Typography variant="h6" color="textPrimary">
                                CREDIT CARD INFORMATION
                            </Typography>
                            <div
                                style={{
                                    borderTop: "solid 1.5px",
                                    borderColor: "#CCCCCC",
                                    marginBottom: 10
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                // required
                                id="cardName"
                                name="cardName"
                                label="Name on card"
                                fullWidth
                                onChange={handleChange}
                                value={values.cardName}
                            />
                            {errors.cardName && touched.cardName && <div className="error" >{errors.cardName}</div>}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                // required
                                id="expDate"
                                name="expDate"
                                label="Expiration date"
                                placeholder="MM/YY"
                                fullWidth
                                inputProps={{
                                    options:{
                                        date: true,
                                        datePattern: ['m', 'Y']
                                    }, 
                                    value: values.expDate, 
                                    onChange: handleChange 
                                }}
                                InputProps={{
                                    inputComponent: MaskedTextField
                                }}
                            />
                            {errors.expDate && touched.expDate && <div className="error" >{errors.expDate}</div>}
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                // required
                                id="cardNumber"
                                name="cardNumber"
                                label="Card number"
                                placeholder="XXXX XXXX XXXX XXXX"
                                fullWidth
                                inputProps={{
                                    options:{creditCard: true}, 
                                    value: values.cardNumber, 
                                    onChange: handleChange 
                                }}
                                InputProps={{
                                    inputComponent: MaskedTextField
                                }}
                            />
                            {errors.cardNumber && touched.cardNumber && <div className="error" >{errors.cardNumber}</div>}
                        </Grid>
                    </Grid>
                    <div className={classes.buttons}>
                        <Button onClick={()=>handleBack()} className={classes.button}>
                            Back
                        </Button>
                        <Button type="submit" variant="contained" color="primary" className={classes.button}>
                            Register
                        </Button>
                    </div>
                </Form>)
                }}
            </Formik>
        </React.Fragment>
    );
}

const styles = theme => ({
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit * 3,
        marginLeft: theme.spacing.unit
    },
});

CardInfo.propTypes = {
    classes: PropTypes.object.isRequired
};


export default  withStyles(styles)(CardInfo);
import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const initialFormValue = {
    attention: '',
    addresse: '',
    address1: '',
    address2: '',
    address3: '',
    city: '',
    zip: '',
    country: '',
    saveAsBilling: ''
}

const customFormValidation = Yup.object().shape({
    attention: Yup.string()
      .required('Required'),
      addresse: Yup.string()
      .required('Required'),
      address1: Yup.string()
      .required('Required'),
      address2: Yup.string()
      .required('Required'),
      address3: Yup.string()
      .required('Required'),
      city: Yup.string()
      .required('Required'),
      zip: Yup.string()
      .required('Required'),
      country: Yup.string()
      .required('Required'),
  });
const Shipping = ({classes, submit, handleBack}) => {
    return (
        <React.Fragment>
             <Formik
                initialValues={initialFormValue}
                validationSchema={customFormValidation}
                onSubmit={values => submit(values)}
                >
                {({ values, errors, touched, handleChange }) => {
                    return (<Form>
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="textPrimary">
                                    SHIPPING ADDRESS
                                </Typography>
                                <div
                                    style={{
                                        borderTop: "solid 1.5px",
                                        borderColor: "#CCCCCC",
                                        marginBottom: 10
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    // required
                                    id="attention"
                                    name="attention"
                                    label="Attention"
                                    fullWidth
                                    autoComplete="attention"
                                    onChange={handleChange}
                                    value={values.attention}
                                />
                                {errors.attention && touched.attention && <div className="error" >{errors.attention}</div>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    // required
                                    id="addresse"
                                    name="addresse"
                                    label="Addresse"
                                    fullWidth
                                    autoComplete="addresse"
                                    onChange={handleChange}
                                    value={values.addresse}
                                />
                                {errors.addresse && touched.addresse && <div className="error" >{errors.addresse}</div>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    // required
                                    id="address1"
                                    name="address1"
                                    label="Address line 1"
                                    fullWidth
                                    autoComplete="address-line1"
                                    onChange={handleChange}
                                    value={values.address1}
                                />
                                {errors.address1 && touched.address1 && <div className="error" >{errors.address1}</div>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="address2"
                                    name="address2"
                                    label="Address line 2"
                                    fullWidth
                                    autoComplete="address-line2"
                                    onChange={handleChange}
                                    value={values.addiress2}
                                />
                                {errors.address2 && touched.address2 && <div className="error" >{errors.address2}</div>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="address3"
                                    name="address3"
                                    label="Address line 3"
                                    fullWidth
                                    autoComplete="address-line3"
                                    onChange={handleChange}
                                    value={values.addiress3}
                                />
                                {errors.address3 && touched.address3 && <div className="error" >{errors.address3}</div>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    // required
                                    id="city"
                                    name="city"
                                    label="City"
                                    fullWidth
                                    autoComplete="address-level2"
                                    onChange={handleChange}
                                    value={values.city}
                                />
                                {errors.city && touched.city && <div className="error" >{errors.city}</div>}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    // required
                                    id="zip"
                                    name="zip"
                                    label="Zip / Postal code"
                                    fullWidth
                                    autoComplete="postal-code"
                                    onChange={handleChange}
                                    value={values.zip}
                                />
                                {errors.zip && touched.zip && <div className="error" >{errors.zip}</div>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    // required
                                    id="country"
                                    name="country"
                                    label="Country"
                                    fullWidth
                                    autoComplete="country"
                                    onChange={handleChange}
                                    value={values.country}
                                />
                                {errors.country && touched.country && <div className="error" >{errors.country}</div>}
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            name="saveAsBilling"
                                            value="yes"
                                            // onChange={handleChange}
                                            // value={values.companyName}
                                        />
                                    }
                                    label="Use this address as billing address"
                                />
                                {errors.saveAsBilling && touched.saveAsBilling && <div className="error" >{errors.saveAsBilling}</div>}
                            </Grid>
                        </Grid>
                        <div className={classes.buttons}>
                            <Button onClick={()=>handleBack()} className={classes.button}>
                                Back
                            </Button>
                            <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                Next
                            </Button>
                        </div>
                </Form>)
                }}
            </Formik>
        </React.Fragment>
    );
}

// export default Shipping;
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

Shipping.propTypes = {
    classes: PropTypes.object.isRequired
};


export default  withStyles(styles)(Shipping);

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
import MaskedTextField from "../Form/MaskedTextField";

const initialFormValue = {
    companyName: "",
    email: "",
    phone: "",
    pass: "",
    cPass: "",
    category: "",
    orderFrom: "",
    acContact: "",
    acPhone: ""
};

const customFormValidation = Yup.object().shape({
    companyName: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    phone: Yup.number().required("Required"),
    pass: Yup.string().required("Required"),
    cPass: Yup.string().required("Required"),
    category: Yup.string().required("Required"),
    orderFrom: Yup.string().required("Required"),
    acContact: Yup.string().required("Required"),
    acPhone: Yup.string().required("Required")
});

const FormikErrorMessage = ({className, touched, error}) => {
    if (!touched) {
        return null;
    }

    return (
        <div className="error">{error}</div>
    );
};

const General = (props) => {

    console.log('props', props);

    const {
        values,
        touched,
        errors,
        isSubmitting,
        handleChange,
        setFieldValue,
        handleBlur,
        handleSubmit,
        onCancel,
        submitForm
    } = props;
    
    return (
             <Grid container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="h6" color="textPrimary">
                        General Information
                    </Typography>
                    <div
                        style={{
                            borderTop: "solid 1.5px",
                            borderColor: "#CCCCCC",
                            marginBottom: 10
                        }}
                    />                    
                </Grid>
                <Grid item xs={12}>
                    <Field
                        render={({field: {value, onChange }}) => {
                            return (
                                <TextField
                                    name="companyname"
                                    label="Company name"
                                    fullWidth
                                    autoComplete="cname"
                                    onChange={onChange}
                                    value={value.companyname}
                                />
                            )
                        }}
                    />
                    <FormikErrorMessage error={errors.companyName} touched={touched.companyName} />
                </Grid>
                <button type="submit">Submit</button>
            </Grid>
    )


    // return (
    //     <React.Fragment>
    //         <Formik 
    //             initialValues={formValue || initialFormValue} 
    //             validationSchema={customFormValidation} 
    //             onSubmit={values => submit(values)}
    //         >
    //             {({ values, errors, touched, handleChange }) => {
    //                 return (
    //                     <Form>
    //                         <Grid container spacing={24}>
    //                             <Grid item xs={12}>
                                    // <Typography variant="h6" color="textPrimary">
                                    //     GENERAL INFORMATION
                                    // </Typography>
                                    // <div
                                    //     style={{
                                    //         borderTop: "solid 1.5px",
                                    //         borderColor: "#CCCCCC",
                                    //         marginBottom: 10
                                    //     }}
                                    // />
    //                             </Grid>
    //                             <Grid item xs={12}>
                                    // <TextField
                                    //     // required
                                    //     id="companyName"
                                    //     name="companyName"
                                    //     label="Company name"
                                    //     fullWidth
                                    //     autoComplete="cname"
                                    //     onChange={handleChange}
                                    //     value={values.companyName}
                                    // />
    //                                 {errors.companyName && touched.companyName && <div className="error">{errors.companyName}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="email"
    //                                     name="email"
    //                                     label="E-mail"
    //                                     fullWidth
    //                                     autoComplete="email"
    //                                     onChange={handleChange}
    //                                     value={values.email}
    //                                 />
    //                                 {errors.email && touched.email && <div className="error">{errors.email}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="phone"
    //                                     name="phone"
    //                                     label="Phone"
    //                                     fullWidth
    //                                     autoComplete="phone"
    //                                     inputProps={{
    //                                         options: {
    //                                             phone: true,
    //                                             phoneRegionCode: "US"
    //                                         },
    //                                         value: values.phone,
    //                                         onChange: handleChange
    //                                     }}
    //                                     InputProps={{
    //                                         inputComponent: MaskedTextField
    //                                     }}
    //                                 />
    //                                 {errors.phone && touched.phone && <div className="error">{errors.phone}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="pass"
    //                                     name="pass"
    //                                     label="Password"
    //                                     type="password"
    //                                     fullWidth
    //                                     autoComplete="pass"
    //                                     onChange={handleChange}
    //                                     value={values.pass}
    //                                 />
    //                                 {errors.pass && touched.pass && <div className="error">{errors.pass}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="cPass"
    //                                     name="cPass"
    //                                     label="Confirm Password"
    //                                     type="password"
    //                                     fullWidth
    //                                     autoComplete="cpass"
    //                                     onChange={handleChange}
    //                                     value={values.cPass}
    //                                 />
    //                                 {errors.cPass && touched.cPass && <div className="error">{errors.cPass}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="category"
    //                                     name="category"
    //                                     label="Category"
    //                                     select
    //                                     fullWidth
    //                                     autoComplete="category"
    //                                     onChange={handleChange}
    //                                     value={values.category}
    //                                 >
    //                                     <MenuItem value={1}>Retailer</MenuItem>
    //                                     <MenuItem value={2}>Individual</MenuItem>
    //                                     <MenuItem value={3}>Proffesional Brewery</MenuItem>
    //                                     <MenuItem value={4}>Proffesional Winery</MenuItem>
    //                                     <MenuItem value={5}>Proffesional Destillery</MenuItem>
    //                                 </TextField>
    //                                 {errors.category && touched.category && <div className="error">{errors.category}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="orderFrom"
    //                                     name="orderFrom"
    //                                     label="Order From"
    //                                     select
    //                                     fullWidth
    //                                     autoComplete="orderFrom"
    //                                     onChange={handleChange}
    //                                     value={values.orderFrom}
    //                                 >
    //                                     <MenuItem value={1}>US Only</MenuItem>
    //                                     <MenuItem value={2}>US & Copenhagen (For Europe, No Homebrew)</MenuItem>
    //                                     <MenuItem value={3}>US & Hong Kong (For Asia, No Homebrew)</MenuItem>
    //                                     <MenuItem value={4}>US, Copenhagen, and Hong Kong</MenuItem>
    //                                 </TextField>
    //                                 {errors.orderFrom && touched.orderFrom && <div className="error">{errors.orderFrom}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="acContact"
    //                                     name="acContact"
    //                                     label="Accounting Contact"
    //                                     fullWidth
    //                                     autoComplete="acContact"
    //                                     onChange={handleChange}
    //                                     value={values.acContact}
    //                                 />
    //                                 {errors.acContact && touched.acContact && <div className="error">{errors.acContact}</div>}
    //                             </Grid>
    //                             <Grid item xs={12} sm={6}>
    //                                 <TextField
    //                                     // required
    //                                     id="acPhone"
    //                                     name="acPhone"
    //                                     label="Accounting Phone Number"
    //                                     fullWidth
    //                                     autoComplete="acPhone"
    //                                     onChange={handleChange}
    //                                     value={values.acPhone}
    //                                 />
    //                                 {errors.acPhone && touched.acPhone && <div className="error">{errors.acPhone}</div>}
    //                             </Grid>
    //                         </Grid>
    //                         <div className={classes.buttons}>
    //                             <Button type="submit" variant="contained" color="primary" className={classes.button}>
    //                                 Next
    //                             </Button>
    //                         </div>
    //                     </Form>
    //                 );
    //             }}
    //         </Formik>
    //     </React.Fragment>
    // );
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

General.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(General);

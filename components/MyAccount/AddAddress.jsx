import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import SalesLib from "lib/SalesLib";
//import _get from 'lodash/get';

class AddAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
            focus: ""
        };
    }

  
    addAddress = (values) => {

        this.props.addAddress({ address: values });
        this.props.close();
    };

    render() {
        const { classes } = this.props;
      
        const { focus, ...rest } = this.state;
        const customFormValidation = Yup.object().shape({
            attn: Yup.string().required("Required"),
            address1: Yup.string().required("Required"),
            addressee: Yup.string().required("Required"),
            city: Yup.string().required("Required"),
            zip: Yup.number().required("Required"),
            countryid: Yup.string().required("Required")
        });
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
              

                        address1: '',
                        address2: '',
                        address3: '',
                        addressee: '',
                        attn: '',
                        city: '',
                        countryid: '',
                        zip: ''


                    }}
                    validationSchema={customFormValidation}
                    enableReinitialize
          
                    onSubmit={(values, actions) => {
                        
                        this.addAddress(values)
                    }}
                >
                    {({ errors, touched, isValidating, values, handleChange }) => {
                        return (
                            <Form>
                                <Grid container spacing={24}>
                                    <Field
                                        name="attn"
                                        component={props => {

                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="attention"
                                                        value={values.attn}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.attn!== '' }}
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "attn")
                                                                this.setState({
                                                                    focus: "attn"
                                                                });
                                                        }}
                                                        autoFocus={focus == "attn"}
                                                         
                                                        name="attn"
                                                        label="Attention"
                                                        fullWidth
                                                        autoComplete="attention"
                                                    />
                                                    {errors.attn && touched.attn && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.attn}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="addressee"
                                        component={props => {

                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="addressee"
                                                        name="addressee"
                                                        value={values.addressee}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.addressee!== '' }}
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "addressee")
                                                                this.setState({
                                                                    focus: "addressee"
                                                                });
                                                        }}
                                                        autoFocus={focus == "addressee"}

                                                        name='addressee'
                                                        label="addressee"
                                                        fullWidth
                                                        autoComplete="addressee"
                                                    />
                                                    {errors.addressee && touched.addressee && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.addressee}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="address1"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="address1"
                                                     
                                                        value={values.address1}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.address1!== '' }}
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "address1")
                                                                this.setState({
                                                                    focus: "address1"
                                                                });
                                                        }}
                                                        autoFocus={focus == "address1"}

                                                        name="address1"
                                                        label="Address line 1"
                                                        fullWidth
                                                        autoComplete="address-line1"
                                                    />
                                                    {errors.address1 && touched.address1 && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.address1}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="address2"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="addiress2"
                                                   
                                                        value={values.address2}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.address2!== '' }}
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "address2")
                                                                this.setState({
                                                                    focus: "address2"
                                                                });
                                                        }}
                                                        autoFocus={focus == "address2"}

                                                        name="address2"
                                                        label="Address line 2"
                                                        fullWidth
                                                        autoComplete="address-line2"
                                                    />
                                                    {errors.address2 && touched.address2 && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.address2}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="address3"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="addiress3"
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.address3!== '' }}
                                                        value={values.address3}
                                                     
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "address3")
                                                                this.setState({
                                                                    focus: "address3"
                                                                });
                                                        }}
                                                        autoFocus={focus == "address3"}

                                                        name="address3"
                                                        label="Address line 3"
                                                        fullWidth
                                                        autoComplete="address-line3"
                                                    />
                                                    {errors.address3 && touched.address3 && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.address3}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="city"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        id="city"
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.city!== '' }}
                                                        value={values.city}
                                                     
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "city")
                                                                this.setState({
                                                                    focus: "city"
                                                                });
                                                        }}
                                                        autoFocus={focus == "city"}

                                                        name="city"
                                                        label="City"
                                                        fullWidth
                                                        autoComplete="address-level2"
                                                    />
                                                    {errors.city && touched.city && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.city}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="zip"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                    
                                                        value={values.zip}
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.zip!== '' }}
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "zip")
                                                                this.setState({
                                                                    focus: "zip"
                                                                });
                                                        }}
                                                        autoFocus={focus == "zip"}

                                                        name="zip"
                                                        label="Zip / Postal code"
                                                        fullWidth
                                                        autoComplete="postal-code"
                                                    />
                                                    {errors.zip && touched.zip && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.zip}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="countryid"
                                        component={props => {
                                            return (
                                                <Grid item xs={12}>
                                                    {/* <FormControl
                                                        
                                                        fullWidth
                                                    
                                                    >   
                                                        <InputLabel >Country</InputLabel>
                                                        <Select
                                                               MenuProps={{ disablePortal: true }}
                                                               onChange={handleChange}
                                                               value={values.countryid}
                                                            //    variant="outlined"
                                                               InputLabelProps={{ shrink: values.country!== '' }}
                                                               inputProps={{
                                                                name: "countryid",
                                                                id:"country",
                                                            
                                                              }}
                                                              
                                                        autoComplete="country"
                                                               >
                                                              
                                                            {
                                                                SalesLib.COUNTRY_MAP && SalesLib.COUNTRY_MAP.map(country=>(
                                                                    <MenuItem key={country.id} value={country.id}>
                                                                    {country.name}
                                                                </MenuItem>
                                                                ))  
                                                            }
                                                        
                                                        </Select>
                                                    </FormControl> */}



                                                             <TextField
                                select
                                name="countryid"
                                fullWidth
                                value={values.countryid}
                                InputLabelProps={{ shrink: values.countryid !== "" }}
                                onChange={handleChange}
                                variant="outlined"
                                label="Country"
                                autoComplete="countryid"
                            >
                                {SalesLib.COUNTRY_MAP.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>{country.name}</MenuItem>
                                ))}
                            </TextField>



                                                    {errors.countryid && touched.countryid && (
                                                        <div
                                                            style={{
                                                                color: "red"
                                                            }}
                                                        >
                                                            {errors.countryid}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Grid style={{ marginTop: 10 }} container justify="flex-end">
                                        <Grid item>
                                            <Button style={{marginRight:'10px'}}variant="contained" color="primary" type="submit">
                                                Add Address
                                            </Button>
                                            <Button variant="contained" color="primary" onClick={()=>this.props.handleCancelAdd(false)} >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
        
                                </Grid>
                            
                            </Form>
                        );
                    }}
                </Formik>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    addressBox: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        padding: theme.spacing.unit * 2
    }
});

AddAddress.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddAddress);

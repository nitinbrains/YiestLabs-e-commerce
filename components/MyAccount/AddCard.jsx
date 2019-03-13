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

import { userActions } from "appRedux/actions/userActions";

class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
            focus: ""
        };
    }

    addCard = (values) => {
        this.props.addCreditCard({ creditCard: values });
        this.props.closeNewCard();
    };

    render() {
        const { classes } = this.props;
        const { focus, ...rest } = this.state;
        const customFormValidation = Yup.object().shape({
            ccname: Yup.string().required("Required"),
            ccnumber: Yup.number().required("Required"),
            ccexpire: Yup.number().required("Required")
        });
        return (
            <React.Fragment>
                <Formik
                    initialValues={{

                        ccnumber: '',
                        ccname: '',
                        ccexpire: ''
                    }}
                    validationSchema={customFormValidation}
                    enableReinitialize
                    validate={values => {
                        // console.log(values,'asas',Utils)
                        // let error ={};
                        // // check getcard type
                        // let cardNumberValidate = Utils.getCardType(values.ccnumber);
                        // console.log(cardNumberValidate,'card type')
                    }}
                    onSubmit={(values, actions) => {
                         
                        this.addCard(values);
                     }}
                >
                    {({ errors, touched, isValidating,handleChange,values }) => {
                        return (
                            <Form>
                                <Grid container spacing={24}>
                                    <Field
                                        name="ccname"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        id="cardName"
                                                        value={values.ccname}
                                                        name='ccname'
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.ccname!== '' }}
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "ccname")  this.setState({ focus: "ccname" });
                                                        }}
                                                        autoFocus={focus == "ccname"}
                                                        label="Name on card"
                                                        fullWidth
                                                    />
                                                    {errors.ccname && touched.ccname && (
                                                        <div style={{ color: "red" }}>
                                                            {errors.ccname}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="ccnumber"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                      
                                                        id="cardNumber"
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.ccnumber!== '' }}
                                                        value={values.ccnumber}
                                                      
                                                        onChange={handleChange}
                                                        name='ccnumber'
                                                        onFocus={e => {
                                                            if (focus !== "ccnumber") this.setState({ focus: "ccnumber" });
                                                        }}
                                                        autoFocus={focus == "ccnumber"}
                                                        label="Card number"
                                                        fullWidth
                                                    />
                                                    {errors.ccnumber && touched.ccnumber && (
                                                        <div style={{ color: "red" }}>
                                                            {errors.ccnumber}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        name="ccexpire"
                                        component={props => {
                                            return (
                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                    
                                                        id="expDate"
                                                        name='ccexpire'
                                                        variant="outlined"
                                                        InputLabelProps={{ shrink: values.ccexpire!== '' }}
                                                        value={values.ccexpire}
                                                      
                                                        onChange={handleChange}
                                                        onFocus={e => {
                                                            if (focus !== "ccexpire") this.setState({ focus: "ccexpire" });
                                                        }}
                                                        autoFocus={focus == "ccexpire"}
                                                        label="Expiry date"
                                                        fullWidth
                                                    />
                                                    {errors.ccexpire && touched.ccexpire && (
                                                        <div style={{ color: "red" }}>
                                                            {errors.ccexpire}
                                                        </div>
                                                    )}
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Grid style={{ marginTop: 10 }} container justify="flex-end">
                                        <Grid item>
                                            <Button variant="contained" color="primary" type="submit">
                                                Add Card
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

AddCard.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = dispatch => bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(AddCard));

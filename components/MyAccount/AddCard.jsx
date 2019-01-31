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

import { userActions } from '../../redux/actions/userActions';


class AddCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creditCard: {
                ccnumber: "",
                ccname: "",
                ccexpire: "",
                cccvc: "",
                type: "",
                default: false
            },
            focus: ""
        };
    }

    addCard = () => {
        const { creditCard } = this.state;
        this.props.addCreditCard({ creditCard });
        this.props.closeNewCard();
    };

    render() {
        const { classes } = this.props;
        const { creditCard, focus } = this.state;
        const customFormValidation = Yup.object().shape({
            ccname: Yup.string().required("Required"),
            ccnumber: Yup.number().required("Required"),
            cccvc: Yup.number().required("Required")
            // ccexpire: Yup.number()
            // .required('Required'),
        });
        return (
            <React.Fragment>
            <Formik
                initialValues={{
                    ccnumber: creditCard.ccnumber,
                    ccname: creditCard.ccname,
                    ccexpire: creditCard.ccexpire,
                    cccvc:creditCard.cccvc,
                }}
                validationSchema={customFormValidation}
                enableReinitialize
                validate={ values => {
                    // console.log(values,'asas',Utils)
                    // let error ={};
                    // // check getcard type
                    // let cardNumberValidate = Utils.getCardType(values.ccnumber);
                    // console.log(cardNumberValidate,'card type')
                } }
                onSubmit={ values => { 
                    this.addCard()
                }}            
            >
            {({ errors, touched, isValidating }) => {
            return(
                <Form>
                <Grid container spacing={24}>
                    <Field 
                        name="ccname" 
                        component={(props)=>{
                        return(
                        <Grid item xs={12} md={6}>
                            <TextField
                                // required
                                id="cardName"
                                value={props.field.value}
                                onChange={(e)=>{ props.form.setFieldValue('ccname',e.target.value); this.setState({ creditCard: { ...this.state.creditCard, ccname: e.target.value } }) }}
                                onFocus={e => {
                                    if (focus !== 'ccname')
                                    this.setState({
                                        focus : 'ccname'
                                    })
                                }}
                                autoFocus={ focus == 'ccname' }
                                label="Name on card"
                                fullWidth
                            />
                        {errors.ccname && touched.ccname && <div style={{color:'red'}} >{errors.ccname}</div>}
                        </Grid>
                        )
                        }}
                    />
                    <Field 
                        name="ccnumber" 
                        component={(props)=>{
                        return(
                        <Grid item xs={12} md={6}>
                            <TextField
                                // required
                                id="cardNumber"
                                value={props.field.value}
                                onChange={(e)=>{ props.form.setFieldValue('ccnumber',e.target.value); this.setState({ creditCard: { ...this.state.creditCard, ccnumber: e.target.value } }) }}
                                onFocus={e => {
                                    if (focus !== 'ccnumber')
                                    this.setState({
                                        focus : 'ccnumber'
                                    })
                                }}
                                autoFocus={ focus == 'ccnumber' }
                                label="Card number"
                                fullWidth
                            />
                        {errors.ccnumber && touched.ccnumber && <div style={{color:'red'}} >{errors.ccnumber}</div>}
                        </Grid>
                        )
                        }}
                    />
                    <Field 
                        name="ccexpire" 
                        component={(props)=>{
                        return(
                        <Grid item xs={12} md={6}>
                            <TextField
                                // required
                                id="expDate"
                                value={props.field.value}
                                onChange={(e)=>{ props.form.setFieldValue('ccexpire',e.target.value); this.setState({ creditCard: { ...this.state.creditCard, ccexpire: e.target.value } }) }}
                                onFocus={e => {
                                    if (focus !== 'ccexpire')
                                    this.setState({
                                        focus : 'ccexpire'
                                    })
                                }}
                                autoFocus={ focus == 'ccexpire' }
                                label="Expiry date"
                                fullWidth
                            />
                        {errors.ccexpire && touched.ccexpire && <div style={{color:'red'}} >{errors.ccexpire}</div>}
                        </Grid>
                        )
                        }}
                    />
                    <Field 
                        name="cccvc" 
                        component={(props)=>{
                        return(
                        <Grid item xs={12} md={6}>
                            <TextField
                                // required
                                id="cvv"
                                label="CVV"
                                value={props.field.value}
                                onChange={(e)=>{ props.form.setFieldValue('cccvc',e.target.value); this.setState({ creditCard: { ...this.state.creditCard, cccvc: e.target.value } }) }}
                                onFocus={e => {
                                    if (focus !== 'cccvc')
                                    this.setState({
                                        focus : 'cccvc'
                                    })
                                }}
                                autoFocus={ focus == 'cccvc' }
                                helperText="Last three digits on signature strip"
                                fullWidth
                            />
                        {errors.cccvc && touched.cccvc && <div style={{color:'red'}} >{errors.cccvc}</div>}
                        </Grid>
                        )
                        }}
                    />
                      <Grid
                            style={{ marginTop: 10 }}
                            container
                            justify="flex-end"
                        >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Add Card
                                </Button>
                            </Grid>
                        </Grid>
                </Grid>
                </Form>
            )}}
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

const mapDispatchToProps = dispatch =>
    bindActionCreators(userActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(AddCard));


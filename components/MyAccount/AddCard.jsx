import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Cleave from "cleave.js/react";

import { Formik, Form, Field } from "formik";
import _get from "lodash/get";
import _set from "lodash/set";
import _isEmpty from 'lodash/isEmpty';
import moment from "moment";

import { userActions } from "appRedux/actions/userActions";

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
class AddCard extends Component {
    constructor(props) {
        super(props);
    }

    addCard = (values, { setErrors }) => {
        let errors = this.validate(values);
        if (_isEmpty(errors)) {
            this.props.addCreditCard({ creditCard: values });
            this.props.closeNewCard();
        } else {
            setErrors(errors);
        }
    };

    validate = values => {
        let errors = {};

        if (!_get(values, "ccnumber")) {
            _set(errors, "ccnumber", "Credit card number is required");
        }

        if (!_get(values, "ccname")) {
            _set(errors, "ccname", "Name is required");
        }

        if (!_get(values, "ccexpire")) {
            _set(errors, "ccexpire", "Expiration date is required");
        } else {
            let exp = moment(values.ccexpire, "MM/YYYY");
            if (!exp.isValid() || exp.isBefore(moment())) {
                _set(errors, "ccexpire", "Expiration date is invalid");
            }
        }

        return errors;
    };

    render() {
        const {classes}=this.props;
        return (
            <React.Fragment>
                <Formik onSubmit={(values, actions) => this.addCard(values, actions)} enableReinitialize>
                    {({ errors }) => {
                        return (
                            <Form>
                                <Grid container spacing={24}>
                                    <Field
                                        render={({ field: { value, onChange } }) => {
                                            return (
                                                <Grid item xs={12}>
                                                    <FormikErrorMessage error={_get(errors, "ccnumber")} />
                                                    <TextField
                                                        name="ccnumber"
                                                        label="Credit Card Number"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="ccnumber"
                                                        InputProps={{ inputComponent: CreditCardMaskedTextField,
                                                            classes: { root: classes.inputRoot } }}
                                                        onChange={onChange}
                                                        value={_get(value, "ccnumber") || ''}
                                                        InputLabelProps={{
                                                            FormLabelClasses: {
                                                              root: classes.labelRoot
                                                            }
                                                          }}
                                                    />
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange } }) => {
                                            return (
                                                <Grid item xs={12} sm={6}>
                                                    <FormikErrorMessage error={_get(errors, "ccname")} />
                                                    <TextField
                                                        name="ccname"
                                                        label="Name on card"
                                                        variant="outlined"
                                                        fullWidth
                                                        autoComplete="ccname"
                                                        onChange={onChange}
                                                        value={_get(value, "ccname") || ''}   
                                                        InputProps={{ classes: { root: classes.inputRoot } }}
                                                        InputLabelProps={{
                                                          FormLabelClasses: {
                                                            root: classes.labelRoot
                                                          }
                                                        }}
                                                    />
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Field
                                        render={({ field: { value, onChange } }) => {
                                            return (
                                                <Grid item xs={12}>
                                                    <FormikErrorMessage error={_get(errors, "ccexpire")} />
                                                    <TextField
                                                        name="ccexpire"
                                                        label="Expiration date"
                                                        variant="outlined"
                                                        placeholder="MM/YY"
                                                        fullWidth
                                                        InputProps={{ inputComponent: DateMaskedTextField,
                                                            classes: { root: classes.inputRoot } }}
                                                        onChange={onChange}
                                                        value={_get(value, "ccexpire") || ''}
                                                        InputLabelProps={{
                                                            FormLabelClasses: {
                                                              root: classes.labelRoot
                                                            }
                                                          }}
                                                    />
                                                </Grid>
                                            );
                                        }}
                                    />
                                    <Grid style={{ marginTop: 10 }} container className={classes.justifyBtn}>
                                        <Grid item>
                                            <Button className={classes.smallBtn} variant="contained" color="primary" type="submit">
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
    },
    justifyBtn:{
        display:'flex',
        justifyContent:'flex-end',
        [theme.breakpoints.down('xs')]: {
            display:'flex',
            justifyContent:'center',
          }
    },
    smallBtn:{
        fontSize:'0.875rem',
        padding:'4px',
        [theme.breakpoints.down('xs')]: {
            fontSize:'10px',
          }
    },
    inputRoot: {
        fontSize: '1rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: 13
          }
      },
      labelRoot: {
        fontSize: '1rem',
        [theme.breakpoints.down('sm')]: {
            fontSize: 13
          }
      }
});

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

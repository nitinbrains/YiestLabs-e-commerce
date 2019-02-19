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
import _get from "lodash/get";
import MaskedTextField from "../Form/MaskedTextField";
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

const FormikErrorMessage = ({ className, touched, error }) => {
    // if (!touched) {
    //     return null;
    // }

    return <div className="error">{error}</div>;
};

const CardInfo = props => {
    const { touched, errors, classes, onNext, onBack } = props;

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
            <Grid item xs={12}>
                <Field
                    render={({ field: { value, onChange }, form: { touched } }) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, "ccnumber")} touched={_get(touched, "ccnumber")} />
                                <TextField
                                    id="ccnumber"
                                    name="ccnumber"
                                    label="Credit Card number"
                                    fullWidth
                                    autoComplete="ccnumber"
                                    onChange={onChange}
                                    value={_get(value, 'ccnumber')}
                                    InputProps={{
                                        inputComponent: CreditCardMaskedTextField
                                    }}
                                />
                            </React.Fragment>
                        );
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({ field: { value, onChange }, form: { touched } }) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, "ccname")} touched={_get(touched, "ccname")} />
                                <TextField id="ccname" name="ccname" label="Name on card" fullWidth autoComplete="ccname" onChange={onChange} value={_get(value, "ccname")} />
                            </React.Fragment>
                        );
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Field
                    render={({ field: { value, onChange }, form: { touched } }) => {
                        return (
                            <React.Fragment>
                                <FormikErrorMessage error={_get(errors, "ccexpire")} touched={_get(touched, "ccexpire")} />
                                <TextField
                                    id="ccexpire"
                                    name="ccexpire"
                                    label="Expiration date"
                                    placeholder="MM/YY"
                                    fullWidth
                                    InputProps={{
                                        inputComponent: DateMaskedTextField
                                    }}
                                />
                            </React.Fragment>
                        );
                    }}
                />
            </Grid>
            <Button variant="contained" className={classes.button} onClick={onBack}>
                Back
            </Button>
            <Button type="submit" variant="contained" color="primary" className={classes.button}>
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

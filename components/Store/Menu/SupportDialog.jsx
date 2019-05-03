import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import Router from 'next/router';

import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import LoadingIndicator from 'components/UI/LoadingIndicator';
import { cartActions } from "appRedux/actions/cartActions";

const customFormValidation = Yup.object().shape({
    quantity: Yup.string()
      .required('Required'),
  });

class SupportDialog extends Component {
    constructor(props) {
        super(props);
    }
    handleErrors = (field, err) => {
        let {errors} = this.state;
        errors[field] = err
        this.setState({errors})
    }

    handleDialogClose() {
        this.props.closeDialog();
    }

    render() {

        return (
            <React.Fragment>
                <DialogContent>
                    <div style={{ width: "100%", textAlign: "right" }}>
                        <IconButton
                            color="inherit"
                            size="small"
                            aria-label="Menu"
                            onClick={() => this.handleDialogClose()}
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Grid
                        item
                        container
                        xs
                        style={{
                            display: "flex",
                            marginTop: -10,
                            marginBottom: 30
                        }}
                        direction={"row"}
                        spacing={4}
                    >
                        <Grid item>
                            <Typography variant="h5" onClick={() => this.handleClick(partNum)}>
                                SUPPORT INFORMATION
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction={"column"}
                        spacing={8}
                        style={{ marginTop: 5 }}
                    >
                        <Grid item>
                            <Typography>
                                <span style={{ fontWeight: "bold" }}>White Labs USA & White Labs Hong Kong</span>
                                <br />
                                Domestic and international orders from San Diego, CA, Asheville, NC, and Hong Kong
                                <br />
                                888.593.2785 (domestic USA and Canada)
                                <br />
                                1.858.693.3441 (international)
                                <br />
                                <a href="mailto:info@whitelabs.com">info@whitelabs.com</a>
                                <hr />
                                <span style={{ fontWeight: "bold" }}>White Labs Copenhagen</span>
                                <br />
                                If you need help with your order or are seeking a faster ship date, please contact <a href="mailto:orderscph@whitelabs.com">orderscph@whitelabs.com</a> or use the alternative sizes/strains feature in checkout for faster delivery options.
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    card: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        height: "100%",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    cardHover: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    info: {
        alignItems: "center",
        padding: 5,
        backgroundColor: "#e4e4e4",
        textAlign: "center"
    },
    quantity: {
        width: 50
    },
    hide: {
        display: "none"
    },
    hoverBold:{
        '&:hover': {
            fontWeight:'bolder',
            color:'#ff9933',
            cursor:'pointer'
         }  
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end"
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit * -5
    },
    close: { position: "absolute", right: 0, top: 0 },
    form:{
        width:'100%',
    }
});

SupportDialog.propTypes = {
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        user: state.user,
        inventory: state.inventory
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(cartActions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles, { withTheme: true })(SupportDialog));

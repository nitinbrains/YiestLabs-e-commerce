import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import { Formik, Form, Field } from 'formik';

class Error extends Component {

    render() {
        const { classes } = this.props;

        return (
            <React.Fragment>
                <main className={classes.layout}>
                    <div className={classes.container}>
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                marginLeft: "auto",
                                marginRight: "auto",
                                width: 130,
                                top: -60
                            }}
                        >
                            <img
                                src="static/images/logo_circle.png"
                                height="130"
                            />
                        </div>

                        <Typography variant="h2" align="center" style={{marginBottom:20}}>
                            Oops!
                        </Typography>

                        <Typography variant="h4" align="center" style={{marginBottom:20}}>
                            Page Not Found
                        </Typography>

                        <Typography variant="subtitle1" align="center">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailabe.
                        </Typography>

                    </div>
                </main>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    layout: {
        position: "relative",
        width: "auto",
        display: "block",
        marginTop: theme.spacing.unit * 15,
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 600,
            marginLeft: "auto",
            marginRight: "auto"
        },
        justifyContent: "center",
        backgroundColor:"#fafafa"
    },
    container: {
        border: "solid 1px",
        borderColor: "#CCCCCC",
        paddingTop: 80,
        padding: theme.spacing.unit * 4
    },
    logo: {
        alignContent: "center",
        padding: "10"
    },
    form: {
        width: "100%", // Fix IE11 issue.
        marginTop: theme.spacing.unit
    },
    submit: {
        marginTop: theme.spacing.unit * 3
    },
    button: {
        margin: theme.spacing.unit
    }
});

Error.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Error);

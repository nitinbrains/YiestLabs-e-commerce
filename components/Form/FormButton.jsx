import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class FormButton extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" className="form-button">
        {this.props.text}
      </Button>
        );
    }
}

const styles = theme => ({
    hide: {
        display: "none"
    },
    progress: {
        margin: theme.spacing.unit * 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
});

FormButton.propTypes = {
    text: PropTypes.string.isRequired
};

export default withStyles(styles)(FormButton);

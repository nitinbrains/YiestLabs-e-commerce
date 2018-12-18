import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from '@material-ui/core/Button';

class FormButton extends React.Component {
    render() {
        return (
            <Button variant="contained" className={`form-button ${this.props.className || ''}`} onClick={this.props.onClick}>
                {this.props.text}
            </Button>
        );
    }
}

const styles = theme => ({
});

FormButton.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(FormButton);

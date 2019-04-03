import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

class FormSelectbox extends React.Component {
    render() {
        const { options = [], ...rest } = this.props;
        return (
            <TextField 
                select 
                margin="normal" 
                className="form-selectbox" 
                variant="outlined"
                {...rest}
            >
                {options.map(option => {
                    if (typeof(option) == "object") {
                        return (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        )
                        
                    } else {
                        return (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        )
                    }
                })}
            </TextField>
        );
    }
}

const styles = theme => ({});

FormSelectbox.propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired, // array of oject having label & value property.
    onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(FormSelectbox);

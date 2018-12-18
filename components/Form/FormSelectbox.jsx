import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

class FormSelectbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options || []
    }
  }
  
  render() {
    let options = this.props.options || []
    return (
      <TextField
        id="standard-select-currency"
        select
        label=""
        value={this.props.value}
        onChange={this.props.onChange}
        margin="normal"
        className="form-selectbox"
        variant="outlined"
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
}

const styles = theme => ({
});

FormSelectbox.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired, // array of oject having label & value property.
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(FormSelectbox);

import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';

class FormMultipleSelectbox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options || [],
      name: []
    }
  }
  
  render() {
    let options = this.props.options || []

    console.log('^^^^^^^^^')
    console.log( this.props )
    return (
      <Select
            multiple
            value={this.state.name}
            onChange={() => {}}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
            // MenuProps={MenuProps}
          >
            {this.props.options.map(name => (
              <MenuItem key={name} value={name}>
                <Checkbox />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
    );
  }
}

const styles = theme => ({
});

FormMultipleSelectbox.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withStyles(styles)(FormMultipleSelectbox);

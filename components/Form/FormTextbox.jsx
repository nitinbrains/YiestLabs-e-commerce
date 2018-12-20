import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from '@material-ui/core/TextField';

class FormTextbox extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.label,
      value: this.props.label
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if( nextProps.value){
      return {
        value: nextProps.value,
        // label: nextProps.label
      }
    } else {
      return null
    }
  }
  
  render() {
    const { classes } = this.props;
    return (
      <TextField
        id="standard-bare"
        className={`form-textbox ${this.props.className || ''}`}
        value={this.state.value}
        margin="normal"
        variant="outlined"
        onClick={(e) => {
          if( this.state.value == this.state.label ){
            this.setState({
              value: ''
            })
          }
          this.props.onClick(e)
        }}
        onBlur={() => {
          if( this.state.value == "" ){
            this.setState({
              value: this.state.label
            })
          }
        }}
        onChange={ (e) => {
          this.props.onChange(e)   
        }}
      />
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

FormTextbox.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FormTextbox);

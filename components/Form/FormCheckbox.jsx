import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from '@material-ui/core/Checkbox';


class FormCheckbox extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <Checkbox
          checked={this.props.checked || false}
          onChange={this.props.onChange}
          // value="checkedA"
          color="primary"
          className={this.props.class}
        />
    );
  }
}

const styles = theme => ({
    // hide: {
    //     display: "none"
    // },
    // progress: {
    //     margin: theme.spacing.unit * 2,
    //     display: "flex",
    //     flexDirection: "column",
    //     alignItems: "center"
    // }
});

FormCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default withStyles(styles)(FormCheckbox);

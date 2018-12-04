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
import MenuItem from '@material-ui/core/MenuItem';

class Selectbox extends React.Component {

    render() {


        const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

        const { classes } = this.props;

        return (
           <TextField

          id="standard-select-currency"
          select
          label=""
          // className="form-selectbox"
          // className={classes.textField}
          // value={this.state.currency}
          // onChange={this.handleChange('currency')}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          // helperText="Please select your currency"
          margin="normal"
          className="form-selectbox"
          variant="outlined"
          style={{
            
          }}
        >
          {currencies.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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

Selectbox.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Selectbox);

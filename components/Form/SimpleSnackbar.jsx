import React from 'react';
import PropTypes from 'prop-types';
import {isEqual} from "lodash";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { SnackbarProvider, withSnackbar } from 'notistack';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class App extends React.Component {
  state = {
    showError:false
}
componentWillReceiveProps(props){
    if(!isEqual(props.messages, this.props.messages)){
        this.setState({showError:true})
    } else {
        this.setState({showError:false})
    }
}
  handleNotification = () => {
    const { messages } = this.props;
    if(messages.networkRequestError.length > 0) {
      return messages.networkRequestError.map((data)=>{
        this.props.enqueueSnackbar( data.message, {
          variant: data.variant, 
          anchorOrigin: data.anchorOrigin ? data.anchorOrigin :{vertical: 'top',horizontal: 'center'}
        });
      })
    }
  }

  render() {
    return(
      <div>
        {this.state.showError && this.handleNotification()}
      </div>
    );
  }
}

App.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

const Notification = withSnackbar(App);


class SimpleSnackbar extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = (event) => {
    this.props.handleClose()
  };

  

  render() {
    const { classes } = this.props;

    return (
      <div>
        <SnackbarProvider 
          maxSnack={5}
          onClose={this.handleClose}
          autoHideDuration={5000}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={(e)=>{this.handleClose()}}
            >
              <CloseIcon />
            </IconButton>
          ]}
        >
          <Notification messages={this.props.messageList} />
        </SnackbarProvider>
      </div>
    );
  }
}

SimpleSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSnackbar);